var args = parseURLArgs();
if (args.err_code){
    if (args.err_code == -1)
        alert("登录失败！你没有同意ChatOnline使用你的AUC账号进行登录");
    else if (args.err_code == -2)
        alert("登录失败！服务器端错误！");
    location.href = "/";
};
var username = args.username;
getdata("userdata/" + username).then(res => {
    var code = res[0];
    var result = res[1];
    if (code == 404){
        //Register
        putdata("userdata/" + username,JSON.stringify({my_friends:[],my_hubs:[]}),get_gh_access_token()).then(res => {
            var code = res[0];
            var result = res[1];
            if (code >= 200 && code < 400){
                setcookie("username",btoa(escape(username),8 * 60 * 60 * 1000));
                location.href = "/";
            } else {
                alert("操作失败！请重试！");
                setTimeout(function(){
                    location.reload();
                },5000);
            };
        });
    } else if (code == 403){
        //API ERROR
        alert("你的操作过于频繁！请稍后再试");
        location.href = "/";
    } else if (code >= 200 && code < 400){
        //Successful
        setcookie("username",btoa(escape(username),8 * 60 * 60 * 1000));
        location.href = "/";
    };
});