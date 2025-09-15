# Specification: Configuration System

## Specification ID: SPEC-002
## Title: Single Configuration File System for Easy Forking
## Version: 1.0
## Date: 2024-01-13
## Author: Master Agent
## Status: Draft

## 1. Overview

### 1.1 Purpose
Create a single configuration file system that allows easy forking of the AI application by changing one file, enabling rapid deployment of new AI image modification websites.

### 1.2 Scope
This specification covers:
- Single configuration file structure
- Branding customization system
- AI prompt configuration
- Business settings (pricing, limits)
- Deployment configuration
- Validation and error handling

### 1.3 Background
The forkable AI framework needs a simple way to create new applications by changing minimal configuration, allowing rapid deployment of new AI image modification websites with different prompts and branding.

## 2. Requirements

### 2.1 Functional Requirements

#### 2.1.1 Configuration File Structure
- [ ] **REQ-CONFIG-001**: Single JSON/JS configuration file
- [ ] **REQ-CONFIG-002**: All customizable elements in one place
- [ ] **REQ-CONFIG-003**: Environment-specific overrides
- [ ] **REQ-CONFIG-004**: Configuration validation on startup
- [ ] **REQ-CONFIG-005**: Hot-reload capability for development

#### 2.1.2 Branding Configuration
- [ ] **REQ-BRAND-001**: Website name and title
- [ ] **REQ-BRAND-002**: Logo and favicon
- [ ] **REQ-BRAND-003**: Tagline and description
- [ ] **REQ-BRAND-004**: Header images and examples
- [ ] **REQ-BRAND-005**: Color scheme (post-MVP)
- [ ] **REQ-BRAND-006**: Meta tags and SEO

#### 2.1.3 AI Configuration
- [ ] **REQ-AI-001**: Gemini prompt configuration
- [ ] **REQ-AI-002**: Model parameters (temperature, etc.)
- [ ] **REQ-AI-003**: Response processing settings
- [ ] **REQ-AI-004**: Error handling configuration

#### 2.1.4 Business Configuration
- [ ] **REQ-BUSINESS-001**: Pricing and token costs
- [ ] **REQ-BUSINESS-002**: Free trial settings
- [ ] **REQ-BUSINESS-003**: Usage limits and quotas
- [ ] **REQ-BUSINESS-004**: Payment settings

#### 2.1.5 Deployment Configuration
- [ ] **REQ-DEPLOY-001**: Domain and URL settings
- [ ] **REQ-DEPLOY-002**: Vercel project configuration
- [ ] **REQ-DEPLOY-003**: Environment variables
- [ ] **REQ-DEPLOY-004**: Database settings

## 3. Technical Design

### 3.1 Configuration File Structure
```javascript
// config.js
const config = {
  // Branding
  branding: {
    name: "ColoringBook AI",
    tagline: "Transform any photo into a coloring book sketch",
    description: "Upload your photo and get a beautiful black and white sketch perfect for coloring",
    logo: "/assets/logo.png",
    favicon: "/assets/favicon.ico",
    headerImage: "/assets/header.jpg",
    examples: [
      "/assets/example1.jpg",
      "/assets/example2.jpg"
    ],
    meta: {
      title: "ColoringBook AI - Transform Photos to Coloring Book Sketches",
      description: "Convert any photo into a beautiful coloring book sketch",
      keywords: "coloring book, sketch, AI, photo transformation"
    }
  },

  // AI Configuration
  ai: {
    provider: "gemini",
    model: "gemini-2.5-nano",
    prompt: "Convert this image into a black and white coloring book style sketch with clear outlines and no shading. Make it suitable for coloring with crayons or markers.",
    parameters: {
      temperature: 0.7,
      maxTokens: 1000
    }
  },

  // Business Settings
  business: {
    freeGenerations: 3,
    tokenPrice: 0.10, // $0.10 per generation
    minDeposit: 5.00, // $5 minimum
    currency: "USD",
    paymentProvider: "polar"
  },

  // Deployment
  deployment: {
    domain: "coloringbook.ai",
    vercelProject: "coloringbook-ai",
    environment: "production"
  }
};

module.exports = config;
```

### 3.2 Configuration Loading
```javascript
// config-loader.js
const config = require('./config.js');
const environment = process.env.NODE_ENV || 'development';

// Load environment-specific overrides
if (environment === 'development') {
  config.deployment.domain = 'localhost:3000';
  config.deployment.vercelProject = 'coloringbook-ai-dev';
}

// Validate configuration
function validateConfig(config) {
  const required = ['branding.name', 'branding.tagline', 'ai.prompt'];
  // Validation logic
}

module.exports = config;
```

