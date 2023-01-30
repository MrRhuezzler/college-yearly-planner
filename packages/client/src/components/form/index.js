import { useForm } from "../../context/FormContext";
import DatePicker from "react-date-picker";

export const TextField = ({ label, name }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  return (
    <div className="mb-4">
      <h1 className="text-primary text-3xl mb-2">{label}</h1>
      <input
        type="text"
        className="text-2xl underline text-secondary border border-primary rounded-md px-2 py-2 mb-2"
        value={value}
        onChange={(e) => {
          updateFormData(name, e.target.value);
        }}
      />
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const NumberField = ({ label, name }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  return (
    <div className="mb-4">
      <h1 className="text-primary text-3xl mb-2">{label}</h1>
      <input
        type="text"
        className={`text-2xl underline text-secondary border ${
          error ? "border-red-400" : "border-primary"
        } rounded-md px-2 py-2 mb-2`}
        value={value}
        onChange={(e) => {
          updateFormData(name, parseInt(e.target.value));
        }}
      />
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const DateTimeField = ({ label, name }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  return (
    <div className="mb-4">
      <h1 className="text-primary text-3xl mb-2">{label}</h1>
      <DatePicker
        value={value ? new Date(value) : value}
        onChange={(v) => {
          if (!v) {
            updateFormData(name, v);
          } else {
            updateFormData(name, v.toISOString());
          }
        }}
      />
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const Submit = ({ label }) => {
  const { validateAndSubmit } = useForm();

  return (
    <button
      onClick={(e) => {
        validateAndSubmit();
      }}
      className="bg-primary px-4 py-2 rounded-md text-white"
    >
      {label}
    </button>
  );
};
