type Text = { en: string; km: string };
const text = (en: string, km: string): Text => ({ en, km });
type Choice = { value: string; label: Text };
type Field = { key: string; label: Text; type: 'text' | 'number' | 'date' | 'choice'; optional?: boolean; choices?: Choice[]; positive?: boolean };
type Sheet = { title: Text; description: Text; fields: Field[] };
const field = (key: string, label: Text, type: Field['type'] = 'text', optional = false): Field => ({ key, label, type, optional });
const nonzero = (key: string, label: Text): Field => ({ key, label, type: 'number', positive: true });
const choose = (key: string, label: Text, options: [string, string, string][]): Field =>
  ({ key, label, type: 'choice', choices: options.map(([value,en,km]) => ({value, label:text(en,km)})) });
const date = field('date', text('Date', 'កាលបរិច្ឆេទ'), 'date');
const place = field('place', text('Market or public location', 'ផ្សារ ឬទីតាំងសាធារណៈ'));
const source = field('source', text('Source or person’s public business name', 'ប្រភព ឬឈ្មោះអាជីវកម្មសាធារណៈ'));
const remark = field('note', text('Notes (optional)', 'កំណត់ចំណាំ (អាចទុកទទេ)'), 'text', true);

export const sheets = {
  market: {
    title: text('Compare crop offers', 'ប្រៀបធៀបតម្លៃកសិផល'),
    description: text('Enter quotes for the same crop and grade. Keep the market, source and date with each price. Compare the return per kilogram after the transport cost of that load.', 'បញ្ចូលតម្លៃសម្រាប់ដំណាំប្រភេទ និងគុណភាពដូចគ្នា។ កត់ផ្សារ ប្រភព និងកាលបរិច្ឆេទនៃតម្លៃនីមួយៗ។ ប្រៀបធៀបប្រាក់ក្នុងមួយគីឡូក្រាមក្រោយដកថ្លៃដឹកជញ្ជូន។'),
    fields: [date, field('product',text('Crop, variety and grade','ដំណាំ ពូជ និងគុណភាព')), place, source, nonzero('kg',text('Weight of this load (kg)','ទម្ងន់កសិផលសរុប (គីឡូក្រាម)')), field('total',text('Buyer’s price for the whole load (riel)','តម្លៃអ្នកទិញសម្រាប់កសិផលទាំងអស់ (រៀល)'),'number'), field('transport',text('Transport for the load (riel)','ថ្លៃដឹកកសិផលសរុប (រៀល)'),'number')],
  },
  season: {
    title: text('Seasonal crop calendar','ប្រតិទិនដាំដុះតាមរដូវ'),
    description: text('Plan dates with a local adviser for your variety. Add watering and field checks alongside harvest, drying and safe storage tasks.', 'រៀបចំកាលបរិច្ឆេទជាមួយអ្នកប្រឹក្សាកសិកម្មតាមពូជដំណាំ។ បន្ថែមការត្រួតពិនិត្យទឹក និងស្រែ ជាមួយការប្រមូលផល ការហាល និងការស្តុកទុក។'),
    fields: [date,field('crop',text('Crop and plot label','ដំណាំ និងឈ្មោះសម្គាល់ទីតាំង')),field('task',text('Planned task','ការងារដែលបានគ្រោង')),remark],
  },
  repairs: {
    title: text('Community maintenance register','បញ្ជីតាមដានការថែទាំសហគមន៍'),
    description: text('Log a public asset, assign a follow-up date and update its status after a local check. For a school bathroom, check water at the tap, soap, drainage and which stalls can be used. Share the downloaded register with the next team.', 'កត់ត្រាសម្បត្តិសាធារណៈ កំណត់ថ្ងៃតាមដាន និងធ្វើបច្ចុប្បន្នភាពក្រោយពិនិត្យ។ សម្រាប់បង្គន់សាលា ពិនិត្យទឹកនៅក្បាលរ៉ូប៊ីណេ សាប៊ូ ការបង្ហូរទឹក និងបន្ទប់ដែលអាចប្រើបាន។ ចែករំលែកបញ្ជីដែលបានទាញយកទៅក្រុមបន្ទាប់។'),
    fields: [date,field('asset',text('Public asset and landmark','សម្បត្តិសាធារណៈ និងកន្លែងសម្គាល់')),field('issue',text('Observed condition or repair','ស្ថានភាព ឬការជួសជុលដែលបានសង្កេត')),field('team',text('Responsible team or office','ក្រុម ឬការិយាល័យទទួលបន្ទុក')),field('followup',text('Follow-up date','ថ្ងៃតាមដាន'),'date'),choose('status',text('Status','ស្ថានភាព'),[['open','Needs attention','ត្រូវការដោះស្រាយ'],['progress','Repair in progress','កំពុងជួសជុល'],['checked','Rechecked and working','បានពិនិត្យ និងដំណើរការ']])],
  },
  cleanup: {
    title: text('Cleanup collection log','បញ្ជីសម្ភារៈដែលប្រមូលបាន'),
    description: text('Weigh each material separately. Record the receiving collector and distinguish measured collections from estimates. Only weighed entries count toward the measured total.', 'ថ្លឹងសម្ភារៈនីមួយៗដោយឡែក។ កត់ឈ្មោះអ្នកទទួល និងបែងចែកទម្ងន់ដែលថ្លឹងពីទម្ងន់ប៉ាន់ស្មាន។ លទ្ធផលសរុបរាប់តែទម្ងន់ដែលបានថ្លឹង។'),
    fields: [date,place,field('material',text('Material','ប្រភេទសម្ភារៈ')),nonzero('kg',text('Weight (kg)','ទម្ងន់ (គីឡូក្រាម)')),choose('method',text('How determined','របៀបកំណត់ទម្ងន់'),[['weighed','Weighed','បានថ្លឹង'],['estimate','Estimated','ប៉ាន់ស្មាន']]),field('collector',text('Collector or destination','អ្នកទទួល ឬទីតាំងទទួល'))],
  },
  solar: {
    title: text('Compare written solar quotes','ប្រៀបធៀបសម្រង់តម្លៃប្រព័ន្ធសូឡា'),
    description: text('Keep each quote and ask how annual output was estimated. Compare battery storage, installer credentials, warranty and included work before comparing price per installed kilowatt.', 'រក្សាសម្រង់តម្លៃនីមួយៗ ហើយសួរពីរបៀបប៉ាន់ប្រមាណថាមពលប្រចាំឆ្នាំ។ ប្រៀបធៀបអាគុយ លិខិតអនុញ្ញាតរបស់ក្រុមហ៊ុន ការធានា និងការងារដែលបានរាប់បញ្ចូល មុនប្រៀបធៀបតម្លៃក្នុងមួយគីឡូវ៉ាត់។'),
    fields: [date,field('supplier',text('Installer / quote reference','ក្រុមហ៊ុនដំឡើង និងលេខយោង')),nonzero('kw',text('Panel capacity (kWp)','អានុភាពបន្ទះ (kWp)')),field('battery',text('Usable battery storage (kWh), zero if none','ចំណុះអាគុយដែលប្រើបាន (kWh) បញ្ចូលសូន្យបើគ្មាន'),'number'),field('cost',text('Installed price (riel)','តម្លៃរួមការដំឡើង (រៀល)'),'number'),field('terms',text('Output assumption, warranty and credential check','ការប៉ាន់ប្រមាណថាមពល ការធានា និងការផ្ទៀងផ្ទាត់លិខិតអនុញ្ញាត'))],
  },
  stock: {
    title: text('Stock book','បញ្ជីស្តុកទំនិញ'),
    description: text('Start each product with its opening stock as received. Use the same product name and unit for later purchases, sales and losses. A negative balance flags a missing entry.', 'ចាប់ផ្តើមទំនិញនីមួយៗដោយកត់ស្តុកដំបូងក្នុងចំនួនទទួល។ ប្រើឈ្មោះ និងឯកតាដូចគ្នាសម្រាប់ការទិញ ការលក់ និងការខាតបង់។ សមតុល្យអវិជ្ជមានអាចបង្ហាញថាមានកំណត់ត្រាខ្វះ។'),
    fields: [date,field('product',text('Product and unit','ទំនិញ និងឯកតា')),field('received',text('Units received','ចំនួនទទួល'),'number'),field('removed',text('Units sold or removed','ចំនួនលក់ ឬដកចេញ'),'number'),remark],
  },
  cash: {
    title: text('Dated cash-flow worksheet','សន្លឹកតាមដានលំហូរសាច់ប្រាក់'),
    description: text('Record the opening cash as money in, then enter planned receipts and payments in riel. The running balance shows when a bill falls due before money arrives.', 'កត់សាច់ប្រាក់ដំបូងជាប្រាក់ចូល រួចកត់ប្រាក់ទទួល និងប្រាក់ត្រូវបង់តាមកាលបរិច្ឆេទជារៀល។ សមតុល្យបន្តបន្ទាប់បង្ហាញពេលដែលវិក្កយបត្រត្រូវបង់មុនពេលប្រាក់ចូល។'),
    fields: [date,field('item',text('Receipt, purchase or payment','ចំណូល ការទិញ ឬការបង់ប្រាក់')),field('incoming',text('Money in (riel)','ប្រាក់ចូល (រៀល)'),'number'),field('outgoing',text('Money out (riel)','ប្រាក់ចេញ (រៀល)'),'number')],
  },
} satisfies Record<string, Sheet>;

