# What Quarkdown changes

This port targets [Quarkdown 2.7.0](https://github.com/iamgio/quarkdown/releases/tag/v2.7.0) and follows [DETI's LaTeX reference at `ef27cec`](https://github.com/detiuaveiro/ua-thesis-template/tree/ef27cec). Quarkdown is a Markdown superset with functions, variables, conditionals and file inclusion. The same compiler supports [paged documents, web documents, documentation sites and slides](https://quarkdown.com/wiki/document-types/). Here we use `paged`: it renders HTML, Paged.js lays it out, and Chromium exports the PDF.

## Where it saves work

| In the LaTeX template | In this port |
| --- | --- |
| `\documentclass`, memoir geometry and type block calculations | [`.pageformat`](https://quarkdown.com/wiki/page-format/) sets A4 and mirrored margins; the body block is still 155 × 245 mm. |
| `\input` plus LaTeX chapter/section commands | `.include {chapters/chapter1.qd}` in the entry point; `#`, `##`, `###`, `####` in the text. |
| `\frontmatter`, `\mainmatter`, custom page counter handling | [`.formatpagenumber` and `.resetpagenumber`](https://quarkdown.com/wiki/page-counter/) run at the two boundaries. Native `.currentpage` and `.tableofcontents` use the same logical folios. |
| `graphicx`, `caption`, minted, math packages and `\label`/`\ref` | Markdown images, tables, fenced code and [TeX equations](https://quarkdown.com/wiki/tex-formulae/) with `{#id}` and [`.ref {id}`](https://quarkdown.com/wiki/cross-references/). No shell-escape or Pygments for highlighting. |
| `biblatex` and a Biber pass | [`.cite` and `.bibliography`](https://quarkdown.com/wiki/bibliography/) read the existing BibTeX directly and render IEEE citations and references in the same build. |
| Package options and nested TeX macros for title pages | One settings file and a few functions for repeated rows, using CSS for precise coordinates. The actual acknowledgements and abstracts remain ordinary Markdown. |
| Separate PDF compile/watch workflow | The CLI builds [PDF](https://quarkdown.com/wiki/pdf-export/) or a portable HTML folder, and can serve a live preview. |

The economy is mainly in the manuscript: authors don't need macros for every heading, list, figure or footnote. The institutional design still needs a layout layer. Quarkdown also offers Mermaid, charts, multi-column and landscape layouts, and reusable functions; you don't need any of those extensions to start a chapter.

## What is a port, not a native feature

- **Page furniture.** The CSS sets full-bleed preface pages, the cover stripe and branding, the heading treatments, right-hand chapter starts and empty filler versos. In Paged.js, a page break selector must match within the content fragment, not depend on an ancestor outside it. The CSS also keeps pagination markers out of the physical flow.
- **Caption indexes.** Quarkdown can number and link captions, but 2.7.0 has no list-of-figures, list-of-tables or list-of-listings function. A small script reads native caption numbers and IDs before pagination and builds linked lists. The same Quarkdown TOC page-number resolver then fills their page numbers. The script depends on rendered HTML conventions from 2.7.0; run `make check` before upgrading.
- **Appendices.** Heading numbering is document-global in this release. The adapter changes the prefix on appendix headings, captions, equations, TOC entries and their cross-references, keeping the original anchors and continuing the Arabic folios. Appendices open on a right-hand page; this does not reproduce the extra blank page before the appendix in the compiled LaTeX sample.
- **Acronyms.** The release has no `acronym` package equivalent. The template keeps a single glossary, expands the first automatic usage in the body, and lists just the entries used. Plural spellings are down to the author. The bundled `latex-siunitx` library covers common SI notation, but isn't the full LaTeX package.
- **Typography and PDF.** The bundled fonts are TeX Gyre counterparts of the upstream cover and body families. Chromium and KaTeX differ from TeX in line breaking, equations and font encoding. Images and tables follow the text rather than using TeX's float-placement algorithm. Expect different line wraps or page counts for the same prose. The export carries the document title and clickable links, but does not write author, subject, or keywords into the PDF metadata. It also lacks reader-sidebar bookmarks and PDF page labels: the on-page folios and linked contents work, while the reader's page selector uses physical page numbers. This is a standard PDF export, not a PDF/A certification or a replica of the upstream Ghostscript print/ebook post-processing. Overleaf does not build this format.

The sample was checked against the compiled LaTeX reference. `make check` builds and checks A4 size, cover/preliminary order, Roman and Arabic folios, caption indexes, IEEE bibliography, glossary expansion and appendix references. Separate test renders covered the final MAP cover with the economy stripe, an English-language proposal, the progress report and the coverless drafting mode.

Write in Quarkdown, change the CSS only if the institution's layout changes, and inspect the final PDF before submission.
