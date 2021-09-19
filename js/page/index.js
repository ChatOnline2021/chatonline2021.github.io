onload = function(){
    var username = getusername();
    var loginstatus = username.ok;
    username = username.username;
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
                var hubs = result.my_hubs;
                var html_string = "<button class=topbox_operation_button onclick=javascript:location.href='/myFriends' style='font-size:0.95em;width:100px' disabled>我的好友</button><button class=topbox_operation_button onclick=javascript:exec('/profile') style='font-size:0.95em;width:140px'>个人资料</button><button class=topbox_operation_button onclick=javascript:exec('/newHub') style='font-size:0.95em;width:140px'>+ 新建群聊</button><br>好友功能还在测试中，请等待下一次更新<hr>群聊ID | 群聊名称 | 消息数量<br>";
                for (var i = 0;i < hubs.length;i++){
                    var AsyncRenderId = parseInt(Math.random().toString().substring(3,12)).toString(16);
                    html_string += hubs[i] + "| <a href=/hub?hid=" + hubs[i] + "><span id=AsyncRender-id-" + AsyncRenderId + ">Loading......</span> | <span id=HubMessages-id-" + hubs[i] + ">0</span><br>";
                    AsyncFunc(function(arr){
                        var hub_id = arr[0];
                        var RenderId = arr[1];
                        ajax(storage_server + "/hubdata/" + hubs[i] + "/info").then(res => {
                             var code = res[0];
                             var result = res[1];
                             if (code >= 200 && code < 400){
                                document.querySelector("#AsyncRender-id-" + RenderId).innerHTML = JSON.parse(result).hubname || "null";
                             } else document.querySelector("#AsyncRender-id-" + RenderId).innerHTML = "加载群名称时失败，通信故障"
                        });
                    },[hubs[i],AsyncRenderId])
                };
                html_string += "没有更多数据了~"
                document.querySelector("#chat-area").innerHTML = html_string;
            } else {
                document.querySelector("#chat-area").innerHTML = "无法从服务器抓取您的信息！<br>请<a href=# onclick=javascript:location.reload();>重试</a><br>这可能是服务器上的缓存所导致的，建议您在 <font color=red>5分钟</font> 后再试";
            };
        });
    } else {
        document.querySelector("#account_operation_button").innerHTML = "<button onclick=javascript:login(); class=topbox_operation_button>登录</button> <button onclick=javascript:register(); class=topbox_operation_button>注册</button>"
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

function AsyncFunc(func,args){
    return func(args);
};