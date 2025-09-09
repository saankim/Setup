#!/usr/bin/env python3
import curses
import sys
from pathlib import Path

# ───────────────  tweak this list whenever you need  ────────────────
IGNORE_DIRS = {"wandb", "__pycache__", ".git"}          # add more names here


# ─── tree model ─────────────────────────────────────────────────────
class Node:
    def __init__(self, path: Path, is_dir: bool):
        self.path = path
        self.is_dir = is_dir
        self.children: list["Node"] = []
        self.selected = False            # only meaningful for files


def build_tree(root: Path) -> Node:
    """
    Recursively build a Node tree, skipping anything in IGNORE_DIRS,
    and keeping only directories that eventually contain *.py files.
    """
    node = Node(root, root.is_dir())
    if node.is_dir:
        for child in sorted(root.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
            if child.is_dir():
                if child.name in IGNORE_DIRS:
                    continue                              # ← Skip it entirely
                sub = build_tree(child)
                if sub.children:                          # keep only useful dirs
                    node.children.append(sub)
            elif child.suffix == ".py":
                node.children.append(Node(child, False))
    return node


def flatten(node: Node, depth=0, out=None):
    if out is None: out = []
    out.append((node, depth))
    for c in node.children:
        flatten(c, depth + 1, out)
    return out


# ─── selection helpers (unchanged) ─────────────────────────────────
def set_subtree(node: Node, value: bool):
    if node.is_dir:
        for ch in node.children: set_subtree(ch, value)
    else:
        node.selected = value

def dir_status(node: Node):
    flags = {dir_status(ch) if ch.is_dir else ch.selected for ch in node.children}
    if flags == {True}: return True
    if flags == {False}: return False
    return "partial"

def toggle_node(node: Node):
    if node.is_dir:
        set_subtree(node, dir_status(node) is not True)
    else:
        node.selected = not node.selected

def collect_selected(node: Node, out=None):
    if out is None: out = []
    if node.is_dir:
        for ch in node.children: collect_selected(ch, out)
    elif node.selected:
        out.append(node.path)
    return out


# ─── curses UI (unchanged except header line) ──────────────────────
def curses_browser(stdscr, root_node: Node):
    curses.curs_set(False)
    items = flatten(root_node)
    idx, top = 0, 0

    def draw():
        stdscr.erase()
        max_rows, max_cols = stdscr.getmaxyx()
        view_rows = max_rows - 3
        nonlocal top
        if idx < top: top = idx
        elif idx >= top + view_rows: top = idx - view_rows + 1

        hdr = "Select files/dirs  (SPACE toggle, ENTER confirm, q quit)  [ignored: " \
              + ", ".join(sorted(IGNORE_DIRS)) + "]"
        stdscr.addstr(0, 0, hdr[:max_cols - 1])

        visible = range(top, min(top + view_rows, len(items)))
        for row, i in enumerate(visible, start=2):
            node, depth = items[i]
            prefix = ">>" if i == idx else "  "
            indent = "  " * depth
            if node.is_dir:
                state = dir_status(node)
                mark = "[x]" if state is True else "[-]" if state == "partial" else "[ ]"
                name = node.path.name + "/"
            else:
                mark = "[x]" if node.selected else "[ ]"
                name = node.path.name
            stdscr.addstr(row, 0, (f"{prefix} {indent}{mark} {name}")[:max_cols - 1])
        stdscr.refresh()

    while True:
        draw()
        k = stdscr.getch()
        if k in (curses.KEY_UP, ord("k")) and idx > 0: idx -= 1
        elif k in (curses.KEY_DOWN, ord("j")) and idx < len(items) - 1: idx += 1
        elif k == ord(" "): toggle_node(items[idx][0])
        elif k in (curses.KEY_ENTER, 10, 13): return collect_selected(root_node)
        elif k in (ord("q"), 27): return []


# ─── output printer (unchanged) ────────────────────────────────────
def emit(files):
    print("-----")
    for p in files:
        print(f"```{p}")
        sys.stdout.write(p.read_text(encoding="utf-8", errors="replace"))
        if not str(p).endswith("\n"): print()
        print("```")
        print()


# ─── main ──────────────────────────────────────────────────────────
def main():
    root = Path(".").resolve()
    tree = build_tree(root)
    if not tree.children:
        print("No .py files found (or all inside ignored dirs).", file=sys.stderr)
        return
    chosen = curses.wrapper(curses_browser, tree)
    if not chosen:
        print("No files selected.")
        return
    emit(chosen)


if __name__ == "__main__":
    main()
