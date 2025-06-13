import React, { useRef } from 'react';
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
import { ModalRef } from 'types/modalRef';
import { AccountCreationArea } from 'components/common/Account/AccountCreationArea';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddExistingWallet = () => {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;

  // Ref for triggering the modal

const importAccountRef = useRef<ModalRef | undefined>(undefined);
const createAccountRef = useRef<ModalRef | undefined>(undefined);
const attachAccountRef = useRef<ModalRef | undefined>(undefined);


  const handleImportWallet = () => {
    importAccountRef.current?.onOpenModal(); 
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

        <Text style={styles.title}>Add your Wallet</Text>
        <Text style={styles.description}>
          Click the import wallet to set up your wallet
        </Text>
      </View>

      {/* Import Wallet Button */}
      <TouchableOpacity 
        style={[styles.importButton, { width: screenWidth - 40 }]}
        onPress={handleImportWallet}
      >
        <Text style={styles.importButtonText}>Import Wallet</Text>
      </TouchableOpacity>

      {/* Include the AccountCreationArea with ref to trigger modal */}
     <AccountCreationArea
  createAccountRef={createAccountRef}
  importAccountRef={importAccountRef}
  attachAccountRef={attachAccountRef}
  allowToShowSelectType={true}
/>

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
    alignSelf: 'center',
  },
  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
