# AGENTS.md

## Project Overview

`downloads.openwisp.io` is the static directory-listing application served by
the `downloads.openwisp.io` Google Cloud Storage bucket.

The deployed files are in `src/`:

- `index.html` configures the page and the bucket endpoint.
- `style.css` defines the page styles.
- `script.js` fetches and renders the bucket listing.
- `circle.gif` is the loading indicator.
- `images/` and `webfonts/` contain the self-hosted visual assets, including
  the logo and favicon used by the Website.

`make deploy` uploads only these files to the bucket root. Package artifacts
under bucket prefixes are deployed by their owning repositories and must never
be deleted or synchronized by this repository.

## Source of Truth

- Use `README.md` and `Makefile` for local setup and deployment requirements.
- Use `.github/workflows/ci.yml` for the CI-tested Node.js version and GCP
  authentication configuration.

## Contributing Guidelines

- Keep changes focused and preserve the public bucket URL and query-string
  navigation behavior unless explicitly changing them.
- Add or update focused tests in `tests/` for JavaScript or markup behavior.
- Run `make qa-format` and `./run-qa-checks` after each change.
- Do not commit credentials, service-account files, or access tokens.
- Use a descriptive, capitalized, past-tense commit subject. Validate commits
  with `openwisp-commit --check` when available.

## Security Rules

- Treat object names and metadata returned by Cloud Storage as untrusted input.
- Do not expose GCP credentials in source, browser code, or workflow logs.
- Preserve the Makefile deployment allowlist of root UI assets.
