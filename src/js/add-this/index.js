/*jslint node:true, browser:true */
/*global $, addthis*/
'use strict';
/**
 * ----- ADDTHIS -----
 *
 * Update these variables to language share options:
 * - ui_language : get from http://support.addthis.com/customer/portal/articles/381240-languages
 * - url : Campaign sharing URL (normally /social version)
 * - title : Sharing title, used on all sharing platforms
 * - description : Sharing description, NOT used on Twitter
 */

var obj = {};

obj.init = function (ui_language, url, title, description) {
    window.addthis_config = {
        "data_track_addressbar": true,
        "data_track_clickback": true,
        data_ga_property: 'UA-9852407-33',
        data_ga_social: true,
        ui_language: ui_language
    };
    window.addthis_share = {
        passthrough: {
            twitter: {
                via: "NortonSecured",
                text: title
            }
        },
        url: url,
        title: title,
        description: description
    };

    addthis.layers({
        'theme': 'dark',
        'share': {
            'position': 'left',
            'services': 'facebook,linkedin,twitter,google_plusone_share,more',
            'postShareRecommendedMsg': ''
        }
    });
};

module.exports = obj;