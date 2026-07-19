// app.js
// ملف واحد يجمع كل منطق التطبيق: الإعدادات، البيانات الثابتة، طبقة قاعدة البيانات (Supabase أو محليًا)،
// الرسوم البيانية، ومنطق الواجهة. مبني كسكربت عادي (بدون ES Modules) ليعمل مباشرة بأبسط شكل ممكن.

/* ============================================================
   ١) الإعدادات — عدّلي هذا القسم بمعلومات مشروع Supabase الخاص بك
   ============================================================ */
// js/config.js
// عدّلي هذا الملف بمعلومات مشروع Supabase الخاص بك قبل النشر.
// تجدين القيمتين في: Supabase Dashboard → Project Settings → API
//   Project URL      → SUPABASE_URL
//   anon public key  → SUPABASE_ANON_KEY
//
// ملاحظة أمان: مفتاح anon مخصص للاستخدام في المتصفح (Frontend) وهو آمن للنشر العلني
// طالما لديك RLS (Row Level Security) مُفعّلة على جداولك — راجع schema.sql

const SUPABASE_URL = "https://fhtujaqqjqbucsekpbsp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KEEs0J3KMm4ZOktdXoOr6w_y3dGyJRo";

// إن تُركت القيم كما هي (بدون تعديل)، سيعمل التطبيق تلقائيًا في "وضع محلي دون اتصال"
// (كل شيء يعمل ويُحفظ في الذاكرة فقط أثناء الجلسة، دون أي مزامنة مع Supabase)
const IS_CONFIGURED =
  !SUPABASE_URL.includes('YOUR-PROJECT-REF') && !SUPABASE_ANON_KEY.includes('YOUR-ANON-PUBLIC-KEY');

/* ============================================================
   ٢) بيانات ثابتة: التصنيفات، الأيقونات، البدائل، الكتالوج، قالب البرنامج
   ============================================================ */
// js/data.js
// بيانات ثابتة يشترك فيها التطبيق كله: التصنيفات، الأيقونات، البدائل، وكتالوج التمارين المرجعي،
// بالإضافة إلى "قالب" البرنامج الأسبوعي الافتراضي المستخدم عند التشغيل الأول (لتهيئة Supabase أو كنسخة محلية).

const MUSCLES = ['الصدر','الظهر','الأرجل','الأكتاف','البايسبس','الترايسبس','البطن','الكارديو'];
const TYPES = ['تقوية','إطالة','كارديو'];

const TYPE_COLOR_HEX = {
  'تقوية': '#FF6B35',
  'إطالة': '#0FD9C4',
  'كارديو': '#FFB84D',
};

const WEEKDAY_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

