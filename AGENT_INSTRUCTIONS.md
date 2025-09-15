# Agent Instructions - Forkable AI Framework

## 🎯 **Project Overview**

You are working on the **Forkable AI Framework**, a system that allows rapid deployment of AI image modification websites by changing a single configuration file. The goal is to prove the concept with a working MVP that includes user authentication, payment processing, and one deployed example fork.

## 📋 **Current Status**

- ✅ **Foundation**: Working Express.js backend with Gemini integration
- ✅ **Planning**: Complete specifications and implementation plans
- ✅ **Architecture**: Clear technical design and requirements
- 🚧 **Implementation**: Ready to begin parallel development

## 🤖 **Agent Roles and Responsibilities**

### **Backend Agent**
**Primary Focus**: API, Database, Authentication, Payments

**Your Mission**: Transform the existing basic backend into a production-ready system with user management, payments, and configuration-driven forking.

**Key Tasks**:
1. **Enhance Gemini Integration** (Week 1)
   - Improve existing Gemini 2.5 nano integration
   - Add better error handling and retry logic
   - Optimize prompting for image modification
   - Add usage tracking and monitoring

2. **Implement Configuration System** (Week 1-2)
   - Create single configuration file loader
   - Implement dynamic configuration updates
   - Add configuration validation
   - Test forking process

3. **Set Up Database** (Week 2)
   - Set up Vercel Postgres
   - Create user and usage tables
   - Implement database migrations
   - Add connection pooling

4. **Add Authentication** (Week 2-3)
   - Integrate Klerk for user management
   - Implement JWT token handling
   - Add user registration/login
   - Set up session management

5. **Implement Payments** (Week 3-4)
   - Integrate Polar for payment processing
   - Add token-based billing system
   - Implement usage tracking
   - Add subscription management

**Success Criteria**:
- Enhanced Gemini integration working reliably
- Single configuration file system allows easy forking
- User authentication and billing system fully functional
- One example fork deployed and accessible (ColoringBook AI)
- API response times < 2 seconds for 95% of requests

### **Frontend Agent**
**Primary Focus**: Web Interface, User Experience, Configuration Integration

**Your Mission**: Transform the existing basic frontend into a full-featured web application with user management, payments, and configuration-driven branding.

**Key Tasks**:
1. **Set Up Build System** (Week 1)
   - Set up modern build tools (Vite/Webpack)
   - Organize code into modules
   - Set up component structure
   - Configure development server

2. **Implement Configuration Integration** (Week 1-2)
   - Create configuration loader
   - Add dynamic branding updates
   - Set up theme system
   - Test configuration changes

3. **Add Authentication Interface** (Week 2-3)
   - Create login/register forms
   - Implement form validation
   - Add user dashboard
   - Set up session management

4. **Implement Payment Interface** (Week 3-4)
   - Create payment forms
   - Add token purchase interface
   - Implement usage tracking display
   - Add subscription management

5. **Create Admin Dashboard** (Week 4)
   - Build admin interface
   - Add user management
   - Implement analytics
   - Add system monitoring

**Success Criteria**:
- All features working across browsers
- Successful user authentication and payments
- Responsive design on all devices
- < 2 second page load times
- 90%+ test coverage

### **Mobile Agent**
**Primary Focus**: React Native iPhone App Development

**Your Mission**: Build a React Native iPhone app that mirrors the web application functionality with native mobile features.

**Key Tasks**:
1. **Set Up Development Environment** (Week 1)
   - Install React Native + Expo CLI
   - Set up iOS simulator
   - Create project structure
   - Set up navigation

2. **Implement Core Features** (Week 2-3)
   - Add camera and photo library integration
   - Connect to backend API
   - Implement image processing workflow
   - Add user authentication

3. **Add Advanced Features** (Week 4-5)
   - Implement payment processing
   - Add user dashboard
   - Implement offline functionality
   - Add push notifications

4. **Polish and Deploy** (Week 6-8)
   - Optimize performance
   - Add comprehensive testing
   - Prepare for App Store submission
   - Submit to App Store

**Success Criteria**:
- Functional iPhone app with all core features
- Successful App Store submission
- 4.5+ star rating
- < 3 second app launch time
- 90%+ test coverage

### **DevOps Agent**
**Primary Focus**: Infrastructure, Deployment, Automation

**Your Mission**: Set up comprehensive infrastructure, deployment automation, and monitoring systems.

