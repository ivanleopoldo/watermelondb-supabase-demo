# WatermelonDB + Supabase Demo

A React Native demo application showcasing offline-first architecture using WatermelonDB for local data storage and Supabase for real-time synchronization.

## Features

- **Offline-First**: Works seamlessly offline with local WatermelonDB storage
- **Real-Time Sync**: Automatic synchronization with Supabase when online
- **Authentication**: User authentication via Supabase Auth
- **Reactive UI**: Real-time UI updates using WatermelonDB's reactive queries
- **Cross-Platform**: Built with Expo for iOS, Android, and Web

## Tech Stack

- **Frontend**: React Native with Expo
- **UI Framework**: Tamagui
- **Local Database**: WatermelonDB
- **Backend**: Supabase
- **Navigation**: Expo Router
- **State Management**: Zustand

## Prerequisites

- Node.js (v18 or later)
- pnpm
- Expo CLI
- Supabase account and project

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd watermelondb-supabase-demo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Supabase**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)

   b. Copy your project URL and anon key from the Supabase dashboard

   c. Create environment variables:

   ```bash
   # Create a .env file in the root directory
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database schema**

   The app uses a custom RPC function for sync. You'll need to set up the following in your Supabase project:
   - Create a `todos` table with the appropriate schema
   - Set up the `pull` and `push` RPC functions for WatermelonDB sync

   Refer to the WatermelonDB Supabase sync documentation for the exact schema and functions needed.

5. **Start the development server**
   ```bash
   pnpm start
   ```

## Running the App

### Development

```bash
# Start Expo development server
pnpm start

# Run on specific platform
pnpm ios      # iOS simulator
pnpm android  # Android emulator
pnpm web      # Web browser
```

### Production Build

```bash
# Build for iOS development
pnpm build:ios-dev

# For other platforms, use EAS Build
npx eas build --platform ios
npx eas build --platform android
```

## Project Structure

```
src/
├── app/                 # Expo Router pages
│   ├── _layout.tsx     # Root layout
│   ├── index.tsx       # Main todo list page
│   ├── auth.tsx        # Authentication page
│   └── settings.tsx    # Settings page
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useSync.ts      # Synchronization hook
├── lib/                # Core utilities
│   ├── db.ts          # WatermelonDB setup
│   ├── schema.ts      # Database schema
│   ├── supabase.ts    # Supabase client
│   └── sync.ts        # Sync logic
├── models/             # WatermelonDB models
│   └── Todo.ts        # Todo model
└── providers/         # React context providers
    ├── AuthProvider.tsx
    └── SyncProvider.tsx
```

## How It Works

1. **Local Storage**: Todos are stored locally in WatermelonDB, providing instant access and offline functionality

2. **Authentication**: Users authenticate via Supabase Auth, with user-specific data isolation

3. **Synchronization**: The app uses WatermelonDB's sync engine to:
   - Pull changes from Supabase when online
   - Push local changes to Supabase
   - Handle conflicts and merge changes

4. **Reactive UI**: The UI automatically updates when data changes, thanks to WatermelonDB's observable queries

## Key Concepts

- **Offline-First**: The app works completely offline, with sync happening in the background
- **Optimistic Updates**: UI updates immediately when actions are performed, even before sync
- **Conflict Resolution**: WatermelonDB handles data conflicts automatically
- **Real-Time**: Changes sync across devices in real-time via Supabase

## Development Notes

- The app uses Expo's new architecture for better performance
- WatermelonDB provides type-safe database operations
- Tamagui offers cross-platform UI components with great performance
- The sync implementation uses custom RPC functions for flexibility

## TODO

- **Enhance SyncProvider** (`src/providers/SyncProvider.tsx:17`): Improve the synchronization logic and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially sync functionality)
5. Submit a pull request

## License

MIT License - see LICENSE file for details
