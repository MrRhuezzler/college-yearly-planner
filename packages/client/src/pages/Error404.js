import { Buffer } from "buffer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCheckCircle, AiOutlineEdit } from "react-icons/ai";
import DatePicker from "react-date-picker";
import Api from "../utils/Api";
import {
  ACTIVITY_UPDATE_ORDER,
  PLANNER_ONE_UPDATE_DELETE,
} from "../utils/Endpoints";
import Modal from "../components/Modal";
import ActivityTile from "../components/ActivityTile";
import ActivityReOrder from "../components/ActivityReOrder";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FormProvider from "../context/FormContext";
import {
  DateTimeField,
  NumberField,
  Submit,
  TextField,
} from "../components/form";
import ActivitiesProvider from "../context/ActivityContext";
import ActivityShowTile from "../components/ActivityShowTile";

const Error404 = () => {
  return (
    <div className="w-screen h-screen text-center overflow-x-hidden p-5">
      <h1 className="text-2xl text-center mb-10">PSG College of Technology</h1>
      <h1 className="mb-8 text-2xl font-bold">
        Calendars for Odd Semester (2024-2025)
      </h1>
      <div className="flex flex-col items-center text-center text-lg">
        <Link to="eyJ5ZWFyIjoiMjAyNCIsImlkIjoiMTMifQ==">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            All years B.Sc, M.Sc (2 year), M.Sc (5 year) and II year ME/MTech/MCA
          </div>
        </Link>
        <Link to="eyJ5ZWFyIjoiMjAyNCIsImlkIjoiMTIifQ==">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            III, IV year BE / BTech, III, V year BE (SW) and IV year BTech (PT)
          </div>
        </Link>
      </div>
      <h1 className="mb-8 text-2xl font-bold">
        Calendars for Even Semester (2023-2024)
      </h1>
      <div className="flex flex-col items-center text-center text-lg">
        <Link to="eyJ5ZWFyIjoiMjAyMyIsImlkIjoiOCJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            First Year BE / BTech (Reg & SW)
          </div>
        </Link>
        <Link to="eyJ5ZWFyIjoiMjAyMyIsImlkIjoiMTEifQ==">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            First year ME/MTech & MCA
          </div>
        </Link>
        <Link to="eyJ5ZWFyIjoiMjAyMyIsImlkIjoiMTAifQ==">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            SECOND YEAR BE/BTech (Reg & SW ) including SECOND YEAR Lateral entry
          </div>
        </Link>
        <Link to="eyJ5ZWFyIjoiMjAyMyIsImlkIjoiMiJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            Two CA Group Even Semester (All Years BSc, MSc (2year), MSc (5 year
            Integrated)
          </div>
        </Link>
        <Link to="eyJ5ZWFyIjoiMjAyMyIsImlkIjoiNCJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            3 CA Group EVEN Semester (THIRD Year BE/BTech (Reg&SW), FOURTH Year
            BE/BTech (Reg&SW), FIFTH Year BE (SW) and THIRD Year BTech (PT))
          </div>
        </Link>
      </div>
      <h1 className="my-8 text-2xl font-bold">
        Calendars for Odd Semester (2023-2024)
      </h1>
      <div className="flex flex-col items-center text-center text-lg">
        {/* <Link to="/eyJ5ZWFyIjoiMjAyMyIsImlkIjoiMSJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            Two CA Group - Odd Semester (B.Sc & M.Sc ALL Years, MCA and ME/MTech
            Second year)
          </div>
        </Link>
        <Link to="/eyJ5ZWFyIjoiMjAyMyIsImlkIjoiMyJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            Three CA Group - Odd Semester (3rd and 4th year BE / B.Tech & SW 3rd
            & 5th year)
          </div>
        </Link>
        <Link to="/eyJ5ZWFyIjoiMjAyMyIsImlkIjoiNSJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            BE Sandwich Fourth year - Odd Semester
          </div>
        </Link>
        <Link to="/eyJ5ZWFyIjoiMjAyMyIsImlkIjoiNiJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            Three CA Group - Odd Semester (2nd Year BE/BTech/BE SW)
          </div>
        </Link> */}
        <Link to="/eyJ5ZWFyIjoiMjAyMyIsImlkIjoiOSJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            First year BE/ BTech / BE SW
          </div>
        </Link>
        <Link to="/eyJ5ZWFyIjoiMjAyMyIsImlkIjoiNyJ9">
          <div className="px-4 py-2 bg-secondary rounded-lg mb-4">
            First year MCA/ME/MTech
          </div>
        </Link>
      </div>
      <p className="text-gray-600">
        *Please click the link above to see the respective tentative academic
        schedule.
      </p>
    </div>
  );
};

export default Error404;
