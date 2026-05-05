# PostEditor Component

The `PostEditor` component provides a form interface for creating and editing posts in the admin panel.

## Features

- ✅ Create new posts
- ✅ Edit existing posts
- ✅ Client-side validation using Zod
- ✅ Loading states during data fetch and submission
- ✅ Success and error message display
- ✅ Field-specific validation errors
- ✅ Support for all post fields: title, content, featuredImage, category, status, publishedAt

## Props

```typescript
interface PostEditorProps {
  postId?: string;              // Optional. If provided, component operates in edit mode
  onSave?: (post: Post) => void; // Optional callback after successful save
}
```

## Usage

### Create Mode

```tsx
import PostEditor from '@/components/admin/PostEditor';

export default function CreatePostPage() {
  const router = useRouter();

  const handleSave = (post: Post) => {
    // Redirect to posts list or edit page after creation
    router.push('/admin/posts');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Post</h1>
      <PostEditor onSave={handleSave} />
    </div>
  );
}
```

### Edit Mode

```tsx
import PostEditor from '@/components/admin/PostEditor';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleSave = (post: Post) => {
    // Optionally redirect after update
    router.push('/admin/posts');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>
      <PostEditor postId={params.id} onSave={handleSave} />
    </div>
  );
}
```

## Validation Rules

The component validates the following fields:

- **Title**: Required, 1-200 characters
- **Content**: Required
- **Featured Image**: Optional, must be a valid URL if provided
- **Category**: Required, one of: service, promotion, information
- **Status**: Required, one of: draft, published
- **Published At**: Optional datetime

## API Integration

The component uses the following API endpoints:

- **GET /api/posts/:id** - Fetch existing post data (edit mode)
- **POST /api/posts** - Create new post (create mode)
- **PUT /api/posts/:id** - Update existing post (edit mode)

## States

The component handles the following states:

- **Loading**: Displayed while fetching post data in edit mode
- **Saving**: Displayed during form submission
- **Success**: Displayed after successful save
- **Error**: Displayed when API calls fail
- **Validation Errors**: Displayed inline for each invalid field

## Requirements Satisfied

This component satisfies the following requirements:

- **Requirement 3.2**: Provides fields for title, content, featured image, category, and publication status
- **Requirement 3.3**: Validates post data before submission
- **Requirement 12.5**: Validates that post titles are between 1 and 200 characters
- **Requirement 12.6**: Validates that required fields are not empty or null
