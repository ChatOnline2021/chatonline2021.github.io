onload = function(){
    var username = getusername();
    var loginstatus = username.ok;
    username = username.username;
    window.username = username;
    document.querySelector("#username").innerHTML = username || "您尚未登录";
    if (loginstatus){
        document.querySelector("#account_operation_button").innerHTML = "<button onclick=javascript:logout(); class=topbox_operation_button>退出登录</button>";
        document.querySelector("#chat-area").innerHTML = "正在从服务器抓取您的信息......请稍后";
        ajax(storage_server + "/userdata/" + username + "?t=" + new Date().getTime()).then(res => {
            document.querySelector("#chat-area").innerHTML = "正在渲染数据......请稍后"
            var status = res[0];
            var result = res[1];
            if (status >= 200 && status < 400){
                result = JSON.parse(result);
                var friends = result.my_friends;
                var html_string = "<span style='font-size:1.2em'>好友列表</span><br><button class=topbox_operation_button onclick=javascript:location.href='/' style='font-size:0.95em;width:100px'>返回</button><button class=topbox_operation_button onclick=javascript:location.href='/addFriends' style='font-size:0.95em;width:140px'>+ 添加好友</button><hr>朋友ID | 删除<br>";
                for (var i = 0;i < friends.length;i++){
                    html_string += friends[i] + "| <button class=topbox_operation_button onclick=javascript:delete_friend('" + friends[i] + "')>删除</button><br>"
                };
                html_string += "没有更多数据了~"
                document.querySelector("#chat-area").innerHTML = html_string;
            } else {
                document.querySelector("#chat-area").innerHTML = "无法从服务器抓取您的信息！<br>请<a href=# onclick=javascript:location.reload();>重试</a>";
            };
        });
    } else {
        location.href = "/";
    };
};
function getusername(){
    var username = getcookie("username");
    //Check whether there is a record in cookie.
    if (username === null){
        //Guest
        return {ok:false,username:null};
    } else {
        //User
        return {ok:true,username:atob(unescape(username))};
    };
};
const storage_server = "https://chatonline2021.github.io";

function AsyncFunc(func,args){
    return func(args);
};

function delete_friend(friend_id){
    ajax(storage_server + "/userdata/" + window.username + "?t=" + new Date().getTime()).then(res => {
        var code = res[0];
        var result = res[1];
        if (code >= 200 && code < 400){
            result = JSON.parse(result);
            var friends = result.my_friends;
            var hubs = result.my_hubs;
            var i = 0;
            while (i < friends.length){
                if (friend_id == friends[i]){
                    friends.splice(i,1);
                };
                i++;
            };
            getdata("userdata/" + window.username).then(res => {
                var code = res[0];
                var result = res[1];
                if (code < 200 && code >= 400){
                    alert("通信错误！请重试");
                    return;
                };
                var sha = JSON.parse(result).sha;
                putdata("userdata/" + window.username,JSON.stringify({my_friends:friends,my_hubs:hubs}),get_gh_access_token(),sha).then(res => {
                    var code = res[0];
                    var result = res[1];
                    if (code >= 200 && code < 400){
                        alert("操作成功！\n由于服务端开启了缓存，您可能需要等待几分钟后才能看见您所见的更改");
                        location.href = "/myFriends";
                    } else alert("通信错误！请重试");
                });
            });

        } else alert("通信错误！请重试")
    });
};
