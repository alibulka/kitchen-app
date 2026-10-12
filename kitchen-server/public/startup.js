(function () {
  function showStartupError(message) {
    const status = document.getElementById('app-boot-status');
    if (!status) return;
    status.setAttribute('role', 'alert');
    status.textContent = message + ' Нажмите «Повторить загрузку».';
    const retry = document.getElementById('app-boot-retry');
    if (retry) retry.hidden = false;
  }
  window.addEventListener('error', function (event) {
    if (event.error) showStartupError('Не удалось запустить приложение: ' + event.error.message);
  });
  window.addEventListener('unhandledrejection', function (event) {
    showStartupError('Не удалось запустить приложение: ' +
      (event.reason && event.reason.message || 'ошибка загрузки'));
  });
  window.setTimeout(function () {
    showStartupError('Загрузка приложения занимает больше времени, чем обычно.');
  }, 20000);
  const retry = document.getElementById('app-boot-retry');
  if (retry) retry.addEventListener('click', function () { window.location.reload(); });

  let excelPromise = null;
  window.ensureExcelLibrary = function () {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (excelPromise) return excelPromise;
    excelPromise = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      let settled = false;
      function fail() {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        script.remove();
        excelPromise = null;
        reject(new Error('Не удалось загрузить Excel. Проверьте соединение и повторите действие.'));
      }
      const timer = window.setTimeout(fail, 15000);
      script.src = '/assets/xlsx-0.18.5.min.js';
      script.onload = function () {
        if (settled) return;
        if (!window.XLSX) return fail();
        settled = true;
        window.clearTimeout(timer);
        resolve(window.XLSX);
      };
      script.onerror = fail;
      document.head.appendChild(script);
    });
    return excelPromise;
  };
})();
