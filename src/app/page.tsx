import React from "react";
import HeroPage from '@/Components/Pages/HeroPage'
import FeaturedIn from "@/Components/Pages/FeaturedIn";
import AssetDisplay from "@/Components/Pages/AssetDisplay";

export default function Home() {
  return (
   <div>
    <HeroPage />
    <FeaturedIn />
    <AssetDisplay />

   </div>
  );
}
