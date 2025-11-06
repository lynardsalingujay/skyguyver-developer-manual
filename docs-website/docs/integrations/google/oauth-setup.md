# Google OAuth Setup Guide for VAPI.ai Integration

## Overview

This guide will help you set up Google OAuth authentication to integrate Google services with your VAPI.ai assistants. This configuration allows your clients to authenticate using their own Google accounts when interacting with your assistants.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [OAuth Configuration](#oauth-configuration)
4. [VAPI.ai Integration](#vapiai-integration)
5. [Testing](#testing)
6. [Publishing Your OAuth App](#publishing-your-oauth-app)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before starting, ensure you have:

- A Google account with access to Google Cloud Console
- A VAPI.ai account with appropriate permissions
- Access to your VAPI.ai dashboard
- Basic understanding of OAuth 2.0 flow

---

## Google Cloud Console Setup

### Step 1: Create or Select a Project

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Select **"New Project"** or choose an existing project
4. Enter a project name (e.g., "VAPI Assistant Integration")
5. Click **"Create"**
6. Note your Project ID for reference

### Step 2: Enable Required Google APIs

1. In the left sidebar, navigate to **"APIs & Services"** > **"Library"**
2. Search for and enable the APIs you need for your integration:
   - **Google Calendar API** - for calendar access
   - **Gmail API** - for email access
   - **Google Drive API** - for file access
   - **Google Sheets API** - for spreadsheet access
   - **Google Contacts API** - for contacts access
3. Click **"Enable"** for each required API

> **Note:** Only enable the APIs you actually need for your use case.

---

## OAuth Configuration

### Step 3: Configure OAuth Consent Screen

1. Navigate to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose user type:

   - Select **"External"** to allow any Google account user
   - Click **"Create"**

3. Fill in the **App Information**:

   - **App name:** Your application name (visible to users)
   - **User support email:** Your support email address
   - **App logo:** (Optional) Upload your company/app logo
   - **App domain:** Your website domain
   - **Authorized domains:** Add your domain(s)
   - **Developer contact information:** Your email address

4. Click **"Save and Continue"**

### Step 4: Add OAuth Scopes

1. On the **"Scopes"** page, click **"Add or Remove Scopes"**
2. Select the scopes you need based on your integration:

   **Common Scopes:**

   ```
   https://www.googleapis.com/auth/calendar.readonly
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/drive.readonly
   https://www.googleapis.com/auth/drive.file
   https://www.googleapis.com/auth/contacts.readonly
   https://www.googleapis.com/auth/userinfo.email
   https://www.googleapis.com/auth/userinfo.profile
   ```

3. Review selected scopes and click **"Update"**
4. Click **"Save and Continue"**

### Step 5: Add Test Users (Optional)

1. If your app is in **Testing** mode, add test users who can access the app
2. Enter email addresses of users who should have access during testing
3. Click **"Add"** then **"Save and Continue"**

> **Important:** In Testing mode, only listed users can authenticate. To allow all users, you must publish the app (see Step 7).

### Step 6: Create OAuth 2.0 Credentials

1. Navigate to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Configure the OAuth client:

   - **Name:** Enter a descriptive name (e.g., "VAPI.ai Integration")
   - **Authorized JavaScript origins:** (Optional) Add your domain
   - **Authorized redirect URIs:** Add VAPI.ai's callback URL
     ```
     https://api.vapi.ai/oauth/callback
     ```
     > **Note:** Verify the exact redirect URI from VAPI.ai documentation or support

6. Click **"Create"**

### Step 7: Save Your Credentials

After creating the OAuth client, you'll receive:

- **Client ID:** A long string ending in `.apps.googleusercontent.com`
- **Client Secret:** A secret key for authentication

**Important:**

- Copy and save these credentials securely
- Never commit these to version control
- Store them in a secure password manager or environment variables

---

## VAPI.ai Integration

### Step 8: Configure OAuth in VAPI.ai Dashboard

> **Important Update:** The Provider Keys section has been moved to **Settings → Integrations**

1. Log in to your [VAPI.ai Dashboard](https://dashboard.vapi.ai/)
2. Navigate to **"Settings"** (in the sidebar or top menu)
3. Click on **"Integrations"**
   - Direct URL: `https://dashboard.vapi.ai/settings/integrations`
4. Find **"Google Calendar"** or **"Provider Keys"** section
5. Click **"Add"** or **"Connect"** to add Google OAuth
6. Enter your Google OAuth credentials:

   - **Client ID:** Paste your Google Client ID
   - **Client Secret:** Paste your Google Client Secret
   - **Scopes:** The scopes will be pre-configured for Google Calendar
   - **Redirect URI:** Verify it matches what you added in Google Console

7. Click **"Save"** or **"Connect"**
8. Complete the OAuth authorization flow if prompted

### Step 9: Create Google Calendar Tool in Assistant

1. Navigate back to your **Assistants** list
2. Select the assistant you want to configure
3. Click on the **"Tools"** tab
4. Click **"Create Tool"**
5. Select **"Google Calendar"** from the available tool types
6. Configure the tool:
   - **Tool Name:** Give it a descriptive name (e.g., "Schedule Appointment")
   - **Description:** What the tool does
   - **Operations:** Select which calendar operations to enable:
     - Create events
     - Check availability
     - Update events
     - Delete events
7. The tool will automatically use the OAuth credentials configured in Settings → Integrations
8. Configure tool messages (optional):
   - Request Start: "Let me check your calendar..."
   - Request Complete: "I've scheduled that for you."
   - Request Failed: "I couldn't access the calendar right now."
9. Save the tool

### Step 10: Test the Integration

1. Test your assistant by triggering the Google Calendar tool
2. Verify the OAuth flow works correctly
3. Confirm events are created in the connected Google Calendar

---

## Multi-Client Setup: Important Limitations & Solutions

### ⚠️ Critical Limitation

**VAPI.ai's current Google OAuth implementation has an important constraint for multi-client scenarios:**

The Google Calendar integration configured in Settings → Integrations is **organization-level**, meaning:

- One Google account is connected per VAPI organization
- All assistants share the same Google Calendar connection
- **Each of your clients CANNOT use their own individual Google account** through the standard VAPI dashboard setup

### 🎯 Solutions for Multi-Client Integration

If you need each client to use their own Google Calendar account, you have two main approaches:

#### **Solution 1: Custom Tool with Your Own OAuth Backend (Recommended)**

Build a custom integration that handles OAuth for each client individually.

**Architecture:**

```
Client → VAPI Assistant → Custom Tool → Your Server → Google Calendar API
                                         ↓
                                   OAuth Token Storage
                                   (per client)
```

**Implementation Steps:**

1. **Build Your OAuth Backend:**

   - Create a server endpoint that handles Google OAuth 2.0 flow
   - Store each client's access and refresh tokens securely in your database
   - Link tokens to client identifiers (user ID, account ID, etc.)

2. **Create OAuth Flow for Clients:**

   ```
   GET /oauth/google/authorize?clientId=CLIENT_ID
   → Redirect to Google OAuth
   → Google redirects back to your callback
   GET /oauth/google/callback?code=AUTH_CODE&state=CLIENT_ID
   → Exchange code for tokens
   → Store tokens in database linked to CLIENT_ID
   ```

3. **Create Custom Tool in VAPI:**

   - In VAPI Dashboard → Assistant → Tools
   - Click "Create Tool"
   - Select "Function" type
   - Configure:
     ```json
     {
       "name": "schedule_appointment",
       "description": "Schedules an appointment in the client's Google Calendar",
       "parameters": {
         "type": "object",
         "properties": {
           "clientId": {
             "type": "string",
             "description": "Unique identifier for the client"
           },
           "summary": {
             "type": "string",
             "description": "Event title"
           },
           "startTime": {
             "type": "string",
             "description": "Start time in ISO 8601 format"
           },
           "endTime": {
             "type": "string",
             "description": "End time in ISO 8601 format"
           }
         },
         "required": ["clientId", "summary", "startTime", "endTime"]
       },
       "serverUrl": "https://your-server.com/api/calendar/create-event"
     }
     ```

4. **Implement Server Endpoint:**

   ```javascript
   // Example Node.js/Express endpoint
   app.post("/api/calendar/create-event", async (req, res) => {
     const { clientId, summary, startTime, endTime } =
       req.body.message.toolCalls[0].function.arguments;

     // Retrieve client's tokens from database
     const tokens = await getClientTokens(clientId);

     // Use tokens to call Google Calendar API
     const oauth2Client = new google.auth.OAuth2();
     oauth2Client.setCredentials(tokens);

     const calendar = google.calendar({ version: "v3", auth: oauth2Client });

     const event = await calendar.events.insert({
       calendarId: "primary",
       resource: {
         summary: summary,
         start: { dateTime: startTime },
         end: { dateTime: endTime },
       },
     });

     // Return result to VAPI
     res.json({
       results: [
         {
           toolCallId: req.body.message.toolCalls[0].id,
           result: `Event created: ${event.data.htmlLink}`,
         },
       ],
     });
   });
   ```

5. **Pass Client ID to Assistant:**
   When creating/calling the assistant, pass the client identifier:

   ```javascript
   // Example: Creating a call with client context
   const call = await vapi.calls.create({
     assistantId: "your-assistant-id",
     customer: {
       number: "+1234567890",
     },
     metadata: {
       clientId: "client-abc-123", // Pass client ID here
     },
   });
   ```

6. **Configure Assistant to Use Client ID:**
   In your assistant's system prompt, instruct it to use the client ID:
   ```
   When scheduling appointments, always use the clientId from the conversation metadata.
   The clientId is: \{\{metadata.clientId\}\}
   ```

**Advantages:**

- ✅ Complete control over OAuth flow
- ✅ Each client has their own Google Calendar access
- ✅ Secure token storage on your server
- ✅ Can refresh tokens automatically
- ✅ Works with any Google API, not just Calendar

**Disadvantages:**

- ❌ Requires custom backend development
- ❌ You're responsible for token management and security
- ❌ More complex architecture

---

#### **Solution 2: Use Third-Party OAuth Service (Nango)**

Use [Nango](https://www.nango.dev/) or similar OAuth middleware to handle multi-client authentication.

**Architecture:**

```
Client → Nango OAuth → VAPI Assistant with authorizationId
```

**Implementation Steps:**

1. **Set Up Nango Account:**

   - Sign up at [nango.dev](https://www.nango.dev/)
   - Create a Google Calendar integration
   - Note your Nango secret key and integration ID

2. **Configure Google OAuth in Nango:**

   - Add your Google Client ID and Secret to Nango
   - Configure the same scopes you set up in Google Cloud Console
   - Set the redirect URI to Nango's callback URL

3. **Implement OAuth Flow in Your App:**

   ```javascript
   // Step 1: Create Nango session for client
   const session = await nango.createSession({
     connectionId: clientId,
     integration: "google-calendar",
   });

   // Step 2: Redirect client to Nango OAuth flow
   window.location.href = session.authUrl;

   // Step 3: After OAuth, retrieve connection
   const connection = await nango.getConnection({
     connectionId: clientId,
     integration: "google-calendar",
   });

   const authorizationId = connection.connectionId;
   ```

4. **Use with VAPI Transient Assistant:**
   ```javascript
   // Create VAPI call with dynamic credentials
   const call = await vapi.calls.create({
     assistant: {
       // ... your assistant config
       tools: [
         {
           type: "googleCalendar",
           operation: "createEvent",
           authorizationId: authorizationId, // From Nango
         },
       ],
     },
   });
   ```

**Advantages:**

- ✅ Faster implementation (less custom code)
- ✅ Nango handles token refresh automatically
- ✅ Built-in OAuth management
- ✅ Each client has their own connection

**Disadvantages:**

- ❌ Additional third-party service dependency
- ❌ May have additional costs
- ❌ Less control over the OAuth flow
- ❌ Limited to Nango's supported integrations

---

#### **Solution 3: Separate VAPI Organizations (Not Recommended)**

Create a separate VAPI organization for each client.

**How it works:**

- Each client gets their own VAPI organization
- Each organization connects to that client's Google Calendar
- Manage multiple VAPI accounts

**Advantages:**

- ✅ Uses native VAPI Google Calendar integration
- ✅ No custom development needed

**Disadvantages:**

- ❌ Extremely difficult to manage at scale
- ❌ Much higher costs (separate billing for each organization)
- ❌ Can't centrally manage assistants
- ❌ Not practical for more than a few clients

---

### 📋 Comparison Table

| Feature                | Custom Backend   | Nango               | Separate Orgs    |
| ---------------------- | ---------------- | ------------------- | ---------------- |
| **Development Effort** | High             | Medium              | Low              |
| **Scalability**        | Excellent        | Excellent           | Poor             |
| **Cost**               | Low (hosting)    | Medium (Nango fees) | Very High        |
| **Control**            | Complete         | Limited             | Limited          |
| **Token Management**   | Manual           | Automatic           | Automatic        |
| **Best For**           | Large-scale apps | Quick MVP           | 1-5 clients only |

### 🎯 Recommended Approach

**For most use cases, we recommend Solution 1 (Custom Backend)** because:

- You maintain full control over security and data
- It scales to unlimited clients
- No dependency on third-party OAuth services
- One-time development effort with long-term benefits
- Lower ongoing costs

**Use Solution 2 (Nango) if:**

- You need to launch quickly (MVP stage)
- You have budget for third-party services
- You want to minimize development time

**Avoid Solution 3 (Separate Orgs)** unless you have fewer than 5 clients and don't plan to scale.

---

## Testing

### Step 10: Test the OAuth Flow (Standard Setup)

For single Google account integration:

1. Create a test assistant or use an existing one
2. Add the Google Calendar tool to your assistant
3. Trigger the Google authentication flow
4. Verify the OAuth consent screen appears correctly:

   - Check that your app name and logo display correctly
   - Verify the requested scopes are appropriate
   - Ensure the consent screen is clear and professional

5. Complete the authentication with a test Google account
6. Verify the assistant can access the authorized Google services
7. Test creating a calendar event through the assistant
8. Test token refresh if applicable

**Test Checklist (Standard Setup):**

- [ ] OAuth consent screen displays correctly
- [ ] User can successfully authenticate
- [ ] Assistant can create calendar events
- [ ] Assistant can check calendar availability
- [ ] Error handling works properly
- [ ] Tokens refresh automatically when expired

---

### Step 11: Test Multi-Client Setup (Custom Backend)

If you implemented a custom backend for multi-client support:

1. **Test OAuth Flow for Individual Clients:**

   - Register at least 2-3 test clients
   - Each client should complete the OAuth flow separately
   - Verify tokens are stored correctly in your database
   - Confirm each client's tokens are isolated from others

2. **Test Assistant with Multiple Clients:**

   ```javascript
   // Test Client A
   const callA = await vapi.calls.create({
     assistantId: "your-assistant-id",
     metadata: { clientId: "client-a" },
   });
   // Ask to schedule an event - verify it goes to Client A's calendar

   // Test Client B
   const callB = await vapi.calls.create({
     assistantId: "your-assistant-id",
     metadata: { clientId: "client-b" },
   });
   // Ask to schedule an event - verify it goes to Client B's calendar
   ```

3. **Verify Data Isolation:**

   - Ensure Client A's events don't appear in Client B's calendar
   - Confirm Client B cannot see Client A's events
   - Test that wrong clientId returns appropriate error

4. **Test Token Refresh:**

   - Wait for token expiration (or manually expire a token)
   - Verify your backend automatically refreshes tokens
   - Confirm operations continue working with refreshed tokens

5. **Test Error Scenarios:**
   - Client with revoked Google access
   - Client with expired refresh token
   - Invalid clientId
   - Network errors to Google API
   - Verify appropriate error messages returned to user

**Test Checklist (Multi-Client Setup):**

- [ ] Each client can complete OAuth independently
- [ ] Tokens are stored securely per client
- [ ] Assistant uses correct calendar for each client
- [ ] Data is properly isolated between clients
- [ ] Token refresh works automatically
- [ ] Error handling provides clear feedback
- [ ] Custom tool receives correct parameters
- [ ] Server endpoint handles concurrent requests
- [ ] Database queries are efficient at scale
- [ ] Logging captures all OAuth events

---

## Publishing Your OAuth App

### Step 12: Move from Testing to Production

If your app is in **Testing** mode, only test users can authenticate. To allow any Google user:

1. Navigate to **"APIs & Services"** > **"OAuth consent screen"**
2. Review your app configuration
3. Click **"Publish App"**
4. Confirm the publishing action

> **Note for Multi-Client Setup:** If you're using a custom backend, ensure your production environment is ready before publishing. All client OAuth tokens will use the production Google OAuth app.

**For Sensitive or Restricted Scopes:**

If you're using sensitive or restricted scopes (like Gmail access), you may need:

1. **OAuth Verification:**

   - Submit your app for Google verification
   - Provide information about your app's use case
   - Submit a privacy policy URL
   - Submit terms of service URL
   - This process can take several weeks

2. **Security Assessment:**
   - For some scopes, a third-party security assessment may be required
   - Be prepared to provide technical documentation
   - Budget 2-6 weeks for the verification process

### Verification Requirements

- **Privacy Policy:** Must be publicly accessible and describe data usage
- **Terms of Service:** Must outline user responsibilities and your service terms
- **Homepage:** Your application's homepage or landing page
- **App Domain:** Must be verified and match your authorized domains

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Access Blocked: This app's request is invalid"

**Solution:**

- Verify redirect URI in Google Console matches VAPI.ai's callback URL exactly
- Ensure there are no trailing slashes or typos
- Check that the OAuth client type is "Web application"
- For custom backend: Verify your redirect URI matches your server endpoint

#### Issue: "This app hasn't been verified by Google"

**Solution:**

- Add your test user's email to the test users list
- Or complete the Google verification process for production use
- Users can click "Advanced" > "Go to [App Name] (unsafe)" for testing

#### Issue: "The OAuth client was not found"

**Solution:**

- Verify the Client ID is correct in VAPI.ai
- Ensure the OAuth client hasn't been deleted in Google Console
- Check that you're using the correct Google Cloud project

#### Issue: Insufficient permissions or scope errors

**Solution:**

- Verify all required APIs are enabled in Google Cloud Console
- Check that scopes in VAPI.ai match those in Google Console
- Ensure the OAuth consent screen includes all necessary scopes
- Have users re-authorize to grant new permissions

#### Issue: Token expired or refresh failed

**Solution:**

- Ensure your OAuth configuration includes offline access
- Implement automatic token refresh in your VAPI.ai assistant
- Check that refresh tokens are being stored correctly
- For custom backend: Verify your token refresh logic is working

---

### Multi-Client Specific Issues

#### Issue: Wrong client's calendar is being accessed

**Solution:**

- Verify clientId is being passed correctly in assistant metadata
- Check your custom tool is extracting clientId from the correct location
- Confirm your database query is using the right clientId
- Add logging to track which tokens are being used for each request

#### Issue: "Client not authenticated" error

**Solution:**

- Verify the client has completed the OAuth flow
- Check that tokens are stored in your database
- Ensure tokens haven't been revoked by the user
- Test if refresh token is still valid

#### Issue: Calendar events appearing in wrong account

**Solution:**

- Review your backend code for token retrieval logic
- Check for any caching issues that might return wrong tokens
- Verify clientId is unique and not being reused accidentally
- Test with debug logging to trace which account is being accessed

#### Issue: VAPI tool not receiving clientId parameter

**Solution:**

- Ensure clientId is in the tool's function parameters schema
- Verify assistant system prompt includes clientId usage instructions
- Check that metadata is being passed when creating the call
- Review VAPI tool configuration for parameter mapping

#### Issue: High latency with custom backend

**Solution:**

- Implement caching for valid tokens (with expiry checks)
- Use connection pooling for database queries
- Optimize database indexes on clientId column
- Consider using Redis for token caching
- Monitor and optimize API response times

---

## Security Best Practices

### Credential Management

- **Never** expose your Client Secret in client-side code
- Store credentials in environment variables or secure vaults
- Rotate credentials periodically
- Use separate OAuth clients for development and production

### Scope Management

- Request only the minimum scopes necessary for your use case
- Clearly explain to users why each permission is needed
- Regularly audit and remove unused scopes

### Data Protection

- Never store user passwords
- Handle access tokens securely
- Implement token expiration and refresh
- Log all authentication attempts for security monitoring

### Multi-Client Security (Custom Backend)

#### Token Storage

- **Encrypt tokens at rest** in your database
- Use strong encryption algorithms (AES-256 or better)
- Store encryption keys separately from encrypted data
- Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault)

#### Access Control

- Implement row-level security in your database
- Ensure each API request validates clientId ownership
- Prevent clients from accessing other clients' tokens
- Use parameterized queries to prevent SQL injection

#### Example Secure Token Storage:

```javascript
// ✅ Good: Encrypted token storage
const crypto = require("crypto");

async function storeTokens(clientId, tokens) {
  const encryptedAccessToken = encrypt(tokens.access_token);
  const encryptedRefreshToken = encrypt(tokens.refresh_token);

  await db.query(
    "INSERT INTO client_tokens (client_id, access_token, refresh_token, expires_at) VALUES ($1, $2, $3, $4)",
    [clientId, encryptedAccessToken, encryptedRefreshToken, tokens.expiry_date]
  );
}

async function getTokens(clientId, requestingUserId) {
  // Verify requesting user owns this clientId
  const authorized = await verifyClientOwnership(clientId, requestingUserId);
  if (!authorized) throw new Error("Unauthorized");

  const result = await db.query(
    "SELECT access_token, refresh_token FROM client_tokens WHERE client_id = $1",
    [clientId]
  );

  return {
    access_token: decrypt(result.access_token),
    refresh_token: decrypt(result.refresh_token),
  };
}
```

#### Rate Limiting

- Implement rate limiting per client
- Prevent abuse of your OAuth endpoints
- Monitor for unusual authentication patterns
- Set reasonable limits (e.g., 10 OAuth attempts per hour per client)

#### Audit Logging

- Log all OAuth events (authorization, token refresh, revocation)
- Include timestamps, clientId, IP addresses
- Monitor for suspicious activity
- Retain logs for security investigations
- Alert on failed authentication attempts

```javascript
// Example audit logging
async function logOAuthEvent(event, clientId, metadata) {
  await db.query(
    "INSERT INTO oauth_audit_log (event_type, client_id, ip_address, user_agent, timestamp, metadata) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      event,
      clientId,
      metadata.ip,
      metadata.userAgent,
      new Date(),
      JSON.stringify(metadata),
    ]
  );
}

// Usage
await logOAuthEvent("token_refresh", clientId, {
  ip: req.ip,
  userAgent: req.headers["user-agent"],
  success: true,
});
```

### User Privacy

- Be transparent about what data you access
- Provide a clear privacy policy
- Allow users to revoke access easily
- Comply with GDPR, CCPA, and other privacy regulations
- For multi-client setups: clearly communicate data isolation policies

### Token Revocation

Implement a way for clients to revoke access:

```javascript
// Endpoint to revoke client access
app.post("/api/oauth/revoke", async (req, res) => {
  const { clientId } = req.body;

  // Get tokens
  const tokens = await getClientTokens(clientId);

  // Revoke with Google
  await oauth2Client.revokeToken(tokens.access_token);

  // Delete from database
  await db.query("DELETE FROM client_tokens WHERE client_id = $1", [clientId]);

  // Log the event
  await logOAuthEvent("token_revoked", clientId, { initiator: "user" });

  res.json({ success: true });
});
```

### Monitoring

- Monitor OAuth errors and failures
- Track unusual authentication patterns
- Set up alerts for suspicious activity
- Regularly review OAuth logs
- For custom backend: Monitor database performance and token table size

---

## Quick Reference Guide

### For Standard Single-Account Setup

1. ✅ Create Google Cloud project
2. ✅ Enable Google Calendar API
3. ✅ Configure OAuth consent screen
4. ✅ Create OAuth credentials
5. ✅ Go to VAPI → Settings → Integrations
6. ✅ Add Google OAuth credentials
7. ✅ Create Google Calendar tool in assistant
8. ✅ Test the integration

**Time estimate:** 20-30 minutes

---

### For Multi-Client Custom Backend Setup

1. ✅ Complete standard setup (steps 1-4 above)
2. ✅ Build OAuth backend server:
   - OAuth authorization endpoint
   - OAuth callback endpoint
   - Token storage (encrypted)
   - Token refresh logic
3. ✅ Create custom tool in VAPI (Function type)
4. ✅ Configure server URL to your backend
5. ✅ Implement client authentication flow
6. ✅ Test with multiple clients
7. ✅ Monitor and optimize

**Time estimate:** 4-8 hours (depending on complexity)

---

### Key URLs

- **Google Cloud Console:** https://console.cloud.google.com/
- **VAPI Dashboard:** https://dashboard.vapi.ai/
- **VAPI Settings (Integrations):** https://dashboard.vapi.ai/settings/integrations
- **VAPI Documentation:** https://docs.vapi.ai/
- **Google OAuth Documentation:** https://developers.google.com/identity/protocols/oauth2

---

### Environment Variables Template

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/oauth/callback

# VAPI Configuration
VAPI_API_KEY=your-vapi-api-key
VAPI_ASSISTANT_ID=your-assistant-id

# Database (for custom backend)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_SECRET=your-jwt-secret

# Optional: Nango
NANGO_SECRET_KEY=your-nango-secret
```

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [VAPI.ai Documentation](https://docs.vapi.ai/)
- [VAPI.ai Custom Tools Guide](https://docs.vapi.ai/tools/custom-tools)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Nango OAuth Platform](https://www.nango.dev/)
- [VAPI Discord Community](https://discord.gg/vapi)

---

## Support

For issues related to:

- **Google Cloud/OAuth:** Contact Google Cloud Support
- **VAPI.ai Integration:** Contact VAPI.ai support at support@vapi.ai or join their Discord community
- **This Guide:** Contact your development team or documentation maintainer

---

## Changelog

| Version | Date       | Changes                                                                                                                             |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-11-06 | Initial documentation created                                                                                                       |
| 1.1     | 2025-11-06 | Added multi-client setup solutions, custom backend implementation guide, comprehensive troubleshooting, and security best practices |

---

**Last Updated:** November 6, 2025  
**Author:** SkyGuyver Team  
**Status:** Active
