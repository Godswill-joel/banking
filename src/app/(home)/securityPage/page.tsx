import HeroSection from "@/Components/Pages/securityPage/Hero";
import ProofOfReserves from "@/Components/Pages/securityPage/proofofreserve";
import SecurityDetails from "@/Components/Pages/securityPage/securityDetails";
import SecurityStandard from "@/Components/Pages/securityPage/securitystandard";


export default function page() {
    return (
        <>
        <HeroSection />
        <SecurityDetails />
        <ProofOfReserves />
        <SecurityStandard />
        </>
    )
}