/* ------------------------ أيقونات خطية مخصصة (بدون صور خارجية) ------------------------ */
const ICONS = {
  'الصدر': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 24h6M36 24h6M12 24a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6"/><circle cx="10" cy="24" r="4"/><circle cx="38" cy="24" r="4"/><path d="M18 24v6M30 24v6"/></svg>`,
  'الظهر': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10h32"/><circle cx="24" cy="18" r="4"/><path d="M24 22v10M17 15l7 7 7-7M14 40l10-8 10 8"/></svg>`,
  'الأرجل': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="8" r="4"/><path d="M24 12v10M24 22l-8 8v10M24 22l8 8v10"/></svg>`,
  'الأكتاف': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="3.5"/><circle cx="38" cy="10" r="3.5"/><path d="M10 13.5V22M38 13.5V22M10 22h28"/><circle cx="24" cy="30" r="4"/><path d="M24 34v8"/></svg>`,
  'البايسبس': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 36c0-8 2-14 8-16"/><path d="M18 20c6-3 12 0 13 6 1 5-2 8-7 8-4 0-6-2-7-5"/><path d="M31 26c3 0 6 2 6 5"/></svg>`,
  'الترايسبس': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="8" r="3.6"/><path d="M24 11.6V20M24 20l10 6M14 34l10-8"/><path d="M31 22c3 2 4 5 3 8"/></svg>`,
  'البطن': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="10" width="20" height="28" rx="6"/><path d="M14 18h20M14 26h20M24 10v28"/></svg>`,
  'stretch': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="9" r="3.6"/><path d="M18 12.6V26M18 26l-9 10M18 20l16-6M28 26l6 12"/></svg>`,
  'الكارديو': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="8" r="3.6"/><path d="M28 11.6l-4 8-8-2-4 9M16 25l6 5-2 10M22 30l8 2 4 9"/></svg>`,
  'default': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="14"/></svg>`,
};

function iconFor(muscle, type) {
  if (type === 'إطالة') return ICONS.stretch;
  if (type === 'كارديو') return ICONS['الكارديو'];
  return ICONS[muscle] || ICONS.default;
}

function unitShort(unit) {
  if (unit === 'تكرار') return 'تكرار';
  if (unit === 'ثانية') return 'ث';
  if (unit === 'دقيقة') return 'د';
  return unit;
}

function targetLabel(item) {
  if (item.unit === 'تكرار') return `${item.sets} مجموعات × ${item.reps} تكرار`;
  if (item.unit === 'ثانية') return `${item.sets} جولات × ${item.reps} ثانية`;
  if (item.unit === 'دقيقة') return item.sets > 1 ? `${item.sets} جولات × ${item.reps} دقيقة` : `${item.reps} دقيقة`;
  return `${item.sets} × ${item.reps}`;
}

/* ------------------------ بدائل ذكية لكل تمرين (أساسية + متقدمة) ------------------------ */
// أضيفي هنا أي تمرين جديد تعطيني بدائله لاحقًا — بنفس الشكل
const ALTERNATIVES = {
  'ديدلفت': {
    basic: ['Reverse Hyperextension', 'Single-Leg Glute Bridge', 'Nordic Hamstring Curl', 'Superman'],
    advanced: ['Front Lever', 'Back Extension'],
  },
  'تجديف بار': {
    basic: ['Inverted Row (Australian Pull-up)', 'Front Lever Row', 'Rings Row'],
  },
  'كرل بار': {
    basic: ['Chin-up', 'Ring Biceps Curl', 'Towel Curl'],
  },
  'كرل تركيز': {
    basic: ['Chin-up', 'Ring Biceps Curl', 'Towel Curl'],
  },
};

/* ------------------------ كتالوج التمارين المرجعي (تبويب "جدول التمارين") ------------------------ */
const CATALOG_EXERCISES = [
  {id:1,  muscle:'الصدر',    name:'ضغط بار مسطح',                    type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:2,  muscle:'الصدر',    name:'ضغط دمبل مائل',                   type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:3,  muscle:'الصدر',    name:'تفتيح صدر بالكيبل',                type:'تقوية', weeklyGoal:2, monthlyGoal:8,  yearlyGoal:104},
  {id:4,  muscle:'الصدر',    name:'إطالة الصدر على الحائط',           type:'إطالة', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:5,  muscle:'الظهر',    name:'سحب أمامي',                       type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:6,  muscle:'الظهر',    name:'ديدلفت',                          type:'تقوية', weeklyGoal:2, monthlyGoal:8,  yearlyGoal:104},
  {id:7,  muscle:'الظهر',    name:'تجديف بار',                       type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:8,  muscle:'الظهر',    name:'إطالة الظهر (وضعية الطفل)',        type:'إطالة', weeklyGoal:5, monthlyGoal:20, yearlyGoal:260},
  {id:9,  muscle:'الأرجل',   name:'سكوات',                           type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:10, muscle:'الأرجل',   name:'لنجز',                            type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:11, muscle:'الأرجل',   name:'ضغط أرجل',                        type:'تقوية', weeklyGoal:2, monthlyGoal:8,  yearlyGoal:104},
  {id:12, muscle:'الأرجل',   name:'إطالة العضلة الخلفية للفخذ',        type:'إطالة', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:13, muscle:'الأكتاف',  name:'ضغط أكتاف بالدمبل',                type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:14, muscle:'الأكتاف',  name:'رفرفة جانبية',                    type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:15, muscle:'الأكتاف',  name:'سحب بار للأمام',                   type:'تقوية', weeklyGoal:2, monthlyGoal:8,  yearlyGoal:104},
  {id:16, muscle:'الأكتاف',  name:'إطالة الكتف الخلفي',                type:'إطالة', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:17, muscle:'البايسبس', name:'كرل بار',                         type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:18, muscle:'البايسبس', name:'كرل تركيز',                       type:'تقوية', weeklyGoal:2, monthlyGoal:8,  yearlyGoal:104},
  {id:19, muscle:'البايسبس', name:'إطالة العضلة ذات الرأسين',          type:'إطالة', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:20, muscle:'الترايسبس',name:'ضغط فرنسي',                       type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:21, muscle:'الترايسبس',name:'بوش داون كيبل',                    type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:22, muscle:'الترايسبس',name:'إطالة الترايسبس خلف الرأس',         type:'إطالة', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:23, muscle:'البطن',    name:'كرانش',                           type:'تقوية', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:24, muscle:'البطن',    name:'بلانك',                           type:'تقوية', weeklyGoal:5, monthlyGoal:20, yearlyGoal:260},
  {id:25, muscle:'البطن',    name:'رفع أرجل معلق',                    type:'تقوية', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:26, muscle:'البطن',    name:'إطالة عضلات البطن (كوبرا)',         type:'إطالة', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:27, muscle:'الكارديو', name:'جري',                             type:'كارديو', weeklyGoal:4, monthlyGoal:16, yearlyGoal:208},
  {id:28, muscle:'الكارديو', name:'دراجة ثابتة',                      type:'كارديو', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:29, muscle:'الكارديو', name:'نط الحبل',                        type:'كارديو', weeklyGoal:3, monthlyGoal:12, yearlyGoal:156},
  {id:30, muscle:'الكارديو', name:'إطالة عامة بعد الكارديو',           type:'إطالة', weeklyGoal:5, monthlyGoal:20, yearlyGoal:260},
  {id:31, muscle:'الكارديو', name:'إطالة قبل التدريب',                 type:'إطالة', weeklyGoal:1, monthlyGoal:4,  yearlyGoal:52},
];

/* ------------------------ قالب البرنامج الأسبوعي الافتراضي ------------------------ */
// يبدأ الأسبوع من الخميس (ظهر وبايسبس) بحسب طلبك، ويُستخدم كبذرة أولى تُدرج في Supabase
// أو كنسخة محلية عند العمل دون اتصال. كل الأداء يبدأ من صفر.
function mk(name, muscle, type, sets, reps, unit) {
  return { name, muscle, type, sets, reps, unit, done: false,
    lastWeekSets: 0, lastWeekReps: 0, thisWeekSets: '', thisWeekReps: '' };
}

function buildDefaultProgram() {
  return [
    { day:'الخميس', theme:'ظهر وبايسبس', rest:false, items:[
      mk('سحب أمامي', 'الظهر', 'تقوية', 4, 10, 'تكرار'),
      mk('ديدلفت', 'الظهر', 'تقوية', 3, 8, 'تكرار'),
      mk('تجديف بار', 'الظهر', 'تقوية', 3, 12, 'تكرار'),
      mk('كرل بار', 'البايسبس', 'تقوية', 3, 12, 'تكرار'),
      mk('كرل تركيز', 'البايسبس', 'تقوية', 3, 12, 'تكرار'),
      mk('إطالة الظهر (وضعية الطفل)', 'الظهر', 'إطالة', 3, 45, 'ثانية'),
    ]},
    { day:'الجمعة', theme:'أرجل كاملة', rest:false, items:[
      mk('سكوات', 'الأرجل', 'تقوية', 4, 10, 'تكرار'),
      mk('لنجز', 'الأرجل', 'تقوية', 3, 12, 'تكرار'),
      mk('ضغط أرجل', 'الأرجل', 'تقوية', 3, 15, 'تكرار'),
      mk('إطالة العضلة الخلفية للفخذ', 'الأرجل', 'إطالة', 3, 30, 'ثانية'),
    ]},
    { day:'السبت', theme:'راحة نشطة', rest:true, items:[] },
    { day:'الأحد', theme:'صدر وترايسبس', rest:false, items:[
      mk('ضغط بار مسطح', 'الصدر', 'تقوية', 4, 10, 'تكرار'),
      mk('ضغط دمبل مائل', 'الصدر', 'تقوية', 3, 12, 'تكرار'),
      mk('تفتيح صدر بالكيبل', 'الصدر', 'تقوية', 3, 15, 'تكرار'),
      mk('ضغط فرنسي', 'الترايسبس', 'تقوية', 3, 12, 'تكرار'),
      mk('بوش داون كيبل', 'الترايسبس', 'تقوية', 3, 15, 'تكرار'),
      mk('إطالة الصدر على الحائط', 'الصدر', 'إطالة', 3, 30, 'ثانية'),
    ]},
    { day:'الاثنين', theme:'أكتاف وبطن', rest:false, items:[
      mk('ضغط أكتاف بالدمبل', 'الأكتاف', 'تقوية', 4, 10, 'تكرار'),
      mk('رفرفة جانبية', 'الأكتاف', 'تقوية', 3, 15, 'تكرار'),
      mk('سحب بار للأمام', 'الأكتاف', 'تقوية', 3, 12, 'تكرار'),
      mk('كرانش', 'البطن', 'تقوية', 4, 20, 'تكرار'),
      mk('بلانك', 'البطن', 'تقوية', 3, 45, 'ثانية'),
      mk('إطالة الكتف الخلفي', 'الأكتاف', 'إطالة', 3, 30, 'ثانية'),
    ]},
    { day:'الثلاثاء', theme:'كارديو وإطالة شاملة', rest:false, items:[
      mk('إطالة قبل التدريب', 'الكارديو', 'إطالة', 1, 5, 'دقيقة'),
      mk('جري', 'الكارديو', 'كارديو', 1, 25, 'دقيقة'),
      mk('نط الحبل', 'الكارديو', 'كارديو', 3, 2, 'دقيقة'),
      mk('إطالة عامة بعد الكارديو', 'الكارديو', 'إطالة', 1, 10, 'دقيقة'),
      mk('إطالة عضلات البطن (كوبرا)', 'البطن', 'إطالة', 3, 30, 'ثانية'),
    ]},
    { day:'الأربعاء', theme:'راحة كاملة', rest:true, items:[] },
  ];
}

/* ============================================================
   ٣) طبقة قاعدة البيانات (Supabase أو وضع محلي دون اتصال)
   ============================================================ */
// js/db.js
// طبقة وصول موحّدة للبيانات: تتصل بـ Supabase إن كانت معلومات الاتصال مضبوطة في js/config.js،
// وإلا تعمل تلقائيًا في "وضع محلي دون اتصال" بنفس شكل البيانات تمامًا — بقية التطبيق لا يهمّه أيهما يعمل.



let supabase = null;
let usingSupabase = false;
let connectionError = null;

async function initSupabaseClient() {
  if (!IS_CONFIGURED) return null;
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // نتأكد أن الاتصال فعليًا يعمل قبل الاعتماد عليه
    const { error } = await client.from('progress_accum').select('id').limit(1);
    if (error) throw error;
    return client;
  } catch (err) {
    connectionError = err;
    console.warn('تعذّر الاتصال بـ Supabase، سيعمل التطبيق في وضع محلي دون اتصال:', err);
    return null;
  }
}

/* ============================================================
   الوضع المحلي (دون اتصال) — يخزّن كل شيء في الذاكرة أثناء الجلسة فقط
   ============================================================ */
let localProgram = null;
let localAccum = { monthDone: 0, monthGoal: 0, yearDone: 0, yearGoal: 0, weeksIntoMonth: 0 };
let localAltIdCounter = 1;
let localItemIdCounter = 1;

function seedLocalProgram() {
  const days = buildDefaultProgram();
  days.forEach((d) => {
    d.items.forEach((item) => {
      item.id = localItemIdCounter++;
      const alt = ALTERNATIVES[item.name];
      item.alternatives = [];
      if (alt) {
        alt.basic.forEach((name) => item.alternatives.push({ id: localAltIdCounter++, name, tier: 'basic', active: false, sets: '', reps: '' }));
        (alt.advanced || []).forEach((name) => item.alternatives.push({ id: localAltIdCounter++, name, tier: 'advanced', active: false, sets: '', reps: '' }));
      }
    });
  });
  return days;
}

/* ============================================================
   تهيئة قاعدة البيانات — تُستدعى مرة واحدة عند بدء التطبيق
   ============================================================ */
async function initDB() {
  supabase = await initSupabaseClient();
  usingSupabase = !!supabase;

  if (!usingSupabase) {
    localProgram = seedLocalProgram();
    return { usingSupabase: false, error: connectionError };
  }

  // تحقق هل قاعدة البيانات فارغة (أول تشغيل) — إن كانت كذلك، لا شيء نفعله هنا
  // لأن supabase/schema.sql يزرع البيانات الأولية مباشرة عند تنفيذه في Supabase.
  return { usingSupabase: true, error: null };
}

/* ============================================================
   قراءة البرنامج الأسبوعي كاملًا (مجمّعًا حسب اليوم)
   ============================================================ */
async function getProgram() {
  if (!usingSupabase) return localProgram;

  const { data: items, error: e1 } = await supabase
    .from('program_items')
    .select('*')
    .order('day_order', { ascending: true })
    .order('sort_order', { ascending: true });
  if (e1) throw e1;

  const { data: alts, error: e2 } = await supabase.from('alternatives').select('*');
  if (e2) throw e2;

  const byDay = new Map();
  items.forEach((row) => {
    if (!byDay.has(row.day_name)) {
      byDay.set(row.day_name, { day: row.day_name, theme: row.theme, rest: row.is_rest, order: row.day_order, items: [] });
    }
    if (row.is_rest) return;
    byDay.get(row.day_name).items.push({
      id: row.id,
      name: row.name,
      muscle: row.muscle,
      type: row.type,
      sets: row.sets,
      reps: row.reps,
      unit: row.unit,
      done: row.done,
      lastWeekSets: row.last_week_sets,
      lastWeekReps: row.last_week_reps,
      thisWeekSets: row.this_week_sets ?? '',
      thisWeekReps: row.this_week_reps ?? '',
      alternatives: alts
        .filter((a) => a.program_item_id === row.id)
        .map((a) => ({ id: a.id, name: a.name, tier: a.tier, active: a.active, sets: a.sets ?? '', reps: a.reps ?? '' })),
    });
  });

  return [...byDay.values()].sort((a, b) => a.order - b.order);
}

/* ============================================================
   كتالوج التمارين المرجعي
   ============================================================ */
async function getCatalog() {
  if (!usingSupabase) return CATALOG_EXERCISES;
  const { data, error } = await supabase.from('catalog_exercises').select('*').order('id');
  if (error) throw error;
  return data.map((r) => ({
    id: r.id, muscle: r.muscle, name: r.name, type: r.type,
    weeklyGoal: r.weekly_goal, monthlyGoal: r.monthly_goal, yearlyGoal: r.yearly_goal,
  }));
}

/* ============================================================
   تراكم الإنجاز الشهري/السنوي
   ============================================================ */
async function getAccum() {
  if (!usingSupabase) return localAccum;
  const { data, error } = await supabase.from('progress_accum').select('*').eq('id', 1).single();
  if (error) throw error;
  return {
    monthDone: data.month_done, monthGoal: data.month_goal,
    yearDone: data.year_done, yearGoal: data.year_goal,
    weeksIntoMonth: data.weeks_into_month,
  };
}

async function saveAccum(accum) {
  if (!usingSupabase) { localAccum = accum; return; }
  const { error } = await supabase.from('progress_accum').update({
    month_done: accum.monthDone, month_goal: accum.monthGoal,
    year_done: accum.yearDone, year_goal: accum.yearGoal,
    weeks_into_month: accum.weeksIntoMonth,
  }).eq('id', 1);
  if (error) throw error;
}

/* ============================================================
   تحديثات مباشرة (تُستدعى عند كل تفاعل من المستخدم)
   ============================================================ */
async function setItemDone(itemId, done) {
  if (!usingSupabase) {
    for (const d of localProgram) { const it = d.items.find((i) => i.id === itemId); if (it) it.done = done; }
    return;
  }
  const { error } = await supabase.from('program_items').update({ done }).eq('id', itemId);
  if (error) throw error;
}

async function setDayAllDone(itemIds, done) {
  if (!usingSupabase) {
    for (const d of localProgram) for (const it of d.items) if (itemIds.includes(it.id)) it.done = done;
    return;
  }
  const { error } = await supabase.from('program_items').update({ done }).in('id', itemIds);
  if (error) throw error;
}

async function setItemLog(itemId, { sets, reps }) {
  if (!usingSupabase) {
    for (const d of localProgram) { const it = d.items.find((i) => i.id === itemId); if (it) { it.thisWeekSets = sets; it.thisWeekReps = reps; } }
    return;
  }
  const { error } = await supabase.from('program_items').update({
    this_week_sets: sets === '' ? null : Number(sets),
    this_week_reps: reps === '' ? null : Number(reps),
  }).eq('id', itemId);
  if (error) throw error;
}

async function setAlternativeActive(altId, active) {
  if (!usingSupabase) {
    for (const d of localProgram) for (const it of d.items) { const a = it.alternatives.find((x) => x.id === altId); if (a) a.active = active; }
    return;
  }
  const { error } = await supabase.from('alternatives').update({ active }).eq('id', altId);
  if (error) throw error;
}

async function setAlternativeLog(altId, { sets, reps }) {
  if (!usingSupabase) {
    for (const d of localProgram) for (const it of d.items) { const a = it.alternatives.find((x) => x.id === altId); if (a) { a.sets = sets; a.reps = reps; } }
    return;
  }
  const { error } = await supabase.from('alternatives').update({
    sets: sets === '' ? null : Number(sets),
    reps: reps === '' ? null : Number(reps),
  }).eq('id', altId);
  if (error) throw error;
}

/* ============================================================
   "ابدأ أسبوعًا جديدًا": ترحيل الأرقام إلى "الأسبوع الماضي"، تصفير الأسبوع الحالي،
   وتراكم الإنجاز في العداد الشهري/السنوي
   ============================================================ */
async function startNewWeek() {
  const program = await getProgram();
  let weekDone = 0, weekTotal = 0;
  const updates = [];

  program.forEach((d) => {
    if (d.rest) return;
    d.items.forEach((item) => {
      weekTotal++;
      if (item.done) weekDone++;
      const hasSets = item.thisWeekSets !== '' && item.thisWeekSets != null;
      const hasReps = item.thisWeekReps !== '' && item.thisWeekReps != null;
      updates.push({
        id: item.id,
        lastWeekSets: hasSets ? Number(item.thisWeekSets) : item.lastWeekSets,
        lastWeekReps: hasReps ? Number(item.thisWeekReps) : item.lastWeekReps,
      });
    });
  });

  const accum = await getAccum();
  accum.monthDone += weekDone; accum.monthGoal += weekTotal;
  accum.yearDone += weekDone; accum.yearGoal += weekTotal;
  accum.weeksIntoMonth += 1;
  if (accum.weeksIntoMonth >= 4) { accum.monthDone = 0; accum.monthGoal = 0; accum.weeksIntoMonth = 0; }
  await saveAccum(accum);

  if (!usingSupabase) {
    for (const d of localProgram) {
      if (d.rest) continue;
      for (const it of d.items) {
        const u = updates.find((x) => x.id === it.id);
        it.lastWeekSets = u.lastWeekSets; it.lastWeekReps = u.lastWeekReps;
        it.thisWeekSets = ''; it.thisWeekReps = '';
        it.done = false;
      }
    }
    return;
  }

  // Supabase: تحديث كل صف على حدة (عدد العناصر صغير، لا حاجة لدفعة معقّدة)
  await Promise.all(updates.map((u) =>
    supabase.from('program_items').update({
      last_week_sets: u.lastWeekSets,
      last_week_reps: u.lastWeekReps,
      this_week_sets: null,
      this_week_reps: null,
      done: false,
    }).eq('id', u.id)
  ));
}

const db = { initDB, getProgram, getCatalog, getAccum, setItemDone, setDayAllDone, setItemLog, setAlternativeActive, setAlternativeLog, startNewWeek };

/* ============================================================
   ٤) الرسوم البيانية (Chart.js محمّلة عالميًا من CDN في index.html)
   ============================================================ */
// js/charts.js
// تهيئة وتحديث الرسوم البيانية (Chart.js يُحمَّل عالميًا من CDN في index.html)


const charts = {};

function chartsReady() {
  return typeof window.Chart !== 'undefined';
}

function initCharts({ trendHistory, todayPct, byMuscleMap, byTypeMap }) {
  if (!chartsReady()) { console.warn('Chart.js لم يتم تحميله — سيتم تخطي الرسوم البيانية فقط.'); return; }
  const Chart = window.Chart;
  Chart.defaults.font.family = "'Tajawal', sans-serif";
  Chart.defaults.color = '#8C96A6';
  Chart.defaults.borderColor = '#2A3441';

  const pct = (done, goal) => (goal > 0 ? Math.round((done / goal) * 100) : 0);

  charts.trend = new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: ['قبل ٦ أيام', 'قبل ٥', 'قبل ٤', 'قبل ٣', 'أمس', 'اليوم قبل التحديث', 'اليوم'],
      datasets: [{
        label: 'نسبة الإنجاز اليومي',
        data: [...trendHistory, todayPct],
        borderColor: '#FF6B35', backgroundColor: 'rgba(255,107,53,.12)',
        tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: '#FF6B35',
        pointBorderColor: '#0E1319', pointBorderWidth: 2, borderWidth: 2.5,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { rtl: true, textDirection: 'rtl' } },
      scales: { y: { min: 0, max: 100, grid: { color: '#212B37' }, ticks: { callback: (v) => v + '%' } }, x: { grid: { display: false } } },
    },
  });

  charts.donut = new Chart(document.getElementById('typeDonut'), {
    type: 'doughnut',
    data: { labels: TYPES, datasets: [{ data: TYPES.map((t) => byTypeMap[t].done), backgroundColor: TYPES.map((t) => TYPE_COLOR_HEX[t]), borderColor: '#1A222D', borderWidth: 3 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', rtl: true, textDirection: 'rtl', labels: { padding: 16, usePointStyle: true } }, tooltip: { rtl: true, textDirection: 'rtl' } } },
  });

  charts.radar = new Chart(document.getElementById('muscleRadar'), {
    type: 'radar',
    data: { labels: MUSCLES, datasets: [{ label: 'نسبة الإنجاز', data: MUSCLES.map((m) => pct(byMuscleMap[m].done, byMuscleMap[m].goal)), backgroundColor: 'rgba(15,217,196,.18)', borderColor: '#0FD9C4', borderWidth: 2, pointBackgroundColor: '#0FD9C4', pointRadius: 3 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { rtl: true, textDirection: 'rtl' } }, scales: { r: { min: 0, max: 100, angleLines: { color: '#212B37' }, grid: { color: '#212B37' }, pointLabels: { color: '#8C96A6', font: { size: 11 } }, ticks: { display: false, stepSize: 25 } } } },
  });

  charts.bar = new Chart(document.getElementById('muscleBar'), {
    type: 'bar',
    data: { labels: MUSCLES, datasets: [
      { label: 'المستهدف', data: MUSCLES.map((m) => byMuscleMap[m].goal), backgroundColor: '#2A3441', borderRadius: 6, barThickness: 12 },
      { label: 'المنجز', data: MUSCLES.map((m) => byMuscleMap[m].done), backgroundColor: '#FF6B35', borderRadius: 6, barThickness: 12 },
    ] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { position: 'bottom', rtl: true, textDirection: 'rtl', labels: { usePointStyle: true } }, tooltip: { rtl: true, textDirection: 'rtl' } }, scales: { x: { grid: { color: '#212B37' } }, y: { grid: { display: false } } } },
  });
}

function updateCharts({ trendHistory, todayPct, byMuscleMap, byTypeMap }) {
  if (!charts.trend) return;
  const pct = (done, goal) => (goal > 0 ? Math.round((done / goal) * 100) : 0);

  charts.trend.data.datasets[0].data = [...trendHistory, todayPct];
  charts.trend.update();

  charts.donut.data.datasets[0].data = TYPES.map((t) => byTypeMap[t].done);
  charts.donut.update();

  charts.radar.data.datasets[0].data = MUSCLES.map((m) => pct(byMuscleMap[m].done, byMuscleMap[m].goal));
  charts.radar.update();

  charts.bar.data.datasets[0].data = MUSCLES.map((m) => byMuscleMap[m].goal);
  charts.bar.data.datasets[1].data = MUSCLES.map((m) => byMuscleMap[m].done);
  charts.bar.update();
}

/* ============================================================
   ٥) منطق الواجهة الرئيسي
   ============================================================ */
// js/app.js
// نقطة الدخول الرئيسية: تجلب البيانات عبر db.js (Supabase أو محليًا)، وترسم كل تبويبات اللوحة،
// وتُحدّث النظرة العامة وحاسبة الإنجاز فور أي تعليم في البرنامج الأسبوعي.




/* ======================= الحالة العامة ======================= */
let program = [];      // البرنامج الأسبوعي (من db.js)
let catalog = [];      // كتالوج التمارين المرجعي
let accum = { monthDone: 0, monthGoal: 0, yearDone: 0, yearGoal: 0, weeksIntoMonth: 0 };
let trendHistory = [0, 0, 0, 0, 0, 0];
let filters = { muscle: 'الكل', type: 'الكل', search: '' };

/* ======================= أدوات مساعدة ======================= */
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function pct(done, goal) { return goal > 0 ? clamp(Math.round((done / goal) * 100), 0, 100) : 0; }

function getTodayProgramDay() {
  const name = WEEKDAY_AR[new Date().getDay()];
  return program.find((d) => d.day === name) || null;
}

function weekTotals() {
  let total = 0, done = 0;
  program.forEach((d) => { if (d.rest) return; total += d.items.length; done += d.items.filter((i) => i.done).length; });
  return { total, done, pct: pct(done, total) };
}

function computeTotals() {
  const todayDay = getTodayProgramDay();
  const day = (todayDay && !todayDay.rest)
    ? { done: todayDay.items.filter((i) => i.done).length, total: todayDay.items.length }
    : { done: 0, total: 0 };
  const wt = weekTotals();
  const week = { done: wt.done, goal: wt.total };
  const month = { done: accum.monthDone, goal: accum.monthGoal };
  const year = { done: accum.yearDone, goal: accum.yearGoal };
  return {
    day: { ...day, pct: pct(day.done, day.total) },
    week: { ...week, pct: pct(week.done, week.goal) },
    month: { ...month, pct: pct(month.done, month.goal) },
    year: { ...year, pct: pct(year.done, year.goal) },
  };
}

function byMuscle() {
  const map = {};
  MUSCLES.forEach((m) => (map[m] = { done: 0, goal: 0 }));
  program.forEach((d) => { if (d.rest) return; d.items.forEach((item) => { map[item.muscle].goal++; if (item.done) map[item.muscle].done++; }); });
  return map;
}
function byType() {
  const map = {};
  TYPES.forEach((t) => (map[t] = { done: 0, goal: 0 }));
  program.forEach((d) => { if (d.rest) return; d.items.forEach((item) => { map[item.type].goal++; if (item.done) map[item.type].done++; }); });
  return map;
}

function gaugeSVG(percent, colorHex, size, label) {
  size = size || 150;
  const stroke = 11;
  const r = size / 2 - stroke / 2 - 9;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * clamp(percent, 0, 100) / 100;
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const angle = i * 30 * Math.PI / 180;
    const major = i % 3 === 0;
    const outer = r + stroke / 2 + 6;
    const inner = major ? r + stroke / 2 : r + stroke / 2 + 3.2;
    const x1 = c + inner * Math.sin(angle), y1 = c - inner * Math.cos(angle);
    const x2 = c + outer * Math.sin(angle), y2 = c - outer * Math.cos(angle);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#3A4453" stroke-width="${major ? 2 : 1}" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="gauge">
    ${ticks}
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#212B37" stroke-width="${stroke}"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${colorHex}" stroke-width="${stroke}" stroke-linecap="round"
      stroke-dasharray="${dash.toFixed(1)} ${circumference.toFixed(1)}" transform="rotate(-90 ${c} ${c})"/>
    <text x="${c}" y="${c - 1}" text-anchor="middle" class="gauge-value" fill="#EEF1F5">${Math.round(percent)}%</text>
    <text x="${c}" y="${c + 21}" text-anchor="middle" class="gauge-label" fill="#8C96A6">${label}</text>
  </svg>`;
}

