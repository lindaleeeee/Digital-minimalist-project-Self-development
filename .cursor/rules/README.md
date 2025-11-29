# Cursor Rules Directory

This directory contains all Cursor AI rules for the **Digital Minimalist Project**.

## 📋 Overview

**Total Rules**: 36 .mdc files  
**New Rules Added**: 18 comprehensive rules  
**Coverage**: Backend, Frontend, DevOps, Security, Testing, Documentation

## 🚀 Quick Start

1. **Explore the rules**: See `315-cursor-rules-index.md` for complete overview
2. **Understand naming**: NNN-name.mdc where NNN determines priority
3. **Check applicability**: Each rule has `globs` and `alwaysApply` settings

## 📁 Rule Categories

### 🎯 Core Project Rules (000-099)
- Project vision and goals
- Tech stack definition
- Development guidelines
- Cursor tool documentation

### 🔄 Workflow & Integration (100-199)
- Error fixing process
- Build and environment setup
- Git Flow automation
- **API design conventions**
- **OAuth2 security**
- **Testing strategy**
- **Environment configuration**
- **Database design & migration**
- **CI/CD & deployment**
- **Security best practices**

### 🎨 Patterns & Style (200-299)
- Code commenting standards
- **Error handling patterns**
- **Logging standards**

### 🔧 Technology-Specific (300-399)
#### Backend
- Java/Spring Boot conventions
- Gradle build rules
- JPA/QueryDSL patterns
- Redis strategies
- Kafka patterns & Saga

#### Frontend
- React/Vite/Tailwind rules
- **React state management**
- **TypeScript best practices**

#### Integration
- **Thymeleaf templates**
- **AI/ML integration (Hugging Face, OpenAI)**
- **Performance optimization**
- **Accessibility (WCAG 2.1 AA)**
- **Documentation standards**

## 🎓 How Rules Work

### Automatic Application
Rules with `alwaysApply: true` are automatically active.

### Context-Based Application
Rules with file `globs` activate when working on matching files:
```yaml
---
description: REST API design conventions
globs: ["**/controller/**", "**/api/**"]
alwaysApply: false
---
```

### Rule Priority
Higher numbered rules take precedence when globs overlap.

## 🆕 Newly Added Rules (Nov 25, 2025)

| File | Description | Key Features |
|------|-------------|--------------|
| 004-digital-minimalist-project-overview.mdc | Project specifics | Vision, features, metrics |
| 103-api-design-rest-conventions.mdc | REST API standards | Naming, responses, status codes |
| 104-security-oauth2-rules.mdc | OAuth2 implementation | Google, KakaoTalk, JWT |
| 105-testing-strategy.mdc | Test pyramid | Unit, integration, E2E |
| 106-environment-configuration.mdc | Env management | Secrets, .env structure |
| 107-database-design-migration.mdc | DB best practices | Schema, migrations, indexing |
| 108-cicd-deployment.mdc | DevOps automation | GitHub Actions, Docker |
| 109-security-best-practices.mdc | OWASP Top 10 | Security headers, validation |
| 202-error-handling-patterns.mdc | Error management | Custom exceptions, global handlers |
| 203-logging-standards.mdc | Logging conventions | Levels, structured logging |
| 308-thymeleaf-template-rules.mdc | Template engine | Fragments, layouts, security |
| 309-huggingface-openai-integration.mdc | AI/ML services | Content analysis, summarization |
| 310-performance-optimization.mdc | Performance | Caching, lazy loading, optimization |
| 311-accessibility-wcag-rules.mdc | A11y standards | WCAG 2.1 AA compliance |
| 312-documentation-standards.mdc | Docs guidelines | Javadoc, TSDoc, ADRs |
| 313-react-state-management.mdc | State patterns | useState, Context, Zustand, React Query |
| 314-typescript-best-practices.mdc | TypeScript | Type safety, generics, type guards |
| 315-cursor-rules-index.md | Master index | Complete overview |

## 📖 Reading the Rules

Each rule file follows this structure:

```yaml
---
description: Brief description of the rule
globs: ["**/pattern/**"]  # File patterns where rule applies
alwaysApply: false        # true for global rules
---
# Rule Title

## Sections
Content with examples, code snippets, and best practices

## See also:
- [related-rule.mdc](related-rule.mdc)
```

## 🔗 Common Use Cases

### Starting a New Feature
1. Review `001-project-overview.mdc` for project context
2. Check relevant tech-specific rules (300-399 series)
3. Follow patterns from 200-299 series

### API Development
- `103-api-design-rest-conventions.mdc`
- `104-security-oauth2-rules.mdc`
- `202-error-handling-patterns.mdc`
- `203-logging-standards.mdc`

### Frontend Development
- `306-react-vite-tailwind-rules.mdc`
- `313-react-state-management.mdc`
- `314-typescript-best-practices.mdc`
- `311-accessibility-wcag-rules.mdc`

### Database Work
- `107-database-design-migration.mdc`
- `302-jpa-querydsl-dynamic-query-rules.mdc`
- `310-performance-optimization.mdc`

### Deployment & DevOps
- `108-cicd-deployment.mdc`
- `106-environment-configuration.mdc`
- `109-security-best-practices.mdc`

## 🛠️ Customizing Rules

To modify or add rules:

1. **Create new file**: Use appropriate NNN prefix
2. **Add frontmatter**: Set description, globs, alwaysApply
3. **Write content**: Keep concise (ideally < 25 lines)
4. **Add references**: Link to related rules
5. **Update index**: Add entry to `315-cursor-rules-index.md`

## 📊 Coverage Map

```
Digital Minimalist Project
│
├── Backend (Spring Boot)
│   ├── ✅ API Design
│   ├── ✅ Security & Auth
│   ├── ✅ Database
│   ├── ✅ Caching (Redis)
│   ├── ✅ Messaging (Kafka)
│   └── ✅ Error Handling
│
├── Frontend (React)
│   ├── ✅ Component Development
│   ├── ✅ State Management
│   ├── ✅ TypeScript
│   ├── ✅ Styling (Tailwind)
│   └── ✅ Accessibility
│
├── AI/ML Integration
│   ├── ✅ OpenAI
│   └── ✅ Hugging Face
│
├── DevOps
│   ├── ✅ CI/CD
│   ├── ✅ Docker
│   ├── ✅ Environment Config
│   └── ✅ Deployment
│
└── Cross-Cutting
    ├── ✅ Testing
    ├── ✅ Logging
    ├── ✅ Documentation
    ├── ✅ Performance
    └── ✅ Security
```

## 🎯 Next Steps

1. **Review** the master index: `315-cursor-rules-index.md`
2. **Customize** rules for your specific needs
3. **Enable/Disable** rules via Cursor settings
4. **Keep updated** as project evolves
5. **Share** with team members

## 📚 Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [.mdc File Format Guide](010-cursor-rules.mdc)
- [Project Tech Stack](002-tech-stack.mdc)

---

**Generated**: November 25, 2025  
**Project**: Digital Minimalist Project  
**Purpose**: Comprehensive AI-assisted development rules

For questions or suggestions, update this README or relevant rule files.




