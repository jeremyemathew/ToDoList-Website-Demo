import { useEffect, useState } from 'react';
import { isTokenValid } from '../utils/auth';

export default function ProtectedPage({ authenticationToken, setCurrentPath, children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authenticationToken) {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        setCheckingAuth(false);
        return;
      }

      const valid = await isTokenValid(authenticationToken);

      if (!valid) {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [authenticationToken, setCurrentPath]);

  if (checkingAuth) return <div>Checking authentication...</div>;

  return children;
}