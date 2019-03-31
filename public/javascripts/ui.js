'use strict';

/* ************************************************ */
/* **************** USER INTERFACE **************** */
/* ************************************************ */

window.onload = function () {
    var socket = io();

    var msgs = ['<span>Hello User!</span>'];

    window.onunload = function () {
        socket.disconnect();
    };

    var container = document.getElementsByClassName('container')[0];

    var year = new Date().getFullYear(),
        timeout = void 0;

    year = year === 2018 ? year : '2018 - ' + year;

    /**
    * mobileDevice
    */
    function mobileDevice() {
        return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);
    }

    container.innerHTML = '\n        <header class="header">\n            <div class="button_menu">\n                <div></div>\n                <div></div>\n            </div>\n        </header>\n        <nav class="nav">\n            <p>\u041C\u0435\u043D\u044E</p>\n            <ul>\n                <li class="menu_btns" id="planets">\u043E\u0431\u044A\u0435\u043A\u0442\u044B</li>\n                <li class="menu_btns" id="flight">\u043F\u043E\u043B\u0435\u0442</li>\n                <li class="menu_btns" id="sounds">\u043C\u0443\u0437\u044B\u043A\u0430</li>\n                <li class="menu_btns" id="chat">\u0447\u0430\u0442</li>\n                <li class="menu_btns" id="contacts">\u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</li>\n                <li class="menu_btns" id="settings">\u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</li>\n            </ul>\n        </nav>\n        <main id="main"></main>\n        <div id="audio">\n            <audio src="/sounds/space' + parseInt(Math.random() * 27 + 1) + '.mp3" controls id="track">Your browser does not support the audio element.</audio>\n        </div>\n        <audio id="system_sounds">Your browser does not support the audio element.</audio>\n        <footer class="footer">\n            <p>&copy; Copyright ' + year + '.</p>\n        </footer>\n    ';

    var track = document.getElementById('track');
    var system_sounds = document.getElementById('system_sounds');
    var title = document.getElementById('title');
    var audio = document.getElementById('audio');
    var blackPanel = document.createElement('div');
    var main = document.getElementById('main');
    var chat = document.getElementById('chat');
    var contacts = document.getElementById('contacts');
    var settings = document.getElementById('settings');
    var sounds = document.getElementById('sounds');
    var flight = document.getElementById('flight');
    var planets = document.getElementById('planets');
    var menuBtns = document.getElementsByClassName('menu_btns');
    var button_menu = document.getElementsByClassName('button_menu')[0];
    var nav = document.getElementsByClassName('nav')[0];
    var arrObj = [['sun', 'солнце'], ['mercury', 'меркурий'], ['venus', 'венера'], ['earth', 'земля'], ['moon', 'луна'], ['mars', 'марс'], ['jupiter', 'юпитер'], ['saturn', 'сатурн'], ['uranus', 'уран'], ['neptune', 'нептун'], ['pluto', 'плутон'], ['charon', 'харон'], ['universe', 'космос']];

    var invert_y = getCookie('invert_y'),
        mouse_sensitivity = getCookie('mouse_sensitivity'),
        antialias = getCookie('antialias'),
        textures = getCookie('textures'),
        graphics = getCookie('graphics'),
        textColor = [],
        navColor = [];

    blackPanel.id = 'black_panel';

    if (antialias === undefined) {
        antialias = '0';
        setCookie('antialias', '0');
    }

    if (invert_y === undefined) {
        if (mobileDevice()) {
            invert_y = '0';
            setCookie('invert_y', '0');
        } else {
            invert_y = '1';
            setCookie('invert_y', '1');
        }
    }

    if (mouse_sensitivity === undefined) {
        mouse_sensitivity = '9';
        setCookie('mouse_sensitivity', '9');
    }

    if (textures === undefined) {
        if (mobileDevice()) {
            textures = '1';
            setCookie('textures', '1');
        } else {
            textures = '2';
            setCookie('textures', '2');
        }
    }

    if (graphics === undefined) {
        graphics = '1';
        setCookie('graphics', '1');
    }

    button_menu.addEventListener('click', function () {
        nav.classList.contains('to_top') ? closeNav() : openNav();
    });

    for (var i = 0, l = menuBtns.length; i < l; i++) {
        menuBtns[i].addEventListener('click', function () {
            system_sounds.src = '/sounds/2.mp3';
            system_sounds.play();

            closeNav();
        });
        menuBtns[i].addEventListener('mouseover', function () {
            system_sounds.play();
        });
    }

    /**
    * openNav
    */
    function openNav() {
        system_sounds.src = '/sounds/1.mp3';
        nav.classList.add('to_top'), button_menu.classList.add('rotate_button'), button_menu.children[0].classList.add('turn_right'), button_menu.children[1].classList.add('turn_left'), container.appendChild(blackPanel);
    }

    /**
    * closeNav
    */
    function closeNav() {
        nav.classList.remove('to_top'), button_menu.classList.remove('rotate_button'), button_menu.children[0].classList.remove('turn_right'), button_menu.children[1].classList.remove('turn_left'), setTimeout(function () {
            blackPanel.remove();
        }, 500);
    }

    /**
    * call
    */
    function call(item, uri, title, foo) {
        navColor.push(item);
        item.addEventListener('click', function () {
            setTitle(title);
            foo();
        });
    }

    setTitle('Объекты солнечной системы');
    renderPlanets();

    call(planets, 'objects', 'Объекты солнечной системы', renderPlanets);
    call(flight, 'flight', 'Полет по солнечной системе', renderFlight);
    call(sounds, 'sounds', 'Выбор фоновой музыки', renderSounds);
    call(chat, 'chat', 'Общение по чату', renderChat);
    call(contacts, 'contacts', 'Контактные данные', renderContacts);
    call(settings, 'settings', 'Настройки', renderSettings);

    /**
    * setCookie
    * @name
    * @value
    * @options
    */
    function setCookie(name, value) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { expires: 604800, path: '/' };

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var date = new Date();

            date.setTime(date.getTime() + expires * 1000);
            expires = options.expires = date;
        }

        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];

            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    /**
    * getCookie
    * @name
    */
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    /**
    * xhr
    */
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

    /**
    * ajax
    */
    function ajax(data) {
        var request = xhr();
        request.addEventListener('readystatechange', function () {
            4 == request.readyState && 200 == request.status && (document.getElementById(data.elementId).innerHTML = request.responseText);
        });

        request.open(data.method, '/' + data.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(data.param + '=' + JSON.stringify(data.json));
    }

    /**
    * reloader
    * @time
    */
    function reloader() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

        var reloadMsg = document.createElement('div');
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        var span = document.createElement('span');

        reloadMsg.id = 'message_box';
        span.id = 'time';

        span.appendChild(document.createTextNode(time));
        p1.appendChild(document.createTextNode('Настройки сохранены'));
        p2.appendChild(document.createTextNode('Программа перезагрузится через '));
        p2.appendChild(span);
        p2.appendChild(document.createTextNode(' сек.'));
        reloadMsg.appendChild(p1);
        reloadMsg.appendChild(p2);
        main.appendChild(reloadMsg);

        var sI = setInterval(function () {
            time--;
            span.innerHTML = time;
            if (time <= 0) {
                clearInterval(sI);
                location.reload();
            }
        }, 1000);
    }

    /**
       * messageBox
       * @message
       * @delay
       */
    function messageBox(message) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1500;

        var reloadMsg = document.createElement('div');
        var p = document.createElement('p');

        reloadMsg.id = 'message_box';

        p.appendChild(document.createTextNode(message));
        reloadMsg.appendChild(p);
        main.appendChild(reloadMsg);

        setTimeout(function () {
            reloadMsg.remove();
        }, delay);
    }

    /**
    * deleteChilds
    */
    function deleteChilds(parent) {
        parent.lastChild != void 0 && (parent.innerHTML = '', deleteChilds(parent));
    }

    /**
    * color
    */
    function color(object, array) {
        array.map(function (elem) {
            elem.style.color = elem === object ? '#eee' : '#aaa';
        });
    }

    /**
    * setTitle
    */
    function setTitle(titleText) {
        title.innerHTML = titleText;
    }

    /**
    * renderPlanets
    */
    function renderPlanets() {
        color(planets, navColor);
        0 != textColor.length && textColor.splice(0, textColor.length);

        var objs = void 0;

        for (var _i = 0, _l = arrObj.length; _i < _l; _i++) {
            _i == 0 && (objs = '<div id="list">');
            objs += '<p id="' + arrObj[_i][0] + '" class="planet">' + arrObj[_i][1] + '</p>';
            _i == _l - 1 && (objs += '</div><div id="description"><p></p></div>');
        }

        main.innerHTML = objs;

        audio.style.display = 'none';
        var planetList = document.getElementsByClassName('planet');
        var description = document.getElementById('description');

        for (var _i2 = 0, _l2 = planetList.length; _i2 < _l2; _i2++) {
            textColor.push(planetList[_i2]);

            planetList[_i2].addEventListener('click', function () {
                color(this, textColor);
                deleteChilds(description);

                if (description.lastChild === null) {
                    ajax({
                        method: 'POST',
                        url: 'get_descriptions',
                        param: 'object',
                        json: { "object": this.getAttribute('id') },
                        elementId: 'description'
                    });
                }
                description.style.display = 'block';
            });
        }
    }

    /**
    * renderFlight
    */
    function renderFlight() {
        color(flight, navColor);

        var descktopControls = '',
            moover = '';

        descktopControls = mobileDevice() ? '\n            <div id="gamePad">\n                <div id="moover">\n                    <p id="forward"></p>\n                    <p id="backward"></p>\n                    <p id="left"></p>\n                    <p id="right"></p>\n                </div>\n                <div id="areaTouchMove"></div>\n                <input type="range" min="0" max="299792" value="1700" id="range">\n            </div>\n            <div id="speedControl"></div>\n            <div id="arrow"></div>\n        ' : '\n            <div id="control">\n                <div>\n\t\t\t\t\t<p>w</p>\n\t                <p>a</p>\n\t                <p>s</p>\n\t                <p>d</p>\n            \t</div>\n                <div>\n                \t<div></div>\n\t                <div class="mouse">\n\t                \t<div><div></div></div>\n\t                \t<div></div>\n\t                \t<div></div>\n\t                </div>\n\t                <div></div>\n                </div>\n            </div>\n            <div id="speedControl"></div>\n            <div id="scroll">\n            \t<div class="mouse">\n                \t<div></div>\n                \t<div></div>\n                \t<div><div></div></div>\n                </div>\n            </div>\n        ';

        main.innerHTML = '\n            ' + descktopControls + '\n            ' + moover + '\n        ';

        audio.style.display = 'none';
    }

    /**
    * getSelect
    */
    function getSelect() {
        var options = '',
            length = arrObj.length - 1;

        arrObj.map(function (object, i) {
            i < length && (options += '<option value="' + object[0] + '">' + object[1] + '</option>');
        });

        return '<select>' + options + '</select>';
    }

    /**
    * renderSounds
    */
    function renderSounds() {
        color(sounds, navColor);
        0 != textColor.length && textColor.splice(0, textColor.length);

        var sTrs = void 0;

        for (var _i3 = 1; _i3 <= 28; _i3++) {
            _i3 == 1 && (sTrs = '<div id="tracks">');
            sTrs += '<p class="spaceTrack">space' + _i3 + '</p>';
            _i3 == 28 && (sTrs += '</div>');
        }

        main.innerHTML = sTrs;

        audio.style.display = 'block';
        var spaceTrack = document.getElementsByClassName('spaceTrack');

        for (var _i4 = 0, _l3 = spaceTrack.length; _i4 < _l3; _i4++) {
            textColor.push(spaceTrack[_i4]);
            spaceTrack[_i4].addEventListener('click', function () {
                color(this, textColor);
                track.src = '/sounds/' + this.innerHTML + '.mp3';
                track.play();
            });
        }
    }

    /**
    * renderChat
    */
    function renderChat() {
        color(chat, navColor);

        main.innerHTML = '\n            <div id="chat_window">\n                <p id="messages"></p>\n                <input type="text" id="text" autocomplete="off">\n                <button id="button">\u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</button>\n            </div>\n        ';

        audio.style.display = 'none';
        var messages = document.getElementById('messages');
        var text = document.getElementById('text');
        var button = document.getElementById('button');

        msgs.reverse();
        messages.innerHTML = msgs.join('');
        msgs.reverse();

        button.addEventListener('click', function () {
            if (text.value) {
                socket.emit('message', {
                    msg: text.value
                });

                text.value = '';
            }
        });

        socket.removeEventListener('message');
        socket.addEventListener('message', function (msg) {
            if (messages) {
                msgs.push('<span>' + msg.msg + '</span>');

                msgs.reverse();
                messages.innerHTML = msgs.join('');
                msgs.reverse();
            }
        });
    }

    /**
    * renderContacts
    */
    function renderContacts() {
        color(contacts, navColor);

        main.innerHTML = '\n            <div id="feedback"></div>\n        ';

        audio.style.display = 'none';

        var contactDetails = document.createElement('p');
        var feedback = document.getElementById('feedback');

        contactDetails.setAttribute('id', 'contactDetails');
        feedback.appendChild(contactDetails);

        ajax({
            method: 'POST',
            url: 'get_contacts',
            param: 'contacts',
            json: { "contacts": true },
            elementId: 'contactDetails'
        });
    }

    /**
    * renderSettings
    */
    function renderSettings() {
        color(settings, navColor);

        main.innerHTML = '\n            <div id="settings_panel">\n            \t<div id="settings_panel-header">\n            \t\t<p>\u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</p>\n            \t</div>\n            \t<div id="settings_panel-body">\n            \t\t<ul class="bl">\n\t            \t\t<p>\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435</p>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<input type="checkbox" id="invert_y" />\n\t\t\t\t\t\t\t\u0418\u043D\u0432\u0435\u0440\u0441\u0438\u044F \u043E\u0441\u0438 Y\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u0427\u0443\u0432\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043C\u044B\u0448\u0438\n\t\t\t\t\t\t\t<br /><input type="range" id="mouse_sensitivity" min="1" max="17" step="2"/>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t            \t<ul class="bl">\n\t            \t\t<p>\u0413\u0440\u0430\u0444\u0438\u043A\u0430</p>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<input type="checkbox" id="antialias" />\n\t\t\t\t\t\t\t\u0410\u043D\u0442\u0438\u0430\u043B\u0438\u0430\u0441\u0438\u043D\u0433\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0442\u0435\u043A\u0441\u0442\u0443\u0440\n\t\t\t\t\t\t\t<br /><input type="range" id="textures" min="0" max="2" step="1"/>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0433\u0440\u0430\u0444\u0438\u043A\u0438\n\t\t\t\t\t\t\t<br /><input type="range" id="graphics" min="0" max="2" step="1"/>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n            \t</div>\n\t\t\t\t<div  id="settings_panel-footer">\n\t\t\t\t\t<input type="button" class="accept-changes" value="\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" />\n            \t</div>\n            </div>\n        ';

        audio.style.display = 'none';

        var elementInvertY = document.getElementById('invert_y');
        var elementMouseSensitivity = document.getElementById('mouse_sensitivity');
        var elementAntialias = document.getElementById('antialias');
        var elementTextures = document.getElementById('textures');
        var elementGraphics = document.getElementById('graphics');

        elementInvertY.checked = !!+getCookie('invert_y');
        elementMouseSensitivity.value = getCookie('mouse_sensitivity');
        elementAntialias.checked = !!+getCookie('antialias');
        elementTextures.value = getCookie('textures');
        elementGraphics.value = getCookie('graphics');

        document.getElementsByClassName('accept-changes')[0].addEventListener('click', function () {
            // Graphics
            if (elementAntialias.checked !== !!+getCookie('antialias') || elementTextures.value !== getCookie('textures') || elementGraphics.value !== getCookie('graphics')) {
                setCookie('invert_y', +elementInvertY.checked);
                setCookie('mouse_sensitivity', elementMouseSensitivity.value);
                setCookie('antialias', +elementAntialias.checked);
                setCookie('textures', elementTextures.value);
                setCookie('graphics', elementGraphics.value);

                reloader();
            }

            // Controls
            else if (elementInvertY.checked !== !!+getCookie('invert_y') || elementMouseSensitivity.value !== getCookie('mouse_sensitivity')) {
                    setCookie('invert_y', +elementInvertY.checked);
                    setCookie('mouse_sensitivity', elementMouseSensitivity.value);

                    messageBox('Настройки сохранены');
                } else if (document.getElementById('message_box') === null) {
                    messageBox('Нет изменений в настройках');
                }
        });
    }

    switch (getCookie('graphics')) {
        case '0':
            graphics = 2;break;
        case '1':
            graphics = 1;break;
        case '2':
            graphics = 1 / 2;break;
    }

    switch (getCookie('textures')) {
        case '0':
            textures = 'low';break;
        case '1':
            textures = 'medium';break;
        case '2':
            textures = 'high';break;
    }

    solarSystem(!!+antialias, textures, graphics);

    //document.getElementsByClassName('preloader')[0].remove();
};