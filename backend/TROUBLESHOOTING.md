# Troubleshooting Guide

## Registration/Login Not Working

### 1. Check Database Connection

Make sure your `.env` file in the `/backend` directory has:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Common MongoDB URI formats:**
- Local: `mongodb://localhost:27017/image-generator`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/image-generator?retryWrites=true&w=majority`

### 2. Verify .env File Location

The `.env` file MUST be in the `/backend` directory, not the root directory.

### 3. Check Server Logs

When you start the backend server (`npm run dev`), you should see:
```
✅ MongoDB Connected: [hostname]
✅ Server running on port 5000
```

If you see errors, check:
- Is MongoDB running? (for local MongoDB)
- Is the MONGO_URI correct?
- Are you connected to the internet? (for MongoDB Atlas)

### 4. Test Database Connection

You can test if MongoDB is accessible by checking the server console when it starts.

### 5. Check API URL in Frontend

Make sure `config/api.js` has the correct URL:
- Android Emulator: `http://10.0.2.2:5000/api`
- iOS Simulator: `http://localhost:5000/api`
- Physical Device: `http://YOUR_COMPUTER_IP:5000/api`

### 6. Common Errors

**"MONGO_URI is not defined"**
- Your `.env` file is missing or not in the correct location
- Make sure `.env` is in `/backend` directory

**"MongoDB Connection Error"**
- Check your MongoDB connection string
- Make sure MongoDB is running (if local)
- Check network connection (if using Atlas)

**"User already exists"**
- The email is already registered
- Try a different email or login instead

**"Registration failed"**
- Check server console for detailed error
- Verify all fields are being sent from frontend
- Check network connection between app and server

### 7. Test Backend Directly

You can test the backend API directly using Postman or curl:

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 8. Clear AsyncStorage (Frontend)

If you're having login issues, try clearing stored data:
- Uninstall and reinstall the app, OR
- Add a "Clear Storage" button temporarily for testing
