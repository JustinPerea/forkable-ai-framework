# Forkable AI Framework - Frontend

Enhanced web interface with modern build system, configuration-driven UI, and modular architecture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Modern Build System
- **Vite**: Fast build tool with hot module replacement
- **ES6+ Modules**: Native JavaScript modules
- **CSS Variables**: Dynamic theming support
- **Hot Reload**: Instant updates during development

### Project Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components (future)
│   ├── services/        # Business logic and API clients
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS styling with variables
│   ├── config/          # Configuration management
│   └── assets/          # Static assets
├── public/              # Public static files
├── index.html           # Main HTML template
└── vite.config.js       # Build configuration
```

## 🎨 Configuration-Driven UI

### Dynamic Branding
The UI automatically adapts based on configuration:
- **App Name & Tagline**: Dynamically updated from config
- **Color Schemes**: CSS variables updated in real-time
- **Theme Support**: Multiple theme variants
- **Feature Flags**: Enable/disable functionality

### Configuration Manager
```javascript
import configManager from './config/ConfigManager.js';

// Get current configuration
const config = configManager.getConfig();

// Update configuration
configManager.updateConfig({
  branding: {
    name: "My Custom AI App",
    colors: { primary: "#ff6b6b" }
  }
});

// Check if feature is enabled
if (configManager.isFeatureEnabled('authentication')) {
  // Show auth UI
}
```

### Theme Testing
In development mode, a theme selector appears in the top-right corner:
- **Purple Theme**: Modern purple color scheme
- **Green Theme**: Eco-friendly green colors
- **Dark Theme**: Professional dark mode
- **Reset**: Return to default theme

## 📱 Features

### Core Functionality
- ✅ **Image Upload**: Drag & drop or click to select
- ✅ **AI Processing**: Backend integration for image analysis
- ✅ **Real-time Results**: Dynamic result display
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Loading States**: Visual feedback during processing

### Enhanced UX
- ✅ **Responsive Design**: Works on all devices
- ✅ **Keyboard Shortcuts**:
  - `Ctrl/Cmd + U`: Upload image
  - `Enter`: Process image
  - `Escape`: Cancel operation
- ✅ **Accessibility**: ARIA labels, focus states, reduced motion support
- ✅ **Progressive Enhancement**: Works without JavaScript for basic functionality

### Performance
- ✅ **< 2 Second Load Times**: Optimized bundle size
- ✅ **Hot Module Replacement**: Instant development updates
- ✅ **Code Splitting**: Efficient resource loading
- ✅ **Source Maps**: Development debugging support

## 🔧 Configuration Options

### Default Configuration
```javascript
{
  branding: {
    name: "AI Image Analyzer",
    tagline: "Get detailed AI analysis of your images",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#f093fb"
    }
  },
  features: {
    authentication: false,
    payments: false,
    admin: false
  },
  api: {
    baseUrl: "http://localhost:3001/api",
    endpoints: {
      processImage: "/process-image",
      config: "/config"
    }
  }
}
```

### Environment Variables
Configuration can be overridden via environment variables:
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_THEME`: Default theme

## 🧪 Development Features

### Theme Testing
- Real-time theme switching
- Color palette preview
- Configuration state inspector
- Reset to defaults

### Debug Tools
- Configuration state logging
- API endpoint testing
- Error boundary with reload
- Development console info

### Hot Reload
Changes to these files trigger instant updates:
- JavaScript modules
- CSS styles
- Configuration files
- HTML template

## 🎯 Component Library

### Button Component
```javascript
import Button from './components/Button.js';

const button = new Button({
  text: 'Process Image',
  variant: 'primary', // primary, secondary, accent, outline
  size: 'large',     // small, medium, large
  onClick: () => console.log('clicked!')
});

document.body.appendChild(button.getElement());
```

### Future Components
- Modal dialogs
- Form inputs
- Navigation
- Loading states
- Alert messages

## 🚀 Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:5173
```

### Production Build
```bash
npm run build
# Creates optimized build in dist/
```

### Preview Production
```bash
npm run preview
# Preview production build locally
```

## 🔌 Backend Integration

### API Endpoints
- `POST /api/process-image`: Image processing
- `GET /api/config`: Configuration data
- `GET /api/health`: Health check

### Configuration Loading
The frontend automatically:
1. Tries to load config from `/api/config`
2. Falls back to default configuration
3. Applies configuration to UI
4. Listens for configuration updates

## 🎨 Customization Guide

### 1. Change Branding
Edit `src/config/ConfigManager.js`:
```javascript
branding: {
  name: "Your App Name",
  tagline: "Your custom tagline",
  colors: {
    primary: "#your-color"
  }
}
```

### 2. Add New Themes
Create theme configurations in `src/utils/configTest.js`

### 3. Modify Styles
Edit CSS variables in `src/styles/main.css`:
```css
:root {
  --color-primary: #your-color;
}
```

### 4. Add Features
Enable features in configuration:
```javascript
features: {
  authentication: true,
  payments: true
}
```

## 📊 Performance Metrics

### Bundle Size
- Initial bundle: < 1MB
- CSS: < 50KB
- JavaScript: < 100KB
- Assets: Optimized images

### Loading Times
- First paint: < 500ms
- Interactive: < 1.5s
- Complete: < 2s

### Development
- Hot reload: < 100ms
- Build time: < 5s
- Dev server start: < 1s

---

**Built with modern web technologies for the Forkable AI Framework**

🎨 Ready for customization • 📱 Mobile-first design • ⚡ Lightning-fast performance