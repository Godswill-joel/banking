import WalletHero from "@/Components/Pages/WalletHero";
import { DownloadAppSection, WalletPage3Comp, GetstartedButton } from "@/Components/Pages/Others";



export default function page() {

    return (
        <section>
           <WalletHero />
           <DownloadAppSection />
           <WalletPage3Comp />
           <GetstartedButton />
        </section>
    )
}