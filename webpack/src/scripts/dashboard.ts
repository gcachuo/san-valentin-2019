import {App} from "./app";

export class Dashboard {
    private page: number;

    constructor(page: number) {
        this.page = page;
    }

    static nextPage(page: number, options?: { page: number, navigate: string }) {
        const navigate = options ? options.navigate : false;
        page = options ? options.page : ++page;
        if (!navigate) {
            const dashboard = new Dashboard(page);
            dashboard.showContent();
        } else {
            App.navigate(navigate);
        }
    }

    async showContent() {
        try {
            const timer = 1;
            const page = this.page;
            const $p = $("#story-content p");
            const $footer = $("#story-content footer");

            $p.hide();
            $footer.hide();

            const content = await $.ajax({url: 'pages/content.json'});
            const text = this.replaceWords(content[page].text);

            $p.html(text);

            await $p.fadeIn(timer).promise();
            await new Promise(resolve => setTimeout(resolve, timer));

            $footer.html('');
            $.each(content[page].buttons, (key, button) => {
                const text = this.replaceWords(button.text);

                const $HTMLbutton = $(`<button class="btn btn-block btn-outline-primary">${text}</button>`).on('click', function () {
                    Dashboard.nextPage(page, button.options);
                });
                $footer.append($HTMLbutton);
            });
            await $footer.fadeIn(timer).promise();

            this.page = page;
        } catch (e) {
            console.error(e);
        }
    }

    replaceWords(text: string) {
        $.each(localStorage, function (key, value) {
            const regex = `##(${key})##`;
            text = text.replace(new RegExp(regex, "g"), value);
        });
        return text;
    }
}