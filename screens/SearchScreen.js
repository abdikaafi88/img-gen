import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { ImageContext } from '../context/ImageContext';

export default function SearchScreen() {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { generateImage, images } = useContext(ImageContext);

  useEffect(() => {
    setSearchResults(images);
  }, [images]);

  const handleSearch = async () => {
    if (!searchPrompt.trim()) {
      setSearchResults(images);
      return;
    }

    setSearching(true);
    const filtered = images.filter(img =>
      img.prompt.toLowerCase().includes(searchPrompt.toLowerCase())
    );
    setSearchResults(filtered);
    setSearching(false);
  };

  const handleGenerateFromSearch = async () => {
    if (!searchPrompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    const result = await generateImage(searchPrompt.trim());
    
    if (result.success) {
      setSearchPrompt('');
      Alert.alert('Success', 'Image found and saved to history');
    } else {
      Alert.alert('Search Failed', result.message);
    }
  };

  const renderImageItem = ({ item }) => (
    <View className="mb-6 bg-gray-50 rounded-lg p-4">
      <View className="bg-gray-200 rounded-lg overflow-hidden mb-3">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-64"
          resizeMode="contain"
        />
      </View>
      <Text className="text-gray-700 mb-2">{item.prompt}</Text>
      <Text className="text-gray-400 text-xs">
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-4 pb-6 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Search & Browse</Text>
        <Text className="text-gray-600">Search your history or find new images</Text>
      </View>

      <View className="px-6 py-4 border-b border-gray-200">
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 bg-white mb-3"
          placeholder="Search history or enter keyword"
          value={searchPrompt}
          onChangeText={setSearchPrompt}
          onSubmitEditing={handleSearch}
        />
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-gray-600 rounded-lg py-3"
            onPress={handleSearch}
            disabled={searching}
          >
            <Text className="text-white text-center font-semibold">Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-600 rounded-lg py-3"
            onPress={handleGenerateFromSearch}
          >
            <Text className="text-white text-center font-semibold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderImageItem}
        keyExtractor={(item) => item._id}
        contentContainerClassName="p-6"
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-gray-400 text-center text-lg">
              {searchPrompt ? 'No results found' : 'No images in history'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
