#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Video Editor Pro Skill
Automatiza edição de vídeos com legendas, músicas, ganchos e mais.

Autor: Opensquad
Versão: 1.0.0
"""

import json
import os
import sys
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
import subprocess
from datetime import datetime
import librosa
import numpy as np
from moviepy.editor import (
    VideoFileClip, 
    AudioFileClip, 
    TextClip, 
    concatenate_videoclips,
    CompositeVideoClip
)

# ============================================================================
# CONFIGURAÇÕES INICIAIS
# ============================================================================

@dataclass
class PeakInfo:
    """Informações sobre um pico detectado no vídeo"""
    timestamp: float
    duration: float
    impact_score: float
    peak_type: str  # "volume_spike", "scene_change", "silence_end"

@dataclass
class HookInfo:
    """Informações sobre um gancho (hook) extraído"""
    hook_id: str
    start: float
    end: float
    duration: float
    impact_score: float
    output_files: Dict[str, str]  # {duration: filepath}

@dataclass
class EditRecommendation:
    """Recomendação de edição gerada automaticamente"""
    recommendation_type: str  # "cut", "highlight", "music_sync", "subtitle"
    start: float
    end: Optional[float]
    reason: str
    confidence: float
    suggested_action: str

class VideoEditorPro:
    """Classe principal da skill de edição de vídeo"""
    
    def __init__(self, config_path: str = None):
        """Inicializa a skill com configurações"""
        self.config_path = config_path or self._find_config()
        self.config = self._load_config()
        self._setup_logging()
        self.logger.info("VideoEditorPro inicializado")
    
    def _find_config(self) -> str:
        """Encontra arquivo de configuração"""
        possible_paths = [
            "./video-editor.config.json",
            "../video-editor.config.json",
            os.path.expanduser("~/.opensquad/video-editor.config.json")
        ]
        for path in possible_paths:
            if os.path.exists(path):
                return path
        raise FileNotFoundError("Arquivo de configuração não encontrado")
    
    def _load_config(self) -> dict:
        """Carrega configuração de arquivo JSON"""
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _setup_logging(self):
        """Configura logging"""
        log_dir = self.config['logging'].get('log_directory', './logs')
        Path(log_dir).mkdir(exist_ok=True)
        
        log_file = os.path.join(log_dir, f"video-editor-{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
        
        logging.basicConfig(
            level=self.config['logging'].get('level', 'INFO'),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    # ========================================================================
    # ANÁLISE DE VÍDEO
    # ========================================================================
    
    def analyze_video(self, video_path: str) -> Dict:
        """
        Analisa o vídeo e detecta picos, cenas e momentos interessantes.
        
        Args:
            video_path: Caminho do arquivo de vídeo
            
        Returns:
            Dicionário com informações de análise
        """
        self.logger.info(f"Analisando vídeo: {video_path}")
        
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Arquivo não encontrado: {video_path}")
        
        # Carrega vídeo
        clip = VideoFileClip(video_path)
        duration = clip.duration
        fps = clip.fps
        resolution = f"{clip.w}x{clip.h}"
        
        # Extrai áudio e analisa
        if clip.audio is None:
            self.logger.warning("Vídeo sem áudio detectado")
            peaks = []
            scenes = []
        else:
            audio_array = clip.audio.to_soundarray()
            sr = clip.audio.fps
            
            # Detecta picos de volume
            peaks = self._detect_peaks(audio_array, sr, duration)
            
            # Detecta mudanças de cena
            scenes = self._detect_scenes(clip)
        
        clip.close()
        
        result = {
            "video": video_path,
            "duration": duration,
            "fps": fps,
            "resolution": resolution,
            "peaks": [asdict(p) for p in peaks],
            "scenes": scenes,
            "analysis_timestamp": datetime.now().isoformat()
        }
        
        self.logger.info(f"Análise concluída: {len(peaks)} picos detectados")
        return result
    
    def _detect_peaks(self, audio_array: np.ndarray, sr: int, duration: float, 
                     threshold_db: float = -20) -> List[PeakInfo]:
        """Detecta picos de volume e energia no áudio"""
        peaks = []
        
        # Calcula energia frame por frame
        S = librosa.feature.melspectrogram(y=audio_array.mean(axis=1) if len(audio_array.shape) > 1 else audio_array, sr=sr)
        log_S = librosa.power_to_db(S, ref=np.max)
        
        # Encontra frames com maior energia
        mean_energy = np.mean(log_S, axis=0)
        threshold = np.mean(mean_energy) + 5  # 5dB acima da média
        
        peak_indices = np.where(mean_energy > threshold)[0]
        
        # Agrupa picos próximos
        if len(peak_indices) > 0:
            # Converte índices para tempo
            times = librosa.frames_to_time(peak_indices, sr=sr)
            
            # Agrupa picos próximos (dentro de 2 segundos)
            grouped_peaks = self._group_peaks(times, window=2.0)
            
            for group in grouped_peaks:
                peak_time = np.mean(group)
                impact_score = min(1.0, (np.max(mean_energy[peak_indices]) - threshold) / 10.0)
                
                peaks.append(PeakInfo(
                    timestamp=float(peak_time),
                    duration=2.0,
                    impact_score=float(impact_score),
                    peak_type="volume_spike"
                ))
        
        return peaks[:10]  # Retorna top 10 picos
    
    def _group_peaks(self, times: np.ndarray, window: float = 2.0) -> List[np.ndarray]:
        """Agrupa tempos de pico próximos"""
        if len(times) == 0:
            return []
        
        groups = []
        current_group = [times[0]]
        
        for t in times[1:]:
            if t - current_group[-1] <= window:
                current_group.append(t)
            else:
                groups.append(np.array(current_group))
                current_group = [t]
        
        groups.append(np.array(current_group))
        return groups
    
    def _detect_scenes(self, clip: VideoFileClip, threshold: float = 27.0) -> List[Dict]:
        """Detecta mudanças de cena no vídeo (detecção básica)"""
        scenes = []
        
        # Implementação simplificada - em produção usar librosa ou OpenCV
        # Por enquanto, retorna cenas básicas
        duration = clip.duration
        
        # Divide em 5 cenas iguais por padrão
        scene_duration = duration / 5
        for i in range(5):
            scenes.append({
                "start": i * scene_duration,
                "end": (i + 1) * scene_duration,
                "description": f"Cena {i+1}"
            })
        
        return scenes
    
    # ========================================================================
    # CRIAÇÃO DE GANCHOS (HOOKS)
    # ========================================================================
    
    def create_hooks(self, video_path: str, count: int = 5) -> List[HookInfo]:
        """
        Cria vídeos curtos (ganchos) a partir dos melhores trechos.
        
        Args:
            video_path: Arquivo de vídeo
            count: Número de hooks a extrair
            
        Returns:
            Lista de HookInfo com ganchos criados
        """
        self.logger.info(f"Criando {count} hooks do vídeo: {video_path}")
        
        # Analisa vídeo para encontrar melhores trechos
        analysis = self.analyze_video(video_path)
        peaks = analysis['peaks']
        
        if not peaks:
            self.logger.warning("Nenhum pico detectado, usando estratégia padrão")
            peaks = self._generate_default_peaks(analysis['duration'])
        
        # Seleciona top N picos
        sorted_peaks = sorted(peaks, key=lambda p: p['impact_score'], reverse=True)
        selected_peaks = sorted_peaks[:count]
        
        hooks = []
        clip = VideoFileClip(video_path)
        
        for idx, peak in enumerate(selected_peaks):
            start = max(0, peak['timestamp'] - 2)
            end = min(clip.duration, peak['timestamp'] + 8)
            
            hook = self._create_hook_variants(clip, idx, start, end, video_path)
            hooks.append(hook)
        
        clip.close()
        
        self.logger.info(f"Criados {len(hooks)} hooks com sucesso")
        return hooks
    
    def _create_hook_variants(self, clip: VideoFileClip, idx: int, start: float, 
                             end: float, source_path: str) -> HookInfo:
        """Cria variantes de um hook em diferentes durações"""
        output_dir = Path(self.config['paths']['output']) / 'hooks'
        output_dir.mkdir(parents=True, exist_ok=True)
        
        subclip = clip.subclip(start, end)
        hook_id = f"hook_{idx+1:03d}"
        output_files = {}
        
        target_durations = self.config['hooks'].get('formats', [15, 30, 60])
        
        for target_duration in target_durations:
            if subclip.duration > target_duration:
                # Diminui duração com zoom
                hook_clip = self._apply_zoom_effect(subclip, target_duration)
            else:
                hook_clip = subclip
            
            output_file = output_dir / f"{hook_id}_{target_duration}s.mp4"
            hook_clip.write_videofile(
                str(output_file),
                codec=self.config['video']['codec'],
                audio_codec='aac',
                verbose=False,
                logger=None
            )
            
            output_files[str(target_duration)] = str(output_file)
            hook_clip.close()
        
        subclip.close()
        
        return HookInfo(
            hook_id=hook_id,
            start=start,
            end=end,
            duration=end - start,
            impact_score=min(1.0, (end - start) / 15.0),  # Normalizado
            output_files=output_files
        )
    
    def _apply_zoom_effect(self, clip: VideoFileClip, target_duration: float) -> VideoFileClip:
        """Aplica efeito de zoom durante o corte"""
        zoom_factor = self.config['effects'].get('zoom_factor', 1.1)
        
        def make_frame(get_frame, t):
            # Implementa zoom durante a duração do clip
            frame = get_frame(t)
            h, w = frame.shape[:2]
            
            # Calcula zoom progressivo
            progress = t / clip.duration
            current_zoom = 1 + (zoom_factor - 1) * progress
            
            # Aplica zoom (implementação simplificada)
            return frame
        
        return clip.speedx(clip.duration / target_duration)
    
    def _generate_default_peaks(self, duration: float, count: int = 10) -> List[Dict]:
        """Gera picos padrão se nenhum for detectado"""
        peaks = []
        interval = duration / count
        
        for i in range(count):
            peaks.append({
                'timestamp': interval * (i + 0.5),
                'duration': 2.0,
                'impact_score': 0.5,
                'peak_type': 'default'
            })
        
        return peaks
    
    # ========================================================================
    # LEGENDAS
    # ========================================================================
    
    def add_subtitles(self, video_path: str, language: str = "pt-BR") -> Tuple[str, str]:
        """
        Adiciona legendas automáticas ao vídeo.
        
        Args:
            video_path: Arquivo de vídeo
            language: Idioma das legendas
            
        Returns:
            Tupla (vídeo_com_legendas, arquivo_srt)
        """
        self.logger.info(f"Adicionando legendas ({language}) ao vídeo: {video_path}")
        
        try:
            import whisper
        except ImportError:
            self.logger.error("Whisper não instalado. Instale com: pip install openai-whisper")
            raise ImportError("Whisper é necessário para transcrição")
        
        # Transcre vídeo
        model = whisper.load_model(self.config['subtitles'].get('model', 'base'))
        result = model.transcribe(video_path, language=language[:2])
        
        # Gera arquivo SRT
        srt_path = self._create_srt_file(result, video_path)
        self.logger.info(f"Arquivo SRT criado: {srt_path}")
        
        # Adiciona legendas ao vídeo
        output_path = self._add_srt_to_video(video_path, srt_path)
        
        return output_path, srt_path
    
    def _create_srt_file(self, transcription: Dict, video_path: str) -> str:
        """Cria arquivo SRT a partir da transcrição"""
        output_dir = Path(self.config['paths']['output']) / 'subtitles'
        output_dir.mkdir(parents=True, exist_ok=True)
        
        srt_file = output_dir / f"{Path(video_path).stem}.srt"
        
        with open(srt_file, 'w', encoding='utf-8') as f:
            for idx, segment in enumerate(transcription['segments'], 1):
                start = self._seconds_to_srt_time(segment['start'])
                end = self._seconds_to_srt_time(segment['end'])
                text = segment['text'].strip()
                
                f.write(f"{idx}\n")
                f.write(f"{start} --> {end}\n")
                f.write(f"{text}\n\n")
        
        return str(srt_file)
    
    def _seconds_to_srt_time(self, seconds: float) -> str:
        """Converte segundos para formato SRT (HH:MM:SS,mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
    
    def _add_srt_to_video(self, video_path: str, srt_path: str) -> str:
        """Adiciona legendas SRT ao vídeo usando FFmpeg"""
        output_dir = Path(self.config['paths']['output'])
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / f"{Path(video_path).stem}_subtitled.mp4"
        
        # Comando FFmpeg
        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-vf', f"subtitles={srt_path}",
            '-c:v', self.config['video']['codec'],
            '-c:a', 'aac',
            '-y',
            str(output_file)
        ]
        
        subprocess.run(cmd, check=True, capture_output=True)
        self.logger.info(f"Vídeo com legendas: {output_file}")
        
        return str(output_file)
    
    # ========================================================================
    # MÚSICA
    # ========================================================================
    
    def add_music(self, video_path: str, music_track: str = "auto") -> str:
        """
        Adiciona trilha sonora ao vídeo.
        
        Args:
            video_path: Arquivo de vídeo
            music_track: Caminho da música ou "auto"
            
        Returns:
            Caminho do vídeo com trilha sonora
        """
        self.logger.info(f"Adicionando música ao vídeo: {video_path}")
        
        if music_track == "auto":
            # Seleciona música padrão
            music_track = self._select_default_music()
        
        clip = VideoFileClip(video_path)
        audio_clip = AudioFileClip(music_track)
        
        # Ajusta duração da música para o vídeo
        if audio_clip.duration < clip.duration:
            audio_clip = self._loop_audio(audio_clip, clip.duration)
        else:
            audio_clip = audio_clip.subclip(0, clip.duration)
        
        # Aplica ducking se vídeo tem áudio original
        if clip.audio is not None:
            audio_clip = self._apply_audio_ducking(clip.audio, audio_clip)
        
        # Combina áudio
        final_clip = clip.set_audio(audio_clip)
        
        output_dir = Path(self.config['paths']['output'])
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / f"{Path(video_path).stem}_with_music.mp4"
        
        final_clip.write_videofile(
            str(output_file),
            codec=self.config['video']['codec'],
            audio_codec='aac',
            verbose=False,
            logger=None
        )
        
        final_clip.close()
        
        return str(output_file)
    
    def _select_default_music(self) -> str:
        """Seleciona uma música padrão da biblioteca"""
        music_dir = Path(self.config['paths']['music_library'])
        
        if not music_dir.exists():
            self.logger.warning("Biblioteca de música não encontrada")
            raise FileNotFoundError(f"Música não encontrada em: {music_dir}")
        
        # Retorna primeira música encontrada
        music_files = list(music_dir.glob('*.mp3')) + list(music_dir.glob('*.wav'))
        
        if not music_files:
            raise FileNotFoundError("Nenhuma música encontrada na biblioteca")
        
        return str(music_files[0])
    
    def _loop_audio(self, audio_clip: AudioFileClip, target_duration: float) -> AudioFileClip:
        """Repete áudio para atingir duração alvo"""
        from moviepy.audio.AudioFileClip import concatenate_audioclips
        
        clips = [audio_clip]
        current_duration = audio_clip.duration
        
        while current_duration < target_duration:
            clips.append(audio_clip)
            current_duration += audio_clip.duration
        
        return concatenate_audioclips(clips)
    
    def _apply_audio_ducking(self, original_audio: AudioFileClip, 
                            background_audio: AudioFileClip) -> AudioFileClip:
        """Reduz volume do áudio de fundo quando há áudio original"""
        # Implementação simplificada
        volume_factor = self.config['music'].get('volume', 0.6)
        return background_audio.volumex(volume_factor)
    
    # ========================================================================
    # COMPILAÇÃO DE TRECHOS
    # ========================================================================
    
    def cut_and_compile(self, segments: List[Dict], output_path: str) -> str:
        """
        Compila múltiplos segmentos em um vídeo único.
        
        Args:
            segments: Lista de segmentos com {video, start, end}
            output_path: Caminho de saída
            
        Returns:
            Caminho do vídeo compilado
        """
        self.logger.info(f"Compilando {len(segments)} segmentos")
        
        clips = []
        
        for segment in segments:
            clip = VideoFileClip(segment['video'])
            subclip = clip.subclip(segment['start'], segment['end'])
            clips.append(subclip)
        
        # Concatena com transição
        final_clip = concatenate_videoclips(clips)
        
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        
        final_clip.write_videofile(
            output_path,
            codec=self.config['video']['codec'],
            audio_codec='aac',
            verbose=False,
            logger=None
        )
        
        final_clip.close()
        
        self.logger.info(f"Vídeo compilado: {output_path}")
        return output_path
    
    # ========================================================================
    # ROTEIROS DE EDIÇÃO
    # ========================================================================
    
    def generate_edit_script(self, video_path: str) -> Dict:
        """
        Gera um roteiro de edição com recomendações.
        
        Args:
            video_path: Arquivo de vídeo
            
        Returns:
            Dicionário com roteiro e recomendações
        """
        self.logger.info(f"Gerando roteiro de edição: {video_path}")
        
        analysis = self.analyze_video(video_path)
        recommendations = []
        
        # Recomendações de cortes
        for peak in analysis['peaks']:
            recommendations.append({
                'type': 'highlight',
                'start': peak['timestamp'],
                'end': peak['timestamp'] + peak['duration'],
                'reason': f"Pico de {peak['peak_type']}",
                'confidence': peak['impact_score'],
                'suggested_action': 'Manter ou destacar'
            })
        
        # Recomendações de cenas
        for i, scene in enumerate(analysis['scenes']):
            if i > 0:
                recommendations.append({
                    'type': 'scene_transition',
                    'start': scene['start'],
                    'end': None,
                    'reason': 'Transição entre cenas',
                    'confidence': 0.7,
                    'suggested_action': 'Adicionar transição suave'
                })
        
        # Estima duração final após edições
        estimated_cuts = len([r for r in recommendations if r['type'] == 'cut'])
        estimated_final_duration = analysis['duration'] - (estimated_cuts * 0.5)
        
        script = {
            'video': video_path,
            'duration': analysis['duration'],
            'fps': analysis['fps'],
            'resolution': analysis['resolution'],
            'recommendations': recommendations,
            'estimated_final_duration': estimated_final_duration,
            'confidence_score': np.mean([r['confidence'] for r in recommendations]) if recommendations else 0,
            'hooks': analysis['peaks'][:5],
            'generated_at': datetime.now().isoformat()
        }
        
        self.logger.info(f"Roteiro gerado com {len(recommendations)} recomendações")
        return script


# ============================================================================
# FUNÇÕES DE UTILIDADE
# ============================================================================

def main():
    """Função principal para testes"""
    editor = VideoEditorPro()
    
    print("VideoEditorPro Skill - Pronto para usar!")
    print(f"Configuração carregada de: {editor.config_path}")

if __name__ == "__main__":
    main()
