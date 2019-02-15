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
            const text = content[page].text;
            await $p.html(text).fadeIn(timer).promise();
            await new Promise(resolve => setTimeout(resolve, timer));

            $footer.html('');
            $.each(content[page].buttons, function (key, button) {
                const $HTMLbutton = $(`<button class="btn btn-block btn-outline-primary">${button.text}</button>`).on('click', function () {
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
}