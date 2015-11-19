$(document).ready(function() {
    var output = "<table>";

    $.ajax({
        url: "http://50.23.106.210:27018/cloud/test"
    }).then(function(data) {
       for(var i in data) {
          output += "<tr>";

          $('.greeting-content').append('<img src="data:image/jpeg;base64,' + data[i].data.picture + '">');

	  output += "<img src='data:image/jpeg;base64," + data[i].data.picture + "'></tr>";		


       }
       output += "</table>";

    });
});
