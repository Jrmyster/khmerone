'use client';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/types/app';
import { download } from '@/lib/learning/browser';

type Pin = { label: string; lat: number; lon: number; note: string };
export function LocalMap({ lang }: { lang: Locale }) {
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const [pins, setPins] = useState<Pin[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const pin = active === null ? undefined : pins[active];
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const label = String(data.get('label')).trim();
    const lat = Number(data.get('lat')), lon = Number(data.get('lon'));
    if (!label || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -85 || lat > 85 || Math.abs(lon) > 180) return;
    setPins([...pins, { label, lat, lon, note: String(data.get('note') || '').trim() }]);
    setActive(null);
    form.reset();
  }
  function exportMap() {
    download('khmer-one-public-places.geojson', JSON.stringify({type: 'FeatureCollection', features: pins.map(p => ({
      type: 'Feature', geometry: {type:'Point', coordinates:[p.lon, p.lat]}, properties:{name:p.label, observation:p.note},
    }))}, null, 2), 'application/geo+json');
  }
  return <section className="mg-box mg-fields" id="local-map">
    <h2>{t('Map public places in your community', 'កត់ទីតាំងសាធារណៈក្នុងសហគមន៍លើផែនទី')}</h2>
    <p>{t('Use a public location and record when you checked it. Pins stay on this page until you export them. Opening a map sends the selected coordinates to OpenStreetMap.', 'ប្រើទីតាំងសាធារណៈ និងកត់ថ្ងៃដែលអ្នកបានពិនិត្យ។ ចំណុចទីតាំងនៅតែក្នុងទំព័រនេះរហូតដល់អ្នកនាំចេញ។ ពេលបើកផែនទី កូអរដោនេដែលបានជ្រើសនឹងត្រូវផ្ញើទៅ OpenStreetMap។')}</p>
    <form onSubmit={add}>
      <label>{t('Public place or asset', 'ទីតាំង ឬសម្បត្តិសាធារណៈ')}<input name="label" maxLength={100} required pattern=".*\S.*" /></label>
      <div className="mg-grid">
        <label>{t('Latitude', 'រយៈទទឹង')}<input name="lat" type="number" min="-85" max="85" required step="any" /></label>
        <label>{t('Longitude', 'រយៈបណ្តោយ')}<input name="lon" type="number" min="-180" max="180" required step="any" /></label>
      </div>
      <label>{t('Date checked, condition and next action', 'ថ្ងៃពិនិត្យ ស្ថានភាព និងសកម្មភាពបន្ទាប់')}<input name="note" maxLength={320} /></label>
      <button>{t('Add point', 'បន្ថែមចំណុច')}</button>
    </form>
    <ul>{pins.map((p, i) => <li key={i}><strong>{p.label}</strong> · {p.lat}, {p.lon} · {p.note} <button onClick={() => setActive(i)}>{t('View on map', 'មើលលើផែនទី')}</button> <button onClick={() => { setActive(null); setPins(pins.filter((_, j) => i !== j)); }}>{t('Remove', 'លុប')}</button></li>)}</ul>
    {pin && <iframe className="mg-map" title={pin.label} referrerPolicy="no-referrer" src={`https://www.openstreetmap.org/export/embed.html?bbox=${pin.lon-.025},${pin.lat-.015},${pin.lon+.025},${pin.lat+.015}&layer=mapnik&marker=${pin.lat},${pin.lon}`} />}
    <button disabled={!pins.length} onClick={exportMap}>{t('Download points (GeoJSON)', 'ទាញយកចំណុចទីតាំង (GeoJSON)')}</button>
  </section>;
}
