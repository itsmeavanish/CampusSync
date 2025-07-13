import React, { useState } from 'react';
import { Send, Pin, Download, Users, Calendar, Hash, MessageSquare, BookOpen } from 'lucide-react';
import { Message, Channel, User } from '../types';

interface ChatAreaProps {
  channel: Channel;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
  onPinMessage: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  channel,
  messages,
  currentUser,
  onSendMessage,
  onPinMessage,
  onMarkAsRead
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'general':
        return <Hash className="w-5 h-5" />;
      case 'qna':
        return <MessageSquare className="w-5 h-5" />;
      case 'resources':
        return <BookOpen className="w-5 h-5" />;
      case 'sessions':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Hash className="w-5 h-5" />;
    }
  };

  const getMessageTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'announcement':
        return 'border-l-blue-500 bg-blue-50';
      case 'question':
        return 'border-l-orange-500 bg-orange-50';
      case 'answer':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Channel Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            {getChannelIcon(channel.type)}
            <h1 className="text-xl font-semibold">{channel.name}</h1>
          </div>
          <span className="text-sm text-gray-500">|</span>
          <p className="text-sm text-gray-600">{channel.description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{channel.messageCount} messages</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => onMarkAsRead(message.id)}
            className={`p-4 rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md ${getMessageTypeColor(message.type)} ${
              message.isPinned ? 'ring-2 ring-blue-200' : ''
            } ${
              message.readBy?.includes(currentUser.id) ? '' : 'bg-blue-50 border-l-blue-500'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={message.author.avatar}
                  alt={message.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{message.author.name}</span>
                    {message.author.role === 'admin' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
                    )}
                    {message.type !== 'message' && (
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        message.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                        message.type === 'question' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {message.type}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {message.isPinned && (
                  <Pin className="w-4 h-4 text-blue-500" />
                )}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => onPinMessage(message.id)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title={message.isPinned ? 'Unpin message' : 'Pin message'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed">{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 bg-white p-2 rounded border"
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{attachment.name}</span>
                    <span className="text-xs text-gray-500">({attachment.size})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message #${channel.name}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;