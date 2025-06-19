import React, { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import { RootStackParamList } from 'routes/index';

type GeneratedImageRouteProp = RouteProp<RootStackParamList, 'GeneratedImage'>;

const GeneratedImage = () => {
  const route = useRoute<GeneratedImageRouteProp>();
  const { imageUrl } = route.params;
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the image',
          buttonPositive: 'OK',
        });

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission is required to download images.');
          return;
        }
      }

      const { config, fs } = RNFetchBlob;
      const date = new Date();
      const PictureDir = '/storage/emulated/0/Pictures'; // ✅ manually set public folder
      const filePath = `${PictureDir}/image_${Math.floor(date.getTime())}.png`;

      config({
        fileCache: true,
        appendExt: 'png',
        path: filePath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Image',
        },
      })
        .fetch('GET', imageUrl)
        .then(() => {
          Alert.alert('Download Success', 'Image saved to gallery.');
        })
        .catch(error => {
          console.error('Download error:', error);
          Alert.alert('Download Failed', 'Something went wrong.');
        });
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        {loading && (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#53A8F1" />
          </View>
        )}
        <Image
          source={{ uri: imageUrl }}
          style={styles.generatedImage}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      <TouchableOpacity
        onPress={handleDownload}
        style={[styles.downloadButton, loading && { opacity: 0.4 }]}
        disabled={loading}>
        <View style={styles.downloadContent}>
          <Text style={styles.downloadText}>Download</Text>
          <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
            <Path
              d="M12.5 15.577L8.961 12.039L9.669 11.319L12 13.65V5H13V13.65L15.33 11.32L16.039 12.039L12.5 15.577ZM7.116 19C6.65533 19 6.271 18.846 5.963 18.538C5.655 18.23 5.50067 17.8453 5.5 17.384V14.961H6.5V17.384C6.5 17.538 6.564 17.6793 6.692 17.808C6.82 17.9367 6.961 18.0007 7.115 18H17.885C18.0383 18 18.1793 17.936 18.308 17.808C18.4367 17.68 18.5007 17.5387 18.5 17.384V14.961H19.5V17.384C19.5 17.8447 19.346 18.229 19.038 18.537C18.73 18.845 18.3453 18.9993 17.884 19H7.116Z"
              fill="#70BEFA"
            />
          </Svg>
        </View>
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
    justifyContent: 'center',
    padding: 20,
  },
  imageWrapper: {
    width: 300,
    height: 300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  generatedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  loaderWrapper: {
    position: 'absolute',
    zIndex: 1,
  },
  downloadButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 16,
  },
  downloadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  downloadText: {
    color: '#53A8F1',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    fontFamily: 'PlusJakartaSans-Medium', // ✅ font added here
  },
});

