const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================================
// FORKABLE CONFIGURATION - CHANGE ONLY THIS LINE TO CREATE A NEW APP
// =============================================================================
// This is the ONLY line you need to modify to fork this application!
// Simply change the prompt below to create a completely different image modification app.
const geminiPrompt = "Analyze this image and describe how it would look as a high-contrast, black and white pencil sketch with detailed shading. Provide a detailed description of the sketch version.";
// =============================================================================

// Middleware setup
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json({ limit: '10mb' })); // Handle large Base64 image data

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Forkable AI Image App is running!' });
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

    console.log('Sending request to Gemini API...');
    
    // Make request to Gemini API (using 2.0 model until 2.5 nano is available)
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
        error: 'Failed to process image with AI service',
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
        error: 'Unexpected response format from AI service' 
      });
    }

    const description = geminiResult.candidates[0].content.parts[0].text;
    
    if (!description) {
      console.error('No description in Gemini response');
      return res.status(500).json({ 
        error: 'AI service did not return description' 
      });
    }

    console.log('Successfully processed image with Gemini API');
    
    // Return the description (for now, we'll return the original image with the description)
    res.json({ 
      description: description,
      originalImageData: base64Data,
      mimeType: mimeType
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      error: 'Internal server error while processing image',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Forkable AI Image App server running on port ${PORT}`);
  console.log(`📝 Current prompt: "${geminiPrompt}"`);
  console.log(`🔧 To fork this app, change the geminiPrompt variable in server.js`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
