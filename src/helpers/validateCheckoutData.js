// utils/validators.js
const validateCheckoutData = (formData) => {
    const errors = [];
  
    if (!formData.full_name || formData.full_name.trim().length === 0) {
      errors.push('Họ tên không được để trống');
    }
  
    if (!formData.phone_number || !/^[0-9]{10}$/.test(formData.phone_number)) {
      errors.push('Số điện thoại không hợp lệ');
    }
  
    if (!formData.address || formData.address.trim().length === 0) {
      errors.push('Địa chỉ không được để trống');
    }
  
    if (!formData.district || formData.district.trim().length === 0) {
      errors.push('Thành phố không được để trống');
    }
  
    if (!formData.province || formData.province.trim().length === 0) {
      errors.push('Tỉnh/Thành phố không được để trống');
    }
  
    if (!formData.paymentMethodId) {
      errors.push('Vui lòng chọn phương thức thanh toán');
    }
  
    
    return errors;
  };
  
module.exports = {
    validateCheckoutData
}