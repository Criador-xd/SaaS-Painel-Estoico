import { useEffect } from 'react';
import { Home } from './components/Home';
import { Escudo } from './components/Escudo';
import { Navalha } from './components/Navalha';
import { Timeline } from './components/Timeline';
import { Cidadela } from './components/Cidadela';
import { Meditation } from './components/Meditation';
import { Auth } from './components/Auth';
import { Paywall } from './components/Paywall';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

function App() {
  const { view, user, isPremium, setView, setUser } = useStore();

  useEffect(() => {
    // 1. Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ 
          name: session.user.user_metadata?.name || 'Iniciado', 
          email: session.user.email || '' 
        });
      } else if (!user && view !== 'auth') {
        setView('auth');
      }
    });

    // 2. Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ 
          name: session.user.user_metadata?.name || 'Iniciado', 
          email: session.user.email || '' 
        });
      } else {
        setUser(null as any); // Clear user
        setView('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setView]);

  const renderView = () => {
    if (!user) return <Auth />;
    
    // Check Premium Access
    if (!isPremium && (view === 'cidadela' || view === 'timeline')) {
      return <Paywall 
        featureName={view === 'cidadela' ? 'Cidadela Interior' : 'Linha do Tempo de Mestre'} 
        onBack={() => setView('home')} 
      />;
    }

    switch (view) {
      case 'home': return <Home />;
      case 'escudo': return <Escudo />;
      case 'navalha': return <Navalha />;
      case 'timeline': return <Timeline />;
      case 'cidadela': return <Cidadela />;
      case 'meditation': return <Meditation />;
      case 'auth': return <Auth />;
      default: return <Home />;
    }
  };

  return (
    <div className="app-container">
      <div className="marble-texture"></div>
      <div className="noise"></div>
      <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
        {renderView()}
      </div>
    </div>
  );
}

export default App;
