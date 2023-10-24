import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min.js";
import { listTables, updateTable, readReservation } from "../utils/api.js";

export default function ReservationSeat() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [reservation, setReservation] = useState({});
  const history = useHistory();

  useEffect(() => {
    listTables().then(setTables);
  }, []);

  useEffect(() => {
    if (reservation_id) {
      readReservation(reservation_id).then(setReservation);
    }
  }, [reservation_id]);

  const changeHandler = (event) => {
    setTableId(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const abortController = new AbortController();

    if ((reservation_id, tableId)) {
      await updateTable(reservation_id, tableId, abortController.signal);
      history.push("/dashboard");
    }

    return () => abortController.abort();
  };

  return (
    <section>
      <h2>Seat Reservation</h2>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div>
            <select
              id="table_id"
              name="table_id"
              value={tableId}
              required={true}
              onChange={changeHandler}
            >
              <option value="">- Select a table -</option>
              {tables &&
                tables.map((table) => (
                  <option
                    key={table.table_id}
                    value={table.table_id}
                    disabled={
                      table.capacity < reservation.people || table.occupied
                    }
                  >
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
            </select>
          </div>
          <div className="group-row">
            <button
              className="white"
              type="button"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
            <button className="btn btn-success">Submit</button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
