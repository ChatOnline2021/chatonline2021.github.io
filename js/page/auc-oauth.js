var args = parseURLArgs();
if (args.err_code){
    if (args.err_code == -1)
        alert("登录失败！你没有同意ChatOnline使用你的AUC账号进行登录");
    else if (args.err_code == -2)
        alert("登录失败！服务器端错误！");
    location.href = "/";
};
var username = args.username;
var date_obj = new Date();
var time = date_obj.getUTCFullYear() + "年" + (date_obj.getUTCMonth() + 1) + "月" + date_obj.getUTCDate() + "日 | " + date_obj.getUTCHours() + "时" + date_obj.getUTCMinutes() + "分" + date_obj.getUTCSeconds() + "秒" + date_obj.getUTCMilliseconds() + "毫秒";
var diff_zone = parseInt(date_obj.getTimezoneOffset() / 60);
var letter_zone = (diff_zone)?((diff_zone < 0)?("东" + Math.abs(diff_zone) + "区"):("西" + Math.abs(diff_zone) + "区")):("零时区");
ajax(storage_server + "/userdata/" + username).then(res => {
    var code = res[0];
    var result = res[1];
    console.log(result);
    if (code == 404){
        //Register
        putdata("userdata/" + username,utf16to8(JSON.stringify({my_friends:[],my_hubs:[],profile:{username:username,password:null,avatar:null,birthday:"1970-01-01",ip:[{time:time,zone:letter_zone,ipv4:returnCitySN.cip || "null",city:returnCitySN.cname || "null",ipv6:_ipv6 || "null",isp:_isp || "null",country:_country || "null"}],sex:null}})),get_gh_access_token()).then(res => {
            var code = res[0];
            var result = res[1];
            if (code >= 200 && code < 400){
                setcookie("username",btoa(escape(username),1000 * 60 * 60 * 24 * 3));
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
        result = JSON.parse(result);
        console.log(result);
        //ADD IP ADDRESS TO THE DATA
        result.profile.ip[result.profile.ip.length] = {time:time,zone:letter_zone,ipv4:returnCitySN.cip || "null",city:returnCitySN.cname || "null",ipv6:_ipv6 || "null",isp:_isp || "null",country:_country || "null"};
        getdata("userdata/" + username).then(res => {
            var code = res[0];
            var dat = JSON.parse(res[1]);
            if (code < 200 || code >= 400){
                alert("请求服务器失败！请重试");
                location.href = "/";
            };
            var sha = dat.sha;
            putdata("userdata/" + username,utf16to8(JSON.stringify(result)),get_gh_access_token(),sha).then(res => {
                setcookie("username",btoa(escape(username),1000 * 60 * 60 * 24 * 3));
                location.href = "/";
            });

        });

    };
});
