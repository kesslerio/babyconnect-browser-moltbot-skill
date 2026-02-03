# Utilities

## Check Recent Activity
```javascript
(() => {
  const entries = document.querySelectorAll('.st');
  const results = [];
  for (let i = 0; i < Math.min(entries.length, 5); i++) {
    const title = entries[i].querySelector('.st_tl')?.innerText || '';
    const time = entries[i].querySelector('.st_dsc')?.innerText?.split('\n')[0] || '';
    if (title) results.push(title + ' | ' + time);
  }
  return results.join('\n') || 'No entries';
})()
```

## Check Session Status
```javascript
(() => {
  if (document.querySelector('#username')) return 'LOGIN_REQUIRED';
  if (document.querySelector('.st')) return 'SESSION_ACTIVE';
  return 'UNKNOWN';
})()
```

## Edit Entry

1. Click edit on the entry.
```javascript
(() => {
  const TARGET = 'wet diaper';
  for (const entry of document.querySelectorAll('.st')) {
    if (entry.querySelector('.st_tl')?.innerText.includes(TARGET)) {
      entry.querySelector('a.edit')?.click();
      return 'CLICKED_EDIT';
    }
  }
  return 'NOT_FOUND';
})()
```

2. Wait for dialog, take snapshot, change type/size with native `act`.
3. Verify summary and click Save with native `act`.

## Delete Entry

1. Click delete on matching entry.
```javascript
(() => {
  const TARGET = 'wet diaper (small)';
  for (const entry of document.querySelectorAll('.st')) {
    if (entry.querySelector('.st_tl')?.innerText.includes(TARGET)) {
      entry.querySelector('a.delete')?.click();
      return 'CLICKED_DELETE';
    }
  }
  return 'NOT_FOUND';
})()
```

2. Wait for confirmation dialog.
3. Snapshot with `interactive=true` to find Ok button ref.
4. Click Ok with native `act` click (JS click will not work).
