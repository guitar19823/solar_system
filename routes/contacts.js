exports.post = async function (ctx) {
    if (JSON.parse(ctx.request.body.contacts).contacts) {
        ctx.body = `
            <img src="/img/boroda.jpg"><br>
            Алексей Кронидович Яриков<br>
            телефон: <a href="tel:+79991951596">+79991951596</a><br>
            телеграм: <a href="tg:@CETHEP">@CETHEP</a><br>
            skype: <a href="tel:yarik19823">yarik19823</a><br>
            email: <a href="mailto:orion_ins@mail.ru">orion_ins@mail.ru</a>
        `;
    }
};