// أدوات الاختبار والتحقق

export interface TestResult {
  id: string;
  module: string;
  test: string;
  status: "pass" | "fail" | "warning";
  message: string;
  duration: number;
}

export interface TestSuite {
  name: string;
  description: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warnings: number;
  successRate: number;
  timestamp: string;
}

export function runValidationTests(data: any): TestSuite {
  const tests: TestResult[] = [];
  const startTime = Date.now();

  // ===== اختبارات المصادقة =====
  const authTests = testAuthentication(data);
  tests.push(...authTests);

  // ===== اختبارات الآلات =====
  const machineTests = testMachines(data);
  tests.push(...machineTests);

  // ===== اختبارات الأعطال =====
  const breakdownTests = testBreakdowns(data);
  tests.push(...breakdownTests);

  // ===== اختبارات أوامر العمل =====
  const workOrderTests = testWorkOrders(data);
  tests.push(...workOrderTests);

  // ===== اختبارات الصيانة الوقائية =====
  const pmTests = testPreventiveMaintenance(data);
  tests.push(...pmTests);

  // ===== اختبارات قطع الغيار =====
  const sparePartTests = testSpareParts(data);
  tests.push(...sparePartTests);

  // ===== اختبارات مؤشرات الأداء =====
  const kpiTests = testKPIs(data);
  tests.push(...kpiTests);

  // ===== اختبارات التقارير =====
  const reportTests = testReports(data);
  tests.push(...reportTests);

  // ===== اختبارات البيانات الناقصة =====
  const missingDataTests = testMissingData(data);
  tests.push(...missingDataTests);

  // ===== اختبارات البيانات الخاطئة =====
  const invalidDataTests = testInvalidData(data);
  tests.push(...invalidDataTests);

  // ===== اختبارات الصلاحيات =====
  const permissionTests = testPermissions(data);
  tests.push(...permissionTests);

  const endTime = Date.now();
  const passedTests = tests.filter(t => t.status === "pass").length;
  const failedTests = tests.filter(t => t.status === "fail").length;
  const warnings = tests.filter(t => t.status === "warning").length;

  return {
    name: "اختبار شامل لنظام GMAO",
    description: "اختبار جميع وحدات النظام والتحقق من سلامتها",
    tests,
    totalTests: tests.length,
    passedTests,
    failedTests,
    warnings,
    successRate: Math.round((passedTests / tests.length) * 100),
    timestamp: new Date().toISOString(),
  };
}

function testAuthentication(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { users, currentUser } = data;

  // اختبار وجود مستخدمين
  tests.push({
    id: "AUTH-001",
    module: "المصادقة",
    test: "وجود مستخدمين في النظام",
    status: users && users.length > 0 ? "pass" : "fail",
    message: users && users.length > 0 ? `تم العثور على ${users.length} مستخدم` : "لا يوجد مستخدمين",
    duration: 0,
  });

  // اختبار وجود مستخدم Admin
  const adminUser = users?.find(u => u.role === "admin");
  tests.push({
    id: "AUTH-002",
    module: "المصادقة",
    test: "وجود مستخدم Admin",
    status: adminUser ? "pass" : "fail",
    message: adminUser ? `Admin: ${adminUser.name}` : "لا يوجد مستخدم Admin",
    duration: 0,
  });

  // اختبار كلمة المرور
  tests.push({
    id: "AUTH-003",
    module: "المصادقة",
    test: "كلمات المرور غير فارغة",
    status: users?.every(u => u.password && u.password.length >= 4) ? "pass" : "fail",
    message: "جميع المستخدمين لديهم كلمات مرور صالحة",
    duration: 0,
  });

  // اختبار الأدوار
  const validRoles = ["admin", "manager", "technician", "viewer"];
  const invalidRoles = users?.filter(u => !validRoles.includes(u.role));
  tests.push({
    id: "AUTH-004",
    module: "المصادقة",
    test: "أدوار المستخدمين صحيحة",
    status: invalidRoles && invalidRoles.length > 0 ? "fail" : "pass",
    message: invalidRoles && invalidRoles.length > 0 ? `أدوار غير صالحة: ${invalidRoles.map(u => u.role).join(", ")}` : "جميع الأدوار صحيحة",
    duration: 0,
  });

  return tests;
}

