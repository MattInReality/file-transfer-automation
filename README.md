# file-transfer-automation
A NodeJS API to automate cross protocol file transfer. 

## Why build it?
While scheduling and FTP are 'old tech' the industry my full time job is in still use them quite frequently. There is a use case for it at work and if you are here, perhaps you have a use case for it too. 

## Getting Started
While I have an early version of this covering a few specific tasks, it's not what anyone would call production ready. It could be run on a local server where exposure is limited. 

1. Clone the project
```
git clone https://github.com/MattInReality/file-transfer-automation.git [your location]
```
2. Setup Database
For your convenience there is a dockerCompose to spin up a quick Postgres dev server.
```
docker-compose up -d db

// Add to following to .env if you are using the docker image.
DATABASE_URL=postgresql://development:abc123!!!@localhost:5432/development?schema=public
```
Or you can use your own local/remote installation instead. Making up the DATABASE_URL environmental variable and adding it to a .env file.
```
DATABASE_URL=postgresql://[username]:[password]@[IP-Address:Port]/[database name]?schema=[db-schema-name]
```
3. Project Spin Up Commands
```
// Install Dependencies
npm install

// Generate the Prisma Client
npx prisma generate

// Run the database migration
npx prisma migrate dev

```
4. Build the Project and start the server
```
// Build
tsc

// Run
npm run build
```

