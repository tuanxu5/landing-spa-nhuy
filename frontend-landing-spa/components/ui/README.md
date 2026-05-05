# UI Components Library

Thư viện các components UI hiện đại, tái sử dụng được cho admin panel.

## Màu chủ đạo

Màu chủ đạo của hệ thống: **#2a6941** (Primary Green)

Palette đầy đủ:
- `primary-50`: #f0f7f3 (lightest)
- `primary-100`: #d9ebe0
- `primary-200`: #b3d7c1
- `primary-300`: #8cc3a2
- `primary-400`: #5ea87a
- `primary-500`: #2a6941 (main)
- `primary-600`: #245a38
- `primary-700`: #1e4a2f
- `primary-800`: #183b26
- `primary-900`: #12301f (darkest)

## Components

### Input

Component input với nhiều variants và tính năng.

**Props:**
- `label?: string` - Label cho input
- `error?: string` - Thông báo lỗi
- `helperText?: string` - Text hướng dẫn
- `leftIcon?: React.ReactNode` - Icon bên trái
- `rightIcon?: React.ReactNode` - Icon bên phải
- `variant?: 'default' | 'filled'` - Kiểu hiển thị
- Tất cả props của `HTMLInputElement`

**Ví dụ:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Username"
  placeholder="Enter username"
  variant="filled"
  leftIcon={<UserIcon />}
/>

<Input
  label="Email"
  type="email"
  error="Invalid email format"
/>
```

### Button

Component button với nhiều variants và states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`
- `size?: 'sm' | 'md' | 'lg'`
- `isLoading?: boolean` - Hiển thị loading state
- `leftIcon?: React.ReactNode` - Icon bên trái
- `rightIcon?: React.ReactNode` - Icon bên phải
- `fullWidth?: boolean` - Chiếm full width
- Tất cả props của `HTMLButtonElement`

**Ví dụ:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg">
  Submit
</Button>

<Button variant="outline" leftIcon={<PlusIcon />}>
  Add New
</Button>

<Button variant="danger" isLoading>
  Deleting...
</Button>
```

### Card

Component card container với nhiều variants.

**Props:**
- `variant?: 'default' | 'bordered' | 'elevated'`
- `padding?: 'none' | 'sm' | 'md' | 'lg'`
- `hover?: boolean` - Hiệu ứng hover
- Tất cả props của `HTMLDivElement`

**Ví dụ:**
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <h2>Card Title</h2>
  <p>Card content...</p>
</Card>

<Card variant="bordered" hover>
  Clickable card
</Card>
```

### Badge

Component badge để hiển thị status, labels.

**Props:**
- `variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'`
- `size?: 'sm' | 'md' | 'lg'`
- `dot?: boolean` - Hiển thị dot indicator
- Tất cả props của `HTMLSpanElement`

**Ví dụ:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>

<Badge variant="warning" dot>
  Pending
</Badge>

<Badge variant="primary" size="lg">
  Admin
</Badge>
```

## Import

Có thể import từng component hoặc import tất cả:

```tsx
// Import từng component
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

// Hoặc import nhiều components
import { Input, Button, Card, Badge } from '@/components/ui';
```

## Styling

Tất cả components sử dụng Tailwind CSS với:
- Border radius: `rounded-xl` (12px) cho modern look
- Transitions: `duration-200` cho smooth animations
- Focus states: Ring với màu primary
- Shadow: Soft shadows với màu tương ứng variant

## Accessibility

Tất cả components đã được thiết kế với accessibility:
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators rõ ràng
- Color contrast đạt chuẩn WCAG
