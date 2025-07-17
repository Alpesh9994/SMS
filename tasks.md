# Project Task List – Multi-Tenant Indian School Management System

+> **Design Guideline:** All UI/UX should be modern, clean, minimal, and visually soothing. Use soft blues/greens/pastels, lots of white space, rounded elements, subtle shadows, smooth transitions, and elegant, readable typography.

## 📋 **Data Creation Workflow (Sequential Order)**
1. **Subjects** → Create first (required for teachers)
2. **Teachers** → Create second (assign subjects, required for class teachers)
3. **Standards & Divisions** → Create third (assign class teachers, set capacity)
4. **Students** → Create fourth (assign to standard/division)
5. **Timetable** → Create last (requires all above components)

## 🔐 **Role-Based Permissions**
- **Super Admin**: Create/Edit/Delete/Disable tenants, Assign school admins only
- **School Admin**: Full CRUD for own school data only (subjects, teachers, students, etc.)

Use this file to track your progress. Check off each subtask as you complete it!

---

## 1. School (Tenant) Module
- [x] **Backend**
  - [x] Design Tenant (School) model in Prisma schema
  - [x] Create migration for Tenant table
  - [x] Create DTO files for Tenant module
  - [x] Implement Tenant service
  - [x] Implement Tenant controller (CRUD APIs)
  - [x] Add validation and error handling
  - [x] Write unit tests for service and controller
  - [x] Document API endpoints
- [x] **Frontend**
  - [x] Create School management components (list, add, edit, delete)
  - [x] Connect to backend APIs
  - [x] Add Angular Material UI for forms and tables
  - [x] Write unit tests for components and services
  - [x] Document UI workflows

---

## 2. User (Admin) Module
- [x] **Backend**
  - [x] Design User model with roles (Super Admin, School Admin, Teacher, Student)
  - [x] Create migration for User table
  - [x] Implement JWT authentication with bcrypt password hashing
  - [x] Implement role-based guards and decorators (@Roles)
  - [x] Create public route decorator (@Public)
  - [x] Implement User service and controller (CRUD APIs)
  - [x] Write unit tests for authentication, service, and controller
  - [x] Document API endpoints
- [x] **Role-Based Access Control (RBAC)**
  - [x] Super Admin permissions: Create/Edit/Delete/Disable tenants, Assign school admins
  - [x] Super Admin restrictions: CANNOT create school-specific data (subjects, teachers, students)
  - [x] School Admin permissions: Full CRUD for own tenant data only
  - [x] Tenant isolation: Ensure users can only access their tenant's data
  - [x] Add middleware for tenant-based data filtering
- [ ] **Frontend**
  - [ ] Create login and registration components
  - [ ] Implement role-based routing and guards
  - [ ] Create Super Admin dashboard (tenant management only)
  - [ ] Create School Admin dashboard (full school management)
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 3. Subject Module (Create FIRST in workflow)
- [x] **Backend**
  - [x] Design Subject model (linked to Tenant)
  - [x] Create migration for Subject table
  - [x] Implement Subject service and controller (CRUD APIs)
  - [x] Write unit tests for service and controller
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Subject management components (list, add, edit, delete)
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 4. Teacher Module (Create SECOND - after Subjects)
- [ ] **Backend**
  - [x] Design Teacher model (linked to Tenant, many-to-many with Subject)
  - [x] Create migration for Teacher table
  - [x] Implement Teacher service and controller (CRUD APIs)
  - [x] Add subject assignment functionality during teacher creation
  - [x] Write unit tests for service and controller
  - [] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Teacher management components (list, add, edit, delete)
  - [ ] Add subject selection UI during teacher creation/editing
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 5. Standard & Division Module (Create THIRD - after Teachers)
- [ ] **Backend**
  - [x] Design Standard (1-12) and Division (A,B,C,D etc.) models
  - [x] Create migrations for Standard and Division tables
  - [x] Implement services and controllers (CRUD APIs for both)
  - [x] Add class teacher assignment functionality
  - [x] Add student capacity limits per division
  - [ ] Write unit tests for services and controllers
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Standard and Division management components
  - [ ] Add UI for assigning class teachers from existing teachers
  - [ ] Add UI for setting division student capacity limits
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 6. Student Module (Create FOURTH - after Standards & Divisions)
- [x] **Backend**
  - [x] Design Student model (linked to Tenant, Standard, Division)
  - [x] Create migration for Student table
  - [x] Implement Student service and controller (CRUD APIs, enrollment, promotion)
  - [x] Add auto-generate roll number functionality
  - [x] Add standard/division assignment during enrollment
  - [x] Add batch promotion workflow
- [ ] **Frontend**
  - [ ] Create Student management components (list, add, edit, promote, delete)
  - [ ] Implement enrollment wizard with standard/division selection
  - [ ] Add auto roll number generation display
  - [ ] Implement batch promotion workflows
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 7. Timetable Module (Create LAST - after all other modules)
- [ ] **Backend**
  - [ ] Design TimetableSlot model (linked to Division, Teacher, Subject)
  - [ ] Create migration for TimetableSlot table
  - [ ] Implement configurable period duration (30/45/60 minutes with more options)
  - [ ] Add period number and break slot configuration
  - [ ] Implement Timetable service and controller (CRUD APIs)
  - [ ] Write unit tests for service and controller
  - [ ] Document API endpoints
- [ ] **Admin Configurables**
  - [ ] Set number of periods per day
  - [ ] Configure break slots between periods
  - [ ] Set different period durations for different schools
- [ ] **Frontend**
  - [ ] Create Timetable builder UI (drag-and-drop or form-based)
  - [ ] Add period configuration interface for admins
  - [ ] Add break slot management UI
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 8. General & Cross-Cutting Tasks
- [ ] Set up project repositories (backend & frontend)
- [ ] Set up Docker for PostgreSQL
- [ ] Configure environment variables and secrets
- [ ] Set up CI for automated testing
- [ ] Write and maintain project documentation
- [ ] Regularly update checklists and progress 