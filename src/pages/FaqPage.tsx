import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

const FAQ_DATA = [
  {
    question: '거래는 어떻게 진행되나요?',
    answer: '원하는 상품을 찾은 후 [구매하기] 버튼을 통해 결제를 진행하시면 됩니다. 결제 완료 후 판매자와 채팅을 통해 상세 조율이 가능합니다.',
  },
  {
    question: '상품 검수 시스템은 무엇인가요?',
    answer: '세미콜론은 취미 용품 전문 검수 팀을 운영하고 있습니다. 고가의 장비나 정밀한 확인이 필요한 경우 전문 검수를 신청하실 수 있습니다.',
  },
  {
    question: '환불 규정이 어떻게 되나요?',
    answer: '중고거래 특성상 단순 변심에 의한 환불은 어려우나, 상품 설명과 다르거나 결함이 있는 경우 고객센터를 통해 분쟁 조정을 신청하실 수 있습니다.',
  },
  {
    question: '결제 수단은 어떤 것들이 있나요?',
    answer: '신용카드, 계좌이체, 토스페이 등 다양한 결제 수단을 지원하며 안전결제 시스템을 통해 대금이 안전하게 보호됩니다.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">자주 묻는 질문</h1>
        <p className="text-neutral-500">궁금하신 내용을 검색하시거나 카테고리별 질문을 확인하세요.</p>
      </div>

      <div className="mx-auto mb-12 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="궁금한 내용을 입력하세요"
            className="w-full rounded-full border border-neutral-200 bg-white px-6 py-4 pr-12 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <Search className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl divide-y divide-neutral-100 border-y border-neutral-100">
        {FAQ_DATA.map((item, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between text-left focus:outline-none"
            >
              <span className="text-lg font-medium text-neutral-800">{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-neutral-400 transition-transform duration-200",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>
            {openIndex === index && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-neutral-600 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
