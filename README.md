# downloads.openwisp.io

Source for the static directory-listing application served at
<https://downloads.openwisp.io/>.

## Development

Install the Node.js dependencies and run the checks:

```sh
npm ci
./run-qa-checks
```

Run a local web server at <http://localhost:8000>:

```sh
./serve
```

Format the source files with:

```sh
./qa-format
```

## Deployment

The deploy script uploads only `index.html`, `style.css`, `script.js`, and
`circle.gif` to the root of `gs://downloads.openwisp.io`. It does not delete or
synchronize any bucket content, so package artifacts published by other
OpenWISP repositories are protected.

Preview the upload commands locally:

```sh
./deploy --dry-run
```

Deploy with an authenticated Google Cloud CLI account that can create and
update objects in the bucket:

```sh
./deploy
```

GitHub Actions deploys after checks pass on a push to `master`. Configure these
repository secrets before merging the first deployment:

- `GCS_PROJECT_ID`
- `GCS_DOWNLOADS_SERVICE_ACCOUNT_JSON`

The service account needs object create and update access to
`gs://downloads.openwisp.io`.
