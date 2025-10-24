import Faq from '../../Components/Pages/Faq'
import HowToBuy from '../../Components/Pages/Howtobuy'
import WhyTOBuy from '../../Components/Pages/WhyToBuy'
import WhyToBuy2 from '../../Components/Pages/WhyToBuy2'
import BuyBitcoinHero from '../../Components/Pages/BuyBitcoinHero'
import BuyBitcoinGrid from '../../Components/Pages/BuyBitcoinGrid'
import { BuyBitcoinToPortfolio } from '../../Components/Pages/Others'

export default function page() {

    return (
        <div>
            <BuyBitcoinHero />
            <HowToBuy />
            <WhyTOBuy />
            <BuyBitcoinGrid />
            <WhyToBuy2 />
            <Faq />
            <BuyBitcoinToPortfolio />
        </div>
    )
}