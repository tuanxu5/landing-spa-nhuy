'use client';

import { useRouter } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import type { Post } from '@/types';

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = (post: Post) => {
    // Redirect to posts list after successful creation
    router.push('/admin/posts');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Tạo bài viết mới</h1>
        <p className="text-base text-gray-600">
          Tạo bài viết mới cho dịch vụ, khuyến mãi hoặc thông tin.
        </p>
      </div>

      <PostEditor onSave={handleSave} />
    </div>
  );
}
