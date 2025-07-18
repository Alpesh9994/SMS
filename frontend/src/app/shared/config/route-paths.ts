import { UserRole } from '@shared/enums/user-role.enum';

export interface RouteConfig {
  path: string;
  roles?: UserRole[];
  title: string;
  icon?: string;
}

export const ROUTES_CONFIG: { [key: string]: RouteConfig } = {
  DASHBOARD: {
    path: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard'
  },
  SCHOOLS: {
    path: 'schools',
    roles: [UserRole.SUPER_ADMIN],
    title: 'Schools Management',
    icon: 'school'
  },
  STUDENTS: {
    path: 'students',
    roles: [UserRole.SCHOOL_ADMIN],
    title: 'Students Management',
    icon: 'people'
  },
  TEACHERS: {
    path: 'teachers',
    roles: [UserRole.SCHOOL_ADMIN],
    title: 'Teachers Management',
    icon: 'person'
  },
  SUBJECTS: {
    path: 'subjects',
    roles: [UserRole.SCHOOL_ADMIN],
    title: 'Subjects Management',
    icon: 'book'
  },
  TIMETABLE: {
    path: 'timetable',
    roles: [UserRole.SCHOOL_ADMIN],
    title: 'Timetable Management',
    icon: 'schedule'
  },
  STANDARDS: {
    path: 'standards',
    roles: [UserRole.SCHOOL_ADMIN],
    title: 'Standards Management',
    icon: 'class'
  }
};

// Helper function to get route path
export const getRoutePath = (route: keyof typeof ROUTES_CONFIG): string => {
  return ROUTES_CONFIG[route].path;
};

// Helper function to check if user has access to route
export const hasRouteAccess = (route: keyof typeof ROUTES_CONFIG, userRole: UserRole): boolean => {
  const config = ROUTES_CONFIG[route];
  return !config.roles || config.roles.includes(userRole);
};
