import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AIScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Animated opacities for original and new positions
  const leftOpacity = useRef(new Animated.Value(1)).current;
  const rightOpacity = useRef(new Animated.Value(1)).current;
  const newRightTopOpacity = useRef(new Animated.Value(0)).current;
  const newRightBottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        // Wait at initial state
        Animated.delay(1000),
        // Fade out old positions
        Animated.parallel([
          Animated.timing(leftOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(rightOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Fade in new right positions
        Animated.parallel([
          Animated.timing(newRightTopOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(newRightBottomOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        // Wait while all 4 are visible (new & old)
        Animated.delay(1000),
        // Fade out new right positions
        Animated.parallel([
          Animated.timing(newRightTopOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(newRightBottomOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Fade in original left and right again
        Animated.parallel([
          Animated.timing(leftOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rightOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(500),
      ]).start(() => loopAnimation());
    };

    loopAnimation();
  }, []);

  return (
    <View style={styles.container}>
      {/* OLD Position Left */}
      <Animated.Image
        source={require('assets/mesh-gradient.png')}
        style={[styles.meshGradient, { top: 130, left: -150, opacity: leftOpacity }]}
        resizeMode="contain"
      />

      {/* OLD Position Right */}
      <Animated.Image
        source={require('assets/mesh-gradient.png')}
        style={[styles.meshGradient, { top: 20, right: -130, opacity: rightOpacity }]}
        resizeMode="contain"
      />

      {/* NEW Right Top */}
      <Animated.Image
        source={require('assets/mesh-gradient.png')}
        style={[styles.meshGradient, { top: 10, right: -230, opacity: newRightTopOpacity }]}
        resizeMode="contain"
      />

      {/* NEW Right Bottom */}
      <Animated.Image
        source={require('assets/mesh-gradient.png')}
        style={[styles.meshGradient, { top: 210, right: -150, opacity: newRightBottomOpacity }]}
        resizeMode="contain"
      />

      <Text style={styles.welcomeText}>
        Hello, I’m <Text style={styles.highlight}>OMNI</Text>
        {'\n'}your AI Assistance
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, styles.alignLeft]}
          onPress={() => navigation.navigate('ChatScreen')}>
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
    backgroundColor: 'transparent',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f0f8fe',
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
  footerText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  meshGradient: {
    position: 'absolute',
    width: 450,
    height: 500,
    zIndex: -1,
  },
});
