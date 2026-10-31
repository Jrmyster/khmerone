import test from 'node:test';
import assert from 'node:assert/strict';
import { budgetBalance, energyUse, rainVolume, tradingResult } from '../lib/ministry-calculators.ts';

test('water storage accounts for roof losses and space remaining in the tank', () => {
  assert.equal(rainVolume(50, 10, 80, 1000), 400);
  assert.equal(rainVolume(50, 10, 80, 150), 150);
  assert.equal(rainVolume(50, 0, 80, 1000), 0);
});
test('energy use converts watt-hours to kWh before applying the tariff', () => {
  assert.deepEqual(energyUse(50, 4, 30, 800), [6, 4800]);
});
test('budget and trading estimates preserve losses', () => {
  assert.deepEqual(tradingResult(3, 500, 400, 600), [1500, -300]);
  assert.equal(budgetBalance(500, 400, 40, 90), -30);
});
