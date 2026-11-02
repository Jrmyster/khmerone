import { HttpError, json, readBytes } from '../learning/http.ts';

export type ForecastDay = { date: string; condition: string; low: number; high: number; end: number };
export type Forecast = { issued: number; refreshBy: number; days: ForecastDay[] };
const dayMs = 86400000;
const obj = (v: unknown): Record<string,unknown> => v && typeof v === 'object' ? v as Record<string,unknown> : {};

function localDateTime(date: unknown, time: string): number {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time)) return NaN;
  const stamp = Date.parse(date + 'T' + time + '+07:00');
  return Number.isFinite(stamp) && new Date(stamp + 7 * 3600000).toISOString().startsWith(date + 'T' + time) ? stamp : NaN;
}

export function parsePhnomPenhForecast(raw: unknown, now: number): Forecast {
  const city = obj(obj(raw).city), forecast = obj(city.forecast);
  const unavailable = () => new HttpError(503, 'weather_unavailable');
  if (city.cityId !== 348 || city.timeZone !== '+0700' || forecast.timeZone !== 'Local' || typeof forecast.issueDate !== 'string') throw unavailable();
  const [date,time] = forecast.issueDate.split(' ');
  const issued = localDateTime(date,time);
  if (!Number.isFinite(issued) || issued > now || now >= issued + 2 * dayMs || !Array.isArray(forecast.forecastDay)) throw unavailable();
  const days: ForecastDay[] = [];
  for (const value of forecast.forecastDay.slice(0,8)) {
    const row = obj(value);
    const start = localDateTime(row.forecastDate,'00:00:00');
    const end = start + dayMs;
    if (!Number.isFinite(start) || end <= now || start > issued + 8 * dayMs || typeof row.forecastDate !== 'string') continue;
    if (typeof row.weather !== 'string' || !row.weather.trim() || row.weather.length > 120) continue;
    if (![row.minTemp,row.maxTemp].every(n => (typeof n === 'number' || typeof n === 'string' && n.trim() !== '') && Number.isFinite(Number(n)))) continue;
    const low = Number(row.minTemp), high = Number(row.maxTemp);
    if (low < -20 || high > 60 || low > high) continue;
    days.push({ date:row.forecastDate, condition:row.weather.trim(), low, high, end });
  }
  if (!days.length) throw unavailable();
  return { issued, refreshBy:Math.min(issued + 2 * dayMs, Math.max(...days.map(d=>d.end))), days };
}

export async function readOfficialForecast(fetcher: typeof fetch = fetch) {
  try {
    const response = await fetcher('https://worldweather.wmo.int/en/json/348_en.json', {
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/json', 'User-Agent': 'KhmerOneWeather/1.0' },
    });
    if (!response.ok) { await response.body?.cancel(); throw new Error(); }
    const bytes = await readBytes(new Request('https://internal/', {method:'POST',body:response.body,duplex:'half'} as RequestInit), 64000);
    return json(parsePhnomPenhForecast(JSON.parse(new TextDecoder().decode(bytes)), Date.now()));
  } catch { throw new HttpError(503,'weather_unavailable'); }
}
