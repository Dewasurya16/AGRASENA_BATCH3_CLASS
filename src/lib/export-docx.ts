import JSZip from 'jszip'

interface DocxExportOptions {
  title: string
  authorName: string
  authorNip: string
  authorSatker: string
  mentorName: string
  coachName: string
  content: string
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Parses markdown-like text and converts it into WordprocessingML XML elements.
 */
function convertMarkdownToWml(content: string): string {
  const lines = content.split('\n')
  let wml = ''

  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line) {
      wml += '<w:p><w:pPr><w:spacing w:after="120" /></w:pPr></w:p>'
      return
    }

    // Ignore divider / ascii characters
    if (/^[+\-| ]{5,}$/.test(line) || line.startsWith('```')) {
      return
    }

    // Heading 1 (# BAB I)
    if (line.startsWith('# ')) {
      const text = escapeXml(line.replace(/^#\s+/, ''))
      wml += `
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading1" />
            <w:jc w:val="center" />
            <w:spacing w:before="280" w:after="140" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
              <w:b />
              <w:sz w:val="28" />
              <w:color w:val="000000" />
            </w:rPr>
            <w:t>${text}</w:t>
          </w:r>
        </w:p>
      `
      return
    }

    // Heading 2 (## 1.1 Latar Belakang)
    if (line.startsWith('## ')) {
      const text = escapeXml(line.replace(/^##\s+/, ''))
      wml += `
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading2" />
            <w:spacing w:before="200" w:after="100" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
              <w:b />
              <w:sz w:val="24" />
              <w:color w:val="000000" />
            </w:rPr>
            <w:t>${text}</w:t>
          </w:r>
        </w:p>
      `
      return
    }

    // Heading 3 (### A. Identifikasi Masalah)
    if (line.startsWith('### ')) {
      const text = escapeXml(line.replace(/^###\s+/, ''))
      wml += `
        <w:p>
          <w:pPr>
            <w:spacing w:before="160" w:after="80" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
              <w:b />
              <w:sz w:val="24" />
              <w:color w:val="000000" />
            </w:rPr>
            <w:t>${text}</w:t>
          </w:r>
        </w:p>
      `
      return
    }

    // Bullet points
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const rawItem = line.replace(/^([•\-\*]\s+)/, '')
      wml += `
        <w:p>
          <w:pPr>
            <w:ind w:left="720" w:hanging="360" />
            <w:spacing w:after="80" w:line="276" w:lineRule="auto" />
            <w:jc w:val="both" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
              <w:sz w:val="24" />
            </w:rPr>
            <w:t>• </w:t>
          </w:r>
          ${formatRuns(rawItem)}
        </w:p>
      `
      return
    }

    // Normal paragraph with indent
    wml += `
      <w:p>
        <w:pPr>
          <w:ind w:firstLine="560" />
          <w:spacing w:after="120" w:line="276" w:lineRule="auto" />
          <w:jc w:val="both" />
        </w:pPr>
        ${formatRuns(line)}
      </w:p>
    `
  })

  return wml
}

/**
 * Handles inline bold and italic formatting for WordprocessingML.
 */
function formatRuns(text: string): string {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  let runs = ''

  parts.forEach((part) => {
    if (!part) return
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = escapeXml(part.slice(2, -2))
      runs += `
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
            <w:b />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">${inner}</w:t>
        </w:r>
      `
    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = escapeXml(part.slice(1, -1))
      runs += `
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
            <w:i />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">${inner}</w:t>
        </w:r>
      `
    } else {
      const inner = escapeXml(part)
      runs += `
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">${inner}</w:t>
        </w:r>
      `
    }
  })

  return runs
}

/**
 * Generates and triggers download of a native .docx Microsoft Word document.
 */
export async function exportToDocx(options: DocxExportOptions): Promise<void> {
  const zip = new JSZip()

  // 1. [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
  )

  // 2. _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  )

  // 3. word/_rels/document.xml.rels
  zip.file(
    'word/_rels/document.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  )

  // 4. word/styles.xml
  zip.file(
    'word/styles.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:val="id-ID"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="120" w:line="276" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`
  )

  // 5. word/document.xml
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const bodyWml = convertMarkdownToWml(options.content)

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <!-- Cover Title Section -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="360" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="32"/>
          <w:color w:val="000000"/>
        </w:rPr>
        <w:t>RANCANGAN PROYEK INOVASI TIK (5 BAB)</w:t>
      </w:r>
    </w:p>
    
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="28"/>
          <w:color w:val="007AFF"/>
        </w:rPr>
        <w:t>${escapeXml(options.title.toUpperCase())}</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="360"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:i/>
          <w:sz w:val="24"/>
          <w:color w:val="333333"/>
        </w:rPr>
        <w:t>Diklat Fungsional Pranata Komputer Keahlian Batch 3 Tahun 2026</w:t>
      </w:r>
    </w:p>

    <!-- Metadata Box / Table in Word -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Disusun Oleh:</w:t>
      </w:r>
    </w:p>
    
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="40"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>${escapeXml(options.authorName || 'Peserta Diklat')}</w:t>
      </w:r>
      ${options.authorNip ? `
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:sz w:val="22"/>
        </w:rPr>
        <w:t> (NIP. ${escapeXml(options.authorNip)})</w:t>
      </w:r>` : ''}
    </w:p>

    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="40"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>${escapeXml(options.authorSatker || 'Satuan Kerja Kejaksaan RI')}</w:t>
      </w:r>
    </w:p>

    ${(options.mentorName || options.coachName) ? `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="40"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:sz w:val="22"/>
          <w:color w:val="555555"/>
        </w:rPr>
        <w:t>Mentor: ${escapeXml(options.mentorName || '-')} | Coach: ${escapeXml(options.coachName || '-')}</w:t>
      </w:r>
    </w:p>
    ` : ''}

    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="480"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:sz w:val="22"/>
          <w:color w:val="666666"/>
        </w:rPr>
        <w:t>Badan Pendidikan dan Pelatihan Kejaksaan Republik Indonesia · ${escapeXml(dateStr)}</w:t>
      </w:r>
    </w:p>

    <!-- Page Break -->
    <w:p>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>

    <!-- Body Content from 5 Chapters -->
    ${bodyWml}

    <!-- Standard Dinas A4 Margin: Top 40mm (2268 dxa), Left 40mm (2268 dxa), Bottom 30mm (1701 dxa), Right 30mm (1701 dxa) -->
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="2268" w:right="1701" w:bottom="1701" w:left="2268" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`

  zip.file('word/document.xml', documentXml)

  // 6. Generate Blob and trigger download
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  })

  const fileName = `Proposal_Inovasi_Prakom_${options.authorSatker.replace(/[^a-zA-Z0-9]/g, '_') || 'Satker'}.docx`
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
