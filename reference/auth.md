# Authentication

Credentials stored in 1Password:
- Vault: `Clawd`
- Item: `Baby Connect`
- Fields: `username`, `password`

Retrieve password:
```bash
op read "op://Clawd/Baby Connect/password"
```

## Login (if needed)

```javascript
(() => {
  document.querySelector('#username').value = 'EMAIL';
  document.querySelector('#password').value = 'PASSWORD';
  document.querySelector('#save').click();
  return 'LOGIN_SUBMITTED';
})()
```
