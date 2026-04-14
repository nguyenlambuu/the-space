"""
extract_roadmap_tasks.py

Reads README.md, finds incomplete roadmap phases (those without ✅),
and emits a TASKS.md with each item broken into actionable sub-tasks.
"""

import re
import sys
from datetime import date

README = "README.md"

# ---------------------------------------------------------------------------
# Sub-task templates keyed by keywords found in the roadmap bullet text.
# Keywords are matched case-insensitively; first match wins.
# ---------------------------------------------------------------------------
SUBTASK_TEMPLATES = [
    {
        "keywords": ["seo", "generatemetadata", "metadata"],
        "heading": "SEO metadata (`generateMetadata`)",
        "tasks": [
            "Add `generateMetadata` export to `app/works/[id]/page.tsx`",
            "Add `generateMetadata` export to `app/seasons/[slug]/page.tsx`",
            "Populate `title`, `description`, and `openGraph` fields from Supabase data",
            "Add `<meta name=\"robots\">` to prevent indexing of draft content",
        ],
    },
    {
        "keywords": ["email", "signup", "newsletter"],
        "heading": "Email signup for collection updates",
        "tasks": [
            "Create `app/components/UI/EmailSignup.tsx` form component",
            "Add POST route handler at `app/api/subscribe/route.ts`",
            "Integrate signup form into Lobby (`app/page.tsx`)",
            "Add server-side validation and duplicate-email handling",
        ],
    },
    {
        "keywords": ["analytics", "vercel analytics"],
        "heading": "Analytics (Vercel Analytics)",
        "tasks": [
            "Install `@vercel/analytics` package (`npm i @vercel/analytics`)",
            "Add `<Analytics />` component to `app/layout.tsx`",
            "Add `<SpeedInsights />` component to `app/layout.tsx` (optional)",
            "Verify events appear in the Vercel dashboard after deploy",
        ],
    },
    {
        "keywords": ["about", "contact"],
        "heading": "About / contact page",
        "tasks": [
            "Create `app/about/page.tsx` as a Server Component",
            "Add 'About' link to `app/components/UI/BottomNav.tsx`",
            "Add 'About' link to `app/components/UI/TopAppBar.tsx`",
            "Match existing page design (no borders, warm neutral palette)",
        ],
    },
    {
        "keywords": ["3d", "three", "desktop mode"],
        "heading": "3D experience (optional desktop mode)",
        "tasks": [
            "Unpark `app/components/3d/Lobby.tsx` and `CollectionRoom.tsx`",
            "Add desktop-only conditional render in `app/layout.tsx` or `app/page.tsx`",
            "Ensure the 3D bundle is code-split so mobile users don't load it",
            "Test on desktop breakpoints (≥ 1024px)",
        ],
    },
    {
        "keywords": ["blog", "behind-the-scenes", "content"],
        "heading": "Behind-the-scenes content / blog",
        "tasks": [
            "Create `app/blog/page.tsx` (list view) and `app/blog/[slug]/page.tsx` (detail)",
            "Add `blog_posts` table to Supabase schema (title, slug, body, published_at)",
            "Add helper functions to `app/lib/supabase.ts` for blog queries",
            "Add 'Journal' or 'Blog' link to `app/components/UI/BottomNav.tsx`",
        ],
    },
]


def match_template(bullet_text: str) -> dict | None:
    lower = bullet_text.lower()
    for tmpl in SUBTASK_TEMPLATES:
        if any(kw in lower for kw in tmpl["keywords"]):
            return tmpl
    return None


def parse_roadmap(readme_path: str) -> list[dict]:
    """Return a list of {phase, items} for phases that are NOT marked ✅."""
    with open(readme_path, encoding="utf-8") as f:
        lines = f.readlines()

    phases = []
    current_phase = None
    in_roadmap = False

    for line in lines:
        stripped = line.rstrip()

        # Detect the roadmap section
        if re.match(r"^## Phase Roadmap", stripped):
            in_roadmap = True
            continue

        if not in_roadmap:
            continue

        # Stop at the next top-level ## section
        if re.match(r"^## ", stripped) and not re.match(r"^## Phase Roadmap", stripped):
            break

        # Phase heading (### Phase N ...)
        phase_match = re.match(r"^### (.+)", stripped)
        if phase_match:
            heading = phase_match.group(1)
            is_complete = "✅" in heading
            current_phase = {"heading": heading, "complete": is_complete, "items": []}
            phases.append(current_phase)
            continue

        # Bullet items inside a phase
        bullet_match = re.match(r"^- (.+)", stripped)
        if bullet_match and current_phase is not None:
            current_phase["items"].append(bullet_match.group(1))

    return [p for p in phases if not p["complete"]]


def render_tasks_md(phases: list[dict]) -> str:
    today = date.today().isoformat()
    lines = [
        "# Roadmap Task Breakdown",
        f"_Auto-generated from `README.md` on {today}. Tick off tasks as they are completed._",
        "",
    ]

    for phase in phases:
        lines.append(f"## {phase['heading']}")
        lines.append("")

        for item_text in phase["items"]:
            tmpl = match_template(item_text)
            if tmpl:
                lines.append(f"### {tmpl['heading']}")
                for task in tmpl["tasks"]:
                    lines.append(f"- [ ] {task}")
            else:
                # Fallback: emit the raw item as a single checkbox
                lines.append(f"### {item_text}")
                lines.append(f"- [ ] Implement: {item_text}")

            lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    try:
        phases = parse_roadmap(README)
    except FileNotFoundError:
        print(f"ERROR: {README} not found. Run this script from the repo root.", file=sys.stderr)
        sys.exit(1)

    if not phases:
        print("All roadmap phases are complete — nothing to do.", file=sys.stderr)
        sys.exit(0)

    print(render_tasks_md(phases))
