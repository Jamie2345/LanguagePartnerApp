import { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import Select from "react-select";
import LanguageOptions from "../data/countries";
import ProficiencyOptions from "../data/proficiencies";
import interestOptions from "../data/interests";
import { MdDelete } from "react-icons/md";

import "../css/onboarding.css";

export default function Onboarding() {
  const [selected, setSelected] = useState("");

  return (
    <main data-theme="light">
      <div className="w-full h-screen flex items-center justify-center bg-base-200">
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
                selected={selected}
                onSelect={(code) => setSelected(code)}
              />
            </div>
            <div className="w-full flex-col">
              <p className="text-primary-content">
                What languages do you speak / want to learn? (please include
                your native language as well)
              </p>
              <div className="flex flex-col items-start pt-2">
                <div className="flex flex-col">
                  <div className="mb-2 flex items-center">
                    <div className="min-w-48 mr-6">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Select Language"
                        isSearchable={true}
                        name="language"
                        options={LanguageOptions}
                      />
                    </div>
                    <div className="min-w-64 mr-6">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={ProficiencyOptions[0]}
                        name="language"
                        options={ProficiencyOptions}
                      />
                    </div>
                    <button className="p-1">
                      <MdDelete className="text-accent h-8 w-8" />
                    </button>
                  </div>
                  <div className="mb-2 flex items-center">
                    <div className="min-w-48 mr-6">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Select Language"
                        isSearchable={true}
                        name="language"
                        options={LanguageOptions}
                      />
                    </div>
                    <div className="min-w-64 mr-6">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={ProficiencyOptions[0]}
                        name="language"
                        options={ProficiencyOptions}
                      />
                    </div>
                    <button className="p-1">
                      <MdDelete className="text-accent h-8 w-8" />
                    </button>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm shadow-md">
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
