export type CommentAuthorRole = "SELLER" | "BUYER";

export interface ProductReply {
  id: string;
  authorUuid: string;
  authorRole: CommentAuthorRole;
  content: string;
}

export interface ProductComment {
  id: string;
  authorUuid: string;
  authorRole: CommentAuthorRole;
  content: string;
  replies: ProductReply[];
}
