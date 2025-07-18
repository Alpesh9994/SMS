import { Routes } from '@angular/router';
import { SecuredLayout } from './layout/layout';
import { ROUTES_CONFIG } from '@shared/config/route-paths';

export const SECURED_ROUTES: Routes = [
  {
    path: '',
    component: SecuredLayout,
    children: [
      {
        path: ROUTES_CONFIG['DASHBOARD'].path,
        loadChildren: () => import('@features/secured/pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
        title: ROUTES_CONFIG['DASHBOARD'].title
      },
    //   {
    //     path: ROUTES_CONFIG['SCHOOLS'].path,
    //     loadChildren: () => import('@features/secured/pages/school/school.routes').then(m => m.SCHOOL_ROUTES),
    //     data: { roles: ROUTES_CONFIG['SCHOOLS'].roles },
    //     title: ROUTES_CONFIG['SCHOOLS'].title
    //   },
    //   {
    //     path: ROUTES_CONFIG['STUDENTS'].path,
    //     loadChildren: () => import('@features/secured/pages/student/student.routes').then(m => m.STUDENT_ROUTES),
    //     data: { roles: ROUTES_CONFIG['STUDENTS'].roles },
    //     title: ROUTES_CONFIG['STUDENTS'].title
    //   },
    //   {
    //     path: ROUTES_CONFIG['TEACHERS'].path,
    //     loadChildren: () => import('@features/secured/pages/teacher/teacher.routes').then(m => m.TEACHER_ROUTES),
    //     data: { roles: ROUTES_CONFIG['TEACHERS'].roles },
    //     title: ROUTES_CONFIG['TEACHERS'].title
    //   },
    //   {
    //     path: ROUTES_CONFIG['SUBJECTS'].path,
    //     loadChildren: () => import('@features/secured/pages/subject/subject.routes').then(m => m.SUBJECT_ROUTES),
    //     data: { roles: ROUTES_CONFIG['SUBJECTS'].roles },
    //     title: ROUTES_CONFIG['SUBJECTS'].title
    //   },
    //   {
    //     path: ROUTES_CONFIG['TIMETABLE'].path,
    //     loadChildren: () => import('@features/secured/pages/timetable/timetable.routes').then(m => m.TIMETABLE_ROUTES),
    //     data: { roles: ROUTES_CONFIG['TIMETABLE'].roles },
    //     title: ROUTES_CONFIG['TIMETABLE'].title
    //   },
    //   {
    //     path: ROUTES_CONFIG['STANDARDS'].path,
    //     loadChildren: () => import('@features/secured/pages/standard/standard.routes').then(m => m.STANDARD_ROUTES),
    //     data: { roles: ROUTES_CONFIG['STANDARDS'].roles },
    //     title: ROUTES_CONFIG['STANDARDS'].title
    //   },
      {
        path: '',
        redirectTo: ROUTES_CONFIG['DASHBOARD'].path,
        pathMatch: 'full'
      } as const
    ]
  }
];
