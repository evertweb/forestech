import{a as Z,g as Nh,f as La,y as Oh,F as Fh,L as Hp,n as ye,d as Ss,i as Vs,p as Ua,u as Mh,z as Lh,A as Xp,B as Jp,D as Yp,c as xi,G as Uh,H as qh,S as Bh,v as jh,C as zh,w as Di,_ as Gh}from"./firebase-core-DPBV3M-Z.js";var nl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ue,$h;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(I,_){function T(){}T.prototype=_.prototype,I.D=_.prototype,I.prototype=new T,I.prototype.constructor=I,I.C=function(E,v,P){for(var y=Array(arguments.length-2),pe=2;pe<arguments.length;pe++)y[pe-2]=arguments[pe];return _.prototype[v].apply(E,y)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(n,e),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,_,T){T||(T=0);var E=Array(16);if(typeof _=="string")for(var v=0;16>v;++v)E[v]=_.charCodeAt(T++)|_.charCodeAt(T++)<<8|_.charCodeAt(T++)<<16|_.charCodeAt(T++)<<24;else for(v=0;16>v;++v)E[v]=_[T++]|_[T++]<<8|_[T++]<<16|_[T++]<<24;_=I.g[0],T=I.g[1],v=I.g[2];var P=I.g[3],y=_+(P^T&(v^P))+E[0]+3614090360&4294967295;_=T+(y<<7&4294967295|y>>>25),y=P+(v^_&(T^v))+E[1]+3905402710&4294967295,P=_+(y<<12&4294967295|y>>>20),y=v+(T^P&(_^T))+E[2]+606105819&4294967295,v=P+(y<<17&4294967295|y>>>15),y=T+(_^v&(P^_))+E[3]+3250441966&4294967295,T=v+(y<<22&4294967295|y>>>10),y=_+(P^T&(v^P))+E[4]+4118548399&4294967295,_=T+(y<<7&4294967295|y>>>25),y=P+(v^_&(T^v))+E[5]+1200080426&4294967295,P=_+(y<<12&4294967295|y>>>20),y=v+(T^P&(_^T))+E[6]+2821735955&4294967295,v=P+(y<<17&4294967295|y>>>15),y=T+(_^v&(P^_))+E[7]+4249261313&4294967295,T=v+(y<<22&4294967295|y>>>10),y=_+(P^T&(v^P))+E[8]+1770035416&4294967295,_=T+(y<<7&4294967295|y>>>25),y=P+(v^_&(T^v))+E[9]+2336552879&4294967295,P=_+(y<<12&4294967295|y>>>20),y=v+(T^P&(_^T))+E[10]+4294925233&4294967295,v=P+(y<<17&4294967295|y>>>15),y=T+(_^v&(P^_))+E[11]+2304563134&4294967295,T=v+(y<<22&4294967295|y>>>10),y=_+(P^T&(v^P))+E[12]+1804603682&4294967295,_=T+(y<<7&4294967295|y>>>25),y=P+(v^_&(T^v))+E[13]+4254626195&4294967295,P=_+(y<<12&4294967295|y>>>20),y=v+(T^P&(_^T))+E[14]+2792965006&4294967295,v=P+(y<<17&4294967295|y>>>15),y=T+(_^v&(P^_))+E[15]+1236535329&4294967295,T=v+(y<<22&4294967295|y>>>10),y=_+(v^P&(T^v))+E[1]+4129170786&4294967295,_=T+(y<<5&4294967295|y>>>27),y=P+(T^v&(_^T))+E[6]+3225465664&4294967295,P=_+(y<<9&4294967295|y>>>23),y=v+(_^T&(P^_))+E[11]+643717713&4294967295,v=P+(y<<14&4294967295|y>>>18),y=T+(P^_&(v^P))+E[0]+3921069994&4294967295,T=v+(y<<20&4294967295|y>>>12),y=_+(v^P&(T^v))+E[5]+3593408605&4294967295,_=T+(y<<5&4294967295|y>>>27),y=P+(T^v&(_^T))+E[10]+38016083&4294967295,P=_+(y<<9&4294967295|y>>>23),y=v+(_^T&(P^_))+E[15]+3634488961&4294967295,v=P+(y<<14&4294967295|y>>>18),y=T+(P^_&(v^P))+E[4]+3889429448&4294967295,T=v+(y<<20&4294967295|y>>>12),y=_+(v^P&(T^v))+E[9]+568446438&4294967295,_=T+(y<<5&4294967295|y>>>27),y=P+(T^v&(_^T))+E[14]+3275163606&4294967295,P=_+(y<<9&4294967295|y>>>23),y=v+(_^T&(P^_))+E[3]+4107603335&4294967295,v=P+(y<<14&4294967295|y>>>18),y=T+(P^_&(v^P))+E[8]+1163531501&4294967295,T=v+(y<<20&4294967295|y>>>12),y=_+(v^P&(T^v))+E[13]+2850285829&4294967295,_=T+(y<<5&4294967295|y>>>27),y=P+(T^v&(_^T))+E[2]+4243563512&4294967295,P=_+(y<<9&4294967295|y>>>23),y=v+(_^T&(P^_))+E[7]+1735328473&4294967295,v=P+(y<<14&4294967295|y>>>18),y=T+(P^_&(v^P))+E[12]+2368359562&4294967295,T=v+(y<<20&4294967295|y>>>12),y=_+(T^v^P)+E[5]+4294588738&4294967295,_=T+(y<<4&4294967295|y>>>28),y=P+(_^T^v)+E[8]+2272392833&4294967295,P=_+(y<<11&4294967295|y>>>21),y=v+(P^_^T)+E[11]+1839030562&4294967295,v=P+(y<<16&4294967295|y>>>16),y=T+(v^P^_)+E[14]+4259657740&4294967295,T=v+(y<<23&4294967295|y>>>9),y=_+(T^v^P)+E[1]+2763975236&4294967295,_=T+(y<<4&4294967295|y>>>28),y=P+(_^T^v)+E[4]+1272893353&4294967295,P=_+(y<<11&4294967295|y>>>21),y=v+(P^_^T)+E[7]+4139469664&4294967295,v=P+(y<<16&4294967295|y>>>16),y=T+(v^P^_)+E[10]+3200236656&4294967295,T=v+(y<<23&4294967295|y>>>9),y=_+(T^v^P)+E[13]+681279174&4294967295,_=T+(y<<4&4294967295|y>>>28),y=P+(_^T^v)+E[0]+3936430074&4294967295,P=_+(y<<11&4294967295|y>>>21),y=v+(P^_^T)+E[3]+3572445317&4294967295,v=P+(y<<16&4294967295|y>>>16),y=T+(v^P^_)+E[6]+76029189&4294967295,T=v+(y<<23&4294967295|y>>>9),y=_+(T^v^P)+E[9]+3654602809&4294967295,_=T+(y<<4&4294967295|y>>>28),y=P+(_^T^v)+E[12]+3873151461&4294967295,P=_+(y<<11&4294967295|y>>>21),y=v+(P^_^T)+E[15]+530742520&4294967295,v=P+(y<<16&4294967295|y>>>16),y=T+(v^P^_)+E[2]+3299628645&4294967295,T=v+(y<<23&4294967295|y>>>9),y=_+(v^(T|~P))+E[0]+4096336452&4294967295,_=T+(y<<6&4294967295|y>>>26),y=P+(T^(_|~v))+E[7]+1126891415&4294967295,P=_+(y<<10&4294967295|y>>>22),y=v+(_^(P|~T))+E[14]+2878612391&4294967295,v=P+(y<<15&4294967295|y>>>17),y=T+(P^(v|~_))+E[5]+4237533241&4294967295,T=v+(y<<21&4294967295|y>>>11),y=_+(v^(T|~P))+E[12]+1700485571&4294967295,_=T+(y<<6&4294967295|y>>>26),y=P+(T^(_|~v))+E[3]+2399980690&4294967295,P=_+(y<<10&4294967295|y>>>22),y=v+(_^(P|~T))+E[10]+4293915773&4294967295,v=P+(y<<15&4294967295|y>>>17),y=T+(P^(v|~_))+E[1]+2240044497&4294967295,T=v+(y<<21&4294967295|y>>>11),y=_+(v^(T|~P))+E[8]+1873313359&4294967295,_=T+(y<<6&4294967295|y>>>26),y=P+(T^(_|~v))+E[15]+4264355552&4294967295,P=_+(y<<10&4294967295|y>>>22),y=v+(_^(P|~T))+E[6]+2734768916&4294967295,v=P+(y<<15&4294967295|y>>>17),y=T+(P^(v|~_))+E[13]+1309151649&4294967295,T=v+(y<<21&4294967295|y>>>11),y=_+(v^(T|~P))+E[4]+4149444226&4294967295,_=T+(y<<6&4294967295|y>>>26),y=P+(T^(_|~v))+E[11]+3174756917&4294967295,P=_+(y<<10&4294967295|y>>>22),y=v+(_^(P|~T))+E[2]+718787259&4294967295,v=P+(y<<15&4294967295|y>>>17),y=T+(P^(v|~_))+E[9]+3951481745&4294967295,I.g[0]=I.g[0]+_&4294967295,I.g[1]=I.g[1]+(v+(y<<21&4294967295|y>>>11))&4294967295,I.g[2]=I.g[2]+v&4294967295,I.g[3]=I.g[3]+P&4294967295}n.prototype.u=function(I,_){_===void 0&&(_=I.length);for(var T=_-this.blockSize,E=this.B,v=this.h,P=0;P<_;){if(v==0)for(;P<=T;)s(this,I,P),P+=this.blockSize;if(typeof I=="string"){for(;P<_;)if(E[v++]=I.charCodeAt(P++),v==this.blockSize){s(this,E),v=0;break}}else for(;P<_;)if(E[v++]=I[P++],v==this.blockSize){s(this,E),v=0;break}}this.h=v,this.o+=_},n.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var _=1;_<I.length-8;++_)I[_]=0;var T=8*this.o;for(_=I.length-8;_<I.length;++_)I[_]=T&255,T/=256;for(this.u(I),I=Array(16),_=T=0;4>_;++_)for(var E=0;32>E;E+=8)I[T++]=this.g[_]>>>E&255;return I};function i(I,_){var T=u;return Object.prototype.hasOwnProperty.call(T,I)?T[I]:T[I]=_(I)}function o(I,_){this.h=_;for(var T=[],E=!0,v=I.length-1;0<=v;v--){var P=I[v]|0;E&&P==_||(T[v]=P,E=!1)}this.g=T}var u={};function c(I){return-128<=I&&128>I?i(I,function(_){return new o([_|0],0>_?-1:0)}):new o([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return m;if(0>I)return C(h(-I));for(var _=[],T=1,E=0;I>=T;E++)_[E]=I/T|0,T*=4294967296;return new o(_,0)}function f(I,_){if(I.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(I.charAt(0)=="-")return C(f(I.substring(1),_));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var T=h(Math.pow(_,8)),E=m,v=0;v<I.length;v+=8){var P=Math.min(8,I.length-v),y=parseInt(I.substring(v,v+P),_);8>P?(P=h(Math.pow(_,P)),E=E.j(P).add(h(y))):(E=E.j(T),E=E.add(h(y)))}return E}var m=c(0),g=c(1),w=c(16777216);r=o.prototype,r.m=function(){if(x(this))return-C(this).m();for(var I=0,_=1,T=0;T<this.g.length;T++){var E=this.i(T);I+=(0<=E?E:4294967296+E)*_,_*=4294967296}return I},r.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(S(this))return"0";if(x(this))return"-"+C(this).toString(I);for(var _=h(Math.pow(I,6)),T=this,E="";;){var v=z(T,_).g;T=L(T,v.j(_));var P=((0<T.g.length?T.g[0]:T.h)>>>0).toString(I);if(T=v,S(T))return P+E;for(;6>P.length;)P="0"+P;E=P+E}},r.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function S(I){if(I.h!=0)return!1;for(var _=0;_<I.g.length;_++)if(I.g[_]!=0)return!1;return!0}function x(I){return I.h==-1}r.l=function(I){return I=L(this,I),x(I)?-1:S(I)?0:1};function C(I){for(var _=I.g.length,T=[],E=0;E<_;E++)T[E]=~I.g[E];return new o(T,~I.h).add(g)}r.abs=function(){return x(this)?C(this):this},r.add=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],E=0,v=0;v<=_;v++){var P=E+(this.i(v)&65535)+(I.i(v)&65535),y=(P>>>16)+(this.i(v)>>>16)+(I.i(v)>>>16);E=y>>>16,P&=65535,y&=65535,T[v]=y<<16|P}return new o(T,T[T.length-1]&-2147483648?-1:0)};function L(I,_){return I.add(C(_))}r.j=function(I){if(S(this)||S(I))return m;if(x(this))return x(I)?C(this).j(C(I)):C(C(this).j(I));if(x(I))return C(this.j(C(I)));if(0>this.l(w)&&0>I.l(w))return h(this.m()*I.m());for(var _=this.g.length+I.g.length,T=[],E=0;E<2*_;E++)T[E]=0;for(E=0;E<this.g.length;E++)for(var v=0;v<I.g.length;v++){var P=this.i(E)>>>16,y=this.i(E)&65535,pe=I.i(v)>>>16,Dr=I.i(v)&65535;T[2*E+2*v]+=y*Dr,q(T,2*E+2*v),T[2*E+2*v+1]+=P*Dr,q(T,2*E+2*v+1),T[2*E+2*v+1]+=y*pe,q(T,2*E+2*v+1),T[2*E+2*v+2]+=P*pe,q(T,2*E+2*v+2)}for(E=0;E<_;E++)T[E]=T[2*E+1]<<16|T[2*E];for(E=_;E<2*_;E++)T[E]=0;return new o(T,0)};function q(I,_){for(;(I[_]&65535)!=I[_];)I[_+1]+=I[_]>>>16,I[_]&=65535,_++}function M(I,_){this.g=I,this.h=_}function z(I,_){if(S(_))throw Error("division by zero");if(S(I))return new M(m,m);if(x(I))return _=z(C(I),_),new M(C(_.g),C(_.h));if(x(_))return _=z(I,C(_)),new M(C(_.g),_.h);if(30<I.g.length){if(x(I)||x(_))throw Error("slowDivide_ only works with positive integers.");for(var T=g,E=_;0>=E.l(I);)T=H(T),E=H(E);var v=$(T,1),P=$(E,1);for(E=$(E,2),T=$(T,2);!S(E);){var y=P.add(E);0>=y.l(I)&&(v=v.add(T),P=y),E=$(E,1),T=$(T,1)}return _=L(I,v.j(_)),new M(v,_)}for(v=m;0<=I.l(_);){for(T=Math.max(1,Math.floor(I.m()/_.m())),E=Math.ceil(Math.log(T)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),P=h(T),y=P.j(_);x(y)||0<y.l(I);)T-=E,P=h(T),y=P.j(_);S(P)&&(P=g),v=v.add(P),I=L(I,y)}return new M(v,I)}r.A=function(I){return z(this,I).h},r.and=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],E=0;E<_;E++)T[E]=this.i(E)&I.i(E);return new o(T,this.h&I.h)},r.or=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],E=0;E<_;E++)T[E]=this.i(E)|I.i(E);return new o(T,this.h|I.h)},r.xor=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],E=0;E<_;E++)T[E]=this.i(E)^I.i(E);return new o(T,this.h^I.h)};function H(I){for(var _=I.g.length+1,T=[],E=0;E<_;E++)T[E]=I.i(E)<<1|I.i(E-1)>>>31;return new o(T,I.h)}function $(I,_){var T=_>>5;_%=32;for(var E=I.g.length-T,v=[],P=0;P<E;P++)v[P]=0<_?I.i(P+T)>>>_|I.i(P+T+1)<<32-_:I.i(P+T);return new o(v,I.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,$h=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Ue=o}).apply(typeof nl<"u"?nl:typeof self<"u"?self:typeof window<"u"?window:{});var hi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Kh,es,Qh,Ei,ua,Wh,Hh,Xh;(function(){var r,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,l,d){return a==Array.prototype||a==Object.prototype||(a[l]=d.value),a};function e(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof hi=="object"&&hi];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=e(this);function s(a,l){if(l)t:{var d=n;a=a.split(".");for(var p=0;p<a.length-1;p++){var R=a[p];if(!(R in d))break t;d=d[R]}a=a[a.length-1],p=d[a],l=l(p),l!=p&&l!=null&&t(d,a,{configurable:!0,writable:!0,value:l})}}function i(a,l){a instanceof String&&(a+="");var d=0,p=!1,R={next:function(){if(!p&&d<a.length){var V=d++;return{value:l(V,a[V]),done:!1}}return p=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}s("Array.prototype.values",function(a){return a||function(){return i(this,function(l,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},u=this||self;function c(a){var l=typeof a;return l=l!="object"?l:a?Array.isArray(a)?"array":l:"null",l=="array"||l=="object"&&typeof a.length=="number"}function h(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function f(a,l,d){return a.call.apply(a.bind,arguments)}function m(a,l,d){if(!a)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,p),a.apply(l,R)}}return function(){return a.apply(l,arguments)}}function g(a,l,d){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,g.apply(null,arguments)}function w(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function S(a,l){function d(){}d.prototype=l.prototype,a.aa=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(p,R,V){for(var F=Array(arguments.length-2),it=2;it<arguments.length;it++)F[it-2]=arguments[it];return l.prototype[R].apply(p,F)}}function x(a){const l=a.length;if(0<l){const d=Array(l);for(let p=0;p<l;p++)d[p]=a[p];return d}return[]}function C(a,l){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(c(p)){const R=a.length||0,V=p.length||0;a.length=R+V;for(let F=0;F<V;F++)a[R+F]=p[F]}else a.push(p)}}class L{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function q(a){return/^[\s\xa0]*$/.test(a)}function M(){var a=u.navigator;return a&&(a=a.userAgent)?a:""}function z(a){return z[" "](a),a}z[" "]=function(){};var H=M().indexOf("Gecko")!=-1&&!(M().toLowerCase().indexOf("webkit")!=-1&&M().indexOf("Edge")==-1)&&!(M().indexOf("Trident")!=-1||M().indexOf("MSIE")!=-1)&&M().indexOf("Edge")==-1;function $(a,l,d){for(const p in a)l.call(d,a[p],p,a)}function I(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function _(a){const l={};for(const d in a)l[d]=a[d];return l}const T="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(a,l){let d,p;for(let R=1;R<arguments.length;R++){p=arguments[R];for(d in p)a[d]=p[d];for(let V=0;V<T.length;V++)d=T[V],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function v(a){var l=1;a=a.split(":");const d=[];for(;0<l&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function P(a){u.setTimeout(()=>{throw a},0)}function y(){var a=Po;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class pe{constructor(){this.h=this.g=null}add(l,d){const p=Dr.get();p.set(l,d),this.h?this.h.next=p:this.g=p,this.h=p}}var Dr=new L(()=>new mp,a=>a.reset());class mp{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let kr,Nr=!1,Po=new pe,nc=()=>{const a=u.Promise.resolve(void 0);kr=()=>{a.then(pp)}};var pp=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){P(d)}var l=Dr;l.j(a),100>l.h&&(l.h++,a.next=l.g,l.g=a)}Nr=!1};function Se(){this.s=this.s,this.C=this.C}Se.prototype.s=!1,Se.prototype.ma=function(){this.s||(this.s=!0,this.N())},Se.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Vt(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}Vt.prototype.h=function(){this.defaultPrevented=!0};var gp=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};u.addEventListener("test",d,l),u.removeEventListener("test",d,l)}catch{}return a}();function Or(a,l){if(Vt.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget){if(H){t:{try{z(l.nodeName);var R=!0;break t}catch{}R=!1}R||(l=null)}}else d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement);this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:_p[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Or.aa.h.call(this)}}S(Or,Vt);var _p={2:"touch",3:"pen",4:"mouse"};Or.prototype.h=function(){Or.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ks="closure_listenable_"+(1e6*Math.random()|0),yp=0;function Tp(a,l,d,p,R){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!p,this.ha=R,this.key=++yp,this.da=this.fa=!1}function Qs(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Ws(a){this.src=a,this.g={},this.h=0}Ws.prototype.add=function(a,l,d,p,R){var V=a.toString();a=this.g[V],a||(a=this.g[V]=[],this.h++);var F=Vo(a,l,p,R);return-1<F?(l=a[F],d||(l.fa=!1)):(l=new Tp(l,this.src,V,!!p,R),l.fa=d,a.push(l)),l};function So(a,l){var d=l.type;if(d in a.g){var p=a.g[d],R=Array.prototype.indexOf.call(p,l,void 0),V;(V=0<=R)&&Array.prototype.splice.call(p,R,1),V&&(Qs(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function Vo(a,l,d,p){for(var R=0;R<a.length;++R){var V=a[R];if(!V.da&&V.listener==l&&V.capture==!!d&&V.ha==p)return R}return-1}var Co="closure_lm_"+(1e6*Math.random()|0),xo={};function rc(a,l,d,p,R){if(Array.isArray(l)){for(var V=0;V<l.length;V++)rc(a,l[V],d,p,R);return null}return d=oc(d),a&&a[Ks]?a.K(l,d,h(p)?!!p.capture:!1,R):Ip(a,l,d,!1,p,R)}function Ip(a,l,d,p,R,V){if(!l)throw Error("Invalid event type");var F=h(R)?!!R.capture:!!R,it=ko(a);if(it||(a[Co]=it=new Ws(a)),d=it.add(l,d,p,F,V),d.proxy)return d;if(p=Ep(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)gp||(R=F),R===void 0&&(R=!1),a.addEventListener(l.toString(),p,R);else if(a.attachEvent)a.attachEvent(ic(l.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Ep(){function a(d){return l.call(a.src,a.listener,d)}const l=wp;return a}function sc(a,l,d,p,R){if(Array.isArray(l))for(var V=0;V<l.length;V++)sc(a,l[V],d,p,R);else p=h(p)?!!p.capture:!!p,d=oc(d),a&&a[Ks]?(a=a.i,l=String(l).toString(),l in a.g&&(V=a.g[l],d=Vo(V,d,p,R),-1<d&&(Qs(V[d]),Array.prototype.splice.call(V,d,1),V.length==0&&(delete a.g[l],a.h--)))):a&&(a=ko(a))&&(l=a.g[l.toString()],a=-1,l&&(a=Vo(l,d,p,R)),(d=-1<a?l[a]:null)&&Do(d))}function Do(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[Ks])So(l.i,a);else{var d=a.type,p=a.proxy;l.removeEventListener?l.removeEventListener(d,p,a.capture):l.detachEvent?l.detachEvent(ic(d),p):l.addListener&&l.removeListener&&l.removeListener(p),(d=ko(l))?(So(d,a),d.h==0&&(d.src=null,l[Co]=null)):Qs(a)}}}function ic(a){return a in xo?xo[a]:xo[a]="on"+a}function wp(a,l){if(a.da)a=!0;else{l=new Or(l,this);var d=a.listener,p=a.ha||a.src;a.fa&&Do(a),a=d.call(p,l)}return a}function ko(a){return a=a[Co],a instanceof Ws?a:null}var No="__closure_events_fn_"+(1e9*Math.random()>>>0);function oc(a){return typeof a=="function"?a:(a[No]||(a[No]=function(l){return a.handleEvent(l)}),a[No])}function Ct(){Se.call(this),this.i=new Ws(this),this.M=this,this.F=null}S(Ct,Se),Ct.prototype[Ks]=!0,Ct.prototype.removeEventListener=function(a,l,d,p){sc(this,a,l,d,p)};function Ut(a,l){var d,p=a.F;if(p)for(d=[];p;p=p.F)d.push(p);if(a=a.M,p=l.type||l,typeof l=="string")l=new Vt(l,a);else if(l instanceof Vt)l.target=l.target||a;else{var R=l;l=new Vt(p,a),E(l,R)}if(R=!0,d)for(var V=d.length-1;0<=V;V--){var F=l.g=d[V];R=Hs(F,p,!0,l)&&R}if(F=l.g=a,R=Hs(F,p,!0,l)&&R,R=Hs(F,p,!1,l)&&R,d)for(V=0;V<d.length;V++)F=l.g=d[V],R=Hs(F,p,!1,l)&&R}Ct.prototype.N=function(){if(Ct.aa.N.call(this),this.i){var a=this.i,l;for(l in a.g){for(var d=a.g[l],p=0;p<d.length;p++)Qs(d[p]);delete a.g[l],a.h--}}this.F=null},Ct.prototype.K=function(a,l,d,p){return this.i.add(String(a),l,!1,d,p)},Ct.prototype.L=function(a,l,d,p){return this.i.add(String(a),l,!0,d,p)};function Hs(a,l,d,p){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();for(var R=!0,V=0;V<l.length;++V){var F=l[V];if(F&&!F.da&&F.capture==d){var it=F.listener,bt=F.ha||F.src;F.fa&&So(a.i,F),R=it.call(bt,p)!==!1&&R}}return R&&!p.defaultPrevented}function ac(a,l,d){if(typeof a=="function")d&&(a=g(a,d));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:u.setTimeout(a,l||0)}function uc(a){a.g=ac(()=>{a.g=null,a.i&&(a.i=!1,uc(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class vp extends Se{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:uc(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Fr(a){Se.call(this),this.h=a,this.g={}}S(Fr,Se);var cc=[];function lc(a){$(a.g,function(l,d){this.g.hasOwnProperty(d)&&Do(l)},a),a.g={}}Fr.prototype.N=function(){Fr.aa.N.call(this),lc(this)},Fr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Oo=u.JSON.stringify,Ap=u.JSON.parse,Rp=class{stringify(a){return u.JSON.stringify(a,void 0)}parse(a){return u.JSON.parse(a,void 0)}};function Fo(){}Fo.prototype.h=null;function hc(a){return a.h||(a.h=a.i())}function dc(){}var Mr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Mo(){Vt.call(this,"d")}S(Mo,Vt);function Lo(){Vt.call(this,"c")}S(Lo,Vt);var rn={},fc=null;function Xs(){return fc=fc||new Ct}rn.La="serverreachability";function mc(a){Vt.call(this,rn.La,a)}S(mc,Vt);function Lr(a){const l=Xs();Ut(l,new mc(l))}rn.STAT_EVENT="statevent";function pc(a,l){Vt.call(this,rn.STAT_EVENT,a),this.stat=l}S(pc,Vt);function qt(a){const l=Xs();Ut(l,new pc(l,a))}rn.Ma="timingevent";function gc(a,l){Vt.call(this,rn.Ma,a),this.size=l}S(gc,Vt);function Ur(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){a()},l)}function qr(){this.g=!0}qr.prototype.xa=function(){this.g=!1};function bp(a,l,d,p,R,V){a.info(function(){if(a.g)if(V)for(var F="",it=V.split("&"),bt=0;bt<it.length;bt++){var Y=it[bt].split("=");if(1<Y.length){var xt=Y[0];Y=Y[1];var Dt=xt.split("_");F=2<=Dt.length&&Dt[1]=="type"?F+(xt+"="+Y+"&"):F+(xt+"=redacted&")}}else F=null;else F=V;return"XMLHTTP REQ ("+p+") [attempt "+R+"]: "+l+`
`+d+`
`+F})}function Pp(a,l,d,p,R,V,F){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+R+"]: "+l+`
`+d+`
`+V+" "+F})}function On(a,l,d,p){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+Vp(a,d)+(p?" "+p:"")})}function Sp(a,l){a.info(function(){return"TIMEOUT: "+l})}qr.prototype.info=function(){};function Vp(a,l){if(!a.g)return l;if(!l)return null;try{var d=JSON.parse(l);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var p=d[a];if(!(2>p.length)){var R=p[1];if(Array.isArray(R)&&!(1>R.length)){var V=R[0];if(V!="noop"&&V!="stop"&&V!="close")for(var F=1;F<R.length;F++)R[F]=""}}}}return Oo(d)}catch{return l}}var Js={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},_c={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Uo;function Ys(){}S(Ys,Fo),Ys.prototype.g=function(){return new XMLHttpRequest},Ys.prototype.i=function(){return{}},Uo=new Ys;function Ve(a,l,d,p){this.j=a,this.i=l,this.l=d,this.R=p||1,this.U=new Fr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new yc}function yc(){this.i=null,this.g="",this.h=!1}var Tc={},qo={};function Bo(a,l,d){a.L=1,a.v=ni(ge(l)),a.m=d,a.P=!0,Ic(a,null)}function Ic(a,l){a.F=Date.now(),Zs(a),a.A=ge(a.v);var d=a.A,p=a.R;Array.isArray(p)||(p=[String(p)]),Nc(d.i,"t",p),a.C=0,d=a.j.J,a.h=new yc,a.g=Yc(a.j,d?l:null,!a.m),0<a.O&&(a.M=new vp(g(a.Y,a,a.g),a.O)),l=a.U,d=a.g,p=a.ca;var R="readystatechange";Array.isArray(R)||(R&&(cc[0]=R.toString()),R=cc);for(var V=0;V<R.length;V++){var F=rc(d,R[V],p||l.handleEvent,!1,l.h||l);if(!F)break;l.g[F.key]=F}l=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,l)):(a.u="GET",a.g.ea(a.A,a.u,null,l)),Lr(),bp(a.i,a.u,a.A,a.l,a.R,a.m)}Ve.prototype.ca=function(a){a=a.target;const l=this.M;l&&_e(a)==3?l.j():this.Y(a)},Ve.prototype.Y=function(a){try{if(a==this.g)t:{const Dt=_e(this.g);var l=this.g.Ba();const Ln=this.g.Z();if(!(3>Dt)&&(Dt!=3||this.g&&(this.h.h||this.g.oa()||Bc(this.g)))){this.J||Dt!=4||l==7||(l==8||0>=Ln?Lr(3):Lr(2)),jo(this);var d=this.g.Z();this.X=d;e:if(Ec(this)){var p=Bc(this.g);a="";var R=p.length,V=_e(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){sn(this),Br(this);var F="";break e}this.h.i=new u.TextDecoder}for(l=0;l<R;l++)this.h.h=!0,a+=this.h.i.decode(p[l],{stream:!(V&&l==R-1)});p.length=0,this.h.g+=a,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=d==200,Pp(this.i,this.u,this.A,this.l,this.R,Dt,d),this.o){if(this.T&&!this.K){e:{if(this.g){var it,bt=this.g;if((it=bt.g?bt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!q(it)){var Y=it;break e}}Y=null}if(d=Y)On(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,zo(this,d);else{this.o=!1,this.s=3,qt(12),sn(this),Br(this);break t}}if(this.P){d=!0;let te;for(;!this.J&&this.C<F.length;)if(te=Cp(this,F),te==qo){Dt==4&&(this.s=4,qt(14),d=!1),On(this.i,this.l,null,"[Incomplete Response]");break}else if(te==Tc){this.s=4,qt(15),On(this.i,this.l,F,"[Invalid Chunk]"),d=!1;break}else On(this.i,this.l,te,null),zo(this,te);if(Ec(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Dt!=4||F.length!=0||this.h.h||(this.s=1,qt(16),d=!1),this.o=this.o&&d,!d)On(this.i,this.l,F,"[Invalid Chunked Response]"),sn(this),Br(this);else if(0<F.length&&!this.W){this.W=!0;var xt=this.j;xt.g==this&&xt.ba&&!xt.M&&(xt.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),Ho(xt),xt.M=!0,qt(11))}}else On(this.i,this.l,F,null),zo(this,F);Dt==4&&sn(this),this.o&&!this.J&&(Dt==4?Wc(this.j,this):(this.o=!1,Zs(this)))}else Qp(this.g),d==400&&0<F.indexOf("Unknown SID")?(this.s=3,qt(12)):(this.s=0,qt(13)),sn(this),Br(this)}}}catch{}finally{}};function Ec(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Cp(a,l){var d=a.C,p=l.indexOf(`
`,d);return p==-1?qo:(d=Number(l.substring(d,p)),isNaN(d)?Tc:(p+=1,p+d>l.length?qo:(l=l.slice(p,p+d),a.C=p+d,l)))}Ve.prototype.cancel=function(){this.J=!0,sn(this)};function Zs(a){a.S=Date.now()+a.I,wc(a,a.I)}function wc(a,l){if(a.B!=null)throw Error("WatchDog timer not null");a.B=Ur(g(a.ba,a),l)}function jo(a){a.B&&(u.clearTimeout(a.B),a.B=null)}Ve.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Sp(this.i,this.A),this.L!=2&&(Lr(),qt(17)),sn(this),this.s=2,Br(this)):wc(this,this.S-a)};function Br(a){a.j.G==0||a.J||Wc(a.j,a)}function sn(a){jo(a);var l=a.M;l&&typeof l.ma=="function"&&l.ma(),a.M=null,lc(a.U),a.g&&(l=a.g,a.g=null,l.abort(),l.ma())}function zo(a,l){try{var d=a.j;if(d.G!=0&&(d.g==a||Go(d.h,a))){if(!a.K&&Go(d.h,a)&&d.G==3){try{var p=d.Da.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var R=p;if(R[0]==0){t:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)ui(d),oi(d);else break t;Wo(d),qt(18)}}else d.za=R[1],0<d.za-d.T&&37500>R[2]&&d.F&&d.v==0&&!d.C&&(d.C=Ur(g(d.Za,d),6e3));if(1>=Rc(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else an(d,11)}else if((a.K||d.g==a)&&ui(d),!q(l))for(R=d.Da.g.parse(l),l=0;l<R.length;l++){let Y=R[l];if(d.T=Y[0],Y=Y[1],d.G==2)if(Y[0]=="c"){d.K=Y[1],d.ia=Y[2];const xt=Y[3];xt!=null&&(d.la=xt,d.j.info("VER="+d.la));const Dt=Y[4];Dt!=null&&(d.Aa=Dt,d.j.info("SVER="+d.Aa));const Ln=Y[5];Ln!=null&&typeof Ln=="number"&&0<Ln&&(p=1.5*Ln,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const te=a.g;if(te){const li=te.g?te.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(li){var V=p.h;V.g||li.indexOf("spdy")==-1&&li.indexOf("quic")==-1&&li.indexOf("h2")==-1||(V.j=V.l,V.g=new Set,V.h&&($o(V,V.h),V.h=null))}if(p.D){const Xo=te.g?te.g.getResponseHeader("X-HTTP-Session-Id"):null;Xo&&(p.ya=Xo,ut(p.I,p.D,Xo))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var F=a;if(p.qa=Jc(p,p.J?p.ia:null,p.W),F.K){bc(p.h,F);var it=F,bt=p.L;bt&&(it.I=bt),it.B&&(jo(it),Zs(it)),p.g=F}else Kc(p);0<d.i.length&&ai(d)}else Y[0]!="stop"&&Y[0]!="close"||an(d,7);else d.G==3&&(Y[0]=="stop"||Y[0]=="close"?Y[0]=="stop"?an(d,7):Qo(d):Y[0]!="noop"&&d.l&&d.l.ta(Y),d.v=0)}}Lr(4)}catch{}}var xp=class{constructor(a,l){this.g=a,this.map=l}};function vc(a){this.l=a||10,u.PerformanceNavigationTiming?(a=u.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ac(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Rc(a){return a.h?1:a.g?a.g.size:0}function Go(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function $o(a,l){a.g?a.g.add(l):a.h=l}function bc(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}vc.prototype.cancel=function(){if(this.i=Pc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Pc(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.D);return l}return x(a.i)}function Dp(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var l=[],d=a.length,p=0;p<d;p++)l.push(a[p]);return l}l=[],d=0;for(p in a)l[d++]=a[p];return l}function kp(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var l=[];a=a.length;for(var d=0;d<a;d++)l.push(d);return l}l=[],d=0;for(const p in a)l[d++]=p;return l}}}function Sc(a,l){if(a.forEach&&typeof a.forEach=="function")a.forEach(l,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,l,void 0);else for(var d=kp(a),p=Dp(a),R=p.length,V=0;V<R;V++)l.call(void 0,p[V],d&&d[V],a)}var Vc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Np(a,l){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var p=a[d].indexOf("="),R=null;if(0<=p){var V=a[d].substring(0,p);R=a[d].substring(p+1)}else V=a[d];l(V,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function on(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof on){this.h=a.h,ti(this,a.j),this.o=a.o,this.g=a.g,ei(this,a.s),this.l=a.l;var l=a.i,d=new Gr;d.i=l.i,l.g&&(d.g=new Map(l.g),d.h=l.h),Cc(this,d),this.m=a.m}else a&&(l=String(a).match(Vc))?(this.h=!1,ti(this,l[1]||"",!0),this.o=jr(l[2]||""),this.g=jr(l[3]||"",!0),ei(this,l[4]),this.l=jr(l[5]||"",!0),Cc(this,l[6]||"",!0),this.m=jr(l[7]||"")):(this.h=!1,this.i=new Gr(null,this.h))}on.prototype.toString=function(){var a=[],l=this.j;l&&a.push(zr(l,xc,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(zr(l,xc,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(zr(d,d.charAt(0)=="/"?Mp:Fp,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",zr(d,Up)),a.join("")};function ge(a){return new on(a)}function ti(a,l,d){a.j=d?jr(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function ei(a,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);a.s=l}else a.s=null}function Cc(a,l,d){l instanceof Gr?(a.i=l,qp(a.i,a.h)):(d||(l=zr(l,Lp)),a.i=new Gr(l,a.h))}function ut(a,l,d){a.i.set(l,d)}function ni(a){return ut(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function jr(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function zr(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,Op),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Op(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var xc=/[#\/\?@]/g,Fp=/[#\?:]/g,Mp=/[#\?]/g,Lp=/[#\?@]/g,Up=/#/g;function Gr(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function Ce(a){a.g||(a.g=new Map,a.h=0,a.i&&Np(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=Gr.prototype,r.add=function(a,l){Ce(this),this.i=null,a=Fn(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function Dc(a,l){Ce(a),l=Fn(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function kc(a,l){return Ce(a),l=Fn(a,l),a.g.has(l)}r.forEach=function(a,l){Ce(this),this.g.forEach(function(d,p){d.forEach(function(R){a.call(l,R,p,this)},this)},this)},r.na=function(){Ce(this);const a=Array.from(this.g.values()),l=Array.from(this.g.keys()),d=[];for(let p=0;p<l.length;p++){const R=a[p];for(let V=0;V<R.length;V++)d.push(l[p])}return d},r.V=function(a){Ce(this);let l=[];if(typeof a=="string")kc(this,a)&&(l=l.concat(this.g.get(Fn(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)l=l.concat(a[d])}return l},r.set=function(a,l){return Ce(this),this.i=null,a=Fn(this,a),kc(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=this.V(a),0<a.length?String(a[0]):l):l};function Nc(a,l,d){Dc(a,l),0<d.length&&(a.i=null,a.g.set(Fn(a,l),x(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(var d=0;d<l.length;d++){var p=l[d];const V=encodeURIComponent(String(p)),F=this.V(p);for(p=0;p<F.length;p++){var R=V;F[p]!==""&&(R+="="+encodeURIComponent(String(F[p]))),a.push(R)}}return this.i=a.join("&")};function Fn(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function qp(a,l){l&&!a.j&&(Ce(a),a.i=null,a.g.forEach(function(d,p){var R=p.toLowerCase();p!=R&&(Dc(this,p),Nc(this,R,d))},a)),a.j=l}function Bp(a,l){const d=new qr;if(u.Image){const p=new Image;p.onload=w(xe,d,"TestLoadImage: loaded",!0,l,p),p.onerror=w(xe,d,"TestLoadImage: error",!1,l,p),p.onabort=w(xe,d,"TestLoadImage: abort",!1,l,p),p.ontimeout=w(xe,d,"TestLoadImage: timeout",!1,l,p),u.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else l(!1)}function jp(a,l){const d=new qr,p=new AbortController,R=setTimeout(()=>{p.abort(),xe(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:p.signal}).then(V=>{clearTimeout(R),V.ok?xe(d,"TestPingServer: ok",!0,l):xe(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(R),xe(d,"TestPingServer: error",!1,l)})}function xe(a,l,d,p,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),p(d)}catch{}}function zp(){this.g=new Rp}function Gp(a,l,d){const p=d||"";try{Sc(a,function(R,V){let F=R;h(R)&&(F=Oo(R)),l.push(p+V+"="+encodeURIComponent(F))})}catch(R){throw l.push(p+"type="+encodeURIComponent("_badmap")),R}}function ri(a){this.l=a.Ub||null,this.j=a.eb||!1}S(ri,Fo),ri.prototype.g=function(){return new si(this.l,this.j)},ri.prototype.i=function(a){return function(){return a}}({});function si(a,l){Ct.call(this),this.D=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}S(si,Ct),r=si.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=l,this.readyState=1,Kr(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(l.body=a),(this.D||u).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,$r(this)),this.readyState=0},r.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Kr(this)),this.g&&(this.readyState=3,Kr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Oc(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Oc(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}r.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?$r(this):Kr(this),this.readyState==3&&Oc(this)}},r.Ra=function(a){this.g&&(this.response=this.responseText=a,$r(this))},r.Qa=function(a){this.g&&(this.response=a,$r(this))},r.ga=function(){this.g&&$r(this)};function $r(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Kr(a)}r.setRequestHeader=function(a,l){this.u.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function Kr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(si.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Fc(a){let l="";return $(a,function(d,p){l+=p,l+=":",l+=d,l+=`\r
`}),l}function Ko(a,l,d){t:{for(p in d){var p=!1;break t}p=!0}p||(d=Fc(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):ut(a,l,d))}function gt(a){Ct.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}S(gt,Ct);var $p=/^https?$/i,Kp=["POST","PUT"];r=gt.prototype,r.Ha=function(a){this.J=a},r.ea=function(a,l,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Uo.g(),this.v=this.o?hc(this.o):hc(Uo),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(V){Mc(this,V);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var R in p)d.set(R,p[R]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const V of p.keys())d.set(V,p.get(V));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(V=>V.toLowerCase()=="content-type"),R=u.FormData&&a instanceof u.FormData,!(0<=Array.prototype.indexOf.call(Kp,l,void 0))||p||R||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[V,F]of d)this.g.setRequestHeader(V,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{qc(this),this.u=!0,this.g.send(a),this.u=!1}catch(V){Mc(this,V)}};function Mc(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.m=5,Lc(a),ii(a)}function Lc(a){a.A||(a.A=!0,Ut(a,"complete"),Ut(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ut(this,"complete"),Ut(this,"abort"),ii(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ii(this,!0)),gt.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?Uc(this):this.bb())},r.bb=function(){Uc(this)};function Uc(a){if(a.h&&typeof o<"u"&&(!a.v[1]||_e(a)!=4||a.Z()!=2)){if(a.u&&_e(a)==4)ac(a.Ea,0,a);else if(Ut(a,"readystatechange"),_e(a)==4){a.h=!1;try{const F=a.Z();t:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break t;default:l=!1}var d;if(!(d=l)){var p;if(p=F===0){var R=String(a.D).match(Vc)[1]||null;!R&&u.self&&u.self.location&&(R=u.self.location.protocol.slice(0,-1)),p=!$p.test(R?R.toLowerCase():"")}d=p}if(d)Ut(a,"complete"),Ut(a,"success");else{a.m=6;try{var V=2<_e(a)?a.g.statusText:""}catch{V=""}a.l=V+" ["+a.Z()+"]",Lc(a)}}finally{ii(a)}}}}function ii(a,l){if(a.g){qc(a);const d=a.g,p=a.v[0]?()=>{}:null;a.g=null,a.v=null,l||Ut(a,"ready");try{d.onreadystatechange=p}catch{}}}function qc(a){a.I&&(u.clearTimeout(a.I),a.I=null)}r.isActive=function(){return!!this.g};function _e(a){return a.g?a.g.readyState:0}r.Z=function(){try{return 2<_e(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Ap(l)}};function Bc(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Qp(a){const l={};a=(a.g&&2<=_e(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(q(a[p]))continue;var d=v(a[p]);const R=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const V=l[R]||[];l[R]=V,V.push(d)}I(l,function(p){return p.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Qr(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function jc(a){this.Aa=0,this.i=[],this.j=new qr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Qr("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Qr("baseRetryDelayMs",5e3,a),this.cb=Qr("retryDelaySeedMs",1e4,a),this.Wa=Qr("forwardChannelMaxRetries",2,a),this.wa=Qr("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new vc(a&&a.concurrentRequestLimit),this.Da=new zp,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=jc.prototype,r.la=8,r.G=1,r.connect=function(a,l,d,p){qt(0),this.W=a,this.H=l||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Jc(this,null,this.W),ai(this)};function Qo(a){if(zc(a),a.G==3){var l=a.U++,d=ge(a.I);if(ut(d,"SID",a.K),ut(d,"RID",l),ut(d,"TYPE","terminate"),Wr(a,d),l=new Ve(a,a.j,l),l.L=2,l.v=ni(ge(d)),d=!1,u.navigator&&u.navigator.sendBeacon)try{d=u.navigator.sendBeacon(l.v.toString(),"")}catch{}!d&&u.Image&&(new Image().src=l.v,d=!0),d||(l.g=Yc(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Zs(l)}Xc(a)}function oi(a){a.g&&(Ho(a),a.g.cancel(),a.g=null)}function zc(a){oi(a),a.u&&(u.clearTimeout(a.u),a.u=null),ui(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&u.clearTimeout(a.s),a.s=null)}function ai(a){if(!Ac(a.h)&&!a.s){a.s=!0;var l=a.Ga;kr||nc(),Nr||(kr(),Nr=!0),Po.add(l,a),a.B=0}}function Wp(a,l){return Rc(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=l.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=Ur(g(a.Ga,a,l),Hc(a,a.B)),a.B++,!0)}r.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const R=new Ve(this,this.j,a);let V=this.o;if(this.S&&(V?(V=_(V),E(V,this.S)):V=this.S),this.m!==null||this.O||(R.H=V,V=null),this.P)t:{for(var l=0,d=0;d<this.i.length;d++){e:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break e}p=void 0}if(p===void 0)break;if(l+=p,4096<l){l=d;break t}if(l===4096||d===this.i.length-1){l=d+1;break t}}l=1e3}else l=1e3;l=$c(this,R,l),d=ge(this.I),ut(d,"RID",a),ut(d,"CVER",22),this.D&&ut(d,"X-HTTP-Session-Id",this.D),Wr(this,d),V&&(this.O?l="headers="+encodeURIComponent(String(Fc(V)))+"&"+l:this.m&&Ko(d,this.m,V)),$o(this.h,R),this.Ua&&ut(d,"TYPE","init"),this.P?(ut(d,"$req",l),ut(d,"SID","null"),R.T=!0,Bo(R,d,null)):Bo(R,d,l),this.G=2}}else this.G==3&&(a?Gc(this,a):this.i.length==0||Ac(this.h)||Gc(this))};function Gc(a,l){var d;l?d=l.l:d=a.U++;const p=ge(a.I);ut(p,"SID",a.K),ut(p,"RID",d),ut(p,"AID",a.T),Wr(a,p),a.m&&a.o&&Ko(p,a.m,a.o),d=new Ve(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),l&&(a.i=l.D.concat(a.i)),l=$c(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),$o(a.h,d),Bo(d,p,l)}function Wr(a,l){a.H&&$(a.H,function(d,p){ut(l,p,d)}),a.l&&Sc({},function(d,p){ut(l,p,d)})}function $c(a,l,d){d=Math.min(a.i.length,d);var p=a.l?g(a.l.Na,a.l,a):null;t:{var R=a.i;let V=-1;for(;;){const F=["count="+d];V==-1?0<d?(V=R[0].g,F.push("ofs="+V)):V=0:F.push("ofs="+V);let it=!0;for(let bt=0;bt<d;bt++){let Y=R[bt].g;const xt=R[bt].map;if(Y-=V,0>Y)V=Math.max(0,R[bt].g-100),it=!1;else try{Gp(xt,F,"req"+Y+"_")}catch{p&&p(xt)}}if(it){p=F.join("&");break t}}}return a=a.i.splice(0,d),l.D=a,p}function Kc(a){if(!a.g&&!a.u){a.Y=1;var l=a.Fa;kr||nc(),Nr||(kr(),Nr=!0),Po.add(l,a),a.v=0}}function Wo(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=Ur(g(a.Fa,a),Hc(a,a.v)),a.v++,!0)}r.Fa=function(){if(this.u=null,Qc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=Ur(g(this.ab,this),a)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,qt(10),oi(this),Qc(this))};function Ho(a){a.A!=null&&(u.clearTimeout(a.A),a.A=null)}function Qc(a){a.g=new Ve(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var l=ge(a.qa);ut(l,"RID","rpc"),ut(l,"SID",a.K),ut(l,"AID",a.T),ut(l,"CI",a.F?"0":"1"),!a.F&&a.ja&&ut(l,"TO",a.ja),ut(l,"TYPE","xmlhttp"),Wr(a,l),a.m&&a.o&&Ko(l,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=ni(ge(l)),d.m=null,d.P=!0,Ic(d,a)}r.Za=function(){this.C!=null&&(this.C=null,oi(this),Wo(this),qt(19))};function ui(a){a.C!=null&&(u.clearTimeout(a.C),a.C=null)}function Wc(a,l){var d=null;if(a.g==l){ui(a),Ho(a),a.g=null;var p=2}else if(Go(a.h,l))d=l.D,bc(a.h,l),p=1;else return;if(a.G!=0){if(l.o)if(p==1){d=l.m?l.m.length:0,l=Date.now()-l.F;var R=a.B;p=Xs(),Ut(p,new gc(p,d)),ai(a)}else Kc(a);else if(R=l.s,R==3||R==0&&0<l.X||!(p==1&&Wp(a,l)||p==2&&Wo(a)))switch(d&&0<d.length&&(l=a.h,l.i=l.i.concat(d)),R){case 1:an(a,5);break;case 4:an(a,10);break;case 3:an(a,6);break;default:an(a,2)}}}function Hc(a,l){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*l}function an(a,l){if(a.j.info("Error code "+l),l==2){var d=g(a.fb,a),p=a.Xa;const R=!p;p=new on(p||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||ti(p,"https"),ni(p),R?Bp(p.toString(),d):jp(p.toString(),d)}else qt(2);a.G=0,a.l&&a.l.sa(l),Xc(a),zc(a)}r.fb=function(a){a?(this.j.info("Successfully pinged google.com"),qt(2)):(this.j.info("Failed to ping google.com"),qt(1))};function Xc(a){if(a.G=0,a.ka=[],a.l){const l=Pc(a.h);(l.length!=0||a.i.length!=0)&&(C(a.ka,l),C(a.ka,a.i),a.h.i.length=0,x(a.i),a.i.length=0),a.l.ra()}}function Jc(a,l,d){var p=d instanceof on?ge(d):new on(d);if(p.g!="")l&&(p.g=l+"."+p.g),ei(p,p.s);else{var R=u.location;p=R.protocol,l=l?l+"."+R.hostname:R.hostname,R=+R.port;var V=new on(null);p&&ti(V,p),l&&(V.g=l),R&&ei(V,R),d&&(V.l=d),p=V}return d=a.D,l=a.ya,d&&l&&ut(p,d,l),ut(p,"VER",a.la),Wr(a,p),p}function Yc(a,l,d){if(l&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Ca&&!a.pa?new gt(new ri({eb:d})):new gt(a.pa),l.Ha(a.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Zc(){}r=Zc.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function ci(){}ci.prototype.g=function(a,l){return new Ht(a,l)};function Ht(a,l){Ct.call(this),this.g=new jc(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(a?a["X-WebChannel-Client-Profile"]=l.va:a={"X-WebChannel-Client-Profile":l.va}),this.g.S=a,(a=l&&l.Sb)&&!q(a)&&(this.g.m=a),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!q(l)&&(this.g.D=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Mn(this)}S(Ht,Ct),Ht.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ht.prototype.close=function(){Qo(this.g)},Ht.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=Oo(a),a=d);l.i.push(new xp(l.Ya++,a)),l.G==3&&ai(l)},Ht.prototype.N=function(){this.g.l=null,delete this.j,Qo(this.g),delete this.g,Ht.aa.N.call(this)};function tl(a){Mo.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){t:{for(const d in l){a=d;break t}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}S(tl,Mo);function el(){Lo.call(this),this.status=1}S(el,Lo);function Mn(a){this.g=a}S(Mn,Zc),Mn.prototype.ua=function(){Ut(this.g,"a")},Mn.prototype.ta=function(a){Ut(this.g,new tl(a))},Mn.prototype.sa=function(a){Ut(this.g,new el)},Mn.prototype.ra=function(){Ut(this.g,"b")},ci.prototype.createWebChannel=ci.prototype.g,Ht.prototype.send=Ht.prototype.o,Ht.prototype.open=Ht.prototype.m,Ht.prototype.close=Ht.prototype.close,Xh=function(){return new ci},Hh=function(){return Xs()},Wh=rn,ua={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Js.NO_ERROR=0,Js.TIMEOUT=8,Js.HTTP_ERROR=6,Ei=Js,_c.COMPLETE="complete",Qh=_c,dc.EventType=Mr,Mr.OPEN="a",Mr.CLOSE="b",Mr.ERROR="c",Mr.MESSAGE="d",Ct.prototype.listen=Ct.prototype.K,es=dc,gt.prototype.listenOnce=gt.prototype.L,gt.prototype.getLastError=gt.prototype.Ka,gt.prototype.getLastErrorCode=gt.prototype.Ba,gt.prototype.getStatus=gt.prototype.Z,gt.prototype.getResponseJson=gt.prototype.Oa,gt.prototype.getResponseText=gt.prototype.oa,gt.prototype.send=gt.prototype.ea,gt.prototype.setWithCredentials=gt.prototype.Ha,Kh=gt}).apply(typeof hi<"u"?hi:typeof self<"u"?self:typeof window<"u"?window:{});const rl="@firebase/firestore",sl="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}At.UNAUTHENTICATED=new At(null),At.GOOGLE_CREDENTIALS=new At("google-credentials-uid"),At.FIRST_PARTY=new At("first-party-uid"),At.MOCK_USER=new At("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tr="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Be=new Hp("@firebase/firestore");function Kn(){return Be.logLevel}function Zp(r){Be.setLogLevel(r)}function k(r,...t){if(Be.logLevel<=ye.DEBUG){const e=t.map(qa);Be.debug(`Firestore (${Tr}): ${r}`,...e)}}function _t(r,...t){if(Be.logLevel<=ye.ERROR){const e=t.map(qa);Be.error(`Firestore (${Tr}): ${r}`,...e)}}function Lt(r,...t){if(Be.logLevel<=ye.WARN){const e=t.map(qa);Be.warn(`Firestore (${Tr}): ${r}`,...e)}}function qa(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U(r,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,Jh(r,n,e)}function Jh(r,t,e){let n=`FIRESTORE (${Tr}) INTERNAL ASSERTION FAILED: ${t} (ID: ${r.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw _t(n),new Error(n)}function B(r,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,r||Jh(t,s,n)}function tg(r,t){r||U(57014,t)}function O(r,t){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends Fh{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yh{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Zh{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(At.UNAUTHENTICATED))}shutdown(){}}class eg{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class ng{constructor(t){this.t=t,this.currentUser=At.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){B(this.o===void 0,42304);let n=this.i;const s=c=>this.i!==n?(n=this.i,e(c)):Promise.resolve();let i=new Rt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Rt,t.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const c=i;t.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},u=c=>{k("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>u(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?u(c):(k("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Rt)}},0),o()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(n=>this.i!==t?(k("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(B(typeof n.accessToken=="string",31837,{l:n}),new Yh(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return B(t===null||typeof t=="string",2055,{h:t}),new At(t)}}class rg{constructor(t,e,n){this.P=t,this.T=e,this.I=n,this.type="FirstParty",this.user=At.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class sg{constructor(t,e,n){this.P=t,this.T=e,this.I=n}getToken(){return Promise.resolve(new rg(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable(()=>e(At.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ca{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ig{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Gh(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){B(this.o===void 0,3512);const n=i=>{i.error!=null&&k("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,k("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable(()=>n(i))};const s=i=>{k("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):k("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new ca(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(B(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new ca(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class og{getToken(){return Promise.resolve(new ca(""))}invalidateToken(){}start(t,e){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ag(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<r;n++)e[n]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ba(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=ag(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<e&&(n+=t.charAt(s[i]%62))}return n}}function G(r,t){return r<t?-1:r>t?1:0}function la(r,t){let e=0;for(;e<r.length&&e<t.length;){const n=r.codePointAt(e),s=t.codePointAt(e);if(n!==s){if(n<128&&s<128)return G(n,s);{const i=Ba(),o=ug(i.encode(il(r,e)),i.encode(il(t,e)));return o!==0?o:G(n,s)}}e+=n>65535?2:1}return G(r.length,t.length)}function il(r,t){return r.codePointAt(t)>65535?r.substring(t,t+2):r.substring(t,t+1)}function ug(r,t){for(let e=0;e<r.length&&e<t.length;++e)if(r[e]!==t[e])return G(r[e],t[e]);return G(r.length,t.length)}function Yn(r,t,e){return r.length===t.length&&r.every((n,s)=>e(n,t[s]))}function td(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ha="__name__";class ie{constructor(t,e,n){e===void 0?e=0:e>t.length&&U(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&U(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return ie.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof ie?t.forEach(n=>{e.push(n)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const i=ie.compareSegments(t.get(s),e.get(s));if(i!==0)return i}return G(t.length,e.length)}static compareSegments(t,e){const n=ie.isNumericId(t),s=ie.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?ie.extractNumericId(t).compare(ie.extractNumericId(e)):la(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Ue.fromString(t.substring(4,t.length-2))}}class Q extends ie{construct(t,e,n){return new Q(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new D(b.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter(s=>s.length>0))}return new Q(e)}static emptyPath(){return new Q([])}}const cg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class lt extends ie{construct(t,e,n){return new lt(t,e,n)}static isValidIdentifier(t){return cg.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),lt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===ha}static keyField(){return new lt([ha])}static fromServerFormat(t){const e=[];let n="",s=0;const i=()=>{if(n.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let o=!1;for(;s<t.length;){const u=t[s];if(u==="\\"){if(s+1===t.length)throw new D(b.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new D(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=c,s+=2}else u==="`"?(o=!o,s++):u!=="."||o?(n+=u,s++):(i(),s++)}if(i(),o)throw new D(b.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new lt(e)}static emptyPath(){return new lt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(t){this.path=t}static fromPath(t){return new N(Q.fromString(t))}static fromName(t){return new N(Q.fromString(t).popFirst(5))}static empty(){return new N(Q.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&Q.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return Q.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new N(new Q(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ja(r,t,e){if(!e)throw new D(b.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${t}.`)}function ed(r,t,e,n){if(t===!0&&n===!0)throw new D(b.INVALID_ARGUMENT,`${r} and ${e} cannot be used together.`)}function ol(r){if(!N.isDocumentKey(r))throw new D(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function al(r){if(N.isDocumentKey(r))throw new D(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function nd(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Yi(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=function(n){return n.constructor?n.constructor.name:null}(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":U(12329,{type:typeof r})}function W(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new D(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Yi(r);throw new D(b.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return r}function rd(r,t){if(t<=0)throw new D(b.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${t}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(r,t){const e={typeString:r};return t&&(e.value=t),e}function Cn(r,t){if(!nd(r))throw new D(b.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,i="value"in t[n]?{value:t[n].value}:void 0;if(!(n in r)){e=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){e=`Expected '${n}' field to equal '${i.value}'`;break}}if(e)throw new D(b.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ul=-62135596800,cl=1e6;class tt{static now(){return tt.fromMillis(Date.now())}static fromDate(t){return tt.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*cl);return new tt(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<ul)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/cl}_compareTo(t){return this.seconds===t.seconds?G(this.nanoseconds,t.nanoseconds):G(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:tt._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Cn(t,tt._jsonSchema))return new tt(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-ul;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}tt._jsonSchemaVersion="firestore/timestamp/1.0",tt._jsonSchema={type:It("string",tt._jsonSchemaVersion),seconds:It("number"),nanoseconds:It("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{static fromTimestamp(t){return new j(t)}static min(){return new j(new tt(0,0))}static max(){return new j(new tt(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zn=-1;class tr{constructor(t,e,n,s){this.indexId=t,this.collectionGroup=e,this.fields=n,this.indexState=s}}function da(r){return r.fields.find(t=>t.kind===2)}function cn(r){return r.fields.filter(t=>t.kind!==2)}function lg(r,t){let e=G(r.collectionGroup,t.collectionGroup);if(e!==0)return e;for(let n=0;n<Math.min(r.fields.length,t.fields.length);++n)if(e=hg(r.fields[n],t.fields[n]),e!==0)return e;return G(r.fields.length,t.fields.length)}tr.UNKNOWN_ID=-1;class gn{constructor(t,e){this.fieldPath=t,this.kind=e}}function hg(r,t){const e=lt.comparator(r.fieldPath,t.fieldPath);return e!==0?e:G(r.kind,t.kind)}class er{constructor(t,e){this.sequenceNumber=t,this.offset=e}static empty(){return new er(0,Jt.min())}}function sd(r,t){const e=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=j.fromTimestamp(n===1e9?new tt(e+1,0):new tt(e,n));return new Jt(s,N.empty(),t)}function id(r){return new Jt(r.readTime,r.key,Zn)}class Jt{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new Jt(j.min(),N.empty(),Zn)}static max(){return new Jt(j.max(),N.empty(),Zn)}}function za(r,t){let e=r.readTime.compareTo(t.readTime);return e!==0?e:(e=N.comparator(r.documentKey,t.documentKey),e!==0?e:G(r.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ad{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function He(r){if(r.code!==b.FAILED_PRECONDITION||r.message!==od)throw r;k("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&U(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new A((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(n,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof A?e:A.resolve(e)}catch(e){return A.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):A.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):A.reject(e)}static resolve(t){return new A((e,n)=>{e(t)})}static reject(t){return new A((e,n)=>{n(t)})}static waitFor(t){return new A((e,n)=>{let s=0,i=0,o=!1;t.forEach(u=>{++s,u.next(()=>{++i,o&&i===s&&e()},c=>n(c))}),o=!0,i===s&&e()})}static or(t){let e=A.resolve(!1);for(const n of t)e=e.next(s=>s?A.resolve(s):n());return e}static forEach(t,e){const n=[];return t.forEach((s,i)=>{n.push(e.call(this,s,i))}),this.waitFor(n)}static mapArray(t,e){return new A((n,s)=>{const i=t.length,o=new Array(i);let u=0;for(let c=0;c<i;c++){const h=c;e(t[h]).next(f=>{o[h]=f,++u,u===i&&n(o)},f=>s(f))}})}static doWhile(t,e){return new A((n,s)=>{const i=()=>{t()===!0?e().next(()=>{i()},s):n()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xt="SimpleDb";class Zi{static open(t,e,n,s){try{return new Zi(e,t.transaction(s,n))}catch(i){throw new is(e,i)}}constructor(t,e){this.action=t,this.transaction=e,this.aborted=!1,this.S=new Rt,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{e.error?this.S.reject(new is(t,e.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=Ga(n.target.error);this.S.reject(new is(t,s))}}get D(){return this.S.promise}abort(t){t&&this.S.reject(t),this.aborted||(k(Xt,"Aborting transaction:",t?t.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}v(){const t=this.transaction;this.aborted||typeof t.commit!="function"||t.commit()}store(t){const e=this.transaction.objectStore(t);return new fg(e)}}class le{static delete(t){return k(Xt,"Removing database:",t),hn(Jp().indexedDB.deleteDatabase(t)).toPromise()}static C(){if(!Yp())return!1;if(le.F())return!0;const t=xi(),e=le.M(t),n=0<e&&e<10,s=ud(t),i=0<s&&s<4.5;return!(t.indexOf("MSIE ")>0||t.indexOf("Trident/")>0||t.indexOf("Edge/")>0||n||i)}static F(){var t;return typeof process<"u"&&((t=process.__PRIVATE_env)===null||t===void 0?void 0:t.O)==="YES"}static N(t,e){return t.store(e)}static M(t){const e=t.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=e?e[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(t,e,n){this.name=t,this.version=e,this.B=n,this.L=null,le.M(xi())===12.2&&_t("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async k(t){return this.db||(k(Xt,"Opening database:",this.name),this.db=await new Promise((e,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;e(o)},s.onblocked=()=>{n(new is(t,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new D(b.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new D(b.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new is(t,o))},s.onupgradeneeded=i=>{k(Xt,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;if(this.L!==null&&this.L!==i.oldVersion)throw new Error(`refusing to open IndexedDB database due to potential corruption of the IndexedDB database data; this corruption could be caused by clicking the "clear site data" button in a web browser; try reloading the web page to re-initialize the IndexedDB database: lastClosedDbVersion=${this.L}, event.oldVersion=${i.oldVersion}, event.newVersion=${i.newVersion}, db.version=${o.version}`);this.B.q(o,s.transaction,i.oldVersion,this.version).next(()=>{k(Xt,"Database upgrade to version "+this.version+" complete")})}}),this.db.addEventListener("close",e=>{const n=e.target;this.L=n.version},{passive:!0})),this.db.addEventListener("versionchange",e=>{var n;e.newVersion===null&&(Lt('Received "versionchange" event with newVersion===null; notifying the registered DatabaseDeletedListener, if any'),(n=this.databaseDeletedListener)===null||n===void 0||n.call(this))},{passive:!0}),this.db}setDatabaseDeletedListener(t){if(this.databaseDeletedListener)throw new Error("setDatabaseDeletedListener() may only be called once, and it has already been called");this.databaseDeletedListener=t}async runTransaction(t,e,n,s){const i=e==="readonly";let o=0;for(;;){++o;try{this.db=await this.k(t);const u=Zi.open(this.db,t,i?"readonly":"readwrite",n),c=s(u).next(h=>(u.v(),h)).catch(h=>(u.abort(h),A.reject(h))).toPromise();return c.catch(()=>{}),await u.D,c}catch(u){const c=u,h=c.name!=="FirebaseError"&&o<3;if(k(Xt,"Transaction failed with error:",c.message,"Retrying:",h),this.close(),!h)return Promise.reject(c)}}}close(){this.db&&this.db.close(),this.db=void 0}}function ud(r){const t=r.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}class dg{constructor(t){this.$=t,this.U=!1,this.K=null}get isDone(){return this.U}get W(){return this.K}set cursor(t){this.$=t}done(){this.U=!0}G(t){this.K=t}delete(){return hn(this.$.delete())}}class is extends D{constructor(t,e){super(b.UNAVAILABLE,`IndexedDB transaction '${t}' failed: ${e}`),this.name="IndexedDbTransactionError"}}function Xe(r){return r.name==="IndexedDbTransactionError"}class fg{constructor(t){this.store=t}put(t,e){let n;return e!==void 0?(k(Xt,"PUT",this.store.name,t,e),n=this.store.put(e,t)):(k(Xt,"PUT",this.store.name,"<auto-key>",t),n=this.store.put(t)),hn(n)}add(t){return k(Xt,"ADD",this.store.name,t,t),hn(this.store.add(t))}get(t){return hn(this.store.get(t)).next(e=>(e===void 0&&(e=null),k(Xt,"GET",this.store.name,t,e),e))}delete(t){return k(Xt,"DELETE",this.store.name,t),hn(this.store.delete(t))}count(){return k(Xt,"COUNT",this.store.name),hn(this.store.count())}j(t,e){const n=this.options(t,e),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new A((o,u)=>{i.onerror=c=>{u(c.target.error)},i.onsuccess=c=>{o(c.target.result)}})}{const i=this.cursor(n),o=[];return this.J(i,(u,c)=>{o.push(c)}).next(()=>o)}}H(t,e){const n=this.store.getAll(t,e===null?void 0:e);return new A((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}})}Y(t,e){k(Xt,"DELETE ALL",this.store.name);const n=this.options(t,e);n.Z=!1;const s=this.cursor(n);return this.J(s,(i,o,u)=>u.delete())}X(t,e){let n;e?n=t:(n={},e=t);const s=this.cursor(n);return this.J(s,e)}ee(t){const e=this.cursor({});return new A((n,s)=>{e.onerror=i=>{const o=Ga(i.target.error);s(o)},e.onsuccess=i=>{const o=i.target.result;o?t(o.primaryKey,o.value).next(u=>{u?o.continue():n()}):n()}})}J(t,e){const n=[];return new A((s,i)=>{t.onerror=o=>{i(o.target.error)},t.onsuccess=o=>{const u=o.target.result;if(!u)return void s();const c=new dg(u),h=e(u.primaryKey,u.value,c);if(h instanceof A){const f=h.catch(m=>(c.done(),A.reject(m)));n.push(f)}c.isDone?s():c.W===null?u.continue():u.continue(c.W)}}).next(()=>A.waitFor(n))}options(t,e){let n;return t!==void 0&&(typeof t=="string"?n=t:e=t),{index:n,range:e}}cursor(t){let e="next";if(t.reverse&&(e="prev"),t.index){const n=this.store.index(t.index);return t.Z?n.openKeyCursor(t.range,e):n.openCursor(t.range,e)}return this.store.openCursor(t.range,e)}}function hn(r){return new A((t,e)=>{r.onsuccess=n=>{const s=n.target.result;t(s)},r.onerror=n=>{const s=Ga(n.target.error);e(s)}})}let ll=!1;function Ga(r){const t=le.M(xi());if(t>=12.2&&t<13){const e="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(e)>=0){const n=new D("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return ll||(ll=!0,setTimeout(()=>{throw n},0)),n}}return r}const os="IndexBackfiller";class mg{constructor(t,e){this.asyncQueue=t,this.te=e,this.task=null}start(){this.ne(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}ne(t){k(os,`Scheduled in ${t}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",t,async()=>{this.task=null;try{const e=await this.te.re();k(os,`Documents written: ${e}`)}catch(e){Xe(e)?k(os,"Ignoring IndexedDB error during index backfill: ",e):await He(e)}await this.ne(6e4)})}}class pg{constructor(t,e){this.localStore=t,this.persistence=e}async re(t=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",e=>this.ie(e,t))}ie(t,e){const n=new Set;let s=e,i=!0;return A.doWhile(()=>i===!0&&s>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(t).next(o=>{if(o!==null&&!n.has(o))return k(os,`Processing collection: ${o}`),this.se(t,o,s).next(u=>{s-=u,n.add(o)});i=!1})).next(()=>e-s)}se(t,e,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(t,e).next(s=>this.localStore.localDocuments.getNextDocuments(t,e,s,n).next(i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(t,o).next(()=>this.oe(s,i)).next(u=>(k(os,`Updating offset: ${u}`),this.localStore.indexManager.updateCollectionGroup(t,e,u))).next(()=>o.size)}))}oe(t,e){let n=t;return e.changes.forEach((s,i)=>{const o=id(i);za(o,n)>0&&(n=o)}),new Jt(n.readTime,n.documentKey,Math.max(e.batchId,t.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=n=>this._e(n),this.ae=n=>e.writeSequenceNumber(n))}_e(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ae&&this.ae(t),t}}Gt.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qe=-1;function Cs(r){return r==null}function ps(r){return r===0&&1/r==-1/0}function cd(r){return typeof r=="number"&&Number.isInteger(r)&&!ps(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki="";function Ft(r){let t="";for(let e=0;e<r.length;e++)t.length>0&&(t=hl(t)),t=gg(r.get(e),t);return hl(t)}function gg(r,t){let e=t;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":e+="";break;case ki:e+="";break;default:e+=i}}return e}function hl(r){return r+ki+""}function ue(r){const t=r.length;if(B(t>=2,64408,{path:r}),t===2)return B(r.charAt(0)===ki&&r.charAt(1)==="",56145,{path:r}),Q.emptyPath();const e=t-2,n=[];let s="";for(let i=0;i<t;){const o=r.indexOf(ki,i);switch((o<0||o>e)&&U(50515,{path:r}),r.charAt(o+1)){case"":const u=r.substring(i,o);let c;s.length===0?c=u:(s+=u,c=s,s=""),n.push(c);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:U(61167,{path:r})}i=o+2}return new Q(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln="remoteDocuments",xs="owner",Un="owner",gs="mutationQueues",_g="userId",ee="mutations",dl="batchId",pn="userMutationsIndex",fl=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wi(r,t){return[r,Ft(t)]}function ld(r,t,e){return[r,Ft(t),e]}const yg={},nr="documentMutations",Ni="remoteDocumentsV14",Tg=["prefixPath","collectionGroup","readTime","documentId"],vi="documentKeyIndex",Ig=["prefixPath","collectionGroup","documentId"],hd="collectionGroupIndex",Eg=["collectionGroup","readTime","prefixPath","documentId"],_s="remoteDocumentGlobal",fa="remoteDocumentGlobalKey",rr="targets",dd="queryTargetsIndex",wg=["canonicalId","targetId"],sr="targetDocuments",vg=["targetId","path"],$a="documentTargetsIndex",Ag=["path","targetId"],Oi="targetGlobalKey",_n="targetGlobal",ys="collectionParents",Rg=["collectionId","parent"],ir="clientMetadata",bg="clientId",to="bundles",Pg="bundleId",eo="namedQueries",Sg="name",Ka="indexConfiguration",Vg="indexId",ma="collectionGroupIndex",Cg="collectionGroup",as="indexState",xg=["indexId","uid"],fd="sequenceNumberIndex",Dg=["uid","sequenceNumber"],us="indexEntries",kg=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],md="documentKeyIndex",Ng=["indexId","uid","orderedDocumentKey"],no="documentOverlays",Og=["userId","collectionPath","documentId"],pa="collectionPathOverlayIndex",Fg=["userId","collectionPath","largestBatchId"],pd="collectionGroupOverlayIndex",Mg=["userId","collectionGroup","largestBatchId"],Qa="globals",Lg="name",gd=[gs,ee,nr,ln,rr,xs,_n,sr,ir,_s,ys,to,eo],Ug=[...gd,no],_d=[gs,ee,nr,Ni,rr,xs,_n,sr,ir,_s,ys,to,eo,no],yd=_d,Wa=[...yd,Ka,as,us],qg=Wa,Td=[...Wa,Qa],Bg=Td;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga extends ad{constructor(t,e){super(),this.ce=t,this.currentSequenceNumber=e}}function wt(r,t){const e=O(r);return le.N(e.ce,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ml(r){let t=0;for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t++;return t}function Je(r,t){for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t(e,r[e])}function Id(r,t){const e=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.push(t(r[n],n,r));return e}function Ed(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(t,e){this.comparator=t,this.root=e||Pt.EMPTY}insert(t,e){return new ot(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Pt.BLACK,null,null))}remove(t){return new ot(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Pt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(n===0)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(t,n.key);if(s===0)return e+n.left.size;s<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,n)=>(t(e,n),!1))}toString(){const t=[];return this.inorderTraversal((e,n)=>(t.push(`${e}:${n}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new di(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new di(this.root,t,this.comparator,!1)}getReverseIterator(){return new di(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new di(this.root,t,this.comparator,!0)}}class di{constructor(t,e,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?n(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Pt{constructor(t,e,n,s,i){this.key=t,this.value=e,this.color=n??Pt.RED,this.left=s??Pt.EMPTY,this.right=i??Pt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,s,i){return new Pt(t??this.key,e??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let s=this;const i=n(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,n),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Pt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return Pt.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Pt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Pt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw U(43730,{key:this.key,value:this.value});if(this.right.isRed())throw U(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw U(27949);return t+(this.isRed()?0:1)}}Pt.EMPTY=null,Pt.RED=!0,Pt.BLACK=!1;Pt.EMPTY=new class{constructor(){this.size=0}get key(){throw U(57766)}get value(){throw U(16141)}get color(){throw U(16727)}get left(){throw U(29726)}get right(){throw U(36894)}copy(t,e,n,s,i){return this}insert(t,e,n){return new Pt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(t){this.comparator=t,this.data=new ot(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,n)=>(t(e),!1))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let n;for(n=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new pl(this.data.getIterator())}getIteratorFrom(t){return new pl(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(n=>{e=e.add(n)}),e}isEqual(t){if(!(t instanceof rt)||this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new rt(this.comparator);return e.data=t,e}}class pl{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function qn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(t){this.fields=t,t.sort(lt.comparator)}static empty(){return new $t([])}unionWith(t){let e=new rt(lt.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new $t(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Yn(this.fields,t.fields,(e,n)=>e.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jg(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new wd("Invalid base64 string: "+i):i}}(t);return new pt(e)}static fromUint8Array(t){const e=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(t);return new pt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return G(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}pt.EMPTY_BYTE_STRING=new pt("");const zg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ee(r){if(B(!!r,39018),typeof r=="string"){let t=0;const e=zg.exec(r);if(B(!!e,46558,{timestamp:r}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:ht(r.seconds),nanos:ht(r.nanos)}}function ht(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function we(r){return typeof r=="string"?pt.fromBase64String(r):pt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vd="server_timestamp",Ad="__type__",Rd="__previous_value__",bd="__local_write_time__";function ro(r){var t,e;return((e=(((t=r?.mapValue)===null||t===void 0?void 0:t.fields)||{})[Ad])===null||e===void 0?void 0:e.stringValue)===vd}function so(r){const t=r.mapValue.fields[Rd];return ro(t)?so(t):t}function Ts(r){const t=Ee(r.mapValue.fields[bd].timestampValue);return new tt(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg{constructor(t,e,n,s,i,o,u,c,h,f){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=h,this.isUsingEmulator=f}}const Is="(default)";class je{constructor(t,e){this.projectId=t,this.database=e||Is}static empty(){return new je("","")}get isDefaultDatabase(){return this.database===Is}isEqual(t){return t instanceof je&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ha="__type__",Pd="__max__",Me={mapValue:{fields:{__type__:{stringValue:Pd}}}},Xa="__vector__",or="value",Ai={nullValue:"NULL_VALUE"};function ze(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ro(r)?4:Sd(r)?9007199254740991:io(r)?10:11:U(28295,{value:r})}function fe(r,t){if(r===t)return!0;const e=ze(r);if(e!==ze(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return Ts(r).isEqual(Ts(t));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=Ee(s.timestampValue),u=Ee(i.timestampValue);return o.seconds===u.seconds&&o.nanos===u.nanos}(r,t);case 5:return r.stringValue===t.stringValue;case 6:return function(s,i){return we(s.bytesValue).isEqual(we(i.bytesValue))}(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return function(s,i){return ht(s.geoPointValue.latitude)===ht(i.geoPointValue.latitude)&&ht(s.geoPointValue.longitude)===ht(i.geoPointValue.longitude)}(r,t);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return ht(s.integerValue)===ht(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=ht(s.doubleValue),u=ht(i.doubleValue);return o===u?ps(o)===ps(u):isNaN(o)&&isNaN(u)}return!1}(r,t);case 9:return Yn(r.arrayValue.values||[],t.arrayValue.values||[],fe);case 10:case 11:return function(s,i){const o=s.mapValue.fields||{},u=i.mapValue.fields||{};if(ml(o)!==ml(u))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(u[c]===void 0||!fe(o[c],u[c])))return!1;return!0}(r,t);default:return U(52216,{left:r})}}function Es(r,t){return(r.values||[]).find(e=>fe(e,t))!==void 0}function Ge(r,t){if(r===t)return 0;const e=ze(r),n=ze(t);if(e!==n)return G(e,n);switch(e){case 0:case 9007199254740991:return 0;case 1:return G(r.booleanValue,t.booleanValue);case 2:return function(i,o){const u=ht(i.integerValue||i.doubleValue),c=ht(o.integerValue||o.doubleValue);return u<c?-1:u>c?1:u===c?0:isNaN(u)?isNaN(c)?0:-1:1}(r,t);case 3:return gl(r.timestampValue,t.timestampValue);case 4:return gl(Ts(r),Ts(t));case 5:return la(r.stringValue,t.stringValue);case 6:return function(i,o){const u=we(i),c=we(o);return u.compareTo(c)}(r.bytesValue,t.bytesValue);case 7:return function(i,o){const u=i.split("/"),c=o.split("/");for(let h=0;h<u.length&&h<c.length;h++){const f=G(u[h],c[h]);if(f!==0)return f}return G(u.length,c.length)}(r.referenceValue,t.referenceValue);case 8:return function(i,o){const u=G(ht(i.latitude),ht(o.latitude));return u!==0?u:G(ht(i.longitude),ht(o.longitude))}(r.geoPointValue,t.geoPointValue);case 9:return _l(r.arrayValue,t.arrayValue);case 10:return function(i,o){var u,c,h,f;const m=i.fields||{},g=o.fields||{},w=(u=m[or])===null||u===void 0?void 0:u.arrayValue,S=(c=g[or])===null||c===void 0?void 0:c.arrayValue,x=G(((h=w?.values)===null||h===void 0?void 0:h.length)||0,((f=S?.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:_l(w,S)}(r.mapValue,t.mapValue);case 11:return function(i,o){if(i===Me.mapValue&&o===Me.mapValue)return 0;if(i===Me.mapValue)return 1;if(o===Me.mapValue)return-1;const u=i.fields||{},c=Object.keys(u),h=o.fields||{},f=Object.keys(h);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const g=la(c[m],f[m]);if(g!==0)return g;const w=Ge(u[c[m]],h[f[m]]);if(w!==0)return w}return G(c.length,f.length)}(r.mapValue,t.mapValue);default:throw U(23264,{le:e})}}function gl(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return G(r,t);const e=Ee(r),n=Ee(t),s=G(e.seconds,n.seconds);return s!==0?s:G(e.nanos,n.nanos)}function _l(r,t){const e=r.values||[],n=t.values||[];for(let s=0;s<e.length&&s<n.length;++s){const i=Ge(e[s],n[s]);if(i)return i}return G(e.length,n.length)}function ar(r){return _a(r)}function _a(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(e){const n=Ee(e);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(e){return we(e).toBase64()}(r.bytesValue):"referenceValue"in r?function(e){return N.fromName(e).toString()}(r.referenceValue):"geoPointValue"in r?function(e){return`geo(${e.latitude},${e.longitude})`}(r.geoPointValue):"arrayValue"in r?function(e){let n="[",s=!0;for(const i of e.values||[])s?s=!1:n+=",",n+=_a(i);return n+"]"}(r.arrayValue):"mapValue"in r?function(e){const n=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${_a(e.fields[o])}`;return s+"}"}(r.mapValue):U(61005,{value:r})}function Ri(r){switch(ze(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=so(r);return t?16+Ri(t):16;case 5:return 2*r.stringValue.length;case 6:return we(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((s,i)=>s+Ri(i),0)}(r.arrayValue);case 10:case 11:return function(n){let s=0;return Je(n.fields,(i,o)=>{s+=i.length+Ri(o)}),s}(r.mapValue);default:throw U(13486,{value:r})}}function In(r,t){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${t.path.canonicalString()}`}}function ya(r){return!!r&&"integerValue"in r}function ws(r){return!!r&&"arrayValue"in r}function yl(r){return!!r&&"nullValue"in r}function Tl(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function bi(r){return!!r&&"mapValue"in r}function io(r){var t,e;return((e=(((t=r?.mapValue)===null||t===void 0?void 0:t.fields)||{})[Ha])===null||e===void 0?void 0:e.stringValue)===Xa}function cs(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const t={mapValue:{fields:{}}};return Je(r.mapValue.fields,(e,n)=>t.mapValue.fields[e]=cs(n)),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(r.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=cs(r.arrayValue.values[e]);return t}return Object.assign({},r)}function Sd(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Pd}const Vd={mapValue:{fields:{[Ha]:{stringValue:Xa},[or]:{arrayValue:{}}}}};function $g(r){return"nullValue"in r?Ai:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?In(je.empty(),N.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?io(r)?Vd:{mapValue:{}}:U(35942,{value:r})}function Kg(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?In(je.empty(),N.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Vd:"mapValue"in r?io(r)?{mapValue:{}}:Me:U(61959,{value:r})}function Il(r,t){const e=Ge(r.value,t.value);return e!==0?e:r.inclusive&&!t.inclusive?-1:!r.inclusive&&t.inclusive?1:0}function El(r,t){const e=Ge(r.value,t.value);return e!==0?e:r.inclusive&&!t.inclusive?1:!r.inclusive&&t.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(t){this.value=t}static empty(){return new St({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!bi(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=cs(e)}setAll(t){let e=lt.emptyPath(),n={},s=[];t.forEach((o,u)=>{if(!e.isImmediateParentOf(u)){const c=this.getFieldsMap(e);this.applyChanges(c,n,s),n={},s=[],e=u.popLast()}o?n[u.lastSegment()]=cs(o):s.push(u.lastSegment())});const i=this.getFieldsMap(e);this.applyChanges(i,n,s)}delete(t){const e=this.field(t.popLast());bi(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return fe(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let s=e.mapValue.fields[t.get(n)];bi(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,n){Je(e,(s,i)=>t[s]=i);for(const s of n)delete t[s]}clone(){return new St(cs(this.value))}}function Cd(r){const t=[];return Je(r.fields,(e,n)=>{const s=new lt([e]);if(bi(n)){const i=Cd(n.mapValue).fields;if(i.length===0)t.push(s);else for(const o of i)t.push(s.child(o))}else t.push(s)}),new $t(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(t,e,n,s,i,o,u){this.key=t,this.documentType=e,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=u}static newInvalidDocument(t){return new ct(t,0,j.min(),j.min(),j.min(),St.empty(),0)}static newFoundDocument(t,e,n,s){return new ct(t,1,e,j.min(),n,s,0)}static newNoDocument(t,e){return new ct(t,2,e,j.min(),j.min(),St.empty(),0)}static newUnknownDocument(t,e){return new ct(t,3,e,j.min(),j.min(),St.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(j.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=St.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=St.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=j.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof ct&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new ct(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(t,e){this.position=t,this.inclusive=e}}function wl(r,t,e){let n=0;for(let s=0;s<r.position.length;s++){const i=t[s],o=r.position[s];if(i.field.isKeyField()?n=N.comparator(N.fromName(o.referenceValue),e.key):n=Ge(o,e.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function vl(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let e=0;e<r.position.length;e++)if(!fe(r.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs{constructor(t,e="asc"){this.field=t,this.dir=e}}function Qg(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd{}class X extends xd{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,n):new Wg(t,e,n):e==="array-contains"?new Jg(t,n):e==="in"?new Md(t,n):e==="not-in"?new Yg(t,n):e==="array-contains-any"?new Zg(t,n):new X(t,e,n)}static createKeyFieldInFilter(t,e,n){return e==="in"?new Hg(t,n):new Xg(t,n)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(Ge(e,this.value)):e!==null&&ze(this.value)===ze(e)&&this.matchesComparison(Ge(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return U(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class et extends xd{constructor(t,e){super(),this.filters=t,this.op=e,this.he=null}static create(t,e){return new et(t,e)}matches(t){return ur(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function ur(r){return r.op==="and"}function Ta(r){return r.op==="or"}function Ja(r){return Dd(r)&&ur(r)}function Dd(r){for(const t of r.filters)if(t instanceof et)return!1;return!0}function Ia(r){if(r instanceof X)return r.field.canonicalString()+r.op.toString()+ar(r.value);if(Ja(r))return r.filters.map(t=>Ia(t)).join(",");{const t=r.filters.map(e=>Ia(e)).join(",");return`${r.op}(${t})`}}function kd(r,t){return r instanceof X?function(n,s){return s instanceof X&&n.op===s.op&&n.field.isEqual(s.field)&&fe(n.value,s.value)}(r,t):r instanceof et?function(n,s){return s instanceof et&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((i,o,u)=>i&&kd(o,s.filters[u]),!0):!1}(r,t):void U(19439)}function Nd(r,t){const e=r.filters.concat(t);return et.create(e,r.op)}function Od(r){return r instanceof X?function(e){return`${e.field.canonicalString()} ${e.op} ${ar(e.value)}`}(r):r instanceof et?function(e){return e.op.toString()+" {"+e.getFilters().map(Od).join(" ,")+"}"}(r):"Filter"}class Wg extends X{constructor(t,e,n){super(t,e,n),this.key=N.fromName(n.referenceValue)}matches(t){const e=N.comparator(t.key,this.key);return this.matchesComparison(e)}}class Hg extends X{constructor(t,e){super(t,"in",e),this.keys=Fd("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class Xg extends X{constructor(t,e){super(t,"not-in",e),this.keys=Fd("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Fd(r,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(n=>N.fromName(n.referenceValue))}class Jg extends X{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return ws(e)&&Es(e.arrayValue,this.value)}}class Md extends X{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Es(this.value.arrayValue,e)}}class Yg extends X{constructor(t,e){super(t,"not-in",e)}matches(t){if(Es(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Es(this.value.arrayValue,e)}}class Zg extends X{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!ws(e)||!e.arrayValue.values)&&e.arrayValue.values.some(n=>Es(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t_{constructor(t,e=null,n=[],s=[],i=null,o=null,u=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=u,this.Pe=null}}function Ea(r,t=null,e=[],n=[],s=null,i=null,o=null){return new t_(r,t,e,n,s,i,o)}function En(r){const t=O(r);if(t.Pe===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(n=>Ia(n)).join(","),e+="|ob:",e+=t.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),Cs(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(n=>ar(n)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(n=>ar(n)).join(",")),t.Pe=e}return t.Pe}function Ds(r,t){if(r.limit!==t.limit||r.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<r.orderBy.length;e++)if(!Qg(r.orderBy[e],t.orderBy[e]))return!1;if(r.filters.length!==t.filters.length)return!1;for(let e=0;e<r.filters.length;e++)if(!kd(r.filters[e],t.filters[e]))return!1;return r.collectionGroup===t.collectionGroup&&!!r.path.isEqual(t.path)&&!!vl(r.startAt,t.startAt)&&vl(r.endAt,t.endAt)}function Fi(r){return N.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Mi(r,t){return r.filters.filter(e=>e instanceof X&&e.field.isEqual(t))}function Al(r,t,e){let n=Ai,s=!0;for(const i of Mi(r,t)){let o=Ai,u=!0;switch(i.op){case"<":case"<=":o=$g(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,u=!1;break;case"!=":case"not-in":o=Ai}Il({value:n,inclusive:s},{value:o,inclusive:u})<0&&(n=o,s=u)}if(e!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(t)){const o=e.position[i];Il({value:n,inclusive:s},{value:o,inclusive:e.inclusive})<0&&(n=o,s=e.inclusive);break}}return{value:n,inclusive:s}}function Rl(r,t,e){let n=Me,s=!0;for(const i of Mi(r,t)){let o=Me,u=!0;switch(i.op){case">=":case">":o=Kg(i.value),u=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,u=!1;break;case"!=":case"not-in":o=Me}El({value:n,inclusive:s},{value:o,inclusive:u})>0&&(n=o,s=u)}if(e!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(t)){const o=e.position[i];El({value:n,inclusive:s},{value:o,inclusive:e.inclusive})>0&&(n=o,s=e.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(t,e=null,n=[],s=[],i=null,o="F",u=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=u,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function Ld(r,t,e,n,s,i,o,u){return new ve(r,t,e,n,s,i,o,u)}function Ir(r){return new ve(r)}function bl(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Ya(r){return r.collectionGroup!==null}function Xn(r){const t=O(r);if(t.Te===null){t.Te=[];const e=new Set;for(const i of t.explicitOrderBy)t.Te.push(i),e.add(i.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(o){let u=new rt(lt.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(u=u.add(h.field))})}),u})(t).forEach(i=>{e.has(i.canonicalString())||i.isKeyField()||t.Te.push(new vs(i,n))}),e.has(lt.keyField().canonicalString())||t.Te.push(new vs(lt.keyField(),n))}return t.Te}function Mt(r){const t=O(r);return t.Ie||(t.Ie=qd(t,Xn(r))),t.Ie}function Ud(r){const t=O(r);return t.de||(t.de=qd(t,r.explicitOrderBy)),t.de}function qd(r,t){if(r.limitType==="F")return Ea(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new vs(s.field,i)});const e=r.endAt?new $e(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new $e(r.startAt.position,r.startAt.inclusive):null;return Ea(r.path,r.collectionGroup,t,r.filters,r.limit,e,n)}}function wa(r,t){const e=r.filters.concat([t]);return new ve(r.path,r.collectionGroup,r.explicitOrderBy.slice(),e,r.limit,r.limitType,r.startAt,r.endAt)}function Li(r,t,e){return new ve(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),t,e,r.startAt,r.endAt)}function ks(r,t){return Ds(Mt(r),Mt(t))&&r.limitType===t.limitType}function Bd(r){return`${En(Mt(r))}|lt:${r.limitType}`}function Qn(r){return`Query(target=${function(e){let n=e.path.canonicalString();return e.collectionGroup!==null&&(n+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(n+=`, filters: [${e.filters.map(s=>Od(s)).join(", ")}]`),Cs(e.limit)||(n+=", limit: "+e.limit),e.orderBy.length>0&&(n+=`, orderBy: [${e.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),e.startAt&&(n+=", startAt: ",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>ar(s)).join(",")),e.endAt&&(n+=", endAt: ",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>ar(s)).join(",")),`Target(${n})`}(Mt(r))}; limitType=${r.limitType})`}function Ns(r,t){return t.isFoundDocument()&&function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):N.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(r,t)&&function(n,s){for(const i of Xn(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(r,t)&&function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0}(r,t)&&function(n,s){return!(n.startAt&&!function(o,u,c){const h=wl(o,u,c);return o.inclusive?h<=0:h<0}(n.startAt,Xn(n),s)||n.endAt&&!function(o,u,c){const h=wl(o,u,c);return o.inclusive?h>=0:h>0}(n.endAt,Xn(n),s))}(r,t)}function jd(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function zd(r){return(t,e)=>{let n=!1;for(const s of Xn(r)){const i=e_(s,t,e);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function e_(r,t,e){const n=r.field.isKeyField()?N.comparator(t.key,e.key):function(i,o,u){const c=o.data.field(i),h=u.data.field(i);return c!==null&&h!==null?Ge(c,h):U(42886)}(r.field,t,e);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return U(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const n=this.mapKeyFn(t),s=this.inner[n];if(s===void 0)return this.inner[n]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],t))return n.length===1?delete this.inner[e]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Je(this.inner,(e,n)=>{for(const[s,i]of n)t(s,i)})}isEmpty(){return Ed(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n_=new ot(N.comparator);function Kt(){return n_}const Gd=new ot(N.comparator);function ns(...r){let t=Gd;for(const e of r)t=t.insert(e.key,e);return t}function $d(r){let t=Gd;return r.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function ce(){return ls()}function Kd(){return ls()}function ls(){return new Ae(r=>r.toString(),(r,t)=>r.isEqual(t))}const r_=new ot(N.comparator),s_=new rt(N.comparator);function K(...r){let t=s_;for(const e of r)t=t.add(e);return t}const i_=new rt(G);function Za(){return i_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tu(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ps(t)?"-0":t}}function Qd(r){return{integerValue:""+r}}function Wd(r,t){return cd(t)?Qd(t):tu(r,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(){this._=void 0}}function o_(r,t,e){return r instanceof cr?function(s,i){const o={fields:{[Ad]:{stringValue:vd},[bd]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ro(i)&&(i=so(i)),i&&(o.fields[Rd]=i),{mapValue:o}}(e,t):r instanceof wn?Xd(r,t):r instanceof vn?Jd(r,t):function(s,i){const o=Hd(s,i),u=Pl(o)+Pl(s.Ee);return ya(o)&&ya(s.Ee)?Qd(u):tu(s.serializer,u)}(r,t)}function a_(r,t,e){return r instanceof wn?Xd(r,t):r instanceof vn?Jd(r,t):e}function Hd(r,t){return r instanceof lr?function(n){return ya(n)||function(i){return!!i&&"doubleValue"in i}(n)}(t)?t:{integerValue:0}:null}class cr extends oo{}class wn extends oo{constructor(t){super(),this.elements=t}}function Xd(r,t){const e=Yd(t);for(const n of r.elements)e.some(s=>fe(s,n))||e.push(n);return{arrayValue:{values:e}}}class vn extends oo{constructor(t){super(),this.elements=t}}function Jd(r,t){let e=Yd(t);for(const n of r.elements)e=e.filter(s=>!fe(s,n));return{arrayValue:{values:e}}}class lr extends oo{constructor(t,e){super(),this.serializer=t,this.Ee=e}}function Pl(r){return ht(r.integerValue||r.doubleValue)}function Yd(r){return ws(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(t,e){this.field=t,this.transform=e}}function u_(r,t){return r.field.isEqual(t.field)&&function(n,s){return n instanceof wn&&s instanceof wn||n instanceof vn&&s instanceof vn?Yn(n.elements,s.elements,fe):n instanceof lr&&s instanceof lr?fe(n.Ee,s.Ee):n instanceof cr&&s instanceof cr}(r.transform,t.transform)}class c_{constructor(t,e){this.version=t,this.transformResults=e}}class dt{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new dt}static exists(t){return new dt(void 0,t)}static updateTime(t){return new dt(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Pi(r,t){return r.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(r.updateTime):r.exists===void 0||r.exists===t.isFoundDocument()}class ao{}function Zd(r,t){if(!r.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return r.isNoDocument()?new wr(r.key,dt.none()):new Er(r.key,r.data,dt.none());{const e=r.data,n=St.empty();let s=new rt(lt.comparator);for(let i of t.fields)if(!s.has(i)){let o=e.field(i);o===null&&i.length>1&&(i=i.popLast(),o=e.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new Re(r.key,n,new $t(s.toArray()),dt.none())}}function l_(r,t,e){r instanceof Er?function(s,i,o){const u=s.value.clone(),c=Vl(s.fieldTransforms,i,o.transformResults);u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(r,t,e):r instanceof Re?function(s,i,o){if(!Pi(s.precondition,i))return void i.convertToUnknownDocument(o.version);const u=Vl(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(tf(s)),c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(r,t,e):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,t,e)}function hs(r,t,e,n){return r instanceof Er?function(i,o,u,c){if(!Pi(i.precondition,o))return u;const h=i.value.clone(),f=Cl(i.fieldTransforms,c,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(r,t,e,n):r instanceof Re?function(i,o,u,c){if(!Pi(i.precondition,o))return u;const h=Cl(i.fieldTransforms,c,o),f=o.data;return f.setAll(tf(i)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(r,t,e,n):function(i,o,u){return Pi(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):u}(r,t,e)}function h_(r,t){let e=null;for(const n of r.fieldTransforms){const s=t.data.field(n.field),i=Hd(n.transform,s||null);i!=null&&(e===null&&(e=St.empty()),e.set(n.field,i))}return e||null}function Sl(r,t){return r.type===t.type&&!!r.key.isEqual(t.key)&&!!r.precondition.isEqual(t.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Yn(n,s,(i,o)=>u_(i,o))}(r.fieldTransforms,t.fieldTransforms)&&(r.type===0?r.value.isEqual(t.value):r.type!==1||r.data.isEqual(t.data)&&r.fieldMask.isEqual(t.fieldMask))}class Er extends ao{constructor(t,e,n,s=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Re extends ao{constructor(t,e,n,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function tf(r){const t=new Map;return r.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const n=r.data.field(e);t.set(e,n)}}),t}function Vl(r,t,e){const n=new Map;B(r.length===e.length,32656,{Ae:e.length,Re:r.length});for(let s=0;s<e.length;s++){const i=r[s],o=i.transform,u=t.data.field(i.field);n.set(i.field,a_(o,u,e[s]))}return n}function Cl(r,t,e){const n=new Map;for(const s of r){const i=s.transform,o=e.data.field(s.field);n.set(s.field,o_(i,o,t))}return n}class wr extends ao{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class eu extends ao{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{constructor(t,e,n,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&l_(i,t,n[s])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=hs(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=hs(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=Kd();return this.mutations.forEach(s=>{const i=t.get(s.key),o=i.overlayedDocument;let u=this.applyToLocalView(o,i.mutatedFields);u=e.has(s.key)?null:u;const c=Zd(o,u);c!==null&&n.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(j.min())}),n}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),K())}isEqual(t){return this.batchId===t.batchId&&Yn(this.mutations,t.mutations,(e,n)=>Sl(e,n))&&Yn(this.baseMutations,t.baseMutations,(e,n)=>Sl(e,n))}}class ru{constructor(t,e,n,s){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=s}static from(t,e,n){B(t.mutations.length===n.length,58842,{Ve:t.mutations.length,me:n.length});let s=function(){return r_}();const i=t.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new ru(t,e,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ef{constructor(t,e,n){this.alias=t,this.aggregateType=e,this.fieldPath=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d_{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Tt,J;function nf(r){switch(r){case b.OK:return U(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return U(15467,{code:r})}}function rf(r){if(r===void 0)return _t("GRPC error has no .code"),b.UNKNOWN;switch(r){case Tt.OK:return b.OK;case Tt.CANCELLED:return b.CANCELLED;case Tt.UNKNOWN:return b.UNKNOWN;case Tt.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case Tt.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case Tt.INTERNAL:return b.INTERNAL;case Tt.UNAVAILABLE:return b.UNAVAILABLE;case Tt.UNAUTHENTICATED:return b.UNAUTHENTICATED;case Tt.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case Tt.NOT_FOUND:return b.NOT_FOUND;case Tt.ALREADY_EXISTS:return b.ALREADY_EXISTS;case Tt.PERMISSION_DENIED:return b.PERMISSION_DENIED;case Tt.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case Tt.ABORTED:return b.ABORTED;case Tt.OUT_OF_RANGE:return b.OUT_OF_RANGE;case Tt.UNIMPLEMENTED:return b.UNIMPLEMENTED;case Tt.DATA_LOSS:return b.DATA_LOSS;default:return U(39323,{code:r})}}(J=Tt||(Tt={}))[J.OK=0]="OK",J[J.CANCELLED=1]="CANCELLED",J[J.UNKNOWN=2]="UNKNOWN",J[J.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",J[J.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",J[J.NOT_FOUND=5]="NOT_FOUND",J[J.ALREADY_EXISTS=6]="ALREADY_EXISTS",J[J.PERMISSION_DENIED=7]="PERMISSION_DENIED",J[J.UNAUTHENTICATED=16]="UNAUTHENTICATED",J[J.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",J[J.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",J[J.ABORTED=10]="ABORTED",J[J.OUT_OF_RANGE=11]="OUT_OF_RANGE",J[J.UNIMPLEMENTED=12]="UNIMPLEMENTED",J[J.INTERNAL=13]="INTERNAL",J[J.UNAVAILABLE=14]="UNAVAILABLE",J[J.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ui=null;/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_=new Ue([4294967295,4294967295],0);function xl(r){const t=Ba().encode(r),e=new $h;return e.update(t),new Uint8Array(e.digest())}function Dl(r){const t=new DataView(r.buffer),e=t.getUint32(0,!0),n=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new Ue([e,n],0),new Ue([s,i],0)]}class iu{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new rs(`Invalid padding: ${e}`);if(n<0)throw new rs(`Invalid hash count: ${n}`);if(t.length>0&&this.hashCount===0)throw new rs(`Invalid hash count: ${n}`);if(t.length===0&&e!==0)throw new rs(`Invalid padding when bitmap length is 0: ${e}`);this.fe=8*t.length-e,this.ge=Ue.fromNumber(this.fe)}pe(t,e,n){let s=t.add(e.multiply(Ue.fromNumber(n)));return s.compare(f_)===1&&(s=new Ue([s.getBits(0),s.getBits(1)],0)),s.modulo(this.ge).toNumber()}ye(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.fe===0)return!1;const e=xl(t),[n,s]=Dl(e);for(let i=0;i<this.hashCount;i++){const o=this.pe(n,s,i);if(!this.ye(o))return!1}return!0}static create(t,e,n){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),o=new iu(i,s,e);return n.forEach(u=>o.insert(u)),o}insert(t){if(this.fe===0)return;const e=xl(t),[n,s]=Dl(e);for(let i=0;i<this.hashCount;i++){const o=this.pe(n,s,i);this.we(o)}}we(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class rs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(t,e,n,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const s=new Map;return s.set(t,Ms.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new Fs(j.min(),s,new ot(G),Kt(),K())}}class Ms{constructor(t,e,n,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new Ms(n,e,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(t,e,n,s){this.Se=t,this.removedTargetIds=e,this.key=n,this.be=s}}class sf{constructor(t,e){this.targetId=t,this.De=e}}class of{constructor(t,e,n=pt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=s}}class kl{constructor(){this.ve=0,this.Ce=Nl(),this.Fe=pt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(t){t.approximateByteSize()>0&&(this.xe=!0,this.Fe=t)}Le(){let t=K(),e=K(),n=K();return this.Ce.forEach((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:n=n.add(s);break;default:U(38017,{changeType:i})}}),new Ms(this.Fe,this.Me,t,e,n)}ke(){this.xe=!1,this.Ce=Nl()}qe(t,e){this.xe=!0,this.Ce=this.Ce.insert(t,e)}Qe(t){this.xe=!0,this.Ce=this.Ce.remove(t)}$e(){this.ve+=1}Ue(){this.ve-=1,B(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class m_{constructor(t){this.We=t,this.Ge=new Map,this.ze=Kt(),this.je=fi(),this.Je=fi(),this.He=new ot(G)}Ye(t){for(const e of t.Se)t.be&&t.be.isFoundDocument()?this.Ze(e,t.be):this.Xe(e,t.key,t.be);for(const e of t.removedTargetIds)this.Xe(e,t.key,t.be)}et(t){this.forEachTarget(t,e=>{const n=this.tt(e);switch(t.state){case 0:this.nt(e)&&n.Be(t.resumeToken);break;case 1:n.Ue(),n.Oe||n.ke(),n.Be(t.resumeToken);break;case 2:n.Ue(),n.Oe||this.removeTarget(e);break;case 3:this.nt(e)&&(n.Ke(),n.Be(t.resumeToken));break;case 4:this.nt(e)&&(this.rt(e),n.Be(t.resumeToken));break;default:U(56790,{state:t.state})}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Ge.forEach((n,s)=>{this.nt(s)&&e(s)})}it(t){const e=t.targetId,n=t.De.count,s=this.st(e);if(s){const i=s.target;if(Fi(i))if(n===0){const o=new N(i.path);this.Xe(e,o,ct.newNoDocument(o,j.min()))}else B(n===1,20013,{expectedCount:n});else{const o=this.ot(e);if(o!==n){const u=this._t(t),c=u?this.ut(u,t,o):1;if(c!==0){this.rt(e);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(e,h)}Ui?.ct(function(f,m,g,w,S){var x,C,L,q,M,z;const H={localCacheCount:f,existenceFilterCount:m.count,databaseId:g.database,projectId:g.projectId},$=m.unchangedNames;return $&&(H.bloomFilter={applied:S===0,hashCount:(x=$?.hashCount)!==null&&x!==void 0?x:0,bitmapLength:(q=(L=(C=$?.bits)===null||C===void 0?void 0:C.bitmap)===null||L===void 0?void 0:L.length)!==null&&q!==void 0?q:0,padding:(z=(M=$?.bits)===null||M===void 0?void 0:M.padding)!==null&&z!==void 0?z:0,mightContain:I=>{var _;return(_=w?.mightContain(I))!==null&&_!==void 0&&_}}),H}(o,t.De,this.We.lt(),u,c))}}}}_t(t){const e=t.De.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=e;let o,u;try{o=we(n).toUint8Array()}catch(c){if(c instanceof wd)return Lt("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new iu(o,s,i)}catch(c){return Lt(c instanceof rs?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.fe===0?null:u}ut(t,e,n){return e.De.count===n-this.ht(t,e.targetId)?0:2}ht(t,e){const n=this.We.getRemoteKeysForTarget(e);let s=0;return n.forEach(i=>{const o=this.We.lt(),u=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;t.mightContain(u)||(this.Xe(e,i,null),s++)}),s}Pt(t){const e=new Map;this.Ge.forEach((i,o)=>{const u=this.st(o);if(u){if(i.current&&Fi(u.target)){const c=new N(u.target.path);this.Tt(c).has(o)||this.It(o,c)||this.Xe(o,c,ct.newNoDocument(c,t))}i.Ne&&(e.set(o,i.Le()),i.ke())}});let n=K();this.Je.forEach((i,o)=>{let u=!0;o.forEachWhile(c=>{const h=this.st(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(n=n.add(i))}),this.ze.forEach((i,o)=>o.setReadTime(t));const s=new Fs(t,e,this.He,this.ze,n);return this.ze=Kt(),this.je=fi(),this.Je=fi(),this.He=new ot(G),s}Ze(t,e){if(!this.nt(t))return;const n=this.It(t,e.key)?2:0;this.tt(t).qe(e.key,n),this.ze=this.ze.insert(e.key,e),this.je=this.je.insert(e.key,this.Tt(e.key).add(t)),this.Je=this.Je.insert(e.key,this.dt(e.key).add(t))}Xe(t,e,n){if(!this.nt(t))return;const s=this.tt(t);this.It(t,e)?s.qe(e,1):s.Qe(e),this.Je=this.Je.insert(e,this.dt(e).delete(t)),this.Je=this.Je.insert(e,this.dt(e).add(t)),n&&(this.ze=this.ze.insert(e,n))}removeTarget(t){this.Ge.delete(t)}ot(t){const e=this.tt(t).Le();return this.We.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}$e(t){this.tt(t).$e()}tt(t){let e=this.Ge.get(t);return e||(e=new kl,this.Ge.set(t,e)),e}dt(t){let e=this.Je.get(t);return e||(e=new rt(G),this.Je=this.Je.insert(t,e)),e}Tt(t){let e=this.je.get(t);return e||(e=new rt(G),this.je=this.je.insert(t,e)),e}nt(t){const e=this.st(t)!==null;return e||k("WatchChangeAggregator","Detected inactive target",t),e}st(t){const e=this.Ge.get(t);return e&&e.Oe?null:this.We.Et(t)}rt(t){this.Ge.set(t,new kl),this.We.getRemoteKeysForTarget(t).forEach(e=>{this.Xe(t,e,null)})}It(t,e){return this.We.getRemoteKeysForTarget(t).has(e)}}function fi(){return new ot(N.comparator)}function Nl(){return new ot(N.comparator)}const p_={asc:"ASCENDING",desc:"DESCENDING"},g_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},__={and:"AND",or:"OR"};class y_{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function va(r,t){return r.useProto3Json||Cs(t)?t:{value:t}}function hr(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function af(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function T_(r,t){return hr(r,t.toTimestamp())}function yt(r){return B(!!r,49232),j.fromTimestamp(function(e){const n=Ee(e);return new tt(n.seconds,n.nanos)}(r))}function ou(r,t){return Aa(r,t).canonicalString()}function Aa(r,t){const e=function(s){return new Q(["projects",s.projectId,"databases",s.database])}(r).child("documents");return t===void 0?e:e.child(t)}function uf(r){const t=Q.fromString(r);return B(_f(t),10190,{key:t.toString()}),t}function As(r,t){return ou(r.databaseId,t.path)}function he(r,t){const e=uf(t);if(e.get(1)!==r.databaseId.projectId)throw new D(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+r.databaseId.projectId);if(e.get(3)!==r.databaseId.database)throw new D(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+r.databaseId.database);return new N(hf(e))}function cf(r,t){return ou(r.databaseId,t)}function lf(r){const t=uf(r);return t.length===4?Q.emptyPath():hf(t)}function Ra(r){return new Q(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function hf(r){return B(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Ol(r,t,e){return{name:As(r,t),fields:e.value.mapValue.fields}}function uo(r,t,e){const n=he(r,t.name),s=yt(t.updateTime),i=t.createTime?yt(t.createTime):j.min(),o=new St({mapValue:{fields:t.fields}}),u=ct.newFoundDocument(n,s,i,o);return e&&u.setHasCommittedMutations(),e?u.setHasCommittedMutations():u}function I_(r,t){return"found"in t?function(n,s){B(!!s.found,43571),s.found.name,s.found.updateTime;const i=he(n,s.found.name),o=yt(s.found.updateTime),u=s.found.createTime?yt(s.found.createTime):j.min(),c=new St({mapValue:{fields:s.found.fields}});return ct.newFoundDocument(i,o,u,c)}(r,t):"missing"in t?function(n,s){B(!!s.missing,3894),B(!!s.readTime,22933);const i=he(n,s.missing),o=yt(s.readTime);return ct.newNoDocument(i,o)}(r,t):U(7234,{result:t})}function E_(r,t){let e;if("targetChange"in t){t.targetChange;const n=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:U(39313,{state:h})}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=function(h,f){return h.useProto3Json?(B(f===void 0||typeof f=="string",58123),pt.fromBase64String(f||"")):(B(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),pt.fromUint8Array(f||new Uint8Array))}(r,t.targetChange.resumeToken),o=t.targetChange.cause,u=o&&function(h){const f=h.code===void 0?b.UNKNOWN:rf(h.code);return new D(f,h.message||"")}(o);e=new of(n,s,i,u||null)}else if("documentChange"in t){t.documentChange;const n=t.documentChange;n.document,n.document.name,n.document.updateTime;const s=he(r,n.document.name),i=yt(n.document.updateTime),o=n.document.createTime?yt(n.document.createTime):j.min(),u=new St({mapValue:{fields:n.document.fields}}),c=ct.newFoundDocument(s,i,o,u),h=n.targetIds||[],f=n.removedTargetIds||[];e=new Si(h,f,c.key,c)}else if("documentDelete"in t){t.documentDelete;const n=t.documentDelete;n.document;const s=he(r,n.document),i=n.readTime?yt(n.readTime):j.min(),o=ct.newNoDocument(s,i),u=n.removedTargetIds||[];e=new Si([],u,o.key,o)}else if("documentRemove"in t){t.documentRemove;const n=t.documentRemove;n.document;const s=he(r,n.document),i=n.removedTargetIds||[];e=new Si([],i,s,null)}else{if(!("filter"in t))return U(11601,{At:t});{t.filter;const n=t.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new d_(s,i),u=n.targetId;e=new sf(u,o)}}return e}function Rs(r,t){let e;if(t instanceof Er)e={update:Ol(r,t.key,t.value)};else if(t instanceof wr)e={delete:As(r,t.key)};else if(t instanceof Re)e={update:Ol(r,t.key,t.data),updateMask:P_(t.fieldMask)};else{if(!(t instanceof eu))return U(16599,{Rt:t.type});e={verify:As(r,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(n=>function(i,o){const u=o.transform;if(u instanceof cr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof wn)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof vn)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof lr)return{fieldPath:o.field.canonicalString(),increment:u.Ee};throw U(20930,{transform:o.transform})}(0,n))),t.precondition.isNone||(e.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:T_(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:U(27497)}(r,t.precondition)),e}function ba(r,t){const e=t.currentDocument?function(i){return i.updateTime!==void 0?dt.updateTime(yt(i.updateTime)):i.exists!==void 0?dt.exists(i.exists):dt.none()}(t.currentDocument):dt.none(),n=t.updateTransforms?t.updateTransforms.map(s=>function(o,u){let c=null;if("setToServerValue"in u)B(u.setToServerValue==="REQUEST_TIME",16630,{proto:u}),c=new cr;else if("appendMissingElements"in u){const f=u.appendMissingElements.values||[];c=new wn(f)}else if("removeAllFromArray"in u){const f=u.removeAllFromArray.values||[];c=new vn(f)}else"increment"in u?c=new lr(o,u.increment):U(16584,{proto:u});const h=lt.fromServerFormat(u.fieldPath);return new Os(h,c)}(r,s)):[];if(t.update){t.update.name;const s=he(r,t.update.name),i=new St({mapValue:{fields:t.update.fields}});if(t.updateMask){const o=function(c){const h=c.fieldPaths||[];return new $t(h.map(f=>lt.fromServerFormat(f)))}(t.updateMask);return new Re(s,i,o,e,n)}return new Er(s,i,e,n)}if(t.delete){const s=he(r,t.delete);return new wr(s,e)}if(t.verify){const s=he(r,t.verify);return new eu(s,e)}return U(1463,{proto:t})}function w_(r,t){return r&&r.length>0?(B(t!==void 0,14353),r.map(e=>function(s,i){let o=s.updateTime?yt(s.updateTime):yt(i);return o.isEqual(j.min())&&(o=yt(i)),new c_(o,s.transformResults||[])}(e,t))):[]}function df(r,t){return{documents:[cf(r,t.path)]}}function co(r,t){const e={structuredQuery:{}},n=t.path;let s;t.collectionGroup!==null?(s=n,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=n.popLast(),e.structuredQuery.from=[{collectionId:n.lastSegment()}]),e.parent=cf(r,s);const i=function(h){if(h.length!==0)return gf(et.create(h,"and"))}(t.filters);i&&(e.structuredQuery.where=i);const o=function(h){if(h.length!==0)return h.map(f=>function(g){return{field:Oe(g.field),direction:A_(g.dir)}}(f))}(t.orderBy);o&&(e.structuredQuery.orderBy=o);const u=va(r,t.limit);return u!==null&&(e.structuredQuery.limit=u),t.startAt&&(e.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(t.endAt)),{Vt:e,parent:s}}function ff(r,t,e,n){const{Vt:s,parent:i}=co(r,t),o={},u=[];let c=0;return e.forEach(h=>{const f=n?h.alias:"aggregate_"+c++;o[f]=h.alias,h.aggregateType==="count"?u.push({alias:f,count:{}}):h.aggregateType==="avg"?u.push({alias:f,avg:{field:Oe(h.fieldPath)}}):h.aggregateType==="sum"&&u.push({alias:f,sum:{field:Oe(h.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:u,structuredQuery:s.structuredQuery},parent:s.parent},ft:o,parent:i}}function mf(r){let t=lf(r.parent);const e=r.structuredQuery,n=e.from?e.from.length:0;let s=null;if(n>0){B(n===1,65062);const f=e.from[0];f.allDescendants?s=f.collectionId:t=t.child(f.collectionId)}let i=[];e.where&&(i=function(m){const g=pf(m);return g instanceof et&&Ja(g)?g.getFilters():[g]}(e.where));let o=[];e.orderBy&&(o=function(m){return m.map(g=>function(S){return new vs(Wn(S.field),function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(S.direction))}(g))}(e.orderBy));let u=null;e.limit&&(u=function(m){let g;return g=typeof m=="object"?m.value:m,Cs(g)?null:g}(e.limit));let c=null;e.startAt&&(c=function(m){const g=!!m.before,w=m.values||[];return new $e(w,g)}(e.startAt));let h=null;return e.endAt&&(h=function(m){const g=!m.before,w=m.values||[];return new $e(w,g)}(e.endAt)),Ld(t,s,o,i,u,"F",c,h)}function v_(r,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return U(28987,{purpose:s})}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function pf(r){return r.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const n=Wn(e.unaryFilter.field);return X.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Wn(e.unaryFilter.field);return X.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Wn(e.unaryFilter.field);return X.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Wn(e.unaryFilter.field);return X.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return U(61313);default:return U(60726)}}(r):r.fieldFilter!==void 0?function(e){return X.create(Wn(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return U(58110);default:return U(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(e){return et.create(e.compositeFilter.filters.map(n=>pf(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return U(1026)}}(e.compositeFilter.op))}(r):U(30097,{filter:r})}function A_(r){return p_[r]}function R_(r){return g_[r]}function b_(r){return __[r]}function Oe(r){return{fieldPath:r.canonicalString()}}function Wn(r){return lt.fromServerFormat(r.fieldPath)}function gf(r){return r instanceof X?function(e){if(e.op==="=="){if(Tl(e.value))return{unaryFilter:{field:Oe(e.field),op:"IS_NAN"}};if(yl(e.value))return{unaryFilter:{field:Oe(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Tl(e.value))return{unaryFilter:{field:Oe(e.field),op:"IS_NOT_NAN"}};if(yl(e.value))return{unaryFilter:{field:Oe(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Oe(e.field),op:R_(e.op),value:e.value}}}(r):r instanceof et?function(e){const n=e.getFilters().map(s=>gf(s));return n.length===1?n[0]:{compositeFilter:{op:b_(e.op),filters:n}}}(r):U(54877,{filter:r})}function P_(r){const t=[];return r.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function _f(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(t,e,n,s,i=j.min(),o=j.min(),u=pt.EMPTY_BYTE_STRING,c=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(t){return new Te(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new Te(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new Te(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new Te(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yf{constructor(t){this.gt=t}}function S_(r,t){let e;if(t.document)e=uo(r.gt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const n=N.fromSegments(t.noDocument.path),s=Rn(t.noDocument.readTime);e=ct.newNoDocument(n,s),t.hasCommittedMutations&&e.setHasCommittedMutations()}else{if(!t.unknownDocument)return U(56709);{const n=N.fromSegments(t.unknownDocument.path),s=Rn(t.unknownDocument.version);e=ct.newUnknownDocument(n,s)}}return t.readTime&&e.setReadTime(function(s){const i=new tt(s[0],s[1]);return j.fromTimestamp(i)}(t.readTime)),e}function Fl(r,t){const e=t.key,n={prefixPath:e.getCollectionPath().popLast().toArray(),collectionGroup:e.collectionGroup,documentId:e.path.lastSegment(),readTime:qi(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())n.document=function(i,o){return{name:As(i,o.key),fields:o.data.value.mapValue.fields,updateTime:hr(i,o.version.toTimestamp()),createTime:hr(i,o.createTime.toTimestamp())}}(r.gt,t);else if(t.isNoDocument())n.noDocument={path:e.path.toArray(),readTime:An(t.version)};else{if(!t.isUnknownDocument())return U(57904,{document:t});n.unknownDocument={path:e.path.toArray(),version:An(t.version)}}return n}function qi(r){const t=r.toTimestamp();return[t.seconds,t.nanoseconds]}function An(r){const t=r.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function Rn(r){const t=new tt(r.seconds,r.nanoseconds);return j.fromTimestamp(t)}function dn(r,t){const e=(t.baseMutations||[]).map(i=>ba(r.gt,i));for(let i=0;i<t.mutations.length-1;++i){const o=t.mutations[i];if(i+1<t.mutations.length&&t.mutations[i+1].transform!==void 0){const u=t.mutations[i+1];o.updateTransforms=u.transform.fieldTransforms,t.mutations.splice(i+1,1),++i}}const n=t.mutations.map(i=>ba(r.gt,i)),s=tt.fromMillis(t.localWriteTimeMs);return new nu(t.batchId,s,e,n)}function ss(r){const t=Rn(r.readTime),e=r.lastLimboFreeSnapshotVersion!==void 0?Rn(r.lastLimboFreeSnapshotVersion):j.min();let n;return n=function(i){return i.documents!==void 0}(r.query)?function(i){const o=i.documents.length;return B(o===1,1966,{count:o}),Mt(Ir(lf(i.documents[0])))}(r.query):function(i){return Mt(mf(i))}(r.query),new Te(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,t,e,pt.fromBase64String(r.resumeToken))}function Tf(r,t){const e=An(t.snapshotVersion),n=An(t.lastLimboFreeSnapshotVersion);let s;s=Fi(t.target)?df(r.gt,t.target):co(r.gt,t.target).Vt;const i=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:En(t.target),readTime:e,resumeToken:i,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function lo(r){const t=mf({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Li(t,t.limit,"L"):t}function Jo(r,t){return new su(t.largestBatchId,ba(r.gt,t.overlayMutation))}function Ml(r,t){const e=t.path.lastSegment();return[r,Ft(t.path.popLast()),e]}function Ll(r,t,e,n){return{indexId:r,uid:t,sequenceNumber:e,readTime:An(n.readTime),documentKey:Ft(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{getBundleMetadata(t,e){return Ul(t).get(e).next(n=>{if(n)return function(i){return{id:i.bundleId,createTime:Rn(i.createTime),version:i.version}}(n)})}saveBundleMetadata(t,e){return Ul(t).put(function(s){return{bundleId:s.id,createTime:An(yt(s.createTime)),version:s.version}}(e))}getNamedQuery(t,e){return ql(t).get(e).next(n=>{if(n)return function(i){return{name:i.name,query:lo(i.bundledQuery),readTime:Rn(i.readTime)}}(n)})}saveNamedQuery(t,e){return ql(t).put(function(s){return{name:s.name,readTime:An(yt(s.readTime)),bundledQuery:s.bundledQuery}}(e))}}function Ul(r){return wt(r,to)}function ql(r){return wt(r,eo)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(t,e){this.serializer=t,this.userId=e}static yt(t,e){const n=e.uid||"";return new ho(t,n)}getOverlay(t,e){return Hr(t).get(Ml(this.userId,e)).next(n=>n?Jo(this.serializer,n):null)}getOverlays(t,e){const n=ce();return A.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(t,e,n){const s=[];return n.forEach((i,o)=>{const u=new su(e,o);s.push(this.wt(t,u))}),A.waitFor(s)}removeOverlaysForBatchId(t,e,n){const s=new Set;e.forEach(o=>s.add(Ft(o.getCollectionPath())));const i=[];return s.forEach(o=>{const u=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Hr(t).Y(pa,u))}),A.waitFor(i)}getOverlaysForCollection(t,e,n){const s=ce(),i=Ft(e),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Hr(t).j(pa,o).next(u=>{for(const c of u){const h=Jo(this.serializer,c);s.set(h.getKey(),h)}return s})}getOverlaysForCollectionGroup(t,e,n,s){const i=ce();let o;const u=IDBKeyRange.bound([this.userId,e,n],[this.userId,e,Number.POSITIVE_INFINITY],!0);return Hr(t).X({index:pd,range:u},(c,h,f)=>{const m=Jo(this.serializer,h);i.size()<s||m.largestBatchId===o?(i.set(m.getKey(),m),o=m.largestBatchId):f.done()}).next(()=>i)}wt(t,e){return Hr(t).put(function(s,i,o){const[u,c,h]=Ml(i,o.mutation.key);return{userId:i,collectionPath:c,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Rs(s.gt,o.mutation)}}(this.serializer,this.userId,e))}}function Hr(r){return wt(r,no)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C_{St(t){return wt(t,Qa)}getSessionToken(t){return this.St(t).get("sessionToken").next(e=>{const n=e?.value;return n?pt.fromUint8Array(n):pt.EMPTY_BYTE_STRING})}setSessionToken(t,e){return this.St(t).put({name:"sessionToken",value:e.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(){}bt(t,e){this.Dt(t,e),e.vt()}Dt(t,e){if("nullValue"in t)this.Ct(e,5);else if("booleanValue"in t)this.Ct(e,10),e.Ft(t.booleanValue?1:0);else if("integerValue"in t)this.Ct(e,15),e.Ft(ht(t.integerValue));else if("doubleValue"in t){const n=ht(t.doubleValue);isNaN(n)?this.Ct(e,13):(this.Ct(e,15),ps(n)?e.Ft(0):e.Ft(n))}else if("timestampValue"in t){let n=t.timestampValue;this.Ct(e,20),typeof n=="string"&&(n=Ee(n)),e.Mt(`${n.seconds||""}`),e.Ft(n.nanos||0)}else if("stringValue"in t)this.xt(t.stringValue,e),this.Ot(e);else if("bytesValue"in t)this.Ct(e,30),e.Nt(we(t.bytesValue)),this.Ot(e);else if("referenceValue"in t)this.Bt(t.referenceValue,e);else if("geoPointValue"in t){const n=t.geoPointValue;this.Ct(e,45),e.Ft(n.latitude||0),e.Ft(n.longitude||0)}else"mapValue"in t?Sd(t)?this.Ct(e,Number.MAX_SAFE_INTEGER):io(t)?this.Lt(t.mapValue,e):(this.kt(t.mapValue,e),this.Ot(e)):"arrayValue"in t?(this.qt(t.arrayValue,e),this.Ot(e)):U(19022,{Qt:t})}xt(t,e){this.Ct(e,25),this.$t(t,e)}$t(t,e){e.Mt(t)}kt(t,e){const n=t.fields||{};this.Ct(e,55);for(const s of Object.keys(n))this.xt(s,e),this.Dt(n[s],e)}Lt(t,e){var n,s;const i=t.fields||{};this.Ct(e,53);const o=or,u=((s=(n=i[o].arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.length)||0;this.Ct(e,15),e.Ft(ht(u)),this.xt(o,e),this.Dt(i[o],e)}qt(t,e){const n=t.values||[];this.Ct(e,50);for(const s of n)this.Dt(s,e)}Bt(t,e){this.Ct(e,37),N.fromName(t).path.forEach(n=>{this.Ct(e,60),this.$t(n,e)})}Ct(t,e){t.Ft(e)}Ot(t){t.Ft(2)}}fn.Ut=new fn;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=255;function x_(r){if(r===0)return 8;let t=0;return r>>4||(t+=4,r<<=4),r>>6||(t+=2,r<<=2),r>>7||(t+=1),t}function Bl(r){const t=64-function(n){let s=0;for(let i=0;i<8;++i){const o=x_(255&n[i]);if(s+=o,o!==8)break}return s}(r);return Math.ceil(t/8)}class D_{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Kt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.Wt(n.value),n=e.next();this.Gt()}zt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.jt(n.value),n=e.next();this.Jt()}Ht(t){for(const e of t){const n=e.charCodeAt(0);if(n<128)this.Wt(n);else if(n<2048)this.Wt(960|n>>>6),this.Wt(128|63&n);else if(e<"\uD800"||"\uDBFF"<e)this.Wt(480|n>>>12),this.Wt(128|63&n>>>6),this.Wt(128|63&n);else{const s=e.codePointAt(0);this.Wt(240|s>>>18),this.Wt(128|63&s>>>12),this.Wt(128|63&s>>>6),this.Wt(128|63&s)}}this.Gt()}Yt(t){for(const e of t){const n=e.charCodeAt(0);if(n<128)this.jt(n);else if(n<2048)this.jt(960|n>>>6),this.jt(128|63&n);else if(e<"\uD800"||"\uDBFF"<e)this.jt(480|n>>>12),this.jt(128|63&n>>>6),this.jt(128|63&n);else{const s=e.codePointAt(0);this.jt(240|s>>>18),this.jt(128|63&s>>>12),this.jt(128|63&s>>>6),this.jt(128|63&s)}}this.Jt()}Zt(t){const e=this.Xt(t),n=Bl(e);this.en(1+n),this.buffer[this.position++]=255&n;for(let s=e.length-n;s<e.length;++s)this.buffer[this.position++]=255&e[s]}tn(t){const e=this.Xt(t),n=Bl(e);this.en(1+n),this.buffer[this.position++]=~(255&n);for(let s=e.length-n;s<e.length;++s)this.buffer[this.position++]=~(255&e[s])}nn(){this.rn(Bn),this.rn(255)}sn(){this._n(Bn),this._n(255)}reset(){this.position=0}seed(t){this.en(t.length),this.buffer.set(t,this.position),this.position+=t.length}an(){return this.buffer.slice(0,this.position)}Xt(t){const e=function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)}(t),n=!!(128&e[0]);e[0]^=n?255:128;for(let s=1;s<e.length;++s)e[s]^=n?255:0;return e}Wt(t){const e=255&t;e===0?(this.rn(0),this.rn(255)):e===Bn?(this.rn(Bn),this.rn(0)):this.rn(e)}jt(t){const e=255&t;e===0?(this._n(0),this._n(255)):e===Bn?(this._n(Bn),this._n(0)):this._n(t)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(t){this.en(1),this.buffer[this.position++]=t}_n(t){this.en(1),this.buffer[this.position++]=~t}en(t){const e=t+this.position;if(e<=this.buffer.length)return;let n=2*this.buffer.length;n<e&&(n=e);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class k_{constructor(t){this.un=t}Nt(t){this.un.Kt(t)}Mt(t){this.un.Ht(t)}Ft(t){this.un.Zt(t)}vt(){this.un.nn()}}class N_{constructor(t){this.un=t}Nt(t){this.un.zt(t)}Mt(t){this.un.Yt(t)}Ft(t){this.un.tn(t)}vt(){this.un.sn()}}class Xr{constructor(){this.un=new D_,this.cn=new k_(this.un),this.ln=new N_(this.un)}seed(t){this.un.seed(t)}hn(t){return t===0?this.cn:this.ln}an(){return this.un.an()}reset(){this.un.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(t,e,n,s){this.Pn=t,this.Tn=e,this.In=n,this.dn=s}En(){const t=this.dn.length,e=t===0||this.dn[t-1]===255?t+1:t,n=new Uint8Array(e);return n.set(this.dn,0),e!==t?n.set([0],this.dn.length):++n[n.length-1],new mn(this.Pn,this.Tn,this.In,n)}An(t,e,n){return{indexId:this.Pn,uid:t,arrayValue:Vi(this.In),directionalValue:Vi(this.dn),orderedDocumentKey:Vi(e),documentKey:n.path.toArray()}}Rn(t,e,n){const s=this.An(t,e,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function De(r,t){let e=r.Pn-t.Pn;return e!==0?e:(e=jl(r.In,t.In),e!==0?e:(e=jl(r.dn,t.dn),e!==0?e:N.comparator(r.Tn,t.Tn)))}function jl(r,t){for(let e=0;e<r.length&&e<t.length;++e){const n=r[e]-t[e];if(n!==0)return n}return r.length-t.length}function Vi(r){return qh()?function(e){let n="";for(let s=0;s<e.length;s++)n+=String.fromCharCode(e[s]);return n}(r):r}function zl(r){return typeof r!="string"?r:function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n}(r)}class Gl{constructor(t){this.Vn=new rt((e,n)=>lt.comparator(e.field,n.field)),this.collectionId=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment(),this.mn=t.orderBy,this.fn=[];for(const e of t.filters){const n=e;n.isInequality()?this.Vn=this.Vn.add(n):this.fn.push(n)}}get gn(){return this.Vn.size>1}pn(t){if(B(t.collectionGroup===this.collectionId,49279),this.gn)return!1;const e=da(t);if(e!==void 0&&!this.yn(e))return!1;const n=cn(t);let s=new Set,i=0,o=0;for(;i<n.length&&this.yn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const u=this.Vn.getIterator().getNext();if(!s.has(u.field.canonicalString())){const c=n[i];if(!this.wn(u,c)||!this.Sn(this.mn[o++],c))return!1}++i}for(;i<n.length;++i){const u=n[i];if(o>=this.mn.length||!this.Sn(this.mn[o++],u))return!1}return!0}bn(){if(this.gn)return null;let t=new rt(lt.comparator);const e=[];for(const n of this.fn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")e.push(new gn(n.field,2));else{if(t.has(n.field))continue;t=t.add(n.field),e.push(new gn(n.field,0))}for(const n of this.mn)n.field.isKeyField()||t.has(n.field)||(t=t.add(n.field),e.push(new gn(n.field,n.dir==="asc"?0:1)));return new tr(tr.UNKNOWN_ID,this.collectionId,e,er.empty())}yn(t){for(const e of this.fn)if(this.wn(e,t))return!0;return!1}wn(t,e){if(t===void 0||!t.field.isEqual(e.fieldPath))return!1;const n=t.op==="array-contains"||t.op==="array-contains-any";return e.kind===2===n}Sn(t,e){return!!t.field.isEqual(e.fieldPath)&&(e.kind===0&&t.dir==="asc"||e.kind===1&&t.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function If(r){var t,e;if(B(r instanceof X||r instanceof et,20012),r instanceof X){if(r instanceof Md){const s=((e=(t=r.value.arrayValue)===null||t===void 0?void 0:t.values)===null||e===void 0?void 0:e.map(i=>X.create(r.field,"==",i)))||[];return et.create(s,"or")}return r}const n=r.filters.map(s=>If(s));return et.create(n,r.op)}function O_(r){if(r.getFilters().length===0)return[];const t=Va(If(r));return B(Ef(t),7391),Pa(t)||Sa(t)?[t]:t.getFilters()}function Pa(r){return r instanceof X}function Sa(r){return r instanceof et&&Ja(r)}function Ef(r){return Pa(r)||Sa(r)||function(e){if(e instanceof et&&Ta(e)){for(const n of e.getFilters())if(!Pa(n)&&!Sa(n))return!1;return!0}return!1}(r)}function Va(r){if(B(r instanceof X||r instanceof et,34018),r instanceof X)return r;if(r.filters.length===1)return Va(r.filters[0]);const t=r.filters.map(n=>Va(n));let e=et.create(t,r.op);return e=Bi(e),Ef(e)?e:(B(e instanceof et,64498),B(ur(e),40251),B(e.filters.length>1,57927),e.filters.reduce((n,s)=>au(n,s)))}function au(r,t){let e;return B(r instanceof X||r instanceof et,38388),B(t instanceof X||t instanceof et,25473),e=r instanceof X?t instanceof X?function(s,i){return et.create([s,i],"and")}(r,t):$l(r,t):t instanceof X?$l(t,r):function(s,i){if(B(s.filters.length>0&&i.filters.length>0,48005),ur(s)&&ur(i))return Nd(s,i.getFilters());const o=Ta(s)?s:i,u=Ta(s)?i:s,c=o.filters.map(h=>au(h,u));return et.create(c,"or")}(r,t),Bi(e)}function $l(r,t){if(ur(t))return Nd(t,r.getFilters());{const e=t.filters.map(n=>au(r,n));return et.create(e,"or")}}function Bi(r){if(B(r instanceof X||r instanceof et,11850),r instanceof X)return r;const t=r.getFilters();if(t.length===1)return Bi(t[0]);if(Dd(r))return r;const e=t.map(s=>Bi(s)),n=[];return e.forEach(s=>{s instanceof X?n.push(s):s instanceof et&&(s.op===r.op?n.push(...s.filters):n.push(s))}),n.length===1?n[0]:et.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F_{constructor(){this.Dn=new uu}addToCollectionParentIndex(t,e){return this.Dn.add(e),A.resolve()}getCollectionParents(t,e){return A.resolve(this.Dn.getEntries(e))}addFieldIndex(t,e){return A.resolve()}deleteFieldIndex(t,e){return A.resolve()}deleteAllFieldIndexes(t){return A.resolve()}createTargetIndexes(t,e){return A.resolve()}getDocumentsMatchingTarget(t,e){return A.resolve(null)}getIndexType(t,e){return A.resolve(0)}getFieldIndexes(t,e){return A.resolve([])}getNextCollectionGroupToUpdate(t){return A.resolve(null)}getMinOffset(t,e){return A.resolve(Jt.min())}getMinOffsetFromCollectionGroup(t,e){return A.resolve(Jt.min())}updateCollectionGroup(t,e,n){return A.resolve()}updateIndexEntries(t,e){return A.resolve()}}class uu{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e]||new rt(Q.comparator),i=!s.has(n);return this.index[e]=s.add(n),i}has(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e];return s&&s.has(n)}getEntries(t){return(this.index[t]||new rt(Q.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="IndexedDbIndexManager",mi=new Uint8Array(0);class M_{constructor(t,e){this.databaseId=e,this.vn=new uu,this.Cn=new Ae(n=>En(n),(n,s)=>Ds(n,s)),this.uid=t.uid||""}addToCollectionParentIndex(t,e){if(!this.vn.has(e)){const n=e.lastSegment(),s=e.popLast();t.addOnCommittedListener(()=>{this.vn.add(e)});const i={collectionId:n,parent:Ft(s)};return Ql(t).put(i)}return A.resolve()}getCollectionParents(t,e){const n=[],s=IDBKeyRange.bound([e,""],[td(e),""],!1,!0);return Ql(t).j(s).next(i=>{for(const o of i){if(o.collectionId!==e)break;n.push(ue(o.parent))}return n})}addFieldIndex(t,e){const n=Jr(t),s=function(u){return{indexId:u.indexId,collectionGroup:u.collectionGroup,fields:u.fields.map(c=>[c.fieldPath.canonicalString(),c.kind])}}(e);delete s.indexId;const i=n.add(s);if(e.indexState){const o=zn(t);return i.next(u=>{o.put(Ll(u,this.uid,e.indexState.sequenceNumber,e.indexState.offset))})}return i.next()}deleteFieldIndex(t,e){const n=Jr(t),s=zn(t),i=jn(t);return n.delete(e.indexId).next(()=>s.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0)))}deleteAllFieldIndexes(t){const e=Jr(t),n=jn(t),s=zn(t);return e.Y().next(()=>n.Y()).next(()=>s.Y())}createTargetIndexes(t,e){return A.forEach(this.Fn(e),n=>this.getIndexType(t,n).next(s=>{if(s===0||s===1){const i=new Gl(n).bn();if(i!=null)return this.addFieldIndex(t,i)}}))}getDocumentsMatchingTarget(t,e){const n=jn(t);let s=!0;const i=new Map;return A.forEach(this.Fn(e),o=>this.Mn(t,o).next(u=>{s&&(s=!!u),i.set(o,u)})).next(()=>{if(s){let o=K();const u=[];return A.forEach(i,(c,h)=>{k(Kl,`Using index ${function(M){return`id=${M.indexId}|cg=${M.collectionGroup}|f=${M.fields.map(z=>`${z.fieldPath}:${z.kind}`).join(",")}`}(c)} to execute ${En(e)}`);const f=function(M,z){const H=da(z);if(H===void 0)return null;for(const $ of Mi(M,H.fieldPath))switch($.op){case"array-contains-any":return $.value.arrayValue.values||[];case"array-contains":return[$.value]}return null}(h,c),m=function(M,z){const H=new Map;for(const $ of cn(z))for(const I of Mi(M,$.fieldPath))switch(I.op){case"==":case"in":H.set($.fieldPath.canonicalString(),I.value);break;case"not-in":case"!=":return H.set($.fieldPath.canonicalString(),I.value),Array.from(H.values())}return null}(h,c),g=function(M,z){const H=[];let $=!0;for(const I of cn(z)){const _=I.kind===0?Al(M,I.fieldPath,M.startAt):Rl(M,I.fieldPath,M.startAt);H.push(_.value),$&&($=_.inclusive)}return new $e(H,$)}(h,c),w=function(M,z){const H=[];let $=!0;for(const I of cn(z)){const _=I.kind===0?Rl(M,I.fieldPath,M.endAt):Al(M,I.fieldPath,M.endAt);H.push(_.value),$&&($=_.inclusive)}return new $e(H,$)}(h,c),S=this.xn(c,h,g),x=this.xn(c,h,w),C=this.On(c,h,m),L=this.Nn(c.indexId,f,S,g.inclusive,x,w.inclusive,C);return A.forEach(L,q=>n.H(q,e.limit).next(M=>{M.forEach(z=>{const H=N.fromSegments(z.documentKey);o.has(H)||(o=o.add(H),u.push(H))})}))}).next(()=>u)}return A.resolve(null)})}Fn(t){let e=this.Cn.get(t);return e||(t.filters.length===0?e=[t]:e=O_(et.create(t.filters,"and")).map(n=>Ea(t.path,t.collectionGroup,t.orderBy,n.getFilters(),t.limit,t.startAt,t.endAt)),this.Cn.set(t,e),e)}Nn(t,e,n,s,i,o,u){const c=(e!=null?e.length:1)*Math.max(n.length,i.length),h=c/(e!=null?e.length:1),f=[];for(let m=0;m<c;++m){const g=e?this.Bn(e[m/h]):mi,w=this.Ln(t,g,n[m%h],s),S=this.kn(t,g,i[m%h],o),x=u.map(C=>this.Ln(t,g,C,!0));f.push(...this.createRange(w,S,x))}return f}Ln(t,e,n,s){const i=new mn(t,N.empty(),e,n);return s?i:i.En()}kn(t,e,n,s){const i=new mn(t,N.empty(),e,n);return s?i.En():i}Mn(t,e){const n=new Gl(e),s=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment();return this.getFieldIndexes(t,s).next(i=>{let o=null;for(const u of i)n.pn(u)&&(!o||u.fields.length>o.fields.length)&&(o=u);return o})}getIndexType(t,e){let n=2;const s=this.Fn(e);return A.forEach(s,i=>this.Mn(t,i).next(o=>{o?n!==0&&o.fields.length<function(c){let h=new rt(lt.comparator),f=!1;for(const m of c.filters)for(const g of m.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?f=!0:h=h.add(g.field));for(const m of c.orderBy)m.field.isKeyField()||(h=h.add(m.field));return h.size+(f?1:0)}(i)&&(n=1):n=0})).next(()=>function(o){return o.limit!==null}(e)&&s.length>1&&n===2?1:n)}qn(t,e){const n=new Xr;for(const s of cn(t)){const i=e.data.field(s.fieldPath);if(i==null)return null;const o=n.hn(s.kind);fn.Ut.bt(i,o)}return n.an()}Bn(t){const e=new Xr;return fn.Ut.bt(t,e.hn(0)),e.an()}Qn(t,e){const n=new Xr;return fn.Ut.bt(In(this.databaseId,e),n.hn(function(i){const o=cn(i);return o.length===0?0:o[o.length-1].kind}(t))),n.an()}On(t,e,n){if(n===null)return[];let s=[];s.push(new Xr);let i=0;for(const o of cn(t)){const u=n[i++];for(const c of s)if(this.$n(e,o.fieldPath)&&ws(u))s=this.Un(s,o,u);else{const h=c.hn(o.kind);fn.Ut.bt(u,h)}}return this.Kn(s)}xn(t,e,n){return this.On(t,e,n.position)}Kn(t){const e=[];for(let n=0;n<t.length;++n)e[n]=t[n].an();return e}Un(t,e,n){const s=[...t],i=[];for(const o of n.arrayValue.values||[])for(const u of s){const c=new Xr;c.seed(u.an()),fn.Ut.bt(o,c.hn(e.kind)),i.push(c)}return i}$n(t,e){return!!t.filters.find(n=>n instanceof X&&n.field.isEqual(e)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(t,e){const n=Jr(t),s=zn(t);return(e?n.j(ma,IDBKeyRange.bound(e,e)):n.j()).next(i=>{const o=[];return A.forEach(i,u=>s.get([u.indexId,this.uid]).next(c=>{o.push(function(f,m){const g=m?new er(m.sequenceNumber,new Jt(Rn(m.readTime),new N(ue(m.documentKey)),m.largestBatchId)):er.empty(),w=f.fields.map(([S,x])=>new gn(lt.fromServerFormat(S),x));return new tr(f.indexId,f.collectionGroup,w,g)}(u,c))})).next(()=>o)})}getNextCollectionGroupToUpdate(t){return this.getFieldIndexes(t).next(e=>e.length===0?null:(e.sort((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:G(n.collectionGroup,s.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(t,e,n){const s=Jr(t),i=zn(t);return this.Wn(t).next(o=>s.j(ma,IDBKeyRange.bound(e,e)).next(u=>A.forEach(u,c=>i.put(Ll(c.indexId,this.uid,o,n)))))}updateIndexEntries(t,e){const n=new Map;return A.forEach(e,(s,i)=>{const o=n.get(s.collectionGroup);return(o?A.resolve(o):this.getFieldIndexes(t,s.collectionGroup)).next(u=>(n.set(s.collectionGroup,u),A.forEach(u,c=>this.Gn(t,s,c).next(h=>{const f=this.zn(i,c);return h.isEqual(f)?A.resolve():this.jn(t,i,c,h,f)}))))})}Jn(t,e,n,s){return jn(t).put(s.An(this.uid,this.Qn(n,e.key),e.key))}Hn(t,e,n,s){return jn(t).delete(s.Rn(this.uid,this.Qn(n,e.key),e.key))}Gn(t,e,n){const s=jn(t);let i=new rt(De);return s.X({index:md,range:IDBKeyRange.only([n.indexId,this.uid,Vi(this.Qn(n,e))])},(o,u)=>{i=i.add(new mn(n.indexId,e,zl(u.arrayValue),zl(u.directionalValue)))}).next(()=>i)}zn(t,e){let n=new rt(De);const s=this.qn(e,t);if(s==null)return n;const i=da(e);if(i!=null){const o=t.data.field(i.fieldPath);if(ws(o))for(const u of o.arrayValue.values||[])n=n.add(new mn(e.indexId,t.key,this.Bn(u),s))}else n=n.add(new mn(e.indexId,t.key,mi,s));return n}jn(t,e,n,s,i){k(Kl,"Updating index entries for document '%s'",e.key);const o=[];return function(c,h,f,m,g){const w=c.getIterator(),S=h.getIterator();let x=qn(w),C=qn(S);for(;x||C;){let L=!1,q=!1;if(x&&C){const M=f(x,C);M<0?q=!0:M>0&&(L=!0)}else x!=null?q=!0:L=!0;L?(m(C),C=qn(S)):q?(g(x),x=qn(w)):(x=qn(w),C=qn(S))}}(s,i,De,u=>{o.push(this.Jn(t,e,n,u))},u=>{o.push(this.Hn(t,e,n,u))}),A.waitFor(o)}Wn(t){let e=1;return zn(t).X({index:fd,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,s,i)=>{i.done(),e=s.sequenceNumber+1}).next(()=>e)}createRange(t,e,n){n=n.sort((o,u)=>De(o,u)).filter((o,u,c)=>!u||De(o,c[u-1])!==0);const s=[];s.push(t);for(const o of n){const u=De(o,t),c=De(o,e);if(u===0)s[0]=t.En();else if(u>0&&c<0)s.push(o),s.push(o.En());else if(c>0)break}s.push(e);const i=[];for(let o=0;o<s.length;o+=2){if(this.Yn(s[o],s[o+1]))return[];const u=s[o].Rn(this.uid,mi,N.empty()),c=s[o+1].Rn(this.uid,mi,N.empty());i.push(IDBKeyRange.bound(u,c))}return i}Yn(t,e){return De(t,e)>0}getMinOffsetFromCollectionGroup(t,e){return this.getFieldIndexes(t,e).next(Wl)}getMinOffset(t,e){return A.mapArray(this.Fn(e),n=>this.Mn(t,n).next(s=>s||U(44426))).next(Wl)}}function Ql(r){return wt(r,ys)}function jn(r){return wt(r,us)}function Jr(r){return wt(r,Ka)}function zn(r){return wt(r,as)}function Wl(r){B(r.length!==0,28825);let t=r[0].indexState.offset,e=t.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;za(s,t)<0&&(t=s),e<s.largestBatchId&&(e=s.largestBatchId)}return new Jt(t.readTime,t.documentKey,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},wf=41943040;class Nt{static withCacheSize(t){return new Nt(t,Nt.DEFAULT_COLLECTION_PERCENTILE,Nt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,n){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vf(r,t,e){const n=r.store(ee),s=r.store(nr),i=[],o=IDBKeyRange.only(e.batchId);let u=0;const c=n.X({range:o},(f,m,g)=>(u++,g.delete()));i.push(c.next(()=>{B(u===1,47070,{batchId:e.batchId})}));const h=[];for(const f of e.mutations){const m=ld(t,f.key.path,e.batchId);i.push(s.delete(m)),h.push(f.key)}return A.waitFor(i).next(()=>h)}function ji(r){if(!r)return 0;let t;if(r.document)t=r.document;else if(r.unknownDocument)t=r.unknownDocument;else{if(!r.noDocument)throw U(14731);t=r.noDocument}return JSON.stringify(t).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Nt.DEFAULT_COLLECTION_PERCENTILE=10,Nt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Nt.DEFAULT=new Nt(wf,Nt.DEFAULT_COLLECTION_PERCENTILE,Nt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Nt.DISABLED=new Nt(-1,0,0);class fo{constructor(t,e,n,s){this.userId=t,this.serializer=e,this.indexManager=n,this.referenceDelegate=s,this.Zn={}}static yt(t,e,n,s){B(t.uid!=="",64387);const i=t.isAuthenticated()?t.uid:"";return new fo(i,e,n,s)}checkEmpty(t){let e=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return ke(t).X({index:pn,range:n},(s,i,o)=>{e=!1,o.done()}).next(()=>e)}addMutationBatch(t,e,n,s){const i=Hn(t),o=ke(t);return o.add({}).next(u=>{B(typeof u=="number",49019);const c=new nu(u,e,n,s),h=function(w,S,x){const C=x.baseMutations.map(q=>Rs(w.gt,q)),L=x.mutations.map(q=>Rs(w.gt,q));return{userId:S,batchId:x.batchId,localWriteTimeMs:x.localWriteTime.toMillis(),baseMutations:C,mutations:L}}(this.serializer,this.userId,c),f=[];let m=new rt((g,w)=>G(g.canonicalString(),w.canonicalString()));for(const g of s){const w=ld(this.userId,g.key.path,u);m=m.add(g.key.path.popLast()),f.push(o.put(h)),f.push(i.put(w,yg))}return m.forEach(g=>{f.push(this.indexManager.addToCollectionParentIndex(t,g))}),t.addOnCommittedListener(()=>{this.Zn[u]=c.keys()}),A.waitFor(f).next(()=>c)})}lookupMutationBatch(t,e){return ke(t).get(e).next(n=>n?(B(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:e}),dn(this.serializer,n)):null)}Xn(t,e){return this.Zn[e]?A.resolve(this.Zn[e]):this.lookupMutationBatch(t,e).next(n=>{if(n){const s=n.keys();return this.Zn[e]=s,s}return null})}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return ke(t).X({index:pn,range:s},(o,u,c)=>{u.userId===this.userId&&(B(u.batchId>=n,47524,{er:n}),i=dn(this.serializer,u)),c.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(t){const e=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=qe;return ke(t).X({index:pn,range:e,reverse:!0},(s,i,o)=>{n=i.batchId,o.done()}).next(()=>n)}getAllMutationBatches(t){const e=IDBKeyRange.bound([this.userId,qe],[this.userId,Number.POSITIVE_INFINITY]);return ke(t).j(pn,e).next(n=>n.map(s=>dn(this.serializer,s)))}getAllMutationBatchesAffectingDocumentKey(t,e){const n=wi(this.userId,e.path),s=IDBKeyRange.lowerBound(n),i=[];return Hn(t).X({range:s},(o,u,c)=>{const[h,f,m]=o,g=ue(f);if(h===this.userId&&e.path.isEqual(g))return ke(t).get(m).next(w=>{if(!w)throw U(61480,{tr:o,batchId:m});B(w.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:w.userId,batchId:m}),i.push(dn(this.serializer,w))});c.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new rt(G);const s=[];return e.forEach(i=>{const o=wi(this.userId,i.path),u=IDBKeyRange.lowerBound(o),c=Hn(t).X({range:u},(h,f,m)=>{const[g,w,S]=h,x=ue(w);g===this.userId&&i.path.isEqual(x)?n=n.add(S):m.done()});s.push(c)}),A.waitFor(s).next(()=>this.nr(t,n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1,i=wi(this.userId,n),o=IDBKeyRange.lowerBound(i);let u=new rt(G);return Hn(t).X({range:o},(c,h,f)=>{const[m,g,w]=c,S=ue(g);m===this.userId&&n.isPrefixOf(S)?S.length===s&&(u=u.add(w)):f.done()}).next(()=>this.nr(t,u))}nr(t,e){const n=[],s=[];return e.forEach(i=>{s.push(ke(t).get(i).next(o=>{if(o===null)throw U(35274,{batchId:i});B(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(dn(this.serializer,o))}))}),A.waitFor(s).next(()=>n)}removeMutationBatch(t,e){return vf(t.ce,this.userId,e).next(n=>(t.addOnCommittedListener(()=>{this.rr(e.batchId)}),A.forEach(n,s=>this.referenceDelegate.markPotentiallyOrphaned(t,s))))}rr(t){delete this.Zn[t]}performConsistencyCheck(t){return this.checkEmpty(t).next(e=>{if(!e)return A.resolve();const n=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),s=[];return Hn(t).X({range:n},(i,o,u)=>{if(i[0]===this.userId){const c=ue(i[1]);s.push(c)}else u.done()}).next(()=>{B(s.length===0,56720,{ir:s.map(i=>i.canonicalString())})})})}containsKey(t,e){return Af(t,this.userId,e)}sr(t){return Rf(t).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:qe,lastStreamToken:""})}}function Af(r,t,e){const n=wi(t,e.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Hn(r).X({range:i,Z:!0},(u,c,h)=>{const[f,m,g]=u;f===t&&m===s&&(o=!0),h.done()}).next(()=>o)}function ke(r){return wt(r,ee)}function Hn(r){return wt(r,nr)}function Rf(r){return wt(r,gs)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(t){this._r=t}next(){return this._r+=2,this._r}static ar(){return new bn(0)}static ur(){return new bn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{constructor(t,e){this.referenceDelegate=t,this.serializer=e}allocateTargetId(t){return this.cr(t).next(e=>{const n=new bn(e.highestTargetId);return e.highestTargetId=n.next(),this.lr(t,e).next(()=>e.highestTargetId)})}getLastRemoteSnapshotVersion(t){return this.cr(t).next(e=>j.fromTimestamp(new tt(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(t){return this.cr(t).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(t,e,n){return this.cr(t).next(s=>(s.highestListenSequenceNumber=e,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),e>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=e),this.lr(t,s)))}addTargetData(t,e){return this.hr(t,e).next(()=>this.cr(t).next(n=>(n.targetCount+=1,this.Pr(e,n),this.lr(t,n))))}updateTargetData(t,e){return this.hr(t,e)}removeTargetData(t,e){return this.removeMatchingKeysForTargetId(t,e.targetId).next(()=>Gn(t).delete(e.targetId)).next(()=>this.cr(t)).next(n=>(B(n.targetCount>0,8065),n.targetCount-=1,this.lr(t,n)))}removeTargets(t,e,n){let s=0;const i=[];return Gn(t).X((o,u)=>{const c=ss(u);c.sequenceNumber<=e&&n.get(c.targetId)===null&&(s++,i.push(this.removeTargetData(t,c)))}).next(()=>A.waitFor(i)).next(()=>s)}forEachTarget(t,e){return Gn(t).X((n,s)=>{const i=ss(s);e(i)})}cr(t){return Xl(t).get(Oi).next(e=>(B(e!==null,2888),e))}lr(t,e){return Xl(t).put(Oi,e)}hr(t,e){return Gn(t).put(Tf(this.serializer,e))}Pr(t,e){let n=!1;return t.targetId>e.highestTargetId&&(e.highestTargetId=t.targetId,n=!0),t.sequenceNumber>e.highestListenSequenceNumber&&(e.highestListenSequenceNumber=t.sequenceNumber,n=!0),n}getTargetCount(t){return this.cr(t).next(e=>e.targetCount)}getTargetData(t,e){const n=En(e),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Gn(t).X({range:s,index:dd},(o,u,c)=>{const h=ss(u);Ds(e,h.target)&&(i=h,c.done())}).next(()=>i)}addMatchingKeys(t,e,n){const s=[],i=Fe(t);return e.forEach(o=>{const u=Ft(o.path);s.push(i.put({targetId:n,path:u})),s.push(this.referenceDelegate.addReference(t,n,o))}),A.waitFor(s)}removeMatchingKeys(t,e,n){const s=Fe(t);return A.forEach(e,i=>{const o=Ft(i.path);return A.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(t,n,i)])})}removeMatchingKeysForTargetId(t,e){const n=Fe(t),s=IDBKeyRange.bound([e],[e+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(t,e){const n=IDBKeyRange.bound([e],[e+1],!1,!0),s=Fe(t);let i=K();return s.X({range:n,Z:!0},(o,u,c)=>{const h=ue(o[1]),f=new N(h);i=i.add(f)}).next(()=>i)}containsKey(t,e){const n=Ft(e.path),s=IDBKeyRange.bound([n],[td(n)],!1,!0);let i=0;return Fe(t).X({index:$a,Z:!0,range:s},([o,u],c,h)=>{o!==0&&(i++,h.done())}).next(()=>i>0)}Et(t,e){return Gn(t).get(e).next(n=>n?ss(n):null)}}function Gn(r){return wt(r,rr)}function Xl(r){return wt(r,_n)}function Fe(r){return wt(r,sr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl="LruGarbageCollector",bf=1048576;function Yl([r,t],[e,n]){const s=G(r,e);return s===0?G(t,n):s}class U_{constructor(t){this.Tr=t,this.buffer=new rt(Yl),this.Ir=0}dr(){return++this.Ir}Er(t){const e=[t,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(e);else{const n=this.buffer.last();Yl(e,n)<0&&(this.buffer=this.buffer.delete(n).add(e))}}get maxValue(){return this.buffer.last()[0]}}class Pf{constructor(t,e,n){this.garbageCollector=t,this.asyncQueue=e,this.localStore=n,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(t){k(Jl,`Garbage collection scheduled in ${t}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Xe(e)?k(Jl,"Ignoring IndexedDB error during garbage collection: ",e):await He(e)}await this.Rr(3e5)})}}class q_{constructor(t,e){this.Vr=t,this.params=e}calculateTargetCount(t,e){return this.Vr.mr(t).next(n=>Math.floor(e/100*n))}nthSequenceNumber(t,e){if(e===0)return A.resolve(Gt.ue);const n=new U_(e);return this.Vr.forEachTarget(t,s=>n.Er(s.sequenceNumber)).next(()=>this.Vr.gr(t,s=>n.Er(s))).next(()=>n.maxValue)}removeTargets(t,e,n){return this.Vr.removeTargets(t,e,n)}removeOrphanedDocuments(t,e){return this.Vr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(k("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(Hl)):this.getCacheSize(t).next(n=>n<this.params.cacheSizeCollectionThreshold?(k("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Hl):this.pr(t,e))}getCacheSize(t){return this.Vr.getCacheSize(t)}pr(t,e){let n,s,i,o,u,c,h;const f=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(k("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,o=Date.now(),this.nthSequenceNumber(t,s))).next(m=>(n=m,u=Date.now(),this.removeTargets(t,n,e))).next(m=>(i=m,c=Date.now(),this.removeOrphanedDocuments(t,n))).next(m=>(h=Date.now(),Kn()<=ye.DEBUG&&k("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(u-o)+`ms
	Removed ${i} targets in `+(c-u)+`ms
	Removed ${m} documents in `+(h-c)+`ms
Total Duration: ${h-f}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m})))}}function Sf(r,t){return new q_(r,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(t,e){this.db=t,this.garbageCollector=Sf(this,e)}mr(t){const e=this.yr(t);return this.db.getTargetCache().getTargetCount(t).next(n=>e.next(s=>n+s))}yr(t){let e=0;return this.gr(t,n=>{e++}).next(()=>e)}forEachTarget(t,e){return this.db.getTargetCache().forEachTarget(t,e)}gr(t,e){return this.wr(t,(n,s)=>e(s))}addReference(t,e,n){return pi(t,n)}removeReference(t,e,n){return pi(t,n)}removeTargets(t,e,n){return this.db.getTargetCache().removeTargets(t,e,n)}markPotentiallyOrphaned(t,e){return pi(t,e)}Sr(t,e){return function(s,i){let o=!1;return Rf(s).ee(u=>Af(s,u,i).next(c=>(c&&(o=!0),A.resolve(!c)))).next(()=>o)}(t,e)}removeOrphanedDocuments(t,e){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.wr(t,(o,u)=>{if(u<=e){const c=this.Sr(t,o).next(h=>{if(!h)return i++,n.getEntry(t,o).next(()=>(n.removeEntry(o,j.min()),Fe(t).delete(function(m){return[0,Ft(m.path)]}(o))))});s.push(c)}}).next(()=>A.waitFor(s)).next(()=>n.apply(t)).next(()=>i)}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(t,n)}updateLimboDocument(t,e){return pi(t,e)}wr(t,e){const n=Fe(t);let s,i=Gt.ue;return n.X({index:$a},([o,u],{path:c,sequenceNumber:h})=>{o===0?(i!==Gt.ue&&e(new N(ue(s)),i),i=h,s=c):i=Gt.ue}).next(()=>{i!==Gt.ue&&e(new N(ue(s)),i)})}getCacheSize(t){return this.db.getRemoteDocumentCache().getSize(t)}}function pi(r,t){return Fe(r).put(function(n,s){return{targetId:0,path:Ft(n.path),sequenceNumber:s}}(t,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf{constructor(){this.changes=new Ae(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,ct.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return n!==void 0?A.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j_{constructor(t){this.serializer=t}setIndexManager(t){this.indexManager=t}addEntry(t,e,n){return un(t).put(n)}removeEntry(t,e,n){return un(t).delete(function(i,o){const u=i.path.toArray();return[u.slice(0,u.length-2),u[u.length-2],qi(o),u[u.length-1]]}(e,n))}updateMetadata(t,e){return this.getMetadata(t).next(n=>(n.byteSize+=e,this.br(t,n)))}getEntry(t,e){let n=ct.newInvalidDocument(e);return un(t).X({index:vi,range:IDBKeyRange.only(Yr(e))},(s,i)=>{n=this.Dr(e,i)}).next(()=>n)}vr(t,e){let n={size:0,document:ct.newInvalidDocument(e)};return un(t).X({index:vi,range:IDBKeyRange.only(Yr(e))},(s,i)=>{n={document:this.Dr(e,i),size:ji(i)}}).next(()=>n)}getEntries(t,e){let n=Kt();return this.Cr(t,e,(s,i)=>{const o=this.Dr(s,i);n=n.insert(s,o)}).next(()=>n)}Fr(t,e){let n=Kt(),s=new ot(N.comparator);return this.Cr(t,e,(i,o)=>{const u=this.Dr(i,o);n=n.insert(i,u),s=s.insert(i,ji(o))}).next(()=>({documents:n,Mr:s}))}Cr(t,e,n){if(e.isEmpty())return A.resolve();let s=new rt(eh);e.forEach(c=>s=s.add(c));const i=IDBKeyRange.bound(Yr(s.first()),Yr(s.last())),o=s.getIterator();let u=o.getNext();return un(t).X({index:vi,range:i},(c,h,f)=>{const m=N.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;u&&eh(u,m)<0;)n(u,null),u=o.getNext();u&&u.isEqual(m)&&(n(u,h),u=o.hasNext()?o.getNext():null),u?f.G(Yr(u)):f.done()}).next(()=>{for(;u;)n(u,null),u=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(t,e,n,s,i){const o=e.path,u=[o.popLast().toArray(),o.lastSegment(),qi(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],c=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return un(t).j(IDBKeyRange.bound(u,c,!0)).next(h=>{i?.incrementDocumentReadCount(h.length);let f=Kt();for(const m of h){const g=this.Dr(N.fromSegments(m.prefixPath.concat(m.collectionGroup,m.documentId)),m);g.isFoundDocument()&&(Ns(e,g)||s.has(g.key))&&(f=f.insert(g.key,g))}return f})}getAllFromCollectionGroup(t,e,n,s){let i=Kt();const o=th(e,n),u=th(e,Jt.max());return un(t).X({index:hd,range:IDBKeyRange.bound(o,u,!0)},(c,h,f)=>{const m=this.Dr(N.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);i=i.insert(m.key,m),i.size===s&&f.done()}).next(()=>i)}newChangeBuffer(t){return new z_(this,!!t&&t.trackRemovals)}getSize(t){return this.getMetadata(t).next(e=>e.byteSize)}getMetadata(t){return Zl(t).get(fa).next(e=>(B(!!e,20021),e))}br(t,e){return Zl(t).put(fa,e)}Dr(t,e){if(e){const n=S_(this.serializer,e);if(!(n.isNoDocument()&&n.version.isEqual(j.min())))return n}return ct.newInvalidDocument(t)}}function Cf(r){return new j_(r)}class z_ extends Vf{constructor(t,e){super(),this.Or=t,this.trackRemovals=e,this.Nr=new Ae(n=>n.toString(),(n,s)=>n.isEqual(s))}applyChanges(t){const e=[];let n=0,s=new rt((i,o)=>G(i.canonicalString(),o.canonicalString()));return this.changes.forEach((i,o)=>{const u=this.Nr.get(i);if(e.push(this.Or.removeEntry(t,i,u.readTime)),o.isValidDocument()){const c=Fl(this.Or.serializer,o);s=s.add(i.path.popLast());const h=ji(c);n+=h-u.size,e.push(this.Or.addEntry(t,i,c))}else if(n-=u.size,this.trackRemovals){const c=Fl(this.Or.serializer,o.convertToNoDocument(j.min()));e.push(this.Or.addEntry(t,i,c))}}),s.forEach(i=>{e.push(this.Or.indexManager.addToCollectionParentIndex(t,i))}),e.push(this.Or.updateMetadata(t,n)),A.waitFor(e)}getFromCache(t,e){return this.Or.vr(t,e).next(n=>(this.Nr.set(e,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(t,e){return this.Or.Fr(t,e).next(({documents:n,Mr:s})=>(s.forEach((i,o)=>{this.Nr.set(i,{size:o,readTime:n.get(i).readTime})}),n))}}function Zl(r){return wt(r,_s)}function un(r){return wt(r,Ni)}function Yr(r){const t=r.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function th(r,t){const e=t.documentKey.path.toArray();return[r,qi(t.readTime),e.slice(0,e.length-2),e.length>0?e[e.length-1]:""]}function eh(r,t){const e=r.path.toArray(),n=t.path.toArray();let s=0;for(let i=0;i<e.length-2&&i<n.length-2;++i)if(s=G(e[i],n[i]),s)return s;return s=G(e.length,n.length),s||(s=G(e[e.length-2],n[n.length-2]),s||G(e[e.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G_{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{constructor(t,e,n,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=s}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(n=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(n!==null&&hs(n.mutation,s,$t.empty(),tt.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(n=>this.getLocalViewOfDocuments(t,n,K()).next(()=>n))}getLocalViewOfDocuments(t,e,n=K()){const s=ce();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,n).next(i=>{let o=ns();return i.forEach((u,c)=>{o=o.insert(u,c.overlayedDocument)}),o}))}getOverlayedDocuments(t,e){const n=ce();return this.populateOverlays(t,n,e).next(()=>this.computeViews(t,e,n,K()))}populateOverlays(t,e,n){const s=[];return n.forEach(i=>{e.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(t,s).next(i=>{i.forEach((o,u)=>{e.set(o,u)})})}computeViews(t,e,n,s){let i=Kt();const o=ls(),u=function(){return ls()}();return e.forEach((c,h)=>{const f=n.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof Re)?i=i.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),hs(f.mutation,h,f.mutation.getFieldMask(),tt.now())):o.set(h.key,$t.empty())}),this.recalculateAndSaveOverlays(t,i).next(c=>(c.forEach((h,f)=>o.set(h,f)),e.forEach((h,f)=>{var m;return u.set(h,new G_(f,(m=o.get(h))!==null&&m!==void 0?m:null))}),u))}recalculateAndSaveOverlays(t,e){const n=ls();let s=new ot((o,u)=>o-u),i=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(o=>{for(const u of o)u.keys().forEach(c=>{const h=e.get(c);if(h===null)return;let f=n.get(c)||$t.empty();f=u.applyToLocalView(h,f),n.set(c,f);const m=(s.get(u.batchId)||K()).add(c);s=s.insert(u.batchId,m)})}).next(()=>{const o=[],u=s.getReverseIterator();for(;u.hasNext();){const c=u.getNext(),h=c.key,f=c.value,m=Kd();f.forEach(g=>{if(!i.has(g)){const w=Zd(e.get(g),n.get(g));w!==null&&m.set(g,w),i=i.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(t,h,m))}return A.waitFor(o)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(n=>this.recalculateAndSaveOverlays(t,n))}getDocumentsMatchingQuery(t,e,n,s){return function(o){return N.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Ya(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,s):this.getDocumentsMatchingCollectionQuery(t,e,n,s)}getNextDocuments(t,e,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,s-i.size):A.resolve(ce());let u=Zn,c=i;return o.next(h=>A.forEach(h,(f,m)=>(u<m.largestBatchId&&(u=m.largestBatchId),i.get(f)?A.resolve():this.remoteDocumentCache.getEntry(t,f).next(g=>{c=c.insert(f,g)}))).next(()=>this.populateOverlays(t,h,i)).next(()=>this.computeViews(t,c,h,K())).next(f=>({batchId:u,changes:$d(f)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new N(e)).next(n=>{let s=ns();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,n,s){const i=e.collectionGroup;let o=ns();return this.indexManager.getCollectionParents(t,i).next(u=>A.forEach(u,c=>{const h=function(m,g){return new ve(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(e,c.child(i));return this.getDocumentsMatchingCollectionQuery(t,h,n,s).next(f=>{f.forEach((m,g)=>{o=o.insert(m,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(t,e,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,s))).next(o=>{i.forEach((c,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,ct.newInvalidDocument(f)))});let u=ns();return o.forEach((c,h)=>{const f=i.get(c);f!==void 0&&hs(f.mutation,h,$t.empty(),tt.now()),Ns(e,h)&&(u=u.insert(c,h))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $_{constructor(t){this.serializer=t,this.Br=new Map,this.Lr=new Map}getBundleMetadata(t,e){return A.resolve(this.Br.get(e))}saveBundleMetadata(t,e){return this.Br.set(e.id,function(s){return{id:s.id,version:s.version,createTime:yt(s.createTime)}}(e)),A.resolve()}getNamedQuery(t,e){return A.resolve(this.Lr.get(e))}saveNamedQuery(t,e){return this.Lr.set(e.name,function(s){return{name:s.name,query:lo(s.bundledQuery),readTime:yt(s.readTime)}}(e)),A.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(){this.overlays=new ot(N.comparator),this.kr=new Map}getOverlay(t,e){return A.resolve(this.overlays.get(e))}getOverlays(t,e){const n=ce();return A.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(t,e,n){return n.forEach((s,i)=>{this.wt(t,e,i)}),A.resolve()}removeOverlaysForBatchId(t,e,n){const s=this.kr.get(n);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.kr.delete(n)),A.resolve()}getOverlaysForCollection(t,e,n){const s=ce(),i=e.length+1,o=new N(e.child("")),u=this.overlays.getIteratorFrom(o);for(;u.hasNext();){const c=u.getNext().value,h=c.getKey();if(!e.isPrefixOf(h.path))break;h.path.length===i&&c.largestBatchId>n&&s.set(c.getKey(),c)}return A.resolve(s)}getOverlaysForCollectionGroup(t,e,n,s){let i=new ot((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===e&&h.largestBatchId>n){let f=i.get(h.largestBatchId);f===null&&(f=ce(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const u=ce(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,f)=>u.set(h,f)),!(u.size()>=s)););return A.resolve(u)}wt(t,e,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.kr.get(s.largestBatchId).delete(n.key);this.kr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new su(e,n));let i=this.kr.get(e);i===void 0&&(i=K(),this.kr.set(e,i)),this.kr.set(e,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(){this.sessionToken=pt.EMPTY_BYTE_STRING}getSessionToken(t){return A.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,A.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(){this.qr=new rt(vt.Qr),this.$r=new rt(vt.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(t,e){const n=new vt(t,e);this.qr=this.qr.add(n),this.$r=this.$r.add(n)}Kr(t,e){t.forEach(n=>this.addReference(n,e))}removeReference(t,e){this.Wr(new vt(t,e))}Gr(t,e){t.forEach(n=>this.removeReference(n,e))}zr(t){const e=new N(new Q([])),n=new vt(e,t),s=new vt(e,t+1),i=[];return this.$r.forEachInRange([n,s],o=>{this.Wr(o),i.push(o.key)}),i}jr(){this.qr.forEach(t=>this.Wr(t))}Wr(t){this.qr=this.qr.delete(t),this.$r=this.$r.delete(t)}Jr(t){const e=new N(new Q([])),n=new vt(e,t),s=new vt(e,t+1);let i=K();return this.$r.forEachInRange([n,s],o=>{i=i.add(o.key)}),i}containsKey(t){const e=new vt(t,0),n=this.qr.firstAfterOrEqual(e);return n!==null&&t.isEqual(n.key)}}class vt{constructor(t,e){this.key=t,this.Hr=e}static Qr(t,e){return N.comparator(t.key,e.key)||G(t.Hr,e.Hr)}static Ur(t,e){return G(t.Hr,e.Hr)||N.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W_{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.er=1,this.Yr=new rt(vt.Qr)}checkEmpty(t){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,n,s){const i=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new nu(i,e,n,s);this.mutationQueue.push(o);for(const u of s)this.Yr=this.Yr.add(new vt(u.key,i)),this.indexManager.addToCollectionParentIndex(t,u.key.path.popLast());return A.resolve(o)}lookupMutationBatch(t,e){return A.resolve(this.Zr(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=this.Xr(n),i=s<0?0:s;return A.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?qe:this.er-1)}getAllMutationBatches(t){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new vt(e,0),s=new vt(e,Number.POSITIVE_INFINITY),i=[];return this.Yr.forEachInRange([n,s],o=>{const u=this.Zr(o.Hr);i.push(u)}),A.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new rt(G);return e.forEach(s=>{const i=new vt(s,0),o=new vt(s,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([i,o],u=>{n=n.add(u.Hr)})}),A.resolve(this.ei(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1;let i=n;N.isDocumentKey(i)||(i=i.child(""));const o=new vt(new N(i),0);let u=new rt(G);return this.Yr.forEachWhile(c=>{const h=c.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(u=u.add(c.Hr)),!0)},o),A.resolve(this.ei(u))}ei(t){const e=[];return t.forEach(n=>{const s=this.Zr(n);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){B(this.ti(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Yr;return A.forEach(e.mutations,s=>{const i=new vt(s.key,e.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.Yr=n})}rr(t){}containsKey(t,e){const n=new vt(e,0),s=this.Yr.firstAfterOrEqual(n);return A.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,A.resolve()}ti(t,e){return this.Xr(t)}Xr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Zr(t){const e=this.Xr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(t){this.ni=t,this.docs=function(){return new ot(N.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,s=this.docs.get(n),i=s?s.size:0,o=this.ni(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return A.resolve(n?n.document.mutableCopy():ct.newInvalidDocument(e))}getEntries(t,e){let n=Kt();return e.forEach(s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():ct.newInvalidDocument(s))}),A.resolve(n)}getDocumentsMatchingQuery(t,e,n,s){let i=Kt();const o=e.path,u=new N(o.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:h,value:{document:f}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||za(id(f),n)<=0||(s.has(f.key)||Ns(e,f))&&(i=i.insert(f.key,f.mutableCopy()))}return A.resolve(i)}getAllFromCollectionGroup(t,e,n,s){U(9500)}ri(t,e){return A.forEach(this.docs,n=>e(n))}newChangeBuffer(t){return new X_(this)}getSize(t){return A.resolve(this.size)}}class X_ extends Vf{constructor(t){super(),this.Or=t}applyChanges(t){const e=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?e.push(this.Or.addEntry(t,s)):this.Or.removeEntry(n)}),A.waitFor(e)}getFromCache(t,e){return this.Or.getEntry(t,e)}getAllFromCache(t,e){return this.Or.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J_{constructor(t){this.persistence=t,this.ii=new Ae(e=>En(e),Ds),this.lastRemoteSnapshotVersion=j.min(),this.highestTargetId=0,this.si=0,this.oi=new cu,this.targetCount=0,this._i=bn.ar()}forEachTarget(t,e){return this.ii.forEach((n,s)=>e(s)),A.resolve()}getLastRemoteSnapshotVersion(t){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return A.resolve(this.si)}allocateTargetId(t){return this.highestTargetId=this._i.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.si&&(this.si=e),A.resolve()}hr(t){this.ii.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this._i=new bn(e),this.highestTargetId=e),t.sequenceNumber>this.si&&(this.si=t.sequenceNumber)}addTargetData(t,e){return this.hr(e),this.targetCount+=1,A.resolve()}updateTargetData(t,e){return this.hr(e),A.resolve()}removeTargetData(t,e){return this.ii.delete(e.target),this.oi.zr(e.targetId),this.targetCount-=1,A.resolve()}removeTargets(t,e,n){let s=0;const i=[];return this.ii.forEach((o,u)=>{u.sequenceNumber<=e&&n.get(u.targetId)===null&&(this.ii.delete(o),i.push(this.removeMatchingKeysForTargetId(t,u.targetId)),s++)}),A.waitFor(i).next(()=>s)}getTargetCount(t){return A.resolve(this.targetCount)}getTargetData(t,e){const n=this.ii.get(e)||null;return A.resolve(n)}addMatchingKeys(t,e,n){return this.oi.Kr(e,n),A.resolve()}removeMatchingKeys(t,e,n){this.oi.Gr(e,n);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach(o=>{i.push(s.markPotentiallyOrphaned(t,o))}),A.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.oi.zr(e),A.resolve()}getMatchingKeysForTargetId(t,e){const n=this.oi.Jr(e);return A.resolve(n)}containsKey(t,e){return A.resolve(this.oi.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(t,e){this.ai={},this.overlays={},this.ui=new Gt(0),this.ci=!1,this.ci=!0,this.li=new Q_,this.referenceDelegate=t(this),this.hi=new J_(this),this.indexManager=new F_,this.remoteDocumentCache=function(s){return new H_(s)}(n=>this.referenceDelegate.Pi(n)),this.serializer=new yf(e),this.Ti=new $_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new K_,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.ai[t.toKey()];return n||(n=new W_(e,this.referenceDelegate),this.ai[t.toKey()]=n),n}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(t,e,n){k("MemoryPersistence","Starting transaction:",t);const s=new Y_(this.ui.next());return this.referenceDelegate.Ii(),n(s).next(i=>this.referenceDelegate.di(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Ei(t,e){return A.or(Object.values(this.ai).map(n=>()=>n.containsKey(t,e)))}}class Y_ extends ad{constructor(t){super(),this.currentSequenceNumber=t}}class mo{constructor(t){this.persistence=t,this.Ai=new cu,this.Ri=null}static Vi(t){return new mo(t)}get mi(){if(this.Ri)return this.Ri;throw U(60996)}addReference(t,e,n){return this.Ai.addReference(n,e),this.mi.delete(n.toString()),A.resolve()}removeReference(t,e,n){return this.Ai.removeReference(n,e),this.mi.add(n.toString()),A.resolve()}markPotentiallyOrphaned(t,e){return this.mi.add(e.toString()),A.resolve()}removeTarget(t,e){this.Ai.zr(e.targetId).forEach(s=>this.mi.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(i=>this.mi.add(i.toString()))}).next(()=>n.removeTargetData(t,e))}Ii(){this.Ri=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.mi,n=>{const s=N.fromPath(n);return this.fi(t,s).next(i=>{i||e.removeEntry(s,j.min())})}).next(()=>(this.Ri=null,e.apply(t)))}updateLimboDocument(t,e){return this.fi(t,e).next(n=>{n?this.mi.delete(e.toString()):this.mi.add(e.toString())})}Pi(t){return 0}fi(t,e){return A.or([()=>A.resolve(this.Ai.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ei(t,e)])}}class zi{constructor(t,e){this.persistence=t,this.gi=new Ae(n=>Ft(n.path),(n,s)=>n.isEqual(s)),this.garbageCollector=Sf(this,e)}static Vi(t,e){return new zi(t,e)}Ii(){}di(t){return A.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}mr(t){const e=this.yr(t);return this.persistence.getTargetCache().getTargetCount(t).next(n=>e.next(s=>n+s))}yr(t){let e=0;return this.gr(t,n=>{e++}).next(()=>e)}gr(t,e){return A.forEach(this.gi,(n,s)=>this.Sr(t,n,s).next(i=>i?A.resolve():e(s)))}removeTargets(t,e,n){return this.persistence.getTargetCache().removeTargets(t,e,n)}removeOrphanedDocuments(t,e){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ri(t,o=>this.Sr(t,o,e).next(u=>{u||(n++,i.removeEntry(o,j.min()))})).next(()=>i.apply(t)).next(()=>n)}markPotentiallyOrphaned(t,e){return this.gi.set(e,t.currentSequenceNumber),A.resolve()}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,n)}addReference(t,e,n){return this.gi.set(n,t.currentSequenceNumber),A.resolve()}removeReference(t,e,n){return this.gi.set(n,t.currentSequenceNumber),A.resolve()}updateLimboDocument(t,e){return this.gi.set(e,t.currentSequenceNumber),A.resolve()}Pi(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=Ri(t.data.value)),e}Sr(t,e,n){return A.or([()=>this.persistence.Ei(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.gi.get(e);return A.resolve(s!==void 0&&s>n)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(t){this.serializer=t}q(t,e,n,s){const i=new Zi("createOrUpgrade",e);n<1&&s>=1&&(function(c){c.createObjectStore(xs)}(t),function(c){c.createObjectStore(gs,{keyPath:_g}),c.createObjectStore(ee,{keyPath:dl,autoIncrement:!0}).createIndex(pn,fl,{unique:!0}),c.createObjectStore(nr)}(t),nh(t),function(c){c.createObjectStore(ln)}(t));let o=A.resolve();return n<3&&s>=3&&(n!==0&&(function(c){c.deleteObjectStore(sr),c.deleteObjectStore(rr),c.deleteObjectStore(_n)}(t),nh(t)),o=o.next(()=>function(c){const h=c.store(_n),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:j.min().toTimestamp(),targetCount:0};return h.put(Oi,f)}(i))),n<4&&s>=4&&(n!==0&&(o=o.next(()=>function(c,h){return h.store(ee).j().next(m=>{c.deleteObjectStore(ee),c.createObjectStore(ee,{keyPath:dl,autoIncrement:!0}).createIndex(pn,fl,{unique:!0});const g=h.store(ee),w=m.map(S=>g.put(S));return A.waitFor(w)})}(t,i))),o=o.next(()=>{(function(c){c.createObjectStore(ir,{keyPath:bg})})(t)})),n<5&&s>=5&&(o=o.next(()=>this.pi(i))),n<6&&s>=6&&(o=o.next(()=>(function(c){c.createObjectStore(_s)}(t),this.yi(i)))),n<7&&s>=7&&(o=o.next(()=>this.wi(i))),n<8&&s>=8&&(o=o.next(()=>this.Si(t,i))),n<9&&s>=9&&(o=o.next(()=>{(function(c){c.objectStoreNames.contains("remoteDocumentChanges")&&c.deleteObjectStore("remoteDocumentChanges")})(t)})),n<10&&s>=10&&(o=o.next(()=>this.bi(i))),n<11&&s>=11&&(o=o.next(()=>{(function(c){c.createObjectStore(to,{keyPath:Pg})})(t),function(c){c.createObjectStore(eo,{keyPath:Sg})}(t)})),n<12&&s>=12&&(o=o.next(()=>{(function(c){const h=c.createObjectStore(no,{keyPath:Og});h.createIndex(pa,Fg,{unique:!1}),h.createIndex(pd,Mg,{unique:!1})})(t)})),n<13&&s>=13&&(o=o.next(()=>function(c){const h=c.createObjectStore(Ni,{keyPath:Tg});h.createIndex(vi,Ig),h.createIndex(hd,Eg)}(t)).next(()=>this.Di(t,i)).next(()=>t.deleteObjectStore(ln))),n<14&&s>=14&&(o=o.next(()=>this.Ci(t,i))),n<15&&s>=15&&(o=o.next(()=>function(c){c.createObjectStore(Ka,{keyPath:Vg,autoIncrement:!0}).createIndex(ma,Cg,{unique:!1}),c.createObjectStore(as,{keyPath:xg}).createIndex(fd,Dg,{unique:!1}),c.createObjectStore(us,{keyPath:kg}).createIndex(md,Ng,{unique:!1})}(t))),n<16&&s>=16&&(o=o.next(()=>{e.objectStore(as).clear()}).next(()=>{e.objectStore(us).clear()})),n<17&&s>=17&&(o=o.next(()=>{(function(c){c.createObjectStore(Qa,{keyPath:Lg})})(t)})),n<18&&s>=18&&qh()&&(o=o.next(()=>{e.objectStore(as).clear()}).next(()=>{e.objectStore(us).clear()})),o}yi(t){let e=0;return t.store(ln).X((n,s)=>{e+=ji(s)}).next(()=>{const n={byteSize:e};return t.store(_s).put(fa,n)})}pi(t){const e=t.store(gs),n=t.store(ee);return e.j().next(s=>A.forEach(s,i=>{const o=IDBKeyRange.bound([i.userId,qe],[i.userId,i.lastAcknowledgedBatchId]);return n.j(pn,o).next(u=>A.forEach(u,c=>{B(c.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:c.batchId});const h=dn(this.serializer,c);return vf(t,i.userId,h).next(()=>{})}))}))}wi(t){const e=t.store(sr),n=t.store(ln);return t.store(_n).get(Oi).next(s=>{const i=[];return n.X((o,u)=>{const c=new Q(o),h=function(m){return[0,Ft(m)]}(c);i.push(e.get(h).next(f=>f?A.resolve():(m=>e.put({targetId:0,path:Ft(m),sequenceNumber:s.highestListenSequenceNumber}))(c)))}).next(()=>A.waitFor(i))})}Si(t,e){t.createObjectStore(ys,{keyPath:Rg});const n=e.store(ys),s=new uu,i=o=>{if(s.add(o)){const u=o.lastSegment(),c=o.popLast();return n.put({collectionId:u,parent:Ft(c)})}};return e.store(ln).X({Z:!0},(o,u)=>{const c=new Q(o);return i(c.popLast())}).next(()=>e.store(nr).X({Z:!0},([o,u,c],h)=>{const f=ue(u);return i(f.popLast())}))}bi(t){const e=t.store(rr);return e.X((n,s)=>{const i=ss(s),o=Tf(this.serializer,i);return e.put(o)})}Di(t,e){const n=e.store(ln),s=[];return n.X((i,o)=>{const u=e.store(Ni),c=function(m){return m.document?new N(Q.fromString(m.document.name).popFirst(5)):m.noDocument?N.fromSegments(m.noDocument.path):m.unknownDocument?N.fromSegments(m.unknownDocument.path):U(36783)}(o).path.toArray(),h={prefixPath:c.slice(0,c.length-2),collectionGroup:c[c.length-2],documentId:c[c.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(u.put(h))}).next(()=>A.waitFor(s))}Ci(t,e){const n=e.store(ee),s=Cf(this.serializer),i=new lu(mo.Vi,this.serializer.gt);return n.j().next(o=>{const u=new Map;return o.forEach(c=>{var h;let f=(h=u.get(c.userId))!==null&&h!==void 0?h:K();dn(this.serializer,c).keys().forEach(m=>f=f.add(m)),u.set(c.userId,f)}),A.forEach(u,(c,h)=>{const f=new At(h),m=ho.yt(this.serializer,f),g=i.getIndexManager(f),w=fo.yt(f,this.serializer,g,i.referenceDelegate);return new xf(s,w,m,g).recalculateAndSaveOverlaysForDocumentKeys(new ga(e,Gt.ue),c).next()})})}}function nh(r){r.createObjectStore(sr,{keyPath:vg}).createIndex($a,Ag,{unique:!0}),r.createObjectStore(rr,{keyPath:"targetId"}).createIndex(dd,wg,{unique:!0}),r.createObjectStore(_n)}const Ne="IndexedDbPersistence",Yo=18e5,Zo=5e3,ta="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",Df="main";class hu{constructor(t,e,n,s,i,o,u,c,h,f,m=18){if(this.allowTabSynchronization=t,this.persistenceKey=e,this.clientId=n,this.Fi=i,this.window=o,this.document=u,this.Mi=h,this.xi=f,this.Oi=m,this.ui=null,this.ci=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ni=null,this.inForeground=!1,this.Bi=null,this.Li=null,this.ki=Number.NEGATIVE_INFINITY,this.qi=g=>Promise.resolve(),!hu.C())throw new D(b.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new B_(this,s),this.Qi=e+Df,this.serializer=new yf(c),this.$i=new le(this.Qi,this.Oi,new Z_(this.serializer)),this.li=new C_,this.hi=new L_(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Cf(this.serializer),this.Ti=new V_,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,f===!1&&_t(Ne,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ki().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new D(b.FAILED_PRECONDITION,ta);return this.Wi(),this.Gi(),this.zi(),this.runTransaction("getHighestListenSequenceNumber","readonly",t=>this.hi.getHighestSequenceNumber(t))}).then(t=>{this.ui=new Gt(t,this.Mi)}).then(()=>{this.ci=!0}).catch(t=>(this.$i&&this.$i.close(),Promise.reject(t)))}ji(t){return this.qi=async e=>{if(this.started)return t(e)},t(this.isPrimary)}setDatabaseDeletedListener(t){this.$i.setDatabaseDeletedListener(t)}setNetworkEnabled(t){this.networkEnabled!==t&&(this.networkEnabled=t,this.Fi.enqueueAndForget(async()=>{this.started&&await this.Ki()}))}Ki(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",t=>gi(t).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Ji(t).next(e=>{e||(this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)))})}).next(()=>this.Hi(t)).next(e=>this.isPrimary&&!e?this.Yi(t).next(()=>!1):!!e&&this.Zi(t).next(()=>!0))).catch(t=>{if(Xe(t))return k(Ne,"Failed to extend owner lease: ",t),this.isPrimary;if(!this.allowTabSynchronization)throw t;return k(Ne,"Releasing owner lease after error during lease refresh",t),!1}).then(t=>{this.isPrimary!==t&&this.Fi.enqueueRetryable(()=>this.qi(t)),this.isPrimary=t})}Ji(t){return Zr(t).get(Un).next(e=>A.resolve(this.Xi(e)))}es(t){return gi(t).delete(this.clientId)}async ts(){if(this.isPrimary&&!this.ns(this.ki,Yo)){this.ki=Date.now();const t=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const n=wt(e,ir);return n.j().next(s=>{const i=this.rs(s,Yo),o=s.filter(u=>i.indexOf(u)===-1);return A.forEach(o,u=>n.delete(u.clientId)).next(()=>o)})}).catch(()=>[]);if(this.Ui)for(const e of t)this.Ui.removeItem(this.ss(e.clientId))}}zi(){this.Li=this.Fi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Ki().then(()=>this.ts()).then(()=>this.zi()))}Xi(t){return!!t&&t.ownerId===this.clientId}Hi(t){return this.xi?A.resolve(!0):Zr(t).get(Un).next(e=>{if(e!==null&&this.ns(e.leaseTimestampMs,Zo)&&!this._s(e.ownerId)){if(this.Xi(e)&&this.networkEnabled)return!0;if(!this.Xi(e)){if(!e.allowTabSynchronization)throw new D(b.FAILED_PRECONDITION,ta);return!1}}return!(!this.networkEnabled||!this.inForeground)||gi(t).j().next(n=>this.rs(n,Zo).find(s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,u=this.networkEnabled===s.networkEnabled;if(i||o&&u)return!0}return!1})===void 0)}).next(e=>(this.isPrimary!==e&&k(Ne,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ci=!1,this.us(),this.Li&&(this.Li.cancel(),this.Li=null),this.cs(),this.ls(),await this.$i.runTransaction("shutdown","readwrite",[xs,ir],t=>{const e=new ga(t,Gt.ue);return this.Yi(e).next(()=>this.es(e))}),this.$i.close(),this.hs()}rs(t,e){return t.filter(n=>this.ns(n.updateTimeMs,e)&&!this._s(n.clientId))}Ps(){return this.runTransaction("getActiveClients","readonly",t=>gi(t).j().next(e=>this.rs(e,Yo).map(n=>n.clientId)))}get started(){return this.ci}getGlobalsCache(){return this.li}getMutationQueue(t,e){return fo.yt(t,this.serializer,e,this.referenceDelegate)}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(t){return new M_(t,this.serializer.gt.databaseId)}getDocumentOverlayCache(t){return ho.yt(this.serializer,t)}getBundleCache(){return this.Ti}runTransaction(t,e,n){k(Ne,"Starting transaction:",t);const s=e==="readonly"?"readonly":"readwrite",i=function(c){return c===18?Bg:c===17?Td:c===16?qg:c===15?Wa:c===14?yd:c===13?_d:c===12?Ug:c===11?gd:void U(60245)}(this.Oi);let o;return this.$i.runTransaction(t,s,i,u=>(o=new ga(u,this.ui?this.ui.next():Gt.ue),e==="readwrite-primary"?this.Ji(o).next(c=>!!c||this.Hi(o)).next(c=>{if(!c)throw _t(`Failed to obtain primary lease for action '${t}'.`),this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)),new D(b.FAILED_PRECONDITION,od);return n(o)}).next(c=>this.Zi(o).next(()=>c)):this.Ts(o).next(()=>n(o)))).then(u=>(o.raiseOnCommittedEvent(),u))}Ts(t){return Zr(t).get(Un).next(e=>{if(e!==null&&this.ns(e.leaseTimestampMs,Zo)&&!this._s(e.ownerId)&&!this.Xi(e)&&!(this.xi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new D(b.FAILED_PRECONDITION,ta)})}Zi(t){const e={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Zr(t).put(Un,e)}static C(){return le.C()}Yi(t){const e=Zr(t);return e.get(Un).next(n=>this.Xi(n)?(k(Ne,"Releasing primary lease."),e.delete(Un)):A.resolve())}ns(t,e){const n=Date.now();return!(t<n-e)&&(!(t>n)||(_t(`Detected an update time that is in the future: ${t} > ${n}`),!1))}Wi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Bi=()=>{this.Fi.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.Ki()))},this.document.addEventListener("visibilitychange",this.Bi),this.inForeground=this.document.visibilityState==="visible")}cs(){this.Bi&&(this.document.removeEventListener("visibilitychange",this.Bi),this.Bi=null)}Gi(){var t;typeof((t=this.window)===null||t===void 0?void 0:t.addEventListener)=="function"&&(this.Ni=()=>{this.us();const e=/(?:Version|Mobile)\/1[456]/;Uh()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Fi.enterRestrictedMode(!0),this.Fi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Ni))}ls(){this.Ni&&(this.window.removeEventListener("pagehide",this.Ni),this.Ni=null)}_s(t){var e;try{const n=((e=this.Ui)===null||e===void 0?void 0:e.getItem(this.ss(t)))!==null;return k(Ne,`Client '${t}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return _t(Ne,"Failed to get zombied client id.",n),!1}}us(){if(this.Ui)try{this.Ui.setItem(this.ss(this.clientId),String(Date.now()))}catch(t){_t("Failed to set zombie client id.",t)}}hs(){if(this.Ui)try{this.Ui.removeItem(this.ss(this.clientId))}catch{}}ss(t){return`firestore_zombie_${this.persistenceKey}_${t}`}}function Zr(r){return wt(r,xs)}function gi(r){return wt(r,ir)}function du(r,t){let e=r.projectId;return r.isDefaultDatabase||(e+="."+r.database),"firestore/"+t+"/"+e+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fu{constructor(t,e,n,s){this.targetId=t,this.fromCache=e,this.Is=n,this.ds=s}static Es(t,e){let n=K(),s=K();for(const i of e.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new fu(t,e.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ty{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kf{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return Uh()?8:ud(xi())>0?6:4}()}initialize(t,e){this.gs=t,this.indexManager=e,this.As=!0}getDocumentsMatchingQuery(t,e,n,s){const i={result:null};return this.ps(t,e).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.ys(t,e,s,n).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new ty;return this.ws(t,e,o).next(u=>{if(i.result=u,this.Rs)return this.Ss(t,e,o,u.size)})}).next(()=>i.result)}Ss(t,e,n,s){return n.documentReadCount<this.Vs?(Kn()<=ye.DEBUG&&k("QueryEngine","SDK will not create cache indexes for query:",Qn(e),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),A.resolve()):(Kn()<=ye.DEBUG&&k("QueryEngine","Query:",Qn(e),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.fs*s?(Kn()<=ye.DEBUG&&k("QueryEngine","The SDK decides to create cache indexes for query:",Qn(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Mt(e))):A.resolve())}ps(t,e){if(bl(e))return A.resolve(null);let n=Mt(e);return this.indexManager.getIndexType(t,n).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Li(e,null,"F"),n=Mt(e)),this.indexManager.getDocumentsMatchingTarget(t,n).next(i=>{const o=K(...i);return this.gs.getDocuments(t,o).next(u=>this.indexManager.getMinOffset(t,n).next(c=>{const h=this.bs(e,u);return this.Ds(e,h,o,c.readTime)?this.ps(t,Li(e,null,"F")):this.vs(t,h,e,c)}))})))}ys(t,e,n,s){return bl(e)||s.isEqual(j.min())?A.resolve(null):this.gs.getDocuments(t,n).next(i=>{const o=this.bs(e,i);return this.Ds(e,o,n,s)?A.resolve(null):(Kn()<=ye.DEBUG&&k("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Qn(e)),this.vs(t,o,e,sd(s,Zn)).next(u=>u))})}bs(t,e){let n=new rt(zd(t));return e.forEach((s,i)=>{Ns(t,i)&&(n=n.add(i))}),n}Ds(t,e,n,s){if(t.limit===null)return!1;if(n.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ws(t,e,n){return Kn()<=ye.DEBUG&&k("QueryEngine","Using full collection scan to execute query:",Qn(e)),this.gs.getDocumentsMatchingQuery(t,e,Jt.min(),n)}vs(t,e,n,s){return this.gs.getDocumentsMatchingQuery(t,n,s).next(i=>(e.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mu="LocalStore",ey=3e8;class ny{constructor(t,e,n,s){this.persistence=t,this.Cs=e,this.serializer=s,this.Fs=new ot(G),this.Ms=new Ae(i=>En(i),Ds),this.xs=new Map,this.Os=t.getRemoteDocumentCache(),this.hi=t.getTargetCache(),this.Ti=t.getBundleCache(),this.Ns(n)}Ns(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new xf(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.Fs))}}function Nf(r,t,e,n){return new ny(r,t,e,n)}async function Of(r,t){const e=O(r);return await e.persistence.runTransaction("Handle user change","readonly",n=>{let s;return e.mutationQueue.getAllMutationBatches(n).next(i=>(s=i,e.Ns(t),e.mutationQueue.getAllMutationBatches(n))).next(i=>{const o=[],u=[];let c=K();for(const h of s){o.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}for(const h of i){u.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}return e.localDocuments.getDocuments(n,c).next(h=>({Bs:h,removedBatchIds:o,addedBatchIds:u}))})})}function ry(r,t){const e=O(r);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=t.batch.keys(),i=e.Os.newChangeBuffer({trackRemovals:!0});return function(u,c,h,f){const m=h.batch,g=m.keys();let w=A.resolve();return g.forEach(S=>{w=w.next(()=>f.getEntry(c,S)).next(x=>{const C=h.docVersions.get(S);B(C!==null,48541),x.version.compareTo(C)<0&&(m.applyToRemoteDocument(x,h),x.isValidDocument()&&(x.setReadTime(h.commitVersion),f.addEntry(x)))})}),w.next(()=>u.mutationQueue.removeMutationBatch(c,m))}(e,n,t,i).next(()=>i.apply(n)).next(()=>e.mutationQueue.performConsistencyCheck(n)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(n,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(u){let c=K();for(let h=0;h<u.mutationResults.length;++h)u.mutationResults[h].transformResults.length>0&&(c=c.add(u.batch.mutations[h].key));return c}(t))).next(()=>e.localDocuments.getDocuments(n,s))})}function Ff(r){const t=O(r);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.hi.getLastRemoteSnapshotVersion(e))}function sy(r,t){const e=O(r),n=t.snapshotVersion;let s=e.Fs;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=e.Os.newChangeBuffer({trackRemovals:!0});s=e.Fs;const u=[];t.targetChanges.forEach((f,m)=>{const g=s.get(m);if(!g)return;u.push(e.hi.removeMatchingKeys(i,f.removedDocuments,m).next(()=>e.hi.addMatchingKeys(i,f.addedDocuments,m)));let w=g.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(m)!==null?w=w.withResumeToken(pt.EMPTY_BYTE_STRING,j.min()).withLastLimboFreeSnapshotVersion(j.min()):f.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(f.resumeToken,n)),s=s.insert(m,w),function(x,C,L){return x.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=ey?!0:L.addedDocuments.size+L.modifiedDocuments.size+L.removedDocuments.size>0}(g,w,f)&&u.push(e.hi.updateTargetData(i,w))});let c=Kt(),h=K();if(t.documentUpdates.forEach(f=>{t.resolvedLimboDocuments.has(f)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(i,f))}),u.push(Mf(i,o,t.documentUpdates).next(f=>{c=f.Ls,h=f.ks})),!n.isEqual(j.min())){const f=e.hi.getLastRemoteSnapshotVersion(i).next(m=>e.hi.setTargetsMetadata(i,i.currentSequenceNumber,n));u.push(f)}return A.waitFor(u).next(()=>o.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,c,h)).next(()=>c)}).then(i=>(e.Fs=s,i))}function Mf(r,t,e){let n=K(),s=K();return e.forEach(i=>n=n.add(i)),t.getEntries(r,n).next(i=>{let o=Kt();return e.forEach((u,c)=>{const h=i.get(u);c.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(u)),c.isNoDocument()&&c.version.isEqual(j.min())?(t.removeEntry(u,c.readTime),o=o.insert(u,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(t.addEntry(c),o=o.insert(u,c)):k(mu,"Ignoring outdated watch update for ",u,". Current version:",h.version," Watch version:",c.version)}),{Ls:o,ks:s}})}function iy(r,t){const e=O(r);return e.persistence.runTransaction("Get next mutation batch","readonly",n=>(t===void 0&&(t=qe),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t)))}function dr(r,t){const e=O(r);return e.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return e.hi.getTargetData(n,t).next(i=>i?(s=i,A.resolve(s)):e.hi.allocateTargetId(n).next(o=>(s=new Te(t,o,"TargetPurposeListen",n.currentSequenceNumber),e.hi.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=e.Fs.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Fs=e.Fs.insert(n.targetId,n),e.Ms.set(t,n.targetId)),n})}async function fr(r,t,e){const n=O(r),s=n.Fs.get(t),i=e?"readwrite":"readwrite-primary";try{e||await n.persistence.runTransaction("Release target",i,o=>n.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Xe(o))throw o;k(mu,`Failed to update sequence numbers for target ${t}: ${o}`)}n.Fs=n.Fs.remove(t),n.Ms.delete(s.target)}function Gi(r,t,e){const n=O(r);let s=j.min(),i=K();return n.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,f){const m=O(c),g=m.Ms.get(f);return g!==void 0?A.resolve(m.Fs.get(g)):m.hi.getTargetData(h,f)}(n,o,Mt(t)).next(u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,n.hi.getMatchingKeysForTargetId(o,u.targetId).next(c=>{i=c})}).next(()=>n.Cs.getDocumentsMatchingQuery(o,t,e?s:j.min(),e?i:K())).next(u=>(qf(n,jd(t),u),{documents:u,qs:i})))}function Lf(r,t){const e=O(r),n=O(e.hi),s=e.Fs.get(t);return s?Promise.resolve(s.target):e.persistence.runTransaction("Get target data","readonly",i=>n.Et(i,t).next(o=>o?o.target:null))}function Uf(r,t){const e=O(r),n=e.xs.get(t)||j.min();return e.persistence.runTransaction("Get new document changes","readonly",s=>e.Os.getAllFromCollectionGroup(s,t,sd(n,Zn),Number.MAX_SAFE_INTEGER)).then(s=>(qf(e,t,s),s))}function qf(r,t,e){let n=r.xs.get(t)||j.min();e.forEach((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)}),r.xs.set(t,n)}async function oy(r,t,e,n){const s=O(r);let i=K(),o=Kt();for(const h of e){const f=t.Qs(h.metadata.name);h.document&&(i=i.add(f));const m=t.$s(h);m.setReadTime(t.Us(h.metadata.readTime)),o=o.insert(f,m)}const u=s.Os.newChangeBuffer({trackRemovals:!0}),c=await dr(s,function(f){return Mt(Ir(Q.fromString(`__bundle__/docs/${f}`)))}(n));return s.persistence.runTransaction("Apply bundle documents","readwrite",h=>Mf(h,u,o).next(f=>(u.apply(h),f)).next(f=>s.hi.removeMatchingKeysForTargetId(h,c.targetId).next(()=>s.hi.addMatchingKeys(h,i,c.targetId)).next(()=>s.localDocuments.getLocalViewOfDocuments(h,f.Ls,f.ks)).next(()=>f.Ls)))}async function ay(r,t,e=K()){const n=await dr(r,Mt(lo(t.bundledQuery))),s=O(r);return s.persistence.runTransaction("Save named query","readwrite",i=>{const o=yt(t.readTime);if(n.snapshotVersion.compareTo(o)>=0)return s.Ti.saveNamedQuery(i,t);const u=n.withResumeToken(pt.EMPTY_BYTE_STRING,o);return s.Fs=s.Fs.insert(u.targetId,u),s.hi.updateTargetData(i,u).next(()=>s.hi.removeMatchingKeysForTargetId(i,n.targetId)).next(()=>s.hi.addMatchingKeys(i,e,n.targetId)).next(()=>s.Ti.saveNamedQuery(i,t))})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bf="firestore_clients";function rh(r,t){return`${Bf}_${r}_${t}`}const jf="firestore_mutations";function sh(r,t,e){let n=`${jf}_${r}_${e}`;return t.isAuthenticated()&&(n+=`_${t.uid}`),n}const zf="firestore_targets";function ea(r,t){return`${zf}_${r}_${t}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oe="SharedClientState";class $i{constructor(t,e,n,s){this.user=t,this.batchId=e,this.state=n,this.error=s}static Ks(t,e,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new D(s.error.code,s.error.message))),o?new $i(t,e,s.state,i):(_t(oe,`Failed to parse mutation state for ID '${e}': ${n}`),null)}Ws(){const t={state:this.state,updateTimeMs:Date.now()};return this.error&&(t.error={code:this.error.code,message:this.error.message}),JSON.stringify(t)}}class ds{constructor(t,e,n){this.targetId=t,this.state=e,this.error=n}static Ks(t,e){const n=JSON.parse(e);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new D(n.error.code,n.error.message))),i?new ds(t,n.state,s):(_t(oe,`Failed to parse target state for ID '${t}': ${e}`),null)}Ws(){const t={state:this.state,updateTimeMs:Date.now()};return this.error&&(t.error={code:this.error.code,message:this.error.message}),JSON.stringify(t)}}class Ki{constructor(t,e){this.clientId=t,this.activeTargetIds=e}static Ks(t,e){const n=JSON.parse(e);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Za();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=cd(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new Ki(t,i):(_t(oe,`Failed to parse client data for instance '${t}': ${e}`),null)}}class pu{constructor(t,e){this.clientId=t,this.onlineState=e}static Ks(t){const e=JSON.parse(t);return typeof e=="object"&&["Unknown","Online","Offline"].indexOf(e.onlineState)!==-1&&typeof e.clientId=="string"?new pu(e.clientId,e.onlineState):(_t(oe,`Failed to parse online state: ${t}`),null)}}class Ca{constructor(){this.activeTargetIds=Za()}Gs(t){this.activeTargetIds=this.activeTargetIds.add(t)}zs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Ws(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class na{constructor(t,e,n,s,i){this.window=t,this.Fi=e,this.persistenceKey=n,this.js=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Js=this.Hs.bind(this),this.Ys=new ot(G),this.started=!1,this.Zs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=rh(this.persistenceKey,this.js),this.eo=function(c){return`firestore_sequence_number_${c}`}(this.persistenceKey),this.Ys=this.Ys.insert(this.js,new Ca),this.no=new RegExp(`^${Bf}_${o}_([^_]*)$`),this.ro=new RegExp(`^${jf}_${o}_(\\d+)(?:_(.*))?$`),this.io=new RegExp(`^${zf}_${o}_(\\d+)$`),this.so=function(c){return`firestore_online_state_${c}`}(this.persistenceKey),this.oo=function(c){return`firestore_bundle_loaded_v2_${c}`}(this.persistenceKey),this.window.addEventListener("storage",this.Js)}static C(t){return!(!t||!t.localStorage)}async start(){const t=await this.syncEngine.Ps();for(const n of t){if(n===this.js)continue;const s=this.getItem(rh(this.persistenceKey,n));if(s){const i=Ki.Ks(n,s);i&&(this.Ys=this.Ys.insert(i.clientId,i))}}this._o();const e=this.storage.getItem(this.so);if(e){const n=this.ao(e);n&&this.uo(n)}for(const n of this.Zs)this.Hs(n);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(t){this.setItem(this.eo,JSON.stringify(t))}getAllActiveQueryTargets(){return this.co(this.Ys)}isActiveQueryTarget(t){let e=!1;return this.Ys.forEach((n,s)=>{s.activeTargetIds.has(t)&&(e=!0)}),e}addPendingMutation(t){this.lo(t,"pending")}updateMutationState(t,e,n){this.lo(t,e,n),this.ho(t)}addLocalQueryTarget(t,e=!0){let n="not-current";if(this.isActiveQueryTarget(t)){const s=this.storage.getItem(ea(this.persistenceKey,t));if(s){const i=ds.Ks(t,s);i&&(n=i.state)}}return e&&this.Po.Gs(t),this._o(),n}removeLocalQueryTarget(t){this.Po.zs(t),this._o()}isLocalQueryTarget(t){return this.Po.activeTargetIds.has(t)}clearQueryState(t){this.removeItem(ea(this.persistenceKey,t))}updateQueryState(t,e,n){this.To(t,e,n)}handleUserChange(t,e,n){e.forEach(s=>{this.ho(s)}),this.currentUser=t,n.forEach(s=>{this.addPendingMutation(s)})}setOnlineState(t){this.Io(t)}notifyBundleLoaded(t){this.Eo(t)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Js),this.removeItem(this.Xs),this.started=!1)}getItem(t){const e=this.storage.getItem(t);return k(oe,"READ",t,e),e}setItem(t,e){k(oe,"SET",t,e),this.storage.setItem(t,e)}removeItem(t){k(oe,"REMOVE",t),this.storage.removeItem(t)}Hs(t){const e=t;if(e.storageArea===this.storage){if(k(oe,"EVENT",e.key,e.newValue),e.key===this.Xs)return void _t("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Fi.enqueueRetryable(async()=>{if(this.started){if(e.key!==null){if(this.no.test(e.key)){if(e.newValue==null){const n=this.Ao(e.key);return this.Ro(n,null)}{const n=this.Vo(e.key,e.newValue);if(n)return this.Ro(n.clientId,n)}}else if(this.ro.test(e.key)){if(e.newValue!==null){const n=this.mo(e.key,e.newValue);if(n)return this.fo(n)}}else if(this.io.test(e.key)){if(e.newValue!==null){const n=this.po(e.key,e.newValue);if(n)return this.yo(n)}}else if(e.key===this.so){if(e.newValue!==null){const n=this.ao(e.newValue);if(n)return this.uo(n)}}else if(e.key===this.eo){const n=function(i){let o=Gt.ue;if(i!=null)try{const u=JSON.parse(i);B(typeof u=="number",30636,{wo:i}),o=u}catch(u){_t(oe,"Failed to read sequence number from WebStorage",u)}return o}(e.newValue);n!==Gt.ue&&this.sequenceNumberHandler(n)}else if(e.key===this.oo){const n=this.So(e.newValue);await Promise.all(n.map(s=>this.syncEngine.bo(s)))}}}else this.Zs.push(e)})}}get Po(){return this.Ys.get(this.js)}_o(){this.setItem(this.Xs,this.Po.Ws())}lo(t,e,n){const s=new $i(this.currentUser,t,e,n),i=sh(this.persistenceKey,this.currentUser,t);this.setItem(i,s.Ws())}ho(t){const e=sh(this.persistenceKey,this.currentUser,t);this.removeItem(e)}Io(t){const e={clientId:this.js,onlineState:t};this.storage.setItem(this.so,JSON.stringify(e))}To(t,e,n){const s=ea(this.persistenceKey,t),i=new ds(t,e,n);this.setItem(s,i.Ws())}Eo(t){const e=JSON.stringify(Array.from(t));this.setItem(this.oo,e)}Ao(t){const e=this.no.exec(t);return e?e[1]:null}Vo(t,e){const n=this.Ao(t);return Ki.Ks(n,e)}mo(t,e){const n=this.ro.exec(t),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return $i.Ks(new At(i),s,e)}po(t,e){const n=this.io.exec(t),s=Number(n[1]);return ds.Ks(s,e)}ao(t){return pu.Ks(t)}So(t){return JSON.parse(t)}async fo(t){if(t.user.uid===this.currentUser.uid)return this.syncEngine.Do(t.batchId,t.state,t.error);k(oe,`Ignoring mutation for non-active user ${t.user.uid}`)}yo(t){return this.syncEngine.vo(t.targetId,t.state,t.error)}Ro(t,e){const n=e?this.Ys.insert(t,e):this.Ys.remove(t),s=this.co(this.Ys),i=this.co(n),o=[],u=[];return i.forEach(c=>{s.has(c)||o.push(c)}),s.forEach(c=>{i.has(c)||u.push(c)}),this.syncEngine.Co(o,u).then(()=>{this.Ys=n})}uo(t){this.Ys.get(t.clientId)&&this.onlineStateHandler(t.onlineState)}co(t){let e=Za();return t.forEach((n,s)=>{e=e.unionWith(s.activeTargetIds)}),e}}class Gf{constructor(){this.Fo=new Ca,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t,e=!0){return e&&this.Fo.Gs(t),this.Mo[t]||"not-current"}updateQueryState(t,e,n){this.Mo[t]=e}removeLocalQueryTarget(t){this.Fo.zs(t)}isLocalQueryTarget(t){return this.Fo.activeTargetIds.has(t)}clearQueryState(t){delete this.Mo[t]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(t){return this.Fo.activeTargetIds.has(t)}start(){return this.Fo=new Ca,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uy{xo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ih="ConnectivityMonitor";class oh{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(t){this.ko.push(t)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){k(ih,"Network connectivity changed: AVAILABLE");for(const t of this.ko)t(0)}Lo(){k(ih,"Network connectivity changed: UNAVAILABLE");for(const t of this.ko)t(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _i=null;function xa(){return _i===null?_i=function(){return 268435456+Math.round(2147483648*Math.random())}():_i++,"0x"+_i.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ra="RestConnection",cy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class ly{get Qo(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.$o=e+"://"+t.host,this.Uo=`projects/${n}/databases/${s}`,this.Ko=this.databaseId.database===Is?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Wo(t,e,n,s,i){const o=xa(),u=this.Go(t,e.toUriEncodedString());k(ra,`Sending RPC '${t}' ${o}:`,u,n);const c={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(c,s,i);const{host:h}=new URL(u),f=Vs(h);return this.jo(t,u,c,n,f).then(m=>(k(ra,`Received RPC '${t}' ${o}: `,m),m),m=>{throw Lt(ra,`RPC '${t}' ${o} failed with error: `,m,"url: ",u,"request:",n),m})}Jo(t,e,n,s,i,o){return this.Wo(t,e,n,s,i)}zo(t,e,n){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Tr}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((s,i)=>t[i]=s),n&&n.headers.forEach((s,i)=>t[i]=s)}Go(t,e){const n=cy[t];return`${this.$o}/v1/${e}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hy{constructor(t){this.Ho=t.Ho,this.Yo=t.Yo}Zo(t){this.Xo=t}e_(t){this.t_=t}n_(t){this.r_=t}onMessage(t){this.i_=t}close(){this.Yo()}send(t){this.Ho(t)}s_(){this.Xo()}o_(){this.t_()}__(t){this.r_(t)}a_(t){this.i_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kt="WebChannelConnection";class dy extends ly{constructor(t){super(t),this.u_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}jo(t,e,n,s,i){const o=xa();return new Promise((u,c)=>{const h=new Kh;h.setWithCredentials(!0),h.listenOnce(Qh.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case Ei.NO_ERROR:const m=h.getResponseJson();k(kt,`XHR for RPC '${t}' ${o} received:`,JSON.stringify(m)),u(m);break;case Ei.TIMEOUT:k(kt,`RPC '${t}' ${o} timed out`),c(new D(b.DEADLINE_EXCEEDED,"Request time out"));break;case Ei.HTTP_ERROR:const g=h.getStatus();if(k(kt,`RPC '${t}' ${o} failed with status:`,g,"response text:",h.getResponseText()),g>0){let w=h.getResponseJson();Array.isArray(w)&&(w=w[0]);const S=w?.error;if(S&&S.status&&S.message){const x=function(L){const q=L.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(q)>=0?q:b.UNKNOWN}(S.status);c(new D(x,S.message))}else c(new D(b.UNKNOWN,"Server responded with status "+h.getStatus()))}else c(new D(b.UNAVAILABLE,"Connection failed."));break;default:U(9055,{c_:t,streamId:o,l_:h.getLastErrorCode(),h_:h.getLastError()})}}finally{k(kt,`RPC '${t}' ${o} completed.`)}});const f=JSON.stringify(s);k(kt,`RPC '${t}' ${o} sending request:`,s),h.send(e,"POST",f,n,15)})}P_(t,e,n){const s=xa(),i=[this.$o,"/","google.firestore.v1.Firestore","/",t,"/channel"],o=Xh(),u=Hh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.useFetchStreams=!0),this.zo(c.initMessageHeaders,e,n),c.encodeInitMessageHeaders=!0;const f=i.join("");k(kt,`Creating RPC '${t}' stream ${s}: ${f}`,c);const m=o.createWebChannel(f,c);this.T_(m);let g=!1,w=!1;const S=new hy({Ho:C=>{w?k(kt,`Not sending because RPC '${t}' stream ${s} is closed:`,C):(g||(k(kt,`Opening RPC '${t}' stream ${s} transport.`),m.open(),g=!0),k(kt,`RPC '${t}' stream ${s} sending:`,C),m.send(C))},Yo:()=>m.close()}),x=(C,L,q)=>{C.listen(L,M=>{try{q(M)}catch(z){setTimeout(()=>{throw z},0)}})};return x(m,es.EventType.OPEN,()=>{w||(k(kt,`RPC '${t}' stream ${s} transport opened.`),S.s_())}),x(m,es.EventType.CLOSE,()=>{w||(w=!0,k(kt,`RPC '${t}' stream ${s} transport closed`),S.__(),this.I_(m))}),x(m,es.EventType.ERROR,C=>{w||(w=!0,Lt(kt,`RPC '${t}' stream ${s} transport errored. Name:`,C.name,"Message:",C.message),S.__(new D(b.UNAVAILABLE,"The operation could not be completed")))}),x(m,es.EventType.MESSAGE,C=>{var L;if(!w){const q=C.data[0];B(!!q,16349);const M=q,z=M?.error||((L=M[0])===null||L===void 0?void 0:L.error);if(z){k(kt,`RPC '${t}' stream ${s} received error:`,z);const H=z.status;let $=function(T){const E=Tt[T];if(E!==void 0)return rf(E)}(H),I=z.message;$===void 0&&($=b.INTERNAL,I="Unknown error status: "+H+" with message "+z.message),w=!0,S.__(new D($,I)),m.close()}else k(kt,`RPC '${t}' stream ${s} received:`,q),S.a_(q)}}),x(u,Wh.STAT_EVENT,C=>{C.stat===ua.PROXY?k(kt,`RPC '${t}' stream ${s} detected buffering proxy`):C.stat===ua.NOPROXY&&k(kt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{S.o_()},0),S}terminate(){this.u_.forEach(t=>t.close()),this.u_=[]}T_(t){this.u_.push(t)}I_(t){this.u_=this.u_.filter(e=>e===t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $f(){return typeof window<"u"?window:null}function Ci(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(r){return new y_(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(t,e,n=1e3,s=1.5,i=6e4){this.Fi=t,this.timerId=e,this.d_=n,this.E_=s,this.A_=i,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(t){this.cancel();const e=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),s=Math.max(0,e-n);s>0&&k("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.R_} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,s,()=>(this.m_=Date.now(),t())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ah="PersistentStream";class Kf{constructor(t,e,n,s,i,o,u,c){this.Fi=t,this.w_=n,this.S_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new gu(t,e)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(t){this.q_(),this.stream.send(t)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,t!==4?this.F_.reset():e&&e.code===b.RESOURCE_EXHAUSTED?(_t(e.toString()),_t("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):e&&e.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.n_(e)}U_(){}auth(){this.state=1;const t=this.K_(this.b_),e=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.b_===e&&this.W_(n,s)},n=>{t(()=>{const s=new D(b.UNKNOWN,"Fetching auth token failed: "+n.message);return this.G_(s)})})}W_(t,e){const n=this.K_(this.b_);this.stream=this.z_(t,e),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.e_(()=>{n(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(s=>{n(()=>this.G_(s))}),this.stream.onMessage(s=>{n(()=>++this.C_==1?this.j_(s):this.onNext(s))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(t){return k(ah,`close with error: ${t}`),this.stream=null,this.close(4,t)}K_(t){return e=>{this.Fi.enqueueAndForget(()=>this.b_===t?e():(k(ah,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class fy extends Kf{constructor(t,e,n,s,i,o){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}z_(t,e){return this.connection.P_("Listen",t,e)}j_(t){return this.onNext(t)}onNext(t){this.F_.reset();const e=E_(this.serializer,t),n=function(i){if(!("targetChange"in i))return j.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?j.min():o.readTime?yt(o.readTime):j.min()}(t);return this.listener.J_(e,n)}H_(t){const e={};e.database=Ra(this.serializer),e.addTarget=function(i,o){let u;const c=o.target;if(u=Fi(c)?{documents:df(i,c)}:{query:co(i,c).Vt},u.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){u.resumeToken=af(i,o.resumeToken);const h=va(i,o.expectedCount);h!==null&&(u.expectedCount=h)}else if(o.snapshotVersion.compareTo(j.min())>0){u.readTime=hr(i,o.snapshotVersion.toTimestamp());const h=va(i,o.expectedCount);h!==null&&(u.expectedCount=h)}return u}(this.serializer,t);const n=v_(this.serializer,t);n&&(e.labels=n),this.k_(e)}Y_(t){const e={};e.database=Ra(this.serializer),e.removeTarget=t,this.k_(e)}}class my extends Kf{constructor(t,e,n,s,i,o){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(t,e){return this.connection.P_("Write",t,e)}j_(t){return B(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,B(!t.writeResults||t.writeResults.length===0,55816),this.listener.ea()}onNext(t){B(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.F_.reset();const e=w_(t.writeResults,t.commitTime),n=yt(t.commitTime);return this.listener.ta(n,e)}na(){const t={};t.database=Ra(this.serializer),this.k_(t)}X_(t){const e={streamToken:this.lastStreamToken,writes:t.map(n=>Rs(this.serializer,n))};this.k_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{}class gy extends py{constructor(t,e,n,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new D(b.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(t,e,n,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Wo(t,Aa(e,n),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new D(b.UNKNOWN,i.toString())})}Jo(t,e,n,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,u])=>this.connection.Jo(t,Aa(e,n),s,o,u,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new D(b.UNKNOWN,o.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class _y{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(t){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ua("Offline")))}set(t){this.ha(),this.sa=0,t==="Online"&&(this._a=!1),this.ua(t)}ua(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}ca(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(_t(e),this._a=!1):k("OnlineStateTracker",e)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pn="RemoteStore";class yy{constructor(t,e,n,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=i,this.Ea.xo(o=>{n.enqueueAndForget(async()=>{Ye(this)&&(k(Pn,"Restarting streams for network reachability change."),await async function(c){const h=O(c);h.Ia.add(4),await vr(h),h.Aa.set("Unknown"),h.Ia.delete(4),await Ls(h)}(this))})}),this.Aa=new _y(n,s)}}async function Ls(r){if(Ye(r))for(const t of r.da)await t(!0)}async function vr(r){for(const t of r.da)await t(!1)}function po(r,t){const e=O(r);e.Ta.has(t.targetId)||(e.Ta.set(t.targetId,t),Tu(e)?yu(e):Rr(e).x_()&&_u(e,t))}function mr(r,t){const e=O(r),n=Rr(e);e.Ta.delete(t),n.x_()&&Qf(e,t),e.Ta.size===0&&(n.x_()?n.B_():Ye(e)&&e.Aa.set("Unknown"))}function _u(r,t){if(r.Ra.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(j.min())>0){const e=r.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Rr(r).H_(t)}function Qf(r,t){r.Ra.$e(t),Rr(r).Y_(t)}function yu(r){r.Ra=new m_({getRemoteKeysForTarget:t=>r.remoteSyncer.getRemoteKeysForTarget(t),Et:t=>r.Ta.get(t)||null,lt:()=>r.datastore.serializer.databaseId}),Rr(r).start(),r.Aa.aa()}function Tu(r){return Ye(r)&&!Rr(r).M_()&&r.Ta.size>0}function Ye(r){return O(r).Ia.size===0}function Wf(r){r.Ra=void 0}async function Ty(r){r.Aa.set("Online")}async function Iy(r){r.Ta.forEach((t,e)=>{_u(r,t)})}async function Ey(r,t){Wf(r),Tu(r)?(r.Aa.la(t),yu(r)):r.Aa.set("Unknown")}async function wy(r,t,e){if(r.Aa.set("Online"),t instanceof of&&t.state===2&&t.cause)try{await async function(s,i){const o=i.cause;for(const u of i.targetIds)s.Ta.has(u)&&(await s.remoteSyncer.rejectListen(u,o),s.Ta.delete(u),s.Ra.removeTarget(u))}(r,t)}catch(n){k(Pn,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await Qi(r,n)}else if(t instanceof Si?r.Ra.Ye(t):t instanceof sf?r.Ra.it(t):r.Ra.et(t),!e.isEqual(j.min()))try{const n=await Ff(r.localStore);e.compareTo(n)>=0&&await function(i,o){const u=i.Ra.Pt(o);return u.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.Ta.get(h);f&&i.Ta.set(h,f.withResumeToken(c.resumeToken,o))}}),u.targetMismatches.forEach((c,h)=>{const f=i.Ta.get(c);if(!f)return;i.Ta.set(c,f.withResumeToken(pt.EMPTY_BYTE_STRING,f.snapshotVersion)),Qf(i,c);const m=new Te(f.target,c,h,f.sequenceNumber);_u(i,m)}),i.remoteSyncer.applyRemoteEvent(u)}(r,e)}catch(n){k(Pn,"Failed to raise snapshot:",n),await Qi(r,n)}}async function Qi(r,t,e){if(!Xe(t))throw t;r.Ia.add(1),await vr(r),r.Aa.set("Offline"),e||(e=()=>Ff(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{k(Pn,"Retrying IndexedDB access"),await e(),r.Ia.delete(1),await Ls(r)})}function Hf(r,t){return t().catch(e=>Qi(r,e,t))}async function Ar(r){const t=O(r),e=Ke(t);let n=t.Pa.length>0?t.Pa[t.Pa.length-1].batchId:qe;for(;vy(t);)try{const s=await iy(t.localStore,n);if(s===null){t.Pa.length===0&&e.B_();break}n=s.batchId,Ay(t,s)}catch(s){await Qi(t,s)}Xf(t)&&Jf(t)}function vy(r){return Ye(r)&&r.Pa.length<10}function Ay(r,t){r.Pa.push(t);const e=Ke(r);e.x_()&&e.Z_&&e.X_(t.mutations)}function Xf(r){return Ye(r)&&!Ke(r).M_()&&r.Pa.length>0}function Jf(r){Ke(r).start()}async function Ry(r){Ke(r).na()}async function by(r){const t=Ke(r);for(const e of r.Pa)t.X_(e.mutations)}async function Py(r,t,e){const n=r.Pa.shift(),s=ru.from(n,t,e);await Hf(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await Ar(r)}async function Sy(r,t){t&&Ke(r).Z_&&await async function(n,s){if(function(o){return nf(o)&&o!==b.ABORTED}(s.code)){const i=n.Pa.shift();Ke(n).N_(),await Hf(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s)),await Ar(n)}}(r,t),Xf(r)&&Jf(r)}async function uh(r,t){const e=O(r);e.asyncQueue.verifyOperationInProgress(),k(Pn,"RemoteStore received new credentials");const n=Ye(e);e.Ia.add(3),await vr(e),n&&e.Aa.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ia.delete(3),await Ls(e)}async function Da(r,t){const e=O(r);t?(e.Ia.delete(2),await Ls(e)):t||(e.Ia.add(2),await vr(e),e.Aa.set("Unknown"))}function Rr(r){return r.Va||(r.Va=function(e,n,s){const i=O(e);return i.ia(),new fy(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Zo:Ty.bind(null,r),e_:Iy.bind(null,r),n_:Ey.bind(null,r),J_:wy.bind(null,r)}),r.da.push(async t=>{t?(r.Va.N_(),Tu(r)?yu(r):r.Aa.set("Unknown")):(await r.Va.stop(),Wf(r))})),r.Va}function Ke(r){return r.ma||(r.ma=function(e,n,s){const i=O(e);return i.ia(),new my(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:Ry.bind(null,r),n_:Sy.bind(null,r),ea:by.bind(null,r),ta:Py.bind(null,r)}),r.da.push(async t=>{t?(r.ma.N_(),await Ar(r)):(await r.ma.stop(),r.Pa.length>0&&(k(Pn,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))})),r.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(t,e,n,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Rt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,i){const o=Date.now()+n,u=new Iu(t,e,o,s,i);return u.start(n),u}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(b.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function br(r,t){if(_t("AsyncQueue",`${t}: ${r}`),Xe(r))return new D(b.UNAVAILABLE,`${t}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{static emptySet(t){return new yn(t.comparator)}constructor(t){this.comparator=t?(e,n)=>t(e,n)||N.comparator(e.key,n.key):(e,n)=>N.comparator(e.key,n.key),this.keyedMap=ns(),this.sortedSet=new ot(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,n)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof yn)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const n=new yn;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch{constructor(){this.fa=new ot(N.comparator)}track(t){const e=t.doc.key,n=this.fa.get(e);n?t.type!==0&&n.type===3?this.fa=this.fa.insert(e,t):t.type===3&&n.type!==1?this.fa=this.fa.insert(e,{type:n.type,doc:t.doc}):t.type===2&&n.type===2?this.fa=this.fa.insert(e,{type:2,doc:t.doc}):t.type===2&&n.type===0?this.fa=this.fa.insert(e,{type:0,doc:t.doc}):t.type===1&&n.type===0?this.fa=this.fa.remove(e):t.type===1&&n.type===2?this.fa=this.fa.insert(e,{type:1,doc:n.doc}):t.type===0&&n.type===1?this.fa=this.fa.insert(e,{type:2,doc:t.doc}):U(63341,{At:t,ga:n}):this.fa=this.fa.insert(e,t)}pa(){const t=[];return this.fa.inorderTraversal((e,n)=>{t.push(n)}),t}}class Sn{constructor(t,e,n,s,i,o,u,c,h){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(t,e,n,s,i){const o=[];return e.forEach(u=>{o.push({type:0,doc:u})}),new Sn(t,e,yn.emptySet(e),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&ks(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==n[s].type||!e[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(t=>t.ba())}}class Cy{constructor(){this.queries=lh(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(e,n){const s=O(e),i=s.queries;s.queries=lh(),i.forEach((o,u)=>{for(const c of u.wa)c.onError(n)})})(this,new D(b.ABORTED,"Firestore shutting down"))}}function lh(){return new Ae(r=>Bd(r),ks)}async function Eu(r,t){const e=O(r);let n=3;const s=t.query;let i=e.queries.get(s);i?!i.Sa()&&t.ba()&&(n=2):(i=new Vy,n=t.ba()?0:1);try{switch(n){case 0:i.ya=await e.onListen(s,!0);break;case 1:i.ya=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(o){const u=br(o,`Initialization of query '${Qn(t.query)}' failed`);return void t.onError(u)}e.queries.set(s,i),i.wa.push(t),t.va(e.onlineState),i.ya&&t.Ca(i.ya)&&vu(e)}async function wu(r,t){const e=O(r),n=t.query;let s=3;const i=e.queries.get(n);if(i){const o=i.wa.indexOf(t);o>=0&&(i.wa.splice(o,1),i.wa.length===0?s=t.ba()?0:1:!i.Sa()&&t.ba()&&(s=2))}switch(s){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function xy(r,t){const e=O(r);let n=!1;for(const s of t){const i=s.query,o=e.queries.get(i);if(o){for(const u of o.wa)u.Ca(s)&&(n=!0);o.ya=s}}n&&vu(e)}function Dy(r,t,e){const n=O(r),s=n.queries.get(t);if(s)for(const i of s.wa)i.onError(e);n.queries.delete(t)}function vu(r){r.Da.forEach(t=>{t.next()})}var ka,hh;(hh=ka||(ka={})).Fa="default",hh.Cache="cache";class Au{constructor(t,e,n){this.query=t,this.Ma=e,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=n||{}}Ca(t){if(!this.options.includeMetadataChanges){const n=[];for(const s of t.docChanges)s.type!==3&&n.push(s);t=new Sn(t.query,t.docs,t.oldDocs,n,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.xa?this.Na(t)&&(this.Ma.next(t),e=!0):this.Ba(t,this.onlineState)&&(this.La(t),e=!0),this.Oa=t,e}onError(t){this.Ma.error(t)}va(t){this.onlineState=t;let e=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,t)&&(this.La(this.Oa),e=!0),e}Ba(t,e){if(!t.fromCache||!this.ba())return!0;const n=e!=="Offline";return(!this.options.ka||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Na(t){if(t.docChanges.length>0)return!0;const e=this.Oa&&this.Oa.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}La(t){t=Sn.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.xa=!0,this.Ma.next(t)}ba(){return this.options.source!==ka.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(t,e){this.qa=t,this.byteLength=e}Qa(){return"metadata"in this.qa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{constructor(t){this.serializer=t}Qs(t){return he(this.serializer,t)}$s(t){return t.metadata.exists?uo(this.serializer,t.document,!1):ct.newNoDocument(this.Qs(t.metadata.name),this.Us(t.metadata.readTime))}Us(t){return yt(t)}}class Ru{constructor(t,e){this.$a=t,this.serializer=e,this.Ua=[],this.Ka=[],this.collectionGroups=new Set,this.progress=Zf(t)}get queries(){return this.Ua}get documents(){return this.Ka}Wa(t){this.progress.bytesLoaded+=t.byteLength;let e=this.progress.documentsLoaded;if(t.qa.namedQuery)this.Ua.push(t.qa.namedQuery);else if(t.qa.documentMetadata){this.Ka.push({metadata:t.qa.documentMetadata}),t.qa.documentMetadata.exists||++e;const n=Q.fromString(t.qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else t.qa.document&&(this.Ka[this.Ka.length-1].document=t.qa.document,++e);return e!==this.progress.documentsLoaded?(this.progress.documentsLoaded=e,Object.assign({},this.progress)):null}Ga(t){const e=new Map,n=new dh(this.serializer);for(const s of t)if(s.metadata.queries){const i=n.Qs(s.metadata.name);for(const o of s.metadata.queries){const u=(e.get(o)||K()).add(i);e.set(o,u)}}return e}async za(t){const e=await oy(t,new dh(this.serializer),this.Ka,this.$a.id),n=this.Ga(this.documents);for(const s of this.Ua)await ay(t,s,n.get(s.name));return this.progress.taskState="Success",{progress:this.progress,ja:this.collectionGroups,Ja:e}}}function Zf(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(t){this.key=t}}class em{constructor(t){this.key=t}}class nm{constructor(t,e){this.query=t,this.Ha=e,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=K(),this.mutatedKeys=K(),this.Xa=zd(t),this.eu=new yn(this.Xa)}get tu(){return this.Ha}nu(t,e){const n=e?e.ru:new ch,s=e?e.eu:this.eu;let i=e?e.mutatedKeys:this.mutatedKeys,o=s,u=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((f,m)=>{const g=s.get(f),w=Ns(this.query,m)?m:null,S=!!g&&this.mutatedKeys.has(g.key),x=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let C=!1;g&&w?g.data.isEqual(w.data)?S!==x&&(n.track({type:3,doc:w}),C=!0):this.iu(g,w)||(n.track({type:2,doc:w}),C=!0,(c&&this.Xa(w,c)>0||h&&this.Xa(w,h)<0)&&(u=!0)):!g&&w?(n.track({type:0,doc:w}),C=!0):g&&!w&&(n.track({type:1,doc:g}),C=!0,(c||h)&&(u=!0)),C&&(w?(o=o.add(w),i=x?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{eu:o,ru:n,Ds:u,mutatedKeys:i}}iu(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,s){const i=this.eu;this.eu=t.eu,this.mutatedKeys=t.mutatedKeys;const o=t.ru.pa();o.sort((f,m)=>function(w,S){const x=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return U(20277,{At:C})}};return x(w)-x(S)}(f.type,m.type)||this.Xa(f.doc,m.doc)),this.su(n),s=s!=null&&s;const u=e&&!s?this.ou():[],c=this.Za.size===0&&this.current&&!s?1:0,h=c!==this.Ya;return this.Ya=c,o.length!==0||h?{snapshot:new Sn(this.query,t.eu,i,o,t.mutatedKeys,c===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),_u:u}:{_u:u}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new ch,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(t){return!this.Ha.has(t)&&!!this.eu.has(t)&&!this.eu.get(t).hasLocalMutations}su(t){t&&(t.addedDocuments.forEach(e=>this.Ha=this.Ha.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ha=this.Ha.delete(e)),this.current=t.current)}ou(){if(!this.current)return[];const t=this.Za;this.Za=K(),this.eu.forEach(n=>{this.au(n.key)&&(this.Za=this.Za.add(n.key))});const e=[];return t.forEach(n=>{this.Za.has(n)||e.push(new em(n))}),this.Za.forEach(n=>{t.has(n)||e.push(new tm(n))}),e}uu(t){this.Ha=t.qs,this.Za=K();const e=this.nu(t.documents);return this.applyChanges(e,!0)}cu(){return Sn.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Ze="SyncEngine";class ky{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class Ny{constructor(t){this.key=t,this.lu=!1}}class Oy{constructor(t,e,n,s,i,o){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new Ae(u=>Bd(u),ks),this.Tu=new Map,this.Iu=new Set,this.du=new ot(N.comparator),this.Eu=new Map,this.Au=new cu,this.Ru={},this.Vu=new Map,this.mu=bn.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function Fy(r,t,e=!0){const n=go(r);let s;const i=n.Pu.get(t);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.cu()):s=await rm(n,t,e,!0),s}async function My(r,t){const e=go(r);await rm(e,t,!0,!1)}async function rm(r,t,e,n){const s=await dr(r.localStore,Mt(t)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,e);let u;return n&&(u=await bu(r,t,i,o==="current",s.resumeToken)),r.isPrimaryClient&&e&&po(r.remoteStore,s),u}async function bu(r,t,e,n,s){r.gu=(m,g,w)=>async function(x,C,L,q){let M=C.view.nu(L);M.Ds&&(M=await Gi(x.localStore,C.query,!1).then(({documents:I})=>C.view.nu(I,M)));const z=q&&q.targetChanges.get(C.targetId),H=q&&q.targetMismatches.get(C.targetId)!=null,$=C.view.applyChanges(M,x.isPrimaryClient,z,H);return Na(x,C.targetId,$._u),$.snapshot}(r,m,g,w);const i=await Gi(r.localStore,t,!0),o=new nm(t,i.qs),u=o.nu(i.documents),c=Ms.createSynthesizedTargetChangeForCurrentChange(e,n&&r.onlineState!=="Offline",s),h=o.applyChanges(u,r.isPrimaryClient,c);Na(r,e,h._u);const f=new ky(t,e,o);return r.Pu.set(t,f),r.Tu.has(e)?r.Tu.get(e).push(t):r.Tu.set(e,[t]),h.snapshot}async function Ly(r,t,e){const n=O(r),s=n.Pu.get(t),i=n.Tu.get(s.targetId);if(i.length>1)return n.Tu.set(s.targetId,i.filter(o=>!ks(o,t))),void n.Pu.delete(t);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await fr(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),e&&mr(n.remoteStore,s.targetId),pr(n,s.targetId)}).catch(He)):(pr(n,s.targetId),await fr(n.localStore,s.targetId,!0))}async function Uy(r,t){const e=O(r),n=e.Pu.get(t),s=e.Tu.get(n.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),mr(e.remoteStore,n.targetId))}async function qy(r,t,e){const n=Cu(r);try{const s=await function(o,u){const c=O(o),h=tt.now(),f=u.reduce((w,S)=>w.add(S.key),K());let m,g;return c.persistence.runTransaction("Locally write mutations","readwrite",w=>{let S=Kt(),x=K();return c.Os.getEntries(w,f).next(C=>{S=C,S.forEach((L,q)=>{q.isValidDocument()||(x=x.add(L))})}).next(()=>c.localDocuments.getOverlayedDocuments(w,S)).next(C=>{m=C;const L=[];for(const q of u){const M=h_(q,m.get(q.key).overlayedDocument);M!=null&&L.push(new Re(q.key,M,Cd(M.value.mapValue),dt.exists(!0)))}return c.mutationQueue.addMutationBatch(w,h,L,u)}).next(C=>{g=C;const L=C.applyToLocalDocumentSet(m,x);return c.documentOverlayCache.saveOverlays(w,C.batchId,L)})}).then(()=>({batchId:g.batchId,changes:$d(m)}))}(n.localStore,t);n.sharedClientState.addPendingMutation(s.batchId),function(o,u,c){let h=o.Ru[o.currentUser.toKey()];h||(h=new ot(G)),h=h.insert(u,c),o.Ru[o.currentUser.toKey()]=h}(n,s.batchId,e),await be(n,s.changes),await Ar(n.remoteStore)}catch(s){const i=br(s,"Failed to persist write");e.reject(i)}}async function sm(r,t){const e=O(r);try{const n=await sy(e.localStore,t);t.targetChanges.forEach((s,i)=>{const o=e.Eu.get(i);o&&(B(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.lu=!0:s.modifiedDocuments.size>0?B(o.lu,14607):s.removedDocuments.size>0&&(B(o.lu,42227),o.lu=!1))}),await be(e,n,t)}catch(n){await He(n)}}function fh(r,t,e){const n=O(r);if(n.isPrimaryClient&&e===0||!n.isPrimaryClient&&e===1){const s=[];n.Pu.forEach((i,o)=>{const u=o.view.va(t);u.snapshot&&s.push(u.snapshot)}),function(o,u){const c=O(o);c.onlineState=u;let h=!1;c.queries.forEach((f,m)=>{for(const g of m.wa)g.va(u)&&(h=!0)}),h&&vu(c)}(n.eventManager,t),s.length&&n.hu.J_(s),n.onlineState=t,n.isPrimaryClient&&n.sharedClientState.setOnlineState(t)}}async function By(r,t,e){const n=O(r);n.sharedClientState.updateQueryState(t,"rejected",e);const s=n.Eu.get(t),i=s&&s.key;if(i){let o=new ot(N.comparator);o=o.insert(i,ct.newNoDocument(i,j.min()));const u=K().add(i),c=new Fs(j.min(),new Map,new ot(G),o,u);await sm(n,c),n.du=n.du.remove(i),n.Eu.delete(t),Vu(n)}else await fr(n.localStore,t,!1).then(()=>pr(n,t,e)).catch(He)}async function jy(r,t){const e=O(r),n=t.batch.batchId;try{const s=await ry(e.localStore,t);Su(e,n,null),Pu(e,n),e.sharedClientState.updateMutationState(n,"acknowledged"),await be(e,s)}catch(s){await He(s)}}async function zy(r,t,e){const n=O(r);try{const s=await function(o,u){const c=O(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return c.mutationQueue.lookupMutationBatch(h,u).next(m=>(B(m!==null,37113),f=m.keys(),c.mutationQueue.removeMutationBatch(h,m))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,f,u)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>c.localDocuments.getDocuments(h,f))})}(n.localStore,t);Su(n,t,e),Pu(n,t),n.sharedClientState.updateMutationState(t,"rejected",e),await be(n,s)}catch(s){await He(s)}}async function Gy(r,t){const e=O(r);Ye(e.remoteStore)||k(Ze,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await function(o){const u=O(o);return u.persistence.runTransaction("Get highest unacknowledged batch id","readonly",c=>u.mutationQueue.getHighestUnacknowledgedBatchId(c))}(e.localStore);if(n===qe)return void t.resolve();const s=e.Vu.get(n)||[];s.push(t),e.Vu.set(n,s)}catch(n){const s=br(n,"Initialization of waitForPendingWrites() operation failed");t.reject(s)}}function Pu(r,t){(r.Vu.get(t)||[]).forEach(e=>{e.resolve()}),r.Vu.delete(t)}function Su(r,t,e){const n=O(r);let s=n.Ru[n.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),n.Ru[n.currentUser.toKey()]=s}}function pr(r,t,e=null){r.sharedClientState.removeLocalQueryTarget(t);for(const n of r.Tu.get(t))r.Pu.delete(n),e&&r.hu.pu(n,e);r.Tu.delete(t),r.isPrimaryClient&&r.Au.zr(t).forEach(n=>{r.Au.containsKey(n)||im(r,n)})}function im(r,t){r.Iu.delete(t.path.canonicalString());const e=r.du.get(t);e!==null&&(mr(r.remoteStore,e),r.du=r.du.remove(t),r.Eu.delete(e),Vu(r))}function Na(r,t,e){for(const n of e)n instanceof tm?(r.Au.addReference(n.key,t),$y(r,n)):n instanceof em?(k(Ze,"Document no longer in limbo: "+n.key),r.Au.removeReference(n.key,t),r.Au.containsKey(n.key)||im(r,n.key)):U(19791,{yu:n})}function $y(r,t){const e=t.key,n=e.path.canonicalString();r.du.get(e)||r.Iu.has(n)||(k(Ze,"New document in limbo: "+e),r.Iu.add(n),Vu(r))}function Vu(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const t=r.Iu.values().next().value;r.Iu.delete(t);const e=new N(Q.fromString(t)),n=r.mu.next();r.Eu.set(n,new Ny(e)),r.du=r.du.insert(e,n),po(r.remoteStore,new Te(Mt(Ir(e.path)),n,"TargetPurposeLimboResolution",Gt.ue))}}async function be(r,t,e){const n=O(r),s=[],i=[],o=[];n.Pu.isEmpty()||(n.Pu.forEach((u,c)=>{o.push(n.gu(c,t,e).then(h=>{var f;if((h||e)&&n.isPrimaryClient){const m=h?!h.fromCache:(f=e?.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;n.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(h){s.push(h);const m=fu.Es(c.targetId,h);i.push(m)}}))}),await Promise.all(o),n.hu.J_(s),await async function(c,h){const f=O(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>A.forEach(h,g=>A.forEach(g.Is,w=>f.persistence.referenceDelegate.addReference(m,g.targetId,w)).next(()=>A.forEach(g.ds,w=>f.persistence.referenceDelegate.removeReference(m,g.targetId,w)))))}catch(m){if(!Xe(m))throw m;k(mu,"Failed to update sequence numbers: "+m)}for(const m of h){const g=m.targetId;if(!m.fromCache){const w=f.Fs.get(g),S=w.snapshotVersion,x=w.withLastLimboFreeSnapshotVersion(S);f.Fs=f.Fs.insert(g,x)}}}(n.localStore,i))}async function Ky(r,t){const e=O(r);if(!e.currentUser.isEqual(t)){k(Ze,"User change. New user:",t.toKey());const n=await Of(e.localStore,t);e.currentUser=t,function(i,o){i.Vu.forEach(u=>{u.forEach(c=>{c.reject(new D(b.CANCELLED,o))})}),i.Vu.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,n.removedBatchIds,n.addedBatchIds),await be(e,n.Bs)}}function Qy(r,t){const e=O(r),n=e.Eu.get(t);if(n&&n.lu)return K().add(n.key);{let s=K();const i=e.Tu.get(t);if(!i)return s;for(const o of i){const u=e.Pu.get(o);s=s.unionWith(u.view.tu)}return s}}async function Wy(r,t){const e=O(r),n=await Gi(e.localStore,t.query,!0),s=t.view.uu(n);return e.isPrimaryClient&&Na(e,t.targetId,s._u),s}async function Hy(r,t){const e=O(r);return Uf(e.localStore,t).then(n=>be(e,n))}async function Xy(r,t,e,n){const s=O(r),i=await function(u,c){const h=O(u),f=O(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",m=>f.Xn(m,c).next(g=>g?h.localDocuments.getDocuments(m,g):A.resolve(null)))}(s.localStore,t);i!==null?(e==="pending"?await Ar(s.remoteStore):e==="acknowledged"||e==="rejected"?(Su(s,t,n||null),Pu(s,t),function(u,c){O(O(u).mutationQueue).rr(c)}(s.localStore,t)):U(6720,"Unknown batchState",{wu:e}),await be(s,i)):k(Ze,"Cannot apply mutation batch with id: "+t)}async function Jy(r,t){const e=O(r);if(go(e),Cu(e),t===!0&&e.fu!==!0){const n=e.sharedClientState.getAllActiveQueryTargets(),s=await mh(e,n.toArray());e.fu=!0,await Da(e.remoteStore,!0);for(const i of s)po(e.remoteStore,i)}else if(t===!1&&e.fu!==!1){const n=[];let s=Promise.resolve();e.Tu.forEach((i,o)=>{e.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then(()=>(pr(e,o),fr(e.localStore,o,!0))),mr(e.remoteStore,o)}),await s,await mh(e,n),function(o){const u=O(o);u.Eu.forEach((c,h)=>{mr(u.remoteStore,h)}),u.Au.jr(),u.Eu=new Map,u.du=new ot(N.comparator)}(e),e.fu=!1,await Da(e.remoteStore,!1)}}async function mh(r,t,e){const n=O(r),s=[],i=[];for(const o of t){let u;const c=n.Tu.get(o);if(c&&c.length!==0){u=await dr(n.localStore,Mt(c[0]));for(const h of c){const f=n.Pu.get(h),m=await Wy(n,f);m.snapshot&&i.push(m.snapshot)}}else{const h=await Lf(n.localStore,o);u=await dr(n.localStore,h),await bu(n,om(h),o,!1,u.resumeToken)}s.push(u)}return n.hu.J_(i),s}function om(r){return Ld(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function Yy(r){return function(e){return O(O(e).persistence).Ps()}(O(r).localStore)}async function Zy(r,t,e,n){const s=O(r);if(s.fu)return void k(Ze,"Ignoring unexpected query state notification.");const i=s.Tu.get(t);if(i&&i.length>0)switch(e){case"current":case"not-current":{const o=await Uf(s.localStore,jd(i[0])),u=Fs.createSynthesizedRemoteEventForCurrentChange(t,e==="current",pt.EMPTY_BYTE_STRING);await be(s,o,u);break}case"rejected":await fr(s.localStore,t,!0),pr(s,t,n);break;default:U(64155,e)}}async function tT(r,t,e){const n=go(r);if(n.fu){for(const s of t){if(n.Tu.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){k(Ze,"Adding an already active target "+s);continue}const i=await Lf(n.localStore,s),o=await dr(n.localStore,i);await bu(n,om(i),o.targetId,!1,o.resumeToken),po(n.remoteStore,o)}for(const s of e)n.Tu.has(s)&&await fr(n.localStore,s,!1).then(()=>{mr(n.remoteStore,s),pr(n,s)}).catch(He)}}function go(r){const t=O(r);return t.remoteStore.remoteSyncer.applyRemoteEvent=sm.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Qy.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=By.bind(null,t),t.hu.J_=xy.bind(null,t.eventManager),t.hu.pu=Dy.bind(null,t.eventManager),t}function Cu(r){const t=O(r);return t.remoteStore.remoteSyncer.applySuccessfulWrite=jy.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=zy.bind(null,t),t}function eT(r,t,e){const n=O(r);(async function(i,o,u){try{const c=await o.getMetadata();if(await function(w,S){const x=O(w),C=yt(S.createTime);return x.persistence.runTransaction("hasNewerBundle","readonly",L=>x.Ti.getBundleMetadata(L,S.id)).then(L=>!!L&&L.createTime.compareTo(C)>=0)}(i.localStore,c))return await o.close(),u._completeWith(function(w){return{taskState:"Success",documentsLoaded:w.totalDocuments,bytesLoaded:w.totalBytes,totalDocuments:w.totalDocuments,totalBytes:w.totalBytes}}(c)),Promise.resolve(new Set);u._updateProgress(Zf(c));const h=new Ru(c,o.serializer);let f=await o.Su();for(;f;){const g=await h.Wa(f);g&&u._updateProgress(g),f=await o.Su()}const m=await h.za(i.localStore);return await be(i,m.Ja,void 0),await function(w,S){const x=O(w);return x.persistence.runTransaction("Save bundle","readwrite",C=>x.Ti.saveBundleMetadata(C,S))}(i.localStore,c),u._completeWith(m.progress),Promise.resolve(m.ja)}catch(c){return Lt(Ze,`Loading bundle failed with ${c}`),u._failWith(c),Promise.resolve(new Set)}})(n,t,e).then(s=>{n.sharedClientState.notifyBundleLoaded(s)})}class gr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=xn(t.databaseInfo.databaseId),this.sharedClientState=this.bu(t),this.persistence=this.Du(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Cu(t,this.localStore),this.indexBackfillerScheduler=this.Fu(t,this.localStore)}Cu(t,e){return null}Fu(t,e){return null}vu(t){return Nf(this.persistence,new kf,t.initialUser,this.serializer)}Du(t){return new lu(mo.Vi,this.serializer)}bu(t){return new Gf}async terminate(){var t,e;(t=this.gcScheduler)===null||t===void 0||t.stop(),(e=this.indexBackfillerScheduler)===null||e===void 0||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}gr.provider={build:()=>new gr};class xu extends gr{constructor(t){super(),this.cacheSizeBytes=t}Cu(t,e){B(this.persistence.referenceDelegate instanceof zi,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Pf(n,t.asyncQueue,e)}Du(t){const e=this.cacheSizeBytes!==void 0?Nt.withCacheSize(this.cacheSizeBytes):Nt.DEFAULT;return new lu(n=>zi.Vi(n,e),this.serializer)}}class Du extends gr{constructor(t,e,n){super(),this.Mu=t,this.cacheSizeBytes=e,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(t){await super.initialize(t),await this.Mu.initialize(this,t),await Cu(this.Mu.syncEngine),await Ar(this.Mu.remoteStore),await this.persistence.ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(t){return Nf(this.persistence,new kf,t.initialUser,this.serializer)}Cu(t,e){const n=this.persistence.referenceDelegate.garbageCollector;return new Pf(n,t.asyncQueue,e)}Fu(t,e){const n=new pg(e,this.persistence);return new mg(t.asyncQueue,n)}Du(t){const e=du(t.databaseInfo.databaseId,t.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Nt.withCacheSize(this.cacheSizeBytes):Nt.DEFAULT;return new hu(this.synchronizeTabs,e,t.clientId,n,t.asyncQueue,$f(),Ci(),this.serializer,this.sharedClientState,!!this.forceOwnership)}bu(t){return new Gf}}class am extends Du{constructor(t,e){super(t,e,!1),this.Mu=t,this.cacheSizeBytes=e,this.synchronizeTabs=!0}async initialize(t){await super.initialize(t);const e=this.Mu.syncEngine;this.sharedClientState instanceof na&&(this.sharedClientState.syncEngine={Do:Xy.bind(null,e),vo:Zy.bind(null,e),Co:tT.bind(null,e),Ps:Yy.bind(null,e),bo:Hy.bind(null,e)},await this.sharedClientState.start()),await this.persistence.ji(async n=>{await Jy(this.Mu.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())})}bu(t){const e=$f();if(!na.C(e))throw new D(b.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=du(t.databaseInfo.databaseId,t.databaseInfo.persistenceKey);return new na(e,t.asyncQueue,n,t.clientId,t.initialUser)}}class Qe{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>fh(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=Ky.bind(null,this.syncEngine),await Da(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new Cy}()}createDatastore(t){const e=xn(t.databaseInfo.databaseId),n=function(i){return new dy(i)}(t.databaseInfo);return function(i,o,u,c){return new gy(i,o,u,c)}(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return function(n,s,i,o,u){return new yy(n,s,i,o,u)}(this.localStore,this.datastore,t.asyncQueue,e=>fh(this.syncEngine,e,0),function(){return oh.C()?new oh:new uy}())}createSyncEngine(t,e){return function(s,i,o,u,c,h,f){const m=new Oy(s,i,o,u,c,h);return f&&(m.fu=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const i=O(s);k(Pn,"RemoteStore shutting down."),i.Ia.add(5),await vr(i),i.Ea.shutdown(),i.Aa.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(e=this.eventManager)===null||e===void 0||e.terminate()}}Qe.provider={build:()=>new Qe};function ph(r,t=10240){let e=0;return{async read(){if(e<r.byteLength){const n={value:r.slice(e,e+t),done:!1};return e+=t,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _o{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.xu(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.xu(this.observer.error,t):_t("Uncaught Error in snapshot listener:",t.toString()))}Ou(){this.muted=!0}xu(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nT{constructor(t,e){this.Nu=t,this.serializer=e,this.metadata=new Rt,this.buffer=new Uint8Array,this.Bu=function(){return new TextDecoder("utf-8")}(),this.Lu().then(n=>{n&&n.Qa()?this.metadata.resolve(n.qa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n?.qa)}`))},n=>this.metadata.reject(n))}close(){return this.Nu.cancel()}async getMetadata(){return this.metadata.promise}async Su(){return await this.getMetadata(),this.Lu()}async Lu(){const t=await this.ku();if(t===null)return null;const e=this.Bu.decode(t),n=Number(e);isNaN(n)&&this.qu(`length string (${e}) is not valid number`);const s=await this.Qu(n);return new Yf(JSON.parse(s),t.length+n)}$u(){return this.buffer.findIndex(t=>t===123)}async ku(){for(;this.$u()<0&&!await this.Uu(););if(this.buffer.length===0)return null;const t=this.$u();t<0&&this.qu("Reached the end of bundle when a length string is expected.");const e=this.buffer.slice(0,t);return this.buffer=this.buffer.slice(t),e}async Qu(t){for(;this.buffer.length<t;)await this.Uu()&&this.qu("Reached the end of bundle when more is expected.");const e=this.Bu.decode(this.buffer.slice(0,t));return this.buffer=this.buffer.slice(t),e}qu(t){throw this.Nu.cancel(),new Error(`Invalid bundle format: ${t}`)}async Uu(){const t=await this.Nu.read();if(!t.done){const e=new Uint8Array(this.buffer.length+t.value.length);e.set(this.buffer),e.set(t.value,this.buffer.length),this.buffer=e}return t.done}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rT{constructor(t,e){this.bundleData=t,this.serializer=e,this.cursor=0,this.elements=[];let n=this.Su();if(!n||!n.Qa())throw new Error(`The first element of the bundle is not a metadata object, it is
         ${JSON.stringify(n?.qa)}`);this.metadata=n;do n=this.Su(),n!==null&&this.elements.push(n);while(n!==null)}getMetadata(){return this.metadata}Ku(){return this.elements}Su(){if(this.cursor===this.bundleData.length)return null;const t=this.ku(),e=this.Qu(t);return new Yf(JSON.parse(e),t)}Qu(t){if(this.cursor+t>this.bundleData.length)throw new D(b.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=t)}ku(){const t=this.cursor;let e=this.cursor;for(;e<this.bundleData.length;){if(this.bundleData[e]==="{"){if(e===t)throw new Error("First character is a bracket and not a number");return this.cursor=e,Number(this.bundleData.slice(t,e))}e++}throw new Error("Reached the end of bundle when more is expected.")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(t){this.datastore=t,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(t){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new D(b.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const e=await async function(s,i){const o=O(s),u={documents:i.map(m=>As(o.serializer,m))},c=await o.Jo("BatchGetDocuments",o.serializer.databaseId,Q.emptyPath(),u,i.length),h=new Map;c.forEach(m=>{const g=I_(o.serializer,m);h.set(g.key.toString(),g)});const f=[];return i.forEach(m=>{const g=h.get(m.toString());B(!!g,55234,{key:m}),f.push(g)}),f}(this.datastore,t);return e.forEach(n=>this.recordVersion(n)),e}set(t,e){this.write(e.toMutation(t,this.precondition(t))),this.writtenDocs.add(t.toString())}update(t,e){try{this.write(e.toMutation(t,this.preconditionForUpdate(t)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(t.toString())}delete(t){this.write(new wr(t,this.precondition(t))),this.writtenDocs.add(t.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const t=this.readVersions;this.mutations.forEach(e=>{t.delete(e.key.toString())}),t.forEach((e,n)=>{const s=N.fromPath(n);this.mutations.push(new eu(s,this.precondition(s)))}),await async function(n,s){const i=O(n),o={writes:s.map(u=>Rs(i.serializer,u))};await i.Wo("Commit",i.serializer.databaseId,Q.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(t){let e;if(t.isFoundDocument())e=t.version;else{if(!t.isNoDocument())throw U(50498,{Wu:t.constructor.name});e=j.min()}const n=this.readVersions.get(t.key.toString());if(n){if(!e.isEqual(n))throw new D(b.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(t.key.toString(),e)}precondition(t){const e=this.readVersions.get(t.toString());return!this.writtenDocs.has(t.toString())&&e?e.isEqual(j.min())?dt.exists(!1):dt.updateTime(e):dt.none()}preconditionForUpdate(t){const e=this.readVersions.get(t.toString());if(!this.writtenDocs.has(t.toString())&&e){if(e.isEqual(j.min()))throw new D(b.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return dt.updateTime(e)}return dt.exists(!0)}write(t){this.ensureCommitNotCalled(),this.mutations.push(t)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iT{constructor(t,e,n,s,i){this.asyncQueue=t,this.datastore=e,this.options=n,this.updateFunction=s,this.deferred=i,this.Gu=n.maxAttempts,this.F_=new gu(this.asyncQueue,"transaction_retry")}zu(){this.Gu-=1,this.ju()}ju(){this.F_.g_(async()=>{const t=new sT(this.datastore),e=this.Ju(t);e&&e.then(n=>{this.asyncQueue.enqueueAndForget(()=>t.commit().then(()=>{this.deferred.resolve(n)}).catch(s=>{this.Hu(s)}))}).catch(n=>{this.Hu(n)})})}Ju(t){try{const e=this.updateFunction(t);return!Cs(e)&&e.catch&&e.then?e:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}Hu(t){this.Gu>0&&this.Yu(t)?(this.Gu-=1,this.asyncQueue.enqueueAndForget(()=>(this.ju(),Promise.resolve()))):this.deferred.reject(t)}Yu(t){if(t.name==="FirebaseError"){const e=t.code;return e==="aborted"||e==="failed-precondition"||e==="already-exists"||!nf(e)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We="FirestoreClient";class oT{constructor(t,e,n,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this.databaseInfo=s,this.user=At.UNAUTHENTICATED,this.clientId=Ji.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async o=>{k(We,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(n,o=>(k(We,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Rt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=br(e,"Failed to shutdown persistence");t.reject(n)}}),t.promise}}async function sa(r,t){r.asyncQueue.verifyOperationInProgress(),k(We,"Initializing OfflineComponentProvider");const e=r.configuration;await t.initialize(e);let n=e.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await Of(t.localStore,s),n=s)}),t.persistence.setDatabaseDeletedListener(()=>{Lt("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then(()=>{k("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(s=>{Lt("Terminating Firestore due to IndexedDb database deletion failed",s)})}),r._offlineComponents=t}async function gh(r,t){r.asyncQueue.verifyOperationInProgress();const e=await ku(r);k(We,"Initializing OnlineComponentProvider"),await t.initialize(e,r.configuration),r.setCredentialChangeListener(n=>uh(t.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>uh(t.remoteStore,s)),r._onlineComponents=t}async function ku(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){k(We,"Using user provided OfflineComponentProvider");try{await sa(r,r._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===b.FAILED_PRECONDITION||s.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;Lt("Error using user provided cache. Falling back to memory cache: "+e),await sa(r,new gr)}}else k(We,"Using default OfflineComponentProvider"),await sa(r,new xu(void 0));return r._offlineComponents}async function yo(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(k(We,"Using user provided OnlineComponentProvider"),await gh(r,r._uninitializedComponentsProvider._online)):(k(We,"Using default OnlineComponentProvider"),await gh(r,new Qe))),r._onlineComponents}function um(r){return ku(r).then(t=>t.persistence)}function Pr(r){return ku(r).then(t=>t.localStore)}function cm(r){return yo(r).then(t=>t.remoteStore)}function Nu(r){return yo(r).then(t=>t.syncEngine)}function lm(r){return yo(r).then(t=>t.datastore)}async function _r(r){const t=await yo(r),e=t.eventManager;return e.onListen=Fy.bind(null,t.syncEngine),e.onUnlisten=Ly.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=My.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Uy.bind(null,t.syncEngine),e}function aT(r){return r.asyncQueue.enqueue(async()=>{const t=await um(r),e=await cm(r);return t.setNetworkEnabled(!0),function(s){const i=O(s);return i.Ia.delete(0),Ls(i)}(e)})}function uT(r){return r.asyncQueue.enqueue(async()=>{const t=await um(r),e=await cm(r);return t.setNetworkEnabled(!1),async function(s){const i=O(s);i.Ia.add(0),await vr(i),i.Aa.set("Offline")}(e)})}function cT(r,t){const e=new Rt;return r.asyncQueue.enqueueAndForget(async()=>async function(s,i,o){try{const u=await function(h,f){const m=O(h);return m.persistence.runTransaction("read document","readonly",g=>m.localDocuments.getDocument(g,f))}(s,i);u.isFoundDocument()?o.resolve(u):u.isNoDocument()?o.resolve(null):o.reject(new D(b.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(u){const c=br(u,`Failed to get document '${i} from cache`);o.reject(c)}}(await Pr(r),t,e)),e.promise}function hm(r,t,e={}){const n=new Rt;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,u,c,h){const f=new _o({next:g=>{f.Ou(),o.enqueueAndForget(()=>wu(i,m));const w=g.docs.has(u);!w&&g.fromCache?h.reject(new D(b.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&g.fromCache&&c&&c.source==="server"?h.reject(new D(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(g)},error:g=>h.reject(g)}),m=new Au(Ir(u.path),f,{includeMetadataChanges:!0,ka:!0});return Eu(i,m)}(await _r(r),r.asyncQueue,t,e,n)),n.promise}function lT(r,t){const e=new Rt;return r.asyncQueue.enqueueAndForget(async()=>async function(s,i,o){try{const u=await Gi(s,i,!0),c=new nm(i,u.qs),h=c.nu(u.documents),f=c.applyChanges(h,!1);o.resolve(f.snapshot)}catch(u){const c=br(u,`Failed to execute query '${i} against cache`);o.reject(c)}}(await Pr(r),t,e)),e.promise}function dm(r,t,e={}){const n=new Rt;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,u,c,h){const f=new _o({next:g=>{f.Ou(),o.enqueueAndForget(()=>wu(i,m)),g.fromCache&&c.source==="server"?h.reject(new D(b.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(g)},error:g=>h.reject(g)}),m=new Au(u,f,{includeMetadataChanges:!0,ka:!0});return Eu(i,m)}(await _r(r),r.asyncQueue,t,e,n)),n.promise}function hT(r,t,e){const n=new Rt;return r.asyncQueue.enqueueAndForget(async()=>{try{const s=await lm(r);n.resolve(async function(o,u,c){var h;const f=O(o),{request:m,ft:g,parent:w}=ff(f.serializer,Ud(u),c);f.connection.Qo||delete m.parent;const S=(await f.Jo("RunAggregationQuery",f.serializer.databaseId,w,m,1)).filter(C=>!!C.result);B(S.length===1,64727);const x=(h=S[0].result)===null||h===void 0?void 0:h.aggregateFields;return Object.keys(x).reduce((C,L)=>(C[g[L]]=x[L],C),{})}(s,t,e))}catch(s){n.reject(s)}}),n.promise}function dT(r,t){const e=new _o(t);return r.asyncQueue.enqueueAndForget(async()=>function(s,i){O(s).Da.add(i),i.next()}(await _r(r),e)),()=>{e.Ou(),r.asyncQueue.enqueueAndForget(async()=>function(s,i){O(s).Da.delete(i)}(await _r(r),e))}}function fT(r,t,e,n){const s=function(o,u){let c;return c=typeof o=="string"?Ba().encode(o):o,function(f,m){return new nT(f,m)}(function(f,m){if(f instanceof Uint8Array)return ph(f,m);if(f instanceof ArrayBuffer)return ph(new Uint8Array(f),m);if(f instanceof ReadableStream)return f.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(c),u)}(e,xn(t));r.asyncQueue.enqueueAndForget(async()=>{eT(await Nu(r),s,n)})}function mT(r,t){return r.asyncQueue.enqueue(async()=>function(n,s){const i=O(n);return i.persistence.runTransaction("Get named query","readonly",o=>i.Ti.getNamedQuery(o,s))}(await Pr(r),t))}function fm(r,t){return function(n,s){return new rT(n,s)}(r,t)}function pT(r,t){return r.asyncQueue.enqueue(async()=>async function(n,s){const i=O(n),o=i.indexManager,u=[];return i.persistence.runTransaction("Configure indexes","readwrite",c=>o.getFieldIndexes(c).next(h=>function(m,g,w,S,x){m=[...m],g=[...g],m.sort(w),g.sort(w);const C=m.length,L=g.length;let q=0,M=0;for(;q<L&&M<C;){const z=w(m[M],g[q]);z<0?x(m[M++]):z>0?S(g[q++]):(q++,M++)}for(;q<L;)S(g[q++]);for(;M<C;)x(m[M++])}(h,s,lg,f=>{u.push(o.addFieldIndex(c,f))},f=>{u.push(o.deleteFieldIndex(c,f))})).next(()=>A.waitFor(u)))}(await Pr(r),t))}function gT(r,t){return r.asyncQueue.enqueue(async()=>function(n,s){O(n).Cs.Rs=s}(await Pr(r),t))}function _T(r){return r.asyncQueue.enqueue(async()=>function(e){const n=O(e),s=n.indexManager;return n.persistence.runTransaction("Delete All Indexes","readwrite",i=>s.deleteAllFieldIndexes(i))}(await Pr(r)))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mm(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm="firestore.googleapis.com",yh=!0;class Th{constructor(t){var e,n;if(t.host===void 0){if(t.ssl!==void 0)throw new D(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=pm,this.ssl=yh}else this.host=t.host,this.ssl=(e=t.ssl)!==null&&e!==void 0?e:yh;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=wf;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<bf)throw new D(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}ed("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=mm((n=t.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Us{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Th({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new D(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Th(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new Zh;switch(n.type){case"firstParty":return new sg(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new D(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const n=_h.get(e);n&&(k("ComponentProvider","Removing Datastore"),_h.delete(e),n.terminate())}(this),Promise.resolve()}}function gm(r,t,e,n={}){var s;r=W(r,Us);const i=Vs(t),o=r._getSettings(),u=Object.assign(Object.assign({},o),{emulatorOptions:r._getEmulatorOptions()}),c=`${t}:${e}`;i&&(Ua(`https://${c}`),Mh("Firestore",!0)),o.host!==pm&&o.host!==c&&Lt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h=Object.assign(Object.assign({},o),{host:c,ssl:i,emulatorOptions:n});if(!Ss(h,u)&&(r._setSettings(h),n.mockUserToken)){let f,m;if(typeof n.mockUserToken=="string")f=n.mockUserToken,m=At.MOCK_USER;else{f=Lh(n.mockUserToken,(s=r._app)===null||s===void 0?void 0:s.options.projectId);const g=n.mockUserToken.sub||n.mockUserToken.user_id;if(!g)throw new D(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new At(g)}r._authCredentials=new eg(new Yh(f,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new Et(this.firestore,t,this._query)}}class nt{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new re(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new nt(this.firestore,t,this._key)}toJSON(){return{type:nt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(Cn(e,nt._jsonSchema))return new nt(t,n||null,new N(Q.fromString(e.referencePath)))}}nt._jsonSchemaVersion="firestore/documentReference/1.0",nt._jsonSchema={type:It("string",nt._jsonSchemaVersion),referencePath:It("string")};class re extends Et{constructor(t,e,n){super(t,e,Ir(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new nt(this.firestore,null,new N(t))}withConverter(t){return new re(this.firestore,t,this._path)}}function yT(r,t,...e){if(r=Z(r),ja("collection","path",t),r instanceof Us){const n=Q.fromString(t,...e);return al(n),new re(r,null,n)}{if(!(r instanceof nt||r instanceof re))throw new D(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Q.fromString(t,...e));return al(n),new re(r.firestore,null,n)}}function TT(r,t){if(r=W(r,Us),ja("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new D(b.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Et(r,null,function(n){return new ve(Q.emptyPath(),n)}(t))}function _m(r,t,...e){if(r=Z(r),arguments.length===1&&(t=Ji.newId()),ja("doc","path",t),r instanceof Us){const n=Q.fromString(t,...e);return ol(n),new nt(r,null,new N(n))}{if(!(r instanceof nt||r instanceof re))throw new D(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Q.fromString(t,...e));return ol(n),new nt(r.firestore,r instanceof re?r.converter:null,new N(n))}}function IT(r,t){return r=Z(r),t=Z(t),(r instanceof nt||r instanceof re)&&(t instanceof nt||t instanceof re)&&r.firestore===t.firestore&&r.path===t.path&&r.converter===t.converter}function Ou(r,t){return r=Z(r),t=Z(t),r instanceof Et&&t instanceof Et&&r.firestore===t.firestore&&ks(r._query,t._query)&&r.converter===t.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ih="AsyncQueue";class Eh{constructor(t=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new gu(this,"async_queue_retry"),this.oc=()=>{const n=Ci();n&&k(Ih,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this._c=t;const e=Ci();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.ac(),this.uc(t)}enterRestrictedMode(t){if(!this.Xu){this.Xu=!0,this.rc=t||!1;const e=Ci();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.oc)}}enqueue(t){if(this.ac(),this.Xu)return new Promise(()=>{});const e=new Rt;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Zu.push(t),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(t){if(!Xe(t))throw t;k(Ih,"Operation failed with retryable error: "+t)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(t){const e=this._c.then(()=>(this.nc=!0,t().catch(n=>{throw this.tc=n,this.nc=!1,_t("INTERNAL UNHANDLED ERROR: ",wh(n)),n}).then(n=>(this.nc=!1,n))));return this._c=e,e}enqueueAfterDelay(t,e,n){this.ac(),this.sc.indexOf(t)>-1&&(e=0);const s=Iu.createAndSchedule(this,t,e,n,i=>this.lc(i));return this.ec.push(s),s}ac(){this.tc&&U(47125,{hc:wh(this.tc)})}verifyOperationInProgress(){}async Pc(){let t;do t=this._c,await t;while(t!==this._c)}Tc(t){for(const e of this.ec)if(e.timerId===t)return!0;return!1}Ic(t){return this.Pc().then(()=>{this.ec.sort((e,n)=>e.targetTimeMs-n.targetTimeMs);for(const e of this.ec)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Pc()})}dc(t){this.sc.push(t)}lc(t){const e=this.ec.indexOf(t);this.ec.splice(e,1)}}function wh(r){let t=r.message||"";return r.stack&&(t=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jn(r){return function(e,n){if(typeof e!="object"||e===null)return!1;const s=e;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1}(r,["next","error","complete"])}class ym{constructor(){this._progressObserver={},this._taskCompletionResolver=new Rt,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(t,e,n){this._progressObserver={next:t,error:e,complete:n}}catch(t){return this._taskCompletionResolver.promise.catch(t)}then(t,e){return this._taskCompletionResolver.promise.then(t,e)}_completeWith(t){this._updateProgress(t),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(t)}_failWith(t){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(t),this._taskCompletionResolver.reject(t)}_updateProgress(t){this._lastProgress=t,this._progressObserver.next&&this._progressObserver.next(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ET=-1;class st extends Us{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new Eh,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Eh(t),this._firestoreClient=void 0,await t}}}function wT(r,t,e){e||(e=Is);const n=La(r,"firestore");if(n.isInitialized(e)){const s=n.getImmediate({identifier:e}),i=n.getOptions(e);if(Ss(i,t))return s;throw new D(b.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(t.cacheSizeBytes!==void 0&&t.localCache!==void 0)throw new D(b.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(t.cacheSizeBytes!==void 0&&t.cacheSizeBytes!==-1&&t.cacheSizeBytes<bf)throw new D(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&Vs(t.host)&&Ua(t.host),n.initialize({options:t,instanceIdentifier:e})}function vT(r,t){const e=typeof r=="object"?r:Nh(),n=typeof r=="string"?r:t||Is,s=La(e,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Oh("firestore");i&&gm(s,...i)}return s}function ft(r){if(r._terminated)throw new D(b.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Tm(r),r._firestoreClient}function Tm(r){var t,e,n;const s=r._freezeSettings(),i=function(u,c,h,f){return new Gg(u,c,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,mm(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)}(r._databaseId,((t=r._app)===null||t===void 0?void 0:t.options.appId)||"",r._persistenceKey,s);r._componentsProvider||!((e=s.localCache)===null||e===void 0)&&e._offlineComponentProvider&&(!((n=s.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),r._firestoreClient=new oT(r._authCredentials,r._appCheckCredentials,r._queue,i,r._componentsProvider&&function(u){const c=u?._online.build();return{_offline:u?._offline.build(c),_online:c}}(r._componentsProvider))}function AT(r,t){Lt("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();return Im(r,Qe.provider,{build:n=>new Du(n,e.cacheSizeBytes,t?.forceOwnership)}),Promise.resolve()}async function RT(r){Lt("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();Im(r,Qe.provider,{build:e=>new am(e,t.cacheSizeBytes)})}function Im(r,t,e){if((r=W(r,st))._firestoreClient||r._terminated)throw new D(b.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new D(b.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:t,_offline:e},Tm(r)}function bT(r){if(r._initialized&&!r._terminated)throw new D(b.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const t=new Rt;return r._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(n){if(!le.C())return Promise.resolve();const s=n+Df;await le.delete(s)}(du(r._databaseId,r._persistenceKey)),t.resolve()}catch(e){t.reject(e)}}),t.promise}function PT(r){return function(e){const n=new Rt;return e.asyncQueue.enqueueAndForget(async()=>Gy(await Nu(e),n)),n.promise}(ft(r=W(r,st)))}function ST(r){return aT(ft(r=W(r,st)))}function VT(r){return uT(ft(r=W(r,st)))}function CT(r){return Xp(r.app,"firestore",r._databaseId.database),r._delete()}function Oa(r,t){const e=ft(r=W(r,st)),n=new ym;return fT(e,r._databaseId,t,n),n}function Em(r,t){return mT(ft(r=W(r,st)),t).then(e=>e?new Et(r,null,e.query):null)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(t="count",e){this._internalFieldPath=e,this.type="AggregateField",this.aggregateType=t}}class wm{constructor(t,e,n){this._userDataWriter=e,this._data=n,this.type="AggregateQuerySnapshot",this.query=t}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new zt(pt.fromBase64String(t))}catch(e){throw new D(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new zt(pt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:zt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Cn(t,zt._jsonSchema))return zt.fromBase64String(t.bytes)}}zt._jsonSchemaVersion="firestore/bytes/1.0",zt._jsonSchema={type:It("string",zt._jsonSchemaVersion),bytes:It("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new D(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new lt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}function xT(){return new tn(ha)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new D(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new D(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return G(this._lat,t._lat)||G(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:se._jsonSchemaVersion}}static fromJSON(t){if(Cn(t,se._jsonSchema))return new se(t.latitude,t.longitude)}}se._jsonSchemaVersion="firestore/geoPoint/1.0",se._jsonSchema={type:It("string",se._jsonSchemaVersion),latitude:It("number"),longitude:It("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0}(this._values,t._values)}toJSON(){return{type:Zt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Cn(t,Zt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(e=>typeof e=="number"))return new Zt(t.vectorValues);throw new D(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Zt._jsonSchemaVersion="firestore/vectorValue/1.0",Zt._jsonSchema={type:It("string",Zt._jsonSchemaVersion),vectorValues:It("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DT=/^__.*__$/;class kT{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return this.fieldMask!==null?new Re(t,this.data,this.fieldMask,e,this.fieldTransforms):new Er(t,this.data,e,this.fieldTransforms)}}class vm{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new Re(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Am(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw U(40011,{Ec:r})}}class To{constructor(t,e,n,s,i,o){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.Ac(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(t){return new To(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(t){var e;const n=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Rc({path:n,mc:!1});return s.fc(t),s}gc(t){var e;const n=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Rc({path:n,mc:!1});return s.Ac(),s}yc(t){return this.Rc({path:void 0,mc:!0})}wc(t){return Wi(t,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}Ac(){if(this.path)for(let t=0;t<this.path.length;t++)this.fc(this.path.get(t))}fc(t){if(t.length===0)throw this.wc("Document fields must not be empty");if(Am(this.Ec)&&DT.test(t))throw this.wc('Document fields cannot begin and end with "__"')}}class NT{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||xn(t)}Dc(t,e,n,s=!1){return new To({Ec:t,methodName:e,bc:n,path:lt.emptyPath(),mc:!1,Sc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Dn(r){const t=r._freezeSettings(),e=xn(r._databaseId);return new NT(r._databaseId,!!t.ignoreUndefinedProperties,e)}function Io(r,t,e,n,s,i={}){const o=r.Dc(i.merge||i.mergeFields?2:0,t,e,s);ju("Data must be an object, but it was:",o,n);const u=Pm(n,o);let c,h;if(i.merge)c=new $t(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const g=bs(t,m,e);if(!o.contains(g))throw new D(b.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Vm(f,g)||f.push(g)}c=new $t(f),h=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,h=o.fieldTransforms;return new kT(new St(u),c,h)}class qs extends en{_toFieldTransform(t){if(t.Ec!==2)throw t.Ec===1?t.wc(`${this._methodName}() can only appear at the top level of your update data`):t.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof qs}}function Rm(r,t,e){return new To({Ec:3,bc:t.settings.bc,methodName:r._methodName,mc:e},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class Fu extends en{_toFieldTransform(t){return new Os(t.path,new cr)}isEqual(t){return t instanceof Fu}}class Mu extends en{constructor(t,e){super(t),this.vc=e}_toFieldTransform(t){const e=Rm(this,t,!0),n=this.vc.map(i=>kn(i,e)),s=new wn(n);return new Os(t.path,s)}isEqual(t){return t instanceof Mu&&Ss(this.vc,t.vc)}}class Lu extends en{constructor(t,e){super(t),this.vc=e}_toFieldTransform(t){const e=Rm(this,t,!0),n=this.vc.map(i=>kn(i,e)),s=new vn(n);return new Os(t.path,s)}isEqual(t){return t instanceof Lu&&Ss(this.vc,t.vc)}}class Uu extends en{constructor(t,e){super(t),this.Cc=e}_toFieldTransform(t){const e=new lr(t.serializer,Wd(t.serializer,this.Cc));return new Os(t.path,e)}isEqual(t){return t instanceof Uu&&this.Cc===t.Cc}}function qu(r,t,e,n){const s=r.Dc(1,t,e);ju("Data must be an object, but it was:",s,n);const i=[],o=St.empty();Je(n,(c,h)=>{const f=Eo(t,c,e);h=Z(h);const m=s.gc(f);if(h instanceof qs)i.push(f);else{const g=kn(h,m);g!=null&&(i.push(f),o.set(f,g))}});const u=new $t(i);return new vm(o,u,s.fieldTransforms)}function Bu(r,t,e,n,s,i){const o=r.Dc(1,t,e),u=[bs(t,n,e)],c=[s];if(i.length%2!=0)throw new D(b.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)u.push(bs(t,i[g])),c.push(i[g+1]);const h=[],f=St.empty();for(let g=u.length-1;g>=0;--g)if(!Vm(h,u[g])){const w=u[g];let S=c[g];S=Z(S);const x=o.gc(w);if(S instanceof qs)h.push(w);else{const C=kn(S,x);C!=null&&(h.push(w),f.set(w,C))}}const m=new $t(h);return new vm(f,m,o.fieldTransforms)}function bm(r,t,e,n=!1){return kn(e,r.Dc(n?4:3,t))}function kn(r,t){if(Sm(r=Z(r)))return ju("Unsupported field value:",t,r),Pm(r,t);if(r instanceof en)return function(n,s){if(!Am(s.Ec))throw s.wc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.wc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.mc&&t.Ec!==4)throw t.wc("Nested arrays are not supported");return function(n,s){const i=[];let o=0;for(const u of n){let c=kn(u,s.yc(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(r,t)}return function(n,s){if((n=Z(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Wd(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=tt.fromDate(n);return{timestampValue:hr(s.serializer,i)}}if(n instanceof tt){const i=new tt(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:hr(s.serializer,i)}}if(n instanceof se)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof zt)return{bytesValue:af(s.serializer,n._byteString)};if(n instanceof nt){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:ou(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof Zt)return function(o,u){return{mapValue:{fields:{[Ha]:{stringValue:Xa},[or]:{arrayValue:{values:o.toArray().map(h=>{if(typeof h!="number")throw u.wc("VectorValues must only contain numeric values.");return tu(u.serializer,h)})}}}}}}(n,s);throw s.wc(`Unsupported field value: ${Yi(n)}`)}(r,t)}function Pm(r,t){const e={};return Ed(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Je(r,(n,s)=>{const i=kn(s,t.Vc(n));i!=null&&(e[n]=i)}),{mapValue:{fields:e}}}function Sm(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof tt||r instanceof se||r instanceof zt||r instanceof nt||r instanceof en||r instanceof Zt)}function ju(r,t,e){if(!Sm(e)||!nd(e)){const n=Yi(e);throw n==="an object"?t.wc(r+" a custom object"):t.wc(r+" "+n)}}function bs(r,t,e){if((t=Z(t))instanceof tn)return t._internalPath;if(typeof t=="string")return Eo(r,t);throw Wi("Field path arguments must be of type string or ",r,!1,void 0,e)}const OT=new RegExp("[~\\*/\\[\\]]");function Eo(r,t,e){if(t.search(OT)>=0)throw Wi(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,e);try{return new tn(...t.split("."))._internalPath}catch{throw Wi(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,e)}}function Wi(r,t,e,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let u=`Function ${t}() called with invalid data`;e&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${n}`),o&&(c+=` in document ${s}`),c+=")"),new D(b.INVALID_ARGUMENT,u+r+c)}function Vm(r,t){return r.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(t,e,n,s,i){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new nt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new FT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(wo("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class FT extends Ps{data(){return super.data()}}function wo(r,t){return typeof t=="string"?Eo(r,t):t instanceof tn?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cm(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new D(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class zu{}class Sr extends zu{}function MT(r,t,...e){let n=[];t instanceof zu&&n.push(t),n=n.concat(e),function(i){const o=i.filter(c=>c instanceof Nn).length,u=i.filter(c=>c instanceof Vr).length;if(o>1||o>0&&u>0)throw new D(b.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class Vr extends Sr{constructor(t,e,n){super(),this._field=t,this._op=e,this._value=n,this.type="where"}static _create(t,e,n){return new Vr(t,e,n)}_apply(t){const e=this._parse(t);return Dm(t._query,e),new Et(t.firestore,t.converter,wa(t._query,e))}_parse(t){const e=Dn(t.firestore);return function(i,o,u,c,h,f,m){let g;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new D(b.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Ah(m,f);const S=[];for(const x of m)S.push(vh(c,i,x));g={arrayValue:{values:S}}}else g=vh(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Ah(m,f),g=bm(u,o,m,f==="in"||f==="not-in");return X.create(h,f,g)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function LT(r,t,e){const n=t,s=wo("where",r);return Vr._create(s,n,e)}class Nn extends zu{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Nn(t,e)}_parse(t){const e=this._queryConstraints.map(n=>n._parse(t)).filter(n=>n.getFilters().length>0);return e.length===1?e[0]:et.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,i){let o=s;const u=i.getFlattenedFilters();for(const c of u)Dm(o,c),o=wa(o,c)}(t._query,e),new Et(t.firestore,t.converter,wa(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function UT(...r){return r.forEach(t=>km("or",t)),Nn._create("or",r)}function qT(...r){return r.forEach(t=>km("and",t)),Nn._create("and",r)}class vo extends Sr{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new vo(t,e)}_apply(t){const e=function(s,i,o){if(s.startAt!==null)throw new D(b.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new D(b.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new vs(i,o)}(t._query,this._field,this._direction);return new Et(t.firestore,t.converter,function(s,i){const o=s.explicitOrderBy.concat([i]);return new ve(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(t._query,e))}}function BT(r,t="asc"){const e=t,n=wo("orderBy",r);return vo._create(n,e)}class Bs extends Sr{constructor(t,e,n){super(),this.type=t,this._limit=e,this._limitType=n}static _create(t,e,n){return new Bs(t,e,n)}_apply(t){return new Et(t.firestore,t.converter,Li(t._query,this._limit,this._limitType))}}function jT(r){return rd("limit",r),Bs._create("limit",r,"F")}function zT(r){return rd("limitToLast",r),Bs._create("limitToLast",r,"L")}class js extends Sr{constructor(t,e,n){super(),this.type=t,this._docOrFields=e,this._inclusive=n}static _create(t,e,n){return new js(t,e,n)}_apply(t){const e=xm(t,this.type,this._docOrFields,this._inclusive);return new Et(t.firestore,t.converter,function(s,i){return new ve(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,i,s.endAt)}(t._query,e))}}function GT(...r){return js._create("startAt",r,!0)}function $T(...r){return js._create("startAfter",r,!1)}class zs extends Sr{constructor(t,e,n){super(),this.type=t,this._docOrFields=e,this._inclusive=n}static _create(t,e,n){return new zs(t,e,n)}_apply(t){const e=xm(t,this.type,this._docOrFields,this._inclusive);return new Et(t.firestore,t.converter,function(s,i){return new ve(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,s.startAt,i)}(t._query,e))}}function KT(...r){return zs._create("endBefore",r,!1)}function QT(...r){return zs._create("endAt",r,!0)}function xm(r,t,e,n){if(e[0]=Z(e[0]),e[0]instanceof Ps)return function(i,o,u,c,h){if(!c)throw new D(b.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${u}().`);const f=[];for(const m of Xn(i))if(m.field.isKeyField())f.push(In(o,c.key));else{const g=c.data.field(m.field);if(ro(g))throw new D(b.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+m.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){const w=m.field.canonicalString();throw new D(b.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${w}' (used as the orderBy) does not exist.`)}f.push(g)}return new $e(f,h)}(r._query,r.firestore._databaseId,t,e[0]._document,n);{const s=Dn(r.firestore);return function(o,u,c,h,f,m){const g=o.explicitOrderBy;if(f.length>g.length)throw new D(b.INVALID_ARGUMENT,`Too many arguments provided to ${h}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const w=[];for(let S=0;S<f.length;S++){const x=f[S];if(g[S].field.isKeyField()){if(typeof x!="string")throw new D(b.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${h}(), but got a ${typeof x}`);if(!Ya(o)&&x.indexOf("/")!==-1)throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${h}() must be a plain document ID, but '${x}' contains a slash.`);const C=o.path.child(Q.fromString(x));if(!N.isDocumentKey(C))throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${h}() must result in a valid document path, but '${C}' is not because it contains an odd number of segments.`);const L=new N(C);w.push(In(u,L))}else{const C=bm(c,h,x);w.push(C)}}return new $e(w,m)}(r._query,r.firestore._databaseId,s,t,e,n)}}function vh(r,t,e){if(typeof(e=Z(e))=="string"){if(e==="")throw new D(b.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ya(t)&&e.indexOf("/")!==-1)throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const n=t.path.child(Q.fromString(e));if(!N.isDocumentKey(n))throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return In(r,new N(n))}if(e instanceof nt)return In(r,e._key);throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Yi(e)}.`)}function Ah(r,t){if(!Array.isArray(r)||r.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Dm(r,t){const e=function(s,i){for(const o of s)for(const u of o.getFlattenedFilters())if(i.indexOf(u.op)>=0)return u.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new D(b.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new D(b.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}function km(r,t){if(!(t instanceof Vr||t instanceof Nn))throw new D(b.INVALID_ARGUMENT,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class Gu{convertValue(t,e="none"){switch(ze(t)){case 0:return null;case 1:return t.booleanValue;case 2:return ht(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(we(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw U(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return Je(t,(s,i)=>{n[s]=this.convertValue(i,e)}),n}convertVectorValue(t){var e,n,s;const i=(s=(n=(e=t.fields)===null||e===void 0?void 0:e[or].arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.map(o=>ht(o.doubleValue));return new Zt(i)}convertGeoPoint(t){return new se(ht(t.latitude),ht(t.longitude))}convertArray(t,e){return(t.values||[]).map(n=>this.convertValue(n,e))}convertServerTimestamp(t,e){switch(e){case"previous":const n=so(t);return n==null?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(Ts(t));default:return null}}convertTimestamp(t){const e=Ee(t);return new tt(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=Q.fromString(t);B(_f(n),9688,{name:t});const s=new je(n.get(1),n.get(3)),i=new N(n.popFirst(5));return s.isEqual(e)||_t(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(r,t,e){let n;return n=r?e&&(e.merge||e.mergeFields)?r.toFirestore(t,e):r.toFirestore(t):t,n}class $u extends Gu{constructor(t){super(),this.firestore=t}convertBytes(t){return new zt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new nt(this.firestore,null,e)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WT(r){return new yr("sum",bs("sum",r))}function HT(r){return new yr("avg",bs("average",r))}function Nm(){return new yr("count")}function XT(r,t){var e,n;return r instanceof yr&&t instanceof yr&&r.aggregateType===t.aggregateType&&((e=r._internalFieldPath)===null||e===void 0?void 0:e.canonicalString())===((n=t._internalFieldPath)===null||n===void 0?void 0:n.canonicalString())}function JT(r,t){return Ou(r.query,t.query)&&Ss(r.data(),t.data())}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Om="NOT SUPPORTED";class Ie{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Qt extends Ps{constructor(t,e,n,s,i,o){super(t,e,n,s,o),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new fs(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(wo("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Qt._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}function YT(r,t,e){if(Cn(t,Qt._jsonSchema)){if(t.bundle===Om)throw new D(b.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=xn(r._databaseId),s=fm(t.bundle,n),i=s.Ku(),o=new Ru(s.getMetadata(),n);for(const f of i)o.Wa(f);const u=o.documents;if(u.length!==1)throw new D(b.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${u.length} documents.`);const c=uo(n,u[0].document),h=new N(Q.fromString(t.bundleName));return new Qt(r,new $u(r),h,c,new Ie(!1,!1),e||null)}}Qt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Qt._jsonSchema={type:It("string",Qt._jsonSchemaVersion),bundleSource:It("string","DocumentSnapshot"),bundleName:It("string"),bundle:It("string")};class fs extends Qt{data(t={}){return super.data(t)}}class Wt{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Ie(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(n=>{t.call(e,new fs(this._firestore,this._userDataWriter,n.key,n,new Ie(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new D(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(u=>{const c=new fs(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Ie(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(u=>i||u.type!==3).map(u=>{const c=new fs(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Ie(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return u.type!==0&&(h=o.indexOf(u.doc.key),o=o.delete(u.doc.key)),u.type!==1&&(o=o.add(u.doc),f=o.indexOf(u.doc.key)),{type:tI(u.type),doc:c,oldIndex:h,newIndex:f}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=Wt._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Ji.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach(i=>{i._document!==null&&(e.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function ZT(r,t,e){if(Cn(t,Wt._jsonSchema)){if(t.bundle===Om)throw new D(b.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=xn(r._databaseId),s=fm(t.bundle,n),i=s.Ku(),o=new Ru(s.getMetadata(),n);for(const g of i)o.Wa(g);if(o.queries.length!==1)throw new D(b.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const u=lo(o.queries[0].bundledQuery),c=o.documents;let h=new yn;c.map(g=>{const w=uo(n,g.document);h=h.add(w)});const f=Sn.fromInitialDocuments(u,h,K(),!1,!1),m=new Et(r,e||null,u);return new Wt(r,new $u(r),m,f)}}function tI(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return U(61501,{type:r})}}function eI(r,t){return r instanceof Qt&&t instanceof Qt?r._firestore===t._firestore&&r._key.isEqual(t._key)&&(r._document===null?t._document===null:r._document.isEqual(t._document))&&r._converter===t._converter:r instanceof Wt&&t instanceof Wt&&r._firestore===t._firestore&&Ou(r.query,t.query)&&r.metadata.isEqual(t.metadata)&&r._snapshot.isEqual(t._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nI(r){r=W(r,nt);const t=W(r.firestore,st);return hm(ft(t),r._key).then(e=>Ku(t,r,e))}Wt._jsonSchemaVersion="firestore/querySnapshot/1.0",Wt._jsonSchema={type:It("string",Wt._jsonSchemaVersion),bundleSource:It("string","QuerySnapshot"),bundleName:It("string"),bundle:It("string")};class nn extends Gu{constructor(t){super(),this.firestore=t}convertBytes(t){return new zt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new nt(this.firestore,null,e)}}function rI(r){r=W(r,nt);const t=W(r.firestore,st),e=ft(t),n=new nn(t);return cT(e,r._key).then(s=>new Qt(t,n,r._key,s,new Ie(s!==null&&s.hasLocalMutations,!0),r.converter))}function sI(r){r=W(r,nt);const t=W(r.firestore,st);return hm(ft(t),r._key,{source:"server"}).then(e=>Ku(t,r,e))}function iI(r){r=W(r,Et);const t=W(r.firestore,st),e=ft(t),n=new nn(t);return Cm(r._query),dm(e,r._query).then(s=>new Wt(t,n,r,s))}function oI(r){r=W(r,Et);const t=W(r.firestore,st),e=ft(t),n=new nn(t);return lT(e,r._query).then(s=>new Wt(t,n,r,s))}function aI(r){r=W(r,Et);const t=W(r.firestore,st),e=ft(t),n=new nn(t);return dm(e,r._query,{source:"server"}).then(s=>new Wt(t,n,r,s))}function uI(r,t,e){r=W(r,nt);const n=W(r.firestore,st),s=Ao(r.converter,t,e);return Cr(n,[Io(Dn(n),"setDoc",r._key,s,r.converter!==null,e).toMutation(r._key,dt.none())])}function cI(r,t,e,...n){r=W(r,nt);const s=W(r.firestore,st),i=Dn(s);let o;return o=typeof(t=Z(t))=="string"||t instanceof tn?Bu(i,"updateDoc",r._key,t,e,n):qu(i,"updateDoc",r._key,t),Cr(s,[o.toMutation(r._key,dt.exists(!0))])}function lI(r){return Cr(W(r.firestore,st),[new wr(r._key,dt.none())])}function hI(r,t){const e=W(r.firestore,st),n=_m(r),s=Ao(r.converter,t);return Cr(e,[Io(Dn(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,dt.exists(!1))]).then(()=>n)}function Fa(r,...t){var e,n,s;r=Z(r);let i={includeMetadataChanges:!1,source:"default"},o=0;typeof t[o]!="object"||Jn(t[o])||(i=t[o++]);const u={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(Jn(t[o])){const m=t[o];t[o]=(e=m.next)===null||e===void 0?void 0:e.bind(m),t[o+1]=(n=m.error)===null||n===void 0?void 0:n.bind(m),t[o+2]=(s=m.complete)===null||s===void 0?void 0:s.bind(m)}let c,h,f;if(r instanceof nt)h=W(r.firestore,st),f=Ir(r._key.path),c={next:m=>{t[o]&&t[o](Ku(h,r,m))},error:t[o+1],complete:t[o+2]};else{const m=W(r,Et);h=W(m.firestore,st),f=m._query;const g=new nn(h);c={next:w=>{t[o]&&t[o](new Wt(h,g,m,w))},error:t[o+1],complete:t[o+2]},Cm(r._query)}return function(g,w,S,x){const C=new _o(x),L=new Au(w,C,S);return g.asyncQueue.enqueueAndForget(async()=>Eu(await _r(g),L)),()=>{C.Ou(),g.asyncQueue.enqueueAndForget(async()=>wu(await _r(g),L))}}(ft(h),f,u,c)}function dI(r,t,...e){const n=Z(r),s=function(c){const h={bundle:"",bundleName:"",bundleSource:""},f=["bundle","bundleName","bundleSource"];for(const m of f){if(!(m in c)){h.error=`snapshotJson missing required field: ${m}`;break}const g=c[m];if(typeof g!="string"){h.error=`snapshotJson field '${m}' must be a string.`;break}if(g.length===0){h.error=`snapshotJson field '${m}' cannot be an empty string.`;break}m==="bundle"?h.bundle=g:m==="bundleName"?h.bundleName=g:m==="bundleSource"&&(h.bundleSource=g)}return h}(t);if(s.error)throw new D(b.INVALID_ARGUMENT,s.error);let i,o=0;if(typeof e[o]!="object"||Jn(e[o])||(i=e[o++]),s.bundleSource==="QuerySnapshot"){let u=null;if(typeof e[o]=="object"&&Jn(e[o])){const c=e[o++];u={next:c.next,error:c.error,complete:c.complete}}else u={next:e[o++],error:e[o++],complete:e[o++]};return function(h,f,m,g,w){let S,x=!1;return Oa(h,f.bundle).then(()=>Em(h,f.bundleName)).then(L=>{L&&!x&&(w&&L.withConverter(w),S=Fa(L,m||{},g))}).catch(L=>(g.error&&g.error(L),()=>{})),()=>{x||(x=!0,S&&S())}}(n,s,i,u,e[o])}if(s.bundleSource==="DocumentSnapshot"){let u=null;if(typeof e[o]=="object"&&Jn(e[o])){const c=e[o++];u={next:c.next,error:c.error,complete:c.complete}}else u={next:e[o++],error:e[o++],complete:e[o++]};return function(h,f,m,g,w){let S,x=!1;return Oa(h,f.bundle).then(()=>{if(!x){const L=new nt(h,w||null,N.fromPath(f.bundleName));S=Fa(L,m||{},g)}}).catch(L=>(g.error&&g.error(L),()=>{})),()=>{x||(x=!0,S&&S())}}(n,s,i,u,e[o])}throw new D(b.INVALID_ARGUMENT,`unsupported bundle source: ${s.bundleSource}`)}function fI(r,t){return dT(ft(r=W(r,st)),Jn(t)?t:{next:t})}function Cr(r,t){return function(n,s){const i=new Rt;return n.asyncQueue.enqueueAndForget(async()=>qy(await Nu(n),s,i)),i.promise}(ft(r),t)}function Ku(r,t,e){const n=e.docs.get(t._key),s=new nn(r);return new Qt(r,s,t._key,n,new Ie(e.hasPendingWrites,e.fromCache),t.converter)}function mI(r){return Fm(r,{count:Nm()})}function Fm(r,t){const e=W(r.firestore,st),n=ft(e),s=Id(t,(i,o)=>new ef(o,i.aggregateType,i._internalFieldPath));return hT(n,r._query,s).then(i=>function(u,c,h){const f=new nn(u);return new wm(c,f,h)}(e,r,i))}class pI{constructor(t){this.kind="memory",this._onlineComponentProvider=Qe.provider,t?.garbageCollector?this._offlineComponentProvider=t.garbageCollector._offlineComponentProvider:this._offlineComponentProvider={build:()=>new xu(void 0)}}toJSON(){return{kind:this.kind}}}class gI{constructor(t){let e;this.kind="persistent",t?.tabManager?(t.tabManager._initialize(t),e=t.tabManager):(e=Mm(void 0),e._initialize(t)),this._onlineComponentProvider=e._onlineComponentProvider,this._offlineComponentProvider=e._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class _I{constructor(){this.kind="memoryEager",this._offlineComponentProvider=gr.provider}toJSON(){return{kind:this.kind}}}class yI{constructor(t){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new xu(t)}}toJSON(){return{kind:this.kind}}}function TI(){return new _I}function II(r){return new yI(r?.cacheSizeBytes)}function EI(r){return new pI(r)}function wI(r){return new gI(r)}class vI{constructor(t){this.forceOwnership=t,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(t){this._onlineComponentProvider=Qe.provider,this._offlineComponentProvider={build:e=>new Du(e,t?.cacheSizeBytes,this.forceOwnership)}}}class AI{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(t){this._onlineComponentProvider=Qe.provider,this._offlineComponentProvider={build:e=>new am(e,t?.cacheSizeBytes)}}}function Mm(r){return new vI(r?.forceOwnership)}function RI(){return new AI}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=Dn(t)}set(t,e,n){this._verifyNotCommitted();const s=Le(t,this._firestore),i=Ao(s.converter,e,n),o=Io(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,dt.none())),this}update(t,e,n,...s){this._verifyNotCommitted();const i=Le(t,this._firestore);let o;return o=typeof(e=Z(e))=="string"||e instanceof tn?Bu(this._dataReader,"WriteBatch.update",i._key,e,n,s):qu(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(o.toMutation(i._key,dt.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=Le(t,this._firestore);return this._mutations=this._mutations.concat(new wr(e._key,dt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new D(b.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Le(r,t){if((r=Z(r)).firestore!==t)throw new D(b.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PI{constructor(t,e){this._firestore=t,this._transaction=e,this._dataReader=Dn(t)}get(t){const e=Le(t,this._firestore),n=new $u(this._firestore);return this._transaction.lookup([e._key]).then(s=>{if(!s||s.length!==1)return U(24041);const i=s[0];if(i.isFoundDocument())return new Ps(this._firestore,n,i.key,i,e.converter);if(i.isNoDocument())return new Ps(this._firestore,n,e._key,null,e.converter);throw U(18433,{doc:i})})}set(t,e,n){const s=Le(t,this._firestore),i=Ao(s.converter,e,n),o=Io(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,n);return this._transaction.set(s._key,o),this}update(t,e,n,...s){const i=Le(t,this._firestore);let o;return o=typeof(e=Z(e))=="string"||e instanceof tn?Bu(this._dataReader,"Transaction.update",i._key,e,n,s):qu(this._dataReader,"Transaction.update",i._key,e),this._transaction.update(i._key,o),this}delete(t){const e=Le(t,this._firestore);return this._transaction.delete(e._key),this}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um extends PI{constructor(t,e){super(t,e),this._firestore=t}get(t){const e=Le(t,this._firestore),n=new nn(this._firestore);return super.get(t).then(s=>new Qt(this._firestore,n,e._key,s._document,new Ie(!1,!1),e.converter))}}function SI(r,t,e){r=W(r,st);const n=Object.assign(Object.assign({},bI),e);return function(i){if(i.maxAttempts<1)throw new D(b.INVALID_ARGUMENT,"Max attempts must be at least 1")}(n),function(i,o,u){const c=new Rt;return i.asyncQueue.enqueueAndForget(async()=>{const h=await lm(i);new iT(i.asyncQueue,h,u,o,c).zu()}),c.promise}(ft(r),s=>t(new Um(r,s)),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VI(){return new qs("deleteField")}function CI(){return new Fu("serverTimestamp")}function xI(...r){return new Mu("arrayUnion",r)}function DI(...r){return new Lu("arrayRemove",r)}function kI(r){return new Uu("increment",r)}function NI(r){return new Zt(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OI(r){return ft(r=W(r,st)),new Lm(r,t=>Cr(r,t))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FI(r,t){const e=ft(r=W(r,st));if(!e._uninitializedComponentsProvider||e._uninitializedComponentsProvider._offline.kind==="memory")return Lt("Cannot enable indexes when persistence is disabled"),Promise.resolve();const n=function(i){const o=typeof i=="string"?function(h){try{return JSON.parse(h)}catch(f){throw new D(b.INVALID_ARGUMENT,"Failed to parse JSON: "+f?.message)}}(i):i,u=[];if(Array.isArray(o.indexes))for(const c of o.indexes){const h=Rh(c,"collectionGroup"),f=[];if(Array.isArray(c.fields))for(const m of c.fields){const g=Eo("setIndexConfiguration",Rh(m,"fieldPath"));m.arrayConfig==="CONTAINS"?f.push(new gn(g,2)):m.order==="ASCENDING"?f.push(new gn(g,0)):m.order==="DESCENDING"&&f.push(new gn(g,1))}u.push(new tr(tr.UNKNOWN_ID,h,f,er.empty()))}return u}(t);return pT(e,n)}function Rh(r,t){if(typeof r[t]!="string")throw new D(b.INVALID_ARGUMENT,"Missing string value for: "+t);return r[t]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qm{constructor(t){this._firestore=t,this.type="PersistentCacheIndexManager"}}function MI(r){var t;r=W(r,st);const e=bh.get(r);if(e)return e;if(((t=ft(r)._uninitializedComponentsProvider)===null||t===void 0?void 0:t._offline.kind)!=="persistent")return null;const n=new qm(r);return bh.set(r,n),n}function LI(r){Bm(r,!0)}function UI(r){Bm(r,!1)}function qI(r){_T(ft(r._firestore)).then(t=>k("deleting all persistent cache indexes succeeded")).catch(t=>Lt("deleting all persistent cache indexes failed",t))}function Bm(r,t){gT(ft(r._firestore),t).then(e=>k(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch(e=>Lt(`setting persistent cache index auto creation isEnabled=${t} failed`,e))}const bh=new WeakMap;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BI(r){var t;const e=(t=ft(W(r.firestore,st))._onlineComponents)===null||t===void 0?void 0:t.datastore.serializer;return e===void 0?null:co(e,Mt(r._query)).Vt}function jI(r,t){var e;const n=Id(t,(i,o)=>new ef(o,i.aggregateType,i._internalFieldPath)),s=(e=ft(W(r.firestore,st))._onlineComponents)===null||e===void 0?void 0:e.datastore.serializer;return s===void 0?null:ff(s,Ud(r._query),n,!0).request}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zI{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(t){return Qu.instance.onExistenceFilterMismatch(t)}}class Qu{constructor(){this.Fc=new Map}static get instance(){return yi||(yi=new Qu,function(e){if(Ui)throw new Error("a TestingHooksSpi instance is already set");Ui=e}(yi)),yi}ct(t){this.Fc.forEach(e=>e(t))}onExistenceFilterMismatch(t){const e=Symbol(),n=this.Fc;return n.set(e,t),()=>n.delete(e)}}let yi=null;(function(t,e=!0){(function(s){Tr=s})(Bh),jh(new zh("firestore",(n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),u=new st(new ng(n.getProvider("auth-internal")),new ig(o,n.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new D(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new je(h.options.projectId,f)}(o,s),o);return i=Object.assign({useFetchStreams:e},i),u._setSettings(i),u},"PUBLIC").setMultipleInstances(!0)),Di(rl,sl,t),Di(rl,sl,"esm2017")})();const Sw=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Gu,AggregateField:yr,AggregateQuerySnapshot:wm,Bytes:zt,CACHE_SIZE_UNLIMITED:ET,CollectionReference:re,DocumentReference:nt,DocumentSnapshot:Qt,FieldPath:tn,FieldValue:en,Firestore:st,FirestoreError:D,GeoPoint:se,LoadBundleTask:ym,PersistentCacheIndexManager:qm,Query:Et,QueryCompositeFilterConstraint:Nn,QueryConstraint:Sr,QueryDocumentSnapshot:fs,QueryEndAtConstraint:zs,QueryFieldFilterConstraint:Vr,QueryLimitConstraint:Bs,QueryOrderByConstraint:vo,QuerySnapshot:Wt,QueryStartAtConstraint:js,SnapshotMetadata:Ie,Timestamp:tt,Transaction:Um,VectorValue:Zt,WriteBatch:Lm,_AutoId:Ji,_ByteString:pt,_DatabaseId:je,_DocumentKey:N,_EmptyAppCheckTokenProvider:og,_EmptyAuthCredentialsProvider:Zh,_FieldPath:lt,_TestingHooks:zI,_cast:W,_debugAssert:tg,_internalAggregationQueryToProtoRunAggregationQueryRequest:jI,_internalQueryToProtoQueryTarget:BI,_isBase64Available:jg,_logWarn:Lt,_validateIsNotUsedTogether:ed,addDoc:hI,aggregateFieldEqual:XT,aggregateQuerySnapshotEqual:JT,and:qT,arrayRemove:DI,arrayUnion:xI,average:HT,clearIndexedDbPersistence:bT,collection:yT,collectionGroup:TT,connectFirestoreEmulator:gm,count:Nm,deleteAllPersistentCacheIndexes:qI,deleteDoc:lI,deleteField:VI,disableNetwork:VT,disablePersistentCacheIndexAutoCreation:UI,doc:_m,documentId:xT,documentSnapshotFromJSON:YT,enableIndexedDbPersistence:AT,enableMultiTabIndexedDbPersistence:RT,enableNetwork:ST,enablePersistentCacheIndexAutoCreation:LI,endAt:QT,endBefore:KT,ensureFirestoreConfigured:ft,executeWrite:Cr,getAggregateFromServer:Fm,getCountFromServer:mI,getDoc:nI,getDocFromCache:rI,getDocFromServer:sI,getDocs:iI,getDocsFromCache:oI,getDocsFromServer:aI,getFirestore:vT,getPersistentCacheIndexManager:MI,increment:kI,initializeFirestore:wT,limit:jT,limitToLast:zT,loadBundle:Oa,memoryEagerGarbageCollector:TI,memoryLocalCache:EI,memoryLruGarbageCollector:II,namedQuery:Em,onSnapshot:Fa,onSnapshotResume:dI,onSnapshotsInSync:fI,or:UT,orderBy:BT,persistentLocalCache:wI,persistentMultipleTabManager:RI,persistentSingleTabManager:Mm,query:MT,queryEqual:Ou,querySnapshotFromJSON:ZT,refEqual:IT,runTransaction:SI,serverTimestamp:CI,setDoc:uI,setIndexConfiguration:FI,setLogLevel:Zp,snapshotEqual:eI,startAfter:$T,startAt:GT,sum:WT,terminate:CT,updateDoc:cI,vector:NI,waitForPendingWrites:PT,where:LT,writeBatch:OI},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jm="firebasestorage.googleapis.com",zm="storageBucket",GI=2*60*1e3,$I=10*60*1e3,KI=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt extends Fh{constructor(t,e,n=0){super(ia(t),`Firebase Storage: ${e} (${ia(t)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,mt.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return ia(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var at;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(at||(at={}));function ia(r){return"storage/"+r}function Wu(){const r="An unknown error occurred, please check the error payload for server response.";return new mt(at.UNKNOWN,r)}function QI(r){return new mt(at.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function WI(r){return new mt(at.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function HI(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new mt(at.UNAUTHENTICATED,r)}function XI(){return new mt(at.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function JI(r){return new mt(at.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function Gm(){return new mt(at.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function $m(){return new mt(at.CANCELED,"User canceled the upload/download.")}function YI(r){return new mt(at.INVALID_URL,"Invalid URL '"+r+"'.")}function ZI(r){return new mt(at.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function tE(){return new mt(at.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+zm+"' property when initializing the app?")}function Km(){return new mt(at.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function eE(){return new mt(at.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function nE(){return new mt(at.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function rE(r){return new mt(at.UNSUPPORTED_ENVIRONMENT,`${r} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function Hi(r){return new mt(at.INVALID_ARGUMENT,r)}function Qm(){return new mt(at.APP_DELETED,"The Firebase app was deleted.")}function Wm(r){return new mt(at.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ms(r,t){return new mt(at.INVALID_FORMAT,"String does not match format '"+r+"': "+t)}function ts(r){throw new mt(at.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(t,e){this.bucket=t,this.path_=e}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,e){let n;try{n=Ot.makeFromUrl(t,e)}catch{return new Ot(t,"")}if(n.path==="")return n;throw ZI(t)}static makeFromUrl(t,e){let n=null;const s="([A-Za-z0-9.\\-_]+)";function i(z){z.path.charAt(z.path.length-1)==="/"&&(z.path_=z.path_.slice(0,-1))}const o="(/(.*))?$",u=new RegExp("^gs://"+s+o,"i"),c={bucket:1,path:3};function h(z){z.path_=decodeURIComponent(z.path)}const f="v[A-Za-z0-9_]+",m=e.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",w=new RegExp(`^https?://${m}/${f}/b/${s}/o${g}`,"i"),S={bucket:1,path:3},x=e===jm?"(?:storage.googleapis.com|storage.cloud.google.com)":e,C="([^?#]*)",L=new RegExp(`^https?://${x}/${s}/${C}`,"i"),M=[{regex:u,indices:c,postModify:i},{regex:w,indices:S,postModify:h},{regex:L,indices:{bucket:1,path:2},postModify:h}];for(let z=0;z<M.length;z++){const H=M[z],$=H.regex.exec(t);if($){const I=$[H.indices.bucket];let _=$[H.indices.path];_||(_=""),n=new Ot(I,_),H.postModify(n);break}}if(n==null)throw YI(t);return n}}class sE{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iE(r,t,e){let n=1,s=null,i=null,o=!1,u=0;function c(){return u===2}let h=!1;function f(...C){h||(h=!0,t.apply(null,C))}function m(C){s=setTimeout(()=>{s=null,r(w,c())},C)}function g(){i&&clearTimeout(i)}function w(C,...L){if(h){g();return}if(C){g(),f.call(null,C,...L);return}if(c()||o){g(),f.call(null,C,...L);return}n<64&&(n*=2);let M;u===1?(u=2,M=0):M=(n+Math.random())*1e3,m(M)}let S=!1;function x(C){S||(S=!0,g(),!h&&(s!==null?(C||(u=2),clearTimeout(s),m(0)):C||(u=1)))}return m(0),i=setTimeout(()=>{o=!0,x(!0)},e),x}function oE(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aE(r){return r!==void 0}function uE(r){return typeof r=="function"}function cE(r){return typeof r=="object"&&!Array.isArray(r)}function Ro(r){return typeof r=="string"||r instanceof String}function Ph(r){return Hu()&&r instanceof Blob}function Hu(){return typeof Blob<"u"}function Ma(r,t,e,n){if(n<t)throw Hi(`Invalid value for '${r}'. Expected ${t} or greater.`);if(n>e)throw Hi(`Invalid value for '${r}'. Expected ${e} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(r,t,e){let n=t;return e==null&&(n=`https://${t}`),`${e}://${n}/v0${r}`}function Hm(r){const t=encodeURIComponent;let e="?";for(const n in r)if(r.hasOwnProperty(n)){const s=t(n)+"="+t(r[n]);e=e+s+"&"}return e=e.slice(0,-1),e}var Tn;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(Tn||(Tn={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xm(r,t){const e=r>=500&&r<600,s=[408,429].indexOf(r)!==-1,i=t.indexOf(r)!==-1;return e||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lE{constructor(t,e,n,s,i,o,u,c,h,f,m,g=!0,w=!1){this.url_=t,this.method_=e,this.headers_=n,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=u,this.errorCallback_=c,this.timeout_=h,this.progressCallback_=f,this.connectionFactory_=m,this.retry=g,this.isUsingEmulator=w,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((S,x)=>{this.resolve_=S,this.reject_=x,this.start_()})}start_(){const t=(n,s)=>{if(s){n(!1,new Ti(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=u=>{const c=u.loaded,h=u.lengthComputable?u.total:-1;this.progressCallback_!==null&&this.progressCallback_(c,h)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const u=i.getErrorCode()===Tn.NO_ERROR,c=i.getStatus();if(!u||Xm(c,this.additionalRetryCodes_)&&this.retry){const f=i.getErrorCode()===Tn.ABORT;n(!1,new Ti(!1,null,f));return}const h=this.successCodes_.indexOf(c)!==-1;n(!0,new Ti(h,i))})},e=(n,s)=>{const i=this.resolve_,o=this.reject_,u=s.connection;if(s.wasSuccessCode)try{const c=this.callback_(u,u.getResponse());aE(c)?i(c):i()}catch(c){o(c)}else if(u!==null){const c=Wu();c.serverResponse=u.getErrorText(),this.errorCallback_?o(this.errorCallback_(u,c)):o(c)}else if(s.canceled){const c=this.appDelete_?Qm():$m();o(c)}else{const c=Gm();o(c)}};this.canceled_?e(!1,new Ti(!1,null,!0)):this.backoffId_=iE(t,e,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&oE(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Ti{constructor(t,e,n){this.wasSuccessCode=t,this.connection=e,this.canceled=!!n}}function hE(r,t){t!==null&&t.length>0&&(r.Authorization="Firebase "+t)}function dE(r,t){r["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function fE(r,t){t&&(r["X-Firebase-GMPID"]=t)}function mE(r,t){t!==null&&(r["X-Firebase-AppCheck"]=t)}function pE(r,t,e,n,s,i,o=!0,u=!1){const c=Hm(r.urlParams),h=r.url+c,f=Object.assign({},r.headers);return fE(f,t),hE(f,e),dE(f,i),mE(f,n),new lE(h,r.method,f,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,s,o,u)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gE(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function _E(...r){const t=gE();if(t!==void 0){const e=new t;for(let n=0;n<r.length;n++)e.append(r[n]);return e.getBlob()}else{if(Hu())return new Blob(r);throw new mt(at.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function yE(r,t,e){return r.webkitSlice?r.webkitSlice(t,e):r.mozSlice?r.mozSlice(t,e):r.slice?r.slice(t,e):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TE(r){if(typeof atob>"u")throw rE("base-64");return atob(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class oa{constructor(t,e){this.data=t,this.contentType=e||null}}function Xu(r,t){switch(r){case Yt.RAW:return new oa(Jm(t));case Yt.BASE64:case Yt.BASE64URL:return new oa(Ym(r,t));case Yt.DATA_URL:return new oa(EE(t),wE(t))}throw Wu()}function Jm(r){const t=[];for(let e=0;e<r.length;e++){let n=r.charCodeAt(e);if(n<=127)t.push(n);else if(n<=2047)t.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(e<r.length-1&&(r.charCodeAt(e+1)&64512)===56320))t.push(239,191,189);else{const i=n,o=r.charCodeAt(++e);n=65536|(i&1023)<<10|o&1023,t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(t)}function IE(r){let t;try{t=decodeURIComponent(r)}catch{throw ms(Yt.DATA_URL,"Malformed data URL.")}return Jm(t)}function Ym(r,t){switch(r){case Yt.BASE64:{const s=t.indexOf("-")!==-1,i=t.indexOf("_")!==-1;if(s||i)throw ms(r,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case Yt.BASE64URL:{const s=t.indexOf("+")!==-1,i=t.indexOf("/")!==-1;if(s||i)throw ms(r,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let e;try{e=TE(t)}catch(s){throw s.message.includes("polyfill")?s:ms(r,"Invalid character found")}const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n}class Zm{constructor(t){this.base64=!1,this.contentType=null;const e=t.match(/^data:([^,]+)?,/);if(e===null)throw ms(Yt.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=e[1]||null;n!=null&&(this.base64=vE(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=t.substring(t.indexOf(",")+1)}}function EE(r){const t=new Zm(r);return t.base64?Ym(Yt.BASE64,t.rest):IE(t.rest)}function wE(r){return new Zm(r).contentType}function vE(r,t){return r.length>=t.length?r.substring(r.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(t,e){let n=0,s="";Ph(t)?(this.data_=t,n=t.size,s=t.type):t instanceof ArrayBuffer?(e?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),n=this.data_.length):t instanceof Uint8Array&&(e?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),n=t.length),this.size_=n,this.type_=s}size(){return this.size_}type(){return this.type_}slice(t,e){if(Ph(this.data_)){const n=this.data_,s=yE(n,t,e);return s===null?null:new ae(s)}else{const n=new Uint8Array(this.data_.buffer,t,e-t);return new ae(n,!0)}}static getBlob(...t){if(Hu()){const e=t.map(n=>n instanceof ae?n.data_:n);return new ae(_E.apply(null,e))}else{const e=t.map(o=>Ro(o)?Xu(Yt.RAW,o).data:o.data_);let n=0;e.forEach(o=>{n+=o.byteLength});const s=new Uint8Array(n);let i=0;return e.forEach(o=>{for(let u=0;u<o.length;u++)s[i++]=o[u]}),new ae(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ju(r){let t;try{t=JSON.parse(r)}catch{return null}return cE(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AE(r){if(r.length===0)return null;const t=r.lastIndexOf("/");return t===-1?"":r.slice(0,t)}function RE(r,t){const e=t.split("/").filter(n=>n.length>0).join("/");return r.length===0?e:r+"/"+e}function tp(r){const t=r.lastIndexOf("/",r.length-2);return t===-1?r:r.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bE(r,t){return t}class Bt{constructor(t,e,n,s){this.server=t,this.local=e||t,this.writable=!!n,this.xform=s||bE}}let Ii=null;function PE(r){return!Ro(r)||r.length<2?r:tp(r)}function Gs(){if(Ii)return Ii;const r=[];r.push(new Bt("bucket")),r.push(new Bt("generation")),r.push(new Bt("metageneration")),r.push(new Bt("name","fullPath",!0));function t(i,o){return PE(o)}const e=new Bt("name");e.xform=t,r.push(e);function n(i,o){return o!==void 0?Number(o):o}const s=new Bt("size");return s.xform=n,r.push(s),r.push(new Bt("timeCreated")),r.push(new Bt("updated")),r.push(new Bt("md5Hash",null,!0)),r.push(new Bt("cacheControl",null,!0)),r.push(new Bt("contentDisposition",null,!0)),r.push(new Bt("contentEncoding",null,!0)),r.push(new Bt("contentLanguage",null,!0)),r.push(new Bt("contentType",null,!0)),r.push(new Bt("metadata","customMetadata",!0)),Ii=r,Ii}function SE(r,t){function e(){const n=r.bucket,s=r.fullPath,i=new Ot(n,s);return t._makeStorageReference(i)}Object.defineProperty(r,"ref",{get:e})}function VE(r,t,e){const n={};n.type="file";const s=e.length;for(let i=0;i<s;i++){const o=e[i];n[o.local]=o.xform(n,t[o.server])}return SE(n,r),n}function ep(r,t,e){const n=Ju(t);return n===null?null:VE(r,n,e)}function CE(r,t,e,n){const s=Ju(t);if(s===null||!Ro(s.downloadTokens))return null;const i=s.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(h=>{const f=r.bucket,m=r.fullPath,g="/b/"+o(f)+"/o/"+o(m),w=Pe(g,e,n),S=Hm({alt:"media",token:h});return w+S})[0]}function Yu(r,t){const e={},n=t.length;for(let s=0;s<n;s++){const i=t[s];i.writable&&(e[i.server]=r[i.local])}return JSON.stringify(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sh="prefixes",Vh="items";function xE(r,t,e){const n={prefixes:[],items:[],nextPageToken:e.nextPageToken};if(e[Sh])for(const s of e[Sh]){const i=s.replace(/\/$/,""),o=r._makeStorageReference(new Ot(t,i));n.prefixes.push(o)}if(e[Vh])for(const s of e[Vh]){const i=r._makeStorageReference(new Ot(t,s.name));n.items.push(i)}return n}function DE(r,t,e){const n=Ju(e);return n===null?null:xE(r,t,n)}class me{constructor(t,e,n,s){this.url=t,this.method=e,this.handler=n,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function de(r){if(!r)throw Wu()}function bo(r,t){function e(n,s){const i=ep(r,s,t);return de(i!==null),i}return e}function kE(r,t){function e(n,s){const i=DE(r,t,s);return de(i!==null),i}return e}function NE(r,t){function e(n,s){const i=ep(r,s,t);return de(i!==null),CE(i,s,r.host,r._protocol)}return e}function xr(r){function t(e,n){let s;return e.getStatus()===401?e.getErrorText().includes("Firebase App Check token is invalid")?s=XI():s=HI():e.getStatus()===402?s=WI(r.bucket):e.getStatus()===403?s=JI(r.path):s=n,s.status=e.getStatus(),s.serverResponse=n.serverResponse,s}return t}function $s(r){const t=xr(r);function e(n,s){let i=t(n,s);return n.getStatus()===404&&(i=QI(r.path)),i.serverResponse=s.serverResponse,i}return e}function np(r,t,e){const n=t.fullServerUrl(),s=Pe(n,r.host,r._protocol),i="GET",o=r.maxOperationRetryTime,u=new me(s,i,bo(r,e),o);return u.errorHandler=$s(t),u}function OE(r,t,e,n,s){const i={};t.isRoot?i.prefix="":i.prefix=t.path+"/",e.length>0&&(i.delimiter=e),n&&(i.pageToken=n),s&&(i.maxResults=s);const o=t.bucketOnlyServerUrl(),u=Pe(o,r.host,r._protocol),c="GET",h=r.maxOperationRetryTime,f=new me(u,c,kE(r,t.bucket),h);return f.urlParams=i,f.errorHandler=xr(t),f}function rp(r,t,e){const n=t.fullServerUrl(),s=Pe(n,r.host,r._protocol)+"?alt=media",i="GET",o=r.maxOperationRetryTime,u=new me(s,i,(c,h)=>h,o);return u.errorHandler=$s(t),e!==void 0&&(u.headers.Range=`bytes=0-${e}`,u.successCodes=[200,206]),u}function FE(r,t,e){const n=t.fullServerUrl(),s=Pe(n,r.host,r._protocol),i="GET",o=r.maxOperationRetryTime,u=new me(s,i,NE(r,e),o);return u.errorHandler=$s(t),u}function ME(r,t,e,n){const s=t.fullServerUrl(),i=Pe(s,r.host,r._protocol),o="PATCH",u=Yu(e,n),c={"Content-Type":"application/json; charset=utf-8"},h=r.maxOperationRetryTime,f=new me(i,o,bo(r,n),h);return f.headers=c,f.body=u,f.errorHandler=$s(t),f}function LE(r,t){const e=t.fullServerUrl(),n=Pe(e,r.host,r._protocol),s="DELETE",i=r.maxOperationRetryTime;function o(c,h){}const u=new me(n,s,o,i);return u.successCodes=[200,204],u.errorHandler=$s(t),u}function UE(r,t){return r&&r.contentType||t&&t.type()||"application/octet-stream"}function sp(r,t,e){const n=Object.assign({},e);return n.fullPath=r.path,n.size=t.size(),n.contentType||(n.contentType=UE(null,t)),n}function ip(r,t,e,n,s){const i=t.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function u(){let M="";for(let z=0;z<2;z++)M=M+Math.random().toString().slice(2);return M}const c=u();o["Content-Type"]="multipart/related; boundary="+c;const h=sp(t,n,s),f=Yu(h,e),m="--"+c+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+c+`\r
Content-Type: `+h.contentType+`\r
\r
`,g=`\r
--`+c+"--",w=ae.getBlob(m,n,g);if(w===null)throw Km();const S={name:h.fullPath},x=Pe(i,r.host,r._protocol),C="POST",L=r.maxUploadRetryTime,q=new me(x,C,bo(r,e),L);return q.urlParams=S,q.headers=o,q.body=w.uploadData(),q.errorHandler=xr(t),q}class Xi{constructor(t,e,n,s){this.current=t,this.total=e,this.finalized=!!n,this.metadata=s||null}}function Zu(r,t){let e=null;try{e=r.getResponseHeader("X-Goog-Upload-Status")}catch{de(!1)}return de(!!e&&(t||["active"]).indexOf(e)!==-1),e}function qE(r,t,e,n,s){const i=t.bucketOnlyServerUrl(),o=sp(t,n,s),u={name:o.fullPath},c=Pe(i,r.host,r._protocol),h="POST",f={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${n.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},m=Yu(o,e),g=r.maxUploadRetryTime;function w(x){Zu(x);let C;try{C=x.getResponseHeader("X-Goog-Upload-URL")}catch{de(!1)}return de(Ro(C)),C}const S=new me(c,h,w,g);return S.urlParams=u,S.headers=f,S.body=m,S.errorHandler=xr(t),S}function BE(r,t,e,n){const s={"X-Goog-Upload-Command":"query"};function i(h){const f=Zu(h,["active","final"]);let m=null;try{m=h.getResponseHeader("X-Goog-Upload-Size-Received")}catch{de(!1)}m||de(!1);const g=Number(m);return de(!isNaN(g)),new Xi(g,n.size(),f==="final")}const o="POST",u=r.maxUploadRetryTime,c=new me(e,o,i,u);return c.headers=s,c.errorHandler=xr(t),c}const Ch=256*1024;function jE(r,t,e,n,s,i,o,u){const c=new Xi(0,0);if(o?(c.current=o.current,c.total=o.total):(c.current=0,c.total=n.size()),n.size()!==c.total)throw eE();const h=c.total-c.current;let f=h;s>0&&(f=Math.min(f,s));const m=c.current,g=m+f;let w="";f===0?w="finalize":h===f?w="upload, finalize":w="upload";const S={"X-Goog-Upload-Command":w,"X-Goog-Upload-Offset":`${c.current}`},x=n.slice(m,g);if(x===null)throw Km();function C(z,H){const $=Zu(z,["active","final"]),I=c.current+f,_=n.size();let T;return $==="final"?T=bo(t,i)(z,H):T=null,new Xi(I,_,$==="final",T)}const L="POST",q=t.maxUploadRetryTime,M=new me(e,L,C,q);return M.headers=S,M.body=x.uploadData(),M.progressCallback=u||null,M.errorHandler=xr(r),M}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zE={STATE_CHANGED:"state_changed"},jt={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function aa(r){switch(r){case"running":case"pausing":case"canceling":return jt.RUNNING;case"paused":return jt.PAUSED;case"success":return jt.SUCCESS;case"canceled":return jt.CANCELED;case"error":return jt.ERROR;default:return jt.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GE{constructor(t,e,n){if(uE(t)||e!=null||n!=null)this.next=t,this.error=e??void 0,this.complete=n??void 0;else{const i=t;this.next=i.next,this.error=i.error,this.complete=i.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(r){return(...t)=>{Promise.resolve().then(()=>r(...t))}}class tc{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Tn.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Tn.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Tn.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,e,n,s,i){if(this.sent_)throw ts("cannot .send() more than once");if(Vs(t)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(e,t,!0),i!==void 0)for(const o in i)i.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,i[o].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw ts("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw ts("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw ts("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw ts("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class $E extends tc{initXhr(){this.xhr_.responseType="text"}}function ne(){return new $E}class KE extends tc{initXhr(){this.xhr_.responseType="arraybuffer"}}function QE(){return new KE}class WE extends tc{initXhr(){this.xhr_.responseType="blob"}}function HE(){return new WE}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class op{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(t,e,n=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=t,this._blob=e,this._metadata=n,this._mappings=Gs(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=s=>{if(this._request=void 0,this._chunkMultiplier=1,s._codeEquals(at.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const i=this.isExponentialBackoffExpired();if(Xm(s.status,[]))if(i)s=Gm();else{this.sleepTime=Math.max(this.sleepTime*2,KI),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=s,this._transition("error")}},this._metadataErrorHandler=s=>{this._request=void 0,s._codeEquals(at.CANCELED)?this.completeTransitions_():(this._error=s,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((s,i)=>{this._resolve=s,this._reject=i,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const t=this._transferred;return e=>this._updateProgress(t+e)}_shouldDoResumable(t){return t.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(t){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([e,n])=>{switch(this._state){case"running":t(e,n);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((t,e)=>{const n=qE(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(n,ne,t,e);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._uploadUrl=i,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const t=this._uploadUrl;this._resolveToken((e,n)=>{const s=BE(this._ref.storage,this._ref._location,t,this._blob),i=this._ref.storage._makeRequest(s,ne,e,n);this._request=i,i.getPromise().then(o=>{o=o,this._request=void 0,this._updateProgress(o.current),this._needToFetchStatus=!1,o.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const t=Ch*this._chunkMultiplier,e=new Xi(this._transferred,this._blob.size()),n=this._uploadUrl;this._resolveToken((s,i)=>{let o;try{o=jE(this._ref._location,this._ref.storage,n,this._blob,t,this._mappings,e,this._makeProgressCallback())}catch(c){this._error=c,this._transition("error");return}const u=this._ref.storage._makeRequest(o,ne,s,i,!1);this._request=u,u.getPromise().then(c=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(c.current),c.finalized?(this._metadata=c.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){Ch*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((t,e)=>{const n=np(this._ref.storage,this._ref._location,this._mappings),s=this._ref.storage._makeRequest(n,ne,t,e);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((t,e)=>{const n=ip(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(n,ne,t,e);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(t){const e=this._transferred;this._transferred=t,this._transferred!==e&&this._notifyObservers()}_transition(t){if(this._state!==t)switch(t){case"canceling":case"pausing":this._state=t,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const e=this._state==="paused";this._state=t,e&&(this._notifyObservers(),this._start());break;case"paused":this._state=t,this._notifyObservers();break;case"canceled":this._error=$m(),this._state=t,this._notifyObservers();break;case"error":this._state=t,this._notifyObservers();break;case"success":this._state=t,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const t=aa(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:t,metadata:this._metadata,task:this,ref:this._ref}}on(t,e,n,s){const i=new GE(e||void 0,n||void 0,s||void 0);return this._addObserver(i),()=>{this._removeObserver(i)}}then(t,e){return this._promise.then(t,e)}catch(t){return this.then(null,t)}_addObserver(t){this._observers.push(t),this._notifyObserver(t)}_removeObserver(t){const e=this._observers.indexOf(t);e!==-1&&this._observers.splice(e,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(e=>{this._notifyObserver(e)})}_finishPromise(){if(this._resolve!==void 0){let t=!0;switch(aa(this._state)){case jt.SUCCESS:$n(this._resolve.bind(null,this.snapshot))();break;case jt.CANCELED:case jt.ERROR:const e=this._reject;$n(e.bind(null,this._error))();break;default:t=!1;break}t&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(t){switch(aa(this._state)){case jt.RUNNING:case jt.PAUSED:t.next&&$n(t.next.bind(t,this.snapshot))();break;case jt.SUCCESS:t.complete&&$n(t.complete.bind(t))();break;case jt.CANCELED:case jt.ERROR:t.error&&$n(t.error.bind(t,this._error))();break;default:t.error&&$n(t.error.bind(t,this._error))()}}resume(){const t=this._state==="paused"||this._state==="pausing";return t&&this._transition("running"),t}pause(){const t=this._state==="running";return t&&this._transition("pausing"),t}cancel(){const t=this._state==="running"||this._state==="pausing";return t&&this._transition("canceling"),t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(t,e){this._service=t,e instanceof Ot?this._location=e:this._location=Ot.makeFromUrl(e,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,e){return new Vn(t,e)}get root(){const t=new Ot(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return tp(this._location.path)}get storage(){return this._service}get parent(){const t=AE(this._location.path);if(t===null)return null;const e=new Ot(this._location.bucket,t);return new Vn(this._service,e)}_throwIfRoot(t){if(this._location.path==="")throw Wm(t)}}function XE(r,t){r._throwIfRoot("getBytes");const e=rp(r.storage,r._location,t);return r.storage.makeRequestWithTokens(e,QE).then(n=>t!==void 0?n.slice(0,t):n)}function JE(r,t){r._throwIfRoot("getBlob");const e=rp(r.storage,r._location,t);return r.storage.makeRequestWithTokens(e,HE).then(n=>t!==void 0?n.slice(0,t):n)}function ap(r,t,e){r._throwIfRoot("uploadBytes");const n=ip(r.storage,r._location,Gs(),new ae(t,!0),e);return r.storage.makeRequestWithTokens(n,ne).then(s=>({metadata:s,ref:r}))}function YE(r,t,e){return r._throwIfRoot("uploadBytesResumable"),new op(r,new ae(t),e)}function ZE(r,t,e=Yt.RAW,n){r._throwIfRoot("uploadString");const s=Xu(e,t),i=Object.assign({},n);return i.contentType==null&&s.contentType!=null&&(i.contentType=s.contentType),ap(r,s.data,i)}function tw(r){const t={prefixes:[],items:[]};return up(r,t).then(()=>t)}async function up(r,t,e){const s=await cp(r,{pageToken:e});t.prefixes.push(...s.prefixes),t.items.push(...s.items),s.nextPageToken!=null&&await up(r,t,s.nextPageToken)}function cp(r,t){t!=null&&typeof t.maxResults=="number"&&Ma("options.maxResults",1,1e3,t.maxResults);const e=t||{},n=OE(r.storage,r._location,"/",e.pageToken,e.maxResults);return r.storage.makeRequestWithTokens(n,ne)}function ew(r){r._throwIfRoot("getMetadata");const t=np(r.storage,r._location,Gs());return r.storage.makeRequestWithTokens(t,ne)}function nw(r,t){r._throwIfRoot("updateMetadata");const e=ME(r.storage,r._location,t,Gs());return r.storage.makeRequestWithTokens(e,ne)}function rw(r){r._throwIfRoot("getDownloadURL");const t=FE(r.storage,r._location,Gs());return r.storage.makeRequestWithTokens(t,ne).then(e=>{if(e===null)throw nE();return e})}function sw(r){r._throwIfRoot("deleteObject");const t=LE(r.storage,r._location);return r.storage.makeRequestWithTokens(t,ne)}function lp(r,t){const e=RE(r._location.path,t),n=new Ot(r._location.bucket,e);return new Vn(r.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iw(r){return/^[A-Za-z]+:\/\//.test(r)}function ow(r,t){return new Vn(r,t)}function hp(r,t){if(r instanceof ec){const e=r;if(e._bucket==null)throw tE();const n=new Vn(e,e._bucket);return t!=null?hp(n,t):n}else return t!==void 0?lp(r,t):r}function aw(r,t){if(t&&iw(t)){if(r instanceof ec)return ow(r,t);throw Hi("To use ref(service, url), the first argument must be a Storage instance.")}else return hp(r,t)}function xh(r,t){const e=t?.[zm];return e==null?null:Ot.makeFromBucketSpec(e,r)}function uw(r,t,e,n={}){r.host=`${t}:${e}`;const s=Vs(t);s&&(Ua(`https://${r.host}/b`),Mh("Storage",!0)),r._isUsingEmulator=!0,r._protocol=s?"https":"http";const{mockUserToken:i}=n;i&&(r._overrideAuthToken=typeof i=="string"?i:Lh(i,r.app.options.projectId))}class ec{constructor(t,e,n,s,i,o=!1){this.app=t,this._authProvider=e,this._appCheckProvider=n,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=jm,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=GI,this._maxUploadRetryTime=$I,this._requests=new Set,s!=null?this._bucket=Ot.makeFromBucketSpec(s,this._host):this._bucket=xh(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=Ot.makeFromBucketSpec(this._url,t):this._bucket=xh(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){Ma("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){Ma("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const e=await t.getToken();if(e!==null)return e.accessToken}return null}async _getAppCheckToken(){if(Gh(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new Vn(this,t)}_makeRequest(t,e,n,s,i=!0){if(this._deleted)return new sE(Qm());{const o=pE(t,this._appId,n,s,e,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(t,e){const[n,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,e,n,s).getPromise()}}const Dh="@firebase/storage",kh="0.13.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dp="storage";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cw(r,t){return r=Z(r),XE(r,t)}function lw(r,t,e){return r=Z(r),ap(r,t,e)}function hw(r,t,e,n){return r=Z(r),ZE(r,t,e,n)}function dw(r,t,e){return r=Z(r),YE(r,t,e)}function fw(r){return r=Z(r),ew(r)}function mw(r,t){return r=Z(r),nw(r,t)}function pw(r,t){return r=Z(r),cp(r,t)}function gw(r){return r=Z(r),tw(r)}function _w(r){return r=Z(r),rw(r)}function yw(r){return r=Z(r),sw(r)}function Tw(r,t){return r=Z(r),aw(r,t)}function Iw(r,t){return lp(r,t)}function Ew(r=Nh(),t){r=Z(r);const n=La(r,dp).getImmediate({identifier:t}),s=Oh("storage");return s&&fp(n,...s),n}function fp(r,t,e,n={}){uw(r,t,e,n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ww(r,t){return r=Z(r),JE(r,t)}function vw(r,t){throw new Error("getStream() is only supported by NodeJS builds")}function Aw(r,{instanceIdentifier:t}){const e=r.getProvider("app").getImmediate(),n=r.getProvider("auth-internal"),s=r.getProvider("app-check-internal");return new ec(e,n,s,t,Bh)}function Rw(){jh(new zh(dp,Aw,"PUBLIC").setMultipleInstances(!0)),Di(Dh,kh,""),Di(Dh,kh,"esm2017")}Rw();const Vw=Object.freeze(Object.defineProperty({__proto__:null,StorageError:mt,get StorageErrorCode(){return at},StringFormat:Yt,_FbsBlob:ae,_Location:Ot,_TaskEvent:zE,_TaskState:jt,_UploadTask:op,_dataFromString:Xu,_getChild:Iw,_invalidArgument:Hi,_invalidRootOperation:Wm,connectStorageEmulator:fp,deleteObject:yw,getBlob:ww,getBytes:cw,getDownloadURL:_w,getMetadata:fw,getStorage:Ew,getStream:vw,list:pw,listAll:gw,ref:Tw,updateMetadata:mw,uploadBytes:lw,uploadBytesResumable:dw,uploadString:hw},Symbol.toStringTag,{value:"Module"}));export{Ew as a,Fa as b,yT as c,_m as d,nI as e,iI as f,vT as g,lI as h,hI as i,uI as j,OI as k,jT as l,Tw as m,_w as n,BT as o,lw as p,MT as q,SI as r,CI as s,yw as t,cI as u,Sw as v,LT as w,Vw as x};
