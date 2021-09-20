function register(){
    window.open("https://chenglan28.github.io/auc/oauth?" + location.origin + "/auc-oauth;username","blank");
};
function login(){
    register();
};
function logout(){
    delcookie("username",1000 * 60 * 60 * 24 * 3);
    location.href = "/";
};