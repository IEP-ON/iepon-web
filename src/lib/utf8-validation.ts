/**
 * UTF-8 한글 안전성 검증 라이브러리
 * 개발문서 02_데이터베이스_설계.md 및 15_구현_페이지_리스트.md 기준
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export class UTF8KoreanValidator {
  /**
   * UTF-8 인코딩 안전성 검증
   */
  static validateUTF8(text: string): ValidationResult {
    try {
      const encoded = new TextEncoder().encode(text);
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
      
      if (decoded !== text) {
        return {
          isValid: false,
          error: 'UTF-8 인코딩에 문제가 있습니다.'
        };
      }
      
      return { isValid: true, sanitized: text };
    } catch (error) {
      return {
        isValid: false,
        error: 'UTF-8 인코딩 변환 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 한글 이름 유효성 검사
   * - 한글만 허용 (가-힣)
   * - 2-10자 길이 제한
   * - UTF-8 안전성 검증
   */
  static validateKoreanName(name: string): ValidationResult {
    if (!name || typeof name !== 'string') {
      return {
        isValid: false,
        error: '이름을 입력해주세요.'
      };
    }

    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return {
        isValid: false,
        error: '이름을 입력해주세요.'
      };
    }

    // UTF-8 안전성 검증
    const utf8Check = this.validateUTF8(trimmedName);
    if (!utf8Check.isValid) {
      return utf8Check;
    }

    // 한글 패턴 검사 (완성형 한글만)
    const koreanPattern = /^[가-힣]{2,10}$/;
    if (!koreanPattern.test(trimmedName)) {
      return {
        isValid: false,
        error: '한글 2-10자로 입력해주세요.'
      };
    }

    // 특수문자 및 숫자 검사
    if (/[^가-힣\s]/.test(trimmedName)) {
      return {
        isValid: false,
        error: '한글만 입력 가능합니다.'
      };
    }

    return {
      isValid: true,
      sanitized: trimmedName
    };
  }

  /**
   * 한국 전화번호 형식 검증
   * - 010-0000-0000 형식
   * - 하이픈 자동 추가
   */
  static validateKoreanPhone(phone: string): ValidationResult {
    if (!phone || typeof phone !== 'string') {
      return { isValid: true, sanitized: '' }; // 선택 필드
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    if (cleanPhone.length === 0) {
      return { isValid: true, sanitized: '' };
    }

    if (cleanPhone.length !== 11) {
      return {
        isValid: false,
        error: '올바른 전화번호 형식이 아닙니다. (010-0000-0000)'
      };
    }

    if (!cleanPhone.startsWith('010')) {
      return {
        isValid: false,
        error: '휴대폰 번호는 010으로 시작해야 합니다.'
      };
    }

    const formattedPhone = `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 7)}-${cleanPhone.slice(7)}`;
    
    return {
      isValid: true,
      sanitized: formattedPhone
    };
  }

  /**
   * 한글 주소 유효성 검사
   * - 한글, 숫자, 특수문자(-) 허용
   * - UTF-8 안전성 검증
   */
  static validateKoreanAddress(address: string): ValidationResult {
    if (!address || typeof address !== 'string') {
      return { isValid: true, sanitized: '' }; // 선택 필드
    }

    const trimmedAddress = address.trim();
    
    if (trimmedAddress.length === 0) {
      return { isValid: true, sanitized: '' };
    }

    // UTF-8 안전성 검증
    const utf8Check = this.validateUTF8(trimmedAddress);
    if (!utf8Check.isValid) {
      return utf8Check;
    }

    // 한글 주소 패턴 (한글, 숫자, 공백, 하이픈, 콤마 허용)
    const addressPattern = /^[가-힣0-9\s\-,()]+$/;
    if (!addressPattern.test(trimmedAddress)) {
      return {
        isValid: false,
        error: '주소에 허용되지 않는 문자가 포함되어 있습니다.'
      };
    }

    if (trimmedAddress.length > 200) {
      return {
        isValid: false,
        error: '주소는 200자 이내로 입력해주세요.'
      };
    }

    return {
      isValid: true,
      sanitized: trimmedAddress
    };
  }

  /**
   * 한글 텍스트 일반 유효성 검사
   * - 교육 목표, 메모 등에 사용
   * - UTF-8 안전성 검증
   */
  static validateKoreanText(text: string, maxLength: number = 500): ValidationResult {
    if (!text || typeof text !== 'string') {
      return {
        isValid: false,
        error: '내용을 입력해주세요.'
      };
    }

    const trimmedText = text.trim();
    
    if (!trimmedText) {
      return {
        isValid: false,
        error: '내용을 입력해주세요.'
      };
    }

    // UTF-8 안전성 검증
    const utf8Check = this.validateUTF8(trimmedText);
    if (!utf8Check.isValid) {
      return utf8Check;
    }

    if (trimmedText.length > maxLength) {
      return {
        isValid: false,
        error: `${maxLength}자 이내로 입력해주세요.`
      };
    }

    // 기본적인 한글/영문/숫자/기본 특수문자만 허용
    const textPattern = /^[가-힣a-zA-Z0-9\s.,!?()[\]{}'":-]+$/;
    if (!textPattern.test(trimmedText)) {
      return {
        isValid: false,
        error: '허용되지 않는 특수문자가 포함되어 있습니다.'
      };
    }

    return {
      isValid: true,
      sanitized: trimmedText
    };
  }

  /**
   * 이메일 유효성 검사 (UTF-8 안전성 포함)
   */
  static validateEmail(email: string): ValidationResult {
    if (!email || typeof email !== 'string') {
      return { isValid: true, sanitized: '' }; // 선택 필드
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.length === 0) {
      return { isValid: true, sanitized: '' };
    }

    // UTF-8 안전성 검증
    const utf8Check = this.validateUTF8(trimmedEmail);
    if (!utf8Check.isValid) {
      return utf8Check;
    }

    // 이메일 형식 검증
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      return {
        isValid: false,
        error: '올바른 이메일 형식을 입력해주세요.'
      };
    }

    if (trimmedEmail.length > 100) {
      return {
        isValid: false,
        error: '이메일은 100자 이내로 입력해주세요.'
      };
    }

    return {
      isValid: true,
      sanitized: trimmedEmail
    };
  }

  /**
   * 학교명 유효성 검사
   */
  static validateSchoolName(schoolName: string): ValidationResult {
    if (!schoolName || typeof schoolName !== 'string') {
      return { isValid: true, sanitized: '' }; // 선택 필드
    }

    const trimmedName = schoolName.trim();
    
    if (trimmedName.length === 0) {
      return { isValid: true, sanitized: '' };
    }

    // UTF-8 안전성 검증
    const utf8Check = this.validateUTF8(trimmedName);
    if (!utf8Check.isValid) {
      return utf8Check;
    }

    // 학교명 패턴 (한글, 영문, 숫자 허용)
    const schoolPattern = /^[가-힣a-zA-Z0-9\s]+$/;
    if (!schoolPattern.test(trimmedName)) {
      return {
        isValid: false,
        error: '학교명에 허용되지 않는 문자가 포함되어 있습니다.'
      };
    }

    if (trimmedName.length > 50) {
      return {
        isValid: false,
        error: '학교명은 50자 이내로 입력해주세요.'
      };
    }

    return {
      isValid: true,
      sanitized: trimmedName
    };
  }

  /**
   * 일괄 폼 데이터 검증
   */
  static validateFormData(data: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData: Record<string, any>;
  } {
    const errors: Record<string, string> = {};
    const sanitizedData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      let result: ValidationResult;

      switch (key) {
        case 'name':
        case 'studentName':
        case 'guardianName':
          result = this.validateKoreanName(value);
          break;
        case 'phone':
        case 'guardianPhone':
        case 'emergencyPhone':
          result = this.validateKoreanPhone(value);
          break;
        case 'email':
        case 'guardianEmail':
          result = this.validateEmail(value);
          break;
        case 'address':
        case 'guardianAddress':
          result = this.validateKoreanAddress(value);
          break;
        case 'schoolName':
          result = this.validateSchoolName(value);
          break;
        case 'educationGoals':
        case 'medicalHistory':
        case 'medications':
          result = this.validateKoreanText(value, 1000);
          break;
        default:
          // 기본 UTF-8 검증
          result = this.validateUTF8(String(value || ''));
          break;
      }

      if (!result.isValid) {
        errors[key] = result.error || '유효하지 않은 값입니다.';
      } else {
        sanitizedData[key] = result.sanitized !== undefined ? result.sanitized : value;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }
}

// 편의 함수들
export const validateKoreanName = UTF8KoreanValidator.validateKoreanName;
export const validateKoreanPhone = UTF8KoreanValidator.validateKoreanPhone;
export const validateKoreanText = UTF8KoreanValidator.validateKoreanText;
export const validateEmail = UTF8KoreanValidator.validateEmail;
export const validateFormData = UTF8KoreanValidator.validateFormData;

export default UTF8KoreanValidator;
