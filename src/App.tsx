import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Explore from './pages/Explore';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/explore" element={<Explore />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
