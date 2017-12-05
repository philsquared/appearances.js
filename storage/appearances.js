var events = ""
var appearances = ""

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function loadJSON( filename, callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', "../storage/" + filename, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 ) {
            callback(xobj.responseText);
          }
	};
	xobj.send(null); 
}

function setWidth(videoElement, width) {
	videoElement.setAttribute( "width", width )
}

var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function writeAppearances( appearances, table ) {
		var currentYear = 0
		var currentMonth = -1
		var monthData = []

		var stats = {
			talks: 0
		}

		var writeMonthRow = function( table ) {

				for( var i = 0; i < monthData.length; ++i ) {
					var a = monthData[i]
					var e = ""
					for( var j = 0; j < events.length; ++j ) {
						if( events[j].name == a.event )
							e = events[j];
					}

					var newRow = document.createElement("tr");
					if( i == 0 ) {
						var newCell = document.createElement("td");
						newCell.setAttribute( "class", "month" )
						newCell.setAttribute( "rowspan", monthData.length )
						var text = document.createTextNode( months[currentMonth] );
						var div  = document.createElement("div");
						div.appendChild(text);
						//div.setAttribute( "class", "verticalText" )
						newCell.appendChild(div);
						newRow.appendChild(newCell);
					}
					var eventCell = document.createElement("td");
					eventCell.setAttribute( "class", "eventName" )
					eventCell.setAttribute( "rowspan", "1" )
					var text = document.createTextNode( a.event );
					var eventAnchor  = document.createElement("a");
					if( e && e.url )
						eventAnchor.setAttribute("href", e.url )
					var date = new Date(a.date)
					eventAnchor.setAttribute("title", date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() )
					eventAnchor.appendChild(text);
					var eventDiv  = document.createElement("div");
					eventDiv.appendChild(eventAnchor);
					eventCell.appendChild(eventDiv);
					
					if( e && e.location ) {
						var locationText = document.createTextNode( "(" + e.location.city + ", " + e.location.country + ")" );
						var locationDiv  = document.createElement("div");
						locationDiv.setAttribute( "class", "location")
						locationDiv.appendChild(locationText);
						eventCell.appendChild(locationDiv);
					}
					newRow.appendChild(eventCell);

					var talkCell = document.createElement("td");
					talkCell.setAttribute( "class", "appearanceTitle" )
					var text = document.createTextNode( a.title );
					var talkAnchor  = document.createElement("a");

					if( a.info )
						talkAnchor.setAttribute("href", a.info )
					talkAnchor.appendChild(text);
					talkCell.appendChild(talkAnchor);

					 var thumbCell = document.createElement("td");
					 thumbCell.setAttribute( "class", "thumbnailCell" )

					var thumbnailImg = null
					if( a.thumbnail ) {
						thumbnailImg = document.createElement("img");
						thumbnailImg.setAttribute( "src", "../storage/conf_images/" + a.thumbnail )
						thumbnailImg.setAttribute( "class", "thumbnail" )
					}

					if( a.video ) {
						var videoAnchor  = document.createElement("a");
						videoAnchor.setAttribute("href", a.video )
						videoAnchor.setAttribute( "class", "thumbnailLink" )
						videoAnchor.setAttribute("style", "position:relative" )
						var playIcon  = document.createElement("img");
						playIcon.setAttribute( "src", "../storage/conf_images/play-icon.png" )

						if( a.thumbnail )
							playIcon.setAttribute( "class", "playicon-overlay" )
						else
							playIcon.setAttribute( "class", "playicon" )
						videoAnchor.appendChild( playIcon );
						if( thumbnailImg )
							videoAnchor.appendChild( thumbnailImg );

						var tooltip = document.createElement("div")
						tooltip.setAttribute( "class", "tooltiptext" )
						var tooltipText = document.createTextNode( "link to video" );
						tooltip.appendChild( tooltipText )

						if( a.notes ) {
							tooltip.appendChild( document.createElement("br") )
							var tooltipText2 = document.createTextNode( "(" + a.notes + ")" );
							tooltip.appendChild( tooltipText2 )
						}
						videoAnchor.appendChild( tooltip );

						thumbCell.appendChild( videoAnchor );						
					}
					else if( thumbnailImg ) {
						thumbCell.appendChild( thumbnailImg );						
					}


					newRow.appendChild(talkCell);
					newRow.appendChild(thumbCell);


					if( a.type != "Talk" ) {
						var typeName = function() {
								switch( a.type ) {
									case "LightningTalk": return "[lightning talk]";
									case "Keynote": return "[keynote]";
									case "Panel": return "[panel]";
									case "Interview": return "[interview]";
									default: return ""
								}
							}();
						var typeClass = function() {
								switch( a.type ) {
									case "LightningTalk": return "lightning";
									case "Keynote": return "keynote";
									case "MiniTalk": return "minitalk";
									case "Panel": return "panel";
									case "Interview": return "interview";
									default: return "";
								}
							}();

						var text = document.createTextNode( typeName );
						var div  = document.createElement("div");
						div.setAttribute( "class", "type " + typeClass )
						div.appendChild( text );
						talkCell.appendChild( div );
					}

					stats.talks++;

					table.appendChild( newRow )
				}
			};

		for( var i=0; i < appearances.length; ++i) {
			var a = appearances[i];
			var date = new Date(a.date)
			var year = date.getFullYear()
			var month = date.getMonth()
			if( year != currentYear ) {
				writeMonthRow( table )

				if( stats.talks > 0 ) {
					if( stats.talks == 1 )
						var summary = "1 talk"
					else
						var summary = stats.talks + " talks"

					var statsRow = document.createElement("tr");
					var cell = document.createElement("td");
					cell.setAttribute( "class", "stats" )
					cell.setAttribute( "colspan", "4" )
					cell.setAttribute( "style", "text-align:right")
					var text = document.createTextNode( summary );
					cell.appendChild(text);
					statsRow.appendChild(cell);
					table.appendChild(statsRow);
					stats = { talks: 0 }
				}


				currentYear = year;
				currentMonth = -1
				monthData = []

				var newRow = document.createElement("tr");
				var newCell = document.createElement("td");
				newCell.setAttribute( "class", "year" )
				newCell.setAttribute( "colspan", "4" )
				var text = document.createTextNode( year );
				newCell.appendChild(text);
				newRow.appendChild(newCell);
				table.appendChild(newRow);
			}
			if( month != currentMonth ) {
				writeMonthRow( table )
				currentMonth = month;
				monthData = []
			}
			monthData.push(a)
		}
		writeMonthRow( table )
}
loadJSON( "events.json", function(response) {
	events = JSON.parse(response);


	loadJSON( "appearances.json", function(response) {
		appearances = JSON.parse(response);

		var sorter = function(a, b)
			{
				if (a.date < b.date)
					return 1
				else if( a.date > b.date )
					return -1
				else 
					return 0
			};
		var revSorter = function(a, b) { return -sorter(a,b) };

		var now = new Date();
		var past = []
		var future = []

		for(i=0; i < appearances.length; ++i) {
			var a = appearances[i]
			if( new Date( a.date ) < now )
				past.push( a )
			else
				future.push( a )
		}
		past.sort( sorter );
		future.sort( revSorter );

		if( future.length > 0 )
			writeAppearances( future, document.getElementById("futureTable") );
		else {
		    var elements = document.getElementsByClassName("future");
		    for(var i = 0; i < elements.length; i++){
		        //elements[i].style.visibility = "hidden";
		        elements[i].style.display = "none";
		    }			
		}

		writeAppearances( past, document.getElementById("pastTable") )
	});

});

