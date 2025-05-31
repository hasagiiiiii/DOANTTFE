export default function getCookie(name: string): any | null {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ').find(cookie => cookie.startsWith(`${name}=`));
    return cookies ? cookies.split('=')[1] : null;
}
export function clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

}