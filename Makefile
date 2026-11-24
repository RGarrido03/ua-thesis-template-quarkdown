QUARKDOWN ?= quarkdown
QD = "$(QUARKDOWN)" compile --strict --allow=native-content --timeout=120

.PHONY: pdf html preview check

pdf:
	$(QD) --pdf --out-name=thesis --out=build thesis.qd

# Quarkdown 2.7 can follow a previous watch build's script symlink when copying assets.
html:
	@test ! -L build/thesis/script || { echo 'Move the old preview folder build/thesis aside before exporting HTML.' >&2; exit 1; }
	$(QD) --out-name=thesis --out=build thesis.qd

preview:
	$(QD) --watch --preview --out-name=thesis --out=build/preview thesis.qd

check: pdf
	python3 tests/check_sample.py build/thesis.pdf
