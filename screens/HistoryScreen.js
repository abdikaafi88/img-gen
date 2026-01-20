import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  
  Alert,
  
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';

export default function HistoryScreen() {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { images, loading, fetchHistory, deleteImage } = useContext(ImageContext);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    // Update search results when images change
    if (searchPrompt.trim()) {
      const filtered = images.filter(img =>
        img.prompt.toLowerCase().includes(searchPrompt.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(images);
    }
  }, [images, searchPrompt]);

  const handleSearch = () => {
    if (!searchPrompt.trim()) {
      setSearchResults(images);
      return;
    }

    const filtered = images.filter(img =>
      img.prompt.toLowerCase().includes(searchPrompt.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleDownload = async (imageUrl, imageId) => {
    setDownloadingIds(prev => new Set(prev).add(imageId));

    try {
      // Request permissions
      const permissionResult = await MediaLibrary.requestPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        setDownloadingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
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
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
      
    }
  };

  const handleDelete = (imageId, prompt) => {
    Alert.alert(
      'Delete Image',
      `Are you sure you want to delete "${prompt.substring(0, 30)}..."?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteImage(imageId);
            if (!result.success) {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handlePreview = (index) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const displayImages = searchPrompt.trim() ? searchResults : images;
  const previewImages = displayImages.map(img => ({ uri: img.imageUrl }));

  const renderImageItem = ({ item, index }) => {
    const isDownloading = downloadingIds.has(item._id);
    const actualIndex = displayImages.findIndex(img => img._id === item._id);
    
    return (
      <View className="mb-6 bg-white rounded-xl p-4 shadow-lg">
        <TouchableOpacity 
          onPress={() => handlePreview(actualIndex)}
          activeOpacity={0.9}
        >
          <View className="bg-gray-100 rounded-xl overflow-hidden mb-3">
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <Text className="text-gray-900 mb-3 font-medium text-base">{item.prompt}</Text>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-xs">
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => handleDownload(item.imageUrl, item._id)}
            disabled={isDownloading}
            activeOpacity={0.8}
            style={styles.downloadButtonContainer}
            className="flex-1"
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.downloadButton}
            >
              {isDownloading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white text-center font-semibold text-sm">💾 Download</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-red-500 rounded-lg px-4 py-3"
            onPress={() => handleDelete(item._id, item.prompt)}
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold text-sm">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#1e3a8a', '#4c1d95']}
      style={styles.gradient}
    >
      <View className="flex-1">
        <View className="px-6 pt-12 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>History</Text>
              <Text className="text-white text-base">Your images and search</Text>
            </View>
            <TouchableOpacity
              className="bg-red-500 rounded-lg px-4 py-2 ml-3"
              onPress={() => {
                Alert.alert('Logout', 'Are you sure you want to logout?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Logout', style: 'destructive', onPress: logout }
                ]);
              }}
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input Section */}
          <View className="mt-2">
            <View className="relative mb-3">
              <TextInput
                className="border-2 rounded-xl px-4 py-4 bg-white text-gray-900"
                style={{
                  borderColor: focused ? '#3b82f6' : '#ffffff',
                  paddingRight: 45
                }}
                placeholder="Search history or enter keyword"
                placeholderTextColor="#9ca3af"
                value={searchPrompt}
                onChangeText={(text) => {
                  setSearchPrompt(text);
                  if (!text.trim()) {
                    setSearchResults(images);
                  }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={handleSearch}
              />
              <Text className="absolute right-4 top-4 text-gray-400 text-lg">🔍</Text>
            </View>
            <TouchableOpacity
              onPress={handleSearch}
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
                <Text className="text-white text-center font-bold text-lg">Search History</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {loading && images.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <FlatList
            data={displayImages}
            renderItem={renderImageItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl 
                refreshing={loading} 
                onRefresh={fetchHistory}
                tintColor="#ffffff"
              />
            }
            ListEmptyComponent={
              <View className="py-20 items-center px-6">
                <Text className="text-white text-center text-lg mb-2">
                  {searchPrompt.trim() ? 'No results found' : 'No images in history yet'}
                </Text>
                <Text className="text-gray-300 text-center text-sm">
                  {searchPrompt.trim() 
                    ? 'Try a different search term' 
                    : 'Generate some images to see them here'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <ImageViewing
        images={previewImages}
        imageIndex={previewIndex}
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
    height: 200,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  downloadButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  downloadButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
