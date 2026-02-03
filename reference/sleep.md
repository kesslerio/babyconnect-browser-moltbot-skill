# Log Sleep

```javascript
(async () => {
  const CHILD_ID = '${BABYCONNECT_CHILD_A_ID}';  // Inject from .children.yaml + env
  const START_TIME = '';  // Empty = now, or '10:00PM'
  const END_TIME = '';    // Empty = ongoing

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  await sleep(1500);

  // Select child (form activation)
  document.getElementById('dlgKid-' + CHILD_ID)?.click();
  await sleep(200);

  if (START_TIME) {
    const start = document.getElementById('timeinput');
    if (start) {
      start.value = START_TIME;
      start.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  if (END_TIME) {
    const end = document.getElementById('endtimeinput');
    if (end) {
      end.value = END_TIME;
      end.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  // Verify summary
  const summary = document.querySelector('#dlgDesc, .dlg-desc')?.innerText || '';
  if (START_TIME && !summary.includes(START_TIME)) {
    return `ERROR: Summary mismatch. Got: ${summary}`;
  }

  document.querySelector('button.save, #dlgSave')?.click();
  return 'OK';
})()
```
