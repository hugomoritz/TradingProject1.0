const express = require("express");
const fs = require("fs");
var ac = require("./avanza-calendar.js");
const moment = require("moment");
var schedule = require("node-schedule");

//var avanza_calendar = require("./avanza-calendar.js");

const openTime = moment("09:00:00", "HH:mm:ss");
const closeTime = moment("17:30:00", "HH:mm:ss");

function getCurrentTime() {
  return moment().format("HH:mm:ss");
}

function swedishMarketOpen() {
  return true;
}

function dbCollectionNotNull() {
  var url = "mongodb://localhost:27017/";
  var collectionCount = 0;
  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db("stock_data");
      const collection = db.collection("avanza_financial_report");
      collectionCount = collection.count();
      client.close();
    }
  );
  return collectionCount > 0;
}

app = express();

// schedule tasks to be run on the server
schedule.scheduleJob("* * * * *", function() {
  console.log("Running server job.");
  console.log(getCurrentTime());
  ac.scrapeAvanzaReportCalendar();
});

// schedule tasks to be run on the server
var startTradingJob = schedule.scheduleJob("15 09 * * *", function() {
  const marketIsOpen = swedishMarketOpen();
  const dataExists = dbCollectionNotNull();
  if (!marketIsOpen || !dataExists) {
    startTradingJob.cancel();
  }
  console.log("Run trading server - buy position.");
  console.log(getCurrentTime());
});

var closeTradingJob = schedule.scheduleJob("15 17 * * *", function() {
  const marketIsOpen = swedishMarketOpen();
  if (!marketIsOpen) {
    closeTradingJob.cancel();
  }
  console.log("Run trading server - close/cancel positions.");
  console.log(getCurrentTime());
});

//if weekday and 09:00-17:30
//   moment().format("YYYY-MM-DD HH:MM:SS");

app.listen(3128);
