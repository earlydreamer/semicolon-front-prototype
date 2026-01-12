import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/common/Card';

const MOCK_NOTICES = [
  {
    id: 1,
    title: '[공지] 세미콜론 정식 서비스 런칭 안내',
    date: '2026.01.01',
    category: '안내',
    isNew: false,
  },
  {
    id: 2,
    title: '[이벤트] 첫 거래 시 5,000원 쿠폰 증정!',
    date: '2026.01.05',
    category: '이벤트',
    isNew: true,
  },
  {
    id: 3,
    title: '[서비스] 시스템 점검 안내 (1월 15일)',
    date: '2026.01.10',
    category: '점검',
    isNew: true,
  },
];

export default function NoticePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">공지사항</h1>
        <p className="text-neutral-500">세미콜론의 새로운 소식과 안내사항을 확인하세요.</p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {MOCK_NOTICES.map((notice) => (
          <Card 
            key={notice.id} 
            className="flex cursor-pointer items-center justify-between p-6 hover:border-primary-300 transition-colors"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                  {notice.category}
                </span>
                {notice.isNew && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">{notice.title}</h3>
              <p className="text-sm text-neutral-400">{notice.date}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-neutral-300" />
          </Card>
        ))}
      </div>
    </div>
  );
}
