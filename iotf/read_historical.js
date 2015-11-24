
var https = require( "https" );

var organizationID = "dz9olg";

var apiBaseURL = "/api/v0002";
var baseURL = organizationID + ".internetofthings.ibmcloud.com";

// var apiCall = "/";

var deviceType = "MyDeviceType";
var deviceID = "abcd";
var apiCall = "/historian/types/" + deviceType + "/devices/" + deviceID + "?top=1";

var httpUsername = "a-dz9olg-lnw9e13w6l";
var httpPassword = "pwZm?C1_--HlwUsSI7";
var httpAuth = "Basic " + ( new Buffer( httpUsername + ":" + httpPassword ) ).toString( "base64" );

var httpRequestOptions = {
  hostname : baseURL,
  port : 443,
  path : apiBaseURL + apiCall,
  method : "GET",
  headers : {
    "Authorization" : httpAuth
  }
};

console.log( httpRequestOptions );

var request = https.request( httpRequestOptions , function( response ) {
  var data = "";
  // console.log( response );

  response.on( "data" , function( chunk ) { data += chunk; } );
  response.on( "end" , function() {
    console.log( "--- Response" );
    console.log( data );
  } );
} );

request.end();

request.on( "error" , function( err ) {
  console.log( err );
} );
