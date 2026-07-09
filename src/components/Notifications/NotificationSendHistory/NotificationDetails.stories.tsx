import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComponentProps, useState } from "react";
import NotificationDetails from "./NotificationDetails";
import {
  inhibitedDeploymentNotification,
  sentDeploymentNotification,
  sentPodNotification
} from "./__fixtures__/notificationDetails";

function NotificationDetailsStory({
  notification
}: ComponentProps<typeof NotificationDetails>) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity
        }
      }
    });

    client.setQueryData(
      ["notification_send_history_inhibitor", sentPodNotification.id],
      sentPodNotification
    );

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationDetails notification={notification} />
    </QueryClientProvider>
  );
}

const meta: Meta<typeof NotificationDetails> = {
  title: "Notifications/Notification Details",
  component: NotificationDetails
};

export default meta;

type Story = StoryObj<typeof NotificationDetails>;

export const Inhibited: Story = {
  render: (args) => <NotificationDetailsStory {...args} />,
  args: {
    notification: inhibitedDeploymentNotification
  }
};

export const Sent: Story = {
  render: (args) => <NotificationDetailsStory {...args} />,
  args: {
    notification: sentDeploymentNotification
  }
};
