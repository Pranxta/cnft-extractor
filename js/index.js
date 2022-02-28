var savedFiles = [];
var referenceData = [];
var outputData = [];
var morphedData = [];
var filesListText ='';


var alpha = false;
var delta = false;
var deltaP = false;
var dlte = false;
var slideB = false;
var filterB = false;


function Clock () {
	var dt= new Date();
	document.getElementById("timer").innerHTML = dt.toLocaleTimeString();
	document.getElementById("date").innerHTML = dt.toDateString();
	window.setTimeout("Clock()", 1000)
}


function showOriginal() {
	alpha = true;
	delta = true;
 	deltaP = true;
 	dlte = 0;	

	if(outputData.length == 0) {
		alert(`Nothing to sort!`);
		return;
	}

	
	morphedData = outputData;
	

	createTable(morphedData);
}


async function sortAlpha () {
	if(outputData.length == 0) {
		alert(`Nothing to sort!`);
		return;
	}

	if (alpha) {
		var abData = _.sortBy(morphedData, 'name');
		createTable(abData);
		morphedData = abData;
	}
	else {
		var baData = await reverseData(_.sortBy(morphedData, 'name'));
		createTable(baData);
		morphedData = baData;
	}
	console.log(abData);
	alpha = !alpha;
}


async function sortDelta () {
	if(outputData.length == 0) {
		alert(`Nothing to sort!`);
		return;
	}
	
	if (delta) {
		var abData = _.sortBy(morphedData, 'delta_floor_price');
		createTable(abData);
		morphedData = abData;
	} else {
		var baData = await reverseData(  _.sortBy(morphedData, 'delta_floor_price') );
		createTable(baData);
		morphedData = baData;
	}
	delta = !delta;
}

async function sortDeltaP () {
	if(outputData.length == 0) {
		alert(`Nothing to sort!`);
		return;
	}

	if (deltaP) {
		var abData = await  _.sortBy(morphedData, 'percentage_change');
		createTable(abData);
	} else {
		var baData = await reverseData(_.sortBy(morphedData, 'percentage_change'));
		createTable(baData);
	}
	deltaP = !deltaP;
}


async function filterData1D() {
	if(outputData.length == 0) {
		alert(`Nothing to sort!`);
		return;
	}

	
	var min1Dval = document.getElementById("min-1d-vol").value;
	var max1Dval = document.getElementById("max-1d-vol").value;

	if(min1Dval == "" || min1Dval == " ") min1Dval = "0";
	if(max1Dval == "" || max1Dval == " ") max1Dval = "-";
	
	if(min1Dval == "-" && max1Dval == "-") {
		return;
	}else {
		if (min1Dval == "-") {
			max1Dval = parseInt(max1Dval);
			morphedData = await filterMaxOneDay(max1Dval);
		}
		else if ( max1Dval == "-") {
			min1Dval = parseInt(min1Dval);
			morphedData = await filterMinOneDay(min1Dval);
		}
		else { 
			min1Dval = parseInt(min1Dval);
			max1Dval = parseInt(max1Dval);
			morphedData = await filterMinMaxOneDay(min1Dval, max1Dval);
		}
		createTable(morphedData);
	}
	console.log(morphedData);
}

async function filterData7D() {
	if(outputData.length == 0) {
		alert(`Nothing to sort!`);
		return;
	}

	
	var min7Dval = document.getElementById("min-7d-vol").value;
	var max7Dval = document.getElementById("max-7d-vol").value;

	if(min7Dval == "" || min7Dval == " ") min7Dval = "0";
	if(max7Dval == "" || max7Dval == " ") max7Dval = "-";
	
	if(min7Dval == "-" && max1Dval == "-") {
		return;
	}else {
		if (min7Dval == "-") {
			max7Dval = parseInt(max7Dval);
			morphedData = await filterMaxSevenDay(max7Dval);
		}
		else if ( max7Dval == "-") {
			min7Dval = parseInt(min7Dval);
			morphedData = await filterMinSevenDay(min7Dval);
		}
		else { 
			min7Dval = parseInt(min7Dval);
			max7Dval = parseInt(max7Dval);
			morphedData = await filterMinMaxSevenDay(min7Dval, max7Dval);
		}
		createTable(morphedData);
	}
	console.log(morphedData);
}


