import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { createPost } from '../api/communityApi';

import './create-post-modal.css';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => Promise<void> | void;
}

const tagOptions = [
  { id: 1, name: "Recipes" },
  { id: 2, name: "Kitchen Tips" },
  { id: 3, name: "Product Reviews" },
  { id: 4, name: "Questions" },
  { id: 5, name: "Budget Meals" },
];

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedTag(null);
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (title.length > 200) {
      toast.error('Title cannot exceed 200 characters');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }
    if (content.length > 2000) {
      toast.error('Content cannot exceed 2000 characters');
      return;
    }
    
    if (!selectedTag) {
      toast.error('Please select a tag');
      return;
    }

    if (imageUrl.length > 500) {
      toast.error('Image URL cannot exceed 500 characters');
      return;
    }

    const payload = {
      title,
      content,
      tagIds: [selectedTag],
      imageUrl: imageUrl || "",
    };

    try {
      await createPost(payload);
      toast.success('Post created successfully!');
      resetForm();
      onClose();
      await onPostCreated();
    } catch (error) {
      toast.error('Failed to create post. Please try again.');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="cpm-overlay">
      <div className="cpm-modal">
        {/* Header */}
        <div className="cpm-header">
          <h2 className="cpm-title">Create a Post</h2>
          <button
            type="button"
            onClick={handleClose}
            title="Close modal"
            className="cpm-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="cpm-form">
          
          {/* Title */}
          <div>
            <div className="cpm-label-row">
              <label htmlFor="title" className="cpm-label">Title</label>
              <span className={`cpm-counter ${title.length > 200 ? 'error' : ''}`}>
                {title.length}/200
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className={title.length > 200 ? 'cpm-input-error' : ''}
            />
          </div>

          {/* Content */}
          <div>
            <div className="cpm-label-row">
              <label htmlFor="content" className="cpm-label">Content</label>
              <span className={`cpm-counter ${content.length > 2000 ? 'error' : ''}`}>
                {content.length}/2000
              </span>
            </div>
            {/* 🔥 ضفنا كلاس cpm-textarea هنا عشان السكرول الداخلي يشتغل */}
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, recipe, or question..."
              className={`cpm-textarea ${content.length > 2000 ? 'cpm-input-error' : ''}`}
            />
          </div>

          {/* Tag Selection */}
          <div>
            <label htmlFor="tag" className="cpm-label mb-2" style={{ marginBottom: '8px' }}>Tag</label>
            <Select
              value={selectedTag ? String(selectedTag) : ''}
              onValueChange={(value) => setSelectedTag(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {tagOptions.map((tag) => (
                  <SelectItem key={tag.id} value={String(tag.id)}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image URL */}
          <div>
            <div className="cpm-label-row">
              <label htmlFor="imageUrl" className="cpm-label">
                Image URL <span className="cpm-optional">(optional)</span>
              </label>
              <span className={`cpm-counter ${imageUrl.length > 500 ? 'error' : ''}`}>
                {imageUrl.length}/500
              </span>
            </div>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={imageUrl.length > 500 ? 'cpm-input-error' : ''}
            />
            
            {imageUrl && (
              <div className="cpm-image-preview">
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/f3f4f6/9ca3af?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="cpm-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cpm-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cpm-btn-submit"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}