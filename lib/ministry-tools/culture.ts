import { httpsUrl, isText } from '../learning/contracts.ts';
import { digest, HttpError, json, requireEditor } from '../learning/http.ts';

export type CultureDraft = { title:string; kind:string; region:string; credit:string; story:string; url:string; reuse:string };
export type CultureEntry = CultureDraft & { id:string };
const kinds = ['oral-history','music','dance','craft','story'];
const scopes = ['view','classroom'];
const uuid = (v:unknown): v is string => typeof v === 'string' && /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/.test(v);
function validateDraft(b: Record<string,unknown>): CultureDraft {
  if (b.consent !== true || !isText(b.title,120) || !isText(b.region,100) || !isText(b.credit,150) || !isText(b.story,2500) ||
      !kinds.includes(String(b.kind)) || !scopes.includes(String(b.reuse)) || typeof b.url !== 'string' || b.url.length > 800 || !httpsUrl(b.url)) throw new HttpError(400,'invalid_input');
  return {title:b.title.trim(),kind:String(b.kind),region:b.region.trim(),credit:b.credit.trim(),story:b.story.trim(),url:b.url.trim(),reuse:String(b.reuse)};
}
export async function cultureRead(request:Request, db?:D1Database, key?:string) {
  const url = new URL(request.url);
  const review = url.searchParams.get('review') === '1';
  if (review) await requireEditor(request,key);
  if (!db) throw new HttpError(503,'archive_unavailable');
  const after = url.searchParams.get('after') ?? '';
  if (after && !uuid(after)) throw new HttpError(400,'invalid_input');
  const result = await db.prepare('SELECT id,entry FROM culture_entries WHERE status=? AND id>? ORDER BY id LIMIT 21')
    .bind(review ? 'pending' : 'approved', after).all<{id:string;entry:string}>();
  const items = result.results.slice(0,20).map(r=>({id:r.id, ...JSON.parse(r.entry) as CultureDraft}));
  return json({items,next:result.results.length>20 ? items.at(-1)?.id : null});
}
export async function cultureWrite(action:string, request:Request, b:Record<string,unknown>, db?:D1Database, key?:string) {
  if (!uuid(b.id)) throw new HttpError(400,'invalid_input');
  if (action==='moderate') await requireEditor(request,key);
  if (!db) throw new HttpError(503,'archive_unavailable');
  if (action==='moderate') {
    if (!['approve','reject'].includes(String(b.decision))) throw new HttpError(400,'invalid_input');
    const approve = b.decision==='approve';
    const result = await db.prepare(approve
      ? "UPDATE culture_entries SET status='approved' WHERE id=? AND status='pending'"
      : "UPDATE culture_entries SET status='rejected',entry=NULL WHERE id=? AND status IN ('pending','approved')").bind(b.id).run();
    if (!result.meta.changes) throw new HttpError(409,'archive_state_changed');
    return json({ok:true});
  }
  if (!uuid(b.managementKey)) throw new HttpError(400,'invalid_input');
  const hash = await digest(b.managementKey);
  if (action==='withdraw') {
    const result = await db.prepare("UPDATE culture_entries SET status='withdrawn',entry=NULL WHERE id=? AND manage_hash=?").bind(b.id,hash).run();
    if (!result.meta.changes) throw new HttpError(404,'not_found');
    return json({ok:true});
  }
  if (action!=='submit') throw new HttpError(404,'not_found');
  if (!key || key.length < 32) throw new HttpError(503,'archive_unavailable');
  const entry = JSON.stringify(validateDraft(b));
  const result = await db.prepare("INSERT OR IGNORE INTO culture_entries(id,manage_hash,status,entry,submitted_at) VALUES(?,?,'pending',?,?)")
    .bind(b.id,hash,entry,new Date().toISOString()).run();
  if (!result.meta.changes) {
    const prior = await db.prepare('SELECT status,entry FROM culture_entries WHERE id=? AND manage_hash=?').bind(b.id,hash).first<{status:string;entry:string|null}>();
    if (!prior || prior.entry !== entry) throw new HttpError(409,'archive_state_changed');
    return json({status:prior.status});
  }
  return json({status:'pending'},201);
}
