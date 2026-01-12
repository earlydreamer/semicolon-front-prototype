CREATE TABLE `payments` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`user_uuid`	UUID	NOT NULL,
	`payment_uuid`	UUID	NOT NULL	COMMENT '도메인 외부에서 참조할 때의 UUID',
	`order_uuid`	UUID	NOT NULL,
	`amount`	INTEGER	NOT NULL,
	`payment_type`	ENUM	NOT NULL	DEFAULT DEPOSIT	COMMENT 'enum('DEPOSIT')',
	`payment_status`	ENUM	NOT NULL	DEFAULT PENDING	COMMENT 'enum('DONE','ABORTED','FAILED','CANCLED','PARTIAL_CANCLED')',
	`pg_payment_key`	VARCHAR(50)	NULL	COMMENT 'Toss Payments API로부터 받은 Key 값',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL,
	`approved_at`	TIMESTAMP	NULL
);

CREATE TABLE `refund` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`payment_id`	INTEGER	NOT NULL,
	`refund_uuid`	UUID	NOT NULL,
	`refund_amount`	INTEGER	NOT NULL,
	`refund_status`	enum	NOT NULL	DEFAULT 'PENDING'	COMMENT 'enum{'PENDING','COMPLETED',CANCELLED')',
	`created_at`	INTEGER	NOT NULL,
	`approved_at`	TIMESTAMP	NULL,
	`updated_at`	INTEGER	NULL
);

CREATE TABLE `users` (
	`user_uuid`	UUID	NOT NULL,
	`email`	VARCHAR(100)	NOT NULL	COMMENT 'unique',
	`password`	VARCHAR(255)	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL	COMMENT 'unique',
	`role`	ENUM	NOT NULL	DEFAULT 'USER'	COMMENT '('USER', 'ADMIN')',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL,
	`deleted_at`	TIMESTAMP	NULL,
	`status`	enum	NOT NULL	DEFAULT 'ACTIVE'	COMMENT '('ACTIVE', 'BLOCKED', 'DELETE')'
);

