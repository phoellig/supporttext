this["JST"] = this["JST"] || {};

this["JST"]["www/template/_listItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li><a>\n    <h2>' +
((__t = ( message.title )) == null ? '' : __t) +
'</h2>\n    <p>' +
((__t = ( message.blurb )) == null ? '' : __t) +
'</p>\n    <p class="ul-li-aside">' +
((__t = ( message.time )) == null ? '' : __t) +
'</p>\n</a></li>';

}
return __p
};