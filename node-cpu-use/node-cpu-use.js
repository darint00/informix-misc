
var os = require( "os" );
var mqtt = require( "mqtt" );
var fs = require( "fs" );

var mqttClient = null;

var config = null;
var prevStats = null;
var updateInterval = null;

function init()
{
  try
  {
    config = JSON.parse( fs.readFileSync( "config.json" ) );
  }
  catch( e )
  {
    console.log( "Unable to load config file: " + e.message );
    return;
  }

  createMQTTConnection();

  updateInterval = setInterval( updateCPUUsage , config.updateInterval );
}

function createMQTTConnection()
{
  mqttClient = mqtt.connect( config.mqttServer , {
    protocolId: 'MQIsdp',
    protocolVersion: 3
  } );

  mqttClient.on( "connect" , function() {
    console.log( "Connected to MQTT Broker" );
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

    if( mqttClient && mqttClient.connected )
    {
      mqttClient.publish( config.mqttTopic , percent.toString() );
    }
  }

  prevStats = stats;
}

init();
