ProfileFunc = {
    init:function(){
        let username = unescape(atob(getcookie("username")));
        document.querySelector("#profile-username").value = username;
        document.querySelector("#profile-password").value = "使用Oauth系统登录的没有密码哦~";
        document.querySelector("#profile-password").type = "text";
        ajax(storage_server + "/userdata/" + username).then(res => {
            var code = res[0];
            var result = JSON.parse(res[1]);
            if (code < 200 || code >= 400){
                document.querySelector("#DisplayZone").innerHTML = "错误：无法与服务器通信<br>请刷新重试";
                return;
            };
            document.querySelector("#profile-sex").value = result.profile.sex;
            document.querySelector("#profile-image-box").innerHTML = (result.profile.avatar == "null" || !result.profile.avatar)?" 你还没有上传任何头像哦~ <input type=file id=upload_file accept=image/*>":"<img height=64px width=64px src=https://ChatOnline2021.github.io/avatar/" + username + ".png alt=Avatar>"; 
            var login_record_html = "<table border=1><tr><td>序号</td><td>登录时间 (GMT)</td><td>时区</td><td>ipv4</td><td>ipv6</td><td>运营商</td><td>所在国家</td><td>所在地</td></tr>";
            var index = 0;
            while (index < result.profile.ip.length){
                login_record_html += "<tr><td>" + (index + 1) + "</td><td>" + result.profile.ip[index].time + "</td><td>" + result.profile.ip[index].zone + "</td><td>" + result.profile.ip[index].ipv4 + "</td><td>" + result.profile.ip[index].ipv6 + "</td><td>" + result.profile.ip[index].isp + "</td><td>" + result.profile.ip[index].country + "</td><td>" + result.profile.ip[index].city + "</td></tr>";
                index++;
            };
            login_record_html += "</table>";
            document.querySelector("#profile-login-records").innerHTML = login_record_html;
            document.querySelector("#profile-birthday").value = (result.profile.birthday == "1970-1-1")?"1970-01-01":result.profile.birthday;
        });
    }
    
    
};
