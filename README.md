# Sahaj Swasthya – Smart Healthcare Queue System

> **Revolutionizing Hospital Visits with Slot-Based Booking & Automated Queue Management**  
> **CodeYatra2.0:Hackathon Project**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

##  The Problem
In typical government and semi-private hospitals in Nepal:
- **Long Queues:** Patients wait 4–6 hours across 5 counters (Registration, Doctor, Lab, Pharmacy).
- **No Visibility:** No way to know queue progress; elderly patients wait physically for hours.
- **Paper Waste:** Manual token slips get lost; lab reports require revisiting the hospital.
- **Inefficiency:** Staff manually call names; overcrowding in waiting areas.

## The Solution
**Sahaj Swasthya** is a unified digital queue system that replaces physical waiting with **smart time slots**.
- **Book Appointments:** Choose Department → Doctor → Time Slot .
- **Live Tracking:** Real-time status updates via dashboard & email.
- **Digital Reports:** Lab results delivered directly to email.
- **Smart Penalties:** Automated queue shifting for no-shows to ensure fairness.

---

##  Key Features

### For Patients
- **Hierarchical Booking:** Select Department → Doctor → Available Time Slot.
- **Live Dashboard:** Track token status, stage, and appointment time.
- **Email Notifications:** Get alerts when token is called, shifted, or reports are ready.
- **Digital Reports:** Download lab results without revisiting the hospital.

### For Staff
- **Queue Management:** Call next patient, move stages, mark completion.
- **Check-In System:** Mark patients as present to prevent penalty shifts.
- **Department View:** See queue sorted by Doctor & Department.
- **Report Upload:** Upload PDFs & trigger automatic patient emails.

### For Admins
- **Resource Management:** Add/Remove Departments & Doctors.
- **User Control:** Promote users to Staff/Admin or ban accounts.
- **System Oversight:** Monitor active queues and penalty logs.

### Smart Penalty System 
- **Grace Period:** 2 minutes after slot time.
- **Strike Rule:** Missed slot = Shifted behind 3 people (Next Slot).
- **Expulsion:** 3 missed slots = Token Cancelled.
- **Notifications:** Email alerts sent at every penalty stage.

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14 (App Router), JavaScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (bcryptjs, jsonwebtoken) |
| **Email** | Resend API |
| **Deployment** | Vercel (Frontend/API) + Atlas (DB) |

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Resend API Key (Free Tier)

### 2. Installation
```bash
git clone https://github.com/your-username/sahaj-swasthya.git
cd sahaj-swasthya
npm install

```
### 3. Environment Setup
Create a .env.local
```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sahaj-swasthya

# Security
JWT_SECRET=super_secret_complex_string_change_in_production

# Email
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

### 4. Run Development server
```bash
npm run dev

```

visit https://localhost:3000

### 5. Inital Admin Setup
1. Register a new account via ``/register``.
2. Go to MongoDB Atlas → Collections → users.
3. Find your user document and change role from "patient" to "admin".
4. Login again to access ``/admin``.

## Project Structure
```
sahaj-swasthya/
├── app/
│   ├── api/            # API Routes (Auth, Token, Queue, Admin)
│   ├── dashboard/      # Patient Booking & Status
│   ├── staff/          # Staff Queue Management
│   ├── admin/          # Admin Resource Management
│   ├── login/          # Auth Pages
│   └── register/       # Auth Pages
├── models/             # Mongoose Schemas (User, Token, Dept, Doctor)
├── lib/                # Utils (DB, Auth, Email, Queue Logic)
├── context/            # Auth Context Provider
└── .env.local          # Environment Variables
```
## Liscence
MIT Liscence - Built for Hackathon purpose
