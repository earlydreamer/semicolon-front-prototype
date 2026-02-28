/**
 * 404 Not Found 페이지
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center p-4">
      <div className="text-4xl font-bold text-neutral-300 mb-4">404</div>
      <h1 className="text-xl font-bold text-neutral-900 mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-neutral-500 mb-8 max-w-sm">
        요청하신 페이지가 사라졌거나 잘못된 경로입니다.
        <br />
        입력하신 주소가 정확한지 다시 한번 확인해 주세요.
      </p>
      <Link to="/">
        <Button size="lg" className="px-8">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
