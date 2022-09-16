FROM node:16 AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm i

# Rebuild the source code only when needed
FROM node:16 AS builder
WORKDIR /app
ARG APP_DEPLOYMENT=INCIDENT_MANAGER

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_PUBLIC_APP_DEPLOYMENT=${APP_DEPLOYMENT}
RUN NEXT_STANDALONE_DEPLOYMENT=true npm run build

# Production image, copy all the files and run next
FROM node:16 AS runner
WORKDIR /app

ENV ORY_KRATOS_URL=${ORY_KRATOS_URL}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
