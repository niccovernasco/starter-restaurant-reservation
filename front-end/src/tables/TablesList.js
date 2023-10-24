import React from "react";

export default function TablesList({ tables, finishHandler }) {
  return (
    <div className="group-col">
      {tables &&
        tables.map((table) => (
          <div className="table" key={table.table_id}>
            <div className="group-row">
              <div className="item-quad">
                <div className="group-col no-gap">
                  <h3 className="item inline">Table {table.table_name}</h3>
                  <div>
                    <h5 className="item red inline">{table.capacity} seats </h5>
                    <p
                      className="item inline"
                      data-table-id-status={table.table_id}
                    >
                      &nbsp;/ &nbsp;{table.reservation_id ? "occupied" : "free"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="item">
                {table && table.reservation_id ? (
                  <button
                    className="finish btn btn-danger"
                    data-table-id-finish={table.table_id}
                    onClick={() => finishHandler(table.table_id)}
                  >
                    Finish
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
