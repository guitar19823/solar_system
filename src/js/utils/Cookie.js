class Cookie {
  setCookie(name, value, options = { expires: 604800, path: '/' }) {
    let expires = options.expires;

    if (typeof expires == "number" && expires) {
      const date = new Date();

      date.setTime(date.getTime() + expires * 1000);
      expires = options.expires = date;
    }

    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + "=" + value;

    for (let propName in options) {
      updatedCookie += "; " + propName;
      const propValue = options[propName];

      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }

    document.cookie = updatedCookie;
  }

  getCookie(name) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
}

module.exports = Cookie;
