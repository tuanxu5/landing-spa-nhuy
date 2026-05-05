# Upload Module

Module xử lý upload và tối ưu hóa ảnh cho hệ thống.

## Tính năng

### Image Upload & Compression
- **Endpoint**: `POST /upload/image`
- **Authentication**: Yêu cầu đăng nhập (AuthGuard)
- **File types**: JPG, JPEG, PNG, GIF, WEBP
- **Max upload size**: 10MB (trước khi compress)

### Tối ưu hóa ảnh tự động
Sử dụng Sharp library để:
- **Resize**: Tự động resize về max 1920x1080px (giữ tỷ lệ)
- **Compress**: Chuyển sang JPEG với quality 80%
- **Progressive**: Tạo progressive JPEG để load nhanh hơn
- **No enlargement**: Không phóng to ảnh nhỏ hơn kích thước max

### Kết quả
- Giảm kích thước file 60-80%
- Tốc độ load trang nhanh hơn
- Tiết kiệm băng thông và storage
- Chất lượng ảnh vẫn tốt cho web

## Cấu trúc file

```
uploads/
  images/
    compressed-{timestamp}-{random}.jpg
```

## API Response

```json
{
  "filename": "compressed-1777993057556-328959407.jpg",
  "path": "/uploads/images/compressed-1777993057556-328959407.jpg",
  "size": 245678,
  "mimetype": "image/jpeg"
}
```

## Sử dụng

```typescript
// Frontend
const formData = new FormData();
formData.append('file', imageFile);

const response = await uploadApi.uploadImage(imageFile);
// response.path: "/uploads/images/compressed-xxx.jpg"
```

## Lưu ý

- File gốc sẽ bị xóa sau khi compress
- Tất cả ảnh đều được convert sang JPEG
- Folder `uploads/` không được commit vào git
