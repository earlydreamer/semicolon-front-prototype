/**
 * 자주 묻는 질문 (FAQ) 페이지
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';

type FAQCategory = '전체' | '가입/계정' | '구매/결제' | '판매/정산' | '이용정책';

const CATEGORIES: FAQCategory[] = ['전체', '가입/계정', '구매/결제', '판매/정산', '이용정책'];

const FAQS = [
  {
    id: 1,
    category: '가입/계정',
    question: '회원가입은 어떻게 하나요?',
    answer: '이메일 주소를 통해 간편하게 회원가입할 수 있습니다. 상단 메뉴의 [로그인/가입] 버튼을 눌러주세요.'
  },
  {
    id: 2,
    category: '구매/결제',
    question: '안전결제란 무엇인가요?',
    answer: '구매자가 결제한 금액을 덕쿠가 보관하다가, 물품 수령 및 구매 확정이 완료되면 판매자에게 정산해주는 에스크로 서비스입니다.'
  },
  {
    id: 3,
    category: '판매/정산',
    question: '판매 수수료는 얼마인가요?',
    answer: '기본 판매 수수료는 거래 금액의 3.5%입니다. 단, 이벤트 기간에는 변동될 수 있습니다.'
  },
  {
    id: 4,
    category: '판매/정산',
    question: '정산은 언제 되나요?',
    answer: '구매자가 [구매확정]을 누른 다음 날(영업일 기준) 등록하신 계좌로 자동 입금됩니다.'
  },
  {
    id: 5,
    category: '이용정책',
    question: '직거래도 가능한가요?',
    answer: '네, 가능합니다. 판매자와 채팅을 통해 직거래 장소와 시간을 조율하실 수 있습니다.'
  }
];

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('전체');
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs = selectedCategory === '전체' 
    ? FAQS 
    : FAQS.filter(faq => faq.category === selectedCategory);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white py-6 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">자주 묻는 질문</h1>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
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

        {/* FAQ 목록 */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-neutral-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-neutral-50 transition-colors"
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
