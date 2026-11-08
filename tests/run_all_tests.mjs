// Master Automated QA Suite Runner for BeadsSource Enterprise Application
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

import { runCalculationTests } from './unit/calculations.test.mjs';
import { runApiTests } from './api/api.test.mjs';
import { runRfqToOrderTest } from './integration/rfq_to_order.test.mjs';
import { runCartCheckoutTest } from './integration/cart_checkout.test.mjs';
import { runSecurityTests } from './security/security.test.mjs';
import { runPerformanceTests } from './performance/performance.test.mjs';
import { runResponsiveTests } from './responsive/viewport_matrix.test.mjs';

async function main() {
  console.log('===============================================================');
  console.log('   BEADSSOURCE ENTERPRISE B2B PLATFORM - MASTER QA SUITE');
  console.log('===============================================================');

  // Snapshot database JSON files to prevent test mutation
  const dataDir = path.join(process.cwd(), 'server', 'data');
  const dbBackups = {};
  if (fs.existsSync(dataDir)) {
    fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).forEach(f => {
      dbBackups[f] = fs.readFileSync(path.join(dataDir, f), 'utf-8');
    });
  }

  // Spawn isolated test backend server
  console.log('[SPAWN] Initializing backend test instance on http://127.0.0.1:5000...');
  const serverProc = spawn('node', ['server/index.js'], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: '5000' }
  });

  serverProc.stdout?.on('data', d => {
    const msg = d.toString().trim();
    if (msg.includes('running on')) console.log(`[SERVER READY] ${msg}`);
  });

  serverProc.stderr?.on('data', d => console.error(`[SERVER LOG] ${d.toString().trim()}`));

  // Wait 4 seconds for server socket readiness
  await new Promise(r => setTimeout(r, 4000));

  let totalPassed = 0;
  let totalFailed = 0;
  const suiteResults = [];

  try {
    // 0. Unit Calculations
    const unitRes = runCalculationTests();
    totalPassed += unitRes.passed;
    totalFailed += unitRes.failed;
    suiteResults.push({ name: 'Unit Calculations & Wholesale Pricing', ...unitRes });

    // 1. API Verification
    const apiRes = await runApiTests();
    totalPassed += apiRes.passed;
    totalFailed += apiRes.failed;
    suiteResults.push({ name: 'REST API & Contract Verification', ...apiRes });

    // 2. RFQ-to-Order Workflow Integration
    const rfqRes = await runRfqToOrderTest();
    totalPassed += rfqRes.passed;
    totalFailed += rfqRes.failed;
    suiteResults.push({ name: 'Wholesale RFQ-to-Order Lifecycle', ...rfqRes });

    // 3. Cart & Checkout Workflow Integration
    const cartRes = await runCartCheckoutTest();
    totalPassed += cartRes.passed;
    totalFailed += cartRes.failed;
    suiteResults.push({ name: 'Cart, Tier Pricing & Checkout', ...cartRes });

    // 4. Security & OWASP Verification
    const secRes = await runSecurityTests();
    totalPassed += secRes.passed;
    totalFailed += secRes.failed;
    suiteResults.push({ name: 'OWASP Security & RBAC Isolation', ...secRes });

    // 5. Performance & Concurrency Load Test
    const perfRes = await runPerformanceTests();
    totalPassed += perfRes.passed;
    totalFailed += perfRes.failed;
    suiteResults.push({ name: 'Latency Benchmark & Burst Concurrency', ...perfRes });

    // 6. Responsive Viewport Matrix Audit
    const respRes = await runResponsiveTests();
    totalPassed += respRes.passed;
    totalFailed += respRes.failed;
    suiteResults.push({ name: 'Responsive 5-Viewport Matrix Audit', ...respRes });

    console.log('===============================================================');
    console.log('                 ENTERPRISE QA AUDIT SUMMARY');
    console.log('===============================================================');
    suiteResults.forEach(s => {
      const statusIcon = s.failed === 0 ? '✓ PASS' : '✗ FAIL';
      console.log(`[${statusIcon}] ${s.name}: ${s.passed} Passed, ${s.failed} Failed`);
    });
    console.log('---------------------------------------------------------------');
    console.log(`TOTAL AUDIT METRICS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
    console.log(`RELEASE VERDICT: ${totalFailed === 0 ? '✓ PRODUCTION RELEASE READY' : '✗ RELEASE BLOCKED'}`);
    console.log('===============================================================');

  } catch (err) {
    console.error('Fatal runner exception:', err);
    totalFailed++;
  } finally {
    console.log('[CLEANUP] Stopping background test instance...');
    serverProc.kill();

    // Restore clean database snapshot
    console.log('[CLEANUP] Restoring clean database baseline...');
    Object.entries(dbBackups).forEach(([file, content]) => {
      try {
        fs.writeFileSync(path.join(dataDir, file), content, 'utf-8');
      } catch (e) {
        console.error(`Failed to restore ${file}:`, e.message);
      }
    });

    // Remove temporary test upload files
    ['public/uploads', 'server/uploads'].forEach(dir => {
      const fullDir = path.join(process.cwd(), dir);
      if (fs.existsSync(fullDir)) {
        try {
          fs.readdirSync(fullDir).forEach(f => {
            if (f.startsWith('img-1794124')) {
              fs.unlinkSync(path.join(fullDir, f));
            }
          });
        } catch (_) {}
      }
    });

    setTimeout(() => {
      process.exit(totalFailed > 0 ? 1 : 0);
    }, 500);
  }
}

main();
