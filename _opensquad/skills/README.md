# 🎬 Video Editor Pro - Skill de Edição Automatizada

## Overview

**Video Editor Pro** é uma skill de edição de vídeo de nível profissional para o Opensquad. Automatiza tarefas complexas como:

- ✂️ Corte e compilação de trechos
- 📝 Adição de legendas automáticas (transcrição + sincronização)
- 🎵 Sincronização inteligente de música
- 🎯 Extração automática de ganchos (hooks) para Reels/Shorts
- 🎨 Aplicação de efeitos e transições
- 📊 Geração de roteiros de edição com IA

---

## ⚡ Quick Start

### 1. Instale as dependências
```bash
pip install -r requirements.txt
ffmpeg --version  # Verifique se FFmpeg está instalado
```

### 2. Configure a skill
```bash
cp video-editor.config.json.example video-editor.config.json
# Edite os caminhos conforme necessário
```

### 3. Use em seu squad
```python
from _opensquad.skills.video_editor import VideoEditorPro

editor = VideoEditorPro()
hooks = editor.create_hooks("video.mp4", count=5)
```

---

## 📖 Documentação Completa

- 📘 **[skill.md](./video-editor.skill.md)** - Especificação técnica da skill
- 🔧 **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Guia de integração em squads
- ⚙️ **[video-editor.config.json](./video-editor.config.json)** - Arquivo de configuração

---

## 🎯 Funcionalidades

### Análise de Vídeo
```python
analysis = editor.analyze_video("video.mp4")
# Retorna: duração, fps, resolução, picos de energia, mudanças de cena
```

### Criar Ganchos (Hooks)
```python
hooks = editor.create_hooks("video.mp4", count=5)
# Retorna: 5 vídeos curtos em formatos 15s/30s/60s
```

### Adicionar Legendas
```python
video_com_legendas, srt = editor.add_subtitles("video.mp4", language="pt-BR")
# Transcrição automática + sincronização
```

### Adicionar Música
```python
video_final = editor.add_music("video.mp4", music_track="auto")
# Sincroniza trilha sonora automaticamente
```

### Compilar Segmentos
```python
segments = [
    {"video": "v1.mp4", "start": 10, "end": 30},
    {"video": "v2.mp4", "start": 5, "end": 25}
]
editor.cut_and_compile(segments, "output.mp4")
```

### Gerar Roteiro de Edição
```python
script = editor.generate_edit_script("video.mp4")
# Retorna: recomendações de cortes, highlights, duração estimada
```

---

## 📊 Benchmark de Performance

| Operação | Duração do Vídeo | Tempo Processado |
|----------|------------------|------------------|
| Análise | 5 min | ~30s |
| Criar 5 Hooks | 5 min | ~2-3 min |
| Adicionar Legendas | 5 min | ~1-2 min |
| Adicionar Música | 5 min | ~1 min |
| Compilar 5 Segmentos | 5 min | ~2-3 min |

*Tempos estimados em CPU moderna (Intel i7/AMD Ryzen 7)*

---

## 🔧 Requisitos do Sistema

### Mínimo
- Python 3.9+
- 4GB RAM
- 10GB espaço em disco
- FFmpeg 4.4+

### Recomendado
- Python 3.11+
- 8GB+ RAM
- GPU NVIDIA/AMD para aceleração
- SSD para cache temporário

---

## 📝 Exemplos de Uso

### Exemplo 1: Processar Vídeo Completo
```python
editor = VideoEditorPro()

# Etapa 1: Analisar
analysis = editor.analyze_video("video.mp4")
print(f"Picos detectados: {len(analysis['peaks'])}")

# Etapa 2: Criar hooks
hooks = editor.create_hooks("video.mp4", count=5)

# Etapa 3: Adicionar legendas
video_com_legendas, _ = editor.add_subtitles("video.mp4")

# Etapa 4: Adicionar música
video_final = editor.add_music(video_com_legendas)

print(f"✅ Processamento concluído: {video_final}")
```

### Exemplo 2: Extrair Melhores Momentos
```python
editor = VideoEditorPro()

# Gera roteiro inteligente
script = editor.generate_edit_script("video.mp4")

# Extrai recomendações de highlights
highlights = [r for r in script['recommendations'] if r['type'] == 'highlight']

# Compila melhores momentos
segments = [
    {"video": "video.mp4", "start": h['start'], "end": h['end']}
    for h in highlights[:3]
]

editor.cut_and_compile(segments, "melhores_momentos.mp4")
```

### Exemplo 3: Criar Roteiro para Revisão Manual
```python
editor = VideoEditorPro()

# Gera roteiro com recomendações
script = editor.generate_edit_script("video.mp4")

# Salva como JSON para revisão
import json
with open("edit_plan.json", "w") as f:
    json.dump(script, f, indent=2, ensure_ascii=False)

print(f"✅ Roteiro salvo: edit_plan.json")
print(f"👤 Pronto para revisão manual")
```

---

## 🚀 Roadmap

### v1.0 (Atual) ✅
- [x] Análise de vídeo com detecção de picos
- [x] Criação de hooks em múltiplos formatos
- [x] Legendas automáticas com Whisper
- [x] Sincronização de música
- [x] Compilação de segmentos
- [x] Geração de roteiros

### v1.5 (Próximo) 🔄
- [ ] Detecção de faces para zoom automático
- [ ] Geração de captions animados
- [ ] Interface visual para edição
- [ ] Integração com Runway AI

### v2.0 (Futuro) 🎯
- [ ] IA generativa para efeitos
- [ ] Sincronização de lábios
- [ ] Recomendação de duração por plataforma
- [ ] Dashboard em tempo real

---

## 🐛 Troubleshooting

### Problema: FFmpeg não encontrado
```bash
# Windows
choco install ffmpeg

# Mac
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```

### Problema: Whisper lento na primeira execução
Isso é normal - Whisper baixa o modelo na primeira vez. Use GPU para acelerar:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Problema: Memória insuficiente
Reduza a resolução em `video-editor.config.json`:
```json
{
  "video": {
    "resolution": "720p"  // Mude de 1080p
  }
}
```

---

## 📚 Recursos

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [MoviePy Documentation](https://zulko.github.io/moviepy/)
- [Librosa (Análise de Áudio)](https://librosa.org/)
- [OpenAI Whisper](https://github.com/openai/whisper)

---

## 📄 Licença

MIT License - Use livremente em seus projetos!

---

## 👤 Autor

**Opensquad Video Editor Skill**  
Desenvolvida com ❤️ para criadores de conteúdo

---

## 💬 Feedback

Encontrou um bug? Tem uma sugestão? Abra uma issue no repositório!

---

**Versão**: 1.0.0  
**Status**: ✅ Pronto para Produção  
**Última Atualização**: 16/05/2026
