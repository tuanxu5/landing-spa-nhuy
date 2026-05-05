# Administrator Seed Script

This document explains how to create the initial administrator account for the Spa Booking Landing Page backend.

## Overview

The seed script creates a default administrator account in the database with predefined credentials. This is necessary for first-time setup to allow access to the admin panel.

## Default Credentials

The seed script creates an administrator with the following credentials:

- **Username**: `admin`
- **Password**: `Admin@123`
- **Email**: `admin@spanhuy.com`

⚠️ **IMPORTANT SECURITY NOTE**: You **MUST** change the default password immediately after your first login using the change password endpoint.

## Prerequisites

1. MongoDB database must be running and accessible
2. `.env` file must be configured with the correct `MONGODB_URI`
3. Node.js and npm must be installed

## How to Run the Seed Script

### Method 1: Using npm script (Recommended)

```bash
npm run seed:admin
```

### Method 2: Using ts-node directly

```bash
npx ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts
```

## What the Script Does

1. **Connects to MongoDB** using the `MONGODB_URI` from your `.env` file
2. **Checks for existing admin** - If an administrator with username `admin` already exists, the script will skip creation and exit gracefully
3. **Hashes the password** using bcrypt with 10 salt rounds (same as the auth service)
4. **Creates the administrator** document in the `administrators` collection
5. **Displays the credentials** for your reference
6. **Closes the connection** and exits

## Expected Output

### Successful Creation

```
Connecting to MongoDB...
Connected to MongoDB successfully
Hashing password...
Creating administrator account...

✅ Administrator account created successfully!

Default credentials:
  Username: admin
  Password: Admin@123
  Email: admin@spanhuy.com

⚠️  IMPORTANT: Change the default password after first login!

Database connection closed
Seed script completed
```

### Admin Already Exists

```
Connecting to MongoDB...
Connected to MongoDB successfully
Administrator 'admin' already exists. Skipping creation.
Database connection closed
Seed script completed
```

## After Running the Script

1. **Test the login** using the default credentials at the `/auth/login` endpoint
2. **Change the password immediately** using the `/auth/change-password` endpoint
3. **Update the email** if needed through the admin panel (when implemented)

## Troubleshooting

### Error: MONGODB_URI environment variable is not set

- Ensure your `.env` file exists in the `backend-landing-spa` directory
- Verify that `MONGODB_URI` is defined in the `.env` file

### Error: Connection failed

- Check that your MongoDB instance is running
- Verify the connection string in `MONGODB_URI` is correct
- Ensure network access is allowed (for MongoDB Atlas, check IP whitelist)

### Error: Duplicate key error

- This means an administrator with the username `admin` already exists
- The script should handle this gracefully, but if you see this error, you can safely ignore it

## Security Best Practices

1. **Never commit** the `.env` file to version control
2. **Change default credentials** immediately after first use
3. **Use strong passwords** when changing from the default
4. **Limit access** to the seed script in production environments
5. **Run the seed script only once** during initial setup

## Related Documentation

- [Authentication README](./src/auth/README.md) - Details about the authentication system
- [Database Setup](./DATABASE_SETUP.md) - MongoDB configuration guide
- [Security Implementation](./SECURITY_IMPLEMENTATION.md) - Security features and best practices
