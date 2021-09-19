function exec(path){
    ajax(path).then(res => {
        var code = res[0];
        var data = res[1];
        if (code < 200 || code >= 400)
            return exec(path+".html");
        var ChatWindow = document.querySelector("#ChatWindow");
        if (!ChatWindow){
            var ChatWindow = document.createElement("div");
            ChatWindow.style["background-color"] = "#ffe4b5";
            ChatWindow.style["color"] = "#1e90ff";
            ChatWindow.style.position = "fixed";
            ChatWindow.style.top = "62px";
            ChatWindow.style.left = "0px";
            ChatWindow.style.width = "100%";
            ChatWindow.style.display = "none";
            ChatWindow.id = "ChatWindow";
            document.body.appendChild(ChatWindow);
            var MessageBox = document.createElement("span");
            MessageBox.id = "MessageBox";
            MessageBox.innerHTML = "<button class=topbox_operation_button onclick=javascript:closeChatWindow();>退出</button> | 消息栏 <input type=text class=topbox_operation_button style='width:85%' value=目前还没有任何消息哦~ readonly disabled><hr>";
            ChatWindow.appendChild(MessageBox);
            var DisplayZone = document.createElement("span");
            DisplayZone.id = "DisplayZone";
            ChatWindow.appendChild(DisplayZone);
            return exec(path);
        };
        document.querySelector("#ChatWindow").style.display = "inline";
        document.querySelector("#DisplayZone").innerHTML = data;
        if (document.querySelector("#DEFINE-FUNC")){
            try {
                console.log("EXEC FUNCTION" + document.querySelector("#DEFINE-FUNC").getAttribute("data-func") + ".init()");
                window[document.querySelector("#DEFINE-FUNC").getAttribute("data-func")].init();
            } catch (err){
                console.error(err);
            };
        };
    });
};
function closeChatWindow(){
    document.querySelector("#ChatWindow").style.display = "none";
};