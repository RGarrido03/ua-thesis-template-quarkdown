# University of Aveiro thesis template — Quarkdown

An unofficial Quarkdown port of [DETI's LaTeX template](https://github.com/detiuaveiro/ua-thesis-template/tree/ef27cec) for University of Aveiro theses, dissertations, proposals, and progress reports. The sample is in Portuguese, with Portuguese and English titles and abstracts.

## Build the sample

Install [Quarkdown 2.7.0](https://github.com/iamgio/quarkdown/releases/tag/v2.7.0) and a [Chromium-family browser](https://quarkdown.com/wiki/pdf-export/). The Quarkdown installer or package manager can set up the recommended `chrome-headless-shell`. For an existing Chrome installation on macOS, set:

```sh
export QD_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

From the repository root:

```sh
make                 # build/thesis.pdf
make html            # build/thesis/index.html, with assets
make preview         # live browser preview on save
make check           # compile and check the unmodified sample (Python 3 + Poppler)
```

Alternatively, run `quarkdown compile --strict --allow=native-content --pdf --out-name=thesis --out=build thesis.qd`. The `native-content` permission is for this template's local stylesheet and caption-list script. Grant it only to sources you trust. No TeX distribution, Biber, Pandoc, or npm packages are needed.

## Write your thesis

1. Start with [metadata.qd](metadata.qd): enter your name, both titles (up to 130 characters each, as in upstream), year, degree and supervision. Set `uaLanguage` to `pt` or `en` for generated document labels and hyphenation. Translate the sample chapters separately if you are writing in English.
2. Edit [front/](front/): jury, funding, acknowledgements, abstracts, and the AI-use statement. `uaEnglish`, `uaJury`, `uaAcknowledgements`, `uaGrants`, and `uaAiStatement` are independent `yes`/`no` switches. Keep the required Portuguese abstract. Setting `uaCover` to `no` is useful while drafting, not for submission.
3. Write in [chapters/](chapters/) and list chapter files in [thesis.qd](thesis.qd) in reading order. Use one `#` per chapter, then `##`, `###` and `####` for sections. Chapter openings advance to the next right-hand page automatically; don't add `<<<` before them. Include any local images relative to the file where they are authored.
4. Put BibTeX entries in [references.bib](bib/references.bib), then cite them with `.cite {key}` or `.cite {key1, key2}`. The references section uses native IEEE CSL and includes only cited works. The chapter examples show native labels, cross-references, captions, code and equations.
5. Define acronyms in [acronyms.qd](acronyms.qd), then use `.uaAc {ADSL}` in chapters or appendices. The first automatic use expands the term, later uses stay short, and only used entries appear in the index. Use `form:{long}` or `form:{short}` when you want a specific form.
6. Add appendices inside the `ua-appendices` block in [thesis.qd](thesis.qd). Write them with ordinary headings; they get `A`, `A.1`, `B`, etc. automatically. Check the current [UA submission requirements](https://www.ua.pt/pt/sga/page/12786), set `uaFinal` to `yes` to remove the draft notice, and rebuild. This is an unofficial template, not a compliance check.

### Cover options

| Setting | Values or effect |
| --- | --- |
| `uaType` | `dissertation`, `thesis`, `proposal`, `progress-report`. Updates the inner degree statement; proposals get a different draft notice. |
| `uaArea` | `arts`, `sciences`, `education`, `economy`, `engineering`, `humanities`, `health`. Selects the upstream cover stripe; economy has a white middle band. |
| `uaDepartment`, `uaShowDepartment` | Enter the full name and set the switch to `yes` to show it. Off by default, matching the upstream sample. Edit the supervision sentence separately if the affiliation also changes. |
| `uaMap` | `none`, `bioplant`, `i`, `fis`, `tele`. Non-`none` uses the upstream MAP logo and doctoral-program wording. |
| `uaFinal`, `uaCover` | Remove the draft label only, or temporarily omit the entire unnumbered preface, respectively. |
| `uaListings` | Enable an automatically populated list of captioned code listings after the list of figures. |

To add cover artwork or a quotation, uncomment the lower cover block in [cover.qd](front/cover.qd) and replace the example path or content. Inspect the cover at A4 size, especially with long titles or additional supervisors.

See [the research and parity notes](docs/quarkdown.md) for what Quarkdown simplifies, how the port is built, and where PDF behavior differs from LaTeX.

## Credits

Based on the UA style by Tomás Oliveira e Silva, updated by João Paulo Barraca and Pedro Miguel Oliveira Estima, and the DETI template maintained by Fábio Maia, Ricardo Jesus and [contributors](https://github.com/detiuaveiro/ua-thesis-template/graphs/contributors). The upstream MIT notice is retained in [LICENSE](LICENSE). The UA and MAP artwork comes from upstream; use it in line with the institutions' branding rules. TeX Gyre Pagella and Heros are distributed under the [GUST Font License](public/fonts/GUST-FONT-LICENSE.txt).
