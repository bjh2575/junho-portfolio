"use client";
import { useEffect } from "react";

import About from "@/components/About";
import Services from "@/components/Services";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Work from "@/components/Work/Work";
import Contact from "@/components/Contact";
import FixedMenu from "@/components/FixedMenu";
import Footer from "@/components/Footer";
import ChatModal from "@/components/ChatModal";


const Home = () => {
  // implement locomative scroll
  useEffect(()=> {
    const loadLocomotiveScroll = async ()=> {
      const LocomotiveScroll = ( await import("locomotive-scroll")).default;
      new LocomotiveScroll();
    };
    loadLocomotiveScroll();
  }, []);
  return (
    <>
      <Hero />
      <FixedMenu />
      <Services />
      <About />
      <Journey />
      <Work />
      <Contact />
      <Footer />
      <ChatModal />
      {/* temporary div */}
      {/* <div className="h-[3000px]"></div> */}
    </>
  );
};

export default Home
