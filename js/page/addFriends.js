onload = function(){
    var username = getusername();
    var loginstatus = username.ok;
    username = username.username;
    window.username = username;
    document.querySelector("#username").innerHTML = username || "您尚未登录";
    if (loginstatus){
        document.querySelector("#account_operation_button").innerHTML = "<button onclick=javascript:logout(); class=topbox_operation_button>退出登录</button>";
        document.querySelector("#chat-area").innerHTML = "<span style='font-size:1.2em'>添加好友</span><br><button class=topbox_operation_button onclick=javascript:location.href='/myFriends' style='font-size:0.95em;width:100px'>返回</button><br>请输入好友ID<input type=text maxlength=24 placeholder=xxxxxxxx class=friends_input_box><br><input type=button value=提交 class=topbox_operation_button onclick=javascript:addFriends();>";
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
const storage_server = "https://chatonline.product.air-team.tk";

function addFriends(){
    var friend_id = document.querySelector(".friends_input_box").value;
    ajax(storage_server + "/userdata/" + window.username).then(res => {
        var code = res[0];
        var result = res[1];
        if (code >= 200 && code < 400){
            result = JSON.parse(result);
            var friends = result.my_friends;
            var hubs = result.my_hubs;
            var i = 0;
            while (i < friends.length){
                if (friend_id == friends[i]){
                    alert("对方已是您的好友!");
                };
                i++;
            };
            friends.push(friend_id);
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
