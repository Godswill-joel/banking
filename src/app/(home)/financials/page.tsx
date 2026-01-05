import FinancialsHero from "@/Components/Pages/financials/financialsHero";
import WalkThroughFinancials from "@/Components/Pages/financials/riverFinancials";
import FinancialMetricsSection from "@/Components/Pages/financials/metricSectioin";

export default function page(){
    return (
        <>
           <FinancialsHero />
           <FinancialMetricsSection />
           <WalkThroughFinancials />
        </>
    )
}