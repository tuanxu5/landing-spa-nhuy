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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Post</h1>
        <p className="mt-2 text-sm text-gray-700">
          Create a new post for services, promotions, or information articles.
        </p>
      </div>

      <PostEditor onSave={handleSave} />
    </div>
  );
}
