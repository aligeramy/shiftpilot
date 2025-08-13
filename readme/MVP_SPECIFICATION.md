# ShiftPilot MVP - Radiology Scheduling Platform

## Product Overview

ShiftPilot is a configurable, multi-tenant web platform that automates fair, constraint-aware scheduling for medical groups. The MVP focuses on core scheduling functionality with vacation management, shift assignment, and basic swap capabilities.

## MVP Core Features

### 1. Multi-Tenant Foundation
- Organization-based data isolation
- Role-based access control (Admin, Chief, Radiologist)
- Tenant configuration system

### 2. User & Roster Management
- User profiles with subspecialties and FTE
- Role assignment and permissions
- Basic user onboarding

### 3. Shift Configuration
- Configurable shift types with time windows
- Eligibility rules (subspecialty-based, allow-any, named)
- Recurrence patterns (weekdays/weekends)

### 4. Vacation Management
- Monthly vacation preferences (1st, 2nd, 3rd choice)
- Fairness ledger for tie-breaking
- Administrative approval workflow

### 5. Schedule Generation Engine
- Constraint-aware assignment algorithm
- FTE-based part-time day allocation
- Fairness distribution across radiologists

### 6. Basic Calendar Views
- Master schedule view with filtering
- Personal calendar for each user
- Simple export functionality

### 7. Core Swap System
- Same-type shift swaps
- Sequential offer workflow
- Basic approval process

## Step-by-Step Deliverables

### Phase 1: Foundation & Authentication (Week 1-2)
**Deliverables:**
- [ ] Project setup with Next.js 15, TypeScript, Tailwind CSS
- [ ] Database schema design (PostgreSQL)
- [ ] Authentication system (NextAuth.js)
- [ ] Multi-tenant data architecture
- [ ] Basic role-based access control
- [ ] Landing page and login flow

**Acceptance Criteria:**
- Users can register and login
- Tenant isolation is enforced
- Basic admin/user role distinction works
- Database schema supports all core entities

### Phase 2: Organization Setup (Week 3)
**Deliverables:**
- [ ] Organization configuration UI
- [ ] Subspecialty management
- [ ] Shift type creation and editing
- [ ] Eligibility rule configuration
- [ ] Basic validation and error handling

**Acceptance Criteria:**
- Admins can create and configure organizations
- Shift types can be defined with eligibility rules
- Configuration validates against business rules
- Data persists correctly across sessions

### Phase 3: User Management & Roster (Week 4)
**Deliverables:**
- [ ] User profile management
- [ ] Roster import/export functionality
- [ ] FTE and subspecialty assignment
- [ ] User invitation system
- [ ] Basic user directory

**Acceptance Criteria:**
- Admins can import user rosters via CSV
- Users can complete their profiles
- FTE percentages map to correct PT day allocations
- Email invitations work properly

### Phase 4: Vacation Management (Week 5-6)
**Deliverables:**
- [ ] Monthly vacation preference submission
- [ ] Vacation window management (open/lock dates)
- [ ] Fairness ledger implementation
- [ ] Vacation resolution algorithm
- [ ] Admin vacation review interface

**Acceptance Criteria:**
- Users can submit ranked vacation preferences
- Fairness algorithm resolves conflicts correctly
- Admins can review and approve vacation assignments
- System tracks fairness scores over time

### Phase 5: Schedule Generation Engine (Week 7-8)
**Deliverables:**
- [ ] Shift instance generation from shift types
- [ ] Core assignment algorithm
- [ ] Availability calculation (vacation + PT days)
- [ ] Eligibility checking and enforcement
- [ ] Load balancing across radiologists
- [ ] Generation audit trail

**Acceptance Criteria:**
- System generates valid shift assignments
- All eligibility rules are enforced
- Workload is distributed fairly
- Generation is deterministic with seed
- Empty pools are flagged for admin review

### Phase 6: Calendar Views & Basic UI (Week 9)
**Deliverables:**
- [ ] Master calendar with filtering
- [ ] Personal calendar views
- [ ] Schedule publishing workflow
- [ ] Basic search and filter functionality
- [ ] Mobile-responsive design

