# Running the app

## PROD

```bash
# from master branch
$ git checkout master

# start docker
$ docker compose -f docker-prod-compose.yaml up -d --build
```

### view PROD database

```bash
$ cd server
$ npm run prisma-studio:prod
```


## TEST

```bash
# from develop branch
$ git checkout develop

# start docker
$ docker compose -f docker-test-compose.yaml up -d --build
```
### view TEST database

```bash
$ cd server
$ npm run prisma-studio:test
```
