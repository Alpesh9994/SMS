# Project Task List – Multi-Tenant Indian School Management System

+> **Design Guideline:** All UI/UX should be modern, clean, minimal, and visually soothing. Use soft blues/greens/pastels, lots of white space, rounded elements, subtle shadows, smooth transitions, and elegant, readable typography.

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

## 2. Admin (User) Module
- [ ] **Backend**
  - [x] Design User model (with roles: Super Admin, School Admin, etc.)
  - [x] Create migration for User table
  - [x] Implement authentication (JWT)
  - [x] Implement role-based guards
  - [x] Implement User service and controller (CRUD APIs)
  - [ ] Write unit tests for authentication, service, and controller
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create login and registration components
  - [ ] Implement role-based routing and guards
  - [ ] Create Admin dashboard
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 3. Subject Module
- [x] **Backend**
  - [x] Design Subject model (linked to Tenant)
  - [x] Create migration for Subject table
  - [x] Implement Subject service and controller (CRUD APIs)
  - [ ] Write unit tests for service and controller
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Subject management components (list, add, edit, delete)
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 4. Teacher Module
- [ ] **Backend**
  - [ ] Design Teacher model (linked to Tenant, many-to-many with Subject)
  - [ ] Create migration for Teacher table
  - [ ] Implement Teacher service and controller (CRUD APIs)
  - [ ] Write unit tests for service and controller
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Teacher management components (list, add, edit, delete)
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 5. Classes & Division Module
- [ ] **Backend**
  - [ ] Design Standard (Class) and Division models
  - [ ] Create migrations for Standard and Division tables
  - [ ] Implement services and controllers (CRUD APIs for both)
  - [ ] Write unit tests for services and controllers
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Class and Division management components
  - [ ] Add UI for assigning class teachers and setting division capacity
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 6. Student Module
- [ ] **Backend**
  - [ ] Design Student model (linked to Tenant, Standard, Division)
  - [ ] Create migration for Student table
  - [ ] Implement Student service and controller (CRUD APIs, enrollment, promotion)
  - [ ] Write unit tests for service and controller
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Student management components (list, add, edit, promote, delete)
  - [ ] Implement enrollment and promotion workflows
  - [ ] Connect to backend APIs
  - [ ] Write unit tests for components and services
  - [ ] Document UI workflows

---

## 7. Timetable Module
- [ ] **Backend**
  - [ ] Design TimetableSlot model (linked to Division, Teacher, Subject)
  - [ ] Create migration for TimetableSlot table
  - [ ] Implement Timetable service and controller (CRUD APIs)
  - [ ] Write unit tests for service and controller
  - [ ] Document API endpoints
- [ ] **Frontend**
  - [ ] Create Timetable builder UI (drag-and-drop or form-based)
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