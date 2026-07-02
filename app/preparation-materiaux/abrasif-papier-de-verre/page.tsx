import fs from "fs";
import path from "path";
import ProductListingPage from "@/app/Productlistingpage/page";

async function getData() {
  const dataPath = path.join(process.cwd(), "data", "products-abrasif-papier-de-verre.json");
  const file = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(file);
}

export default async function Page() {
  const data = await getData();
  return <ProductListingPage data={data} />;
}