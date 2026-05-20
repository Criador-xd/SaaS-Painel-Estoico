import { useState, useEffect, useCallback } from 'react';
import { publisherApi } from '../lib/publisherApi';
import {
  Search, Film, Image, Globe, ArrowLeft,
  Clock, AlertCircle, CheckCircle, Loader2, Trash2, RefreshCw
} from 'lucide-react';

interface ContentItem {
  id: string;
  fileName: string;
  filePath: string;
  contentType: string;
  preview: string;
  titles: { interno: string; instagram: string };
  caption: string;
  hashtags: string[];
  platforms: string[];
  status: string;
  schedule: { date: string; hour: number; minute: number };
  createdAt: string;
  publishedAt: string | null;
  error?: string;
}

export const HistoricoAgendamento = ({ onBack }: { onBack: () => void }) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [history, setHistory] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter !== 'todos') params.status = statusFilter;
      if (typeFilter !== 'todos') params.type = typeFilter;
      const data = await publisherApi.getQueue(params);
      setItems(data.items || []);
      setHistory(data.history || []);
    } catch { }
    setLoading(false);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDelete = async (id: string) => {
    try {
      await publisherApi.delete(id);
      await loadData();
    } catch { }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'publicado':
      case 'agendado': return '#2ECC71';
      case 'erro': return '#FF5252';
      case 'aprovado': return '#D4AF37';
      case 'rascunho': return '#9CA3AF';
      default:
        if (status === 'agendado') return '#7C3AED';
        return '#9CA3AF';
    }
  };

  const statusBg = (status: string) => {
    switch (status) {
      case 'publicado':
      case 'agendado': return '#2ECC7120';
      case 'erro': return '#FF525220';
      case 'aprovado': return '#D4AF3720';
      case 'rascunho': return '#9CA3AF20';
      default:
        if (status === 'agendado') return '#7C3AED20';
        return '#9CA3AF20';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'rascunho': return 'Rascunho';
      case 'aprovado': return 'Aprovado';
      case 'agendado': return 'Agendado';
      case 'publicado': return 'Publicado';
      case 'erro': return 'Erro';
      case 'pendente': return process.env ? 'Pendente' : 'Pendente';
      default: return status;
    }
  };

  const formatSchedule = (s: { date: string; hour: number; minute: number }) => {
    if (!s) return '';
    const d = new Date(s.date + 'T00:00:00');
    const days = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    const dayName = days[d.getDay()];
    const [y, m, day] = s.date.split('-');
    return `${dayName} · ${day}/${m}/${y} · ${String(s.hour).padStart(2, '0')}:${String(s.minute).padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const allItems = [...items, ...history];

  const filterTabs = [
    { key: 'todos', label: 'Todos' },
    { key: 'publicado', label: 'Publicados' },
    { key: 'agendado', label: 'Em Processamento' },
    { key: 'erro', label: 'Com Erro' },
    { key: 'rascunho', label: 'Rascunhos' }
  ];

  const typeTabs = [
    { key: 'todos', label: 'Todos' },
    { key: 'reels', label: 'Reels' },
    { key: 'carrossel', label: 'Carrossel' },
    { key: 'story', label: 'Story' }
  ];

  return (
    <div className="publisher-container">
      <div style={{ padding: '20px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="pub-btn pub-btn-ghost" onClick={onBack} style={{ padding: '6px 10px' }}>
            <ArrowLeft size={18} />
          </button>
          <h2 className="pub-title" style={{ margin: 0 }}>Histórico / Agendamento</h2>
        </div>

        {/* Search */}
        <div className="pub-search-box">
          <Search size={16} color="#9CA3AF" />
          <input
            className="pub-search-input"
            placeholder="Buscar por título..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Tabs - Status */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              className={`pub-filter-tab ${statusFilter === tab.key ? 'pub-filter-tab-active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Tabs - Type */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {typeTabs.map(tab => (
            <button
              key={tab.key}
              className={`pub-filter-tab ${typeFilter === tab.key ? 'pub-filter-tab-active' : ''}`}
              onClick={() => setTypeFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <button className="pub-btn pub-btn-ghost" onClick={loadData} style={{ marginLeft: 'auto', padding: '6px 10px' }}>
            <RefreshCw size={14} />
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Loader2 size={24} className="spin" color="#7C3AED" />
          </div>
        )}

        {/* Cards List */}
        {!loading && allItems.length === 0 && (
          <div className="pub-card" style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: 'var(--text-secondary)' }}>Nenhum conteúdo encontrado</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allItems.map(item => (
            <div key={item.id} className="pub-card hist-card">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {/* Media Icon / Preview */}
                <div className="hist-media-icon">
                  {item.contentType === 'reels' ? <Film size={22} /> : <Image size={22} />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="hist-title">{item.titles.interno}</p>
                  <p className="hist-date">{formatDate(item.createdAt)}</p>

                  {/* Type Badge */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span className="hist-type-badge">
                      {item.contentType === 'reels' ? 'REELS' : item.contentType === 'carrossel' ? 'CARROSSEL' : 'STORY'}
                    </span>

                    {/* Schedule Badge */}
                    {(item.status === 'agendado' || item.status === 'publicado') && item.schedule && (
                      <span className="hist-schedule-badge">
                        <Clock size={10} />
                        {formatSchedule(item.schedule)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Platform Icons */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {item.platforms?.map(p => (
                    <div key={p} className="hist-platform-icon" style={{
                      background: p === 'instagram' ? '#E1306C20' : '#FF000020'
                    }}>
                      <Globe size={14} color={p === 'instagram' ? '#E1306C' : '#FF0000'} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Bar */}
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="hist-status-bar" style={{ background: statusBg(item.status), borderColor: statusColor(item.status) + '40' }}>
                  <div className="hist-status-dot" style={{ background: statusColor(item.status) }} />
                  <span style={{ color: statusColor(item.status), fontSize: 11, fontWeight: 600 }}>
                    {statusLabel(item.status)}
                  </span>
                  {item.status === 'agendado' && <Clock size={12} color={statusColor(item.status)} />}
                  {item.status === 'publicado' && <CheckCircle size={12} color={statusColor(item.status)} />}
                  {item.status === 'erro' && <AlertCircle size={12} color={statusColor(item.status)} />}
                </div>
                {(item.status === 'rascunho' || item.status === 'erro') && (
                  <button className="pub-btn pub-btn-ghost" onClick={() => handleDelete(item.id)} style={{ padding: '4px 8px' }}>
                    <Trash2 size={14} color="#FF5252" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};