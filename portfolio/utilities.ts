import * as THREE from 'three';

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

function jsonToGraph(data: JSON){
  console.log(data);
  const nodes = new Map<string, string>();
  const edges = new Map<string, string>();
  // Add a dummy return for trial
  return {
    "nodes": [
        {
          "id": "id1",
          "name": "name1",
          "val": 1
        },
        {
          "id": "id2",
          "name": "name2",
          "val": 10
        },
    ],
    "links": [
        {
            "source": "id1",
            "target": "id2"
        },
    ]
  }

}

export { getJSONdoc, jsonToGraph };
