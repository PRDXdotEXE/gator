# Gator

A command-line RSS feed aggregator that lets users register accounts, subscribe to feeds, and continuously collect posts into a local PostgreSQL database.

## Features

- User registration and login system
- Add and follow RSS feeds
- Continuous background aggregation of new posts
- Browse posts from followed feeds
- PostgreSQL-backed storage with Drizzle ORM migrations

## Tech Stack

| Layer          | Technology       |
| -------------- | ---------------- |
| Language       | TypeScript       |
| Runtime        | Node.js          |
| Database       | PostgreSQL       |
| ORM            | Drizzle ORM      |
| XML Parsing    | fast-xml-parser  |
| Execution      | tsx              |

## Prerequisites

Make sure the following are installed before setting up Gator:

- [Node.js](https://nodejs.org/)
- npm
- [PostgreSQL](https://www.postgresql.org/)
- Git

Verify your installations:

```bash
node --version
npm --version
psql --version
git --version
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Database Setup

1. Create a PostgreSQL database:

   ```bash
   createdb gator
   ```

2. Ensure PostgreSQL is running, then apply migrations:

   ```bash
   npm run migrate
   ```

## Configuration

Gator reads its configuration from `~/.gatorconfig.json`.

Create the file:

```bash
nano ~/.gatorconfig.json
```

Add the following, replacing the placeholders with your PostgreSQL credentials:

```json
{
  "db_url": "postgres://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/gator"
}
```

> **Note:** This file is updated automatically with the currently logged-in user whenever you run `register` or `login`.

## Usage

All commands are run through npm:

```bash
npm run start <command>
```

### Commands

| Command                                   | Description                                      |
| ------------------------------------------ | ------------------------------------------------- |
| `register <username>`                     | Create a new user                                 |
| `login <username>`                        | Switch to an existing user                        |
| `users`                                   | List all registered users                         |
| `addfeed "<name>" "<url>"`                | Add and automatically follow a new RSS feed       |
| `feeds`                                   | List all available feeds                          |
| `follow "<feed-url>"`                     | Follow an existing feed                           |
| `unfollow "<feed-url>"`                   | Stop following a feed                             |
| `following`                               | List feeds followed by the current user           |
| `agg <time-between-requests>`             | Continuously fetch posts from followed feeds      |

Stop the aggregator at any time with `Ctrl+C`.

### Example Workflow

```bash
npm install
npm run migrate

npm run start register kahya

npm run start addfeed \
  "Lanes Blog" \
  "https://www.wagslane.dev/index.xml"

npm run start following

npm run start agg 1m
```

This registers a user, subscribes to a feed, and starts the aggregator, which will periodically fetch new posts and store them in PostgreSQL.

## Project Structure

```text
Gator/
├── src/
│   ├── commands/     # CLI command implementations
│   ├── db/           # Database schema and queries
│   ├── lib/          # Shared utilities
│   ├── config.ts     # Configuration loading/saving
│   ├── index.ts      # CLI entry point
│   └── rss.ts        # RSS fetching and parsing
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Development

Run a command locally:

```bash
npm run start <command>
```

Generate migrations after changing the schema:

```bash
npm run generate
```

Apply migrations:

```bash
npm run migrate
```
