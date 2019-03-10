/* ************************************************ */
/* **************** USER INTERFACE **************** */
/* ************************************************ */

window.onload = () => {
    const socket = io();
    
    let msgs = ['<span>Hello User!</span>'];
    
    window.onunload = () => {
        socket.disconnect();
    }
    
    let container = document.getElementsByClassName('container')[0],
        year = new Date().getFullYear(),
        timeout;
    
    year = year === 2018 ? year : '2018 - ' + year;
    
    /**
    * mobileDevice
    */
    function mobileDevice() {
        return navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
    }
    
    container.innerHTML = `
        <header class="header">
            <div class="button_menu">
                <div></div>
                <div></div>
            </div>
        </header>
        <nav class="nav">
            <p>Меню</p>
            <ul>
                <li class="menu_btns" id="planets">объекты</li>
                <li class="menu_btns" id="flight">полет</li>
                <li class="menu_btns" id="sounds">музыка</li>
                <li class="menu_btns" id="chat">чат</li>
                <li class="menu_btns" id="contacts">контакты</li>
                <li class="menu_btns" id="settings">настройки</li>
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
    
    let track = document.getElementById('track'),
        system_sounds = document.getElementById('system_sounds'),
        title = document.getElementById('title'),
        audio = document.getElementById('audio'),
        blackPanel = document.createElement('div'),
        main = document.getElementById('main'),
        chat = document.getElementById('chat'),
        contacts = document.getElementById('contacts'),
        settings = document.getElementById('settings'),
        sounds = document.getElementById('sounds'),
        flight = document.getElementById('flight'),
        planets = document.getElementById('planets'),
        menuBtns = document.getElementsByClassName('menu_btns'),
        button_menu = document.getElementsByClassName('button_menu')[0],
        nav = document.getElementsByClassName('nav')[0],
		invert_y = getCookie('invert_y'),
		mouse_sensitivity = getCookie('mouse_sensitivity'),
	    antialias = getCookie('antialias'),
		textures = getCookie('textures'),
		graphics = getCookie('graphics'),
        textColor = [],
        navColor = [],
        arrObj = [
            ['sun', 'солнце'],
            ['mercury', 'меркурий'],
            ['venus', 'венера'],
            ['earth', 'земля'],
            ['moon', 'луна'],
            ['mars', 'марс'],
            ['jupiter', 'юпитер'],
            ['saturn', 'сатурн'],
            ['uranus', 'уран'],
            ['neptune', 'нептун'],
            ['pluto', 'плутон'],
            ['charon', 'харон'],
            ['universe', 'космос']
        ];
    
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
    
    for (let i = 0, l = menuBtns.length; i < l; i++) {
        menuBtns[i].addEventListener('click', () => {
            system_sounds.src = `/sounds/2.mp3`;
            system_sounds.play();
        
            closeNav();
        });
        menuBtns[i].addEventListener('mouseover', () => {
            system_sounds.play();
        });
        
    }
    
    /**
    * openNav
    */
    function openNav() {
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
	function setCookie(name, value, options = { expires: 604800, path: '/' }) {
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

	/**
	* getCookie
	* @name
	*/
	function getCookie(name) {
		const matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));

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
        let request = xhr();
        request.addEventListener('readystatechange', () => {
            4 == request.readyState
            && 200 == request.status
            && (document.getElementById(data.elementId).innerHTML = request.responseText);
        } );

        request.open(data.method, '/' + data.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(data.param + '=' + JSON.stringify(data.json));
    }

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
		p1.appendChild(document.createTextNode('Настройки сохранены'));
		p2.appendChild(document.createTextNode('Программа перезагрузится через '));
		p2.appendChild(span);
		p2.appendChild(document.createTextNode(' сек.'));
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
    * deleteChilds
    */ 
	function deleteChilds(parent) {
        parent.lastChild != void(0) && (parent.innerHTML = '', deleteChilds(parent));
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
    function setTitle(titleText){
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
            i == l - 1 && (objs += `</div><div id="description"><p></p></div>`);
        }
        
        main.innerHTML = objs;
        
        audio.style.display = 'none';
        let planetList = document.getElementsByClassName('planet'),
            description = document.getElementById('description');
        
        for (let i = 0, l = planetList.length; i < l; i++ ) {
            textColor.push(planetList[i]);
            
            planetList[i].addEventListener('click', function () {
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
        
        let descktopControls = '',
            moover = '';
        
        descktopControls = mobileDevice() ? `
            <div id="gamePad">
                <div id="moover">
                    <p id="forward"></p>
                    <p id="backward"></p>
                    <p id="left"></p>
                    <p id="right"></p>
                </div>
                <div id="areaTouchMove"></div>
                <input type="range" min="0" max="299792" value="1700" id="range">
            </div>
            <div id="speedControl"></div>
            <div id="arrow"></div>
        ` : `
            <div id="control">
                <div>
					<p>w</p>
	                <p>s</p>
	                <p>a</p>
	                <p>d</p>
            	</div>
                <div>
                	<div></div>
	                <div id="mouse">
	                	<div><div></div></div>
	                	<div></div>
	                	<div></div>
	                </div>
	                <div></div>
                </div>
            </div>
            <div id="speedControl"></div>
            <div id="scroll">
            	<div id="mouse">
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
        let spaceTrack = document.getElementsByClassName('spaceTrack');
        
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
                <button id="button">отправить</button>
            </div>
        `;
        
        audio.style.display = 'none';
        let messages = document.getElementById('messages'),
            text = document.getElementById('text'),
            button = document.getElementById('button');
        
        msgs.reverse();
        messages.innerHTML = msgs.join('');
        msgs.reverse();
        
        button.addEventListener('click', () => {
            if (text.value) {
                socket.emit('message', {
                    msg: text.value
                });
                
                text.value = '';
            }
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
        
		let contactDetails = document.createElement('p'),
            feedback = document.getElementById('feedback');
        
		contactDetails.setAttribute('id', 'contactDetails');
		feedback.appendChild(contactDetails);
        
        ajax({
            method: 'POST',
            url: 'get_contacts',
            param: 'contacts',
            json: {"contacts": true},
            elementId: 'contactDetails' 
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
            		<p>настройки</p>
            	</div>
            	<div id="settings_panel-body">
            		<ul class="bl">
	            		<p>Управление</p>
						<li>
							<input type="checkbox" id="invert_y" />
							Инверсия оси Y
						</li>
						<li>
							Чувствительность мыши
							<br /><input type="range" id="mouse_sensitivity" min="1" max="17" step="2"/>
						</li>
					</ul>
	            	<ul class="bl">
	            		<p>Графика</p>
						<li>
							<input type="checkbox" id="antialias" />
							Антиалиасинг
						</li>
						<li>
							Качество текстур
							<br /><input type="range" id="textures" min="0" max="2" step="1"/>
						</li>
						<li>
							Качество графики
							<br /><input type="range" id="graphics" min="0" max="2" step="1"/>
						</li>
					</ul>
            	</div>
				<div  id="settings_panel-footer">
					<input type="button" class="accept-changes" value="Сохранить" />
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

        		messageBox('Настройки сохранены');
        	}

        	else if (document.getElementById('message_box') === null) {
        		messageBox('Нет изменений в настройках');
        	}
        });
	}

	switch (getCookie('graphics')) {
		case '0': graphics = 2; break;
		case '1': graphics = 1; break;
		case '2': graphics = 1 / 2; break;
	}

	switch (getCookie('textures')) {
		case '0': textures = 'low'; break;
		case '1': textures = 'medium'; break;
		case '2': textures = 'high'; break;
	}

	solarSystem(!!(+antialias), textures, graphics);

	//document.getElementsByClassName('preloader')[0].remove();
};