-- SSShop Database Setup
-- Run this in phpMyAdmin

-- Drop existing tables (if any)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `license_activations`;
DROP TABLE IF EXISTS `license_keys`;
DROP TABLE IF EXISTS `download_logs`;
DROP TABLE IF EXISTS `digital_assets`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `verification_tokens`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `_prisma_migrations`;
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables

CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL,
  `email` VARCHAR(191) NOT NULL,
  `emailVerified` DATETIME(3) NULL,
  `password` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `role` ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `accounts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `providerAccountId` VARCHAR(191) NOT NULL,
  `refresh_token` TEXT NULL,
  `access_token` TEXT NULL,
  `expires_at` INT NULL,
  `token_type` VARCHAR(191) NULL,
  `scope` VARCHAR(191) NULL,
  `id_token` TEXT NULL,
  `session_state` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`, `providerAccountId`),
  KEY `accounts_userId_fkey` (`userId`),
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `sessionToken` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_sessionToken_key` (`sessionToken`),
  KEY `sessions_userId_fkey` (`userId`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `verification_tokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  UNIQUE KEY `verification_tokens_token_key` (`token`),
  UNIQUE KEY `verification_tokens_identifier_token_key` (`identifier`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_categories` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `parentId` VARCHAR(191) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_categories_slug_key` (`slug`),
  KEY `product_categories_parentId_fkey` (`parentId`),
  CONSTRAINT `product_categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `shortDescription` VARCHAR(191) NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `comparePrice` DECIMAL(10, 2) NULL,
  `costPrice` DECIMAL(10, 2) NULL,
  `sku` VARCHAR(191) NULL,
  `barcode` VARCHAR(191) NULL,
  `quantity` INT NOT NULL DEFAULT 0,
  `lowStockThreshold` INT NOT NULL DEFAULT 5,
  `trackInventory` TINYINT(1) NOT NULL DEFAULT 1,
  `productType` ENUM('PHYSICAL', 'DIGITAL', 'SERVICE') NOT NULL DEFAULT 'PHYSICAL',
  `images` JSON NULL,
  `thumbnail` VARCHAR(191) NULL,
  `metaTitle` VARCHAR(191) NULL,
  `metaDescription` VARCHAR(191) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `isFeatured` TINYINT(1) NOT NULL DEFAULT 0,
  `isDigital` TINYINT(1) NOT NULL DEFAULT 0,
  `weight` DECIMAL(10, 2) NULL,
  `width` DECIMAL(10, 2) NULL,
  `height` DECIMAL(10, 2) NULL,
  `length` DECIMAL(10, 2) NULL,
  `categoryId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  UNIQUE KEY `products_sku_key` (`sku`),
  KEY `products_categoryId_idx` (`categoryId`),
  KEY `products_slug_idx` (`slug`),
  KEY `products_isActive_isFeatured_idx` (`isActive`, `isFeatured`),
  CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `total` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'THB',
  `paymentMethod` VARCHAR(191) NULL,
  `paymentId` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `shippingAddress` JSON NULL,
  `billingAddress` JSON NULL,
  `couponId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `paidAt` DATETIME(3) NULL,
  `shippedAt` DATETIME(3) NULL,
  `deliveredAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_orderNumber_key` (`orderNumber`),
  KEY `orders_userId_fkey` (`userId`),
  CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `order_items_orderId_fkey` (`orderId`),
  KEY `order_items_productId_fkey` (`productId`),
  CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_userId_productId_key` (`userId`, `productId`),
  KEY `cart_items_productId_fkey` (`productId`),
  CONSTRAINT `cart_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `license_keys` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `orderId` VARCHAR(191) NULL,
  `status` ENUM('ACTIVE', 'EXPIRED', 'SUSPENDED', 'REVOKED') NOT NULL DEFAULT 'ACTIVE',
  `activationsLimit` INT NOT NULL DEFAULT 1,
  `activationsCount` INT NOT NULL DEFAULT 0,
  `purchasedAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `lastActivatedAt` DATETIME(3) NULL,
  `machineIds` JSON NULL,
  `metadata` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_keys_key_key` (`key`),
  KEY `license_keys_key_idx` (`key`),
  KEY `license_keys_userId_idx` (`userId`),
  KEY `license_keys_productId_idx` (`productId`),
  CONSTRAINT `license_keys_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `license_keys_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `license_keys_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `title` VARCHAR(191) NULL,
  `comment` TEXT NULL,
  `isVerified` TINYINT(1) NOT NULL DEFAULT 0,
  `isApproved` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_userId_fkey` (`userId`),
  KEY `reviews_productId_fkey` (`productId`),
  CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `coupons` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `discountType` ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
  `discountValue` DECIMAL(10, 2) NOT NULL,
  `minPurchase` DECIMAL(10, 2) NULL,
  `maxDiscount` DECIMAL(10, 2) NULL,
  `usageLimit` INT NULL,
  `usedCount` INT NOT NULL DEFAULT 0,
  `startDate` DATETIME(3) NULL,
  `endDate` DATETIME(3) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `entityType` VARCHAR(191) NOT NULL,
  `entityId` VARCHAR(191) NULL,
  `oldData` JSON NULL,
  `newData` JSON NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_userId_fkey` (`userId`),
  CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== SEED DATA ====================

-- Admin User (password: password123)
INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('admin-001', 'admin@ssshop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.SZwKXGKJXzVNH5ygK6', 'Admin', 'ADMIN', NOW(), NOW()),
('user-001', 'user@ssshop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.SZwKXGKJXzVNH5ygK6', 'Test User', 'USER', NOW(), NOW());

-- Categories
INSERT INTO `product_categories` (`id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`) VALUES
('cat-001', 'ซอฟต์แวร์สำนักงาน', 'office-software', 'โปรแกรมสำหรับงานสำนักงาน', NOW(), NOW()),
('cat-002', 'ซอฟต์แวร์ความปลอดภัย', 'security-software', 'โปรแกรมป้องกันไวรัสและความปลอดภัย', NOW(), NOW()),
('cat-003', 'ซอฟต์แวร์กราฟิก', 'graphic-software', 'โปรแกรมตกแต่งภาพและออกแบบ', NOW(), NOW()),
('cat-004', 'ระบบปฏิบัติการ', 'operating-system', 'Windows, macOS และอื่นๆ', NOW(), NOW()),
('cat-005', 'เครื่องมือพัฒนา', 'developer-tools', 'IDE และเครื่องมือสำหรับนักพัฒนา', NOW(), NOW()),
('cat-006', 'ยูทิลิตี้', 'utilities', 'โปรแกรมอรรถประโยชน์ต่างๆ', NOW(), NOW());

-- Products
INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `comparePrice`, `quantity`, `productType`, `categoryId`, `isActive`, `isFeatured`, `isDigital`, `createdAt`, `updatedAt`) VALUES
('prod-001', 'Microsoft Office 365', 'microsoft-office-365', 'ชุดโปรแกรม Office ครบครัน Word, Excel, PowerPoint', 2999.00, 4590.00, 100, 'DIGITAL', 'cat-001', 1, 1, 1, NOW(), NOW()),
('prod-002', 'Windows 11 Pro', 'windows-11-pro', 'ระบบปฏิบัติการ Windows 11 Professional', 4590.00, 6590.00, 50, 'DIGITAL', 'cat-004', 1, 1, 1, NOW(), NOW()),
('prod-003', 'Norton 360 Deluxe', 'norton-360-deluxe', 'โปรแกรมป้องกันไวรัสระดับพรีเมียม', 1290.00, 1990.00, 200, 'DIGITAL', 'cat-002', 1, 1, 1, NOW(), NOW()),
('prod-004', 'Adobe Creative Cloud', 'adobe-creative-cloud', 'ชุดโปรแกรมออกแบบครบวงจร Photoshop, Illustrator, Premiere Pro', 12900.00, 18900.00, 30, 'DIGITAL', 'cat-003', 1, 1, 1, NOW(), NOW()),
('prod-005', 'Visual Studio Professional', 'visual-studio-pro', 'IDE สำหรับนักพัฒนามืออาชีพ', 15900.00, 19900.00, 25, 'DIGITAL', 'cat-005', 1, 0, 1, NOW(), NOW()),
('prod-006', 'Kaspersky Total Security', 'kaspersky-total-security', 'โปรแกรมป้องกันไวรัสและความปลอดภัยครบวงจร', 1590.00, 2290.00, 150, 'DIGITAL', 'cat-002', 1, 0, 1, NOW(), NOW()),
('prod-007', 'WinRAR', 'winrar', 'โปรแกรมบีบอัดไฟล์ยอดนิยม', 990.00, 1290.00, 500, 'DIGITAL', 'cat-006', 1, 0, 1, NOW(), NOW()),
('prod-008', 'CorelDRAW Graphics Suite', 'coreldraw-graphics-suite', 'โปรแกรมออกแบบกราฟิกระดับมืออาชีพ', 8900.00, 12900.00, 40, 'DIGITAL', 'cat-003', 1, 1, 1, NOW(), NOW());

