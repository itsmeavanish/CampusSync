import React, { useState } from 'react';
import { Download, FileText, BookOpen, GraduationCap, Video, Upload, Calendar, Eye } from 'lucide-react';
import { Resource, User } from '../types';

interface ResourcePanelProps {
  resources: Resource[];
  currentUser: User;
  onUploadResource: (resource: Omit<Resource, 'id' | 'downloadCount' | 'uploadDate'>) => void;
  onDownloadResource: (resource: Resource) => void;
}

const ResourcePanel: React.FC<ResourcePanelProps> = ({
  resources,
  currentUser,
  onUploadResource,
  onDownloadResource
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: 'notes' as Resource['category'],
    fileUrl: ''
  });

  const getCategoryIcon = (category: Resource['category']) => {
    switch (category) {
      case 'notes':
        return <FileText className="w-5 h-5" />;
      case 'syllabus':
        return <BookOpen className="w-5 h-5" />;
      case 'past-papers':
        return <GraduationCap className="w-5 h-5" />;
      case 'tutorials':
        return <Video className="w-5 h-5" />;
      case 'books':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: Resource['category']) => {
    switch (category) {
      case 'notes':
        return 'bg-blue-100 text-blue-800';
      case 'syllabus':
        return 'bg-green-100 text-green-800';
      case 'past-papers':
        return 'bg-purple-100 text-purple-800';
      case 'tutorials':
        return 'bg-red-100 text-red-800';
      case 'books':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpload = () => {
    if (newResource.title && newResource.description) {
      onUploadResource({
        ...newResource,
        uploadedBy: currentUser,
        clubId: currentUser.clubId
      });
      setNewResource({ title: '', description: '', category: 'notes', fileUrl: '' });
      setShowUploadForm(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload resource"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">Study materials and resources</p>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Upload Resource</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              placeholder="Resource title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              placeholder="Description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newResource.category}
              onChange={(e) => setNewResource({ ...newResource, category: e.target.value as Resource['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="notes">Notes</option>
              <option value="syllabus">Syllabus</option>
              <option value="past-papers">Past Papers</option>
              <option value="tutorials">Tutorials</option>
              <option value="books">Books</option>
            </select>
            <input
              type="url"
              value={newResource.fileUrl}
              onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
              placeholder="File URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => setShowUploadForm(false)}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg">
                {getCategoryIcon(resource.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                  {resource.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(resource.category)}`}>
                    {resource.category.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(resource.uploadDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{resource.downloadCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={resource.uploadedBy.avatar}
                    alt={resource.uploadedBy.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-gray-600">{resource.uploadedBy.name}</span>
                </div>
              </div>
            </div>
              onClick={() => onDownloadResource(resource)}
            <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcePanel;