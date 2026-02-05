# SmartINvest - Complete Implementation Guide

This guide will help you implement the complete SmartINvest project with Uma AI integration.

## Project Structure Overview

```
SmartINvest/
├── app/                          # Expo Router screens
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx         # Tab configuration
│   │   ├── index.tsx           # Home dashboard
│   │   ├── uma.tsx             # Uma chat screen
│   │   ├── quiz.tsx            # Risk assessment quiz
│   │   └── explore.tsx         # Explore investments
│   └── _layout.tsx             # Root layout with providers
├── components/                   # Reusable components
│   ├── chat/                   # Chat components
│   │   ├── ChatScreen.tsx      # Main chat interface
│   │   ├── MessageBubble.tsx   # Message display
│   │   ├── NameInputModal.tsx  # Name input modal
│   │   └── SuggestedQuestions.tsx
│   └── index.ts                # Component exports
├── contexts/                     # React Context providers
│   └── UserContext.tsx         # User state (name, risk profile)
├── services/                     # Business logic & API calls
│   ├── uma.ts                  # Uma AI integration
│   └── index.ts                # Service exports
├── constants/                    # App constants
│   ├── uma.ts                  # Uma's personality & prompts
│   ├── theme.ts                # Colors, typography
│   └── investment.ts           # Investment types & logic
├── utils/                        # Utilities
│   └── storage.ts              # Local storage helpers
├── hooks/                        # Custom hooks
│   └── index.ts                # Hook exports
├── assets/                       # Static assets
│   └── index.ts                # Asset exports
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── app.json                    # Expo config
├── babel.config.js             # Babel config
├── metro.config.js             # Metro bundler config
├── jest.config.js              # Jest testing config
├── .eslintrc.json              # ESLint config
├── .prettierrc.js              # Prettier config
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
└── README.md                   # Documentation
```

## Implementation Steps

### Step 1: Initialize Project (If starting from scratch)

```bash
# Create new Expo project
npx create-expo-app SmartINvest --template blank-typescript

cd SmartINvest

# Install dependencies
npm install expo-router expo-secure-store
npm install @google/generative-ai
npm install @react-native-async-storage/async-storage
```

### Step 2: Create Configuration Files

All configuration files have been created:
- ✅ `package.json` - Dependencies and scripts
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `app.json` - Expo configuration
- ✅ `babel.config.js` - Babel with path aliases
- ✅ `metro.config.js` - Metro bundler config
- ✅ `jest.config.js` - Testing configuration
- ✅ `.eslintrc.json` - ESLint rules
- ✅ `.prettierrc.js` - Code formatting
- ✅ `.gitignore` - Git ignore rules

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Get your free API key from:** https://ai.google.dev/

### Step 4: Core Implementation Files

#### Constants (constants/)

All constant files created:
- ✅ `constants/uma.ts` - Uma's personality and system prompt
- ✅ `constants/theme.ts` - Color scheme, typography, spacing
- ✅ `constants/investment.ts` - Investment types and risk profiles

#### Contexts (contexts/)

- ✅ `contexts/UserContext.tsx` - Manages user name and risk profile

#### Services (services/)

- ✅ `services/uma.ts` - Google Gemini AI integration
  - `chatWithUma()` - Send message, get response
  - `chatWithUmaStream()` - Streaming response for real-time effect
  - `getUmaWelcomeMessage()` - Generate welcome message
  - `validateUmaConfiguration()` - Check API key

#### Utilities (utils/)

- ✅ `utils/storage.ts` - AsyncStorage helpers for chat history, quiz progress

#### Components (components/chat/)

- ✅ `components/chat/ChatScreen.tsx` - Main chat interface
- ✅ `components/chat/MessageBubble.tsx` - Individual message component
- ✅ `components/chat/NameInputModal.tsx` - Modal for user name input
- ✅ `components/chat/SuggestedQuestions.tsx` - Quick question prompts

#### Screens (app/)

- ✅ `app/_layout.tsx` - Root layout with UserProvider
- ✅ `app/(tabs)/_layout.tsx` - Bottom tab navigation
- ✅ `app/(tabs)/index.tsx` - Home dashboard
- ✅ `app/(tabs)/uma.tsx` - Uma chat screen wrapper
- ✅ `app/(tabs)/quiz.tsx` - Risk assessment quiz
- ✅ `app/(tabs)/explore.tsx` - Explore investments and education

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Run Development Server

