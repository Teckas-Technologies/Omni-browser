import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { EVM_ACCOUNT_TYPE } from 'constants/index';

export const FirstScreen = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const { hasMasterPassword } = useSelector((state: RootState) => state.accountState);

  const navigation = useNavigation<NavigationProp>();
  const handleNavigation = useCallback(() => {
    if (hasMasterPassword) {
      navigation.navigate('CreateAccount', {
        keyTypes: [EVM_ACCOUNT_TYPE],
      });
    } else {
      navigation.navigate('CreatePassword', { pathName: 'CreateAccount' });
    }
  }, [hasMasterPassword, navigation]);

  return (
    <View style={styles.container}>
      {/* Omni Logo Top */}
      <Image source={require('assets/images/omni_logo.png')} style={styles.topLogo} resizeMode="contain" />

      {/* Center Symbol */}
     <View style={styles.centerSymbolWrapper}>
  <Image source={require('assets/gradient.png')} style={styles.meshGradient} resizeMode="cover" />
  <ImageBackground
    source={require('assets/images/omni_symbol_bg.png')}
    style={styles.centerSymbolBg}
    resizeMode="contain">
    <Image source={require('assets/images/omni_symbol.png')} style={styles.centerSymbol} resizeMode="contain" />
  </ImageBackground>
</View>


      {/* Centered Welcome Text + Button Block */}
      <View style={styles.centeredTextWrapper}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.titleText}>
          <Text style={styles.titleBlue}>Omni</Text> Wallet
        </Text>

        <View style={styles.buttonAlignRight}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNavigation}>
            <Text style={styles.primaryButtonText}>
              Create <Text style={styles.primaryButtonTextBlue}>New Wallet</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Already have a wallet link */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AddExistingWallet')}>
        <Text style={styles.secondaryText}>Already have a wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040404',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  topLogo: {
    width: 160,
    height: 100,
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
centerSymbolWrapper: {
  width: 260,
  height: 260,
  marginBottom: 40,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},

meshGradient: {
  position: 'absolute',
  width: 450,
  height: 260,
  borderRadius: 130,
  zIndex: -1, // keep it behind other content
},


  centerSymbolBg: {
    width: 240,
    height: 240,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSymbol: {
    width: 140,
    height: 140,
  },
  centeredTextWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
  },
  titleBlue: {
    fontSize: 45,
    fontWeight: '900',
    color: '#70befa',
  },
  buttonAlignRight: {
    width: '85%', // approx width matching title text line
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonTextBlue: {
    color: '#70befa',
  },
  secondaryButton: {
    paddingVertical: 8,
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});