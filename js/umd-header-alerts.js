/**
 * We use a cleaned up version of the University of Maryland header JS,
 * found at https://umd-header.umd.edu/
 *
 * It is designed to be much easier to read and use. We can get away with this only
 * because we are not an official campus unit - otherwise that would be forbidden.
 *
  * This script includes:
 *  - A small utility handling library (deobfuscated and cleaned up)
 *  - Code to check for redirects to the UMD homepage and mask it.
 *  - Code to check for UMD Alerts to be shown in the header.
 *
 * Last Modified 2018-08-01
 */

/**
 * Our settings.
 * The regular wrapper uses the query params for this, but we don't need to.
 */
var config = {
  alertsUrl : "https://umd.edu/api/alerts",
  cookieName : "umd_header"
};

function checkStatus(response) {
  if (response.type == 'opaqueredirect') {
    return Promise.reject(new Error("Received a redirect."))
  }
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function parseJson(response) {
  return response.json()
}

function doAjax(url, callback) {
  var req = new Request(url, {
      redirect: 'manual'
    });

  fetch(req)
    .then(checkStatus)
    .then(parseJson)
    .then(function(data) {
      callback(data);
    })
    .catch(function(err) {
      console.log("Opps, Something went wrong!", err);
      callback(null);
    });
}

function setCookie(c_name, values, days) {
  var expires = new Date;
  expires.setTime(expires.getTime() + 24 * days * 60 * 60 * 1E3);
  var c_value = "; expires=" + expires.toUTCString();
  document.cookie = c_name + "=" + values.join() + c_value;
}

function getCookie(name) {
  var result = [];
  var chunks = document.cookie.split(";");
  [].forEach.call(chunks, function(chunk) {
    var pair = chunk.split("=");
    if (pair[0].trim() === name) {
      result = pair[1].trim().split(",");
    }
  });
  return result;
}

function UmdHeader(config) {
  this.config = config;
  this.cookies = getCookie(this.config.cookieName);
  this.buildAlerts();
  this.element = document.querySelector(".umdheader-wrap");
}
UmdHeader.prototype.closeAlert = function(event) {
  var item = event.target.parentNode;
  var name = item.getAttribute("data-alert-id");
  item.classList.add("umdheader-alert--hidden");
  if (null === this.cookies || this.cookies.indexOf(name) < 0) {
    this.cookies.push(name);
    setCookie(this.config.cookieName, this.cookies, 1);
  }
};
UmdHeader.prototype.buildAlerts = function() {
  var self = this;
  var alerts = "";

  doAjax(this.config.alertsUrl, function(evt) {
    if (evt) {
      if ("object" === typeof evt.data) {
        [].forEach.call(evt.data, function(params) {
          if (self.cookies.indexOf(params.alert_id) < 0) {
            alerts += '<div class="umdheader-alert umdheader-alert--' + params.alert_type + '" data-alert-id="' + params.alert_id + '">';
            alerts += '<span class="umdheader-alert__close-trigger"><em class="umdheader-visually-hidden">Close</em></span>';
            alerts += '<span class="umdheader-alert__title">' + params.alert_title + "</span>";
            alerts += '<span class="umdheader-alert__desc">' + params.alert_message + "</span>";
            alerts += "</div>";
          }
        });
      }
    }
    if (alerts.length > 0) {
      var a = document.createElement("div");
      a.classList.add("umdheader-alerts");
      a.innerHTML = alerts;
      document.getElementById("umdheader-main").parentNode.insertBefore(a, document.getElementById("umdheader-main"));

      // Bind the listeners for the close buttons
      [].forEach.call(document.querySelectorAll(".umdheader-alert__close-trigger"), function(el) {
        el.addEventListener("click", function(el) {
          self.closeAlert(el);
        });
      });
    }
  });
};

// Run it
new UmdHeader(config);

