#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Video Editor Pro Skill - Versão Batch
Processa múltiplos vídeos de uma pasta com análise automática.

Autor: Opensquad
Versão: 1.1.0 (Batch Processing)
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

# ============================================================================
# BATCH VIDEO PROCESSOR
# ============================================================================

class BatchVideoProcessor:
    """Processa múltiplos vídeos em lote"""
    
    def __init__(self, input_folder: str):
        """
        Inicializa o processador de lote
        
        Args:
            input_folder: Caminho da pasta com vídeos a processar
        """
        self.input_folder = Path(input_folder)
        self.output_folder = self.input_folder / "Videos_Editados"
        self.config_path = self._find_config()
        self.config = self._load_config()
        self._setup_logging()
        self.logger.info(f"BatchVideoProcessor inicializado para: {self.input_folder}")
    
    def _find_config(self) -> str:
        """Encontra arquivo de configuração"""
        possible_paths = [
            "./video-editor.config.json",
            "../video-editor.config.json",
            str(Path(__file__).parent / "video-editor.config.json"),
            os.path.expanduser("~/.opensquad/video-editor.config.json")
        ]
        for path in possible_paths:
            if os.path.exists(path):
                return path
        raise FileNotFoundError("Arquivo de configuração não encontrado")
    
    def _load_config(self) -> dict:
        """Carrega configuração"""
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _setup_logging(self):
        """Configura logging"""
        log_dir = self.input_folder / "logs"
        log_dir.mkdir(exist_ok=True)
        
        log_file = log_dir / f"batch-processing-{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
        logging.basicConfig(
            level=self.config['logging'].get('level', 'INFO'),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def scan_videos(self) -> List[Path]:
        """
        Escaneia a pasta e encontra todos os vídeos
        
        Returns:
            Lista de arquivos de vídeo encontrados
        """
        self.logger.info(f"Escaneando pasta: {self.input_folder}")
        
        if not self.input_folder.exists():
            self.logger.error(f"Pasta não existe: {self.input_folder}")
            raise FileNotFoundError(f"Pasta não encontrada: {self.input_folder}")
        
        allowed_formats = self.config['video'].get('allowed_formats', ['mp4', 'mov', 'webm'])
        allowed_formats = [f.lower() for f in allowed_formats]
        
        video_files = []
        for ext in allowed_formats:
            video_files.extend(self.input_folder.glob(f"*.{ext}"))
            video_files.extend(self.input_folder.glob(f"*.{ext.upper()}"))
        
        # Remove duplicatas
        video_files = list(set(video_files))
        video_files.sort()
        
        self.logger.info(f"Encontrados {len(video_files)} vídeos")
        
        return video_files
    
    def create_output_structure(self):
        """
        Cria estrutura de pastas de saída dentro da pasta de entrada
        """
        self.logger.info("Criando estrutura de pastas de saída")
        
        # Cria pasta principal de saída
        self.output_folder.mkdir(exist_ok=True)
        
        # Cria subpastas
        subfolders = [
            self.output_folder / "videos_completos",
            self.output_folder / "shorts",
            self.output_folder / "legendas",
            self.output_folder / "roteiros",
            self.output_folder / "relatorios",
            self.output_folder / "logs"
        ]
        
        for folder in subfolders:
            folder.mkdir(exist_ok=True, parents=True)
            self.logger.info(f"Pasta criada: {folder.relative_to(self.input_folder)}")
        
        return subfolders
    
    def analyze_batch(self) -> Dict:
        """
        Analisa todos os vídeos da pasta
        
        Returns:
            Dicionário com análise completa
        """
        print("\n" + "="*70)
        print("[ANALISE] ANALISE EM LOTE DE VIDEOS")
        print("="*70)
        
        video_files = self.scan_videos()
        
        analysis = {
            "timestamp": datetime.now().isoformat(),
            "input_folder": str(self.input_folder),
            "output_folder": str(self.output_folder),
            "total_videos": len(video_files),
            "videos": [],
            "summary": {
                "total_videos": len(video_files),
                "total_duration": 0,
                "average_resolution": None,
                "estimated_processing_time": 0
            }
        }
        
        print(f"\n[INFO] Pasta: {self.input_folder}")
        print(f"[INFO] Saída: {self.output_folder}")
        print(f"\n[ENCONTRADOS] {len(video_files)} vídeos\n")
        
        total_duration = 0
        resolutions = []
        
        for idx, video_file in enumerate(video_files, 1):
            try:
                # Obtém informações do vídeo
                info = self._get_video_info(video_file)
                
                video_data = {
                    "index": idx,
                    "filename": video_file.name,
                    "path": str(video_file),
                    "size_mb": video_file.stat().st_size / (1024 * 1024),
                    "duration": info.get('duration', 0),
                    "resolution": info.get('resolution', 'Unknown'),
                    "fps": info.get('fps', 30),
                    "codec": info.get('codec', 'Unknown')
                }
                
                analysis["videos"].append(video_data)
                total_duration += video_data['duration']
                resolutions.append(video_data['resolution'])
                
                # Imprime informações do vídeo
                print(f"[VIDEO {idx}] {video_file.name}")
                print(f"           Tamanho: {video_data['size_mb']:.1f} MB")
                print(f"           Duração: {self._format_duration(video_data['duration'])}")
                print(f"           Resolução: {video_data['resolution']} @ {video_data['fps']}fps")
                
            except Exception as e:
                self.logger.error(f"Erro ao analisar {video_file.name}: {e}")
                print(f"[ERRO] {video_file.name}: {str(e)}")
        
        # Calcula resumo
        analysis["summary"]["total_videos"] = len(video_files)
        analysis["summary"]["total_duration"] = total_duration
        analysis["summary"]["total_duration_formatted"] = self._format_duration(total_duration)
        
        # Tempo estimado (10 min por vídeo de 5 min)
        time_per_min = 2  # 2 minutos de processamento por 1 min de vídeo
        analysis["summary"]["estimated_processing_time"] = total_duration * time_per_min
        analysis["summary"]["estimated_processing_time_formatted"] = self._format_duration(
            analysis["summary"]["estimated_processing_time"]
        )
        
        # Resumo geral
        print(f"\n" + "="*70)
        print("[RESUMO] RESUMO DA ANALISE EM LOTE")
        print("="*70)
        print(f"\n[STATS] Total de vídeos: {analysis['summary']['total_videos']}")
        print(f"[STATS] Duração total: {analysis['summary']['total_duration_formatted']}")
        print(f"[STATS] Tempo estimado de processamento: {analysis['summary']['estimated_processing_time_formatted']}")
        
        return analysis
    
    def _get_video_info(self, video_path: Path) -> Dict:
        """Obtém informações do vídeo usando ffprobe"""
        try:
            cmd = [
                'ffprobe',
                '-v', 'error',
                '-select_streams', 'v:0',
                '-show_entries', 'format=duration,filename : stream=width,height,r_frame_rate,codec_name',
                '-of', 'json',
                str(video_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            data = json.loads(result.stdout)
            
            duration = float(data.get('format', {}).get('duration', 0))
            stream = data.get('streams', [{}])[0]
            width = stream.get('width', 0)
            height = stream.get('height', 0)
            fps = eval(stream.get('r_frame_rate', '30/1'))  # "30/1" -> 30
            codec = stream.get('codec_name', 'unknown')
            
            return {
                'duration': duration,
                'resolution': f"{width}x{height}",
                'fps': fps,
                'codec': codec
            }
        except Exception as e:
            self.logger.warning(f"Erro ao obter info com ffprobe: {e}. Usando valores padrão.")
            return {
                'duration': 0,
                'resolution': '1920x1080',
                'fps': 30,
                'codec': 'h264'
            }
    
    def _format_duration(self, seconds: float) -> str:
        """Formata duração em segundos para string legível"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        
        if hours > 0:
            return f"{hours}h {minutes}min {secs}s"
        elif minutes > 0:
            return f"{minutes}min {secs}s"
        else:
            return f"{secs}s"
    
    def generate_batch_report(self, analysis: Dict):
        """
        Gera relatório em JSON da análise em lote
        """
        report_file = self.output_folder / "analise_lote.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Relatório salvo: {report_file}")
        
        print(f"\n[RELATORIO] Salvo em: {report_file.relative_to(self.input_folder)}")
        
        return report_file
    
    def generate_processing_plan(self, analysis: Dict) -> Dict:
        """
        Gera um plano de processamento para os vídeos
        """
        plan = {
            "timestamp": datetime.now().isoformat(),
            "total_videos": analysis['summary']['total_videos'],
            "processing_steps": [
                "1. Análise de vídeo com detecção de picos",
                "2. Criação de ganchos (15s, 30s, 60s)",
                "3. Adição de legendas automáticas (pt-BR)",
                "4. Sincronização de música",
                "5. Compilação de vídeo final",
                "6. Geração de relatório individual"
            ],
            "videos": [
                {
                    "index": v['index'],
                    "filename": v['filename'],
                    "duration": v['duration'],
                    "estimated_time": v['duration'] * 2,  # 2x o tempo do vídeo
                    "status": "pending",
                    "output_files": {
                        "main_video": f"videos_completos/{Path(v['filename']).stem}_editado.mp4",
                        "shorts": [
                            f"shorts/{Path(v['filename']).stem}_15s.mp4",
                            f"shorts/{Path(v['filename']).stem}_30s.mp4",
                            f"shorts/{Path(v['filename']).stem}_60s.mp4"
                        ],
                        "subtitles": f"legendas/{Path(v['filename']).stem}.srt",
                        "report": f"relatorios/{Path(v['filename']).stem}_report.json"
                    }
                }
                for v in analysis['videos']
            ]
        }
        
        plan_file = self.output_folder / "plano_processamento.json"
        
        with open(plan_file, 'w', encoding='utf-8') as f:
            json.dump(plan, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Plano de processamento salvo: {plan_file}")
        
        print(f"\n[PLANO] Plano de processamento salvo em: {plan_file.relative_to(self.input_folder)}")
        
        return plan
    
    def show_summary(self, analysis: Dict):
        """Mostra resumo final formatado"""
        print(f"\n" + "="*70)
        print("[CONCLUSAO] ANALISE COMPLETA")
        print("="*70)
        
        print(f"\n[OK] Analise em lote concluida com sucesso!")
        print(f"\n[RESULTADOS]")
        print(f"     Videos encontrados: {analysis['summary']['total_videos']}")
        print(f"     Duracao total: {analysis['summary']['total_duration_formatted']}")
        print(f"     Tempo estimado: {analysis['summary']['estimated_processing_time_formatted']}")
        
        print(f"\n[ESTRUTURA DE SAIDA]")
        print(f"     Pasta principal: {self.output_folder.relative_to(self.input_folder)}/")
        print(f"     [PASTA] videos_completos/ (videos editados)")
        print(f"     [PASTA] shorts/ (ganchos para redes sociais)")
        print(f"     [PASTA] legendas/ (arquivos SRT)")
        print(f"     [PASTA] roteiros/ (roteiros de edicao JSON)")
        print(f"     [PASTA] relatorios/ (relatorios individuais)")
        print(f"     [ARQUIVO] analise_lote.json (analise completa)")
        print(f"     [ARQUIVO] plano_processamento.json (plano de acao)")
        print(f"     [PASTA] logs/ (registros de processamento)")
        
        print(f"\n[PROXIMA ETAPA]")
        print(f"     Execute o processamento dos videos!")
        print(f"\n")


# ============================================================================
# FUNÇÃO PRINCIPAL
# ============================================================================

def main():
    """Função principal"""
    
    print("\n" + "="*70)
    print("VIDEO EDITOR PRO - BATCH PROCESSOR v1.1.0")
    print("="*70)
    
    # Pasta de entrada (modifique conforme necessário)
    input_folder = r"D:\Projrto 3- Shorts de filmes"
    
    try:
        # Inicializa processador
        processor = BatchVideoProcessor(input_folder)
        
        # Cria estrutura de pastas
        processor.create_output_structure()
        
        # Analisa vídeos
        analysis = processor.analyze_batch()
        
        # Gera relatório
        processor.generate_batch_report(analysis)
        
        # Gera plano de processamento
        processor.generate_processing_plan(analysis)
        
        # Mostra resumo
        processor.show_summary(analysis)
        
    except FileNotFoundError as e:
        print(f"\n[ERRO] {e}")
        print(f"\n[INFO] Verifique se a pasta existe: {input_folder}")
    except Exception as e:
        print(f"\n[ERRO] Erro durante processamento: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
