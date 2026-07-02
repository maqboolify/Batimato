import Navbar from "@/components/navbar/page";
import Hero from "@/components/hero/page";
import AuthPage from "@/app/AuthPage/page";
import ContactPage from "@/components/ContactPage/page";
import Batimatohomepage from "@/components/Batimatohomepage/page";
import ProductsPage from "@/app/ProductsPage/page";
export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <AuthPage/>
      <ContactPage/>
      <ProductsPage/> */}
      <Batimatohomepage />
      
    </>
  );
}