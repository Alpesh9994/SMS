# Multi-Tenant Indian School Management System – Step-by-Step Plan

## 1. Overview
This plan outlines the step-by-step process to build a scalable, multi-tenant school management system for Indian schools, using only open-source and free tools. Each step includes unit testing as a core requirement.

---

## 1.1 Design Guidelines
The website should have a modern, clean, and visually soothing design. Use a minimalistic and spacious layout with a strong focus on clarity and ease of use. The color palette should be calm and eye-friendly (soft blues, greens, or pastel shades). Incorporate lots of white space, rounded elements, subtle shadows, and smooth transitions. Typography should be simple, elegant, and highly readable. The overall design should feel like a breath of fresh air—relaxing on the eyes, clean, and professional.

## 2. Technology Stack
- **Frontend:** Angular 20, Angular Material, Bootstrap
- **Backend:** NestJS (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Testing:** Jest (backend), Jasmine/Karma (frontend)

---

## 3. Step-by-Step Plan

### Step 1: Backend Setup (NestJS + Prisma + PostgreSQL via Docker)
1. Install Node.js (LTS) and npm.
2. Install NestJS CLI globally.
3. Create a new NestJS project.
4. Install and configure Prisma ORM.
5. Set up PostgreSQL using Docker (recommended for easy setup and portability).
6. Create initial data models (Tenant, User, etc.) in Prisma schema.
7. Generate and run database migrations.
8. Implement basic REST APIs for Tenant and User management.
9. Add JWT authentication and role-based guards.
10. Write unit tests for all APIs and services.

### Step 2: Frontend Setup (Angular 20)
1. Install Angular CLI globally.
2. Create a new Angular project.
3. Set up Angular Material and Bootstrap.
4. Scaffold basic layouts and navigation.
5. Implement login and role-based routing.
6. Build Super Admin and School Admin dashboards.
7. Connect frontend to backend APIs.
8. Write unit tests for components and services.

### Step 3: Core Features (Sequential Workflow)

#### **Role-Based Permissions:**
- **Super Admin:** Can ONLY create/edit/delete/disable tenants and assign school admins. CANNOT create school-specific data.
- **School Admin:** Full CRUD for own tenant data only (subjects, teachers, students, timetables).

#### **Data Creation Workflow (Must Follow This Order):**
1. **Subjects** → Create first (required for teacher assignment)
2. **Teachers** → Create second (assign subjects during creation)
3. **Standards & Divisions** → Create third (STD 1-12, divisions A/B/C/D, assign class teachers, set student capacity)
4. **Students** → Create fourth (assign to standard/division, auto-generate roll numbers)
5. **Timetable** → Create last (requires all above components)

#### **Detailed Features:**
- **Tenant Onboarding (Super Admin):**
  - CRUD for school tenants (name, address, logo, admin email).
  - Assign school admins to tenants.
- **School Management (School Admin):**
  - Subject management with codes and descriptions.
  - Teacher management with subject assignments.
  - Standard/Division setup with class teacher assignment and capacity limits.
  - Student enrollment with auto roll number generation.
  - Batch promotion workflows.
- **Timetable Builder:**
  - Configurable period duration (30/45/60 minutes with more options).
  - Set number of periods per day and break slots.
  - Assign subjects/teachers to period slots per division.

### Step 4: Testing
- Write unit tests for backend (NestJS, Jest).
- Write unit tests for frontend (Angular, Jasmine/Karma).
- (Optional) Add end-to-end tests (Cypress or similar).

### Step 5: Documentation & Learning
- Document each step, code, and test.
- Use only open-source/free tools.
- Learn by doing: follow this plan and refer to documentation as needed.

---

## 4. Task Management
- Break down each major feature into small, manageable tasks.
- For each step: explain, provide commands/code, show how to run/test, and include unit tests.

---

## 5. Next Steps
1. Decide on PostgreSQL setup: Docker (recommended) or local install.
2. Begin with backend setup (Node.js, NestJS CLI, project creation).
3. Follow this plan step by step, asking for guidance as needed.

---

## 6. Module-Wise Task Breakdown

### 6.1 School (Tenant) Module
- **Backend:**
  1. Design Tenant (School) model in Prisma schema.
  2. Create migration for Tenant table.
  3. Implement Tenant service and controller (CRUD APIs).
  4. Add validation and error handling.
  5. Write unit tests for service and controller.
- **Frontend:**
  1. Create School (Tenant) management components (list, add, edit, delete).
  2. Connect to backend APIs.
  3. Add Angular Material UI for forms and tables.
  4. Write unit tests for components and services.

### 6.2 Admin (User) Module
- **Backend:**
  1. Design User model (with roles: Super Admin, School Admin, etc.).
  2. Create migration for User table.
  3. Implement authentication (JWT) and role-based guards.
  4. Implement User service and controller (CRUD APIs).
  5. Write unit tests for authentication, service, and controller.
- **Frontend:**
  1. Create login and registration components.
  2. Implement role-based routing and guards.
  3. Create Admin dashboard.
  4. Write unit tests for components and services.

### 6.3 Teacher Module
- **Backend:**
  1. Design Teacher model (linked to Tenant).
  2. Create migration for Teacher table.
  3. Implement Teacher service and controller (CRUD APIs).
  4. Write unit tests for service and controller.
- **Frontend:**
  1. Create Teacher management components (list, add, edit, delete).
  2. Connect to backend APIs.
  3. Write unit tests for components and services.

### 6.4 Classes & Division Module
- **Backend:**
  1. Design Standard (Class) and Division models.
  2. Create migrations for Standard and Division tables.
  3. Implement services and controllers (CRUD APIs for both).
  4. Write unit tests for services and controllers.
- **Frontend:**
  1. Create Class and Division management components.
  2. Add UI for assigning class teachers and setting division capacity.
  3. Connect to backend APIs.
  4. Write unit tests for components and services.

### 6.5 Student Module
- **Backend:**
  1. Design Student model (linked to Tenant, Standard, Division).
  2. Create migration for Student table.
  3. Implement Student service and controller (CRUD APIs, enrollment, promotion).
  4. Write unit tests for service and controller.
- **Frontend:**
  1. Create Student management components (list, add, edit, promote, delete).
  2. Implement enrollment and promotion workflows.
  3. Connect to backend APIs.
  4. Write unit tests for components and services.

### 6.6 Timetable Module
- **Backend:**
  1. Design TimetableSlot model (linked to Division, Teacher, Subject).
  2. Create migration for TimetableSlot table.
  3. Implement Timetable service and controller (CRUD APIs).
  4. Write unit tests for service and controller.
- **Frontend:**
  1. Create Timetable builder UI (drag-and-drop or form-based).
  2. Connect to backend APIs.
  3. Write unit tests for components and services.

---

**For each module:**
- Ensure proper validation, error handling, and security (role-based access).
- Write comprehensive unit tests for backend and frontend.
- Document API endpoints and UI workflows.

---

## 7. Project & Task Management with Task Master

To streamline development, we will use [Task Master](https://www.task-master.dev/) (free tier) for:
- Creating and organizing project tasks and subtasks for each module (School, Admin, Teacher, etc.).
- Breaking down complex modules into manageable subtasks.
- Tracking progress visually and systematically.
- Ensuring that unit testing and documentation are included as part of each task.
- Managing priorities and deadlines as needed.

**How to use:**
1. Sign up for a free account at [Task Master](https://www.task-master.dev/).
2. Create a new project for the LMS.
3. Add main modules as tasks (School, Admin, Teacher, Classes, Division, Student, Timetable, etc.).
4. For each module, add subtasks for backend, frontend, unit testing, and documentation.
5. Update task status as you progress (To Do, In Progress, Done).
6. Use Task Master's AI features to help generate or refine task breakdowns if needed.

This approach will help you stay organized, track your learning, and ensure nothing is missed during development. 