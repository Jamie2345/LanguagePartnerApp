import useUserData from "../hooks/useUserData";
import BottomNavbar from "../components/BottomNavbar";

import ToggleThemeTopRight from "../components/ToggleThemeTopRight";
import { useEffect, useState } from "react";

import { IoMdNotifications } from "react-icons/io";
import { IoMdNotificationsOff } from "react-icons/io";

import ReactCountryFlag from "react-country-flag";

import axiosInstance from "../api/axiosInstance";

import { useParams } from "react-router-dom";

import { io } from "socket.io-client";

export default function MessagePage() {
  const { user, validUser, loading } = useUserData();
  const { conversationId } = useParams();

  const [conversationMessages, setConversationMessages] = useState([]);
  const [otherUser, setOtherUser] = useState({});

  const [contentHeight, setContentHeight] = useState("0px");

  const [message, setMessage] = useState("");

  const [socket, setSocket] = useState(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  async function fetchConversationMessages() {
    // Check if user data is available
    if (!user || !user._id) {
      console.error("User data is not available. Unable to fetch messages.");
      return; // Early return if user is not available
    }

    try {
      const response = await axiosInstance.get(
        `/api/conversation?conversationId=${conversationId}`
      );

      if (response.status === 200) {
        console.log("Messages", response.data.messages);

        const otherUserId =
          response.data.users[0] === user._id
            ? response.data.users[1]
            : response.data.users[0];

        await fetchOtherUser(otherUserId);
        setConversationMessages(response.data.messages);
      } else {
        alert("Failed to fetch conversation messages.");
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      alert("An error occurred while fetching messages.");
    }
  }

  async function fetchOtherUser(otherUserId) {
    const response = await axiosInstance.get(`/api/user?id=${otherUserId}`);
    if (response.status === 200) {
      console.log(response.data?.user);
      setOtherUser(response.data?.user);
    } else {
      alert("Failed to fetch other user.");
    }
  }

  useEffect(() => {
    if (validUser) {
      try {
        fetchConversationMessages();
      } catch (error) {
        console.error(error);
        alert("Failed to fetch conversation messages.");
      }
    }
  }, [validUser]); // run only once user is valid.

  useEffect(() => {
    const adjustHeight = () => {
      try {
        const contentResponsiveHeight = window.innerHeight - 270; // height of the screen - (y margin in pixels + space used for input box).
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
  }, [validUser, loading]);

  async function sendMessage() {
    try {
      if (message.trim() === "") return; // make sure message string isn't empty

      console.log("Sending message: " + message);
      const response = await axiosInstance.put("/api/message", {
        // send message to api
        conversationId,
        message,
      });

      if (response.status === 200) {
        setMessage("");
        if (response.data.messages) {
          setConversationMessages(response.data.messages); // server responds with array of all the messages in the conversation so update the array to be most recent.

          // tell the socket to update.
          socket.emit("update", conversationId);
        }
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  }

  function formatTimestamp(isoString) {
    const date = new Date(isoString);

    // format to HH:MM
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
  }

  function getPrettyTimestamp(isoString) {
    const date = new Date(isoString);
    const now = new Date();

    // check if date is today
    const isToday = date.toDateString() === now.toDateString();

    // check if date is yesterday
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString();

    // format the date as MM/DD/YYYY
    const formattedDate = `${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

    if (isToday) {
      return `Today at ${formatTimestamp(isoString)}`;
    } else if (isYesterday) {
      return `Yesterday at ${formatTimestamp(isoString)}`;
    } else {
      return `${formattedDate} at ${formatTimestamp(isoString)}`;
    }
  }

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // connect to WebSocket
    setSocket(newSocket); // Store the socket in state

    // Join the specified room
    newSocket.emit("joinRoom", conversationId);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect(); // Disconnect on cleanup
    };
  }, [conversationId]); // Depend on conversationId to rejoin if it changes

  function scrollToMessagesBottom() {
    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  useEffect(() => {
    if (conversationMessages.length > 0 && user?._id) {
      const mostRecentMessage =
        conversationMessages[conversationMessages.length - 1];
      if (mostRecentMessage.from === user._id) {
        scrollToMessagesBottom();
      }
    }
  }, [conversationMessages]); // Depend on conversationMessages

  // websocket code
  useEffect(() => {
    if (!socket) return;

    // Listen for updates from the server
    const handleUpdateReceived = () => {
      console.log("Update received: new message available");
      fetchConversationMessages();
      if (notificationsEnabled) {
        playNotificationSound();
      }
    };

    socket.on("updateReceived", handleUpdateReceived);

    // Cleanup function
    return () => {
      socket.off("updateReceived", handleUpdateReceived);
    };
  }, [socket]); // Depend on socket

  function playNotificationSound() {
    if (notificationsEnabled) {
      const audio = new Audio("/assets/notificationsound.mp3");
      audio.volume = 0.3; // adjust the volume (0.0 to 1.0)
      audio.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  }

  if (loading) return;
  else if (validUser)
    return (
      <main data-theme="light">
        <ToggleThemeTopRight />
        <div className="flex items-center absolute top-8 left-8">
          {notificationsEnabled ? (
            <IoMdNotifications className="h-6 w-6 mr-3 text-base-content" />
          ) : (
            <IoMdNotificationsOff className="h-6 w-6 mr-3 text-base-content/60" />
          )}
          <input
            type="checkbox"
            className="toggle"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
        </div>
        <div className="flex w-full min-h-screen bg-base-100">
          <div className="m-20 w-full flex flex-col items-center">
            <div
              className="w-full overflow-auto h-full max-w-[1200px] shadow-sm p-4"
              id="messages-container"
              style={{ maxHeight: contentHeight, height: contentHeight }}
            >
              {conversationMessages.map((message) => {
                return (
                  <div
                    className={`chat ${
                      message.from === user._id ? "chat-end" : "chat-start"
                    }`}
                    key={message._id}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="/images/defaultuser.jpg"
                        />
                      </div>
                    </div>
                    <div className="chat-header">
                      {message.from === user._id
                        ? user.username
                        : otherUser?.username}{" "}
                      <time className="text-xs opacity-50">
                        {getPrettyTimestamp(message.date)}
                      </time>
                    </div>
                    <div className="chat-bubble">{message.content}</div>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex items-center max-w-[1000px] mt-4">
              <input
                className={`w-full p-3 text-sm bg-none bg-transparent shadow-sm border-[2px] border-base-300 rounded-md focus:outline-none outline-none focus:border-primary mr-4`}
                type="text"
                placeholder="Send message"
                autoComplete="off"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="btn btn-primary shadow-sm"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <BottomNavbar activeTab={"messages"} />
      </main>
    );
  else window.location.href = "/onboarding";
}
