# Setup Instructions

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory with the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
PEXELS_API_KEY=your_pexels_api_key_here
```

4. Start the backend server:
```bash
npm run dev
```

## Frontend Setup

1. Install dependencies (from root directory):
```bash
npm install
```

2. The API URL is automatically configured:
   - Android Emulator: Uses `10.0.2.2:5000`
   - iOS Simulator: Uses `localhost:5000`
   - Physical devices: Update `config/api.js` with your computer's IP address

3. Start the Expo development server:
```bash
npx expo start
```

## MongoDB Setup

1. Create a MongoDB account at [mongodb.com](https://www.mongodb.com)
2. Create a new cluster
3. Get your connection string
4. Add it to the backend `.env` file

## Pexels API Setup

1. Sign up for Pexels API at [pexels.com/api](https://www.pexels.com/api/)
2. Get your API key (free tier available)
3. Add it to the backend `.env` file as `PEXELS_API_KEY`

## Running on Physical Device

For Android Emulator:
- The API URL is automatically configured to use `10.0.2.2` (Android emulator's localhost)

For iOS Simulator:
- The API URL is automatically configured to use `localhost`

For Physical Devices (Android/iOS):
1. Make sure your phone and computer are on the same WiFi network
2. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
3. Update `config/api.js` to use: `http://YOUR_IP_ADDRESS:5000/api`
   Example: `return 'http://192.168.1.100:5000/api';`
4. The backend CORS is already configured to accept requests from any origin
