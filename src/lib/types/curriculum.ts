// 교육과정 관련 타입 정의

export interface CurriculumItem {
  id: string;
  title: string;
  grade: number;
  subject: string;
  category: '국가교육과정' | '지역교육과정' | '학교교육과정';
  description: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string;
  updatedAt: string;
  status: 'active' | 'pending' | 'archived';
  downloadCount: number;
  userId: string; // 업로드한 관리자 ID
  approvedBy?: string; // 승인한 관리자 ID
  approvedAt?: string;
  tags?: string[];
}

export interface CurriculumFilter {
  category?: '국가교육과정' | '지역교육과정' | '학교교육과정';
  grade?: number;
  subject?: string;
  status?: 'active' | 'pending' | 'archived';
  searchQuery?: string;
}

export interface CurriculumUpload {
  title: string;
  grade: number;
  subject: string;
  category: '국가교육과정' | '지역교육과정' | '학교교육과정';
  description: string;
  file: File;
  tags?: string[];
}

export interface CurriculumStats {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  archivedCount: number;
  totalDownloads: number;
  recentUploads: number; // 최근 7일
}

export interface CurriculumAssignment {
  id: string;
  curriculumId: string;
  studentId: string;
  assignedBy: string; // 교사 ID
  assignedAt: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  progress?: number; // 0-100
  notes?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 권한 관련 타입
export type UserRole = 'teacher' | 'super_admin';

export interface UserPermissions {
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canViewAll: boolean;
}
