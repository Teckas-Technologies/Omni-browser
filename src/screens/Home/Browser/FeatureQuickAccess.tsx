import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index'; // Make sure this is the correct path

const features = [
  { title: 'Wallet', icon: require('assets/omni_wallet_icon.png') },
  { title: 'Staking', icon: require('assets/staking.png') },
  { title: 'Omni Bot', icon: require('assets/omnibot.png') },
  { title: 'AI Image', icon: require('assets/aiimage.png') },
];

const FeatureQuickAccess = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (title: string) => {
    if (title === 'Wallet') {
      navigation.navigate('Tokens');
    } else if (title === 'Omni Bot') {
      navigation.navigate('ChatScreen');
    } else if (title === 'AI Image') {
      navigation.navigate('ImageGeneratorScreen');
    }
  };

  return (
    <View style={styles.container}>
      {features.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(item.title)}>
          <ImageBackground
            source={require('assets/omni_symbol_bg.png')}
            style={styles.box}
            imageStyle={styles.bgImage}
          >
            <Image source={item.icon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.label}>{item.title}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FeatureQuickAccess;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0C0C0C',
    gap: 16,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 80,
    height: 80,
  },
  bgImage: {
    borderRadius: 12,
    resizeMode: 'stretch',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
    tintColor: '#00A3FF',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
});
