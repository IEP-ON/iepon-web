/**
 * 권한 관리 시스템
 * MCP 기반 권한 검증 및 RLS 정책 구현
 */

import { errorUtils } from '../error-handler';

// 권한 타입 정의
export type Permission = 
  | 'all'
  | 'students.read'
  | 'students.write'
  | 'students.delete'
  | 'ai.generate'
  | 'ai.read'
  | 'reports.read'
  | 'reports.write'
  | 'users.read'
  | 'users.write'
  | 'users.delete'
  | 'system.read'
  | 'system.write'
  | 'settings.read'
  | 'settings.write';

export type Role = 'super_admin' | 'admin' | 'teacher' | 'readonly';

// 사용자 권한 정보
export interface UserPermissions {
  userId: string;
  role: Role;
  permissions: Permission[];
  restrictions?: {
    schoolIds?: string[];
    studentIds?: string[];
    departmentIds?: string[];
  };
  validUntil?: string;
  isActive: boolean;
}

// RLS 컨텍스트
export interface RLSContext {
  userId: string;
  role: Role;
  schoolId?: string;
  departmentId?: string;
  teacherClass?: string;
  sessionId: string;
  timestamp: string;
}

// 권한 검증 결과
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  appliedPolicies: string[];
  metadata: {
    checkedAt: string;
    context: RLSContext;
    permission: Permission;
    resource?: string;
  };
}

/**
 * 권한 관리자 클래스
 */
class PermissionManager {
  private userPermissions: Map<string, UserPermissions> = new Map();
  private rolePolicies: Map<Role, Permission[]> = new Map();
  private rlsPolicies: Map<string, (context: RLSContext, resource: any) => boolean> = new Map();

  constructor() {
    this.initializeRolePolicies();
    this.initializeRLSPolicies();
  }

  /**
   * 역할별 기본 권한 초기화
   */
  private initializeRolePolicies(): void {
    this.rolePolicies.set('super_admin', ['all']);
    this.rolePolicies.set('admin', [
      'students.read', 'students.write', 'students.delete',
      'ai.generate', 'ai.read',
      'reports.read', 'reports.write',
      'users.read', 'users.write',
      'system.read', 'settings.read'
    ]);
    this.rolePolicies.set('teacher', [
      'students.read', 'students.write',
      'ai.generate', 'ai.read',
      'reports.read'
    ]);
    this.rolePolicies.set('readonly', [
      'students.read',
      'ai.read',
      'reports.read'
    ]);
  }

  /**
   * RLS 정책 초기화
   */
  private initializeRLSPolicies(): void {
    // 학생 정보 접근 정책
    this.rlsPolicies.set('students.school_policy', (context, resource) => {
      if (context.role === 'super_admin') return true;
      if (!resource.schoolId || !context.schoolId) return false;
      return resource.schoolId === context.schoolId;
    });

    // 교사별 학생 접근 정책
    this.rlsPolicies.set('students.teacher_policy', (context, resource) => {
      if (['super_admin', 'admin'].includes(context.role)) return true;
      if (!resource.teacherId) return false;
      return resource.teacherId === context.userId;
    });

    // 부서별 접근 정책
    this.rlsPolicies.set('department.access_policy', (context, resource) => {
      if (context.role === 'super_admin') return true;
      if (!resource.departmentId || !context.departmentId) return false;
      return resource.departmentId === context.departmentId;
    });

    // AI 생성 결과 접근 정책
    this.rlsPolicies.set('ai_results.creator_policy', (context, resource) => {
      if (['super_admin', 'admin'].includes(context.role)) return true;
      return resource.createdBy === context.userId;
    });

    // 보고서 접근 정책
    this.rlsPolicies.set('reports.access_policy', (context, resource) => {
      if (context.role === 'super_admin') return true;
      if (context.role === 'admin' && context.schoolId === resource.schoolId) return true;
      return resource.createdBy === context.userId;
    });
  }

