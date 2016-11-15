/*jslint node: true, browser: true */
/*global EMS */
'use strict';

var $ = require('jquery');
window.$ = $;
window.jQuery = $;

var //form = require('./form'),
    footerTabs = require('./footer-tabs'),
    //linkedIn = require('./linked-in'),
    addThis = require('./add-this');

footerTabs.init();