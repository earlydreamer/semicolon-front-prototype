/**
 * 이용약관 / 개인정보 처리방침 페이지
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-white py-6 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">약관 및 정책</h1>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 pb-4 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            서비스 이용약관
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 pb-4 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            개인정보 처리방침
          </button>
        </div>

        {/* 내용 */}
        <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
          {activeTab === 'terms' ? (
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">제 1 조 (목적)</h3>
              <p className="mb-6">
                이 약관은 주식회사 세미콜론(이하 "회사")이 운영하는 중고거래 플랫폼 덕쿠(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>

              <h3 className="text-lg font-bold text-neutral-900 mb-3">제 2 조 (정의)</h3>
              <p className="mb-6">
                1. "서비스"란 회사가 제공하는 중고거래 중개 및 관련 제반 서비스를 의미합니다.<br/>
                2. "회원"이란 회사에 개인정보를 제공하여 회원 등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </p>

              <h3 className="text-lg font-bold text-neutral-900 mb-3">제 3 조 (약관의 효력 및 변경)</h3>
              <p className="mb-6">
                회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
              </p>
              
              <div className="p-4 bg-neutral-50 rounded-lg text-xs text-neutral-500 mt-8">
                * 이 약관은 2026년 1월 1일부터 시행됩니다.
              </div>
            </div>
          ) : (
            <div>
               <h3 className="text-lg font-bold text-neutral-900 mb-3">1. 개인정보의 수집 및 이용 목적</h3>
              <p className="mb-6">
                회사는 다음과 같은 목적을 위해 개인정보를 수집하고 이용합니다.<br/>
                - 회원 가입 및 관리<br/>
                - 서비스 제공 및 계약의 이행<br/>
                - 고객 상담 및 민원 처리
              </p>

              <h3 className="text-lg font-bold text-neutral-900 mb-3">2. 수집하는 개인정보의 항목</h3>
              <p className="mb-6">
                - 필수항목: 이메일, 비밀번호, 닉네임<br/>
                - 선택항목: 프로필 이미지, 자기소개, 정산 계좌 정보
              </p>

              <h3 className="text-lg font-bold text-neutral-900 mb-3">3. 개인정보의 보유 및 이용 기간</h3>
              <p className="mb-6">
                회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우에는 일정 기간 동안 개인정보를 보관합니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
