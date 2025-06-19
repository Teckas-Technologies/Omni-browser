import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index'; // Adjust path if needed

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const AIScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
       {/* <Image
        source={require('assets/mesh-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      /> */}
      <Text style={styles.welcomeText}>
        Hello, I’m <Text style={styles.highlight}>OMNI</Text>
        {'\n'}your AI Assistance
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={[styles.card, styles.alignLeft]} onPress={() => navigation.navigate('ChatScreen')}>
          <Text style={styles.cardText}>
            Engage in{'\n'}conversation{'\n'}with OMNI.
          </Text>

          <View style={styles.bottomRow}>
            <Image source={require('assets/robot.png')} style={styles.cardIcon} resizeMode="contain" />
            <Image source={require('assets/arrow.png')} style={styles.arrowImage} resizeMode="contain" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.alignRight]}
          onPress={() => navigation.navigate('ImageGeneratorScreen')}>
          <Text style={styles.cardText}>
            Image{'\n'}generate{'\n'}with OMNI
          </Text>

          <View style={styles.bottomRow}>
            <Image source={require('assets/image.png')} style={styles.cardIcon} resizeMode="contain" />
            <Image source={require('assets/arrow.png')} style={styles.arrowImage} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        How may <Text style={styles.highlight}>I help you</Text> today!
      </Text>
    </View>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 80,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 40,
    lineHeight: 32,
    marginTop: 30,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  highlight: {
    color: '#53A8F1',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  cardsContainer: {
    width: '100%',
    // React Native doesn't support `gap`, so spacing is handled in card margins
  },
  cardIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#53A8F1',
    borderRadius: 16,
    padding: 4,
  },
  arrowImage: {
    width: 30,
    height: 30,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  card: {
    width: '50%',
    height: 190,
    backgroundColor: '#0A0A0A',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    padding: 14,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  arrowIcon: {
    alignSelf: 'flex-end',
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});

