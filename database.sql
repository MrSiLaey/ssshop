-- =====================================================
-- SSShop Database Schema for MySQL
-- Import this file via phpMyAdmin
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

-- ==================== USER MANAGEMENT ====================

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL,
  `email` VARCHAR(191) NOT NULL,
  `emailVerified` DATETIME(3) NULL,
  `password` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `role` ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key`(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `accounts` (
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
  UNIQUE INDEX `accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
  INDEX `accounts_userId_idx`(`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `sessionToken` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sessions_sessionToken_key`(`sessionToken`),
  INDEX `sessions_userId_idx`(`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  UNIQUE INDEX `verification_tokens_token_key`(`token`),
  UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== PRODUCT MANAGEMENT ====================

CREATE TABLE IF NOT EXISTS `product_categories` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `parentId` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `product_categories_slug_key`(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
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
  `trackInventory` BOOLEAN NOT NULL DEFAULT true,
  `productType` ENUM('PHYSICAL', 'DIGITAL', 'SERVICE') NOT NULL DEFAULT 'PHYSICAL',
  `images` JSON NULL,
  `thumbnail` VARCHAR(191) NULL,
  `metaTitle` VARCHAR(191) NULL,
  `metaDescription` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `isFeatured` BOOLEAN NOT NULL DEFAULT false,
  `isDigital` BOOLEAN NOT NULL DEFAULT false,
  `weight` DECIMAL(10, 2) NULL,
  `width` DECIMAL(10, 2) NULL,
  `height` DECIMAL(10, 2) NULL,
  `length` DECIMAL(10, 2) NULL,
  `categoryId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `products_slug_key`(`slug`),
  UNIQUE INDEX `products_sku_key`(`sku`),
  INDEX `products_categoryId_idx`(`categoryId`),
  INDEX `products_slug_idx`(`slug`),
  INDEX `products_isActive_isFeatured_idx`(`isActive`, `isFeatured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `digital_assets` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `fileName` VARCHAR(191) NOT NULL,
  `fileUrl` VARCHAR(191) NOT NULL,
  `fileSize` INT NOT NULL,
  `fileType` VARCHAR(191) NOT NULL,
  `version` VARCHAR(191) NULL,
  `downloadLimit` INT NULL DEFAULT -1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `download_logs` (
  `id` VARCHAR(191) NOT NULL,
  `digitalAssetId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` VARCHAR(191) NULL,
  `downloadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `license_keys` (
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
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `license_keys_key_key`(`key`),
  INDEX `license_keys_key_idx`(`key`),
  INDEX `license_keys_userId_idx`(`userId`),
  INDEX `license_keys_productId_idx`(`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `license_activations` (
  `id` VARCHAR(191) NOT NULL,
  `licenseKeyId` VARCHAR(191) NOT NULL,
  `machineId` VARCHAR(191) NOT NULL,
  `machineName` VARCHAR(191) NULL,
  `ipAddress` VARCHAR(191) NULL,
  `activatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deactivatedAt` DATETIME(3) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cart_items_userId_productId_key`(`userId`, `productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `discountType` ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
  `discountValue` DECIMAL(10, 2) NOT NULL,
  `minPurchase` DECIMAL(10, 2) NULL,
  `maxDiscount` DECIMAL(10, 2) NULL,
  `usageLimit` INT NULL,
  `usageCount` INT NOT NULL DEFAULT 0,
  `usageLimitPerUser` INT NULL DEFAULT 1,
  `startsAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `coupons_code_key`(`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `total` DECIMAL(10, 2) NOT NULL,
  `couponId` VARCHAR(191) NULL,
  `couponCode` VARCHAR(191) NULL,
  `shippingAddress` JSON NULL,
  `billingAddress` JSON NULL,
  `trackingNumber` VARCHAR(191) NULL,
  `shippingCarrier` VARCHAR(191) NULL,
  `shippedAt` DATETIME(3) NULL,
  `deliveredAt` DATETIME(3) NULL,
  `customerNote` VARCHAR(191) NULL,
  `adminNote` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
  INDEX `orders_userId_idx`(`userId`),
  INDEX `orders_orderNumber_idx`(`orderNumber`),
  INDEX `orders_status_idx`(`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `productName` VARCHAR(191) NOT NULL,
  `productSku` VARCHAR(191) NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `isDigital` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'THB',
  `method` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PROMPTPAY', 'BANK_TRANSFER', 'WALLET') NOT NULL,
  `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `provider` VARCHAR(191) NOT NULL,
  `providerPaymentId` VARCHAR(191) NULL,
  `providerChargeId` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `errorMessage` VARCHAR(191) NULL,
  `paidAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `payments_orderId_idx`(`orderId`),
  INDEX `payments_providerPaymentId_idx`(`providerPaymentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `title` VARCHAR(191) NULL,
  `comment` TEXT NULL,
  `isVerified` BOOLEAN NOT NULL DEFAULT false,
  `isApproved` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `reviews_productId_userId_key`(`productId`, `userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `entity` VARCHAR(191) NOT NULL,
  `entityId` VARCHAR(191) NULL,
  `oldData` JSON NULL,
  `newData` JSON NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `audit_logs_entity_entityId_idx`(`entity`, `entityId`),
  INDEX `audit_logs_userId_idx`(`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `settings_key_key`(`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== FOREIGN KEYS ====================

ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `digital_assets` ADD CONSTRAINT `digital_assets_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `download_logs` ADD CONSTRAINT `download_logs_digitalAssetId_fkey` FOREIGN KEY (`digitalAssetId`) REFERENCES `digital_assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `license_keys` ADD CONSTRAINT `license_keys_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `license_keys` ADD CONSTRAINT `license_keys_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `license_keys` ADD CONSTRAINT `license_keys_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `license_activations` ADD CONSTRAINT `license_activations_licenseKeyId_fkey` FOREIGN KEY (`licenseKeyId`) REFERENCES `license_keys`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Admin User (password: password123)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('cluser001', 'Admin', 'admin@ssshop.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'ADMIN', NOW(), NOW()),
('cluser002', 'Demo User', 'user@ssshop.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'USER', NOW(), NOW());

-- Categories
INSERT INTO `product_categories` (`id`, `name`, `slug`, `description`, `isActive`, `createdAt`, `updatedAt`) VALUES
('clcat001', 'Operating Systems', 'operating-systems', 'Windows, macOS, Linux licenses', true, NOW(), NOW()),
('clcat002', 'Office Software', 'office-software', 'Microsoft Office, Google Workspace', true, NOW(), NOW()),
('clcat003', 'Security', 'security', 'Antivirus and security software', true, NOW(), NOW()),
('clcat004', 'Design Software', 'design-software', 'Adobe, Figma, Sketch licenses', true, NOW(), NOW()),
('clcat005', 'Development Tools', 'development-tools', 'IDEs, DevOps tools', true, NOW(), NOW());

-- Products
INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `comparePrice`, `quantity`, `productType`, `isActive`, `isFeatured`, `isDigital`, `categoryId`, `thumbnail`, `createdAt`, `updatedAt`) VALUES
('clprod001', 'Windows 11 Pro', 'windows-11-pro', 'Windows 11 Professional License Key - Lifetime activation. Includes all Pro features like BitLocker, Remote Desktop, and Hyper-V.', 1290.00, 3990.00, 100, 'DIGITAL', true, true, true, 'clcat001', '/images/products/windows11.png', NOW(), NOW()),
('clprod002', 'Windows 11 Home', 'windows-11-home', 'Windows 11 Home License Key - Lifetime activation for personal use.', 890.00, 2990.00, 150, 'DIGITAL', true, false, true, 'clcat001', '/images/products/windows11-home.png', NOW(), NOW()),
('clprod003', 'Microsoft Office 2024 Pro Plus', 'office-2024-pro-plus', 'Microsoft Office 2024 Professional Plus - Full package including Word, Excel, PowerPoint, Outlook, Access, Publisher.', 1990.00, 5990.00, 50, 'DIGITAL', true, true, true, 'clcat002', '/images/products/office2024.png', NOW(), NOW()),
('clprod004', 'Microsoft 365 Family (1 Year)', 'microsoft-365-family', 'Microsoft 365 Family subscription for up to 6 users. Includes 1TB OneDrive per user.', 2490.00, 3199.00, 200, 'DIGITAL', true, false, true, 'clcat002', '/images/products/m365-family.png', NOW(), NOW()),
('clprod005', 'Norton 360 Deluxe', 'norton-360-deluxe', 'Norton 360 Deluxe - 1 Year, 5 Devices. Real-time threat protection, VPN, Password Manager.', 890.00, 1490.00, 300, 'DIGITAL', true, true, true, 'clcat003', '/images/products/norton.png', NOW(), NOW()),
('clprod006', 'Kaspersky Total Security', 'kaspersky-total-security', 'Kaspersky Total Security - 1 Year, 3 Devices. Complete protection for your digital life.', 790.00, 1390.00, 250, 'DIGITAL', true, false, true, 'clcat003', '/images/products/kaspersky.png', NOW(), NOW()),
('clprod007', 'Adobe Creative Cloud (1 Year)', 'adobe-creative-cloud', 'Adobe Creative Cloud All Apps - 1 Year Subscription. Access to Photoshop, Illustrator, Premiere Pro, and 20+ apps.', 12900.00, 18900.00, 30, 'DIGITAL', true, true, true, 'clcat004', '/images/products/adobe-cc.png', NOW(), NOW()),
('clprod008', 'JetBrains All Products Pack', 'jetbrains-all-products', 'JetBrains All Products Pack - 1 Year. IntelliJ IDEA, PyCharm, WebStorm, and all other JetBrains IDEs.', 8900.00, 14900.00, 25, 'DIGITAL', true, false, true, 'clcat005', '/images/products/jetbrains.png', NOW(), NOW());

-- License Keys
INSERT INTO `license_keys` (`id`, `key`, `productId`, `status`, `activationsLimit`, `createdAt`, `updatedAt`) VALUES
('cllic001', 'WIN11-PRO-XXXX-YYYY-ZZZZ', 'clprod001', 'ACTIVE', 1, NOW(), NOW()),
('cllic002', 'WIN11-PRO-AAAA-BBBB-CCCC', 'clprod001', 'ACTIVE', 1, NOW(), NOW()),
('cllic003', 'WIN11-HOME-XXXX-YYYY-ZZZZ', 'clprod002', 'ACTIVE', 1, NOW(), NOW()),
('cllic004', 'OFF2024-XXXX-YYYY-ZZZZ-1111', 'clprod003', 'ACTIVE', 1, NOW(), NOW()),
('cllic005', 'M365-FAM-XXXX-YYYY-ZZZZ', 'clprod004', 'ACTIVE', 6, NOW(), NOW()),
('cllic006', 'NORTON-360-XXXX-YYYY', 'clprod005', 'ACTIVE', 5, NOW(), NOW()),
('cllic007', 'KASP-TS-XXXX-YYYY-ZZZZ', 'clprod006', 'ACTIVE', 3, NOW(), NOW()),
('cllic008', 'ADOBE-CC-XXXX-YYYY-ZZZZ', 'clprod007', 'ACTIVE', 2, NOW(), NOW());

-- Settings
INSERT INTO `settings` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
('clset001', 'site_name', '"Soft Stop Shop"', NOW(), NOW()),
('clset002', 'site_description', '"ร้านขายซอฟต์แวร์ลิขสิทธิ์แท้ ราคาถูก"', NOW(), NOW()),
('clset003', 'currency', '"THB"', NOW(), NOW()),
('clset004', 'tax_rate', '7', NOW(), NOW());
