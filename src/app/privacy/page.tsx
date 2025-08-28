import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link 
            href="/auth/register" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            회원가입으로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
          </div>
          <p className="text-gray-600">IEPON 개인정보 보호정책</p>
          <p className="text-sm text-gray-500 mt-2">최종 업데이트: 2024년 3월 1일</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-gray-700 leading-7 mb-3">
              IEPON(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <div className="space-y-2 text-gray-700 ml-4">
              <p>- 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별・인증</p>
              <p>- 개별화 교육 프로그램 서비스 제공</p>
              <p>- 학생 관리 및 교육과정 관리 서비스</p>
              <p>- 서비스 개선 및 맞춤형 서비스 제공</p>
              <p>- 고지사항 전달</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 처리 및 보유 기간</h2>
            <div className="space-y-4 text-gray-700">
              <p>① 회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유․이용기간 또는 법령에 따른 개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다.</p>
              <p>② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
              <div className="ml-4 space-y-2">
                <p><strong>회원 정보:</strong> 회원 탈퇴 시까지</p>
                <p><strong>학생 정보:</strong> 교육 서비스 완료 후 3년</p>
                <p><strong>교육과정 정보:</strong> 교육 완료 후 5년</p>
                <p><strong>서비스 이용 기록:</strong> 3개월</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 처리하는 개인정보 항목</h2>
            <div className="space-y-4 text-gray-700">
              <p>① 회사가 개인정보 보호법 제32조에 따라 등록․공개하는 개인정보파일의 처리목적, 개인정보 항목은 다음과 같습니다.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">필수정보</h4>
                <p>이름, 이메일, 연락처, 소속 학교, 부서/학과, 비밀번호</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">학생 관련 정보 (교사 계정)</h4>
                <p>학생 이름, 학년, 반, 장애 유형, 교육 계획, 평가 결과</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">자동 수집 정보</h4>
                <p>서비스 이용 기록, 접속 로그, 쿠키</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 leading-7">
              ① 회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
            <p className="text-gray-700 leading-7 mt-3">
              ② 회사는 현재 제3자에게 개인정보를 제공하고 있지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보처리 위탁</h2>
            <p className="text-gray-700 leading-7">
              ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-gray-700">
                <p><strong>위탁받는 자:</strong> 클라우드 서비스 제공업체</p>
                <p><strong>위탁하는 업무의 내용:</strong> 데이터 보관 및 백업</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 정보주체의 권리‧의무 및 그 행사방법</h2>
            <div className="space-y-3 text-gray-700">
              <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
              <div className="ml-4 space-y-2">
                <p>1. 개인정보 처리현황 통지 요구</p>
                <p>2. 오류 등이 있을 경우 정정·삭제 요구</p>
                <p>3. 처리정지 요구</p>
              </div>
              <p>② 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 개인정보의 안전성 확보 조치</h2>
            <div className="space-y-3 text-gray-700">
              <p>회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</p>
              <div className="ml-4 space-y-2">
                <p>1. 개인정보 취급 직원의 최소화 및 교육</p>
                <p>2. 개인정보의 암호화</p>
                <p>3. 해킹 등에 대비한 기술적 대책</p>
                <p>4. 개인정보에 대한 접근 제한</p>
                <p>5. 접근통제시스템 설치</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 개인정보 보호책임자</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="space-y-2 text-gray-700">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>성명: 개인정보 보호 담당자</p>
                <p>직책: 개인정보 보호 담당</p>
                <p>연락처: privacy@iepon.com</p>
                <p>전화: 02-1234-5678</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. 개인정보 처리방침 변경</h2>
            <p className="text-gray-700 leading-7">
              ① 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center">
              개인정보 보호 관련 문의사항이 있으시면{' '}
              <Link href="mailto:privacy@iepon.com" className="text-blue-600 hover:text-blue-700">
                privacy@iepon.com
              </Link>
              으로 연락해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
