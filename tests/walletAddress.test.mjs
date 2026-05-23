import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadWalletAddressModule() {
  const source = readFileSync(new URL('../lib/walletAddress.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    Clipboard: function Clipboard() {},
    encodeURIComponent,
    exports: module.exports,
    module,
    navigator: { clipboard: { writeText: async () => {} } },
    TypeError,
  });
  return module.exports;
}

const {
  copyStellarAddress,
  createStellarAccountLink,
  formatStellarAddress,
} = loadWalletAddressModule();

const ADDRESS = 'GB7ZB7YJ3FQ2ZTNHY2YK3EF3NKZ2W3YY7H2PK3XGD5Z57EOTY6QZ2J5A';

test('truncates Stellar G-addresses with the default prefix and suffix', () => {
  assert.equal(formatStellarAddress(ADDRESS), 'GB7ZB7...QZ2J5A');
});

test('does not truncate short G-address values', () => {
  assert.equal(formatStellarAddress('GSHORT'), 'GSHORT');
});

test('generates a Stellar payment deep link for an address', () => {
  assert.equal(
    createStellarAccountLink(ADDRESS),
    `web+stellar:pay?destination=${encodeURIComponent(ADDRESS)}`,
  );
});

test('copies the original unformatted address to the provided clipboard', async () => {
  const writes = [];
  await copyStellarAddress(ADDRESS, { writeText: async (value) => writes.push(value) });
  assert.deepEqual(writes, [ADDRESS]);
});

test('rejects non-G-address inputs', () => {
  assert.throws(() => formatStellarAddress('M123'), /must start with G/);
  assert.throws(() => createStellarAccountLink('M123'), /must start with G/);
});
