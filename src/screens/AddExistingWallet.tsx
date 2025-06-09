import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddExistingWallet = () => {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;

  const handleImportWallet = () => {
    navigation.navigate('ImportWallet'); // Navigate to ImportWallet screen
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Existing Wallet</Text>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Logo with background */}
        <ImageBackground
          source={require('assets/omni_symbol_bg.png')}
          style={styles.logoBackground}
          resizeMode="contain"
        >
          <Image
            source={require('assets/omni_wallet_icon.png')}
            style={styles.walletIcon}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* Title and description */}
        <Text style={styles.title}>Add your Wallet</Text>
        <Text style={styles.description}>
          Click the import wallet to set up your wallet
        </Text>
      </View>

      {/* Full width button */}
      <TouchableOpacity 
        style={[styles.importButton, { width: screenWidth - 40 }]}
        onPress={handleImportWallet} // Added onPress handler
      >
        <Text style={styles.importButtonText}>Import Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddExistingWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    height: 40,
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 160,
  },
  logoBackground: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  walletIcon: {
    width: 55,
    height: 55,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  importButton: {
  position: 'absolute',
  bottom: 60,
  backgroundColor: '#1d2939',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  alignSelf: 'center', // ✅ Center horizontally
},

  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
