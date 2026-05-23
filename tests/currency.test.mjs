import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadCurrencyModule() {
  const source = readFileSync(new URL('../lib/currency.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, { exports: module.exports, module, Intl, Number, TypeError });
  return module.exports;
}

const { formatCurrencyAmount } = loadCurrencyModule();

test('formats USDC with two decimals and en-US grouping', () => {
  assert.equal(formatCurrencyAmount('1234.5', 'USDC', 'en-US'), '1,234.50 USDC');
});

test('formats EURC with the EURC symbol and locale-specific grouping', () => {
  assert.equal(formatCurrencyAmount(1234.5, 'EURC', 'de-DE'), '1.234,50 EURC');
});

test('formats XLM with up to seven decimals', () => {
  assert.equal(formatCurrencyAmount('1234.12345678', 'XLM', 'en-US'), '1,234.1234568 XLM');
});

test('rejects non-numeric amounts', () => {
  assert.throws(() => formatCurrencyAmount('not-a-number', 'USDC'), /finite number/);
});
