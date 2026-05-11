"""
Script automatizado para gerar as 48 imagens do episodio Dyatlov Pass.
Usa DALL-E 3 via API da OpenAI.
Salva as imagens na pasta 'images/' ao lado deste script.
"""

import os
import time
import requests
from openai import OpenAI

API_KEY = os.environ.get("OPENAI_API_KEY", "")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

client = OpenAI(api_key=API_KEY)

STYLE = "2D cartoon animation, educational historical documentary style"
NEG = ", no text, no words, no letters, no watermark, no title"

SCENES = [
    # HOOK
    f"{STYLE}, wide cinematic shot of nine small silhouettes hiking across a vast white frozen mountain landscape, heavy snow falling, dark grey sky, tiny figures against enormous mountains, sense of isolation and vulnerability, deep blue and grey palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, single small canvas tent glowing with faint orange light sitting alone on a dark snowy mountain slope at night, blizzard conditions, howling wind shown by horizontal snow, complete darkness surrounding the tent, eerie atmosphere, deep blue and black palette with orange glow, 16:9 aspect ratio{NEG}",
    f"{STYLE}, dramatic aerial view of a massive dark mountain peak emerging from thick clouds, snow-covered barren slopes, ominous and foreboding atmosphere, blood-red sunset behind the peak, epic cinematic scale, 16:9 aspect ratio{NEG}",
    # ATO 1
    f"{STYLE}, young Russian male age 23 with short dark brown hair, wearing dark green Soviet winter parka, sitting at a wooden desk studying a large paper map by candlelight, warm cabin interior, compasses and expedition gear on the table, determined expression, warm amber tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, group of 9 young Russian hikers gathered around a table in a university room laughing and planning, maps spread across the table, 1950s Soviet interior, warm lighting, optimistic cheerful atmosphere, vintage muted color palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, wide landscape of the Ural Mountains in winter, massive snow-covered peaks stretching into the distance, a thin trail visible winding up through pine forests, clear cold sky, sense of vast untouched wilderness, bright white and pale blue palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, group of young hikers on a Soviet-era train platform waving goodbye, heavy backpacks and wooden skis, steam locomotive in background, snow on the ground, warm yellow station lights, cheerful farewell scene, vintage 1950s atmosphere, 16:9 aspect ratio{NEG}",
    f"{STYLE}, small group of hikers standing at the edge of a tiny wooden village looking out at an endless white frozen wilderness, last wooden houses behind them, vast empty snowy landscape ahead, transition from warmth to cold, muted earth tones fading into white and blue, 16:9 aspect ratio{NEG}",
    f"{STYLE}, one young man with a backpack waving goodbye to a group of 9 hikers walking away into a snowy forest trail, the lone figure looking back with a sad expression, the group disappearing into the white distance, emotional separation moment, cold blue and grey tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, line of hikers trudging through deep snow in a mountain valley, carrying heavy packs and skis, pine trees heavy with snow on both sides, overcast sky, determined but tired expressions, cold grey and white palette with dark green pines, 16:9 aspect ratio{NEG}",
    f"{STYLE}, dramatic shot of hikers struggling against a horizontal blizzard on a barren treeless mountain slope, no vegetation anywhere, wind blowing snow violently, hikers leaning into the wind with arms raised, near whiteout conditions, tense dangerous atmosphere, desaturated grey and white, 16:9 aspect ratio{NEG}",
    f"{STYLE}, medium shot of young Russian male leader with dark brown hair in green parka pointing at the ground on a barren snowy slope, wind whipping his parka, other hikers as silhouettes behind him in the blizzard, fateful decision moment, dramatic backlighting from grey sky, cold blue tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, epic panoramic shot of a mountain at dusk, massive dark silhouette against a blood-red and purple sunset sky, ominous swirling clouds above the peak, barren treeless slopes, the mountain feels alive and threatening, cinematic composition, 16:9 aspect ratio{NEG}",
    f"{STYLE}, small tent on vast dark mountain slope at night, faint warm glow from inside, complete darkness and isolation surrounding it, stars barely visible through clouds, deep navy blue and black palette, sense of fragile warmth against infinite cold, 16:9 aspect ratio{NEG}",
    # ATO 2
    f"{STYLE}, worried Soviet parents in a modest apartment, mother clutching a photo, father on an old rotary telephone, dim yellow lamp light, 1950s wallpaper, anxious tense atmosphere, warm muted interior tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, Soviet military helicopter flying over vast snow-covered mountains, spotlight beam scanning the white landscape below, tiny dark tent visible on a distant slope, grey overcast sky, sense of enormous scale, cold blue and white palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, rescue workers in dark military coats approaching a half-buried tent on a slope, cautious body language, one pointing at the tent, grey daylight, footprints in snow around the scene, tense forensic atmosphere, muted cold tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, close-up of canvas tent wall with long jagged knife slashes torn from the inside, fabric edges curling outward, snow blowing through the rips, scattered belongings visible inside through the tears, warm interior contrasting with cold blue exterior, shocking discovery moment, 16:9 aspect ratio{NEG}",
    f"{STYLE}, interior view of abandoned tent with boots lined up, coats folded, canned food and an open journal, everything orderly but deserted, eerie emptiness, cold grey daylight filtering through torn canvas, forensic documentary feel, 16:9 aspect ratio{NEG}",
    f"{STYLE}, wide downhill shot showing parallel footprint trails in snow leading from tent at top down toward dark treeline at bottom, some prints clearly barefoot, grey overcast light, eerie orderly pattern suggesting calm walking not running, unsettling composition, cold blue tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, massive dark cedar tree in a snowy clearing, two motionless figures at the base partially covered in snow, remains of a tiny burned-out fire nearby, broken branches visible high in the tree, dark moody atmosphere, deep shadows, somber respectful tone, dark blue and brown palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, looking up into the canopy of a massive cedar tree at night, broken snapped branches visible at different heights, moonlight filtering through, dark silhouette of trunk, disturbing implication of desperate climbing, eerie vertical composition, dark blue and black palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, young man with dark brown hair lying face up on snowy slope, one arm extended uphill, frozen mid-movement, wearing thin clothing, snow partially covering body, grey overcast sky, deeply somber composition, cold desaturated blue tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, wide aerial view of snowy mountain slope with two motionless figures at different positions, each in different frozen poses, vast empty white landscape, falling snow, sense of tragedy spread across the mountainside, distant respectful camera angle, cold grey palette, 16:9 aspect ratio{NEG}",
    # ATO 3
    f"{STYLE}, deep snowy ravine surrounded by dark pine trees, rescue workers digging through deep snow with shovels, heavy fog filling the ravine, grim determined expressions, spring sunlight but cold atmosphere, somber discovery scene, muted blue and brown tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, dimly lit Soviet medical room, middle-aged doctor in white coat reading an autopsy report with a shocked expression, metal examination table in background covered with white sheet, single harsh fluorescent light overhead, cold sterile green and grey tones, clinical unsettling atmosphere, 16:9 aspect ratio{NEG}",
    f"{STYLE}, close-up of X-ray film on a lightbox showing a human skull with visible fracture lines, a gloved hand holding the film edge, dark examination room, blue-white X-ray glow contrasting with darkness, shocking medical evidence, clinical horror atmosphere, 16:9 aspect ratio{NEG}",
    f"{STYLE}, very wide distant shot of a deep dark ravine at night, heavy fog and mist, a barely visible dark shape at the bottom, dark pine trees looming on edges above, no graphic detail visible due to extreme distance, overwhelming dread and mystery, dark blue and black palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, Soviet investigator sitting alone at a desk covered in case files and photographs, head in his hands, frustrated exhausted expression, dim office lamp, cigarette smoke rising, 1959 Soviet office with filing cabinets, overwhelming mystery atmosphere, warm yellow lamp against dark room, 16:9 aspect ratio{NEG}",
    f"{STYLE}, Soviet scientist in white lab coat examining dark clothing under UV blacklight lamp, clothing glowing eerie green-purple, dark laboratory with metal shelves and glass containers, scientist face illuminated by UV glow with shocked expression, mysterious scientific discovery, purple and green accent lighting, 16:9 aspect ratio{NEG}",
    f"{STYLE}, Soviet military checkpoint with a metal barrier gate blocking a snowy mountain road, armed soldier standing guard, red warning sign, barbed wire fencing stretching into the distance, grey overcast sky, oppressive authoritarian atmosphere, cold muted military green and grey palette, 16:9 aspect ratio{NEG}",
    # ATO 4 - TEORIAS
    f"{STYLE}, dramatic upward shot of Dead Mountain at night, massive dark peak filling the frame, wind blowing snow off the ridge, faint strange light in the sky above, ominous ancient atmosphere, dark blue and black with subtle green accent, 16:9 aspect ratio{NEG}",
    f"{STYLE}, massive slab avalanche breaking away from mountain slope at night, enormous wall of white snow cascading downhill toward tiny illuminated tent below, explosive powder cloud, moonlight catching moving snow with silver highlights, catastrophic natural force, cold white and blue palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, split-frame composition showing an avalanche on the left side and a mysterious glowing question mark shape on the right side, visual representation of theory vs unexplained evidence, contrasting blue-white avalanche against dark mysterious right half, analytical documentary feel, 16:9 aspect ratio{NEG}",
    f"{STYLE}, artistic visualization of invisible sound waves emanating from between two mountain peaks at night, concentric translucent rings passing through a small tent below, visual distortion effect, surreal scientific horror atmosphere, deep purple and dark blue palette with white wave effects, 16:9 aspect ratio{NEG}",
    f"{STYLE}, interior of tent with hikers clutching their heads in agony, distorted visual effects suggesting disorientation, wavy lines in the air representing sound waves, terrified expressions, chaotic desperate scene inside the small space, warm orange interior with distortion effects, 16:9 aspect ratio{NEG}",
    f"{STYLE}, night sky above snowy mountains with multiple mysterious glowing orange orbs floating in formation, orbs casting warm light pools on snow below, small tent visible far below on slope, otherworldly watching atmosphere, dramatic contrast warm orange against cold blue night, wide cinematic composition, 16:9 aspect ratio{NEG}",
    f"{STYLE}, Soviet military officers in a dark underground bunker looking at radar screens and launch controls, red warning lights, secret classified atmosphere, maps of the Ural region on the walls, tense conspiratorial scene, dark green and red military lighting, 16:9 aspect ratio{NEG}",
    f"{STYLE}, three tall dark humanoid silhouettes standing motionless at the edge of a dense dark pine forest at night, backlit by faint moonlight, fog rolling along snowy ground, bulky traditional Siberian fur clothing, faces hidden in shadow, deeply unsettling confrontational composition, dark blue and black palette, 16:9 aspect ratio{NEG}",
    f"{STYLE}, wide shot of empty snowy mountain slope at night with large mysterious footprints in the snow that are much bigger than human prints, moonlight illuminating the tracks, dark forest in background, unanswered questions atmosphere, eerie cold blue and silver tones, 16:9 aspect ratio{NEG}",
    # ATO 5 - LEGADO
    f"{STYLE}, modern forensic team in bright orange winter gear standing on the same mountain slope, holding modern equipment and laptops, contrast between modern technology and ancient mountain, clear winter day, hopeful but somber atmosphere, bright orange against white snow, 16:9 aspect ratio{NEG}",
    f"{STYLE}, Russian government press conference room, official in suit standing at podium with microphone, large screen behind showing mountain photo, journalists in seats, formal institutional atmosphere, muted grey and brown official tones, 16:9 aspect ratio{NEG}",
    f"{STYLE}, elderly Russian woman holding an old black and white photograph of a young hiker, tears in her eyes, sitting in a modest apartment surrounded by decades of newspaper clippings and case files pinned to the wall, emotional and deeply personal scene, warm lamp light, 16:9 aspect ratio{NEG}",
    f"{STYLE}, modern hikers with colorful gear standing at a stone memorial marker on the mountain pass, looking out at the vast empty landscape, wind blowing, mixture of curiosity and respect on their faces, the dark treeline visible below, modern meets historical atmosphere, 16:9 aspect ratio{NEG}",
    f"{STYLE}, close-up of a rough stone memorial with carved names, small wilted flowers and a faded photograph at the base, golden hour sunlight breaking through clouds for the first time, peaceful but deeply melancholic, warm golden light on cold grey stone and white snow, 16:9 aspect ratio{NEG}",
    f"{STYLE}, triptych split into three panels showing avalanche on left, glowing orange military orbs in center, and dark forest silhouettes on right, each representing a theory, dark moody atmosphere across all three, unified dark blue tone connecting the panels, 16:9 aspect ratio{NEG}",
    f"{STYLE}, extreme wide shot slowly revealing the entire mountain and surrounding Ural range, the mountain small against vast wilderness, twilight fading to darkness at edges, sense of how remote and forgotten this place is, epic cinematic scale, blue twilight transitioning to black, 16:9 aspect ratio{NEG}",
    f"{STYLE}, ghostly old wooden sailing ship trapped in massive Arctic ice formations at night, faint northern lights in the sky, ship partially crushed by ice, dark frozen ocean, teaser for next episode, mysterious and inviting atmosphere, dark teal and icy blue with green aurora accent, 16:9 aspect ratio{NEG}",
]

