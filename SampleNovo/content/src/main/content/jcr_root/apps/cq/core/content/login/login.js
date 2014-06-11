// 'xmlhttp' request object, do not access directly, use getXmlHttp instead
var xmlhttp = null;


function getXmlHttp() {
    if (xmlhttp) {
        return xmlhttp;
    }

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        if (window.ActiveXObject) {
            try {
                xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (ex) {
                try {
                    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (ex) {
                }
            }
        }
    }
    return xmlhttp;
}


function sendRequest(/* String */path, /* String */user, /* String */ pass) {
    var xmlhttp = getXmlHttp();
    if (!xmlhttp) {
        return false;
    }

    if (xmlhttp.readyState < 4) {
        xmlhttp.abort();
    }

    // send the authentication request
    var params = "j_validate=true";
    params += "&j_username=" + encodeURIComponent(user);
    params += "&j_password=" + encodeURIComponent(pass);
    params += "&_charset_=utf8";
    xmlhttp.open('POST', path, false);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Content-length", params.length);
    xmlhttp.setRequestHeader("Connection", "close");
    xmlhttp.send(params);
    return xmlhttp.status != 403;
}

function showError(msg) {
    try {
        var loginError = document.getElementById("login-error");
        loginError.innerHTML = msg;
        loginError.className = "err-visible";
    } catch (e) {
        alert(msg+"::"+e.message);
    }
}

function createCookie(name, value, days, path) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires="+date.toGMTString();
    } else {
        var expires = "";
    }
    path = path || "/";
    document.cookie = name + "=" + value + expires + "; path=" + path;
}

function eraseCookie(name, path) {
    createCookie(name, "", -1, path);
}

function loginuser(failedLoginMessage) {
    var path = document.forms['login'].action;
    var user = document.forms['login'].j_username.value;
    var pass = document.forms['login'].j_password.value;
    var resource = document.forms['login'].resource.value;

    // if no user is given, avoid login request
    if (!user) {
        return false;
    }

    // send user/id password to check and persist
    if (sendRequest(path, user, pass)) {
        // erase legacy login #37548
        eraseCookie("login-token", "/crx");

        var u = resource;
        if (window.location.hash && u.indexOf('#') < 0) {
            u = u + window.location.hash;
        }
        document.location = u;

    } else {
        showError(failedLoginMessage);
    }
    return false;
}

function txtCtrl(inputobj, id) {
    if(inputobj.value.length > 0) {
        fadeOut(id);
        //shrinkToFill(inputobj, 26, "", "Myriad, Lucida Grande, Lucida Sans Unicode, Tahoma, Geneva, Arial, Helvetica, sans-serif");
    } else {
        fadeIn(id);
    }
}
        
function fadeIn(id) {
    var elem = getElem(id);
    var o = getOpacity(elem, 100);
    if (o < 100) {
        setOpacity(elem, Math.round(o + 10));
        setTimeout(function(){fadeIn(id);}, 10);
    }
}

function fadeOut(id) {
    var elem = getElem(id);
    var o = getOpacity(elem, 100);
    if (o > 0) {
        setOpacity(elem, Math.round(o - 10));
        setTimeout(function(){fadeOut(id);}, 10);
    }
}

function getElem(id) {
    return document.getElementById(id);
}

function getProp(elem, prop) {    
    if (elem && elem.style && elem.style[prop]) {
        return elem.style[prop];
    }
    return;
}

function setProp(elem, prop, value) {
    if (elem && elem.style) {
        elem.style[prop] = value;
    }
}

function getOpacity(elem, defaultValue) {
    var o;
    if (!document.all) {
        o = getProp(elem, "opacity");
        if (typeof o == "undefined") {
            return defaultValue;
        } else {
            return new Number(o) * 100;
        }
    } else {
        o = getProp(elem, "filter");
        if (typeof o == "undefined" || o.indexOf("Alpha") < 0) {
            return defaultValue;
        } else {
            o = o.substring(o.indexOf("=")+1,o.indexOf(")"));
            return new Number(o) / 100;
        }
    }
}
        
function setOpacity(elem, o) {
    if (!document.all) {
        setProp(elem, "opacity", o / 100);
    } else {
        o = o * 100;
        setProp(elem, "filter", "Alpha(opacity="+o+")");
    }
}

function measureText(txt, font) {
    var id = 'cq-txt-width-test';
    var tag = getElem(id);
    if (!tag) {
        tag = document.createElement("span");
        tag.setAttribute("id", id);
        tag.setAttribute("style", "display:none;font:' + font + ';");
        var txtNode = document.createTextNode(txt);
        tag.appendChild(txtNode);
        document.getElementsByTagName("body")[0].appendChild(tag);
    } else {
        setProp(tag, "font", font);
        tag.innerHTML = txt;
    }
    
    /*FIXME: will return 0 as long as span is hidden*/
    return {
        width: tag.offsetWidth,
        height: tag.offsetHeight
    }
}

function shrinkToFill(input, fontSize, fontWeight, fontFamily) {
    var txt = input.value;
    var inputWidth = input.offsetWidth;
    var maxWidth = inputWidth - 10;
    var font = fontWeight + " " + fontSize + "px " + fontFamily;
    var textWidth = measureText(txt, font).width;
    if (textWidth > maxWidth) {
        fontSize = fontSize * maxWidth / textWidth * .9;
        font = fontWeight + " " + fontSize + "px " + fontFamily;
        
    }
    setProp(input, "font", font);
}