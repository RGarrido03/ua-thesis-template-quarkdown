// Runs before Quarkdown paginates. The generated lists use its reset-aware TOC resolver.
for (const [selector, lang] of [['.ua-pt, .ua-abstract-pt', 'pt'], ['.ua-en, .ua-abstract-en, .ua-ai-statement', 'en']]) {
  document.querySelectorAll(selector).forEach(element => { element.lang = lang; });
}

// Expand the first automatic use and keep only used entries in the glossary.
const acronymRows = [...document.querySelectorAll('.ua-abbr-row')];
const acronyms = new Map(acronymRows.map(row => [
  row.querySelector('.ua-abbr-key').textContent,
  row.querySelector('.ua-abbr-long').textContent,
]));
const used = new Set();
const expanded = new Set();
for (const ref of document.querySelectorAll('.ua-main .ua-abbr')) {
  const short = ref.textContent;
  const long = acronyms.get(short);
  if (!long) continue;
  used.add(short);
  if (ref.classList.contains('long')) {
    ref.textContent = long;
  } else if (ref.classList.contains('auto') && !expanded.has(short)) {
    ref.textContent = `${long} (${short})`;
    expanded.add(short);
  } else {
    const abbr = document.createElement('abbr');
    abbr.title = long;
    abbr.textContent = short;
    ref.replaceWith(abbr);
  }
}
for (const row of acronymRows) {
  if (!used.has(row.querySelector('.ua-abbr-key').textContent)) row.remove();
}

// Quarkdown's heading numbering is global. Keep its hierarchy and IDs, but give
// appendix chapters (and the labels that point to them) an alphabetic prefix.
const appendixPrefixes = new Map();
const appendixLabels = new Map();
function appendixLetter(index) {
  let text = '';
  for (let n = index + 1; n; n = Math.floor((n - 1) / 26)) {
    text = String.fromCharCode(65 + (n - 1) % 26) + text;
  }
  return text;
}
document.querySelectorAll('.ua-appendices h1[data-location]').forEach((heading, i) => {
  appendixPrefixes.set(heading.dataset.location, appendixLetter(i));
});
const labelNodes = 'h1, h2, h3, h4, caption, figcaption, formula[data-block]';
for (const item of document.querySelectorAll('.ua-appendices [data-location]')) {
  if (!item.matches(labelNodes)) continue;
  const label = item.dataset.location.replace(/^(\(?)(\d+)(?=\.|\)|$)/, (match, open, prefix) => {
    return appendixPrefixes.has(prefix) ? open + appendixPrefixes.get(prefix) : match;
  });
  item.dataset.location = label;
  const id = item.matches('caption, figcaption') ? item.parentElement.id : item.id;
  if (id) appendixLabels.set(id, label);
}
for (const tree of [document, document.querySelector('#sidebar-template')?.content].filter(Boolean)) {
  for (const item of tree.querySelectorAll('li[data-target-id]')) {
    const label = appendixLabels.get(item.dataset.targetId);
    if (label) item.dataset.location = label;
  }
}
const english = document.documentElement.lang === 'en';
for (const link of document.querySelectorAll('a[href^="#"]:has(> .cross-reference[data-location])')) {
  const id = link.getAttribute('href').slice(1);
  const label = appendixLabels.get(id);
  const ref = link.firstElementChild;
  if (label) ref.dataset.location = label;
  if (document.getElementById(id)?.matches('.ua-main h1')) {
    ref.dataset.localizedKind = label ? (english ? 'Appendix' : 'Apêndice') : (english ? 'Chapter' : 'Capítulo');
  }
}

// ponytail: Quarkdown 2.7 has no lists of captions; replace with native lists when available.
const listSelectors = {
  tables: 'table > caption[data-location]',
  figures: 'figure:not(:has(> pre)) > figcaption[data-location]',
  listings: 'figure:has(> pre) > figcaption[data-location]',
};
for (const nav of document.querySelectorAll('[data-ua-list]')) {
  const heading = nav.previousElementSibling;
  nav.setAttribute('aria-labelledby', heading.id);
  const entries = document.createElement('ol');
  for (const caption of document.querySelectorAll(listSelectors[nav.dataset.uaList])) {
    const id = caption.parentElement.id;
    const title = caption.textContent.trim();
    if (!id || !title) continue;
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(id)}`;
    link.textContent = title;
    const item = document.createElement('li');
    item.dataset.location = caption.dataset.location;
    item.dataset.depth = '1';
    item.append(link);
    entries.append(item);
  }
  nav.append(entries);
}
