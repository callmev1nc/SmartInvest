/**
 * Uma Chat Screen - Main interface for chatting with Uma
 */

import React from 'react';
import { View } from 'react-native';
import { ChatScreen } from '@/components/chat/ChatScreen';
import { Colors } from '@/constants/theme';

export default function UmaScreen() {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
};
