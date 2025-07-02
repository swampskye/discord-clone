# MyDiscord API Documentation

## Overview

MyDiscord is a Discord-like real-time communication application built with React/TypeScript frontend and Node.js/Express backend. It supports text messaging, voice chat, server management, and user authentication.

## Architecture

- **Frontend**: React 19, TypeScript, Vite, Socket.IO Client
- **Backend**: Node.js, Express, MongoDB, Socket.IO, WebRTC
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.IO for messaging and WebRTC for voice chat

---

## Backend API Documentation

### Base URL
```
http://localhost:5555/api
```

### Authentication

All authenticated endpoints require a valid JWT token in cookies.

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```

**Response:**
```json
{
  "message": "用户注册成功"
}
```

**Example:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "securepassword123"
  })
});
```

#### POST /api/auth/login
Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "登录成功",
  "token": "string",
  "refreshToken": "string",
  "user": {
    "username": "string",
    "email": "string"
  }
}
```

**Example:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: "john@example.com",
    password: "securepassword123"
  })
});
```

#### GET /api/auth/me
Get current user information.

**Headers:** Requires authentication

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "avatarUrl": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

#### POST /api/auth/logout
Logout user and clear tokens.

**Response:**
```json
{
  "message": "已登出"
}
```

### Server Management

#### POST /api/server/createServer
Create a new server.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "message": "服务器创建成功",
  "server": {
    "_id": "string",
    "name": "string",
    "avatarUrl": "string",
    "owner": "string",
    "members": ["string"],
    "createdAt": "date"
  }
}
```

**Example:**
```javascript
const response = await request.post('/server/createServer', {
  name: "My Gaming Server"
});
```

#### GET /api/server/servers
Get all servers for current user.

**Headers:** Requires authentication

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "avatarUrl": "string",
    "owner": "string",
    "members": [
      {
        "_id": "string",
        "username": "string",
        "email": "string"
      }
    ],
    "createdAt": "date"
  }
]
```

#### GET /api/server/:serverId/users
Get all members of a specific server.

**Headers:** Requires authentication

**Parameters:**
- `serverId`: Server ID

**Response:**
```json
{
  "users": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "avatarUrl": "string"
    }
  ]
}
```

#### POST /api/server/:serverId/generate-invite
Generate invite code for server.

**Parameters:**
- `serverId`: Server ID

**Response:**
```json
{
  "inviteCode": "string"
}
```

#### POST /api/server/join/:inviteCode
Join server using invite code.

**Parameters:**
- `inviteCode`: Invite code

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "加入成功",
  "server": {
    "_id": "string",
    "name": "string",
    "members": ["string"]
  }
}
```

### Channel Management

#### POST /api/server/:serverId/createChannel
Create a new channel in server.

**Headers:** Requires authentication

**Parameters:**
- `serverId`: Server ID

**Request Body:**
```json
{
  "name": "string",
  "type": "text" | "voice",
  "userId": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "type": "string",
  "server": "string",
  "participants": [],
  "createdAt": "date"
}
```

**Example:**
```javascript
const response = await request.post(`/server/${serverId}/createChannel`, {
  name: "general",
  type: "text",
  userId: currentUserId
});
```

#### GET /api/server/:serverId/channels
Get all channels for a server.

**Headers:** Requires authentication

**Parameters:**
- `serverId`: Server ID

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "type": "text" | "voice",
    "server": "string",
    "participants": ["string"],
    "createdAt": "date"
  }
]
```

#### GET /api/server/channel/:channelId
Get specific channel information.

**Headers:** Requires authentication

**Parameters:**
- `channelId`: Channel ID

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "type": "text" | "voice",
  "server": "string",
  "participants": ["string"]
}
```

### Voice Channel Management

#### POST /api/server/:channelId/voice/join
Join a voice channel.

**Headers:** Requires authentication

**Parameters:**
- `channelId`: Voice channel ID

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "加入语音频道成功",
  "participants": ["string"]
}
```

