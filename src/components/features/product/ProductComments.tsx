import User from 'lucide-react/dist/esm/icons/user';

interface Reply {
  id: string;
  authorUuid: string;
  authorRole: 'SELLER' | 'BUYER';
  content: string;
}

interface Comment {
  id: string;
  authorUuid: string;
  authorRole: 'SELLER' | 'BUYER';
  content: string;
  replies?: Reply[];
}

interface ProductCommentsProps {
  comments?: Comment[];
  sellerUserId: string;
}

const shortId = (value: string) => (value ? value.slice(0, 8) : '알수없음');

export const ProductComments = ({ comments, sellerUserId }: ProductCommentsProps) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-bold mb-4">상품 문의 ({comments?.length || 0})</h3>

      <div className="space-y-6">
        {comments && comments.map((comment) => (
          <div key={comment.id} className="group">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <User className="h-full w-full p-1 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900">{shortId(comment.authorUuid)}</span>
                  {comment.authorRole === 'SELLER' && (
                    <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
                      판매자
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      <User className="h-full w-full p-1 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900">{shortId(reply.authorUuid)}</span>
                        {(reply.authorRole === 'SELLER' || reply.authorUuid === sellerUserId) && (
                          <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
                            판매자
                          </span>
                        )}
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
