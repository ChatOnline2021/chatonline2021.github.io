function getdata(path,access_token = null,responseType = "text"){
    if (window.XMLHttpRequest)
        var xhr = new XMLHttpRequest();
    else
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET","https://api.github.com/repos/ChatOnline2021/chatonline2021.github.io/contents/" + path +"?t=" + new Date().getTime());
    if (access_token)
        xhr.setRequestHeader("authorization","token " + access_token);
    xhr.responseType = responseType;
    xhr.send();
    return new Promise(function(resolve,reject){
        xhr.onload = function(){
            resolve([xhr.status,xhr.response]);
        };
    });
};
function putdata(path,content,access_token,sha = null){
    if (window.XMLHttpRequest)
        var xhr = new XMLHttpRequest();
    else
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("PUT","https://api.github.com/repos/ChatOnline2021/chatonline2021.github.io/contents/" + path +"?t=" + new Date().getTime());
    if (access_token)
        xhr.setRequestHeader("authorization","token " + access_token);
    xhr.send(JSON.stringify({message:"null",sha:sha,content:btoa(content)}));
    return new Promise(function(resolve,reject){
        xhr.onload = function(){
            resolve([xhr.status,xhr.response]);
        };
    });
};
function get_gh_access_token(){
    var tokens = [atob("Z2hwX2VETFo5UWpReWFKN0VWRTlTTjZNUW9yOEtjeVBhSzRSY3E1RQ==")];
    return tokens[0];
};
function ajax(url,cfg = {}){
    if (window.XMLHttpRequest)
        var xhr = new XMLHttpRequest();
    else
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open(cfg.method || "GET",url);
    for (var i in cfg)
        xhr[i] = cfg[i];
    xhr.send();
    return new Promise(function(resolve,reject){
        xhr.onload = function(){
            resolve([xhr.status,xhr.response]);
        };
    });
};