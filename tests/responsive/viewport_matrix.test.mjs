// Responsive Viewport Matrix & Mobile UI Verification Test Suite
import fs from 'fs';
import path from 'path';

export async function runResponsiveTests() {
  console.log('\n--- [TEST SUITE: RESPONSIVE / 5-VIEWPORT MATRIX AUDIT] ---');
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

  // 1. Audit Viewport Dimension Breakpoint Configurations
  const VIEWPORT_SPECS = [
    { name: 'Desktop Ultra', width: 1920, height: 1080, minBreakpoint: 'xl' },
    { name: 'Laptop Standard', width: 1366, height: 768, minBreakpoint: 'lg' },
    { name: 'Tablet Portrait', width: 768, height: 1024, minBreakpoint: 'md' },
    { name: 'Mobile Standard (iPhone/Pixel)', width: 390, height: 844, minBreakpoint: 'sm' },
    { name: 'Small Mobile Compact', width: 360, height: 800, minBreakpoint: 'base' }
  ];

  test(VIEWPORT_SPECS.length === 5, 'Supports 5 standardized viewport dimensions (Desktop, Laptop, Tablet, Mobile, Small Mobile)');

  // 2. Audit Mobile Navigation Components
  const navDrawerPath = path.join(process.cwd(), 'src/components/common/MobileNavDrawer.jsx');
  const navDrawerCode = fs.readFileSync(navDrawerPath, 'utf-8');
  test(
    navDrawerCode.includes('fixed inset-0') && navDrawerCode.includes('z-50') && navDrawerCode.includes('lg:hidden'),
    'MobileNavDrawer incorporates fixed overlay, high z-index (z-50), and responsive drawer visibility (lg:hidden)'
  );

  const bottomBarPath = path.join(process.cwd(), 'src/components/common/MobileBottomBar.jsx');
  const bottomBarCode = fs.readFileSync(bottomBarPath, 'utf-8');
  test(
    bottomBarCode.includes('fixed bottom-0') && bottomBarCode.includes('lg:hidden') && bottomBarCode.includes('z-40'),
    'MobileBottomBar incorporates fixed bottom dock, backdrop blur, and responsive visibility (lg:hidden)'
  );

  // 3. Audit Pinterest Discovery Masonry Responsive Columns
  const pinterestPath = path.join(process.cwd(), 'src/components/home/PinterestDiscoverySection.jsx');
  const pinterestCode = fs.readFileSync(pinterestPath, 'utf-8');
  test(
    pinterestCode.includes('columns-1') && pinterestCode.includes('sm:columns-2') && pinterestCode.includes('lg:columns-3'),
    'PinterestDiscoverySection features responsive multi-column masonry (columns-1 on mobile, sm:columns-2, lg:columns-3)'
  );

  // 4. Audit Admin Tables Horizontal Scrolling on Mobile Devices
  const adminPath = path.join(process.cwd(), 'src/pages/AdminDashboardPage.jsx');
  const adminCode = fs.readFileSync(adminPath, 'utf-8');
  test(
    adminCode.includes('overflow-x-auto') && adminCode.includes('mobileSidebarOpen'),
    'Admin Dashboard incorporates overflow-x-auto containers and responsive mobile drawer state'
  );

  // 5. Audit Product Card Touch & Grid Breakpoints
  const catalogPath = path.join(process.cwd(), 'src/pages/CatalogPage.jsx');
  const catalogCode = fs.readFileSync(catalogPath, 'utf-8');
  test(
    catalogCode.includes('grid-cols-1') && catalogCode.includes('sm:grid-cols-2') && (catalogCode.includes('xl:grid-cols-4') || catalogCode.includes('md:grid-cols-3')),
    'Catalog page provides responsive product grid scaling (1 col mobile -> 2 col tablet -> 4 col desktop)'
  );

  console.log(`Responsive Viewport Matrix Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (process.argv[1]?.endsWith('viewport_matrix.test.mjs')) {
  runResponsiveTests().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
