import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const site = new URL('../site/', import.meta.url);

test('the page references the listing assets and bucket endpoint', async () => {
  const index = await readFile(new URL('index.html', site), 'utf8');

  assert.match(index, /id="navigation"/);
  assert.match(index, /id="listing"/);
  assert.match(
    index,
    /BUCKET_URL = 'https:\/\/storage\.googleapis\.com\/downloads\.openwisp\.io\/'/,
  );
  assert.match(index, /src="\.\/script\.js"/);
  assert.match(index, /href="\.\/style\.css"/);
});

test('the deployment allowlist contains every root asset', async () => {
  const deploy = await readFile(new URL('../deploy', import.meta.url), 'utf8');

  for (const asset of ['index.html', 'style.css', 'script.js', 'circle.gif']) {
    assert.match(deploy, new RegExp(`assets=.*${asset}`, 's'));
  }
  assert.doesNotMatch(deploy, /rsync|delete-unmatched-destination-objects/);
});