#### POST /api/server/:channelId/voice/leave
Leave a voice channel.

**Headers:** Requires authentication

**Parameters:**
- `channelId`: Voice channel ID

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "离开语音频道成功",
  "participants": ["string"]
}
```

#### GET /api/server/:channelId/voice/participants
Get participants in voice channel.

**Parameters:**
- `channelId`: Voice channel ID

**Response:**
```json
{
  "participants": [
    {
      "_id": "string",
      "username": "string",
      "email": "string"
    }
  ]
}
```

### Message Management

#### GET /api/channel/:channelId/messages
Get messages for a channel.

**Headers:** Requires authentication

**Parameters:**
- `channelId`: Channel ID

**Response:**
```json
[
  {
    "_id": "string",
    "content": "string",
    "sender": {
      "_id": "string",
      "username": "string"
    },
    "channel": "string",
    "createdAt": "date"
  }
]
```

#### POST /api/channel/:channelId/sendMessage
Send a message to channel.

**Headers:** Requires authentication

**Parameters:**
- `channelId`: Channel ID

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "content": "string",
  "sender": {
    "_id": "string",
    "username": "string"
  },
  "channel": "string",
  "createdAt": "date"
}
```

---

## Socket.IO Events

### Text Chat Namespace (`/text`)

#### Client to Server Events

**joinChannel**
Join a text channel for real-time messaging.
```javascript
socket.emit('joinChannel', channelId);
```

#### Server to Client Events

**newMessage**
Receives new messages in joined channels.
```javascript
socket.on('newMessage', (message) => {
  // Handle new message
  console.log('New message:', message);
});
```

### Voice Chat Namespace (`/voice`)

#### Client to Server Events

**join room**
Join a voice channel.
```javascript
socket.emit('join room', channelId);
```

**offer**
Send WebRTC offer for voice connection.
```javascript
socket.emit('offer', {
  userToSignal: targetUserId,
  signal: offer,
  callerID: socket.id
});
```

**answer**
Send WebRTC answer for voice connection.
```javascript
socket.emit('answer', {
  signal: answer,
  callerID: callerUserId
});
```

#### Server to Client Events

**all users**
Receive list of users in voice channel.
```javascript
socket.on('all users', (users) => {
  // Handle users list
  console.log('Users in channel:', users);
});
```

**user joined**
Notification when user joins voice channel.
```javascript
socket.on('user joined', ({ signal, callerID }) => {
  // Handle new user joining
});
```

**receiving returned signal**
Receive WebRTC answer signal.
```javascript
socket.on('receiving returned signal', ({ signal, id }) => {
  // Handle WebRTC answer
});
```

**user left**
Notification when user leaves voice channel.
```javascript
socket.on('user left', (userId) => {
  // Handle user leaving
});
```

**room full**
Notification when voice channel is full.
```javascript
socket.on('room full', () => {
  // Handle room full error
});
```

---

## Frontend Components Documentation

### Core Application Components

#### App.tsx
Main application component that sets up routing.

**Props:** None

**Usage:**
```tsx
import App from './App';
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <App />
</BrowserRouter>
```

#### routes.tsx
Application routing configuration.

**Routes:**
- `/` - Sign in/up page
- `/join/:inviteCode` - Join server via invite
- `/home` - Main application layout
  - `/home/server/:serverId` - Server view
    - `/home/server/:serverId/channel/:channelId` - Channel view
    - `/home/server/:serverId/createChannel` - Create channel
  - `/home/createServer` - Create server

### Authentication Components

#### Login.tsx
User login form component.

**Props:** None

**State:**
- `email`: string
- `password`: string
- `loading`: boolean

**Usage:**
```tsx
import Login from './Components/Login';

<Login />
```

**Example:**
```tsx
// Login form with email and password inputs
// Handles form submission and authentication
// Redirects to /home on success
```

#### Register.tsx
User registration form component.

**Props:** None

