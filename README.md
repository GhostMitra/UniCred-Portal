# YtDlp Android

A modern Android application for downloading videos using yt-dlp, built with Jetpack Compose and Material Design 3.

## Features

- **Modern UI**: Built with Jetpack Compose and Material Design 3
- **Dynamic Colors**: Supports Android 12+ dynamic theming
- **Dark Theme**: Full dark mode support
- **Comprehensive Settings**: Extensive configuration options for yt-dlp
- **Material Design 3**: Follows latest Material Design guidelines

## Screens

### Main Settings Screen
- Battery configuration card (highlighted)
- Settings categories with icons and descriptions
- Clean, card-based layout

### Individual Settings Screens
- **General**: Yt-dlp version, notifications, playlist support
- **Download Directory**: Custom download locations and quick access
- **Format**: File format, video quality, subtitles, audio-only options
- **Network**: Rate limiting, downloader selection, cookies
- **Custom Command**: Custom yt-dlp command templates
- **Look & Feel**: Theme selection, dynamic colors, language
- **Interface & Interaction**: Download behavior and UI preferences
- **About**: App information, updates, support links

## Technical Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Design System**: Material Design 3
- **Build System**: Gradle with Kotlin DSL
- **Architecture**: MVVM with Navigation Compose
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## Project Structure

```
app/
├── src/main/
│   ├── java/com/ytdlp/android/
│   │   ├── MainActivity.kt
│   │   └── ui/
│   │       ├── navigation/
│   │       ├── screens/
│   │       │   ├── settings/
│   │       │   ├── general/
│   │       │   ├── downloaddirectory/
│   │       │   ├── format/
│   │       │   ├── network/
│   │       │   ├── customcommand/
│   │       │   ├── lookandfeel/
│   │       │   ├── interfaceinteraction/
│   │       │   └── about/
│   │       └── theme/
│   ├── res/
│   │   ├── values/
│   │   ├── xml/
│   │   └── mipmap/
│   └── AndroidManifest.xml
├── build.gradle.kts
└── proguard-rules.pro
```

## Building the Project

1. Clone the repository
2. Open in Android Studio or use command line:
   ```bash
   ./gradlew build
   ```

## Dependencies

- **Jetpack Compose BOM**: 2023.10.01
- **Material Design 3**: Latest
- **Navigation Compose**: 2.7.6
- **Lifecycle ViewModel**: 2.7.0
- **Accompanist System UI Controller**: 0.32.0

## Design Philosophy

The app follows the design principles shown in the reference settings screen:

- **Card-based Layout**: Each setting category is presented in a clean card
- **Consistent Spacing**: 16dp margins and 8dp spacing between elements
- **Icon + Text Pattern**: Each setting has an icon, title, and description
- **Highlighted Important Items**: Battery configuration gets special treatment
- **Material Design 3**: Rounded corners, proper elevation, and dynamic colors
- **Dark Theme Support**: Full dark mode with proper contrast ratios

## Future Enhancements

- Video download functionality
- Download queue management
- Progress tracking
- File management
- Integration with yt-dlp binary
- Background download service
- Notification system

## License

This project is for educational and demonstration purposes.