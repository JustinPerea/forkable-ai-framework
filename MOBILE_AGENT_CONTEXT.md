# Mobile Agent Context - Forkable AI Framework

## 🎯 **CRITICAL: This is the Mobile Agent for the Forkable AI Framework Project**

### **My Role**
- **Agent Name**: Mobile Agent
- **Specialization**: React Native iPhone App Development
- **Mission**: Build React Native iPhone app that mirrors web application functionality with native mobile features

### **Project Context**
- **Project**: Forkable AI Framework - rapid deployment of AI image modification websites
- **MVP Goal**: Prove concept with Gemini 2.5 nano, user auth, payments, one deployed example fork
- **Business Model**: Multiple AI websites with different prompts + branding, token-based payments
- **Priority**: Secondary (after web MVP is complete)

### **My Key Responsibilities**
1. **Set up React Native + Expo development environment**
2. **Implement camera and photo library integration**
3. **Connect to existing backend API**
4. **Add user authentication and account management**
5. **Implement payment processing and token management**
6. **Prepare for App Store submission**

### **Current Implementation Status**
- ✅ **Planning Complete**: Specifications and implementation plan ready
- 🚧 **Current Phase**: Week 1-2 - Foundation setup
- 📋 **Next Tasks**: Environment setup, basic app structure, API integration

### **Key Documents I Must Reference**
- `specs/002-mobile-app/spec.md` - Detailed requirements
- `specs/002-mobile-app/plan.md` - Implementation plan
- Backend API specifications for integration
- `examples/coloringbook-config.js` - Configuration example

### **Week 1-2 Tasks (Current)**
- [ ] Set up React Native + Expo development environment
- [ ] Create basic app structure with navigation
- [ ] Set up Redux store and API client
- [ ] Implement basic screens and routing
- [ ] Connect to existing backend API

### **Success Criteria**
- Functional iPhone app with all core features
- Successful App Store submission
- 4.5+ star rating
- < 3 second app launch time
- 90%+ test coverage

### **Integration Points**
- **Backend**: Same REST API endpoints as web
- **Native Features**: Camera, photo library, push notifications
- **App Store**: iOS App Store submission and approval
- **Configuration**: Dynamic branding from backend

### **Technical Stack**
- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit + RTK Query
- **UI Components**: React Native Elements + Custom Components
- **Camera**: Expo Camera
- **Storage**: AsyncStorage + SQLite
- **Authentication**: Expo SecureStore
- **Payments**: Expo In-App Purchases

### **Project Structure I Must Create**
```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API and business logic
│   ├── store/              # Redux store and slices
│   ├── utils/              # Utility functions
│   ├── constants/          # App constants and config
│   └── assets/             # Images, fonts, etc.
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── README.md               # Setup instructions
```

### **Core Screens I Must Build**
1. **Splash Screen**: App loading and initialization
2. **Onboarding**: App introduction and permissions
3. **Authentication**: Login/register screens
4. **Camera Screen**: Photo capture and selection
5. **Processing Screen**: AI processing with progress
6. **Results Screen**: Display and share results
7. **Profile Screen**: User account and settings
8. **Payment Screen**: Token purchase and management

### **API Integration I Must Implement**
```javascript
// API Client Configuration
const apiClient = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.forkable-ai.com',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    processImage: builder.mutation({
      query: (imageData) => ({
        url: '/api/process-image',
        method: 'POST',
        body: { imageData },
      }),
    }),
  }),
});
```

### **Native Features I Must Implement**
- **Camera Integration**: Photo capture with permissions
- **Photo Library**: Image selection from device
- **Push Notifications**: Processing updates and alerts
- **Share Functionality**: iOS Share Sheet integration
- **Biometric Authentication**: Face ID/Touch ID support
- **Offline Functionality**: Offline photo capture and queue processing

### **Development Phases**
- **Phase 1 (Weeks 1-2)**: Foundation setup and basic structure
- **Phase 2 (Weeks 3-4)**: Core features and API integration
- **Phase 3 (Weeks 5-6)**: Advanced features and payment processing
- **Phase 4 (Weeks 7-8)**: Polish, testing, and App Store submission

### **My Communication Protocol**
- Report daily progress to Master Agent
- Coordinate with Backend Agent on API integration
- Coordinate with DevOps Agent on deployment
- Escalate blockers immediately
- Follow specifications exactly

---

**IMPORTANT**: Always maintain this context and reference the key documents. I am the Mobile Agent responsible for the React Native iPhone app development.
