/**
 * ChatScreen - Main chat interface for interacting with Uma
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { chatWithUmaStream } from '@/services/uma';
import { getWelcomeMessage, UMA_SUGGESTED_QUESTIONS } from '@/constants/uma';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { saveChatHistory, getChatHistory } from '@/utils/storage';
import { MessageBubble, Message } from './MessageBubble';
import { SuggestedQuestions } from './SuggestedQuestions';
import { NameInputModal } from './NameInputModal';

export function ChatScreen() {
  const { userName, riskProfile, isOnboardingComplete } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Show name modal if onboarding not complete
  useEffect(() => {
    if (!isOnboardingComplete && !showNameModal) {
      setShowNameModal(true);
    }
  }, [isOnboardingComplete]);

  // Load chat history and welcome user
  useEffect(() => {
    if (!userName || hasWelcomed) return;

    const initializeChat = async () => {
      // Load saved chat history
      const savedHistory = await getChatHistory();
      if (savedHistory.length > 0) {
        setMessages(savedHistory);
      } else {
        // Send welcome message from Uma
        const welcomeMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: getWelcomeMessage(userName),
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
        setHasWelcomed(true);
      }
    };

    initializeChat();
  }, [userName, hasWelcomed]);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const messageToSend = text || inputText;

    if (!messageToSend.trim() || !userName) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Stream Uma's response
      const umaMessageId = (Date.now() + 1).toString();
      let umaResponse = '';

      // Create placeholder for Uma's response
      setMessages((prev) => [
        ...prev,
        {
          id: umaMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

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

      setMessages((prev) => [...prev, errorMsg]);

      Alert.alert(
        'Connection Error',
        'Could not connect to Uma. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    }
  }, [inputText, userName, riskProfile, messages]);

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    sendMessage(question);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} userName={userName || undefined} />
  );

  if (!userName) {
    return <NameInputModal visible={showNameModal} onClose={() => setShowNameModal(false)} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Uma</Text>
            <Text style={styles.headerSubtitle}>AI Investment Advisor</Text>
          </View>
        </View>
      </View>

      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        style={styles.messagesList}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Start a conversation with Uma!</Text>
          </View>
        }
      />

      {/* Typing indicator */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Uma is typing</Text>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}

      {/* Suggested questions */}
      {messages.length < 3 && (
        <SuggestedQuestions onSelectQuestion={handleSuggestedQuestion} />
      )}

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Uma anything about investing..."
          placeholderTextColor={Colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!inputText.trim() || isTyping}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Name input modal */}
      <NameInputModal
        visible={showNameModal}
        onClose={() => setShowNameModal(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 50 : Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  typingText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.backgroundSecondary,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
  sendButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});

export default ChatScreen;
