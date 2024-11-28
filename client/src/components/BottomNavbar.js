import { MdGroups } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

export default function BottomNavbar({ activeTab }) {
  return (
    <div className="w-full flex items-center justify-center absolute bottom-12">
      <div className="flex items-center gap-6">
        <a href="/messages">
          <div className="flex flex-col items-center gap-1">
            <LuMessagesSquare
              className={`text-2xl ${
                activeTab === "messages" ? "text-info" : "text-base-content/50"
              }`}
            />
            <p
              className={`text-xs ${
                activeTab === "messages" ? "text-info" : "text-base-content/50"
              }`}
            >
              Messages
            </p>
          </div>
        </a>
        <a href="/lengua">
          <div className="flex flex-col items-center gap-1 mb-1">
            <MdGroups
              className={`text-2xl ${
                activeTab === "community" ? "text-info" : "text-base-content/50"
              }`}
            />
            <p
              className={`text-xs ${
                activeTab === "community" ? "text-info" : "text-base-content/50"
              }`}
            >
              Community
            </p>
          </div>
        </a>
        <a href="/profile">
          <div className="flex flex-col items-center gap-1">
            <CgProfile
              className={`text-2xl ${
                activeTab === "profile" ? "text-info" : "text-base-content/50"
              }`}
            />
            <p
              className={`text-xs ${
                activeTab === "profile" ? "text-info" : "text-base-content/50"
              }`}
            >
              Profile
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
