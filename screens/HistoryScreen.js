import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';

export default function HistoryScreen() {
  const { images, loading, fetchHistory, deleteImage } = useContext(ImageContext);
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();
  }, []);

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
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-xs">
          {new Date(item.createdAt).toLocaleString()}
        </Text>
        <TouchableOpacity
          className="bg-red-500 rounded-lg px-4 py-2"
          onPress={() => handleDelete(item._id, item.prompt)}
        >
          <Text className="text-white text-sm font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-4 pb-6 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">History</Text>
            <Text className="text-gray-600">Your generated images</Text>
          </View>
          <TouchableOpacity
            className="bg-red-500 rounded-lg px-4 py-2"
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout }
              ]);
            }}
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && images.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item) => item._id}
          contentContainerClassName="p-6"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchHistory} />
          }
          ListEmptyComponent={
            <View className="py-20 items-center">
              <Text className="text-gray-400 text-center text-lg">
                No images in history yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Generate some images to see them here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
