# Gator

A command-line RSS feed aggregator built with TypeScript, Node.js, PostgreSQL, and Drizzle ORM.

Gator allows users to create accounts, add RSS feeds, follow feeds, continuously aggregate posts, and browse collected posts from the command line.

## Features

* User registration and login
* Add RSS feeds
* Follow and unfollow feeds
* View available feeds
* View feeds followed by the current user
* Continuously aggregate posts from RSS feeds
* Browse collected posts
* PostgreSQL database persistence
* Database migrations with Drizzle ORM

## Tech Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| TypeScript      | Application language            |
| Node.js         | Runtime                         |
| PostgreSQL      | Database                        |
| Drizzle ORM     | Database queries and migrations |
| fast-xml-parser | RSS/XML parsing                 |
| tsx             | TypeScript execution            |

## Prerequisites

Before running Gator, make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* [PostgreSQL](https://www.postgresql.org/)
* Git

Verify your installations:

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

Install the project dependencies:

```bash
npm install
```

## Database Setup

Gator uses PostgreSQL to store users, feeds, feed follows, and posts.

Create a database named `gator`:

```bash
createdb gator
```

Make sure PostgreSQL is running.

Then run the database migrations:

```bash
npm run migrate
```

## Configuration

Gator uses a configuration file located at:

```text
~/.gatorconfig.json
```

Create the file:

```bash
nano ~/.gatorconfig.json
```

Add your PostgreSQL connection string:

```json
{
  "db_url": "postgres://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/gator"
}
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

For example:

```json
{
  "db_url": "postgres://postgres:password@localhost:5432/gator"
}
```

The configuration file is also used to keep track of the currently logged-in user.

## Usage

Gator commands are run using:

```bash
npm run start <command>
```

### Register

Create a new user:

```bash
npm run start register <username>
```

Example:

```bash
npm run start register kahya
```

### Login

Log in as an existing user:

```bash
npm run start login <username>
```

Example:

```bash
npm run start login kahya
```

### List Users

Display all registered users:

```bash
npm run start users
```

### Add a Feed

Add a new RSS feed:

```bash
npm run start addfeed "<name>" "<url>"
```

Example:

```bash
npm run start addfeed \
  "Lanes Blog" \
  "https://www.wagslane.dev/index.xml"
```

Adding a feed also automatically follows it for the current user.

### List Feeds

Display all available feeds:

```bash
npm run start feeds
```

### Follow a Feed

Follow an existing feed:

```bash
npm run start follow "<feed-url>"
```

Example:

```bash
npm run start follow "https://www.wagslane.dev/index.xml"
```

### Unfollow a Feed

Stop following a feed:

```bash
npm run start unfollow "<feed-url>"
```

### List Followed Feeds

Display the feeds followed by the current user:

```bash
npm run start following
```

### Aggregate Feeds

Continuously fetch posts from RSS feeds:

```bash
npm run start agg <time-between-requests>
```

Example:

```bash
npm run start agg 1m
```

The aggregator periodically fetches RSS feeds and stores new posts in the PostgreSQL database.

Stop the aggregator with:

```text
Ctrl+C
```

### Browse Posts

Browse the posts collected by Gator:

```bash
npm run start browse
```
### Reset Database

Reset the database and remove all existing data:

```bash
npm run start reset
```

## Example Workflow

A typical workflow looks like this:

```bash
# Install dependencies
npm install

# Run database migrations
npm run migrate

# Create a user
npm run start register kahya

# Add and follow an RSS feed
npm run start addfeed \
  "Lanes Blog" \
  "https://www.wagslane.dev/index.xml"

# View followed feeds
npm run start following

# Start collecting posts
npm run start agg 1m

# Browse collected posts
npm run start browse
```

## Project Structure

```text
Gator/
├── src/
│   ├── commands/
│   ├── lib/
│   ├── utils/
│   ├── config.ts
│   ├── index.ts
│   ├── middleware.ts
│   └── rss.ts
├── .gitignore
├── .nvmrc
├── drizzle.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Important Files

* `src/index.ts` — CLI entry point
* `src/commands/` — CLI command implementations
* `src/lib/` — database and shared application logic
* `src/config.ts` — configuration file handling
* `src/middleware.ts` — command middleware and user validation
* `src/rss.ts` — RSS fetching and parsing
* `drizzle.config.ts` — Drizzle ORM configuration
* `README.md` — project documentation

## Development

Generate new database migrations after changing the database schema:

```bash
npm run generate
```

Apply database migrations:

```bash
npm run migrate
```

Run Gator locally:

```bash
npm run start <command>
```

## GitHub

Gator is open source and can be hosted on GitHub.

After making changes, commit and push them:

```bash
git add README.md
git commit -m "Add project documentation"
git push
```

Your repository URL should look like:

```text
https://github.com/YOUR_USERNAME/YOUR_REPOSITORY
```

## License

This project was created as part of the Boot.dev guided project curriculum.
