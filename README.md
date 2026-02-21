# 📈 SmartInvest

> An intelligent investment advisor powered by Google Gemini AI, featuring personalized recommendations, risk assessment, and multilingual support.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-3178C6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

### 🤖 AI-Powered Investment Advisor
- **Interactive Chat**: Real-time conversations with Uma, your personal AI investment advisor
- **Personalized Advice**: Recommendations based on your risk profile and financial goals
- **Google Search Integration**: AI has access to current market information
- **Streaming Responses**: Real-time typing effect for better UX

### 📊 Daily Market Updates
- **AI-Generated Insights**: Fresh market analysis every day
- **Multi-Category Coverage**: Stocks, Crypto, Real Estate, International, Alternatives
- **Personalized Opportunities**: Investment recommendations matched to your risk tolerance
- **Smart Caching**: Reduces API calls with intelligent caching

### 🎯 Risk Assessment Quiz
- **Interactive Questionnaire**: 10 questions to determine your risk tolerance
- **Personalized Results**: Get classified as Conservative, Moderate, or Aggressive investor
- **Tailored Advice**: All recommendations match your risk profile

### 🌍 Multi-Language Support
- **English**: Full support
- **中文 (Chinese)**: Complete translation
- **Tiếng Việt (Vietnamese)**: Full translation
- **Auto-Translation**: All UI elements and AI responses translate in real-time

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Professional Design**: Gradient animations, smooth transitions, and modern aesthetics
- **Accessibility**: ARIA labels and keyboard navigation support

### 🔒 Security & Reliability
- **Input Sanitization**: XSS prevention for all user inputs
- **Error Boundaries**: Graceful error handling prevents app crashes
- **Rate Limiting**: Smart API quota management (24 RPM, 240 RPD)
- **Type-Safe**: Full TypeScript coverage with strict mode

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smartinvest.git
   cd smartinvest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

---

## 📖 Usage Guide

### 1. Take the Risk Assessment Quiz
- Go to the **Quiz** page
- Answer 10 questions about your investment preferences
- Receive your personalized risk profile (Conservative/Moderate/Aggressive)

### 2. Chat with Uma (Your AI Advisor)
- Navigate to the **Chat** page
- Enter your name to start
- Ask questions about:
  - Investment strategies
  - Portfolio recommendations
  - Risk management
  - Market analysis
  - Financial planning

### 3. Explore Investment Options
- Visit the **Explore** page
- Browse educational content organized by skill level
- Learn about different investment types
- Access curated videos and articles

### 4. Check Daily Market Updates
- View **AI-powered market analysis** on the home page
- Get personalized investment opportunities
- Stay informed with daily refreshes

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:watch` | Watch mode for tests |

---

## 🏗️ Project Structure

```
SmartInvest/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorBoundary.tsx       # React error boundary
│   │   ├── DailyUpdates.tsx        # Daily market updates
│   │   └── Layout.tsx              # Main layout component
│   ├── pages/               # Page components
│   │   ├── Home.tsx                # Home page
│   │   ├── Chat.tsx                # AI chat interface
│   │   ├── Quiz.tsx                # Risk assessment quiz
│   │   └── Explore.tsx             # Investment exploration
│   ├── contexts/            # React Context providers
│   │   ├── UserContext.tsx         # User data management
│   │   ├── LanguageContext.tsx     # Multi-language support
│   │   └── ThemeContext.tsx        # Dark/light mode
│   ├── services/            # Business logic
│   │   ├── uma.ts                  # Google Gemini AI integration
│   │   ├── dailyUpdates.ts         # Daily market insights
│   │   ├── rateLimiter.ts          # API rate limiting
│   │   └── translation.ts          # Translation service
│   ├── utils/               # Utility functions
│   │   ├── sanitize.ts             # Input sanitization
│   │   └── storage.ts              # LocalStorage helper
│   ├── constants/           # Application constants
│   │   ├── config.ts               # Configuration values
│   │   ├── investment.ts           # Investment types
│   │   ├── uma.ts                  # AI system prompts
│   │   └── theme.ts                # Theme variables
│   ├── types/               # TypeScript type definitions
│   │   └── env.d.ts                 # Environment variable types
│   └── test/                # Test setup
│       └── setup.ts                 # Vitest configuration
├── public/                     # Static assets
├── index.html                  # Entry HTML
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Vitest testing configuration
└── package.json               # Dependencies and scripts
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API Key | Yes |
| `VITE_DEBUG` | Enable debug mode (true/false) | No |

### API Rate Limits

The application includes built-in rate limiting to stay within Google Gemini API quotas:

- **24 RPM** (Requests Per Minute) - Under the 25 RPM limit
- **240 RPD** (Requests Per Day) - Under the 250 RPD limit

---

## 🧪 Testing

We use **Vitest** for unit testing and **React Testing Library** for component testing.

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Files
- `src/services/__tests__/rateLimiter.test.ts` - Rate limiter tests
- More tests coming soon!

---

## 🎨 Customization

### Theming
Edit `src/constants/theme.ts` to customize colors:
```typescript
export const lightTheme = {
  '--primary': '#4F46E5',
  '--background': '#FFFFFF',
  // ... more colors
};
```

### Risk Profiles
Edit `src/constants/investment.ts` to modify risk profiles:
```typescript
export const RISK_PROFILES = {
  conservative: { name: 'Conservative', ... },
  moderate: { name: 'Moderate', ... },
  aggressive: { name: 'Aggressive', ... },
};
```

### AI Personality
Edit `src/constants/uma.ts` to customize Uma's responses:
```typescript
export const UMA_SYSTEM_PROMPT = `
  You are Uma, a personal AI investment advisor...
`;
```

---

## 📦 Technologies Used

### Core
- **React 18.3.1** - UI framework
- **TypeScript 5.4.0** - Type safety
- **Vite 5.2.0** - Build tool

### AI Integration
- **@google/genai 1.41.0** - Google Gemini AI SDK
- **gemini-3-pro-preview** - Latest AI model

### Routing & State
- **React Router v6** - Client-side routing
- **React Context** - State management

### Testing
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **jsdom/happy-dom** - DOM simulation

### UI/UX
- **Lucide React** - Icons
- **CSS Variables** - Theming
- **CSS Grid & Flexbox** - Layouts

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the intelligent advisor
- **Vite** for the blazing-fast build tool
- **React** for the amazing UI library
- **Investopedia** for educational content references

---

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/smartinvest/issues) page
2. Review the documentation above
3. Create a new issue with details

---

## 🗺️ Roadmap

### Completed ✅
- [x] AI-powered chat interface
- [x] Risk assessment quiz
- [x] Daily market updates
- [x] Multi-language support
- [x] Dark/light theme toggle
- [x] Rate limiting and caching
- [x] Input sanitization and error boundaries
- [x] Comprehensive testing setup

### In Progress 🚧
- [ ] Enhanced form validation
- [ ] Empty states and loading skeletons
- [ ] Accessibility improvements

### Planned 🔮
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Investment calculator tools
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

<div align="center">
  <b>Made with ❤️ by the SmartInvest team</b>
</div>
