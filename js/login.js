function register(){
    window.open("https://chenglan.user.air-team.tk/auc/oauth?" + location.origin + "/auc-oauth;username","blank");
};
function login(){
    register();
};
function logout(){
    delcookie("username",1000 * 60 * 60 * 8);
    location.href = "/";
};