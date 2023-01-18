import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <div className="w-screen">
        <Navbar></Navbar>
        <Outlet />
      </div>
    </>
  );
};

export default Home;
