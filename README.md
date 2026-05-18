# CMSC 127 LTO Information Management System

## 📌 Project Overview

This project is a simplified **Land Transportation Office (LTO) Information Management System**.

It allows LTO personnel to:

* Manage drivers, vehicles, registrations, and violations
* Store and update records
* Generate SQL-based reports

---

## 🛠 Tech Stack

* **Frontend + Backend:** Next.js (React)
* **Database:** MariaDB
* **Language:** JavaScript

---

## 📁 Project Structure

```
cmsc-127-st1-2l-casmamper-final-project/
├── database/              # SQL file (schema + data + reports)
├── src/
│   ├── app/               # Next.js pages + API routes
│   │   └── api/
│   │       └── test-db/   # Test API route for DB connection
│   ├── lib/
│   │   └── db.js          # MariaDB connection pool
├── .env.example           # Environment variables template
├── README.md
├── package.json
```

---

## ⚙️ Local Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Install MariaDB

Download and install MariaDB:
https://mariadb.org/download/

During installation:

* Set a **root password**
* Use default port: `3306`

---

### 3. Import the database

Open MariaDB:

```bash
mysql -u root -p
```

Then run:

```sql
SOURCE C:/path/to/project/database/castillo_guarte_maminta_perez_PM3.sql;
```

Example:

```sql
SOURCE C:/Users/YourName/Desktop/cmsc-127-st1-2l-casmamper-final-project/database/castillo_guarte_maminta_perez_PM3.sql;
```

Then verify:

```sql
USE LTOIMS;
SHOW TABLES;
```

---

### 4. Create your environment file

Copy `.env.example`:

```bash
cp .env.example .env.local
```

Then edit:

```env
DB_PASSWORD=your_mariadb_password
```

---

### 5. Run the project

```bash
npm run dev
```

---

### 6. Test database connection

Open:

```
http://localhost:3000/api/test-db
```

If successful, you should see driver data.

---

## ⚠️ Important Notes

* Do **NOT** commit `.env.local`
* Each developer should use their own MariaDB password
* Make sure MariaDB is running before starting the app

---

## 🚧 Current Status

* [x] Database design (ERD, RM)
* [x] SQL file (schema + data + reports)
* [x] Next.js project initialized
* [x] Database connection established
* [ ] API routes for each module
* [ ] Frontend pages
* [ ] Final integration

---

## 👥 Team Members

* Castillo, Sean Carlo
* Maminta, Lawrence Andrew
* Perez, Desmond Rainier

---

## 🎯 Notes for Developers

This repository already includes:

* Database connection setup
* A working test API route (`/api/test-db`)

You can start working on:

* API routes (`/api/drivers`, `/api/vehicles`, etc.)
* Frontend pages inside `src/app`

Refer to the test route as a guide for database queries.

---
