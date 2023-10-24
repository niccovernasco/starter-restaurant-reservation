const knex = require("../db/connection.js");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedRes) {
  console.log("updatedRes", updatedRes);
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedRes.reservation_id })
    .update(updatedRes, "*")
    .then((createdRecords) => createdRecords[0]);
}

function list(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: status }, "*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function search(mobile_number) {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  create,
  list,
  search,
  read,
  update,
  updateStatus,
};
