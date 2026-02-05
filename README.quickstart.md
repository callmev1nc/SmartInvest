# Quick Start Guide - SmartINvest

## Overview
This guide will help you get SmartINvest running on your local machine in minutes.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key ([Get one free here](https://ai.google.dev/))

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start Development Server
```bash
npm start
```

### 4. Run on Your Preferred Platform
Once the Expo Dev Tools open:
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator (macOS only)
- Press **`w`** for web browser

## What's Included

### 🤖 Uma - Your AI Investment Advisor
- Personalized conversations based on your name
- Risk-aware investment recommendations
- Educational content suggestions

### 📊 Risk Assessment Quiz
- 4-question assessment to determine your investor profile
- Profiles: Conservative, Moderate, or Growth-Oriented

### 🎯 Personalized Recommendations
- Investment options matched to your risk profile
- Match score system showing compatibility percentage

### 📚 Educational Content
- Investment basics and concepts
- Key terms glossary
- Tips for savings

## File Structure Highlights

```
SmartINvest/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── uma.tsx        # Uma chat screen
│   │   ├── quiz.tsx       # Risk assessment
│   │   └── explore.tsx    # Explore investments
├── components/chat/       # Chat components
│   ├── ChatScreen.tsx     # Main chat interface
│   ├── NameInputModal.tsx # User name input
│   └── MessageBubble.tsx  # Message component
├── contexts/
│   └── UserContext.tsx    # User name & risk profile state
├── services/
│   └── uma.ts            # Uma AI integration (Gemini)
└── constants/
    ├── uma.ts            # Uma's personality & prompts
    ├── theme.ts          # Colors, typography
    └── investment.ts     # Investment types & logic
```

## Key Features Implementation

### User Name Personalization
When users first open the app, they're prompted to enter their name. This name:
- Is stored securely using Expo SecureStore
- Is used by Uma in all conversations
- Persists across app sessions

### Uma's Personality
Uma's behavior is defined in `constants/uma.ts`:
- Friendly, approachable tone
- Addresses users by name
- Provides educational, not advisory, information
- Includes appropriate disclaimers

### Risk Profile Integration
- Quiz determines user's risk tolerance
- Uma tailors advice based on profile
- Investment recommendations match risk level

## Common Issues

### "GEMINI_API_KEY not found"
- Ensure your `.env` file exists in the project root
- Restart the dev server after creating `.env`
- Verify the API key is correct (no extra spaces)

### Type Errors
```bash
npm install --save-dev @types/react @types/react-native
```

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

## Development

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Next Steps

1. **Customize Uma's Personality**: Edit `constants/uma.ts`
2. **Add More Quiz Questions**: Edit `app/(tabs)/quiz.tsx`
3. **Add Investment Types**: Edit `constants/investment.ts`
4. **Build for Production**: Follow deployment guide in README.md

## Support

- Check the full [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Check [Expo Forums](https://forums.expo.dev/)

---

**Happy Investing with Uma! 🚀**
