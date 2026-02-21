import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Explore = lazy(() => import('./pages/Explore'));

/**
 * Loading component shown while lazy-loaded components are being fetched
 */
function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner"></div>
      <p>Loading SmartInvest...</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log errors for debugging in development
        if (import.meta.env.DEV) {
          console.error('Application Error:', error);
          console.error('Component Stack:', errorInfo.componentStack);
        }
      }}
    >
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <BrowserRouter>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/explore" element={<Explore />} />
                  </Routes>
                </Suspense>
              </Layout>
            </BrowserRouter>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
