const ActivityShowTile = ({
  id,
  name,
  type,
  relativeDays,
  relativeDate,
  relativeToStart,
  date,
}) => {
  const calculateDiffInDays = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffInTime = new Date(date).getTime() - today.getTime();
    return Math.floor(diffInTime / (1000 * 3600 * 24));
  };

  const diffInDays = calculateDiffInDays(date);

  return (
    <>
      <td className="px-6 py-4">{name}</td>
      {type === "RELATIVE" ? (
        <td className="px-6 py-4">{relativeDays}</td>
      ) : (
        <td>{new Date(relativeDate).toDateString()}</td>
      )}
      <td className="px-6 py-4">{relativeToStart}</td>
      <td className="px-6 py-4">{new Date(date).toDateString()}</td>
      <th className="px-6 py-4">
        {diffInDays < 0 ? "COMPLETED" : `${diffInDays} days`}
      </th>
    </>
  );
};

export default ActivityShowTile;
