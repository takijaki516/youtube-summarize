FROM node:20-alpine AS base
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN pnpm add --global turbo@^2

FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune @repo/database --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install
COPY --from=builder /app/out/full/ .

CMD ["pnpm", "--filter", "@repo/database", "db:migrate"]
