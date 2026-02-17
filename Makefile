SKILLS_REPO ?= https://github.com/flanksource/claude-code-plugin.git
SKILLS_BRANCH ?= main
SKILLS_ROOT ?= .ai-skills
SKILLS_CHECKOUT_DIR ?= $(SKILLS_ROOT)/claude-code-plugin
SKILLS_DIR ?= $(SKILLS_CHECKOUT_DIR)/skills

.PHONY: skills.download skills.update skills.path

# Download the skills repository (sparse checkout of /skills)
skills.download:
	@mkdir -p "$(SKILLS_ROOT)"
	@if [ -d "$(SKILLS_CHECKOUT_DIR)/.git" ]; then \
		echo "Skills repo already present at $(SKILLS_CHECKOUT_DIR)"; \
	else \
		git clone --depth=1 --branch "$(SKILLS_BRANCH)" --filter=blob:none --sparse "$(SKILLS_REPO)" "$(SKILLS_CHECKOUT_DIR)"; \
		git -C "$(SKILLS_CHECKOUT_DIR)" sparse-checkout set skills; \
	fi
	@echo "Skills directory ready: $(SKILLS_DIR)"

# Update to the latest branch head
skills.update: skills.download
	@git -C "$(SKILLS_CHECKOUT_DIR)" pull --ff-only origin "$(SKILLS_BRANCH)"
	@echo "Updated skills in $(SKILLS_DIR)"

# Print absolute skills path for CHAT_SKILLS_DIR
skills.path:
	@cd "$(SKILLS_DIR)" && pwd
