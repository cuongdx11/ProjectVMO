# Restful API Web Bán Hàng

## Giới thiệu

Dự án này là một RESTful API cho hệ thống web bán hàng, được xây dựng bằng các công nghệ hiện đại như NodeJS, Express, MySQL và Sequelize. API này cung cấp các endpoint để quản lý sản phẩm, đơn hàng, người dùng và các chức năng khác liên quan đến việc bán hàng trực tuyến.

## Công nghệ sử dụng

- **NodeJS**: Môi trường runtime JavaScript
- **Express**: Framework web cho NodeJS
- **MySQL**: Hệ quản trị cơ sở dữ liệu quan hệ
- **Sequelize**: ORM (Object-Relational Mapping) cho NodeJS

## Tính năng chính

- Quản lý sản phẩm: CRUD, tìm kiếm, lọc
- Quản lý đơn hàng: Tạo, cập nhật, hủy đơn hàng
- Xác thực và phân quyền người dùng
- Quản lý giỏ hàng
- Quản lý Flash Sale
- Đánh giá và bình luận sản phẩm

## Cài đặt

1. Clone repository:
   ```
   git clone https://github.com/cuongdx11/ProjectVMO.git
   ```

2. Di chuyển vào thư mục dự án:
   ```
   cd your-repo-name
   ```

3. Cài đặt các dependencies:
   ```
   npm install
   ```

4. Tạo file `.env` và cấu hình các biến môi trường:
   ```
    NODE_ENV=development
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=ecommerce_db
    CLOUDINARY_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    EMAIL_HOST=smtp.your-email.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@example.com
    EMAIL_PASSWORD=your-email-password
    VNPAY_TMN_CODE=your_vnpay_tmn_code
    VNPAY_HASH_SECRET=your_vnpay_hash_secret

   ```

5. Chạy migrations để tạo cấu trúc database:
   ```
   npx sequelize-cli db:migrate
   ```

6. Khởi động server:
   ```
   npm start
   ```

## API Documentation

Để xem chi tiết về các endpoint API, vui lòng truy cập `/api-docs` sau khi khởi động server.

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp cho dự án. Nếu bạn muốn đóng góp, vui lòng tạo pull request hoặc mở issue để thảo luận về những thay đổi bạn muốn thực hiện.

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ qua email: dinhxuancuong.ptit@gmail.com

