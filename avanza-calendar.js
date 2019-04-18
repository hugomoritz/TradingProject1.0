// Requiring two of our dependencies
const rp = require("request-promise");
const cheerio = require("cheerio");
const moment = require("moment");
var MongoClient = require("mongodb").MongoClient;

function getCurrentDate() {
  return moment().format("YYYY-MM-DD");
}

function getCurrentTime() {
  return moment().format("YYYY-MM-DD HH:MM:SS");
}

function cleanStringCompanyCalendarAvanza(contentStr) {
  var noiseStr1 = "\n\t\t\t\t\t\t\t";
  var noiseStr2 = "\n";
  return contentStr.slice(
    contentStr.indexOf(noiseStr1) + noiseStr1.length,
    contentStr.lastIndexOf(noiseStr2)
  );
}

// Requesting to the website
function scrapeAvanzaReportCalendar() {
  const url = "https://www.avanza.se/placera/foretagskalendern.html";
  rp(url, (error, response, html) => {
    // Checking that there is no errors and the response code is correct
    if (!error && response.statusCode === 200) {
      // Declaring cheerio for future usage
      const $ = cheerio.load(html);

      reportList = [];
      // Looking at the inspector or source code we will select the following id value

      var todaysDate = getCurrentDate();
      $(".companyCalendarItem > a").each(function(i, elem) {
        var date = $(this)
          .parent()
          .parent()
          .parent()
          .prev()
          .text()
          .replace(/\s/g, "");
        if (todaysDate == date) {
          var contentStrCompanyName = $(this).text();
          var companyName = cleanStringCompanyCalendarAvanza(
            contentStrCompanyName
          );
          reportList.push({ company: companyName, reportDate: date });
        }
      });

      console.log(reportList);
      console.log("Number of companies reporting today: ", reportList.length);
      saveReportToDb(reportList);
    }
  });
}

function saveReportToDb(array) {
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(
    url,
    function(err, client) {
      const db = client.db("stock_data");
      const collection = db.collection("avanza_financial_report");

      collection.deleteMany({});
      collection.insertMany(array, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
      });
      client.close();
    }
  );
}

module.exports = {
  scrapeAvanzaReportCalendar: scrapeAvanzaReportCalendar
};
