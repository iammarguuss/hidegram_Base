## Installation

```bash
$ npm install
```

## Running the app

```bash
# start docker postgres
$ docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## DB

```bash

# restart db container
$ npm run db

# see db
$ npm run prisma-studio

# run db migrations
$ npm run prisma-migrate-dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

```bash
# Script for creating many tables

# Access for running script
chmod +x createTables.sh

# Run the script, specifying the number of repetitions and naming the file as arguments
./createTables.sh 9999 migration.sql

```

## License

Nest is [MIT licensed](LICENSE).
