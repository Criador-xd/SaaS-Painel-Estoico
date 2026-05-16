#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Video Editor Pro v2.0 - Monitor de Progresso
Acompanha o processamento em tempo real
"""

import json
from pathlib import Path
from datetime import datetime
import time
import os

def monitor_progress():
    """Monitora o progresso do processamento"""
    
    output_dir = Path(r"D:\Projrto 3- Shorts de filmes\Videos_Editados_Pro")
    
    print("\n" + "="*80)
    print("MONITOR DE PROGRESSO - VIDEO EDITOR PRO v2.0")
    print("="*80)
    print(f"Data/Hora Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80 + "\n")
    
    folders = {
        "videos_completos": "Videos Completos",
        "shorts_15s": "Shorts 15s",
        "shorts_30s": "Shorts 30s",
        "shorts_60s": "Shorts 60s"
    }
    
    total_expected = 59 * 4  # 236 videos
    
    while True:
        total_current = 0
        
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Status:")
        print("-" * 80)
        
        for folder_name, folder_label in folders.items():
            folder_path = output_dir / folder_name
            if folder_path.exists():
                files = list(folder_path.glob("*.mp4"))
                count = len(files)
                total_current += count
                
                # Calcula tamanho
                size_mb = sum(f.stat().st_size for f in files) / (1024**2) if files else 0
                
                # Barra de progresso
                progress_percent = (count / 59) * 100
                bar_length = 30
                filled = int(bar_length * count / 59)
                bar = "[" + "=" * filled + "-" * (bar_length - filled) + "]"
                
                print(f"  {folder_label:20} {bar} {count:2d}/59 ({progress_percent:5.1f}%) | {size_mb:7.1f} MB")
        
        print("-" * 80)
        
        # Progress total
        total_percent = (total_current / total_expected) * 100
        bar_length = 40
        filled = int(bar_length * total_current / total_expected)
        total_bar = "[" + "=" * filled + "-" * (bar_length - filled) + "]"
        
        print(f"\n  TOTAL GERAL: {total_bar} {total_current:3d}/{total_expected} ({total_percent:5.1f}%)")
        
        if total_current == total_expected:
            print(f"\n[OK] PROCESSAMENTO COMPLETO!")
            print(f"Data/Hora Fim: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            break
        
        print("\n  Aguardando proxima atualizacao em 10 segundos...")
        print("  (Pressione Ctrl+C para parar de monitorar)")
        
        time.sleep(10)

if __name__ == "__main__":
    try:
        monitor_progress()
    except KeyboardInterrupt:
        print("\n\n[INFO] Monitoramento interrompido pelo usuario")
        print("Os videos continuam sendo processados em background")
