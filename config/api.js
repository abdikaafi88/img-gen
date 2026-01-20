import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    const IS_PHYSICAL_DEVICE = true;
    const YOUR_COMPUTER_IP = '10.225.54.153';
    
    if (IS_PHYSICAL_DEVICE) {
      return `http://${YOUR_COMPUTER_IP}:5000/api`;
    }
    
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000/api';
    }
    return 'http://localhost:5000/api';
  }
  return 'https://your-production-url.com/api';
};

export const API_URL = getApiUrl();
