
const calculateShippingCost = async (shippingAddress) => {
    try {
      const baseRate = 10000; 
      let additionalFee = 0;
      if (shippingAddress.province.toLowerCase().includes('hà nội')) {
        additionalFee = 10000;
      } else if (shippingAddress.province.toLowerCase().includes('hồ chí minh')) {
        additionalFee = 15000;
      } else {
        additionalFee = 30000; 
      }
    
      return baseRate + additionalFee;
    } catch (error) {
      throw error
    }
   
  };
  
  module.exports = { 
    calculateShippingCost 
  }