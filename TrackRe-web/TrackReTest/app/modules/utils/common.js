common = function() {}
var now = new Date(configDate.year, configDate.month - 1, configDate.date, configDate.hour, configDate.minute, configDate.second),
    nowMilliseconds = now.getTime(),
    dayStartTime = new Date(configDate.year, configDate.month - 1, configDate.date, 0, 0, 0),
    dayStartMilliseconds = dayStartTime.getTime(),
    mapMaxZoom = 18,
    marker = {
        visible: false,
        from: new google.maps.Marker({ icon: 'assets/images/marker-start.png', draggable: true }),
        to: new google.maps.Marker({ icon: 'assets/images/marker-end.png', draggable: true })
    },
    mapOptions = {
        zoom: 12,
        maxZoom: mapMaxZoom,
        center: new google.maps.LatLng(52.52834, 13.37997),
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyles.x1
    };



common.infoBoxObj = function() {
    return new InfoBox({
        content: document.getElementById('infoboxOnMapClick'),
        disableAutoPan: false,
        maxWidth: 200,
        pixelOffset: new google.maps.Size(0, 0),
        zIndex: null,
        infoBoxClearance: new google.maps.Size(1, 1),
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
    });
};
common.calculateDemoUnixtime = function(selectedTime) {
    var hr, min;
    if (selectedTime == 'now') {
        var now = new Date();
        hr = now.getHours();
        min = now.getMinutes();
    } else {
        var arr = selectedTime.split(":");
        hr = arr[0];
        min = arr[1];
    }
    var dateTime = new Date(configDate.year, configDate.month, configDate.date, hr, min, 0),
        unixtime = dateTime.getTime() / 1000;
    return unixtime;
};
common.hash = function(str) {
    var hash = 0,
        i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
common.hashCode = function(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};
common.unixtimeToHumantime = function(unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp    
    var date = new Date(unix_timestamp); // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var hours = "0" + date.getHours(); // Hours part from the timestamp    
    var minutes = "0" + date.getMinutes(); // Minutes part from the timestamp
    var seconds = "0" + date.getSeconds(); // Seconds part from the timestamp    
    var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2); // Will display time in 10:30:23 format
    return formattedTime;
};
