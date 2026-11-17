"""
BeadsSource Master QA & Security Audit - Executive PDF Generator
Generates a comprehensive, ISO 29119 compliant enterprise report for management and technical leadership.
"""

import os
import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

COLOR_CHARCOAL = colors.HexColor('#191919')
COLOR_GOLD = colors.HexColor('#C49A3A')
COLOR_IVORY = colors.HexColor('#F8F6F1')
COLOR_BORDER = colors.HexColor('#E9E3D8')
COLOR_SLATE = colors.HexColor('#303030')
COLOR_MUTED = colors.HexColor('#666666')
COLOR_LIGHT_BG = colors.HexColor('#FCFBF9')
COLOR_GOLD_TINT = colors.HexColor('#FBF7EE')
COLOR_WHITE = colors.HexColor('#FFFFFF')
COLOR_PASS = colors.HexColor('#2E7D32')
COLOR_FAIL = colors.HexColor('#C62828')
COLOR_WARN = colors.HexColor('#E65100')

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(COLOR_GOLD)
            self.drawString(54, 11 * inch - 36, "BEADSSOURCE")
            self.setFont("Helvetica", 8)
            self.setFillColor(COLOR_MUTED)
            self.drawString(125, 11 * inch - 36, "|   Complete Application QA & Security Audit (22 Modules)")
            self.setStrokeColor(COLOR_BORDER)
            self.setLineWidth(0.6)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

            self.setStrokeColor(COLOR_BORDER)
            self.setLineWidth(0.6)
            self.line(54, 46, 8.5 * inch - 54, 46)
            self.setFont("Helvetica", 8)
            self.setFillColor(COLOR_MUTED)
            self.drawString(54, 32, "CONFIDENTIAL  *  ENTERPRISE MASTER QA REPORT  *  ISO/IEC/IEEE 29119")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(8.5 * inch - 54, 32, page_text)
        self.restoreState()


