import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const ChatScreen = () => {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Hello, I’m <Text style={styles.highlight}>OMNI</Text>
        {'\n'}your Chat Bot
      </Text>

      {/* Scrollable Chat Messages */}
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {/* Bot Message */}
        <View style={[styles.messageRow, styles.leftAlign]}>
          <View style={styles.bubbleContainerBot}>
            <View style={styles.headerRow}>
              <Image source={require('assets/robot.png')} style={styles.avatarSmall} />
              <Text style={styles.senderName}>Omni</Text>
            </View>
            <Text style={styles.messageText}>
              Hello! The first step to improve your programming skills is choosing a programming language. Do you have a
              specific language in mind?
            </Text>
          </View>
        </View>

        {/* User Message */}
        <View style={[styles.messageRow, styles.rightAlign]}>
          <View style={styles.bubbleContainerUser}>
            <View style={[styles.headerRow, styles.userHeaderRow]}>
              <Image source={require('assets/user.png')} style={styles.avatarSmall} />
              <Text style={styles.senderName}>You</Text>
            </View>
            <Text style={styles.messageText}>Hello! How can I improve my programming skills?</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity>
          <Image source={require('assets/send.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
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
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 32,
    marginTop:35
  },
  highlight: {
    color: '#53A8F1',
    fontWeight: '600',
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
    borderBottomLeftRadius: 0, // sharp corner
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
    borderBottomRightRadius: 0, // sharp corner
    padding: 12,
    maxWidth: '75%',
  },
  senderName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
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
  },
  sendIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
});