```bash
npm start
```

Then:
- Press `w` for web browser
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)

## Key Features Explained

### 1. Uma AI - Personalized Investment Advisor

**Location:** `services/uma.ts`, `constants/uma.ts`

Uma uses Google Gemini 2.0 Flash (free tier) to provide:
- Personalized conversations (addresses user by name)
- Risk-aware investment advice
- Educational content (not financial advice)
- Context-aware responses (remembers conversation history)

**Key Functions:**
```typescript
// Send message and get response
const response = await chatWithUma(
  userMessage,
  userName,
  conversationHistory,
  riskProfile
);

// Stream response for real-time effect
for await (const chunk of chatWithUmaStream(...)) {
  // Display chunk as it arrives
}
```

### 2. User Name Personalization

**Location:** `components/chat/NameInputModal.tsx`, `contexts/UserContext.tsx`

Flow:
1. First app launch → Shows name input modal
2. User enters name → Stored securely with Expo SecureStore
3. Uma uses name in all conversations
4. Name persists across app sessions

### 3. Risk Profile Assessment

**Location:** `app/(tabs)/quiz.tsx`

Features:
- 4-question quiz (expandable to 15-20)
- Classifies users: Conservative, Moderate, Growth-Oriented
- Results stored securely
- Uma tailors advice based on profile

### 4. Chat History Management

**Location:** `utils/storage.ts`

Features:
- Chat history saved locally (last 50 messages)
- Provides context for Uma's responses
- Survives app restarts
- Privacy-focused (stored locally only)

### 5. Investment Recommendations

**Location:** `constants/investment.ts`, `app/(tabs)/explore.tsx`

Features:
- Investment types with risk levels
- Match score system (0-100%)
- Personalized based on risk profile
- Educational content library

## Customization Guide

### Change Uma's Personality

Edit `constants/uma.ts`:

```typescript
export const UMA_SYSTEM_PROMPT = `You are Uma...`;

export const UMA_WELCOME_MESSAGES = [
  "Hi {name}! I'm Uma...",
  // Add more variations
];
```

### Add More Quiz Questions

Edit `app/(tabs)/quiz.tsx`:

```typescript
const questions = [
  {
    id: 1,
    question: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
  // Add more questions
];
```

### Add Investment Types

Edit `constants/investment.ts`:

```typescript
export const INVESTMENT_TYPES: InvestmentType[] = [
  {
    id: 'your-investment',
    name: 'Your Investment',
    description: 'Description',
    minAmount: 1000,
    riskLevel: 5,
    expectedReturn: '10-15%',
    liquidity: 'High',
    suitable_profiles: ['moderate', 'growth'],
  },
  // Add more investments
];
```

### Change Theme Colors

Edit `constants/theme.ts`:

```typescript
export const Colors = {
  primary: '#4F46E5',    // Main brand color
  secondary: '#10B981',  // Accent color
  // Change other colors...
};
```

## Troubleshooting

### "GEMINI_API_KEY not found"
- Ensure `.env` file exists in project root
- Restart dev server after creating `.env`
- Check for typos in variable name

### "Module not found" errors
```bash
npm install
npm start -- --reset-cache
```

### Type errors
```bash
npm run type-check
```

### Metro bundler issues
```bash
npx expo start -- --clear
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Building for Production

### iOS
```bash
npm install -g eas-cli
eas build --platform ios
eas submit --platform ios
```

### Android
```bash
eas build --platform android
eas submit --platform android
```

### Web
```bash
npm run web
# Production build in expo/web-build/
```

## Next Steps

1. **Add Icons**: Replace emoji icons with @expo/vector-icons
2. **Add Screenshots**: Add to README.md
3. **Add Tests**: Write unit and integration tests
4. **Add Animations**: Use react-native-reanimated
5. **Add More Quiz Questions**: Expand from 4 to 15-20
6. **Add Voice Chat**: Implement speech recognition
7. **Add Dark Mode**: Theme switching support

## Support

For issues or questions:
- Check [README.md](README.md) for detailed documentation
- Review [Expo Router docs](https://docs.expo.dev/router/)
- Check [Google Generative AI docs](https://ai.google.dev/gemini-api/docs)

---

**SmartINvest** - Making smart investment decisions accessible to everyone through Uma! 🚀
