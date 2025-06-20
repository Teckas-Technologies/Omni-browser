import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { Avatar } from 'components/design-system-ui';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import axios from 'axios';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const connectedAddress = useSelector((state: RootState) => state.accountState.currentAccount?.address);
  const theme = useSubWalletTheme().swThemes;

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const dot4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg: Message = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://omni-browser-assistant-be-h2a2evfkdagdfngf.canadacentral-01.azurewebsites.net/ask',
        {
          question: message,
        },
      );

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

  useEffect(() => {
    const animateDotBounce = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    if (loading) {
      animateDotBounce(dot1, 0);
      animateDotBounce(dot2, 200);
      animateDotBounce(dot3, 400);
      animateDotBounce(dot4, 600);
    } else {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
      dot4.stopAnimation();
    }
  }, [loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.container}>
          <Text style={[styles.header, { marginTop: isKeyboardOpen ? 320 : 80 }]}>
            Hello, I’m <Text style={styles.highlight}>OMNI</Text>
            {'\n'}your Chat Bot
          </Text>

          {messages.length === 0 ? (
            <View style={styles.emptyStateWrapper}>
              <View style={styles.chatbotAvatarWrapper}>
                <Image source={require('assets/robot.png')} style={styles.chatbotAvatar} resizeMode="contain" />
              </View>
              <Text style={styles.emptyStateText}>How can I assist you today?</Text>
            </View>
          ) : (
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
            </ScrollView>
          )}

          {loading && (
            <View style={styles.typingIndicatorWrapper}>
              <View style={styles.loadingDotsContainer}>
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot4 }] }]} />
              </View>
            </View>
          )}

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
            <View style={{ paddingRight: 4 }}>
              <TouchableOpacity onPress={sendMessage}>
                <Image source={require('assets/send.png')} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 32,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  chatbotAvatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  chatbotAvatar: {
    width: 70,
    height: 70,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#bbbbbb',
    textAlign: 'center',
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
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  sendIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  typingIndicatorWrapper: {
    paddingVertical: 8,
    paddingLeft: 4,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5B5959',
    marginHorizontal: 6,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  robotLarge: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  botName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});
