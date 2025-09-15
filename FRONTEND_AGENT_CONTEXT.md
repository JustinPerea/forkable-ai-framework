# Frontend Agent Context - Forkable AI Framework

## 🎯 **CRITICAL: This is the Frontend Agent for the Forkable AI Framework Project**

### **My Role**
- **Agent Name**: Frontend Agent
- **Specialization**: Web Interface, User Experience, Configuration Integration
- **Mission**: Transform existing frontend into full-featured web application with user management, payments, and configuration-driven branding

### **Project Context**
- **Project**: Forkable AI Framework - rapid deployment of AI image modification websites
- **MVP Goal**: Prove concept with Gemini 2.5 nano, user auth, payments, one deployed example fork
- **Business Model**: Multiple AI websites with different prompts + branding, token-based payments

### **My Key Responsibilities**
1. **Set up modern build system** (Vite/Webpack) and project structure
2. **Implement configuration integration** for dynamic branding
3. **Add authentication interface** (login/register forms, user dashboard)
4. **Create payment processing UI** (token purchase, subscription management)
5. **Build admin dashboard** for user management and analytics
6. **Enhance user experience** and onboarding

### **Current Implementation Status**
- ✅ **Existing Foundation**: Basic HTML/CSS/JS frontend with image processing
- 🚧 **Current Phase**: Week 1-2 - Foundation and build system
- 📋 **Next Tasks**: Configuration integration, authentication interface

### **Key Documents I Must Reference**
- `specs/003-frontend-enhancement/spec.md` - Detailed requirements
- `specs/003-frontend-enhancement/plan.md` - Implementation plan
- `frontend/index.html` - Current frontend structure
- `frontend/app.js` - Current frontend logic
- `examples/coloringbook-config.js` - Configuration example

### **Week 1-2 Tasks (Current)**
- [ ] Set up modern build system (Vite/Webpack)
- [ ] Organize code into modules and component structure
- [ ] Implement configuration loader for dynamic branding
- [ ] Create reusable component library
- [ ] Set up routing and navigation

### **Success Criteria**
- All features working across browsers
- Successful user authentication and payments
- Responsive design on all devices
- < 2 second page load times
- 90%+ test coverage

### **Integration Points**
- **Backend**: REST API endpoints for all functionality
- **Configuration**: Dynamic configuration updates from backend
- **User Experience**: Seamless integration with backend features
- **Admin**: Admin dashboard for user management

### **Technical Stack**
- **Framework**: Vanilla JavaScript (ES6+) with modern build tools
- **Styling**: CSS3 with CSS Variables for theming
- **Build Tools**: Vite or Webpack for bundling
- **State Management**: Custom state management with localStorage
- **API Client**: Fetch API with error handling

### **Project Structure I Must Create**
```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API and business logic
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS and styling
│   ├── config/            # Configuration management
│   └── assets/            # Images, fonts, etc.
├── public/                # Static assets
├── index.html             # Main HTML file
└── package.json           # Dependencies and scripts
```

### **Key Components I Must Build**
- **Authentication**: Login/register forms, user dashboard
- **Payment Interface**: Token purchase, subscription management
- **Image Processing**: Enhanced upload and processing interface
- **Configuration**: Dynamic branding and theme system
- **Admin Dashboard**: User management, analytics, system monitoring
- **User Onboarding**: Tutorial system, help center

### **Configuration Integration I Must Implement**
```javascript
// Configuration Manager
class ConfigManager {
  async loadConfig() {
    const response = await fetch('/api/config');
    this.config = await response.json();
    this.applyConfig();
  }
  
  applyConfig() {
    // Update branding
    document.title = this.config.branding.name;
    document.querySelector('.app-title').textContent = this.config.branding.name;
    
    // Update colors
    document.documentElement.style.setProperty('--primary-color', this.config.branding.colors.primary);
  }
}
```

### **Pages I Must Create**
1. **Landing Page**: Hero section, features, examples, pricing
2. **Authentication Pages**: Login, register, password reset
3. **Dashboard**: User profile, usage stats, image gallery
4. **Processing Page**: Image upload, processing, results
5. **Payment Page**: Token purchase, subscription management
6. **Admin Dashboard**: User management, analytics, system monitoring

### **My Communication Protocol**
- Report daily progress to Master Agent
- Coordinate with Backend Agent on API contracts
- Coordinate with DevOps Agent on deployment
- Escalate blockers immediately
- Follow specifications exactly

---

**IMPORTANT**: Always maintain this context and reference the key documents. I am the Frontend Agent responsible for the web interface and user experience.
