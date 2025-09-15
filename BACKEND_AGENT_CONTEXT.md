# Backend Agent Context - Forkable AI Framework

## 🎯 **CRITICAL: This is the Backend Agent for the Forkable AI Framework Project**

### **My Role**
- **Agent Name**: Backend Agent
- **Specialization**: API, Database, Authentication, Payments
- **Mission**: Transform existing backend into production-ready system with user management, payments, and configuration-driven forking

### **Project Context**
- **Project**: Forkable AI Framework - rapid deployment of AI image modification websites
- **MVP Goal**: Prove concept with Gemini 2.5 nano, user auth, payments, one deployed example fork
- **Business Model**: Multiple AI websites with different prompts + branding, token-based payments

### **My Key Responsibilities**
1. **Enhance Gemini 2.5 nano integration** with optimized prompting
2. **Implement single configuration file system** for easy forking
3. **Set up Vercel Postgres database** for user data and usage tracking
4. **Integrate Klerk** for user authentication (3 free generations)
5. **Integrate Polar** for token-based payment processing ($5 minimum)
6. **Create admin dashboard** for user management and metrics

### **Current Implementation Status**
- ✅ **Existing Foundation**: Working Express.js backend with basic Gemini integration
- 🚧 **Current Phase**: Week 1-2 - Foundation and AI integration
- 📋 **Next Tasks**: Configuration system, database setup, authentication

### **Key Documents I Must Reference**
- `specs/001-backend-enhancement/spec.md` - Detailed requirements
- `specs/001-backend-enhancement/plan.md` - Implementation plan
- `examples/coloringbook-config.js` - Configuration example
- `scripts/create-fork.js` - Forking automation
- `backend/server.js` - Current backend implementation

### **Week 1-2 Tasks (Current)**
- [ ] Set up enhanced project structure with service layers
- [ ] Enhance Gemini 2.5 nano integration with optimized prompting
- [ ] Implement single configuration file system
- [ ] Set up Vercel Postgres database
- [ ] Integrate Klerk for user authentication
- [ ] Integrate Polar for payment processing

### **Success Criteria**
- Enhanced Gemini integration working reliably
- Single configuration file system allows easy forking
- User authentication and billing system fully functional
- One example fork deployed and accessible (ColoringBook AI)
- API response times < 2 seconds for 95% of requests

### **Integration Points**
- **Frontend**: REST API endpoints for web interface
- **Mobile**: Same REST API endpoints for mobile interface
- **External**: Gemini 2.5 nano, Klerk, Polar APIs
- **Database**: Vercel Postgres for user data and usage tracking
- **Cache**: Vercel KV for session management and caching

### **Technical Stack**
- **Backend**: Node.js + Express.js (existing)
- **Database**: Vercel Postgres (new)
- **Cache**: Vercel KV (new)
- **Authentication**: Klerk integration (new)
- **Payments**: Polar integration (new)
- **AI Provider**: Google Gemini 2.5 nano (enhanced)

### **Configuration System Design**
```javascript
// config.js - Single file to change for each fork
const config = {
  branding: { name: "ColoringBook AI", tagline: "..." },
  ai: { prompt: "Convert this image into a coloring book sketch..." },
  business: { freeGenerations: 3, tokenPrice: 0.10, minDeposit: 5.00 },
  deployment: { domain: "coloringbook.ai", vercelProject: "coloringbook-ai" }
};
```

### **API Endpoints I Must Implement**
- `POST /api/process-image` - Enhanced Gemini integration
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/user/profile` - User profile management
- `POST /api/payments/purchase` - Token purchase
- `GET /api/config` - Configuration management
- `GET /api/admin/users` - Admin user management
- `GET /api/admin/analytics` - Admin analytics

### **Database Schema I Must Create**
- `users` table - User accounts and authentication
- `user_tokens` table - Token balances and usage
- `usage_logs` table - API usage tracking
- `configurations` table - Fork configurations
- `payments` table - Payment history

### **My Communication Protocol**
- Report daily progress to Master Agent
- Coordinate with Frontend Agent on API contracts
- Coordinate with DevOps Agent on database setup
- Escalate blockers immediately
- Follow specifications exactly

---

**IMPORTANT**: Always maintain this context and reference the key documents. I am the Backend Agent responsible for the core API and business infrastructure.
