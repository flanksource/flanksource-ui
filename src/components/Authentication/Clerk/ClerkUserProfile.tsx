import { UserProfile } from "@clerk/nextjs";

export default function ClerkUserProfile() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-3">
      <UserProfile path="/profile-settings" routing="path" />
    </div>
  );
}
