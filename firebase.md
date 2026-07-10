Below is a **master AI prompt** you can use with ChatGPT, Claude Code, OpenCode, Cursor, or GitHub Copilot to automatically integrate **Firebase** into your existing project with enterprise best practices.

---

# Master Prompt: Integrate Firebase into Existing Project

```text
You are a Senior Google Firebase Architect, Google Cloud Engineer, and Full Stack Software Engineer.

Your task is to integrate Firebase into my existing project without breaking any existing functionality.

## Tech Stack

Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Lucide React

Backend
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firebase Hosting (optional)

Deployment
- GitHub
- Vercel
- Automatic CI/CD

Code Quality
- TypeScript Strict Mode
- ESLint
- Prettier
- Modular Architecture
- Enterprise Folder Structure

-------------------------------------------------

YOUR RESPONSIBILITIES

First analyze the complete project.

Do not remove any existing components.

Do not change UI.

Do not delete any existing code.

Only extend the project.

-------------------------------------------------

STEP 1

Install all required Firebase packages.

npm install firebase

Configure Firebase SDK.

-------------------------------------------------

STEP 2

Create

/lib/firebase.ts

Configure

initializeApp()

Export

Auth

Firestore

Storage

-------------------------------------------------

STEP 3

Use Environment Variables

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

Never hardcode secrets.

-------------------------------------------------

STEP 4

Integrate Firebase Authentication

Support

• Email Password
• Google Login
• GitHub Login

Create

/login

/signup

/forgot-password

/profile

/logout

-------------------------------------------------

STEP 5

Create Authentication Context

Use React Context

Provide

Current User

Loading

Login

Logout

Register

Reset Password

Google Sign-In

GitHub Sign-In

-------------------------------------------------

STEP 6

Protect Routes

Create middleware.

Unauthenticated users

↓

Redirect to

/login

-------------------------------------------------

STEP 7

Integrate Firestore

Create collections

users

products

orders

categories

messages

notifications

reviews

settings

analytics

-------------------------------------------------

STEP 8

Automatically create a user document after successful signup.

Store

uid

name

email

photoURL

phone

role

status

createdAt

updatedAt

-------------------------------------------------

STEP 9

Integrate Firebase Storage

Support

Profile Images

Product Images

Documents

PDF

Video

-------------------------------------------------

STEP 10

Build reusable Firebase Hooks

useAuth()

useFirestore()

useStorage()

useUser()

-------------------------------------------------

STEP 11

Implement complete CRUD

Create

Read

Update

Delete

Use Firestore.

-------------------------------------------------

STEP 12

Implement Security Rules

Firestore

Storage

Authentication

Use enterprise-level least privilege access.

-------------------------------------------------

STEP 13

Create Loading States

Skeleton UI

Error Handling

Toast Notifications

Retry Logic

-------------------------------------------------

STEP 14

Optimize Performance

Lazy Loading

Dynamic Imports

Caching

Pagination

Infinite Scroll

Firestore Query Optimization

-------------------------------------------------

STEP 15

Configure Vercel Deployment

Automatically read

Environment Variables

Ensure production build passes.

-------------------------------------------------

STEP 16

Configure GitHub

Every push

↓

Automatically deploy

↓

Vercel

-------------------------------------------------

STEP 17

Generate

README.md

Installation Guide

Firebase Setup Guide

Deployment Guide

Environment Variables Guide

-------------------------------------------------

STEP 18

Create Documentation

Architecture Diagram

Authentication Flow

Firestore Structure

Storage Structure

Folder Structure

-------------------------------------------------

STEP 19

Follow Enterprise Standards

SOLID Principles

Reusable Components

Clean Architecture

Scalable Code

Production Ready

No duplicate code

Type Safe

-------------------------------------------------

STEP 20

Before modifying any file

Explain

Why it needs to change

What will change

What impact it has

Then implement the change.

-------------------------------------------------

FINAL REQUIREMENT

The project must be fully production-ready.

It must support Firebase Authentication, Firestore Database, Firebase Storage, secure route protection, automatic user creation, role-based authentication, and automatic deployment through GitHub and Vercel.

Do not stop until the Firebase integration is complete and verified.

If any required configuration is missing, identify it and generate the necessary code and setup instructions automatically.
```

This prompt instructs an AI coding assistant to analyze your existing codebase, integrate Firebase in a non-destructive way, implement authentication, Firestore, Storage, security, and prepare the project for automatic deployment through GitHub and Vercel using enterprise-level practices.
