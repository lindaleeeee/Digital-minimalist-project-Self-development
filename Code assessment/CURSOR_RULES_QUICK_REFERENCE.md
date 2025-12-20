# 🚀 Cursor Rules Quick Reference Card

## 📍 Rule Number Guide

| Range | Category | Examples |
|-------|----------|----------|
| **000-099** | Core/Project-wide | Project overview, tech stack, guidelines |
| **100-199** | Workflow/Integration | API design, security, testing, CI/CD |
| **200-299** | Patterns/Style | Error handling, logging, commenting |
| **300-399** | Technology-specific | Spring, React, Kafka, Redis, AI/ML |

---

## 🎯 Quick Task Finder

### 🔨 I'm building...

#### An API Endpoint
```
→ 103 (REST conventions)
→ 104 (OAuth2 security)
→ 202 (Error handling)
→ 203 (Logging)
```

#### A React Component
```
→ 306 (React/Vite/Tailwind)
→ 313 (State management)
→ 314 (TypeScript)
→ 311 (Accessibility)
```

#### A Database Table
```
→ 107 (Database design)
→ 302 (JPA/QueryDSL)
→ 310 (Performance/indexing)
```

#### An AI Feature
```
→ 309 (OpenAI/Hugging Face)
→ 303 (Redis caching)
→ 310 (Performance)
```

#### A Test Suite
```
→ 105 (Testing strategy)
→ 100 (Error fixing)
→ 201 (Code comments)
```

#### A Deployment Pipeline
```
→ 108 (CI/CD)
→ 106 (Environment config)
→ 109 (Security)
```

---

## 📚 Essential Rules by Role

### 🎨 Frontend Developer
| Priority | Rule | Focus |
|----------|------|-------|
| ⭐⭐⭐ | 306 | React/Vite/Tailwind basics |
| ⭐⭐⭐ | 313 | State management |
| ⭐⭐⭐ | 314 | TypeScript |
| ⭐⭐ | 311 | Accessibility |
| ⭐⭐ | 310 | Performance |
| ⭐ | 308 | Thymeleaf integration |

### ⚙️ Backend Developer
| Priority | Rule | Focus |
|----------|------|-------|
| ⭐⭐⭐ | 103 | REST API design |
| ⭐⭐⭐ | 104 | OAuth2 security |
| ⭐⭐⭐ | 107 | Database design |
| ⭐⭐ | 300 | Spring Boot |
| ⭐⭐ | 302 | JPA/QueryDSL |
| ⭐⭐ | 303 | Redis |
| ⭐ | 304/305 | Kafka |

### 🤖 AI/ML Developer
| Priority | Rule | Focus |
|----------|------|-------|
| ⭐⭐⭐ | 309 | OpenAI/Hugging Face |
| ⭐⭐ | 310 | Performance/caching |
| ⭐⭐ | 303 | Redis |
| ⭐ | 202 | Error handling |

### 🚀 DevOps Engineer
| Priority | Rule | Focus |
|----------|------|-------|
| ⭐⭐⭐ | 108 | CI/CD pipelines |
| ⭐⭐⭐ | 106 | Environment config |
| ⭐⭐⭐ | 109 | Security |
| ⭐⭐ | 203 | Logging |
| ⭐ | 101 | Build setup |

---

## 🔐 Security Checklist

```bash
✅ 104 - OAuth2 configured (Google, KakaoTalk)
✅ 109 - OWASP Top 10 mitigated
✅ 106 - Secrets not in code
✅ 107 - Database properly indexed
✅ 108 - Security scanning in CI/CD
✅ 203 - No PII in logs
```

---

## 🧪 Testing Checklist

```bash
✅ 105 - Test pyramid followed (70/20/10)
✅ Unit tests with JUnit 5 + Mockito
✅ Integration tests with @SpringBootTest
✅ Frontend tests with React Testing Library
✅ E2E tests with Playwright
✅ 80%+ coverage on critical paths
```

---

## 📊 Performance Checklist

