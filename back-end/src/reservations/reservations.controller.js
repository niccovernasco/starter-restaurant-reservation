/**
 * List handler for reservation resources
 */
const reservationService = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const hasProperties = require("../errors/hasProperties.js");
const moment = require("moment");

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function hasValidDate(req, res, next) {
  const { data = {} } = req.body;
  const date = data["reservation_date"];
  const time = data["reservation_time"];
  const formattedDate = new Date(`${date}T${time}`);
  const day = new Date(date).getUTCDay();

  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({
      status: 400,
      message: `Invalid reservation_date`,
    });
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant is closed on Tuesdays`,
    });
  }
  if (formattedDate <= new Date()) {
    return next({
      status: 400,
      message: `Reservation must be in the future`,
    });
  }
  next();
}

function isValidMilitaryTime(time) {
  return (
    moment(time, "HH:mm", true).isValid() ||
    moment(time, "HH:mm:ss", true).isValid()
  );
}

function hasValidTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data["reservation_time"];

  console.log(time);
  if (!isValidMilitaryTime(time)) {
    next({
      status: 400,
      message: `Invalid reservation_time`,
    });
  }

  const hours = Number(time.split(":")[0]);
  const minutes = Number(time.split(":")[1]);
  if (hours < 10 || (hours === 10 && minutes < 30)) {
    next({
      status: 400,
      message: `Reservation must be after 10:30AM`,
    });
  }
  if (hours > 21 || (hours === 21 && minutes > 30)) {
    next({
      status: 400,
      message: `Reservation must be before 9:30PM`,
    });
  }
  next();
}

function hasValidNumber(req, res, next) {
  const { data = {} } = req.body;

  if (data["people"] === 0 || !Number.isInteger(data["people"])) {
    return next({
      status: 400,
      message: `Invalid number of people`,
    });
  }
  next();
}

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (currentStatus === "finished" || currentStatus === "cancelled") {
    return next({
      status: 400,
      message: `Reservation status is finished`,
    });
  }
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid status: ${status}`,
  });
}

function isBooked(req, res, next) {
  const { status } = req.body.data;

  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation_id =
    req.params.reservation_id || (req.body.data || {}).reservation_id;

  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (date) {
    const data = await reservationService.list(date);
    res.json({
      data: data,
    });
  }
  if (mobile_number) {
    const data = await reservationService.search(mobile_number);
    res.json({
      data: data,
    });
  }
}

async function update(req, res) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationService.update(updatedRes);
  res.status(200).json({ data });
}

async function create(req, res) {
  const data = await reservationService.create(req.body.data);
  res.status(201).json({ data });
}

async function updateStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await reservationService.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidNumber,
    isBooked,
    asyncErrorBoundary(create),
  ],
  update: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidNumber,
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  reservationExists,
};