/* ======================= نظرة عامة: بطاقات الإحصاء ======================= */
function renderStatCards() {
  const t = computeTotals();
  const cards = [
    { label: 'اليوم', val: t.day.pct, sub: `${t.day.done} / ${t.day.total} تمارين مجدولة`, colorVar: '--orange', colorDim: '--orange-dim' },
    { label: 'هذا الأسبوع', val: t.week.pct, sub: `${t.week.done} / ${t.week.goal} جلسة`, colorVar: '--teal', colorDim: '--teal-dim' },
    { label: 'هذا الشهر', val: t.month.pct, sub: `${t.month.done} / ${t.month.goal} جلسة`, colorVar: '--amber', colorDim: '--amber-dim' },
    { label: 'هذا العام', val: t.year.pct, sub: `${t.year.done} / ${t.year.goal} جلسة`, colorVar: '--green', colorDim: '--green-dim' },
  ];
  document.getElementById('statRow').innerHTML = cards.map((c) => `
    <div class="stat-card" style="--stat-color:var(${c.colorVar}); --stat-color-dim:var(${c.colorDim});">
      <div class="top"><span class="lbl">إنجاز ${c.label}</span><span class="badge">${c.val}%</span></div>
      <div class="value">${c.val}<span style="font-size:16px;">%</span></div>
      <div class="sub">${c.sub}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${c.val}%;"></div></div>
    </div>`).join('');
  document.getElementById('chipDayPct').textContent = t.day.pct + '%';
  return t;
}