export type SheetKey = keyof typeof sheets;
export type Row = Record<string,string>;
export const getSheet = (key: SheetKey): Sheet => sheets[key];
export const maxRows = 200;
export function validRow(key: SheetKey, value: unknown): value is Row {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const row = value as Row;
  return getSheet(key).fields.every(f => {
    const raw = row[f.key];
    if (typeof raw !== 'string' || raw.length > 250) return false;
    if (!raw.trim()) return !!f.optional;
    if (f.type === 'date') {
      const time = new Date(raw + 'T00:00:00Z');
      return /^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(+time) && time.toISOString().slice(0,10) === raw;
    }
    if (f.type === 'number') return /^\d+(\.\d+)?$/.test(raw) && Number(raw) <= 1e12 && (!f.positive || Number(raw) > 0);
    if (f.type === 'choice') return f.choices?.some(c => c.value === raw);
    return true;
  });
}

export function readSheet(key: SheetKey, raw: string): Row[] {
  if (raw.length > 600000) throw new Error('too_large');
  const file = JSON.parse(raw);
  if (file?.format !== 'khmer-one-sheet-v1' || file.sheet !== key || !Array.isArray(file.rows) || file.rows.length > maxRows || !file.rows.every((r: unknown) => validRow(key,r))) throw new Error('invalid_sheet');
  return file.rows.map((r: Row) => Object.fromEntries(getSheet(key).fields.map(f => [f.key, r[f.key]])));
}

export function rowResults(key: SheetKey, rows: Row[]): (number | undefined)[] {
  let cash = 0;
  const stocks = new Map<string,number>();
  return rows.map(r => {
    switch (key) {
      case 'market': return (+r.total - +r.transport) / +r.kg;
      case 'solar': return +r.cost / +r.kw;
      case 'cash': cash += +r.incoming - +r.outgoing; return cash;
      case 'stock': {
        const item = r.product.trim().normalize().toLowerCase();
        const left = (stocks.get(item) ?? 0) + +r.received - +r.removed;
        stocks.set(item, left);
        return left;
      }
      default: return undefined;
    }
  });
}
