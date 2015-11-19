
var mqtt = require( "mqtt" );

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

  for( var i = 1; i <= 20000; i++ )
  {
    var msg = {
      sensor_id : i,
      tstamp : dateToIFXString( new Date() ),
      d : { col4 : "king bob" }
    };

    mqttClient.publish( "wd.sensors_vti", JSON.stringify( msg ) );
    
    if ( (i % 1000) == 0 ) {
       console.log("I: " + i); 
    } 

  }

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