/* ======================= نظرة عامة: الرسوم البيانية ======================= */
function chartsPayload(t) {
  return { trendHistory, todayPct: t.day.pct, byMuscleMap: byMuscle(), byTypeMap: byType() };
}

/* ======================= تبويب: جدول التمارين (كتالوج مرجعي) ======================= */
function renderFilters() {
  const muscleWrap = document.getElementById('muscleFilters');
  muscleWrap.innerHTML = ['الكل', ...MUSCLES].map((m) => `<button class="chip ${filters.muscle === m ? 'active' : ''}" data-filter="muscle" data-val="${m}">${m}</button>`).join('');
  const typeWrap = document.getElementById('typeFilters');
  typeWrap.innerHTML = ['الكل', ...TYPES].map((t) => `<button class="chip type-${t} ${filters.type === t ? 'active' : ''}" data-filter="type" data-val="${t}">${t}</button>`).join('');
  muscleWrap.querySelectorAll('.chip').forEach((el) => el.addEventListener('click', onFilterClick));
  typeWrap.querySelectorAll('.chip').forEach((el) => el.addEventListener('click', onFilterClick));
}
function onFilterClick(e) {
  filters[e.currentTarget.dataset.filter] = e.currentTarget.dataset.val;
  renderFilters();
  renderTable();
}
function renderTable() {
  const q = filters.search.trim();
  const rows = catalog.filter((e) => {
    if (filters.muscle !== 'الكل' && e.muscle !== filters.muscle) return false;
    if (filters.type !== 'الكل' && e.type !== filters.type) return false;
    if (q && !e.name.includes(q)) return false;
    return true;
  });
  const body = document.getElementById('tableBody');
  if (rows.length === 0) { body.innerHTML = `<tr class="empty-row"><td colspan="5">لا توجد تمارين مطابقة لهذا الفلتر</td></tr>`; return; }
  body.innerHTML = rows.map((e) => {
    const iconColor = TYPE_COLOR_HEX[e.type];
    return `
    <tr>
      <td><div class="ex-cell"><span class="ex-icon" style="--icon-bg:${iconColor}22; --icon-color:${iconColor};">${iconFor(e.muscle, e.type)}</span><span class="ex-name">${e.name}</span></div></td>
      <td><span class="muscle-tag">${e.muscle}</span></td>
      <td><span class="type-pill ${e.type}">${e.type}</span></td>
      <td>${e.weeklyGoal} / أسبوع</td>
      <td>${e.monthlyGoal} / شهر · ${e.yearlyGoal} / سنة</td>
    </tr>`;
  }).join('');
}

