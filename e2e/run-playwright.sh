mkdir -p /tmp/junit-results
PLAYWRIGHT_JUNIT_OUTPUT_NAME=/tmp/junit-results/results.xml npx playwright test --project=chromium --reporter=junit
touch /tmp/junit-results/done
