
function getData (name) {
    // Currently uses static data
    console.log("Getting and Returning data for: " + name);

    var dates = ["Fall 2016", "Fall 2016","Fall 2016","Fall 2016","Fall 2016","Summer 2016","Winter 2016","Winter 2016","Winter 2016","Fall 2015","Fall 2015","Fall 2015","Fall 2015","Fall 2015"];
    var scores = [4,4.3,4.1,4.3,4.1,3.9,3.9,4.3,4.4,4,4.2,4,4.4,4.3];
    return [dates, scores];
}

module.exports = getData;