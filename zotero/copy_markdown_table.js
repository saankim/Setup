// ─── CONFIGURABLE FIELDS ────────────────────────────────────────────────────
/** Which Zotero fields to include. */
const columns = [
    { label: "Key", get: i => i.key },
    { label: "Title", get: i => i.getField("title") },
    { label: "Year", get: i => (i.getField("date") || "").slice(0, 4) },
    {
        label: "Author", get: i => {
            const c = i.getCreators();
            return c.length ? `${c[0].lastName}${c.length > 1 ? " et al." : ""}` : "";
        }
    },
    { label: "Journal", get: i => i.getField("publicationTitle") },
    { label: "DOI", get: i => i.getField("DOI") }
];
/** Collapse whitespace & escape pipes in cell text? */
const tidyText = true;
// ────────────────────────────────────────────────────────────────────────────

// Grab items from selection or collection
if (item) return;                     // ensure we only run once
let zoteroPane = Zotero.getActiveZoteroPane();
let selected = items?.length ? items :
    (collection ? collection.getChildItems(true) : zoteroPane.getSelectedItems());

if (!selected?.length) return "[Copy Markdown Table] No items selected.";

const esc = s => s.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
const cell = s => tidyText ? esc(s ?? "") : (s ?? "");

let header = "|" + columns.map(c => ` ${c.label} `).join("|") + "|";
let divider = "|" + columns.map(() => ":-").join("|") + "|";
let rows = selected.map(it =>
    "|" + columns.map(c => ` ${cell(c.get(it))} `).join("|") + "|"
).join("\n");

const mdTable = `${header}\n${divider}\n${rows}`;

const clipboard = new Zotero.ActionsTags.api.utils.ClipboardHelper();
clipboard.addText(mdTable, "text/unicode");
clipboard.copy();

return `[Copy Markdown Table] Copied ${selected.length} rows to clipboard.`;
