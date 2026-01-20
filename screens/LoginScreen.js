import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <LinearGradient
      colors={['#1e3a8a', '#4c1d95']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Text className="text-5xl font-bold mb-3" style={{ color: '#3b82f6' }}>Welcome Back</Text>
            <Text className="text-white text-base">Sign in to continue your journey</Text>
          </View>

          <View className="mb-6">
            <Text className="text-white mb-2 font-medium">Email</Text>
            <View className="relative">
              <TextInput
                className="border-2 rounded-xl px-4 py-4 bg-white text-gray-900"
                style={{
                  borderColor: focusedField === 'email' ? '#3b82f6' : '#ffffff',
                  paddingRight: 45
                }}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Text className="absolute right-4 top-4 text-gray-400 text-lg">🔒</Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-white mb-2 font-medium">Password</Text>
            <View className="relative">
              <TextInput
                className="border-2 rounded-xl px-4 py-4 bg-white text-gray-900"
                style={{
                  borderColor: focusedField === 'password' ? '#3b82f6' : '#ffffff',
                  paddingRight: 45
                }}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoCapitalize="none"
              />
              <Text className="absolute right-4 top-4 text-gray-400 text-lg">🔒</Text>
            </View>
          </View>

          <Text className="text-white text-sm mb-6 text-center">Join our network, start creating</Text>

          <TouchableOpacity
            onPress={handleLogin}
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
              <Text className="text-white text-center font-bold text-lg">
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 mb-6">
            <Text className="text-white">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-blue-400 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="w-full mb-4" style={{ height: 1 }}>
              <LinearGradient
                colors={['#60a5fa', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.separator}
              />
            </View>
            <Text className="text-gray-300 text-sm mb-4">Or connect with</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <Text className="text-xl">🔵</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <Text className="text-xl">⚫</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <Text className="text-xl">🔷</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
  separator: {
    width: '100%',
    height: 1,
  },
});
