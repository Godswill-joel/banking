import React from "react";
import HeroPage from '@/Components/Pages/HeroPage'
import Whyinvest from "@/Components/Pages/Whyinvest";
import FeaturedIn from "@/Components/Pages/FeaturedIn";
import AssetDisplay from "@/Components/Pages/AssetDisplay";
import HereForYou from "@/Components/Pages/HereForYou";
import JoinUs from "@/Components/Pages/JoinUs";

export default function Home() {
  return (
   <div>
    <HeroPage />
    <FeaturedIn />
    <AssetDisplay />
    <Whyinvest />
    <HereForYou />
    <JoinUs />
    
   </div>
  );
}
