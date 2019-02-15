import {App} from "./app";

export class Dashboard {
    constructor() {
    }

    static async showContent(page: number) {
        try {
            const $p=$("#story-content p");
            const $footer=$("#story-content footer");

            $p.hide();
            $footer.hide();

            const content = await $.ajax({url: 'pages/content.json'});
            const text = content[page].text;
            await $p.html(text).fadeIn(2000).promise();
            await new Promise(resolve => setTimeout(resolve, 2000));

            $footer.html('');
            $.each(content[page].buttons,function(key,button){
                $footer.append(`<button onclick="Project.Dashboard.showContent(${page + 1})" class="btn btn-block btn-primary">${button.text}</button>`);
            });
            await $footer.fadeIn(2000).promise();
        } catch (e) {
            App.toast({type: 'danger', message: 'Oops, algo salió mal.', duration: 1000});
        }
    }
}