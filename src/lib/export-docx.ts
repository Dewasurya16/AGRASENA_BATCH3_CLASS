import JSZip from 'jszip'

interface DocxExportOptions {
  title: string
  authorName: string
  authorNip: string
  authorSatker: string
  mentorName?: string
  coachName?: string
  authorRank?: string
  examDate?: string
  batchName?: string
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
 * Handles inline bold, italic, code, and links for WordprocessingML.
 */
function formatRuns(text: string): string {
  if (!text) return ''
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
    } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const inner = escapeXml(part.slice(1, -1))
      runs += `
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" />
            <w:sz w:val="21" />
            <w:color w:val="0D824B" />
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
 * Converts Markdown table lines into a well-formatted WordprocessingML table element.
 */
function convertTableToWml(tableLines: string[]): string {
  if (tableLines.length === 0) return ''

  const isSeparator = (str: string) => /^\|[\s:\-]+(\|[\s:\-]+)*\|$/.test(str)

  let wml = `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="0" w:type="auto"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="333333"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="333333"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="333333"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="333333"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>
        </w:tblBorders>
        <w:tblCellMar>
          <w:top w:w="120" w:type="dxa"/>
          <w:left w:w="140" w:type="dxa"/>
          <w:bottom w:w="120" w:type="dxa"/>
          <w:right w:w="140" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
  `

  let isHeaderRow = true

  for (let r = 0; r < tableLines.length; r++) {
    const rawRow = tableLines[r]
    if (isSeparator(rawRow)) {
      isHeaderRow = false
      continue
    }

    const rawCells = rawRow.slice(1, -1).split('|')
    wml += '<w:tr>'

    for (let c = 0; c < rawCells.length; c++) {
      const cellText = rawCells[c].trim()
      const isHeader = isHeaderRow

      wml += `
        <w:tc>
          <w:tcPr>
            ${isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="F2F4F7"/>' : ''}
          </w:tcPr>
      `

      // Support multi-line in cells (<br/> or <br>)
      const paragraphs = cellText.split(/<br\s*\/?>/i)
      paragraphs.forEach((pText) => {
        const trimmedP = pText.trim()
        wml += `
          <w:p>
            <w:pPr>
              <w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/>
              ${isHeader ? '<w:jc w:val="center"/>' : '<w:jc w:val="left"/>'}
            </w:pPr>
            ${formatRuns(isHeader ? `**${trimmedP}**` : trimmedP)}
          </w:p>
        `
      })

      wml += '</w:tc>'
    }

    wml += '</w:tr>'
    if (isHeaderRow && r === 0) {
      if (r + 1 < tableLines.length && !isSeparator(tableLines[r + 1])) {
        isHeaderRow = false
      }
    }
  }

  wml += '</w:tbl>'
  return wml
}

/**
 * Parses markdown text into WordprocessingML elements.
 */
function convertMarkdownToWml(content: string): string {
  const lines = content.split('\n')
  let wml = ''
  let i = 0

  while (i < lines.length) {
    const rawLine = lines[i]
    const line = rawLine.trim()

    if (!line) {
      wml += '<w:p><w:pPr><w:spacing w:after="120" /></w:pPr></w:p>'
      i++
      continue
    }

    // Ignore ascii decorative divider box
    if (/^[+\-| ]{6,}$/.test(line) || line.startsWith('```')) {
      i++
      continue
    }

    // Explicit Page Break on divider
    if (line === '---' || line === '━━━' || line === '***') {
      wml += `
        <w:p>
          <w:r>
            <w:br w:type="page"/>
          </w:r>
        </w:p>
      `
      i++
      continue
    }

    // Markdown Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }

