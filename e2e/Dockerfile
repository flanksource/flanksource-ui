FROM node:latest@sha256:a9875b5ccb02aa527cf7f2297b16ae425a0ff3da2f7d87fce3df41f04ffa0524
COPY package.json package-lock.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium
COPY . .
# COPY node_modules node_modules
COPY run-playwright.sh run-playwright.sh
RUN chmod +x run-playwright.sh
ENTRYPOINT ["/bin/bash", "run-playwright.sh"]