def generate_and_save(index, prompt):
    filename = f"cena-{index:02d}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)

    if os.path.exists(filepath):
        print(f"  [SKIP] {filename} ja existe, pulando...")
        return True

    try:
        print(f"  [GERANDO] {filename}...")
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1792x1024",
            quality="standard",
            n=1,
        )
        image_url = response.data[0].url

        img_data = requests.get(image_url, timeout=120).content
        with open(filepath, "wb") as f:
            f.write(img_data)

        print(f"  [OK] {filename} salvo! ({len(img_data) // 1024} KB)")
        return True

    except Exception as e:
        print(f"  [ERRO] {filename}: {e}")
        return False


def main():
    total = len(SCENES)
    print(f"\n{'='*60}")
    print(f"  DYATLOV PASS - Gerador de Imagens (DALL-E 3)")
    print(f"  Total de cenas: {total}")
    print(f"  Pasta de saida: {OUTPUT_DIR}")
    print(f"{'='*60}\n")

    ok = 0
    fail = 0

    for i, prompt in enumerate(SCENES, start=1):
        print(f"\n[{i}/{total}] Cena {i:02d}")
        success = generate_and_save(i, prompt)
        if success:
            ok += 1
        else:
            fail += 1
        # Pequena pausa entre requisicoes para nao bater rate limit
        if i < total:
            time.sleep(2)

    print(f"\n{'='*60}")
    print(f"  CONCLUIDO!")
    print(f"  Sucesso: {ok} | Falhas: {fail}")
    print(f"  Imagens em: {OUTPUT_DIR}")
    print(f"{'='*60}\n")

    # Tenta gerar novamente as que falharam (1 retry)
    if fail > 0:
        print("Tentando gerar novamente as imagens que falharam...\n")
        for i, prompt in enumerate(SCENES, start=1):
            filename = f"cena-{i:02d}.png"
            filepath = os.path.join(OUTPUT_DIR, filename)
            if not os.path.exists(filepath):
                print(f"  [RETRY] {filename}...")
                generate_and_save(i, prompt)
                time.sleep(3)


if __name__ == "__main__":
    main()
