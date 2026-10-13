"""Gera os elementos do kit (biblioteca ornamentos) usados nas páginas solo da v2, em 2 variantes:
  -d = para superfície escura (tinta #ECE7DC), -l = para superfície clara (tinta #0C0B09); ouro: cartão único.
Saída: public/img/solo/<prof>/v2/<nome>-d.svg, -l.svg  (+ _medidas.json com o fulcro do goniômetro).
Rodar:  cd C:/Users/User/design/skills/direcao-de-arte/scripts && python <este arquivo>
Nada daqui entra na biblioteca; só chama as funções dela com parâmetros."""
import json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'C:/Users/User/design/skills/direcao-de-arte/scripts')
from ornamentos import carregar_tudo
from ornamentos.nucleo import Ficha
carregar_tudo()
from ornamentos import assunto, dados, grades, linhas, selos

ROOT = 'C:/Users/User/AppData/Local/Temp/black-pta-rascunho/solo-v2/public/img/solo'
INK, PAPER, GOLD = '#0C0B09', '#ECE7DC', '#CDA85E'
PROD = {'andre': '#007BFF', 'walter': '#E8341C', 'carlos': '#934EFF'}


def ficha(prod, superficie):
    ac = PROD[prod]
    if superficie == 'd':
        return Ficha(fundo=INK, tinta=PAPER, acento=ac, sobre_acento=INK, papel=PAPER, apoio='#9A968B', raio=28.0, nome=f'{prod}-d')
    if superficie == 'l':
        return Ficha(fundo=PAPER, tinta=INK, acento=ac, sobre_acento=INK, papel=PAPER, apoio='#5C584E', raio=28.0, nome=f'{prod}-l')
    return Ficha(fundo=GOLD, tinta=INK, acento=INK, sobre_acento=GOLD, papel=PAPER, apoio='#5A4714', raio=28.0, nome=f'{prod}-ouro')


def rot90(svg):
    """Gira 90° (mesmo elemento, em pé): troca w×h e envolve o conteúdo num <g>."""
    m = re.match(r'<svg[^>]*viewBox="0 0 ([\d.]+) ([\d.]+)"[^>]*>(.*)</svg>$', svg, re.S)
    w, h, inner = float(m.group(1)), float(m.group(2)), m.group(3)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {h:.2f} {w:.2f}" width="{h:.2f}" height="{w:.2f}">'
            f'<g transform="translate({h:.2f} 0) rotate(90)">{inner}</g></svg>')


medidas = {}


def salvar(prod, nome, svg, extra=None):
    d = f'{ROOT}/{prod}/v2'
    os.makedirs(d, exist_ok=True)
    open(f'{d}/{nome}.svg', 'w', encoding='utf-8').write(svg)
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    medidas[f'{prod}/{nome}'] = {'w': float(m.group(1)), 'h': float(m.group(2)), **(extra or {})}
    print(prod, nome, len(svg) // 1024, 'KB')


for sup in ('d', 'l'):
    # ---- André · biomecânica
    f = ficha('andre', sup)
    el = assunto.goniometro(f, 60, 'minimo', rotulo=False, R=140.0)
    m = re.search(r'translate\((-?[\d.]+) (-?[\d.]+)\)', el.svg)
    salvar('andre', f'gonio-{sup}', el.svg, {'fx': float(m.group(1)) / el.w, 'fy': float(m.group(2)) / el.h})
    salvar('andre', f'prumo-{sup}', assunto.prumo(f, rotulos=False).svg)
    salvar('andre', f'planos-{sup}', assunto.planos(f).svg)
    # ---- Walter · bodybuilding
    f = ficha('walter', sup)
    salvar('walter', f'fita-{sup}', rot90(assunto.fita_metrica(f, 0, 30, 'reta', 900.0, cor=f.acento).svg))
    salvar('walter', f'anilha-{sup}', assunto.anilha(f, 20, 'contorno').svg)
    # ---- Carlos · treinamento feminino
    f = ficha('carlos', sup)
    salvar('carlos', f'anel-{sup}', dados.anel_progresso(f, 4, 4, 'segmentado', centro=' ', legenda='', R0=150.0).svg)
    salvar('carlos', f'polar-{sup}', grades.polar(f, 'completa').svg)
    arcos = [e for n, fn in linhas.REGISTRO.get('linhas', [])] if False else None

# arcos concêntricos (linhas · "concêntricos · arco da base") para o fecho da Carlos
from ornamentos.nucleo import REGISTRO
for sup in ('d', 'l'):
    f = ficha('carlos', sup)
    its = []
    for n, fn in REGISTRO['linhas']:
        its += fn(f)
    el = [e for e in its if e.nome.startswith('concêntricos · arco da base')][0]
    salvar('carlos', f'arcos-{sup}', el.svg)

# carimbo da noite do Walter em tinta preta (vai sobre o bloco vermelho nos dois temas)
f = ficha('walter', 'l')
salvar('walter', 'carimbo', selos.carimbo(f, 'retangulo', cor=INK, linhas=('TER 10/11', 'AO VIVO', '20H30')).svg)

# cartão ouro: a oferta Black (um arquivo por professor)
f = ficha('andre', 'ouro')
salvar('andre', 'pague', dados.pilha_1_2(f, 'blocos').svg)
salvar('walter', 'pague', dados.pilha_1_2(f, 'barras').svg)
salvar('carlos', 'pague', dados.pilha_1_2(f, 'cartoes').svg)
json.dump(medidas, open(f'{ROOT}/_medidas.json', 'w'), indent=1)
