
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: subway;
/************************************************
Fork by Florian Lietz (https://github.com/lif22) of MVG Abfahrtsmonitor by Jakob Eckert (https://github.com/eckertj/MVG-Abfahrtsmonitor) with updated MVG API endpoints as old Fahrinfo" API is deprecated
06.07.2024
Endpoints used:
- https://www.mvg.de/api/bgw-pt/v3
- https://www.mvg.de/.rest/zdm

-----------------------------
MVG Abfahrtsmonitor Widget
von Jacob Eckert
16.02.2021
GitHub für Updates:
https://github.com/eckertj/MVG-Abfahrtsmonitor
Für dieses Widget gilt die Apache 2.0 Lizenz
https://github.com/eckertj/MVG-Abfahrtsmonitor/blob/master/LICENSE
Dieses Widget zeigt aktuelle Abfahrten von Bus, Bahn
und/oder Tram des Münchner Verkehrs- und Tarifverbunds
für eine definierte Haltestelle an. 
Die Daten stammen von mvg.de. 
Unterstützt iOS 14 Widget in klein, mittel und groß.
Im Widget-Parameter kann die Haltestelle per Namen definiert
werden. Genaue Bezeichnungen der Haltestellen können
hier eingesehen werden:
https://www.mvg.de/dienste/abfahrtszeiten.html
Installation des Widgets:
1. Lange auf eine App auf dem Home-Screen drücken.
2. "Home-Bildschirm bearbeiten" auswählen.
3. Oben auf das "+" drücken
4. Runterscrollen bis "Scriptable" in der Liste erscheint.
5. Gewünschte Widgetgröße auswählen.
6. Auf das neue Widget drücken.
7. Bei Script "MVG-Abfahrtsmonitor" auswählen.
8. Bei When Interacting 'Run Script' auswählen.
9. Bei Parameter gewünsche Haltestelle eingeben.
10. Fertig. Später kann die Haltestelle angepasst werden,
   wenn lange auf das Widget gedrückt wird und
   "Scriptable/Widget bearbeiten" ausgewählt wird.
    
Hinweis: Es können mehrere Widgets auf den Home Screen
gelegt und individuell konfiguriert werden!
************************************************/
//Set for Debug in App
//const station = "Karlsplatz"
const station = args.widgetParameter
//Adds "&" to combined station and replace umlauts
let clearstation = station.replace(" ","%20").replace("ß","ss").replace("ü","ue").replace("ä","ae").replace("ö","oe")
//Get Station ID
const mvgstatID = "https://www.mvg.de/api/bgw-pt/v3/locations?query=" + clearstation
let responseID = await new Request(mvgstatID).loadJSON();
// Store the MVG ID
const mvgID = responseID[0].globalId.toString()
//Set your preferred MVG products
var transportMeans = {"BAHN": true, "SBAHN": true, "UBAHN": true, "TRAM": true, "BUS": true, "REGIONAL_BUS": true, "SCHIFF": true}
let transportTypes = ""
for (const [key, value] of Object.entries(transportMeans)) {
  if(value === true) {
    if(transportTypes === "") {
      transportTypes = key
    }
    else {
      transportTypes += "," + key
    }
  }
}
console.log(transportTypes)
//Get departures
const mvgReq = "https://www.mvg.de/api/bgw-pt/v3/departures?query&globalId=" + mvgID + "&offsetInMinutes=0&limit=10&transportTypes=" + transportTypes
let response = await new Request(mvgReq).loadJSON()
//Calculates Departure time
function calculateTimeOffset(times)
{
  const offset = Math.ceil((times - Date.now()) / 60000)
  if(offset > 60) {
    return ">1h"
  }
  else {
    return offset.toString()
  }
}
//Calculates expected departure incl. delay
function calculateDeparture (delay, time) {
  if (delay == undefined)
  {
    return time
  }
  else
  {
    return delay+time
  }
}
//Shorten text, if length exceeds space
function truncate(text, n = 22)
{
  return (text.length > n) ? text.substr(0, n-1) + '...' : text
}
function createDateString()
{
  const now = new Date(Date.now())
  let day = (now.getDate().toString().length > 1) ? now.getDate().toString() : "0" + now.getDate().toString()
  let monthNumb = now.getMonth() + 1
  let month = (monthNumb.toString().length > 1) ? monthNumb.toString() : "0" + monthNumb.toString()
  let year = now.getFullYear().toString()
  let hours = (now.getHours().toString().length > 1) ? now.getHours().toString() : "0" + now.getHours().toString()
  let minutes = (now.getMinutes().toString().length > 1) ? now.getMinutes().toString() : "0" + now.getMinutes().toString()
  return "Updated: " + day + "." + month + "." + year + " - " + hours + ":" + minutes
}
const widgetSize = (config.widgetFamily ? config.widgetFamily : 'large');
const widget = await createWidget()
if (!config.runInWidget) {
  switch(widgetSize) {
    case 'small':
    await widget.presentSmall();
    break;
    case 'large':
    await widget.presentLarge();
    break;
    
    default:
    await widget.presentMedium();
  }
}
Script.setWidget(widget)
function createWidget() {
  let ITEMS_COUNT
  let HEADER_SIZE
  let COLUMN_HEIGHT
  let SPACING
  let PADDING
  let LOGO_SIZE
  let STATION_SIZE
  let INFO_SIZE
  let DEPART_SIZE
  let LOGO_FONT_SIZE
  let STATION_FONT_SIZE
  let DEPART_FONT_SIZE
  let HEADLINE_FONT_SIZE
  let FOOTER_HEIGHT
  let FOOTER_FONT_SIZE
  if (widgetSize == 'small') {
    ITEMS_COUNT = 4
    HEADER_SIZE = 25
    COLUMN_HEIGHT = 15
    SPACING = 3
    PADDING = SPACING
    LOGO_SIZE = new Size(20, COLUMN_HEIGHT)
    STATION_SIZE = new Size(80, COLUMN_HEIGHT)
    INFO_SIZE = new Size(20, COLUMN_HEIGHT)
    DEPART_SIZE = new Size(20, COLUMN_HEIGHT)
    LOGO_FONT_SIZE = 12
    STATION_FONT_SIZE = 14
    DEPART_FONT_SIZE = 12
    HEADLINE_FONT_SIZE = 16
    FOOTER_HEIGHT = 20
    FOOTER_FONT_SIZE = 6
  } else if (widgetSize == 'medium') {
    ITEMS_COUNT = 3
    HEADER_SIZE = 25
    COLUMN_HEIGHT = 20
    SPACING = 5
    PADDING = SPACING
    LOGO_SIZE = new Size(35, COLUMN_HEIGHT)
    STATION_SIZE = new Size(185, COLUMN_HEIGHT)
    INFO_SIZE = new Size(25, COLUMN_HEIGHT)
    DEPART_SIZE = new Size(60, COLUMN_HEIGHT)
    LOGO_FONT_SIZE = 14
    STATION_FONT_SIZE = 20
    DEPART_FONT_SIZE = 16
    HEADLINE_FONT_SIZE = 24
    FOOTER_HEIGHT = 10
    FOOTER_FONT_SIZE = 8
  } else {
    ITEMS_COUNT = 8
    HEADER_SIZE = 30
    COLUMN_HEIGHT = 20
    SPACING = 5
    PADDING = SPACING
    LOGO_SIZE = new Size(35, COLUMN_HEIGHT)
    STATION_SIZE = new Size(185, COLUMN_HEIGHT)
    INFO_SIZE = new Size(25, COLUMN_HEIGHT)
    DEPART_SIZE = new Size(60, COLUMN_HEIGHT)
    LOGO_FONT_SIZE = 14
    STATION_FONT_SIZE = 20
    DEPART_FONT_SIZE = 16
    HEADLINE_FONT_SIZE = 24
    FOOTER_HEIGHT = 25
    FOOTER_FONT_SIZE = 8
  }
  // Widget
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#4562a2")
  widget.setPadding(PADDING, PADDING, PADDING, PADDING);
  // Main stack
  const stack = widget.addStack();
  stack.layoutVertically();
  stack.centerAlignContent()
  // Top stack for station headline
  const topStack = stack.addStack();
  topStack.layoutVertically();
  //topStack.centerAlignContent()
  topStack.size = new Size(LOGO_SIZE.width + STATION_SIZE.width + DEPART_SIZE.width + INFO_SIZE.width + 3*SPACING, HEADER_SIZE);
  const stationName = topStack.addText(station.toString());
  stationName.textColor = Color.white();
  stationName.leftAlignText()
  stationName.font = Font.boldSystemFont(HEADLINE_FONT_SIZE)
  // Horizontal spacer under headline (station) string
  stack.addSpacer(8);
  
  for (let i = 0; i < ITEMS_COUNT; i++) {
    // Will be set up with 3 columns to show line, destination and departure time
    const bottomStack = stack.addStack();
    bottomStack.spacing = SPACING
    bottomStack.size = new Size(LOGO_SIZE.width + STATION_SIZE.width + INFO_SIZE.size + DEPART_SIZE.width + 3*SPACING, COLUMN_HEIGHT + 2*SPACING)
    bottomStack.layoutHorizontally();
    bottomStack.centerAlignContent()
    
    const linestack = bottomStack.addStack();
    linestack.size = LOGO_SIZE
    linestack.centerAlignContent()
    //linestack.backgroundColor = new Color(response.departures[i].lineBackgroundColor.toString())
    let lineName = linestack.addText(response[i].label.toString())
    lineName.font = Font.boldSystemFont(LOGO_FONT_SIZE)
    lineName.textColor = Color.white()
    lineName.centerAlignText()
    lineName.minimumScaleFactor = 0.4
    const destinationStack = bottomStack.addStack();
    destinationStack.size = STATION_SIZE
    destinationStack.layoutVertically()
    destinationStack.bottomAlignContent()
    let destinationName = destinationStack.addText(truncate(response[i].destination.toString()))
    destinationName.font = Font.lightSystemFont(STATION_FONT_SIZE)
    destinationName.textColor = Color.white()
    destinationName.leftAlignText()
    destinationName.minimumScaleFactor = 0.95
    
    const infoStack = bottomStack.addStack()
    infoStack.size = INFO_SIZE
    infoStack.centerAlignContent()
    let infotext = ""
    // if ride is cancelled, show x, otherwise show occupancy
    if(response[i].cancelled.toString() === "true") {
      infoText = infoStack.addText("❌")
      infoText.font = Font.lightSystemFont(9)
    }
    else {
      if(response[i].occupancy.toString() === "LOW") {
        infoText = infoStack.addText("–")
        infoText.textColor = Color.green()
      }
      else if(response[i].occupancy.toString() === "HIGH") {
        infoText = infoStack.addText("+")
        infoText.textColor = Color.red()
      }
      else {
        // use medium as fallback value (e.g. if ocuppancy is N/A)
        infoText = infoStack.addText("=")
        infoText.textColor = Color.yellow()
      }
      infoText.font = Font.boldSystemFont(STATION_FONT_SIZE)
    }
    infoText.leftAlignText()
    infoText.minimumScaleFactor = 0.5
    
    const departureStack = bottomStack.addStack();
    departureStack.size = DEPART_SIZE
    departureStack.bottomAlignContent()
    
    // Add ' Min' extension if we have space for that and if departure time is in minutes (<60min)
    let extension = ""
    if ((widgetSize == 'medium' ||  widgetSize == 'large') && calculateTimeOffset(response[i].realtimeDepartureTime) != ">1h") {
      extension = " Min"
    }
    let departureTime = departureStack.addText(calculateTimeOffset(response[i].realtimeDepartureTime)+extension)
    departureTime.font = Font.boldSystemFont(DEPART_FONT_SIZE)
    departureTime.textColor = Color.white()
    departureTime.rightAlignText()
    departureTime.minimumScaleFactor = 0.95
  }
  const updatedstack = stack.addStack();
  updatedstack.bottomAlignContent()
  updatedstack.size = new Size(LOGO_SIZE.width + STATION_SIZE.width + INFO_SIZE.width + DEPART_SIZE.width + 3*SPACING, FOOTER_HEIGHT)
  let lastUpdateTime = updatedstack.addText(createDateString())
  lastUpdateTime.font = Font.lightSystemFont(8)
  lastUpdateTime.textColor = Color.white()
  lastUpdateTime.rightAlignText()
  lastUpdateTime.textOpacity = 0.6
  lastUpdateTime.minimumScaleFactor = 0.95
  return widget;
}
Script.complete()
