import { useEffect, useState } from 'react';
import { Home } from './components/Home';
import { Escudo } from './components/Escudo';
import { Navalha } from './components/Navalha';
import { Timeline } from './components/Timeline';
import { Cidadela } from './components/Cidadela';
import { Meditation } from './components/Meditation';
import { Auth } from './components/Auth';
import { Paywall } from './components/Paywall';
import { Success } from './components/Success';
import { Quiz } from './components/Quiz';
import { SquadPublicador } from './components/SquadPublicador';
import { HistoricoAgendamento } from './components/HistoricoAgendamento';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

function App() {
  const { view, user, isPremium, setView, setUser } = useStore();
  const [pubView, setPubView] = useState<'squad-publicador' | 'historico'>('squad-publicador');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setView('success');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ 
          name: session.user.user_metadata?.name || 'Iniciado', 
          email: session.user.email || '' 
        });
      } else if (!user && view !== 'success') {
        setView('quiz');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ 
          name: session.user.user_metadata?.name || 'Iniciado', 
          email: session.user.email || '' 
        });
      } else {
        setUser(null as any);
        if (view !== 'success' && view !== 'quiz') setView('quiz');
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setView]);

  const renderView = () => {
    if (!user) {
      if (view === 'auth') return <Auth />;
      return <Quiz onFinish={() => setView('auth')} />;
    }
    
    if (!isPremium && view !== 'success') {
      return <Paywall onBack={() => supabase.auth.signOut()} />;
    }

    switch (view) {
      case 'home': return <Home />;
      case 'escudo': return <Escudo />;
      case 'navalha': return <Navalha />;
      case 'timeline': return <Timeline />;
      case 'cidadela': return <Cidadela />;
      case 'meditation': return <Meditation />;
      case 'auth': return <Auth />;
      case 'success': return <Success />;
      case 'quiz': return <Quiz onFinish={() => setView('auth')} />;
      case 'squad-publicador':
        return pubView === 'historico'
          ? <HistoricoAgendamento onBack={() => setPubView('squad-publicador')} />
          : <SquadPublicador onViewHistory={() => setPubView('historico')} />;
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