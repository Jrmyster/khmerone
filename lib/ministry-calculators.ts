export function rainVolume(area: number, rainfall: number, efficiency: number, freeCapacity: number) {
  return Math.min(freeCapacity, area * rainfall * efficiency / 100);
}
export function energyUse(watts: number, hours: number, days: number, tariff: number) {
  const kWh = watts * hours * days / 1000;
  return [kWh, kWh * tariff];
}
export function tradingResult(units: number, price: number, unitCost: number, overhead: number) {
  return [units * price, units * (price - unitCost) - overhead];
}
export function budgetBalance(income: number, essentials: number, other: number, repayment: number) {
  return income - essentials - other - repayment;
}
