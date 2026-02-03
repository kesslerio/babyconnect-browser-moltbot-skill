# Key Learnings

## React SPA Automation
1. Always activate form first (select child) to enable React events.
2. Use native `act` clicks for UI elements.
3. Use native setter for inputs.
4. Apply full event sequence: focus → set → input → change → blur.

## Unit Handling
1. Check current unit with `#bibunit`.
2. Toggle if needed and verify.
3. Verify unit in summary before saving.

## Defensive Verification
1. Pre-save check of summary text.
2. Verify both value and unit.
3. Return explicit errors on mismatch.

# Changelog

## 2026-01-29
- Added summary verification pattern
- Added explicit unit detection and toggle handling
- Improved bottle logging with form activation
- Fixed React state desync issues
- Removed legacy TODOs
