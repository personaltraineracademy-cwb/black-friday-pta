"""Elementos de biomecânica refeitos (11/10/2026, crítica dela: "estranhos; têm que ser verdadeiros, lógicos e bonitos").

  python scripts/solo-andre-elementos.py   # grava em public/img/solo/andre/{v1,v2,v3}/

1. goniômetro CIRCULAR (kit `assunto.goniometro`, modo minimo, completo): enquadramento simétrico em volta do fulcro
   (o círculo fica concêntrico ao busto; antes o instrumento ficava pela metade atrás do corpo) e braços curtos.
2. planos anatômicos COM a figura em posição anatômica (frontal · sagital · transversal), nomes inteiros dentro do
   enquadramento (antes "FRONTAL" saía cortado no viewBox).
Nada novo no kit: só parâmetros, enquadramento e a figura (pictograma).
"""
import math
import os
import re
import sys

KIT = "C:/Users/User/design/skills/direcao-de-arte/scripts"
sys.path.insert(0, KIT)
from ornamentos import carregar_tudo, ficha_black_pta  # noqa: E402

carregar_tudo()
from ornamentos import assunto  # noqa: E402
from ornamentos import assunto as A  # noqa: E402

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img", "solo", "andre")
AZUL, INK, PAPEL = "#007BFF", "#0C0B09", "#ECE7DC"


def ficha(tema):
    f = ficha_black_pta("biomecanica")
    if tema == "d":
        return f.com(acento=AZUL, sobre_acento=INK, fundo=INK, apoio="#CFC9BD")
    return f.com(acento=AZUL, sobre_acento=PAPEL, fundo=PAPEL, tinta=INK, apoio="#4A463C")


def gravar(sub, nome, svg):
    d = os.path.join(RAIZ, sub)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, nome), "w", encoding="utf-8") as fh:
        fh.write(svg)
    print(f"andre/{sub}/{nome}  {len(svg) / 1024:.1f} KB")


def gonio_circ(f, angulo):
    s = assunto.goniometro(f, angulo=angulo, modo="minimo", completo=True, rotulo=False).svg
    # braços curtos (1,18 R em vez de 1,62 R) e enquadramento simétrico em volta do fulcro (230, 177)
    s = re.sub(r"M0 0H226\.\d+", "M0 0H165.00", s)
    S = 178
    s = re.sub(r'viewBox="[^"]+" width="[^"]+" height="[^"]+"',
               f'viewBox="{230 - S} {177 - S} {2 * S} {2 * S}" width="{2 * S}" height="{2 * S}"', s, count=1)
    return s


