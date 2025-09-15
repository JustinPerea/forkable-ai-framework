# Forkable AI Image Modification Application

A complete, production-ready application that demonstrates the "forkable" architecture concept. This app can be easily duplicated and modified to create entirely new image processing applications by changing just one line of code.

## 🎯 Core Concept

The application consists of two main components:
- **Frontend**: A clean web interface for uploading images and displaying results
- **Backend**: A Node.js server that processes images using Google's Gemini AI API

The "forkable" magic happens in the backend where a single prompt string determines the image modification effect. To create a new app (e.g., "Vintage Photo Filter App"), simply duplicate this project and change one line in `server.js`.

## 🏗️ Architecture

```
/forkable-ai-app
├── /backend
│   ├── server.js          # Main server with forkable prompt
│   ├── package.json       # Dependencies
│   └── env.template       # Environment variables template
└── /frontend
    ├── index.html         # Clean, modern UI
    └── app.js            # Frontend logic
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.template .env
# Edit .env and add your Gemini API key
```

### 2. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Start the Backend Server

```bash
# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

The server will start on `http://localhost:3001`

### 4. Open the Frontend

Simply open `frontend/index.html` in your web browser. The app will automatically connect to the backend server.

## 🔧 How to Fork This Application

The entire "forkable" concept revolves around changing a single line in `backend/server.js`:

```javascript
// =============================================================================
// FORKABLE CONFIGURATION - CHANGE ONLY THIS LINE TO CREATE A NEW APP
// =============================================================================
const geminiPrompt = "Convert the provided image into a high-contrast, black and white pencil sketch with detailed shading.";
// =============================================================================
```

### Example Forks:

**Vintage Photo App:**
```javascript
const geminiPrompt = "Apply a warm, 1970s vintage photo filter with sepia tones and film grain.";
```

**Cartoon Style App:**
```javascript
const geminiPrompt = "Transform this image into a colorful cartoon illustration with bold outlines and vibrant colors.";
```

**Watercolor App:**
```javascript
const geminiPrompt = "Convert this image into a beautiful watercolor painting with soft, flowing brushstrokes.";
```

**Cyberpunk App:**
```javascript
const geminiPrompt = "Transform this image into a cyberpunk style with neon colors, digital glitch effects, and futuristic elements.";
```

## 📁 File Structure Details

### Backend (`server.js`)
- Express.js server with CORS enabled
- Single API endpoint: `POST /api/process-image`
- Handles Base64 image data up to 10MB
- Integrates with Google Gemini Vision API
- Comprehensive error handling
- Health check endpoint at `/health`

### Frontend (`index.html` + `app.js`)
- Clean, responsive design with gradient backgrounds
- File upload with drag-and-drop support
- Image preview before processing
- Loading states and progress indicators
- Error handling with user-friendly messages
- Mobile-responsive design

## 🛠️ Technical Stack

- **Backend**: Node.js, Express.js, node-fetch, CORS, dotenv
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI Service**: Google Gemini Vision API
- **Image Processing**: Base64 encoding/decoding

## 🔒 Security Features

- API key stored in environment variables (never hardcoded)
- File type validation (images only)
- File size limits (10MB maximum)
- CORS configuration for secure cross-origin requests
- Input validation and sanitization

## 🎨 Customization

### Changing the UI Theme
Modify the CSS variables in `index.html`:
```css
body {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Adding New Features
The modular architecture makes it easy to add:
- Multiple image processing options
- Batch processing
- Image history
- Social sharing
- User accounts

## 🐛 Troubleshooting

### Common Issues:

1. **"API key not found" error**
   - Ensure your `.env` file exists and contains `GEMINI_API_KEY=your_key`
   - Restart the server after adding the API key

2. **CORS errors**
   - Make sure the backend server is running on port 3001
   - Check that CORS is enabled in the server configuration

3. **Large image uploads fail**
   - The app supports images up to 10MB
   - Try compressing your image or using a smaller file

4. **Gemini API errors**
   - Verify your API key is valid and has sufficient quota
   - Check the Google AI Studio dashboard for usage limits

## 📈 Performance Tips

- Images are processed in Base64 format for simplicity
- Consider implementing image compression for production use
- Add caching for frequently processed images
- Implement rate limiting for API protection

## 🔮 Future Enhancements

- Support for multiple AI providers (OpenAI, Anthropic, etc.)
- Real-time image processing with WebSockets
- Batch processing capabilities
- Image comparison tools
- Social sharing features
- User authentication and image galleries

## 📄 License

MIT License - Feel free to fork, modify, and distribute!

---

**Happy Forking! 🍴✨**

Remember: The power of this application lies in its simplicity. One prompt change = one new app. That's the beauty of the forkable architecture!
