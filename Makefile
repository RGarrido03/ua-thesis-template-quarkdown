QUARKDOWN ?= quarkdown
QD = "$(QUARKDOWN)" compile --strict --allow=native-content --timeout=120

.PHONY: pdf html preview check

pdf:
	$(QD) --pdf --out-name=thesis --out=build thesis.qd

html:
	$(QD) --out-name=thesis --out=build thesis.qd

preview:
	$(QD) --watch --preview --out-name=thesis --out=build thesis.qd

check: pdf
	python3 tests/check_sample.py build/thesis.pdf
