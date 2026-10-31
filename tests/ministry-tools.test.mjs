import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePhnomPenhForecast } from '../lib/ministry-tools/weather.ts';
import { readSheet, rowResults, validRow } from '../lib/ministry-tools/records.ts';

const local = stamp => Date.parse(stamp + '+07:00');
const weather = {
  city: {
    cityId: 348, timeZone: '+0700',
    forecast: {
      timeZone: 'Local', issueDate: '2026-10-30 11:00:00',
      forecastDay: ['2026-10-30','2026-10-31','2026-11-01'].map(forecastDate => ({forecastDate, weather:'Rain', minTemp:'23', maxTemp:'31'})),
    },
  },
};

test('official forecast excludes elapsed days and rejects future, stale and mismatched issues', () => {
  const day = local('2026-10-31T00:00:00');
  const result = parsePhnomPenhForecast(weather,day);
  assert.deepEqual(result.days.map(d=>d.date), ['2026-10-31', '2026-11-01']);
  assert.equal(result.days[0].end, local('2026-11-01T00:00:00'));
  assert.equal(result.refreshBy,local('2026-11-01T11:00:00'));
  for (const time of ['2026-10-30T10:59:59','2026-11-01T11:00:00']) {
    assert.throws(()=>parsePhnomPenhForecast(weather,local(time)));
  }
  for (const patch of [{cityId:349},{timeZone:'+0000'}]) {
    assert.throws(()=>parsePhnomPenhForecast({city:{...weather.city,...patch}},day));
  }
});

test('market records keep source, location and date together and reject invalid saved worksheets', () => {
  const row = {date:'2026-10-31',product:'Rice',place:'Village market',source:'Cooperative',kg:'100',total:'95000',transport:'5000'};
  assert.ok(validRow('market',row));
  assert.deepEqual(rowResults('market',[row]),[900]);
  for (const patch of [{source:''},{place:''},{date:'2026-02-30'},{kg:'0'},{total:'Infinity'}]) {
    assert.equal(validRow('market',{...row,...patch}),false);
  }
  const file = JSON.stringify({format:'khmer-one-sheet-v1',sheet:'market',rows:[row]});
  assert.deepEqual(readSheet('market',file),[row]);
  assert.throws(()=>readSheet('cash',file));
  assert.throws(()=>readSheet('market',file.replace('Cooperative','')));
});

test('stock, cash and solar comparisons preserve units and independent products', () => {
  assert.deepEqual(rowResults('stock',[
    {product:'Rice',received:'15',removed:'0'}, {product:'Soap',received:'7',removed:'1'}, {product:'  rice ',received:'0',removed:'4'},
  ]),[15,6,11]);
  assert.deepEqual(rowResults('cash',[{incoming:'20000',outgoing:'5000'},{incoming:'0',outgoing:'8000'}]),[15000,7000]);
  assert.deepEqual(rowResults('solar',[{cost:'3000000',kw:'1.5'}]),[2000000]);
});
