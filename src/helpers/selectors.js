export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  let arrayAppointment = [];
  let filteredAppointment = [];

  for (let objSpecificDay of state.days) {
    if (objSpecificDay.name === day) {
      arrayAppointment = objSpecificDay.appointments;
    }
  }
  for (let appointment of arrayAppointment) {
    filteredAppointment.push(state.appointments[appointment]);
  }
  return filteredAppointment;
}

export function getInterview(state, interview) {
  if (!interview) return null;

  let interviewer = state.interviewers[interview.interviewer];
  return {
    interviewer: interviewer,
    student: interview.student,
  };
}

export function getInterviewersForDay(state, dayName) {
  const validDayNames = state.days.map((dayObj) => dayObj.name);
  if (!dayName || !validDayNames.includes(dayName)) return [];

  const todayObj = state.days.filter((dayObj) => dayObj.name === dayName)[0];
  const interviewers = todayObj.interviewers.map(
    (interId) => state.interviewers[interId]
  );

  return interviewers;
}


