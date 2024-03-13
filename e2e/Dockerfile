FROM node:latest
COPY package.json package.json
RUN npm install
RUN npx playwright install --with-deps chromium
COPY . .
# COPY node_modules node_modules
COPY run-playwright.sh run-playwright.sh
RUN chmod +x run-playwright.sh
ENTRYPOINT ["/bin/bash", "run-playwright.sh"]
