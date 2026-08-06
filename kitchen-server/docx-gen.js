const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  VerticalAlign, PageOrientation, ImageRun,
} = require('docx');
const fs = require('fs');
const path = require('path');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const FIELD_TYPE_LABELS = {
  text: 'Текстовое поле',
  number: 'Число',
  date: 'Дата',
  autodate: 'Авто-дата',
  comply: 'Соответствует / Не соответствует',
  yes_no: 'Да / Нет',
  select: 'Выбор из списка',
  multiselect: 'Множественный выбор',
  photo: 'Фото',
  comment: 'Комментарий',
};

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width || { size: 5000, type: WidthType.DXA },
    shading: opts.shading,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({
        text: String(text ?? ''),
        bold: opts.bold,
        size: opts.size || 20,
        color: opts.color,
      })],
    })],
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  });
}

function heading(text, level = HeadingLevel.HEADING_2) {
  return new Paragraph({ heading: level, children: [new TextRun({ text })] });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align,
    spacing: { before: opts.spaceBefore || 0, after: opts.spaceAfter || 80 },
    children: [new TextRun({ text: String(text ?? ''), bold: opts.bold, size: opts.size || 20, color: opts.color })],
  });
}

function hRule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } },
    spacing: { before: 120, after: 120 },
    children: [],
  });
}

// Шаблон акта (пустая форма)
async function generateTemplateDOCX(template) {
  const children = [];

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'АКТ ПРОРАБОТКИ СЫРЬЯ', bold: true, size: 32 })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: template.name, bold: true, size: 26, color: '444444' })],
  }));

  children.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [
        cell('Наименование сырья:', { width: { size: 4680, type: WidthType.DXA }, bold: true }),
        cell('', { width: { size: 4680, type: WidthType.DXA } }),
      ]}),
      new TableRow({ children: [
        cell('Дата проработки:', { width: { size: 4680, type: WidthType.DXA }, bold: true }),
        cell('', { width: { size: 4680, type: WidthType.DXA } }),
      ]}),
    ],
  }));
  children.push(para('', { spaceAfter: 240 }));

  for (const sec of template.sections || []) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 320, after: 120 },
      shading: { type: ShadingType.CLEAR, fill: 'F3F0EC' },
      children: [new TextRun({ text: sec.title.toUpperCase(), bold: true, size: 22 })],
    }));

    for (const f of sec.fields || []) {
      children.push(para(
        (f.required ? '* ' : '') + f.label,
        { bold: true, spaceBefore: 120, spaceAfter: 40 }
      ));
      if (f.description) {
        children.push(para(f.description, { color: '777777', size: 18, spaceAfter: 60 }));
      }

      if (f.type === 'comply') {
        children.push(new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [new TableRow({ children: [
            cell('☐  Соответствует', { width: { size: 4680, type: WidthType.DXA } }),
            cell('☐  Не соответствует', { width: { size: 4680, type: WidthType.DXA } }),
          ]})],
        }));
      } else if (f.type === 'yes_no') {
        children.push(new Table({
          width: { size: 4680, type: WidthType.DXA },
          columnWidths: [2340, 2340],
          rows: [new TableRow({ children: [
            cell('☐  Да', { width: { size: 2340, type: WidthType.DXA } }),
            cell('☐  Нет', { width: { size: 2340, type: WidthType.DXA } }),
          ]})],
        }));
      } else if (f.type === 'select' || f.type === 'multiselect') {
        const opts = f.config?.options || [];
        children.push(para(
          opts.map(o => `☐  ${o}`).join('     '),
          { spaceAfter: 60 }
        ));
      } else if (f.type === 'photo') {
        children.push(para('[ Фото ]', { color: 'AAAAAA', spaceAfter: 60 }));
      } else if (f.type === 'comment') {
        children.push(new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({ children: [
            cell('', { width: { size: 9360, type: WidthType.DXA } }),
          ]})],
        }));
      } else {
        // text, number, date, autodate
        children.push(new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({ children: [
            cell('', { width: { size: 9360, type: WidthType.DXA } }),
          ]})],
        }));
      }
      children.push(para('', { spaceAfter: 40 }));
    }
    children.push(hRule());
  }

  const doc = new Document({
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 } } }, children }],
  });
  return Packer.toBuffer(doc);
}

