import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";

export default function ReservationForm({
  reservation,
  changeHandler,
  submitHandler,
}) {
  const history = useHistory();

  return (
    <div className="formDiv">
      Fill out this Form:
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="flexItem">
            <label htmlFor="first_name">First Name: </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required={true}
              value={reservation.first_name}
              onChange={changeHandler}
              maxLength="150"
            />
          </div>
          <div className="flexItem">
            <label htmlFor="last_name">Last Name: </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required={true}
              value={reservation.last_name}
              onChange={changeHandler}
              maxLength="150"
            />
          </div>
          <div className="flexItem">
            <label htmlFor="mobile_number">Mobile Number: </label>
            <input
              id="mobile_number"
              name="mobile_number"
              type="text"
              required={true}
              value={reservation.mobile_number}
              onChange={changeHandler}
              maxLength="150"
            />
          </div>
          <div className="flexItem">
            <label htmlFor="reservation_date">Reservation Date: </label>
            <input
              id="reservation_date"
              name="reservation_date"
              type="date"
              required={true}
              value={reservation.reservation_date}
              maxLength="150"
              onChange={changeHandler}
              pattern="\d{4}-\d{2}-\d{2}"
            />
          </div>
          <div className="flexItem">
            <label htmlFor="reservation_time">Reservation Time: </label>
            <input
              id="reservation_time"
              name="reservation_time"
              type="time"
              pattern="[0-9]{2}:[0-9]{2}"
              required={true}
              value={reservation.reservation_time}
              maxLength="150"
              onChange={changeHandler}
            />
          </div>
          <div className="flexItem">
            <label htmlFor="people">People Expected: </label>
            <input
              id="people"
              name="people"
              type="number"
              required={true}
              value={reservation.people}
              min={1}
              onChange={changeHandler}
            />
          </div>
          <button
            className="item black btn btn-danger"
            type="button"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}
