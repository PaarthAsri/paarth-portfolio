"use client";

import { useState } from "react";
import LoadingSequence from "@/components/loading/LoadingSequence";
import Navbar from "@/components/navigation/Navbar";
import StatusBar from "@/components/navigation/StatusBar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Journey from "@/components/journey/Journey";
import Experience from "@/components/experience/Experience";
import Writeups from "@/components/writeups/Writeups";
import Projects from "@/components/projects/Projects";
import Certifications from "@/components/certifications/Certifications";
import Research from "@/components/research/Research";
import Contact from "@/components/contact/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingSequence onComplete={() => setLoading(false)} />}
      <Navbar />
      <main className="flex-1 pb-12">
        <Hero />
        <About />
        <Skills />
        <Journey />
        <Experience />
        <Writeups />
        <Projects />
        <Certifications />
        <Research />
        <Contact />
      </main>
      <StatusBar />
    </>
  );
}
