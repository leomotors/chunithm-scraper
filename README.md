# Chunithm Scraper

Chunithm NET Scraper and rating analysis

For International Ver.

## Prerequisites

- PostgreSQL
- Docker (Supports linux/amd64 and linux/arm64)

## Seeding Database

Currently, seeding database is only possible by running Bun script.

Run `bun run seed/chart-constant.ts` to seed chart constant data.

## Running Scraper

Run SQL script in `sql/` to create tables, constraints and types

```bash
docker run \
  --name chuni \
  --rm \
  -e DATABASE_URL=postgresql://username:password@postgres:5432/chunithm \
  -e USERNAME=YOUR_AIME_USERNAME \
  -e PASSWORD=YOUR_AIME_PASSWORD \
  -e VERSION=LMN+ \
  ghcr.io/leomotors/chunithm-net-scraper:latest
```

## TODO

Scrape Play History
