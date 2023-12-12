import { Link } from "react-router-dom";
import { adminPrefix } from "../App";

const Navbar = () => {
  return (
    <div className="w-full">
      <div className="py-5 px-8 flex flex-row space-x-4">
        <Link to={`/${adminPrefix}/calendar`}>Calendars</Link>
        <Link to={`/${adminPrefix}/template`}>Templates</Link>
      </div>
      <div className="w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
    </div>
  );
};

export default Navbar;