/* ======================= تبويب: البرنامج الأسبوعي ======================= */
function refreshDashboardFromWeek() {
  const t = renderStatCards();
  if (chartsReady()) { try { updateCharts(chartsPayload(t)); } catch (err) { console.warn(err); } }
  renderCalculator(t);
}

function altListHTML(item, unitLabel) {
  if (!item.alternatives || item.alternatives.length === 0) return '';
  const basics = item.alternatives.filter((a) => a.tier === 'basic');
  const advanced = item.alternatives.filter((a) => a.tier === 'advanced');
  const chip = (a) => `<button type="button" class="alt-chip ${a.tier === 'advanced' ? 'advanced' : ''} ${a.active ? 'selected' : ''}" data-alt-id="${a.id}">${a.active ? '✓ ' : ''}${a.name}</button>`;
  let html = `<div class="alt-list">${basics.map(chip).join('')}`;
  if (advanced.length) html += `<div class="alt-advanced-label">بدائل متقدمة</div>${advanced.map(chip).join('')}`;
  html += '</div>';
  const active = item.alternatives.filter((a) => a.active);
  if (active.length) {
    html += '<div class="alt-logs">' + active.map((a) => `
      <div class="alt-log-row">
        <span class="alt-log-name">${a.name}</span>
        <div class="log-inputs">
          <input type="number" min="0" class="log-input alt-log-sets" data-alt-id="${a.id}" value="${a.sets}" placeholder="مجموعات">
          <span class="log-x">×</span>
          <input type="number" min="0" class="log-input alt-log-reps" data-alt-id="${a.id}" value="${a.reps}" placeholder="${unitLabel}">
          <span class="log-unit">${unitLabel}</span>
        </div>
      </div>`).join('') + '</div>';
  }
  return html;
}

