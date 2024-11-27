import { useEffect, useState, useRef, useLayoutEffect } from "react";
import axiosInstance from "../api/axiosInstance";

import LanguageOptions from "../data/countries";
import interestOptions from "../data/interests";
import ProficiencyOptions from "../data/proficiencies";

import ReactFlagsSelect from "react-flags-select";
import Select from "react-select";

import ReactCountryFlag from "react-country-flag";

export default function Lengua() {
  const [validUser, setValidUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        const user = response.data?.user;

        if (user && user?.nationality && user?.languages.length > 1) {
          setValidUser(true); // true as the data is valid!
        } else {
          console.log("fail");
          setValidUser(false);
        }
      } catch (error) {
        console.log(error);
        setValidUser(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProtected();
  }, []);

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

        console.log(filterInputHeight, contentResponsiveHeight, window.innerHeight);
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

  if (loading) return;
  else if (validUser) {
    return (
      <main data-theme="light">
        <div className="w-full min-h-screen flex justify-center">
          <div className="flex flex-col m-20 w-full max-w-[1200px] items-center flex-1">
            <div className="w-full mb-4">
              <div
                id="filter-search-div"
                className="flex flex-col gap-4 w-full max-w-[900px]"
                ref={filterInputRef}
              >
                <h2 className="text-base-content text-2xl font-semibold">
                  Search for other users
                </h2>
                <div className="flex items-center">
                  <div className="min-w-48 mr-3">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select Language"
                      isSearchable={true}
                      name="language"
                      options={LanguageOptions}
                    />
                  </div>
                  <div className="min-w-64 mr-3">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select Proficiency"
                      name="language"
                      options={ProficiencyOptions}
                    />
                  </div>
                  <div className="min-w-64 w-full">
                    <Select
                      closeMenuOnSelect={false}
                      placeholder="Select Interests / Hobbies"
                      isMulti
                      options={interestOptions}
                    />
                  </div>
                </div>
                <button className="btn btn-md w-full shadow-md bg-gradient-to-br from-primary to-primary/50 text-primary-content">
                  Search
                </button>
              </div>
            </div>

            <div
              className="grid gap-2 overflow-auto w-full"
              style={{ maxHeight: contentHeight }}
            >
              <div className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center">
                <div className="mr-12">
                  <img
                    src="/images/defaultuser.jpg"
                    alt="user"
                    className="w-32 h-auto"
                  />
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex">
                    <h2 className="text-2xl font-semibold mr-4">John Doe</h2>
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{
                        width: "2em",
                        height: "auto",
                      }}
                      title="US"
                    />
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      English: C2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      Spanish: B2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      French: A2
                    </div>
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Programming
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Basketball
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Football
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Engineering
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center">
                <div className="mr-12">
                  <img
                    src="/images/defaultuser.jpg"
                    alt="user"
                    className="w-32 h-auto"
                  />
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex">
                    <h2 className="text-2xl font-semibold mr-4">John Doe</h2>
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{
                        width: "2em",
                        height: "auto",
                      }}
                      title="US"
                    />
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      English: C2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      Spanish: B2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      French: A2
                    </div>
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Programming
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Basketball
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Football
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Engineering
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center">
                <div className="mr-12">
                  <img
                    src="/images/defaultuser.jpg"
                    alt="user"
                    className="w-32 h-auto"
                  />
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex">
                    <h2 className="text-2xl font-semibold mr-4">John Doe</h2>
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{
                        width: "2em",
                        height: "auto",
                      }}
                      title="US"
                    />
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      English: C2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      Spanish: B2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      French: A2
                    </div>
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Programming
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Basketball
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Football
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Engineering
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center">
                <div className="mr-12">
                  <img
                    src="/images/defaultuser.jpg"
                    alt="user"
                    className="w-32 h-auto"
                  />
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex">
                    <h2 className="text-2xl font-semibold mr-4">John Doe</h2>
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{
                        width: "2em",
                        height: "auto",
                      }}
                      title="US"
                    />
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      English: C2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      Spanish: B2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      French: A2
                    </div>
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Programming
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Basketball
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Football
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Engineering
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-12 px-8 border-[1px] border-secondary rounded-xl shadow-xl flex items-center">
                <div className="mr-12">
                  <img
                    src="/images/defaultuser.jpg"
                    alt="user"
                    className="w-32 h-auto"
                  />
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex">
                    <h2 className="text-2xl font-semibold mr-4">John Doe</h2>
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{
                        width: "2em",
                        height: "auto",
                      }}
                      title="US"
                    />
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      English: C2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      Spanish: B2
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-primary rounded-md text-primary-content text-sm font-semibold mr-4">
                      French: A2
                    </div>
                  </div>
                  <div className="flex mt-2 max-w-full flex-wrap gap-y-2">
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Programming
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Basketball
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Football
                    </div>
                    <div className="py-1 px-2 border-base-content border-[1px] bg-accent rounded-md text-accent-content text-sm font-semibold mr-4">
                      Engineering
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } else window.location.href = "/onboarding";
}