**State:**
- `username`: string
- `email`: string
- `password`: string
- `confirmPassword`: string

**Usage:**
```tsx
import Register from './Components/Register';

<Register />
```

### Server Management Components

#### CreateServer.tsx
Component for creating new servers.

**Props:** None

**State:**
- `serverName`: string
- `loading`: boolean

**Functions:**
- `handleCreateServer()`: Creates new server
- `handleCancel()`: Cancels server creation

**Usage:**
```tsx
import CreateServer from './Components/CreateServer';

<CreateServer />
```

**Example:**
```tsx
// Form with server name input
// Submits to /api/server/createServer
// Redirects to new server on success
```

#### Server.tsx
Main server view component showing channels and members.

**Props:** 
- Receives `serverId` from URL params

**State:**
- `channels`: Channel[]
- `members`: User[]
- `loading`: boolean

**Functions:**
- `fetchChannels()`: Loads server channels
- `fetchMembers()`: Loads server members
- `generateInvite()`: Creates invite link

**Usage:**
```tsx
import Server from './Components/Server';

<Route path="server/:serverId" element={<Server />} />
```

#### Join.tsx
Component for joining servers via invite code.

**Props:**
- `inviteCode`: string (from URL params)

**Functions:**
- `joinServer()`: Joins server using invite code

**Usage:**
```tsx
import Join from './Components/Join';

<Route path="join/:inviteCode" element={<Join />} />
```

### Channel Components

#### CreateChannel.tsx
Component for creating new channels.

**Props:** None

**State:**
- `channelName`: string
- `channelType`: 'text' | 'voice'

**Functions:**
- `handleCreateChannel()`: Creates new channel
- `validateChannelName()`: Validates channel name

**Usage:**
```tsx
import CreateChannel from './Components/CreateChannel';

<CreateChannel />
```

**Example:**
```tsx
// Form with channel name and type selection
// Validates unique channel names within server
// Creates channel via API
```

#### Room.tsx
Main channel view for text and voice communication.

**Props:**
- `channelId`: string (from URL params)

**State:**
- `messages`: Message[]
- `channel`: Channel
- `connected`: boolean

**Functions:**
- `loadMessages()`: Loads channel messages
- `joinChannel()`: Joins channel for real-time updates
- `leaveChannel()`: Leaves channel

**Usage:**
```tsx
import Room from './Components/Room';

<Route path="channel/:channelId" element={<Room />} />
```

### Messaging Components

#### MessageList.tsx
Component displaying list of messages in a channel.

**Props:**
- `messages`: Message[]
- `loading`: boolean

**Functions:**
- `scrollToBottom()`: Scrolls to latest message
- `formatMessage()`: Formats message display

**Usage:**
```tsx
import MessageList from './Components/MessageList';

<MessageList 
  messages={messages}
  loading={loading}
/>
```

**Example:**
```tsx
// Displays messages with sender info and timestamps
// Auto-scrolls to new messages
// Supports infinite scroll for message history
```

#### SendMessage.tsx
Component for sending messages.

**Props:**
- `channelId`: string
- `onMessageSent`: (message: Message) => void

**State:**
- `messageContent`: string
- `sending`: boolean

**Functions:**
- `sendMessage()`: Sends message to channel
- `handleKeyPress()`: Handles Enter key submission

**Usage:**
```tsx
import SendMessage from './Components/SendMessage';

<SendMessage 
  channelId={channelId}
  onMessageSent={handleNewMessage}
/>
```

### Voice Chat Components

#### VoiceChat.tsx
Complex component handling WebRTC voice communication.

**Props:**
- `channelId`: string
- `userId`: string

**State:**
- `peers`: Peer[]
- `userVideo`: MediaStream
- `peersRef`: Array<{peerID: string, peer: SimplePeer.Instance}>
- `connected`: boolean

**Functions:**
- `joinVoiceChannel()`: Joins voice channel
- `leaveVoiceChannel()`: Leaves voice channel
- `createPeer()`: Creates WebRTC peer connection
- `addPeer()`: Adds new peer to call
- `handleUserJoined()`: Handles new user joining
- `handleUserLeft()`: Handles user leaving

