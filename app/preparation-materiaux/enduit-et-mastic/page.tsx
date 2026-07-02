import fs from "fs";
import path from "path";
import ProductListingPage from "@/app/Productlistingpage/page";

// Server Component — reads the JSON data file from disk at request/build time.
// To power a different category page, duplicate this route and point `dataPath`
// at a different JSON file (e.g. data/products-peinture-mur.json).
async function getData() {
  const dataPath = path.join(process.cwd(), "data", "/products.json");
  const file = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(file);
}

export default async function Page() {
  const data = await getData();
  return <ProductListingPage data={data} />;
}