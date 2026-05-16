# Skill: Video Editor Pro 🎬

## Visão Geral
Skill autônoma de edição de vídeo que automatiza a criação de conteúdo visual profissional. Capaz de:
- ✂️ Cortar e compilar trechos de vídeos
- 📝 Adicionar legendas automáticas
- 🎵 Sincronizar e adicionar música de fundo
- 🎯 Extrair momentos de pico para criar ganchos (hooks)
- 🎨 Aplicar efeitos e transições
- 📊 Gerar roteiros de edição para revisão manual

---

## Características Principais

### 1. **Detecção de Momentos de Pico**
- Análise de áudio para identificar picos de volume/energia
- Detecção de mudanças de cena (cut detection)
- Identificação de silêncios longos
- Scoring automático de "impacto" para cada segmento

### 2. **Criação de Ganchos (Hooks)**
- Extrai os 3-5 trechos mais impactantes do vídeo
- Cria versões curtas (15s, 30s, 60s) otimizadas para Reels/Shorts
- Adiciona transições suaves e zoom em pontos críticos
- Exporta como vídeo independente com melhor engajamento

### 3. **Legendas Automáticas**
- Transcrição de áudio (via Whisper ou legendas fornecidas)
- Sincronização automática com timing do vídeo
- Formatação para diferentes plataformas
- Suporte a múltiplos idiomas
- Estilos de legenda customizáveis

### 4. **Sincronização de Música**
- Biblioteca de músicas copyright-free
- Detecção de BPM do vídeo
- Sincronização de batida automática
- Fade in/out inteligente
- Ajuste de volume adaptativo

### 5. **Compilação de Trechos**
- Corte e junção de múltiplos segmentos
- Transições suaves entre cortes
- Ajuste automático de duração
- Preservação de qualidade original

### 6. **Roteiros de Edição**
- Exportação em JSON para edição manual
- Timeline visual em formato texto
- Recomendações de cortes e efeitos
- Rastreamento de decisões de edição

---

## Stack Tecnológico

### Dependências
```
FFmpeg 7.0+          # Processamento de vídeo/áudio
Python 3.11+         # Orquestração
moviepy 1.0.3        # Edição de vídeo em Python
openai-whisper       # Transcrição de áudio
pydub               # Processamento de áudio
librosa             # Análise de áudio (BPM, energia)
opencv-python       # Detecção de cenas
json                # Geração de roteiros
```

### Integração com Squads
- Entrada: Vídeo bruto (MP4, MOV, WEBM)
- Saída: Vídeo editado + Roteiro JSON
- Modo: Síncrono (aguarda conclusão)
- Timeout: Configurável por tamanho de arquivo

---

## Configuração

### Arquivo: `video-editor.config.json`

```json
{
  "paths": {
    "input": "./videos/raw",
    "output": "./videos/edited",
    "temp": "./videos/temp",
    "music_library": "./assets/music"
  },
  "video": {
    "min_duration": 10,
    "max_duration": 900,
    "allowed_formats": ["mp4", "mov", "webm"],
    "output_format": "mp4",
    "resolution": "1080p"
  },
  "hooks": {
    "enabled": true,
    "count": 5,
    "min_duration": 15,
    "max_duration": 60,
    "impact_threshold": 0.7
  },
  "subtitles": {
    "enabled": true,
    "language": "pt-BR",
    "model": "base",
    "style": "modern"
  },
  "music": {
    "enabled": true,
    "volume": 0.6,
    "fade_duration": 2.0,
    "auto_sync_bpm": true
  },
  "effects": {
    "transitions": "fade",
    "zoom_on_highlights": true,
    "color_correction": true
  }
}
```

---

## Interface da Skill

### Métodos Principais

#### 1. `analyze_video(video_path: str) → dict`
Analisa o vídeo e retorna dados de picos/momentos interessantes.

**Entrada:**
- `video_path`: Caminho do arquivo de vídeo

**Saída:**
```json
{
  "duration": 300,
  "resolution": "1920x1080",
  "fps": 30,
  "peaks": [
    {
      "timestamp": 45.3,
      "duration": 8,
      "impact_score": 0.92,
      "type": "volume_spike"
    }
  ],
  "scenes": [
    {"start": 0, "end": 45, "description": "Intro"}
  ]
}
```

---

#### 2. `create_hooks(video_path: str, count: int = 5) → list`
Extrai os melhores trechos e cria vídeos curtos para ganchos.

**Entrada:**
- `video_path`: Arquivo de vídeo
- `count`: Número de hooks a extrair

**Saída:**
```json
[
  {
    "id": "hook_001",
    "start": 45.3,
    "end": 60.2,
    "duration": 14.9,
    "impact_score": 0.95,
    "output_file": "hook_001_15s.mp4",
    "formats": {
      "15s": "hook_001_15s.mp4",
      "30s": "hook_001_30s.mp4",
      "60s": "hook_001_60s.mp4"
    }
  }
]
```

---

#### 3. `add_subtitles(video_path: str, language: str = "pt-BR") → str`
Adiciona legendas automáticas ao vídeo.

