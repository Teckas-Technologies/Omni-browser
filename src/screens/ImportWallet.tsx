import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ImportWalletScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const screenWidth = Dimensions.get('window').width;

  const handleImport = () => {
    // Here you would typically validate the recovery phrase or private key
    // For now, we'll just navigate to the AddExistingWallet screen
    navigation.navigate('AddExistingWallet');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header - Centered */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Import Wallet</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Enter Recovery Phrase / a Private Key</Text>
        <Text style={styles.instructionText}>
          Use spaces between words if using a recovery phrase
        </Text>

        {/* Normal Text Input Box */}
        <TextInput
          style={styles.inputField}
          multiline
          numberOfLines={4}
          placeholder="Enter Recovery Phrase / a Private Key"
          placeholderTextColor="#666"
          value={recoveryPhrase}
          onChangeText={setRecoveryPhrase}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="top"
        />
        
        {/* Removed the divider line */}
      </View>

      {/* Import Button */}
      <TouchableOpacity 
        style={[styles.importButton, { width: screenWidth - 40 }]}
        onPress={handleImport}
      >
        <Text style={styles.importButtonText}>Import</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  inputField: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
    textAlign: 'left',
    borderWidth: 1,
    borderColor: '#333',
  },
  importButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#1d2939',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImportWalletScreen;