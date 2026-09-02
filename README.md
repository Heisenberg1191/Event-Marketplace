# Event Marketplace

A full-stack event services marketplace designed to connect customers with professional event vendors.

The platform aims to simplify the process of planning an event by allowing customers to discover vendors, compare services and packages, create event requirements, manage bookings, and track payments.

## Project Status

🚧 **Currently under active development**

The project currently has its backend foundation in place, including:

* Express.js server setup
* PostgreSQL database architecture
* Prisma ORM integration
* User and role management data models
* Vendor and category data models
* Event and service data models
* Booking and payment data models
* Review, notification, and shortlist data models
* Basic API health endpoint
* Centralized error handling

The marketplace APIs and frontend experience are currently being developed.

---

# The Problem

Planning an event often requires working with multiple vendors such as:

* Photographers
* Caterers
* Decorators
* DJs and entertainment providers
* Event planners
* Makeup artists
* Venues

Customers usually discover these services through fragmented sources such as social media, personal recommendations, and individual websites.

This creates several problems:

* Difficult vendor discovery
* Limited price transparency
* Difficulty comparing service packages
* Unorganized communication
* No centralized booking workflow
* Limited trust and review systems

**Event Marketplace aims to provide a centralized platform for discovering, comparing, and booking event services.**

---

# Core User Roles

The platform supports three primary roles.

## Customer

Customers can:

* Create and manage events
* Browse event vendors
* Explore vendor services
* Compare service packages
* Shortlist vendors
* Create bookings
* Track booking status
* Make payments
* Leave reviews after completed bookings

## Vendor

Vendors can:

* Create a business profile
* Add service categories
* Create service listings
* Create multiple service packages
* Upload portfolio images
* Manage booking requests
* Build their marketplace presence

## Admin

Administrators will manage the platform ecosystem, including:

* Vendor approval
* User management
* Marketplace moderation
* Category management
* Platform monitoring

---

# Core Marketplace Workflow

The intended marketplace workflow is:

```text
Customer
   │
   ▼
Create Event
   │
   ▼
Discover Vendors
   │
   ▼
Explore Services & Packages
   │
   ▼
Shortlist Vendors
   │
   ▼
Create Booking
   │
   ▼
Vendor Accepts / Rejects
   │
   ▼
Booking Confirmation
   │
   ▼
Payment
   │
   ▼
Event Completed
   │
   ▼
Customer Review
```

---

# Technology Stack

## Backend

* Node.js
* Express.js
* JavaScript (ES Modules)

## Database

* PostgreSQL
* Prisma ORM

## Authentication & Security

* JSON Web Tokens
* bcryptjs for password hashing
* Environment variables with dotenv

## Development Tools

* Nodemon
* Prisma CLI

---

# Project Structure

```text
Event-Marketplace/
│
├── README.md
│
└── server/
    │
    ├── prisma/
    │   ├── migrations/
    │   └── schema.prisma
    │
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   └── routes/
    │
    ├── .env.example
    ├── package.json
    ├── prisma.config.ts
    └── server.js
```

---

# Database Architecture

The database is designed around the complete event service lifecycle.

## User

The `User` model is the central identity model.

Key information includes:

* Name
* Email
* Password
* Phone number
* Role

Supported roles:

```text
CUSTOMER
VENDOR
ADMIN
```

---

## Vendor

Each vendor is associated with a user account.

Vendor information includes:

* Business name
* Description
* Location
* Approval status
* Cover image
* Logo image

A vendor can have:

* Multiple categories
* Multiple services
* Multiple portfolio images

---

## Category

Categories organize vendors by the type of services they provide.

Examples could include:

```text
Photography
Catering
Decoration
Music
Event Planning
Makeup
```

The database supports a many-to-many relationship between vendors and categories.

---

## Vendor Service

A vendor can create multiple services.

Each service contains:

* Title
* Description
* Service packages

For example:

