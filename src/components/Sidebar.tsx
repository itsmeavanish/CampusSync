import React from 'react';
import { Hash, MessageSquare, BookOpen, Calendar, Settings, Users, PlusCircle, UserPlus } from 'lucide-react';
import { Channel } from '../types';

interface SidebarProps {
  channels: Channel[];
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
  clubName: string;
  memberCount: number;
  onShowMembers: () => void;
  onCreateChannel: () => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  channels,
  activeChannel,
  onChannelSelect,
  clubName,
  memberCount,
  onShowMembers,
  onCreateChannel,
  isAdmin
}) => {
  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'general':
        return <Hash className="w-4 h-4" />;
      case 'qna':
        return <MessageSquare className="w-4 h-4" />;
      case 'resources':
        return <BookOpen className="w-4 h-4" />;
      case 'sessions':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Club Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-bold text-lg truncate">{clubName}</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm text-gray-300">{memberCount} members</span>
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Channels
            </h3>
            {isAdmin && (
              <button
                onClick={onCreateChannel}
                className="text-gray-400 hover:text-white transition-colors"
                title="Create Channel"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors ${
                  activeChannel === channel.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {getChannelIcon(channel.type)}
                <span className="text-sm font-medium">{channel.name}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {channel.messageCount > 999 ? '999+' : channel.messageCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
              onClick={onShowMembers}
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Members</span>
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Alex Kumar</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;