## **UniCred Frontend Technical Documentation**

### **Overview**
The UniCred frontend is a React-based application designed to provide an intuitive and responsive user interface for students, recruiters, and universities. It communicates with the backend API to handle user authentication, credential management, and other operations.

---

### **Tech Stack**
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React's `useState` and `useEffect`
- **API Communication**: Fetch API

---

### **Folder Structure**
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components like SignupPage
│   │   ├── recruiter/       # Recruiter-specific components
│   │   ├── student/         # Student-specific components
│   │   ├── university/      # University-specific components
│   ├── lib/                 # API utilities
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── types.ts             # TypeScript types
```

---

### **Key Components**

#### **1. SignupPage**
- **Purpose**: Allows users to register by providing their details.
- **Features**:
  - Form validation.
  - API integration for user registration.
  - Success and error message handling.
- **Code Highlights**:
  - Uses `useState` for form data and message handling.
  - Sends a `POST` request to `/api/signup`.
- **UI Design**:
  - Modern and responsive design using Tailwind CSS.
  - Includes fields for user type, name, email, password, and valid ID.

#### **2. LoginPage**
- **Purpose**: Authenticates users and redirects them to their respective dashboards.
- **Features**:
  - Role-based redirection.
  - JWT token storage in `localStorage`.
- **Code Highlights**:
  - Sends a `POST` request to `/api/auth/login`.
  - Stores the JWT token in `localStorage` for session management.

#### **3. Dashboards**
- **Purpose**: Provides role-specific functionality for students, recruiters, and universities.
- **Features**:
  - **Student Dashboard**: Manage credentials.
  - **Recruiter Dashboard**: Verify credentials.
  - **University Dashboard**: Issue credentials.

#### **4. Shared Components**
- **Layout**: Provides a consistent layout across all pages.
- **Header**: Displays navigation links and user information.
- **Footer**: Contains links to terms, privacy policy, etc.

---

### **API Integration**

#### **Library**: Fetch API
- **Base URL**: Defined in `VITE_API_URL` environment variable.
- **Endpoints**:
  - `/api/signup`: Registers a new user.
  - `/api/auth/login`: Authenticates a user.
  - `/api/credentials`: Manages user credentials.

#### **Example API Call**
```typescript
const handleSignup = async (formData: any) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    console.log('Signup successful');
  } else {
    console.error('Signup failed');
  }
};
```

---

### **Styling**

#### **Tailwind CSS**
- **Utility-First Approach**: Tailwind CSS is used for rapid UI development.
- **Custom Themes**: Tailwind's configuration is customized to match the UniCred branding.
- **Responsive Design**: Ensures the application is mobile-friendly.

#### **Lucide React**
- **Purpose**: Provides modern and customizable icons.
- **Example**:
  ```tsx
  import { UserPlus } from 'lucide-react';

  const IconExample = () => <UserPlus size={24} className="text-blue-500" />;
  ```

---

### **State Management**

#### **React Hooks**
- **useState**: Manages local state for form data, messages, etc.
- **useEffect**: Handles side effects like API calls and event listeners.

#### **Example**
```tsx
const [formData, setFormData] = useState({
  userType: '',
  name: '',
  email: '',
  password: '',
  validId: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
```

---

### **Environment Variables**
- **File**: `.env`
- **Variables**:
  ```env
  VITE_API_URL=http://unicred-portal-api.debarghaya.in
  ```

---

### **Development Commands**
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

### **Testing**

#### **Tools**
- **Jest**: For unit testing.
- **React Testing Library**: For testing React components.

#### **Example Test**
```tsx
import { render, screen } from '@testing-library/react';
import SignupPage from './SignupPage';

test('renders signup form', () => {
  render(<SignupPage />);
  const heading = screen.getByText(/Create Account/i);
  expect(heading).toBeInTheDocument();
});
```

---

### **Deployment**

#### **Hosting**: Cloudflare Pages
- **Build Command**:
  ```bash
  npm run build
  ```
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Set to the backend API URL.

---

### **Security**

#### **Best Practices**
- **Input Validation**: Ensure all form inputs are validated before sending data to the backend.
- **Environment Variables**: Use `.env` files to store sensitive information.
- **HTTPS**: Ensure the frontend communicates with the backend over HTTPS.

Here’s a **detailed backend technical documentation** for the VisionX project, with a strong focus on **blockchain technology**:

---

## **VisionX Backend Technical Documentation**

### **Overview**
The VisionX backend is a Node.js-based API server that handles user authentication, credential management, and blockchain integration. It uses Prisma ORM for database interactions, PostgreSQL as the database, and a custom blockchain implementation for credential anchoring and verification.

---

### **Tech Stack**
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Blockchain**: Custom blockchain for credential verification and anchoring.
- **Authentication**: JWT (JSON Web Tokens)
- **Cryptography**: SHA-256 for hashing

---

### **Folder Structure**
```
backend/
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   ├── migrations/          # Database migrations
├── src/
│   ├── routes/              # API route handlers
│   │   ├── auth.ts          # Authentication routes
│   │   ├── signup.ts        # Signup route
│   │   ├── credentials.ts   # Credential management routes
│   │   ├── blockchain.ts    # Blockchain-related routes
│   ├── services/            # Business logic
│   │   ├── blockchain.service.ts # Blockchain service logic
│   ├── utils/               # Utility functions
│   │   ├── crypto.ts        # Cryptographic utilities
│   │   ├── did.ts           # Decentralized Identifier utilities
│   ├── server.ts            # Entry point
├── .env                     # Environment variables
├── package.json             # Project metadata and dependencies
```

---

### **Key Routes**

#### **1. Signup Route** (`/api/signup`)
- **Purpose**: Registers a new user.
- **Logic**:
  - Validates the request body.
  - Checks if the user already exists.
  - Creates a new user in the database.
- **Code Highlights**:
  ```typescript
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: password, // Note: Hash the password in production
      accessType,
    },
  });
  ```

#### **2. Login Route** (`/api/auth/login`)
- **Purpose**: Authenticates the user and returns a JWT token.
- **Logic**:
  - Fetches the user by email.
  - Compares the hashed password.
  - Generates a JWT token.

#### **3. Credential Management**
- **Purpose**: Handles CRUD operations for credentials.
- **Endpoints**:
  - `GET /api/credentials`: Fetches all credentials.
  - `POST /api/credentials`: Adds a new credential.
  - `PUT /api/credentials/:id`: Updates a credential.
  - `DELETE /api/credentials/:id`: Deletes a credential.

#### **4. Blockchain Route** (`/api/blockchain`)
- **Purpose**: Interacts with the blockchain for credential anchoring and verification.
- **Endpoints**:
  - `POST /api/blockchain/anchor`: Anchors a credential on the blockchain.
  - `GET /api/blockchain/verify/:hash`: Verifies a credential using its blockchain hash.

---

### **Blockchain Integration**

#### **Purpose**
The blockchain component ensures the immutability and verifiability of credentials. It provides a decentralized way to anchor and verify credentials.

#### **Blockchain Workflow**
1. **Credential Anchoring**:
   - A credential is hashed using a cryptographic hash function (SHA-256).
   - The hash is added to the blockchain as a new block.
   - The block contains:
     - Credential hash.
     - Timestamp.
     - Previous block hash.

2. **Credential Verification**:
   - The credential hash is compared with the blockchain data to verify its authenticity.

#### **Blockchain Schema**
- **Block**:
  ```prisma
  model Block {
    id            String   @id @default(cuid())
    height        Int      @unique
    previousHash  String
    payloadHash   String
    nonce         Int
    hash          String   @unique
    createdAt     DateTime @default(now())
  }
  ```

#### **Blockchain Service**
- **File**: `src/services/blockchain.service.ts`
- **Functions**:
  - `createBlock`: Creates a new block and adds it to the blockchain.
  - `verifyBlock`: Verifies a block using its hash.
- **Code Highlights**:
  ```typescript
  export const createBlock = async (payloadHash: string) => {
    const previousBlock = await prisma.block.findFirst({
      orderBy: { height: 'desc' },
    });

    const newBlock = {
      height: (previousBlock?.height || 0) + 1,
      previousHash: previousBlock?.hash || '',
      payloadHash,
      nonce: Math.floor(Math.random() * 1000),
      hash: crypto.createHash('sha256').update(payloadHash).digest('hex'),
    };

    return prisma.block.create({ data: newBlock });
  };
  ```

---

### **Database Schema**

#### **Prisma Schema**
- **User**:
  ```prisma
  model User {
    id          String   @id @default(cuid())
    username    String
    email       String   @unique
    passwordHash String
    accessType  String
    createdAt   DateTime @default(now())
  }
  ```

- **Credential**:
  ```prisma
  model Credential {
    id          String   @id @default(cuid())
    title       String
    type        String
    issuedBy    String
    dateIssued  DateTime
    blockchainHash String @unique
  }
  ```

- **Block**:
  ```prisma
  model Block {
    id            String   @id @default(cuid())
    height        Int      @unique
    previousHash  String
    payloadHash   String
    nonce         Int
    hash          String   @unique
    createdAt     DateTime @default(now())
  }
  ```

---

### **Environment Variables**
- **File**: `.env`
- **Variables**:
  ```env
  PORT=4000
  DATABASE_URL=postgresql://username:password@localhost:5432/visionx
  JWT_SECRET=your_jwt_secret
  ```

---

### **Development Commands**
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Apply Migrations**:
  ```bash
  npx prisma migrate dev
  ```
- **Seed the Database**:
  ```bash
  npx ts-node prisma/seed.ts
  ```

---

### **Authentication**

#### **JWT Authentication**
- **Token Generation**:
  - Tokens are signed using `jsonwebtoken` with a secret key.
  - Example:
    ```typescript
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    ```
- **Token Verification**:
  - Middleware to verify tokens:
    ```typescript
    const authenticate = (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
      }
    };
    ```

---

### **Error Handling**
- **Global Error Handler**:
  - Logs errors and sends a generic response to the client.
  - Example:
    ```typescript
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Internal server error' });
    });
    ```

---

### **Testing**

#### **Tools**
- **Jest**: For unit testing.
- **Supertest**: For API testing.

#### **Example Test**
```typescript
import request from 'supertest';
import app from '../src/server';