```text
Vendor: ABC Photography

Service:
Wedding Photography

Packages:
├── Basic Package
├── Premium Package
└── Luxury Package
```

---

## Service Package

A service package represents a purchasable offering.

Each package includes:

* Package name
* Price
* Description

---

## Event

Customers can create events.

Event information includes:

* Event name
* Event type
* Event date
* Location
* Guest count
* Budget
* Description

---

## Event Service

An event can contain multiple required services.

For example:

```text
Wedding Event
│
├── Photography Package
├── Catering Package
├── Decoration Package
└── Entertainment Package
```

---

## Booking

A booking connects an event service with the vendor's selected service package.

Supported booking states are:

```text
PENDING
ACCEPTED
REJECTED
CONFIRMED
IN_PROGRESS
COMPLETED
CANCELLED
```

---

## Payment

Payments are associated with bookings.

Each payment tracks:

* Payment amount
* Payment status
* Creation date

---

## Review

Customers can review a completed booking.

Reviews include:

* Rating
* Comment
* Creation date

---

## Notification

The notification system is designed to inform users about important marketplace events.

Examples:

* Booking accepted
* Booking rejected
* Payment updates
* Event updates

---

## Shortlist

Customers can save vendors to a personal shortlist for later comparison.

A customer cannot add the same vendor multiple times.

---

# API Architecture

The backend follows a layered structure:

```text
Client Request
      │
      ▼
Routes
      │
      ▼
Controllers
      │
      ▼
Business Logic
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL Database
```

Currently, the server exposes the health route under:

```text
/api/health
```

Additional APIs for authentication, vendors, events, bookings, payments, reviews, and notifications are planned as the backend is developed.

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL

---

## Clone the Repository

```bash
git clone https://github.com/Heisenberg1191/Event-Marketplace.git
```

Move into the project:

```bash
cd Event-Marketplace
```

Then move into the server directory:

```bash
cd server
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_secret"
```

Never commit your actual `.env` file to GitHub.

---

## Database Setup

Run the Prisma migration:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

## Run the Development Server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

---

# Available Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Starts the development server using Nodemon    |
| `npm start`              | Starts the production server                   |
| `npx prisma migrate dev` | Creates and applies database migrations        |
| `npx prisma generate`    | Generates the Prisma client                    |
| `npx prisma studio`      | Opens the Prisma database management interface |

---

# Development Roadmap

## Phase 1 — Foundation

* [x] Express server setup
* [x] PostgreSQL database design
* [x] Prisma ORM integration
* [x] Core database models
* [x] Basic health API

## Phase 2 — Authentication

* [ ] User registration
* [ ] User login
* [ ] JWT authentication
* [ ] Password hashing
* [ ] Role-based authorization

## Phase 3 — Vendor Marketplace

* [ ] Vendor profile APIs
* [ ] Vendor approval workflow
* [ ] Categories
* [ ] Vendor services
* [ ] Service packages
* [ ] Portfolio management

## Phase 4 — Event Management

* [ ] Create events
* [ ] Update events
* [ ] Event service requirements
* [ ] Budget management

## Phase 5 — Booking System

* [ ] Booking requests
* [ ] Accept or reject bookings
* [ ] Booking lifecycle management
* [ ] Customer and vendor dashboards

## Phase 6 — Payments

* [ ] Payment integration
* [ ] Payment status tracking
* [ ] Booking payment records

## Phase 7 — Marketplace Experience

* [ ] Vendor search
* [ ] Category filtering
* [ ] Location-based discovery
* [ ] Shortlist system
* [ ] Vendor ratings
* [ ] Reviews

## Phase 8 — Frontend

* [ ] Customer interface
* [ ] Vendor dashboard
* [ ] Admin dashboard
* [ ] Responsive design

---

# Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add: your feature description"
```

5. Push your branch

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request

---

# License

This project is currently under development.

A license will be added to the repository before public production use.
