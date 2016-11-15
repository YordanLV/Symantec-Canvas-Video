/*jslint node: true, browser: true */
/*global EMS */
'use strict';

var video = document.querySelector('article.video > video');
var carousel;
var menu = document.querySelector('[data-action="show-navigation"]');
var logoLink = document.querySelector('a.logo-link');
var carouselLinkContainer = document.querySelector('article.carousel-selector');
var carouselLinks = document.querySelectorAll('article.carousel-selector > a');

video.addEventListener('ended', function () {
    carousel.setVisible(true, true);
    video.removeAttribute('controls');
});

menu.addEventListener('click', function () {
    if (carousel.isVisible) {
        carousel.setVisible(false);
        video.setAttribute('controls', true);
        video.play();
    } else {
        carousel.setVisible(true);
        video.removeAttribute('controls');
        video.pause();
    }
});

logoLink.addEventListener('click', function (ev) {
    ev.preventDefault();

    location.reload();

    return false;
});

function carouselSelectorClicked(ev, link) {
    var videoIndex;

    ev.preventDefault();

    videoIndex = parseInt(link.getAttribute('data-video'), 10);
    carousel.setVideo(videoIndex);

    return false;
}
function carouselSelectorClickHandler(ev) {
    /* jslint validthis: true */
    return carouselSelectorClicked(ev, this);
}

var i;
for (i = 0; i < carouselLinks.length; i += 1) {
    carouselLinks[i].addEventListener('click', carouselSelectorClickHandler);
}

function userSelectedVideo(selectedVideo) {
    carousel.setVisible(false);
    video.setAttribute('controls', true);

    video.src = selectedVideo.video.mp4;
    video.load();
}

var pageIsMobile;
window.setMedia = function (isMobile) {
    if (isMobile && pageIsMobile !== true) {
        pageIsMobile = true;

        menu.style.display = 'none';
        logoLink.style.display = 'none';
        carouselLinkContainer.style.display = '';
    } else if (!isMobile && pageIsMobile !== false) {
        pageIsMobile = false;

        menu.style.display = '';
        logoLink.style.display = '';
        carouselLinkContainer.style.display = 'none';
    }
};

carousel = new (require('./Carousel'))(document.querySelector('article.video > canvas'), window, EMS.carouselVideos, userSelectedVideo);

window.setMedia(false);
window.parent.videoLoaded();
