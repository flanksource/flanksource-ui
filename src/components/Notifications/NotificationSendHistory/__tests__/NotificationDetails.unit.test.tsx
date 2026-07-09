import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotificationDetails from "../NotificationDetails";
import {
  inhibitedDeploymentNotification,
  sentDeploymentNotification,
  sentPodNotification
} from "../__fixtures__/notificationDetails";

jest.mock("../../../../api/services/notifications", () => ({
  getNotificationSendHistoryById: jest.fn(),
  getNotificationSilencesByID: jest.fn()
}));

const { getNotificationSendHistoryById: mockGetNotificationSendHistoryById } =
  jest.requireMock("../../../../api/services/notifications") as {
    getNotificationSendHistoryById: jest.Mock;
  };

function renderNotificationDetails(
  notification: React.ComponentProps<typeof NotificationDetails>["notification"]
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <QueryClientProvider client={queryClient}>
        <NotificationDetails notification={notification} />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("NotificationDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the inhibiting notification resource and send history link", async () => {
    mockGetNotificationSendHistoryById.mockResolvedValue(sentPodNotification);

    renderNotificationDetails(inhibitedDeploymentNotification);

    expect(screen.getByText("Inhibited By")).toBeInTheDocument();
    expect(
      await screen.findByText("airsonic-7f9d4b9d9c-l6ptw")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View notification" })
    ).toHaveAttribute(
      "href",
      `/notifications/resource/${sentPodNotification.resource_id}?id=${sentPodNotification.id}`
    );
    expect(screen.getByText("config.unhealthy")).toBeInTheDocument();
    expect(mockGetNotificationSendHistoryById).toHaveBeenCalledTimes(1);
    expect(mockGetNotificationSendHistoryById).toHaveBeenCalledWith(
      sentPodNotification.id
    );
  });

  it("does not fetch an inhibitor for non-inhibited history", () => {
    renderNotificationDetails(sentDeploymentNotification);

    expect(screen.queryByText("Inhibited By")).not.toBeInTheDocument();
    expect(mockGetNotificationSendHistoryById).not.toHaveBeenCalled();
  });
});