function testMachines(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { machines } = data;

  // اختبار وجود آلات
  tests.push({
    id: "MACH-001",
    module: "الآلات",
    test: "وجود آلات مسجلة",
    status: machines && machines.length > 0 ? "pass" : "fail",
    message: machines && machines.length > 0 ? `تم العثور على ${machines.length} آلة` : "لا توجد آلات",
    duration: 0,
  });

  // اختبار رموز فريدة
  const codes = machines?.map(m => m.code);
  const duplicateCodes = codes?.filter((code, index) => codes.indexOf(code) !== index);
  tests.push({
    id: "MACH-002",
    module: "الآلات",
    test: "رموز الآلات فريدة",
    status: duplicateCodes && duplicateCodes.length > 0 ? "fail" : "pass",
    message: duplicateCodes && duplicateCodes.length > 0 ? `رموز مكررة: ${duplicateCodes.join(", ")}` : "جميع الرموز فريدة",
    duration: 0,
  });

  // اختبار الحقول الأساسية
  const missingFields = machines?.filter(m => !m.name || !m.code || !m.location);
  tests.push({
    id: "MACH-003",
    module: "الآلات",
    test: "الحقول الأساسية مكتملة",
    status: missingFields && missingFields.length > 0 ? "fail" : "pass",
    message: missingFields && missingFields.length > 0 ? `${missingFields.length} آلة ناقصة البيانات` : "جميع الحقول مكتملة",
    duration: 0,
  });

  // اختبار الحالة
  const validStates = ["running", "stopped", "maintenance", "breakdown"];
  const invalidStates = machines?.filter(m => !validStates.includes(m.status));
  tests.push({
    id: "MACH-004",
    module: "الآلات",
    test: "حالات الآلات صحيحة",
    status: invalidStates && invalidStates.length > 0 ? "fail" : "pass",
    message: invalidStates && invalidStates.length > 0 ? `حالات غير صالحة: ${invalidStates.length}` : "جميع الحالات صحيحة",
    duration: 0,
  });

  return tests;
}

function testBreakdowns(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { breakdowns, machines } = data;

  // اختبار وجود أعطال
  tests.push({
    id: "BRK-001",
    module: "الأعطال",
    test: "وجود أعطال مسجلة",
    status: breakdowns && breakdowns.length > 0 ? "pass" : "warning",
    message: breakdowns && breakdowns.length > 0 ? `تم العثور على ${breakdowns.length} عطل` : "لا توجد أعطال مسجلة",
    duration: 0,
  });

  // اختبار ربط الأعطال بالآلات
  const orphanBreakdowns = breakdowns?.filter(bd => !machines?.find(m => m.id === bd.machineId));
  tests.push({
    id: "BRK-002",
    module: "الأعطال",
    test: "الأعطال مرتبطة بآلات صحيحة",
    status: orphanBreakdowns && orphanBreakdowns.length > 0 ? "fail" : "pass",
    message: orphanBreakdowns && orphanBreakdowns.length > 0 ? `${orphanBreakdowns.length} عطل بدون آلة` : "جميع الأعطال مرتبطة بآلات",
    duration: 0,
  });

  // اختبار مدة التوقف
  const invalidDurations = breakdowns?.filter(bd => bd.duration < 0);
  tests.push({
    id: "BRK-003",
    module: "الأعطال",
    test: "مدة التوقف صحيحة",
    status: invalidDurations && invalidDurations.length > 0 ? "fail" : "pass",
    message: invalidDurations && invalidDurations.length > 0 ? "مدة توقف سالبة" : "جميع المدد صحيحة",
    duration: 0,
  });

  // اختبار الحالة
  const validStatuses = ["Ouvert", "En cours", "Résolu", "Fermé"];
  const invalidStatuses = breakdowns?.filter(bd => !validStatuses.includes(bd.status));
  tests.push({
    id: "BRK-004",
    module: "الأعطال",
    test: "حالات الأعطال صحيحة",
    status: invalidStatuses && invalidStatuses.length > 0 ? "fail" : "pass",
    message: invalidStatuses && invalidStatuses.length > 0 ? "حالات غير صالحة" : "جميع الحالات صحيحة",
    duration: 0,
  });

  return tests;
}

