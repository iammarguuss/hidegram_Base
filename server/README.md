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
# see TEST db
$ npm run prisma-studio:test

# see PROD db
$ npm run prisma-studio:prod

# run DEV db migrations
$ npx prisma migrate dev --name [name]

# run PROD db migrations
$ npx prisma migrate deploy
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
