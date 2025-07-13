import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, User, MapPin } from 'lucide-react';
import { Session, User as UserType } from '../types';

interface SessionPanelProps {
  sessions: Session[];
  currentUser: UserType;
  onCreateSession: (session: Omit<Session, 'id' | 'participants'>) => void;
  onJoinSession: (sessionId: string) => void;
  onStartVideoCall: (sessionId: string) => void;
}

const SessionPanel: React.FC<SessionPanelProps> = ({
  sessions,
  currentUser,
  onCreateSession,
  onJoinSession,
  onStartVideoCall
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    type: 'dsa' as Session['type'],
    startTime: '',
    duration: 60,
    maxParticipants: 50,
    meetingLink: ''
  });

  const getSessionTypeColor = (type: Session['type']) => {
    switch (type) {
      case 'dsa':
        return 'bg-purple-100 text-purple-800';
      case 'tech-talk':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'meetup':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateSession = () => {
    if (newSession.title && newSession.description && newSession.startTime) {
      onCreateSession({
        ...newSession,
        instructor: currentUser,
        clubId: currentUser.clubId,
        startTime: new Date(newSession.startTime)
      });
      setNewSession({
        title: '',
        description: '',
        type: 'dsa',
        startTime: '',
        duration: 60,
        maxParticipants: 50,
        meetingLink: ''
      });
      setShowCreateForm(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const isUpcoming = (date: Date) => {
    return date > new Date();
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Create session"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">Upcoming DSA and tech sessions</p>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Create Session</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              placeholder="Session title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={newSession.description}
              onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
              placeholder="Description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newSession.type}
              onChange={(e) => setNewSession({ ...newSession, type: e.target.value as Session['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dsa">DSA Practice</option>
              <option value="tech-talk">Tech Talk</option>
              <option value="workshop">Workshop</option>
              <option value="meetup">Meetup</option>
            </select>
            <input
              type="datetime-local"
              value={newSession.startTime}
              onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                placeholder="Duration (min)"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={newSession.maxParticipants}
                onChange={(e) => setNewSession({ ...newSession, maxParticipants: parseInt(e.target.value) })}
                placeholder="Max participants"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="url"
              value={newSession.meetingLink}
              onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
              placeholder="Meeting link (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateSession}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-lg p-4 border transition-all hover:shadow-md ${
              isUpcoming(session.startTime) 
                ? 'bg-white border-blue-200 shadow-sm' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm truncate pr-2">
                {session.title}
              </h4>
              <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getSessionTypeColor(session.type)}`}>
                {session.type.replace('-', ' ')}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {session.description}
            </p>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{formatDateTime(session.startTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{session.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users className="w-3 h-3" />
                <span>{session.participants.length}/{session.maxParticipants} joined</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User className="w-3 h-3" />
                <span>{session.instructor.name}</span>
              </div>
            </div>

            {isUpcoming(session.startTime) && (
              <div className="flex gap-2">
                <button
                  onClick={() => onJoinSession(session.id)}
                  disabled={session.participants.length >= session.maxParticipants}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {session.participants.includes(currentUser.id) ? 'Joined' : 'Join Session'}
                </button>
                {session.participants.includes(currentUser.id) && (
                  <button
                    onClick={() => onStartVideoCall(session.id)}
                    className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md text-xs hover:bg-blue-50 transition-colors"
                    title="Start video call"
                  >
                    <Video className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionPanel;