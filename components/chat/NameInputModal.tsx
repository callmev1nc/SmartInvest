/**
 * NameInputModal - Modal for new users to enter their name
 * This enables Uma to address users personally
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { getWelcomeMessage } from '@/constants/uma';

interface NameInputModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NameInputModal({ visible, onClose }: NameInputModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUserName } = useUser();

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await setUserName(trimmedName);

      // Store the welcome message for Uma to say
      // The chat screen will handle the actual greeting
      onClose();
    } catch (error) {
      setError('Failed to save name. Please try again.');
      console.error('Error saving name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Uma Avatar/Icon placeholder */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🤖</Text>
            </View>
          </View>

          {/* Welcome text */}
          <Text style={styles.title}>Welcome to SmartINvest!</Text>
          <Text style={styles.subtitle}>
            I'm Uma, your personal AI investment advisor. To get started, what should I call you?
          </Text>

          {/* Name input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textLight}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              autoFocus
              maxLength={30}
              autoComplete="name"
              textContentType="name"
              onSubmitEditing={handleSubmit}
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.button, (!name.trim() || isLoading) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.buttonText}>Start Chatting</Text>
            )}
          </TouchableOpacity>

          {/* Skip option */}
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.backgroundSecondary,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    marginTop: Spacing.sm,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  buttonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
  buttonText: {
    ...Typography.h4,
    color: Colors.background,
    fontWeight: '600',
  },
  skipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

const Shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
};

export default NameInputModal;
