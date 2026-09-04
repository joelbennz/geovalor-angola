from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
import math

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / 'assets' / 'surface-real-angola-catoca.jpg'
BASE_W, BASE_H = 1672, 941

def save444(image, path, size):
    image.convert('RGB').resize(size, Image.Resampling.LANCZOS).save(
        path, 'JPEG', quality=95, subsampling=0, optimize=True, progressive=True
    )

def make_surface():
    photo = Image.open(PHOTO).convert('RGB')
    target = 16 / 9
    w, h = photo.size
    crop_h = int(w / target)
    top = max(0, int((h - crop_h) * 0.42))
    crop = photo.crop((0, top, w, top + crop_h))
    for folder in (ROOT / 'assets', ROOT / 'release' / 'assets'):
        save444(crop, folder / 'surface-real-1920.jpg', (1920, 1080))
        save444(crop, folder / 'surface-real-4k.jpg', (3840, 2160))

def make_diagram():
    im = Image.new('RGB', (BASE_W, BASE_H), '#071014')
    d = ImageDraw.Draw(im)
    # Surface horizon and technical strata, intentionally schematic.
    d.rectangle((0, 0, BASE_W, 215), fill='#111a1d')
    d.polygon([(0, 190), (160, 174), (320, 188), (490, 164), (650, 184), (820, 156),
               (1000, 176), (1190, 152), (1380, 180), (1672, 158), (1672, 240), (0, 240)], fill='#253236')
    strata = [
        ([(0,240),(1672,240),(1672,355),(1390,330),(1110,365),(820,326),(580,360),(300,322),(0,350)], '#4b514a'),
        ([(0,350),(300,322),(580,360),(820,326),(1110,365),(1390,330),(1672,355),(1672,470),(1410,438),(1160,474),(860,442),(590,480),(290,445),(0,472)], '#344541'),
        ([(0,472),(290,445),(590,480),(860,442),(1160,474),(1410,438),(1672,470),(1672,610),(1400,574),(1130,618),(820,580),(560,625),(270,585),(0,610)], '#243936'),
        ([(0,610),(270,585),(560,625),(820,580),(1130,618),(1400,574),(1672,610),(1672,760),(1380,710),(1110,770),(810,720),(540,778),(250,725),(0,760)], '#182a2d'),
        ([(0,760),(250,725),(540,778),(810,720),(1110,770),(1380,710),(1672,760),(1672,941),(0,941)], '#101e23'),
    ]
    for pts, color in strata:
        d.polygon(pts, fill=color)
        d.line(pts + [pts[0]], fill='#8a9a8d', width=2)
    # Lithology hatching: an unmistakable report-style convention.
    for y in range(270, 930, 24):
        for x in range(-200, BASE_W + 200, 34):
            d.line((x, y, x + 18, y + 9), fill='#91a39a', width=1)
    # Interpreted mineralized targets.
    targets = [
        ([(110,455),(260,408),(420,430),(505,480),(380,525),(205,510)], '#a96b27'),
        ([(430,395),(620,370),(760,415),(695,480),(520,470)], '#3d8279'),
        ([(560,620),(790,570),(1010,600),(1080,660),(840,700),(630,690)], '#9c4e20'),
        ([(1050,720),(1220,680),(1350,735),(1260,810),(1080,795)], '#6d518f'),
        ([(730,790),(930,745),(1040,795),(920,870),(760,860)], '#497f7c'),
        ([(270,800),(520,780),(640,830),(510,885),(250,870)], '#436f7b'),
    ]
    for pts, color in targets:
        d.polygon(pts, fill=color, outline='#d8b172', width=2)
        # target-specific cross hatching
        minx = min(p[0] for p in pts); maxx = max(p[0] for p in pts)
        miny = min(p[1] for p in pts); maxy = max(p[1] for p in pts)
        for x in range(minx-80, maxx+80, 18):
            d.line((x, miny, x+maxy-miny, maxy), fill='#e0c58f', width=1)
    # Borehole and interpreted fracture corridor.
    d.line((1018, 172, 1018, 905), fill='#9fd1d7', width=10)
    d.line((1018, 172, 1018, 905), fill='#f0f0df', width=2)
    d.line((1024, 330, 1120, 570), fill='#c9dfe0', width=2)
    d.line((1024, 330, 920, 560), fill='#c9dfe0', width=2)
    # Surface rig silhouette, distinct from the photographic surface layer.
    d.line((1000, 215, 1018, 70, 1038, 215), fill='#d6a15b', width=5)
    d.rectangle((955, 198, 1072, 218), fill='#b77a36')
    d.rectangle((979, 218, 1048, 243), fill='#5c6a65')
    # Coordinate grid and title plaque.
    for x in range(60, BASE_W, 160): d.line((x, 40, x, BASE_H-28), fill='#2b4549', width=1)
    for y in range(60, BASE_H, 120): d.line((40, y, BASE_W-40, y), fill='#2b4549', width=1)
    d.rectangle((55, 56, 510, 118), fill='#071014', outline='#c58a4b', width=2)
    d.text((76, 70), 'CORTE GEOLOGICO INTERPRETADO', fill='#f1e9d8')
    d.text((76, 92), 'modelo tecnico — sem escala de fotografia', fill='#c58a4b')
    return im

def make_frames():
    base = make_diagram()
    for root in (ROOT / 'assets', ROOT / 'release' / 'assets'):
        for subdir, size in (('frames-1080', (1920, 1080)), ('frames-4k', (3840, 2160))):
            out = root / subdir
            out.mkdir(parents=True, exist_ok=True)
            for i in range(30):
                # Same geometry in every frame; only presentation atmosphere changes.
                exposure = 0.92 + 0.10 * math.sin(i / 29 * math.pi)
                frame = ImageEnhance.Brightness(base).enhance(exposure)
                frame = ImageEnhance.Contrast(frame).enhance(1.04 + i * 0.001)
                save444(frame, out / f'frame-{i+1:02d}.jpg', size)

if __name__ == '__main__':
    make_surface()
    make_frames()
    print('Exported honest surface and technical frames in JPEG 4:4:4.')
