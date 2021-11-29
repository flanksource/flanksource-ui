export function getUptimePercentage(check) {
  const uptime = check?.uptime;
  const passed = uptime?.passed;
  const failed = uptime?.failed;
  const valid = !Number.isNaN(passed) && !Number.isNaN(failed);
  return valid ? (passed / (passed + failed)) * 100 : null;
}
