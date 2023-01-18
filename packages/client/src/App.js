import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="/calendar" />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