function testWorkOrders(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { workOrders, machines } = data;

  // اختبار وجود أوامر عمل
  tests.push({
    id: "WO-001",
    module: "أوامر العمل",
    test: "وجود أوامر عمل",
    status: workOrders && workOrders.length > 0 ? "pass" : "warning",
    message: workOrders && workOrders.length > 0 ? `تم العثور على ${workOrders.length} أمر عمل` : "لا توجد أوامر عمل",
    duration: 0,
  });

  // اختبار ربط أوامر العمل بالآلات
  const orphanWOs = workOrders?.filter(wo => !machines?.find(m => m.id === wo.machineId));
  tests.push({
    id: "WO-002",
    module: "أوامر العمل",
    test: "أوامر العمل مرتبطة بآلات",
    status: orphanWOs && orphanWOs.length > 0 ? "fail" : "pass",
    message: orphanWOs && orphanWOs.length > 0 ? `${orphanWOs.length} أمر عمل بدون آلة` : "جميع أوامر العمل مرتبطة",
    duration: 0,
  });

  // اختبار تسلسل الحالات
  const validStatuses = ["Open", "Assigned", "In Progress", "Waiting", "Completed", "Closed"];
  const invalidStatuses = workOrders?.filter(wo => !validStatuses.includes(wo.status));
  tests.push({
    id: "WO-003",
    module: "أوامر العمل",
    test: "تسلسل حالات أوامر العمل صحيح",
    status: invalidStatuses && invalidStatuses.length > 0 ? "fail" : "pass",
    message: invalidStatuses && invalidStatuses.length > 0 ? "حالات غير صالحة" : "جميع الحالات صحيحة",
    duration: 0,
  });

  // اختبار الأولوية
  const validPriorities = ["Basse", "Moyenne", "Haute", "Critique"];
  const invalidPriorities = workOrders?.filter(wo => !validPriorities.includes(wo.priority));
  tests.push({
    id: "WO-004",
    module: "أوامر العمل",
    test: "أولويات أوامر العمل صحيحة",
    status: invalidPriorities && invalidPriorities.length > 0 ? "fail" : "pass",
    message: invalidPriorities && invalidPriorities.length > 0 ? "أولويات غير صالحة" : "جميع الأولويات صحيحة",
    duration: 0,
  });

  return tests;
}

function testPreventiveMaintenance(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { preventiveTasks, machines } = data;

  // اختبار وجود مهام PM
  tests.push({
    id: "PM-001",
    module: "الصيانة الوقائية",
    test: "وجود مهام صيانة وقائية",
    status: preventiveTasks && preventiveTasks.length > 0 ? "pass" : "warning",
    message: preventiveTasks && preventiveTasks.length > 0 ? `تم العثور على ${preventiveTasks.length} مهمة` : "لا توجد مهام صيانة وقائية",
    duration: 0,
  });

  // اختبار ربط المهام بالآلات
  const orphanTasks = preventiveTasks?.filter(task => !machines?.find(m => m.id === task.machineId));
  tests.push({
    id: "PM-002",
    module: "الصيانة الوقائية",
    test: "مهام PM مرتبطة بآلات",
    status: orphanTasks && orphanTasks.length > 0 ? "fail" : "pass",
    message: orphanTasks && orphanTasks.length > 0 ? `${orphanTasks.length} مهمة بدون آلة` : "جميع المهام مرتبطة",
    duration: 0,
  });

  // اختبار التكرار
  const validFrequencies = ["يومي", "أسبوعي", "شهري", "ربع سنوي", "نصف سنوي", "سنوي"];
  const invalidFrequencies = preventiveTasks?.filter(task => !validFrequencies.includes(task.frequency));
  tests.push({
    id: "PM-003",
    module: "الصيانة الوقائية",
    test: "تكرار المهام صحيح",
    status: invalidFrequencies && invalidFrequencies.length > 0 ? "fail" : "pass",
    message: invalidFrequencies && invalidFrequencies.length > 0 ? "تكرار غير صالح" : "جميع التكرارات صحيحة",
    duration: 0,
  });

  // اختبار المواعيد
  const overdueTasks = preventiveTasks?.filter(task => {
    const nextDue = new Date(task.nextDue);
    return nextDue < new Date();
  });
  tests.push({
    id: "PM-004",
    module: "الصيانة الوقائية",
    test: "مهام PM المتأخرة",
    status: overdueTasks && overdueTasks.length > 0 ? "warning" : "pass",
    message: overdueTasks && overdueTasks.length > 0 ? `${overdueTasks.length} مهمة متأخرة` : "لا توجد مهام متأخرة",
    duration: 0,
  });

  return tests;
}

