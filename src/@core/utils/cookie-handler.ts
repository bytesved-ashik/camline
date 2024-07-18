const domains = ["24hrtherapy.co.uk", ".24hrtherapy.co.uk"];

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  domains.forEach((domain) => {
    document.cookie = name + "=" + (value || "") + expires + "; domain=" + domain + "; path=/";
  });
}

export function eraseCookie(name: string) {
  domains.forEach((domain) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; domain=${domain};`;
  });
}
