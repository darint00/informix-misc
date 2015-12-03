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
        cpuUtil : null
      }
};



function init()
{
  var mqttURL = null;
  var updateInterval = null;
  try
  {
    config = JSON.parse( fs.readFileSync( "util.json" ) );
  }
  catch( e )
  {
    console.log( "Unable to load config file: " + e.message );
    return;
  }

  //mqttURL = config.orgID + "." + config.iotfServer;
  mqttURL = config.iotfServer.replace( '<orgID>', config.orgID );


  createMQTTConnection(mqttURL);
  //updateInterval = setInterval( updateCPUUsage , config.updateInterval );
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
    updateInterval = setInterval( updateCPUUsage , config.updateInterval );
  } );

  mqttClient.on( "error" , function() {
    if( !mqttClient.connected ) createMQTTConnection();
  } );
}


function updateCPUUsage()
{
  var stats = os.cpus();

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
      //console.log("Publish: " + JSON.stringify(payload));
      //console.log("Topic: " + config.mqttTopic);
      mqttClient.publish( config.mqttTopic , JSON.stringify(payload) );
    }
  }

  prevStats = stats;
}

init();
