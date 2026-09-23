# Software Development TODO List (default template)

Canonical copy of the checklist used when seeding a new todo list **From template**. Implementation will mirror this in `lib/template/software-dev-todo.ts`.

**Template version:** `1.0.0`

---

## 1. Requirements

- Understand the problem
- Define the goal/objective
- Identify target users
- Define user roles
- List core features
- List non-functional requirements
  - Performance
  - Security
  - Scalability
  - Availability
- Define MVP scope
- Write acceptance criteria
- Identify edge cases

## 2. Planning

- Break requirements into tasks
- Prioritize tasks
- Create milestones
- Estimate development time
- Identify technical risks
- Decide what can be automated

## 3. Architecture

- Choose frontend technology
- Choose backend technology
- Choose database
- Design system architecture
- Define frontend ↔ backend communication
- Define authentication/authorization
- Define file/storage requirements
- Define third-party integrations
- Define deployment architecture

## 4. UI/UX

- Create user flows
- Create wireframes
- Design pages/screens
- Design reusable components
- Define responsive behavior
- Define loading states
- Define empty states
- Define error states
- Define success states

## 5. Project Setup

- Create Git repository
- Initialize project
- Configure package manager
- Configure TypeScript
- Configure ESLint
- Configure formatting
- Configure environment variables
- Create .env.example
- Create project structure
- Add README
- Configure Git hooks if needed

## 6. Database

- Design entities
- Create database schema
- Define relationships
- Add indexes
- Create migrations
- Add seed data
- Configure database connection
- Test CRUD operations

## 7. Backend

- Create API structure
- Implement authentication
- Implement authorization
- Implement CRUD APIs
- Add validation
- Add error handling
- Add logging
- Add rate limiting if needed
- Add API documentation
- Handle transactions
- Handle background jobs if needed

## 8. Frontend

- Build layouts
- Build pages
- Build reusable components
- Connect APIs
- Implement forms
- Implement validation
- Implement authentication UI
- Implement loading states
- Implement error handling
- Implement responsive design
- Handle permissions/roles

## 9. Integrations

- Payment provider
- Email provider
- OAuth/social login
- File storage
- Maps
- AI/LLM
- Analytics
- Other external APIs

_Only implement the integrations actually required by the product._

## 10. Testing

**Unit tests**

- Utility functions
- Business logic
- Services

**Integration tests**

- API endpoints
- Database operations
- Authentication
- External integrations

**E2E tests**

- Signup
- Login
- Main user flow
- CRUD flow
- Logout
- Important error scenarios

**Other**

- Test edge cases
- Test permissions
- Test invalid inputs
- Test failure scenarios
- Test mobile/responsive UI

## 11. Security

- Validate user input
- Secure authentication
- Secure cookies/tokens
- Password hashing
- Authorization checks
- Protect APIs
- Prevent SQL injection
- Prevent XSS
- Configure CORS
- Protect secrets
- Add rate limiting
- Review dependencies
- Security audit

## 12. Performance

- Optimize database queries
- Add appropriate indexes
- Optimize API responses
- Add caching where useful
- Optimize frontend bundles
- Optimize images
- Lazy load where appropriate
- Check Core Web Vitals
- Load test important APIs

## 13. CI/CD

- Create CI workflow
- Install dependencies
- Run lint
- Run type checking
- Run tests
- Build application
- Run E2E tests
- Build Docker image if needed
- Push deployment artifact/image
- Deploy automatically
- Configure staging environment
- Configure production environment

## 14. Infrastructure / Cloud

- Choose hosting
- Configure domain
- Configure DNS
- Configure SSL/HTTPS
- Configure database
- Configure storage
- Configure networking
- Configure secrets
- Configure monitoring
- Configure backups
- Configure scaling

## 15. Production Readiness

- Production environment variables
- Database migrations
- Backup strategy
- Logging
- Error tracking
- Monitoring
- Health checks
- Alerts
- Rollback strategy
- Disaster recovery plan

## 16. Documentation

- README
- Local setup instructions
- Environment variables documentation
- API documentation
- Architecture documentation
- Deployment instructions
- Troubleshooting guide
- Contribution guide

## 17. Release

- Final QA
- Run complete test suite
- Fix critical bugs
- Security review
- Performance check
- Deploy to staging
- Test staging
- Deploy production
- Verify production
- Monitor after release

## 18. Maintenance

- Monitor errors
- Monitor performance
- Fix production bugs
- Update dependencies
- Review security vulnerabilities
- Optimize infrastructure costs
- Add requested features
- Refactor technical debt
- Maintain documentation
