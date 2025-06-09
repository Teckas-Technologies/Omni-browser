import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // <-- use this instead of @expo

export const CreateWalletScreen = () => {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
const navigation = useNavigation();
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setIsValid(text.length > 3); // simple validation
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Top Navigation Icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>Create new wallet</Text>
      <Text style={styles.description}>
        Pellentesque suscipit fringilla libero eu ullamcorper. Cras risus eros, faucibus sit
      </Text>

      {/* Username Input */}
      <Text style={styles.label}>Enter Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={handleUsernameChange}
        placeholder=""
        placeholderTextColor="#999"
      />

      {/* Validation Text */}
      {username.length > 0 && (
        <Text style={[styles.validationText, { color: isValid ? 'green' : 'red' }]}>
          {isValid ? 'That username fits well!' : 'Username too short'}
        </Text>
      )}

      {/* NEXT Button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: isValid ? '#70befa' : '#444' }]}
        disabled={!isValid}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    marginTop: 30,
    position: 'relative', // important for absolute children
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 32,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginTop: 7,
  },
  validationText: {
    marginTop: 8,
    fontSize: 14,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
