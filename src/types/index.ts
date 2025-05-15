export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  class?: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  createdAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  score: number;
  type: 'assignment' | 'exam' | 'quiz';
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  createdAt: string;
}

export interface AuthError {
  message: string;
}
