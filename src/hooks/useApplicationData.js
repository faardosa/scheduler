import { useState, useEffect } from "react";

import axios from "axios";

export default function useApplicationData(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        console.log("response", response);
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview },
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        setState({
          ...state,
          appointments,
          days: updateSpots(state, appointments),
        });
        console.log("new spot", updateSpots(state, appointments));
      });
  }

  function cancelInterview(id) {
    console.log(id);
    return axios.delete(`/api/appointments/${id}`).then((response) => {
      const appointment = {
        ...state.appointments[id],
        interview: null,
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };
      setState({
        ...state,
        appointments,
        days: updateSpots(state, appointments),
      });
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}

function updateSpots(state, appointments) {
  let results = [];
  for (let i in state.days) {
    // make a copy of day object bc you dont want to directly mutate our state

    let currentDay = { ...state.days[i] };
    let spots = 0;
    console.log(currentDay);

    // loop through appointment ids for each day

    currentDay.appointments.forEach((appointmentId) => {
      
     // get the original appoitnment object

      const appointment = appointments[appointmentId];

      // check if appt exists and if interview is not booked

      if (appointment && !appointment.interview) {
        spots++;
      }
    });
    currentDay.spots = spots;
    results.push(currentDay);
  }
  return results;
}
