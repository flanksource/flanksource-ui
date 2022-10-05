.PHONY: index.js

define IMPORTS
	@for img in $(shell

		for img in $(ls *.svg); do \
		name=$${img%.*}; \
		name=$${name//-/_}; \
		echo  import  $$name from '"'./$$img'";'  ;\
	done
endef

define VARS
	@for img in $(shell ls *.svg); do \
		name=$${img%.*}; \
		name=$${name//-/_}; \
		echo  '"'$${img%.*}'"': $$name,  ;\
	done
endef
index.js:
	echo "// this file is generated using make index.js" > index.js
	$(call IMPORTS) >> index.js
	echo "export const Icons = {" >> index.js
	$(call VARS) >> index.js
	echo "}" >> index.js
