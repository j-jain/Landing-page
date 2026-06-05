import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RtbsCards from "@/components/RtbsCards";
import UseCases from "@/components/UseCases";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <UseCases />
      <RtbsCards />
      <Testimonials />
      <CtaBand />
      <div className="faq-footer">
        <Faq />
        <Footer />
      </div>
    </>
  );
}
