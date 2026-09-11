import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import districts from '../app-data/districts_2025.json' with { type: 'json' };
import { factualAnswer, retrieve } from '../src/askNourish.ts';
import { portfolioFor, rankDivergence } from '../src/scenarioEngine.ts';

const policyCorpus = JSON.parse(
  fs.readFileSync(new URL('../app-data/policy-index.json', import.meta.url)),
);

test('rank divergence preserves the project’s central 2025 finding', () => {
  const divergence = rankDivergence(districts);
  assert.equal(divergence.validDistricts, 503);
  assert.equal(divergence.top15Overlap, 0);
  assert.equal(divergence.medianRankMovement, 117);
  assert.equal(Number(divergence.spearmanCorrelation.toFixed(3)), 0.225);
});

test('scenario portfolios clamp unsafe controls and exclude incomplete records', () => {
  const portfolio = portfolioFor(districts, 2, 99);
  assert.equal(portfolio.severityWeight, 1);
  assert.equal(portfolio.reachWeight, 0);
  assert.equal(portfolio.capacity, 50);
  assert.equal(portfolio.districts.length, 50);
  assert.ok(portfolio.districts.every((district) => district.severityRank !== null));
  assert.equal(
    portfolio.persistentPriorityCount,
    portfolio.districts.filter(
      (district) =>
        (district.persistenceSeverity ?? 0) > 0 ||
        (district.persistenceScale ?? 0) > 0,
    ).length,
  );

  const bounded = portfolioFor(districts, Number.NaN, 0);
  assert.equal(bounded.severityWeight, 0.5);
  assert.equal(bounded.capacity, 5);
});

test('Ask NOURISH gives rank-specific facts and retrieves food-security evidence', () => {
  const mamberamo = districts.find((district) => district.code === '9120');
  assert.ok(mamberamo);
  const portfolio = portfolioFor(districts, 0.8, 20);
  const answer = factualAnswer('Why does this district rank differently?', {
    page: 'scenario',
    selectedDistrict: mamberamo,
    portfolio,
  });
  assert.match(answer, /Severity #1 versus Reach #355/);
  assert.match(answer, /59\.17% PoU/);
  const sources = retrieve('What policy evidence is relevant here?', policyCorpus);
  assert.equal(sources.length, 3);
  assert.equal(sources[0].sourceTitle, 'ASEAN Economic Community Strategic Plan 2026–2030');
  assert.equal(sources[0].page, 31);
});
