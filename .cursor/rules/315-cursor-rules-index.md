# Cursor Rules for Digital Minimalist Project

This document provides an overview of all Cursor rules configured for the Digital Minimalist Project.

## 📁 Rules Structure

Rules are organized using the NNN-name.mdc naming convention:
- **000-099**: Core/project-wide rules
- **100-199**: Workflow and integration rules
- **200-299**: Pattern and style rules
- **300-399**: Technology-specific rules

## 🎯 Core Rules (000-099)

### 001-project-overview.mdc
Template for project vision, features, goals, and success metrics.

### 002-tech-stack.mdc
Technical stack definition:
- **Frontend**: React, Tailwind CSS
- **Backend**: Spring Boot, Thymeleaf
- **Infrastructure**: Redis, Kafka, PostgreSQL
- **Authentication**: OAuth2 (Google, KakaoTalk)
- **AI/ML**: Hugging Face, OpenAI APIs

### 003-development-guidelines.mdc
Core development principles and architecture standards.

### 004-digital-minimalist-project-overview.mdc ✨ NEW
Specific project overview for Digital Minimalist application with defined features, target audience, and metrics.

### 010-012: Cursor Documentation
- 010-cursor-rules.mdc: File structure guide
- 011-cursor-docs.mdc: Documentation standards
- 012-cursor-tools.mdc: Tool usage guidelines

## 🔄 Workflow Rules (100-199)

### 100-error-fixing-process.mdc
Structured process for diagnosing and fixing errors.

### 101-build-and-env-setup.mdc
Build configuration and environment setup procedures.

### 102-gitflow-agent.mdc
Git Flow-compliant commit and PR automation.

### 103-api-design-rest-conventions.mdc ✨ NEW
RESTful API design standards, response formats, and HTTP status codes.

### 104-security-oauth2-rules.mdc ✨ NEW
OAuth2 implementation guidelines for Google and KakaoTalk integration.

### 105-testing-strategy.mdc ✨ NEW
Comprehensive testing approach (unit, integration, E2E) for backend and frontend.

### 106-environment-configuration.mdc ✨ NEW
Environment variable management and secrets handling.

### 107-database-design-migration.mdc ✨ NEW
Database schema design, migration strategy with Flyway, and indexing best practices.

### 108-cicd-deployment.mdc ✨ NEW
CI/CD pipeline configuration, Docker setup, and deployment strategies.

### 109-security-best-practices.mdc ✨ NEW
OWASP Top 10 mitigation, security headers, and API security measures.

## 🎨 Pattern Rules (200-299)

### 201-code-commenting.mdc
Mandatory meaningful comments throughout the codebase.

### 202-error-handling-patterns.mdc ✨ NEW
Standardized error handling for backend (Spring Boot) and frontend (React).

### 203-logging-standards.mdc ✨ NEW
Logging levels, structured logging, and best practices.

## 🔧 Technology-Specific Rules (300-399)

### Backend (Java/Spring Boot)
- **300-java-spring-cursor-rules.mdc**: Java and Spring Boot conventions
- **301-gradle-groovy-rules.mdc**: Gradle build configuration
- **302-jpa-querydsl-dynamic-query-rules.mdc**: JPA + QueryDSL patterns
- **303-spring-redis-lettuce-redisson-rules.mdc**: Redis client strategy
- **304-kafka-data-pipeline-rules.mdc**: Kafka topic and message structuring
- **305-kafka-msa-saga-pattern-rules.mdc**: Saga pattern for distributed transactions

### Frontend (React/TypeScript)
- **306-react-vite-tailwind-rules.mdc**: React development with Vite and Tailwind
- **313-react-state-management.mdc** ✨ NEW: State management strategies (useState, Context, Zustand, React Query)
- **314-typescript-best-practices.mdc** ✨ NEW: TypeScript type safety and advanced patterns

