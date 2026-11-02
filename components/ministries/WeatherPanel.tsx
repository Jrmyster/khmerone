'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@/types/app';
import type { Forecast } from '@/lib/ministry-tools/weather';
import { AudioMaker } from '@/components/learning/common';
import { api } from '@/lib/learning/browser';

const conditions: Record<string,string> = { 'sunny':'មេឃស្រឡះមានពន្លឺថ្ងៃ', 'fine':'មេឃស្រឡះ', 'cloudy':'មេឃមានពពក', 'partly cloudy':'មេឃមានពពកខ្លះ', 'overcast':'មេឃអួអាប់', 'haze':'អ័ព្ទផ្សែង', 'drizzle':'ភ្លៀងរលឹម', 'light rain':'ភ្លៀងតិច', 'rain':'ភ្លៀង', 'heavy rain':'ភ្លៀងខ្លាំង', 'showers':'ភ្លៀងមួយមេៗ', 'thunderstorms':'ផ្គររន្ទះ', 'thunderstorm':'ផ្គររន្ទះ' };
export function WeatherPanel({ lang }: { lang: Locale }) {
  const t = (en:string, km:string) => lang === 'km' ? km : en;
  const [forecast,setForecast] = useState<Forecast | null>(null);
  const [status,setStatus] = useState<'idle'|'busy'|'unavailable'>('idle');
  const [now,setNow] = useState(0);
  const days = forecast && now < forecast.refreshBy ? forecast.days.filter(day=>now<day.end) : [];
  useEffect(() => {
    if (!forecast) return;
    const update = () => setNow(Date.now());
    const next = Math.min(forecast.refreshBy, ...forecast.days.filter(d=>d.end>now).map(d=>d.end));
    const timer = next > now ? window.setTimeout(update,Math.max(0,next-Date.now())) : undefined;
    window.addEventListener('pageshow',update); document.addEventListener('visibilitychange',update);
    return () => { clearTimeout(timer); window.removeEventListener('pageshow',update); document.removeEventListener('visibilitychange',update); };
  }, [forecast, now]);
  async function load() {
    setStatus('busy'); setForecast(null);
    try { const result = await api<Forecast>('weather/phnom-penh'); setNow(Date.now()); setForecast(result); setStatus('idle'); }
    catch { setStatus('unavailable'); }
  }
  const dateTime = (timestamp:number) => new Intl.DateTimeFormat(lang,{timeZone:'Asia/Phnom_Penh',dateStyle:'medium',timeStyle:'short'}).format(timestamp);
  const dayLines = days.map(day=>day.date + ' · ' + (lang === 'km' ? conditions[day.condition.toLowerCase()] || day.condition : day.condition) + ' · ' + day.low + '–' + day.high + ' °C');
  return <section className="mg-box" id="official-weather">
    <h2>{t('Official Phnom Penh forecast','ការព្យាករណ៍អាកាសធាតុផ្លូវការសម្រាប់ភ្នំពេញ')}</h2>
    <p>{t('Pochentong station · Ministry of Water Resources and Meteorology, via the WMO World Weather Information Service.', 'ស្ថានីយពោធិ៍ចិនតុង · ក្រសួងធនធានទឹក និងឧតុនិយម តាមរយៈសេវាព័ត៌មានអាកាសធាតុពិភពលោករបស់ WMO។')}</p>
    <button disabled={status==='busy'} onClick={load}>{status==='busy' ? t('Checking…','កំពុងពិនិត្យ…') : t('Check official forecast','ពិនិត្យការព្យាករណ៍ផ្លូវការ')}</button>
    {!!days.length && forecast && <div><p>{t('Issued (Cambodia time)','ចេញផ្សាយ (ម៉ោងកម្ពុជា)')} · {dateTime(forecast.issued)}</p>
      <ul>{dayLines.map(line=><li key={line}>{line}</li>)}</ul>
      <AudioMaker language={lang} text={[t('Phnom Penh forecast','ការព្យាករណ៍សម្រាប់ភ្នំពេញ'),dateTime(forecast.issued),...dayLines].join('\n')} name="phnom-penh-forecast" />
    </div>}
    {(status === 'unavailable' || forecast && !days.length) && <p role="status">{t('A recent forecast could not be verified. Check the publisher for its latest update.', 'មិនអាចផ្ទៀងផ្ទាត់ការព្យាករណ៍ថ្មីបានទេ។ សូមពិនិត្យព័ត៌មានចុងក្រោយនៅប្រភពផ្លូវការ។')}</p>}
    <a href="https://worldweather.wmo.int/en/city.html?cityId=348">{t('WMO World Weather Information Service', 'សេវាព័ត៌មានអាកាសធាតុពិភពលោករបស់ WMO')}</a>
    <h3>{t('Warnings and river levels','ការព្រមាន និងកម្ពស់ទឹកទន្លេ')}</h3>
    <p>{t('Check warnings directly with the issuing authority. Khmer One has no verified live national alert feed. Read the place, issue time and expiry on the original bulletin before acting.', 'សូមពិនិត្យការព្រមានផ្ទាល់ពីស្ថាប័នចេញផ្សាយ។ ខ្មែរ វ័ន មិនមានប្រព័ន្ធប្រកាសអាសន្នជាតិផ្ទាល់ដែលបានផ្ទៀងផ្ទាត់ទេ។ ពិនិត្យទីតាំង ម៉ោងចេញផ្សាយ និងពេលផុតកំណត់នៅលើសេចក្តីជូនដំណឹងដើម។')}</p>
    <div className="gs-links">
      <a href="https://dhrw-cam.org/warninginfo.php">{t('Official hydrological warnings in Khmer','ការព្រមានជលសាស្ត្រផ្លូវការជាភាសាខ្មែរ')}</a>
      <a href="https://dhrw-cam.org/bulletintbl.php">{t('Dated station readings and river forecasts','ទិន្នន័យស្ថានីយ និងការព្យាករណ៍ទឹកទន្លេតាមកាលបរិច្ឆេទ')}</a>
      <a href="https://www.ews1294.org/kh/how-it-works">{t('How to register for local voice warnings','របៀបចុះឈ្មោះទទួលការព្រមានជាសំឡេងក្នុងមូលដ្ឋាន')}</a>
      <a href="tel:1294">{t('Dial 1294 to register for voice warnings','ហៅលេខ ១២៩៤ ដើម្បីចុះឈ្មោះទទួលការព្រមានជាសំឡេង')}</a>
    </div>
  </section>;
}
