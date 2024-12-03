import { useEffect, useState, useRef, useLayoutEffect } from "react";
import axiosInstance from "../api/axiosInstance";

import LanguageOptions from "../data/countries";
import interestOptions from "../data/interests";
import ProficiencyOptions from "../data/proficiencies";

import ReactFlagsSelect from "react-flags-select";
import Select from "react-select";

import ReactCountryFlag from "react-country-flag";

import useUserData from "../hooks/useUserData";

import BottomNavbar from "../components/BottomNavbar";

import ToggleThemeTopRight from "../components/ToggleThemeTopRight";

export default function Lengua() {
  const { validUser, loading } = useUserData();

  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [interests, setInterests] = useState();

  const [searchUsers, setSearchUsers] = useState([]);

  // code to resize the results container so it doesn't overflow page.
  const [contentHeight, setContentHeight] = useState("0px");
  const filterInputRef = useRef();

  useLayoutEffect(() => {
    const adjustHeight = () => {
      try {
        const filterInputHeight = filterInputRef.current.clientHeight;
        const contentResponsiveHeight =
          window.innerHeight - filterInputHeight - 240;
        setContentHeight(`${contentResponsiveHeight}px`);

        console.log(
          filterInputHeight,
          contentResponsiveHeight,
          window.innerHeight
        );
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
  }, [filterInputRef, validUser, loading]);

  async function searchForUsers() {
    const interestsString = interests ? interests.join(",") : "";
    const url =
      language || proficiency || interestsString
        ? `/api/search?language=${language}&proficiency=${proficiency}&interests=${interestsString}`
        : "/api/search";

    try {
      const response = await axiosInstance.get(url);
      const data = response.data;

      if (data) {
        setSearchUsers(data);
        console.log(data);
        if (data.length === 0) {
          alert("No users found with the given criteria.");
        }
      } else {
        alert("No users found with the given criteria.");
      }
    } catch (err) {
      if (err.response.status === 400) {
        alert("Please provide both language and proficiency");
      }
      console.log(err);
    }
  }

  async function startConversation(recipientId) {
    console.log(recipientId);
    try {
      const response = await axiosInstance.post("/api/conversation", {
        recipientId,
      });

      if (response.status === 200) {
        const conversationId = response.data._id;
        window.location.href = `/messages/${conversationId}`;
      } else {
        alert("Error creating this conversation");
      }
    } catch (err) {
      console.log(err);
      if (
        err?.response?.status === 400 ||
        err?.response?.status === 401 ||
        err?.response?.status === 404
      ) {
        alert(err.response.data.message);
      } else {
        alert("Error starting conversation");
      }
    }
  }

  useEffect(() => {
    if (validUser) {
      searchForUsers();
    }
  }, [validUser]);

  if (loading) return;
  else if (validUser) {
    return (
      <main data-theme="light">
        <ToggleThemeTopRight />
        <div className="w-full min-h-screen flex justify-center">
          <div className="flex flex-col m-20 w-full max-w-[1200px] items-center flex-1">
            <div className="w-full mb-4">
              <div
                id="filter-search-div"
                className="flex flex-col gap-4 w-full max-w-[900px]"
                ref={filterInputRef}
              >
                <h2 className="text-base-content text-2xl font-semibold">
                  Search for other users{" "}
                  <span className="text-sm text-base-content/60">
                    (click on a user to start a conversation)
                  </span>
                </h2>
                <div className="flex items-center">
                  <div className="min-w-48 mr-3">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select Language"
                      isSearchable={true}
                      name="language"
                      isClearable={true}
                      options={LanguageOptions}
                      onChange={(e) => {(e === null) ? setLanguage("") : setLanguage(e.value)}}
                    />
                  </div>
                  <div className="min-w-64 mr-3">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select Proficiency"
                      name="language"
                      isClearable={true}
                      options={ProficiencyOptions}
                      onChange={(e) => {(e === null) ? setProficiency("") : setProficiency(e.value)}}
                    />
                  </div>
                  <div className="min-w-64 w-full">
                    <Select
                      closeMenuOnSelect={false}
                      placeholder="Select Interests / Hobbies"
                      isMulti
                      isClearable={true}
                      options={interestOptions}
                      onChange={(e) => {(e === null) ? setInterests([]) : setInterests(e.map((i) => i.value))}}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-md w-full shadow-md bg-gradient-to-br from-primary to-primary/50 text-primary-content"
                  onClick={searchForUsers}
                >
                  Search
                </button>
              </div>
            </div>

            <div
              className="grid gap-2 overflow-auto w-full"
              style={{ maxHeight: contentHeight }}
            >
              {searchUsers.map((searchedUser) => {
                return (
                  <div
                    className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center cursor-pointer"
                    key={searchedUser?._id}
                    onClick={() => {
                      startConversation(searchedUser?._id);
                    }}
                  >
                    <div className="mr-12">
                      <img
                        src="/images/defaultuser.jpg"
                        alt="user"
                        className="w-32 h-auto"
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <div className="flex">
                        <h2 className="text-2xl font-semibold mr-4">
                          {searchedUser?.username}
                        </h2>
                        <ReactCountryFlag
                          countryCode={searchedUser?.nationality}
                          svg
                          style={{
                            width: "2em",
                            height: "auto",
                          }}
                          title={searchedUser?.nationality}
                        />
                      </div>
                      <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                        {searchedUser?.languages.map((lang, index) => {
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
                        {searchedUser?.interests.map((interest, index) => {
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
                );
              })}
            </div>
            <BottomNavbar activeTab={"community"} />
          </div>
        </div>
      </main>
    );
  } else window.location.href = "/onboarding";
}
