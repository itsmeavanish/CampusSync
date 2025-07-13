import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Monitor, 
  Users, 
  Settings,
  MessageSquare,
  X,
  Camera,
  Volume2
} from 'lucide-react';
import { CallParticipant, Session } from '../../types';

interface VideoCallModalProps {
  session: Session;
  participants: CallParticipant[];
  currentUserId: string;
  onLeaveCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
  onSendChatMessage: (message: string) => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  session,
  participants,
  currentUserId,
  onLeaveCall,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onSendChatMessage
}) => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  const currentParticipant = participants.find(p => p.userId === currentUserId);
  const otherParticipants = participants.filter(p => p.userId !== currentUserId);

  useEffect(() => {
    // Simulate video streams for demo
    participants.forEach(participant => {
      const videoElement = videoRefs.current[participant.userId];
      if (videoElement && participant.stream) {
        videoElement.srcObject = participant.stream;
      }
    });
  }, [participants]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      onSendChatMessage(chatMessage);
      setChatMessage('');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{session.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4" />
            <span>{participants.length} participants</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={onLeaveCall}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className={`flex-1 relative ${showChat ? 'mr-80' : ''}`}>
          {/* Main Video */}
          <div className="h-full bg-gray-900 relative">
            {otherParticipants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 h-full">
                {otherParticipants.map((participant) => (
                  <div
                    key={participant.userId}
                    className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
                  >
                    {participant.isVideoEnabled ? (
                      <video
                        ref={(el) => videoRefs.current[participant.userId] = el}
                        autoPlay
                        muted={participant.userId === currentUserId}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <div className="text-center">
                          <img
                            src={participant.avatar}
                            alt={participant.userName}
                            className="w-16 h-16 rounded-full mx-auto mb-2"
                          />
                          <p className="text-white text-sm">{participant.userName}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Participant Controls Overlay */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                        {participant.userName}
                      </span>
                      {!participant.isAudioEnabled && (
                        <div className="bg-red-500 p-1 rounded">
                          <MicOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {participant.isScreenSharing && (
                        <div className="bg-blue-500 p-1 rounded">
                          <Monitor className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Waiting for others to join</h3>
                  <p className="text-gray-400">Share the meeting link to invite participants</p>
                </div>
              </div>
            )}

            {/* Self Video (Picture-in-Picture) */}
            {currentParticipant && (
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                {currentParticipant.isVideoEnabled ? (
                  <video
                    ref={(el) => videoRefs.current[currentUserId] = el}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <img
                      src={currentParticipant.avatar}
                      alt="You"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                )}
                <div className="absolute bottom-1 left-1">
                  <span className="text-white text-xs bg-black bg-opacity-50 px-1 rounded">
                    You
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Meeting Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages would go here */}
              <div className="text-center text-gray-500 text-sm">
                No messages yet. Start the conversation!
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onToggleAudio}
            className={`p-3 rounded-full transition-colors ${
              currentParticipant?.isAudioEnabled
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {currentParticipant?.isAudioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-full transition-colors ${
              currentParticipant?.isVideoEnabled
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {currentParticipant?.isVideoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onToggleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              currentParticipant?.isScreenSharing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <Monitor className="w-5 h-5" />
          </button>

          <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          <div className="w-px h-8 bg-gray-600"></div>

          <button
            onClick={onLeaveCall}
            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Phone className="w-5 h-5 transform rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;