/**
 * Created by huopanpan on 2017/7/24.
 */
$(function () {
    var text = $("h1");
    var body = $("#background");
    body.height($(document).height())
    //==============
    /**
     * 初始化Session对象
     */
    var audioPalyUrl = "http://h5.xf-yun.com/audioStream/";
    var session = new IFlyTtsSession({
        'url': 'http://webapi.openspeech.cn/',
        'interval': '30000',
        'disconnect_hint': 'disconnect',
        'sub': 'tts'
    });

    window.iaudio = null;
    function play(content, vcn) {
        reset();
        ssb_param = { "appid": '569f2172', "appkey": "79c6bbbad606755d", "synid": "12345", "params": "ent=aisound,aue=lame,vcn=" + vcn };

        session.start(ssb_param, content, function (err, obj) {
            var audio_url = audioPalyUrl + obj.audio_url;
            if (audio_url != null && audio_url != undefined) {
                window.iaudio.src = audio_url;
                window.iaudio.play();
            }
        });
    };

    //建立websocket连接
    !function socketlink(params) {
        socket = io.connect('/notify',{
        'reconnection': true,
        'reconnectionDelay': 5000,
        'reconnectionDelayMax': 10000,
        'reconnectionAttempts': 10
    });
        socket.on('open', function (data) {
            text.html(data.text);
        });
        var timer;
        var shadow = 0;
        socket.on("message", function (data) {
            text.html(data.text);
            play(data.text, "viviyufeng");
            timer = setInterval(function(){
                if (!body.css("background-color")) {
                    body.css("background-color", "rgb(253, 4, 4)");
                }
                if (body.css("background-color") === "rgb(253, 4, 4)") {
                    body.css("background-color", "#FFF")
                } else {
                    body.css("background-color", "rgb(253, 4, 4)");
                }
                if (shadow < 20) {
                    shadow++;
                } else {
                    clearInterval(timer);
                }
            }, 1000);
        });
        socket.on("stop", function(data){
            console.log(data.text)
            clearInterval(timer);
            body.css("color", "rgb(253, 4, 4)");
        })
    }();

    /**
     * 重置音频缓存队列和播放对象
     * 若音频正在播放，则暂停当前播放对象，创建并使用新的播放对象.
     */
    function reset() {
        audio_state = 0;
        if (window.iaudio != null) {
            window.iaudio.pause();
        }
        window.iaudio = new Audio();
        window.iaudio.src = '';
        //window.iaudio.play();
    };
    //======================
});