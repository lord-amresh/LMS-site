import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Bookings from "./pages/Bookings";
import Edit from "./pages/Edit"; // ADD THIS IMPORT

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/addcourse" element={<Add />} />
      <Route path="/listcourse" element={<List />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/editcourse/:id" element={<Edit />} /> {/* ADD THIS ROUTE */}
    </Routes>
  );
};

export default App;