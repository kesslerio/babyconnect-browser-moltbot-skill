# Log Diaper (Step-by-Step)

Proven working method as of 2026-01-23.

## Steps

1. Ensure browser is on Baby Connect.
```
browser action=tabs profile=clawd
```

2. Snapshot and click "Diaper" link.
```
browser action=snapshot profile=clawd targetId=<tab_id>
# Find: link "Diaper" [ref=eXX]
browser action=act profile=clawd targetId=<tab_id> request={"kind": "click", "ref": "eXX"}
```

3. Wait for dialog.
```
browser action=act profile=clawd targetId=<tab_id> request={"kind": "wait", "timeMs": 1500}
```

4. Snapshot dialog to locate refs.
```
browser action=snapshot profile=clawd targetId=<tab_id>
```

5. Click child (default from config unless specified).
```
browser action=act profile=clawd targetId=<tab_id> request={"kind": "click", "ref": "<child_ref>"}
```

6. Click diaper type (e.g., "BM + Wet").
```
browser action=act profile=clawd targetId=<tab_id> request={"kind": "click", "ref": "<bm_wet_ref>"}
```

7. Select size.
```
browser action=act profile=clawd targetId=<tab_id> request={"kind": "select", "ref": "<combobox_ref>", "values": ["Medium"]}
```

8. Verify summary textbox in snapshot.

9. Click Save.
```
browser action=act profile=clawd targetId=<tab_id> request={"kind": "click", "ref": "<save_ref>"}
```

10. Verify entry was created.
```
browser action=act profile=clawd targetId=<tab_id> request={"kind": "evaluate", "fn": "() => document.querySelector('.st .st_tl')?.innerText || 'ERR: No entry'"}
```
