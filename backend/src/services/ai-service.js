/**
 * AI Service - Enhanced Gemini 2.5 Nano Integration
 *
 * Provides intelligent image processing with error handling, retry logic,
 * usage tracking, and monitoring capabilities.
 */

const fetch = require('node-fetch');
const { config } = require('../config/app-config');

class AIService {
  constructor() {
    this.provider = config.ai.provider;
    this.model = config.ai.model;
    this.apiKey = config.security.apiKeys.gemini;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';

    // Usage tracking
    this.stats = {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    };
  }

  /**
   * Process image with AI - Main entry point
   */
  async processImage(imageData, options = {}) {
    const startTime = Date.now();
    this.stats.requestCount++;

    try {
      // Validate inputs
      this.validateInput(imageData);

      // Prepare AI request
      const payload = this.buildPayload(imageData, options);

      // Execute with retry logic
      const result = await this.executeWithRetry(payload);

      // Process and validate response
      const processedResult = this.processResponse(result, startTime);

      // Update success stats
      this.updateStats(startTime, true);

      return processedResult;

    } catch (error) {
      this.updateStats(startTime, false);
      throw this.enhanceError(error);
    }
  }

  /**
   * Validate input data
   */
  validateInput(imageData) {
    if (!imageData) {
      throw new Error('Image data is required');
    }

    if (typeof imageData !== 'string') {
      throw new Error('Image data must be a base64 string');
    }

    // Check file size (rough estimate: base64 is ~33% larger than binary)
    const estimatedSize = (imageData.length * 3) / 4;
    if (estimatedSize > config.ai.imageSettings.maxFileSize) {
      throw new Error(`Image size exceeds maximum allowed size of ${config.ai.imageSettings.maxFileSize} bytes`);
    }
  }

  /**
   * Build AI API payload
   */
  buildPayload(imageData, options) {
    // Determine MIME type
    let mimeType = 'image/jpeg'; // default
    if (imageData.startsWith('data:')) {
      const mimeMatch = imageData.match(/data:([^;]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];

        // Validate format
        if (!config.ai.imageSettings.allowedFormats.includes(mimeType)) {
          throw new Error(`Unsupported image format: ${mimeType}`);
        }
      }
    }

    // Extract base64 data
    const base64Data = imageData.replace(/^data:[^;]+;base64,/, '');

    // Get prompt (allow override)
    const prompt = options.prompt || config.ai.prompt;

    return {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: options.temperature || config.ai.parameters.temperature,
        maxOutputTokens: options.maxTokens || config.ai.parameters.maxTokens,
        topP: options.topP || config.ai.parameters.topP
      }
    };
  }

  /**
   * Execute API request with retry logic
   */
  async executeWithRetry(payload, attempt = 1) {
    try {
      const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await this.makeRequest(url, payload);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      return await response.json();

    } catch (error) {
      console.warn(`AI service attempt ${attempt} failed:`, error.message);

      // Check if we should retry
      if (attempt < config.ai.parameters.retryAttempts && this.shouldRetry(error)) {
        const delay = config.ai.parameters.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);

        await this.sleep(delay);
        return this.executeWithRetry(payload, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Make HTTP request with timeout
   */
  async makeRequest(url, payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.ai.parameters.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `${config.app.name}/${config.app.version}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${config.ai.parameters.timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Determine if error is retryable
   */
  shouldRetry(error) {
    // Retry on network errors, timeouts, and certain HTTP status codes
    return error.message.includes('timeout') ||
           error.message.includes('ENOTFOUND') ||
           error.message.includes('ECONNREFUSED') ||
           error.message.includes('500') ||
           error.message.includes('502') ||
           error.message.includes('503') ||
           error.message.includes('504');
  }

  /**
   * Process AI response
   */
  processResponse(result, startTime) {
    // Validate response structure
    if (!result.candidates || !result.candidates[0] ||
        !result.candidates[0].content ||
        !result.candidates[0].content.parts ||
        !result.candidates[0].content.parts[0]) {
      throw new Error('Invalid response structure from AI service');
    }

    const description = result.candidates[0].content.parts[0].text;

    if (!description || description.trim().length === 0) {
      throw new Error('AI service returned empty response');
    }

    const processingTime = Date.now() - startTime;

    return {
      description: description.trim(),
      metadata: {
        provider: this.provider,
        model: this.model,
        processingTime,
        timestamp: new Date().toISOString()
      },
      usage: {
        inputTokens: this.estimateTokens(description),
        outputTokens: this.estimateTokens(description),
        cost: this.calculateCost(description)
      }
    };
  }

  /**
   * Enhance error with context
   */
  enhanceError(error) {
    const enhancedError = new Error(error.message);
    enhancedError.provider = this.provider;
    enhancedError.model = this.model;
    enhancedError.timestamp = new Date().toISOString();
    enhancedError.originalError = error;

    // Add user-friendly messages
    if (error.message.includes('timeout')) {
      enhancedError.userMessage = 'The AI service is taking too long to respond. Please try again.';
    } else if (error.message.includes('429')) {
      enhancedError.userMessage = 'Too many requests. Please wait a moment and try again.';
    } else if (error.message.includes('quota')) {
      enhancedError.userMessage = 'AI service quota exceeded. Please try again later.';
    } else {
      enhancedError.userMessage = 'Unable to process image at the moment. Please try again.';
    }

    return enhancedError;
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(text) {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate processing cost
   */
  calculateCost(description) {
    const tokens = this.estimateTokens(description);
    return tokens * 0.000015; // Rough cost per token for Gemini
  }

  /**
   * Update service statistics
   */
  updateStats(startTime, success) {
    const responseTime = Date.now() - startTime;

    if (success) {
      this.stats.successCount++;
    } else {
      this.stats.errorCount++;
    }

    this.stats.totalResponseTime += responseTime;
    this.stats.averageResponseTime = this.stats.totalResponseTime / this.stats.requestCount;
  }

  /**
   * Get service health and statistics
   */
  getHealthStats() {
    return {
      provider: this.provider,
      model: this.model,
      stats: { ...this.stats },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AIService();