function filterMaxOneDay(maxLimit) {
	return new Promise((resolve, reject)=> {
		var filteredArray = [];
		try {
			outputData.forEach(element => {
				if(parseInt(element['new_volume_today']) <= maxLimit)
					filteredArray.push(element);
			});
			resolve(filteredArray);
		} catch (error) {
			reject(error);
		}		
	})
}

function filterMinOneDay(minLimit) {
	return new Promise((resolve, reject)=> {
		var filteredArray = [];
		try {
			outputData.forEach(element => {
				if(parseInt(element['new_volume_today']) >= minLimit)
					filteredArray.push(element);
			});
			resolve(filteredArray);
		} catch (error) {
			reject(error);
		}		
	})
}


function filterMinMaxOneDay(minLimit, maxLimit) {
	return new Promise((resolve, reject)=> {
		var filteredArray = [];
		try {
			outputData.forEach(element => {
				if(parseInt(element['new_volume_today']) >= minLimit && parseInt(element['new_volume_today']) <= maxLimit)
					filteredArray.push(element);
			});
			resolve(filteredArray);
		} catch (error) {
			reject(error);
		}		
	})
}





function filterMaxSevenDay(maxLimit) {
	return new Promise((resolve, reject)=> {
		var filteredArray = [];
		try {
			outputData.forEach(element => {
				if(parseInt(element['new_volume_week']) <= maxLimit)
					filteredArray.push(element);
			});
			resolve(filteredArray);
		} catch (error) {
			reject(error);
		}		
	})
}

function filterMinSevenDay(minLimit) {
	return new Promise((resolve, reject)=> {
		var filteredArray = [];
		try {
			outputData.forEach(element => {
				if(parseInt(element['new_volume_week']) >= minLimit)
					filteredArray.push(element);
			});
			resolve(filteredArray);
		} catch (error) {
			reject(error);
		}		
	})
}


function filterMinMaxSevenDay(minLimit, maxLimit) {
	return new Promise((resolve, reject)=> {
		var filteredArray = [];
		try {
			outputData.forEach(element => {
				if(parseInt(element['new_volume_week']) >= minLimit && parseInt(element['new_volume_week']) <= maxLimit)
					filteredArray.push(element);
			});
			resolve(filteredArray);
		} catch (error) {
			reject(error);
		}		
	})
}





function deleteDataset () {
	
	var delElement = document.getElementById("delete-list");
	var delValue = delElement.options[delElement.selectedIndex].value;


	var message = confirm(`Data for ${delValue} will be PERMANENTLY deleted!`);

	if(!message) return;


	var delValue2 = delValue + ",";	
	var delValue3 = "," + delValue;

	var res = filesListText.indexOf(delValue);
	if (res>=0) {
		if (filesListText === delValue) {
			filesListText = ''; // only 1 entry and it is the file itself
		} else { // multiple entries, now check if its the first one
			if (res == 0) { // if first entry in multiple, delete name and comma
				filesListText = filesListText.replace(delValue2, '');
			} else { // otherwise delete comma then the file name
				filesListText = filesListText.replace(delValue3, '');
			}	
		}


	} else {
		return;
	}
	
	// if(res>=0)
	// {
	// 	var res2 = filesListText.indexOf(delValue2);
	// 	if(res2>=0) {
	// 		filesListText = filesListText.replace(delValue2, '');		
	// 	} else {
	// 		filesListText = filesListText.replace(delValue, '');
	// 	}		
	// } else {
	// 	return;
	// }

	chrome.storage.local.remove(delValue, function () {
		var outPut = {};
		outPut['fileList'] = filesListText;
		chrome.storage.local.set(outPut);
		alert(`Data for ${delValue} has been deleted!`);
		reload();
	});

}


function findFileList() {
	chrome.storage.local.get(['fileList'], function(result) {
		var filesArray = result.fileList;

		if (filesArray == undefined) return;
		filesArray = filesArray.split(",");
		
		populateDropDown(filesArray);
		savedFiles = filesArray;
		filesListText = result.fileList;	
	});
}

