import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeminiChatbot = ({ className = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const apiKey="AIzaSyCeuJWAwNPnhh0mflQkltpjiKwLsivN-dU"
  // Initialize Gemini AI
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!apiKey) {
      setError('Please provide a valid Gemini API key');
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setError('');

    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, sender: 'user', timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      // Add AI response to chat
      setMessages(prev => [...prev, { text, sender: 'ai', timestamp: new Date() }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get response. Please try again.');
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`gemini-chatbot ${className}`}>
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-content">
            <div className="ai-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
                <path d="M5 15L6.09 18.26L10 19L6.09 19.74L5 23L3.91 19.74L0 19L3.91 18.26L5 15Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="header-info">
              <h3 className="chatbot-title">Gemini AI</h3>
              <p className="chatbot-status">Online</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={clearChat}
              className="action-button"
              title="Clear chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-section">
              <div className="welcome-avatar">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
                  <path d="M5 15L6.09 18.26L10 19L6.09 19.74L5 23L3.91 19.74L0 19L3.91 18.26L5 15Z" fill="currentColor"/>
                </svg>
              </div>
              <h4>Hello! I'm Gemini AI</h4>
              <p>I'm here to help you with questions, creative tasks, analysis, and more. What would you like to explore today?</p>
              <div className="suggestion-chips">
                <button className="suggestion-chip" onClick={() => setInputValue("What can you help me with?")}>
                  What can you help me with?
                </button>
                <button className="suggestion-chip" onClick={() => setInputValue("Tell me a fun fact")}>
                  Tell me a fun fact
                </button>
                <button className="suggestion-chip" onClick={() => setInputValue("Help me brainstorm ideas")}>
                  Help me brainstorm ideas
                </button>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`message-wrapper ${message.sender === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}
            >
              {message.sender === 'ai' && (
                <div className="message-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
              )}
              <div className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-wrapper ai-wrapper">
              <div className="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="message ai-message">
                <div className="message-content loading-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span className="typing-text">Gemini is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Gemini AI..."
              className="message-input"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="send-button"
            >
              {isLoading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="loading-icon">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .gemini-chatbot {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .chatbot-container {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          height: 600px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .chatbot-header {
          background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
          color: white;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .chatbot-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.2;
        }

        .chatbot-status {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .welcome-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
          color: #475569;
        }

        .welcome-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3B82F6, #60A5FA);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }

        .welcome-section h4 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          color: #1E293B;
        }

        .welcome-section p {
          margin: 0 0 24px 0;
          font-size: 16px;
          line-height: 1.5;
          max-width: 400px;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .suggestion-chip {
          background: white;
          border: 1px solid #E2E8F0;
          color: #475569;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .suggestion-chip:hover {
          background: #3B82F6;
          color: white;
          border-color: #3B82F6;
          transform: translateY(-1px);
        }

        .message-wrapper {
          display: flex;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }

        .user-wrapper {
          justify-content: flex-end;
        }

        .ai-wrapper {
          justify-content: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3B82F6, #60A5FA);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .message {
          max-width: 75%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .message-content {
          padding: 16px 20px;
          border-radius: 20px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 15px;
          position: relative;
        }

        .user-message .message-content {
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: white;
          border-bottom-right-radius: 8px;
          box-shadow: 0 2px 12px rgba(59, 130, 246, 0.3);
        }

        .ai-message .message-content {
          background: white;
          color: #1F2937;
          border: 1px solid #E5E7EB;
          border-bottom-left-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .loading-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px !important;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #3B82F6;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        .typing-dot:nth-child(3) { animation-delay: 0s; }

        .typing-text {
          color: #64748B;
          font-size: 14px;
          font-style: italic;
        }

        .message-time {
          font-size: 11px;
          color: #94A3B8;
          padding: 0 4px;
          align-self: flex-end;
        }

        .user-message .message-time {
          color: rgba(255, 255, 255, 0.7);
        }

        .error-message {
          background: linear-gradient(135deg, #FEE2E2, #FECACA);
          color: #DC2626;
          padding: 16px 20px;
          border-radius: 12px;
          border-left: 4px solid #DC2626;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
        }

        .input-container {
          padding: 20px 24px;
          background: white;
          border-top: 1px solid #E5E7EB;
        }

        .input-wrapper {
          display: flex;
          align-items: end;
          gap: 12px;
          background: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 24px;
          padding: 4px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #3B82F6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .message-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 16px;
          font-size: 15px;
          resize: none;
          outline: none;
          max-height: 120px;
          min-height: 20px;
          font-family: inherit;
          line-height: 1.5;
        }

        .message-input::placeholder {
          color: #94A3B8;
        }

        .message-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-button {
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: white;
          border: none;
          border-radius: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
        }

        .send-button:active:not(:disabled) {
          transform: scale(0.95);
        }

        .send-button:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
          box-shadow: none;
        }

        .loading-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .chatbot-container {
            height: 500px;
            border-radius: 12px;
          }
          
          .chatbot-header {
            padding: 16px 20px;
          }
          
          .messages-container {
            padding: 16px;
            gap: 12px;
          }
          
          .message {
            max-width: 85%;
          }
          
          .input-container {
            padding: 16px 20px;
          }

          .welcome-section {
            padding: 20px 16px;
          }

          .suggestion-chips {
            flex-direction: column;
            align-items: center;
          }

          .suggestion-chip {
            width: 100%;
            max-width: 280px;
          }
        }

        @media (max-width: 480px) {
          .chatbot-container {
            height: 450px;
          }

          .header-info {
            display: none;
          }

          .message {
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default GeminiChatbot;