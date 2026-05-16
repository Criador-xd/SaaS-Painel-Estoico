# Guia de Integração: Video Editor Pro Skill

## Como usar a skill em seus Squads

### 1. **Instalação de Dependências**

```bash
pip install moviepy librosa openai-whisper opencv-python pydub numpy
```

Você também precisa de FFmpeg instalado:
- **Windows**: `choco install ffmpeg` ou baixar de https://ffmpeg.org/download.html
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`

---

### 2. **Integração em um Squad**

Adicione a skill ao seu `squad.yaml`:

```yaml
# squads/seu-squad/squad.yaml

skills:
  - name: "video-editor"
    path: "../_opensquad/skills/video-editor.py"
    config: "../_opensquad/skills/video-editor.config.json"
    version: "1.0.0"
```

---

### 3. **Uso em Agentes**

#### Exemplo 1: Criar Ganchos Automaticamente

```python
from _opensquad.skills.video_editor import VideoEditorPro

# Inicializa a skill
editor = VideoEditorPro()

# Cria 5 hooks automáticos
hooks = editor.create_hooks(
    video_path="./videos/video.mp4",
    count=5
)

# Exibe resultados
for hook in hooks:
    print(f"Hook {hook.hook_id}:")
    print(f"  - 15s: {hook.output_files.get('15', 'N/A')}")
    print(f"  - 30s: {hook.output_files.get('30', 'N/A')}")
    print(f"  - 60s: {hook.output_files.get('60', 'N/A')}")
```

#### Exemplo 2: Adicionar Legendas e Música

```python
editor = VideoEditorPro()

# Etapa 1: Adicionar legendas
video_com_legendas, srt_file = editor.add_subtitles(
    video_path="./videos/video.mp4",
    language="pt-BR"
)

# Etapa 2: Adicionar música
video_final = editor.add_music(
    video_path=video_com_legendas,
    music_track="auto"
)

print(f"Vídeo final: {video_final}")
```

#### Exemplo 3: Análise e Roteiro

```python
editor = VideoEditorPro()

# Analisa vídeo
analysis = editor.analyze_video("./videos/video.mp4")

print(f"Duração: {analysis['duration']}s")
print(f"Resolução: {analysis['resolution']}")
print(f"Picos detectados: {len(analysis['peaks'])}")

# Gera roteiro com recomendações
script = editor.generate_edit_script("./videos/video.mp4")

print(f"\nRecomendações de edição:")
for rec in script['recommendations'][:5]:
    print(f"  - {rec['type']}: {rec['reason']} (confiança: {rec['confidence']:.0%})")
```

#### Exemplo 4: Compilar Segmentos

```python
editor = VideoEditorPro()

segments = [
    {
        "video": "./videos/video.mp4",
        "start": 10,
        "end": 30
    },
    {
        "video": "./videos/video.mp4",
        "start": 50,
        "end": 80
    }
]

video_compilado = editor.cut_and_compile(
    segments=segments,
    output_path="./output/compilado.mp4"
)
```

---

### 4. **Configuração Personalisada**

Edite `video-editor.config.json` para customizar:

```json
{
  "hooks": {
    "count": 5,              // Número de hooks a extrair
    "formats": [15, 30, 60], // Durações em segundos
    "add_zoom": true,        // Adiciona efeito de zoom
    "impact_threshold": 0.65 // Sensibilidade de detecção
  },
  "subtitles": {
    "language": "pt-BR",
    "font_size": 32,
    "position": "bottom"
  },
  "music": {
    "volume": 0.6,          // Volume relativo (0-1)
    "auto_sync_bpm": true,  // Sincroniza com BPM do vídeo
    "ducking": true         // Reduz áudio original quando há trilha
  }
}
```

---

### 5. **Estrutura de Saída**

Após executar a skill, a estrutura de diretórios será:

```
output/
├── video_with_music.mp4       # Vídeo com trilha sonora
├── video_subtitled.mp4         # Vídeo com legendas
├── hooks/
│   ├── hook_001_15s.mp4       # Gancho de 15s
│   ├── hook_001_30s.mp4       # Gancho de 30s
│   ├── hook_001_60s.mp4       # Gancho de 60s
│   └── ...
├── subtitles/
│   └── video.srt              # Arquivo de legendas
├── scripts/
│   ├── edit_script.json       # Roteiro com recomendações
│   └── timeline.txt           # Timeline em texto
└── logs/
    └── video-editor-*.log     # Logs de processamento
```

---

## Casos de Uso em Squads

### Squad: "Content Creator"
```yaml
agents:
  - name: "analyzer"
    task: "analyze_video"
    uses_skill: "video-editor"
  
  - name: "hook_generator"
    task: "create_hooks"
    uses_skill: "video-editor"
    input: "result from analyzer"
  
  - name: "editor"
    task: "add_subtitles_and_music"
    uses_skill: "video-editor"
    input: "result from analyzer"
```

### Squad: "Social Media Manager"
```yaml
pipeline:
  [Upload] → [Analyze] → [Create Hooks] → [Publish Shorts]
                    ↓
              [Add Subtitles]
                    ↓
              [Add Music]
                    ↓
              [Publish Reels]
```

---

## Troubleshooting

### Erro: "FFmpeg não encontrado"
**Solução**: Instale FFmpeg e adicione ao PATH do sistema

### Erro: "Whisper não instalado"
**Solução**: `pip install openai-whisper`

### Processamento lento
**Solução**: 
- Reduza resolução em `video.config.json`
- Use GPU: `"gpu_enabled": true` (requer CUDA)
- Processe vídeos menores

### Saída sem áudio
**Solução**: Verifique se o vídeo de entrada possui áudio

---

## Próximas Melhorias

- [ ] Suporte a GPU (CUDA/TensorRT)
- [ ] Integração com Runway AI para efeitos
- [ ] Dashboard visual de preview
- [ ] Suporte a múltiplos idiomas para legendas
- [ ] Sincronização de lábios automática

---

**Versão**: 1.0.0  
**Última atualização**: 16/05/2026  
**Status**: Pronto para Produção ✅
