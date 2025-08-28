# Backend Integration Guide

This guide explains how to integrate the UniCred React Native mobile app with the existing backend.

## Prerequisites

1. **Backend Running**: Your production backend is available at `https://unicred-portal-api.debarghaya.in`
2. **Database**: PostgreSQL database is running and accessible on the production server
3. **Environment Variables**: Backend has proper environment variables configured

## Backend Setup

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on port 4000.

### 2. Seed Demo Data

The backend includes demo users for testing:

```bash
# Create demo users (STU001, REC001, UNI001)
curl -X POST http://localhost:4000/api/auth/seed-demo

# Create mock credentials
curl -X POST http://localhost:4000/api/credentials/seed-mock
```

**Demo Credentials:**
- **Student**: STU001 / password
- **Recruiter**: REC001 / password  
- **University**: UNI001 / password

### 3. Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/visionx_db"
JWT_SECRET="your-secret-key-here"
DID_SEED="dev_seed_32_bytes_minimum_dev_seed_123456"
PORT=4000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/seed-demo` - Create demo users

### Credentials
- `GET /api/credentials` - List credentials (with filters)
- `POST /api/credentials` - Create new credential
- `GET /api/credentials/verify/:hash` - Verify credential by hash
- `POST /api/credentials/:id/anchor` - Anchor credential to blockchain
- `POST /api/credentials/:id/revoke` - Revoke credential
- `POST /api/credentials/seed-mock` - Create mock credentials

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `GET /api/students/:id/credentials` - Get student's credentials
- `GET /api/students/:id/wallet` - Get student's wallet info

### Metrics
- `GET /api/metrics/dashboard` - Dashboard statistics
- `GET /api/metrics/credentials` - Credential metrics
- `GET /api/metrics/students` - Student metrics
- `GET /api/metrics/activity` - Recent activity

## Mobile App Configuration

### 1. Update API URL

Edit `src/config/config.ts`:

```typescript
export const config = {
  api: {
    // Production API URL
    baseUrl: 'https://unicred-portal-api.debarghaya.in/api',
    // ... other config
  },
};
```

### 2. For Physical Device Testing

If testing on a physical device, update the URL to your computer's IP address:

```typescript
baseUrl: 'http://192.168.1.100:4000/api', // Your computer's IP
```

### 3. For Production

Update to your production backend URL:

```typescript
baseUrl: 'https://unicred-portal-api.debarghaya.in/api',
```

## Testing the Integration

### 1. Backend Status

Your production backend is already running at `https://unicred-portal-api.debarghaya.in`

**Note**: Since this is a production backend, you don't need to start it locally.

### 2. Start the Mobile App

```bash
cd app/VisionXApp
npm start
```

### 3. Test Login

Use the demo credentials:
- **Student**: STU001 / password
- **Recruiter**: REC001 / password
- **University**: UNI001 / password

### 4. Check API Calls

Monitor the backend console for API requests from the mobile app.

## Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: Network error
```
**Solution**: Check if the production backend is accessible at https://unicred-portal-api.debarghaya.in

#### 2. CORS Issues
```
Error: CORS policy
```
**Solution**: Backend has CORS enabled, but check if your network allows it

#### 3. Database Connection
```
Error: Database connection failed
```
**Solution**: Check PostgreSQL is running and DATABASE_URL is correct

#### 4. JWT Token Issues
```
Error: Invalid token
```
**Solution**: Check JWT_SECRET in backend .env file

### Debug Mode

Enable debug logging in the mobile app:

```typescript
// In src/config/config.ts
development: {
  logApiCalls: true,
  showDevWarnings: true,
}
```

### Network Debugging

Use tools like:
- **Backend**: Check console logs
- **Mobile**: React Native Debugger or Flipper
- **Network**: Charles Proxy or Fiddler

## Security Considerations

### 1. JWT Tokens
- Tokens are stored securely in AsyncStorage
- Automatic token refresh (implement if needed)
- Secure token transmission

### 2. API Security
- Backend uses Helmet for security headers
- CORS properly configured
- Input validation with Zod

### 3. Data Privacy
- Sensitive data not logged
- Secure credential storage
- User authentication required

## Performance Optimization

### 1. Caching
- Implement credential caching
- Cache user data
- Offline support (future feature)

### 2. API Optimization
- Batch requests where possible
- Implement pagination for large datasets
- Use GraphQL for complex queries (future)

## Future Enhancements

### 1. Real-time Updates
- WebSocket integration for live credential updates
- Push notifications for status changes

### 2. Offline Support
- Local database for offline access
- Sync when connection restored

### 3. Advanced Security
- Biometric authentication
- Certificate pinning
- Encrypted local storage

## Support

For backend integration issues:
1. Check backend logs
2. Verify API endpoints
3. Test with Postman/curl
4. Check network connectivity
5. Review environment variables

## API Documentation

For detailed API documentation, refer to the backend source code in the `backend/src/routes/` directory.
