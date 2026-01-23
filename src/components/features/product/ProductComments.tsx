/**
 * 상품 문의 섹션 컴포넌트
 * 
 * ProductDetailPage에서 분리된 댓글/문의 관리 컴포넌트
 */

import User from 'lucide-react/dist/esm/icons/user';
import { formatTimeAgo } from '@/utils/date';

interface CommentUser {
  nickname: string;
  avatar?: string;
}

interface Reply {
  id: number;
  userId: string;
  user: CommentUser;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  user: CommentUser;
  content: string;
  createdAt: string;
  replies?: Reply[];
}

interface ProductCommentsProps {
  comments?: Comment[];
  sellerUserId: string;
}

export const ProductComments = ({ comments, sellerUserId }: ProductCommentsProps) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-bold mb-4">상품 문의 ({comments?.length || 0})</h3>
      
      {/* Comment Input */}
      <div className="flex gap-2 mb-6">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          <User className="h-full w-full p-1 text-gray-400" />
        </div>
        <div className="flex-1">
          <textarea 
            placeholder="상품에 대해 문의해보세요." 
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none h-20"
          />
          <div className="flex justify-end mt-2">
            <button className="rounded px-3 py-1.5 bg-gray-900 text-white text-xs font-medium hover:bg-gray-800">
              등록
            </button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-6">
        {comments && comments.map((comment) => (
          <div key={comment.id} className="group">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img src={comment.user.avatar} alt={comment.user.nickname} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900">{comment.user.nickname}</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
                <button className="text-xs text-gray-400 font-medium mt-1 hover:text-gray-600">답글 달기</button>
              </div>
            </div>
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                      <img src={reply.user.avatar} alt={reply.user.nickname} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900">{reply.user.nickname}</span>
                        {reply.userId === sellerUserId && (
                          <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
                            판매자
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
