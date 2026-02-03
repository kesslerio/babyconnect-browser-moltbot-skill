# Log Bottle (React-Safe + Unit Handling)

## Complete Working Method (2026-01-29)

```javascript
(async () => {
  const CHILD_ID = '${BABYCONNECT_CHILD_A_ID}';  // Inject from .children.yaml + env
  const QUANTITY = 90;                  // Amount
  const UNIT = 'ml';                    // 'ml' or 'oz'
  const TIME = '8:15AM';                // Time string

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Native setter that React respects
  const setNativeValue = (el, val) => {
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    desc ? desc.set.call(el, val) : (el.value = val);
  };

  const dispatch = (el, type) => {
    el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
  };

  // Wait for dialog
  await sleep(400);

  // STEP 1: Select child (CRITICAL - activates form for React)
  const childEl = document.getElementById('dlgKid-' + CHILD_ID);
  if (childEl) {
    childEl.click();
    await sleep(200);
  }

  // STEP 2: Check and toggle unit if needed
  const unitEl = document.getElementById('bibunit');
  const currentUnit = unitEl?.innerText?.toLowerCase() || 'oz';

  if (currentUnit !== UNIT.toLowerCase()) {
    const unitToggle = document.querySelector('.unit-toggle, [data-testid="unit-toggle"], #bibunit');
    if (unitToggle) {
      unitToggle.click();
      await sleep(250);

      const newUnit = document.getElementById('bibunit')?.innerText?.toLowerCase();
      if (newUnit !== UNIT.toLowerCase()) {
        return `ERROR: Unit toggle failed. Expected ${UNIT}, still ${newUnit}`;
      }
    }
  }

  // STEP 3: Set time
  const timeInput = document.querySelector('#timeinput');
  if (timeInput && TIME) {
    timeInput.focus();
    setNativeValue(timeInput, TIME);
    dispatch(timeInput, 'input');
    dispatch(timeInput, 'change');
    timeInput.blur();
    await sleep(80);
  }

  // STEP 4: Set quantity with React-aware sequence
  const input = document.querySelector('#bibsize input');
  if (!input) return 'ERROR: Quantity input not found';

  input.focus();
  setNativeValue(input, '');
  dispatch(input, 'input');
  await sleep(50);

  setNativeValue(input, String(QUANTITY));
  dispatch(input, 'input');
  dispatch(input, 'change');
  await sleep(50);

  input.blur();
  dispatch(input, 'blur');
  await sleep(80);

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(30);

  // STEP 5: Verify quantity stuck
  if (input.value !== String(QUANTITY)) {
    input.focus();
    setNativeValue(input, '');
    for (const ch of String(QUANTITY)) {
      setNativeValue(input, (input.value || '') + ch);
      dispatch(input, 'input');
      await sleep(20);
    }
    dispatch(input, 'change');
    input.blur();
    await sleep(100);
  }

  if (input.value !== String(QUANTITY)) {
    return `ERROR: Quantity verification failed. Expected ${QUANTITY} but got ${input.value}`;
  }

  // STEP 6: Verify summary before save
  const summary = document.querySelector('#dlgDesc, .dlg-desc, [class*="dlg-desc"]')?.innerText || '';

  if (!summary.includes(String(QUANTITY))) {
    return `ERROR: Summary mismatch (value). Expected ${QUANTITY} in "${summary}"`;
  }

  if (!summary.toLowerCase().includes(UNIT.toLowerCase())) {
    return `ERROR: Summary mismatch (unit). Expected ${UNIT} in "${summary}"`;
  }

  // STEP 7: Save
  const saveBtn = document.querySelector('button.save, #dlgSave, [data-testid="save"]');
  if (!saveBtn) return 'ERROR: Save button not found';

  saveBtn.click();
  return `SAVED: ${QUANTITY}${UNIT} at ${TIME}`;
})()
```

## Step-by-Step

1. Open bottle dialog via native `act` click.
2. Execute the JS above via `evaluate` with parameters.
3. Check return value: `SAVED:` or `ERROR:`.

## Key Improvements (2026-01-29)

- React form activation via child selection first.
- Explicit unit detection and toggle.
- Pre-save summary verification.
- Native setter + event sequence for inputs.
