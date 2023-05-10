const EXPORT_HTML = 
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Export</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body style="font-family: sans-serif; font-size: small">
    <div style="width: 100%; text-align: center">
      <h3 style="text-transform: uppercase">
        PSG College of Technology, Coimbatore 641004
      </h3>
      <h4 style="margin-top: 10px; text-transform: uppercase">
        Tentaive Calendar for Academic Activities {{ academicYear }}
      </h4>
      <h5 style="margin-top: 20px; text-transform: uppercase">{{ name }}</h5>
    </div>
    {% for planner in planners %}
    <table
      style="
        width: 100%;
        border: 1px solid black;
        /* border-collapse: collapse; */
        text-align: left;
        margin-top: 20px;
      "
    >
      <tr>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="5">{{ planner.name }}</th>
      </tr>
      <tr>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="2">Activity</th>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="2">Date</th>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="1">Instructional Days Used</th>
      </tr>
      {% for activity in planner.activities %}
        <tr>
          <td style="border: 1px solid black; padding: 10px 20px" colspan="2">{{ activity.name }}</td>
          <td style="border: 1px solid black; padding: 10px 20px" colspan="2">{{ activity.date }}</td>
          <td style="border: 1px solid black; padding: 10px 20px" colspan="1">{{ activity.relativeToStart }}</td>
        </tr>
      {% endfor %}
      <tr>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="5">Number of Public Holidays falling on Weekdays</th>
      </tr>
      <tr>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="1">Monday</th>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="1">Tuesday</th>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="1">Wednesday</th>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="1">Thursday</th>
        <th style="border: 1px solid black; padding: 10px 20px" colspan="1">Friday</th>
      </tr>
      <tr>
      {% for leave in planner.leaves %}
        <td style="border: 1px solid black; padding: 10px 20px" colspan="1">{{ leave }}</th>
      {% endfor %}
      </tr>
    </table>
    {% endfor %}
    <div
      style="
        display: flex;
        margin-top: 50px;
        width: 100%;
        text-align: center;
      "
    >
      <p style="flex: 1">{{today}}</p>
      <p style="flex: 1">PRINCIPAL</p>
    </div>
  </body>
</html>
`;

module.exports = EXPORT_HTML;