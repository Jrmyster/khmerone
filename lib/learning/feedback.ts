import { HttpError, json, requireEditor } from './http.ts';
export function validateFeedback(b: Record<string, unknown>) {
  if (typeof b.id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(b.id) || !['translation','link','instructions','other'].includes(String(b.category)) || typeof b.message !== 'string' || b.message.trim().length < 5 || b.message.length > 2000 || typeof b.page !== 'string' || b.page.length > 400 || !/^\/(?!\/)[a-zA-Z0-9/._-]*(?:\?(?:term|story|unit|gate|language|template|resource)=[a-zA-Z0-9_-]{1,80}(?:&(?:term|story|unit|gate|language|template|resource)=[a-zA-Z0-9_-]{1,80})*)?$/.test(b.page) || (b.website !== undefined && b.website !== '')) throw new HttpError(400, 'invalid_feedback');
  return {id:b.id,category:String(b.category),page:b.page,message:b.message.trim()};
}
export async function feedbackRead(request: Request, db?: D1Database, key?: string) {
  await requireEditor(request,key);
  if (!db) throw new HttpError(503,'feedback_not_configured');
  const url=new URL(request.url), before=url.searchParams.get('before') || '9999';
  if (before.length>80) throw new HttpError(400,'invalid_input');
  const rows=await db.prepare("SELECT id,category,page,message,status,created_at AS createdAt FROM site_feedback WHERE status='open' AND (created_at || id) < ? ORDER BY created_at DESC,id DESC LIMIT 51").bind(before).all<{id:string;createdAt:string}>();
  const items=rows.results.slice(0,50), last=items.at(-1);
  return json({items,nextCursor:rows.results.length>50 && last ? last.createdAt+last.id : null});
}
export async function feedbackWrite(b: Record<string,unknown>, db?: D1Database) {
  const input=validateFeedback(b);
  if (!db) throw new HttpError(503,'feedback_not_configured');
  // Retrying a timed-out submission is safe: the browser retains the same UUID.
  await db.prepare('INSERT OR IGNORE INTO site_feedback(id,category,page,message,created_at) VALUES(?,?,?,?,?)').bind(input.id,input.category,input.page,input.message,new Date().toISOString()).run();
  return json({saved:true},201);
}
export async function feedbackResolve(request:Request,b:Record<string,unknown>,db?:D1Database,key?:string) {
  await requireEditor(request,key);
  if (!db) throw new HttpError(503,'feedback_not_configured');
  if (typeof b.id !== 'string' || !/^[a-f0-9-]{36}$/.test(b.id)) throw new HttpError(400,'invalid_input');
  const result=await db.prepare("UPDATE site_feedback SET status='resolved' WHERE id=?").bind(b.id).run();
  if (!result.meta.changes) throw new HttpError(404,'not_found');
  return json({saved:true});
}
