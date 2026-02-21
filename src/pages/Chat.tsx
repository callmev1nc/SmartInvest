import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatWithUmaStream } from '@/services/uma';
import { translateText } from '@/services/translation';
import { getWelcomeMessage } from '@/constants/uma';
import { UMA_SUGGESTED_QUESTIONS } from '@/constants/uma';
import { UI_CONFIG } from '@/constants/config';
import { StorageHelper } from '@/utils/storage';
import './Chat.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
}

/**
 * Limit messages array to MAX_MESSAGES to prevent memory leaks
 * Keeps only the most recent messages
 */
function limitMessages(messages: Message[]): Message[] {
  if (messages.length > UI_CONFIG.MAX_MESSAGES) {
    return messages.slice(-UI_CONFIG.MAX_MESSAGES);
  }
  return messages;
}

export default function Chat() {
  const { userName, riskProfile, setUserName, isOnboardingComplete } = useUser();
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show name modal if onboarding not complete
  useEffect(() => {
    if (!isOnboardingComplete && !showNameModal) {
      setShowNameModal(true);
    }
  }, [isOnboardingComplete]);

  // Load welcome message
  useEffect(() => {
    if (userName && messages.length === 0) {
      const savedMessages = StorageHelper.get<Message[] | null>('smartinvest_chat_history', null);
      if (savedMessages) {
        // Convert timestamp strings back to Date objects
        const messagesWithDates = savedMessages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(limitMessages(messagesWithDates));
      } else {
        // Add welcome message
        const welcomeMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: getWelcomeMessage(userName),
          timestamp: new Date(),
        };
        setMessages(limitMessages([welcomeMsg]));
      }
    }
  }, [userName]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      StorageHelper.set('smartinvest_chat_history', messages);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageToSend = text || inputText;

    if (!messageToSend.trim() || !userName) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => limitMessages([...prev, userMessage]));
    setInputText('');
    setIsTyping(true);

    try {
      // Stream Uma's response
      const umaMessageId = (Date.now() + 1).toString();
      let umaResponse = '';

      // Create placeholder for Uma's response
      setMessages((prev) => limitMessages([
        ...prev,
        {
          id: umaMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]));

      // Stream the response
      for await (const chunk of chatWithUmaStream(
        messageToSend,
        userName,
        messages,
        riskProfile
      )) {
        umaResponse += chunk;

        // Update the message in real-time
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === umaMessageId
              ? { ...msg, content: umaResponse }
              : msg
          )
        );
      }

      // Translate the response if not in English
      if (language !== 'en') {
        const translatedResponse = await translateText(umaResponse, language);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === umaMessageId
              ? { ...msg, content: translatedResponse }
              : msg
          )
        );
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);

      // Add error message from Uma
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Hi ${userName}! I'm having trouble connecting right now. Please check your internet connection and try again.`,
        timestamp: new Date(),
      };

      setMessages((prev) => limitMessages([...prev, errorMsg]));
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    sendMessage(question);
  };

  if (!userName) {
    return (
      <div className="name-modal-overlay">
        <div className="name-modal">
          <div className="name-modal-avatar">🤖</div>
          <h2 className="name-modal-title">{t('welcomeToAppChat')}</h2>
          <p className="name-modal-subtitle">
            {t('chatSubtitle')}
          </p>
          <input
            type="text"
            className="name-input"
            placeholder={t('enterName')}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  setUserName(target.value.trim());
                  setShowNameModal(false);
                }
              }
            }}
            autoFocus
          />
          <button
            className="name-submit-btn"
            onClick={() => {
              const input = document.querySelector('.name-input') as HTMLInputElement;
              if (input?.value.trim()) {
                setUserName(input.value.trim());
                setShowNameModal(false);
              }
            }}
          >
            {t('startChatting')}
          </button>
          <button
            className="name-skip-btn"
            onClick={() => setShowNameModal(false)}
          >
            {t('skipForNow')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-container">
        {/* Messages */}
        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user-message' : 'uma-message'}`}
            >
              {message.role === 'assistant' && (
                <div className="message-sender">Uma</div>
              )}
              <div className="message-bubble">
                <p className="message-text">{message.content}</p>
              </div>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="message uma-message">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length < 3 && (
          <div className="suggested-questions">
            <p className="suggested-title">{t('askUma')}</p>
            <div className="suggested-chips">
              {UMA_SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  className="suggested-chip"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder={t('typeMessage')}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
          />
          <button
            className="send-button"
            onClick={() => sendMessage()}
            disabled={!inputText.trim() || isTyping}
          >
            {t('send')}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Just now';
  }

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return dateObj.toLocaleDateString();
}
