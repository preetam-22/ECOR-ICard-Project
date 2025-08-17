# ECOR I-Card Management System

A full-stack web application crafted for streamlined handling of gazetted and non-gazetted identity card applications by the East Coast Railway's IT Centre.

------------------------------------------------------------------------

## Table of Contents

-   [Key Features](#key-features)\
-   [Tech Stack](#tech-stack)\
-   [Project Structure](#project-structure)\
-   [Getting Started](#getting-started)\
-   [Environment Configuration](#environment-configuration)\
-   [Authentication & Authorization](#authentication--authorization)\
-   [Usage](#usage)
    -   [Admin Workflow](#admin-workflow)\
    -   [User Workflow](#user-workflow)\
-   [API Endpoints](#api-endpoints)\
-   [Security & Best Practices](#security--best-practices)\
-   [Contact](#contact)

------------------------------------------------------------------------

## Key Features

-   Dual-mode application: **Gazetted** & **Non-Gazetted** forms
-   Admin portal with session-based authentication
-   Application filtering by status and category
-   Update workflow with optional SI number injection
-   PDF generation with employee data, QR code, and embedded photos
-   Users can check status via Employee ID and DOB
-   Secure session handling and UI practices

------------------------------------------------------------------------

## Tech Stack

  Layer            Technologies
  ---------------- -------------------------------
  Frontend         HTML, CSS, 
  Backend          Node.js, Express.js
  Database         MongoDB (Mongoose)
  PDF Generation   Puppeteer and PDFkit
  Sessions         `express-session`
  QR Code          External API (qrserver)

------------------------------------------------------------------------

## Project Structure

    ECOR-ICard-Project/
    ├── config/              # Environment & config settings
    ├── controllers/         # Request handlers
    ├── middlewares/         # Express middleware
    ├── models/              # Mongoose schemas
    ├── public/
    │   ├── style_.css
    │   ├── style_admin.css
    │   ├── style_appln.css
    │   ├── style_print.css
    │   ├── style_user.css
    │   ├── script_admin.js
    │   ├── g20.jpg              
    │   ├──railway_logo.jpg     
    │   ├── index_admin.html
    │   ├── index_user.html
    │   ├── index_appln.html
    │   ├── index_G.html
    │   ├── index_NG.html
    │   ├── index_print.html
    ├── routes/              # API endpoints
    ├── utils/               # Helpers (e.g., PDF generators)
    ├── .gitignore
    ├── package.json
    ├── README.md
    └── server.js

------------------------------------------------------------------------

## Getting Started

### Prerequisites:

-   Node.js
-   MongoDB (local or cloud instance)

### Setup:

``` bash
git clone https://github.com/preetam-22/ECOR-ICard-Project.git
cd ECOR-ICard-Project
npm install
```

------------------------------------------------------------------------

## Environment Configuration

Create a `.env` file in the root:

``` env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecor_icard
SESSION_SECRET=replace_with_a_real_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=1234
UPLOAD_DIR=public/uploads
```

Integrate it by adding at the top of `server.js`:

``` js
require("dotenv").config();
```

------------------------------------------------------------------------

## Authentication & Authorization

-   Admin must log in via a secure session (hardcoded credentials for
    testing purposes).
-   Public cannot access `index_login.html` unless authenticated.
-   Logout invalidates session and prevents "back" navigation after
    logout (`Cache-Control: no-store`).

------------------------------------------------------------------------

## Usage

### Admin Workflow:

1.  Log in via `/index_login.html`
2.  View pending applications (Gaz / Non-Gaz)
3.  Update application, optionally adding SI number when closing
4.  Preview and download the I-Card PDF

### User Workflow:

1.  Visit `/index_user.html`
2.  Enter Employee ID + DOB in the correct category
3.  Status is displayed (Pending, Closed, etc.), or errors for mismatches

------------------------------------------------------------------------

## API Endpoints

  --------------------------------------------------------------------------
  Method   Route                     Description
  -------- ------------------------- ---------------------------------------
  POST     `/login`                  Authenticate admin

  GET      `/api/applications`       Fetch applications with optional filters

  PATCH    `/api/status/:id`         Update status + optional SI number

  GET      `/api/status-check`       Lookup status with Emp ID + DOB

  GET      `/api/preview/:id`        Retrieve HTML preview

  GET      `/api/print-all/:type`    Generate bulk print view (`Gazetted` or `Non-Gaz`)

  --------------------------------------------------------------------------

------------------------------------------------------------------------

## Security & Best Practices

-   Critical pages are session-protected and not cacheable
-   Use HTTPS and secure cookie flags in production
-   Migrate credentials to proper storage (such as hashed DB entries)
-   Sanitize form inputs and validate all user data

------------------------------------------------------------------------

## Contact
**Preetam Nayak**  
📧 [Email](preetamn223@gmail.com) 
🔗 [LinkedIn](https://www.linkedin.com/in/preetamn22)
🔗 [GitHub Profile](https://github.com/preetam-22)
