// Requiring two of our dependencies
const rp = require("request-promise");
const cheerio = require("cheerio");
const url = "https://www.avanza.se/placera/foretagskalendern.html";

function cleanStringCompanyCalendarAvanza(contentStr) {
  var noiseStr1 = "\n\t\t\t\t\t\t\t";
  var noiseStr2 = "\n";
  return contentStr.slice(
    contentStr.indexOf(noiseStr1) + noiseStr1.length,
    contentStr.lastIndexOf(noiseStr2)
  );
}

// Requesting to the website
rp(url, (error, response, html) => {
  // Checking that there is no errors and the response code is correct
  if (!error && response.statusCode === 200) {
    // Declaring cheerio for future usage
    const $ = cheerio.load(html);

    companies = [];
    // Looking at the inspector or source code we will select the following id value
    $(".companyCalendarItem > a").each(function(i, elem) {
      var contentStrCompanyName = $(this).text();
      var companyName = cleanStringCompanyCalendarAvanza(contentStrCompanyName);
      companies[i] = companyName;
    });

    console.log(companies);
    console.log(companies.length);
  }
});
