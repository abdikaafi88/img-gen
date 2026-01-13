import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { ImageContext } from '../context/ImageContext';

export default function ImageScreen() {
  const [prompt, setPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
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

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-4 pb-6 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Search Image</Text>
        <Text className="text-gray-600">Search for images by keyword</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        <View className="mb-6">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4"
            placeholder="e.g., city, nature, sunset, mountains"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-4"
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" />
                <Text className="text-white ml-2 font-semibold text-lg">Searching...</Text>
              </View>
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Search Image</Text>
            )}
          </TouchableOpacity>
        </View>

        {currentImage && (
          <View className="mt-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Search Result</Text>
            <View className="bg-gray-100 rounded-lg overflow-hidden">
              <Image
                source={{ uri: currentImage.imageUrl }}
                className="w-full h-96"
                resizeMode="contain"
              />
            </View>
            <Text className="text-gray-600 mt-3 italic">"{currentImage.prompt}"</Text>
          </View>
        )}

        {!currentImage && !loading && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-400 text-center text-lg">
              Enter a keyword above to search for images
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
