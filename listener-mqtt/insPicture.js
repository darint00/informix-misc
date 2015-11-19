
var mqtt = require( "mqtt" );
var fs = require("fs");

var mqttAddress = "mqtt://50.23.106.210:27883";
var mqttVersion = 3;

var mqttOptions = {};
if( mqttVersion == 3 )
{
  mqttOptions = {
    protocolId: 'MQIsdp',
    protocolVersion: 3
  };
}

mqttClient = mqtt.connect( mqttAddress , mqttOptions );

mqttClient.on( "connect" , function() {
  console.log( "Connected." );

    data = fs.readFileSync("monkey.jpg");
    data64 = data.toString('base64');

    var msg = {
      col1 : 1,
      data : { picture : data64 }
    };

    mqttClient.publish( "cloud.test", JSON.stringify( msg ) );
    
  mqttClient.end();
} );

mqttClient.on( "error" , function( err ) {
  console.log( "Error" );
  console.log( err );
} );


function zp( v ) { return v < 10 ? "0" + v : v; }
function dateToIFXString( d )
{
  return d.getFullYear() + "-" + zp( d.getMonth() + 1 ) + "-" + zp( d.getDate() ) + " " +
         zp( d.getHours() ) + ":" + zp( d.getMinutes() ) + ":" + zp( d.getSeconds() ) + ".00000";
}
