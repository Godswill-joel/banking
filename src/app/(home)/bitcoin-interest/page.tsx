import Faq from "@/Components/Pages/Faq";
import Hero from "@/Components/Pages/bitcoin-interest-pages/Hero";
import InterestCalculator from "@/Components/Pages/bitcoin-interest-pages/interestCalculator";
import { BuyingSteps, Grow, IntrestOther2, StartEarningButton, Disclosures } from "@/Components/Pages/Others";

export default function page() {
    return (
        <div>
            <Hero />
            <BuyingSteps />
            <InterestCalculator />
            <Grow />
            <IntrestOther2 />
            <StartEarningButton />
            <Faq />
            <Disclosures />
        </div>
    )
}