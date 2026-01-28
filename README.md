# Budget & Wishlist Manager

A self-hostable Budget and Wishlist management application built with Next.js, SQLite, and Drizzle ORM.

## Features

- 📝 **Multiple Wishlists**: Create and manage multiple wishlists with individual budgets
- 💰 **Budget Tracking**: Track spending against budget limits for each wishlist
- 📊 **Total Savings Dashboard**: View combined savings across all wishlists
- 📜 **Activity History**: Complete history log of budget changes, item additions, and purchases
- 🎯 **Item Priority**: Set priority levels for wishlist items
- ✅ **Purchase Tracking**: Mark items as purchased and track spending
- 🐳 **Docker Support**: Easy deployment with Docker and docker-compose

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Drizzle ORM
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd budget-wishlist
```

2. **Install dependencies**

```bash
npm install
```

3. **Generate and run database migrations**

```bash
npm run db:generate
npm run db:migrate
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start the container**

```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000)

The SQLite database will be persisted in the `./data` directory on your host machine.

2. **Stop the container**

```bash
docker-compose down
```

### Using Docker directly

1. **Build the image**

```bash
docker build -t budget-wishlist .
```

2. **Run the container**

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --name budget-wishlist \
  budget-wishlist
```

## Database

The SQLite database is stored in the `/data` folder for easy Docker volume mounting. The database file (`sqlite.db`) will be automatically created when you first run the application.

### Database Schema

- **wishlists**: Stores wishlist information with budget limits
- **items**: Stores items linked to wishlists with prices and status
- **history**: Tracks all budget changes, item additions, and purchases

### Database Management

```bash
# Generate new migrations after schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes directly to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Usage

### Adding a Wishlist

1. Click the "Add Wishlist" button in the header
2. Enter a name, optional description, and budget limit
3. Click "Add Wishlist"

### Adding Items

1. Click the "Add Item" button in the header
2. Select a wishlist from the dropdown
3. Enter item name, price, and priority (1-5)
4. Click "Add Item"

### Updating Budgets

1. Click the "Update Budget" button in the header
2. Select a wishlist from the dropdown
3. Enter the new budget amount
4. Click "Update Budget"

### Viewing History

1. Click the "View History" button in the header
2. View all activity logs in the table
3. Filter by date, action type, amount, and description

## Project Structure

```
budget-wishlist/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server Actions
│   │   ├── api/
│   │   │   └── history/        # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── add-wishlist-dialog.tsx
│   │   ├── add-item-dialog.tsx
│   │   ├── update-budget-dialog.tsx
│   │   └── history-dialog.tsx
│   └── lib/
│       ├── db/
│       │   ├── index.ts        # Database connection
│       │   └── schema.ts       # Drizzle schema
│       └── utils.ts
├── data/                       # SQLite database location
├── drizzle/                    # Migration files
├── docker-compose.yml
├── Dockerfile
└── drizzle.config.ts
```

## Environment Variables

No environment variables are required for basic operation. The database path is automatically configured to use `./data/sqlite.db`.

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio
```

## License

MIT
