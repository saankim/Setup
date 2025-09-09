// ─── Copy Markdown links with citation keys ────────────────────────────────
// Save as e.g. “copy_md_citekey_link.js” in MyZotero/scripts
//
// Output format (one line per item):
//   [@smith2022](zotero://select/library/items/ABCDE123)
// ───────────────────────────────────────────────────────────────────────────

// 1) Gather selection -------------------------------------------------------
const zoteroPane = Zotero.getActiveZoteroPane();
const selectedItems =
    (typeof items !== "undefined" && items.length) ? items
        : (zoteroPane ? zoteroPane.getSelectedItems() : []);

if (!selectedItems.length) {
    return "[Copy MD Link] 아무 항목도 선택되지 않았습니다.";
}

// 2) Helper: try to get a Better BibTeX citation key ------------------------
function getCiteKey(it) {
    // Better BibTeX exposes the key via item.citationKey (≥v6.6) or via an API
    if (it.citationKey) return it.citationKey;

    // Fallback: AuthorLastName + Year (very naive)
    const firstCreator = it.getCreators()[0];
    const last = firstCreator ? firstCreator.lastName || firstCreator.name : "noauthor";
    const year = (it.getField("date") || "").slice(0, 4) || "n.d.";
    return `${last}${year}`;
}
// ——— Helper to locate a PDF attachment ————————————————————————
async function findPDFAtt(item) {
    return item.isPDFAttachment()
        ? item
        : (await item.getBestAttachments()).find(att => att.isPDFAttachment());
}

// 3) Build Markdown snippet -------------------------------------------------
const lines = [];
for (const it of selectedItems) {
    const citekey = getCiteKey(it);

    // Prefer an attached PDF, fall back to the parent item
    const pdfAtt = await findPDFAtt(it);
    let link;
    if (!pdfAtt) {
        Zotero.warn(`[Copy PDF Link] “${it.getField("title")}” 에 PDF 첨부가 없습니다. 기본 링크를 사용합니다.`);
        lines.push(`zotero://select/library/items/${it.key}`);
        continue;
    }
    if (pdfAtt) {
        link = `zotero://open-pdf/library/items/${pdfAtt.key}`;
    } else {
        link = `zotero://select/library/items/${it.key}`;
        Zotero.warn(`[Copy MD Link] “${it.getField("title")}” 에 PDF 첨부가 없습니다. 기본 링크를 사용합니다.`);
    }

    lines.push(`[@${citekey}](${link})`);
}

// 4) Copy to clipboard ------------------------------------------------------
if (!lines.length) return "[Copy MD Link] 선택 항목에서 링크를 만들지 못했습니다.";

const clipboard = new Zotero.ActionsTags.api.utils.ClipboardHelper();
clipboard.addText(lines.join("\n"), "text/unicode");   // one link per line
clipboard.copy();

return `[Copy MD Link] ${lines.length} 개의 링크가 클립보드에 복사되었습니다.`;
