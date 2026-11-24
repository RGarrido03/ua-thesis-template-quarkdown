"""Smoke-test the rendered, unmodified sample with Poppler."""
import re
import subprocess
import sys

pdf = sys.argv[1]

def poppler(program, *args):
    return subprocess.check_output([program, *args, pdf, *(['-'] if program == 'pdftotext' else [])], text=True)

info = poppler('pdfinfo')
size = re.search(r'^Page size:\s+([\d.]+) x ([\d.]+) pts', info, re.M)
assert size and all(abs(float(got) - expected) < 1 for got, expected in zip(size.groups(), (595.28, 841.89))), 'Expected A4'

pages = poppler('pdftotext', '-layout').rstrip('\f').split('\f')
assert 'Universidade de Aveiro' in pages[0] and 'PROVISÓRIO' in pages[0], 'Outer cover missing'
assert 'Dissertação apresentada' in pages[1] and 'PROVISÓRIO' not in pages[1], 'Wrong inner cover'
for pos, marker in enumerate(['o júri / the jury', 'agradecimentos', 'palavras-chave', 'keywords', 'use of'], start=2):
    assert marker in pages[pos], f'Wrong preface page {pos + 1}: expected {marker}'
assert not pages[7].strip(), 'Expected an unnumbered blank verso'

def starts_with_title(title):
    return next(i for i, page in enumerate(pages) if page.lstrip().startswith(title))

toc = starts_with_title('Índice')
assert toc == 8 and re.search(r'Índice\s+i\s*$', pages[toc], re.M), 'TOC should start at Roman i'
def folio(page):
    return page.strip().splitlines()[-1].strip()

for title, numeral in [('Lista de Tabelas', 'ii'), ('Lista de Figuras', 'iii'), ('Acrónimos', 'v')]:
    assert title in pages[toc] and folio(pages[starts_with_title(title)]) == numeral, f'Wrong index folio: {title}'
for title, caption in [('Lista de Tabelas', 'Tabela 2.1:'), ('Lista de Figuras', 'Figura 2.1:')]:
    target = next(page for page in pages if caption in page)
    assert re.search(rf'^\s*2\.1\s+.+\s+{folio(target)}\s*$', pages[starts_with_title(title)], re.M), f'Wrong caption folio: {title}'

first = next(i for i, p in enumerate(pages) if 'CAPÍTULO' in p and 'Introdução' in p)
assert first % 2 == 0 and pages[first].strip().endswith('1'), 'First chapter should restart at Arabic 1 on a recto'
assert re.search(r'1\s+Introdução\s+1\s*$', pages[toc], re.M), 'TOC did not pick up the chapter reset'
assert 'Secções e Subsecções' not in pages[toc], 'TOC should stop at the section level'
assert any('Secções e Subsecções' in page for page in pages[first:]), 'Subsections should still render in the body'
assert all(i % 2 == 0 for i, p in enumerate(pages) if 'CAPÍTULO' in p or 'APÊNDICE' in p), 'Chapter or appendix opened on a verso'
assert '[1]' in pages[starts_with_title('Referências Bibliográficas')], 'Native IEEE bibliography missing'
assert re.search(r'^\s*A\.1\s', pages[toc], re.M), 'Appendix numbers were not propagated to TOC'
assert any(re.search(r'^\s*A\.1\s', p, re.M) for p in pages if 'APÊNDICE' in p), 'Appendix section number missing'
assert 'Asymmetric Digital Subscriber Line (ADSL)' in ' '.join(''.join(pages).split()), 'First-use acronym expansion missing'
assert 'A.1' in pages[toc] and 'Apêndice A' in ''.join(pages), 'Appendix cross-reference not relabelled'
assert '[???]' not in ''.join(pages), 'Unresolved cross-reference'
print(f'Checked {len(pages)} A4 pages, preface, folios, caption indexes, bibliography, glossary and appendix references.')
