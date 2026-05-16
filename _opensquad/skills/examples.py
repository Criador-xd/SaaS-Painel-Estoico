#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Exemplos Práticos de Uso - Video Editor Pro Skill

Arquivo de demonstração com casos reais de uso da skill
"""

from video_editor import VideoEditorPro
import json
from pathlib import Path

# ============================================================================
# EXEMPLO 1: Processar Vídeo Completo para Mente Estoica
# ============================================================================

def exemplo_1_processamento_completo():
    """
    Caso de uso: Criar conteúdo profissional para Mente Estoica
    
    Entrada: Vídeo bruto de palestra/meditação (5-15 min)
    Saída: 
    - 1 vídeo completo com legendas e música
    - 5 shorts para Instagram/TikTok
    """
    
    print("=" * 60)
    print("EXEMPLO 1: Processamento Completo")
    print("=" * 60)
    
    editor = VideoEditorPro()
    video_input = "./videos/palestra_estoicismo.mp4"
    
    # Etapa 1: Analisar vídeo
    print("\n📊 Analisando vídeo...")
    analysis = editor.analyze_video(video_input)
    
    print(f"✅ Análise concluída:")
    print(f"   - Duração: {analysis['duration']:.1f}s")
    print(f"   - Resolução: {analysis['resolution']}")
    print(f"   - Picos detectados: {len(analysis['peaks'])}")
    print(f"   - Cenas identificadas: {len(analysis['scenes'])}")
    
    # Etapa 2: Criar hooks para Reels/Shorts
    print("\n✂️ Criando 5 ganchos para Reels...")
    hooks = editor.create_hooks(video_input, count=5)
    
    print(f"✅ {len(hooks)} hooks criados:")
    for hook in hooks:
        print(f"   - {hook.hook_id} ({hook.duration:.1f}s):")
        for duration, file in hook.output_files.items():
            print(f"     • {duration}s: {Path(file).name}")
    
    # Etapa 3: Adicionar legendas
    print("\n📝 Adicionando legendas automáticas...")
    video_com_legendas, srt_file = editor.add_subtitles(
        video_input,
        language="pt-BR"
    )
    print(f"✅ Legendas adicionadas: {Path(video_com_legendas).name}")
    print(f"   SRT: {Path(srt_file).name}")
    
    # Etapa 4: Adicionar música
    print("\n🎵 Sincronizando trilha sonora...")
    video_final = editor.add_music(video_com_legendas, music_track="auto")
    print(f"✅ Trilha sonora adicionada: {Path(video_final).name}")
    
    print("\n🎉 Processamento completo concluído!")
    print(f"   Vídeo final: {video_final}")
    print(f"   Shorts: {len(hooks)} vídeos prontos")
    

# ============================================================================
# EXEMPLO 2: Extrair Melhores Momentos
# ============================================================================

def exemplo_2_extrair_melhores_momentos():
    """
    Caso de uso: Extrair os momentos mais impactantes do vídeo
    
    Entrada: Vídeo completo
    Saída: Compilação com top 3 momentos de maior impacto
    """
    
    print("\n" + "=" * 60)
    print("EXEMPLO 2: Extrair Melhores Momentos")
    print("=" * 60)
    
    editor = VideoEditorPro()
    video_input = "./videos/palestra_estoicismo.mp4"
    
    # Gera roteiro inteligente
    print("\n📋 Gerando roteiro de edição...")
    script = editor.generate_edit_script(video_input)
    
    print(f"✅ Roteiro gerado:")
    print(f"   - Duração original: {script['duration']:.1f}s")
    print(f"   - Duração estimada pós-edição: {script['estimated_final_duration']:.1f}s")
    print(f"   - Confiança das recomendações: {script['confidence_score']:.0%}")
    
    # Extrai recomendações de highlights
    highlights = [r for r in script['recommendations'] if r['type'] == 'highlight']
    print(f"   - Highlights detectados: {len(highlights)}")
    
    if highlights:
        # Compila top 3 momentos
        print("\n✂️ Compilando top 3 momentos...")
        top_highlights = highlights[:3]
        
        segments = [
            {
                "video": video_input,
                "start": h['start'],
                "end": h['end']
            }
            for h in top_highlights
        ]
        
        output_path = "./output/melhores_momentos.mp4"
        resultado = editor.cut_and_compile(segments, output_path)
        
        print(f"✅ Vídeo compilado: {Path(resultado).name}")
        print(f"   Segmentos: {len(segments)}")
        for i, seg in enumerate(segments, 1):
            print(f"   {i}. {seg['start']:.1f}s - {seg['end']:.1f}s")


# ============================================================================
# EXEMPLO 3: Workflow para Squad SMM
# ============================================================================

def exemplo_3_workflow_squad_smm():
    """
    Caso de uso: Pipeline automático para Social Media Manager Squad
    
    Fluxo:
    1. Análise do vídeo
    2. Geração de roteiro
    3. Criação de hooks
    4. Adição de legendas
    5. Sincronização de música
    6. Exportação de metadata
    """
    
    print("\n" + "=" * 60)
    print("EXEMPLO 3: Workflow para Squad SMM")
    print("=" * 60)
    
    editor = VideoEditorPro()
    video_input = "./videos/video_novo.mp4"
    
    # Pipeline completo
    print("\n🔄 Iniciando pipeline SMM...\n")
    
    # Step 1: Análise
    print("1️⃣ Análise do vídeo")
    analysis = editor.analyze_video(video_input)
    print(f"   ✅ {len(analysis['peaks'])} picos identificados")
    
    # Step 2: Roteiro
    print("\n2️⃣ Geração de roteiro de edição")
    script = editor.generate_edit_script(video_input)
    print(f"   ✅ {len(script['recommendations'])} recomendações geradas")
    
    # Step 3: Hooks
    print("\n3️⃣ Criação de 5 hooks para Reels")
    hooks = editor.create_hooks(video_input, count=5)
    print(f"   ✅ {len(hooks)} hooks criados")
    
    # Step 4: Legendas
    print("\n4️⃣ Adição de legendas automáticas")
    video_com_legendas, _ = editor.add_subtitles(video_input, language="pt-BR")
    print(f"   ✅ Legendas adicionadas")
    
    # Step 5: Música
    print("\n5️⃣ Sincronização de trilha sonora")
    video_final = editor.add_music(video_com_legendas)
    print(f"   ✅ Música sincronizada")
    
    # Step 6: Exportação de metadata
    print("\n6️⃣ Exportação de metadata")
    metadata = {
        "input_file": video_input,
        "output_file": video_final,
        "hooks_count": len(hooks),
        "hooks_files": [
            {
                "id": h.hook_id,
                "files": h.output_files
            } for h in hooks
        ],
        "analysis": {
            "duration": analysis['duration'],
            "fps": analysis['fps'],
            "resolution": analysis['resolution'],
            "peaks": len(analysis['peaks'])
        }
    }
    
    metadata_file = "./output/metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"   ✅ Metadata salva: {Path(metadata_file).name}")
    
    print("\n✨ Pipeline SMM concluído com sucesso!")
    print(f"   Vídeo principal: {Path(video_final).name}")
    print(f"   Shorts criados: {len(hooks)}")
    print(f"   Metadata: {Path(metadata_file).name}")


# ============================================================================
# EXEMPLO 4: Edição com Revisão Manual
# ============================================================================

def exemplo_4_edição_com_revisao_manual():
    """
    Caso de uso: Gerar roteiro para revisão manual antes de executar edições
    
    Fluxo:
    1. Análise e geração de roteiro
    2. Exportação para JSON
    3. Revisão manual (humano aprova/rejeita)
    4. Aplicação das edições aprovadas
    """
    
    print("\n" + "=" * 60)
    print("EXEMPLO 4: Edição com Revisão Manual")
    print("=" * 60)
    
    editor = VideoEditorPro()
    video_input = "./videos/video_importante.mp4"
    
    # Gera roteiro
    print("\n📋 Gerando roteiro para revisão...")
    script = editor.generate_edit_script(video_input)
    
    # Salva para revisão
    review_file = "./output/edit_review.json"
    Path("./output").mkdir(exist_ok=True)
    
    with open(review_file, 'w', encoding='utf-8') as f:
        json.dump(script, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Roteiro salvo: {Path(review_file).name}")
    print(f"\n📊 Resumo do roteiro:")
    print(f"   - Duração original: {script['duration']:.1f}s")
    print(f"   - Recomendações: {len(script['recommendations'])}")
    print(f"   - Confiança média: {script['confidence_score']:.0%}")
    
    # Simula revisão manual
    print(f"\n👤 [REVISÃO MANUAL]")
    print(f"   Abra o arquivo: {review_file}")
    print(f"   Aprovar/rejeitar recomendações")
    print(f"   Salvar de volta")
    
    print(f"\n✨ Pronto para revisão manual!")
    print(f"   Arquivo: {review_file}")


# ============================================================================
# EXEMPLO 5: Compilar Vários Segmentos
# ============================================================================

def exemplo_5_compilar_segmentos():
    """
    Caso de uso: Extrair segmentos específicos e compilar em novo vídeo
    
    Exemplo: Extrair as 3 melhores partes de um vídeo longo
    """
    
    print("\n" + "=" * 60)
    print("EXEMPLO 5: Compilar Segmentos Específicos")
    print("=" * 60)
    
    editor = VideoEditorPro()
    video_input = "./videos/video_longo.mp4"
    
    # Define segmentos manualmente
    segments = [
        {
            "video": video_input,
            "start": 0,           # Intro (0-30s)
            "end": 30
        },
        {
            "video": video_input,
            "start": 120,         # Parte principal (2-5 min)
            "end": 300
        },
        {
            "video": video_input,
            "start": 450,         # Conclusão (7.5 min em diante)
            "end": 600
        }
    ]
    
    print("\n✂️ Compilando segmentos...")
    print(f"   Total: {len(segments)} segmentos")
    
    for i, seg in enumerate(segments, 1):
        duration = seg['end'] - seg['start']
        print(f"   {i}. {seg['start']:.0f}s - {seg['end']:.0f}s ({duration:.0f}s)")
    
    output_file = "./output/compilado_customizado.mp4"
    resultado = editor.cut_and_compile(segments, output_file)
    
    print(f"\n✅ Vídeo compilado: {Path(resultado).name}")


# ============================================================================
# FUNÇÃO PRINCIPAL
# ============================================================================

def main():
    """Executa exemplos interativamente"""
    
    print("\n" + "🎬" * 30)
    print("VIDEO EDITOR PRO - EXEMPLOS DE USO")
    print("🎬" * 30 + "\n")
    
    exemplos = {
        "1": ("Processamento Completo", exemplo_1_processamento_completo),
        "2": ("Extrair Melhores Momentos", exemplo_2_extrair_melhores_momentos),
        "3": ("Workflow para Squad SMM", exemplo_3_workflow_squad_smm),
        "4": ("Edição com Revisão Manual", exemplo_4_edição_com_revisao_manual),
        "5": ("Compilar Segmentos", exemplo_5_compilar_segmentos),
    }
    
    print("Exemplos disponíveis:\n")
    for key, (nome, _) in exemplos.items():
        print(f"  {key}. {nome}")
    
    print("\n  0. Executar todos")
    print("  q. Sair")
    
    escolha = input("\n👉 Escolha um exemplo (0-5): ").strip().lower()
    
    if escolha == "q":
        print("Até logo! 👋")
        return
    
    if escolha == "0":
        # Executar todos os exemplos
        for key, (nome, func) in exemplos.items():
            try:
                func()
            except Exception as e:
                print(f"\n❌ Erro no exemplo {key}: {e}")
    elif escolha in exemplos:
        try:
            _, func = exemplos[escolha]
            func()
        except Exception as e:
            print(f"\n❌ Erro: {e}")
            print("💡 Dica: Verifique se o arquivo de vídeo existe!")
    else:
        print("❌ Opção inválida!")


if __name__ == "__main__":
    main()
