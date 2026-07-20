<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>لوحة أداء التمارين</title>
<meta name="description" content="لوحة تحكم تفاعلية لإدارة وقياس أداء تماريني اليومية والأسبوعية والشهرية والسنوية">

<!-- PWA -->
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0E1319">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="أداء التمارين">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="icons/icon-512.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=Tajawal:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js"></script>
</head>
<body>

<!-- شاشة تسجيل الدخول: لا يظهر التطبيق قبل وجود جلسة Supabase صالحة -->
<div class="auth-screen" id="authScreen" aria-hidden="false">
  <div class="auth-card">
    <img class="auth-logo" src="icons/icon-192.png" alt="" width="76" height="76">
    <div class="eyebrow">MCIT GYM</div>
    <h1>تسجيل الدخول</h1>
    <p>أدخل البريد وكلمة المرور الخاصة بحسابك في Supabase.</p>
    <form id="loginForm" class="auth-form">
      <label for="loginEmail">البريد الإلكتروني</label>
      <input id="loginEmail" name="email" type="email" autocomplete="username" required placeholder="name@example.com">
      <label for="loginPassword">كلمة المرور</label>
      <input id="loginPassword" name="password" type="password" autocomplete="current-password" required minlength="6" placeholder="••••••••">
      <button id="loginBtn" type="submit">دخول</button>
      <p class="auth-error" id="loginError" role="alert"></p>
    </form>
  </div>
</div>

<div class="app app-locked" id="mainApp">

  <header class="topbar">
    <div class="brand">
      <div class="brand-mark"><img src="icons/icon-192.png" alt="" width="42" height="42"></div>
      <div class="brand-text">
        <h1>لوحة أداء التمارين</h1>
        <p id="todayDate">—</p>
      </div>
    </div>

    <nav class="tabs" role="tablist">
      <button class="tab-btn active" data-page="overview"><span class="dot"></span>نظرة عامة</button>
      <button class="tab-btn" data-page="weekly">البرنامج الأسبوعي</button>
      <button class="tab-btn" data-page="table">جدول التمارين</button>
      <button class="tab-btn" data-page="calculator">حاسبة الإنجاز</button>
    </nav>

    <div class="header-right">
      <span class="conn-chip" id="connChip">● جارٍ الاتصال...</span>
      <div class="today-chip">
        <span class="val" id="chipDayPct">0%</span>
        <span class="lbl">إنجاز اليوم</span>
      </div>
      <button class="logout-btn" id="logoutBtn" type="button" title="تسجيل الخروج">خروج</button>
    </div>
  </header>

  <!-- ================= OVERVIEW ================= -->
  <section class="page active" id="overview">
    <div class="section-head">
      <div class="eyebrow">نظرة عامة</div>
      <h2>حالة أدائك الآن</h2>
      <p>ملخص حي لتقدمك اليومي والأسبوعي، مبني مباشرة من البرنامج الأسبوعي.</p>
    </div>

    <div class="stat-row" id="statRow"></div>

    <div class="charts-grid">
      <div class="card">
        <div class="card-head"><h3>اتجاه الأداء خلال ٧ أيام</h3><span>نسبة الإنجاز اليومي</span></div>
        <div class="chart-wrap"><canvas id="trendChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>توزيع أنواع التمارين</h3><span>هذا الأسبوع</span></div>
        <div class="chart-wrap"><canvas id="typeDonut"></canvas></div>
      </div>
    </div>

    <div class="charts-grid-2">
      <div class="card">
        <div class="card-head"><h3>نسبة الإنجاز حسب العضو</h3><span>أسبوعي</span></div>
        <div class="chart-wrap tall"><canvas id="muscleRadar"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>مقارنة الجلسات: مخطط مقابل منجز</h3><span>أسبوعي</span></div>
        <div class="chart-wrap tall"><canvas id="muscleBar"></canvas></div>
      </div>
    </div>
  </section>

  <!-- ================= WEEKLY PROGRAM ================= -->
  <section class="page" id="weekly">
    <div class="section-head">
      <div class="eyebrow">البرنامج الأسبوعي</div>
      <h2>خطتك ليوم بيوم</h2>
      <p>علّمي بـ✓ كل تمرين أنجزتيه، اختاري بديلًا وسجّلي ما نفذتيه له، أو علّمي اليوم كاملًا دفعة واحدة.</p>
    </div>
    <div class="week-summary" id="weekSummary"></div>
    <div class="days-grid" id="daysGrid"></div>
  </section>

  <!-- ================= TABLE (كتالوج مرجعي) ================= -->
  <section class="page" id="table">
    <div class="section-head">
      <div class="eyebrow">جدول التمارين</div>
      <h2>كتالوج مرجعي لكل التمارين</h2>
      <p>تصفّحي وابحثي حسب العضو أو نوع التمرين — بما فيها تمارين الإطالة (الستريتش). هذا الجدول للمرجع فقط، والتتبّع الفعلي من تبويب "البرنامج الأسبوعي".</p>
    </div>

    <div class="filters">
      <div class="filter-group" id="muscleFilters"></div>
      <div class="filter-group" id="typeFilters"></div>
      <div class="search-box"><span>🔍</span><input type="text" id="searchInput" placeholder="ابحث عن تمرين..."></div>
    </div>

    <div class="table-card">
      <table>
        <thead><tr><th>التمرين</th><th>العضو</th><th>النوع</th><th>الهدف الأسبوعي</th><th>أهداف أخرى</th></tr></thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  </section>

  <!-- ================= CALCULATOR ================= -->
  <section class="page" id="calculator">
    <div class="section-head">
      <div class="eyebrow">الحاسبة الذكية</div>
      <h2>نسبة الإنجاز الفعلي</h2>
      <p>تُحسب تلقائيًا من عدد التمارين المكتملة مقابل المستهدف — يوميًا، أسبوعيًا، شهريًا، وسنويًا.</p>
    </div>
    <div class="gauges-grid" id="gaugesGrid"></div>
    <div class="charts-grid-2">
      <div class="breakdown-card"><h3>تفصيل الإنجاز الأسبوعي حسب العضو</h3><div id="weeklyBreakdown"></div></div>
      <div class="breakdown-card"><h3>تفصيل الإنجاز حسب نوع التمرين</h3><div id="typeBreakdown"></div></div>
    </div>
  </section>

  <p class="footer-note">تطبيق ويب تقدّمي (PWA) — قابل للتثبيت على جهازك ويعمل دون اتصال. البيانات تُحفظ في Supabase عند ضبط الاتصال أعلى ملف app.js، وإلا تعمل اللوحة محليًا خلال الجلسة الحالية.</p>
</div>

<script src="app.js"></script>
</body>
</html>
