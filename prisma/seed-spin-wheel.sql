-- Spin Wheel Seed Data
-- สร้างวงล้อนำโชคตัวอย่างพร้อมรางวัล

-- สร้างวงล้อหลัก
INSERT INTO spin_wheels (id, name, description, isActive, spinsPerDay, cooldownHours, showOnPopup, popupDelay, backgroundColor, textColor, createdAt, updatedAt)
VALUES 
  ('wheel-main-001', 'วงล้อนำโชค', 'หมุนเพื่อรับส่วนลดพิเศษ!', TRUE, 1, 24, TRUE, 3, '#000000', '#ffffff', NOW(), NOW());

-- สร้างรางวัลสำหรับวงล้อ
INSERT INTO spin_prizes (id, wheelId, name, description, type, value, maxValue, color, textColor, probability, totalQuantity, dailyLimit, validDays, minPurchase, isActive, position, wonCount, createdAt, updatedAt)
VALUES 
  -- รางวัลใหญ่ - โอกาสน้อย
  ('prize-001', 'wheel-main-001', 'ส่วนลด ฿500', 'ส่วนลดเงินสด 500 บาท', 'DISCOUNT_FIXED', 500.00, NULL, '#FF6B00', '#FFFFFF', 2.00, 10, 2, 7, 1000.00, TRUE, 0, 0, NOW(), NOW()),
  
  -- รางวัลกลาง
  ('prize-002', 'wheel-main-001', 'ส่วนลด ฿200', 'ส่วนลดเงินสด 200 บาท', 'DISCOUNT_FIXED', 200.00, NULL, '#FF9500', '#FFFFFF', 5.00, 50, 5, 7, 500.00, TRUE, 1, 0, NOW(), NOW()),
  
  ('prize-003', 'wheel-main-001', 'ส่วนลด ฿100', 'ส่วนลดเงินสด 100 บาท', 'DISCOUNT_FIXED', 100.00, NULL, '#FFCC00', '#000000', 10.00, 100, 10, 7, 300.00, TRUE, 2, 0, NOW(), NOW()),
  
  -- ส่วนลดเปอร์เซ็นต์
  ('prize-004', 'wheel-main-001', 'ลด 15%', 'ส่วนลด 15% สูงสุด ฿300', 'DISCOUNT_PERCENT', 15.00, 300.00, '#4CAF50', '#FFFFFF', 8.00, NULL, NULL, 7, 200.00, TRUE, 3, 0, NOW(), NOW()),
  
  ('prize-005', 'wheel-main-001', 'ลด 10%', 'ส่วนลด 10% สูงสุด ฿200', 'DISCOUNT_PERCENT', 10.00, 200.00, '#2196F3', '#FFFFFF', 12.00, NULL, NULL, 7, 100.00, TRUE, 4, 0, NOW(), NOW()),
  
  -- ส่งฟรี
  ('prize-006', 'wheel-main-001', 'ส่งฟรี', 'ส่งฟรีทั่วไทย', 'FREE_SHIPPING', 0.00, NULL, '#9C27B0', '#FFFFFF', 15.00, NULL, NULL, 7, 0.00, TRUE, 5, 0, NOW(), NOW()),
  
  -- ส่วนลดเล็ก
  ('prize-007', 'wheel-main-001', 'ส่วนลด ฿50', 'ส่วนลดเงินสด 50 บาท', 'DISCOUNT_FIXED', 50.00, NULL, '#E91E63', '#FFFFFF', 18.00, NULL, NULL, 7, 100.00, TRUE, 6, 0, NOW(), NOW()),
  
  -- ไม่ถูกรางวัล - โอกาสสูงสุด
  ('prize-008', 'wheel-main-001', 'เสียใจด้วย', 'ลองใหม่คราวหน้านะ', 'NO_PRIZE', 0.00, NULL, '#607D8B', '#FFFFFF', 30.00, NULL, NULL, 1, 0.00, TRUE, 7, 0, NOW(), NOW());

-- รวม probability = 2 + 5 + 10 + 8 + 12 + 15 + 18 + 30 = 100%
