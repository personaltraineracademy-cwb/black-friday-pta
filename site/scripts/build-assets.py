#!/usr/bin/env python
"""Gera os ativos binários do site (rode uma vez; os resultados ficam versionados):

  1. fontes woff2 em subconjunto (Latin + PT-BR) -> app/fonts/
       Big Shoulders 900 · Archivo variável 500–800 · Azeret Mono 500 e 600
  2. tile de granulado (RGBA, 128 px)            -> public/img/grao-128.png
  3. imagem OG 1200x630                          -> public/og.png
  4. apple-touch-icon 180x180                    -> app/apple-icon.png
  5. licenças OFL das fontes                     -> public/licencas/

Uso:  python scripts/build-assets.py [--fonts-dir <pasta com as TTF>]
Requer: fonttools, brotli, pillow, numpy, resvg-py (já instalados no estúdio).
"""
from __future__ import annotations

import argparse
import io
import shutil
import sys
from pathlib import Path

import numpy as np
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_FONTS = Path.home() / ".cache" / "brand-studio" / "fonts"

# Latin básico + Latin-1 (acentos do português) + pontuação tipográfica + setas.
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + [0x131, 0x152, 0x153, 0x2C6, 0x2DA, 0x2DC]
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2022, 0x2026, 0x2030, 0x2039, 0x203A]
    + [0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212]
)
FEATURES = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum", "pnum", "case", "zero"]


def to_woff2(font: TTFont, out: Path) -> None:
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]  # mantém copyright/licença
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    out.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(str(out))
    print(f"  {out.relative_to(ROOT)}  {out.stat().st_size/1024:.1f} KB")


def build_fonts(fonts_dir: Path) -> None:
    print("fontes")
    out = ROOT / "app" / "fonts"
    # Big Shoulders 900 (estática)
    to_woff2(TTFont(fonts_dir / "bigshoulders" / "bigshoulders-900.ttf"), out / "BigShoulders-900.woff2")
    # Archivo variável: largura fixa em 100, peso 500–800
    vf = TTFont(fonts_dir / "archivo" / "Archivo[wdth,wght].ttf")
    vf = instancer.instantiateVariableFont(vf, {"wdth": 100, "wght": (500, 800)})
    to_woff2(vf, out / "Archivo-500-800.woff2")
    # Azeret Mono 500 e 600 (estáticas)
    to_woff2(TTFont(fonts_dir / "azeretmono" / "azeretmono-500.ttf"), out / "AzeretMono-500.woff2")
    to_woff2(TTFont(fonts_dir / "azeretmono" / "azeretmono-600.ttf"), out / "AzeretMono-600.woff2")
    lic = ROOT / "public" / "licencas"
    lic.mkdir(parents=True, exist_ok=True)
    for fam in ("bigshoulders", "archivo", "azeretmono"):
        src = fonts_dir / fam / "OFL.txt"
        if src.exists():
            shutil.copy2(src, lic / f"OFL-{fam}.txt")


def build_grain() -> None:
    print("granulado")
    rng = np.random.default_rng(1109)
    n = 128
    alpha = (rng.random((n, n)) ** 2.2 * 40).astype(np.uint8)       # média ~12/255 x opacity .8 ≈ 4% (igual à v3)
    light = rng.random((n, n)) > 0.5
    lum = np.where(light, 255, 0).astype(np.uint8)
    img = Image.fromarray(np.dstack([lum, lum, lum, alpha]), "RGBA")
    out = ROOT / "public" / "img" / "grao-128.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"  {out.relative_to(ROOT)}  {out.stat().st_size/1024:.1f} KB")


def render_svg(path: Path, width: int, bg: str) -> Image.Image:
    import resvg_py

    data = resvg_py.svg_to_bytes(svg_path=str(path), width=width, background=bg)
    return Image.open(io.BytesIO(bytes(data))).convert("RGBA")


def build_og() -> None:
    print("og + ícone")
    ink = (12, 11, 9, 255)
    gold = (205, 168, 94, 255)
    W, H = 1200, 630
    og = Image.new("RGBA", (W, H), ink)
    logos = ROOT / "public" / "logos"
    logo = render_svg(logos / "a-tarja-todos-pta-aovivo.svg", 880, "#0C0B09")
    og.alpha_composite(logo, (80, 84))
    # filete + data (texto da copy: "9, 10 e 11/11 · 20h30"), em Big Shoulders 900
    d = ImageDraw.Draw(og)
    d.rectangle([80, 396, 1120, 398], fill=gold)
    f_big = ImageFont.truetype(str(DEFAULT_FONTS / "bigshoulders" / "bigshoulders-900.ttf"), 132)
    d.text((80, 418), "9, 10 e 11/11 · 20h30", font=f_big, fill=(254, 254, 252, 255))
    og.convert("RGB").save(ROOT / "public" / "og.png", optimize=True)
    print(f"  public/og.png  {(ROOT/'public'/'og.png').stat().st_size/1024:.1f} KB")

    sym = render_svg(logos / "a-tarja-todos-simbolo.svg", 120, "#0C0B09")
    icon = Image.new("RGBA", (180, 180), ink)
    icon.alpha_composite(sym, ((180 - sym.width) // 2, (180 - sym.height) // 2))
    icon.convert("RGB").save(ROOT / "app" / "apple-icon.png", optimize=True)
    shutil.copy2(logos / "a-tarja-todos-simbolo.svg", ROOT / "app" / "icon.svg")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--fonts-dir", type=Path, default=DEFAULT_FONTS)
    ap.add_argument("--only", choices=["fonts", "grain", "og"], default=None)
    a = ap.parse_args()
    if a.only in (None, "fonts"):
        build_fonts(a.fonts_dir)
    if a.only in (None, "grain"):
        build_grain()
    if a.only in (None, "og"):
        build_og()
    return 0


if __name__ == "__main__":
    sys.exit(main())
