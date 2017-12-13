var phone;
var texts;
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '202',
        width: '363',
        videoId: '9xKR8Vcjias',
        playerVars: {
            showinfo: 0,
            fs: 0,
            rel: 0
        },
        events: {
        'onReady': onPlayerReady
        }
    });
}
function onPlayerReady(event) {
    var phonePosition = 250;
    var speed = 1;
    var count = 3;
    var timer = setTimeout(function tick(){
        if(phonePosition > 14){
            //move block "main"
            document.getElementById('main').style.top = --phonePosition + 'px';
            timer = setTimeout(tick, speed);
        }else if(count > 0){
            //show text elements and button
            if(count == 3) document.querySelector('#text span').style.opacity = 1;
            if(count == 2) document.getElementById('drag').style.opacity = 1;
            if(count == 1) document.getElementById('buy').style.opacity = 1;
            count--;
            speed = 500;
            timer = setTimeout(tick, speed);
        }else{
            //start to play youtube video
            event.target.mute();
            event.target.playVideo();
        }
    }, speed);
}
//create array and push margin values inside
var marginArray = [];
var margin = -221;
for(var i = 0; i < 60; i++){
    marginArray[i] = i * margin;
}
//object Raindrop
function Raindrop(field, height, width, shape){
    var self = this;
    this.field = field;
    this.shape = shape;
    this.positionY = -50;   //start position
    this.newPositionY = Math.random() * height - 30;    //position after fall
    this.positionX = Math.random() * width - 30;        //horizontal position
    this.raindrop = document.createElement('div');
    this.size = parseInt(Math.random() * 15 + 20);      //size raindrop element after drop 35-20px
    this.endSize = this.size / 2.5;
    this.startSize = 80;
    this.dropSpeed = parseInt(Math.random() * 15 + 5);  //speed of raindrop fall
    //step - how change raindrop's size when it falls
    this.step = (this.startSize - this.size) / parseInt(this.newPositionY - this.positionY) * this.dropSpeed;
    this.raindrop.style.cssText = "width: " + this.startSize + "px;\
        height: " + this.startSize + "px;\
        position: absolute;\
        top: -50px;\
        left: " + this.positionX + "px;\
        background-image : url(images/raindrop_" + this.shape + ".png);\
        background-size: contain;\
        background-repeat: no-repeat;\
        background-position: center;\
        z-index: 5000;\
    ";
    this.slippingSpeed = 2500;
    this.field.appendChild(this.raindrop);
    this.timer = setTimeout(function tick(){
        if(self === null) return;
        if(self.positionY < self.newPositionY){
            //fall of raindrop
            self.startSize -= self.step;
            self.positionY += self.dropSpeed;
            self.raindrop.style.top = self.positionY + "px";
            self.raindrop.style.height = self.startSize + "px";
            self.raindrop.style.width = self.startSize + "px";
            self.timer = setTimeout(tick, 1);
        }else if(self.positionY < height){
            //slip of raindrop
            if(self.slippingSpeed > 5) self.slippingSpeed = self.slippingSpeed / 2.5;
            self.raindrop.style.top = ++self.positionY + "px";
            if(self.startSize > self.endSize){
                self.startSize *= 0.95;
                self.raindrop.style.width = self.startSize + "px";
            }
            self.timer = setTimeout(tick, self.slippingSpeed);
        }else{
            self.raindrop.remove();
            // field.removeChild(self.raindrop);
            self = null;
            delete self;
        }
        return;
    }, 1);
}
var speed = 10;
var isRain = false;
//rain function
function rain(pole){
    var styles = getComputedStyle(pole);
    var height = parseInt(styles.height);
    var width = parseInt(styles.width);
    var timeout = setTimeout(function tick(){
        if(!isRain) return;
        new Raindrop(pole, height, width, parseInt(Math.random() * 4) + 1);
        speed = parseInt(Math.random() * 200) + 10;
        timeout = setTimeout(tick, speed);
    }, speed);
}

