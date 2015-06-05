this["JST"] = this["JST"] || {};

this["JST"]["www/template/listItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="message-item">\n    <h2>' +
((__t = ( title )) == null ? '' : __t) +
'<span class="right-stats">' +
((__t = ( time )) == null ? '' : __t) +
'</span></h2>\n    <p>' +
((__t = ( blurb )) == null ? '' : __t) +
'</p>\n</li>';

}
return __p
};

this["JST"]["www/template/sample.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Foo Bar Sample';

}
return __p
};