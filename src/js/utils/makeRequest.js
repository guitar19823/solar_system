function xhr() {
  if (window.XMLHttpRequest) {
    try {
      return new XMLHttpRequest();
    } catch (e) {
      console.log(e);
    }
  } else if (window.ActiveXObject) {
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      console.log(e);
    }

    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
      console.log(e);
    }
  }

  return null;
}

function makeRequest({ method, url, param, json, func }) {
  const request = xhr();

  request.addEventListener('readystatechange', () => {
    4 == request.readyState && 200 == request.status && func(request);
  });

  request.open(method, '/' + url, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(param + '=' + JSON.stringify(json));
}

module.exports = makeRequest;
