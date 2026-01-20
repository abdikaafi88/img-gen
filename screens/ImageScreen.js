import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { ImageContext } from '../context/ImageContext';

export default function ImageScreen() {
  const [prompt, setPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [focused, setFocused] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { generateImage, loading } = useContext(ImageContext);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    const result = await generateImage(prompt.trim());
    
    if (result.success) {
      setCurrentImage(result.image);
      setPrompt('');
    } else {
      Alert.alert('Search Failed', result.message);
    }
  };

  const handleDownload = async (imageUrl) => {
    if (!imageUrl) {
      Alert.alert('Error', 'No image to download');
      return;
    }

    setDownloading(true);

    try {
      // Request permissions
      const permissionResult = await MediaLibrary.requestPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your photo library to save images');
        return;
      }

      // Download image to cache
      const fileUri = FileSystem.cacheDirectory + `image_${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (!downloadResult.uri) {
        throw new Error('Download failed');
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      
      if (asset && asset.id) {
        Alert.alert('Success', 'Image saved to your gallery!');
      } else {
        throw new Error('Failed to save image');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', error.message || 'Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const imagesForPreview = currentImage ? [{ uri: currentImage.imageUrl }] : [];

  return (
    <LinearGradient
      colors={['#1e3a8a', '#4c1d95']}
      style={styles.gradient}
    >
      <View className="flex-1">
        <View className="px-6 pt-12 pb-6">
          <Text className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>Search Image</Text>
          <Text className="text-white text-base">Search for images by keyword</Text>
        </View>

        <ScrollView 
          className="flex-1" 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 mb-6">
            <View className="relative mb-4">
              <TextInput
                className="border-2 rounded-xl px-4 py-4 bg-white text-gray-900"
                style={{
                  borderColor: focused ? '#3b82f6' : '#ffffff',
                  minHeight: 100,
                  textAlignVertical: 'top',
                  paddingRight: 45
                }}
                placeholder="e.g., city, nature, sunset, mountains"
                placeholderTextColor="#9ca3af"
                value={prompt}
                onChangeText={setPrompt}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                multiline
                numberOfLines={4}
              />
              <Text className="absolute right-4 top-4 text-gray-400 text-lg">🔍</Text>
            </View>
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={loading}
              activeOpacity={0.8}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={['#60a5fa', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="white" />
                    <Text className="text-white ml-2 font-bold text-lg">Searching...</Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-bold text-lg">Search Image</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {currentImage && (
            <View className="px-6 mt-4">
              <Text className="text-xl font-bold text-white mb-4">Search Result</Text>
              <TouchableOpacity 
                onPress={() => setPreviewVisible(true)}
                activeOpacity={0.9}
              >
                <View className="bg-white rounded-xl overflow-hidden shadow-lg mb-4">
                  <Image
                    source={{ uri: currentImage.imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
              <View className="bg-white rounded-xl px-4 py-4 mb-4">
                <Text className="text-gray-700 italic text-base">"{currentImage.prompt}"</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDownload(currentImage.imageUrl)}
                disabled={downloading}
                activeOpacity={0.8}
                style={styles.downloadButtonContainer}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  {downloading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator color="white" />
                      <Text className="text-white ml-2 font-bold text-lg">Downloading...</Text>
                    </View>
                  ) : (
                    <Text className="text-white text-center font-bold text-lg">💾 Download Image</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {!currentImage && !loading && (
            <View className="flex-1 justify-center items-center px-6 py-20">
              <Text className="text-white text-center text-lg mb-2">
                Enter a keyword above to search for images
              </Text>
              <Text className="text-gray-300 text-center text-sm">
                Discover amazing images with just a few words
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <ImageViewing
        images={imagesForPreview}
        imageIndex={0}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
        animationType="fade"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 400,
  },
  downloadButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  downloadButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
