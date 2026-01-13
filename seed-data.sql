-- SSShop Seed Data
-- Import this via phpMyAdmin

-- Admin User (password: password123)
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('admin-001', 'admin@ssshop.com', '$2a$10$rQzNlQfZT5XoYgBqK5IZxOqLzWQJQkV7YqZJxKzF5V5J5YqZJxKzF', 'Admin', 'ADMIN', NOW(), NOW()),
('user-001', 'user@ssshop.com', '$2a$10$rQzNlQfZT5XoYgBqK5IZxOqLzWQJQkV7YqZJxKzF5V5J5YqZJxKzF', 'Test User', 'USER', NOW(), NOW());

-- Categories
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`) VALUES
('cat-001', 'ซอฟต์แวร์สำนักงาน', 'office-software', 'โปรแกรมสำหรับงานสำนักงาน', NOW(), NOW()),
('cat-002', 'ซอฟต์แวร์ความปลอดภัย', 'security-software', 'โปรแกรมป้องกันไวรัสและความปลอดภัย', NOW(), NOW()),
('cat-003', 'ซอฟต์แวร์กราฟิก', 'graphic-software', 'โปรแกรมตกแต่งภาพและออกแบบ', NOW(), NOW()),
('cat-004', 'ระบบปฏิบัติการ', 'operating-system', 'Windows, macOS และอื่นๆ', NOW(), NOW()),
('cat-005', 'เครื่องมือพัฒนา', 'developer-tools', 'IDE และเครื่องมือสำหรับนักพัฒนา', NOW(), NOW()),
('cat-006', 'ยูทิลิตี้', 'utilities', 'โปรแกรมอรรถประโยชน์ต่างๆ', NOW(), NOW());

-- Products
INSERT INTO `Product` (`id`, `name`, `slug`, `description`, `price`, `originalPrice`, `image`, `categoryId`, `stock`, `isActive`, `isFeatured`, `createdAt`, `updatedAt`) VALUES
('prod-001', 'Microsoft Office 365', 'microsoft-office-365', 'ชุดโปรแกรม Office ครบครัน Word, Excel, PowerPoint', 2999.00, 4590.00, '/images/products/office365.png', 'cat-001', 100, 1, 1, NOW(), NOW()),
('prod-002', 'Windows 11 Pro', 'windows-11-pro', 'ระบบปฏิบัติการ Windows 11 Professional', 4590.00, 6590.00, '/images/products/windows11.png', 'cat-004', 50, 1, 1, NOW(), NOW()),
('prod-003', 'Norton 360 Deluxe', 'norton-360-deluxe', 'โปรแกรมป้องกันไวรัสระดับพรีเมียม', 1290.00, 1990.00, '/images/products/norton360.png', 'cat-002', 200, 1, 1, NOW(), NOW()),
('prod-004', 'Adobe Creative Cloud', 'adobe-creative-cloud', 'ชุดโปรแกรมออกแบบครบวงจร Photoshop, Illustrator, Premiere Pro', 12900.00, 18900.00, '/images/products/adobe-cc.png', 'cat-003', 30, 1, 1, NOW(), NOW()),
('prod-005', 'Visual Studio Professional', 'visual-studio-pro', 'IDE สำหรับนักพัฒนามืออาชีพ', 15900.00, 19900.00, '/images/products/vs-pro.png', 'cat-005', 25, 1, 0, NOW(), NOW()),
('prod-006', 'Kaspersky Total Security', 'kaspersky-total-security', 'โปรแกรมป้องกันไวรัสและความปลอดภัยครบวงจร', 1590.00, 2290.00, '/images/products/kaspersky.png', 'cat-002', 150, 1, 0, NOW(), NOW()),
('prod-007', 'WinRAR', 'winrar', 'โปรแกรมบีบอัดไฟล์ยอดนิยม', 990.00, 1290.00, '/images/products/winrar.png', 'cat-006', 500, 1, 0, NOW(), NOW()),
('prod-008', 'CorelDRAW Graphics Suite', 'coreldraw-graphics-suite', 'โปรแกรมออกแบบกราฟิกระดับมืออาชีพ', 8900.00, 12900.00, '/images/products/coreldraw.png', 'cat-003', 40, 1, 1, NOW(), NOW());

-- License Keys
INSERT INTO `LicenseKey` (`id`, `key`, `productId`, `status`, `createdAt`, `updatedAt`) VALUES
('lic-001', 'XXXXX-XXXXX-XXXXX-XXXXX-OFFICE', 'prod-001', 'AVAILABLE', NOW(), NOW()),
('lic-002', 'XXXXX-XXXXX-XXXXX-XXXXX-WIN11', 'prod-002', 'AVAILABLE', NOW(), NOW()),
('lic-003', 'XXXXX-XXXXX-XXXXX-XXXXX-NORTON', 'prod-003', 'AVAILABLE', NOW(), NOW()),
('lic-004', 'XXXXX-XXXXX-XXXXX-XXXXX-ADOBE', 'prod-004', 'AVAILABLE', NOW(), NOW()),
('lic-005', 'XXXXX-XXXXX-XXXXX-XXXXX-VSPR0', 'prod-005', 'AVAILABLE', NOW(), NOW());

-- Settings
INSERT INTO `Setting` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
('set-001', 'site_name', 'Soft Stop Shop', NOW(), NOW()),
('set-002', 'site_description', 'ร้านขายซอฟต์แวร์ลิขสิทธิ์แท้', NOW(), NOW()),
('set-003', 'contact_email', 'contact@softstopshop.com', NOW(), NOW()),
('set-004', 'contact_phone', '02-xxx-xxxx', NOW(), NOW());
