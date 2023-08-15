import React, { useEffect, useState } from "react";
import Mainpage from './components/App/App';


const App = ({ isSSR, ssrData }) => {
  const [err, setErr] = useState(false);
  const [result, setResult] = useState({ loading: true, products: null });

  if (err) {
    return <div>Error {err}</div>;
  } else {
    return (
      <div>
        <Mainpage />
      </div>
    );
  }
};

export default App;
