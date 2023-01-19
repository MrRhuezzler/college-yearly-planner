import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full">
      <div className="py-5 px-8">
        <Link to="/">Home</Link>
      </div>
      <div className="w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
    </div>
  );
};

export default Navbar;
