import Cookies from "js-cookie";
export class CustomCookie {
  static set(name, value, options) {
    if (Cookies.get("CookieAccepted") === "true") {
      Cookies.set(name, value, options);
    }
  }

  static get(name) {
    return Cookies.get(name);
  }
}
