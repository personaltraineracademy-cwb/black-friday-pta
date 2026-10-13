"""Gera os elementos do kit (biblioteca ornamentos) e as variantes de logo das 3 páginas individuais da v1,
nos DOIS temas (escuro = padrão, claro = papel).

  python scripts/solo-v1-elementos.py

Saída:
  public/img/solo/<prof>/v1/<nome>.svg          tema ESCURO (fundo ink; cores da ficha do produto)
  public/img/solo/<prof>/v1/<nome>-claro.svg    tema CLARO  (fundo papel #ECE7DC, tinta #0C0B09, cor do produto)
  public/logos/solo/*-claro.svg, *-escuro.svg   logos oficiais de brand.json trocando SÓ o tom do texto (branco <-> escuro)

Nada é criado aqui: cada arquivo é uma função da biblioteca `ornamentos` chamada com parâmetros (ficha do produto).
Inventário e motivo de cada um: docs/solo-v1-decisoes.md.
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
SCRIPTS = "C:/Users/User/design/skills/direcao-de-arte/scripts"
sys.path.insert(0, SCRIPTS)
from ornamentos.nucleo import Ficha, ficha_black_pta  # noqa: E402
from ornamentos import assunto as A, dados as D  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = "C:/Users/User/design/testes/black-pta"
PAPEL, PAPEL2, TINTA = "#ECE7DC", "#E1DACB", "#0C0B09"
OURO, OURO_ESC = "#CDA85E", "#7C5F1C"       # ouro normal (escuro) · ouro fechado para o papel (tokens do tema claro)
COR = {"andre": "#007BFF", "walter": "#E8341C", "carlos": "#934EFF"}

# ---- fichas: ESCURO = ficha do produto (pecas.TEMAS); CLARO = papel + tinta + cor do produto
ESC = {"andre": ficha_black_pta("biomecanica"), "walter": ficha_black_pta("bodybuilding"),
       "carlos": ficha_black_pta("feminino")}
CLARO = {p: Ficha(fundo=PAPEL, tinta=TINTA, acento=COR[p], sobre_acento=TINTA, papel=PAPEL, apoio="#5E5C57",
                  nome=f"Black PTA · {p} (claro)") for p in COR}


def ouro_esc(p):      # bloco "pague 1, leve 2" sobre a superfície escura (ink-2)
    return ESC[p].com(fundo="#15130F", acento=OURO, sobre_acento="#15130F")


# o bloco "pague 1, leve 2" no CLARO é CHAPADO em ouro (#CDA85E, fundo continua ouro): formas e texto em tinta
F_OURO = Ficha(fundo=OURO, tinta=TINTA, acento=TINTA, sobre_acento=OURO, papel=PAPEL, apoio=TINTA, nome="ouro chapado")


def salvar(prof, nome, el):
    pasta = os.path.join(RAIZ, "public", "img", "solo", prof, "v1")
    os.makedirs(pasta, exist_ok=True)
    open(os.path.join(pasta, nome + ".svg"), "w", encoding="utf-8").write(el.svg)
    print(f"{prof}/{nome}.svg  {el.w:.0f}x{el.h:.0f}  {len(el.svg) / 1024:.1f} KB  · {el.nome}")


def par(prof, nome, fn):
    """fn(ficha) -> Elemento; grava <nome>.svg (escuro) e <nome>-claro.svg."""
    salvar(prof, nome, fn(ESC[prof]))
    salvar(prof, nome + "-claro", fn(CLARO[prof]))


# ---------------------------------------------------------------- André · Biomecânica (ângulo, eixo)
# o goniômetro vai sobre o retrato dentro de um visor ESCURO nos dois temas: um arquivo só (linhas brancas)
salvar("andre", "goniometro", A.goniometro(ESC["andre"], 118, "minimo", rotulo=False, R=140))
par("andre", "prumo", lambda f: A.prumo(f, H=318, rotulos=False))
par("andre", "planos", lambda f: A.planos(f, "sagital"))
salvar("andre", "pague-leve", D.pilha_1_2(ouro_esc("andre"), "blocos"))
salvar("andre", "pague-leve-claro", D.pilha_1_2(F_OURO, "blocos"))

# ---------------------------------------------------------------- Walter · Bodybuilding (barra, medida)
par("walter", "barra", lambda f: A.barra(f, 100, "ficha", rotulo=False))
par("walter", "fita", lambda f: A.fita_metrica(f, 0, 15, "reta", w=900))
par("walter", "anilha", lambda f: A.anilha(f, 20, "contorno", numeral=False))
salvar("walter", "pague-leve", D.pilha_1_2(ouro_esc("walter"), "barras"))
salvar("walter", "pague-leve-claro", D.pilha_1_2(F_OURO, "barras"))

# ---------------------------------------------------------------- Carlos · Treinamento Feminino (visão 360º)
par("carlos", "halo", lambda f: D.anel_progresso(f, 4, 4, "segmentado", centro=" ", legenda=""))
par("carlos", "anel", lambda f: D.anel_progresso(f, 4, 4, "segmentado", centro="360º", legenda=""))
par("carlos", "calendario", lambda f: D.calendario(f, 2026, 11, destaques=(11,), rotulo=True))
# o bloco da Carlos é chapado em ouro nos DOIS temas: um arquivo só (cartões em tinta sobre o ouro)
salvar("carlos", "pague-leve", D.pilha_1_2(F_OURO, "cartoes"))
salvar("carlos", "pague-leve-claro", D.pilha_1_2(F_OURO, "cartoes"))   # mesmo arquivo (ouro chapado nos 2 temas); o par evita 404 do ImgTema


# ---------------------------------------------------------------- logos (oficiais de brand.json; só o tom do texto muda)
def logo(origem, destino, trocas):
    s = open(origem, encoding="utf-8").read()
    for a, b in trocas:
        s = s.replace(a, b)
    open(destino, "w", encoding="utf-8").write(s)
    print("logo", os.path.basename(destino))


LG = os.path.join(RAIZ, "public", "logos", "solo")
os.makedirs(LG, exist_ok=True)
for prof, pasta, claro_de, escuro_de in (
        ("andre", "biomecanica", [('fill="#FEFEFC"', 'fill="#101010"')], None),
        ("carlos", "feminino", [('fill="#FFFFFF"', 'fill="#0B0B0B"')], None),
        ("walter", "bodybuilding", None, [('fill="#111111"', 'fill="#FEFEFC"')])):
    for v in ("nome", "pta"):
        src = f"{BRAND}/logo/c-rec/{pasta}/c-rec-{pasta}-{v}.svg"
        if claro_de:      # oficial já é o de fundo escuro (texto claro)
            logo(src, f"{LG}/c-rec-{prof}-{v}.svg", [])
            logo(src, f"{LG}/c-rec-{prof}-{v}-claro.svg", claro_de)
        else:             # oficial é o de papel (texto escuro): o escuro é o derivado
            logo(src, f"{LG}/c-rec-{prof}-{v}-claro.svg", [])
            logo(src, f"{LG}/c-rec-{prof}-{v}.svg", escuro_de)

# logos das pós (arquivo oficial monocromático: branco no escuro, preto no claro)
for prof, arq, cor in (("andre", "Ativo 15", "#fff"), ("walter", "Ativo 2", "#fff"), ("carlos", "Ativo 13", "#e6e6e6")):
    src = f"{BRAND}/referencias/pos-logos/{arq}.svg"
    logo(src, f"{LG}/pos-{prof}.svg", [])
    logo(src, f"{LG}/pos-{prof}-claro.svg", [(f"fill: {cor}", "fill: #0c0b09")])
