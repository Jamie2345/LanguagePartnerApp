import useUserData from "../hooks/useUserData";
import BottomNavbar from "../components/BottomNavbar";

import ToggleThemeTopRight from "../components/ToggleThemeTopRight";
import { useEffect, useState } from "react";

import ReactCountryFlag from "react-country-flag";

import axiosInstance from "../api/axiosInstance";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [conversationUsers, setConversationUsers] = useState([]);
  const { user, validUser, loading } = useUserData();

  const [contentHeight, setContentHeight] = useState("0px");

  useEffect(() => {
    if (validUser) {
      try {
        const fetchConversationsAndUsers = async () => {
          const response = await axiosInstance.get("/api/conversations");
          if (response.status === 200 && response.data) {
            const fetchedConversations = response.data;

            const userIds = fetchedConversations.map((conversation) => {
              // array of all the users who have a conversation with user._id (the current user)
              if (conversation?.users.length === 2) {
                if (conversation.users[0] !== user._id)
                  return conversation.users[0];
                else return conversation.users[1];
              }
            });

            console.log(userIds);

            if (userIds.length === 0) {
              alert("No conversations found.");
              return;
            }

            console.log(userIds);
            const usersResponse = await axiosInstance.post("/api/users", {
              ids: userIds,
            });

            if (usersResponse.status === 200) {
              console.log(usersResponse.data);
              setConversations(fetchedConversations);

              const conversationUsersObject = {};
              usersResponse.data.forEach((user) => {
                conversationUsersObject[user._id] = user;
              });

              console.log(conversationUsersObject);

              setConversationUsers(conversationUsersObject);
            } else {
              console.log(usersResponse);
              alert("An error occurred. Please try again later.");
            }
          } else {
            console.log(response);
            alert("An error occurred. Please try again later.");
          }
        };

        fetchConversationsAndUsers();
      } catch (error) {
        console.log(error);
        alert("An error occurred. Please try again later.");
      }
    }
  }, [validUser]);

  useEffect(() => {
    const adjustHeight = () => {
      try {
        const contentResponsiveHeight = window.innerHeight - 270;
        setContentHeight(`${contentResponsiveHeight}px`);
      } catch (error) {
        console.log(error);
      }
    };

    // Adjust height on load and resize
    adjustHeight();
    window.addEventListener("resize", adjustHeight);

    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, [validUser, loading, conversationUsers]);

  if (loading) return;
  else if (validUser)
    return (
      <main data-theme="light">
        <ToggleThemeTopRight />
        <div className="flex w-full min-h-screen bg-base-100">
          <div className="w-full m-20">
            <h2 className="text-2xl text-base-content font-semibold mb-4">
              Messages
            </h2>
            <div
              className="grid gap-2 overflow-auto w-full"
              style={{ maxHeight: contentHeight }}
            >
              {conversations.map((conversation) => {
                const otherUser =
                  conversationUsers[
                    conversation.users.find((id) => id !== user._id)
                  ];
                console.log(otherUser);

                return (
                  <a href={`/messages/${conversation._id}`} key={conversation._id}>
                    <div className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center">
                      <div className="mr-12">
                        <img
                          src="/images/defaultuser.jpg"
                          alt="user"
                          className="w-32 h-auto"
                        />
                      </div>
                      <div
                        className="w-full flex flex-col"
                        key={otherUser?._id}
                      >
                        <div className="flex">
                          <h2 className="text-2xl font-semibold mr-4">
                            {otherUser?.username}
                          </h2>
                          <ReactCountryFlag
                            countryCode={otherUser?.nationality}
                            svg
                            style={{
                              width: "2em",
                              height: "auto",
                            }}
                            title={otherUser?.nationality}
                          />
                        </div>
                        <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                          {otherUser?.languages.map((lang, index) => {
                            return (
                              <div
                                className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4"
                                key={index}
                              >
                                {lang?.language?.label} :{" "}
                                {lang?.proficiency?.label}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                          {otherUser?.interests.map((interest, index) => {
                            return (
                              <div
                                className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4"
                                key={index}
                              >
                                {interest?.label}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <BottomNavbar activeTab={"messages"} />
      </main>
    );
  else window.location.href = "/onboarding";
}
