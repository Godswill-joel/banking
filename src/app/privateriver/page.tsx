import ContactForm from "../../Components/Pages/Contact";
import Privateriver from "../../Components/Pages/Privateriver";
import Personalized from "../../Components/Pages/Personalized";
import FeaturedIn from "@/Components/Pages/FeaturedIn";
import WorldClassSecurity from "../../Components/Pages/Worldclass";


export default function page() {
  return (
    <>
    <Privateriver />
    <FeaturedIn />
    <Personalized />
    <WorldClassSecurity />
    <ContactForm />
    </>
  )
}