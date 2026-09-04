# Geovalor Angola, Lda. — pacote de identidade e site

Tudo é HTML/CSS/JS puro. Sem build, sem npm. Abre qualquer `.html` num
navegador ou envia por FTP directo para a Hostinger.

## Ficheiros

| Ficheiro | O que é |
|---|---|
| `geovalor-subsolo.html` | A experiência principal. Fotografia real do corte geológico com câmara cinematográfica conduzida pelo scroll, em 8 tempos. |
| `geovalor-identidade.html` | O manual de identidade: símbolo, cor, tipografia, linguagem gráfica, moldes de post, tokens e voz. |
| `geovalor-tokens.css` | Os tokens em CSS, prontos a importar em qualquer página nova. |
| `assets/geovalor-mark.svg` | O símbolo em vector (hexágono + três arcos + V + cruz de registo). |
| `assets/hero-cutaway.png` | A fotografia do corte geológico. |

## Paleta

| Cor | Hex | RGB | Função |
|---|---|---|---|
| Carvão | `#111311` | 17 19 17 | Fundo primário |
| Verde basalto | `#11201D` | 17 32 29 | Planos, cartões |
| Marfim mineral | `#F4F0E8` | 244 240 232 | Texto, fundo claro |
| Cobre | `#D1844E` | 209 132 78 | Acento único |
| Cinza técnico | `#687570` | 104 117 112 | Metadados, legendas |

Proporção numa peça: 70% carvão, 16% basalto, 8% marfim, 4% cinza técnico, 2% cobre.

## Tipografia

- **Playfair Display** (600, itálico 500) — títulos. Tracking negativo: −.04em a −.05em.
- **Manrope** (400–800) — interface e corpo. Corpo a 14–15px, altura de linha 1.8.
- **DM Mono** (400–500) — dados, coordenadas, unidades, etiquetas de secção.
  Sempre em caixa alta, tracking .12em a .20em, nunca em parágrafo corrido.

Carregadas por Google Fonts. Para uso offline, descarrega os ficheiros e
troca o `<link>` por `@font-face`.

## Regras de construção

1. Raio de canto **zero**. A única forma curva permitida é o arco de onda e o círculo de registo.
2. Linha de 1px em ecrã, 0,25pt em impressão. Tracejado 7/6 para o inferido, contínuo para o medido.
3. Grelha de 12 colunas, goteira de 26px, margem lateral `max(24px, 4vw)`.
4. Fotografia: terreno real ao crepúsculo, luz de contorno, contraste alto, saturação baixa.
5. Números sempre com unidade. Valor em Playfair, etiqueta em DM Mono. Milhares com espaço fino: `1 840 m`.
6. Movimento: a câmara aproxima-se e desce, nunca gira sobre si. 0,8–1,4s, curva `power3.out`.
   Revelação por opacidade e traço, nunca por salto.
7. Sem sombras difusas, sem gradientes decorativos, sem emoji, sem superlativos.

## Redes sociais

Quatro moldes, especificados em `geovalor-identidade.html` secção 05:

- **Feed** 1080×1080 — foto de fundo, título no terço inferior sobre gradiente
- **Retrato** 1080×1350 — mesmo molde, mais respiro
- **Dado** 1080×1080 — fundo basalto sólido, um número grande em Playfair
- **Story** 1080×1920 — fundo marfim, convite curto

Margem interior 9% em todos. Título com no máximo 7 palavras. Barra de cobre
de 3px a fechar a base. A legenda não repete o título.

## Voz

Frase curta, verbo directo, número com unidade. Método antes do resultado.
Quando não se sabe, diz-se que não se sabe e indica-se o que falta medir.
O rigor é o argumento de venda — não há promessas de retorno nem linguagem
de oportunidade.

## Sequência do site (`geovalor-subsolo.html`)

Controlada por scroll com GSAP ScrollTrigger e Lenis, sincronizada à posição
exacta em ambos os sentidos. A timeline tem duração 100, pelo que cada
percentagem de scroll corresponde a uma unidade da sequência:

| % | Capítulo |
|---|---|
| 0–15 | Horizonte e aproximação |
| 15–30 | Topografia e levantamento geofísico |
| 30–45 | Abertura da estrutura e falhas |
| 45–60 | Sistema petrolífero onshore |
| 60–72 | Chaminé kimberlítica |
| 72–84 | Ouro e cobre nas fracturas |
| 84–94 | Perfuração até ao alvo |
| 94–100 | Visão geral, relatório e CTA |

Camadas SVG nomeadas, alinhadas ao pixel sobre a fotografia:
`topographicLines`, `surveyVehicle`, `drillRig`, `pumpjack`, `seismicWaves`,
`anomalyPoints`, `sedimentaryLayers`, `geologicalFaults`, `capRock`,
`oilReservoir`, `kimberlitePipe`, `diamondIndicators`, `goldVeins`,
`copperZones`, `boreholePath`.

Em mobile o zoom é reduzido a 68%, as etiquetas ancoradas e o trilho lateral
são escondidos, e o smooth scroll nativo assume — a narrativa mantém-se
completa. `prefers-reduced-motion` desliga a deriva de câmara e os pulsos.

## Substituir a fotografia

A imagem actual tem 1672px de largura. Nas maiores aproximações fica suave.
Se tiveres o render em 4K, substitui `assets/hero-cutaway.png` mantendo a
proporção **1672:941** (16:9 aproximado) e ganha nitidez sem tocar no código.
Se a proporção mudar, ajusta o valor `1.7768` em `.frame` e o `viewBox` da
`svg.overlay` para as novas dimensões.
