import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setUsername } from 'stores/base/AccountState';
import { useSubWalletTheme } from 'hooks/useSubWalletTheme';
import useHandlerHardwareBackPress from 'hooks/screen/useHandlerHardwareBackPress';
import { RootNavigationProps } from 'routes/index';
import type { CreateUserName as CreateUserNameProps, RootStackParamList } from 'routes/index';
const CreateUserName = ({
  route: {
    params: { pathName },
  },
}: CreateUserNameProps) => {
  const navigation = useNavigation<RootNavigationProps>();
  const dispatch = useDispatch();
  const theme = useSubWalletTheme().swThemes;
  useHandlerHardwareBackPress(true);

  const [username, setUsernameInput] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const isValid = useMemo(() => /^[a-zA-Z0-9_]{3,15}$/.test(username.trim()), [username]);

  const handleUsernameChange = (text: string) => {
    setUsernameInput(text);
  };

  const handleNext = () => {
    if (!isValid) return;

    setIsBusy(true);
    dispatch(setUsername(username));
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: pathName as keyof RootStackParamList }, // 👈 fix: type assertion
      ],
    });

    setIsBusy(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
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

      {/* Username Field */}
      <Text style={styles.label}>Enter Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={handleUsernameChange}
        placeholder=""
        placeholderTextColor="#999"
      />

      {/* Validation Message */}
      {username.length > 0 && (
        <Text style={[styles.validationText, { color: isValid ? 'green' : 'red' }]}>
          {isValid ? 'That username fits well!' : '3–15 characters, alphanumeric or underscore only'}
        </Text>
      )}

      {/* NEXT Button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: isValid ? '#70befa' : '#444' }]}
        disabled={!isValid || isBusy}
        onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CreateUserName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    marginTop: 30,
    position: 'relative',
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
