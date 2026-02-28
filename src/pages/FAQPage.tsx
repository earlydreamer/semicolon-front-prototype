/**
 * 자주 묻는 질문 (FAQ) 페이지
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';

type FAQCategory = '전체' | '가입/계정' | '구매/결제' | '판매/정산' | '이용정책';

const CATEGORIES: FAQCategory[] = [
  '전체',
  '가입/계정',
  '구매/결제',
  '판매/정산',
  '이용정책',
];

const FAQS: Array<{
  id: number;
  category: FAQCategory;
  question: string;
  answer: string;
}> = [
  {
    id: 1,
    category: '가입/계정',
    question: '회원가입은 어떻게 하나요?',
    answer:
      '로그인 화면에서 이메일 회원가입을 진행할 수 있습니다. 가입 후에는 마이페이지에서 기본 정보와 배송지 정보를 관리할 수 있습니다.',
  },
  {
    id: 2,
    category: '구매/결제',
    question: '안전결제란 무엇인가요?',
    answer:
      '구매 결제금은 거래 완료 전까지 보호되며, 거래 상태에 따라 정산 또는 환불이 처리됩니다. 안전한 거래를 위해 서비스 내 결제 흐름을 이용해 주세요.',
  },
  {
    id: 3,
    category: '구매/결제',
    question: '주문 취소나 반품은 어디서 하나요?',
    answer:
      '마이페이지 주문 내역에서 주문 취소 또는 반품 요청을 진행할 수 있습니다. 주문/배송 상태에 따라 가능한 동작이 달라질 수 있습니다.',
  },
  {
    id: 4,
    category: '판매/정산',
    question: '판매 수수료는 얼마인가요?',
    answer:
      '판매 수수료 정책은 공지사항 기준으로 운영됩니다. 이벤트 기간에는 수수료 면제 등 프로모션이 적용될 수 있으니 최신 공지를 확인해 주세요.',
  },
  {
    id: 5,
    category: '판매/정산',
    question: '정산은 어떻게 진행되나요?',
    answer:
      '현재 MVP 정책에서는 판매 대금이 발송 완료 후 자동으로 예치금으로 정산됩니다. 예치금은 상품 구매에 사용할 수 있으며, 계좌 출금 기능은 준비 중입니다.',
  },
  {
    id: 6,
    category: '이용정책',
    question: '직거래나 외부 결제를 해도 되나요?',
    answer:
      '서비스의 거래 보호는 플랫폼 내 안전결제 기준으로 제공됩니다. 직거래나 외부 결제는 보호 대상에서 제외될 수 있으니 주의해 주세요.',
  },
  {
    id: 7,
    category: '가입/계정',
    question: '비회원도 구매할 수 있나요?',
    answer:
      '주문, 결제, 찜, 반품 신청 등 주요 기능은 로그인 후 이용할 수 있습니다.',
  },
  {
    id: 8,
    category: '구매/결제',
    question: '쿠폰과 예치금을 함께 사용할 수 있나요?',
    answer:
      '가능합니다. 주문서에서 쿠폰을 적용한 뒤 예치금 사용 금액을 입력해 최종 결제 금액 범위 안에서 함께 사용할 수 있습니다.',
  },
  {
    id: 9,
    category: '구매/결제',
    question: '배송지 정보는 어디서 관리하나요?',
    answer:
      '마이페이지 주소록에서 배송지를 관리할 수 있고, 주문서에서도 배송지 정보를 확인/수정할 수 있습니다.',
  },
  {
    id: 10,
    category: '판매/정산',
    question: '판매중·거래중·판매완료 상태는 어떻게 달라지나요?',
    answer:
      '상품은 거래 진행 상태에 따라 자동으로 구분됩니다. 결제가 진행되면 거래중으로 표시되고, 거래 완료 시 판매완료로 변경됩니다.',
  },
  {
    id: 11,
    category: '이용정책',
    question: '거래 중 문제가 생기면 어떻게 하나요?',
    answer:
      '주문 내역에서 현재 상태를 먼저 확인하고, 상황에 맞게 취소/반품/환불 절차를 진행해 주세요. 플랫폼 내 절차를 이용하면 기록 기반으로 확인이 가능합니다.',
  },
  {
    id: 12,
    category: '이용정책',
    question: '상품 신고는 어디서 할 수 있나요?',
    answer:
      '상품 상세 페이지의 신고 기능을 통해 접수할 수 있습니다. 접수된 신고는 운영 정책에 따라 순차적으로 검토됩니다.',
  },
];

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('전체');
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs =
    selectedCategory === '전체'
      ? FAQS
      : FAQS.filter((faq) => faq.category === selectedCategory);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-3xl px-3 min-[360px]:px-4">
        <div className="mb-6 flex items-center gap-2 min-[360px]:mb-8 min-[360px]:gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">자주 묻는 질문</h1>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="flex w-full items-center justify-between bg-white p-4 text-left transition-colors hover:bg-neutral-50 min-[360px]:p-5"
              >
                <div>
                  <span className="text-xs font-bold text-primary-600 mb-1 block">
                    {faq.category}
                  </span>
                  <span className="text-base font-medium text-neutral-900">
                    {faq.question}
                  </span>
                </div>
                {openId === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0 ml-4" />
                )}
              </button>

              {openId === faq.id && (
                <div className="p-5 bg-neutral-50 border-t border-neutral-200 text-sm text-neutral-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="py-20 text-center text-neutral-500">
              해당 카테고리의 질문이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
