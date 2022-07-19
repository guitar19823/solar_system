import solarSystem from './solar-system.js';
const isMobileDevice = require('./utils/isMobileDevice');
const Cookie = require('./utils/Cookie');
const makeRequest = require('./utils/makeRequest');

/* ************************************************ */
/* **************** USER INTERFACE **************** */
/* ************************************************ */

window.onload = () => {
  const socket = io();

  let msgs = ['<span>Hello User!</span>'];

  window.onunload = () => {
    socket.disconnect();
  }

  const container = document.getElementsByClassName('container')[0];

  let year = new Date().getFullYear(),
    menuIsOpened = false,
    timeToHide = 30000,
    timeout;

  year = year === 2018 ? year : '2018 - ' + year;

  const rus = {
    menu: 'Меню',
    navigation: {
      objects: 'объекты',
      fly: 'полет',
      music: 'музыка',
      chat: 'чат',
      contacts: 'контакты',
      settings: 'настройки'
    },
    objectNames: [
      'солнце',
      'меркурий',
      'венера',
      'земля',
      'луна',
      'марс',
      'юпитер',
      'сатурн',
      'уран',
      'нептун',
      'плутон',
      'харон',
      'космос'
    ],
    titles: {
      objects: 'Объекты солнечной системы',
      fly: 'Полет по солнечной системе',
      music: 'Выбор фоновой музыки',
      chat: 'Общение по чату',
      contacts: 'Контактные данные',
      settings: 'Настройки'
    },
    systemTexts: [
      'Настройки сохранены',
      'Программа перезагрузится через ',
      ' сек.',
      'Нет изменений в настройках'
    ],
    buttons: {
      send: 'Отправить',
      save: 'Сохранить'
    },
    settings: {
      title: 'настройки',
      controlSettings: 'Управление',
      axisInversion: 'Инверсия оси Y',
      mouseSensitivity: 'Чувствительность мыши',
      graphicSettings: 'Графика',
      antialias: 'Сглаживание',
      textures: 'Качество текстур',
      graphics: 'Качество графики',
      language: 'Язык'
    }
  };

  const en = {
    menu: 'Menu',
    navigation: {
      objects: 'objects',
      fly: 'fly',
      music: 'music',
      chat: 'chat',
      contacts: 'contacts',
      settings: 'settings'
    },
    objectNames: [
      'sun',
      'mercury',
      'venus',
      'earth',
      'moon',
      'mars',
      'jupiter',
      'saturn',
      'uranus',
      'neptune',
      'pluto',
      'charon',
      'universe'
    ],
    titles: {
      objects: 'Objects of the solar system',
      fly: 'Flight through the solar system',
      music: 'Select background music',
      chat: 'Chat',
      contacts: 'Contact details',
      settings: 'Settings'
    },
    systemTexts: [
      'Settings have been saved',
      'The program will reboot through ',
      ' sec.',
      'No change in settings'
    ],
    buttons: {
      send: 'Send',
      save: 'Save'
    },
    settings: {
      title: 'settings',
      controlSettings: 'Controls',
      axisInversion: 'Y axis inversion',
      mouseSensitivity: 'Mouse sensitivity',
      graphicSettings: 'Graphics',
      antialias: 'Anti alias',
      textures: 'Texture quality',
      graphics: 'Graphics quality',
      language: 'Language'
    }
  };

  const lang = rus;

  container.innerHTML = `
        <header class="header">
            <div class="button_menu">
                <div></div>
                <div></div>
            </div>
        </header>
        <nav class="nav">
            <p>${lang.menu}</p>
            <ul>
                <li class="menu_btns" id="planets"><img src="img/objects.png" alt="img"/>${lang.navigation.objects}</li>
                <li class="menu_btns" id="flight"><img src="img/fly.png" alt="img"/>${lang.navigation.fly}</li>
                <li class="menu_btns" id="sounds"><img src="img/music.png" alt="img"/>${lang.navigation.music}</li>
                <li class="menu_btns" id="chat"><img src="img/chat.png" alt="img"/>${lang.navigation.chat}</li>
                <li class="menu_btns" id="contacts"><img src="img/contacts.png" alt="img"/>${lang.navigation.contacts}</li>
                <li class="menu_btns" id="settings"><img src="img/settings.png" alt="img"/>${lang.navigation.settings}</li>
            </ul>
        </nav>
        <main id="main"></main>
        <div id="audio">
            <audio src="/sounds/space${parseInt(Math.random() * 27 + 1)}.mp3" controls id="track">Your browser does not support the audio element.</audio>
        </div>
        <audio id="system_sounds">Your browser does not support the audio element.</audio>
        <footer class="footer">
            <p>&copy; Copyright ${year}.</p>
        </footer>
    `;

  const track = document.getElementById('track');
  const system_sounds = document.getElementById('system_sounds');
  const title = document.getElementById('title');
  const audio = document.getElementById('audio');
  const blackPanel = document.createElement('div');
  const main = document.getElementById('main');
  const chat = document.getElementById('chat');
  const contacts = document.getElementById('contacts');
  const settings = document.getElementById('settings');
  const sounds = document.getElementById('sounds');
  const flight = document.getElementById('flight');
  const planets = document.getElementById('planets');
  const menuBtns = document.getElementsByClassName('menu_btns');
  const button_menu = document.getElementsByClassName('button_menu')[0];
  const nav = document.getElementsByClassName('nav')[0];
  const arrObj = [
    ['sun', lang.objectNames[0]],
    ['mercury', lang.objectNames[1]],
    ['venus', lang.objectNames[2]],
    ['earth', lang.objectNames[3]],
    ['moon', lang.objectNames[4]],
    ['mars', lang.objectNames[5]],
    ['jupiter', lang.objectNames[6]],
    ['saturn', lang.objectNames[7]],
    ['uranus', lang.objectNames[8]],
    ['neptune', lang.objectNames[9]],
    ['pluto', lang.objectNames[10]],
    ['charon', lang.objectNames[11]],
    // ['universe', lang.objectNames[12]]
  ];

  const { setCookie, getCookie } = new Cookie();

  let invert_y = getCookie('invert_y'),
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
    if (isMobileDevice()) {
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
    if (isMobileDevice()) {
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

  function hide() {
    container.classList.add('opacity');

    isMobileDevice() || (document.body.style.cursor = 'none');
  }

  function show() {
    clearTimeout(timeout);
    isMobileDevice() || (document.body.style.cursor = 'auto');

    container.classList.remove('opacity');

    timeout = setTimeout(hide, timeToHide);
  }

  timeout = setTimeout(hide, timeToHide);

  ['click', 'mousemove', 'touchmove'].map(function (event) {
    document.addEventListener(event, show);
  });

  button_menu.addEventListener('click', function () {
    menuIsOpened ? closeNav() : openNav();
  });

  if (!isMobileDevice()) {
    window.addEventListener('keydown', function (event) {
      if (event.repeat === false) {
        switch (event.code) {
          case 'Escape': {
            show();

            menuIsOpened ? closeNav() : openNav();
          };
        }
      }
    });
  }

  for (let i = 0, l = menuBtns.length; i < l; i++) {
    menuBtns[i].addEventListener('click', () => {
      system_sounds.src = `/sounds/2.mp3`;
      system_sounds.play();

      closeNav();
    });

    menuBtns[i].addEventListener('mouseenter', () => {
      system_sounds.pause();
      system_sounds.currentTime = 0;
      system_sounds.play();
    });
  }

  /**
  * openNav
  */
  function openNav() {
    menuIsOpened = true;
    system_sounds.src = `/sounds/1.mp3`;

    nav.classList.add('to_top'),
      button_menu.classList.add('rotate_button'),
      button_menu.children[0].classList.add('turn_right'),
      button_menu.children[1].classList.add('turn_left'),
      container.appendChild(blackPanel)
  }

  /**
  * closeNav
  */
  function closeNav() {
    nav.classList.remove('to_top'),
      button_menu.classList.remove('rotate_button'),
      button_menu.children[0].classList.remove('turn_right'),
      button_menu.children[1].classList.remove('turn_left'),
      setTimeout(function () {
        blackPanel.remove();
        menuIsOpened = false;
      }, 500)
  }

  /**
  * call
  */
  function call(item, uri, title, foo) {
    navColor.push(item);
    item.addEventListener('click', () => {
      setTitle(title);
      foo();
    })
  }

  setTitle(lang.titles.objects);
  renderPlanets();

  call(planets, 'objects', lang.titles.objects, renderPlanets);
  call(flight, 'flight', lang.titles.fly, renderFlight);
  call(sounds, 'sounds', lang.titles.music, renderSounds);
  call(chat, 'chat', lang.titles.chat, renderChat);
  call(contacts, 'contacts', lang.titles.contacts, renderContacts);
  call(settings, 'settings', lang.titles.settings, renderSettings);

  /**
  * reloader
  * @time
  */
  function reloader(time = 3) {
    const reloadMsg = document.createElement('div');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const span = document.createElement('span');

    reloadMsg.id = 'message_box';
    span.id = 'time';

    span.appendChild(document.createTextNode(time));
    p1.appendChild(document.createTextNode(lang.systemTexts[0]));
    p2.appendChild(document.createTextNode(lang.systemTexts[1]));
    p2.appendChild(span);
    p2.appendChild(document.createTextNode(lang.systemTexts[2]));
    reloadMsg.appendChild(p1);
    reloadMsg.appendChild(p2);
    main.appendChild(reloadMsg);

    let sI = setInterval(() => {
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
  function messageBox(message, delay = 1500) {
    const reloadMsg = document.createElement('div');
    const p = document.createElement('p');

    reloadMsg.id = 'message_box';

    p.appendChild(document.createTextNode(message));
    reloadMsg.appendChild(p);
    main.appendChild(reloadMsg);

    setTimeout(() => {
      reloadMsg.remove();
    }, delay);
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

    let objs;

    for (let i = 0, l = arrObj.length; i < l; i++) {
      i == 0 && (objs = `<div id="list">`);
      objs += `<p id="${arrObj[i][0]}" class="planet">${arrObj[i][1]}</p>`;
      i == l - 1 && (objs += `</div><div id="description"></div>`);
    }

    main.innerHTML = objs;

    audio.style.display = 'none';
    const planetList = document.getElementsByClassName('planet');
    const description = document.getElementById('description');

    for (let i = 0, l = planetList.length; i < l; i++) {
      textColor.push(planetList[i]);

      planetList[i].addEventListener('click', function () {
        color(this, textColor);
        makeRequest({
          method: 'POST',
          url: 'get_descriptions',
          param: 'object',
          json: { "object": this.getAttribute('id') },
          func: ({ responseText }) => {
            description.innerHTML = `<div class="description_close"></div>${responseText}`;

            document.getElementsByClassName('description_close')[0].addEventListener('click', () => {
              description.innerHTML = '';
            });
          }
        });

        description.style.display = 'block';
      });
    }
  }

  /**
  * renderFlight
  */
  function renderFlight() {
    color(flight, navColor);

    let descktopControls = '',
      moover = '';

    descktopControls = isMobileDevice() ? `
            <div id="gamePad">
                <div id="moover">
                    <p id="forward"></p>
                    <p id="backward"></p>
                    <p id="left"></p>
                    <p id="right"></p>
                </div>
                <div id="areaTouchMove"></div>
                <input type="range" min="0" max="299792" value="15000" id="range">
            </div>
            <div id="speedControl"></div>
            <div id="arrow"></div>
        ` : `
            <div id="control">
                <div>
                    <p>w</p>
                    <p>a</p>
                    <p>s</p>
                    <p>d</p>
                </div>
                <div>
                    <div></div>
                    <div class="mouse">
                        <div><div></div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div></div>
                </div>
            </div>
            <div id="speedControl"></div>
            <div id="scroll">
                <div class="mouse">
                    <div></div>
                    <div></div>
                    <div><div></div></div>
                </div>
            </div>
        `;

    main.innerHTML = `
            ${descktopControls}
            ${moover}
        `;

    audio.style.display = 'none';
  }

  /**
  * getSelect
  */
  function getSelect() {
    let options = '',
      length = arrObj.length - 1;

    arrObj.map(function (object, i) {
      i < length && (options += `<option value="${object[0]}">${object[1]}</option>`);
    });

    return `<select>${options}</select>`;
  }

  /**
  * renderSounds
  */
  function renderSounds() {
    color(sounds, navColor);
    0 != textColor.length && textColor.splice(0, textColor.length);

    let sTrs;

    for (let i = 1; i <= 28; i++) {
      i == 1 && (sTrs = `<div id="tracks">`);
      sTrs += `<p class="spaceTrack">space${i}</p>`;
      i == 28 && (sTrs += `</div>`);
    }

    main.innerHTML = sTrs;

    audio.style.display = 'block';
    const spaceTrack = document.getElementsByClassName('spaceTrack');

    for (let i = 0, l = spaceTrack.length; i < l; i++) {
      textColor.push(spaceTrack[i]);
      spaceTrack[i].addEventListener('click', function () {
        color(this, textColor);
        track.src = `/sounds/${this.innerHTML}.mp3`;
        track.play();
      });
    }
  }

  /**
  * renderChat
  */
  function renderChat() {
    color(chat, navColor);

    main.innerHTML = `
            <div id="chat_window">
                <p id="messages"></p>
                <input type="text" id="text" autocomplete="off">
                <button id="button">${lang.buttons.send}</button>
            </div>
        `;

    audio.style.display = 'none';
    const messages = document.getElementById('messages');
    const text = document.getElementById('text');
    const button = document.getElementById('button');

    const sendMessage = () => {
      if (text.value) {
        socket.emit('message', {
          msg: text.value
        });

        text.value = '';
      }
    };

    msgs.reverse();
    messages.innerHTML = msgs.join('');
    msgs.reverse();

    button.addEventListener('click', sendMessage);

    window.addEventListener('keydown', (e) => {
      e.code === 'Enter' && sendMessage();
    });

    socket.removeEventListener('message');
    socket.addEventListener('message', (msg) => {
      if (messages) {
        msgs.push(`<span>${msg.msg}</span>`);

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

    main.innerHTML = `
            <div id="feedback"></div>
        `;

    audio.style.display = 'none';

    const contactDetails = document.createElement('p');
    const feedback = document.getElementById('feedback');

    contactDetails.setAttribute('id', 'contactDetails');
    feedback.appendChild(contactDetails);

    makeRequest({
      method: 'POST',
      url: 'get_contacts',
      param: 'contacts',
      json: { "contacts": true },
      func: ({ responseText }) => contactDetails.innerHTML = responseText
    });
  }

  /**
  * renderSettings
  */
  function renderSettings() {
    color(settings, navColor);

    main.innerHTML = `
            <div id="settings_panel">
                <div id="settings_panel-header">
                    <p>${lang.settings.title}</p>
                </div>
                <div id="settings_panel-body">
                    <ul class="bl">
                        <p>${lang.settings.controlSettings}</p>
                        <li>
                            <input type="checkbox" id="invert_y" />
                            ${lang.settings.axisInversion}
                        </li>
                        <li>
                            ${lang.settings.mouseSensitivity}
                            <br /><input type="range" id="mouse_sensitivity" min="1" max="17" step="2"/>
                        </li>
                    </ul>
                    <ul class="bl">
                        <p>${lang.settings.graphicSettings}</p>
                        <li>
                            <input type="checkbox" id="antialias" />
                            ${lang.settings.antialias}
                        </li>
                        <li>
                            ${lang.settings.textures}
                            <br /><input type="range" id="textures" min="0" max="2" step="1"/>
                        </li>
                        <li>
                            ${lang.settings.graphics}
                            <br /><input type="range" id="graphics" min="0" max="2" step="1"/>
                        </li>
                    </ul>
                </div>
                <div  id="settings_panel-footer">
                    <input type="button" class="accept-changes" value="${lang.buttons.save}" />
                </div>
            </div>
        `;

    audio.style.display = 'none';

    const elementInvertY = document.getElementById('invert_y');
    const elementMouseSensitivity = document.getElementById('mouse_sensitivity');
    const elementAntialias = document.getElementById('antialias');
    const elementTextures = document.getElementById('textures');
    const elementGraphics = document.getElementById('graphics');

    elementInvertY.checked = !!(+getCookie('invert_y'));
    elementMouseSensitivity.value = getCookie('mouse_sensitivity');
    elementAntialias.checked = !!(+getCookie('antialias'));
    elementTextures.value = getCookie('textures');
    elementGraphics.value = getCookie('graphics');

    document.getElementsByClassName('accept-changes')[0].addEventListener('click', () => {
      // Graphics
      if (
        elementAntialias.checked !== !!(+getCookie('antialias'))
        || elementTextures.value !== getCookie('textures')
        || elementGraphics.value !== getCookie('graphics')
      ) {
        setCookie('invert_y', +elementInvertY.checked);
        setCookie('mouse_sensitivity', elementMouseSensitivity.value);
        setCookie('antialias', +elementAntialias.checked);
        setCookie('textures', elementTextures.value);
        setCookie('graphics', elementGraphics.value);

        reloader();
      }

      // Controls
      else if (elementInvertY.checked !== !!(+getCookie('invert_y')) || elementMouseSensitivity.value !== getCookie('mouse_sensitivity')) {
        setCookie('invert_y', +elementInvertY.checked);
        setCookie('mouse_sensitivity', elementMouseSensitivity.value);

        messageBox(lang.systemTexts[0]);
      }

      else if (document.getElementById('message_box') === null) {
        messageBox(lang.systemTexts[3]);
      }
    });
  }

  solarSystem(getCookie);

  //document.getElementsByClassName('preloader')[0].remove();
};