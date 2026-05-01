import { useState, useEffect } from 'react';

import Login from './views/LogIn.jsx';
import Home from './views/Home.jsx';
import About from './views/About.jsx';
import Edit from './views/Edit.jsx';
import NotFound from './views/NotFound.jsx';
import ProtectedPage from './views/protectionPage.jsx';

import NotificationBell from './components/NotificationBell.jsx';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [authenticationToken, setAuthenticationToken] = useState(
    localStorage.getItem('token') || null
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return (
          <Login
            setAuthenticationToken={setAuthenticationToken}
            authenticationToken={authenticationToken}
            setCurrentPath={setCurrentPath}
          />
        );

      case '/home':
        return (
          <ProtectedPage
            authenticationToken={authenticationToken}
            setCurrentPath={setCurrentPath}
          >
            <Home authenticationToken={authenticationToken} />
          </ProtectedPage>
        );

      case '/about':
        return (
          <ProtectedPage
            authenticationToken={authenticationToken}
            setCurrentPath={setCurrentPath}
          >
            <About authenticationToken={authenticationToken} />
          </ProtectedPage>
        );

      case '/edit':
        return (
          <ProtectedPage
            authenticationToken={authenticationToken}
            setCurrentPath={setCurrentPath}
          >
            <Edit authenticationToken={authenticationToken} />
          </ProtectedPage>
        );

      default:
        return <NotFound />;
    }
  };

  return (
    <div className="app-root">
      {renderPage()}
      {authenticationToken && <NotificationBell />}
    </div>
  );
}

export default App;