function renderWeekly() {
  const wt = weekTotals();
  document.getElementById('weekSummary').innerHTML = `
    <span class="ws-pct">${wt.pct}%</span>
    <div class="ws-track"><div class="ws-fill" style="width:${wt.pct}%;"></div></div>
    <span class="ws-sub">${wt.done} من ${wt.total} تمرين مكتمل هذا الأسبوع</span>
    <div class="week-actions"><button class="new-week-btn" id="newWeekBtn">ابدأ أسبوعًا جديدًا ↻</button></div>`;
  document.getElementById('newWeekBtn').addEventListener('click', onStartNewWeek);

  const grid = document.getElementById('daysGrid');
  grid.innerHTML = program.map((d) => {
    if (d.rest) return `<div class="day-card is-rest"><div class="rest-icon">😴</div><div class="day-name">${d.day}</div><div class="day-theme">${d.theme} — لا تمارين مجدولة</div></div>`;
    const total = d.items.length, done = d.items.filter((i) => i.done).length;
    const dpct = total ? Math.round((done / total) * 100) : 0;
    const allDone = total > 0 && done === total;
    return `
    <div class="day-card">
      <div class="day-head"><div><div class="day-name">${d.day}</div><div class="day-theme">${d.theme}</div></div><span class="day-pct">${done}/${total}</span></div>
      <div class="day-track"><div class="day-fill" style="width:${dpct}%;"></div></div>
      <label class="day-all-toggle"><input type="checkbox" class="cbx day-all-cbx" data-day="${d.day}" ${allDone ? 'checked' : ''}> تحديد اليوم كاملًا كمكتمل</label>
      <div class="day-items">
        ${d.items.map((item) => {
          const iconColor = TYPE_COLOR_HEX[item.type] || '#8C96A6';
          const icon = iconFor(item.muscle, item.type);
          const us = unitShort(item.unit);
          return `
          <div class="day-item">
            <input type="checkbox" class="cbx day-item-cbx" data-id="${item.id}" ${item.done ? 'checked' : ''}>
            <div class="di-body">
              <div class="di-top">
                <span class="di-icon" style="--icon-bg:${iconColor}22; --icon-color:${iconColor};">${icon}</span>
                <div class="di-info"><div class="di-name ${item.done ? 'done' : ''}">${item.name}</div><div class="di-target">${targetLabel(item)}</div></div>
              </div>
              <div class="log-row">
                <span class="log-last">الأسبوع الماضي: ${item.lastWeekSets}×${item.lastWeekReps} ${us}</span>
                <div class="log-inputs">
                  <input type="number" min="0" class="log-input log-sets" data-id="${item.id}" placeholder="${item.sets}" value="${item.thisWeekSets}">
                  <span class="log-x">×</span>
                  <input type="number" min="0" class="log-input log-reps" data-id="${item.id}" placeholder="${item.reps}" value="${item.thisWeekReps}">
                  <span class="log-unit">${us}</span>
                </div>
              </div>
              ${item.alternatives && item.alternatives.length ? `
              <details class="alt-box" data-id="${item.id}" ${item.altOpen ? 'open' : ''}>
                <summary>البدائل (${item.alternatives.length})</summary>
                <div class="alt-container" data-id="${item.id}">${altListHTML(item, us)}</div>
              </details>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.day-item-cbx').forEach((cb) => cb.addEventListener('change', onToggleItem));
  grid.querySelectorAll('.day-all-cbx').forEach((cb) => cb.addEventListener('change', onToggleDay));
  grid.querySelectorAll('.log-sets').forEach((inp) => inp.addEventListener('input', onLogInput('sets')));
  grid.querySelectorAll('.log-reps').forEach((inp) => inp.addEventListener('input', onLogInput('reps')));
  grid.querySelectorAll('.alt-box').forEach((dt) => dt.addEventListener('toggle', () => {
    const item = findItem(Number(dt.dataset.id));
    if (item) item.altOpen = dt.open;
  }));
  grid.querySelectorAll('.alt-chip').forEach((btn) => btn.addEventListener('click', onToggleAlt));
  grid.querySelectorAll('.alt-log-sets').forEach((inp) => inp.addEventListener('input', onAltLogInput('sets')));
  grid.querySelectorAll('.alt-log-reps').forEach((inp) => inp.addEventListener('input', onAltLogInput('reps')));
}

function findItem(itemId) {
  for (const d of program) { const it = d.items.find((i) => i.id === itemId); if (it) return it; }
  return null;
}

function onToggleItem(e) {
  const id = Number(e.target.dataset.id);
  const item = findItem(id);
  if (!item) return;
  item.done = e.target.checked;
  renderWeekly();
  refreshDashboardFromWeek();
  db.setItemDone(id, item.done).catch((err) => showToast('تعذّر الحفظ في قاعدة البيانات: ' + err.message));
}

function onToggleDay(e) {
  const dayName = e.target.dataset.day;
  const day = program.find((d) => d.day === dayName);
  if (!day) return;
  day.items.forEach((it) => { it.done = e.target.checked; });
  renderWeekly();
  refreshDashboardFromWeek();
  db.setDayAllDone(day.items.map((i) => i.id), e.target.checked).catch((err) => showToast('تعذّر الحفظ: ' + err.message));
}

function onLogInput(field) {
  return (e) => {
    const id = Number(e.target.dataset.id);
    const item = findItem(id);
    if (!item) return;
    if (field === 'sets') item.thisWeekSets = e.target.value; else item.thisWeekReps = e.target.value;
    debouncedSaveLog(id, item);
  };
}
const logSaveTimers = {};
function debouncedSaveLog(id, item) {
  clearTimeout(logSaveTimers[id]);
  logSaveTimers[id] = setTimeout(() => {
    db.setItemLog(id, { sets: item.thisWeekSets, reps: item.thisWeekReps }).catch((err) => showToast('تعذّر حفظ التسجيل: ' + err.message));
  }, 500);
}

function onToggleAlt(e) {
  const altId = Number(e.target.dataset.altId);
  let target = null;
  for (const d of program) for (const it of d.items) { const a = (it.alternatives || []).find((x) => x.id === altId); if (a) target = a; }
  if (!target) return;
  target.active = !target.active;
  renderWeekly();
  db.setAlternativeActive(altId, target.active).catch((err) => showToast('تعذّر الحفظ: ' + err.message));
}

function onAltLogInput(field) {
  return (e) => {
    const altId = Number(e.target.dataset.altId);
    let target = null;
    for (const d of program) for (const it of d.items) { const a = (it.alternatives || []).find((x) => x.id === altId); if (a) target = a; }
    if (!target) return;
    if (field === 'sets') target.sets = e.target.value; else target.reps = e.target.value;
    debouncedSaveAltLog(altId, target);
  };
}
const altLogSaveTimers = {};
function debouncedSaveAltLog(altId, target) {
  clearTimeout(altLogSaveTimers[altId]);
  altLogSaveTimers[altId] = setTimeout(() => {
    db.setAlternativeLog(altId, { sets: target.sets, reps: target.reps }).catch((err) => showToast('تعذّر حفظ التسجيل: ' + err.message));
  }, 500);
}

async function onStartNewWeek() {
  const btn = document.getElementById('newWeekBtn');
  btn.disabled = true; btn.textContent = 'جارٍ الحفظ...';
  try {
    await db.startNewWeek();
    [program, accum] = await Promise.all([db.getProgram(), db.getAccum()]);
    renderWeekly();
    refreshDashboardFromWeek();
  } catch (err) {
    showToast('تعذّر بدء أسبوع جديد: ' + err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'ابدأ أسبوعًا جديدًا ↻';
  }
}

/* ======================= تبويب: حاسبة الإنجاز ======================= */
function renderCalculator(t) {
  const gaugesGrid = document.getElementById('gaugesGrid');
  const periods = [
    { label: 'يومي', val: t.day.pct, color: '#FF6B35', foot: `${t.day.done}/${t.day.total} مكتمل` },
    { label: 'أسبوعي', val: t.week.pct, color: '#0FD9C4', foot: `${t.week.done}/${t.week.goal} جلسة` },
    { label: 'شهري', val: t.month.pct, color: '#FFB84D', foot: `${t.month.done}/${t.month.goal} جلسة` },
    { label: 'سنوي', val: t.year.pct, color: '#7BE495', foot: `${t.year.done}/${t.year.goal} جلسة` },
  ];
  gaugesGrid.innerHTML = periods.map((p) => `<div class="gauge-card"><div class="g-title">الإنجاز ال${p.label}</div>${gaugeSVG(p.val, p.color, 148, p.label)}<div class="g-foot">${p.foot}</div></div>`).join('');

  const mb = byMuscle();
  document.getElementById('weeklyBreakdown').innerHTML = MUSCLES.map((m) => {
    const p = pct(mb[m].done, mb[m].goal);
    return `<div class="bd-row"><span class="bd-name">${m}</span><div class="bd-track"><div class="bd-fill" style="width:${p}%; background:#0FD9C4;"></div></div><span class="bd-pct">${p}%</span></div>`;
  }).join('');

  const tb = byType();
  document.getElementById('typeBreakdown').innerHTML = TYPES.map((ty) => {
    const p = pct(tb[ty].done, tb[ty].goal);
    return `<div class="bd-row"><span class="bd-name">${ty}</span><div class="bd-track"><div class="bd-fill" style="width:${p}%; background:${TYPE_COLOR_HEX[ty]};"></div></div><span class="bd-pct">${p}%</span></div>`;
  }).join('');
}

/* ======================= واجهات عامة (تابات، بحث، تنبيهات) ======================= */
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.page).classList.add('active');
    });
  });
}
function setupSearch() {
  document.getElementById('searchInput').addEventListener('input', (e) => { filters.search = e.target.value; renderTable(); });
}
function setDate() {
  try {
    const fmt = new Intl.DateTimeFormat('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('todayDate').textContent = fmt.format(new Date());
  } catch { document.getElementById('todayDate').textContent = 'لوحة تحكم تمارينك اليومية'; }
}

let toastTimer = null;
function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
}

function updateConnectionBanner(usingSupabase, error) {
  const chip = document.getElementById('connChip');
  if (!chip) return;
  if (usingSupabase) {
    chip.textContent = '● متصل بقاعدة البيانات';
    chip.className = 'conn-chip online';
  } else {
    chip.textContent = '● وضع محلي (بدون Supabase)';
    chip.className = 'conn-chip offline';
    chip.title = error ? String(error.message || error) : 'اضبطي js/config.js للاتصال بـ Supabase';
  }
}

/* ======================= الإقلاع ======================= */
async function boot() {
  setDate();
  setupTabs();
  setupSearch();

  const { usingSupabase, error } = await db.initDB();
  updateConnectionBanner(usingSupabase, error);

  try {
    [program, catalog, accum] = await Promise.all([db.getProgram(), db.getCatalog(), db.getAccum()]);
  } catch (err) {
    showToast('تعذّرت قراءة البيانات: ' + err.message);
    return;
  }

  renderFilters();
  const t = renderStatCards();
  if (chartsReady()) { try { initCharts(chartsPayload(t)); } catch (err) { console.warn(err); } }
  renderTable();
  renderCalculator(t);
  renderWeekly();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

boot();
