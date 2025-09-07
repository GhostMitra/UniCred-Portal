# YtDlp Android Project

This workspace contains a complete Android application built with Jetpack Compose and Material Design 3.

## Project Structure

```
workspace/
├── android/                 # Native Android App
│   ├── app/                # Main Android application module
│   ├── build.gradle.kts    # Project-level build configuration
│   ├── settings.gradle.kts # Project settings
│   ├── gradlew            # Gradle wrapper script
│   └── README.md          # Android app documentation
├── backend/               # Backend services (existing)
├── frontend/              # Frontend web app (existing)
└── README.md             # This file
```

## Android App

The `android/` folder contains a complete native Android application featuring:

- **Jetpack Compose** UI framework
- **Material Design 3** with dynamic colors
- **Kotlin DSL** build configuration
- **Settings-based architecture** with multiple screens
- **Dark theme support**
- **Navigation Compose** for screen navigation

### Getting Started

1. Navigate to the android folder:
   ```bash
   cd android
   ```

2. Build the project:
   ```bash
   ./gradlew build
   ```

3. Open in Android Studio:
   ```bash
   # Open Android Studio and import the android folder
   ```

For detailed information about the Android app, see [android/README.md](android/README.md).

## Other Projects

- **backend/**: Backend services and API
- **frontend/**: Web frontend application

Each project has its own documentation and build instructions.