**Usage:**
```tsx
import VoiceChat from './Components/VoiceChat';

<VoiceChat 
  channelId={channelId}
  userId={currentUserId}
/>
```

**Example:**
```tsx
// Manages WebRTC connections for voice chat
// Displays video/audio controls
// Handles peer-to-peer connections
// Supports up to 10 users per channel
```

### Layout Components

#### Layout.tsx
Main application layout with sidebar and content area.

**Props:** None

**State:**
- `servers`: Server[]
- `currentUser`: User
- `sidebarCollapsed`: boolean

**Functions:**
- `loadUserServers()`: Loads user's servers
- `toggleSidebar()`: Toggles sidebar visibility
- `handleServerSelect()`: Handles server selection

**Usage:**
```tsx
import Layout from './Views/Layout';

<Route path="/home" element={<Layout />}>
  {/* Child routes */}
</Route>
```

#### Welcome.tsx
Welcome page component shown when no server is selected.

**Props:** None

**Usage:**
```tsx
import Welcome from './Components/Welcome';

<Welcome />
```

### Utility Components

#### NotFound.tsx
404 error page component.

**Props:** None

**Usage:**
```tsx
import NotFound from './Components/NotFound';

<Route path="*" element={<NotFound />} />
```

---

## Utility Functions

### request.ts
Axios instance for API requests with automatic token refresh.

**Configuration:**
- Base URL from environment variables
- Automatic cookie handling
- Token refresh on 401 errors

**Usage:**
```typescript
import request from './utils/request';

// GET request
const response = await request.get('/auth/me');

// POST request
const response = await request.post('/server/createServer', {
  name: 'My Server'
});
```

**Features:**
- Automatic JWT token refresh
- Cookie-based authentication
- Error handling and redirects
- CORS support

---

## Data Models

### User Model
```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  refreshToken?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Server Model
```typescript
interface Server {
  _id: string;
  name: string;
  owner: string; // User ID
  avatar?: string;
  members: string[]; // User IDs
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Channel Model
```typescript
interface Channel {
  _id: string;
  name: string;
  type: 'text' | 'voice';
  server: string; // Server ID
  participants: string[]; // User IDs (for voice channels)
  createdAt: Date;
  updatedAt: Date;
}
```

### Message Model
```typescript
interface Message {
  _id: string;
  channel: string; // Channel ID
  sender: string; // User ID
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Environment Configuration

### Backend (.env)
```bash
# Database
MONGO_URI=mongodb://localhost:27017/mydiscord

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Server Port
PORT=5555
```

### Frontend (.env)
```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:5555/api
```

---

## Getting Started

### Backend Setup
```bash
cd Backend
npm install
npm start
```

### Frontend Setup
```bash
cd MyDiscord
npm install
npm run dev
```

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- Modern web browser with WebRTC support

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "message": "Invalid input data"
}
```

**401 Unauthorized**
```json
{
  "message": "未授权访问"
}
```

**403 Forbidden**
```json
{
  "message": "权限不足"
}
```

**404 Not Found**
```json
{
  "message": "资源未找到"
}
```

**500 Internal Server Error**
```json
{
  "message": "服务器错误"
}
```

### Client-Side Error Handling

The frontend automatically handles:
- Token refresh on 401 errors
- Redirect to login on authentication failure
- Socket connection management
- WebRTC connection errors

---

## Security Features

- JWT-based authentication with refresh tokens
- Secure HTTP-only cookies
- CORS protection
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (recommended for production)

---

## Performance Considerations

- Message pagination for large channels
- Efficient user presence management
- WebRTC optimization for voice quality
- Database indexing for fast queries
- Connection pooling for Socket.IO

---

This documentation covers all major APIs, components, and functionality of the MyDiscord application. For specific implementation details, refer to the source code in each component file.