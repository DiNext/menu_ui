class CookieManager{
    constructor() {

    }

    public setCookie(cName: string, cValue: string, expDays: number,){
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    }

    public getCookie(name: string){
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}

export default CookieManager;