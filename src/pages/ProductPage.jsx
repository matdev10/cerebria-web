import Product from "../components/Product";
import Reviews from "../components/Reviews";

import "../style/product-page.css";

function ProductPage() {
  return (
    <main className="product-page">
      <Product />

      <div className="product-page-reviews">
        <Reviews />
      </div>
    </main>
  );
}

export default ProductPage;