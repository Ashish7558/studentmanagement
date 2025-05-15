import React from 'react';
    import { supabase } from './lib/supabase';
    import Auth from './components/Auth';
    import Dashboard from './components/Dashboard';

    function App() {
      const [isAuthenticated, setIsAuthenticated] = React.useState(false);

      React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setIsAuthenticated(!!session);
        });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
      }, []);

      const handleLogout = () => {
        setIsAuthenticated(false);
      };

      return isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Auth onLogin={() => setIsAuthenticated(true)} />
      );
    }

    export default App;
