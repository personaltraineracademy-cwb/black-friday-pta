"""Exporta, da biblioteca `ornamentos` (kit revisado, só leitura), os elementos usados pelas 3 páginas solo da v3.
Cada elemento sai com as cores da ficha do produto (azul · vermelho · roxo; o dourado só no bloco "pague 1, leve 2").

  python scripts/solo-v3-elementos.py            # grava em public/img/solo/<prof>/v3/*.svg

Nada aqui desenha elemento novo: todo SVG vem de uma função do kit. O que o script faz a mais:
  - gon-base.svg / gon-arm*.svg: separa o braço móvel do goniômetro (mesmo viewBox) para a página poder ABRIR o ângulo;
  - TEMA: o SVG tem cor assada, então cada elemento que fica sobre o fundo da página sai em 2 versões:
      <nome>-sobre-escuro.svg  traço claro (tinta #FEFEFC) para superfície escura
      <nome>-sobre-claro.svg   traço escuro (tinta #0C0B09) para superfície clara (papel #ECE7DC)
    Elemento que fica só sobre área de cor do produto (ou cuja cor funciona nos dois fundos) sai numa versão só.
  - anilha, barra e fita: só escolhe parâmetros (sem numeral/rótulo de carga onde não é cópia da página).
  - copia os logos oficiais das pós (referencias/pos-logos) sem alterar.
"""
import os
import re
import shutil
import sys

KIT = "C:/Users/User/design/skills/direcao-de-arte/scripts"
sys.path.insert(0, KIT)
from ornamentos import carregar_tudo, ficha_black_pta  # noqa: E402

carregar_tudo()
from ornamentos import assunto, dados, fios, grades, pontos  # noqa: E402

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img", "solo")
LOGOS = "C:/Users/User/design/testes/black-pta/referencias/pos-logos"
PAPEL, INK = "#ECE7DC", "#0C0B09"
APOIO_CLARO, APOIO_ESCURO = "#4A463C", "#CFC9BD"
OURO, OURO_CLARO = "#CDA85E", "#7C5F1C"


def gravar(prof, nome, svg):
    d = os.path.join(RAIZ, prof, "v3")
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, nome), "w", encoding="utf-8") as fh:
        fh.write(svg)
    print(f"{prof}/v3/{nome}  {len(svg) / 1024:.1f} KB")


def esc(prod):
    """Ficha para superfície ESCURA (a nativa)."""
    return ficha_black_pta(prod).com(apoio=APOIO_ESCURO)


def cla(prod):
    """Ficha para superfície CLARA: papel de fundo, tinta escura, cor do produto igual."""
    return ficha_black_pta(prod).com(fundo=PAPEL, tinta=INK, apoio=APOIO_CLARO)


def dupla(prof, nome, prod, fn):
    """fn(ficha) -> Elemento. Grava <nome>-sobre-escuro.svg e <nome>-sobre-claro.svg."""
    gravar(prof, f"{nome}-sobre-escuro.svg", fn(esc(prod)).svg)
    gravar(prof, f"{nome}-sobre-claro.svg", fn(cla(prod)).svg)


# ------------------------------------------------------------------ ANDRÉ · azul · Biomecânica
def gon(f):
    return assunto.goniometro(f, angulo=120, modo="cheio", completo=True, rotulo=False)


def parte_braco(g, cor_braco):
    """(svg do mostrador sem o braço, svg só do braço móvel + índice + pino), mesmo viewBox."""
    m = re.search(r'<path d="[^"]*" fill="%s" fill-rule="evenodd" transform="rotate\(300\.00\)"/>' % cor_braco, g.svg)
    assert m, "braço móvel não encontrado (a função mudou?)"
    j = g.svg.index('<g transform="translate(')
    abre = g.svg[j:g.svg.index(">", j) + 1]
    return g.svg[:m.start()] + "</g></svg>", g.svg[:j] + abre + g.svg[m.start():]


