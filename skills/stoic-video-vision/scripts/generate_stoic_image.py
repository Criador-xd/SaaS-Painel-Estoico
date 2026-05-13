import os
import sys
import requests
from openai import OpenAI
from datetime import datetime

def generate_image(prompt, file_name):
    try:
        client = OpenAI() # Assume OPENAI_API_KEY is in env
        
        print(f"Gerando imagem para: {file_name}...")
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1792",
            quality="hd",
            n=1,
        )

        image_url = response.data[0].url
        output_dir = r"D:\IMAGENS SALVAS  IA"
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Sanitize filename
        safe_name = "".join([c for c in file_name if c.isalnum() or c in (' ', '.', '_')]).rstrip()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        final_path = os.path.join(output_dir, f"{safe_name}_{timestamp}.png")

        print(f"Baixando imagem...")
        img_data = requests.get(image_url).content
        with open(final_path, 'wb') as handler:
            handler.write(img_data)
            
        print(f"Sucesso! Salvo em: {final_path}")
        return final_path

    except Exception as e:
        print(f"Erro ao gerar imagem: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python generate_stoic_image.py 'PROMPT' 'NOME_DO_ARQUIVO'")
        sys.exit(1)
    
    prompt_arg = sys.argv[1]
    name_arg = sys.argv[2]
    generate_image(prompt_arg, name_arg)