def planos_figura(f, destaque="sagital", s=138.0):
    """Planos anatômicos (mesma projeção do kit) + pictograma da pessoa em posição anatômica no centro."""
    t, ink, apo, ac, u = f.traco, f.tinta, f.apoio, f.acento, f.unidade
    ex = (math.cos(math.radians(12)), math.sin(math.radians(12)))
    ey = (0.60 * math.cos(math.radians(35)), -0.60 * math.sin(math.radians(35)))

    def P(x, y, z):
        return (x * ex[0] + y * ey[0], x * ex[1] + y * ey[1] - z)

    a, b = s * 0.62, s * 0.82
    PL = {"frontal": [(-a, 0, -b), (a, 0, -b), (a, 0, b), (-a, 0, b)],
          "sagital": [(0, -a, -b), (0, a, -b), (0, a, b), (0, -a, b)],
          "transversal": [(-a, -a, 0), (a, -a, 0), (a, a, 0), (-a, a, 0)]}
    estilo = {"frontal": "", "sagital": 'stroke-dasharray="8 5"', "transversal": 'stroke-dasharray="1.5 4" stroke-linecap="round"'}

    def poly(pts):
        return "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + "Z"

    o = []
    # planos de trás (sagital e frontal) antes da figura; transversal por cima
    for nome in ("sagital", "frontal"):
        pts = [P(*p) for p in PL[nome]]
        sel = destaque == nome
        o.append(f'<path d="{poly(pts)}" fill="{ac if sel else ink}" fill-opacity="{0.28 if sel else 0.05}" '
                 f'stroke="{ac if sel else ink}" stroke-width="{t * (0.9 if sel else 0.7):.2f}" {estilo[nome]} stroke-linejoin="round"/>')
    # figura: posição anatômica (de frente, braços ao lado com as palmas para a frente, pés juntos)
    w = t * 2.2
    fig = (f'<g fill="none" stroke="{ink}" stroke-width="{w:.2f}" stroke-linecap="round" stroke-linejoin="round">'
           f'<circle cx="0" cy="{-b * 0.86:.2f}" r="{b * 0.115:.2f}"/>'                       # cabeça
           f'<path d="M0 {-b * 0.745:.2f}V{-b * 0.69:.2f}"/>'                                 # pescoço
           f'<path d="M{-b * 0.2:.2f} {-b * 0.66:.2f}H{b * 0.2:.2f}"/>'                       # ombros
           f'<path d="M{-b * 0.15:.2f} {-b * 0.66:.2f}L{-b * 0.12:.2f} {-b * 0.02:.2f}'      # tronco
           f'M{b * 0.15:.2f} {-b * 0.66:.2f}L{b * 0.12:.2f} {-b * 0.02:.2f}H{-b * 0.12:.2f}"/>'
           f'<path d="M{-b * 0.2:.2f} {-b * 0.66:.2f}L{-b * 0.3:.2f} {-b * 0.1:.2f}'          # braço esq.
           f'M{b * 0.2:.2f} {-b * 0.66:.2f}L{b * 0.3:.2f} {-b * 0.1:.2f}"/>'                  # braço dir.
           f'<path d="M{-b * 0.07:.2f} {-b * 0.02:.2f}L{-b * 0.09:.2f} {b * 0.88:.2f}'        # pernas
           f'M{b * 0.07:.2f} {-b * 0.02:.2f}L{b * 0.09:.2f} {b * 0.88:.2f}"/>'
           f'</g>')
    o.append(fig)
    pts = [P(*p) for p in PL["transversal"]]
    o.append(f'<path d="{poly(pts)}" fill="{ink}" fill-opacity="0.05" stroke="{ink}" stroke-width="{t * 0.7:.2f}" '
             f'{estilo["transversal"]} stroke-linejoin="round"/>')
    o.append(f'<circle cx="{P(0, 0, 0)[0]:.2f}" cy="{P(0, 0, 0)[1]:.2f}" r="{t * 1.4:.2f}" fill="{ac}"/>')
    # rótulos: de um canto livre de cada plano, com a linha-guia; texto em curvas (mesma rotina do kit)
    labs = {"frontal": (P(a, 0, -b), 1), "sagital": (P(0, a, b), 1), "transversal": (P(-a, -a, 0), -1)}
    for nome, ((x, y), lado) in labs.items():
        dx = lado * u * 1.6
        o.append(f'<path d="M{x:.2f} {y:.2f}H{x + dx:.2f}" fill="none" stroke="{apo}" stroke-width="{t * 0.4:.2f}"/>')
        o.append(A.rot_tinta(f, nome.upper(), u * 0.48, x + dx + lado * u * 0.3, y + A.cap(f.fonte_texto) * u * 0.24,
                             ac if destaque == nome else ink, f.fonte_texto, 0.08, "start" if lado > 0 else "end"))
    return "".join(o)


def moldura(corpo, x0, y0, x1, y1, pad=14):
    w, h = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0 - pad:.2f} {y0 - pad:.2f} {w:.2f} {h:.2f}" '
            f'width="{w:.2f}" height="{h:.2f}">{corpo}</svg>')


if __name__ == "__main__":
    for tema in ("d", "l"):
        f = ficha(tema)
        gravar("v1", f"gonio-circ-{tema}.svg", gonio_circ(f, 90))
        gravar("v2", f"gonio-circ-{tema}.svg", gonio_circ(f, 50))
        corpo = planos_figura(f)
        # enquadramento: a figura e os planos cabem em ±(1,25 s) na largura e ±(1,0 s) na altura, mais os rótulos
        svg = moldura(corpo, -300, -150, 270, 150, pad=10)
        nomes = {"d": ("v1/planos.svg", "v2/planos-d.svg", "v3/planos-sobre-escuro.svg"),
                 "l": ("v1/planos-claro.svg", "v2/planos-l.svg", "v3/planos-sobre-claro.svg")}[tema]
        for rel in nomes:
            sub, nome = rel.split("/")
            gravar(sub, nome, svg)
