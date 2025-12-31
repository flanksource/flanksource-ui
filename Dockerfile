FROM node:22.14@sha256:bac8ff0b5302b06924a5e288fb4ceecef9c8bb0bb92515985d2efdc3a2447052 AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:22.14@sha256:bac8ff0b5302b06924a5e288fb4ceecef9c8bb0bb92515985d2efdc3a2447052 AS builder
WORKDIR /app
ARG APP_DEPLOYMENT=INCIDENT_MANAGER
ARG WITHOUT_AUTH=false

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# A unique string to be replace at runtime, with the api host name, within the generated routes manifest.
ENV BACKEND_URL="/__BACKEND_URL__"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_APP_DEPLOYMENT=${APP_DEPLOYMENT}
ENV NEXT_PUBLIC_WITHOUT_SESSION=${WITHOUT_AUTH}
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN NEXT_STANDALONE_DEPLOYMENT=true npm run build

# NextJS compiles routes-manifest.json at build time. Which means, it won't
# pickup runtime environemnt variables. To support runtime environment, we
# insert a unique template variable "/__BACKEND_URL__" and replace it at
# runtime. See: https://github.com/vercel/next.js/issues/21888
RUN cp .next/routes-manifest.json .next/routes-manifest.orig.json

# Production image, copy all the files and run next
FROM node:22.14@sha256:bac8ff0b5302b06924a5e288fb4ceecef9c8bb0bb92515985d2efdc3a2447052 AS runner
WORKDIR /app

ENV NEXT_PUBLIC_APP_DEPLOYMENT=${APP_DEPLOYMENT}
ENV ORY_KRATOS_URL=${ORY_KRATOS_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/routes-manifest.orig.json ./.next/routes-manifest.orig.json

COPY --chmod=755 ./scripts/nextjs-standalone-startup.sh startup.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["bash", "startup.sh"]
