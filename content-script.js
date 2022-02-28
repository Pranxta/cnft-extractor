/* content script js*/

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
	var script = document.createElement('script');
	script.setAttribute('type','text/javascript');
	script.setAttribute('src', file_path);
	node.appendChild(script);
}



injectScript(chrome.extension.getURL('CSVExport.js'),'body');

injectScript(chrome.extension.getURL('inject-script.js'),'body');


window.addEventListener("message", function(event) {
	if (event.data.type == "custom")
	{	
		chrome.storage.local.get(['fileList'], function (result){
			
			if(result.fileList === undefined)
			{
				addFirstFileName(event.data.name);
				saveData(event.data.name, event.data.message);
			}
			else
			{
				addSubsequentFileName(event.data.name, result.fileList)
				saveData(event.data.name, event.data.message);
			}
		});
		
		  
	}
		

}, false);



function saveData(filename, data) {
	var fileOutput = {};
	var fileContent = data;
	fileOutput[filename] = fileContent;
	chrome.storage.local.set(fileOutput);
}



function addFirstFileName (filename) {
	var namesArray ="";
	namesArray += filename;

	var dataOutput = {};
	dataOutput['fileList'] = namesArray;
	chrome.storage.local.set(dataOutput);
}


function addSubsequentFileName (filename, oldString) {

	var namesArray = oldString;
	namesArray += "," + filename;

	var dataOutput = {};
	dataOutput['fileList'] = namesArray;
	chrome.storage.local.set(dataOutput);

}