-- License Keys
INSERT INTO `license_keys` (`id`, `key`, `productId`, `status`, `createdAt`, `updatedAt`) VALUES
('lic-001', 'XXXXX-XXXXX-XXXXX-XXXXX-OFF01', 'prod-001', 'ACTIVE', NOW(), NOW()),
('lic-002', 'XXXXX-XXXXX-XXXXX-XXXXX-WIN01', 'prod-002', 'ACTIVE', NOW(), NOW()),
('lic-003', 'XXXXX-XXXXX-XXXXX-XXXXX-NOR01', 'prod-003', 'ACTIVE', NOW(), NOW()),
('lic-004', 'XXXXX-XXXXX-XXXXX-XXXXX-ADO01', 'prod-004', 'ACTIVE', NOW(), NOW()),
('lic-005', 'XXXXX-XXXXX-XXXXX-XXXXX-VSP01', 'prod-005', 'ACTIVE', NOW(), NOW());

-- Settings
INSERT INTO `settings` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
('set-001', 'site_name', 'Soft Stop Shop', NOW(), NOW()),
('set-002', 'site_description', 'ร้านขายซอฟต์แวร์ลิขสิทธิ์แท้', NOW(), NOW()),
('set-003', 'contact_email', 'contact@softstopshop.com', NOW(), NOW()),
('set-004', 'contact_phone', '02-xxx-xxxx', NOW(), NOW());

-- Done!
SELECT 'Database setup complete!' AS message;
