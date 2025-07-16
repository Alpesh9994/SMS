# Product Requirements Document (PRD)

## Multi-Tenant Indian School Management System

---

## 1. Introduction
A scalable, multi-tenant school management system tailored for Indian schools, supporting Super Admin, School Admin, Teacher, Student, and Parent roles, with modular extensibility.

---

## 2. Goals
- [ ] Enable Super Admin to onboard/manage schools (tenants)
- [ ] Empower School Admins to manage school-specific data (teachers, students, classes, timetable)
- [ ] Provide core modules with extensibility for online learning, exams, events, etc.

---

## 3. Stakeholders & Personas
| Role           | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| Super Admin    | Central authority; manages tenants (schools) and global settings.           |
| School Admin   | Manages a single school's data and users.                                   |
| Teacher        | Views timetable, records attendance, manages assigned classes/divisions.     |
| Student/Parent | Views timetable, enrollment, events, and online courses (future).           |

---

## 4. MVP Features (Checklists)

### 4.1 Tenant Onboarding (Super Admin)
- [ ] Create new school tenant (name, address, contact, logo, admin email)
- [ ] List, edit, disable/enable existing tenants
- [ ] Assign one Super Admin user per tenant (the School Admin)

### 4.2 Authentication & Authorization
- [ ] JWT-based login for all roles
- [ ] Role-based access: Super Admin, School Admin, Teacher, Parent/Student

### 4.3 School Admin Dashboard
- [ ] CRUD Teachers (name, subjects, contact info)
- [ ] CRUD Standards & Divisions; set capacity; assign class teacher
- [ ] Enrollment wizard: add new student; auto-generate roll; edit students; promote batch
- [ ] Timetable builder: assign subjects/teachers to period slots; save/modify per Division

### 4.4 Admin Configurables
- [ ] Editable period duration
- [ ] Set number of periods per day
- [ ] Configure break slots

---

## 5. Non-Functional Requirements
- [ ] Scalability: Support hundreds of tenants, thousands of users
- [ ] Performance: Page load ≤ 2s; API response ≤ 500ms under load
- [ ] Security: SSL/TLS, hashed passwords, role enforcement
- [ ] Availability: 99.9% uptime, auto-retry on DB errors
- [ ] Maintainability: Layered, modular, tested code
- [ ] Usability: Mobile-responsive, Angular Material UI
- [ ] **Design:** Modern, clean, and visually soothing. Minimalistic and spacious, with a strong focus on clarity and ease of use. Use a calm, eye-friendly color palette (soft blues, greens, or pastel shades). Incorporate lots of white space, rounded elements, subtle shadows, and smooth transitions. Typography should be simple, elegant, and highly readable. The design should feel like a breath of fresh air—relaxing on the eyes, clean, and professional.

---

## 6. High-Level Architecture
- [ ] Angular 20 + Angular Material + Bootstrap (frontend)
- [ ] NestJS (TypeScript, backend)
- [ ] Prisma ORM
- [ ] PostgreSQL (tenant-aware schema or row-level tenancy)

---

## 7. Data Model (MVP)
- [ ] Tenant (id, name, config, createdAt)
- [ ] User (id, tenantId, name, email, role, passwordHash)
- [ ] Standard (id, tenantId, level 1–12, category Primary/Middle/High)
- [ ] Division (id, standardId, name A–D, capacity, classTeacherId)
- [ ] Student (id, tenantId, name, dob, admissionDate, currentStandardId, currentDivisionId, rollNumber)
- [ ] Teacher (id, tenantId, name, subjects[])
- [ ] TimetableSlot (id, divisionId, dayOfWeek, startTime, endTime, subject, teacherId)

---

## 8. Module-Wise Progress Checklist

### School (Tenant) Module
- [ ] Backend: Model, migration, service, controller, validation, unit tests
- [ ] Frontend: Components, API integration, UI, unit tests

### Admin (User) Module
- [ ] Backend: Model, migration, authentication, role guards, service, controller, unit tests
- [ ] Frontend: Login, registration, dashboard, routing, unit tests

### Teacher Module
- [ ] Backend: Model, migration, service, controller, unit tests
- [ ] Frontend: Components, API integration, unit tests

### Classes & Division Module
- [ ] Backend: Models, migrations, services, controllers, unit tests
- [ ] Frontend: Components, UI for class teacher assignment, API integration, unit tests

### Student Module
- [ ] Backend: Model, migration, service, controller, enrollment, promotion, unit tests
- [ ] Frontend: Components, enrollment/promotion workflows, API integration, unit tests

### Timetable Module
- [ ] Backend: Model, migration, service, controller, unit tests
- [ ] Frontend: Timetable builder UI, API integration, unit tests

---

## 9. Future Roadmap (Phase 2+)
- [ ] Online Learning Portal (video courses)
- [ ] Exam module (question banks, scheduling, grading)
- [ ] Events & Notices (calendar, notifications)
- [ ] Reports & Analytics (attendance, performance dashboards)
- [ ] Parent/Teacher communications (messaging, alerts)
- [ ] Mobile app or PWA

---

**Check off each item as you complete it to track your project progress!** 