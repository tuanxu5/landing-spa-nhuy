'use client';

import { useRouter, useParams } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import type { Post } from '@/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const handleSave = (post: Post) => {
    // Redirect to posts list after successful update
    router.push('/admin/posts');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Chỉnh sửa bài viết</h1>
        <p className="text-base text-gray-600">
          Cập nhật thông tin bài viết bên dưới.
        </p>
      </div>

      <PostEditor postId={postId} onSave={handleSave} />
    </div>
  );
}