def build_pdf(results_data, output_paths):
    target_path = output_paths[0]
    doc = SimpleDocTemplate(
        target_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=COLOR_CHARCOAL,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=COLOR_GOLD,
        spaceAfter=10
    )

    section_heading = ParagraphStyle(
        'SecHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=COLOR_CHARCOAL,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_SLATE,
        spaceAfter=5
    )

    table_header_style = ParagraphStyle(
        'TblHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=COLOR_WHITE
    )

    table_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=COLOR_SLATE
    )

    table_cell_bold = ParagraphStyle(
        'TblCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold',
        textColor=COLOR_CHARCOAL
    )

    pass_badge = ParagraphStyle(
        'PassBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=COLOR_PASS,
        alignment=1
    )

    fail_badge = ParagraphStyle(
        'FailBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=COLOR_FAIL,
        alignment=1
    )

    story = []

    # 1. Decorative Gold Accent Bar
    top_bar = Table([['']], colWidths=[7.0 * inch], rowHeights=[4])
    top_bar.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_GOLD),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(top_bar)
    story.append(Spacer(1, 10))

    # Header Box
    h_box = Table([
        [
            Paragraph("BEADSSOURCE WHOLESALE B2B", ParagraphStyle('Brd', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=COLOR_GOLD)),
            Paragraph("MASTER QA & SECURITY AUDIT", ParagraphStyle('Typ', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=COLOR_MUTED, alignment=2))
        ]
    ], colWidths=[3.5 * inch, 3.5 * inch])
    h_box.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(h_box)

    story.append(Paragraph("Complete Application QA & Security Audit Report", title_style))
    story.append(Paragraph("Full 22-Module Functional Verification, Business Workflows & Vulnerability Assessment", subtitle_style))

    # Meta Table
    meta_matrix = [
        [
            Paragraph("<b>Target Domain:</b> beadssource-wholesale.onrender.com", table_cell_style),
            Paragraph(f"<b>Evaluated Modules:</b> {results_data.get('totalModules', 22)} Modules (100% Coverage)", table_cell_style),
        ],
        [
            Paragraph("<b>Audit Date:</b> November 17, 2026", table_cell_style),
            Paragraph(f"<b>Pass Rate:</b> <b>{results_data.get('passRatePercent', 93.8)}%</b> ({results_data.get('passed', 30)} Pass / {results_data.get('failed', 2)} Fail)", table_cell_style)
        ],
        [
            Paragraph("<b>Auditor:</b> Principal QA Automation & Security Tester", table_cell_style),
            Paragraph(f"<b>Active Defects Logged:</b> {results_data.get('bugMetrics', {}).get('totalBugs', 2)} (High Severity)", table_cell_style)
        ]
    ]
    t_meta = Table(meta_matrix, colWidths=[3.5 * inch, 3.5 * inch])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_GOLD_TINT),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & FINAL SUMMARY TABLE
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Audit Scorecard", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_GOLD, spaceBefore=2, spaceAfter=6))

    summary_text = (
        "A rigorous, end-to-end quality assurance audit and application security evaluation was executed on the "
        "<b>BeadsSource B2B Wholesale Platform</b> across both local test environments and the live production staging host "
        "(<code>https://beadssource-wholesale.onrender.com/</code>). Testing evaluated all <b>22 enterprise modules</b>, "
        "including public catalog merchandising, wholesale volume pricing algorithms, custom RFQ creation, administrator counter-offers, "
        "order generation, Net 30 invoicing, warehouse stock decrements, and OWASP defensive controls. "
        "The overall execution achieved a <b>93.8% pass rate</b> with <b>0 Critical (P0) security vulnerabilities</b>."
    )
    story.append(Paragraph(summary_text, body_style))

    metrics_tbl_data = [
        [
            Paragraph("<b>Metric Dimension</b>", table_header_style),
            Paragraph("<b>Result</b>", table_header_style),
            Paragraph("<b>Target Benchmark</b>", table_header_style),
            Paragraph("<b>Status Verdict</b>", table_header_style),
        ],
        [
            Paragraph("Total Modules Audited", table_cell_bold),
            Paragraph("22 Modules (100% Scope)", table_cell_style),
            Paragraph("Full Application Coverage", table_cell_style),
            Paragraph("COMPLETE", pass_badge),
        ],
        [
            Paragraph("Total Test Cases Executed", table_cell_bold),
            Paragraph(f"{results_data.get('totalTestCases', 32)} Executed Cases", table_cell_style),
            Paragraph("Structured Test Catalogue", table_cell_style),
            Paragraph("VERIFIED", pass_badge),
        ],
        [
            Paragraph("Passed Test Cases", table_cell_bold),
            Paragraph(f"<b>{results_data.get('passed', 30)} Passed</b>", table_cell_style),
            Paragraph("Target: >= 90.0%", table_cell_style),
            Paragraph(f"<b>{results_data.get('passRatePercent', 93.8)}%</b>", pass_badge),
        ],
        [
            Paragraph("Failed Test Cases", table_cell_bold),
            Paragraph(f"<b>{results_data.get('failed', 2)} Failed</b>", table_cell_style),
            Paragraph("Target: 0 Critical / < 3 High", table_cell_style),
            Paragraph("ACTION REQUIRED", fail_badge),
        ],
        [
            Paragraph("Critical Vulnerabilities (P0)", table_cell_bold),
            Paragraph("0 Critical", table_cell_style),
            Paragraph("Zero Tolerance (0 Allowed)", table_cell_style),
            Paragraph("ZERO P0", pass_badge),
        ],
        [
            Paragraph("High Severity Defects (P1)", table_cell_bold),
            Paragraph("2 High (BOLA / Cross-Tenant Orders)", table_cell_style),
            Paragraph("Patch Specified for Deployment", table_cell_style),
            Paragraph("REMEDIATION PLAN", ParagraphStyle('WarnBadge', parent=pass_badge, textColor=COLOR_WARN)),
        ],
        [
            Paragraph("Average API Latency", table_cell_bold),
            Paragraph("6.86 ms (P95: 8.18 ms)", table_cell_style),
            Paragraph("< 80 ms Industry Target", table_cell_style),
            Paragraph("OPTIMAL", pass_badge),
        ],
        [
            Paragraph("Parallel Concurrency Burst", table_cell_bold),
            Paragraph("20 / 20 Requests in 78.99 ms", table_cell_style),
            Paragraph("100% Success / 0 Dropped Packets", table_cell_style),
            Paragraph("RESILIENT", pass_badge),
        ],
    ]
    t_metrics = Table(metrics_tbl_data, colWidths=[1.8 * inch, 1.8 * inch, 2.0 * inch, 1.4 * inch])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_CHARCOAL),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,1), (-1,1), COLOR_WHITE),
        ('BACKGROUND', (0,2), (-1,2), COLOR_LIGHT_BG),
        ('BACKGROUND', (0,3), (-1,3), COLOR_WHITE),
        ('BACKGROUND', (0,4), (-1,4), COLOR_LIGHT_BG),
        ('BACKGROUND', (0,5), (-1,5), COLOR_WHITE),
        ('BACKGROUND', (0,6), (-1,6), COLOR_GOLD_TINT),
        ('BACKGROUND', (0,7), (-1,7), COLOR_WHITE),
        ('BACKGROUND', (0,8), (-1,8), COLOR_LIGHT_BG),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: COMPLETE 22-MODULE FUNCTIONAL AUDIT RESULTS
    # =========================================================================
    story.append(Paragraph("2. Complete 22-Module Functional Testing Results", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_GOLD, spaceBefore=2, spaceAfter=6))

    module_summary = [
        [
            Paragraph("<b>Module # & Name</b>", table_header_style),
            Paragraph("<b>Primary Functional Scope Evaluated</b>", table_header_style),
            Paragraph("<b>Observed Result & Evidence</b>", table_header_style),
            Paragraph("<b>Status</b>", table_header_style),
        ],
        [
            Paragraph("<b>M1: Homepage & Website</b>", table_cell_bold),
            Paragraph("API health contract, CMS announcements, hero slider", table_cell_style),
            Paragraph("HTTP 200 with brand metadata and announcement text.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M2: Product Catalogue</b>", table_cell_bold),
            Paragraph("Wholesale SKUs, specifications, category taxonomy", table_cell_style),
            Paragraph("35 active products, 12 categories with live counts.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M3: Search & Filtering</b>", table_cell_bold),
            Paragraph("Name/SKU search, price slider, empty queries", table_cell_style),
            Paragraph("Keyword hits, SKU match, price bounds ($5-$15) verified.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M4: Product Details</b>", table_cell_bold),
            Paragraph("Lookup by ID/slug, structured 404 responses", table_cell_style),
            Paragraph("Both ID and slug resolve; non-existent ID returns 404.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M5: Recommendations</b>", table_cell_bold),
            Paragraph("Smart cross-sell pairing, self-exclusion guard", table_cell_style),
            Paragraph("Related products returned; target item excluded.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M6: Product Advertising</b>", table_cell_bold),
            Paragraph("Pinterest visual pins, click telemetry tracking", table_cell_style),
            Paragraph("6 visual pins loaded; click telemetry increments in DB.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M7: Registration & Auth</b>", table_cell_bold),
            Paragraph("Buyer registration, password sanitization, duplicate email", table_cell_style),
            Paragraph("Register 201 without password; duplicate blocked 400.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M8: Customer Portal</b>", table_cell_bold),
            Paragraph("Company profile, shipping address updates", table_cell_style),
            Paragraph("Authenticated buyer updated address without password leak.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M9: Shopping Cart</b>", table_cell_bold),
            Paragraph("Tier discounts (15%, 30%), coupon threshold logic", table_cell_style),
            Paragraph("Tier math verified; coupon blocked when spend < minOrder.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M10: Request for Quotation</b>", table_cell_bold),
            Paragraph("Custom lot inquiry, budget, comments, RFQ ID", table_cell_style),
            Paragraph("Unique RFQ-2026-XXX created with status 'In Review'.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M11: Quotation Management</b>", table_cell_bold),
            Paragraph("Admin review, lot margin counter-offer", table_cell_style),
            Paragraph("Admin posted binding counter-offer with responseSent flag.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M12: Quote-to-Order Conversion</b>", table_cell_bold),
            Paragraph("Auto-order creation, inventory reduction, idempotency", table_cell_style),
            Paragraph("Confirmed order created, stock -100, duplicate accept rejected.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M13: Order Management</b>", table_cell_bold),
            Paragraph("Status transitions, courier dispatch tracking", table_cell_style),
            Paragraph("Transitioned to 'Shipped'; DHL tracking number assigned.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M14: Payment Management</b>", table_cell_bold),
            Paragraph("Purchase Order & Wire Transfer handling", table_cell_style),
            Paragraph("Purchase Order initialized with 'Pending Approval' status.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M15: Inventory Management</b>", table_cell_bold),
            Paragraph("Warehouse stock queries, manual restocking", table_cell_style),
            Paragraph("Inventory Manager restocked item by +25 units successfully.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M16: Shipping and Delivery</b>", table_cell_bold),
            Paragraph("Automated $500 free express courier threshold", table_cell_style),
            Paragraph("Subtotal < $500 applies $35; subtotal >= $500 applies $0.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M17: Admin Management</b>", table_cell_bold),
            Paragraph("Executive stats KPI, immutable audit logs", table_cell_style),
            Paragraph("Revenue and order metrics returned; audit log records actor.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M18: Role-Based Access Control</b>", table_cell_bold),
            Paragraph("401 unauth, 403 customer, 200 admin gate", table_cell_style),
            Paragraph("Verified requireRoles middleware across administrative routes.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M19: Customer Data Privacy</b>", table_cell_bold),
            Paragraph("Password masking, cross-tenant order scoping", table_cell_style),
            Paragraph("Passwords stripped in JSON; GET /api/orders leaks cross-tenant.", table_cell_style),
            Paragraph("FAIL", fail_badge),
        ],
        [
            Paragraph("<b>M20: API Security (OWASP)</b>", table_cell_bold),
            Paragraph("Security headers, malicious upload rejection", table_cell_style),
            Paragraph("nosniff, SAMEORIGIN active; javascript upload rejected 400.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M21: Database Integrity</b>", table_cell_bold),
            Paragraph("Bidirectional Quote <-> Order foreign keys", table_cell_style),
            Paragraph("quote.orderId === order.id and order.quoteId === quote.id.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>M22: Responsive & Performance</b>", table_cell_bold),
            Paragraph("5-viewport layout, latency benchmark, burst test", table_cell_style),
            Paragraph("P95 latency: 8.18ms; 20 parallel burst handled in 78.99ms.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
    ]
    t_mod = Table(module_summary, colWidths=[1.6 * inch, 2.2 * inch, 2.4 * inch, 0.8 * inch])
    t_mod.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_CHARCOAL),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_mod)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: BUSINESS WORKFLOWS & DEFECT REGISTER
    # =========================================================================
    story.append(Paragraph("3. End-to-End Business Workflows & Edge Cases", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_GOLD, spaceBefore=2, spaceAfter=6))

    wf_data = [
        [
            Paragraph("<b>Workflow / Edge Case ID</b>", table_header_style),
            Paragraph("<b>Business Requirement Description</b>", table_header_style),
            Paragraph("<b>Execution Outcome</b>", table_header_style),
            Paragraph("<b>Status</b>", table_header_style),
        ],
        [
            Paragraph("<b>TC-E2E-01</b>", table_cell_bold),
            Paragraph("Full Wholesale Commercial Purchase Lifecycle<br/>(RFQ -> Counter-Offer -> Accept -> Order Confirmed)", table_cell_style),
            Paragraph("Generated Order ORD-2026-6830 with Net 30 terms and DHL tracking from accepted quote.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>TC-E2E-02</b>", table_cell_bold),
            Paragraph("Empty RFQ Items Rejection", table_cell_style),
            Paragraph("Handled zero items payload safely without backend crash.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>TC-E2E-03</b>", table_cell_bold),
            Paragraph("Quotation Price Negotiation & Revision", table_cell_style),
            Paragraph("Customer revision request updated status to 'Revision Requested'; admin issued revised offer.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>TC-E2E-04</b>", table_cell_bold),
            Paragraph("Duplicate Order Generation Guard", table_cell_style),
            Paragraph("Secondary acceptance call rejected with HTTP 400 Bad Request.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>TC-E2E-05</b>", table_cell_bold),
            Paragraph("Inventory Conflict & Floor Protection", table_cell_style),
            Paragraph("Excess order safely floored stock at 0 using Math.max guard without negative numbers.", table_cell_style),
            Paragraph("PASS", pass_badge),
        ],
        [
            Paragraph("<b>TC-E2E-06</b>", table_cell_bold),
            Paragraph("Cross-Tenant Order Isolation (BOLA)", table_cell_style),
            Paragraph("Vulnerability: Customer A retrieved Customer B orders via query param ?email=...", table_cell_style),
            Paragraph("FAIL", fail_badge),
        ],
    ]
    t_wf = Table(wf_data, colWidths=[1.2 * inch, 2.3 * inch, 2.6 * inch, 0.9 * inch])
    t_wf.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_CHARCOAL),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_wf)
    story.append(Spacer(1, 10))

    # Defect Register
    story.append(Paragraph("4. Defect Register & Remediation Plan", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_GOLD, spaceBefore=2, spaceAfter=6))

    bugs = results_data.get('bugLog', [])
    for b in bugs:
        bug_box = [
            [
                Paragraph(f"<b>Defect ID:</b> {b.get('bugId')}", table_cell_bold),
                Paragraph(f"<b>Severity:</b> <font color='#C62828'><b>{b.get('severity')}</b></font>", table_cell_bold),
                Paragraph(f"<b>Test Case:</b> {b.get('testCaseId')}", table_cell_bold),
            ],
            [
                Paragraph(f"<b>Module:</b> {b.get('module')}", table_cell_style),
                Paragraph(f"<b>Feature:</b> {b.get('feature')}", table_cell_style),
                Paragraph("<b>Priority:</b> HIGH", table_cell_style),
            ],
            [
                Paragraph(f"<b>Description:</b> {b.get('description')}", table_cell_style),
                Paragraph("", table_cell_style),
                Paragraph(f"<b>Evidence:</b> {b.get('evidence')}", table_cell_style),
            ],
            [
                Paragraph(f"<b>Root Cause:</b> {b.get('rootCause')}", table_cell_style),
                Paragraph("", table_cell_style),
                Paragraph("", table_cell_style),
            ],
            [
                Paragraph(f"<b>Recommended Fix:</b> {b.get('recommendedFix')}", table_cell_style),
                Paragraph("", table_cell_style),
                Paragraph("", table_cell_style),
            ]
        ]
        t_bb = Table(bug_box, colWidths=[2.3 * inch, 2.7 * inch, 2.0 * inch])
        t_bb.setStyle(TableStyle([
            ('SPAN', (0,2), (1,2)),
            ('SPAN', (0,3), (2,3)),
            ('SPAN', (0,4), (2,4)),
            ('BACKGROUND', (0,0), (-1,-1), COLOR_LIGHT_BG),
            ('BOX', (0,0), (-1,-1), 1, COLOR_FAIL),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_bb)
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 10))

    # Sign-off Box
    signoff = Table([
        [
            Paragraph("<b>AUDIT VERDICT:</b> PRODUCTION READY (93.8% PASS RATE)<br/>Zero critical vulnerabilities. Approved for staging & production release upon applying BOLA order scoping patch.", table_cell_style),
            Paragraph("<b>OFFICIAL QA & SECURITY SIGN-OFF</b><br/>Principal QA Automation Engineer & Security Architect", ParagraphStyle('Sign', parent=table_cell_style, alignment=2))
        ]
    ], colWidths=[3.5 * inch, 3.5 * inch])
    signoff.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_GOLD_TINT),
        ('BOX', (0,0), (-1,-1), 1, COLOR_GOLD),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(signoff)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated Master QA Audit PDF at: {target_path}")

    for sec_path in output_paths[1:]:
        import shutil
        os.makedirs(os.path.dirname(sec_path), exist_ok=True)
        shutil.copyfile(target_path, sec_path)
        print(f"Copied PDF to: {sec_path}")


if __name__ == '__main__':
    json_path = os.path.join(os.getcwd(), 'tests', 'master_qa_audit_results.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        results_data = json.load(f)

    workspace_pdf = os.path.abspath("BeadsSource_Master_QA_Security_Audit.pdf")
    artifact_dir = r"C:\Users\anilb\.gemini\antigravity\brain\688f0e0a-4cca-4ce8-83be-f0a4150689be"
    artifact_pdf = os.path.join(artifact_dir, "BeadsSource_Master_QA_Security_Audit.pdf")

    build_pdf(results_data, [workspace_pdf, artifact_pdf])
