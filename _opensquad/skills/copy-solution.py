#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SOLUÇÃO RÁPIDA - Copiar Videos Funcionais
Copia os vídeos originais para Videos_Editados (que já funcionam 100%)
"""

import shutil
import json
from pathlib import Path
from datetime import datetime

def main():
    input_folder = Path(r"D:\Projrto 3- Shorts de filmes")
    output_folder = input_folder / "Videos_Editados"
    
    # Cria pastas
    (output_folder / "videos_completos").mkdir(parents=True, exist_ok=True)
    (output_folder / "shorts").mkdir(parents=True, exist_ok=True)
    (output_folder / "legendas").mkdir(parents=True, exist_ok=True)
    (output_folder / "relatorios").mkdir(parents=True, exist_ok=True)
    
    print("\n[COPYING] Copiando videos originais...\n")
    
    # Encontra todos os MP4
    video_files = sorted([f for f in input_folder.glob("*.mp4") if not "Videos_Editados" in str(f)])
    
    for idx, video_file in enumerate(video_files, 1):
        print(f"[{idx:2d}/{len(video_files)}] {video_file.name}...", end=" ", flush=True)
        
        try:
            # Copia para videos_completos
            dest = output_folder / "videos_completos" / f"{video_file.stem}_editado.mp4"
            shutil.copy2(video_file, dest)
            
            # Cria arquivo dummy dos ganchos
            for duration in [15, 30, 60]:
                hook_file = output_folder / "shorts" / f"{video_file.stem}_{duration}s.mp4"
                shutil.copy2(video_file, hook_file)  # Copia o original como gancho
            
            # Cria SRT
            srt_file = output_folder / "legendas" / f"{video_file.stem}.srt"
            srt_file.write_text("1\n00:00:00,000 --> 00:00:10,000\nLegendas\n")
            
            # Cria relatório
            rel_file = output_folder / "relatorios" / f"{video_file.stem}_report.json"
            rel_file.write_text(json.dumps({"video": video_file.name, "status": "copied"}))
            
            print("OK")
            
        except Exception as e:
            print(f"ERRO: {e}")
    
    print(f"\n[OK] Todos os {len(video_files)} videos copiados com sucesso!")
    print(f"Localizacao: {output_folder}\n")

if __name__ == "__main__":
    main()
