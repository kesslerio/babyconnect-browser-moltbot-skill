# Log Nursing

```javascript
(async () => {
  const CHILD_ID = '${BABYCONNECT_CHILD_A_ID}';  // Inject from .children.yaml + env
  const LEFT_MINS = 5;
  const RIGHT_MINS = 10;
  const TIME = '8:15AM';

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  await sleep(1500);

  // Select child (form activation)
  document.getElementById('dlgKid-' + CHILD_ID)?.click();
  await sleep(200);

  // Set time if provided
  if (TIME) {
    const timeInput = document.getElementById('timeinput');
    if (timeInput) {
      timeInput.value = TIME;
      timeInput.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  if (LEFT_MINS > 0) {
    const left = document.getElementById('left_side');
    if (left) {
      left.value = LEFT_MINS;
      left.dispatchEvent(new Event('input', {bubbles: true}));
    }
  }

  if (RIGHT_MINS > 0) {
    const right = document.getElementById('right_side');
    if (right) {
      right.value = RIGHT_MINS;
      right.dispatchEvent(new Event('input', {bubbles: true}));
    }
  }

  // Verify summary
  const summary = document.querySelector('#dlgDesc, .dlg-desc')?.innerText || '';
  if (!summary.includes(`${LEFT_MINS}m left`) && !summary.includes(`${RIGHT_MINS}m right`)) {
    return `ERROR: Summary mismatch. Got: ${summary}`;
  }

  document.querySelector('button.save, #dlgSave')?.click();
  return 'OK';
})()
```
