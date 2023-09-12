import { UserProfile } from "@clerk/nextjs";

export default function ClerkUserProfile() {
  return (
    <div className="w-full px-3 items-center justify-center flex flex-col">
      <UserProfile path="/profile-settings" routing="path" />
    </div>
  );
}
