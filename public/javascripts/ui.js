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
        timeout,
        timeToHide = 10000;
    
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
        sounds = document.getElementById('sounds'),
        flight = document.getElementById('flight'),
        planets = document.getElementById('planets'),
        menuBtns = document.getElementsByClassName('menu_btns'),
        button_menu = document.getElementsByClassName('button_menu')[0],
        nav = document.getElementsByClassName('nav')[0],
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
    
    button_menu.addEventListener('click', function () {
        nav.classList.contains('to_top') ? closeNav() : openNav();
    });
    
    for (let i = 0, l = menuBtns.length; i < l; i++) {
        menuBtns[i].addEventListener('click', function () {
            system_sounds.src = `/sounds/2.mp3`;
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
        item.addEventListener('click', function () {
            setTitle(title);
            foo();
        })
    }
    
    setTitle('Объекты солнечной системы');
    getPlanets();
    
    call(planets, 'objects', 'Объекты солнечной системы', getPlanets);
    call(flight, 'flight', 'Полет по солнечной системе', getFlight);
    call(sounds, 'sounds', 'Выбор фоновой музыки', getSounds);
    call(chat, 'chat', 'Общение по чату', getChat);
    call(contacts, 'contacts', 'Контактные данные', getContacts);
    
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
        request.addEventListener('readystatechange', function() {
            4 == request.readyState
            && 200 == request.status
            && (document.getElementById(data.elementId).innerHTML = request.responseText);
        } );

        request.open(data.method, '/' + data.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(data.param + '=' + JSON.stringify(data.json));
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
    * getHome
    */
    function getHome() {
		color('home', navColor);
        main.innerHTML = '';
        audio.style.display = 'none';
	}
    
    /**
    * getPlanets
    */
    function getPlanets() {
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
    * getFlight
    */
    function getFlight() {
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
        ` : `
            <div id="control">
                <p>w-вперед</p>
                <p>s-назад</p>
                <p>a-налево</p>
                <p>d-направо</p>
                <p>mousemove</p>
                <p>mousewheel</p>
            </div>
        `;
        
        main.innerHTML = `
            ${descktopControls}
            <div id="speedControl"></div>
            <div id="arrow"></div>
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
    * getSounds
    */
    function getSounds() {
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
    * getChat
    */
    function getChat() {
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
        socket.addEventListener('message', msg => {
            if (messages) {
                msgs.push(`<span>${msg.msg}</span>`);
                
                msgs.reverse();
                messages.innerHTML = msgs.join('');
                msgs.reverse();
            }
        });
	}
    
    /**
    * getContacts
    */
    function getContacts() {
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

	solarSystem();
};