/**
 * 공지사항 페이지
 */
import { Link } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';

type NoticeCategory = '공지' | '이벤트' | '점검' | '안내';

interface NoticeItem {
  id: number;
  category: NoticeCategory;
  title: string;
  date: string;
  content: string;
}

const CATEGORY_STYLE: Record<NoticeCategory, string> = {
  공지: 'bg-neutral-100 text-neutral-600',
  이벤트: 'bg-orange-100 text-orange-600',
  점검: 'bg-red-100 text-red-600',
  안내: 'bg-blue-100 text-blue-700',
};

const NOTICES: NoticeItem[] = [
  {
    id: 1,
    category: '공지',
    title: '덕쿠 거래 보호 정책 안내',
    date: '2026.02.24',
    content:
      '서비스 내 결제 흐름으로 진행한 거래를 기준으로 보호 정책이 적용됩니다.\n직거래 또는 외부 결제는 거래 보호 대상에서 제외될 수 있으니 이용 시 주의해 주세요.',
  },
  {
    id: 2,
    category: '안내',
    title: '판매 대금 정산 방식(MVP) 안내',
    date: '2026.02.22',
    content:
      '현재 판매 대금은 발송 완료 후 자동으로 예치금으로 정산됩니다.\n적립된 예치금은 상품 결제 시 사용할 수 있으며, 계좌 출금 기능은 추후 업데이트 예정입니다.',
  },
  {
    id: 3,
    category: '이벤트',
    title: '오픈 기념 수수료 프로모션 안내',
    date: '2026.02.18',
    content:
      '오픈 기념 프로모션 기간에는 일부 카테고리에 한해 수수료 정책이 다르게 적용될 수 있습니다.\n최종 적용 조건은 해당 기간 공지 내용을 기준으로 합니다.',
  },
  {
    id: 4,
    category: '안내',
    title: '반품/환불 처리 절차 안내',
    date: '2026.02.15',
    content:
      '주문 내역에서 상태에 맞는 취소·반품 요청을 진행할 수 있습니다.\n판매자 승인 및 운송장 등록 등 단계별 처리 절차가 있으니 화면 안내를 따라 진행해 주세요.',
  },
  {
    id: 5,
    category: '점검',
    title: '정기 점검 일정 안내 (매주 수요일 03:00~04:00)',
    date: '2026.02.10',
    content:
      '점검 시간에는 일부 기능이 일시적으로 제한될 수 있습니다.\n점검이 조기 종료되면 즉시 정상화되며, 연장 시 추가 공지로 안내드립니다.',
  },
  {
    id: 6,
    category: '공지',
    title: '커뮤니티 운영 기준 업데이트',
    date: '2026.02.05',
    content:
      '허위 매물, 반복 도배, 거래 유도성 외부 링크 게시는 제재 대상입니다.\n신고 접수 후 운영 정책에 따라 검토 및 조치가 진행됩니다.',
  },
];

const NoticePage = () => {
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
          <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">공지사항</h1>
        </div>

        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {NOTICES.map((notice) => (
            <article key={notice.id} className="px-2 py-4 min-[360px]:py-5">
              <div className="mb-2 flex items-center gap-3">
                <span className={`rounded px-2 py-1 text-xs font-bold ${CATEGORY_STYLE[notice.category]}`}>
                  {notice.category}
                </span>
                <span className="text-sm text-neutral-400">{notice.date}</span>
              </div>

              <h2 className="text-base font-semibold text-neutral-900 min-[360px]:text-lg">
                {notice.title}
              </h2>

              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {notice.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticePage;