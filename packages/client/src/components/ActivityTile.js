import { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-date-picker";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useActivity } from "../context/ActivityContext";
import FormProvider from "../context/FormContext";
import { DateTimeField, Submit, TextField, ToggleField } from "./form";
import Modal from "./Modal";

const ActivityTile = ({ name, type, value, calculated_date, index, today }) => {
  return (
    <tr className="border-b-2 border-x-2 border-primary whitespace-pre-wrap">
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4">{type}</td>
      <td className="px-6 py-4">{value}</td>
      <td className="px-6 py-4">{calculated_date}</td>
    </tr>
  );
};

export default ActivityTile;
