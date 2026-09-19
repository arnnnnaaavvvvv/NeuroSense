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

  // 4. Single source of truth consistency
  for (const bc of p.baseline_comparison) {
    const matchingBand = bands.find(b => b.band === bc.band);
    assert(
      matchingBand && matchingBand.rel_power_percent === bc.current_session_rel_percent,
      `[${caseId}] Band ${bc.band}: baseline_comparison current must equal numerical_band_powers`
    );
  }
}

console.log(`✅ All ${passed}/${total} data-integrity assertions passed!`);
