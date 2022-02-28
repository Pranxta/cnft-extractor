var updatedData = []
var localData = []

var getData = function () {

  rmvDwnldBtn();
  var data = []
  var xhr = new XMLHttpRequest();
  xhr.open("GET","https://api.opencnft.io/ranking?t=all");
  xhr.send();

  xhr.onerror = function() { // only triggers if the request couldn't be made at all
    alert(`Network Error`);
  };

  xhr.onload = function() {
    if (xhr.status != 200) { // analyze HTTP status of the response
      alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    } else { // show the result
      alert(`Done, got ${xhr.response.length} bytes`); // response is the server response
      var resp = JSON.parse(this.response);
      
      resp.forEach(element => {
        var x1 = element.volume_today ? element.volume_today.toFixed(0) : 0;
        var x2 = element.volume_today ? element.volume_week.toFixed(0) : 0;
        var item = {
          name: element.name,
          floor_price: element.floor_price,
          onedChange: element['1dChange'],
          sevendChange: element['7dChange'],
          volume_today: x1,
          volume_week: x2
        }
        data.push(item);
      }); 
      updatedData = data;



      var dt = new Date();
      var dataName = "";
      dataName = dt.toLocaleString('en-GB');
      
      dataName = dataName.split(' ').join('_');
      dataName = dataName.split('/').join('-');
      dataName = dataName.split(',').join('_');
      dataName = dataName.split(':').join('-');
	   
      window.postMessage(
        {
          type: "custom",
          name: dataName,
          message: data
        }
      );
      addDwnldBtn();
    }
  };

}

let btn = document.createElement("button");
btn.innerHTML = "UPDATE";
btn.id = "myBtn"
btn.style.backgroundColor = "magenta"; 
btn.style.width = "300px";
btn.style.marginLeft = "100px";
btn.style.padding = "10px 50px";
btn.style.borderRadius = "10px";
btn.style.fontWeight = "bold";
btn.addEventListener("click", getData);
let myDiv = document.getElementsByTagName("nav")[0]

myDiv.appendChild(btn);


var addDwnldBtn = function () {
  let dbtn = document.createElement("button");
  dbtn.innerHTML = "DOWNLOAD";
  dbtn.id = "dwnldBtn"
  dbtn.style.backgroundColor = "blue";
  dbtn.style.marginLeft = "10px";
  dbtn.style.width = "300px";
  dbtn.style.padding = "10px 50px";
  dbtn.style.borderRadius = "10px";
  dbtn.style.fontWeight = "bold";
  dbtn.addEventListener("click", downloadCSV);
  let dmyDiv = document.getElementsByTagName("nav")[0]

  dmyDiv.appendChild(dbtn);
}





var rmvDwnldBtn = function () {
  var a = document.getElementById("dwnldBtn");
  if( a === null) return;
  a.remove();

}

var downloadCSV = function () {
  if(updatedData.length == 0) alert("Empty Output");

  var x = new CSVExport(updatedData);
  var y = document.getElementById("dwnldBtn");
  y.remove();
  return false;
}
