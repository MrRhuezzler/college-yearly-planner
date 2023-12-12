import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Activities from "./pages/Activites";
import Calendar from "./pages/Calendar";
import Holidays from "./pages/Holildays";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Template from "./pages/Template";
import TemplateActivities from "./pages/TemplateActivites";
import ActivitiesShow from "./pages/ActivitiesShow";
import Error404 from "./pages/Error404";

export const adminPrefix = "Y3lwLWFkbWluLWVuZHBvaW50";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/${adminPrefix}`} element={<Home />}>
          <Route index element={<Navigate to={`/${adminPrefix}/calendar`} />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="calendar/:year/planner" element={<Planner />} />
          <Route path="calendar/:year/holidays" element={<Holidays />} />
          <Route path="calendar/:year/planner/:id" element={<Activities />} />
          <Route path="template" element={<Template />} />
          <Route path="template/:id" element={<TemplateActivities />} />
        </Route>
        <Route
          path="/:base64"
          element={<ActivitiesShow />}
        />
        <Route path="*" element={<Error404/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
