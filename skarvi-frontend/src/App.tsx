import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar"; // Import your custom navbar
import 'bootstrap/dist/css/bootstrap.min.css';
import Homeboard from "./Homeboard";
import Physicaltrades from "./Physicaltrades";
import Papertrades from "./components/Papertrades";
import Chartering from "./components/Chartering";
import Reports from "./components/Reports";
import OperationsAndLogistics from "./components/OperationsAndLogistics";
import InventoryManagement from "./components/InventoryManagement";
import EndOfDay from "./components/EndOfDay";
import AdminTools from "./components/AdminTools";
// import Development from "./components/Development";
import AddNewTrade from "./components/Papertrades_AddNewTrade";

const App: React.FC = () => {
  return (
    <Router>
      <CustomNavbar /> 
      {/* Use CustomNavbar here */}
      <Routes>
        <Route path="/" element={<Homeboard/>} />
        <Route path="/physical-trades" element={<Physicaltrades/>} />
        <Route path="/paper-trades" element={<Papertrades/>} />
        <Route path="/chartering" element={<Chartering/>} />
        <Route path="/reports" element={<Reports/>} />
        <Route path="/operationsandlogistics" element={<OperationsAndLogistics/>} />
        <Route path="/inventorymanagement" element={<InventoryManagement/>} />
        <Route path="/endofday" element={<EndOfDay/>} />
        <Route path="/admintools" element={<AdminTools/>} />
        {/* <Route path="/development" element={<Development/>} /> */}
        <Route path="/add-new-trade" element={<AddNewTrade />} />
      </Routes>
    </Router>
  );
};

export default App;
