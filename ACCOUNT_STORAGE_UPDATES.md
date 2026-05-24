# Account Storage Updates - Backend Enhancement

## Overview
The backend has been enhanced to store comprehensive account and user profile data. This includes profile information, user preferences, account status, and activity tracking.

## User Model Schema

### Basic Authentication
- `email` (String, required, unique): User's email address
- `password` (String, required): Hashed password
- `lastLogin` (Date, optional): Timestamp of last login

### Profile Information
- `firstName` (String, optional): User's first name
- `lastName` (String, optional): User's last name
- `phone` (String, optional): User's phone number
- `bio` (String, optional): User's bio/description
- `profilePicture` (String, optional): URL to profile picture

### User Preferences
- `theme` (String, enum: "light" | "dark", default: "dark"): UI theme preference
- `language` (String, default: "en"): Preferred language
- `notificationsEnabled` (Boolean, default: true): Notification preference

### Account Status
- `isActive` (Boolean, default: true): Account active status
- `isVerified` (Boolean, default: false): Email verification status
- `verificationToken` (String, optional): Email verification token
- `verificationTokenExpiry` (Date, optional): Verification token expiry time

### Security & Recovery
- `resetToken` (String, optional): Password reset token
- `resetTokenExpiry` (Date, optional): Reset token expiry time

### Activity Tracking
- `activityHistory` (Array of Strings): History of user activities
- `timestamps`: `createdAt` and `updatedAt` are automatically managed by Mongoose

## New API Endpoints

### Authentication Endpoints

#### 1. Register (Existing - Enhanced)
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  },
  "token": "jwt_token"
}
```

#### 2. Login (Existing - Enhanced)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "profilePicture": "url_to_picture"
  },
  "token": "jwt_token"
}
```

#### 3. Get Current User Profile
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Software developer",
    "profilePicture": "url_to_picture",
    "theme": "dark",
    "language": "en",
    "notificationsEnabled": true,
    "isVerified": false,
    "isActive": true,
    "lastLogin": "2024-05-24T03:40:03.734Z",
    "createdAt": "2024-05-23T10:00:00.000Z",
    "updatedAt": "2024-05-24T03:40:03.734Z"
  }
}
```

#### 4. Update User Profile
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Updated bio",
    "profilePicture": "url_to_picture"
  }
}
```

#### 5. Update User Preferences
**PUT** `/api/auth/preferences`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "theme": "light",
  "language": "es",
  "notificationsEnabled": false
}
```

**Response:**
```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "theme": "light",
    "language": "es",
    "notificationsEnabled": false
  }
}
```

#### 6. Get Public User Profile
**GET** `/api/auth/profile/:userId`

**Response:**
```json
{
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "url_to_picture",
    "bio": "Software developer",
    "email": "user@example.com",
    "joinedDate": "2024-05-23T10:00:00.000Z"
  }
}
```

### Existing Endpoints (Still Available)
- **POST** `/api/auth/forgot-password` - Request password reset
- **POST** `/api/auth/reset-password` - Reset password with token

## Implementation Details

### Database Changes
- MongoDB User collection now includes all new fields
- Existing indexes on `email` field maintained
- Timestamps automatically managed by Mongoose

### Security Considerations
- Passwords are never returned in API responses
- Reset tokens and verification tokens are not exposed
- Protected endpoints require valid JWT token
- Email addresses are stored in lowercase

### Backward Compatibility
- Existing login/register endpoints still work
- Additional fields are optional (provided defaults)
- Old user documents without new fields will get defaults

## Frontend Integration

### Authentication Store Update
Update the `useAuthStore` to store additional user data:

```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
}
```

### API Usage Examples

**Get current user profile:**
```typescript
const token = localStorage.getItem('token');
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Update profile:**
```typescript
const token = localStorage.getItem('token');
const response = await fetch('/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Updated bio'
  })
});
```

## Future Enhancements
- Email verification system
- Profile picture upload functionality
- User activity logging
- Account deactivation/deletion
- Two-factor authentication
- OAuth integration