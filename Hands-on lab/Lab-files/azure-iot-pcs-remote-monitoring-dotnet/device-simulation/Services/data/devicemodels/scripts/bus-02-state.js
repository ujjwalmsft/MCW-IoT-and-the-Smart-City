// Copyright (c) Microsoft. All rights reserved.

/*global log*/
/*jslint node: true*/

"use strict";

var center_latitude = 40.693935;
var center_longitude = -73.952279;

// Default state
var state = {
    online: true,
    latitude: center_latitude,
    longitude: center_longitude,
    fuellevel: 53.0,
    fuellevel_unit: "Gal",
    speed: 42.0,
    speed_unit: "mph",
    vin: "2K0H7PNZY0RSFQ033"
};

/**
 * Restore the global state using data from the previous iteration.
 *
 * @param previousState The output of main() from the previous iteration
 */
function restoreState(previousState) {
    // If the previous state is null, force a default state
    if (previousState !== undefined && previousState !== null) {
        state = previousState;
    } else {
        log("Using default state");
    }
}

/**
 * Simple formula generating a random value around the average
 * in between min and max
 */
function vary(avg, percentage, min, max) {
    var value = avg * (1 + ((percentage / 100) * (2 * Math.random() - 1)));
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
}

/**
 * Generate a random geolocation at some distance (in miles)
 * from a given location
 */
function varylocation(latitude, longitude, distance) {
    // Convert to meters, use Earth radius, convert to radians
    var radians = (distance * 1609.344 / 6378137) * (180 / Math.PI);
    return {
        latitude: roundTo((latitude + radians), 6),
        longitude: roundTo((longitude + radians / Math.cos(latitude * Math.PI / 180)), 6)
    };
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
        n = (n * -1).toFixed(digits);
    }
    return n;
}

/**
 * Entry point function called by the simulation engine.
 *
 * @param context        The context contains current time, device model and id
 * @param previousState  The device state since the last iteration
 */
/*jslint unparam: true*/
function main(context, previousState) {

    // Restore the global state before generating the new telemetry, so that
    // the telemetry can apply changes using the previous function state.
    restoreState(previousState);

    // Between -1.5 and 1.5 miles around start location
    var distance = roundTo(vary(0.05, 2500, -1.5, 1.5), 2);
    var coords = varylocation(center_latitude, center_longitude, distance);
    state.latitude = coords.latitude;
    state.longitude = coords.longitude;

    // 42 +/- 50%,  Min 0, Max 80
    // TODO: 3 - finish this line of code:
    //state.speed = vary(42, 50, 0, 80);

    // 53 +/- 25%,  Min 2, Max 80
    // TODO: 4 - finish this line of code:
    //state.fuellevel = vary(53, 25, 2, 80);

    return state;
}
