import { useState } from 'react';
import { cn } from '@/utils/cn';

const POLICY_TYPES = [
  { id: 'service', label: '이용약관' },
  { id: 'privacy', label: '개인정보 처리방침' },
] as const;

type PolicyType = typeof POLICY_TYPES[number]['id'];

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<PolicyType>('service');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">약관 및 정책</h1>
        <p className="text-neutral-500">세미콜론의 투명한 서비스 운영을 위한 약관입니다.</p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex border-b border-neutral-200">
          {POLICY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={cn(
                "relative pb-4 px-6 text-sm font-medium transition-colors focus:outline-none",
                activeTab === type.id 
                  ? "text-primary-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-600" 
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
          {activeTab === 'service' ? (
            <div className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-bold mb-4">제1조 (목적)</h2>
              <p className="text-neutral-600 mb-6">
                이 약관은 세미콜론(이하 "회사")이 운영하는 온라인 중고거래 플랫폼 세미콜론(이하 "서비스")에서 제공하는 전자상거래 관련 서비스 및 기타 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
              
              <h2 className="text-xl font-bold mb-4">제2조 (용어의 정의)</h2>
              <p className="text-neutral-600 mb-6">
                1. "서비스"라 함은 회사가 제공하는 중고물품 거래 중개 플랫폼 및 관련 부가 서비스를 의미합니다.<br />
                2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
              </p>

              <h2 className="text-xl font-bold mb-4">제3조 (약관의 명시, 효력 및 개정)</h2>
              <p className="text-neutral-600">
                회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-bold mb-4">개인정보 처리방침</h2>
              <p className="text-neutral-600 mb-6 font-semibold">
                세미콜론은 이용자의 개인정보 수집 시 서비스 제공에 필요한 최소한의 정보를 수집합니다.
              </p>
              
              <h3 className="text-lg font-bold mb-2">1. 수집하는 개인정보 항목</h3>
              <p className="text-neutral-600 mb-6">
                - 필수항목: 이름, 이메일 주소, 비밀번호, 휴대폰 번호<br />
                - 선택항목: 프로필 사진, 선호 카테고리
              </p>

              <h3 className="text-lg font-bold mb-2">2. 개인정보의 수집 및 이용 목적</h3>
              <p className="text-neutral-600">
                - 회원 가입 및 관리<br />
                - 서비스 제공 및 결제 처리<br />
                - 맞춤형 콘텐츠 추천 및 마케팅(선택 시)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
