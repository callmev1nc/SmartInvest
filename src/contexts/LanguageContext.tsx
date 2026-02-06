/**
 * LanguageContext - Manages language preference for the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'zh' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'smartinvest_language';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App name
    appName: 'SmartInvest',

    // Tagline
    tagline: 'Meet Uma, Your AI Investment Advisor',

    // Navigation
    navHome: 'Home',
    navChat: 'Chat with Uma',
    navQuiz: 'Quiz',
    navExplore: 'Explore',

    // Welcome
    welcome: 'Hi, {name}!',
    welcomeBack: 'Welcome back, {name}!',
    welcomeToApp: 'Welcome to SmartInvest',

    // Hero
    heroSubtitle: 'Your personal AI investment advisor is ready to help',

    // Features
    featureChatTitle: 'Chat with Uma',
    featureChatDesc: 'Get personalized investment advice',
    featureQuizTitle: 'Risk Assessment',
    featureQuizDesc: 'Discover your investor profile',
    featureExploreTitle: 'Investment Options',
    featureExploreDesc: 'Explore investment opportunities',
    getStarted: 'Get Started',

    // Tips
    tipsTitle: 'Tips for Your Savings',
    tip1Title: 'Start Small, Think Big',
    tip1Text: 'Even small investments can grow significantly over time. The key is consistency and starting early.',
    tip2Title: 'Diversify Your Portfolio',
    tip2Text: "Don't put all your eggs in one basket. Spread investments across different asset classes to manage risk.",

    // Quiz
    quizTitle: 'Risk Assessment Quiz',
    takeQuiz: 'Take the Quiz',
    takeQuizDesc: 'Discover your investor profile in 5 minutes',
    yourRiskProfile: 'Your Risk Profile',
    investor: 'Investor',
    retakeAssessment: 'Retake Assessment',

    // Chat
    welcomeToAppChat: 'Welcome to SmartInvest!',
    chatSubtitle: "I'm Uma, your personal AI investment advisor. What should I call you?",
    enterName: 'Enter your name',
    startChatting: 'Start Chatting',
    skipForNow: 'Skip for now',
    askUma: 'Ask Uma:',
    typeMessage: 'Ask Uma anything about investing...',
    send: 'Send',

    // Explore
    investmentOptions: 'Investment Options',
    availableInvestments: 'Available Investments',
    learnAboutInvesting: 'Learn About Investing',
    beginnerTopics: 'Beginner Topics',
    intermediateTopics: 'Intermediate Topics',
    advancedTopics: 'Advanced Topics',
    keyInvestmentTerms: 'Key Investment Terms',

    // Daily Updates
    dailyUpdates: 'Daily Market Updates',
    refresh: 'Refresh',
    opportunities: 'Investment Opportunities',

    // Language
    language: 'Language',
    selectLanguage: 'Select Language',

    // Footer
    footer: '© 2025 SmartInvest - Making smart investment decisions accessible to everyone',
  },
  zh: {
    // App name
    appName: '智能投资',

    // Tagline
    tagline: '遇见 Uma，您的 AI 投资顾问',

    // Navigation
    navHome: '首页',
    navChat: '与 Uma 聊天',
    navQuiz: '测验',
    navExplore: '探索',

    // Welcome
    welcome: '您好，{name}！',
    welcomeBack: '欢迎回来，{name}！',
    welcomeToApp: '欢迎使用智能投资',

    // Hero
    heroSubtitle: '您的个人 AI 投资顾问随时为您提供帮助',

    // Features
    featureChatTitle: '与 Uma 聊天',
    featureChatDesc: '获得个性化投资建议',
    featureQuizTitle: '风险评估',
    featureQuizDesc: '发现您的投资者类型',
    featureExploreTitle: '投资选择',
    featureExploreDesc: '探索投资机会',
    getStarted: '开始',

    // Tips
    tipsTitle: '储蓄建议',
    tip1Title: '从小额开始，放眼长远',
    tip1Text: '即使是小额投资也会随着时间增长。关键是保持一致性，尽早开始。',
    tip2Title: '多元化投资组合',
    tip2Text: '不要把所有鸡蛋放在一个篮子里。将投资分散到不同资产类别以管理风险。',

    // Quiz
    quizTitle: '风险评估测验',
    takeQuiz: '参加测验',
    takeQuizDesc: '在 5 分钟内发现您的投资者类型',
    yourRiskProfile: '您的风险类型',
    investor: '投资者',
    retakeAssessment: '重新评估',

    // Chat
    welcomeToAppChat: '欢迎使用智能投资！',
    chatSubtitle: '我是 Uma，您的个人 AI 投资顾问。我该怎么称呼您？',
    enterName: '输入您的名字',
    startChatting: '开始聊天',
    skipForNow: '暂时跳过',
    askUma: '询问 Uma：',
    typeMessage: '向 Uma 询问任何投资问题...',
    send: '发送',

    // Explore
    investmentOptions: '投资选择',
    availableInvestments: '可用投资',
    learnAboutInvesting: '学习投资知识',
    beginnerTopics: '初级主题',
    intermediateTopics: '中级主题',
    advancedTopics: '高级主题',
    keyInvestmentTerms: '关键投资术语',

    // Daily Updates
    dailyUpdates: '每日市场更新',
    refresh: '刷新',
    opportunities: '投资机会',

    // Language
    language: '语言',
    selectLanguage: '选择语言',

    // Footer
    footer: '© 2025 智能投资 - 让每个人都能做出明智的投资决策',
  },
  vi: {
    // App name
    appName: 'SmartInvest',

    // Tagline
    tagline: 'Gặp Uma, Tư Vấn Viên Đầu Tư AI Của Bạn',

    // Navigation
    navHome: 'Trang Chủ',
    navChat: 'Chat Với Uma',
    navQuiz: 'Bài Trắc Nghiệm',
    navExplore: 'Khám Phá',

    // Welcome
    welcome: 'Xin chào, {name}!',
    welcomeBack: 'Chào mừng trở lại, {name}!',
    welcomeToApp: 'Chào mừng đến với SmartInvest',

    // Hero
    heroSubtitle: 'Tư vấn viên đầu tư AI cá nhân của bạn đã sẵn sàng giúp đỡ',

    // Features
    featureChatTitle: 'Chat Với Uma',
    featureChatDesc: 'Nhận lời khuyên đầu tư được cá nhân hóa',
    featureQuizTitle: 'Đánh Giá Rủi Ro',
    featureQuizDesc: 'Khám phá hồ sơ nhà đầu tư của bạn',
    featureExploreTitle: 'Lựa Chọn Đầu Tư',
    featureExploreDesc: 'Khám phá cơ hội đầu tư',
    getStarted: 'Bắt Đầu',

    // Tips
    tipsTitle: 'Mẹo Cho Tiết Kiệm Của Bạn',
    tip1Title: 'Bắt Đầu Nhỏ, Nghĩ Lớn',
    tip1Text: 'Kể cả khoản đầu tư nhỏ cũng có thể tăng trưởng đáng kể theo thời gian. Chìa khóa là sự nhất quán và bắt đầu sớm.',
    tip2Title: 'Đa Dạng Hóa Danh Mục Đầu Tư',
    tip2Text: 'Đừng bỏ tất cả trứng vào một giỏ. Phân bổ đầu tư qua các lớp tài sản khác nhau để quản lý rủi ro.',

    // Quiz
    quizTitle: 'Bài Trắc Nghiệm Đánh Giá Rủi Ro',
    takeQuiz: 'Làm Bài Trắc Nghiệm',
    takeQuizDesc: 'Khám phá hồ sơ nhà đầu tư trong 5 phút',
    yourRiskProfile: 'Hồ Sơ Rủi Ro Của Bạn',
    investor: 'Nhà Đầu Tư',
    retakeAssessment: 'Làm Lại Bài Trắc Nghiệm',

    // Chat
    welcomeToAppChat: 'Chào mừng đến với SmartInvest!',
    chatSubtitle: 'Tôi là Uma, tư vấn viên đầu tư AI cá nhân của bạn. Tôi nên gọi bạn là gì?',
    enterName: 'Nhập tên của bạn',
    startChatting: 'Bắt Đầu Chat',
    skipForNow: 'Bỏ Qua Bây Giờ',
    askUma: 'Hỏi Uma:',
    typeMessage: 'Hỏi Uma bất cứ điều gì về đầu tư...',
    send: 'Gửi',

    // Explore
    investmentOptions: 'Lựa Chọn Đầu Tư',
    availableInvestments: 'Đầu Tư Có Sẵn',
    learnAboutInvesting: 'Học Về Đầu Tư',
    beginnerTopics: 'Chủ Đề Cho Người Mới',
    intermediateTopics: 'Chủ Đề Trung Cấp',
    advancedTopics: 'Chủ Đề Nâng Cao',
    keyInvestmentTerms: 'Thuật Ngụ Đầu Tư Chính',

    // Daily Updates
    dailyUpdates: 'Cập Nhật Thị Trường Hàng Ngày',
    refresh: 'Làm Mới',
    opportunities: 'Cơ Hội Đầu Tư',

    // Language
    language: 'Ngôn Ngữ',
    selectLanguage: 'Chọn Ngôn Ngữ',

    // Footer
    footer: '© 2025 SmartInvest - Mang đến quyết định đầu tư thông minh cho mọi người',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language;
      if (savedLang && ['en', 'zh', 'vi'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      // Fallback to English if translation not found
      value = translations['en'];
      for (const k of keys) {
        value = value?.[k];
      }
    }

    let result = value || key;

    // Replace placeholders like {name}, {count}, etc.
    if (params && typeof result === 'string') {
      Object.keys(params).forEach(paramKey => {
        const placeholder = `{${paramKey}}`;
        result = result.replace(new RegExp(placeholder, 'g'), String(params[paramKey]));
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
