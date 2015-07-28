/* eslint-env browser */

"use strict";

document.addEventListener("readystatechange", function() {
    var timezones, form, content,
        nameEntry, zoneEntry, validityInfo;

    function getTime(zone) {
        var t = new Date(Date.now() + (zone * 3600000)),
            h = t.getUTCHours(),
            m = t.getUTCMinutes();

        return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
    }

    function buildRow(o) {
        var row = document.createElement("div"),
            name, time;

        row.className = "row";

        name = document.createElement("div");
        name.className = "col col-4 item name";
        name.textContent = Array.isArray(o.name) ? o.name.join(", ") : o.name;

        time = document.createElement("div");
        time.className = "col col-2 item time";
        time.textContent = getTime(o.zone);

        setInterval(function() {
            time.textContent = getTime(o.zone);
        }, 30000);

        row.appendChild(name);
        row.appendChild(time);

        return row;
    }

    if (document.readyState === "complete") {
        form = document.getElementsByClassName("timezone-add-form")[0];
        content = document.getElementsByClassName("timezone-info-content")[0];
        validityInfo = document.getElementsByClassName("validity-info")[0];
        nameEntry = document.getElementById("add-name");
        zoneEntry = document.getElementById("add-zone");

        try {
            timezones = JSON.parse(window.localStorage.getItem("timezones"));
        } catch (err) {
            timezones = [];
        }

        if (!Array.isArray(timezones)) {
            timezones = [];
        }

        timezones.forEach(function(item) {
            content.appendChild(buildRow(item));
        });

        form.addEventListener("submit", function(e) {
            var name, zone, item;

            e.preventDefault();

            name = nameEntry.value;
            zone = zoneEntry.value;

            if (!name) {
                validityInfo.textContent = "Invalid name";

                return;
            }

            if (zone && /(UTC|GMT)\s?(\+|\-)\s?\d{1,2}\s?(:|\.)\s?\d{1,2}/.test(zone)) {
                zone = parseFloat(zone.replace(/\s/g, "").replace(":", ".").replace(/^[^\d]+/, ""));

                if (isNaN(zone)) {
                    validityInfo.textContent = "Error parsing timezone";

                    return;
                }
            } else {
                validityInfo.textContent = "Invalid timezone";

                return;
            }

            validityInfo.textContent = "";

            item = { name: name, zone: zone };

            timezones.push(item);
            content.appendChild(buildRow(item));

            nameEntry.value = "";
            zoneEntry.value = "";

            try {
                window.localStorage.setItem("timezones", JSON.stringify(timezones));
            } catch (err) {
                validityInfo.textContent = "Error saving data: " + e;
            }
        }, false);
    }
}, false);
