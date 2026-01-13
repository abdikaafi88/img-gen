import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ImageScreen from './screens/ImageScreen';
import SearchScreen from './screens/SearchScreen';
import HistoryScreen from './screens/HistoryScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        }
      }}
    >
      <Tab.Screen
        name="Generate"
        component={ImageScreen}
        options={{
          tabBarLabel: 'Generate',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎨</Text>
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔍</Text>
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📚</Text>
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ImageProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </ImageProvider>
    </AuthProvider>
  );
}
