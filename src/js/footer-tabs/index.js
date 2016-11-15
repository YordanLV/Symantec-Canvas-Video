/*jslint node:true, browser:true */
/*global $, IN*/
'use strict';

var obj = {};

/**
 * FOOTER
 **/

obj.init = function () {
    $('.footer-links .clickable').click(function (event) {
        // Prevent standard action
        event.preventDefault();

        // Hide all tabs
        $('.footer-tabs .tab').each(function () {
            $(this).hide();
        });

        // Show tab
        $('#' + $(this).attr('data-value')).show();

        // Remove highlights
        $('.footer-links .clickable').each(function () {
            $(this).removeClass('active');
        });

        // Highlight selection
        $(this).addClass('active');
    });
};

module.exports = obj;