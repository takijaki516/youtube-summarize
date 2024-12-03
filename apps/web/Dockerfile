ARG OPENAI_API_KEY
ARG AUTH_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_TRUST_HOST
ARG DATABASE_URL


FROM --platform=linux/amd64 node:20-alpine AS base
# Add these lines to set up pnpm global
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN pnpm add --global turbo@^2


FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
RUN turbo prune @repo/web --docker


FROM base AS installer

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ARG AUTH_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

ARG AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_ID=$AUTH_GOOGLE_ID

ARG AUTH_GOOGLE_SECRET
ENV AUTH_GOOGLE_SECRET=$AUTH_GOOGLE_SECRET

ARG AUTH_TRUST_HOST
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install
# Copy full source

# Set environment variables before running turbo build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
COPY --from=builder /app/out/full/ .
# build the project
RUN turbo build


# TODO use slim image
FROM --platform=linux/amd64 node:20.15-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# When deploying your application behind a reverse proxy, you’ll need to set AUTH_TRUST_HOST equal to true

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# Copy static files
COPY --from=installer /app/apps/web/public ./apps/web/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
EXPOSE 3000
CMD ["node", "apps/web/server.js"]