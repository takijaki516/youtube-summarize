# Next.js app to generate youtube summary

## TODO

- [O] fix zustand stores
- [O] rate limit(2 requests per 10 minutes) for not signed in users
- [O] rate limit(5 requests per 5 minutes) for signed in users
- [O] video page for not signed in users
- [O]: add cron job to delete temp videos older than 1 day
- [O]: next.js error page

## Running locally

1. Set up google oauth2 [auth.js(next-auth) docs](https://authjs.dev/getting-started/providers/google)
2. Need to create `.env` file based on `.env.example`
3. Run `docker compose up`

## Deploy

1. Create database (I used Supabase)
2. Migrate database schema by running `pnpm run db:migrate` in "packages/database" directory
3. Deploy cdk stack by running `cdk deploy --all` in "apps/cdk" directory
4. Run github actions to build and push docker image to ECR and deploy to ECS