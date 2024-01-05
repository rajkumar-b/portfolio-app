function getJSONdoc(uri: string): Promise<JSON>{
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', uri, true);
    xhr.onload = function () {
      if (this.readyState == 4 && this.status == 200) {
        const json_response = JSON.parse(xhr.responseText);
        resolve(json_response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

export { getJSONdoc };
