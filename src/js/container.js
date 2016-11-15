/*jslint node: true, browser: true */
'use strict';

var videoContainer = window.frames[0];

function windowResize() {
    if (window.matchMedia('screen and (max-width: 650px)').matches ||         window.matchMedia('screen and (min-width: 651px) and (max-width: 1100px)').matches) {
        videoContainer.setMedia(true);
    } else {
        videoContainer.setMedia(false);
    }
}

window.videoLoaded = function () {
    windowResize();
};

window.addEventListener('resize', windowResize);
