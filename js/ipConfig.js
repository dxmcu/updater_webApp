/**
 * Created by Luoqi on 4/29/2016.
 */
var fs = require("fs");
var modelList = [];
var codeBackEventSum = 0;
var mapBackEventSum = 0;


function readConfig() {
    fs.readFile("./ipConfig.json","utf-8",function(error, fileData){
        console.log("error "+error);

        localStorage.setItem('ipConfig',fileData);

        var object = JSON.parse(fileData);
        console.log(object);
        for(var one in object) {
            modelList.push(one);
        }
        console.log(localStorage.getItem('currentModel'));

        if(localStorage.getItem('currentModel') === null || localStorage.getItem('currentModel') === "") {
            selectModel('list-content');
            $('#modelList').openModal();
        } else {
            localStorage.setItem('currentModel', localStorage.getItem('currentModel'));
            $("#modelLabel").text("Robot model: "+localStorage.getItem('currentModel'));
        }
    });
}

document.getElementById('reselectModel').addEventListener('click',function() {
    selectModel('list-content');
    $('#modelList').openModal();
});


document.getElementById('chooseModelBtn').addEventListener('click',saveChooseModel);

function saveChooseModel() {
    var robotModel = $('input[name="group1"]:checked');
    var currentModel = robotModel[0].value;
    $("#modelLabel").text("Robot model: "+currentModel);
    localStorage.setItem('currentModel', currentModel);
    localStorage.setItem('currentModel', currentModel);
    console.log(localStorage.getItem('currentModel'));

    var object = JSON.parse(localStorage.getItem('ipConfig'));
    localStorage.setItem('host',object[currentModel].host);
    // checkReachable();
}
/*
 <ul id="dropdown1" class="dropdown-content">
 <li><a href="#!">one</a></li>
 <li class="divider"></li>
 <li><a href="#!">two</a></li>
 <li class="divider"></li>
 <li><a href="#!">three</a></li>
 </ul>
 */
function createDropdownList() {
    var list = document.getElementById('dropdown1');
    list.innerHTML = '';
    for(var i=0;i<modelList.length;i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = modelList[i];
        a.setAttribute('')
    }
}

function selectModel(listID) {
    var list = document.createElement("form");
    var content = document.getElementById(listID);
    content.innerHTML = "";
    var h = document.createElement("h4");
    h.textContent = "Select Robot";
    content.appendChild(h);
    list.setAttribute('action', "#");
    for (var i = 0; i < modelList.length; i++) {
        var p = document.createElement('p');
        var input = document.createElement('input');
        input.setAttribute('name', 'group1');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', 'test' + i);
        input.setAttribute('value',modelList[i]);
        var label = document.createElement('label');
        label.setAttribute('for', 'test' + i);
        label.textContent = modelList[i];
        p.appendChild(input);
        p.appendChild(label);
        list.appendChild(p);
    }
    content.appendChild(list);
}

function checkReachable() {
    var host = localStorage.getItem('host');
    var checkEditorURL = host+":8080/gs-robot/data/maps";
    var checkMapUpdaterURL = host+":8080/gs-robot/cmd/launch_map_loader";

    const isReachable = require('is-reachable');

    //check editor module whether reachable
    isReachable(checkEditorURL, (err, reachable) => {
        if(reachable) {
            $("#mapEditor").removeClass("disabled");
            document.getElementById('mapEditor').href = "./mapEditor/mapGallery.html";
        } else {
            $("#mapEditor").addClass("disabled");
            document.getElementById('mapEditor').href = "#";
            toastError("You can't edit map now. <br/><br/> Please check the net connection and try again! <br/><br/> (Click the fresh button)", 10000);
        }
        //console.log(reachable);
        //=> true
    });

    //check map updater module whether reachable
    isReachable(checkMapUpdaterURL, (err, reachable) => {
        if(reachable) {
            $("#mapModule").removeClass("disabled");
            document.getElementById('mapModule').href = "mapUpdater.html";
        } else {
            $("#mapModule").addClass("disabled");
            document.getElementById('mapModule').href = "#";
            toastError("You can't migrate map now. <br/><br/> Please check the net connection and try again! <br/><br/> (Click the fresh button)", 10000);
        }
        //console.log(reachable);
        //=> true
    });
}

function toastError(string) {
    var text =  "<span style='color: #ff0000;font-size: 25px'>"+string+"</span></div>";
    Materialize.toast(text,10000);
}

document.getElementById('resignIn').addEventListener('click',function() {
    if(localStorage.getItem('isSignIn')!=null) {
        localStorage.removeItem("isSignedIn");
    }
    location.href = 'signIn.html';
});

document.getElementById('reload').addEventListener('click', function () {
    // checkReachable();
});

document.getElementById('projectModule').addEventListener('click',goProjectModule);
function goProjectModule() {
    console.log('firmware update');

    //core code to make a one page app, the navigation bar doesn't need to change
    $('#content1').fadeOut('fast', function() {
        $(this).load('codeUpdater.html', function() {
            // $('#nav').remove();
            $(this).fadeIn('fast');
        });
    });
}

document.getElementById('mapModule').addEventListener('click',goMapModule);
function goMapModule() {
    console.log('map migration');

    $('#content1').fadeOut('fast', function() {
        $(this).load('mapUpdater.html', function() {
            // $('#nav').remove();
            $(this).fadeIn('fast');
        });
    });
}

document.getElementById('backBtn').addEventListener('click',function() {
    // localStorage.removeItem("isSignedIn");
    // location.href = 'signIn.html';
});

//document.getElementById('projectModule').addEventListener('click',function() {
//    location.href = "codeUpdater.html";
//});

readConfig();