**Entrada:**
- `video_path`: Arquivo de vídeo
- `language`: Idioma das legendas

**Saída:**
- Caminho do vídeo com legendas + arquivo `.srt`

---

#### 4. `add_music(video_path: str, music_track: str = "auto") → str`
Sincroniza e adiciona trilha sonora ao vídeo.

**Entrada:**
- `video_path`: Arquivo de vídeo
- `music_track`: Arquivo de música ou "auto" para seleção automática

**Saída:**
- Caminho do vídeo com trilha sonora

---

#### 5. `cut_and_compile(segments: list, output_path: str) → str`
Compila múltiplos segmentos em um vídeo único.

**Entrada:**
```json
{
  "segments": [
    {
      "video": "video.mp4",
      "start": 10,
      "end": 30
    },
    {
      "video": "video.mp4",
      "start": 50,
      "end": 80
    }
  ],
  "output_path": "compiled.mp4"
}
```

**Saída:**
- Caminho do vídeo compilado

---

#### 6. `generate_edit_script(video_path: str) → dict`
Gera um roteiro de edição com recomendações.

**Saída:**
```json
{
  "video": "input.mp4",
  "duration": 300,
  "recommendations": [
    {
      "type": "cut",
      "start": 10,
      "end": 15,
      "reason": "Pausa longa detectada",
      "confidence": 0.85
    },
    {
      "type": "highlight",
      "start": 45,
      "end": 60,
      "reason": "Pico de energia e volume",
      "confidence": 0.92
    }
  ],
  "estimated_final_duration": 250,
  "hooks": [...]
}
```

---

## Workflow de Uso

### Cenário 1: Criar Shorts/Reels (Rápido)
```
1. [INPUT] Vídeo bruto (5-15 min)
2. [ANALYZE] Detectar picos e momentos interessantes
3. [CREATE_HOOKS] Extrair 5 melhores trechos em 3 formatos (15s/30s/60s)
4. [ADD_MUSIC] Sincronizar com trilha sonora
5. [OUTPUT] 15 vídeos prontos para publicar
⏱️ Tempo: ~5-10 min por vídeo
```

### Cenário 2: Edição Completa
```
1. [INPUT] Vídeo bruto
2. [ANALYZE] Identificar seções/cenas
3. [GENERATE_SCRIPT] Criar roteiro com recomendações
4. [CUT_AND_COMPILE] Aplicar cortes automáticos
5. [ADD_SUBTITLES] Adicionar legendas
6. [ADD_MUSIC] Sincronizar trilha sonora
7. [OUTPUT] Vídeo editado + roteiro JSON para revisão
⏱️ Tempo: ~10-20 min por vídeo
```

### Cenário 3: Edição Híbrida (Recomendado)
```
1. [INPUT] Vídeo bruto
2. [ANALYZE] Análise completa
3. [GENERATE_SCRIPT] Roteiro com recomendações
👤 [HUMAN REVIEW] Revisor aprova/rejeita cortes
4. [CUT_AND_COMPILE] Aplicar edições aprovadas
5. [ADD_SUBTITLES] Legendas
6. [ADD_MUSIC] Trilha sonora
7. [CREATE_HOOKS] Extrair 5 ganchos automáticos
8. [OUTPUT] 1 vídeo principal + 15 shorts
⏱️ Tempo: ~15-25 min com revisão humana
```

---

## Limites e Restrições

| Parâmetro | Limite | Justificativa |
|-----------|--------|---------------|
| Duração máx. do vídeo | 30 min | Processamento em tempo razoável |
| Resolução máx. | 4K (4096x2160) | Limitação de I/O |
| Simultaneidade | 1 vídeo por GPU | Requer recursos consideráveis |
| Tamanho máx. | 5GB | Espaço em disco |
| Hooks por vídeo | Máx. 10 | Processamento eficiente |

---

## Monitoramento e Logs

### Estrutura de Saída
```
output/
├── videos/
│   ├── main_video_edited.mp4
│   ├── hooks/
│   │   ├── hook_001_15s.mp4
│   │   ├── hook_001_30s.mp4
│   │   ├── hook_002_15s.mp4
│   │   └── ...
│   └── subtitles/
│       └── main_video.srt
├── scripts/
│   ├── edit_script.json
│   └── timeline.txt
└── logs/
    ├── processing.log
    └── errors.log
```

---

## Próximas Evoluções

### v1.5 (Próximo)
- [ ] Detecção de faces para zoom automático
- [ ] Geração de captions animados
- [ ] Biblioteca de efeitos customizáveis
- [ ] Integração com Runway ML

### v2.0 (Futuro)
- [ ] IA generativa para efeitos visuais
- [ ] Sincronização de lábios com legendas
- [ ] Recomendação de melhor duração por plataforma
- [ ] Dashboard de preview em tempo real

---

## Status
✅ **MVP Completo** | Pronto para integração em squads

---

## Autor
**Opensquad Video Editor Skill**
Criada em: 16/05/2026
Versão: 1.0.0
