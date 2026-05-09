import { useEffect } from 'react';
import { Home } from './components/Home';
import { Escudo } from './components/Escudo';
import { Navalha } from './components/Navalha';
import { Timeline } from './components/Timeline';
import { Cidadela } from './components/Cidadela';
import { Meditation } from './components/Meditation';
import { Auth } from './components/Auth';
import { useStore } from './store/useStore';

function App() {
  const { view, user, setView } = useStore();

  useEffect(() => {
    // Se não houver usuário, força a tela de Auth
    if (!user && view !== 'auth') {
      setView('auth');
    }
  }, [user, view, setView]);

  const renderView = () => {
    // Segurança máxima: se não tem usuário, SEMPRE mostra Auth
    if (!user) return <Auth />;
    
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