**Key Tasks**:
1. **Set Up Infrastructure** (Week 1-2)
   - Configure Vercel deployment
   - Set up Vercel Postgres database
   - Set up Vercel KV cache
   - Configure domain and SSL

2. **Implement CI/CD Pipeline** (Week 2-3)
   - Set up GitHub Actions
   - Implement automated testing
   - Add deployment automation
   - Set up security scanning

3. **Set Up Monitoring** (Week 3-4)
   - Implement application monitoring
   - Set up alerting system
   - Add logging system
   - Create analytics dashboard

4. **Implement Automation** (Week 4-5)
   - Create automated forking system
   - Set up backup and recovery
   - Implement security measures
   - Add documentation

**Success Criteria**:
- 99.9% uptime for all services
- < 2 second response times
- Automated deployment in < 5 minutes
- Automated forking in < 10 minutes
- Zero data loss incidents

## 📚 **Key Documents to Reference**

### **Essential Reading**
1. **Constitution** (`memory/constitution.md`) - Project vision and principles
2. **Your Specification** (`specs/[your-spec]/spec.md`) - Detailed requirements
3. **Your Implementation Plan** (`specs/[your-spec]/plan.md`) - Step-by-step tasks
4. **Master Coordination** (`MASTER_COORDINATION.md`) - Overall project coordination

### **Technical References**
- **Backend Spec**: `specs/001-backend-enhancement/spec.md`
- **Frontend Spec**: `specs/003-frontend-enhancement/spec.md`
- **Mobile Spec**: `specs/002-mobile-app/spec.md`
- **DevOps Spec**: `specs/004-devops-infrastructure/spec.md`

### **Examples and Templates**
- **Configuration Example**: `examples/coloringbook-config.js`
- **Forking Script**: `scripts/create-fork.js`
- **API Contracts**: `specs/[your-spec]/contracts/api-spec.json`

## 🎯 **MVP Success Criteria**

### **Core Functionality**
- ✅ Working forkable system with Gemini 2.5 nano
- ✅ User authentication and billing system
- ✅ Single configuration file for easy forking
- ✅ One example fork deployed (ColoringBook AI)

### **Business Model**
- ✅ Token-based payment system ($5 minimum deposit)
- ✅ 3 free generations for new users
- ✅ User management and usage tracking
- ✅ Admin dashboard for monitoring

### **Technical Requirements**
- ✅ API response times < 2 seconds
- ✅ 99.9% uptime
- ✅ Automated deployment
- ✅ Comprehensive testing

## 🚨 **Critical Success Factors**

### **1. Configuration System**
- **MUST**: Single config file changes create new apps
- **MUST**: Dynamic branding and prompt updates
- **MUST**: Easy forking process (duplicate + change config)

### **2. Business Infrastructure**
- **MUST**: User authentication working
- **MUST**: Payment processing functional
- **MUST**: Usage tracking and limits
- **MUST**: Admin dashboard operational

### **3. Deployment**
- **MUST**: One example fork deployed and accessible
- **MUST**: Automated deployment process
- **MUST**: Domain and SSL configured
- **MUST**: Monitoring and alerting active

## 📞 **Communication Protocol**

### **Daily Updates**
- Report progress on assigned tasks
- Identify blockers and dependencies
- Request help or clarification
- Update task completion status

### **Weekly Reviews**
- Comprehensive progress review
- Integration testing results
- Issue resolution and planning
- Next week's priorities

### **Emergency Escalation**
- Critical issues requiring immediate attention
- Integration conflicts between agents
- Security or performance issues
- Blockers preventing progress

## 🎯 **Your Next Steps**

1. **Read Your Specification**: Review your detailed specification document
2. **Review Implementation Plan**: Understand your step-by-step tasks
3. **Check Dependencies**: Identify what you need from other agents
4. **Start Implementation**: Begin with Week 1 tasks
5. **Report Progress**: Update daily on your progress

## 🏆 **Success Metrics**

### **Technical Success**
- All specifications implemented correctly
- Performance targets met
- Security requirements satisfied
- User experience goals achieved

### **Business Success**
- MVP concept proven with working example
- User authentication and payments functional
- Forking process working end-to-end
- Ready for market validation

---

**Remember**: You're not just building features - you're proving a concept. Every decision should support the goal of creating a forkable system that can rapidly deploy new AI applications. Focus on the MVP first, then expand.

**Good luck! 🚀**
