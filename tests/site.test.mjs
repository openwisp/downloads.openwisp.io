import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const src = new URL('../src/', import.meta.url);

test('the page references the listing assets and bucket endpoint', async () => {
  const index = await readFile(new URL('index.html', src), 'utf8');

  assert.match(index, /id="navigation"/);
  assert.match(index, /id="listing"/);
  assert.match(
    index,
    /BUCKET_URL = 'https:\/\/storage\.googleapis\.com\/downloads\.openwisp\.io\/'/,
  );
  assert.match(index, /href="\.\/images\/favicon\.svg"/);
  assert.match(index, /src="\.\/script\.js"/);
  assert.match(index, /href="\.\/style\.css"/);
  const styles = await readFile(new URL('style.css', src), 'utf8');
  assert.match(styles, /url\('\.\/images\/logo-black\.svg'\)/);
  assert.match(styles, /url\('\.\/webfonts\/Inter\/Inter-normal-400\.woff2'\)/);
  assert.match(styles, /url\('\.\/webfonts\/Inter\/Inter-normal-600\.woff2'\)/);
  assert.doesNotMatch(styles, /https?:\/\//);
  await readFile(new URL('images/logo-black.svg', src));
  await readFile(new URL('images/favicon.svg', src));
  await readFile(new URL('webfonts/Inter/Inter-normal-400.woff2', src));
  await readFile(new URL('webfonts/Inter/Inter-normal-600.woff2', src));
});

test('the deployment allowlist contains every root asset', async () => {
  const makefile = await readFile(new URL('../Makefile', import.meta.url), 'utf8');

  for (const asset of [
    'index.html',
    'style.css',
    'script.js',
    'circle.gif',
    'images/favicon.svg',
    'images/logo-black.svg',
    'webfonts/Inter/Inter-normal-400.woff2',
    'webfonts/Inter/Inter-normal-600.woff2',
  ]) {
    assert.match(makefile, new RegExp(`ASSETS :=.*${asset}`, 's'));
  }
  assert.doesNotMatch(makefile, /rsync|delete-unmatched-destination-objects/);
});

test('directories are listed newest first', async () => {
  const script = await readFile(new URL('script.js', src), 'utf8');
  const context = {
    jQuery: () => {},
    location: { hostname: 'downloads.openwisp.io', protocol: 'https:' },
  };

  vm.runInNewContext(script, context);

  const directories = [
    { Key: 'openwisp-monitoring/2026-01-01/' },
    { Key: 'openwisp-monitoring/latest/' },
    { Key: 'openwisp-monitoring/2026-03-01/' },
  ];

  assert.deepEqual(
    context.sortDirectories(directories).map((directory) => directory.Key),
    [
      'openwisp-monitoring/latest/',
      'openwisp-monitoring/2026-03-01/',
      'openwisp-monitoring/2026-01-01/',
    ],
  );
});

test('last-modified dates include the time and timezone', async () => {
  const script = await readFile(new URL('script.js', src), 'utf8');
  const context = {
    jQuery: () => {},
    location: { hostname: 'downloads.openwisp.io', protocol: 'https:' },
  };

  vm.runInNewContext(script, context);

  assert.equal(
    context.formatDate('2026-09-09T23:18:14.000Z'),
    '2026-09-09 23:18:14 UTC',
  );
});