CREATE TABLE `product_sellers` (
	`seller_uuid`	UUID	NOT NULL,
	`user_uuid`	UUID	NOT NULL,
	`intro`	TEXT	NULL,
	`sales_count`	INTEGER	NOT NULL	DEFAULT 0,
	`active_listing_count`	INTEGER	NOT NULL	DEFAULT 0,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `deposit` (
	`user_uuid`	UUID	NOT NULL,
	`deposit_uuid`	UUID	NOT NULL,
	`balance`	INTEGER	NOT NULL	DEFAULT 0,
	`version`	INTEGER	NOT NULL	DEFAULT 0,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `address` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`user_uuid`	UUID	NOT NULL,
	`name`	VARCHAR(50)	NOT NULL,
	`recipient`	VARCHAR(50)	NOT NULL,
	`contact_number`	VARCHAR(20)	NOT NULL,
	`base_address`	VARCHAR(255)	NOT NULL,
	`detail_address`	VARCHAR(255)	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now()
);

CREATE TABLE `settlements` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`settlement_uuid`	UUID	NOT NULL,
	`seller_uuid`	UUID	NOT NULL,
	`buyer_uuid`	UUID	NOT NULL,
	`payments_id`	UUID	NOT NULL,
	`deposit_id`	UUID	NOT NULL,
	`settlement_status`	enum	NOT NULL	DEFAULT 'PENDING'	COMMENT 'enum{'PENDING', 'COMPLETED')',
	`total_amount`	INTEGER	NOT NULL,
	`settlement_reservation_date`	TIMESTAMP	NOT NULL	COMMENT '구매 확정 후 당일 자정',
	`settlement_amount`	INTEGER	NOT NULL,
	`fee`	DECIAML(5,1)	NOT NULL	DEFAULT 0.9,
	`fee_amount`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `payment_order_items` (
	`id`	INTEGER	NOT NULL,
	`payment_order_item_uuid`	UUID	NOT NULL,
	`seller_uuid`	UUID	NOT NULL,
	`product_id`	INTEGER	NOT NULL,
	`product_name`	VARCHAR(100)	NOT NULL,
	`price`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`update_at`	TIMESTAMP	NULL,
	`image_url`	VARCHAR(255)	NULL
);

CREATE TABLE `product_comments` (
	`id`	INTEGER	NOT NULL,
	`product_id`	INTEGER	NOT NULL,
	`parent_id`	INTEGER	NOT NULL,
	`user_uuid`	UUID	NOT NULL,
	`comment_uuid`	UUID	NOT NULL,
	`content`	TEXT	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL,
	`deleted_at`	TIMESTAMP	NULL
);

CREATE TABLE `payment_users` (
	`payment_user_uuid`	UUID	NOT NULL,
	`user_uuid`	UUID	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL	COMMENT 'unique',
	`role`	ENUM	NOT NULL	DEFAULT 'USER'	COMMENT '('USER', 'ADMIN')',
	`status`	enum	NOT NULL	DEFAULT 'ACTIVE'	COMMENT '('ACTIVE', 'BLOCKED', 'DELETE')',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL,
	`deleted_at`	TIMESTAMP	NULL
);

CREATE TABLE `coupon_user` (
	`user_uuid`	UUID	NOT NULL,
	`id`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`expired_at`	TIMESTAMP	NOT NULL,
	`status`	ENUM	NOT NULL	COMMENT '('AVAILABLE', 'USED', 'EXPIRED', 'LOCKED')'
);

CREATE TABLE `product_users` (
	`user_uuid`	UUID	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL	COMMENT 'unique',
	`status`	enum	NOT NULL	DEFAULT 'ACTIVE'	COMMENT '('ACTIVE', 'BLOCKED', 'DELETED')',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL,
	`deleted_at`	TIMESTAMP	NULL
);

CREATE TABLE `orders` (
	`id`	INTEGER	NOT NULL,
	`order_uuid`	UUID	NOT NULL,
	`user_uuid`	UUID	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL	COMMENT 'unique',
	`address`	VARCHAR(255)	NOT NULL,
	`total_amount`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `categories` (
	`id`	INTEGER	NOT NULL,
	`category_name`	VARCHAR(100)	NOT NULL,
	`depth`	INTEGER	NOT NULL	DEFAULT 1	COMMENT '1 : root',
	`parent_id`	INTEGER	NULL	DEFAULT NULL
);

CREATE TABLE `product_images` (
	`id`	INTEGER	NOT NULL,
	`product_id`	INTEGER	NOT NULL,
	`image_url`	VARCHAR(100)	NOT NULL,
	`sort_order`	INTEGER	NOT NULL	DEFAULT 1,
	`is_thumnail`	BOOLEAN	NOT NULL	DEFAULT false
);

CREATE TABLE `refund_item` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`refund_id`	INTEGER	NOT NULL,
	`payment_order_item_id`	INTEGER	NOT NULL,
	`refund_uuid`	UUID	NOT NULL,
	`refund_amount`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL,
	`updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `carts` (
	`id`	INTEGER	NOT NULL,
	`cart_uuid`	UUID	NOT NULL,
	`user_uuid`	UUID	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `cart_items` (
	`product_uuid`	UUID	NOT NULL,
	`cart_id`	INTEGER	NOT NULL,
	`cart_item_uuid`	UUID	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`seller_uuid`	UUID	NOT NULL,
	`product_name`	VARCHAR(100)	NOT NULL,
	`price`	INTEGER	NOT NULL,
	`image_url`	VARCHAR(255)	NULL,
	`sale_status`	ENUM	NOT NULL	DEFAULT 'VISIBLE'	COMMENT '('VISIBLE', 'HIDDEN', 'BLOCKED')'
);

CREATE TABLE `products` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`category_id`	INTEGER	NOT NULL,
	`seller_uuid`	UUID	NOT NULL,
	`product_uuid`	UUID	NOT NULL,
	`title`	VARCHAR(200)	NOT NULL,
	`description`	TEXT	NULL,
	`price`	INTEGER	NOT NULL	COMMENT '0 이상 체크',
	`shipping_fee`	INTEGER	NOT NULL	DEFAULT 0,
	`condition_status`	ENUM	NOT NULL	DEFAULT 'SEALED'	COMMENT '('SEALED', 'NO_WEAR', 'MINOR_WEAR', 'VISIBLE_WEAR', 'DAMAGED')',
	`sale_status`	ENUM	NOT NULL	DEFAULT 'ON_SALE'	COMMENT '('ON_SALE', 'RESERVED', 'SOLD_OUT')',
	`visibility_status`	ENUM	NOT NULL	DEFAULT 'VISIBLE'	COMMENT '('VISIBLE', 'HIDDEN', 'BLOCKED')',
	`view_count`	INTEGER	NOT NULL	DEFAULT 0,
	`like_count`	INTEGER	NOT NULL	DEFAULT 0,
	`comment_count`	INTEGER	NOT NULL	DEFAULT 0,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`updated_at`	TIMESTAMP	NULL	DEFAULT on update,
	`deleted_at`	TIMESTAMP	NULL
);

CREATE TABLE `coupons` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`coupon_uuid`	UUID	NOT NULL,
	`coupon_name`	VARCHAR(100)	NOT NULL,
	`discount_amount`	INTEGER	NOT NULL,
	`minimum_order_amount`	INTEGER	NOT NULL,
	`valid_from`	TIMESTAMP	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`status`	ENUM	NOT NULL,
	`target_type`	ENUM	NOT NULL
);

CREATE TABLE `order_items` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`order_id`	INTEGER	NOT NULL,
	`order_item_uuid`	UUID	NOT NULL,
	`product_uuid`	UUID	NOT NULL,
	`seller_uuid`	UUID	NOT NULL,
	`product_name`	VARCHAR(100)	NOT NULL,
	`price`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`update_at`	TIMESTAMP	NULL,
	`image_url`	VARCHAR(255)	NULL,
	`carrier_name`	VARCHAR(50)	NULL,
	`carrier_code`	VARCHAR(20)	NULL,
	`tracking_number`	VARCHAR(50)	NULL,
	`status`	ENUM	NOT NULL
);

CREATE TABLE `deposit_users` (
	`user_uuid`	UUID	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL	COMMENT 'unique',
	`status`	enum	NOT NULL	COMMENT '('ACTIVE', 'BLOCKED', 'DELETE')'
);

CREATE TABLE `deposit_histories` (
	`id`	INTEGER	NOT NULL	COMMENT 'autoincrement',
	`amount`	INTEGER	NOT NULL,
	`balance_snapshot`	INTEGER	NOT NULL,
	`type`	ENUM	NOT NULL	COMMENT '('CHARGE', 'USE', 'REFUND', 'WITHDRAW', 'ADJUST')',
	`order_item_uuid`	UUID	NOT NULL	COMMENT '주문 상품 UUID',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now(),
	`user_uuid`	UUID	NOT NULL
);

CREATE TABLE `product_likes` (
	`user_uuid`	UUID	NOT NULL,
	`product_id`	INTEGER	NOT NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT now()
);

ALTER TABLE `payments` ADD CONSTRAINT `PK_PAYMENTS` PRIMARY KEY (
	`id`
);

ALTER TABLE `refund` ADD CONSTRAINT `PK_REFUND` PRIMARY KEY (
	`id`
);

ALTER TABLE `users` ADD CONSTRAINT `PK_USERS` PRIMARY KEY (
	`user_uuid`
);

ALTER TABLE `product_sellers` ADD CONSTRAINT `PK_PRODUCT_SELLERS` PRIMARY KEY (
	`seller_uuid`
);

ALTER TABLE `deposit` ADD CONSTRAINT `PK_DEPOSIT` PRIMARY KEY (
	`user_uuid`
);

ALTER TABLE `address` ADD CONSTRAINT `PK_ADDRESS` PRIMARY KEY (
	`id`
);

ALTER TABLE `settlements` ADD CONSTRAINT `PK_SETTLEMENTS` PRIMARY KEY (
	`id`
);

ALTER TABLE `payment_order_items` ADD CONSTRAINT `PK_PAYMENT_ORDER_ITEMS` PRIMARY KEY (
	`id`
);

ALTER TABLE `product_comments` ADD CONSTRAINT `PK_PRODUCT_COMMENTS` PRIMARY KEY (
	`id`
);

ALTER TABLE `payment_users` ADD CONSTRAINT `PK_PAYMENT_USERS` PRIMARY KEY (
	`payment_user_uuid`
);

ALTER TABLE `coupon_user` ADD CONSTRAINT `PK_COUPON_USER` PRIMARY KEY (
	`user_uuid`,
	`id`
);

ALTER TABLE `product_users` ADD CONSTRAINT `PK_PRODUCT_USERS` PRIMARY KEY (
	`user_uuid`
);

ALTER TABLE `orders` ADD CONSTRAINT `PK_ORDERS` PRIMARY KEY (
	`id`
);

ALTER TABLE `categories` ADD CONSTRAINT `PK_CATEGORIES` PRIMARY KEY (
	`id`
);

ALTER TABLE `product_images` ADD CONSTRAINT `PK_PRODUCT_IMAGES` PRIMARY KEY (
	`id`
);

ALTER TABLE `refund_item` ADD CONSTRAINT `PK_REFUND_ITEM` PRIMARY KEY (
	`id`
);

ALTER TABLE `carts` ADD CONSTRAINT `PK_CARTS` PRIMARY KEY (
	`id`
);

ALTER TABLE `cart_items` ADD CONSTRAINT `PK_CART_ITEMS` PRIMARY KEY (
	`product_uuid`,
	`cart_id`
);

ALTER TABLE `products` ADD CONSTRAINT `PK_PRODUCTS` PRIMARY KEY (
	`id`
);

ALTER TABLE `coupons` ADD CONSTRAINT `PK_COUPONS` PRIMARY KEY (
	`id`
);

ALTER TABLE `order_items` ADD CONSTRAINT `PK_ORDER_ITEMS` PRIMARY KEY (
	`id`
);

ALTER TABLE `deposit_users` ADD CONSTRAINT `PK_DEPOSIT_USERS` PRIMARY KEY (
	`user_uuid`
);

ALTER TABLE `deposit_histories` ADD CONSTRAINT `PK_DEPOSIT_HISTORIES` PRIMARY KEY (
	`id`
);

ALTER TABLE `product_likes` ADD CONSTRAINT `PK_PRODUCT_LIKES` PRIMARY KEY (
	`user_uuid`,
	`product_id`
);

ALTER TABLE `deposit` ADD CONSTRAINT `FK_deposit_users_TO_deposit_1` FOREIGN KEY (
	`user_uuid`
)
REFERENCES `deposit_users` (
	`user_uuid`
);

ALTER TABLE `coupon_user` ADD CONSTRAINT `FK_coupons_TO_coupon_user_1` FOREIGN KEY (
	`id`
)
REFERENCES `coupons` (
	`id`
);

ALTER TABLE `cart_items` ADD CONSTRAINT `FK_carts_TO_cart_items_1` FOREIGN KEY (
	`cart_id`
)
REFERENCES `carts` (
	`id`
);

ALTER TABLE `product_likes` ADD CONSTRAINT `FK_product_users_TO_product_likes_1` FOREIGN KEY (
	`user_uuid`
)
REFERENCES `product_users` (
	`user_uuid`
);

ALTER TABLE `product_likes` ADD CONSTRAINT `FK_products_TO_product_likes_1` FOREIGN KEY (
	`product_id`
)
REFERENCES `products` (
	`id`
);

