webpackJsonp([1],{627:function(n,e,t){t(646);var i=t(1)(t(635),t(653),null,null);n.exports=i.exports},629:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"box",props:{gap:String}}},630:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"divider"}},635:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t(62),o=t.n(i),a=t(656),d=t.n(a),c=t(657),u=t.n(c),r=t(18);e.default={components:{XButton:o.a,Box:d.a,Divider:u.a},data:function(){return{sending1:!1,sending2:!1}},mounted:function(){var n=this;r.a.get1().then(function(){n.sending1=!1},function(){n.sending1=!1})},methods:{get1:function(){var n=this;this.sending1=!0,r.a.get1().then(function(){n.sending1=!1},function(){n.sending1=!1})},get2:function(){var n=this;this.sending2=!0,r.a.get2().then(function(){n.sending2=!1},function(){n.sending2=!1})},get3:function(){r.a.get1(),r.a.get1(),r.a.get1()},get4:function(){r.a.get1().then(function(){r.a.get1().then(function(){r.a.get1().then(function(){})})})}}}},640:function(n,e,t){e=n.exports=t(623)(),e.push([n.i,"",""])},642:function(n,e,t){e=n.exports=t(623)(),e.push([n.i,'.vux-divider{display:table;white-space:nowrap;height:auto;overflow:hidden;line-height:1;text-align:center;padding:10px 0;color:#666}.vux-divider:after,.vux-divider:before{content:"";display:table-cell;position:relative;top:50%;width:50%;background-repeat:no-repeat;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC)}.vux-divider:before{background-position:right 1em top 50%}.vux-divider:after{background-position:left 1em top 50%}',""])},646:function(n,e,t){var i=t(640);"string"==typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);t(624)("7e94486d",i,!0)},648:function(n,e,t){var i=t(642);"string"==typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);t(624)("1f51866a",i,!0)},649:function(n,e){n.exports={render:function(){var n=this,e=n.$createElement;return(n._self._c||e)("div",{style:{margin:n.gap}},[n._t("default")],2)},staticRenderFns:[]}},653:function(n,e){n.exports={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"page"},[t("box",{attrs:{gap:"10px 10px"}},[t("divider",[n._v("单个请求")]),n._v(" "),t("x-button",{attrs:{disabled:n.sending1,text:n.sending1?"Loading":"显示Loading"},nativeOn:{click:function(e){n.get1(e)}}}),n._v(" "),t("x-button",{attrs:{disabled:n.sending2,text:n.sending2?"Loading":"不显示Loading"},nativeOn:{click:function(e){n.get2(e)}}}),n._v(" "),t("divider",[n._v("多个请求")]),n._v(" "),t("x-button",{nativeOn:{click:function(e){n.get3(e)}}},[n._v("并发loading")]),n._v(" "),t("x-button",{nativeOn:{click:function(e){n.get4(e)}}},[n._v("串行loading")])],1)],1)},staticRenderFns:[]}},655:function(n,e){n.exports={render:function(){var n=this,e=n.$createElement;return(n._self._c||e)("p",{staticClass:"vux-divider"},[n._t("default")],2)},staticRenderFns:[]}},656:function(n,e,t){var i=t(1)(t(629),t(649),null,null);n.exports=i.exports},657:function(n,e,t){t(648);var i=t(1)(t(630),t(655),null,null);n.exports=i.exports}});