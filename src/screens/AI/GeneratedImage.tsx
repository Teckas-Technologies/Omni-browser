import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';

const GeneratedImage = () => {
  const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Jan_Davidsz._de_Heem_-_Vase_of_Flowers_%281666%29.jpg'; // Replace with generated one

  const handleDownload = () => {
    Linking.openURL(imageUrl);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.generatedImage}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.generateButton}>
        <Text style={styles.generateText}>+ Generate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDownload}>
        <Text style={styles.downloadText}>Download ⬇️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GeneratedImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  generatedImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 30,
  },
  generateButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
  },
  generateText: {
    color: '#fff',
    fontSize: 16,
  },
  downloadText: {
    color: '#53A8F1',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