window.onload = function(){
    document.getElementById('close').addEventListener('click', function(){
        window.close();
    });
    phone = document.getElementById('main');
    var round = document.getElementById('round');
    var roundStyle = getComputedStyle(round);
    var halfOfRound = parseInt(roundStyle.height) / 2;
    var roundStart = parseInt(roundStyle.top);
    var roundEnd = parseInt(getComputedStyle(document.getElementById('rotate')).height) - halfOfRound;
    texts = document.querySelectorAll('#text span');
    var activeText = 0;
    var flashElem = document.getElementById('flash');
    var flashActive = false;
    var internal = document.getElementById('internal');
    var internalOpacity = 0;
    var video = document.getElementById('video');
    //
    function flash(){
        setTimeout(function(){
            flashActive = false;
        }, 1000);
        var opacityFlash = 1;
        var deg = 0;
        var size = 5;
        var top = 67;
        var left = 97;
        flashElem.style.opacity = 1;
        var interval = setInterval(function(){
            if(opacityFlash > 0){
                if(size > 900){
                    flashElem.style.opacity = opacityFlash;
                    opacityFlash -= 0.01;
                }
                flashElem.style.transform = "rotate(" + ++deg + "deg)";
                flashElem.style.width = size + "px";
                flashElem.style.height = size + "px";
                flashElem.style.top = top + "px";
                flashElem.style.left = left + "px";
                size += 18;
                top -= 9;
                left -= 9;
            }
            else clearInterval(interval);
        }, 1);
    }
    function changeText(num){
        texts[activeText].style.opacity = 0;
        activeText = num;
        texts[activeText].style.opacity = 1;
    }
    var highlightsStart = -60;
    var highlightsEnd = 45;
    var highlightsPosition = highlightsStart;
    var highlightsCount = 0;
    var highlights = document.getElementById('highlights');
    var interval;
    var highlightsActive = false;
    function handlerMove(e){
        cordY = e.clientY - round.offsetHeight*2.5;
        if(cordY < roundStart){
            video.style.display = "block";
            player.playVideo();
            round.style.top = roundStart + 'px';
            phone.style.backgroundPositionY = marginArray[0] + 'px';
            changeText(0);
        }else if(cordY <= roundEnd - 4){
            //stop video, if it piays
            video.style.display = "none";
            player.pauseVideo();
            //hide internal
            internal.style.opacity = internalOpacity = 0;
            highlightsActive = false;
            round.style.top = cordY + 'px';
            phone.style.backgroundPositionY = marginArray[(cordY + halfOfRound) / 3] + 'px';
            if(cordY < 0){
                isRain = false;
                changeText(0);
            }
            else if(cordY < 65){
                changeText(1);
                if(isRain) return;
                isRain = true;
                rain(phone);
            }
            else if(cordY < 120) {
                isRain = false;
                changeText(2);
                if(cordY > 75 && cordY < 85) {
                    if(flashActive) return;
                    flashActive = true;
                    flash();
                }
            }
            else changeText(3);
        }
        else{
            changeText(3);
            round.style.top = roundEnd + 'px';
            phone.style.backgroundPositionY = '-12818px';
            if(highlightsActive) return;
            highlightsActive = true;
            interval = setInterval(function(){
                if(cordY <= roundEnd - 4) clearInterval(interval);
                if(internalOpacity < 1){
                    internalOpacity += 0.01;
                    internal.style.opacity = internalOpacity;
                }else if(highlightsCount < 2){
                    if(highlightsPosition < highlightsEnd){
                        highlightsPosition += 1.6;
                        highlights.style.left = highlightsPosition + 'px';
                    }else{
                        highlightsPosition = highlightsStart;
                        highlights.style.left = highlightsPosition + 'px';
                        highlightsCount++;
                    }
                }else{
                    highlightsPosition = highlightsStart;
                    highlights.style.left = highlightsPosition + 'px';
                    highlightsCount = 0;
                    clearInterval(interval);
                }
            }, 1);
        }
    }
    //
    function myHandler(e){
        document.addEventListener('mousemove', handlerMove);
    }
    //
    round.addEventListener('mousedown', myHandler);
    document.addEventListener('mouseup', function(){
        document.removeEventListener('mousemove', handlerMove);
    });
    round.ondragstart = function() {
        return false;  
    };
};