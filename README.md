# Tender Management Platform - Full-Stack Internship Assignment

## 🚀 Overview

This is a full-stack B2B tender-management platform that allows companies to:

-   Register and manage their company profiles
    
-   Create, edit, delete, and list tenders
    
-   Apply to tenders created by others
    
-   Search for companies by name or industry
    
-   View all applications received for tenders
    

Built using:

-   **Frontend**: Next.js (TypeScript)
    
-   **Backend**: Express.js (TypeScript)
    
-   **Database**: PostgreSQL
    
-   **Storage**: Supabase Storage
    
-   **Auth**: JWT
    

----------

## 🧰 Tech Stack

-   **Frontend**: Next.js 14+, Tailwind CSS, Axios
    
-   **Backend**: Express.js, Knex.js (for migrations), JWT, Joi
    
-   **Database**: PostgreSQL
    
-   **Storage**: Supabase (company logo uploads)
    

----------

## 🔧 Local Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/tender-platform.git
cd tender-platform

```

### 2. Backend Setup

```bash
cd backend
npm install

# Create a .env file and set:
# PORT=3005
# DATABASE_URL=postgres://user:pass@localhost:5432/tender_db
# JWT_SECRET=your_secret_key

# Run migrations
npx knex migrate:latest

# Start backend server
npm run dev

```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3005

# Start frontend dev server
npm run dev

```

### 4. Supabase Setup

-   Create a Supabase account & project
    
-   Create a bucket: `company-logos`
    
-   Get public bucket URL and insert it as needed when uploading images
    

----------

## 🔑 Authentication

-   Register/Login via email + password
    
-   JWT stored in `localStorage`
    
-   Protected routes (e.g., creating tenders, editing companies) require JWT token
    

----------

## 🗂 API Endpoints

### 🔐 Auth Endpoints
| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login and get JWT token |


### 🏢 Company Endpoints
| Method | Endpoint                              | Description                             |
|--------|---------------------------------------|-----------------------------------------|
| POST   | `/api/company`                        | Create a company profile                |
| GET    | `/api/company/me`                     | Get company profile of logged-in user   |
| PUT    | `/api/company`                        | Update logged-in user's company profile |
| GET    | `/api/company/search?query=xyz`     | Search by name or industry              |


### 📑 Tender Endpoints
| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/api/tender`       | Create a new tender          |
| GET    | `/api/tender`       | Get all tenders              |
| GET    | `/api/tender/mine`  | Get logged-in user's tenders |
| GET    | `/api/tender/:id`   | Get tender by ID             |
| PUT    | `/api/tender/:id`   | Update a tender              |
| DELETE | `/api/tender/:id`   | Delete a tender              |

### 📨 Applications Endpoints
| Method | Endpoint                          | Description                                 |
|--------|-----------------------------------|---------------------------------------------|
| POST   | `/api/applications/:tenderId`     | Submit an application for a tender          |
| GET    | `/api/applications/mine`          | Get tenders applied to by current company   |
| GET    | `/api/applications/tender/:id`    | Get all applications for a specific tender  |


----------

## 🖼️ Supabase Storage

-   Upload logo image to Supabase from frontend
    
-   Store public URL in PostgreSQL
    
-   Bucket: `company-logos`
    

----------

## 🧪 Testing the APIs

-   Use Postman or ThunderClient
    
-   Set JWT token in `Authorization: Bearer <token>` header for protected routes
    

----------

### 🧭 Frontend Routes
| Page                    | Path                               | Description                          |
|-------------------------|------------------------------------|--------------------------------------|
| Register/Login          | `/register`, `/login`              | Auth pages                           |
| Dashboard               | `/dashboard`                       | Main dashboard after login           |
| All Tenders             | `/tenders`                         | Lists all tenders                    |
| My Tenders              | `/tenders/mine`                    | Shows your company's tenders         |
| Create/Edit Tender      | `/tenders/form?id=optional`        | Form to add/edit a tender            |
| Apply to Tender         | `/tenders/applicationform`         | Form to apply to a tender            |
| Your Applications       | `/applications/mine`               | View tenders you applied to          |
| Applications per Tender | `/tenders/mine/applications`       | View applicants for your tender      |


----------

## ✨ Features Summary

-   ✅ Secure JWT Auth
    
-   ✅ Company Profile (CRUD)
    
-   ✅ Tenders (CRUD + View)
    
-   ✅ Apply to Tender
    
-   ✅ View applications
    
-   ✅ Server-side company search
    
-   ✅ Supabase image upload
    
-   ✅ Protected Routes
    


----------

## 📹  Video Link

> Link to Loom video walkthrough goes here

----------

## ✅ Done!

This completes the full-stack internship assignment. Reach out if you have any questions or want to explore advanced features like tender analytics, team roles, approval workflows, or notifications!