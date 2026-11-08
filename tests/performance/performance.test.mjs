// Performance & Latency Benchmark Test Suite
import assert from 'assert';

const API_BASE = 'http://127.0.0.1:5000/api';

async function timedFetch(url, options = {}) {
  const start = performance.now();
  const res = await fetch(url, options);
  await res.text();
  const duration = performance.now() - start;
  return { status: res.status, duration };
}

export async function runPerformanceTests() {
  console.log('\n--- [TEST SUITE: PERFORMANCE & CONCURRENCY BENCHMARKS] ---');
  let passed = 0;
  let failed = 0;

  function test(condition, desc) {
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Sequential API Latency Benchmark (50 requests)
  const durations = [];
  const TOTAL_REQ = 50;
  for (let i = 0; i < TOTAL_REQ; i++) {
    const { status, duration } = await timedFetch(`${API_BASE}/products`);
    if (status === 200) durations.push(duration);
  }

  durations.sort((a, b) => a - b);
  const avgDuration = durations.reduce((acc, d) => acc + d, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.50)];
  const p95 = durations[Math.floor(durations.length * 0.95)];

  test(durations.length === TOTAL_REQ, `Completed ${TOTAL_REQ}/${TOTAL_REQ} sequential requests without error`);
  test(avgDuration < 80, `Average response latency is ${avgDuration.toFixed(2)}ms (Target: < 80ms)`);
  test(p95 < 150, `95th Percentile (P95) latency is ${p95.toFixed(2)}ms (P50: ${p50.toFixed(2)}ms)`);

  // 2. High-Concurrency Burst Test (25 parallel requests)
  const PARALLEL_BURST = 25;
  const burstStart = performance.now();
  const burstPromises = Array.from({ length: PARALLEL_BURST }, (_, idx) => 
    idx % 2 === 0 
      ? timedFetch(`${API_BASE}/recommendations?limit=4`) 
      : timedFetch(`${API_BASE}/campaigns`)
  );

  const burstResults = await Promise.all(burstPromises);
  const burstTotalTime = performance.now() - burstStart;
  const allSucceeded = burstResults.every(r => r.status === 200);

  test(allSucceeded, `Handled ${PARALLEL_BURST} concurrent burst requests with 100% success (0 dropped requests)`);
  test(burstTotalTime < 800, `Total parallel burst completed in ${burstTotalTime.toFixed(2)}ms (< 800ms)`);

  console.log(`Performance Benchmark Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed, metrics: { avgDuration, p50, p95, burstTotalTime } };
}

if (process.argv[1]?.endsWith('performance.test.mjs')) {
  runPerformanceTests().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