test('POST /api/signup - success', async () => {
  const response = await request(app)
    .post('/api/signup')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      accessType: 'student',
    });

  expect(response.status).toBe(201);
  expect(response.body.message).toBe('User registered successfully');
});
```

---

### **Deployment**

#### **Hosting**: Google Cloud Platform (GCP)
- **Backend**: Hosted on a GCP Compute Engine instance.
- **Database**: PostgreSQL instance on GCP.

#### **Deployment Steps**:
1. **Build the Project**:
   ```bash
   npm run build
   ```
2. **Start the Server**:
   ```bash
   npm start
   ```

---

### **Security**

#### **Best Practices**
- **Password Hashing**: Use `bcrypt` to hash passwords before storing them in the database.
- **Environment Variables**: Store sensitive information in `.env` files.
- **Input Validation**: Validate all incoming requests to prevent SQL injection and other attacks.

## **UniCred React Native App Technical Documentation**

### **Overview**
The UniCred React Native app is designed to provide a seamless mobile experience for students, recruiters, and universities. It allows users to manage credentials, verify authenticity, and interact with the platform on the go.

---

### **Tech Stack**
- **Framework**: React Native
- **Language**: TypeScript
- **State Management**: React's `useState` and `useEffect`
- **Navigation**: React Navigation
- **Styling**: Styled Components / Tailwind CSS (via `tailwind-rn`)
- **API Communication**: Fetch API or Axios
- **Icons**: React Native Vector Icons

---

### **Folder Structure**
```
app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Screens for different app views
│   │   ├── SignupScreen.tsx # Signup screen
│   │   ├── LoginScreen.tsx  # Login screen
│   │   ├── Dashboard/       # Dashboards for different roles
│   ├── navigation/          # Navigation configuration
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app entry point
│   ├── types.ts             # TypeScript types
├── assets/                  # Static assets (images, icons, etc.)
├── app.json                 # App configuration
├── package.json             # Project metadata and dependencies
```

---

### **Key Screens**

#### **1. SignupScreen**
- **Purpose**: Allows users to register by providing their details.
- **Features**:
  - Form validation.
  - API integration for user registration.
  - Success and error message handling.
- **Code Highlights**:
  ```tsx
  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert('Signup successful!');
      } else {
        Alert.alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('An error occurred. Please try again later.');
    }
  };
  ```

#### **2. LoginScreen**
- **Purpose**: Authenticates users and redirects them to their respective dashboards.
- **Features**:
  - Role-based redirection.
  - JWT token storage using `AsyncStorage`.
- **Code Highlights**:
  ```tsx
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        await AsyncStorage.setItem('token', token);
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('An error occurred. Please try again later.');
    }
  };
  ```

#### **3. Dashboards**
- **Purpose**: Provides role-specific functionality for students, recruiters, and universities.
- **Features**:
  - **Student Dashboard**: Manage credentials.
  - **Recruiter Dashboard**: Verify credentials.
  - **University Dashboard**: Issue credentials.

---

### **Navigation**

#### **Library**: React Navigation
- **Installation**:
  ```bash
  npm install @react-navigation/native react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
  ```
- **Configuration**:
  ```tsx
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';

  const Stack = createStackNavigator();

  const AppNavigator = () => (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  export default AppNavigator;
  ```

---

### **Styling**

#### **Library**: Styled Components or Tailwind CSS
- **Installation**:
  ```bash
  npm install styled-components
  ```
- **Example**:
  ```tsx
  import styled from 'styled-components/native';

  const Button = styled.TouchableOpacity`
    background-color: #3498db;
    padding: 10px;
    border-radius: 5px;
  `;

  const ButtonText = styled.Text`
    color: white;
    font-size: 16px;
    text-align: center;
  `;
  ```

---

### **API Integration**

#### **Library**: Fetch API or Axios
- **Base URL**: Defined in `API_URL` environment variable.
- **Endpoints**:
  - `/api/signup`: Registers a new user.
  - `/api/auth/login`: Authenticates a user.
  - `/api/credentials`: Manages user credentials.

#### **Example API Call**
```tsx
const handleSignup = async (formData: any) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    console.log('Signup successful');
  } else {
    console.error('Signup failed');
  }
};
```

---

### **Environment Variables**
- **File**: `.env`
- **Variables**:
  ```env
  API_URL=http://localhost:4000/api
  ```

---

### **Development Commands**
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Start Development Server**:
  ```bash
  npm start
  ```
- **Run on Android**:
  ```bash
  npm run android
  ```
- **Run on iOS**:
  ```bash
  npm run ios
  ```

---

### **Testing**

#### **Tools**
- **Jest**: For unit testing.
- **React Native Testing Library**: For testing React Native components.

#### **Example Test**
```tsx
import { render, fireEvent } from '@testing-library/react-native';
import SignupScreen from './SignupScreen';