  /**
   * 사용자 권한 등록
   */
  public registerUserPermissions(userPermissions: UserPermissions): void {
    try {
      // UTF-8 안전성 검증
      const safeUserId = userPermissions.userId;
      
      // 권한 검증
      const rolePermissions = this.rolePolicies.get(userPermissions.role) || [];
      const mergedPermissions = userPermissions.role === 'super_admin' 
        ? ['all' as Permission]
        : [...new Set([...rolePermissions, ...userPermissions.permissions])];

      const validatedPermissions: UserPermissions = {
        ...userPermissions,
        userId: safeUserId,
        permissions: mergedPermissions,
        isActive: userPermissions.isActive && this.isValidUntil(userPermissions.validUntil)
      };

      this.userPermissions.set(safeUserId, validatedPermissions);
    } catch (error) {
      throw errorUtils.createError(
        'VALIDATION_ERROR' as any,
        'PERMISSION_REGISTRATION_ERROR',
        '사용자 권한 등록에 실패했습니다.',
        'HIGH' as any,
        error
      );
    }
  }

  /**
   * 권한 검증
   */
  public checkPermission(
    userId: string,
    permission: Permission,
    context?: Partial<RLSContext>,
    resource?: any
  ): PermissionResult {
    try {
      const safeUserId = userId;
      const userPerms = this.userPermissions.get(safeUserId);

      const rlsContext: RLSContext = {
        userId: safeUserId,
        role: userPerms?.role || 'readonly',
        sessionId: context?.sessionId || `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...context
      };

      const result: PermissionResult = {
        allowed: false,
        appliedPolicies: [],
        metadata: {
          checkedAt: new Date().toISOString(),
          context: rlsContext,
          permission,
          resource: resource?.id || resource?.type
        }
      };

      // 사용자 존재 확인
      if (!userPerms) {
        result.reason = '사용자 권한 정보를 찾을 수 없습니다.';
        return result;
      }

      // 활성 상태 확인
      if (!userPerms.isActive) {
        result.reason = '비활성 사용자입니다.';
        return result;
      }

      // 슈퍼 관리자 확인
      if (userPerms.permissions.includes('all')) {
        result.allowed = true;
        result.appliedPolicies.push('super_admin_policy');
        return result;
      }

      // 기본 권한 확인
      if (!userPerms.permissions.includes(permission)) {
        result.reason = `'${permission}' 권한이 없습니다.`;
        return result;
      }

      result.appliedPolicies.push('basic_permission_policy');

      // RLS 정책 적용 (리소스가 있는 경우)
      if (resource) {
        const rlsResult = this.applyRLSPolicies(rlsContext, resource, permission);
        if (!rlsResult.allowed) {
          result.allowed = false;
          result.reason = rlsResult.reason;
          result.appliedPolicies.push(...rlsResult.appliedPolicies);
          return result;
        }
        result.appliedPolicies.push(...rlsResult.appliedPolicies);
      }

      // 모든 검증 통과
      result.allowed = true;
      return result;

    } catch (error) {
      throw errorUtils.createError(
        'SYSTEM_ERROR' as any,
        'PERMISSION_CHECK_ERROR',
        '권한 검증 중 오류가 발생했습니다.',
        'HIGH' as any,
        error
      );
    }
  }

  /**
   * RLS 정책 적용
   */
  private applyRLSPolicies(
    context: RLSContext,
    resource: any,
    permission: Permission
  ): { allowed: boolean; reason?: string; appliedPolicies: string[] } {
    const result = {
      allowed: true,
      appliedPolicies: [] as string[]
    };

    // 권한별 적용할 정책 결정
    const applicablePolicies = this.getApplicablePolicies(permission, resource);

    for (const policyName of applicablePolicies) {
      const policy = this.rlsPolicies.get(policyName);
      if (policy) {
        const policyResult = policy(context, resource);
        result.appliedPolicies.push(policyName);
        
        if (!policyResult) {
          return {
            allowed: false,
            reason: `RLS 정책 '${policyName}'에 의해 접근이 거부되었습니다.`,
            appliedPolicies: result.appliedPolicies
          };
        }
      }
    }

    return result;
  }

  /**
   * 권한에 따른 적용 가능한 정책 목록 반환
   */
  private getApplicablePolicies(permission: Permission, resource: any): string[] {
    const policies: string[] = [];

    // 학생 관련 권한
    if (permission.startsWith('students.')) {
      if (resource.schoolId) policies.push('students.school_policy');
      if (resource.teacherId) policies.push('students.teacher_policy');
    }

    // AI 결과 관련 권한
    if (permission.startsWith('ai.')) {
      if (resource.createdBy) policies.push('ai_results.creator_policy');
    }

    // 보고서 관련 권한
    if (permission.startsWith('reports.')) {
      policies.push('reports.access_policy');
    }

    // 부서 관련 권한
    if (resource.departmentId) {
      policies.push('department.access_policy');
    }

    return policies;
  }

  /**
   * 유효 기간 확인
   */
  private isValidUntil(validUntil?: string): boolean {
    if (!validUntil) return true;
    return new Date(validUntil) > new Date();
  }

  /**
   * 사용자의 모든 권한 조회
   */
  public getUserPermissions(userId: string): UserPermissions | null {
    const safeUserId = userId;
    return this.userPermissions.get(safeUserId) || null;
  }

  /**
   * 권한 업데이트
   */
  public updateUserPermissions(userId: string, updates: Partial<UserPermissions>): void {
    const safeUserId = userId;
    const currentPerms = this.userPermissions.get(safeUserId);
    
    if (!currentPerms) {
      throw errorUtils.createError(
        'VALIDATION_ERROR' as any,
        'USER_NOT_FOUND',
        '사용자를 찾을 수 없습니다.',
        'MEDIUM' as any
      );
    }

    const updatedPerms: UserPermissions = {
      ...currentPerms,
      ...updates,
      userId: safeUserId // userId는 변경 불가
    };

    this.userPermissions.set(safeUserId, updatedPerms);
  }

  /**
   * 권한 제거
   */
  public revokeUserPermissions(userId: string): void {
    const safeUserId = userId;
    this.userPermissions.delete(safeUserId);
  }

  /**
   * 리소스 필터링 (RLS 적용)
   */
  public filterResources<T extends any[]>(
    userId: string,
    permission: Permission,
    resources: T,
    context?: Partial<RLSContext>
  ): T {
    try {
      const filtered = resources.filter(resource => {
        const result = this.checkPermission(userId, permission, context, resource);
        return result.allowed;
      });

      return filtered as T;
    } catch (error) {
      console.error('리소스 필터링 실패:', error);
      return [] as unknown as T;
    }
  }

  /**
   * 권한 검증 로그
   */
  public getPermissionLog(userId: string, limit: number = 50): any[] {
    // 실제로는 로깅 시스템과 연동
    return [];
  }

  /**
   * 시스템 권한 통계
   */
  public getPermissionStats(): {
    totalUsers: number;
    activeUsers: number;
    roleDistribution: Record<Role, number>;
    permissionUsage: Record<Permission, number>;
  } {
    const stats = {
      totalUsers: this.userPermissions.size,
      activeUsers: 0,
      roleDistribution: {} as Record<Role, number>,
      permissionUsage: {} as Record<Permission, number>
    };

    // 역할별 분포 초기화
    (['super_admin', 'admin', 'teacher', 'readonly'] as Role[]).forEach(role => {
      stats.roleDistribution[role] = 0;
    });

    // 사용자별 통계 계산
    this.userPermissions.forEach(userPerms => {
      if (userPerms.isActive) {
        stats.activeUsers++;
      }
      
      stats.roleDistribution[userPerms.role]++;
      
      userPerms.permissions.forEach(permission => {
        stats.permissionUsage[permission] = (stats.permissionUsage[permission] || 0) + 1;
      });
    });

    return stats;
  }
}

// 싱글톤 인스턴스
export const permissionManager = new PermissionManager();

// 편의 함수들
export const checkPermission = (userId: string, permission: Permission, context?: Partial<RLSContext>, resource?: any) =>
  permissionManager.checkPermission(userId, permission, context, resource);

export const hasPermission = (userId: string, permission: Permission, context?: Partial<RLSContext>, resource?: any) =>
  permissionManager.checkPermission(userId, permission, context, resource).allowed;

export const filterByPermission = <T extends any[]>(userId: string, permission: Permission, resources: T, context?: Partial<RLSContext>) =>
  permissionManager.filterResources(userId, permission, resources, context);