```bash
✅ 310 - Database queries optimized
✅ 310 - React code split and memoized
✅ 303 - Redis caching implemented
✅ 107 - Proper database indexes
✅ 310 - Images optimized (WebP, lazy load)
✅ 306 - Bundle size < 200KB
```

---

## ♿ Accessibility Checklist

```bash
✅ 311 - Semantic HTML used
✅ 311 - ARIA labels on interactive elements
✅ 311 - Keyboard navigation works
✅ 311 - Color contrast 4.5:1 minimum
✅ 311 - Screen reader tested
✅ 311 - Forms properly labeled
```

---

## 📝 Code Quality Checklist

```bash
✅ 201 - Meaningful comments
✅ 202 - Consistent error handling
✅ 203 - Structured logging
✅ 312 - API documented (Swagger)
✅ 314 - TypeScript strict mode
✅ 300 - Java best practices
```

---

## 🔗 Common Rule Combinations

### Starting New Feature
```
001 (Overview) → 002 (Tech stack) → 003 (Guidelines)
```

### REST API Development
```
103 (API design) → 104 (Security) → 202 (Errors) → 203 (Logging)
```

### React Component Development
```
306 (React basics) → 313 (State) → 314 (TypeScript) → 311 (A11y)
```

### Database Work
```
107 (Design) → 302 (JPA) → 310 (Performance) → 105 (Testing)
```

### AI Feature
```
309 (AI integration) → 303 (Redis cache) → 310 (Performance) → 202 (Errors)
```

### Deployment
```
106 (Env config) → 108 (CI/CD) → 109 (Security) → 203 (Logging)
```

---

## 🎨 File Pattern → Active Rules

| File Pattern | Auto-Active Rules |
|--------------|-------------------|
| `**/controller/**` | 103, 104, 202, 203, 300 |
| `**/*.tsx` | 306, 313, 314, 311 |
| `**/entity/**` | 107, 302, 300 |
| `**/templates/**` | 308, 311 |
| `**/test/**` | 105 |
| `Dockerfile` | 108 |
| `.env*` | 106, 109 |

---

## 💡 Pro Tips

1. **Start Broad**: Begin with 001-004 for project context
2. **Go Specific**: Then dive into relevant 300-series rules
3. **Cross-Reference**: Follow "See also" sections
4. **Customize**: Edit rules to match your team's needs
5. **Keep Updated**: Rules evolve with your project

---

## 🆘 Troubleshooting

| Problem | Check Rules |
|---------|-------------|
| Build fails | 101, 106 |
| API errors | 103, 202 |
| Auth issues | 104 |
| DB slow | 107, 310 |
| Tests failing | 105 |
| Deploy fails | 108 |
| Security scan fails | 109 |
| A11y issues | 311 |
| TypeScript errors | 314 |

---

## 📍 Important Files

```
.cursor/rules/
  ├── README.md                          ← Start here
  ├── 315-cursor-rules-index.md          ← Complete index
  └── [rule files]

CURSOR_RULES_GENERATION_SUMMARY.md       ← Full summary
```

---

## 🎯 Success Metrics

| Area | Target | Rule |
|------|--------|------|
| Test Coverage | >80% | 105 |
| API Response | <200ms p95 | 310 |
| Bundle Size | <200KB | 306, 310 |
| Security Score | A+ | 109 |
| Accessibility | WCAG 2.1 AA | 311 |
| Uptime | >99.9% | 108 |

---

## 📞 Quick Access

- **Master Index**: `.cursor/rules/315-cursor-rules-index.md`
- **Directory README**: `.cursor/rules/README.md`
- **Full Summary**: `CURSOR_RULES_GENERATION_SUMMARY.md`
- **This Card**: `CURSOR_RULES_QUICK_REFERENCE.md`

---

## ⚡ Keyboard Shortcuts (Cursor)

- `Cmd/Ctrl + Shift + P` → "Cursor: Rules" → Manage rules
- `Cmd/Ctrl + K` → Ask AI about rules
- `Cmd/Ctrl + L` → Chat with context

---

**Print this card and keep it handy! 📌**

*Last updated: November 25, 2025*








