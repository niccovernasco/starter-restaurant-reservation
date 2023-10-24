import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import ReservationForm from "./ReservationForm.js";
import { createReservation } from "../utils/api.js";
import { hasValidDateAndTime } from "./ReservationValidate.js";
import ReservationErrors from "./ReservationErrors.js";

export default function ReservationNew() {
  let initalState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [reservationErrors, setReservationErrors] = useState(null);
  let [reservation, setReservation] = useState({
    ...initalState,
  });
  const history = useHistory();
  const changeHandler = (e) => {
    if (e.target.name === "people") {
      setReservation({
        ...reservation,
        [e.target.name]: Number(e.target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [e.target.name]: e.target.value,
      });
    }
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    const errors = hasValidDateAndTime(reservation);
    if (errors.length) {
      return setReservationErrors(errors);
    }

    try {
      await createReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setReservationErrors([error]);
    }

    return () => abortController.abort();
  };

  return (
    <section>
      To make a Reservation:
      <ReservationErrors errors={reservationErrors} />
      <ReservationForm
        reservation={reservation}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />
    </section>
  );
}
