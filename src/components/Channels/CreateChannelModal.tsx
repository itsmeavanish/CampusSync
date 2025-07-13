import React, { useState } from 'react';
import { X, Hash, MessageSquare, BookOpen, Calendar, Lock, Globe } from 'lucide-react';
import { Channel } from '../../types';

interface CreateChannelModalProps {
  clubId: string;
  onCreateChannel: (channel: Omit<Channel, 'id' | 'messageCount'>) => void;
  onClose: () => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  clubId,
  onCreateChannel,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'general' as Channel['type'],
    isPrivate: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const channelTypes = [
    { value: 'general', label: 'General', icon: Hash, description: 'General discussions and announcements' },
    { value: 'qna', label: 'Q&A', icon: MessageSquare, description: 'Questions and answers' },
    { value: 'resources', label: 'Resources', icon: BookOpen, description: 'Study materials and resources' },
    { value: 'sessions', label: 'Sessions', icon: Calendar, description: 'DSA practice and tech sessions' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Channel name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Channel name must be at least 2 characters';
    } else if (!/^[a-z0-9-_]+$/.test(formData.name.toLowerCase())) {
      newErrors.name = 'Channel name can only contain lowercase letters, numbers, hyphens, and underscores';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Channel description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreateChannel({
        name: formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        type: formData.type,
        clubId
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create Channel</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Create a new channel for your club members to communicate
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Channel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel Name
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., general-discussion"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Use lowercase letters, numbers, hyphens, and underscores only
            </p>
          </div>

          {/* Channel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Channel Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {channelTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as Channel['type'] })}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe what this channel is for..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {formData.isPrivate ? (
                <Lock className="w-5 h-5 text-gray-600" />
              ) : (
                <Globe className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {formData.isPrivate ? 'Private Channel' : 'Public Channel'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.isPrivate 
                    ? 'Only invited members can see this channel'
                    : 'All club members can see this channel'
                  }
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;