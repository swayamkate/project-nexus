const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mdPath = path.join(__dirname, 'SIH_2026_MASTER_COMPREHENSIVE_DOSSIER.md');
const htmlPath = path.join(__dirname, 'SIH_2026_MASTER_COMPREHENSIVE_DOSSIER.html');
const pdfPath = path.join(__dirname, 'SIH_2026_MASTER_COMPREHENSIVE_DOSSIER.pdf');

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Basic Markdown to Clean HTML parser
function markdownToHtml(md) {
  let html = md;

  // Escape basic HTML entities in code blocks
  const codeBlocks = [];
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push(`<pre><code class="language-${lang}">${code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</code></pre>`);
    return placeholder;
  });

  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1 class="doc-title">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="doc-subtitle">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="section-title">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="q-title">$1</h4>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="divider" />');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<div class="callout"><span class="badge-ans">ANSWER</span> $1</div>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Tables
  html = html.replace(/\n(\|.*\|\n)+/g, (tableMatch) => {
    const lines = tableMatch.trim().split('\n');
    let tableHtml = '<div class="table-container"><table>';
    let isHeader = true;

    lines.forEach((line, idx) => {
      if (line.includes('---')) {
        isHeader = false;
        return;
      }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (idx === 0) {
        tableHtml += '<thead><tr>';
        cells.forEach(c => tableHtml += `<th>${c}</th>`);
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>';
        cells.forEach(c => tableHtml += `<td>${c}</td>`);
        tableHtml += '</tr>';
      }
    });

    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Lists
  html = html.replace(/^\s*-\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\s*\d+\.\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n([^<].*?)\n\n/gims, '<p>$1</p>');

  // Restore code blocks
  codeBlocks.forEach((cb, idx) => {
    html = html.replace(`___CODE_BLOCK_${idx}___`, cb);
  });

  return html;
}

const bodyHtml = markdownToHtml(mdContent);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SIH 2026 Master Comprehensive Dossier - Nexus Longitudinal Intelligence</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }

    .doc-title {
      font-size: 20pt;
      font-weight: 800;
      color: #1e3a8a;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }

    .doc-subtitle {
      font-size: 13pt;
      font-weight: 700;
      color: #1d4ed8;
      margin-top: 18px;
      margin-bottom: 8px;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      page-break-after: avoid;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    .q-title {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
      background: #f1f5f9;
      padding: 6px 10px;
      border-left: 4px solid #2563eb;
      border-radius: 4px;
      margin-top: 12px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin-top: 0;
      margin-bottom: 8px;
      text-align: justify;
    }

    .callout {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 6px 0 12px 0;
      font-size: 9pt;
      color: #1e3a8a;
    }

    .badge-ans {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 6px;
      letter-spacing: 0.5px;
    }

    .table-container {
      margin: 10px 0;
      page-break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin: 4px 0 12px 0;
    }

    th {
      background-color: #1e293b;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 600;
      border: 1px solid #334155;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      overflow-x: auto;
      margin: 8px 0 12px 0;
      line-height: 1.4;
      page-break-inside: avoid;
    }

    .inline-code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      border: 1px solid #e2e8f0;
    }

    ul, ol {
      margin-top: 2px;
      margin-bottom: 8px;
      padding-left: 20px;
    }

    li {
      margin-bottom: 3px;
    }

    .divider {
      border: none;
      border-top: 1px dashed #cbd5e1;
      margin: 14px 0;
    }

    a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .header-banner h1 {
      margin: 0;
      font-size: 15pt;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .header-banner p {
      margin: 3px 0 0 0;
      font-size: 8.5pt;
      color: #bfdbfe;
    }

    .header-badge {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div>
      <h1>🇮🇳 NEXUS: SKILLING OUTCOMES & IMPACT INTELLIGENCE</h1>
      <p>Smart India Hackathon (SIH 2026) | Problem Statement: PS-135 Grand Finale Dossier</p>
    </div>
    <div class="header-badge">
      OFFICIAL REFERENCE
    </div>
  </div>

  ${bodyHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('Generated HTML file:', htmlPath);

// Execute Edge Headless Print-to-PDF
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Running command:', cmd);
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('SUCCESS: PDF Generated at:', pdfPath);
} catch (e) {
  console.error('Error generating PDF:', e);
}
