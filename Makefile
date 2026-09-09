GCS_DOWNLOADS_BUCKET_NAME ?= downloads.openwisp.io
ASSETS := \
	index.html \
	style.css \
	script.js \
	circle.gif \
	images/logo-black.svg \
	webfonts/Inter/Inter-normal-400.woff2 \
	webfonts/Inter/Inter-normal-600.woff2
DRY_RUN ?= 0

.PHONY: qa-format serve deploy

qa-format:
	openwisp-qa-format

serve:
	python3 -m http.server --directory src 8000

deploy:
	@set -e; \
	for asset in $(ASSETS); do \
		source="src/$$asset"; \
		destination="gs://$(GCS_DOWNLOADS_BUCKET_NAME)/$$asset"; \
		if [ ! -f "$$source" ]; then \
			printf 'Missing deployment asset: %s\n' "$$source" >&2; \
			exit 1; \
		fi; \
		if [ "$(DRY_RUN)" = "1" ]; then \
			printf 'gcloud storage cp --cache-control=%s %s %s\n' \
				'no-cache, max-age=0, must-revalidate' "$$source" "$$destination"; \
		else \
			gcloud storage cp --cache-control='no-cache, max-age=0, must-revalidate' \
				"$$source" "$$destination"; \
		fi; \
	done
