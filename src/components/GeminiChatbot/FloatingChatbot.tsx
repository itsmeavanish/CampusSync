import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import GeminiChatbot from './GeminiChatbot';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="floating-chatbot-button"
          title="Chat with Gemini AI"
        >
          <div className="button-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="gemini-icon">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
              <path d="M5 15L6.09 18.26L10 19L6.09 19.74L5 23L3.91 19.74L0 19L3.91 18.26L5 15Z" fill="currentColor"/>
            </svg>
            <div className="pulse-ring"></div>
            <div className="pulse-ring-2"></div>
          </div>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`floating-chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          {isMinimized ? (
            <div className="minimized-header">
              <div className="minimized-content">
                <div className="minimized-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="minimized-title">Gemini AI</span>
              </div>
              <div className="minimized-actions">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="minimize-button"
                  title="Expand"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChatbot}
                  className="close-button"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="chatbot-window-header">
                <button
                  onClick={minimizeChatbot}
                  className="minimize-button"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChatbot}
                  className="close-button"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <GeminiChatbot />
            </>
          )}
        </div>
      )}

      <style>{`
        .floating-chatbot-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .floating-chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
        }

        .floating-chatbot-button:active {
          transform: scale(0.95);
        }

        .button-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .gemini-icon {
          z-index: 2;
          position: relative;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .pulse-ring-2 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1s;
        }

        .floating-chatbot-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-chatbot-window.minimized {
          height: 60px;
          width: 280px;
        }

        .chatbot-window-header {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          z-index: 10;
        }

        .minimize-button,
        .close-button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(10px);
        }

        .minimize-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .close-button:hover {
          background: rgba(239, 68, 68, 0.8);
          transform: scale(1.05);
        }

        .minimized-header {
          height: 100%;
          background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }

        .minimized-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .minimized-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .minimized-title {
          font-weight: 600;
          font-size: 16px;
        }

        .minimized-actions {
          display: flex;
          gap: 8px;
        }

        .minimized-actions .minimize-button,
        .minimized-actions .close-button {
          width: 28px;
          height: 28px;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .floating-chatbot-button {
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
          }

          .floating-chatbot-window {
            bottom: 20px;
            right: 20px;
            left: 20px;
            width: auto;
            height: 500px;
          }

          .floating-chatbot-window.minimized {
            height: 56px;
            width: 240px;
            left: auto;
          }
        }

        @media (max-width: 480px) {
          .floating-chatbot-window {
            bottom: 0;
            right: 0;
            left: 0;
            border-radius: 16px 16px 0 0;
            height: 70vh;
          }

          .floating-chatbot-window.minimized {
            height: 56px;
            width: 200px;
            left: auto;
            right: 20px;
            bottom: 20px;
            border-radius: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingChatbot;