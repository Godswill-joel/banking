import ContactForm from "../../Components/Pages/privateriver/Contact";
import Privateriver from "../../Components/Pages/privateriver/Privateriver";
import Personalized from "../../Components/Pages/privateriver/Personalized";
import FeaturedIn from "@/Components/Pages/FeaturedIn";
import WorldClassSecurity from "../../Components/Pages/privateriver/Worldclass";


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