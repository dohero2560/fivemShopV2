# DooDev Shop

A web application for selling DooDev with points-based system and Discord integration.

## Features

- Discord authentication
- Points-based payment system
- Script management
- Server IP verification
- Admin dashboard
- Payment slip upload and verification
- Real-time script updates

## Tech Stack

- Next.js 14 (App Router)
- MongoDB
- NextAuth.js
- TailwindCSS
- shadcn/ui

## Prerequisites

- Node.js 18+
- MongoDB database
- Discord application credentials

## Environment Variables

Copy `.env.example` to `.env` and fill in the following variables:

```env
# MongoDB connection string
DATABASE_URL=

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Discord OAuth
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# License verification
LICENSE_VERIFICATION_KEY=
```

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Initialize the database:
```bash
npm run init-db
# or
yarn init-db
# or
pnpm init-db
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Collections

- `users` - User accounts and points balance
- `scripts` - Available scripts for sale
- `purchases` - Script purchase records
- `payments` - Payment records and slip uploads
- `serverIps` - Server IP verification records
- `pointsPackages` - Available points packages

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - Discord OAuth authentication

### Scripts
- `GET /api/scripts` - Get all available scripts
- `POST /api/scripts` - Create a new script (admin only)
- `GET /api/scripts/[id]` - Get script details
- `PATCH /api/scripts/[id]` - Update script (admin only)
- `DELETE /api/scripts/[id]` - Delete script (admin only)

### Purchases
- `GET /api/purchases` - Get user's purchases
- `POST /api/purchases` - Create a new purchase

### Payments
- `GET /api/payments` - Get user's payments
- `POST /api/payments` - Create a new payment
- `GET /api/admin/payments` - Get all payments (admin only)
- `PATCH /api/admin/payments/[id]` - Update payment status (admin only)

### Server IPs
- `GET /api/server-ips` - Get user's server IPs
- `POST /api/server-ips` - Create or update server IP
- `DELETE /api/server-ips/[id]` - Delete server IP

## License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited. 