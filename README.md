# SmartINvest

**AI-Powered Investment Advisor for Everyone**

SmartINvest is an intelligent financial intermediary that connects users with personalized investment advice through **Uma**, our AI-powered investment advisor.

![SmartINvest](https://img.shields.io/badge/SmartINvest-AI%20Advisor-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF)

## Features

### 🤖 Meet Uma - Your Personal AI Investment Advisor

- **Interactive Chatbot**: Powered by Google Gemini 2.0 Flash AI (free tier)
- **Personalized Experience**: Uma addresses you by your name
- **Real-time Recommendations**: Get instant answers to investment questions
- **Context-Aware**: Maintains conversation history for relevant follow-ups

### 📊 Risk Profile Assessment

- Quick 4-question quiz to determine your investor profile
- Classifies users as: Conservative, Moderate, or Growth-Oriented
- Uma tailors all advice based on your risk profile

### 💡 Smart Features

- User name personalization - Uma remembers you
- Chat history saved locally
- Investment recommendations with risk levels
- Educational content library
- Modern, responsive web interface

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one free here](https://ai.google.dev/))

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Gemini API key to .env
# VITE_GEMINI_API_KEY=your_actual_key_here

# Start development server
npm run dev
```

That's it! The app will open at `http://localhost:3000`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Google Generative AI** - Powers Uma's intelligence
- **CSS Variables** - Theming

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── Layout.tsx   # Main layout with navigation
│   └── Layout.css
├── contexts/        # React Context providers
│   └── UserContext.tsx  # User state (name, risk profile)
├── pages/           # Page components
│   ├── Home.tsx     # Home dashboard
│   ├── Chat.tsx     # Uma chat interface
│   ├── Quiz.tsx     # Risk assessment quiz
│   └── Explore.tsx  # Explore investments
├── services/        # Business logic & API
│   └── uma.ts       # Google Gemini AI integration
├── constants/       # App constants
│   ├── theme.ts     # Colors, styling
│   ├── uma.ts       # Uma's personality & prompts
│   └── investment.ts # Investment types & risk profiles
└── utils/           # Utility functions
```

## Key Features

### Uma AI Integration

Uma uses Google Gemini 2.0 Flash (free tier) to provide:
- Personalized investment advice
- Risk-aware recommendations
- Educational content (not financial advice)
- Natural, conversational interface

### User Name Personalization

1. First visit → Enter your name
2. Name saved to localStorage
3. Uma greets you personally in all conversations

### Risk Profile Assessment

Quick 4-question quiz determines if you're:
- **Conservative**: Prioritizes capital preservation
- **Moderate**: Balances growth and stability
- **Growth-Oriented**: Seeks maximum long-term returns

## Environment Variables

Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Get your free API key**: https://ai.google.dev/

## Usage

1. **Visit Home** - See personalized greeting and features
2. **Take the Quiz** - Discover your risk profile
3. **Chat with Uma** - Get personalized investment advice
4. **Explore** - Learn about investment options

## Customization

### Change Uma's Personality

Edit `src/constants/uma.ts`:

```typescript
export const UMA_SYSTEM_PROMPT = `You are Uma...`;
```

### Change Theme Colors

Edit `src/index.css` CSS variables:

```css
:root {
  --primary: #4F46E5;
  --secondary: #10B981;
  /* ... */
}
```

### Add Quiz Questions

Edit `src/pages/Quiz.tsx`:

```typescript
const questions = [
  {
    id: 1,
    question: "Your question?",
    options: ["A", "B", "C", "D"],
  },
  // Add more...
];
```

## FAQ

**Q: Is this free?**
A: Yes! Google Gemini 2.0 Flash has a generous free tier.

**Q: Is my data secure?**
A: All data is stored locally in your browser. Nothing is sent to servers except chat messages to Gemini AI.

**Q: Can I use this as financial advice?**
A: No. Uma provides educational information only. Always consult a licensed financial advisor.

**Q: How do I change my name?**
A: Clear your browser localStorage or add a "Change Name" button.

## License

MIT

## Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Google Generative AI](https://ai.google.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

**SmartINvest** - Making smart investment decisions accessible to everyone through Uma! 🚀