**Acceptance Criteria:**
- Calendars display schedules clearly
- Filtering works by person, subspecialty, shift type
- Users can view their personal schedules
- UI is usable on mobile devices

### Phase 7: Basic Swap System (Week 10)
**Deliverables:**
- [ ] Same-type swap request creation
- [ ] Eligible swap partner identification
- [ ] Sequential offer workflow
- [ ] Swap approval process
- [ ] Swap history and audit

**Acceptance Criteria:**
- Users can request swaps for their assignments
- System identifies eligible swap partners
- Sequential offers work correctly
- Approved swaps update schedules properly

### Phase 8: Testing & Polish (Week 11-12)
**Deliverables:**
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Error handling and user feedback
- [ ] Documentation and help system
- [ ] Deployment setup and monitoring

**Acceptance Criteria:**
- All core functionality tested and working
- System handles edge cases gracefully
- Performance meets requirements
- Documentation is complete
- System is deployed and monitored

## Technical Architecture

### Frontend
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand + React Query
- **Calendar:** FullCalendar.js or custom calendar component
- **Forms:** React Hook Form + Zod validation

### Backend
- **API:** Next.js API routes with TypeScript
- **Database:** PostgreSQL with Prisma ORM - Neon
- **Authentication:** NextAuth.js with JWT
- **Email:** Resend
- **File Storage:** Vercel Blob

### Database Schema (Key Tables)
```sql
organizations
users
subspecialties
shift_types
shift_instances
vacation_preferences
assignments
fairness_ledger
swaps
audit_logs
```

### Key Business Rules (MVP)
1. **Vacation:** 1 week per month, 3 ranked choices, fairness-based resolution
2. **FTE Mapping:** 60-69%=8 PT days, 70-79%=6 PT days, etc.
3. **Eligibility:** Subspecialty-based, allow-any, or named restrictions
4. **Fairness:** Scoring system for vacation tie-breaking and workload distribution
5. **Swaps:** Same shift type only, sequential offers, approval required

## Success Metrics (MVP)

### Functional
- [ ] 100% of shift instances can be assigned or flagged
- [ ] Vacation conflicts resolved fairly using ledger system
- [ ] Schedule generation completes within 30 seconds
- [ ] All eligibility rules enforced without exceptions

### User Experience
- [ ] Admin can configure organization in under 30 minutes
- [ ] Users can submit vacation preferences in under 5 minutes
- [ ] Schedule viewing and filtering is intuitive
- [ ] Swap requests can be completed in under 2 minutes

### Technical
- [ ] System supports 50+ concurrent users
- [ ] Database queries perform under 100ms
- [ ] 99.9% uptime during business hours
- [ ] All user actions are audit logged

## Post-MVP Roadmap

### Phase 9: Advanced Features
- Equivalence sets for flexible swaps
- Google Calendar sync
- Advanced reporting and payouts
- Holiday and premium handling

### Phase 10: Enhanced UX
- Real-time notifications
- Advanced filtering and search
- Bulk operations
- Mobile app

### Phase 11: Enterprise Features
- Advanced constraint solver (OR-Tools)
- Custom fairness algorithms
- API integrations
- Advanced analytics

## Risk Mitigation

### Technical Risks
- **Complex scheduling logic:** Start with heuristic algorithm, plan for constraint solver
- **Performance with large datasets:** Implement pagination and caching early
- **Multi-tenant complexity:** Design data isolation from day one

### Business Risks
- **Changing requirements:** Use configuration-driven approach
- **User adoption:** Focus on intuitive UX and gradual rollout
- **Data migration:** Plan import/export tools early

## Getting Started

1. **Prerequisites:** Node.js 18+, PostgreSQL 14+, Git
2. **Setup:** Clone repo, install dependencies, setup database
3. **Development:** Run local dev server, setup test data
4. **Deployment:** Vercel/Railway for hosting, Supabase for database

This MVP specification provides a solid foundation for the radiology scheduling platform while maintaining flexibility for future enhancements and customization.