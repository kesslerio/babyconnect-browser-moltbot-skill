---
name: babyconnect-browser
description: Log baby activities (bottles, nursing, diapers, sleep) to Baby Connect via browser automation. Use when asked to "log a diaper", "record feeding", "track bottle", "baby ate", "log nursing", "baby is sleeping", "record nap", "diaper change", "fed the baby".
metadata: {"openclaw": {"emoji": "👶", "requires": {"tools": ["browser", "exec"]}}}
---

# Baby Connect Browser Skill

Automates baby tracking on babyconnect.com using the `browser` tool.

## When to Use

- Logging diaper, bottle, nursing, or sleep events
- Editing or deleting Baby Connect entries

## Core Rules (Short)

- Always activate the form with native `act` clicks before `evaluate`.
- Use native setter + full event sequence for inputs.
- Verify summary text before saving.
- Never use JS `element.click()` for React UI buttons.

## Children Config

- Config: `skills/babyconnect-browser/.children.yaml`
- Resolve child IDs via env vars in the config.
- Use `resolve-children.js` to inject IDs into snippets.

## References

- `reference/bottle.md` — bottle logging (full JS)
- `reference/diaper.md` — diaper logging (act-only flow)
- `reference/nursing.md` — nursing logging
- `reference/sleep.md` — sleep logging
- `reference/utilities.md` — edit/delete, session checks
- `reference/auth.md` — credentials retrieval
- `reference/troubleshooting.md` — common issues
- `reference/notes.md` — key learnings and changelog
- `reference/dom-reference.md` — DOM/UI notes
