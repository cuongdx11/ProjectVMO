
const calculateShippingCost = async (shippingAddress) => {
   
    const baseRate = 10000; 
    
   
    let additionalFee = 0;
    if (shippingAddress.city.toLowerCase().includes('hà nội')) {
      additionalFee = 10000;
    } else if (shippingAddress.city.toLowerCase().includes('hồ chí minh')) {
      additionalFee = 15000;
    } else {
      additionalFee = 30000; 
    }
  
    return baseRate + additionalFee;
  };
  
  module.exports = { 
    calculateShippingCost 
  }