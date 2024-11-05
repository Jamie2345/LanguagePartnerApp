import React from "react";
import LandingNavbar from "./components/LandingNavbar";

import Login from "./pages/login";
import Home from "./pages/home";

function App() {
  return (
    <main data-theme="dracula">
      <section id="home">
        <div className="flex flex-1 w-full h-screen items-center flex-col">
          <LandingNavbar />
          <div className="flex flex-1 w-full items-center justify-center">
            <div className="flex items-center mb-12 mx-8 max-w-[1400px]">
              <div className="mr-12">
                <h2 className="text-4xl font-semibold mb-4">
                  Learn Languages faster by meeting new people
                </h2>
                <p className="text-md text-base-content/80 mb-4">
                  With Lengua, meet people across the world and practice your
                  speaking, listening, reading and writing skills with a
                  partner.
                </p>
                <div className="flex gap-4">
                  <a href="/register" className="btn btn-primary">Get Started</a>
                  <a href="/register" className="btn btn-secondary">Login</a>
                </div>
              </div>
              <div className="max-w-[600px]">
                <img className="w-full h-auto" src=""></img>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features">
        <div className="flex flex-1 w-full items-center flex-col bg-cyan-900">
          <div className="p-16 flex flex-col w-full max-w-[1000px]">
            <div className="flex items-center justify-between py-6 px-2">
              <div className="max-w-96 mr-4">
                <h2 className="text-4xl font-semibold">
                  Explore the world using Lengua!
                </h2>
              </div>
              <div className="max-w-60 text-right">
                <p className="text-sm text-base-content/90">
                  Lengua makes language learning and cultural exchange
                  accessible to everyone.
                </p>
              </div>
            </div>
            <div className="w-full flex flex-1 gap-4">
              <div className="flex flex-1 py-8 px-4 rounded-3xl bg-gradient-to-b from-secondary to-secondary/75 shadow-lg flex-col items-center">
                <div className="w-full text-left">
                  <h3 className="text-2xl font-semibold mb-4">
                    Meet new people and find the perfect language partner for
                    you
                  </h3>
                  <p className="text-sm text-base-content/90">
                    It's not just about finding language partners; it's about
                    creating meaningful connections with people who share the
                    same interests and goals as you.
                  </p>
                </div>
                <div className="h-[200px] w-full mt-[50px]"></div>
              </div>
              <div className="flex flex-1 px-4 rounded-3xl flex-col gap-8">
                <div className="py-8 px-4 rounded-3xl shadow-lg bg-gradient-to-b from-accent to-accent/75 flex flex-1">
                  <div className="mr-4 w-56"></div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      The world at your fingertips
                    </h3>
                    <p className="text-sm text-base-content/90">
                      Take the whole world with you. anywhere, anytime, as you
                      connect with languages partners around the globe, breaking
                      down learning barriers.
                    </p>
                  </div>
                </div>
                <div className="py-8 px-4 rounded-3xl shadow-lg bg-gradient-to-b from-primary to-primary/75 flex flex-1">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      Boost proficiency through practice
                    </h3>
                    <p className="text-sm text-base-content/90">
                      Practice speaking. writing, and listening with your
                      language partners to improve your language skills.
                    </p>
                  </div>
                  <div className="mr-4 w-56"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="cta1">
        <div className="w-full flex items-center justify-center p-8 py-24 bg-secondary">
          <div className="flex max-w-[1000px] w-full rounded-xl shadow-md bg-gradient-to-tl from-primary to-primary/75 px-8 py-16 items-center justify-between">
            <div className="w-[50%] mr-8"></div>
            <div className="grid gap-4">
              <h2 className="text-3xl font-semibold">
                Start your language learning journey today!
              </h2>
              <p className="text-md text-base-content/80">
                Improve your language skills while making meaningful connections
                with real people around the world.
              </p>
              <div className="flex items-center">
                <a href="/register" className="btn btn-accent mr-4">
                  Sign Up
                </a>
                <a href="/login" className="btn">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="faq">
        <div className="flex w-full items-center justify-center bg-base-100">
          <div className="w-full my-16 mx-4 max-w-[1000px] bg-base-content text-base-100 rounded-2xl shadow-md px-4 py-12 flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-12">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="collapse collapse-plus text-base-100 border-b-[1px] border-secondary border-opacity-30 p-2 rounded-none">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-semibold">
                How does it work?
              </div>
              <div className="collapse-content">
                <p>
                  Lengua is a language exchange platform that connects people
                  from around the world to allow them to learn languages in a
                  fun and interesting way.
                </p>
              </div>
            </div>
            <div className="collapse collapse-plus text-base-100 border-b-[1px] border-secondary border-opacity-30 p-2 rounded-none">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-semibold">
                Is it free?
              </div>
              <div className="collapse-content">
                <p>
                  Yes. Lengua is completeley free to use. There are no fees or
                  advertisements.
                </p>
              </div>
            </div>
            <div className="collapse collapse-plus text-base-100 border-b-[1px] border-secondary border-opacity-30 p-2 rounded-none">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-semibold">
                How can I join?
              </div>
              <div className="collapse-content">
                <p>
                  Simply press the "Sign up" button on the homepage and follow
                  the onboarding instructions.
                </p>
              </div>
            </div>
            <div className="collapse collapse-plus text-base-100 border-b-[1px] border-secondary border-opacity-30 p-2 rounded-none">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-semibold">
                Can I learn any language?
              </div>
              <div className="collapse-content">
                <p>
                  Yes, Lengua is a language partner platform so as long as
                  someone else speaks that language on our site you will be able
                  to partner up with them to learn the language.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus text-base-100 border-b-[1px] border-secondary border-opacity-30 p-2 rounded-none">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-semibold">
                Can I use it on mobile?
              </div>
              <div className="collapse-content">
                <p>
                  Lengua is a web based language learning app, meaning you can
                  use it on any device as long as it has a stable internet
                  connection and a web browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="footer">
        <footer>
          <div className="w-full px-16 py-32 bg-base-300 shadow-lg">
            <div className="w-full flex">
              <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
                <h2 className="text-2xl font-semibold mb-3 text-secondary">
                  Lengua.
                </h2>
                <p className="text-md font-light text-base-content/80 text-sm">
                  Meet new people across the world and learn languages together.
                </p>
                <p className="mt-3 text-sm text-base-content/50">
                  Copyright © 2024 - All rights reserved
                </p>
              </div>

              <div className="flex-1 flex justify-center pl-40">
                <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                  <h3 className="text-base-content/75 font-semibold text-lg tracking-widest">
                    LINKS
                  </h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href="#features"
                      className="text-base-content/60 hover:text-secondary hover:underline"
                    >
                      Features
                    </a>

                    <a
                      href="#faqs"
                      className="text-base-content/60 hover:text-secondary hover:underline"
                    >
                      FAQ
                    </a>
                  </div>
                </div>
                <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                  <h3 className="text-base-content/75 font-semibold text-lg tracking-widest">
                    LEGAL
                  </h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href="#"
                      className="text-base-content/60 hover:text-secondary hover:underline"
                    >
                      Terms of service
                    </a>
                    <a
                      href="#"
                      className="text-base-content/60 hover:text-secondary hover:underline"
                    >
                      Privacy policy
                    </a>
                  </div>
                </div>
                <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                  <h3 className="text-base-content/75 font-semibold text-lg tracking-widest">
                    MORE
                  </h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href="#"
                      className="text-base-content/60 hover:text-secondary hover:underline"
                    >
                      Coming Soon...
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

export default App;
