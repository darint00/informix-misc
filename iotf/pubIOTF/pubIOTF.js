var mqtt = require( "mqtt" );
var os   = require( "os" );
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
        cpuTemp : null,
        cpuUtil : null
      }
};



function init()
{
  var mqttURL = null;
  var mqttTopic = null;
  var updateInterval = null;
  try
  {
    config = JSON.parse( fs.readFileSync( "iotf.json" ) );
  }
  catch( e )
  {
    console.log( "Unable to load config file: " + e.message );
    return;
  }

  //mqttURL = config.orgID + "." + config.iotfServer;
  mqttURL = config.iotfServer.replace( '<orgID>', config.orgID );
  mqttTopic = "iot-2/evt/" + config.devType + "/json";


  createMQTTConnection(mqttURL);
  updateInterval = setInterval( updateCPUUsage , config.updateInterval );
}

function createMQTTConnection(mqttURL)
{
  mqttClient = mqtt.connect( mqttURL , {
    clientId : "d:" + config.orgID + ":" + config.devType + ":" + config.devID,
    username : "use-token-auth",
    password : config.authToken
  } );

  mqttClient.on( "connect" , function() {
    console.log( "Connected to MQTT Broker" );
  } );

  mqttClient.on( "error" , function() {
    if( !mqttClient.connected ) createMQTTConnection();
  } );
}

function getTEMP()
{

  try
  {
    currTemp= ((fs.readFileSync( "/sys/class/thermal/thermal_zone0/temp")/1000 * 9/5+32)) ;
    console.log("Temp: " + currTemp);

    payload.d.cpuTemp = currTemp;

    console.log("Payload Stringify: " + JSON.stringify(payload));
  }
  catch( e )
  {
    console.log( "Unable to load config file: " + e.message );
    return;
  }


}

function updateCPUUsage(mqttTopic)
{
  var stats = os.cpus();

  getTEMP();

  if( prevStats )
  {
    var busy = 0,
        idle = 0;

    for( var i = 0; i < stats.length; i++ )
    {
      var prev = prevStats[i].times,
          curr = stats[i].times;

      prev.user = curr.user - prev.user;
      prev.nice = curr.nice - prev.nice;
      prev.sys  = curr.sys  - prev.sys ;
      prev.idle = curr.idle - prev.idle;
      prev.irq  = curr.irq  - prev.irq ;

      busy += prev.user + prev.nice + prev.sys + prev.irq;
      idle += prev.idle;
    }

    busy /= stats.length;
    idle /= stats.length;

    var percent = busy / ( busy + idle ) * 100.0;
    percent = Math.max( 0 , Math.min( 100 , percent ) );

    payload.d.cpuUtil = percent;


    if( mqttClient && mqttClient.connected )
    {
      mqttClient.publish( mqttTopic , percent.toString() );
    }
  }

  prevStats = stats;
}

init();
