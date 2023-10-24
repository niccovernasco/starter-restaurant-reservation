const knex = require("../db/connection.js");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function finish(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "finished" })
      .transacting(trx);

    return knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: null }, "*")
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]);
  });
}

function update(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(trx)
      .then(() => {
        return knex("tables")
          .select("*")
          .where({ table_id })
          .update({ reservation_id: reservation_id }, "*")
          .transacting(trx)
          .then((createdRecords) => createdRecords[0]);
      });
  });
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  read,
  update,
  finish,
  create,
};
