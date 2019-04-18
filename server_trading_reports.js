const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
var ac = require("./avanza-calendar.js");
var moment = require("moment");

//var avanza_calendar = require("./avanza-calendar.js");

const openTime = moment("09:00:00", "HH:MM:SS");
const closeTime = moment("17:30:00", "HH:MM:SS");

function getCurrentTime() {
  return moment().format("HH:MM:SS");
}

function reportCalendarAvanzaUpdate() {
  ac.scrapeAvanzaReportCalendar();
}

app = express();

// schedule tasks to be run on the server
cron.schedule("* * 01 * *", function() {
  console.log("Running server job.");
  console.log(getCurrentTime());
  reportCalendarAvanzaUpdate();
});

//if weekday and 09:00-17:30
//   moment().format("YYYY-MM-DD HH:MM:SS");

if (currentTime > openTime && currentTime < closeTime) {
  console.log("Trading open hours.");
}

app.listen(3128);
