import * as $ from 'jquery';
import * as Mustache from 'mustache';
import * as toastr from 'toastr';

export class App {
    private readonly host: string;
    private readonly api: string;
    private url: string;

    constructor() {
        this.host = '';
        this.api = '';
        this.url = (localStorage.getItem('host') || this.host) + this.api;
        this.load();
    }

    load() {
        $("form").on('submit', event => {
            const $this = $(event.currentTarget);
            event.preventDefault();
            App.request($this.data('action'), $this.serializeArray(), 'POST').done(data => {
                if (typeof data.response === 'string') {
                    alert(data.response);
                }
                App.navigate($this.data('redirect'), data);
            });
        });
    }

    static navigate(file: string, data = {}) {
        return $.get('pages/' + file + ".html", function (template) {
            const rendered = Mustache.render(template, data);
            $(".app").html(rendered);
            App.setCookie('page', file, 1);
            new App();
            $("body").removeClass().addClass(file);
        }, 'html');
    }

    static request(uri: string, data: object, method: string) {
        if (!uri) return;
        const app = new App();
        return $.ajax(app.url + uri, {
            method: method || 'GET',
            dataType: 'json',
            data: data,
            error: response => {
                let message;
                if (response.responseJSON) {
                    const result = response.responseJSON;
                    switch (result.code) {
                        case 500:
                            console.error(result.error.message);
                            break;
                        case 400:
                            alert(result.error.message);
                            return;
                        default:
                            console.error(result);
                            break;
                    }
                } else if (response.responseText) {
                    console.error(`${app.url} ${response.responseText}`);
                }
                if (response.statusText === "error") {
                    console.log(response);
                    message = "Can't reach server.";

                } else {
                    message = 'An error ocurred.';
                }
                App.toast({message: message, type: 'error', duration: 2000});
            }
        });
    }

    static setCookie(name: string, value: string, days: number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    static getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static toast(options: { type: string, message: string, title?: string, duration: number }) {
        if (!options.type) options.type = "info";
        toastr[options.type](options.message, options.title, {timeOut: options.duration})
    }
}