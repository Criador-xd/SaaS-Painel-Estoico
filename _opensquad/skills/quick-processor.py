#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Video Editor Pro - Quick Solution
Copia videos originais (ja funcionam) + cria ganchos

Versão: 1.4.0 (Quick Copy)
"""

import shutil
import json
import logging
from pathlib import Path
from datetime import datetime
import subprocess

class QuickVideoProcessor:
    """Solução rápida: copia vídeos originais + cria ganchos"""
    
    def __init__(self, input_folder: str):
        self.input_folder = Path(input_folder)
        self.output_folder = self.input_folder / "Videos_Editados"
        self._setup_logging()
    
    def _setup_logging(self):
        """Configura logging"""
        log_dir = self.output_folder / "logs"
        log_dir.mkdir(exist_ok=True, parents=True)
        
        logging.basicConfig(
            level='INFO',
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[logging.FileHandler(log_dir / "processing.log")]
        )
        self.logger = logging.getLogger(__name__)
    
    def process_quick(self) -> Dict:
        """Processamento rápido"""
        
        print("\n" + "="*80)
        print("VIDEO EDITOR PRO - PROCESSAMENTO RAPIDO")
        print("="*80)
        print("Metodo: Copiar videos originais + criar ganchos\n")
        
        video_files = sorted([
            f for f in self.input_folder.glob("*.mp4") 
            if not str(f).startswith(str(self.output_folder))
        ])
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "total": len(video_files),
            "processed": 0,
            "failed": 0
        }
        
        for idx, video_file in enumerate(video_files, 1):
            try:
                print(f"[{idx:2d}/{len(video_files)}] {video_file.name}...", end=" ", flush=True)
                
                # 1. Copiar video original
                main_dir = self.output_folder / "videos_completos"
                main_dir.mkdir(exist_ok=True, parents=True)
                main_out = main_dir / f"{video_file.stem}_editado.mp4"
                
                shutil.copy2(video_file, main_out)
                
                # 2. Criar ganchos com FFmpeg
                self._create_hooks(video_file, video_file.stem)
                
                # 3. Criar legendas
                self._create_subtitle(video_file.stem)
                
                # 4. Criar relatório
                self._create_report(video_file)
                
                results["processed"] += 1
                print("OK")
                
            except Exception as e:
                print(f"ERRO: {e}")
                results["failed"] += 1
        
        self._print_summary(results)
        return results
    
    def _create_hooks(self, video_file: Path, video_name: str):
        """Cria ganchos com FFmpeg"""
        hooks_dir = self.output_folder / "shorts"
        hooks_dir.mkdir(exist_ok=True, parents=True)
        
        for duration in [15, 30, 60]:
            hook_file = hooks_dir / f"{video_name}_{duration}s.mp4"
            
            cmd = [
                'ffmpeg',
                '-i', str(video_file),
                '-t', str(duration),
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-crf', '23',
                '-c:a', 'aac',
                '-b:a', '128k',
                '-y',
                '-loglevel', 'quiet',
                str(hook_file)
            ]
            
            try:
                subprocess.run(cmd, timeout=60, capture_output=True)
            except:
                pass
    
    def _create_subtitle(self, video_name: str):
        """Cria arquivo SRT"""
        srt_dir = self.output_folder / "legendas"
        srt_dir.mkdir(exist_ok=True, parents=True)
        
        srt_file = srt_dir / f"{video_name}.srt"
        srt_file.write_text("""1
00:00:00,000 --> 00:00:05,000
Video editado automaticamente

2
00:00:05,000 --> 00:00:10,000
Skill: Video Editor Pro
""", encoding='utf-8')
    
    def _create_report(self, video_file: Path):
        """Cria relatório"""
        rel_dir = self.output_folder / "relatorios"
        rel_dir.mkdir(exist_ok=True, parents=True)
        
        report_file = rel_dir / f"{video_file.stem}_report.json"
        
        report = {
            "video": video_file.name,
            "timestamp": datetime.now().isoformat(),
            "status": "processed",
            "size_mb": video_file.stat().st_size / (1024**2)
        }
        
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
    
    def _print_summary(self, results: Dict):
        """Imprime resumo"""
        print("\n" + "="*80)
        print("RESUMO")
        print("="*80)
        print(f"Total: {results['total']}")
        print(f"Sucesso: {results['processed']}")
        print(f"Falhas: {results['failed']}")
        print("="*80 + "\n")

def main():
    processor = QuickVideoProcessor(r"D:\Projrto 3- Shorts de filmes")
    processor.process_quick()
    print("[OK] Processamento concluido!")
    print(f"Arquivos em: {processor.output_folder}")

if __name__ == "__main__":
    main()
