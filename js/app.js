var api_key = "dbe04f1b8655b92d";
var zip;
var timer;
var default_zipcode = 24060;

function error(message) {
  console.log(message);
}

function fade_in(zepto_selector) {
  zepto_selector.animate({ "opacity" : 100 }, 300, "linear");
}
function timenow(){
    var now= new Date(),
    ampm= 'AM',
    h= now.getHours(),
    m= now.getMinutes(),
    s= now.getSeconds();
    if(h>= 12){
        if(h>12)h-= 12;
        ampm= 'PM';
    }
    if(h<10) h= '0'+h;
    if(m<10) m= '0'+m;
    if(s<10) s= '0'+s;
    return now.toLocaleDateString()+' '+h+':'+m+':'+s+' '+ampm;
}

function two_dimensional_array_to_string(array) {
  var ret = "";
  _.times(array.length, function(n) {
    _.times(array[0].length, function(m) {
      ret = ret + array[n][m];
    });
    ret = ret + "\n";
  });
  return ret;
}
function animate_weather(slides_hash) {
  var x = 0;
  timer = setInterval(function() {
    $("body textarea").val(
      two_dimensional_array_to_string(slides_hash.frames[x])
    );
    x = x + 1;
    if (x == slides_hash.frames.length) { x = 0; }
  }, slides_hash.interval);
}
function clear_timer() {
  clearInterval(timer);
}

function display_weather(data) {
  frame = null;
  console.log(data);
  var location = data.display_location.full;
  var city     = data.display_location.city;
  $("#location").html(location + " - " + zip);
  if (data.weather.match(/light rain/ig)) {
    $("h1").html("Lightly Raining in " + city);
    frame = slides.raining;
  } else if (data.weather.match(/rain/ig)) {
    $("h1").html("Raining in " + city);
    frame = slides.raining;
  } else if (data.weather.match(/cloud/ig)) {
    $("h1").html("Cloudy in " + city);
    frame = slides.cloudy;
  } else if (data.weather.match(/clear/ig)) {
    $("h1").html("All Clear in " + city);
    frame = slides.clear;
  } else if (data.weather.match(/overcast/ig)) {
    $("h1").html("Overcast in " + city);
    frame = slides.cloudy;
  } else if (data.weather.match(/sun/ig)) {
    $("h1").html("Sunny in" + city);
    frame = slides.cloudy;
  } else {
    error("Unsupported Weather Status '" + data.weather + "'<br/>Please submit a bug, patch, or report!");
  }
  fade_in($("#location"));
  fade_in($("h1"));

  $("#details").html(data.temp_f + "&deg;F | " + data.wind_mph + "MPH Wind | " + data.wind_string );
  fade_in($("#details"));
  $("#date").html(timenow());
  fade_in($("#date"));
  animate_weather(frame);
  fade_in($("h2"));
}
function recieveData(data) {
}

function get_weather(zip_code) {
  zip = zip_code;
  $.ajax({
    url : "http://api.wunderground.com/api/" + api_key + "/conditions/q/" + zip_code + ".json?callback=recieveData", 
    dataType : "jsonp",
    success : function(data) { display_weather(data.current_observation); },
    callback : function(data) { display_weather(data); }
  });
}
window.onload = function() { 
  var parts = window.location.href.split("/");
  var matches = parts[parts.length -1].match(/\d{5}/);
  get_weather(matches && matches[0] ? matches[0] : default_zipcode);
};
