// ─── Paper‑Age statistics for the current selection ─────────────────────────
// Save as “paper_age_stats.js” in your MyZotero/scripts folder.

(function () {
    const zoteroPane = Zotero.getActiveZoteroPane();
    const selected =
        (typeof items !== "undefined" && items.length) ? items
        : (zoteroPane ? zoteroPane.getSelectedItems() : []);

    if (!selected.length) return "[Paper‑Age] 아무 항목도 선택되지 않았습니다.";

    // Helper: extract YYYY as an integer ────────────────────────────────────
    const getYear = it => {
        const y = (it.getField("date") || "").match(/\d{4}/);
        return y ? parseInt(y[0], 10) : null;
    };

    const years = selected.map(getYear).filter(y => y);
    if (!years.length) return "[Paper‑Age] 선택 항목에서 연도를 찾지 못했습니다.";

    years.sort((a, b) => a - b);
    const n = years.length;
    const mean = years.reduce((s, y) => s + y, 0) / n;
    const median = n % 2 ? years[(n - 1) / 2]
        : (years[n / 2 - 1] + years[n / 2]) / 2;

    // Build a histogram (bucket = 5 years) for a quick visual sense ——–––––
    const buckets = {};
    years.forEach(y => {
        const bucket = `${y - (y % 5)}–${y - (y % 5) + 4}`;
        buckets[bucket] = (buckets[bucket] || 0) + 1;
    });
    const histo = Object.entries(buckets)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([range, k]) => `${range}: ${k}`).join("\n");

    const msg = [
        `항목 수: ${n}`,
        `평균 연도: ${mean.toFixed(1)}`,
        `중앙값 연도: ${median}`,
        `최신 / 최오래: ${years[years.length - 1]} / ${years[0]}`,
        "",
        "5‑년 버킷 히스토그램",
        histo
    ].join("\n");

    Zotero.alert(null, "Paper‑Age Statistics", msg);
    return "[Paper‑Age] 통계가 표시되었습니다.";
})();