### Integration & Templates
- **308-thymeleaf-template-rules.mdc** ✨ NEW: Thymeleaf template conventions and React integration
- **309-huggingface-openai-integration.mdc** ✨ NEW: AI/ML integration for content categorization, summarization, and recommendations
- **310-performance-optimization.mdc** ✨ NEW: Backend and frontend performance best practices
- **311-accessibility-wcag-rules.mdc** ✨ NEW: WCAG 2.1 AA accessibility implementation
- **312-documentation-standards.mdc** ✨ NEW: Code documentation, API docs, and ADR guidelines

### Mobile
- **307-flutter-riverpod-supabase-ai-rules.mdc**: Flutter development (if needed for mobile app)

## 🎓 How to Use These Rules

### In Cursor Editor
1. Rules are automatically applied based on file globs
2. `alwaysApply: true` rules are active for all files
3. `alwaysApply: false` rules activate for matching file patterns

### Rule Activation Types
- **Always**: Applied to all relevant files automatically
- **Auto**: Suggested by Cursor based on context
- **Manual**: Require explicit activation
- **AgentRequested**: Used by AI agents when needed

### Best Practices
1. **Review relevant rules** before starting a feature
2. **Follow naming conventions** defined in rules
3. **Reference related rules** using "See also" sections
4. **Keep rules concise** (ideally under 25 lines)
5. **Update rules** as patterns evolve

## 📊 New Rules Added (18 Files)

1. ✨ **004-digital-minimalist-project-overview.mdc** - Project-specific overview
2. ✨ **103-api-design-rest-conventions.mdc** - REST API standards
3. ✨ **104-security-oauth2-rules.mdc** - OAuth2 security
4. ✨ **105-testing-strategy.mdc** - Testing guidelines
5. ✨ **106-environment-configuration.mdc** - Environment management
6. ✨ **107-database-design-migration.mdc** - Database patterns
7. ✨ **108-cicd-deployment.mdc** - CI/CD pipelines
8. ✨ **109-security-best-practices.mdc** - Security standards
9. ✨ **202-error-handling-patterns.mdc** - Error handling
10. ✨ **203-logging-standards.mdc** - Logging conventions
11. ✨ **308-thymeleaf-template-rules.mdc** - Template engine
12. ✨ **309-huggingface-openai-integration.mdc** - AI/ML integration
13. ✨ **310-performance-optimization.mdc** - Performance
14. ✨ **311-accessibility-wcag-rules.mdc** - Accessibility
15. ✨ **312-documentation-standards.mdc** - Documentation
16. ✨ **313-react-state-management.mdc** - State management
17. ✨ **314-typescript-best-practices.mdc** - TypeScript
18. ✨ **315-cursor-rules-index.md** - This index file

## 🔗 Rule Dependencies

Many rules reference each other. Key relationships:

```
001-project-overview
├── 002-tech-stack
└── 003-development-guidelines

104-security-oauth2
├── 303-spring-redis (session storage)
└── 106-environment-configuration (secrets)

306-react-vite-tailwind
├── 313-react-state-management
├── 314-typescript-best-practices
└── 311-accessibility-wcag

310-performance-optimization
├── 303-spring-redis (caching)
└── 306-react-vite-tailwind (frontend optimization)
```

## 📝 Customization

To customize rules for your needs:
1. Edit the relevant `.mdc` file in `.cursor/rules/`
2. Adjust `globs` patterns to match your file structure
3. Update `alwaysApply` flag based on importance
4. Add cross-references to related rules

## 🎯 Quick Reference by Task

| Task | Relevant Rules |
|------|----------------|
| Creating REST API | 103, 104, 202, 203 |
| Building React component | 306, 313, 314, 311 |
| Database modeling | 107, 302, 310 |
| Adding AI feature | 309, 310 |
| Writing tests | 105, 100 |
| Deployment | 108, 106, 109 |
| Security implementation | 104, 109, 106 |
| Performance tuning | 310, 303, 306 |

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: November 25, 2025
**Total Rules**: 29 (18 newly added)
**Project**: Digital Minimalist Project




