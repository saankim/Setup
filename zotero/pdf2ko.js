/** 	 * Translate PDF using pdf2zh and attach the translated versions to the parent item
     * @author liszt01
     * @usage Select one or more items or PDF attachments, then trigger this script
     * @link https://github.com/windingwind/zotero-actions-tags/discussions/491
     * @see https://github.com/windingwind/zotero-actions-tags/discussions/491
     */

// ---------- Configuration Section Start ----------
const pdf2zhPath = "/opt/homebrew/bin/pdf2zh";  // For Windows: "C:\\Users\\alice\\.local\\bin\\pdf2zh.exe"

const config = {
    li: "en",
    lo: "ko",
    s: "google",
    t: "4",
};
// ---------- Configuration Section End ----------

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function getPDFAttachment(item) {
    let pdfAttachment;

    if (item.isPDFAttachment()) {
        pdfAttachment = item;
    } else if (item.isRegularItem()) {
        const maxTries = 12;
        let attempts = 0;

        // Wait for Zotero Connector to save the PDF
        while (attempts < maxTries) {
            const pdfs = item.getAttachments()
                .map(id => Zotero.Items.get(id))
                .filter(att => att.isPDFAttachment());

            if (pdfs.length > 0) {
                if (attempts == 0) {
                    pdfAttachment = pdfs[0];
                } else {
                    // Wait for attachment manager (e.g., Attanger, ZotMoov, etc.) to move the PDF
                    await sleep(10000);
                    pdfAttachment = item.getBestAttachment();
                }
                break;
            }

            await sleep(5000);
            attempts++;
        }
    }

    if (!pdfAttachment) {
        throw new Error("[pdf2zh] PDF attachment not found within timeout.");
    }
    return pdfAttachment;
}

function buildOutputPaths(srcPDFPath) {
    const dir = PathUtils.parent(srcPDFPath);
    const baseName = PathUtils.filename(srcPDFPath).replace(/\.pdf$/i, "");

    return {
        mono: PathUtils.join(dir, `${baseName}-mono.pdf`),
        dual: PathUtils.join(dir, `${baseName}-dual.pdf`),
        dir,
    };
}

async function runPDF2zh(srcPDFPath, outputDir) {
    config.o = outputDir;
    const args = [srcPDFPath, ...Object.entries(config).flatMap(([k, v]) => [`-${k}`, v])];
    await Zotero.Utilities.Internal.exec(pdf2zhPath, args);
}

async function attachTranslatedPDF(parentItemID, dstPDFPath) {
    const zoteroPane = Zotero.getActiveZoteroPane();
    const addedItems = await zoteroPane.addAttachmentFromDialog(true, parentItemID, [dstPDFPath]);
    Zotero.debug(`[pdf2zh] Translated PDF attached: ${addedItems[0].getField("title")}`);
}

async function translatePDFAttachment(item) {
    try {
        if (!item) return;
        if (!item.isRegularItem() && !item.isPDFAttachment()) {
            throw new Error("[pdf2zh] Please select a regular item or PDF attachment.");
        }

        if (!await IOUtils.exists(pdf2zhPath)) {
            throw new Error(`[pdf2zh] Could not find pdf2zh at ${pdf2zhPath}.`);
        }

        const pdfAttachment = await getPDFAttachment(item);
        const srcPDFPath = await pdfAttachment.getFilePathAsync();
        const { mono, dual, dir } = buildOutputPaths(srcPDFPath);

        await sleep(60000);
        await runPDF2zh(srcPDFPath, dir);

        if (!await IOUtils.exists(mono)) {
            throw new Error(`[pdf2zh] mono PDF not found at ${mono}`);
        }
        if (!await IOUtils.exists(dual)) {
            throw new Error(`[pdf2zh] dual PDF not found at ${dual}`);
        }

        await attachTranslatedPDF(pdfAttachment.parentItemID, mono);
        await attachTranslatedPDF(pdfAttachment.parentItemID, dual);

        return `[pdf2zh] Translation and attachment complete: ${pdfAttachment.getField("title")}`;
    } catch (err) {
        Zotero.debug(err);
        return `[pdf2zh] Error: ${err.message}`;
    }
}

return await translatePDFAttachment(item);
