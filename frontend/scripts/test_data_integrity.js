/**
 * test_data_integrity.js
 * Asserts frontend data integrity across benchmark-data.json:
 * 1. Relative band power sums to 100% (+-0.1%)
 * 2. Deviation matches ((current - ref) / ref) * 100
 * 3. Beta/Alpha ratio matches table values
 * 4. Cross-component consistency
 */

const fs = require('fs');
const path = require('path');

const benchmarkPath = path.join(__dirname, '..', 'lib', 'benchmark-data.json');
const data = JSON.parse(fs.readFileSync(benchmarkPath, 'utf8'));

console.log('Running NeuroSense Data Integrity Suite...');
let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  passed++;
}

for (const [caseId, p] of Object.entries(data.predictions)) {
  const bands = p.numerical_band_powers;
  
  // 1. Check relative band power sums to 100%
  const relSum = parseFloat(bands.reduce((sum, b) => sum + b.rel_power_percent, 0).toFixed(1));
  assert(
    relSum >= 99.9 && relSum <= 100.1,
    `[${caseId}] Relative power sum (${relSum}%) must equal 100% +- 0.1%`
  );

  // 2. Check Beta/Alpha ratio
  const betaBand = bands.find(b => b.band === 'Beta');
  const alphaBand = bands.find(b => b.band === 'Alpha');
  const expectedRatio = parseFloat((betaBand.abs_power_uv2 / alphaBand.abs_power_uv2).toFixed(2));
  const statedRatio = p.stress_metrics.beta_alpha_ratio;
  assert(
    Math.abs(statedRatio - expectedRatio) <= 0.01,
    `[${caseId}] Stated ratio (${statedRatio}) must equal table Beta/Alpha (${expectedRatio})`
  );

  // 3. Check Deviation Formula
  for (const bc of p.baseline_comparison) {
    const cur = bc.current_session_rel_percent;
    const ref = bc.resting_baseline_rel_percent;
    const statedDev = bc.deviation_percent;
    const expectedDev = parseFloat((((cur - ref) / ref) * 100).toFixed(1));
    assert(
      Math.abs(statedDev - expectedDev) <= 0.1,
      `[${caseId}] Band ${bc.band}: stated deviation (${statedDev}%) must match ((cur - ref) / ref) (${expectedDev}%)`
    );
  }

  // 4. Check Single Source of Truth
  const bandMap = Object.fromEntries(bands.map(b => [b.band, b.rel_power_percent]));
  for (const bc of p.baseline_comparison) {
    assert(
      bc.current_session_rel_percent === bandMap[bc.band],
      `[${caseId}] Band ${bc.band}: baseline current (${bc.current_session_rel_percent}) must match numerical (${bandMap[bc.band]})`
    );
  }
}

// 5. Test Trend Sequence Logic & Disclosures
const trendLogicPath = path.join(__dirname, '..', 'lib', 'trend-logic.ts');
const trendLogicContent = fs.readFileSync(trendLogicPath, 'utf8');

// Assert no forbidden time fields
const forbiddenFields = ['time_to_event', 'countdown', 'time_remaining', 'predicted_minutes', 'time_estimate'];
for (const field of forbiddenFields) {
  assert(!trendLogicContent.includes(`${field}:`), `Forbidden time field ${field} found in trend-logic.ts`);
}

// Assert no forbidden phrases
const forbiddenPhrases = ['panic', 'before it happens', 'in 5 minutes', 'in 10 minutes', 'detects symptoms of anxiety'];
for (const phrase of forbiddenPhrases) {
  assert(!trendLogicContent.toLowerCase().includes(phrase), `Forbidden phrase '${phrase}' found in trend-logic.ts`);
}

// Check TrendTrajectoryPanel.tsx for language guardrails
const panelPath = path.join(__dirname, '..', 'components', 'TrendTrajectoryPanel.tsx');
const panelContent = fs.readFileSync(panelPath, 'utf8');
for (const phrase of forbiddenPhrases) {
  assert(!panelContent.toLowerCase().includes(phrase), `Forbidden phrase '${phrase}' found in TrendTrajectoryPanel.tsx`);
}

console.log(`✅ All ${passed}/${total} data-integrity and trend-logic assertions passed!`);
