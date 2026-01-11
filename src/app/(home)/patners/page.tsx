import WhatToExpect from "@/Components/Pages/patner/expect";
import HeroPartnerSection from "@/Components/Pages/patner/heroPatner";
import HowItWorks from "@/Components/Pages/patner/howitworks";
import PartnerProgramSection from "@/Components/Pages/patner/patnerprogram";

export default function page() {
    return (
        <div>
            <HeroPartnerSection />
            <PartnerProgramSection />
            <HowItWorks />
            <WhatToExpect />
        </div >
    )
}