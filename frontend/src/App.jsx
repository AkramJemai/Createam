import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Partnership from './pages/Partnership.jsx';
import PartnershipDetail from './pages/PartnershipDetail.jsx';
import Agency from './pages/Agency.jsx';
import Contact from './pages/Contact.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import Login from './pages/Login.jsx';
import Access from './pages/Access.jsx';
import Join from './pages/Join.jsx';
import Admin from './pages/Admin.jsx';
import ChefDashboard from './components/chef/ChefDashboard.jsx';
import MemberDashboard from './components/member/MemberDashboard.jsx';
import Clients from './pages/Clients.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import * as auth from './services/auth';

// Dynamically load desktop or mobile CSS based on screen width
function useResponsiveCSS() {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    const loadCSS = () => {
      const isMobile = window.innerWidth <= 768;
      const cssPath = isMobile ? '/mobile.css' : '/desktop.css';

      // Remove existing responsive CSS link if present
      const existingLink = document.getElementById('responsive-css');
      if (existingLink) {
        existingLink.remove();
      }

      // Create new link
      const link = document.createElement('link');
      link.id = 'responsive-css';
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => setCssLoaded(true);

      document.head.appendChild(link);
    };

    // Initial load
    loadCSS();

    // Listen for window resize
    const handleResize = () => {
      loadCSS();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return cssLoaded;
}

const BRAND_TAB_TITLE = 'Createam';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

function AppContent() {
  const location = useLocation();
  const isDashboardPath =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/chef-dashboard') ||
    location.pathname.startsWith('/member-dashboard');

  // Load responsive CSS
  useResponsiveCSS();

  // Auto-restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (auth.isAuthenticated()) {
          // Verify the token is still valid with the backend
          await auth.verifySession();
        }
      } catch (err) {
        // Token expired or invalid, clean up
        auth.logout();
      }
    };

    restoreSession();
  }, []);

  // Keep the brand title fixed in the browser tab, even when auto-translation runs.
  useEffect(() => {
    const enforceBrandTitle = () => {
      if (document.title !== BRAND_TAB_TITLE) {
        document.title = BRAND_TAB_TITLE;
      }
    };

    enforceBrandTitle();

    const titleNode = document.querySelector('head > title');
    const observer = new MutationObserver(enforceBrandTitle);
    if (titleNode) {
      observer.observe(titleNode, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    window.addEventListener('pageshow', enforceBrandTitle);

    return () => {
      observer.disconnect();
      window.removeEventListener('pageshow', enforceBrandTitle);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      {!isDashboardPath && <Navbar />}
      <div style={{ paddingTop: isDashboardPath ? 0 : '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/partnership/:id" element={<PartnershipDetail />} />
          <Route path="/agency" element={<Agency />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/access" element={<Access />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/join" element={<Join />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chef-dashboard" element={<ChefDashboard />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
        </Routes>
      </div>
      {!isDashboardPath && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
