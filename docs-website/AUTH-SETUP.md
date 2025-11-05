# 🔐 Authentication Options for SkyGuyver Docs

## ✅ **Option 1: Simple JavaScript Password (IMPLEMENTED)**

**Current Setup:**

- **Password:** `SkyGuyver2025!`
- **Security Level:** Basic (client-side)
- **User Experience:** Single password prompt, stores in session
- **Good for:** Keeping casual visitors out

**How it works:**

- Prompts for password on first visit
- Stores authentication in browser session
- Protects all pages automatically
- Resets when browser is closed

---

## 🔐 **Option 2: Netlify Password Protection (Server-side)**

**More Secure Option - Add to `netlify.toml`:**

```toml
# Add this to your netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex"

# Password protect with HTTP Basic Auth
[[redirects]]
  from = "/*"
  to = "/login.html"
  status = 401
  force = false
  conditions = {Role = ["!"]}
```

**Then in Netlify Dashboard:**

1. Go to Site Settings → Access Control
2. Enable "Password Protection"
3. Set password: `SkyGuyver2025!`

---

## 🔐 **Option 3: IP Address Restriction**

**Add to `netlify.toml` to restrict by IP:**

```toml
# Only allow specific IP addresses
[[headers]]
  for = "/*"
  [headers.values]
    X-Forwarded-Proto = "https"

[[redirects]]
  from = "/*"
  to = "/403.html"
  status = 403
  conditions = {Country = ["!NZ"]}  # Only New Zealand IPs
```

---

## 🔐 **Option 4: Custom Login Page**

Create a beautiful login page with multiple users:

```html
<!-- login.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>SkyGuyver Documentation - Login</title>
    <style>
      body {
        font-family: Arial;
        background: #f5f5f5;
      }
      .login-form {
        max-width: 400px;
        margin: 100px auto;
        padding: 40px;
        background: white;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="login-form">
      <h2>🔐 SkyGuyver Documentation</h2>
      <form onsubmit="checkLogin(event)">
        <input type="text" id="username" placeholder="Username" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Access Documentation</button>
      </form>
    </div>
    <script>
      function checkLogin(e) {
        e.preventDefault();
        const users = {
          admin: "SkyGuyver2025!",
          client: "ClientAccess123",
          team: "TeamMember456",
        };
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (users[username] === password) {
          sessionStorage.setItem("skyguyver_auth", username);
          window.location.href = "/";
        } else {
          alert("Invalid credentials");
        }
      }
    </script>
  </body>
</html>
```

---

## 📋 **Current Password:**

### **🔑 Access Credentials:**

- **Password:** `SkyGuyver2025!`
- **Valid for:** Current browser session
- **Reset:** Close browser to logout

### **🔄 To Change Password:**

Edit the password in `docs/.vitepress/config.js`:

```javascript
const CORRECT_PASSWORD = "YourNewPassword123!";
```

---

## 🛡️ **Security Recommendations:**

### **For Basic Protection (Current):**

- ✅ Keeps casual visitors out
- ✅ Simple to implement
- ✅ No server configuration needed

### **For Higher Security:**

- 🔐 Use Netlify Password Protection (Option 2)
- 🔐 Add IP restrictions (Option 3)
- 🔐 Implement server-side authentication

### **Best Practices:**

- 🔄 Change password regularly
- 📱 Share password securely (encrypted chat/email)
- 🚫 Don't put password in public repos
- 🔍 Monitor site access logs

---

## 🎯 **Quick Actions:**

### **Change Current Password:**

1. Edit `docs/.vitepress/config.js`
2. Change `CORRECT_PASSWORD` value
3. Rebuild and deploy

### **Switch to Netlify Protection:**

1. Use Option 2 configuration
2. Set up in Netlify dashboard
3. More secure, server-side protection

**Your documentation is now password protected with `SkyGuyver2025!`**
