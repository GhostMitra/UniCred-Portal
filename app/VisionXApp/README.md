# UniCred React Native App

A React Native mobile application for the UniCred Student Credential Platform, built with Expo and TypeScript.

## Features

- **Multi-User Authentication**: Support for students, recruiters, and universities
- **Student Portal**: 
  - Dashboard with credential overview
  - Credential management and viewing
  - Profile settings and preferences
- **Recruiter Portal**: Search and view student credentials (coming soon)
- **University Portal**: Issue and verify credentials (coming soon)
- **Modern UI**: Dark theme with intuitive navigation
- **Cross-Platform**: Built with React Native for Android and iOS

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Icons**: Expo Vector Icons (Ionicons)
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet

## Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx          # Login screen
│   ├── StudentPortal.tsx      # Student portal with tab navigation
│   ├── RecruiterPortal.tsx    # Recruiter portal (placeholder)
│   ├── UniversityPortal.tsx   # University portal (placeholder)
│   └── student/
│       ├── Dashboard.tsx      # Student dashboard
│       ├── Credentials.tsx    # Credential management
│       └── Profile.tsx        # Profile settings
└── types.ts                   # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Android device or emulator

### Installation

1. Navigate to the project directory:
   ```bash
   cd app/VisionXApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on Android:
   ```bash
   npm run android
   ```

### Development Commands

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm run build` - Build the app for production

## App Flow

1. **Login Screen**: Users authenticate with username/password
2. **Portal Selection**: Based on user type (student/recruiter/university)
3. **Student Portal**: 
   - Dashboard: Overview of credentials and stats
   - Credentials: View and manage all credentials
   - Profile: Account settings and preferences
4. **Navigation**: Bottom tab navigation for students, stack navigation for other users

## Customization

### Adding New Features

1. Create new components in the appropriate directory
2. Update navigation in the portal components
3. Add new types to `types.ts` if needed
4. Update the main App.tsx for new routes

### Styling

The app uses a consistent dark theme with:
- Primary: `#3b82f6` (Blue)
- Background: `#0f172a` (Dark slate)
- Cards: `#1e293b` (Medium slate)
- Text: `#ffffff` (White) and `#94a3b8` (Light slate)

### Icons

The app uses Ionicons from Expo Vector Icons. To add new icons:
```typescript
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="icon-name" size={24} color="#3b82f6" />
```

## API Integration

Currently, the app uses mock data. To integrate with your backend:

1. Replace mock data in components with API calls
2. Add authentication token management
3. Implement proper error handling
4. Add loading states and offline support

## Building for Production

1. Configure app.json with your app details
2. Build the app:
   ```bash
   expo build:android
   ```
3. Generate APK or AAB for distribution

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new components
3. Maintain consistent styling with the design system
4. Test on both Android and iOS when possible

## License

This project is part of the VisionX platform. See the main project license for details.

## Support

For issues and questions:
- Check the Expo documentation
- Review React Navigation guides
- Refer to the main VisionX project documentation
