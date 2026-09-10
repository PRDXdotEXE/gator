# Gator

Gator is a command-line RSS feed aggregator built with TypeScript, Node.js, PostgreSQL, and Drizzle ORM.

It allows users to register accounts, add RSS feeds, follow feeds, aggregate posts from those feeds, and browse the feeds they follow.

## Tech Stack

- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM
- fast-xml-parser
- tsx

## Requirements

Before running Gator, make sure you have:

- Node.js installed
- npm installed
- PostgreSQL installed and running
- Git installed

You can verify your installations with:

```bash
node --version
npm --version
psql --version
git --version
```

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Install the dependencies:

```bash
npm install
```

## Database Setup

Gator uses PostgreSQL to store users, feeds, feed follows, and posts.

Create a PostgreSQL database:

```bash
createdb gator
```

Make sure PostgreSQL is running before starting Gator.

Run the database migrations:

```bash
npm run migrate
```

## Configuration

Gator expects a configuration file at:

```text
~/.gatorconfig.json
```

Create the file:

```bash
nano ~/.gatorconfig.json
```

Add:

```json
{
    "db_url": "postgres://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/gator"
}
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

Gator will automatically update the configuration with the currently logged-in user when you use the `register` or `login` commands.

## Running Gator

The CLI is run through npm:

```bash
npm run start <command>
```

For example:

```bash
npm run start register kahya
```

## Available Commands

### Register a User

Create a new user:

```bash
npm run start register <username>
```

Example:

```bash
npm run start register kahya
```

### Login

Switch to an existing user:

```bash
npm run start login <username>
```

Example:

```bash
npm run start login kahya
```

### List Users

Display registered users:

```bash
npm run start users
```

### Add a Feed

Add an RSS feed:

```bash
npm run start addfeed "<feed-name>" "<feed-url>"
```

Example:

```bash
npm run start addfeed "Hacker News RSS" "https://hnrss.org/newest"
```

Adding a feed also follows that feed for the currently logged-in user.

### List Feeds

Display available feeds:

```bash
npm run start feeds
```

### Follow a Feed

Follow an existing feed using its URL:

```bash
npm run start follow "<feed-url>"
```

Example:

```bash
npm run start follow "https://www.wagslane.dev/index.xml"
```

### List Followed Feeds

Display the feeds followed by the current user:

```bash
npm run start following
```

### Unfollow a Feed

Stop following a feed:

```bash
npm run start unfollow "<feed-url>"
```

### Aggregate Feeds

Fetch posts from RSS feeds:

```bash
npm run start agg <time-between-requests>
```

Example:

```bash
npm run start agg 1m
```

The aggregator continuously fetches feeds and stores their posts in the database.

You can stop the aggregator with:

```text
Ctrl+C
```

### Browse Posts

Use the feed/post commands implemented by the project to view stored posts.

## Example Workflow

A typical first-time workflow looks like this:

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

The aggregator will periodically fetch the configured RSS feeds and store new posts in PostgreSQL.

## Project Structure

```text
Gator/
├── src/
│   ├── commands/
│   ├── db/
│   ├── lib/
│   ├── config.ts
│   ├── index.ts
│   └── rss.ts
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Development

Run the project with:

```bash
npm run start <command>
```

Generate database migrations when the schema changes:

```bash
npm run generate
```

Apply migrations:

```bash
npm run migrate
```

## GitHub

After committing your changes, push the repository to GitHub:

```bash
git add README.md
git commit -m "Add project documentation"
git push
```

Your public repository URL should look like:

```text
https://github.com/YOUR_USERNAME/YOUR_REPOSITORY
```
