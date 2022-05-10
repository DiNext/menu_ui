class CookieManager{
    constructor() {

    }

    public setCookie(name: string, data: string){
        document.cookie = `${name} = ${data}`;
    }

    public getCookie(name: string){
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}

export default CookieManager;