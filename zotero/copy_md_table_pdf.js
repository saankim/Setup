// ─── Copy a Markdown table: Year | Title ──────────────────────────────
// Save as “copy_md_table_year.js” in MyZotero/scripts.

(async function () {
    /* …unchanged setup code… */

    const rows = [];
    for (const it of selected) {
        const metaItem = it.isAttachment() ? it.getSource() : it;
        const title = metaItem.getField("title").replace(/\|/g, "–");
        const year = metaItem.getField("date")?.match(/\d{4}/)?.[0] ?? "";

        const pdf = await findPDFAtt(it);
        const link = pdf
            ? `zotero://open-pdf/library/items/${pdf.key}`
            : `zotero://select/library/items/${metaItem.key}`;

        // ▼ swapped order: Year first, then Title-link
        rows.push(`| ${year} | [${title}](${link}) |`);
    }

    // ▼ header swapped to Year | Title
    const header = "| Year | Title |\n| --- | --- |";
    const table = [header, ...rows].join("\n");

    /* …unchanged clipboard code… */
})();
