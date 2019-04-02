exports.post = async function(ctx) {
    if (JSON.parse(ctx.request.body.contacts).contacts) {
        ctx.body = `
            <img src="/img/alexey.jpg"><br>
            Алексей Кронидович Яриков<br>
            tel: <a href="tel:+79991951596">+79991951596</a><br>
            skype: <a href="tel:yarik19823">yarik19823</a><br>
            telegramm: <a href="tg:@guitar19823">@guitar19823</a><br>
            email: <a href="mailto:orion_ins@mail.ru">orion_ins@mail.ru</a>
        `;
    }
};