var mqtt = require( "mqtt" );
var fs   = require( "fs" );

var mqttClient = null;
var prevStats  = null;
var config     = null;


// Connect to <org-id>.messaging.internetofthings.ibmcloud.com:1883
// or 8883 for TLS
//  clientID = "d: <org-id>:<dev-type>:<dev-id>
//  Username set to "use-token-auth"
//  Set password to authorization token



var payload = {
   d: {
        cpuTemp: null
      }
};



function init()
{
  var mqttURL = null;
  var updateInterval = null;
  try
  {
    config = JSON.parse( fs.readFileSync( "temp.json" ) );
  }
  catch( e )
  {
    console.log( "Unable to load config file: " + e.message );
    return;
  }

  mqttURL = config.iotfServer.replace( '<orgID>', config.orgID );


  createMQTTConnection(mqttURL);
}

function createMQTTConnection(mqttURL)
{
  var clientId = "d:" + config.orgID + ":" + config.devType + ":" + config.devID;
  var username = "use-token-auth";
  var password = config.authToken;
  console.log("Connect To: " );
  console.log("   clientId: " + clientId );
  console.log("   username: " + username);
  console.log("   password: " + password);

  mqttClient = mqtt.connect( mqttURL , {
    clientId : clientId,
    username : "use-token-auth",
    password : config.authToken
  } );

  mqttClient.on( "connect" , function() {
    console.log( "Connected to MQTT Broker" );
    updateInterval = setInterval( getTemp, config.updateInterval );
  } );

  mqttClient.on( "error" , function() {
    if( !mqttClient.connected ) createMQTTConnection();
  } );
}

function getTemp()
{

  try
  {
    currTemp= ((fs.readFileSync( "/sys/class/thermal/thermal_zone0/temp")/1000 * 9/5+32)) ;
    payload.d.cpuTemp = currTemp;
  }
  catch( e )
  {
    console.log( "Unable to load config file: " + e.message );
    return;
  }

    if( mqttClient && mqttClient.connected )
    {
      //console.log("Publish: " + JSON.stringify(payload));
      //console.log("Topic: " + config.mqttTopic);
      mqttClient.publish( config.mqttTopic , JSON.stringify(payload) );
    }

}


init();
