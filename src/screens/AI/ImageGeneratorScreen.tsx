import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index'; // Adjust path if needed

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ASPECT_RATIOS = ['1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2', '5:4', '21:9'];
const ART_STYLES = ['Colorful', 'Sketch', 'Cyberpunk'];

const ImageGeneratorScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleGenerate = () => {
    navigation.navigate('GeneratedImage'); // 👈 Adjust this to your screen name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hello, I’m <Text style={styles.highlight}>OMNI</Text>{'\n'}your Image Generator
      </Text>

      <View style={styles.textAreaWrapper}>
        <TextInput
          placeholder="Describe your image..."
          placeholderTextColor="#fff"
          style={styles.textArea}
          multiline
        />
        <TouchableOpacity style={styles.reloadIconWrapper}>
          <Image source={require('assets/reload.png')} style={styles.reloadIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.aspectRatioContainer}>
        <Text style={styles.sectionTitle}>Aspect Ratio</Text>
        <View style={styles.ratioGrid}>
          {ASPECT_RATIOS.map((ratio, index) => (
            <TouchableOpacity key={index} style={styles.ratioBox}>
              <Text style={styles.ratioText}>{ratio}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.artStyleContainer}>
        <Text style={styles.sectionTitle}>Art Style</Text>
        <View style={styles.styleRow}>
          {ART_STYLES.map((style, index) => (
            <TouchableOpacity key={index} style={styles.styleButton}>
              <Text style={styles.styleText}>{style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Image source={require('assets/glitter.png')} style={styles.glitterIcon} />
          <Text style={styles.generateText}>Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageGeneratorScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '400',
    marginTop: 35,
  },
  highlight: {
    color: '#53A8F1',
    fontWeight: '700',
  },
  textAreaWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  textArea: {
    backgroundColor: '#111',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    height: 140,
    textAlignVertical: 'top',
    color: '#fff',
    padding: 12,
    paddingBottom: 30,
  },
  reloadIconWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  reloadIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  aspectRatioContainer: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  ratioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  ratioBox: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
    minWidth: '30%',
    alignItems: 'center',
  },
  ratioText: {
    color: '#fff',
    fontSize: 12,
  },
  artStyleContainer: {
    marginBottom: 20,
  },
  styleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styleButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  styleText: {
    color: '#fff',
    fontSize: 13,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 20,
  },
  generateButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  glitterIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  generateText: {
    color: '#fff',
    fontSize: 16,
  },
});
