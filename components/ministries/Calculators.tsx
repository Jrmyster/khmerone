'use client';
import { useState } from 'react';
import { bi } from '@/data/learning';
import { budgetBalance, energyUse, rainVolume, tradingResult } from '@/lib/ministry-calculators';
import type { Locale, LocalizedText } from '@/types/app';

type Field = [LocalizedText, number, number?];
type Calculator = {
  title: LocalizedText; note: LocalizedText; fields: Field[];
  outputs: LocalizedText[]; compute: (a: number, b: number, c: number, d: number) => number[];
};
const calculators: Record<number, Calculator> = {
  10: {
    title: bi('Estimate rainwater collected', 'ប៉ាន់ប្រមាណបរិមាណទឹកភ្លៀងដែលប្រមូលបាន'),
    note: bi('Example for one rainfall event. Enter the empty space in the tank. The result estimates stored litres and says nothing about drinking-water safety.', 'គំរូសម្រាប់ភ្លៀងមួយលើក។ បញ្ចូលចំណុះដែលនៅទំនេរក្នុងធុង។ លទ្ធផលប៉ាន់ប្រមាណបរិមាណទឹកស្តុកជាលីត្រ។ សុវត្ថិភាពទឹកផឹកត្រូវវាយតម្លៃដោយឡែក។'),
    fields: [[bi('Roof footprint (m²)', 'ផ្ទៃដំបូលបើមើលពីលើ (ម²)'), 50], [bi('Rainfall (mm)', 'កម្ពស់ទឹកភ្លៀង (មម)'), 10], [bi('Collection efficiency (%)', 'ប្រសិទ្ធភាពប្រមូល (%)'), 80, 100], [bi('Tank space available (L)', 'ចំណុះទំនេរក្នុងធុង (លីត្រ)'), 1000]],
    outputs: [bi('Stored water (L)', 'ទឹកស្តុកបាន (លីត្រ)')], compute: (...values) => [rainVolume(...values)],
  },
  12: {
    title: bi('Estimate appliance electricity use', 'ប៉ាន់ប្រមាណការប្រើអគ្គិសនីរបស់ឧបករណ៍'),
    note: bi('Replace the example rate with the energy charge on your own bill. The estimate assumes constant power while running and excludes fixed fees.', 'ជំនួសតម្លៃគំរូដោយតម្លៃថាមពលលើវិក្កយបត្ររបស់អ្នក។ ការប៉ាន់ប្រមាណសន្មតថាឧបករណ៍ប្រើថាមពលថេរពេលដំណើរការ ហើយមិនគិតថ្លៃថេរទេ។'),
    fields: [[bi('Power (W)', 'អានុភាព (វ៉ាត់)'), 50], [bi('Hours per day', 'ម៉ោងក្នុងមួយថ្ងៃ'), 4, 24], [bi('Days in period', 'ចំនួនថ្ងៃ'), 30], [bi('Your rate (riel/kWh)', 'តម្លៃ (រៀល/kWh)'), 800]],
    outputs: [bi('Electricity (kWh)', 'អគ្គិសនី (kWh)'), bi('Energy cost (riel)', 'ថ្លៃថាមពល (រៀល)')], compute: energyUse,
  },
  14: {
    title: bi('Estimate sales and profit', 'ប៉ាន់ប្រមាណការលក់ និងប្រាក់ចំណេញ'),
    note: bi('Use one period for all inputs. A negative profit means the sales do not cover the costs entered.', 'ប្រើរយៈពេលដូចគ្នាសម្រាប់ទិន្នន័យទាំងអស់។ ចំណេញអវិជ្ជមានមានន័យថាចំណូលមិនគ្រប់គ្រាន់សម្រាប់ចំណាយដែលបានបញ្ចូល។'),
    fields: [[bi('Units sold', 'ចំនួនឯកតាលក់'), 20], [bi('Selling price per unit (riel)', 'តម្លៃលក់ក្នុងមួយឯកតា (រៀល)'), 5000], [bi('Cost per unit (riel)', 'ថ្លៃដើមក្នុងមួយឯកតា (រៀល)'), 3000], [bi('Other costs for the period (riel)', 'ចំណាយផ្សេងទៀតក្នុងរយៈពេលនេះ (រៀល)'), 10000]],
    outputs: [bi('Sales (riel)', 'ចំណូលពីការលក់ (រៀល)'), bi('Profit or loss (riel)', 'ចំណេញ ឬខាត (រៀល)')], compute: tradingResult,
  },
  15: {
    title: bi('Plan a household budget', 'រៀបចំថវិកាគ្រួសារ'),
    note: bi('All example amounts are in riel. Choose one month and include repayments due in that month.', 'ចំនួនទឹកប្រាក់គំរូគិតជារៀល។ ជ្រើសរើសមួយខែ ហើយរាប់បញ្ចូលប្រាក់សងដែលត្រូវបង់ក្នុងខែនោះ។'),
    fields: [[bi('Monthly income', 'ចំណូលប្រចាំខែ'), 900000], [bi('Food, housing and essentials', 'អាហារ លំនៅឋាន និងចំណាយចាំបាច់'), 600000], [bi('Other spending', 'ចំណាយផ្សេងៗ'), 100000], [bi('Debt repayments', 'ប្រាក់សងបំណុល'), 120000]],
    outputs: [bi('Remaining balance (riel)', 'សមតុល្យនៅសល់ (រៀល)')], compute: (...values) => [budgetBalance(...values)],
  },
};

export function CalculatorPanel({ n, lang }: { n: number; lang: Locale }) {
  const calc = calculators[n];
  const [values, setValues] = useState(() => calc.fields.map(field => String(field[1])));
  const numbers = values.map(Number);
  const valid = values.every((v, i) => v.trim() && Number.isFinite(numbers[i]) && numbers[i] >= 0 && numbers[i] <= (calc.fields[i][2] ?? 1e12));
  return <section className="mg-box mg-fields" id="calculator">
    <h2>{calc.title[lang]}</h2><p>{calc.note[lang]}</p>
    <div className="mg-grid">{calc.fields.map(([name, , max], i) =>
      <label key={i}>{name[lang]}<input type="number" min="0" max={max ?? 1e12} step="any" value={values[i]} onChange={e => setValues(values.map((v, index) => index === i ? e.target.value : v))} /></label>
    )}</div>
    <output aria-live="polite">{valid ? calc.compute(numbers[0], numbers[1], numbers[2], numbers[3]).map((v, i) =>
      <div key={i}>{calc.outputs[i][lang]} · {v.toLocaleString(lang, {maximumFractionDigits: 2})}</div>
    ) : bi('Enter a valid value in each field.', 'សូមបញ្ចូលតម្លៃត្រឹមត្រូវក្នុងប្រអប់នីមួយៗ។')[lang]}</output>
  </section>;
}
