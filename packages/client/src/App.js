import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Activities from "./pages/Activites";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import Planner from "./pages/Planner";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="/calendar" />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="calendar/:year/planner" element={<Planner />} />
          <Route path="calendar/:year/planner/:id" element={<Activities />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
