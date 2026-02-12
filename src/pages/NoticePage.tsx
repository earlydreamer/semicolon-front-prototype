/**
 * 공지사항 페이지
 */
import { Link } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';

const NOTICES = [
  {
    id: 1,
    category: '공지',
    title: '덕쿠 서비스 오픈 안내',
    date: '2026.01.01',
    content: '안녕하세요. 취미 거래 플랫폼 덕쿠가 정식 오픈했습니다. 많은 이용 부탁드립니다.'
  },
  {
    id: 2,
    category: '이벤트',
    title: '오픈 기념 수수료 0원 이벤트',
    date: '2026.01.05',
    content: '오픈을 기념하여 1월 한 달간 판매 수수료가 무료입니다.'
  },
  {
    id: 3,
    category: '점검',
    title: '서버 정기 점검 안내 (1/15)',
    date: '2026.01.10',
    content: '더 나은 서비스를 위해 1월 15일 새벽 2시부터 4시까지 서버 점검이 진행됩니다.'
  },
  {
    id: 4,
    category: '안내',
    title: '안전결제 서비스 이용 가이드',
    date: '2026.01.12',
    content: '안전한 거래를 위한 에스크로 기반 안전결제 서비스 사용법을 안내해 드립니다.'
  }
];

const NoticePage = () => {
  return (
    <div className="min-h-screen bg-white py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-3xl px-3 min-[360px]:px-4">
        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-2 min-[360px]:mb-8 min-[360px]:gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">공지사항</h1>
        </div>

        {/* 공지 목록 */}
        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {NOTICES.map((notice) => (
            <div key={notice.id} className="group cursor-pointer px-2 py-4 transition-colors hover:bg-neutral-50 min-[360px]:py-5">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  notice.category === '이벤트' ? 'bg-orange-100 text-orange-600' :
                  notice.category === '점검' ? 'bg-red-100 text-red-600' :
                  'bg-neutral-100 text-neutral-600'
                }`}>
                  {notice.category}
                </span>
                <span className="text-sm text-neutral-400">{notice.date}</span>
              </div>
              <h3 className="text-base font-medium text-neutral-900 transition-colors group-hover:text-primary-600 min-[360px]:text-lg">
                {notice.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