function populateDropDown (nArray) {
	var endDropDown = document.getElementById("endDate");
	var startDropDown = document.getElementById("startDate");
	var deleteDropDown = document.getElementById("delete-list")
	for (var i= nArray.length-1; i>=0; i--)
	{
		var optn = document.createElement("OPTION");
		optn.setAttribute("value",nArray[i].toString());
		optn.innerText = processFilename(nArray[i].toString());
		endDropDown.appendChild(optn);

		var optn2 = document.createElement("OPTION");
		optn2.setAttribute("value",nArray[i].toString());
		optn2.innerText = processFilename(nArray[i].toString());
		startDropDown.appendChild(optn2);

		var optn3 = document.createElement("OPTION");
		optn3.setAttribute("value",nArray[i].toString());
		optn3.innerText = processFilename(nArray[i].toString());
		deleteDropDown.appendChild(optn3);
	}
	
}


function processFilename (nameString) {
	if (nameString.length == 0) return null;
	var myText = nameString.split("__");
	var mdate = myText[0];
	var mtime = myText[1];
	var ntime = mtime.split("-").join(":");
	
	var output = mdate + " " + ntime;
	return output;
}


function compareData () {

	var start = document.getElementById("startDate");
	var end = document.getElementById("endDate");

	var startValue = start.options[start.selectedIndex];
	var endValue = end.options[end.selectedIndex];

	if(startValue == undefined || endValue == undefined) {
		alert ('Invalid Data selected for comparison!');
		return;
	}

	startValue = start.options[start.selectedIndex].value;
	endValue = end.options[end.selectedIndex].value;

	if(startValue == endValue) {
		alert("End and Start Dates are the same!")
		return null;
	} 

	alpha = 0;
	delta = 0;
 	deltaP = 0;
 	dlte = 0;

	var startDate1 = startValue.split('__')[0];
	var startDate2 = startValue.split('__')[1].split('-').join(':');

	var endDate1 = endValue.split('__')[0];
	var endDate2 = endValue.split('__')[1].split('-').join(':');

	var tHead = `<div id="table-topic"><h5>${startDate1}, ${startDate2}     TO      ${endDate1},${endDate2}</h5></div>`;
	document.getElementById('display').innerHTML = tHead;

	referenceData = [];
	outputData = [];

	var myTable = document.getElementById('styled-table');
	if (myTable !== null) myTable.remove();
	
	var oldSet;

	getTwoDataSets()
	.then((value) => {
		referenceData = value[0];
		oldSet = value[1];

		referenceData.forEach(element => {
			
			var item = {};
			var foundItem = _.find(oldSet, function (n) 
				{
					item['name'] = element.name;

					if (n.name === element.name)
						return n;
					else 
						return null;
				});

			if (foundItem !== undefined)	{
				
				item['new_floor_price'] = parseFloat(element['floor_price']);
				item['old_floor_price'] = parseFloat(foundItem['floor_price']);
				item['delta_floor_price'] = item['new_floor_price'] - item['old_floor_price'];
				item['new_1dChange'] = element['onedChange'];
				item['new_7dChange'] = element['sevendChange'];
				item['old_1dChange'] = foundItem['onedChange'];
				item['old_7dChange'] = foundItem['sevendChange'];
				item['new_volume_today'] = parseInt(element['volume_today']);
				item['new_volume_week'] = parseInt(element['volume_week']);
				item['old_volume_today'] = parseInt(foundItem['volume_today']);
				item['old_volume_week'] = parseInt(foundItem['volume_week']);
				item['percentage_change'] = parseFloat((item['delta_floor_price']/item['old_floor_price'])*100);


				if(Number.isNaN(item['percentage_change']))
					item['percentage_change']  = undefined;

			}

			outputData.push(item);
			
		});
		
		morphedData = outputData;
		createTable(outputData);
		
	})

	
}


