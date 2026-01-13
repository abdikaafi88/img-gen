# Quick Fix: Network Connection Error

## The Problem
Your app can't connect to the backend server. This happens when:
- Using a **physical device** (not emulator/simulator)
- The backend server is not running
- Wrong API URL configuration

## Solution Steps

### Step 1: Check if Backend is Running
Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: [hostname]
✅ Server running on port 5000
```

### Step 2: Find Your Computer's IP Address

**Windows:**
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. Example: `192.168.1.100`

**Mac/Linux:**
1. Open Terminal
2. Type: `ifconfig` or `ip addr`
3. Look for your local IP (usually starts with 192.168.x.x)

### Step 3: Update API URL for Physical Device

If you're using a **physical device** (not emulator), you need to update the API URL:

1. Open `config/api.js`
2. Replace the API URL with your computer's IP address:

```javascript
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    // REPLACE 192.168.1.100 WITH YOUR COMPUTER'S IP ADDRESS
    const YOUR_COMPUTER_IP = '192.168.1.100';
    
    if (Platform.OS === 'android') {
      return `http://${YOUR_COMPUTER_IP}:5000/api`;
    }
    if (Platform.OS === 'ios') {
      return `http://${YOUR_COMPUTER_IP}:5000/api`;
    }
    return `http://${YOUR_COMPUTER_IP}:5000/api`;
  }
  return 'https://your-production-url.com/api';
};

export const API_URL = getApiUrl();
```

### Step 4: Make Sure Device and Computer are on Same WiFi
- Your phone and computer must be on the **same WiFi network**
- Turn off mobile data on your phone (use WiFi only)

### Step 5: Check Windows Firewall
Windows might be blocking the connection:
1. Open Windows Defender Firewall
2. Allow Node.js through the firewall
3. Or temporarily disable firewall to test

### Step 6: Restart the App
After making changes:
1. Stop the Expo app
2. Restart with: `npx expo start`
3. Reload the app on your device

## Quick Test

Test if your backend is accessible:
1. Open browser on your phone (same WiFi)
2. Go to: `http://YOUR_COMPUTER_IP:5000`
3. You should see: `{"message":"Image Generator API is running"}`

If this works, the API URL in your app should work too!
