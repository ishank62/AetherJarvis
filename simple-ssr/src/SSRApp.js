import React, { useState } from "react";
import ProductList from "./components/ProductList";

const SSRApp = ({ data }) => {
  const [result, setResult] = useState({ loading: false, products: data });
  return (
    <div>
      <ProductList result={result} />
    </div>
  );
};

export default SSRApp;
