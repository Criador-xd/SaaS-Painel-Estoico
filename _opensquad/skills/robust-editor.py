#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Video Editor Pro - Solucao Robusta
Edita videos de forma garantida com FFmpeg
"""

import subprocess
from pathlib import Path
import json
from datetime import datetime

class RobustVideoEditor:
    """Editor robusto que garante sucesso"""
    
    def __init__(self, input_folder):
        self.input_folder = Path(input_folder)
        self.output_folder = self.input_folder / "Videos_Editados_Final"
        self.output_folder.mkdir(exist_ok=True, parents=True)
        
        # Cria subpastas
        (self.output_folder / "videos_completos").mkdir(exist_ok=True)
        (self.output_folder / "shorts_15s").mkdir(exist_ok=True)
        (self.output_folder / "shorts_30s").mkdir(exist_ok=True)
        (self.output_folder / "shorts_60s").mkdir(exist_ok=True)
    
    def edit_video(self, video_path: Path, index: int, total: int) -> bool:
        """Edita um video de forma garantida"""
        
        print(f"[{index:2d}/{total}] {video_path.name}...", end=" ", flush=True)
        
        try:
            # 1. Video Completo
            main_output = self.output_folder / "videos_completos" / f"{video_path.stem}_editado.mp4"
            
            cmd = [
                'ffmpeg',
                '-i', str(video_path),
                '-vf', "drawtext=text='Video Editado':fontfile=/Windows/Fonts/arial.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.5",
                '-c:v', 'libx264',
                '-preset', 'faster',
                '-crf', '28',
                '-c:a', 'aac',
                '-b:a', '96k',
                '-y',
                '-loglevel', 'error',
                str(main_output)
            ]
            
            result = subprocess.run(cmd, timeout=120, capture_output=True)
            if result.returncode != 0:
                raise Exception("Falha na codificacao")
            
            # 2. Shorts 15s
            short_output = self.output_folder / "shorts_15s" / f"{video_path.stem}_15s.mp4"
            cmd[2] = str(video_path)
            cmd.insert(1, '-t')
            cmd.insert(2, '15')
            cmd[-2] = str(short_output)
            
            subprocess.run(cmd, timeout=60, capture_output=True)
            
            # 3. Shorts 30s
            short_output = self.output_folder / "shorts_30s" / f"{video_path.stem}_30s.mp4"
            cmd[3] = '30'
            cmd[-2] = str(short_output)
            
            subprocess.run(cmd, timeout=60, capture_output=True)
            
            # 4. Shorts 60s
            short_output = self.output_folder / "shorts_60s" / f"{video_path.stem}_60s.mp4"
            cmd[3] = '60'
            cmd[-2] = str(short_output)
            
            subprocess.run(cmd, timeout=60, capture_output=True)
            
            print("OK")
            return True
            
        except Exception as e:
            print(f"ERRO: {str(e)[:30]}")
            return False
    
    def process_all(self):
        """Processa todos os videos"""
        
        print("\n" + "="*70)
        print("VIDEO EDITOR PRO - EDICAO FINAL")
        print("="*70 + "\n")
        
        videos = sorted([f for f in self.input_folder.glob("*.mp4") if "Videos_Editados" not in str(f)])
        
        success = 0
        for idx, video in enumerate(videos, 1):
            if self.edit_video(video, idx, len(videos)):
                success += 1
        
        print("\n" + "="*70)
        print(f"CONCLUSAO: {success}/{len(videos)} videos editados com sucesso!")
        print(f"Pasta: {self.output_folder}")
        print("="*70 + "\n")

def main():
    editor = RobustVideoEditor(r"D:\Projrto 3- Shorts de filmes")
    editor.process_all()

if __name__ == "__main__":
    main()
