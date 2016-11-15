/*jslint node: true, browser: true, bitwise: true */
'use strict';

require('requestAnimationFrame');

function Carousel(canvas, window, buttons, navigateCallback) {
    var self = this;

    self.now = require('performance-now');
    self.lastFrame = null;
    self.canvas = canvas;
    self.window = window;

    self.buttons = buttons;
    self.scroll = 0;
    self.targetScroll = 0;
    self.scrollDivisor = 1000;

    self.buttonLabelImage = document.createElement('img');
    self.buttonLabelImage.src = 'images/ui/label-top.png';

    self.backgroundTimeout = null;

    self.dragStart = 0;
    self.dragScrollStart = 0;
    self.dragMultiplier = 0.005;

    self.isVisible = false;

    self.navigateCallback = navigateCallback;

    self.mouse = {
        pending: { }
    };
    self.canClick = false;
    self.canDrag = false;
    self.isDragging = false;

    self.floatOffset = 0;

    self.initiateCanvas();
    self.startAnimating();
}

Carousel.prototype.startAnimating = function () {
    var self = this;

    (function animation() {
        var nowSeconds = self.now() / 1000,
            delta;
        if (self.lastFrame === null) {
            self.lastFrame = nowSeconds;
            delta = 60 / 1000;
        } else {
            delta = nowSeconds - self.lastFrame;
            self.lastFrame = nowSeconds;
        }

        if (delta > (60 / 1000) * 20) {
            delta = (60 / 1000) * 20;
        }

        if (self.isVisible) {
            self.update(delta);
            self.render();
        }

        self.window.requestAnimationFrame(animation);
    }());
};

Carousel.prototype.initiateCanvas = function () {
    var self = this;

    self.updateCanvas();
    self.window.addEventListener('resize', function () {
        self.updateCanvas();
    });

    self.buttons.forEach(function (button) {
        button.iconImage = document.createElement('img');
        button.iconImage.src = button.icon;
    });

    self.canvas.addEventListener('mouseenter', function (event) { self.mouseUpdate(event, true); });
    self.canvas.addEventListener('mousemove', function (event) { self.mouseUpdate(event, true); });
    self.canvas.addEventListener('mousedown', function (event) { self.mouseUpdate(event, true); });
    self.canvas.addEventListener('mouseup', function (event) { self.mouseUpdate(event, true); });
    self.canvas.addEventListener('mouseleave', function (event) { self.mouseUpdate(event, false); });
};

Carousel.prototype.updateCanvas = function () {
    var self = this;

    self.canvas.position = self.canvas.getBoundingClientRect();
};

Carousel.prototype.setVisible = function (visibility, wasAutomatic) {
    var self = this;

    self.isVisible = visibility;

    if (visibility) {
        self.canvas.classList.remove('inactive');

        if (wasAutomatic) {
            self.canvas.classList.add('solid-background');

            self.scroll = self.targetScroll - 6;
            self.scrollDivisor = 3000;
        } else {
            self.canvas.classList.remove('solid-background');
        }
    } else {
        self.canvas.classList.add('inactive');

        if (self.backgroundTimeout !== null) {
            clearTimeout(self.backgroundTimeout);
        }
        setTimeout(function () {
            self.canvas.classList.remove('solid-background');
        }, 1500);
    }
};

Carousel.prototype.mouseSetCursor = function (cursor) {
    var self = this;

    self.canvas.style.cursor = cursor;
};
Carousel.prototype.mouseSetCanDrag = function () {
    var self = this;

    if (!self.canDrag) {
        self.canDrag = true;
        self.canClick = false;
        self.mouseSetCursor('ew-resize');
    }
};
Carousel.prototype.mouseSetCanClick = function () {
    var self = this;

    if (!self.canClick) {
        self.canClick = true;
        self.canDrag = false;
        self.mouseSetCursor('pointer');
    }
};
Carousel.prototype.mouseUpdate = function (event, isActive) {
    var self = this;

    self.mouse.pending.x = (event.clientX - self.canvas.position.left) / self.canvas.clientWidth * 1920;
    self.mouse.pending.y = (event.clientY - self.canvas.position.top) / self.canvas.clientHeight * 1080;
    self.mouse.pending.left = (event.buttons & 1) === 1;
    self.mouse.pending.right = (event.buttons & 2) === 2;
    self.mouse.pending.middle = (event.buttons & 4) === 4;
    self.mouse.pending.back = (event.buttons & 8) === 8;
    self.mouse.pending.forward = (event.buttons & 16) === 16;
    self.mouse.pending.isActive = isActive;
};
Carousel.prototype.mouseClear = function () {
    var self = this;

    self.mouse.x = self.mouse.pending.x;
    self.mouse.y = self.mouse.pending.y;
    self.mouse.left = self.mouse.pending.left;
    self.mouse.right = self.mouse.pending.right;
    self.mouse.middle = self.mouse.pending.middle;
    self.mouse.back = self.mouse.pending.back;
    self.mouse.forward = self.mouse.pending.forward;
    self.mouse.isActive = self.mouse.pending.isActive;
};