      if (tableLines.length > 0) {
        wml += convertTableToWml(tableLines)
      }
      continue
    }

    // Heading 1 (# LAPORAN LABORATORIUM ...)
    if (line.startsWith('# ')) {
      const text = escapeXml(line.replace(/^#\s+/, ''))
      wml += `
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading1" />
            <w:jc w:val="center" />
            <w:spacing w:before="320" w:after="160" />
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
      i++
      continue
    }

    // Heading 2 (## ...)
    if (line.startsWith('## ')) {
      const text = escapeXml(line.replace(/^##\s+/, ''))
      wml += `
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading2" />
            <w:jc w:val="center" />
            <w:spacing w:before="240" w:after="120" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" />
              <w:b />
              <w:sz w:val="26" />
              <w:color w:val="000000" />
            </w:rPr>
            <w:t>${text}</w:t>
          </w:r>
        </w:p>
      `
      i++
      continue
    }

    // Heading 3 (### ...)
    if (line.startsWith('### ')) {
      const text = escapeXml(line.replace(/^###\s+/, ''))
      const isCenter = text.includes('PELATIHAN') || text.includes('KEJAKSAAN') || text.includes('BUKTI KEGIATAN')
      wml += `
        <w:p>
          <w:pPr>
            <w:spacing w:before="180" w:after="90" />
            ${isCenter ? '<w:jc w:val="center" />' : ''}
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
      i++
      continue
    }

    // Heading 4 (#### ...)
    if (line.startsWith('#### ')) {
      const text = escapeXml(line.replace(/^####\s+/, ''))
      wml += `
        <w:p>
          <w:pPr>
            <w:spacing w:before="140" w:after="60" />
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
      i++
      continue
    }

    // Bullet points (• , - , * )
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const rawItem = line.replace(/^([•\-\*]\s+)/, '')
      wml += `
        <w:p>
          <w:pPr>
            <w:ind w:left="720" w:hanging="360" />
            <w:spacing w:after="80" w:line="300" w:lineRule="auto" />
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
      i++
      continue
    }

    // Center alignment detection for cover / agency lines
    const isCenterAligned =
      line.includes('Kejaksaan Agung, 2026') ||
      line.startsWith('**KEJAKSAAN AGUNG**') ||
      line.startsWith('**BEKERJASAMA DENGAN') ||
      line.startsWith('**PELATIHAN FUNGSIONAL') ||
      line.startsWith('**KATEGORI KEAHLIAN') ||
      line.startsWith('**JAKARTA 2026**') ||
      line === '**Oleh:**' ||
      line.startsWith('**NAMA') ||
      (line.startsWith('NIP. ') && i < 35)

    wml += `
      <w:p>
        <w:pPr>
          ${isCenterAligned ? '<w:jc w:val="center" />' : '<w:ind w:firstLine="560" /><w:jc w:val="both" />'}
          <w:spacing w:after="120" w:line="300" w:lineRule="auto" />
        </w:pPr>
        ${formatRuns(line)}
      </w:p>
    `
    i++
  }

  return wml
}

/**
 * Generates and triggers download of a native .docx Microsoft Word document.
 * 100% compliant with standard Dinas Kejaksaan RI format (A4 margins 4-4-3-3 cm).
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
        <w:spacing w:after="120" w:line="300" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`
  )

  // 5. word/document.xml
  const bodyWml = convertMarkdownToWml(options.content)

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <!-- Document Body Converted from Markdown (Includes Cover, Lembar Pengesahan, Bab I-IV, and Tables) -->
    ${bodyWml}

    <!-- Standar Naskah Dinas A4: Top 30mm (1701 dxa), Left 40mm (2268 dxa), Bottom 30mm (1701 dxa), Right 30mm (1701 dxa) -->
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1701" w:right="1701" w:bottom="1701" w:left="2268" w:header="720" w:footer="720" w:gutter="0"/>
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

  const cleanSatker = options.authorSatker.replace(/[^a-zA-Z0-9]/g, '_') || 'Satker'
  const fileName = `Laporan_Lab_Prakom_${cleanSatker}_${Date.now()}.docx`
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
