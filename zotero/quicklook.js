const pane = Zotero.getActiveZoteroPane();
const sel = (typeof items !== "undefined" && items.length) ? items : pane.getSelectedItems();
if (!sel.length) return "[Quick Look] Nothing selected.";

for (const it of sel) {
    const pdf = it.isPDFAttachment() ? it
        : (await it.getBestAttachments()).find(att => att.isPDFAttachment());
    if (!pdf) { Zotero.warn(`[Quick Look] ${it.getField("title")} has no PDF.`); continue; }
    const path = await pdf.getFilePathAsync();
    // Non‑blocking ⇒ one window per PDF
    Zotero.Utilities.Internal.exec("/usr/bin/qlmanage", ["-p", path], { background: true });
}
return "[Quick Look] PDFs opened.";
