import { Meta, Story } from "@storybook/react";
import { HealthCheckStatus } from "./HealthCheckStatus";

type StatusProps = React.ComponentProps<typeof HealthCheckStatus>;

export default {
  title: "Components/HealthCheckStatus",
  component: HealthCheckStatus
} as Meta;

export const Default: Story<StatusProps> = (args) => (
  <HealthCheckStatus {...args} />
);

export const Mixed: Story<StatusProps> = (args) => (
  <HealthCheckStatus {...args} />
);

Mixed.args = {
  isMixed: true
};

export const Healthy: Story<StatusProps> = (args) => (
  <HealthCheckStatus {...args} />
);

Healthy.args = {
  check: {
    status: "healthy"
  }
};

export const Unhealthy: Story<StatusProps> = (args) => (
  <HealthCheckStatus {...args} />
);

Unhealthy.args = {
  check: {
    status: "unhealthy"
  }
};
