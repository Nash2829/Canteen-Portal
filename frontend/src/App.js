import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Navbar from "./components/templates/Navbar";
import VendorProfile from "./components/users/Vendor";
import BuyerProfile from "./components/users/Buyer";

const Layout = (props) => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
    localStorage.setItem('page', '/');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout  />}>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<UsersList />} />
          <Route path="login" element={<Login />} />
          <Route path="vendor" element={<VendorProfile />} />
          <Route path="buyer" element={<BuyerProfile />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