Carousel.prototype.update = function (delta) {
    var self = this, dragDifference;

    self.updateCanvas();

    self.scroll += (self.targetScroll - self.scroll) / (delta * self.scrollDivisor);

    if (Math.abs(self.mouse.x - 1920 / 2) < 275 && Math.abs(self.mouse.y - 1080 / 2) < 275 && !self.isDragging) {
        self.mouseSetCanClick();
    } else {
        self.mouseSetCanDrag();
    }

    if (self.mouse.left && !self.mouse.pending.left && self.canClick) {
        self.setVideo(Math.round(self.scroll));
    }

    if (self.isDragging) {
        self.scrollDivisor = 1000;

        if (self.mouse.left && self.mouse.pending.left) {
            dragDifference = self.mouse.x - self.dragStart;

            self.scroll = self.dragScrollStart - dragDifference * self.dragMultiplier;
            self.targetScroll = self.scroll;
        } else {
            self.targetScroll = Math.round(self.targetScroll);
            self.isDragging = false;
        }
    }
    if (!self.mouse.left && self.mouse.pending.left && self.canDrag) {
        self.isDragging = true;
        self.dragStart = self.mouse.x;
        self.dragScrollStart = self.scroll;
    }

    self.wrapScroll();

    self.floatOffset += delta / 2;
    if (self.floatOffset > Math.PI) {
        self.floatOffset -= Math.PI * 2;
    }

    self.mouseClear();

    return delta;
};

Carousel.prototype.setVideo = function (videoIndex) {
    var self = this;

    self.targetScroll = videoIndex;

    if (self.navigateCallback) {
        self.navigateCallback(self.buttons[Math.round(self.targetScroll)]);
    }
};

Carousel.prototype.wrapScroll = function () {
    var self = this, totalScroll = self.buttons.length;

    while (self.targetScroll <= 0) {
        self.targetScroll += totalScroll;
        self.scroll += totalScroll;
    }
    while (self.targetScroll >= totalScroll) {
        self.targetScroll -= totalScroll;
        self.scroll -= totalScroll;
    }
};

Carousel.prototype.render = function () {
    var self = this,
        ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

    ctx.save();

    self.renderButtons(ctx, self.buttons);
    self.renderTarget(ctx);

    ctx.restore();
};

Carousel.prototype.renderButtons = function (ctx, buttons) {
    var self = this, i, scale,
        scrollAmount, offsetAmount,
        currentButton, currentPercent, currentScale, currentX, currentY, currentFloatY, currentAlpha, currentLabelAlpha;

    scrollAmount = self.scroll / (self.buttons.length);

    ctx.save();
    ctx.translate(self.canvas.width / 2, self.canvas.height / 2);
    scale = Math.min(self.canvas.width, self.canvas.height) / 2;
    ctx.scale(scale, scale);

    for (i = 0; i < buttons.length; i += 1) {
        ctx.save();

        currentPercent = i / (self.buttons.length);

        offsetAmount = currentPercent * -1 - 0.5;

        currentX = Math.sin((scrollAmount + offsetAmount) * Math.PI * 2) * 1.6;
        currentY = (-Math.cos((scrollAmount + offsetAmount) * Math.PI * 2) - 1) * 0.3;
        currentScale = 0.2 + (-Math.cos((scrollAmount + offsetAmount) * Math.PI * 2) + 1) / 3.5;
        currentAlpha = (-Math.cos((scrollAmount + offsetAmount) * Math.PI * 2) + 1) / 2;
        currentLabelAlpha = Math.pow(currentAlpha, 100);

        currentFloatY = (Math.sin(self.floatOffset + (Math.PI * 8 * currentPercent)) / 40);

        ctx.globalAlpha = currentAlpha;
        ctx.translate(currentX, currentY);

        ctx.scale(currentScale, currentScale);

        currentButton = buttons[i];

        self.renderButton(ctx, currentButton, currentFloatY, currentLabelAlpha);

        ctx.restore();
    }

    ctx.restore();
};
Carousel.prototype.renderButton = function (ctx, button, floatOffset, labelAlpha) {
    var self = this,
        labelWidth;

    ctx.save();
    ctx.translate(0, floatOffset);
    ctx.drawImage(button.iconImage, -0.325, -0.325, 0.55, 0.55);
    ctx.restore();

    if (labelAlpha < 0.001) {
        return;
    }
    ctx.globalAlpha = labelAlpha;

    ctx.scale(0.005, 0.005);

    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    labelWidth = ctx.measureText(button.title).width + 40;

    ctx.fillStyle = '#1b4e80';
    ctx.fillRect(-11.5 - labelWidth / 2, 175, labelWidth, 35);
    ctx.drawImage(self.buttonLabelImage, -23.5, 164.4, 24, 10.6);

    ctx.fillStyle = '#fbc22d';
    ctx.fillText(button.title, -11.5, 200);

    ctx.font = '28px Open Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#466fd3';
    ctx.fillText(button.category, -9.8, -175);
};
Carousel.prototype.renderTarget = function (ctx) {
    var self = this,
        size = Math.min(self.canvas.width, self.canvas.height) * 0.275;

    ctx.save();

    ctx.translate(self.canvas.width / 2, self.canvas.height / 2);
    ctx.scale(size, size);

    ctx.lineWidth = size * 0.001;

    ctx.beginPath();
    self.renderTargetArc(ctx, 0.05);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.stroke();

    ctx.beginPath();
    self.renderTargetArc(ctx, 0);
    ctx.strokeStyle = '#fbc22d';
    ctx.stroke();

    ctx.restore();
};

Carousel.prototype.renderTargetArc = function (ctx, offset) {
    ctx.arc(offset - 0.089, offset - 0.02, 0.9, 0, Math.PI * 2);
};

module.exports = Carousel;