test('renders signup form', () => {
  const { getByPlaceholderText } = render(<SignupScreen />);
  const nameInput = getByPlaceholderText('Your full name');
  expect(nameInput).toBeTruthy();
});

test('submits form', () => {
  const { getByText, getByPlaceholderText } = render(<SignupScreen />);
  const nameInput = getByPlaceholderText('Your full name');
  const submitButton = getByText('Signup');

  fireEvent.changeText(nameInput, 'John Doe');
  fireEvent.press(submitButton);

  expect(submitButton).toBeTruthy();
});
```

---

### **Deployment**

#### **Android**
- **Build APK**:
  ```bash
  cd android
  ./gradlew assembleRelease
  ```
- **Install APK**:
  ```bash
  adb install app-release.apk
  ```

#### **iOS**
- **Build for iOS**:
  ```bash
  cd ios
  pod install
  xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -sdk iphoneos -configuration AppStoreDistribution archive
  ```

---
## Architechture Map

**blockchain integration**:

---

```
                          VisionX Architecture
                          ====================

+---------------------------------------------------------------+
|                           Frontend                            |
|---------------------------------------------------------------|
| - React (TypeScript)                                          |
| - Tailwind CSS for styling                                    |
| - React Navigation for routing                               |
| - Communicates with Backend via RESTful APIs                 |
+---------------------------------------------------------------+
                                |
                                | HTTP Requests (API Calls)
                                v