// Заполненный акт
async function generateActDOCX(act, template) {
  const values = act.values || {};
  const photos = act.photos || [];
  const children = [];

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'АКТ ПРОРАБОТКИ СЫРЬЯ', bold: true, size: 32 })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: template.name, bold: true, size: 26, color: '444444' })],
  }));

  const statusText = act.status === 'done' ? 'Завершён' : 'Черновик';
  children.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [
        cell('Наименование сырья:', { width: { size: 4680, type: WidthType.DXA }, bold: true }),
        cell(act.raw_material || '—', { width: { size: 4680, type: WidthType.DXA } }),
      ]}),
      new TableRow({ children: [
        cell('Дата проработки:', { width: { size: 4680, type: WidthType.DXA }, bold: true }),
        cell(act.date ? new Date(act.date).toLocaleDateString('ru-RU') : '—', { width: { size: 4680, type: WidthType.DXA } }),
      ]}),
      new TableRow({ children: [
        cell('Статус:', { width: { size: 4680, type: WidthType.DXA }, bold: true }),
        cell(statusText, { width: { size: 4680, type: WidthType.DXA }, color: act.status === 'done' ? '2D6A4F' : '666666' }),
      ]}),
    ],
  }));
  children.push(para('', { spaceAfter: 240 }));

  for (const sec of template.sections || []) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 320, after: 120 },
      shading: { type: ShadingType.CLEAR, fill: 'F3F0EC' },
      children: [new TextRun({ text: sec.title.toUpperCase(), bold: true, size: 22 })],
    }));

    for (const f of sec.fields || []) {
      const val = values[f.id];
      const fieldPhotos = photos.filter(p => p.field_id === f.id);
      if (!val && !fieldPhotos.length) continue;

      children.push(para(f.label, { bold: true, spaceBefore: 120, spaceAfter: 40 }));
      if (f.description) {
        children.push(para(f.description, { color: '777777', size: 18, spaceAfter: 40 }));
      }

      if (val) {
        let displayVal = val;
        if (f.type === 'multiselect') displayVal = val.split('|').filter(Boolean).join(', ');
        if (f.type === 'comply') displayVal = val === 'соответствует' ? '✓ Соответствует' : '✗ Не соответствует';
        if (f.type === 'yes_no') displayVal = val === 'да' ? '✓ Да' : '✗ Нет';
        if (f.type === 'date' || f.type === 'autodate') {
          try { displayVal = new Date(val).toLocaleDateString('ru-RU'); } catch {}
        }

        const valColor =
          (f.type === 'comply' && val === 'соответствует') ? '2D6A4F' :
          (f.type === 'comply' && val === 'не соответствует') ? 'C0392B' :
          (f.type === 'yes_no' && val === 'да') ? '2D6A4F' :
          (f.type === 'yes_no' && val === 'нет') ? 'C0392B' : '111111';

        children.push(new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({ children: [
            cell(displayVal, { width: { size: 9360, type: WidthType.DXA }, color: valColor }),
          ]})],
        }));
      }

      if (fieldPhotos.length > 0) {
        for (const p of fieldPhotos) {
          const fp = path.join(UPLOADS_DIR, p.filename);
          if (!fs.existsSync(fp)) continue;
          const data = fs.readFileSync(fp);
          const ext = path.extname(p.filename).toLowerCase().replace('.', '');
          const type = ext === 'jpg' ? 'jpeg' : (ext === 'png' ? 'png' : ext === 'gif' ? 'gif' : 'jpeg');
          try {
            children.push(new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [new ImageRun({ data, transformation: { width: 300, height: 200 }, type })],
            }));
          } catch {}
        }
      }

      children.push(para('', { spaceAfter: 40 }));
    }
    children.push(hRule());
  }

  const doc = new Document({
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 } } }, children }],
  });
  return Packer.toBuffer(doc);
}

module.exports = { generateTemplateDOCX, generateActDOCX };
