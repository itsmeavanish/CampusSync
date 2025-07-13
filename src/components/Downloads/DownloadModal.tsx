import React, { useState } from 'react';
import { X, Download, FileText, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { Resource } from '../../types';

interface DownloadModalProps {
  resource: Resource;
  onClose: () => void;
  onDownload: (resourceId: string) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  resource,
  onClose,
  onDownload
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      onDownload(resource.id);
      
      // Auto close after successful download
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Mock file size for demo
  const mockFileSize = Math.floor(Math.random() * 10000000) + 500000; // 0.5MB to 10MB

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Download Resource</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Resource Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(resource.category)}`}>
                  {resource.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* File Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">File Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium">{formatFileSize(mockFileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uploaded by:</span>
                <span className="font-medium">{resource.uploadedBy.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upload Date:</span>
                <span className="font-medium">{formatDate(resource.uploadDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Downloads:</span>
                <span className="font-medium">{resource.downloadCount} times</span>
              </div>
            </div>
          </div>

          {/* Download Status */}
          {downloading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div>
                  <p className="font-medium text-blue-900">Downloading...</p>
                  <p className="text-sm text-blue-700">Please wait while we prepare your file</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}

          {downloaded && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Download Complete!</p>
                  <p className="text-sm text-green-700">File has been saved to your downloads folder</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {!downloading && !downloaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Please Note</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This resource is shared by club members. Please respect copyright and use it for educational purposes only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {!downloaded && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download
                  </>
                )}
              </button>
            )}
            {downloaded && (
              <button
                onClick={() => window.open(resource.fileUrl, '_blank')}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open File
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;