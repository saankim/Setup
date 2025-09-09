// ─── Copy an HTML table: Title-linked-to-PDF | Year ───────────────────
// Save as “copy_html_table.js” in MyZotero/scripts.
//
// Result copied to clipboard; ready to paste into e-mails, Confluence, etc.

(async function () {
    const zoteroPane = Zotero.getActiveZoteroPane();
    const selected =
        (typeof items !== "undefined" && items.length) ? items
            : (zoteroPane ? zoteroPane.getSelectedItems() : []);

    if (!selected.length) return "[HTML-Table] 아무 항목도 선택되지 않아미다.";

    async function findPDFAtt(item) {
        return item.isPDFAttachment()
            ? item
            : (await item.getBestAttachments()).find(a => a.isPDFAttachment());
    }

    const rows = [];
    for (const it of selected) {
        const metaItem = it.isAttachment() ? it.getSource() : it;
        const title = Zotero.Utilities.htmlSpecialChars(metaItem.getField("title"));
        const year = metaItem.getField("date")?.match(/\d{4}/)?.[0] ?? "";

        const pdf = await findPDFAtt(it);
        const link = pdf
            ? `zotero://open-pdf/library/items/${pdf.key}`
            : `zotero://select/library/items/${metaItem.key}`;

        rows.push(
            `    <tr>
        <td class="year">${year}</td>
        <td><a href="${link}">${title}</a></td>
        </tr>`
        );
    }

    // ——— Pretty HTML table ————————————————————————————————————————————
    const table = `
<style>
  /* minimal, email-friendly styling */
  .zcopy {
    border-collapse: collapse;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 11px;
    line-height: 1.1;
    width: 100%;
  }
  .zcopy th, .zcopy td {
    border: 1px solid #ddd;
    // padding: 6px 10px;
    text-align: left;
  }
  .zcopy thead th {
    background: #f4f4f4;
    font-weight: 600;
  }
  .zcopy tbody tr:nth-child(even) { background: #fafafa; }
  .zcopy tbody tr:hover         { background: #eef6ff; }
  .zcopy a {
    text-decoration: none;
  }
  .zcopy a:hover { text-decoration: none; }
  .zcopy td.year { width: 5.5em; text-align: center; }
</style>

<table class="zcopy">
  <thead>
    <tr><th>Year</th><th>Title</th></tr>
  </thead>
  <tbody>
${rows.join("\n")}
  </tbody>
</table>`.trim();

    const cb = new Zotero.ActionsTags.api.utils.ClipboardHelper();
    cb.addText(table, "text/html");                           // rich HTML
    cb.addText(table.replace(/<\/?[^>]+>/g, ""), "text/unicode"); // plain fallback
    cb.copy();

    return `[HTML-Table] ${rows.length} 개의 행이 크ᆅ립보드에 복사되었습니다.`;
})();