### 3.3 Frontend Integration
```javascript
// frontend/config.js
const config = require('../config.js');

// Make config available to frontend
window.APP_CONFIG = {
  name: config.branding.name,
  tagline: config.branding.tagline,
  description: config.branding.description,
  logo: config.branding.logo,
  examples: config.branding.examples
};
```

## 4. Implementation Details

### 4.1 File Structure
```
project/
├── config.js                 # Main configuration file
├── config-loader.js          # Configuration loading and validation
├── config-schema.json        # JSON schema for validation
├── examples/
│   ├── coloringbook-config.js
│   ├── sketchify-config.js
│   └── watercolor-config.js
└── scripts/
    ├── create-fork.js        # Script to create new fork
    └── validate-config.js    # Configuration validation script
```

### 4.2 Forking Process
1. **Duplicate codebase**: Copy entire project directory
2. **Update config.js**: Change branding, prompt, and settings
3. **Update assets**: Replace logo, header images, examples
4. **Deploy**: Push to new Vercel project with new domain
5. **Test**: Verify configuration and functionality

### 4.3 Validation
- **Schema validation**: JSON schema for configuration structure
- **Required fields**: Ensure all required fields are present
- **Type validation**: Validate data types and formats
- **Business logic**: Validate pricing, limits, and settings

## 5. API Specification

### 5.1 Configuration Endpoints
```
GET  /api/config              # Get current configuration
PUT  /api/config              # Update configuration (admin only)
GET  /api/config/validate     # Validate configuration
GET  /api/config/examples     # Get example configurations
```

### 5.2 Configuration Response
```json
{
  "branding": {
    "name": "ColoringBook AI",
    "tagline": "Transform any photo into a coloring book sketch",
    "logo": "/assets/logo.png"
  },
  "ai": {
    "prompt": "Convert this image into a black and white coloring book style sketch...",
    "model": "gemini-2.5-nano"
  },
  "business": {
    "freeGenerations": 3,
    "tokenPrice": 0.10,
    "minDeposit": 5.00
  }
}
```

## 6. Testing Strategy

### 6.1 Unit Testing
- Configuration loading and validation
- Schema validation
- Environment-specific overrides
- Error handling

### 6.2 Integration Testing
- Frontend configuration integration
- API configuration endpoints
- Deployment configuration
- Forking process

### 6.3 End-to-End Testing
- Complete forking workflow
- Configuration changes reflected in UI
- Deployment with new configuration
- User experience with different configurations

## 7. Deployment

### 7.1 Forking Script
```bash
#!/bin/bash
# create-fork.sh
NEW_NAME=$1
NEW_DOMAIN=$2
NEW_PROMPT=$3

# Duplicate codebase
cp -r ../forkable-ai-app ../$NEW_NAME
cd ../$NEW_NAME

# Update configuration
sed -i "s/ColoringBook AI/$NEW_NAME/g" config.js
sed -i "s/coloringbook.ai/$NEW_DOMAIN/g" config.js
sed -i "s/Convert this image into a black and white coloring book style sketch/$NEW_PROMPT/g" config.js

# Deploy to Vercel
vercel --prod
```

### 7.2 Configuration Management
- **Version control**: Track configuration changes
- **Backup**: Backup configurations before changes
- **Rollback**: Ability to rollback configuration changes
- **Monitoring**: Monitor configuration changes and their impact

## 8. Success Criteria

### 8.1 Functional Success
- Single configuration file contains all customizable elements
- Forking process takes less than 10 minutes
- Configuration changes reflected immediately in application
- Validation prevents invalid configurations

### 8.2 User Experience Success
- Easy to understand configuration structure
- Clear documentation for forking process
- Intuitive configuration validation
- Fast deployment of new forks

### 8.3 Technical Success
- Configuration loading time < 100ms
- Zero configuration-related errors in production
- 100% configuration validation coverage
- Seamless integration with existing codebase

## 9. Review & Acceptance Checklist

### 9.1 Technical Review
- [ ] Configuration structure reviewed
- [ ] Validation logic reviewed
- [ ] Integration points reviewed
- [ ] Performance impact assessed

### 9.2 Business Review
- [ ] Forking process validated
- [ ] Configuration flexibility confirmed
- [ ] Deployment process tested
- [ ] User experience validated

### 9.3 Implementation Review
- [ ] Implementation plan reviewed
- [ ] Timeline validated
- [ ] Resource requirements confirmed
- [ ] Dependencies identified

---

**Review Status**: [ ] Draft [ ] In Review [ ] Approved [ ] Implemented
**Next Review Date**: 2024-01-20
**Approved By**: [Name] [Date]