+---------------------------------------------------------------+
|                           Backend                             |
|---------------------------------------------------------------|
| - Node.js (TypeScript)                                        |
| - Express.js for API routing                                  |
| - Prisma ORM for database interactions                        |
| - JWT for authentication                                      |
| - Blockchain integration for credential anchoring             |
|---------------------------------------------------------------|
| Key Components:                                               |
| - Authentication Service                                      |
| - Credential Management Service                               |
| - Blockchain Service                                          |
|---------------------------------------------------------------|
| Blockchain Service:                                           |
| - Anchors credential hashes on the blockchain                |
| - Verifies credential authenticity using blockchain hashes    |
+---------------------------------------------------------------+
                                |
                                | Database Queries / Blockchain Operations
                                v
+---------------------------------------------------------------+
|                           Database                            |
|---------------------------------------------------------------|
| - PostgreSQL                                                  |
| - Stores user data, credentials, and blockchain metadata      |
|---------------------------------------------------------------|
| Tables:                                                      |
| - Users: Stores user information                             |
| - Credentials: Stores credential details                     |
| - Blockchain: Stores blockchain blocks                       |
+---------------------------------------------------------------+
                                |
                                | Blockchain Operations
                                v
+---------------------------------------------------------------+
|                          Blockchain                           |
|---------------------------------------------------------------|
| - Custom Blockchain Implementation                            |
| - Ensures immutability and verifiability of credentials       |
|---------------------------------------------------------------|
| Blockchain Workflow:                                         |
| 1. Credential Anchoring:                                     |
|    - Hashes credential data using SHA-256                   |
|    - Creates a new block with:                              |
|      - Credential hash                                      |
|      - Timestamp                                            |
|      - Previous block hash                                  |
| 2. Credential Verification:                                 |
|    - Compares credential hash with blockchain data          |
|    - Verifies authenticity and integrity                   |
+---------------------------------------------------------------+
```

---

### **Explanation of the Architecture**

#### **Frontend**
- **Purpose**: Provides an intuitive user interface for students, recruiters, and universities.
- **Communication**: Sends HTTP requests to the backend for user authentication, credential management, and blockchain operations.

#### **Backend**
- **Purpose**: Acts as the intermediary between the frontend, database, and blockchain.
- **Key Services**:
  - **Authentication Service**: Handles user login and JWT token generation.
  - **Credential Management Service**: Manages CRUD operations for credentials.
  - **Blockchain Service**: Anchors credentials on the blockchain and verifies their authenticity.

#### **Database**
- **Purpose**: Stores user data, credentials, and blockchain metadata.
- **Key Tables**:
  - **Users**: Stores user information (e.g., username, email, hashed password).
  - **Credentials**: Stores credential details (e.g., title, type, issuedBy, blockchainHash).
  - **Blockchain**: Stores blockchain blocks (e.g., block height, hash, previous hash).

#### **Blockchain**
- **Purpose**: Ensures the immutability and verifiability of credentials.
- **Workflow**:
  1. **Credential Anchoring**:
     - A credential is hashed using SHA-256.
     - The hash is added to the blockchain as a new block.
  2. **Credential Verification**:
     - The credential hash is compared with the blockchain data to verify its authenticity.


### **Future Enhancements**
1. **Push Notifications**:
   - Integrate Firebase Cloud Messaging (FCM) for real-time notifications.
2. **Offline Mode**:
   - Enable offline capabilities using `AsyncStorage` or SQLite.
3. **Biometric Authentication**:
   - Add support for Face ID and Touch ID.


