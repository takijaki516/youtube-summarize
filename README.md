# Next.js app to generate youtube summary

## TODO

- [ ]: fix zustand stores
- [O]: rate limit(2 requests per 10 minutes) for not signed in users
- [0]: rate limit(5 requests per 5 minutes) for signed in users
- [0]: video page for not signed in users
- [0]: add cron job to delete temp videos older than 1 day
- [ ]: next.js error page

## Running locally

1. Set up google oauth2 [auth.js(next-auth) docs](https://authjs.dev/getting-started/providers/google), this is **next.js** app
2. Need to create `.env` file based on `.env.example`
3. Run `docker compose up`

## Deploy

1. Create database using Supabase
2. Migrate database(Supabase) schema by running `pnpm run db:migrate` in "packages/database" directory
3. Deploy cdk stack by running `cdk deploy --all` in "apps/cdk" directory
4. Run github actions to build and push docker image to ECR and deploy to ECS