import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'routes/index';
import axios from 'axios';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GeneratedImage'>;

const ASPECT_RATIOS = ['1:1', '16:9', '9:16'];
const ART_STYLES = ['Colorful', 'Sketch', 'Cyberpunk'];

const ImageGeneratorScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ loading state

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.250.187:8000/generate-image', {
        prompt,
        style: selectedStyle,
        aspect_ratio: selectedRatio,
      });

      const imageUrl = response.data.image_url;
      console.log();
      
      navigation.navigate('GeneratedImage', { imageUrl });
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false); // ✅ reset loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hello, I’m <Text style={styles.highlight}>OMNI</Text>
        {'\n'}your Image Generator
      </Text>

      <View style={styles.textAreaWrapper}>
        <TextInput
          placeholder="Describe your image..."
          placeholderTextColor="#fff"
          style={styles.textArea}
          multiline
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity style={styles.reloadIconWrapper}>
          <Image source={require('assets/reload.png')} style={styles.reloadIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.aspectRatioContainer}>
        <Text style={styles.sectionTitle}>Aspect Ratio</Text>
        <View style={styles.ratioGrid}>
          {ASPECT_RATIOS.map((ratio, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.ratioBox, selectedRatio === ratio && { backgroundColor: '#444' }]}
              onPress={() => setSelectedRatio(ratio)}>
              <Text style={styles.ratioText}>{ratio}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.artStyleContainer}>
        <Text style={styles.sectionTitle}>Art Style</Text>
        <View style={styles.styleRow}>
          {ART_STYLES.map((style, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.styleButton, selectedStyle === style && { backgroundColor: '#444' }]}
              onPress={() => setSelectedStyle(style)}>
              <Text style={styles.styleText}>{style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.generateText}>Generating image...</Text>
            </View>
          ) : (
            <>
              <Image source={require('assets/glitter.png')} style={styles.glitterIcon} />
              <Text style={styles.generateText}>Generate</Text>
            </>
          )}
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
    fontFamily: 'PlusJakartaSans-Medium',
  },
  highlight: {
    color: '#53A8F1',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

