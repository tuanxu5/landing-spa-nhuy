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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Post</h1>
        <p className="mt-2 text-sm text-gray-700">
          Update the post details below.
        </p>
      </div>

      <PostEditor postId={postId} onSave={handleSave} />
    </div>
  );
}
