import test from 'node:test';
import assert from 'node:assert/strict';
import snapshot from '../app-data/v2-districts.json' with { type: 'json' };
import geometry from '../app-data/v2-map.json' with { type: 'json' };
import { boxSummary, colorFor, filterRegions, pearson, quantile } from '../src/v2Model.ts';

const rows = snapshot.districts;
test('v2 snapshot contains 514 unique districts and only the supported indicator contract', () => {
  assert.equal(rows.length, 514);
  assert.equal(new Set(rows.map(r => r.code)).size, 514);
  assert.equal(new Set(rows.map(r => r.province)).size, 38);
  assert.equal(rows.filter(r => r.pou_pct !== null).length, 503);
  assert.equal(rows.filter(r => r.pph !== null).length, 513);
  assert.ok(rows.filter(r => r.pou_pct === null).every(r => r.province === 'Jambi'));
  assert.equal(rows.find(r => r.code === '9171').pph, null);
  assert.deepEqual(Object.keys(rows[0]).sort(), ['code', 'provinceCode', 'name', 'province', 'ikp_group', 'ikp_rank', 'ikp', 'pou_pct', 'population', 'undernourished_people', 'pph', 'energy_kcal_cap_day', 'protein_g_cap_day', 'years', 'qualityNotes'].sort());
});

test('geometry remains joined to all real administrative codes after simplification', () => {
  assert.equal(geometry.shapes.length, 514);
  assert.deepEqual(geometry.shapes.map(s => s.code).sort(), rows.map(r => r.code).sort());
  assert.ok(geometry.shapes.every(s => s.path.startsWith('M') && s.path.endsWith('Z') && s.bbox.every(Number.isFinite)));
});

test('filters keep city/regency identities separate and intersect scope', () => {
  assert.equal(filterRegions(rows, '', '', '3271')[0].name, 'Kota Bogor');
  assert.equal(filterRegions(rows, '', '', '3201')[0].name, 'Kabupaten Bogor');
  assert.ok(filterRegions(rows, 'Jawa Barat', '6', '').every(r => r.province === 'Jawa Barat' && r.ikp_group === 6));
  assert.equal(filterRegions(rows, '', '', 'no-matching-region-xyz').length, 0);
});

test('Pearson uses complete pairs and handles constant and undersized samples', () => {
  const paired = [{ ikp: 1, pph: 10 }, { ikp: 2, pph: 20 }, { ikp: 3, pph: 30 }, { ikp: null, pph: 90 }];
  assert.deepEqual(pearson(paired, 'ikp', 'pph'), { r: 1, n: 3 });
  assert.deepEqual(pearson(paired.slice(0, 2), 'ikp', 'pph'), { r: null, n: 2 });
  assert.equal(pearson([{ ikp: 2, pph: 3 }, { ikp: 2, pph: 7 }, { ikp: 2, pph: 9 }], 'ikp', 'pph').r, null);
  assert.equal(pearson(rows, 'ikp', 'pou_pct').n, 503);
  assert.equal(pearson(rows, 'ikp', 'pph').n, 513);
});

test('box plot uses interpolated quartiles, observed Tukey whiskers and real outliers', () => {
  assert.equal(quantile([1, 2, 3, 4], .25), 1.75);
  assert.deepEqual(boxSummary([1, 2, 3, 4, 100]), { n: 5, q1: 2, q3: 4, median: 3, low: 1, high: 4, outliers: [100] });
  assert.equal(boxSummary([]), null);
  assert.notEqual(colorFor(null, 'pou_pct', [0, 60]), colorFor(0, 'pou_pct', [0, 60]));
});
