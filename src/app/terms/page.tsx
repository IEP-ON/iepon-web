import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
          </div>
          <p className="text-gray-600">IEPON 서비스 이용약관</p>
          <p className="text-sm text-gray-500 mt-2">최종 업데이트: 2024년 3월 1일</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-7">
              본 약관은 IEPON(이하 "회사")이 제공하는 개별화 교육 프로그램 온라인 네트워크 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. "서비스"란 회사가 제공하는 개별화 교육 프로그램 관리 및 AI 기반 교육 도구를 의미합니다.</p>
              <p>2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원을 말합니다.</p>
              <p>3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</p>
              <p>2. 회사는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 공시합니다.</p>
              <p>3. 변경된 약관에 동의하지 않는 회원은 서비스 이용을 중단하고 회원탈퇴를 할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (회원가입)</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. 회원가입은 이용자가 본 약관의 내용에 대하여 동의하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</p>
              <p>2. 회원가입신청자는 반드시 실명으로 신청하여야 하며, 허위의 정보를 기재해서는 안됩니다.</p>
              <p>3. 회사는 관리자 계정의 경우 별도의 승인 절차를 거칠 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (서비스의 제공)</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 학생 정보 관리 서비스</p>
                <p>- 개별화 교육과정 계획 및 관리</p>
                <p>- AI 기반 교육 콘텐츠 생성</p>
                <p>- 교육 평가 및 분석 도구</p>
                <p>- 기타 회사가 정하는 서비스</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (개인정보 보호)</h2>
            <p className="text-gray-700 leading-7">
              회사는 관련법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (이용자의 의무)</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. 이용자는 서비스 이용 시 다음 행위를 하여서는 안됩니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 타인의 개인정보를 무단으로 수집, 저장, 공개하는 행위</p>
                <p>- 서비스의 안정적 운영을 방해할 수 있는 행위</p>
                <p>- 관련 법령을 위반하는 행위</p>
                <p>- 기타 사회 통념에 반하는 행위</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (서비스 이용의 제한)</h2>
            <p className="text-gray-700 leading-7">
              회사는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을 방해한 경우, 서비스 이용을 제한하거나 회원자격을 상실시킬 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (면책조항)</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
              <p>2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (분쟁해결)</h2>
            <p className="text-gray-700 leading-7">
              본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국의 법을 적용하며, 서울중앙지방법원을 관할 법원으로 합니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center">
              궁금한 사항이 있으시면{' '}
              <Link href="mailto:support@iepon.com" className="text-blue-600 hover:text-blue-700">
                support@iepon.com
              </Link>
              으로 문의해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