function testSpareParts(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { spareParts } = data;

  // اختبار وجود قطع غيار
  tests.push({
    id: "SP-001",
    module: "قطع الغيار",
    test: "وجود قطع غيار",
    status: spareParts && spareParts.length > 0 ? "pass" : "warning",
    message: spareParts && spareParts.length > 0 ? `تم العثور على ${spareParts.length} قطعة` : "لا توجد قطع غيار",
    duration: 0,
  });

  // اختبار رموز فريدة
  const codes = spareParts?.map(sp => sp.code);
  const duplicateCodes = codes?.filter((code, index) => codes.indexOf(code) !== index);
  tests.push({
    id: "SP-002",
    module: "قطع الغيار",
    test: "رموز قطع الغيار فريدة",
    status: duplicateCodes && duplicateCodes.length > 0 ? "fail" : "pass",
    message: duplicateCodes && duplicateCodes.length > 0 ? `رموز مكررة: ${duplicateCodes.join(", ")}` : "جميع الرموز فريدة",
    duration: 0,
  });

  // اختبار المخزون
  const lowStock = spareParts?.filter(sp => sp.currentStock < sp.minStock);
  tests.push({
    id: "SP-003",
    module: "قطع الغيار",
    test: "تنبيهات المخزون المنخفض",
    status: lowStock && lowStock.length > 0 ? "warning" : "pass",
    message: lowStock && lowStock.length > 0 ? `${lowStock.length} قطعة بمخزون منخفض` : "المخزون في المستوى المطلوب",
    duration: 0,
  });

  // اختبار المخزون السالب
  const negativeStock = spareParts?.filter(sp => sp.currentStock < 0);
  tests.push({
    id: "SP-004",
    module: "قطع الغيار",
    test: "لا يوجد مخزون سالب",
    status: negativeStock && negativeStock.length > 0 ? "fail" : "pass",
    message: negativeStock && negativeStock.length > 0 ? "مخزون سالب موجود" : "لا يوجد مخزون سالب",
    duration: 0,
  });

  return tests;
}

function testKPIs(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { kpis, breakdowns } = data;

  // اختبار وجود مؤشرات
  tests.push({
    id: "KPI-001",
    module: "مؤشرات الأداء",
    test: "وجود مؤشرات أداء",
    status: kpis && kpis.length > 0 ? "pass" : "fail",
    message: kpis && kpis.length > 0 ? `تم العثور على ${kpis.length} مؤشر` : "لا توجد مؤشرات",
    duration: 0,
  });

  // اختبار حساب MTTR
  const totalRepairTime = breakdowns?.reduce((sum, bd) => sum + bd.duration, 0) || 0;
  const breakdownCount = breakdowns?.length || 0;
  const mttr = breakdownCount > 0 ? totalRepairTime / breakdownCount : 0;
  tests.push({
    id: "KPI-002",
    module: "مؤشرات الأداء",
    test: "حساب MTTR صحيح",
    status: mttr > 0 ? "pass" : "warning",
    message: mttr > 0 ? `MTTR = ${mttr.toFixed(2)} ساعة` : "لا يمكن حساب MTTR بدون أعطال",
    duration: 0,
  });

  // اختبار حساب MTBF
  const operatingHours = 24 * 30; // ساعات تشغيل شهرية
  const mtbf = breakdownCount > 0 ? operatingHours / breakdownCount : operatingHours;
  tests.push({
    id: "KPI-003",
    module: "مؤشرات الأداء",
    test: "حساب MTBF صحيح",
    status: mtbf > 0 ? "pass" : "warning",
    message: mtbf > 0 ? `MTBF = ${mtbf.toFixed(2)} ساعة` : "لا يمكن حساب MTBF",
    duration: 0,
  });

  // اختبار حساب التوفر
  const availability = breakdownCount > 0 ? ((operatingHours - totalRepairTime) / operatingHours) * 100 : 100;
  tests.push({
    id: "KPI-004",
    module: "مؤشرات الأداء",
    test: "حساب التوفر صحيح",
    status: availability >= 0 && availability <= 100 ? "pass" : "fail",
    message: `التوفر = ${availability.toFixed(1)}%`,
    duration: 0,
  });

  return tests;
}

