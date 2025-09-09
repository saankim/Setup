// ─── Compute Time‑to‑First‑Citation using OpenAlex ─────────────────────────
// Save as “time_to_first_citation.js” in MyZotero/scripts.
//
// Adds a line like "TFC: 2 years" to the item’s Extra field and tags the item
// *Hit‑Early* (≤1 yr) or *Slow‑Burn* (>5 yrs).

(async function () {
    const THIS_YEAR = (new Date()).getFullYear();

    const zoteroPane = Zotero.getActiveZoteroPane();
    const selected =
        (typeof items !== "undefined" && items.length) ? items
            : (zoteroPane ? zoteroPane.getSelectedItems() : []);

    if (!selected.length) return "[TFC] 아무 항목도 선택되지 않았습니다.";

    const tagEarly = "Hit‑Early";
    const tagSlow = "Slow‑Burn";

    let processed = 0;

    for (const it of selected) {
        const doi = it.getField("DOI");
        if (!doi) continue;

        // --- Call OpenAlex --------------------------------------------------
        const url = `https://api.openalex.org/works/doi:${encodeURIComponent(doi)}`;
        let json;
        try {
            const resp = await Zotero.HTTP.request("GET", url, { timeout: 10000 });
            json = JSON.parse(resp.responseText);
        } catch (e) {
            Zotero.warn(`[TFC] ${doi} → OpenAlex 호출 실패: ${e}`);
            continue;
        }

        if (!json.counts_by_year?.length) continue;

        // Publication year
        const pubYear = (it.getField("date") || "").match(/\d{4}/);
        if (!pubYear) continue;

        // find earliest citing year with >0 citations
        const firstCitedYear = json.counts_by_year
            .filter(o => o.cited_by_count > 0)
            .reduce((min, o) => o.year < min ? o.year : min, Infinity);

        if (!isFinite(firstCitedYear) || firstCitedYear < pubYear) continue;

        const delta = firstCitedYear - pubYear;

        // --- Write back to item --------------------------------------------
        const extra = it.getField("extra") || "";
        const newExtra = extra
            .replace(/TFC:.*?\n?/i, "")        // remove old line, if any
            + `TFC: ${delta} year${delta === 1 ? "" : "s"}\n`;
        it.setField("extra", newExtra.trim());

        // Tagging
        if (delta <= 1) it.addTag(tagEarly);
        if (delta > 5) it.addTag(tagSlow);

        await it.saveTx();
        processed++;
    }

    return `[TFC] ${processed} 개 항목에 Time‑to‑First‑Citation 정보를 추가했습니다.`;
})();
