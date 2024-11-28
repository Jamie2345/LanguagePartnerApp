import useUserData from "../hooks/useUserData";
import BottomNavbar from "../components/BottomNavbar";

import ToggleThemeTopRight from "../components/ToggleThemeTopRight";

export default function Profile() {
  const { validUser, loading } = useUserData();

  if (loading) return;
  else if (validUser)
  return (
    <main data-theme="light">
      <ToggleThemeTopRight />
      <div className="flex w-full min-h-screen bg-base-100">
        <div className="w-full m-20"><h2 className="text-2xl text-base-content font-semibold">Profile page</h2></div>
      </div>
      <BottomNavbar activeTab={"profile"} />
    </main>
  );
  else window.location.href = "/onboarding";
}