g = gon(esc("biomecanica"))
base, arm = parte_braco(g, "#FEFEFC")
gravar("andre", "gon-base.svg", base)  # o mostrador é igual nos 2 temas (azul + tinta escura)
gravar("andre", "gon-arm-sobre-escuro.svg", arm)
gravar("andre", "gon-arm-sobre-claro.svg", parte_braco(gon(cla("biomecanica")), INK)[1])
print("goniometro", f"{g.w:.0f}x{g.h:.0f}", "pivo", re.search(r"translate\(([\d. ]+)\)", g.svg).group(1))

# prumo: sobre o painel azul (traço escuro; igual nos 2 temas)
fpn = ficha_black_pta("biomecanica").com(fundo="#007BFF", tinta=INK, acento=INK, sobre_acento="#007BFF", apoio=INK)
gravar("andre", "prumo-painel.svg", assunto.prumo(fpn, H=318.0, rotulos=True, cor_fio=INK).svg)
dupla("andre", "planos", "biomecanica", lambda f: assunto.planos(f, destaque="sagital"))
dupla("andre", "regua", "biomecanica", lambda f: fios.regua(f, comp=460, ini=0, fim=100, rotulos=20))
for n in (1, 2, 3):  # "/03" em cinza de apoio: a cor do produto só em área grande
    gravar("andre", f"num-{n}-sobre-escuro.svg", fios.numeracao(esc("biomecanica").com(acento=APOIO_ESCURO), tipo="grande", n=n, total=3).svg)
    gravar("andre", f"num-{n}-sobre-claro.svg", fios.numeracao(cla("biomecanica").com(acento=APOIO_CLARO), tipo="grande", n=n, total=3).svg)
shutil.copyfile(os.path.join(LOGOS, "Ativo 15.svg"), os.path.join(RAIZ, "andre", "v3", "pos-biomecanica.svg"))

# ------------------------------------------------------------------ WALTER · vermelho · Bodybuilding
fw = esc("bodybuilding")
gravar("walter", "anilha.svg", assunto.anilha(fw, kg=25, modo="cheio").svg)  # vermelho cheio: igual nos 2 temas
dupla("walter", "barra", "bodybuilding", lambda f: assunto.barra(f, carga=100, modo="treino", rotulo=False))
gravar("walter", "fita.svg", assunto.fita_metrica(fw, ini=0, fim=15, modo="reta").svg)  # vermelho + tinta escura
for n in (1, 2, 3):
    gravar("walter", f"num-{n}-sobre-escuro.svg", fios.numeracao(esc("bodybuilding"), tipo="anel", n=n, total=3, cor="#FEFEFC").svg)
    gravar("walter", f"num-{n}-sobre-claro.svg", fios.numeracao(cla("bodybuilding"), tipo="anel", n=n, total=3, cor=INK).svg)
fo_e = esc("bodybuilding").com(acento=OURO, sobre_acento=INK, fundo="#15130F")
fo_c = cla("bodybuilding").com(acento=OURO_CLARO, sobre_acento=PAPEL, fundo="#E1DACB")
gravar("walter", "pilha-1-2-sobre-escuro.svg", dados.pilha_1_2(fo_e, modo="blocos").svg)
gravar("walter", "pilha-1-2-sobre-claro.svg", dados.pilha_1_2(fo_c, modo="blocos").svg)
shutil.copyfile(os.path.join(LOGOS, "Ativo 2.svg"), os.path.join(RAIZ, "walter", "v3", "pos-bodybuilding.svg"))

# ------------------------------------------------------------------ CARLOS · roxo · Treinamento Feminino
fc_e, fc_c = esc("feminino"), cla("feminino")
gravar("carlos", "polar-sobre-escuro.svg", grades.polar(fc_e, estilo="graduada", w=900, h=900, cor=fc_e.acento).svg)
gravar("carlos", "polar-sobre-claro.svg", grades.polar(fc_c, estilo="graduada", w=900, h=900, cor=fc_c.acento).svg)
gravar("carlos", "meio-tom.svg", pontos.meio_tom(fc_e, modo="radial", w=700, h=700, cor=fc_e.acento).svg)
gravar("carlos", "anel-4.svg", dados.anel_progresso(fc_e, valor=4, total=4, modo="segmentado", centro=" ", legenda="").svg)
