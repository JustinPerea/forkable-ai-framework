const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================================
// COLORINGBOOK AI CONFIGURATION - SPECIALIZED FOR COLORING BOOK CREATION
// =============================================================================
const geminiPrompt = "Convert this image into a black and white coloring book style sketch with clear outlines and no shading. Make it suitable for coloring with crayons or markers. Ensure the lines are bold and clear, and remove any background details that would be difficult to color. Create a clean, simple outline that would be perfect for a coloring book page.";
// =============================================================================

// Middleware setup
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json({ limit: '10mb' })); // Handle large Base64 image data

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ColoringBook AI is running!',
    app: 'ColoringBook AI Creator',
    version: '1.0.0'
  });
});

// Main API endpoint for image processing
app.post('/api/process-image', async (req, res) => {
  try {
    const { imageData } = req.body;

    // Validate input
    if (!imageData) {
      return res.status(400).json({
        error: 'Missing imageData in request body'
      });
    }

    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return res.status(500).json({
        error: 'Server configuration error: API key not found'
      });
    }

    // Determine image MIME type from Base64 data
    let mimeType = 'image/jpeg'; // default
    if (imageData.startsWith('data:')) {
      const mimeMatch = imageData.match(/data:([^;]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
    }

    // Extract pure Base64 data (remove data URI prefix if present)
    const base64Data = imageData.replace(/^data:[^;]+;base64,/, '');

    // Construct Gemini API payload
    const geminiPayload = {
      contents: [{
        parts: [
          { text: geminiPrompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }]
    };

    console.log('ColoringBook AI: Sending request to Gemini API...');

    // Make request to Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiPayload)
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return res.status(500).json({
        error: 'Failed to process image with ColoringBook AI service',
        details: errorText
      });
    }

    const geminiResult = await geminiResponse.json();

    // Extract the text description from Gemini response
    if (!geminiResult.candidates || !geminiResult.candidates[0] ||
        !geminiResult.candidates[0].content ||
        !geminiResult.candidates[0].content.parts ||
        !geminiResult.candidates[0].content.parts[0]) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(geminiResult, null, 2));
      return res.status(500).json({
        error: 'Unexpected response format from ColoringBook AI service'
      });
    }

    const description = geminiResult.candidates[0].content.parts[0].text;

    if (!description) {
      console.error('No description in Gemini response');
      return res.status(500).json({
        error: 'ColoringBook AI service did not return description'
      });
    }

    console.log('ColoringBook AI: Successfully processed image');

    // Return the coloring book description
    res.json({
      description: description,
      originalImageData: base64Data,
      mimeType: mimeType,
      app: 'ColoringBook AI Creator',
      prompt: 'coloring-book-sketch'
    });

  } catch (error) {
    console.error('ColoringBook AI error:', error);
    res.status(500).json({
      error: 'Internal server error while creating coloring book sketch',
      details: error.message
    });
  }
});

// Configuration endpoint for frontend
app.get('/api/config', (req, res) => {
  res.json({
    branding: {
      name: "ColoringBook AI Creator",
      tagline: "Transform any photo into a coloring book sketch",
      description: "Upload your photo and get a beautiful black and white sketch perfect for coloring with crayons or markers",
      colors: {
        primary: "#4F46E5", // Indigo
        secondary: "#10B981", // Emerald
        accent: "#F59E0B", // Amber
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        text: "#111827",
        textLight: "#6B7280"
      }
    },
    features: {
      authentication: false,
      payments: false,
      admin: false,
      social: false
    },
    ui: {
      theme: "coloringbook",
      animations: true,
      loadingMessages: [
        "Converting your photo to a coloring book sketch...",
        "Creating perfect outlines for coloring...",
        "Generating your coloring book page..."
      ]
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 ColoringBook AI Creator server running on port ${PORT}`);
  console.log(`📝 Specialized for: "${geminiPrompt}"`);
  console.log(`🖍️ Perfect for creating coloring book pages from any photo!`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});