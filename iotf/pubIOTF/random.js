
var mqtt = require( "mqtt" );

var organizationID = "dz9olg";
var deviceType = "MyDeviceType";
var deviceID = "abcd";

var eventID = "testEvt";
var eventFormat = "json";

var mqttAddress = "mqtts://" + organizationID + ".messaging.internetofthings.ibmcloud.com:8883";
var mqttUsername = "use-token-auth";
var mqttPassword = "sometoken";
var mqttClientID = "d:" + organizationID + ":" + deviceType + ":" + deviceID;
var mqttTopic = "iot-2/evt/" + eventID + "/fmt/" + eventFormat;

var mqttClient = mqtt.connect( mqttAddress , {
  clientId : mqttClientID,
  username : mqttUsername,
  password : mqttPassword
} );

mqttClient.on( "connect" , function() {
  console.log( "Connected..." );

  mqttClient.publish( mqttTopic , JSON.stringify( {
    d : {
      randomData : Math.random() * 100
    }
  } ) );
} );

mqttClient.on( "error" , function( err ) {
  console.log( "Error: " + err.toString() );
} );
