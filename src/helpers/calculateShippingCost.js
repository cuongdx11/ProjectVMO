// utils/shippingCalculator.js
const calculateShippingCost = async (shippingAddress) => {
    // Đây là một ví dụ đơn giản. Trong thực tế, bạn có thể cần tích hợp
    // với một API vận chuyển hoặc có một logic phức tạp hơn.
    const baseRate = 25000; // Giả sử phí cơ bản là 25,000 VND
    
    // Ví dụ: Tính phí dựa trên thành phố
    let additionalFee = 0;
    if (shippingAddress.city.toLowerCase().includes('hà nội')) {
      additionalFee = 10000;
    } else if (shippingAddress.city.toLowerCase().includes('hồ chí minh')) {
      additionalFee = 15000;
    } else {
      additionalFee = 30000; // Phí cho các tỉnh thành khác
    }
  
    return baseRate + additionalFee;
  };
  
  module.exports = { calculateShippingCost };