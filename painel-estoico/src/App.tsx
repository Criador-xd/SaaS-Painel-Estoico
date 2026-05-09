import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Home } from './components/Home';
import { Escudo } from './components/Escudo';
import { Navalha } from './components/Navalha';
import { Timeline } from './components/Timeline';
import { Cidadela } from './components/Cidadela';
import { Meditation } from './components/Meditation';

function App() {
  const { view, setView } = useStore();

  useEffect(() => {
    // Initialize challenge and view
    setView(view);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'home': return <Home />;
      case 'escudo': return <Escudo />;
      case 'navalha': return <Navalha />;
      case 'timeline': return <Timeline />;
      case 'cidadela': return <Cidadela />;
      case 'meditation': return <Meditation />;
      default: return <Home />;
    }
  };

  return (
    <div className="app-container">
      <div className="marble-texture"></div>
      <div className="noise"></div>
      {renderView()}
    </div>
  );
}

export default App;
