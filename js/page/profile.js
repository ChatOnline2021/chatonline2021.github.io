ProfileFunc = {
    init:function(){
        var username = unescape(atob(getcookie("username")));
        window.username = username;
        document.querySelector("#profile-username").value = username;
        document.querySelector("#profile-password").value = "使用Oauth系统登录的没有密码哦~";
        document.querySelector("#profile-password").type = "text";
        ajax(storage_server + "/userdata/" + username).then(res => {
            var code = res[0];
            var result = JSON.parse(res[1]);
            window.userdata = result;
            if (code < 200 || code >= 400){
                document.querySelector("#DisplayZone").innerHTML = "错误：无法与服务器通信<br>请刷新重试";
                return;
            };
            document.querySelector("#profile-sex").value = result.profile.sex;
            document.querySelector("#profile-image-box").innerHTML = (result.profile.avatar == "null" || !result.profile.avatar)?" 你还没有上传任何头像哦~ <input type=file id=upload_file accept=image/* onchange=javascript:ProfileFunc.checkimage()><br><span id=check-avatar-status></span>":"<img height=64px width=64px src=https://ChatOnline2021.github.io/avatar/" + username + ".png alt=Avatar>"; 
            var login_record_html = "<table border=1><tr><td>序号</td><td>登录时间 (GMT)</td><td>时区</td><td>ipv4</td><td>ipv6</td><td>ASN</td><td>所在国家</td><td>所在地</td></tr>";
            var index = 0;
            while (index < result.profile.ip.length){
                login_record_html += "<tr><td>" + (index + 1) + "</td><td>" + result.profile.ip[index].time + "</td><td>" + result.profile.ip[index].zone + "</td><td>" + result.profile.ip[index].ipv4 + "</td><td>" + result.profile.ip[index].ipv6 + "</td><td>" + result.profile.ip[index].isp + "</td><td>" + result.profile.ip[index].country + "</td><td>" + result.profile.ip[index].city + "</td></tr>";
                index++;
            };
            login_record_html += "</table>";
            document.querySelector("#profile-login-records").innerHTML = login_record_html;
            document.querySelector("#profile-birthday").value = (result.profile.birthday == "1970-1-1")?"1970-01-01":result.profile.birthday;
        });
    },
    checkimage:function(){
        window.imageOnload = false;
        document.querySelector("#check-avatar-status").innerHTML = "加载图片中";
        var file = document.querySelector("#upload_file").files[0];
        var canvas = document.createElement("canvas");
        canvas.id = "edit-image";
        canvas.style.display = "none";
        document.body.appendChild(canvas);
        var blob_url = window.URL.createObjectURL(file);
        var img = new Image();
        img.src = blob_url;
        img.onload = function(){
            document.querySelector("#check-avatar-status").innerHTML = "图片压缩中"
            canvas.height = img.height;
            canvas.width = img.width;
            if (parseInt(canvas.height) > 512){
                canvas.height = 512;
            };
            if (parseInt(canvas.width) > 512){
                canvas.width = 512;
            };
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
            canvas.toBlob(function(blob){
                window.imagedata = blob;
                window.imgOnload = true;
                var blob_url = window.URL.createObjectURL(blob);
                document.querySelector("#check-avatar-status").innerHTML = "<img alt=avatar height=64 width=64 src=" + blob_url + "><br>图片压缩完毕"
            });
        };
    },
    update:function(){
        if (typeof(window.imgOnload) != "undefined" && !window.imgOnload){
            return setTimeout(ProfileFunc.update,100);
        };
        window.userdata.profile.sex = document.querySelector("#profile-sex").value || "null";
        window.userdata.profile.birthday = document.querySelector("#profile-birthday").value || "1970-01-01";
        if (window.imgOnload){
            window.userdata.profile.avatar = "true";
            document.querySelector("#upload_status").innerHTML = "正在上传您的头像";
            var reader = new FileReader();
            reader.readAsDataURL(window.imagedata);
            reader.onload = function(){
                var data = reader.result;
                data = data.substring(data.indexOf("base64,") + 7);
                putdata("avatar/" + window.username + ".png",atob(data),get_gh_access_token()).then(res => {
                    var code = res[0];
                    if (code >= 200 && code < 400){
                        document.querySelector("#upload_status").innerHTML = "头像上传成功";
                        setTimeout(ProfileFunc.upload_data(JSON.stringify(window.userdata)),1200);
                    } else {
                        document.querySelector("#upload_status").innerHTML = "头像上传失败，请重试";
                    };
                });
            }
        } else ProfileFunc.upload_data(JSON.stringify(window.userdata));
    },
    upload_data:function(dat){
        getdata("userdata/" + window.username).then(res => {
            var result = res[1];
            var code = res[0];
            if (code < 200 || code >= 400){
                document.querySelector("#upload_status").innerHTML = "无法上传数据，网络错误";
                return;
            };
            document.querySelector("#upload_status").innerHTML = "正在上传您的数据...请稍后";
            var sha = JSON.parse(result).sha;
            putdata("userdata/" + window.username,utf16to8(dat),get_gh_access_token(),sha).then(res => {
                document.querySelector("#upload_status").innerHTML = "数据上传成功！";
            });
        });
    }
    
};
