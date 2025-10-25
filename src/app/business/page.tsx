import ContactTrustPage from "../../Components/Pages/TrustPage";
import BusinessFuturePage from "../../Components/Pages/Securebitcoin";
import PerformanceSection from "../../Components/Pages/Perfomance";
import BusinessHero from "@/Components/Pages/BusinessHero";
import BusinessSteps from "@/Components/Pages/BusinessSteps";
import SecurityFeature from "@/Components/Pages/SecurityFeature";
import BusinessInsights from "@/Components/Pages/BusinessInsight";
import CustomerStories from "@/Components/Pages/CustomerNeed";
import Hero from "@/Components/Pages/Bitcoin";

export default function page(){
    return (
        <>
        <BusinessHero />
        <ContactTrustPage />
        <BusinessFuturePage />
        <PerformanceSection />
        <BusinessSteps />
        <SecurityFeature />
        <CustomerStories />
        <BusinessInsights />
        <Hero />
        </>
    )
} 