function createTable (myArray) 
{
	var tContent = `<table id="styled-table">
		<thead>
			<tr>
				<th>Name</th>
				<th>New FP</th>
				<th>New 1Day Vol</th>
				<th>New 7Day Vol</th>
				<th>Old FP</th>
				<th>Old 1D Vol</th>
				<th>Old 7D Vol</th>
				<th>FP Delta</th>
				<th>FP Delta %</th>
			</tr>
		</thead>
		<tbody>
	`;
	

	myArray.forEach((element) => {
		if(typeof element['percentage_change'] == 'undefined') return;

		var trHtml = `<tr>
			<td>${element['name']}</td>
			<td>${element['new_floor_price']}</td>
			<td>${element['new_volume_today']} <br> <span class="one-day-change"> ${(element['new_1dChange']*100).toFixed(2)}&#37</span></td>
			<td>${element['new_volume_week']}  <br> <span class="seven-day-change"> ${(element['new_7dChange']*100).toFixed(2)}&#37</span></td>
			<td>${element['old_floor_price']}</td>
			<td>${element['old_volume_today']} <br> <span class="one-day-change"> ${(element['old_1dChange']*100).toFixed(2)}&#37</span></td>
			<td>${element['old_volume_week']}  <br> <span class="seven-day-change"> ${(element['old_7dChange']*100).toFixed(2)}&#37</span></td>
			<td>${element['delta_floor_price']}</td>
			<td>${element['percentage_change'].toFixed(2)}&#37</td>
		</tr>`;

		tContent += trHtml;
	});

	tClose = `</tbody>
	</table>`;
	document.getElementById('myTableDiv').innerHTML = tContent;

}


async function getTwoDataSets () {
	
	var start = document.getElementById("startDate");
	var startValue = start.options[start.selectedIndex].value;
	

	var end = document.getElementById("endDate");
	var endValue = end.options[end.selectedIndex].value;


	var newData = await getDataSet(endValue);
	var oldData = await getDataSet(startValue) ;
	
	referenceData = newData;
	newData = _.sortBy(newData);
	oldData = _.sortBy(oldData);
	
	// Promise.all([getDataSet(endValue),getDataSet(startValue)])
	// .then(values => {
	// 	referenceData = values[0];
	// 	newData = _.sortBy(values[0], 'name');
	// 	oldData = _.sortBy(values[1], 'name');
	// })

	return ([newData, oldData]);
}


function getDataSet(key) {
	return new Promise((resolve, reject) =>{
		if (key == 'undefined') 
			reject("Couldn't find start date");
		else {
			chrome.storage.local.get([key.toString()], function(result) {
				resolve(result[key]);
			});
		}
	});
}

function reload() {
	var endDropDown = document.getElementById("endDate");
	var startDropDown = document.getElementById("startDate");
	var delDropDown = document.getElementById("delete-list");
	endDropDown.innerText = '';
	startDropDown.innerText = '';
	delDropDown.innerText = '';
	findFileList();
}



function reverseData(someArray) {
	return new Promise((resolve, reject) => {
		if(someArray.length == 0){
			console.log("invalid array")
		reject("Error")
		}else {
			var outArray = [];
			someArray.forEach(element => {
				outArray.unshift(element);
			});
			resolve(outArray);
		}
	});
}

async function testReverse() {

	var x = await reverseData(morphedData);
	console.log
}


function deleteDropdown() {
	if(slideB) {
		$("#del-container").hide(500);
	}else {
		$("#del-container").show(500);
	}
	slideB = !slideB;
}	

function filterDropdown() {
	if(filterB) {
		$("#filter-container").hide(500);
	}else {
		$("#filter-container").show(500);
	}
	filterB = !filterB;
}

$(document).ready(function () {
	Clock();
	findFileList();

	
	//Click event to scroll to top
    $('#scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},1000);
        return false;
    });
})

var reloadbtn = document.getElementById("reloader");
reloadbtn.addEventListener("click", reload);

var compbtn = document.getElementById("comparer");
compbtn.addEventListener("click", compareData);


var orbtn = document.getElementById("original");
orbtn.addEventListener("click", showOriginal);

var albtn = document.getElementById("alphabet");
albtn.addEventListener("click", sortAlpha);

var deltabtn = document.getElementById("delta");
deltabtn.addEventListener("click", sortDelta);

var deltapbtn = document.getElementById("percent");
deltapbtn.addEventListener("click", sortDeltaP);

var deletepbtn = document.getElementById("delete");
deletepbtn.addEventListener("click", deleteDropdown);

var deleteActionbtn = document.getElementById("delete-btn");
deleteActionbtn.addEventListener("click", deleteDataset);

var filterpBtn = document.getElementById("filter-dropdown");
filterpBtn.addEventListener("click", filterDropdown);

var filter1D = document.getElementById("filter-1D-btn");
filter1D.addEventListener("click", filterData1D);

var filter7D = document.getElementById("filter-7D-btn");
filter7D.addEventListener("click", filterData7D);