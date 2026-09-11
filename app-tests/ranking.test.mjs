import test from 'node:test';
import assert from 'node:assert/strict';
import districts from '../app-data/districts_2025.json' with { type: 'json' };

const valid = districts.filter((district) => district.pouPct !== null && district.undernourishedPeople !== null);
const order = (key) => [...valid].sort((a, b) => b[key] - a[key] || a.code.localeCompare(b.code));

test('district identities are unique and preserve Kabupaten/Kota labels', () => {
  assert.equal(new Set(districts.map((district) => district.id)).size, districts.length);
  assert.equal(districts.find((district) => district.code === '3201').name, 'Kabupaten Bogor');
  assert.equal(districts.find((district) => district.code === '3271').name, 'Kota Bogor');
});
test('2025 PoU ranking universe has 503 districts and preserves 11 missing Jambi values', () => {
  assert.equal(valid.length, 503);
  assert.equal(districts.filter((district) => district.pouPct === null).length, 11);
  assert.ok(districts.filter((district) => district.pouPct === null).every((district) => district.province === 'Jambi'));
});
test('severity and scale ranks use deterministic descending full-universe ranking', () => {
  order('pouPct').forEach((district, index) => assert.equal(district.severityRank, index + 1));
  order('undernourishedPeople').forEach((district, index) => assert.equal(district.scaleRank, index + 1));
});
test('rank normalization is bounded and representative demo districts retain source values', () => {
  for (const district of valid) {
    assert.ok(district.severityPercentile >= 0 && district.severityPercentile <= 1);
    assert.ok(district.scalePercentile >= 0 && district.scalePercentile <= 1);
  }
  assert.equal(districts.find((district) => district.code === '9120').pouPct, 59.17);
  assert.equal(districts.find((district) => district.code === '3201').undernourishedPeople, 276292);
});
