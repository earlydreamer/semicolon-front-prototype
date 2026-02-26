import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { sanitizeUrlParam, isValidId } from "@/utils/sanitize";
import { findCategoryPath } from "@/utils/category";
import type { Category } from "@/types/category";
import { useToast } from "@/components/common/Toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { useLikeStore } from "@/stores/useLikeStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useProductStore } from "@/stores/useProductStore";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { commentService } from "@/services/commentService";
import type { CartItem } from "@/types/cart";
import type { CommentThreadResponse } from "@/services/commentService";
import type { ProductComment } from "@/types/comment";

export const useProductDetail = (rawProductId: string | undefined) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { isLiked: checkIsLiked, toggleLike, fetchUserLikes } = useLikeStore();
  const {
    clearOrder,
    orderUuid,
    orderItems,
    orderResponseItems,
    setOrderUuid,
    setOrderItems,
    setOrderResponseItems,
    setCouponUuid,
    setCouponDiscountAmount,
    setDepositUseAmount,
  } = useOrderStore();
  const {
    currentProduct: apiProduct,
    isLoading,
    error,
    fetchProductDetail,
  } = useProductStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLikeSubmitting, setIsLikeSubmitting] = useState(false);
  const [pendingOrderUuidForProduct, setPendingOrderUuidForProduct] = useState<
    string | null
  >(null);

  const productId = useMemo(
    () => sanitizeUrlParam(rawProductId),
    [rawProductId],
  );

  // 蹂묐젹 ?곗씠???섏묶 (Waterfall ?쒓굅)
  useEffect(() => {
    if (!productId || !isValidId(productId)) return;

    const loadInitialData = async () => {
      try {
        const [categoryData, commentData] = await Promise.all([
          productService.getCategories(),
          commentService.getProductComments(productId, { page: 0, size: 20 }),
        ]);

        // 移댄뀒怨좊━ ?몃━ 鍮뚮뱶
        const buildTree = (
          parentId: number | null,
          depth: number,
        ): Category[] =>
          categoryData
            .filter((cat) => cat.parentId === parentId)
            .map((cat) => ({
              id: String(cat.id),
              name: cat.name,
              depth: Math.min(Math.max(depth, 1), 3) as 1 | 2 | 3,
              parentId: cat.parentId === null ? null : String(cat.parentId),
              children: buildTree(cat.id, depth + 1),
            }));
        setCategories(buildTree(null, 1));

        // ?볤? ?곗씠??媛怨?
        setComments(
          (commentData.items || []).map((thread: CommentThreadResponse) => ({
              id: thread.parent.commentUuid,
              authorUuid: thread.parent.authorUuid,
              authorRole: thread.parent.authorRole,
              content: thread.parent.content,
              replies: (thread.replies || []).map((reply) => ({
                id: reply.commentUuid,
                authorUuid: reply.authorUuid,
                authorRole: reply.authorRole,
                content: reply.content,
              })),
            }),
          ),
        );

        // ?곹뭹 ?곸꽭 ?뺣낫??Store瑜??듯빐 蹂꾨룄濡??좎? (湲곗〈 ?꾪궎?띿쿂 議댁쨷)
        fetchProductDetail(productId);
      } catch (err) {
        console.error("Failed to load product initial data:", err);
      }
    };

    loadInitialData();
  }, [productId, fetchProductDetail]);

  const product = useMemo(() => {
    if (!apiProduct?.seller) return null;

    return {
      id: apiProduct.productUuid,
      title: apiProduct.title,
      price: apiProduct.price,
      description: apiProduct.description,
      tags: apiProduct.tagNames || [],
      image: apiProduct.imageUrls?.[0] || "",
      images: apiProduct.imageUrls || [],
      categoryId: apiProduct.category?.id || 0,
      saleStatus: apiProduct.saleStatus,
      likeCount: apiProduct.likeCount || 0,
      viewCount: apiProduct.viewCount || 0,
      createdAt: new Date().toISOString(),
      seller: {
        sellerUuid: apiProduct.seller.sellerUuid,
        sellerUserUuid: apiProduct.sellerUuid,
        shopUuid: apiProduct.seller.shopUuid,
        nickname: apiProduct.seller.nickname,
        rating: apiProduct.seller.averageRating || 0,
        reviewCount: apiProduct.seller.reviewCount || 0,
      },
      comments,
    };
  }, [apiProduct, comments]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    void fetchUserLikes(user.id);
  }, [isAuthenticated, user?.id, fetchUserLikes]);

  const categoryPath = useMemo(
    () => findCategoryPath(categories, String(product?.categoryId || "")) || [],
    [categories, product?.categoryId],
  );

  const isLiked = productId && user ? checkIsLiked(user.id, productId) : false;

  useEffect(() => {
    const findMyPendingOrder = async () => {
      if (!isAuthenticated || !product?.id) {
        setPendingOrderUuidForProduct(null);
        return;
      }

      try {
        const res = await orderService.getMyOrders(0, 100);
        const pendingOrder = res.content.find(
          (order) =>
            order.status === "PENDING" &&
            order.items?.some((item) => item.productUuid === product.id),
        );
        setPendingOrderUuidForProduct(pendingOrder?.orderUuid ?? null);
      } catch {
        setPendingOrderUuidForProduct(null);
      }
    };

    findMyPendingOrder();
  }, [isAuthenticated, product?.id]);

  const handleLike = useCallback(async () => {
    if (!productId || !user) {
      showToast("로그인이 필요합니다.", "error");
      return;
    }
    if (isLikeSubmitting) return;

    setIsLikeSubmitting(true);
    try {
      const nextLike = await toggleLike(user.id, productId);
      const nextIsLiked = nextLike.isLiked;
      showToast(
        nextIsLiked ? "찜 목록에 추가했어요." : "찜을 해제했어요.",
        nextIsLiked ? "success" : "info",
      );
    } catch {
      showToast(
        "찜 처리에 실패했습니다. 잠시 후 다시 시도해주세요.",
        "error",
      );
    } finally {
      setIsLikeSubmitting(false);
    }
  }, [productId, user, toggleLike, showToast, isLikeSubmitting]);
  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    const added = await addToCart(product.id);
    showToast(
      added ? "?λ컮援щ땲??異붽??덉뼱??" : "?대? ?λ컮援щ땲???덉뼱??",
      added ? "success" : "info",
    );
  }, [product, addToCart, showToast]);

  const handlePurchase = useCallback(() => {
    if (!product) return;
    if (!product.seller.sellerUserUuid) {
      showToast("?먮ℓ???뺣낫媛 ?놁뼱 二쇰Ц??吏꾪뻾?????놁뒿?덈떎.", "error");
      return;
    }

    const moveToOrderWithSingleItem = () => {
      clearOrder();
      const orderItem: CartItem = {
        cartId: -1,
        productUuid: product.id,
        sellerUuid: product.seller.sellerUserUuid,
        title: product.title,
        price: product.price ?? 0,
        saleStatus: product.saleStatus,
        thumbnailUrl: product.images?.[0] || "",
        createdAt: new Date().toISOString(),
        selected: true,
      };
      setOrderItems([orderItem]);
      navigate("/order");
    };

    if (product.saleStatus !== "RESERVED") {
      moveToOrderWithSingleItem();
      return;
    }

    const hasLocalPendingForProduct =
      !!orderUuid &&
      !!orderResponseItems &&
      orderResponseItems.some((item) => item.productUuid === product.id) &&
      orderItems.length > 0;

    if (hasLocalPendingForProduct) {
      navigate("/checkout");
      return;
    }

    if (!pendingOrderUuidForProduct) {
      showToast("嫄곕옒以묒씤 ?곹뭹?낅땲??", "error");
      return;
    }

    (async () => {
      try {
        const orderDetail = await orderService.getOrder(
          pendingOrderUuidForProduct,
        );
        if (orderDetail.orderStatus !== "PENDING") {
          showToast("?대? 泥섎━??二쇰Ц?낅땲??", "info");
          return;
        }

        const restoredOrderItems = orderDetail.items.map((item, index) => ({
          cartId: -(index + 1),
          productUuid: item.productUuid,
          sellerUuid: item.sellerUuid,
          title: item.productName,
          price: item.productPrice,
          saleStatus: "ON_SALE" as const,
          thumbnailUrl: item.imageUrl ?? null,
          createdAt: orderDetail.orderedAt,
          selected: true,
        }));

        setOrderUuid(orderDetail.orderUuid);
        setOrderItems(restoredOrderItems);
        setOrderResponseItems(
          orderDetail.items.map((item) => ({
            orderItemUuid: item.orderItemUuid,
            productUuid: item.productUuid,
            sellerUuid: item.sellerUuid,
            productName: item.productName,
            productPrice: item.productPrice,
            imageUrl: item.imageUrl,
          })),
        );
        setCouponUuid(null);
        setCouponDiscountAmount(0);
        setDepositUseAmount(0);
        navigate("/checkout");
      } catch {
        showToast("寃곗젣 ?섏씠吏濡??대룞?섏? 紐삵뻽?댁슂.", "error");
      }
    })();
  }, [
    product,
    pendingOrderUuidForProduct,
    clearOrder,
    orderUuid,
    orderItems,
    orderResponseItems,
    setOrderUuid,
    setOrderItems,
    setOrderResponseItems,
    setCouponUuid,
    setCouponDiscountAmount,
    setDepositUseAmount,
    navigate,
    showToast,
  ]);

  return {
    product,
    isLoading,
    error,
    categoryPath,
    isLiked,
    isShareModalOpen,
    setIsShareModalOpen,
    isReportModalOpen,
    setIsReportModalOpen,
    handleLike,
    handleAddToCart,
    handlePurchase,
    isOwnPendingReservation:
      product?.saleStatus === "RESERVED" && !!pendingOrderUuidForProduct,
  };
};

