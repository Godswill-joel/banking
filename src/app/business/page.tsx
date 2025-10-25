import ContactTrustPage from "../../Components/Pages/business/TrustPage";
import BusinessFuturePage from "../../Components/Pages/business/Securebitcoin";
import PerformanceSection from "../../Components/Pages/business/Perfomance";
import BusinessHero from "@/Components/Pages/business/BusinessHero";
import BusinessSteps from "@/Components/Pages/business/BusinessSteps";
import SecurityFeature from "@/Components/Pages/business/SecurityFeature";
import BusinessInsights from "@/Components/Pages/business/BusinessInsight";
import CustomerStories from "@/Components/Pages/business/CustomerNeed";
import Hero from "@/Components/Pages/business/Bitcoin";

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