import { useState, useEffect, useCallback } from 'react';
import { publisherApi } from '../lib/publisherApi';
import {
  Play, FolderOpen, RefreshCw, CheckCircle, Clock,
  Send, Sparkles, Trash2, Eye, Image, Film, AlertCircle,
  Loader2
} from 'lucide-react';

interface MediaFile {
  name: string;
  path: string;
  type: string;
  contentType: string;
  size: number;
  modifiedAt: string;
}

interface ContentItem {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  contentType: string;
  preview: string;
  titles: { interno: string; instagram: string };
  caption: string;
  hashtags: string[];
  cta: string;
  autoComment: string;
  platforms: string[];
  status: string;
  schedule: { date: string; hour: number; minute: number };
  createdAt: string;
  approved: boolean;
  publishedAt: string | null;
  autoCommentEnabled: boolean;
  approvalGate: boolean;
  error?: string;
}

interface PreviewData {
  data: string;
  isVideo: boolean;
}

export const SquadPublicador = ({ onViewHistory }: { onViewHistory: () => void }) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState('');
  const [folderPath, setFolderPath] = useState('D:\\menteestoicaabsoluta');
  const [publishedFolderPath, setPublishedFolderPath] = useState('D:\\Videos publicados\\menteestoicaabsoluta');
  const [editTitulo, setEditTitulo] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [editCta, setEditCta] = useState('');

  const checkServer = useCallback(async () => {
    setServerStatus('checking');
    try {
      const h = await publisherApi.health();
      if (h.status === 'ok') {
        setServerStatus('online');
        setFolderPath(h.contentFolder);
        setPublishedFolderPath(h.publishedFolder);
      } else {
        setServerStatus('offline');
      }
    } catch {
      setServerStatus('offline');
    }
  }, []);

  useEffect(() => { checkServer(); }, [checkServer]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await publisherApi.getContents();
      if (data.error) {
        setError(data.error);
        setFiles([]);
      } else {
        setFiles(data.files || []);
      }
    } catch (e) {
      setError('Erro ao conectar com o servidor local');
    }
    setLoading(false);
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      const data = await publisherApi.getQueue();
      setItems(data.items || []);
    } catch { }
  }, []);

  useEffect(() => {
    if (serverStatus === 'online') {
      loadFiles();
      loadQueue();
    }
  }, [serverStatus, loadFiles, loadQueue]);

  const handleGenerate = async () => {
    if (files.length === 0) { setError('Nenhum arquivo encontrado'); return; }
    setGenerating(true);
    setError('');
    try {
      const data = await publisherApi.generate(files);
      if (data.items) {
        await loadQueue();
        if (data.items.length > 0) {
          setSelectedItem(data.items[0]);
        }
      }
    } catch (e) {
      setError('Erro ao gerar conteúdo');
    }
    setGenerating(false);
  };

  const handleSelectItem = async (item: ContentItem) => {
    setSelectedItem(item);
    setEditTitulo(item.titles.interno);
    setEditCaption(item.caption);
    setEditHashtags(item.hashtags.join(' '));
    setEditCta(item.cta);
    try {
      const p = await publisherApi.getPreview(item.filePath);
      setPreview(p);
    } catch {
      setPreview(null);
    }
  };

  const handleApprove = async () => {
    if (!selectedItem) return;
    try {
      await publisherApi.approve(selectedItem.id);
      await loadQueue();
      setSelectedItem(prev => prev ? { ...prev, approved: true, status: 'aprovado' } : null);
    } catch { }
  };

  const handleSchedule = async () => {
    if (!selectedItem) return;
    try {
      await publisherApi.schedule(selectedItem.id);
      await loadQueue();
      setSelectedItem(prev => prev ? { ...prev, status: 'agendado' } : null);
    } catch { }
  };

  const handlePublishNow = async () => {
    if (!selectedItem) return;
    try {
      await publisherApi.publishNow(selectedItem.id);
      await loadQueue();
      setSelectedItem(null);
      setPreview(null);
      loadFiles();
    } catch { }
  };

  const handleRegenerate = async () => {
    if (!selectedItem) return;
    try {
      const data = await publisherApi.regenerate(selectedItem.id);
      if (data.item) {
        setSelectedItem(data.item);
        setEditCaption(data.item.caption);
        setEditHashtags(data.item.hashtags.join(' '));
      }
    } catch { }
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    try {
      await publisherApi.update(selectedItem.id, {
        titles: { ...selectedItem.titles, interno: editTitulo },
        caption: editCaption,
        hashtags: editHashtags.split(' ').filter(Boolean),
        cta: editCta
      });
      setSelectedItem(prev => prev ? {
        ...prev,
        titles: { ...prev.titles, interno: editTitulo },
        caption: editCaption,
        hashtags: editHashtags.split(' ').filter(Boolean),
        cta: editCta
      } : null);
      await loadQueue();
    } catch { }
  };

  const handleRunAutoPublisher = async () => {
    setError('');
    setGenerating(true);
    try {
      await loadFiles();
      if (files.length === 0) {
        setError('Nenhum conteúdo encontrado na pasta');
        setGenerating(false);
        return;
      }
      const genData = await publisherApi.generate(files);
      if (genData.items) {
        await loadQueue();
        for (const item of genData.items) {
          await publisherApi.approve(item.id);
        }
        await publisherApi.bulkSchedule();
        await loadQueue();
      }
    } catch (e) {
      setError('Erro no Publicador Automático');
    }
    setGenerating(false);
  };

  const handleSelectContentFolder = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const path = target.files[0].webkitRelativePath.split('/')[0];
        const fullPath = target.files[0].webkitRelativePath;
        const basePath = fullPath.substring(0, fullPath.indexOf(target.files[0].webkitRelativePath.split('/')[0]) + target.files[0].webkitRelativePath.split('/')[0].length);
        try {
          await publisherApi.setContentFolder(basePath);
          setFolderPath(basePath);
          await loadFiles();
        } catch { }
      }
    };
    input.click();
  };

  const handleSelectPublishedFolder = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const basePath = target.files[0].webkitRelativePath.split('/')[0];
        try {
          await publisherApi.setPublishedFolder(basePath);
          setPublishedFolderPath(basePath);
        } catch { }
      }
    };
    input.click();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'publicado': return 'var(--success)';
      case 'agendado': return '#7C3AED';
      case 'aprovado': return 'var(--gold)';
      case 'erro': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'rascunho': return 'Rascunho';
      case 'aprovado': return 'Aprovado';
      case 'agendado': return 'Agendado';
      case 'publicado': return 'Publicado';
      case 'erro': return 'Erro';
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

  if (serverStatus === 'checking') {
    return (
      <div className="publisher-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
          <Loader2 size={32} className="spin" color="#7C3AED" />
          <p style={{ color: 'var(--text-secondary)' }}>Conectando ao servidor local...</p>
        </div>
      </div>
    );
  }

  if (serverStatus === 'offline') {
    return (
      <div className="publisher-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
          <AlertCircle size={48} color="var(--error)" />
          <h2 style={{ color: 'var(--text-primary)', fontFamily: 'Cinzel', letterSpacing: 2 }}>Servidor Offline</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 300 }}>
            O servidor local do Publicador não está rodando.
          </p>
          <div className="publisher-card" style={{ background: '#1A1A2E', padding: 20 }}>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 8 }}>
              Para iniciar, abra um terminal e execute:
            </p>
            <code style={{ display: 'block', background: '#0A0A0A', padding: 12, borderRadius: 8, color: '#7C3AED', fontSize: 12 }}>
              cd painel-estoico\publisher-server<br />
              node server.js
            </code>
          </div>
          <button className="pub-btn" onClick={checkServer} style={{ marginTop: 12 }}>
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="publisher-container">
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 className="pub-title">Squad Publicador</h2>
          <button className="pub-btn pub-btn-ghost" onClick={onViewHistory}>
            <Eye size={16} /> Histórico
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <button className="pub-btn pub-btn-primary" onClick={handleRunAutoPublisher} disabled={generating}>
            {generating ? <Loader2 size={18} className="spin" /> : <Play size={18} />}
            Rodar Publicador Automático
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pub-btn" onClick={handleSelectContentFolder} style={{ flex: 1 }}>
              <FolderOpen size={16} /> Selecionar pasta de conteúdos
            </button>
            <button className="pub-btn" onClick={handleSelectPublishedFolder} style={{ flex: 1 }}>
              <FolderOpen size={16} /> Selecionar pasta de publicados
            </button>
          </div>
          <button className="pub-btn" onClick={loadFiles}>
            <RefreshCw size={16} /> Atualizar lista ({files.length} arquivos)
          </button>
        </div>

        {error && (
          <div className="pub-card" style={{ borderLeft: '3px solid var(--error)', padding: 12, marginBottom: 16 }}>
            <p style={{ color: 'var(--error)', fontSize: 13 }}>{error}</p>
          </div>
        )}

        {/* Content List */}
        {files.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>
              CONTEÚDOS ENCONTRADOS ({files.length})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {files.map(f => (
                <div key={f.name} className="pub-badge">
                  {f.contentType === 'reels' ? <Film size={12} /> : <Image size={12} />}
                  <span>{f.name}</span>
                </div>
              ))}
            </div>
            {items.length === 0 && !generating && (
              <button className="pub-btn" onClick={handleGenerate} style={{ marginTop: 12, width: '100%' }}>
                <Sparkles size={16} /> Gerar Conteúdo para {files.length} arquivo(s)
              </button>
            )}
          </div>
        )}

        {generating && (
          <div className="pub-card" style={{ textAlign: 'center', padding: 24 }}>
            <Loader2 size={28} className="spin" color="#7C3AED" />
            <p style={{ color: '#7C3AED', marginTop: 12, fontWeight: 600 }}>Gerando conteúdos...</p>
          </div>
        )}

        {/* Items List */}
        {items.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>
              CONTEÚDOS GERADOS ({items.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(item => (
                <div
                  key={item.id}
                  className={`pub-card pub-card-hover ${selectedItem?.id === item.id ? 'pub-card-active' : ''}`}
                  onClick={() => handleSelectItem(item)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}
                >
                  <div className="pub-media-icon">
                    {item.contentType === 'reels' ? <Film size={20} /> : <Image size={20} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }}>{item.fileName}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{item.titles.interno}</p>
                  </div>
                  <div className="pub-badge" style={{
                    background: statusColor(item.status) + '20',
                    color: statusColor(item.status),
                    border: `1px solid ${statusColor(item.status)}40`
                  }}>
                    {statusLabel(item.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && items.length === 0 && !loading && (
          <div className="pub-card" style={{ textAlign: 'center', padding: 40 }}>
            <FolderOpen size={40} color="var(--text-secondary)" />
            <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>
              Nenhum conteúdo encontrado. Clique em "Rodar Publicador Automático" ou selecione uma pasta.
            </p>
          </div>
        )}

        {loading && (
          <div className="pub-card" style={{ textAlign: 'center', padding: 24 }}>
            <Loader2 size={24} className="spin" color="#7C3AED" />
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Carregando...</p>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {selectedItem && (
        <div className="publisher-preview-panel">
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>Preview</h3>
              <button className="pub-btn pub-btn-ghost" onClick={() => { setSelectedItem(null); setPreview(null); }}
                style={{ padding: '4px 8px', fontSize: 11 }}>
                <Trash2 size={14} /> Fechar
              </button>
            </div>

            {/* Media Preview */}
            {preview && (
              <div className="pub-media-preview">
                {preview.isVideo ? (
                  <video src={preview.data} controls style={{ width: '100%', borderRadius: 8, maxHeight: 200 }} />
                ) : (
                  <img src={preview.data} alt="" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
                )}
              </div>
            )}

            {/* Platforms */}
            <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
              {selectedItem.platforms.map(p => (
                <span key={p} className="pub-badge" style={{
                  background: p === 'instagram' ? '#E1306C20' : '#FF000020',
                  color: p === 'instagram' ? '#E1306C' : '#FF0000',
                  border: `1px solid ${p === 'instagram' ? '#E1306C40' : '#FF000040'}`
                }}>
                  {p === 'instagram' ? 'Instagram' : 'YouTube Shorts'}
                </span>
              ))}
              <span className="pub-badge" style={{
                background: selectedItem.contentType === 'reels' ? '#7C3AED20' : '#7C3AED20',
                color: '#7C3AED',
                border: '1px solid #7C3AED40'
              }}>
                {selectedItem.contentType === 'reels' ? 'REELS' : 'CARROSSEL'}
              </span>
            </div>

            {/* Editable Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label className="pub-label">Título Interno</label>
                <input className="pub-input" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} />
              </div>
              <div>
                <label className="pub-label">Título Instagram</label>
                <input className="pub-input" value={selectedItem.titles.instagram} disabled />
              </div>
              <div>
                <label className="pub-label">Legenda Principal</label>
                <textarea className="pub-input pub-textarea" value={editCaption} onChange={e => setEditCaption(e.target.value)} rows={4} />
              </div>
              <div>
                <label className="pub-label">Hashtags</label>
                <input className="pub-input" value={editHashtags} onChange={e => setEditHashtags(e.target.value)} />
              </div>
              <div>
                <label className="pub-label">CTA</label>
                <input className="pub-input" value={editCta} onChange={e => setEditCta(e.target.value)} />
              </div>
              <div>
                <label className="pub-label">Comentário Automático</label>
                <textarea className="pub-input pub-textarea" value={selectedItem.autoComment} disabled rows={2} />
              </div>

              {/* Schedule Info */}
              {selectedItem.schedule && selectedItem.status === 'agendado' && (
                <div className="pub-card" style={{ textAlign: 'center', padding: 12, background: '#1A1A2E', border: '1px solid #7C3AED40' }}>
                  <Clock size={16} color="#7C3AED" />
                  <p style={{ color: '#7C3AED', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                    {formatSchedule(selectedItem.schedule)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                <button className="pub-btn pub-btn-primary" onClick={handleSaveEdit} style={{ flex: 1 }}>
                  <CheckCircle size={16} /> Salvar
                </button>
                {!selectedItem.approved && (
                  <button className="pub-btn" onClick={handleApprove} style={{ background: '#7C3AED', color: '#fff', flex: 1 }}>
                    <CheckCircle size={16} /> Aprovar
                  </button>
                )}
                {selectedItem.approved && selectedItem.status !== 'agendado' && selectedItem.status !== 'publicado' && (
                  <>
                    <button className="pub-btn" onClick={handleSchedule} style={{ borderColor: '#7C3AED', color: '#7C3AED', flex: 1 }}>
                      <Clock size={16} /> Agendar
                    </button>
                    <button className="pub-btn" onClick={handlePublishNow} style={{ background: '#2ECC71', color: '#fff', flex: 1 }}>
                      <Send size={16} /> Publicar agora
                    </button>
                  </>
                )}
                <button className="pub-btn" onClick={handleRegenerate} style={{ flex: 1 }}>
                  <RefreshCw size={16} /> Regenerar legenda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};