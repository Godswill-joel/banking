import ContactTrustPage from "../../Components/Pages/TrustPage";
import BusinessFuturePage from "../../Components/Pages/Securebitcoin";
import PerformanceSection from "../../Components/Pages/Perfomance";
import BusinessHero from "@/Components/Pages/BusinessHero";
import BusinessSteps from "@/Components/Pages/BusinessSteps";

export default function page(){
    return (
        <>
        <BusinessHero />
        <ContactTrustPage />
        <BusinessFuturePage />
        <PerformanceSection />
        <BusinessSteps />
        </>
    )
} 