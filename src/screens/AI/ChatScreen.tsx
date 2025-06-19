import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { Avatar } from 'components/design-system-ui';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import { SafeAreaView } from 'react-native';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const connectedAddress = useSelector((state: RootState) => state.accountState.currentAccount?.address);
  const theme = useSubWalletTheme().swThemes;

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg: Message = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://192.168.250.242:8000/ask', {
        question: message,
      });

      const aiResponse: Message = { sender: 'bot', text: res.data.answer.content };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: '❌ Failed to get a response.' }]);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
          <View style={{ flex: 1 }}>
            <Text style={styles.header}>
              Hello, I’m <Text style={styles.highlight}>OMNI</Text>
              {'\n'}your Chat Bot
            </Text>

            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[styles.messageRow, msg.sender === 'user' ? styles.rightAlign : styles.leftAlign]}>
                  <View style={msg.sender === 'user' ? styles.bubbleContainerUser : styles.bubbleContainerBot}>
                    <View style={styles.headerRow}>
                      {msg.sender === 'user' ? (
                        <Avatar value={connectedAddress || ''} size={theme.sizeMD} />
                      ) : (
                        <Image source={require('assets/robot.png')} style={styles.avatarSmall} />
                      )}
                      <Text style={styles.senderName}>{msg.sender === 'user' ? 'You' : 'Omni'}</Text>
                    </View>
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                </View>
              ))}
              {loading && (
                <View style={[styles.messageRow, styles.leftAlign]}>
                  <View style={styles.bubbleContainerBot}>
                    <View style={styles.headerRow}>
                      <Image source={require('assets/robot.png')} style={styles.avatarSmall} />
                      <Text style={styles.senderName}>Omni</Text>
                    </View>
                    <ActivityIndicator size="small" color="#53A8F1" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Field */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={sendMessage}>
                <Image source={require('assets/send.png')} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 32,
    marginTop: 35,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  highlight: {
    color: '#53A8F1',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  avatarSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userHeaderRow: {
    justifyContent: 'flex-start',
  },
  bubbleContainerBot: {
    backgroundColor: '#121212',
    borderColor: '#888',
    borderWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 0,
    padding: 12,
    maxWidth: '75%',
  },
  bubbleContainerUser: {
    backgroundColor: '#1f1f1f',
    borderColor: '#888',
    borderWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 0,
    padding: 12,
    maxWidth: '75%',
  },
  senderName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 4,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    backgroundColor: '#000',
  },
  input: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  sendIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
});

