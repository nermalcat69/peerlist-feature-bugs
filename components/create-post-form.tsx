import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import GlobalStoreContext from '@/store';
import { typeEnum, priorityEnum } from '@/db/schema';

export default function CreatePostForm() {
  const { data: session } = useSession();
  const { onCreate } = useContext(GlobalStoreContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    priority: 'medium',
    images: [] as string[],
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    // TODO: Implement actual image upload to your preferred storage
    // This is a placeholder that creates data URLs
    const imageUrls = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    await onCreate({
      ...formData,
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
    });

    setFormData({
      title: '',
      description: '',
      type: 'feature',
      priority: 'medium',
      images: [],
    });
  };

  if (!session) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">Please sign in to create posts</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          minLength={10}
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {typeEnum.enumValues.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {priorityEnum.enumValues.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full"
          disabled={isUploading}
        />
        {formData.images.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isUploading ? 'Uploading...' : 'Create Post'}
      </button>
    </form>
  );
} 