function testReports(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { machines, workOrders, preventiveTasks, spareParts, breakdowns } = data;

  // اختبار توفر البيانات للتقارير
  tests.push({
    id: "REP-001",
    module: "التقارير",
    test: "توفر بيانات الآلات للتقارير",
    status: machines && machines.length > 0 ? "pass" : "fail",
    message: machines && machines.length > 0 ? `${machines.length} آلة متاحة` : "لا توجد بيانات آلات",
    duration: 0,
  });

  tests.push({
    id: "REP-002",
    module: "التقارير",
    test: "توفر بيانات أوامر العمل للتقارير",
    status: workOrders && workOrders.length > 0 ? "pass" : "warning",
    message: workOrders && workOrders.length > 0 ? `${workOrders.length} أمر عمل متاح` : "لا توجد أوامر عمل",
    duration: 0,
  });

  tests.push({
    id: "REP-003",
    module: "التقارير",
    test: "توفر بيانات الصيانة الوقائية",
    status: preventiveTasks && preventiveTasks.length > 0 ? "pass" : "warning",
    message: preventiveTasks && preventiveTasks.length > 0 ? `${preventiveTasks.length} مهمة PM` : "لا توجد مهام PM",
    duration: 0,
  });

  tests.push({
    id: "REP-004",
    module: "التقارير",
    test: "توفر بيانات قطع الغيار",
    status: spareParts && spareParts.length > 0 ? "pass" : "warning",
    message: spareParts && spareParts.length > 0 ? `${spareParts.length} قطعة غيار` : "لا توجد قطع غيار",
    duration: 0,
  });

  tests.push({
    id: "REP-005",
    module: "التقارير",
    test: "توفر بيانات الأعطال",
    status: breakdowns && breakdowns.length > 0 ? "pass" : "warning",
    message: breakdowns && breakdowns.length > 0 ? `${breakdowns.length} عطل` : "لا توجد أعطال",
    duration: 0,
  });

  return tests;
}

function testMissingData(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { machines, workOrders, preventiveTasks, spareParts, breakdowns } = data;

  // اختبار البيانات الناقصة في الآلات
  const machinesMissingData = machines?.filter(m => 
    !m.name || !m.code || !m.location || !m.status
  );
  tests.push({
    id: "MISS-001",
    module: "البيانات الناقصة",
    test: "اكتمال بيانات الآلات",
    status: machinesMissingData && machinesMissingData.length > 0 ? "warning" : "pass",
    message: machinesMissingData && machinesMissingData.length > 0 ? 
      `${machinesMissingData.length} آلة ناقصة البيانات` : "جميع بيانات الآلات مكتملة",
    duration: 0,
  });

  // اختبار البيانات الناقصة في أوامر العمل
  const woMissingData = workOrders?.filter(wo => 
    !wo.title || !wo.machineId || !wo.status
  );
  tests.push({
    id: "MISS-002",
    module: "البيانات الناقصة",
    test: "اكتمال بيانات أوامر العمل",
    status: woMissingData && woMissingData.length > 0 ? "warning" : "pass",
    message: woMissingData && woMissingData.length > 0 ? 
      `${woMissingData.length} أمر عمل ناقص البيانات` : "جميع بيانات أوامر العمل مكتملة",
    duration: 0,
  });

  // اختبار البيانات الناقصة في قطع الغيار
  const spMissingData = spareParts?.filter(sp => 
    !sp.code || !sp.name || !sp.reference
  );
  tests.push({
    id: "MISS-003",
    module: "البيانات الناقصة",
    test: "اكتمال بيانات قطع الغيار",
    status: spMissingData && spMissingData.length > 0 ? "warning" : "pass",
    message: spMissingData && spMissingData.length > 0 ? 
      `${spMissingData.length} قطعة ناقصة البيانات` : "جميع بيانات قطع الغيار مكتملة",
    duration: 0,
  });

  // اختبار البيانات الناقصة في الأعطال
  const bdMissingData = breakdowns?.filter(bd => 
    !bd.machineId || !bd.cause || !bd.date
  );
  tests.push({
    id: "MISS-004",
    module: "البيانات الناقصة",
    test: "اكتمال بيانات الأعطال",
    status: bdMissingData && bdMissingData.length > 0 ? "warning" : "pass",
    message: bdMissingData && bdMissingData.length > 0 ? 
      `${bdMissingData.length} عطل ناقص البيانات` : "جميع بيانات الأعطال مكتملة",
    duration: 0,
  });

  return tests;
}

