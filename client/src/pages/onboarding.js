import { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import Select from "react-select";
import LanguageOptions from "../data/countries";
import ProficiencyOptions from "../data/proficiencies";
import interestOptions from "../data/interests";
import { MdDelete } from "react-icons/md";

import axiosInstance from "../api/axiosInstance";

import "../css/onboarding.css";

export default function Onboarding() {
  const [nationality, setNationality] = useState("");
  const [languages, setLanguages] = useState([]);
  const [interests, setInterests] = useState();

  async function handleSubmit() {
    const data = {
      nationality,
      languages,
      interests,
    };

    try {
      if (data?.nationality && data?.languages.length > 1) {
        let formValid = true;
        // make sure that all languages have a proficiency and language selected
        if (languages.length < 2 || languages.length > 10) {
          return res.status(400).json({
            message: "Please select between 2 and 10 languages (one should be your native languages and the others should be languages you are learning).",
          });
        }

        if (languages.length < 2 || languages.length > 10) {
          alert("Please select between 2 and 10 languages (one should be your native languages and the others should be languages you are learning).");
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
        const response = await axiosInstance.put("/api/onboarding", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 200) {
          window.location.href = "/lengua";
        } else {
          alert(response.data.message);
        }
      }
      else if (!data?.nationality) {
        alert("Please enter your nationality.");
      }
      else {
        alert("Please enter your native language and at least one other language you want to learn.");
      }
    }
    catch (err) {
      alert("An unexpected error occured please try again.");
    }
  }

  return (
    <main data-theme="light">
      <div className="w-full min-h-screen h-full flex items-center justify-center bg-base-200">
        <div className="flex flex-col py-12 px-8 m-8 rounded-2xl shadow-2xl items-center bg-gradient-to-br from-primary to-primary/50 shadow-base-300 w-full max-w-[730px]">
          <div className="flex text-center flex-col mb-12">
            <h1 className="text-4xl font-bold text-primary-content">
              Welcome to Lengua!
            </h1>
            <p className="text-lg text-primary-content">
              To get started please finish setting up your profile.
            </p>
          </div>
          <div className="grid gap-4 font-semibold">
            <div className="w-full">
              <p className="text-primary-content mb-2">Where are you from?</p>
              <ReactFlagsSelect
                className="text-base-content"
                selectButtonClassName="country-btn"
                searchable={true}
                selected={nationality}
                onSelect={(code) => setNationality(code)}
              />
            </div>
            <div className="w-full flex-col">
              <p className="text-primary-content">
                What languages do you speak / want to learn? (please include
                your native language as well)
              </p>
              <div className="flex flex-col items-start pt-2">
                <div className="flex flex-col">
                  {languages.map((language, index) => {
                    return (
                      <div className="mb-2 flex items-center" key={index}>
                        <div className="min-w-48 mr-6">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Language"
                            isSearchable={true}
                            name="language"
                            options={LanguageOptions}
                            onChange={(selectedOption) => {
                              setLanguages((prevLanguages) =>
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
                          />
                        </div>
                        <div className="min-w-64 mr-6">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={ProficiencyOptions[0]}
                            name="language"
                            options={ProficiencyOptions}
                            onChange={(selectedOption) => {
                              setLanguages((prevLanguages) =>
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
                          />
                        </div>
                        <button className="p-1">
                          <MdDelete
                            className="text-accent h-8 w-8"
                            onClick={() => {
                              setLanguages((prevLanguages) =>
                                prevLanguages.filter((_, idx) => idx !== index)
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
                    setLanguages((prevLanguages) => [
                      ...prevLanguages,
                      newLanguage,
                    ]);
                    console.log(languages);
                  }}
                >
                  Add Language
                </button>
              </div>
            </div>
            <div className="w-full">
              <p className="text-primary-content mb-2">
                What are your interests / hobbies?
              </p>
              <div className="w-full max-w-full">
                <Select
                  closeMenuOnSelect={false}
                  placeholder="Select Interests / Hobbies"
                  isMulti
                  options={interestOptions}
                  onChange={(interests) => {
                    console.log(interests);
                    setInterests(interests);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-8 flex-col">
            <p className="text-primary-content font-semibold mb-2">
              Finished the form?
            </p>
            <button
              className="btn btn-md w-full shadow-md bg-gradient-to-br from-secondary to-secondary/50 border-primary text-secondary-content"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
