// ─── Copy PDF-links to clipboard ────────────────────────────────────────────
// Save as e.g. “copy_pdf_link.js” in your MyZotero/ scripts folder
// Trigger it from Zotero → Actions & Tags → Run JS (or bind a hotkey)

const zoteroPane = Zotero.getActiveZoteroPane();
let selectedItems =
    (typeof items !== "undefined" && items.length)        // multi-select trigger
        ? items
        : (zoteroPane ? zoteroPane.getSelectedItems() : []);  // single-select / context menu

if (!selectedItems.length) {
    return "[Copy PDF Link] 아무 항목도 선택되지 않았습니다.";
}

// ——— Helper to locate a PDF attachment ————————————————————————
async function findPDFAtt(item) {
    return item.isPDFAttachment()
        ? item
        : (await item.getBestAttachments()).find(att => att.isPDFAttachment());
}

// ——— Build link list ——————————————————————————————————————————
const links = [];
for (const it of selectedItems) {
    const pdfAtt = await findPDFAtt(it);
    if (!pdfAtt) {
        Zotero.warn(`[Copy PDF Link] “${it.getField("title")}” 에 PDF 첨부가 없습니다. 기본 링크를 사용합니다.`);
        links.push(`zotero://select/library/items/${it.key}`);
        continue;
    }
    links.push(`zotero://open-pdf/library/items/${pdfAtt.key}`);
}

if (!links.length) {
    return "[Copy PDF Link] 선택 항목에서 PDF 링크를 찾지 못했습니다.";
}

// ——— Copy to clipboard —————————————————————————————————————————
const clipboard = new Zotero.ActionsTags.api.utils.ClipboardHelper();
clipboard.addText(links.join("\n"), "text/unicode");   // one link per line
clipboard.copy();

return `[Copy PDF Link] ${links.length} 개의 링크가 클립보드에 복사되었습니다.`;
