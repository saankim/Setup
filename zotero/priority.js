// ─── Compute a simple Reading‑Priority Score (RPS) ─────────────────────────
// Save as “reading_priority_score.js” in MyZotero/scripts.
//
// RPS = 2·ln(citations+1)  +  recencyBonus  +  venueBonus  +  tagBonus
//
//  * recencyBonus  = 3 if ≤2 yrs old, 2 if ≤5 yrs, 0 otherwise
//  * venueBonus    = 2 if journal is in the built‑in TOP_VENUES list
//  * tagBonus      = +1 per user tag in HIGH_PRIORITY_TAGS
//
// The script writes "RPS: X.Y" into the Extra field so you can sort on it.

(async function () {
    const THIS_YEAR = (new Date()).getFullYear();

    const TOP_VENUES = [  // Very rough list—edit to suit your field!
        "Nature", "Science", "Cell", "NeurIPS", "ICML", "ACL", "CVPR"
    ];
    const HIGH_PRIORITY_TAGS = ["must‑read", "review‑soon", "advisor‑recommend"];

    const zoteroPane = Zotero.getActiveZoteroPane();
    const selected =
        (typeof items !== "undefined" && items.length) ? items
            : (zoteroPane ? zoteroPane.getSelectedItems() : []);

    if (!selected.length) return "[RPS] 아무 항목도 선택되지 않았습니다.";

    let done = 0;

    for (const it of selected) {
        const doi = it.getField("DOI");
        if (!doi) continue;

        // ----- 1. Citation count via OpenAlex --------------------------------
        let cites = 0;
        try {
            const url = `https://api.openalex.org/works/doi:${encodeURIComponent(doi)}?select=cited_by_count`;
            const resp = await Zotero.HTTP.request("GET", url, { timeout: 8000 });
            cites = JSON.parse(resp.responseText).cited_by_count || 0;
        } catch { /* keep cites=0 */ }

        // ----- 2. Recency bonus ---------------------------------------------
        const pubYearM = (it.getField("date") || "").match(/\d{4}/);
        const pubYear = pubYearM ? parseInt(pubYearM[0], 10) : THIS_YEAR;
        const age = THIS_YEAR - pubYear;
        const recencyBonus = age <= 2 ? 3
            : age <= 5 ? 2
                : 0;

        // ----- 3. Venue bonus ------------------------------------------------
        const pubTitle = it.getField("publicationTitle") || "";
        const venueBonus = TOP_VENUES.some(v => pubTitle.includes(v)) ? 2 : 0;

        // ----- 4. Tag bonus --------------------------------------------------
        const tags = it.getTags();
        const tagBonus = tags.filter(t => HIGH_PRIORITY_TAGS.includes(t.tag)).length;

        // ----- 5. Final score ------------------------------------------------
        const rps = (2 * Math.log(cites + 1)) + recencyBonus + venueBonus + tagBonus;

        // ----- 6. Persist in Extra field ------------------------------------
        const extra = it.getField("extra") || "";
        const newExtra = extra.replace(/RPS:.*?\n?/i, "") + `RPS: ${rps.toFixed(2)}\n`;
        it.setField("extra", newExtra.trim());

        await it.saveTx();
        done++;
    }

    return `[RPS] ${done} 개 항목에 Reading‑Priority Score를 계산했습니다.`;
})();
