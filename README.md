# BackendAssignment-Fitness

## Setup & Run
1. Start the database:
```
docker-compose up -d
```

2. Create your .env
```
cp .env.example .env
```

3. Install dependencies
```
npm ci
```

4. Run migrations
```
npx sequelize-cli db:migrate
```

5. Seed database
```
npm run seed
```

Please, use `_postman.json` file to import the collection into Postman and try the API.

## Changes and features
- Completed all tasks and all bonus tasks
- Changed relationship between exercises and programs to be many-to-many, so 1 exercise can be reused in multiplem programs
- Added admin API for users, exercises and programs. Assignment/deasignment of exercises to programs can be done througs admin/programs API
- In the end instead of sequelize.sync I've refactored to migrations
- For fullText search I've decided to use Postgres full text search, instead of "like"
- In the localization bonus task, I've added real translation keys only to POST admin/exercises endpoint as a demonstration. Obviously in the real world app, all keys should be available
- I've used zod for validation 