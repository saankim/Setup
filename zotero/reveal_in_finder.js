
const zoteroPane = Zotero.getActiveZoteroPane();
let selectedItems = (typeof items !== "undefined" && items.length)            // multi-select trigger
    ? items
    : (zoteroPane ? zoteroPane.getSelectedItems() : []);                         // single-select / context menu

if (!selectedItems.length) {
    return "[Reveal PDF] No item selected.";
}

// 2) Main logic --------------------------------------------------------------
for (const it of selectedItems) {
    // Find the PDF (use self if a PDF attachment is selected; otherwise choose the first PDF)
    const pdfAtt = it.isPDFAttachment()
        ? it
        : (await it.getBestAttachments()).find(att => att.isPDFAttachment());

    if (!pdfAtt) {
        Zotero.warn(`[Reveal PDF] “${it.getField("title")}” has no PDF attachment.`);
        continue;
    }

    const pdfPath = await pdfAtt.getFilePathAsync();

    // macOS --------------------------------------------------------------------
    if (Zotero.isMac) {
        // “open -R” reveals & selects the file in Finder
        await Zotero.Utilities.Internal.exec("/usr/bin/open", ["-R", pdfPath]);
        continue;
    }

    // Windows ------------------------------------------------------------------
    if (Zotero.isWin32) {
        // explorer /select, "C:\path\file.pdf"
        await Zotero.Utilities.Internal.exec("explorer.exe", ["/select,", pdfPath]);
        continue;
    }

    // Linux & everything else --------------------------------------------------
    // xdg-open the containing folder (file will not be pre-selected, but it’s the best cross-distro option)
    const dirPath = PathUtils.parent(pdfPath);
    await Zotero.Utilities.Internal.exec("/usr/bin/xdg-open", [dirPath]);
}

return "[Reveal PDF] Done.";