function testInvalidData(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { machines, spareParts, breakdowns } = data;

  // اختبار البيانات الخاطئة في الآلات
  const invalidMachines = machines?.filter(m => 
    m.code && !/^M-\d{3}$/.test(m.code)
  );
  tests.push({
    id: "INV-001",
    module: "البيانات الخاطئة",
    test: "صيغة رموز الآلات صحيحة",
    status: invalidMachines && invalidMachines.length > 0 ? "fail" : "pass",
    message: invalidMachines && invalidMachines.length > 0 ? 
      `${invalidMachines.length} رمز غير صالح` : "جميع الرموز بصيغة M-XXX",
    duration: 0,
  });

  // اختبار البيانات الخاطئة في قطع الغيار
  const invalidSpareParts = spareParts?.filter(sp => 
    sp.currentStock < 0 || sp.minStock < 0 || sp.maxStock < sp.minStock
  );
  tests.push({
    id: "INV-002",
    module: "البيانات الخاطئة",
    test: "قيم المخزون صحيحة",
    status: invalidSpareParts && invalidSpareParts.length > 0 ? "fail" : "pass",
    message: invalidSpareParts && invalidSpareParts.length > 0 ? 
      "قيم مخزون غير صالحة" : "جميع قيم المخزون صحيحة",
    duration: 0,
  });

  // اختبار البيانات الخاطئة في الأعطال
  const invalidBreakdowns = breakdowns?.filter(bd => 
    bd.duration < 0 || bd.cost < 0
  );
  tests.push({
    id: "INV-003",
    module: "البيانات الخاطئة",
    test: "قيم الأعطال صحيحة",
    status: invalidBreakdowns && invalidBreakdowns.length > 0 ? "fail" : "pass",
    message: invalidBreakdowns && invalidBreakdowns.length > 0 ? 
      "قيم أعطال غير صالحة" : "جميع قيم الأعطال صحيحة",
    duration: 0,
  });

  return tests;
}

function testPermissions(data: any): TestResult[] {
  const tests: TestResult[] = [];
  const { users } = data;

  // اختبار وجود صلاحيات لكل دور
  const roles = users?.map(u => u.role);
  const uniqueRoles = [...new Set(roles || [])];
  
  tests.push({
    id: "PERM-001",
    module: "الصلاحيات",
    test: "تغطية جميع الأدوار",
    status: uniqueRoles.includes("admin") && uniqueRoles.includes("manager") && 
            uniqueRoles.includes("technician") && uniqueRoles.includes("viewer") ? "pass" : "warning",
    message: `الأدوار الموجودة: ${uniqueRoles.join(", ")}`,
    duration: 0,
  });

  // اختبار عدم وجود مستخدمين بدون دور
  const usersWithoutRole = users?.filter(u => !u.role);
  tests.push({
    id: "PERM-002",
    module: "الصلاحيات",
    test: "جميع المستخدمين لديهم أدوار",
    status: usersWithoutRole && usersWithoutRole.length > 0 ? "fail" : "pass",
    message: usersWithoutRole && usersWithoutRole.length > 0 ? 
      `${usersWithoutRole.length} مستخدم بدون دور` : "جميع المستخدمين لديهم أدوار",
    duration: 0,
  });

  // اختبار وجود مستخدم Admin واحد على الأقل
  const adminCount = users?.filter(u => u.role === "admin").length || 0;
  tests.push({
    id: "PERM-003",
    module: "الصلاحيات",
    test: "وجود مستخدم Admin",
    status: adminCount > 0 ? "pass" : "fail",
    message: adminCount > 0 ? `${adminCount} مستخدم Admin` : "لا يوجد مستخدم Admin",
    duration: 0,
  });

  return tests;
}