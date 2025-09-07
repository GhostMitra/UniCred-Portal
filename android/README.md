# UniCred - Native Android App

A native Android application for student credential management, built with Jetpack Compose and Material 3 design.

## Features

- **Multi-User Support**: Student, Recruiter, and University portals
- **Material 3 Design**: Modern UI with dynamic colors and true black theme support
- **Jetpack Compose**: Fully built with Compose UI toolkit
- **Navigation**: Bottom navigation for students, tab navigation for recruiters and universities
- **Credential Management**: View, verify, and manage student credentials
- **Blockchain Integration**: Support for blockchain-verified credentials
- **Responsive Design**: Optimized for different screen sizes

## Architecture

- **MVVM Pattern**: ViewModels with StateFlow for state management
- **Dependency Injection**: Hilt for dependency injection
- **Network Layer**: Retrofit for API communication
- **Navigation**: Navigation Compose for screen navigation
- **Material 3**: Dynamic theming with true black support

## User Portals

### Student Portal
- Dashboard with credential overview
- My Credentials with detailed view
- Profile management
- Bottom navigation

### Recruiter Portal
- Verification dashboard
- Credential verification tool
- Settings and profile management
- Tab-based navigation

### University Portal
- Student directory management
- Credential issuance and management
- University settings
- Comprehensive administration tools

## Technical Stack

- **Language**: Kotlin
- **UI**: Jetpack Compose
- **Architecture**: MVVM + Repository Pattern
- **DI**: Hilt
- **Network**: Retrofit + OkHttp
- **Navigation**: Navigation Compose
- **Theme**: Material 3 with dynamic colors
- **Build System**: Gradle with Kotlin DSL

## Getting Started

1. Open the project in Android Studio
2. Sync the project with Gradle files
3. Run the app on an emulator or device

## API Integration

The app connects to the UniCred backend API:
- Base URL: `https://unicred-portal-api.debarghaya.in/api/`
- Authentication endpoints
- Student management
- Credential verification
- University administration

## Theme Support

- **Light Theme**: Clean, modern light interface
- **Dark Theme**: True black (#000000) for OLED displays
- **Dynamic Colors**: Android 12+ dynamic color support
- **Material 3**: Latest Material Design guidelines

## Build Configuration

- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Compile SDK**: 34
- **Kotlin**: 1.9.20
- **Compose BOM**: 2023.10.01

## Dependencies

- Jetpack Compose BOM
- Material 3
- Navigation Compose
- Hilt
- Retrofit
- Coroutines
- Accompanist (System UI Controller)

## Project Structure

```
app/src/main/java/com/android/unicred/
├── data/                    # Data models and repositories
├── network/                 # API service and network modules
├── ui/
│   ├── navigation/          # Navigation setup
│   ├── screens/            # UI screens
│   │   ├── auth/           # Authentication screens
│   │   ├── student/        # Student portal screens
│   │   ├── recruiter/      # Recruiter portal screens
│   │   └── university/     # University portal screens
│   ├── theme/              # Material 3 theme
│   └── viewmodel/          # ViewModels
└── UniCredApplication.kt   # Hilt Application class
```

## Contributing

This is a native Android implementation of the UniCred platform, designed to provide a seamless mobile experience for credential management across different user types.