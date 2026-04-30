(function () {
  const SESSION_KEY = "sitta_user";

  // selector helper
  window.$ = (sel) => document.querySelector(sel);
  window.$$ = (sel) => document.querySelectorAll(sel);

  window.setSession = function (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  };

  window.getSession = function () {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
      return null;
    }
  };

  window.clearSession = function () {
    localStorage.removeItem(SESSION_KEY);
  };

  window.logout = function () {
    clearSession();
    window.location.href = "index.html";
  };

  window.requireLogin = function () {
    const user = getSession();
    if (!user) {
      window.location.href = "index.html";
      return null;
    }
    return user;
  };
})();
``
