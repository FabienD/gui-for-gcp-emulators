import { Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Pubsub from "./pages/Pubsub";
import Firestore from "./pages/Firestore";
import NoMatch from "./pages/NoMatch";

import "./styles.css";

function App(): React.ReactElement {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pubsub" element={<Pubsub />} />
        <Route path="firestore" element={<Firestore />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;
