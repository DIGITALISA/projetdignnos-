# MongoDB Atlas Deployment Readiness Audit

This document outlines the analysis of the current MongoDB integration and provides recommendations to ensure the project is ready for production deployment.

## 1. Security Analysis (Critical)

### 🚨 Critical Vulnerability: Plain Text Passwords

- **Issue**: The `User` model (`models/User.ts`) and registration API (`app/api/auth/register/route.ts`) store user passwords in plain text in the `rawPassword` field.
- **Risk**: If the database is compromised, all user passwords will be exposed. This violates standard security practices (GDPR, etc.).
- **Recommendation**: Remove the `rawPassword` field immediately from the schema and API. Only store the bcrypt hash.

### ⚠️ Hardcoded Credentials in Scripts

- **Issue**: Several scripts in the `scripts/` directory contain hardcoded MongoDB connection strings with usernames and passwords.
  - `scripts/test-mongodb.js`
  - `scripts/reset-admin-password.js`
  - `scripts/check-users.js`
- **Risk**: Committing these files to a public repository or sharing the code exposes your database credentials.
- **Recommendation**: Update these scripts to use `process.env.MONGODB_URI` and load environment variables using `dotenv`.

### Network Access

- **Action Required**: Ensure your MongoDB Atlas Network Access whitelist includes the IP addresses of your deployment platform (e.g., Vercel).
- **Tip**: For serverless platforms like Vercel, you often need to allow access from anywhere (`0.0.0.0/0`) or use a VPC peering solution if available.

## 2. Configuration & Connection

### Connection Logic (`lib/mongodb.ts`)

- **Status**: ✅ **Excellent**.
- **Details**: The implementation uses a caching mechanism (`global.mongoose`) which is the recommended pattern for Next.js in a serverless environment to prevent creating multiple connections on every request.
- **Connection Options**: The timeout settings are aggressive (good for failing fast) and `bufferCommands: false` is correctly set.

### Environment Variables

- **Action Required**: Ensure the `MONGODB_URI` variable is set in your production environment (e.g., Vercel Project Settings).
- **Format**: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

## 3. Data Models & Indexes

### User Schema (`models/User.ts`)

- **Indexes**:
  - `email`: Unique index (Good).
  - `memberId`: Sparse unique index (Good for incremental adoption).
- **Suggestions**:
  - If you plan to query users by `role` or `status` frequently (e.g., in Admin Dashboard), consider adding an index on `role` and `status`.
  - Example: `UserSchema.index({ role: 1, status: 1 });`

### Session Handling

- **Observation**: There is a `Session.ts` model but no clear usage in the auth flow (which uses JWT or similar). Ensure this model is actually needed or remove it to keep the schema clean.

## 4. Deployment Checklist

1. [ ] **Remove `rawPassword`**: Delete field from `User.ts` and `register/route.ts`.
2. [ ] **Clean Scripts**: Replace hardcoded URIs with `process.env.MONGODB_URI`.
3. [ ] **Environment Vars**: Set `MONGODB_URI` in production.
4. [ ] **Atlas Whitelist**: Add `0.0.0.0/0` (or specific IPs) to Atlas Network Access.
5. [ ] **Database User**: Ensure the database user has strictly necessary permissions (read/write on specific DB), not Admin privileges if possible.

## 5. Next Steps

Would you like me to proceed with:

1.  Removing the `rawPassword` vulnerability?
2.  Refactoring the scripts to use environment variables?
3.  Adding performance indexes to the User schema?
4.  Implementing a secure admin password reset flow?
