import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ProfilePage from './components/Profile/ProfilePage';
import DirectMessagePanel from './components/DirectMessages/DirectMessagePanel';
import VideoCallModal from './components/VideoCall/VideoCallModal';
import MembersList from './components/Members/MembersList';
import CreateChannelModal from './components/Channels/CreateChannelModal';
import CreateClubModal from './components/Clubs/CreateClubModal';
import DownloadModal from './components/Downloads/DownloadModal';
import FloatingChatbot from './components/GeminiChatbot/FloatingChatbot';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ResourcePanel from './components/ResourcePanel';
import SessionPanel from './components/SessionPanel';
import { 
  mockUser, 
  mockClubs, 
  mockChannels, 
  mockMessages, 
  mockSessions, 
  mockResources,
  mockUsers,
  mockDirectMessages
} from './data/mockData';
import { 
  Message, 
  Resource, 
  Session, 
  Channel, 
  User, 
  DirectMessage, 
  AuthState,
  CallParticipant,
  VideoCall
} from './types';

function App() {
  // Authentication state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // App state
  const [clubs] = useState(mockClubs);
  const [currentClub, setCurrentClub] = useState(mockClubs[0]);
  const [channels] = useState(mockChannels);
  const [activeChannel, setActiveChannel] = useState(mockChannels[0].id);
  const [messages, setMessages] = useState(mockMessages);
  const [resources, setResources] = useState(mockResources);
  const [sessions, setSessions] = useState(mockSessions);
  const [activePanel, setActivePanel] = useState<'chat' | 'resources' | 'sessions'>('chat');
  
  // New features state
  const [users] = useState(mockUsers);
  const [directMessages, setDirectMessages] = useState(mockDirectMessages);
  const [showProfile, setShowProfile] = useState(false);
  const [showDirectMessages, setShowDirectMessages] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [downloadingResource, setDownloadingResource] = useState<Resource | null>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<VideoCall | null>(null);
  const [callParticipants, setCallParticipants] = useState<CallParticipant[]>([]);

  const currentChannel = channels.find(ch => ch.id === activeChannel) || channels[0];
  const channelMessages = messages.filter(msg => msg.channelId === activeChannel);
  
  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    setAuthState({ ...authState, loading: true });
    
    // Simulate API call
    setTimeout(() => {
      if (email === 'alex@university.edu' && password === 'demo123') {
        setAuthState({
          isAuthenticated: true,
          user: mockUser,
          loading: false
        });
      } else {
        setAuthState({ ...authState, loading: false });
        alert('Invalid credentials. Use alex@university.edu / demo123');
      }
    }, 1000);
  };

  const handleSignup = async (userData: any) => {
    setAuthState({ ...authState, loading: true });
    
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        role: 'member',
        clubId: '1',
        bio: userData.bio,
        skills: userData.skills,
        year: userData.year,
        department: userData.department,
        isOnline: true
      };
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false
      });
    }, 1000);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  useEffect(() => {
    // Update active panel based on channel type
    if (currentChannel.type === 'resources') {
      setActivePanel('resources');
    } else if (currentChannel.type === 'sessions') {
      setActivePanel('sessions');
    } else {
      setActivePanel('chat');
    }
  }, [currentChannel.type]);

  const handleSendMessage = (content: string) => {
    if (!authState.user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      author: authState.user,
      channelId: activeChannel,
      timestamp: new Date(),
      isPinned: false,
      type: 'message'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isPinned: !msg.isPinned }
          : msg
      )
    );
  };

  const handleMarkAsRead = (messageId: string) => {
    if (!authState.user) return;
    
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              readBy: msg.readBy?.includes(authState.user!.id)
                ? msg.readBy
                : [...(msg.readBy || []), authState.user!.id]
            }
          : msg
      )
    );
  };

  const handleUploadResource = (resource: Omit<Resource, 'id' | 'downloadCount' | 'uploadDate'>) => {
    if (!authState.user) return;
    
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      downloadCount: 0,
      uploadDate: new Date()
    };
    setResources(prev => [newResource, ...prev]);
  };

  const handleDownloadResource = (resource: Resource) => {
    setDownloadingResource(resource);
  };

  const handleDownload = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId
          ? { ...resource, downloadCount: resource.downloadCount + 1 }
          : resource
      )
    );
  };

  const handleCreateSession = (session: Omit<Session, 'id' | 'participants'>) => {
    if (!authState.user) return;
    
    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
      participants: []
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const handleJoinSession = (sessionId: string) => {
    if (!authState.user) return;
    
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              participants: session.participants.includes(authState.user!.id)
                ? session.participants.filter(id => id !== authState.user!.id)
                : [...session.participants, authState.user!.id]
            }
          : session
      )
    );
  };

  const handleClubChange = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      setCurrentClub(club);
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannel(channelId);
  };

  const handleCreateChannel = (channelData: Omit<Channel, 'id' | 'messageCount'>) => {
    const newChannel: Channel = {
      ...channelData,
      id: Date.now().toString(),
      messageCount: 0
    };
    // In a real app, this would be added to the channels state
    console.log('New channel created:', newChannel);
  };

  const handleCreateClub = (clubData: any) => {
    // In a real app, this would submit the club application
    console.log('Club application submitted:', clubData);
    alert('Club application submitted for review! You will be notified once it\'s approved.');
  };
  
  // New feature handlers
  const handleUpdateProfile = (userData: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...userData };
    setAuthState({ ...authState, user: updatedUser });
  };

  const handleSendDirectMessage = (receiverId: string, content: string) => {
    if (!authState.user) return;
    
    const newMessage: DirectMessage = {
      id: Date.now().toString(),
      content,
      senderId: authState.user.id,
      receiverId,
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    };
    
    setDirectMessages(prev => [...prev, newMessage]);
  };

  const handleStartVideoCall = (sessionId: string) => {
    if (!authState.user) return;
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const participants: CallParticipant[] = [
      {
        userId: authState.user.id,
        userName: authState.user.name,
        avatar: authState.user.avatar,
        isVideoEnabled: true,
        isAudioEnabled: true,
        isScreenSharing: false
      }
    ];
    
    setCallParticipants(participants);
    setActiveVideoCall({
      id: Date.now().toString(),
      sessionId,
      participants,
      isActive: true,
      startTime: new Date()
    });
  };

  const handleLeaveCall = () => {
    setActiveVideoCall(null);
    setCallParticipants([]);
  };

  const handleToggleVideo = () => {
    if (!authState.user) return;
    
    setCallParticipants(prev =>
      prev.map(p =>
        p.userId === authState.user!.id
          ? { ...p, isVideoEnabled: !p.isVideoEnabled }
          : p
      )
    );
  };

  const handleToggleAudio = () => {
    if (!authState.user) return;
    
    setCallParticipants(prev =>
      prev.map(p =>
        p.userId === authState.user!.id
          ? { ...p, isAudioEnabled: !p.isAudioEnabled }
          : p
      )
    );
  };

  const handleToggleScreenShare = () => {
    if (!authState.user) return;
    
    setCallParticipants(prev =>
      prev.map(p =>
        p.userId === authState.user!.id
          ? { ...p, isScreenSharing: !p.isScreenSharing }
          : p
      )
    );
  };

  const handleSendChatMessage = (message: string) => {
    // Handle video call chat messages
    console.log('Chat message:', message);
  };

  // Show authentication forms if not logged in
  if (!authState.isAuthenticated) {
    if (authMode === 'login') {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthMode('signup')}
          loading={authState.loading}
        />
      );
    } else {
      return (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthMode('login')}
          loading={authState.loading}
        />
      );
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header
          currentUser={authState.user!}
          currentClub={currentClub}
          onClubChange={handleClubChange}
          clubs={clubs}
          onShowProfile={() => setShowProfile(true)}
          onShowDirectMessages={() => setShowDirectMessages(true)}
          onLogout={handleLogout}
          onCreateClub={() => setShowCreateClub(true)}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            channels={channels}
            activeChannel={activeChannel}
            onChannelSelect={handleChannelSelect}
            clubName={currentClub.name}
            memberCount={currentClub.memberCount}
            onShowMembers={() => setShowMembers(true)}
            onCreateChannel={() => setShowCreateChannel(true)}
            isAdmin={authState.user!.role === 'admin'}
          />

          {/* Main Area */}
          <div className="flex-1 flex">
            {/* Chat Area */}
            <ChatArea
              channel={currentChannel}
              messages={channelMessages}
              currentUser={authState.user!}
              onSendMessage={handleSendMessage}
              onPinMessage={handlePinMessage}
              onMarkAsRead={handleMarkAsRead}
            />

            {/* Right Panel */}
            {activePanel === 'resources' ? (
              <ResourcePanel
                resources={resources.filter(r => r.clubId === currentClub.id)}
                currentUser={authState.user!}
                onUploadResource={handleUploadResource}
                onDownloadResource={handleDownloadResource}
              />
            ) : activePanel === 'sessions' ? (
              <SessionPanel
                sessions={sessions.filter(s => s.clubId === currentClub.id)}
                currentUser={authState.user!}
                onCreateSession={handleCreateSession}
                onJoinSession={handleJoinSession}
                onStartVideoCall={handleStartVideoCall}
              />
            ) : (
              <ResourcePanel
                resources={resources.filter(r => r.clubId === currentClub.id)}
                currentUser={authState.user!}
                onUploadResource={handleUploadResource}
                onDownloadResource={handleDownloadResource}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProfile && (
        <ProfilePage
          user={authState.user!}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showDirectMessages && (
        <DirectMessagePanel
          currentUser={authState.user!}
          users={users}
          messages={directMessages}
          onSendMessage={handleSendDirectMessage}
          onClose={() => setShowDirectMessages(false)}
        />
      )}

      {showMembers && (
        <MembersList
          club={currentClub}
          members={users.filter(u => u.clubId === currentClub.id)}
          currentUser={authState.user!}
          onClose={() => setShowMembers(false)}
        />
      )}

      {showCreateChannel && (
        <CreateChannelModal
          clubId={currentClub.id}
          onCreateChannel={handleCreateChannel}
          onClose={() => setShowCreateChannel(false)}
        />
      )}

      {showCreateClub && (
        <CreateClubModal
          currentUser={authState.user!}
          onCreateClub={handleCreateClub}
          onClose={() => setShowCreateClub(false)}
        />
      )}

      {downloadingResource && (
        <DownloadModal
          resource={downloadingResource}
          onClose={() => setDownloadingResource(null)}
          onDownload={handleDownload}
        />
      )}

      {activeVideoCall && (
        <VideoCallModal
          session={sessions.find(s => s.id === activeVideoCall.sessionId)!}
          participants={callParticipants}
          currentUserId={authState.user!.id}
          onLeaveCall={handleLeaveCall}
          onToggleVideo={handleToggleVideo}
          onToggleAudio={handleToggleAudio}
          onToggleScreenShare={handleToggleScreenShare}
          onSendChatMessage={handleSendChatMessage}
        />
      )}

      {/* Floating Gemini AI Chatbot */}
      <FloatingChatbot />
    </>
  );
}

export default App;