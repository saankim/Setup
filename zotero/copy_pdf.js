// ────── ① “선택 항목” 안전하게 수집 ──────
const zoteroPane = Zotero.getActiveZoteroPane();
let selectedItems = (typeof items !== "undefined" && items.length)            // 다중 선택 트리거
    ? items
    : (zoteroPane ? zoteroPane.getSelectedItems() : []);                        // 단일 선택·컨텍스트 메뉴

if (!selectedItems.length) {
    return "[Copy PDF] 아무 항목도 선택되지 않았습니다.";
}

// ────── ② PDF 복사 로직 ──────
const clipboard = new Zotero.ActionsTags.api.utils.ClipboardHelper();

for (const it of selectedItems) {
    // PDF 첨부 찾기 (첨부에서 실행했을 땐 self, 아이템에서 실행했을 땐 첫 PDF)
    const pdfAtt = it.isPDFAttachment()
        ? it
        : (await it.getBestAttachments()).find(att => att.isPDFAttachment());

    if (!pdfAtt) {
        Zotero.warn(`[Copy PDF] ${it.getField("title")} 에 PDF 첨부가 없습니다.`);
        continue;
    }

    const pdfPath = await pdfAtt.getFilePathAsync();

    // macOS 는 한 파일만, Windows/Linux 는 복수 파일도 지원
    clipboard.addFile(pdfPath);
}

clipboard.copy();
return `[Copy PDF] 선택한 항목의 PDF가 클립보드에 복사되었습니다.`;
