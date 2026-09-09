# downloads.openwisp.io

Source for the static directory-listing application served at
<https://downloads.openwisp.io/>.

## Development

Install the Python and Node.js dependencies and run the checks:

```sh
python3 -m pip install -r requirements-test.txt
npm ci
./run-qa-checks
```

Run a local web server at <http://localhost:8000>:

```sh
make serve
```

Format the source files with:

```sh
make qa-format
```

## Deployment

The `deploy` Makefile target uploads the self-contained static application from
`src/`, including the logo, favicon, and Inter font files, to
`gs://downloads.openwisp.io`. It does not delete or synchronize any bucket
content, so package artifacts published by other OpenWISP repositories are
protected.

Preview the upload commands locally:

```sh
make deploy DRY_RUN=1
```

Deploy with an authenticated Google Cloud CLI account that can create and
update objects in the bucket:

```sh
make deploy
```

GitHub Actions deploys after checks pass on a push to `master`. Configure these
repository secrets before merging the first deployment:

- `GCS_PROJECT_ID`
- `GCS_DOWNLOADS_SERVICE_ACCOUNT_JSON`

The service account needs object create and update access to
`gs://downloads.openwisp.io`.
