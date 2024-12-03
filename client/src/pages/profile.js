import useUserData from "../hooks/useUserData";
import BottomNavbar from "../components/BottomNavbar";

import ToggleThemeTopRight from "../components/ToggleThemeTopRight";

import ReactFlagsSelect from "react-flags-select";
import { useEffect, useState } from "react";

import LanguageOptions from "../data/countries";
import ProficiencyOptions from "../data/proficiencies";
import interestOptions from "../data/interests";

import { MdDelete } from "react-icons/md";
import Select from "react-select";

import axiosInstance from "../api/axiosInstance";

import "../css/reactflagsselect.css";

export default function Profile() {
  const { user, validUser, loading } = useUserData();
  const [nationalityEdit, setNationalityEdit] = useState(false);
  const [languagesEdit, setLanguagesEdit] = useState([]);
  const [interestsEdit, setInterestsEdit] = useState([]);

  const [contentHeight, setContentHeight] = useState("0px");

  // store users data in the variables to be displayed in the form to allow users to edit them.
  useEffect(() => {
    if (validUser && user) {
      setNationalityEdit(user.nationality);
      setLanguagesEdit(user.languages);
      setInterestsEdit(user.interests);
    }
  }, [user]);

  useEffect(() => {
    const adjustHeight = () => {
      try {
        const contentResponsiveHeight = window.innerHeight - 240; // height of the screen - (y margin in pixels + space used for input box).
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

  function hasUserEditedProfile() {
    if (validUser && user) {
      if (
        user.nationality !== nationalityEdit ||
        user.languages !== languagesEdit ||
        user.interests !== interestsEdit
      )
        return true;
      return false;
    }
    return false;
  }

  async function saveUpdatedProfile() {
    console.log(hasUserEditedProfile());
    if (!hasUserEditedProfile()) return;

    const data = {
      nationality: nationalityEdit,
      languages: languagesEdit,
      interests: interestsEdit,
    };

    try {
      if (data?.nationality && data?.languages.length > 1) {
        let formValid = true;
        // make sure that all languages have a proficiency and language selected
        if (languagesEdit.length < 2 || languagesEdit.length > 10) {
          return res.status(400).json({
            message:
              "Please select between 2 and 10 languages (one should be your native languages and the others should be languages you are learning).",
          });
        }

        if (languagesEdit.length < 2 || languagesEdit.length > 10) {
          alert(
            "Please select between 2 and 10 languages (one should be your native languages and the others should be languages you are learning)."
          );
          formValid = false;
        }

        if (data?.interests) {
          if (data.interests.length > 10) {
            alert("Please select a maximum of 10 interests.");
            formValid = false;
          }
        }

        if (!formValid) return;

        // if code reaches here then form valid
        const response = await axiosInstance.put("/api/profile", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          alert("Profile updated successfully.");
        } else {
          alert(response.data.message);
        }
      } else if (!data?.nationality) {
        alert("Please enter your nationality.");
      } else {
        alert(
          "Please enter your native language and at least one other language you want to learn."
        );
      }
    } catch (err) {
      console.log(err);
      alert("An unexpected error occured please try again.");
    }
  }

  if (loading) return;
  else if (validUser)
    return (
      <main data-theme="light">
        <ToggleThemeTopRight />
        <div className="flex w-full min-h-screen bg-base-100">
          <div className="w-full mt-10 mb-20 flex items-center justify-center">
            <div
              className="w-full flex flex-col rounded-3xl p-16 shadow-lg max-w-[1000px] bg-primary overflow-auto border-[1px] border-secondary"
              style={{ maxHeight: contentHeight }}
            >
              <div className="w-full flex items-center border-b-[1px] pb-8 border-base-100/40">
                <div className="mr-12 cursor-pointer">
                  <img
                    src="/images/defaultuser.jpg"
                    alt="profile"
                    className="w-32 h-32 rounded-full"
                  />
                </div>
                <h2 className="text-primary-content text-2xl font-semibold">
                  {user.username}
                </h2>
              </div>
              <div className="w-full flex items-center justify-center border-b-[1px] border-base-100/40 py-8">
                <div className="grid gap-8 font-semibold w-full">
                  <div className="w-full">
                    <p className="text-primary-content mb-2">
                      Where are you from?
                    </p>
                    <ReactFlagsSelect
                      searchable={true}
                      selected={nationalityEdit}
                      onSelect={(code) => setNationalityEdit(code)}
                    />
                  </div>
                  <div className="w-full flex-col">
                    <p className="text-primary-content">
                      What languages do you speak / want to learn? (please
                      include your native language as well)
                    </p>
                    <div className="flex flex-col items-start pt-2">
                      <div className="flex flex-col">
                        {languagesEdit.map((language, index) => {
                          return (
                            <div className="mb-2 flex items-center" key={index}>
                              <div className="min-w-48 mr-6">
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  placeholder="Select Language"
                                  isSearchable={true}
                                  name="language"
                                  value={language.language}
                                  options={LanguageOptions}
                                  onChange={(selectedOption) => {
                                    setLanguagesEdit((prevLanguages) =>
                                      prevLanguages.map(
                                        (lang, idx) =>
                                          idx === index // Check if the current index matches the selected index
                                            ? {
                                                ...lang,
                                                language: selectedOption,
                                              } // Update the `language` property
                                            : lang // Return the unmodified language
                                      )
                                    );
                                  }}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                      ...theme.colors,
                                      //after select dropdown option
                                      primary50: "oklch(var(--pc))",
                                      //Border and Background dropdown color
                                      primary: "oklch(var(--p) / 0.7)",
                                      //Background hover dropdown color
                                      primary25: "oklch(var(--b3))",
                                      //Background color
                                      neutral0: "oklch(var(--b1))",
                                      //Border before select
                                      neutral20: "oklch(var(--bc) / 0.3)",
                                      //Hover border
                                      neutral30: "oklch(var(--bc) / 0.5)",
                                      //No options color
                                      neutral40: "oklch(var(--bc / 0.6))",
                                      //Select color
                                      neutral50: "oklch(var(--bc) / 0.6)",
                                      //arrow icon when click select
                                      neutral60: "oklch(var(--bc) / 0.5)",
                                      //Text color
                                      neutral80: "oklch(var(--bc))",

                                      neutral10: "oklch(var(--b2))",
                                    },
                                  })}
                                />
                              </div>
                              <div className="min-w-64 mr-6">
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  value={language.proficiency}
                                  name="language"
                                  options={ProficiencyOptions}
                                  onChange={(selectedOption) => {
                                    setLanguagesEdit((prevLanguages) =>
                                      prevLanguages.map((lang, idx) =>
                                        idx === index
                                          ? {
                                              ...lang,
                                              proficiency: selectedOption,
                                            }
                                          : lang
                                      )
                                    );
                                  }}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                      ...theme.colors,
                                      //after select dropdown option
                                      primary50: "oklch(var(--pc))",
                                      //Border and Background dropdown color
                                      primary: "oklch(var(--p) / 0.7)",
                                      //Background hover dropdown color
                                      primary25: "oklch(var(--b3))",
                                      //Background color
                                      neutral0: "oklch(var(--b1))",
                                      //Border before select
                                      neutral20: "oklch(var(--bc) / 0.3)",
                                      //Hover border
                                      neutral30: "oklch(var(--bc) / 0.5)",
                                      //No options color
                                      neutral40: "oklch(var(--bc / 0.6))",
                                      //Select color
                                      neutral50: "oklch(var(--bc) / 0.6)",
                                      //arrow icon when click select
                                      neutral60: "oklch(var(--bc) / 0.5)",
                                      //Text color
                                      neutral80: "oklch(var(--bc))",

                                      neutral10: "oklch(var(--b2))",
                                    },
                                  })}
                                />
                              </div>
                              <button className="p-1">
                                <MdDelete
                                  className="text-accent h-8 w-8"
                                  onClick={() => {
                                    setLanguagesEdit((prevLanguages) =>
                                      prevLanguages.filter(
                                        (_, idx) => idx !== index
                                      )
                                    );
                                  }}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className="btn btn-secondary btn-sm shadow-md"
                        onClick={() => {
                          const newLanguage = {
                            language: "",
                            proficiency: ProficiencyOptions[0],
                          };
                          setLanguagesEdit((prevLanguages) => [
                            ...prevLanguages,
                            newLanguage,
                          ]);
                        }}
                      >
                        Add Language
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="text-primary-content mb-2 font-semibold">
                      What are your interests / hobbies?
                    </p>
                    <div className="w-full max-w-full">
                      <Select
                        closeMenuOnSelect={false}
                        placeholder="Select Interests / Hobbies"
                        isMulti
                        value={interestsEdit}
                        options={interestOptions}
                        onChange={(interests) => {
                          console.log(interests);
                          setInterestsEdit(interests);
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            //after select dropdown option
                            primary50: "oklch(var(--pc))",
                            //Border and Background dropdown color
                            primary: "oklch(var(--p) / 0.7)",
                            //Background hover dropdown color
                            primary25: "oklch(var(--b3))",
                            //Background color
                            neutral0: "oklch(var(--b1))",
                            //Border before select
                            neutral20: "oklch(var(--bc) / 0.3)",
                            //Hover border
                            neutral30: "oklch(var(--bc) / 0.5)",
                            //No options color
                            neutral40: "oklch(var(--bc / 0.6))",
                            //Select color
                            neutral50: "oklch(var(--bc) / 0.6)",
                            //arrow icon when click select
                            neutral60: "oklch(var(--bc) / 0.5)",
                            //Text color
                            neutral80: "oklch(var(--bc))",

                            neutral10: "oklch(var(--b2))",
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center pt-8">
                <div className="flex items-center">
                  <p className="text-primary-content text-sm mr-6 font-semibold">
                    Save changes?
                  </p>
                  <button
                    className={`transition-all duration-200 ${
                      hasUserEditedProfile()
                        ? "bg-secondary text-secondary-content cursor-pointer"
                        : "bg-secondary/20 text-secondary-content/80 cursor-not-allowed"
                    } py-3 px-4 text-sm rounded-md shadow-sm`}
                    onClick={saveUpdatedProfile}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomNavbar activeTab={"profile"} />
      </main>
    );
  else window.location.href = "/onboarding";
}
