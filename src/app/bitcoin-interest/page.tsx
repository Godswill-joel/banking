import Hero from "@/Components/Pages/bitcoin-interest-pages/Hero";
import InterestCalculator from "@/Components/Pages/bitcoin-interest-pages/interestCalculator";
import { BuyingSteps, Grow, IntrestOther2 } from "@/Components/Pages/Others";

export default function page() {
    return (
        <div>
            <Hero />
            <BuyingSteps />
            <InterestCalculator />
            <Grow />
            <IntrestOther2 />
            
        </div>
    )
}