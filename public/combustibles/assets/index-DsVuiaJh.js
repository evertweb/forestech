(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const u of o)if(u.type==="childList")for(const f of u.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function n(o){const u={};return o.integrity&&(u.integrity=o.integrity),o.referrerPolicy&&(u.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?u.credentials="include":o.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(o){if(o.ep)return;o.ep=!0;const u=n(o);fetch(o.href,u)}})();var Tm={exports:{}},Ll={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wv;function gI(){if(Wv)return Ll;Wv=1;var i=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function n(s,o,u){var f=null;if(u!==void 0&&(f=""+u),o.key!==void 0&&(f=""+o.key),"key"in o){u={};for(var m in o)m!=="key"&&(u[m]=o[m])}else u=o;return o=u.ref,{$$typeof:i,type:s,key:f,ref:o!==void 0?o:null,props:u}}return Ll.Fragment=e,Ll.jsx=n,Ll.jsxs=n,Ll}var Jv;function yI(){return Jv||(Jv=1,Tm.exports=gI()),Tm.exports}var E=yI(),Em={exports:{}},we={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eT;function _I(){if(eT)return we;eT=1;var i=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),f=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),y=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),S=Symbol.iterator;function w(O){return O===null||typeof O!="object"?null:(O=S&&O[S]||O["@@iterator"],typeof O=="function"?O:null)}var P={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},k=Object.assign,K={};function q(O,J,re){this.props=O,this.context=J,this.refs=K,this.updater=re||P}q.prototype.isReactComponent={},q.prototype.setState=function(O,J){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,J,"setState")},q.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function ne(){}ne.prototype=q.prototype;function se(O,J,re){this.props=O,this.context=J,this.refs=K,this.updater=re||P}var le=se.prototype=new ne;le.constructor=se,k(le,q.prototype),le.isPureReactComponent=!0;var fe=Array.isArray,de={H:null,A:null,T:null,S:null,V:null},Se=Object.prototype.hasOwnProperty;function V(O,J,re,ee,pe,Ce){return re=Ce.ref,{$$typeof:i,type:O,key:J,ref:re!==void 0?re:null,props:Ce}}function I(O,J){return V(O.type,J,void 0,void 0,void 0,O.props)}function C(O){return typeof O=="object"&&O!==null&&O.$$typeof===i}function D(O){var J={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(re){return J[re]})}var x=/\/+/g;function U(O,J){return typeof O=="object"&&O!==null&&O.key!=null?D(""+O.key):J.toString(36)}function N(){}function Pt(O){switch(O.status){case"fulfilled":return O.value;case"rejected":throw O.reason;default:switch(typeof O.status=="string"?O.then(N,N):(O.status="pending",O.then(function(J){O.status==="pending"&&(O.status="fulfilled",O.value=J)},function(J){O.status==="pending"&&(O.status="rejected",O.reason=J)})),O.status){case"fulfilled":return O.value;case"rejected":throw O.reason}}throw O}function at(O,J,re,ee,pe){var Ce=typeof O;(Ce==="undefined"||Ce==="boolean")&&(O=null);var Ee=!1;if(O===null)Ee=!0;else switch(Ce){case"bigint":case"string":case"number":Ee=!0;break;case"object":switch(O.$$typeof){case i:case e:Ee=!0;break;case T:return Ee=O._init,at(Ee(O._payload),J,re,ee,pe)}}if(Ee)return pe=pe(O),Ee=ee===""?"."+U(O,0):ee,fe(pe)?(re="",Ee!=null&&(re=Ee.replace(x,"$&/")+"/"),at(pe,J,re,"",function(ti){return ti})):pe!=null&&(C(pe)&&(pe=I(pe,re+(pe.key==null||O&&O.key===pe.key?"":(""+pe.key).replace(x,"$&/")+"/")+Ee)),J.push(pe)),1;Ee=0;var Nt=ee===""?".":ee+":";if(fe(O))for(var We=0;We<O.length;We++)ee=O[We],Ce=Nt+U(ee,We),Ee+=at(ee,J,re,Ce,pe);else if(We=w(O),typeof We=="function")for(O=We.call(O),We=0;!(ee=O.next()).done;)ee=ee.value,Ce=Nt+U(ee,We++),Ee+=at(ee,J,re,Ce,pe);else if(Ce==="object"){if(typeof O.then=="function")return at(Pt(O),J,re,ee,pe);throw J=String(O),Error("Objects are not valid as a React child (found: "+(J==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":J)+"). If you meant to render a collection of children, use an array instead.")}return Ee}function Y(O,J,re){if(O==null)return O;var ee=[],pe=0;return at(O,ee,"","",function(Ce){return J.call(re,Ce,pe++)}),ee}function ie(O){if(O._status===-1){var J=O._result;J=J(),J.then(function(re){(O._status===0||O._status===-1)&&(O._status=1,O._result=re)},function(re){(O._status===0||O._status===-1)&&(O._status=2,O._result=re)}),O._status===-1&&(O._status=0,O._result=J)}if(O._status===1)return O._result.default;throw O._result}var he=typeof reportError=="function"?reportError:function(O){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var J=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof O=="object"&&O!==null&&typeof O.message=="string"?String(O.message):String(O),error:O});if(!window.dispatchEvent(J))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",O);return}console.error(O)};function ze(){}return we.Children={map:Y,forEach:function(O,J,re){Y(O,function(){J.apply(this,arguments)},re)},count:function(O){var J=0;return Y(O,function(){J++}),J},toArray:function(O){return Y(O,function(J){return J})||[]},only:function(O){if(!C(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},we.Component=q,we.Fragment=n,we.Profiler=o,we.PureComponent=se,we.StrictMode=s,we.Suspense=p,we.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=de,we.__COMPILER_RUNTIME={__proto__:null,c:function(O){return de.H.useMemoCache(O)}},we.cache=function(O){return function(){return O.apply(null,arguments)}},we.cloneElement=function(O,J,re){if(O==null)throw Error("The argument must be a React element, but you passed "+O+".");var ee=k({},O.props),pe=O.key,Ce=void 0;if(J!=null)for(Ee in J.ref!==void 0&&(Ce=void 0),J.key!==void 0&&(pe=""+J.key),J)!Se.call(J,Ee)||Ee==="key"||Ee==="__self"||Ee==="__source"||Ee==="ref"&&J.ref===void 0||(ee[Ee]=J[Ee]);var Ee=arguments.length-2;if(Ee===1)ee.children=re;else if(1<Ee){for(var Nt=Array(Ee),We=0;We<Ee;We++)Nt[We]=arguments[We+2];ee.children=Nt}return V(O.type,pe,void 0,void 0,Ce,ee)},we.createContext=function(O){return O={$$typeof:f,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null},O.Provider=O,O.Consumer={$$typeof:u,_context:O},O},we.createElement=function(O,J,re){var ee,pe={},Ce=null;if(J!=null)for(ee in J.key!==void 0&&(Ce=""+J.key),J)Se.call(J,ee)&&ee!=="key"&&ee!=="__self"&&ee!=="__source"&&(pe[ee]=J[ee]);var Ee=arguments.length-2;if(Ee===1)pe.children=re;else if(1<Ee){for(var Nt=Array(Ee),We=0;We<Ee;We++)Nt[We]=arguments[We+2];pe.children=Nt}if(O&&O.defaultProps)for(ee in Ee=O.defaultProps,Ee)pe[ee]===void 0&&(pe[ee]=Ee[ee]);return V(O,Ce,void 0,void 0,null,pe)},we.createRef=function(){return{current:null}},we.forwardRef=function(O){return{$$typeof:m,render:O}},we.isValidElement=C,we.lazy=function(O){return{$$typeof:T,_payload:{_status:-1,_result:O},_init:ie}},we.memo=function(O,J){return{$$typeof:y,type:O,compare:J===void 0?null:J}},we.startTransition=function(O){var J=de.T,re={};de.T=re;try{var ee=O(),pe=de.S;pe!==null&&pe(re,ee),typeof ee=="object"&&ee!==null&&typeof ee.then=="function"&&ee.then(ze,he)}catch(Ce){he(Ce)}finally{de.T=J}},we.unstable_useCacheRefresh=function(){return de.H.useCacheRefresh()},we.use=function(O){return de.H.use(O)},we.useActionState=function(O,J,re){return de.H.useActionState(O,J,re)},we.useCallback=function(O,J){return de.H.useCallback(O,J)},we.useContext=function(O){return de.H.useContext(O)},we.useDebugValue=function(){},we.useDeferredValue=function(O,J){return de.H.useDeferredValue(O,J)},we.useEffect=function(O,J,re){var ee=de.H;if(typeof re=="function")throw Error("useEffect CRUD overload is not enabled in this build of React.");return ee.useEffect(O,J)},we.useId=function(){return de.H.useId()},we.useImperativeHandle=function(O,J,re){return de.H.useImperativeHandle(O,J,re)},we.useInsertionEffect=function(O,J){return de.H.useInsertionEffect(O,J)},we.useLayoutEffect=function(O,J){return de.H.useLayoutEffect(O,J)},we.useMemo=function(O,J){return de.H.useMemo(O,J)},we.useOptimistic=function(O,J){return de.H.useOptimistic(O,J)},we.useReducer=function(O,J,re){return de.H.useReducer(O,J,re)},we.useRef=function(O){return de.H.useRef(O)},we.useState=function(O){return de.H.useState(O)},we.useSyncExternalStore=function(O,J,re){return de.H.useSyncExternalStore(O,J,re)},we.useTransition=function(){return de.H.useTransition()},we.version="19.1.0",we}var tT;function Ip(){return tT||(tT=1,Em.exports=_I()),Em.exports}var je=Ip(),Am={exports:{}},jl={},bm={exports:{}},Sm={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nT;function vI(){return nT||(nT=1,function(i){function e(Y,ie){var he=Y.length;Y.push(ie);e:for(;0<he;){var ze=he-1>>>1,O=Y[ze];if(0<o(O,ie))Y[ze]=ie,Y[he]=O,he=ze;else break e}}function n(Y){return Y.length===0?null:Y[0]}function s(Y){if(Y.length===0)return null;var ie=Y[0],he=Y.pop();if(he!==ie){Y[0]=he;e:for(var ze=0,O=Y.length,J=O>>>1;ze<J;){var re=2*(ze+1)-1,ee=Y[re],pe=re+1,Ce=Y[pe];if(0>o(ee,he))pe<O&&0>o(Ce,ee)?(Y[ze]=Ce,Y[pe]=he,ze=pe):(Y[ze]=ee,Y[re]=he,ze=re);else if(pe<O&&0>o(Ce,he))Y[ze]=Ce,Y[pe]=he,ze=pe;else break e}}return ie}function o(Y,ie){var he=Y.sortIndex-ie.sortIndex;return he!==0?he:Y.id-ie.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;i.unstable_now=function(){return u.now()}}else{var f=Date,m=f.now();i.unstable_now=function(){return f.now()-m}}var p=[],y=[],T=1,S=null,w=3,P=!1,k=!1,K=!1,q=!1,ne=typeof setTimeout=="function"?setTimeout:null,se=typeof clearTimeout=="function"?clearTimeout:null,le=typeof setImmediate<"u"?setImmediate:null;function fe(Y){for(var ie=n(y);ie!==null;){if(ie.callback===null)s(y);else if(ie.startTime<=Y)s(y),ie.sortIndex=ie.expirationTime,e(p,ie);else break;ie=n(y)}}function de(Y){if(K=!1,fe(Y),!k)if(n(p)!==null)k=!0,Se||(Se=!0,U());else{var ie=n(y);ie!==null&&at(de,ie.startTime-Y)}}var Se=!1,V=-1,I=5,C=-1;function D(){return q?!0:!(i.unstable_now()-C<I)}function x(){if(q=!1,Se){var Y=i.unstable_now();C=Y;var ie=!0;try{e:{k=!1,K&&(K=!1,se(V),V=-1),P=!0;var he=w;try{t:{for(fe(Y),S=n(p);S!==null&&!(S.expirationTime>Y&&D());){var ze=S.callback;if(typeof ze=="function"){S.callback=null,w=S.priorityLevel;var O=ze(S.expirationTime<=Y);if(Y=i.unstable_now(),typeof O=="function"){S.callback=O,fe(Y),ie=!0;break t}S===n(p)&&s(p),fe(Y)}else s(p);S=n(p)}if(S!==null)ie=!0;else{var J=n(y);J!==null&&at(de,J.startTime-Y),ie=!1}}break e}finally{S=null,w=he,P=!1}ie=void 0}}finally{ie?U():Se=!1}}}var U;if(typeof le=="function")U=function(){le(x)};else if(typeof MessageChannel<"u"){var N=new MessageChannel,Pt=N.port2;N.port1.onmessage=x,U=function(){Pt.postMessage(null)}}else U=function(){ne(x,0)};function at(Y,ie){V=ne(function(){Y(i.unstable_now())},ie)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(Y){Y.callback=null},i.unstable_forceFrameRate=function(Y){0>Y||125<Y?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<Y?Math.floor(1e3/Y):5},i.unstable_getCurrentPriorityLevel=function(){return w},i.unstable_next=function(Y){switch(w){case 1:case 2:case 3:var ie=3;break;default:ie=w}var he=w;w=ie;try{return Y()}finally{w=he}},i.unstable_requestPaint=function(){q=!0},i.unstable_runWithPriority=function(Y,ie){switch(Y){case 1:case 2:case 3:case 4:case 5:break;default:Y=3}var he=w;w=Y;try{return ie()}finally{w=he}},i.unstable_scheduleCallback=function(Y,ie,he){var ze=i.unstable_now();switch(typeof he=="object"&&he!==null?(he=he.delay,he=typeof he=="number"&&0<he?ze+he:ze):he=ze,Y){case 1:var O=-1;break;case 2:O=250;break;case 5:O=1073741823;break;case 4:O=1e4;break;default:O=5e3}return O=he+O,Y={id:T++,callback:ie,priorityLevel:Y,startTime:he,expirationTime:O,sortIndex:-1},he>ze?(Y.sortIndex=he,e(y,Y),n(p)===null&&Y===n(y)&&(K?(se(V),V=-1):K=!0,at(de,he-ze))):(Y.sortIndex=O,e(p,Y),k||P||(k=!0,Se||(Se=!0,U()))),Y},i.unstable_shouldYield=D,i.unstable_wrapCallback=function(Y){var ie=w;return function(){var he=w;w=ie;try{return Y.apply(this,arguments)}finally{w=he}}}}(Sm)),Sm}var iT;function TI(){return iT||(iT=1,bm.exports=vI()),bm.exports}var wm={exports:{}},Yt={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rT;function EI(){if(rT)return Yt;rT=1;var i=Ip();function e(p){var y="https://react.dev/errors/"+p;if(1<arguments.length){y+="?args[]="+encodeURIComponent(arguments[1]);for(var T=2;T<arguments.length;T++)y+="&args[]="+encodeURIComponent(arguments[T])}return"Minified React error #"+p+"; visit "+y+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function n(){}var s={d:{f:n,r:function(){throw Error(e(522))},D:n,C:n,L:n,m:n,X:n,S:n,M:n},p:0,findDOMNode:null},o=Symbol.for("react.portal");function u(p,y,T){var S=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:S==null?null:""+S,children:p,containerInfo:y,implementation:T}}var f=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(p,y){if(p==="font")return"";if(typeof y=="string")return y==="use-credentials"?y:""}return Yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Yt.createPortal=function(p,y){var T=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!y||y.nodeType!==1&&y.nodeType!==9&&y.nodeType!==11)throw Error(e(299));return u(p,y,null,T)},Yt.flushSync=function(p){var y=f.T,T=s.p;try{if(f.T=null,s.p=2,p)return p()}finally{f.T=y,s.p=T,s.d.f()}},Yt.preconnect=function(p,y){typeof p=="string"&&(y?(y=y.crossOrigin,y=typeof y=="string"?y==="use-credentials"?y:"":void 0):y=null,s.d.C(p,y))},Yt.prefetchDNS=function(p){typeof p=="string"&&s.d.D(p)},Yt.preinit=function(p,y){if(typeof p=="string"&&y&&typeof y.as=="string"){var T=y.as,S=m(T,y.crossOrigin),w=typeof y.integrity=="string"?y.integrity:void 0,P=typeof y.fetchPriority=="string"?y.fetchPriority:void 0;T==="style"?s.d.S(p,typeof y.precedence=="string"?y.precedence:void 0,{crossOrigin:S,integrity:w,fetchPriority:P}):T==="script"&&s.d.X(p,{crossOrigin:S,integrity:w,fetchPriority:P,nonce:typeof y.nonce=="string"?y.nonce:void 0})}},Yt.preinitModule=function(p,y){if(typeof p=="string")if(typeof y=="object"&&y!==null){if(y.as==null||y.as==="script"){var T=m(y.as,y.crossOrigin);s.d.M(p,{crossOrigin:T,integrity:typeof y.integrity=="string"?y.integrity:void 0,nonce:typeof y.nonce=="string"?y.nonce:void 0})}}else y==null&&s.d.M(p)},Yt.preload=function(p,y){if(typeof p=="string"&&typeof y=="object"&&y!==null&&typeof y.as=="string"){var T=y.as,S=m(T,y.crossOrigin);s.d.L(p,T,{crossOrigin:S,integrity:typeof y.integrity=="string"?y.integrity:void 0,nonce:typeof y.nonce=="string"?y.nonce:void 0,type:typeof y.type=="string"?y.type:void 0,fetchPriority:typeof y.fetchPriority=="string"?y.fetchPriority:void 0,referrerPolicy:typeof y.referrerPolicy=="string"?y.referrerPolicy:void 0,imageSrcSet:typeof y.imageSrcSet=="string"?y.imageSrcSet:void 0,imageSizes:typeof y.imageSizes=="string"?y.imageSizes:void 0,media:typeof y.media=="string"?y.media:void 0})}},Yt.preloadModule=function(p,y){if(typeof p=="string")if(y){var T=m(y.as,y.crossOrigin);s.d.m(p,{as:typeof y.as=="string"&&y.as!=="script"?y.as:void 0,crossOrigin:T,integrity:typeof y.integrity=="string"?y.integrity:void 0})}else s.d.m(p)},Yt.requestFormReset=function(p){s.d.r(p)},Yt.unstable_batchedUpdates=function(p,y){return p(y)},Yt.useFormState=function(p,y,T){return f.H.useFormState(p,y,T)},Yt.useFormStatus=function(){return f.H.useHostTransitionStatus()},Yt.version="19.1.0",Yt}var sT;function AI(){if(sT)return wm.exports;sT=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(e){console.error(e)}}return i(),wm.exports=EI(),wm.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var aT;function bI(){if(aT)return jl;aT=1;var i=TI(),e=Ip(),n=AI();function s(t){var r="https://react.dev/errors/"+t;if(1<arguments.length){r+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)r+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){var r=t,a=t;if(t.alternate)for(;r.return;)r=r.return;else{t=r;do r=t,(r.flags&4098)!==0&&(a=r.return),t=r.return;while(t)}return r.tag===3?a:null}function f(t){if(t.tag===13){var r=t.memoizedState;if(r===null&&(t=t.alternate,t!==null&&(r=t.memoizedState)),r!==null)return r.dehydrated}return null}function m(t){if(u(t)!==t)throw Error(s(188))}function p(t){var r=t.alternate;if(!r){if(r=u(t),r===null)throw Error(s(188));return r!==t?null:t}for(var a=t,l=r;;){var h=a.return;if(h===null)break;var d=h.alternate;if(d===null){if(l=h.return,l!==null){a=l;continue}break}if(h.child===d.child){for(d=h.child;d;){if(d===a)return m(h),t;if(d===l)return m(h),r;d=d.sibling}throw Error(s(188))}if(a.return!==l.return)a=h,l=d;else{for(var v=!1,A=h.child;A;){if(A===a){v=!0,a=h,l=d;break}if(A===l){v=!0,l=h,a=d;break}A=A.sibling}if(!v){for(A=d.child;A;){if(A===a){v=!0,a=d,l=h;break}if(A===l){v=!0,l=d,a=h;break}A=A.sibling}if(!v)throw Error(s(189))}}if(a.alternate!==l)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?t:r}function y(t){var r=t.tag;if(r===5||r===26||r===27||r===6)return t;for(t=t.child;t!==null;){if(r=y(t),r!==null)return r;t=t.sibling}return null}var T=Object.assign,S=Symbol.for("react.element"),w=Symbol.for("react.transitional.element"),P=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),K=Symbol.for("react.strict_mode"),q=Symbol.for("react.profiler"),ne=Symbol.for("react.provider"),se=Symbol.for("react.consumer"),le=Symbol.for("react.context"),fe=Symbol.for("react.forward_ref"),de=Symbol.for("react.suspense"),Se=Symbol.for("react.suspense_list"),V=Symbol.for("react.memo"),I=Symbol.for("react.lazy"),C=Symbol.for("react.activity"),D=Symbol.for("react.memo_cache_sentinel"),x=Symbol.iterator;function U(t){return t===null||typeof t!="object"?null:(t=x&&t[x]||t["@@iterator"],typeof t=="function"?t:null)}var N=Symbol.for("react.client.reference");function Pt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===N?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case k:return"Fragment";case q:return"Profiler";case K:return"StrictMode";case de:return"Suspense";case Se:return"SuspenseList";case C:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case P:return"Portal";case le:return(t.displayName||"Context")+".Provider";case se:return(t._context.displayName||"Context")+".Consumer";case fe:var r=t.render;return t=t.displayName,t||(t=r.displayName||r.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case V:return r=t.displayName||null,r!==null?r:Pt(t.type)||"Memo";case I:r=t._payload,t=t._init;try{return Pt(t(r))}catch{}}return null}var at=Array.isArray,Y=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ie=n.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,he={pending:!1,data:null,method:null,action:null},ze=[],O=-1;function J(t){return{current:t}}function re(t){0>O||(t.current=ze[O],ze[O]=null,O--)}function ee(t,r){O++,ze[O]=t.current,t.current=r}var pe=J(null),Ce=J(null),Ee=J(null),Nt=J(null);function We(t,r){switch(ee(Ee,r),ee(Ce,t),ee(pe,null),r.nodeType){case 9:case 11:t=(t=r.documentElement)&&(t=t.namespaceURI)?Iv(t):0;break;default:if(t=r.tagName,r=r.namespaceURI)r=Iv(r),t=Rv(r,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}re(pe),ee(pe,t)}function ti(){re(pe),re(Ce),re(Ee)}function ur(t){t.memoizedState!==null&&ee(Nt,t);var r=pe.current,a=Rv(r,t.type);r!==a&&(ee(Ce,t),ee(pe,a))}function Ii(t){Ce.current===t&&(re(pe),re(Ce)),Nt.current===t&&(re(Nt),xl._currentValue=he)}var cs=Object.prototype.hasOwnProperty,hs=i.unstable_scheduleCallback,fs=i.unstable_cancelCallback,Do=i.unstable_shouldYield,wu=i.unstable_requestPaint,Rn=i.unstable_now,Tf=i.unstable_getCurrentPriorityLevel,Oo=i.unstable_ImmediatePriority,la=i.unstable_UserBlockingPriority,ds=i.unstable_NormalPriority,Ef=i.unstable_LowPriority,ua=i.unstable_IdlePriority,Mo=i.log,Iu=i.unstable_setDisableYieldValue,ot=null,He=null;function mn(t){if(typeof Mo=="function"&&Iu(t),He&&typeof He.setStrictMode=="function")try{He.setStrictMode(ot,t)}catch{}}var Gt=Math.clz32?Math.clz32:ms,Ru=Math.log,Af=Math.LN2;function ms(t){return t>>>=0,t===0?32:31-(Ru(t)/Af|0)|0}var ps=256,gs=4194304;function Fn(t){var r=t&42;if(r!==0)return r;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194048;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function ca(t,r,a){var l=t.pendingLanes;if(l===0)return 0;var h=0,d=t.suspendedLanes,v=t.pingedLanes;t=t.warmLanes;var A=l&134217727;return A!==0?(l=A&~d,l!==0?h=Fn(l):(v&=A,v!==0?h=Fn(v):a||(a=A&~t,a!==0&&(h=Fn(a))))):(A=l&~d,A!==0?h=Fn(A):v!==0?h=Fn(v):a||(a=l&~t,a!==0&&(h=Fn(a)))),h===0?0:r!==0&&r!==h&&(r&d)===0&&(d=h&-h,a=r&-r,d>=a||d===32&&(a&4194048)!==0)?r:h}function ys(t,r){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&r)===0}function xo(t,r){switch(t){case 1:case 2:case 4:case 8:case 64:return r+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vo(){var t=ps;return ps<<=1,(ps&4194048)===0&&(ps=256),t}function ko(){var t=gs;return gs<<=1,(gs&62914560)===0&&(gs=4194304),t}function Ri(t){for(var r=[],a=0;31>a;a++)r.push(t);return r}function Ci(t,r){t.pendingLanes|=r,r!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Po(t,r,a,l,h,d){var v=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var A=t.entanglements,R=t.expirationTimes,B=t.hiddenUpdates;for(a=v&~a;0<a;){var Q=31-Gt(a),X=1<<Q;A[Q]=0,R[Q]=-1;var F=B[Q];if(F!==null)for(B[Q]=null,Q=0;Q<F.length;Q++){var H=F[Q];H!==null&&(H.lane&=-536870913)}a&=~X}l!==0&&ni(t,l,0),d!==0&&h===0&&t.tag!==0&&(t.suspendedLanes|=d&~(v&~r))}function ni(t,r,a){t.pendingLanes|=r,t.suspendedLanes&=~r;var l=31-Gt(r);t.entangledLanes|=r,t.entanglements[l]=t.entanglements[l]|1073741824|a&4194090}function Uo(t,r){var a=t.entangledLanes|=r;for(t=t.entanglements;a;){var l=31-Gt(a),h=1<<l;h&r|t[l]&r&&(t[l]|=r),a&=~h}}function cr(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function ha(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function hr(){var t=ie.p;return t!==0?t:(t=window.event,t===void 0?32:Kv(t.type))}function Cu(t,r){var a=ie.p;try{return ie.p=t,r()}finally{ie.p=a}}var tt=Math.random().toString(36).slice(2),Et="__reactFiber$"+tt,pt="__reactProps$"+tt,Cn="__reactContainer$"+tt,Lo="__reactEvents$"+tt,bf="__reactListeners$"+tt,fr="__reactHandles$"+tt,Nu="__reactResources$"+tt,_s="__reactMarker$"+tt;function dr(t){delete t[Et],delete t[pt],delete t[Lo],delete t[bf],delete t[fr]}function Ni(t){var r=t[Et];if(r)return r;for(var a=t.parentNode;a;){if(r=a[Cn]||a[Et]){if(a=r.alternate,r.child!==null||a!==null&&a.child!==null)for(t=Ov(t);t!==null;){if(a=t[Et])return a;t=Ov(t)}return r}t=a,a=t.parentNode}return null}function ii(t){if(t=t[Et]||t[Cn]){var r=t.tag;if(r===5||r===6||r===13||r===26||r===27||r===3)return t}return null}function ri(t){var r=t.tag;if(r===5||r===26||r===27||r===6)return t.stateNode;throw Error(s(33))}function tn(t){var r=t[Nu];return r||(r=t[Nu]={hoistableStyles:new Map,hoistableScripts:new Map}),r}function ct(t){t[_s]=!0}var jo=new Set,fa={};function Hn(t,r){Di(t,r),Di(t+"Capture",r)}function Di(t,r){for(fa[t]=r,t=0;t<r.length;t++)jo.add(r[t])}var Du=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Ou={},vs={};function Mu(t){return cs.call(vs,t)?!0:cs.call(Ou,t)?!1:Du.test(t)?vs[t]=!0:(Ou[t]=!0,!1)}function mr(t,r,a){if(Mu(r))if(a===null)t.removeAttribute(r);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(r);return;case"boolean":var l=r.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){t.removeAttribute(r);return}}t.setAttribute(r,""+a)}}function si(t,r,a){if(a===null)t.removeAttribute(r);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(r);return}t.setAttribute(r,""+a)}}function Ut(t,r,a,l){if(l===null)t.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(r,a,""+l)}}var Ts,xu;function Oi(t){if(Ts===void 0)try{throw Error()}catch(a){var r=a.stack.trim().match(/\n( *(at )?)/);Ts=r&&r[1]||"",xu=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ts+t+xu}var da=!1;function ma(t,r){if(!t||da)return"";da=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(r){var X=function(){throw Error()};if(Object.defineProperty(X.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(X,[])}catch(H){var F=H}Reflect.construct(t,[],X)}else{try{X.call()}catch(H){F=H}t.call(X.prototype)}}else{try{throw Error()}catch(H){F=H}(X=t())&&typeof X.catch=="function"&&X.catch(function(){})}}catch(H){if(H&&F&&typeof H.stack=="string")return[H.stack,F.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var h=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");h&&h.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var d=l.DetermineComponentFrameRoot(),v=d[0],A=d[1];if(v&&A){var R=v.split(`
`),B=A.split(`
`);for(h=l=0;l<R.length&&!R[l].includes("DetermineComponentFrameRoot");)l++;for(;h<B.length&&!B[h].includes("DetermineComponentFrameRoot");)h++;if(l===R.length||h===B.length)for(l=R.length-1,h=B.length-1;1<=l&&0<=h&&R[l]!==B[h];)h--;for(;1<=l&&0<=h;l--,h--)if(R[l]!==B[h]){if(l!==1||h!==1)do if(l--,h--,0>h||R[l]!==B[h]){var Q=`
`+R[l].replace(" at new "," at ");return t.displayName&&Q.includes("<anonymous>")&&(Q=Q.replace("<anonymous>",t.displayName)),Q}while(1<=l&&0<=h);break}}}finally{da=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Oi(a):""}function zo(t){switch(t.tag){case 26:case 27:case 5:return Oi(t.type);case 16:return Oi("Lazy");case 13:return Oi("Suspense");case 19:return Oi("SuspenseList");case 0:case 15:return ma(t.type,!1);case 11:return ma(t.type.render,!1);case 1:return ma(t.type,!0);case 31:return Oi("Activity");default:return""}}function pa(t){try{var r="";do r+=zo(t),t=t.return;while(t);return r}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}function nn(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Bo(t){var r=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function Sf(t){var r=Bo(t)?"checked":"value",a=Object.getOwnPropertyDescriptor(t.constructor.prototype,r),l=""+t[r];if(!t.hasOwnProperty(r)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,d=a.set;return Object.defineProperty(t,r,{configurable:!0,get:function(){return h.call(this)},set:function(v){l=""+v,d.call(this,v)}}),Object.defineProperty(t,r,{enumerable:a.enumerable}),{getValue:function(){return l},setValue:function(v){l=""+v},stopTracking:function(){t._valueTracker=null,delete t[r]}}}}function ga(t){t._valueTracker||(t._valueTracker=Sf(t))}function qo(t){if(!t)return!1;var r=t._valueTracker;if(!r)return!0;var a=r.getValue(),l="";return t&&(l=Bo(t)?t.checked?"true":"false":t.value),t=l,t!==a?(r.setValue(t),!0):!1}function Es(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var wf=/[\n"\\]/g;function gt(t){return t.replace(wf,function(r){return"\\"+r.charCodeAt(0).toString(16)+" "})}function pn(t,r,a,l,h,d,v,A){t.name="",v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"?t.type=v:t.removeAttribute("type"),r!=null?v==="number"?(r===0&&t.value===""||t.value!=r)&&(t.value=""+nn(r)):t.value!==""+nn(r)&&(t.value=""+nn(r)):v!=="submit"&&v!=="reset"||t.removeAttribute("value"),r!=null?pr(t,v,nn(r)):a!=null?pr(t,v,nn(a)):l!=null&&t.removeAttribute("value"),h==null&&d!=null&&(t.defaultChecked=!!d),h!=null&&(t.checked=h&&typeof h!="function"&&typeof h!="symbol"),A!=null&&typeof A!="function"&&typeof A!="symbol"&&typeof A!="boolean"?t.name=""+nn(A):t.removeAttribute("name")}function As(t,r,a,l,h,d,v,A){if(d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(t.type=d),r!=null||a!=null){if(!(d!=="submit"&&d!=="reset"||r!=null))return;a=a!=null?""+nn(a):"",r=r!=null?""+nn(r):a,A||r===t.value||(t.value=r),t.defaultValue=r}l=l??h,l=typeof l!="function"&&typeof l!="symbol"&&!!l,t.checked=A?t.checked:!!l,t.defaultChecked=!!l,v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"&&(t.name=v)}function pr(t,r,a){r==="number"&&Es(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function Mi(t,r,a,l){if(t=t.options,r){r={};for(var h=0;h<a.length;h++)r["$"+a[h]]=!0;for(a=0;a<t.length;a++)h=r.hasOwnProperty("$"+t[a].value),t[a].selected!==h&&(t[a].selected=h),h&&l&&(t[a].defaultSelected=!0)}else{for(a=""+nn(a),r=null,h=0;h<t.length;h++){if(t[h].value===a){t[h].selected=!0,l&&(t[h].defaultSelected=!0);return}r!==null||t[h].disabled||(r=t[h])}r!==null&&(r.selected=!0)}}function Ye(t,r,a){if(r!=null&&(r=""+nn(r),r!==t.value&&(t.value=r),a==null)){t.defaultValue!==r&&(t.defaultValue=r);return}t.defaultValue=a!=null?""+nn(a):""}function bs(t,r,a,l){if(r==null){if(l!=null){if(a!=null)throw Error(s(92));if(at(l)){if(1<l.length)throw Error(s(93));l=l[0]}a=l}a==null&&(a=""),r=a}a=nn(r),t.defaultValue=a,l=t.textContent,l===a&&l!==""&&l!==null&&(t.value=l)}function Nn(t,r){if(r){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=r;return}}t.textContent=r}var Ss=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Vu(t,r,a){var l=r.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?t.setProperty(r,""):r==="float"?t.cssFloat="":t[r]="":l?t.setProperty(r,a):typeof a!="number"||a===0||Ss.has(r)?r==="float"?t.cssFloat=a:t[r]=(""+a).trim():t[r]=a+"px"}function Fo(t,r,a){if(r!=null&&typeof r!="object")throw Error(s(62));if(t=t.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||r!=null&&r.hasOwnProperty(l)||(l.indexOf("--")===0?t.setProperty(l,""):l==="float"?t.cssFloat="":t[l]="");for(var h in r)l=r[h],r.hasOwnProperty(h)&&a[h]!==l&&Vu(t,h,l)}else for(var d in r)r.hasOwnProperty(d)&&Vu(t,d,r[d])}function Ho(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var If=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Rf=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ya(t){return Rf.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}var xi=null;function Dn(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Vi=null,ki=null;function Go(t){var r=ii(t);if(r&&(t=r.stateNode)){var a=t[pt]||null;e:switch(t=r.stateNode,r.type){case"input":if(pn(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),r=a.name,a.type==="radio"&&r!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+gt(""+r)+'"][type="radio"]'),r=0;r<a.length;r++){var l=a[r];if(l!==t&&l.form===t.form){var h=l[pt]||null;if(!h)throw Error(s(90));pn(l,h.value,h.defaultValue,h.defaultValue,h.checked,h.defaultChecked,h.type,h.name)}}for(r=0;r<a.length;r++)l=a[r],l.form===t.form&&qo(l)}break e;case"textarea":Ye(t,a.value,a.defaultValue);break e;case"select":r=a.value,r!=null&&Mi(t,!!a.multiple,r,!1)}}}var ai=!1;function ku(t,r,a){if(ai)return t(r,a);ai=!0;try{var l=t(r);return l}finally{if(ai=!1,(Vi!==null||ki!==null)&&(Cc(),Vi&&(r=Vi,t=ki,ki=Vi=null,Go(r),t)))for(r=0;r<t.length;r++)Go(t[r])}}function ws(t,r){var a=t.stateNode;if(a===null)return null;var l=a[pt]||null;if(l===null)return null;a=l[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(s(231,r,typeof a));return a}var Gn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),On=!1;if(Gn)try{var Is={};Object.defineProperty(Is,"passive",{get:function(){On=!0}}),window.addEventListener("test",Is,Is),window.removeEventListener("test",Is,Is)}catch{On=!1}var oi=null,gr=null,Pi=null;function Ko(){if(Pi)return Pi;var t,r=gr,a=r.length,l,h="value"in oi?oi.value:oi.textContent,d=h.length;for(t=0;t<a&&r[t]===h[t];t++);var v=a-t;for(l=1;l<=v&&r[a-l]===h[d-l];l++);return Pi=h.slice(t,1<l?1-l:void 0)}function li(t){var r=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&r===13&&(t=13)):t=r,t===10&&(t=13),32<=t||t===13?t:0}function ui(){return!0}function Yo(){return!1}function Dt(t){function r(a,l,h,d,v){this._reactName=a,this._targetInst=h,this.type=l,this.nativeEvent=d,this.target=v,this.currentTarget=null;for(var A in t)t.hasOwnProperty(A)&&(a=t[A],this[A]=a?a(d):d[A]);return this.isDefaultPrevented=(d.defaultPrevented!=null?d.defaultPrevented:d.returnValue===!1)?ui:Yo,this.isPropagationStopped=Yo,this}return T(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ui)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ui)},persist:function(){},isPersistent:ui}),r}var qe={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_a=Dt(qe),Rs=T({},qe,{view:0,detail:0}),Pu=Dt(Rs),va,Ta,ci,Cs=T({},Rs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Os,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ci&&(ci&&t.type==="mousemove"?(va=t.screenX-ci.screenX,Ta=t.screenY-ci.screenY):Ta=va=0,ci=t),va)},movementY:function(t){return"movementY"in t?t.movementY:Ta}}),Mn=Dt(Cs),Uu=T({},Cs,{dataTransfer:0}),Cf=Dt(Uu),Ns=T({},Rs,{relatedTarget:0}),Ea=Dt(Ns),Qo=T({},qe,{animationName:0,elapsedTime:0,pseudoElement:0}),Aa=Dt(Qo),Lu=T({},qe,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),ba=Dt(Lu),Nf=T({},qe,{data:0}),$o=Dt(Nf),Ds={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ju={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},zu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Xo(t){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(t):(t=zu[t])?!!r[t]:!1}function Os(){return Xo}var Bu=T({},Rs,{key:function(t){if(t.key){var r=Ds[t.key]||t.key;if(r!=="Unidentified")return r}return t.type==="keypress"?(t=li(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?ju[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Os,charCode:function(t){return t.type==="keypress"?li(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?li(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Sa=Dt(Bu),qu=T({},Cs,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Zo=Dt(qu),Ui=T({},Rs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Os}),Fu=Dt(Ui),Hu=T({},qe,{propertyName:0,elapsedTime:0,pseudoElement:0}),Gu=Dt(Hu),Ku=T({},Cs,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),wa=Dt(Ku),rn=T({},qe,{newState:0,oldState:0}),Yu=Dt(rn),Qu=[9,13,27,32],hi=Gn&&"CompositionEvent"in window,c=null;Gn&&"documentMode"in document&&(c=document.documentMode);var g=Gn&&"TextEvent"in window&&!c,_=Gn&&(!hi||c&&8<c&&11>=c),b=" ",j=!1;function G(t,r){switch(t){case"keyup":return Qu.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function te(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ve=!1;function At(t,r){switch(t){case"compositionend":return te(r);case"keypress":return r.which!==32?null:(j=!0,b);case"textInput":return t=r.data,t===b&&j?null:t;default:return null}}function ke(t,r){if(Ve)return t==="compositionend"||!hi&&G(t,r)?(t=Ko(),Pi=gr=oi=null,Ve=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return _&&r.locale!=="ko"?null:r.data;default:return null}}var Ot={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function bt(t){var r=t&&t.nodeName&&t.nodeName.toLowerCase();return r==="input"?!!Ot[t.type]:r==="textarea"}function Li(t,r,a,l){Vi?ki?ki.push(l):ki=[l]:Vi=l,r=Vc(r,"onChange"),0<r.length&&(a=new _a("onChange","change",null,a,l),t.push({event:a,listeners:r}))}var Lt=null,fi=null;function Wo(t){Ev(t,0)}function $u(t){var r=ri(t);if(qo(r))return t}function qg(t,r){if(t==="change")return r}var Fg=!1;if(Gn){var Df;if(Gn){var Of="oninput"in document;if(!Of){var Hg=document.createElement("div");Hg.setAttribute("oninput","return;"),Of=typeof Hg.oninput=="function"}Df=Of}else Df=!1;Fg=Df&&(!document.documentMode||9<document.documentMode)}function Gg(){Lt&&(Lt.detachEvent("onpropertychange",Kg),fi=Lt=null)}function Kg(t){if(t.propertyName==="value"&&$u(fi)){var r=[];Li(r,fi,t,Dn(t)),ku(Wo,r)}}function KS(t,r,a){t==="focusin"?(Gg(),Lt=r,fi=a,Lt.attachEvent("onpropertychange",Kg)):t==="focusout"&&Gg()}function YS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return $u(fi)}function QS(t,r){if(t==="click")return $u(r)}function $S(t,r){if(t==="input"||t==="change")return $u(r)}function XS(t,r){return t===r&&(t!==0||1/t===1/r)||t!==t&&r!==r}var gn=typeof Object.is=="function"?Object.is:XS;function Jo(t,r){if(gn(t,r))return!0;if(typeof t!="object"||t===null||typeof r!="object"||r===null)return!1;var a=Object.keys(t),l=Object.keys(r);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var h=a[l];if(!cs.call(r,h)||!gn(t[h],r[h]))return!1}return!0}function Yg(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Qg(t,r){var a=Yg(t);t=0;for(var l;a;){if(a.nodeType===3){if(l=t+a.textContent.length,t<=r&&l>=r)return{node:a,offset:r-t};t=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Yg(a)}}function $g(t,r){return t&&r?t===r?!0:t&&t.nodeType===3?!1:r&&r.nodeType===3?$g(t,r.parentNode):"contains"in t?t.contains(r):t.compareDocumentPosition?!!(t.compareDocumentPosition(r)&16):!1:!1}function Xg(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var r=Es(t.document);r instanceof t.HTMLIFrameElement;){try{var a=typeof r.contentWindow.location.href=="string"}catch{a=!1}if(a)t=r.contentWindow;else break;r=Es(t.document)}return r}function Mf(t){var r=t&&t.nodeName&&t.nodeName.toLowerCase();return r&&(r==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||r==="textarea"||t.contentEditable==="true")}var ZS=Gn&&"documentMode"in document&&11>=document.documentMode,Ia=null,xf=null,el=null,Vf=!1;function Zg(t,r,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Vf||Ia==null||Ia!==Es(l)||(l=Ia,"selectionStart"in l&&Mf(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),el&&Jo(el,l)||(el=l,l=Vc(xf,"onSelect"),0<l.length&&(r=new _a("onSelect","select",null,r,a),t.push({event:r,listeners:l}),r.target=Ia)))}function Ms(t,r){var a={};return a[t.toLowerCase()]=r.toLowerCase(),a["Webkit"+t]="webkit"+r,a["Moz"+t]="moz"+r,a}var Ra={animationend:Ms("Animation","AnimationEnd"),animationiteration:Ms("Animation","AnimationIteration"),animationstart:Ms("Animation","AnimationStart"),transitionrun:Ms("Transition","TransitionRun"),transitionstart:Ms("Transition","TransitionStart"),transitioncancel:Ms("Transition","TransitionCancel"),transitionend:Ms("Transition","TransitionEnd")},kf={},Wg={};Gn&&(Wg=document.createElement("div").style,"AnimationEvent"in window||(delete Ra.animationend.animation,delete Ra.animationiteration.animation,delete Ra.animationstart.animation),"TransitionEvent"in window||delete Ra.transitionend.transition);function xs(t){if(kf[t])return kf[t];if(!Ra[t])return t;var r=Ra[t],a;for(a in r)if(r.hasOwnProperty(a)&&a in Wg)return kf[t]=r[a];return t}var Jg=xs("animationend"),ey=xs("animationiteration"),ty=xs("animationstart"),WS=xs("transitionrun"),JS=xs("transitionstart"),ew=xs("transitioncancel"),ny=xs("transitionend"),iy=new Map,Pf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Pf.push("scrollEnd");function Kn(t,r){iy.set(t,r),Hn(r,[t])}var ry=new WeakMap;function xn(t,r){if(typeof t=="object"&&t!==null){var a=ry.get(t);return a!==void 0?a:(r={value:t,source:r,stack:pa(r)},ry.set(t,r),r)}return{value:t,source:r,stack:pa(r)}}var Vn=[],Ca=0,Uf=0;function Xu(){for(var t=Ca,r=Uf=Ca=0;r<t;){var a=Vn[r];Vn[r++]=null;var l=Vn[r];Vn[r++]=null;var h=Vn[r];Vn[r++]=null;var d=Vn[r];if(Vn[r++]=null,l!==null&&h!==null){var v=l.pending;v===null?h.next=h:(h.next=v.next,v.next=h),l.pending=h}d!==0&&sy(a,h,d)}}function Zu(t,r,a,l){Vn[Ca++]=t,Vn[Ca++]=r,Vn[Ca++]=a,Vn[Ca++]=l,Uf|=l,t.lanes|=l,t=t.alternate,t!==null&&(t.lanes|=l)}function Lf(t,r,a,l){return Zu(t,r,a,l),Wu(t)}function Na(t,r){return Zu(t,null,null,r),Wu(t)}function sy(t,r,a){t.lanes|=a;var l=t.alternate;l!==null&&(l.lanes|=a);for(var h=!1,d=t.return;d!==null;)d.childLanes|=a,l=d.alternate,l!==null&&(l.childLanes|=a),d.tag===22&&(t=d.stateNode,t===null||t._visibility&1||(h=!0)),t=d,d=d.return;return t.tag===3?(d=t.stateNode,h&&r!==null&&(h=31-Gt(a),t=d.hiddenUpdates,l=t[h],l===null?t[h]=[r]:l.push(r),r.lane=a|536870912),d):null}function Wu(t){if(50<wl)throw wl=0,Hd=null,Error(s(185));for(var r=t.return;r!==null;)t=r,r=t.return;return t.tag===3?t.stateNode:null}var Da={};function tw(t,r,a,l){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yn(t,r,a,l){return new tw(t,r,a,l)}function jf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ji(t,r){var a=t.alternate;return a===null?(a=yn(t.tag,r,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=r,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,r=t.dependencies,a.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function ay(t,r){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=r,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,r=a.dependencies,t.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext}),t}function Ju(t,r,a,l,h,d){var v=0;if(l=t,typeof t=="function")jf(t)&&(v=1);else if(typeof t=="string")v=iI(t,a,pe.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case C:return t=yn(31,a,r,h),t.elementType=C,t.lanes=d,t;case k:return Vs(a.children,h,d,r);case K:v=8,h|=24;break;case q:return t=yn(12,a,r,h|2),t.elementType=q,t.lanes=d,t;case de:return t=yn(13,a,r,h),t.elementType=de,t.lanes=d,t;case Se:return t=yn(19,a,r,h),t.elementType=Se,t.lanes=d,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case ne:case le:v=10;break e;case se:v=9;break e;case fe:v=11;break e;case V:v=14;break e;case I:v=16,l=null;break e}v=29,a=Error(s(130,t===null?"null":typeof t,"")),l=null}return r=yn(v,a,r,h),r.elementType=t,r.type=l,r.lanes=d,r}function Vs(t,r,a,l){return t=yn(7,t,l,r),t.lanes=a,t}function zf(t,r,a){return t=yn(6,t,null,r),t.lanes=a,t}function Bf(t,r,a){return r=yn(4,t.children!==null?t.children:[],t.key,r),r.lanes=a,r.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},r}var Oa=[],Ma=0,ec=null,tc=0,kn=[],Pn=0,ks=null,zi=1,Bi="";function Ps(t,r){Oa[Ma++]=tc,Oa[Ma++]=ec,ec=t,tc=r}function oy(t,r,a){kn[Pn++]=zi,kn[Pn++]=Bi,kn[Pn++]=ks,ks=t;var l=zi;t=Bi;var h=32-Gt(l)-1;l&=~(1<<h),a+=1;var d=32-Gt(r)+h;if(30<d){var v=h-h%5;d=(l&(1<<v)-1).toString(32),l>>=v,h-=v,zi=1<<32-Gt(r)+h|a<<h|l,Bi=d+t}else zi=1<<d|a<<h|l,Bi=t}function qf(t){t.return!==null&&(Ps(t,1),oy(t,1,0))}function Ff(t){for(;t===ec;)ec=Oa[--Ma],Oa[Ma]=null,tc=Oa[--Ma],Oa[Ma]=null;for(;t===ks;)ks=kn[--Pn],kn[Pn]=null,Bi=kn[--Pn],kn[Pn]=null,zi=kn[--Pn],kn[Pn]=null}var sn=null,lt=null,Be=!1,Us=null,di=!1,Hf=Error(s(519));function Ls(t){var r=Error(s(418,""));throw il(xn(r,t)),Hf}function ly(t){var r=t.stateNode,a=t.type,l=t.memoizedProps;switch(r[Et]=t,r[pt]=l,a){case"dialog":Oe("cancel",r),Oe("close",r);break;case"iframe":case"object":case"embed":Oe("load",r);break;case"video":case"audio":for(a=0;a<Rl.length;a++)Oe(Rl[a],r);break;case"source":Oe("error",r);break;case"img":case"image":case"link":Oe("error",r),Oe("load",r);break;case"details":Oe("toggle",r);break;case"input":Oe("invalid",r),As(r,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0),ga(r);break;case"select":Oe("invalid",r);break;case"textarea":Oe("invalid",r),bs(r,l.value,l.defaultValue,l.children),ga(r)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||r.textContent===""+a||l.suppressHydrationWarning===!0||wv(r.textContent,a)?(l.popover!=null&&(Oe("beforetoggle",r),Oe("toggle",r)),l.onScroll!=null&&Oe("scroll",r),l.onScrollEnd!=null&&Oe("scrollend",r),l.onClick!=null&&(r.onclick=kc),r=!0):r=!1,r||Ls(t)}function uy(t){for(sn=t.return;sn;)switch(sn.tag){case 5:case 13:di=!1;return;case 27:case 3:di=!0;return;default:sn=sn.return}}function tl(t){if(t!==sn)return!1;if(!Be)return uy(t),Be=!0,!1;var r=t.tag,a;if((a=r!==3&&r!==27)&&((a=r===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||am(t.type,t.memoizedProps)),a=!a),a&&lt&&Ls(t),uy(t),r===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));e:{for(t=t.nextSibling,r=0;t;){if(t.nodeType===8)if(a=t.data,a==="/$"){if(r===0){lt=Qn(t.nextSibling);break e}r--}else a!=="$"&&a!=="$!"&&a!=="$?"||r++;t=t.nextSibling}lt=null}}else r===27?(r=lt,Mr(t.type)?(t=cm,cm=null,lt=t):lt=r):lt=sn?Qn(t.stateNode.nextSibling):null;return!0}function nl(){lt=sn=null,Be=!1}function cy(){var t=Us;return t!==null&&(un===null?un=t:un.push.apply(un,t),Us=null),t}function il(t){Us===null?Us=[t]:Us.push(t)}var Gf=J(null),js=null,qi=null;function yr(t,r,a){ee(Gf,r._currentValue),r._currentValue=a}function Fi(t){t._currentValue=Gf.current,re(Gf)}function Kf(t,r,a){for(;t!==null;){var l=t.alternate;if((t.childLanes&r)!==r?(t.childLanes|=r,l!==null&&(l.childLanes|=r)):l!==null&&(l.childLanes&r)!==r&&(l.childLanes|=r),t===a)break;t=t.return}}function Yf(t,r,a,l){var h=t.child;for(h!==null&&(h.return=t);h!==null;){var d=h.dependencies;if(d!==null){var v=h.child;d=d.firstContext;e:for(;d!==null;){var A=d;d=h;for(var R=0;R<r.length;R++)if(A.context===r[R]){d.lanes|=a,A=d.alternate,A!==null&&(A.lanes|=a),Kf(d.return,a,t),l||(v=null);break e}d=A.next}}else if(h.tag===18){if(v=h.return,v===null)throw Error(s(341));v.lanes|=a,d=v.alternate,d!==null&&(d.lanes|=a),Kf(v,a,t),v=null}else v=h.child;if(v!==null)v.return=h;else for(v=h;v!==null;){if(v===t){v=null;break}if(h=v.sibling,h!==null){h.return=v.return,v=h;break}v=v.return}h=v}}function rl(t,r,a,l){t=null;for(var h=r,d=!1;h!==null;){if(!d){if((h.flags&524288)!==0)d=!0;else if((h.flags&262144)!==0)break}if(h.tag===10){var v=h.alternate;if(v===null)throw Error(s(387));if(v=v.memoizedProps,v!==null){var A=h.type;gn(h.pendingProps.value,v.value)||(t!==null?t.push(A):t=[A])}}else if(h===Nt.current){if(v=h.alternate,v===null)throw Error(s(387));v.memoizedState.memoizedState!==h.memoizedState.memoizedState&&(t!==null?t.push(xl):t=[xl])}h=h.return}t!==null&&Yf(r,t,a,l),r.flags|=262144}function nc(t){for(t=t.firstContext;t!==null;){if(!gn(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function zs(t){js=t,qi=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Kt(t){return hy(js,t)}function ic(t,r){return js===null&&zs(t),hy(t,r)}function hy(t,r){var a=r._currentValue;if(r={context:r,memoizedValue:a,next:null},qi===null){if(t===null)throw Error(s(308));qi=r,t.dependencies={lanes:0,firstContext:r},t.flags|=524288}else qi=qi.next=r;return a}var nw=typeof AbortController<"u"?AbortController:function(){var t=[],r=this.signal={aborted:!1,addEventListener:function(a,l){t.push(l)}};this.abort=function(){r.aborted=!0,t.forEach(function(a){return a()})}},iw=i.unstable_scheduleCallback,rw=i.unstable_NormalPriority,St={$$typeof:le,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Qf(){return{controller:new nw,data:new Map,refCount:0}}function sl(t){t.refCount--,t.refCount===0&&iw(rw,function(){t.controller.abort()})}var al=null,$f=0,xa=0,Va=null;function sw(t,r){if(al===null){var a=al=[];$f=0,xa=Zd(),Va={status:"pending",value:void 0,then:function(l){a.push(l)}}}return $f++,r.then(fy,fy),r}function fy(){if(--$f===0&&al!==null){Va!==null&&(Va.status="fulfilled");var t=al;al=null,xa=0,Va=null;for(var r=0;r<t.length;r++)(0,t[r])()}}function aw(t,r){var a=[],l={status:"pending",value:null,reason:null,then:function(h){a.push(h)}};return t.then(function(){l.status="fulfilled",l.value=r;for(var h=0;h<a.length;h++)(0,a[h])(r)},function(h){for(l.status="rejected",l.reason=h,h=0;h<a.length;h++)(0,a[h])(void 0)}),l}var dy=Y.S;Y.S=function(t,r){typeof r=="object"&&r!==null&&typeof r.then=="function"&&sw(t,r),dy!==null&&dy(t,r)};var Bs=J(null);function Xf(){var t=Bs.current;return t!==null?t:Je.pooledCache}function rc(t,r){r===null?ee(Bs,Bs.current):ee(Bs,r.pool)}function my(){var t=Xf();return t===null?null:{parent:St._currentValue,pool:t}}var ol=Error(s(460)),py=Error(s(474)),sc=Error(s(542)),Zf={then:function(){}};function gy(t){return t=t.status,t==="fulfilled"||t==="rejected"}function ac(){}function yy(t,r,a){switch(a=t[a],a===void 0?t.push(r):a!==r&&(r.then(ac,ac),r=a),r.status){case"fulfilled":return r.value;case"rejected":throw t=r.reason,vy(t),t;default:if(typeof r.status=="string")r.then(ac,ac);else{if(t=Je,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=r,t.status="pending",t.then(function(l){if(r.status==="pending"){var h=r;h.status="fulfilled",h.value=l}},function(l){if(r.status==="pending"){var h=r;h.status="rejected",h.reason=l}})}switch(r.status){case"fulfilled":return r.value;case"rejected":throw t=r.reason,vy(t),t}throw ll=r,ol}}var ll=null;function _y(){if(ll===null)throw Error(s(459));var t=ll;return ll=null,t}function vy(t){if(t===ol||t===sc)throw Error(s(483))}var _r=!1;function Wf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Jf(t,r){t=t.updateQueue,r.updateQueue===t&&(r.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function vr(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Tr(t,r,a){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(Ge&2)!==0){var h=l.pending;return h===null?r.next=r:(r.next=h.next,h.next=r),l.pending=r,r=Wu(t),sy(t,null,a),r}return Zu(t,l,r,a),Wu(t)}function ul(t,r,a){if(r=r.updateQueue,r!==null&&(r=r.shared,(a&4194048)!==0)){var l=r.lanes;l&=t.pendingLanes,a|=l,r.lanes=a,Uo(t,a)}}function ed(t,r){var a=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var h=null,d=null;if(a=a.firstBaseUpdate,a!==null){do{var v={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};d===null?h=d=v:d=d.next=v,a=a.next}while(a!==null);d===null?h=d=r:d=d.next=r}else h=d=r;a={baseState:l.baseState,firstBaseUpdate:h,lastBaseUpdate:d,shared:l.shared,callbacks:l.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=r:t.next=r,a.lastBaseUpdate=r}var td=!1;function cl(){if(td){var t=Va;if(t!==null)throw t}}function hl(t,r,a,l){td=!1;var h=t.updateQueue;_r=!1;var d=h.firstBaseUpdate,v=h.lastBaseUpdate,A=h.shared.pending;if(A!==null){h.shared.pending=null;var R=A,B=R.next;R.next=null,v===null?d=B:v.next=B,v=R;var Q=t.alternate;Q!==null&&(Q=Q.updateQueue,A=Q.lastBaseUpdate,A!==v&&(A===null?Q.firstBaseUpdate=B:A.next=B,Q.lastBaseUpdate=R))}if(d!==null){var X=h.baseState;v=0,Q=B=R=null,A=d;do{var F=A.lane&-536870913,H=F!==A.lane;if(H?(Pe&F)===F:(l&F)===F){F!==0&&F===xa&&(td=!0),Q!==null&&(Q=Q.next={lane:0,tag:A.tag,payload:A.payload,callback:null,next:null});e:{var ve=t,ge=A;F=r;var Xe=a;switch(ge.tag){case 1:if(ve=ge.payload,typeof ve=="function"){X=ve.call(Xe,X,F);break e}X=ve;break e;case 3:ve.flags=ve.flags&-65537|128;case 0:if(ve=ge.payload,F=typeof ve=="function"?ve.call(Xe,X,F):ve,F==null)break e;X=T({},X,F);break e;case 2:_r=!0}}F=A.callback,F!==null&&(t.flags|=64,H&&(t.flags|=8192),H=h.callbacks,H===null?h.callbacks=[F]:H.push(F))}else H={lane:F,tag:A.tag,payload:A.payload,callback:A.callback,next:null},Q===null?(B=Q=H,R=X):Q=Q.next=H,v|=F;if(A=A.next,A===null){if(A=h.shared.pending,A===null)break;H=A,A=H.next,H.next=null,h.lastBaseUpdate=H,h.shared.pending=null}}while(!0);Q===null&&(R=X),h.baseState=R,h.firstBaseUpdate=B,h.lastBaseUpdate=Q,d===null&&(h.shared.lanes=0),Cr|=v,t.lanes=v,t.memoizedState=X}}function Ty(t,r){if(typeof t!="function")throw Error(s(191,t));t.call(r)}function Ey(t,r){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Ty(a[t],r)}var ka=J(null),oc=J(0);function Ay(t,r){t=Xi,ee(oc,t),ee(ka,r),Xi=t|r.baseLanes}function nd(){ee(oc,Xi),ee(ka,ka.current)}function id(){Xi=oc.current,re(ka),re(oc)}var Er=0,Ie=null,Qe=null,yt=null,lc=!1,Pa=!1,qs=!1,uc=0,fl=0,Ua=null,ow=0;function ht(){throw Error(s(321))}function rd(t,r){if(r===null)return!1;for(var a=0;a<r.length&&a<t.length;a++)if(!gn(t[a],r[a]))return!1;return!0}function sd(t,r,a,l,h,d){return Er=d,Ie=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,Y.H=t===null||t.memoizedState===null?s_:a_,qs=!1,d=a(l,h),qs=!1,Pa&&(d=Sy(r,a,l,h)),by(t),d}function by(t){Y.H=pc;var r=Qe!==null&&Qe.next!==null;if(Er=0,yt=Qe=Ie=null,lc=!1,fl=0,Ua=null,r)throw Error(s(300));t===null||Mt||(t=t.dependencies,t!==null&&nc(t)&&(Mt=!0))}function Sy(t,r,a,l){Ie=t;var h=0;do{if(Pa&&(Ua=null),fl=0,Pa=!1,25<=h)throw Error(s(301));if(h+=1,yt=Qe=null,t.updateQueue!=null){var d=t.updateQueue;d.lastEffect=null,d.events=null,d.stores=null,d.memoCache!=null&&(d.memoCache.index=0)}Y.H=mw,d=r(a,l)}while(Pa);return d}function lw(){var t=Y.H,r=t.useState()[0];return r=typeof r.then=="function"?dl(r):r,t=t.useState()[0],(Qe!==null?Qe.memoizedState:null)!==t&&(Ie.flags|=1024),r}function ad(){var t=uc!==0;return uc=0,t}function od(t,r,a){r.updateQueue=t.updateQueue,r.flags&=-2053,t.lanes&=~a}function ld(t){if(lc){for(t=t.memoizedState;t!==null;){var r=t.queue;r!==null&&(r.pending=null),t=t.next}lc=!1}Er=0,yt=Qe=Ie=null,Pa=!1,fl=uc=0,Ua=null}function on(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return yt===null?Ie.memoizedState=yt=t:yt=yt.next=t,yt}function _t(){if(Qe===null){var t=Ie.alternate;t=t!==null?t.memoizedState:null}else t=Qe.next;var r=yt===null?Ie.memoizedState:yt.next;if(r!==null)yt=r,Qe=t;else{if(t===null)throw Ie.alternate===null?Error(s(467)):Error(s(310));Qe=t,t={memoizedState:Qe.memoizedState,baseState:Qe.baseState,baseQueue:Qe.baseQueue,queue:Qe.queue,next:null},yt===null?Ie.memoizedState=yt=t:yt=yt.next=t}return yt}function ud(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function dl(t){var r=fl;return fl+=1,Ua===null&&(Ua=[]),t=yy(Ua,t,r),r=Ie,(yt===null?r.memoizedState:yt.next)===null&&(r=r.alternate,Y.H=r===null||r.memoizedState===null?s_:a_),t}function cc(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return dl(t);if(t.$$typeof===le)return Kt(t)}throw Error(s(438,String(t)))}function cd(t){var r=null,a=Ie.updateQueue;if(a!==null&&(r=a.memoCache),r==null){var l=Ie.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(r={data:l.data.map(function(h){return h.slice()}),index:0})))}if(r==null&&(r={data:[],index:0}),a===null&&(a=ud(),Ie.updateQueue=a),a.memoCache=r,a=r.data[r.index],a===void 0)for(a=r.data[r.index]=Array(t),l=0;l<t;l++)a[l]=D;return r.index++,a}function Hi(t,r){return typeof r=="function"?r(t):r}function hc(t){var r=_t();return hd(r,Qe,t)}function hd(t,r,a){var l=t.queue;if(l===null)throw Error(s(311));l.lastRenderedReducer=a;var h=t.baseQueue,d=l.pending;if(d!==null){if(h!==null){var v=h.next;h.next=d.next,d.next=v}r.baseQueue=h=d,l.pending=null}if(d=t.baseState,h===null)t.memoizedState=d;else{r=h.next;var A=v=null,R=null,B=r,Q=!1;do{var X=B.lane&-536870913;if(X!==B.lane?(Pe&X)===X:(Er&X)===X){var F=B.revertLane;if(F===0)R!==null&&(R=R.next={lane:0,revertLane:0,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),X===xa&&(Q=!0);else if((Er&F)===F){B=B.next,F===xa&&(Q=!0);continue}else X={lane:0,revertLane:B.revertLane,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null},R===null?(A=R=X,v=d):R=R.next=X,Ie.lanes|=F,Cr|=F;X=B.action,qs&&a(d,X),d=B.hasEagerState?B.eagerState:a(d,X)}else F={lane:X,revertLane:B.revertLane,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null},R===null?(A=R=F,v=d):R=R.next=F,Ie.lanes|=X,Cr|=X;B=B.next}while(B!==null&&B!==r);if(R===null?v=d:R.next=A,!gn(d,t.memoizedState)&&(Mt=!0,Q&&(a=Va,a!==null)))throw a;t.memoizedState=d,t.baseState=v,t.baseQueue=R,l.lastRenderedState=d}return h===null&&(l.lanes=0),[t.memoizedState,l.dispatch]}function fd(t){var r=_t(),a=r.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=t;var l=a.dispatch,h=a.pending,d=r.memoizedState;if(h!==null){a.pending=null;var v=h=h.next;do d=t(d,v.action),v=v.next;while(v!==h);gn(d,r.memoizedState)||(Mt=!0),r.memoizedState=d,r.baseQueue===null&&(r.baseState=d),a.lastRenderedState=d}return[d,l]}function wy(t,r,a){var l=Ie,h=_t(),d=Be;if(d){if(a===void 0)throw Error(s(407));a=a()}else a=r();var v=!gn((Qe||h).memoizedState,a);v&&(h.memoizedState=a,Mt=!0),h=h.queue;var A=Cy.bind(null,l,h,t);if(ml(2048,8,A,[t]),h.getSnapshot!==r||v||yt!==null&&yt.memoizedState.tag&1){if(l.flags|=2048,La(9,fc(),Ry.bind(null,l,h,a,r),null),Je===null)throw Error(s(349));d||(Er&124)!==0||Iy(l,r,a)}return a}function Iy(t,r,a){t.flags|=16384,t={getSnapshot:r,value:a},r=Ie.updateQueue,r===null?(r=ud(),Ie.updateQueue=r,r.stores=[t]):(a=r.stores,a===null?r.stores=[t]:a.push(t))}function Ry(t,r,a,l){r.value=a,r.getSnapshot=l,Ny(r)&&Dy(t)}function Cy(t,r,a){return a(function(){Ny(r)&&Dy(t)})}function Ny(t){var r=t.getSnapshot;t=t.value;try{var a=r();return!gn(t,a)}catch{return!0}}function Dy(t){var r=Na(t,2);r!==null&&An(r,t,2)}function dd(t){var r=on();if(typeof t=="function"){var a=t;if(t=a(),qs){mn(!0);try{a()}finally{mn(!1)}}}return r.memoizedState=r.baseState=t,r.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Hi,lastRenderedState:t},r}function Oy(t,r,a,l){return t.baseState=a,hd(t,Qe,typeof l=="function"?l:Hi)}function uw(t,r,a,l,h){if(mc(t))throw Error(s(485));if(t=r.action,t!==null){var d={payload:h,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(v){d.listeners.push(v)}};Y.T!==null?a(!0):d.isTransition=!1,l(d),a=r.pending,a===null?(d.next=r.pending=d,My(r,d)):(d.next=a.next,r.pending=a.next=d)}}function My(t,r){var a=r.action,l=r.payload,h=t.state;if(r.isTransition){var d=Y.T,v={};Y.T=v;try{var A=a(h,l),R=Y.S;R!==null&&R(v,A),xy(t,r,A)}catch(B){md(t,r,B)}finally{Y.T=d}}else try{d=a(h,l),xy(t,r,d)}catch(B){md(t,r,B)}}function xy(t,r,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Vy(t,r,l)},function(l){return md(t,r,l)}):Vy(t,r,a)}function Vy(t,r,a){r.status="fulfilled",r.value=a,ky(r),t.state=a,r=t.pending,r!==null&&(a=r.next,a===r?t.pending=null:(a=a.next,r.next=a,My(t,a)))}function md(t,r,a){var l=t.pending;if(t.pending=null,l!==null){l=l.next;do r.status="rejected",r.reason=a,ky(r),r=r.next;while(r!==l)}t.action=null}function ky(t){t=t.listeners;for(var r=0;r<t.length;r++)(0,t[r])()}function Py(t,r){return r}function Uy(t,r){if(Be){var a=Je.formState;if(a!==null){e:{var l=Ie;if(Be){if(lt){t:{for(var h=lt,d=di;h.nodeType!==8;){if(!d){h=null;break t}if(h=Qn(h.nextSibling),h===null){h=null;break t}}d=h.data,h=d==="F!"||d==="F"?h:null}if(h){lt=Qn(h.nextSibling),l=h.data==="F!";break e}}Ls(l)}l=!1}l&&(r=a[0])}}return a=on(),a.memoizedState=a.baseState=r,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Py,lastRenderedState:r},a.queue=l,a=n_.bind(null,Ie,l),l.dispatch=a,l=dd(!1),d=vd.bind(null,Ie,!1,l.queue),l=on(),h={state:r,dispatch:null,action:t,pending:null},l.queue=h,a=uw.bind(null,Ie,h,d,a),h.dispatch=a,l.memoizedState=t,[r,a,!1]}function Ly(t){var r=_t();return jy(r,Qe,t)}function jy(t,r,a){if(r=hd(t,r,Py)[0],t=hc(Hi)[0],typeof r=="object"&&r!==null&&typeof r.then=="function")try{var l=dl(r)}catch(v){throw v===ol?sc:v}else l=r;r=_t();var h=r.queue,d=h.dispatch;return a!==r.memoizedState&&(Ie.flags|=2048,La(9,fc(),cw.bind(null,h,a),null)),[l,d,t]}function cw(t,r){t.action=r}function zy(t){var r=_t(),a=Qe;if(a!==null)return jy(r,a,t);_t(),r=r.memoizedState,a=_t();var l=a.queue.dispatch;return a.memoizedState=t,[r,l,!1]}function La(t,r,a,l){return t={tag:t,create:a,deps:l,inst:r,next:null},r=Ie.updateQueue,r===null&&(r=ud(),Ie.updateQueue=r),a=r.lastEffect,a===null?r.lastEffect=t.next=t:(l=a.next,a.next=t,t.next=l,r.lastEffect=t),t}function fc(){return{destroy:void 0,resource:void 0}}function By(){return _t().memoizedState}function dc(t,r,a,l){var h=on();l=l===void 0?null:l,Ie.flags|=t,h.memoizedState=La(1|r,fc(),a,l)}function ml(t,r,a,l){var h=_t();l=l===void 0?null:l;var d=h.memoizedState.inst;Qe!==null&&l!==null&&rd(l,Qe.memoizedState.deps)?h.memoizedState=La(r,d,a,l):(Ie.flags|=t,h.memoizedState=La(1|r,d,a,l))}function qy(t,r){dc(8390656,8,t,r)}function Fy(t,r){ml(2048,8,t,r)}function Hy(t,r){return ml(4,2,t,r)}function Gy(t,r){return ml(4,4,t,r)}function Ky(t,r){if(typeof r=="function"){t=t();var a=r(t);return function(){typeof a=="function"?a():r(null)}}if(r!=null)return t=t(),r.current=t,function(){r.current=null}}function Yy(t,r,a){a=a!=null?a.concat([t]):null,ml(4,4,Ky.bind(null,r,t),a)}function pd(){}function Qy(t,r){var a=_t();r=r===void 0?null:r;var l=a.memoizedState;return r!==null&&rd(r,l[1])?l[0]:(a.memoizedState=[t,r],t)}function $y(t,r){var a=_t();r=r===void 0?null:r;var l=a.memoizedState;if(r!==null&&rd(r,l[1]))return l[0];if(l=t(),qs){mn(!0);try{t()}finally{mn(!1)}}return a.memoizedState=[l,r],l}function gd(t,r,a){return a===void 0||(Er&1073741824)!==0?t.memoizedState=r:(t.memoizedState=a,t=W_(),Ie.lanes|=t,Cr|=t,a)}function Xy(t,r,a,l){return gn(a,r)?a:ka.current!==null?(t=gd(t,a,l),gn(t,r)||(Mt=!0),t):(Er&42)===0?(Mt=!0,t.memoizedState=a):(t=W_(),Ie.lanes|=t,Cr|=t,r)}function Zy(t,r,a,l,h){var d=ie.p;ie.p=d!==0&&8>d?d:8;var v=Y.T,A={};Y.T=A,vd(t,!1,r,a);try{var R=h(),B=Y.S;if(B!==null&&B(A,R),R!==null&&typeof R=="object"&&typeof R.then=="function"){var Q=aw(R,l);pl(t,r,Q,En(t))}else pl(t,r,l,En(t))}catch(X){pl(t,r,{then:function(){},status:"rejected",reason:X},En())}finally{ie.p=d,Y.T=v}}function hw(){}function yd(t,r,a,l){if(t.tag!==5)throw Error(s(476));var h=Wy(t).queue;Zy(t,h,r,he,a===null?hw:function(){return Jy(t),a(l)})}function Wy(t){var r=t.memoizedState;if(r!==null)return r;r={memoizedState:he,baseState:he,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Hi,lastRenderedState:he},next:null};var a={};return r.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Hi,lastRenderedState:a},next:null},t.memoizedState=r,t=t.alternate,t!==null&&(t.memoizedState=r),r}function Jy(t){var r=Wy(t).next.queue;pl(t,r,{},En())}function _d(){return Kt(xl)}function e_(){return _t().memoizedState}function t_(){return _t().memoizedState}function fw(t){for(var r=t.return;r!==null;){switch(r.tag){case 24:case 3:var a=En();t=vr(a);var l=Tr(r,t,a);l!==null&&(An(l,r,a),ul(l,r,a)),r={cache:Qf()},t.payload=r;return}r=r.return}}function dw(t,r,a){var l=En();a={lane:l,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null},mc(t)?i_(r,a):(a=Lf(t,r,a,l),a!==null&&(An(a,t,l),r_(a,r,l)))}function n_(t,r,a){var l=En();pl(t,r,a,l)}function pl(t,r,a,l){var h={lane:l,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null};if(mc(t))i_(r,h);else{var d=t.alternate;if(t.lanes===0&&(d===null||d.lanes===0)&&(d=r.lastRenderedReducer,d!==null))try{var v=r.lastRenderedState,A=d(v,a);if(h.hasEagerState=!0,h.eagerState=A,gn(A,v))return Zu(t,r,h,0),Je===null&&Xu(),!1}catch{}finally{}if(a=Lf(t,r,h,l),a!==null)return An(a,t,l),r_(a,r,l),!0}return!1}function vd(t,r,a,l){if(l={lane:2,revertLane:Zd(),action:l,hasEagerState:!1,eagerState:null,next:null},mc(t)){if(r)throw Error(s(479))}else r=Lf(t,a,l,2),r!==null&&An(r,t,2)}function mc(t){var r=t.alternate;return t===Ie||r!==null&&r===Ie}function i_(t,r){Pa=lc=!0;var a=t.pending;a===null?r.next=r:(r.next=a.next,a.next=r),t.pending=r}function r_(t,r,a){if((a&4194048)!==0){var l=r.lanes;l&=t.pendingLanes,a|=l,r.lanes=a,Uo(t,a)}}var pc={readContext:Kt,use:cc,useCallback:ht,useContext:ht,useEffect:ht,useImperativeHandle:ht,useLayoutEffect:ht,useInsertionEffect:ht,useMemo:ht,useReducer:ht,useRef:ht,useState:ht,useDebugValue:ht,useDeferredValue:ht,useTransition:ht,useSyncExternalStore:ht,useId:ht,useHostTransitionStatus:ht,useFormState:ht,useActionState:ht,useOptimistic:ht,useMemoCache:ht,useCacheRefresh:ht},s_={readContext:Kt,use:cc,useCallback:function(t,r){return on().memoizedState=[t,r===void 0?null:r],t},useContext:Kt,useEffect:qy,useImperativeHandle:function(t,r,a){a=a!=null?a.concat([t]):null,dc(4194308,4,Ky.bind(null,r,t),a)},useLayoutEffect:function(t,r){return dc(4194308,4,t,r)},useInsertionEffect:function(t,r){dc(4,2,t,r)},useMemo:function(t,r){var a=on();r=r===void 0?null:r;var l=t();if(qs){mn(!0);try{t()}finally{mn(!1)}}return a.memoizedState=[l,r],l},useReducer:function(t,r,a){var l=on();if(a!==void 0){var h=a(r);if(qs){mn(!0);try{a(r)}finally{mn(!1)}}}else h=r;return l.memoizedState=l.baseState=h,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:h},l.queue=t,t=t.dispatch=dw.bind(null,Ie,t),[l.memoizedState,t]},useRef:function(t){var r=on();return t={current:t},r.memoizedState=t},useState:function(t){t=dd(t);var r=t.queue,a=n_.bind(null,Ie,r);return r.dispatch=a,[t.memoizedState,a]},useDebugValue:pd,useDeferredValue:function(t,r){var a=on();return gd(a,t,r)},useTransition:function(){var t=dd(!1);return t=Zy.bind(null,Ie,t.queue,!0,!1),on().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,r,a){var l=Ie,h=on();if(Be){if(a===void 0)throw Error(s(407));a=a()}else{if(a=r(),Je===null)throw Error(s(349));(Pe&124)!==0||Iy(l,r,a)}h.memoizedState=a;var d={value:a,getSnapshot:r};return h.queue=d,qy(Cy.bind(null,l,d,t),[t]),l.flags|=2048,La(9,fc(),Ry.bind(null,l,d,a,r),null),a},useId:function(){var t=on(),r=Je.identifierPrefix;if(Be){var a=Bi,l=zi;a=(l&~(1<<32-Gt(l)-1)).toString(32)+a,r="«"+r+"R"+a,a=uc++,0<a&&(r+="H"+a.toString(32)),r+="»"}else a=ow++,r="«"+r+"r"+a.toString(32)+"»";return t.memoizedState=r},useHostTransitionStatus:_d,useFormState:Uy,useActionState:Uy,useOptimistic:function(t){var r=on();r.memoizedState=r.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return r.queue=a,r=vd.bind(null,Ie,!0,a),a.dispatch=r,[t,r]},useMemoCache:cd,useCacheRefresh:function(){return on().memoizedState=fw.bind(null,Ie)}},a_={readContext:Kt,use:cc,useCallback:Qy,useContext:Kt,useEffect:Fy,useImperativeHandle:Yy,useInsertionEffect:Hy,useLayoutEffect:Gy,useMemo:$y,useReducer:hc,useRef:By,useState:function(){return hc(Hi)},useDebugValue:pd,useDeferredValue:function(t,r){var a=_t();return Xy(a,Qe.memoizedState,t,r)},useTransition:function(){var t=hc(Hi)[0],r=_t().memoizedState;return[typeof t=="boolean"?t:dl(t),r]},useSyncExternalStore:wy,useId:e_,useHostTransitionStatus:_d,useFormState:Ly,useActionState:Ly,useOptimistic:function(t,r){var a=_t();return Oy(a,Qe,t,r)},useMemoCache:cd,useCacheRefresh:t_},mw={readContext:Kt,use:cc,useCallback:Qy,useContext:Kt,useEffect:Fy,useImperativeHandle:Yy,useInsertionEffect:Hy,useLayoutEffect:Gy,useMemo:$y,useReducer:fd,useRef:By,useState:function(){return fd(Hi)},useDebugValue:pd,useDeferredValue:function(t,r){var a=_t();return Qe===null?gd(a,t,r):Xy(a,Qe.memoizedState,t,r)},useTransition:function(){var t=fd(Hi)[0],r=_t().memoizedState;return[typeof t=="boolean"?t:dl(t),r]},useSyncExternalStore:wy,useId:e_,useHostTransitionStatus:_d,useFormState:zy,useActionState:zy,useOptimistic:function(t,r){var a=_t();return Qe!==null?Oy(a,Qe,t,r):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:cd,useCacheRefresh:t_},ja=null,gl=0;function gc(t){var r=gl;return gl+=1,ja===null&&(ja=[]),yy(ja,t,r)}function yl(t,r){r=r.props.ref,t.ref=r!==void 0?r:null}function yc(t,r){throw r.$$typeof===S?Error(s(525)):(t=Object.prototype.toString.call(r),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":t)))}function o_(t){var r=t._init;return r(t._payload)}function l_(t){function r(L,M){if(t){var z=L.deletions;z===null?(L.deletions=[M],L.flags|=16):z.push(M)}}function a(L,M){if(!t)return null;for(;M!==null;)r(L,M),M=M.sibling;return null}function l(L){for(var M=new Map;L!==null;)L.key!==null?M.set(L.key,L):M.set(L.index,L),L=L.sibling;return M}function h(L,M){return L=ji(L,M),L.index=0,L.sibling=null,L}function d(L,M,z){return L.index=z,t?(z=L.alternate,z!==null?(z=z.index,z<M?(L.flags|=67108866,M):z):(L.flags|=67108866,M)):(L.flags|=1048576,M)}function v(L){return t&&L.alternate===null&&(L.flags|=67108866),L}function A(L,M,z,$){return M===null||M.tag!==6?(M=zf(z,L.mode,$),M.return=L,M):(M=h(M,z),M.return=L,M)}function R(L,M,z,$){var ue=z.type;return ue===k?Q(L,M,z.props.children,$,z.key):M!==null&&(M.elementType===ue||typeof ue=="object"&&ue!==null&&ue.$$typeof===I&&o_(ue)===M.type)?(M=h(M,z.props),yl(M,z),M.return=L,M):(M=Ju(z.type,z.key,z.props,null,L.mode,$),yl(M,z),M.return=L,M)}function B(L,M,z,$){return M===null||M.tag!==4||M.stateNode.containerInfo!==z.containerInfo||M.stateNode.implementation!==z.implementation?(M=Bf(z,L.mode,$),M.return=L,M):(M=h(M,z.children||[]),M.return=L,M)}function Q(L,M,z,$,ue){return M===null||M.tag!==7?(M=Vs(z,L.mode,$,ue),M.return=L,M):(M=h(M,z),M.return=L,M)}function X(L,M,z){if(typeof M=="string"&&M!==""||typeof M=="number"||typeof M=="bigint")return M=zf(""+M,L.mode,z),M.return=L,M;if(typeof M=="object"&&M!==null){switch(M.$$typeof){case w:return z=Ju(M.type,M.key,M.props,null,L.mode,z),yl(z,M),z.return=L,z;case P:return M=Bf(M,L.mode,z),M.return=L,M;case I:var $=M._init;return M=$(M._payload),X(L,M,z)}if(at(M)||U(M))return M=Vs(M,L.mode,z,null),M.return=L,M;if(typeof M.then=="function")return X(L,gc(M),z);if(M.$$typeof===le)return X(L,ic(L,M),z);yc(L,M)}return null}function F(L,M,z,$){var ue=M!==null?M.key:null;if(typeof z=="string"&&z!==""||typeof z=="number"||typeof z=="bigint")return ue!==null?null:A(L,M,""+z,$);if(typeof z=="object"&&z!==null){switch(z.$$typeof){case w:return z.key===ue?R(L,M,z,$):null;case P:return z.key===ue?B(L,M,z,$):null;case I:return ue=z._init,z=ue(z._payload),F(L,M,z,$)}if(at(z)||U(z))return ue!==null?null:Q(L,M,z,$,null);if(typeof z.then=="function")return F(L,M,gc(z),$);if(z.$$typeof===le)return F(L,M,ic(L,z),$);yc(L,z)}return null}function H(L,M,z,$,ue){if(typeof $=="string"&&$!==""||typeof $=="number"||typeof $=="bigint")return L=L.get(z)||null,A(M,L,""+$,ue);if(typeof $=="object"&&$!==null){switch($.$$typeof){case w:return L=L.get($.key===null?z:$.key)||null,R(M,L,$,ue);case P:return L=L.get($.key===null?z:$.key)||null,B(M,L,$,ue);case I:var Ne=$._init;return $=Ne($._payload),H(L,M,z,$,ue)}if(at($)||U($))return L=L.get(z)||null,Q(M,L,$,ue,null);if(typeof $.then=="function")return H(L,M,z,gc($),ue);if($.$$typeof===le)return H(L,M,z,ic(M,$),ue);yc(M,$)}return null}function ve(L,M,z,$){for(var ue=null,Ne=null,ce=M,ye=M=0,Vt=null;ce!==null&&ye<z.length;ye++){ce.index>ye?(Vt=ce,ce=null):Vt=ce.sibling;var Le=F(L,ce,z[ye],$);if(Le===null){ce===null&&(ce=Vt);break}t&&ce&&Le.alternate===null&&r(L,ce),M=d(Le,M,ye),Ne===null?ue=Le:Ne.sibling=Le,Ne=Le,ce=Vt}if(ye===z.length)return a(L,ce),Be&&Ps(L,ye),ue;if(ce===null){for(;ye<z.length;ye++)ce=X(L,z[ye],$),ce!==null&&(M=d(ce,M,ye),Ne===null?ue=ce:Ne.sibling=ce,Ne=ce);return Be&&Ps(L,ye),ue}for(ce=l(ce);ye<z.length;ye++)Vt=H(ce,L,ye,z[ye],$),Vt!==null&&(t&&Vt.alternate!==null&&ce.delete(Vt.key===null?ye:Vt.key),M=d(Vt,M,ye),Ne===null?ue=Vt:Ne.sibling=Vt,Ne=Vt);return t&&ce.forEach(function(Ur){return r(L,Ur)}),Be&&Ps(L,ye),ue}function ge(L,M,z,$){if(z==null)throw Error(s(151));for(var ue=null,Ne=null,ce=M,ye=M=0,Vt=null,Le=z.next();ce!==null&&!Le.done;ye++,Le=z.next()){ce.index>ye?(Vt=ce,ce=null):Vt=ce.sibling;var Ur=F(L,ce,Le.value,$);if(Ur===null){ce===null&&(ce=Vt);break}t&&ce&&Ur.alternate===null&&r(L,ce),M=d(Ur,M,ye),Ne===null?ue=Ur:Ne.sibling=Ur,Ne=Ur,ce=Vt}if(Le.done)return a(L,ce),Be&&Ps(L,ye),ue;if(ce===null){for(;!Le.done;ye++,Le=z.next())Le=X(L,Le.value,$),Le!==null&&(M=d(Le,M,ye),Ne===null?ue=Le:Ne.sibling=Le,Ne=Le);return Be&&Ps(L,ye),ue}for(ce=l(ce);!Le.done;ye++,Le=z.next())Le=H(ce,L,ye,Le.value,$),Le!==null&&(t&&Le.alternate!==null&&ce.delete(Le.key===null?ye:Le.key),M=d(Le,M,ye),Ne===null?ue=Le:Ne.sibling=Le,Ne=Le);return t&&ce.forEach(function(pI){return r(L,pI)}),Be&&Ps(L,ye),ue}function Xe(L,M,z,$){if(typeof z=="object"&&z!==null&&z.type===k&&z.key===null&&(z=z.props.children),typeof z=="object"&&z!==null){switch(z.$$typeof){case w:e:{for(var ue=z.key;M!==null;){if(M.key===ue){if(ue=z.type,ue===k){if(M.tag===7){a(L,M.sibling),$=h(M,z.props.children),$.return=L,L=$;break e}}else if(M.elementType===ue||typeof ue=="object"&&ue!==null&&ue.$$typeof===I&&o_(ue)===M.type){a(L,M.sibling),$=h(M,z.props),yl($,z),$.return=L,L=$;break e}a(L,M);break}else r(L,M);M=M.sibling}z.type===k?($=Vs(z.props.children,L.mode,$,z.key),$.return=L,L=$):($=Ju(z.type,z.key,z.props,null,L.mode,$),yl($,z),$.return=L,L=$)}return v(L);case P:e:{for(ue=z.key;M!==null;){if(M.key===ue)if(M.tag===4&&M.stateNode.containerInfo===z.containerInfo&&M.stateNode.implementation===z.implementation){a(L,M.sibling),$=h(M,z.children||[]),$.return=L,L=$;break e}else{a(L,M);break}else r(L,M);M=M.sibling}$=Bf(z,L.mode,$),$.return=L,L=$}return v(L);case I:return ue=z._init,z=ue(z._payload),Xe(L,M,z,$)}if(at(z))return ve(L,M,z,$);if(U(z)){if(ue=U(z),typeof ue!="function")throw Error(s(150));return z=ue.call(z),ge(L,M,z,$)}if(typeof z.then=="function")return Xe(L,M,gc(z),$);if(z.$$typeof===le)return Xe(L,M,ic(L,z),$);yc(L,z)}return typeof z=="string"&&z!==""||typeof z=="number"||typeof z=="bigint"?(z=""+z,M!==null&&M.tag===6?(a(L,M.sibling),$=h(M,z),$.return=L,L=$):(a(L,M),$=zf(z,L.mode,$),$.return=L,L=$),v(L)):a(L,M)}return function(L,M,z,$){try{gl=0;var ue=Xe(L,M,z,$);return ja=null,ue}catch(ce){if(ce===ol||ce===sc)throw ce;var Ne=yn(29,ce,null,L.mode);return Ne.lanes=$,Ne.return=L,Ne}finally{}}}var za=l_(!0),u_=l_(!1),Un=J(null),mi=null;function Ar(t){var r=t.alternate;ee(wt,wt.current&1),ee(Un,t),mi===null&&(r===null||ka.current!==null||r.memoizedState!==null)&&(mi=t)}function c_(t){if(t.tag===22){if(ee(wt,wt.current),ee(Un,t),mi===null){var r=t.alternate;r!==null&&r.memoizedState!==null&&(mi=t)}}else br()}function br(){ee(wt,wt.current),ee(Un,Un.current)}function Gi(t){re(Un),mi===t&&(mi=null),re(wt)}var wt=J(0);function _c(t){for(var r=t;r!==null;){if(r.tag===13){var a=r.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||um(a)))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}function Td(t,r,a,l){r=t.memoizedState,a=a(l,r),a=a==null?r:T({},r,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Ed={enqueueSetState:function(t,r,a){t=t._reactInternals;var l=En(),h=vr(l);h.payload=r,a!=null&&(h.callback=a),r=Tr(t,h,l),r!==null&&(An(r,t,l),ul(r,t,l))},enqueueReplaceState:function(t,r,a){t=t._reactInternals;var l=En(),h=vr(l);h.tag=1,h.payload=r,a!=null&&(h.callback=a),r=Tr(t,h,l),r!==null&&(An(r,t,l),ul(r,t,l))},enqueueForceUpdate:function(t,r){t=t._reactInternals;var a=En(),l=vr(a);l.tag=2,r!=null&&(l.callback=r),r=Tr(t,l,a),r!==null&&(An(r,t,a),ul(r,t,a))}};function h_(t,r,a,l,h,d,v){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,d,v):r.prototype&&r.prototype.isPureReactComponent?!Jo(a,l)||!Jo(h,d):!0}function f_(t,r,a,l){t=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(a,l),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(a,l),r.state!==t&&Ed.enqueueReplaceState(r,r.state,null)}function Fs(t,r){var a=r;if("ref"in r){a={};for(var l in r)l!=="ref"&&(a[l]=r[l])}if(t=t.defaultProps){a===r&&(a=T({},a));for(var h in t)a[h]===void 0&&(a[h]=t[h])}return a}var vc=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var r=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(r))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)};function d_(t){vc(t)}function m_(t){console.error(t)}function p_(t){vc(t)}function Tc(t,r){try{var a=t.onUncaughtError;a(r.value,{componentStack:r.stack})}catch(l){setTimeout(function(){throw l})}}function g_(t,r,a){try{var l=t.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:r.tag===1?r.stateNode:null})}catch(h){setTimeout(function(){throw h})}}function Ad(t,r,a){return a=vr(a),a.tag=3,a.payload={element:null},a.callback=function(){Tc(t,r)},a}function y_(t){return t=vr(t),t.tag=3,t}function __(t,r,a,l){var h=a.type.getDerivedStateFromError;if(typeof h=="function"){var d=l.value;t.payload=function(){return h(d)},t.callback=function(){g_(r,a,l)}}var v=a.stateNode;v!==null&&typeof v.componentDidCatch=="function"&&(t.callback=function(){g_(r,a,l),typeof h!="function"&&(Nr===null?Nr=new Set([this]):Nr.add(this));var A=l.stack;this.componentDidCatch(l.value,{componentStack:A!==null?A:""})})}function pw(t,r,a,l,h){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(r=a.alternate,r!==null&&rl(r,a,h,!0),a=Un.current,a!==null){switch(a.tag){case 13:return mi===null?Kd():a.alternate===null&&ut===0&&(ut=3),a.flags&=-257,a.flags|=65536,a.lanes=h,l===Zf?a.flags|=16384:(r=a.updateQueue,r===null?a.updateQueue=new Set([l]):r.add(l),Qd(t,l,h)),!1;case 22:return a.flags|=65536,l===Zf?a.flags|=16384:(r=a.updateQueue,r===null?(r={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=r):(a=r.retryQueue,a===null?r.retryQueue=new Set([l]):a.add(l)),Qd(t,l,h)),!1}throw Error(s(435,a.tag))}return Qd(t,l,h),Kd(),!1}if(Be)return r=Un.current,r!==null?((r.flags&65536)===0&&(r.flags|=256),r.flags|=65536,r.lanes=h,l!==Hf&&(t=Error(s(422),{cause:l}),il(xn(t,a)))):(l!==Hf&&(r=Error(s(423),{cause:l}),il(xn(r,a))),t=t.current.alternate,t.flags|=65536,h&=-h,t.lanes|=h,l=xn(l,a),h=Ad(t.stateNode,l,h),ed(t,h),ut!==4&&(ut=2)),!1;var d=Error(s(520),{cause:l});if(d=xn(d,a),Sl===null?Sl=[d]:Sl.push(d),ut!==4&&(ut=2),r===null)return!0;l=xn(l,a),a=r;do{switch(a.tag){case 3:return a.flags|=65536,t=h&-h,a.lanes|=t,t=Ad(a.stateNode,l,t),ed(a,t),!1;case 1:if(r=a.type,d=a.stateNode,(a.flags&128)===0&&(typeof r.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(Nr===null||!Nr.has(d))))return a.flags|=65536,h&=-h,a.lanes|=h,h=y_(h),__(h,t,a,l),ed(a,h),!1}a=a.return}while(a!==null);return!1}var v_=Error(s(461)),Mt=!1;function jt(t,r,a,l){r.child=t===null?u_(r,null,a,l):za(r,t.child,a,l)}function T_(t,r,a,l,h){a=a.render;var d=r.ref;if("ref"in l){var v={};for(var A in l)A!=="ref"&&(v[A]=l[A])}else v=l;return zs(r),l=sd(t,r,a,v,d,h),A=ad(),t!==null&&!Mt?(od(t,r,h),Ki(t,r,h)):(Be&&A&&qf(r),r.flags|=1,jt(t,r,l,h),r.child)}function E_(t,r,a,l,h){if(t===null){var d=a.type;return typeof d=="function"&&!jf(d)&&d.defaultProps===void 0&&a.compare===null?(r.tag=15,r.type=d,A_(t,r,d,l,h)):(t=Ju(a.type,null,l,r,r.mode,h),t.ref=r.ref,t.return=r,r.child=t)}if(d=t.child,!Dd(t,h)){var v=d.memoizedProps;if(a=a.compare,a=a!==null?a:Jo,a(v,l)&&t.ref===r.ref)return Ki(t,r,h)}return r.flags|=1,t=ji(d,l),t.ref=r.ref,t.return=r,r.child=t}function A_(t,r,a,l,h){if(t!==null){var d=t.memoizedProps;if(Jo(d,l)&&t.ref===r.ref)if(Mt=!1,r.pendingProps=l=d,Dd(t,h))(t.flags&131072)!==0&&(Mt=!0);else return r.lanes=t.lanes,Ki(t,r,h)}return bd(t,r,a,l,h)}function b_(t,r,a){var l=r.pendingProps,h=l.children,d=t!==null?t.memoizedState:null;if(l.mode==="hidden"){if((r.flags&128)!==0){if(l=d!==null?d.baseLanes|a:a,t!==null){for(h=r.child=t.child,d=0;h!==null;)d=d|h.lanes|h.childLanes,h=h.sibling;r.childLanes=d&~l}else r.childLanes=0,r.child=null;return S_(t,r,l,a)}if((a&536870912)!==0)r.memoizedState={baseLanes:0,cachePool:null},t!==null&&rc(r,d!==null?d.cachePool:null),d!==null?Ay(r,d):nd(),c_(r);else return r.lanes=r.childLanes=536870912,S_(t,r,d!==null?d.baseLanes|a:a,a)}else d!==null?(rc(r,d.cachePool),Ay(r,d),br(),r.memoizedState=null):(t!==null&&rc(r,null),nd(),br());return jt(t,r,h,a),r.child}function S_(t,r,a,l){var h=Xf();return h=h===null?null:{parent:St._currentValue,pool:h},r.memoizedState={baseLanes:a,cachePool:h},t!==null&&rc(r,null),nd(),c_(r),t!==null&&rl(t,r,l,!0),null}function Ec(t,r){var a=r.ref;if(a===null)t!==null&&t.ref!==null&&(r.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(t===null||t.ref!==a)&&(r.flags|=4194816)}}function bd(t,r,a,l,h){return zs(r),a=sd(t,r,a,l,void 0,h),l=ad(),t!==null&&!Mt?(od(t,r,h),Ki(t,r,h)):(Be&&l&&qf(r),r.flags|=1,jt(t,r,a,h),r.child)}function w_(t,r,a,l,h,d){return zs(r),r.updateQueue=null,a=Sy(r,l,a,h),by(t),l=ad(),t!==null&&!Mt?(od(t,r,d),Ki(t,r,d)):(Be&&l&&qf(r),r.flags|=1,jt(t,r,a,d),r.child)}function I_(t,r,a,l,h){if(zs(r),r.stateNode===null){var d=Da,v=a.contextType;typeof v=="object"&&v!==null&&(d=Kt(v)),d=new a(l,d),r.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,d.updater=Ed,r.stateNode=d,d._reactInternals=r,d=r.stateNode,d.props=l,d.state=r.memoizedState,d.refs={},Wf(r),v=a.contextType,d.context=typeof v=="object"&&v!==null?Kt(v):Da,d.state=r.memoizedState,v=a.getDerivedStateFromProps,typeof v=="function"&&(Td(r,a,v,l),d.state=r.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(v=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),v!==d.state&&Ed.enqueueReplaceState(d,d.state,null),hl(r,l,d,h),cl(),d.state=r.memoizedState),typeof d.componentDidMount=="function"&&(r.flags|=4194308),l=!0}else if(t===null){d=r.stateNode;var A=r.memoizedProps,R=Fs(a,A);d.props=R;var B=d.context,Q=a.contextType;v=Da,typeof Q=="object"&&Q!==null&&(v=Kt(Q));var X=a.getDerivedStateFromProps;Q=typeof X=="function"||typeof d.getSnapshotBeforeUpdate=="function",A=r.pendingProps!==A,Q||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(A||B!==v)&&f_(r,d,l,v),_r=!1;var F=r.memoizedState;d.state=F,hl(r,l,d,h),cl(),B=r.memoizedState,A||F!==B||_r?(typeof X=="function"&&(Td(r,a,X,l),B=r.memoizedState),(R=_r||h_(r,a,R,l,F,B,v))?(Q||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(r.flags|=4194308)):(typeof d.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=l,r.memoizedState=B),d.props=l,d.state=B,d.context=v,l=R):(typeof d.componentDidMount=="function"&&(r.flags|=4194308),l=!1)}else{d=r.stateNode,Jf(t,r),v=r.memoizedProps,Q=Fs(a,v),d.props=Q,X=r.pendingProps,F=d.context,B=a.contextType,R=Da,typeof B=="object"&&B!==null&&(R=Kt(B)),A=a.getDerivedStateFromProps,(B=typeof A=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(v!==X||F!==R)&&f_(r,d,l,R),_r=!1,F=r.memoizedState,d.state=F,hl(r,l,d,h),cl();var H=r.memoizedState;v!==X||F!==H||_r||t!==null&&t.dependencies!==null&&nc(t.dependencies)?(typeof A=="function"&&(Td(r,a,A,l),H=r.memoizedState),(Q=_r||h_(r,a,Q,l,F,H,R)||t!==null&&t.dependencies!==null&&nc(t.dependencies))?(B||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(l,H,R),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(l,H,R)),typeof d.componentDidUpdate=="function"&&(r.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof d.componentDidUpdate!="function"||v===t.memoizedProps&&F===t.memoizedState||(r.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&F===t.memoizedState||(r.flags|=1024),r.memoizedProps=l,r.memoizedState=H),d.props=l,d.state=H,d.context=R,l=Q):(typeof d.componentDidUpdate!="function"||v===t.memoizedProps&&F===t.memoizedState||(r.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&F===t.memoizedState||(r.flags|=1024),l=!1)}return d=l,Ec(t,r),l=(r.flags&128)!==0,d||l?(d=r.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:d.render(),r.flags|=1,t!==null&&l?(r.child=za(r,t.child,null,h),r.child=za(r,null,a,h)):jt(t,r,a,h),r.memoizedState=d.state,t=r.child):t=Ki(t,r,h),t}function R_(t,r,a,l){return nl(),r.flags|=256,jt(t,r,a,l),r.child}var Sd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function wd(t){return{baseLanes:t,cachePool:my()}}function Id(t,r,a){return t=t!==null?t.childLanes&~a:0,r&&(t|=Ln),t}function C_(t,r,a){var l=r.pendingProps,h=!1,d=(r.flags&128)!==0,v;if((v=d)||(v=t!==null&&t.memoizedState===null?!1:(wt.current&2)!==0),v&&(h=!0,r.flags&=-129),v=(r.flags&32)!==0,r.flags&=-33,t===null){if(Be){if(h?Ar(r):br(),Be){var A=lt,R;if(R=A){e:{for(R=A,A=di;R.nodeType!==8;){if(!A){A=null;break e}if(R=Qn(R.nextSibling),R===null){A=null;break e}}A=R}A!==null?(r.memoizedState={dehydrated:A,treeContext:ks!==null?{id:zi,overflow:Bi}:null,retryLane:536870912,hydrationErrors:null},R=yn(18,null,null,0),R.stateNode=A,R.return=r,r.child=R,sn=r,lt=null,R=!0):R=!1}R||Ls(r)}if(A=r.memoizedState,A!==null&&(A=A.dehydrated,A!==null))return um(A)?r.lanes=32:r.lanes=536870912,null;Gi(r)}return A=l.children,l=l.fallback,h?(br(),h=r.mode,A=Ac({mode:"hidden",children:A},h),l=Vs(l,h,a,null),A.return=r,l.return=r,A.sibling=l,r.child=A,h=r.child,h.memoizedState=wd(a),h.childLanes=Id(t,v,a),r.memoizedState=Sd,l):(Ar(r),Rd(r,A))}if(R=t.memoizedState,R!==null&&(A=R.dehydrated,A!==null)){if(d)r.flags&256?(Ar(r),r.flags&=-257,r=Cd(t,r,a)):r.memoizedState!==null?(br(),r.child=t.child,r.flags|=128,r=null):(br(),h=l.fallback,A=r.mode,l=Ac({mode:"visible",children:l.children},A),h=Vs(h,A,a,null),h.flags|=2,l.return=r,h.return=r,l.sibling=h,r.child=l,za(r,t.child,null,a),l=r.child,l.memoizedState=wd(a),l.childLanes=Id(t,v,a),r.memoizedState=Sd,r=h);else if(Ar(r),um(A)){if(v=A.nextSibling&&A.nextSibling.dataset,v)var B=v.dgst;v=B,l=Error(s(419)),l.stack="",l.digest=v,il({value:l,source:null,stack:null}),r=Cd(t,r,a)}else if(Mt||rl(t,r,a,!1),v=(a&t.childLanes)!==0,Mt||v){if(v=Je,v!==null&&(l=a&-a,l=(l&42)!==0?1:cr(l),l=(l&(v.suspendedLanes|a))!==0?0:l,l!==0&&l!==R.retryLane))throw R.retryLane=l,Na(t,l),An(v,t,l),v_;A.data==="$?"||Kd(),r=Cd(t,r,a)}else A.data==="$?"?(r.flags|=192,r.child=t.child,r=null):(t=R.treeContext,lt=Qn(A.nextSibling),sn=r,Be=!0,Us=null,di=!1,t!==null&&(kn[Pn++]=zi,kn[Pn++]=Bi,kn[Pn++]=ks,zi=t.id,Bi=t.overflow,ks=r),r=Rd(r,l.children),r.flags|=4096);return r}return h?(br(),h=l.fallback,A=r.mode,R=t.child,B=R.sibling,l=ji(R,{mode:"hidden",children:l.children}),l.subtreeFlags=R.subtreeFlags&65011712,B!==null?h=ji(B,h):(h=Vs(h,A,a,null),h.flags|=2),h.return=r,l.return=r,l.sibling=h,r.child=l,l=h,h=r.child,A=t.child.memoizedState,A===null?A=wd(a):(R=A.cachePool,R!==null?(B=St._currentValue,R=R.parent!==B?{parent:B,pool:B}:R):R=my(),A={baseLanes:A.baseLanes|a,cachePool:R}),h.memoizedState=A,h.childLanes=Id(t,v,a),r.memoizedState=Sd,l):(Ar(r),a=t.child,t=a.sibling,a=ji(a,{mode:"visible",children:l.children}),a.return=r,a.sibling=null,t!==null&&(v=r.deletions,v===null?(r.deletions=[t],r.flags|=16):v.push(t)),r.child=a,r.memoizedState=null,a)}function Rd(t,r){return r=Ac({mode:"visible",children:r},t.mode),r.return=t,t.child=r}function Ac(t,r){return t=yn(22,t,null,r),t.lanes=0,t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null},t}function Cd(t,r,a){return za(r,t.child,null,a),t=Rd(r,r.pendingProps.children),t.flags|=2,r.memoizedState=null,t}function N_(t,r,a){t.lanes|=r;var l=t.alternate;l!==null&&(l.lanes|=r),Kf(t.return,r,a)}function Nd(t,r,a,l,h){var d=t.memoizedState;d===null?t.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:h}:(d.isBackwards=r,d.rendering=null,d.renderingStartTime=0,d.last=l,d.tail=a,d.tailMode=h)}function D_(t,r,a){var l=r.pendingProps,h=l.revealOrder,d=l.tail;if(jt(t,r,l.children,a),l=wt.current,(l&2)!==0)l=l&1|2,r.flags|=128;else{if(t!==null&&(t.flags&128)!==0)e:for(t=r.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&N_(t,a,r);else if(t.tag===19)N_(t,a,r);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===r)break e;for(;t.sibling===null;){if(t.return===null||t.return===r)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}l&=1}switch(ee(wt,l),h){case"forwards":for(a=r.child,h=null;a!==null;)t=a.alternate,t!==null&&_c(t)===null&&(h=a),a=a.sibling;a=h,a===null?(h=r.child,r.child=null):(h=a.sibling,a.sibling=null),Nd(r,!1,h,a,d);break;case"backwards":for(a=null,h=r.child,r.child=null;h!==null;){if(t=h.alternate,t!==null&&_c(t)===null){r.child=h;break}t=h.sibling,h.sibling=a,a=h,h=t}Nd(r,!0,a,null,d);break;case"together":Nd(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function Ki(t,r,a){if(t!==null&&(r.dependencies=t.dependencies),Cr|=r.lanes,(a&r.childLanes)===0)if(t!==null){if(rl(t,r,a,!1),(a&r.childLanes)===0)return null}else return null;if(t!==null&&r.child!==t.child)throw Error(s(153));if(r.child!==null){for(t=r.child,a=ji(t,t.pendingProps),r.child=a,a.return=r;t.sibling!==null;)t=t.sibling,a=a.sibling=ji(t,t.pendingProps),a.return=r;a.sibling=null}return r.child}function Dd(t,r){return(t.lanes&r)!==0?!0:(t=t.dependencies,!!(t!==null&&nc(t)))}function gw(t,r,a){switch(r.tag){case 3:We(r,r.stateNode.containerInfo),yr(r,St,t.memoizedState.cache),nl();break;case 27:case 5:ur(r);break;case 4:We(r,r.stateNode.containerInfo);break;case 10:yr(r,r.type,r.memoizedProps.value);break;case 13:var l=r.memoizedState;if(l!==null)return l.dehydrated!==null?(Ar(r),r.flags|=128,null):(a&r.child.childLanes)!==0?C_(t,r,a):(Ar(r),t=Ki(t,r,a),t!==null?t.sibling:null);Ar(r);break;case 19:var h=(t.flags&128)!==0;if(l=(a&r.childLanes)!==0,l||(rl(t,r,a,!1),l=(a&r.childLanes)!==0),h){if(l)return D_(t,r,a);r.flags|=128}if(h=r.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),ee(wt,wt.current),l)break;return null;case 22:case 23:return r.lanes=0,b_(t,r,a);case 24:yr(r,St,t.memoizedState.cache)}return Ki(t,r,a)}function O_(t,r,a){if(t!==null)if(t.memoizedProps!==r.pendingProps)Mt=!0;else{if(!Dd(t,a)&&(r.flags&128)===0)return Mt=!1,gw(t,r,a);Mt=(t.flags&131072)!==0}else Mt=!1,Be&&(r.flags&1048576)!==0&&oy(r,tc,r.index);switch(r.lanes=0,r.tag){case 16:e:{t=r.pendingProps;var l=r.elementType,h=l._init;if(l=h(l._payload),r.type=l,typeof l=="function")jf(l)?(t=Fs(l,t),r.tag=1,r=I_(null,r,l,t,a)):(r.tag=0,r=bd(null,r,l,t,a));else{if(l!=null){if(h=l.$$typeof,h===fe){r.tag=11,r=T_(null,r,l,t,a);break e}else if(h===V){r.tag=14,r=E_(null,r,l,t,a);break e}}throw r=Pt(l)||l,Error(s(306,r,""))}}return r;case 0:return bd(t,r,r.type,r.pendingProps,a);case 1:return l=r.type,h=Fs(l,r.pendingProps),I_(t,r,l,h,a);case 3:e:{if(We(r,r.stateNode.containerInfo),t===null)throw Error(s(387));l=r.pendingProps;var d=r.memoizedState;h=d.element,Jf(t,r),hl(r,l,null,a);var v=r.memoizedState;if(l=v.cache,yr(r,St,l),l!==d.cache&&Yf(r,[St],a,!0),cl(),l=v.element,d.isDehydrated)if(d={element:l,isDehydrated:!1,cache:v.cache},r.updateQueue.baseState=d,r.memoizedState=d,r.flags&256){r=R_(t,r,l,a);break e}else if(l!==h){h=xn(Error(s(424)),r),il(h),r=R_(t,r,l,a);break e}else{switch(t=r.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(lt=Qn(t.firstChild),sn=r,Be=!0,Us=null,di=!0,a=u_(r,null,l,a),r.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(nl(),l===h){r=Ki(t,r,a);break e}jt(t,r,l,a)}r=r.child}return r;case 26:return Ec(t,r),t===null?(a=kv(r.type,null,r.pendingProps,null))?r.memoizedState=a:Be||(a=r.type,t=r.pendingProps,l=Pc(Ee.current).createElement(a),l[Et]=r,l[pt]=t,Bt(l,a,t),ct(l),r.stateNode=l):r.memoizedState=kv(r.type,t.memoizedProps,r.pendingProps,t.memoizedState),null;case 27:return ur(r),t===null&&Be&&(l=r.stateNode=Mv(r.type,r.pendingProps,Ee.current),sn=r,di=!0,h=lt,Mr(r.type)?(cm=h,lt=Qn(l.firstChild)):lt=h),jt(t,r,r.pendingProps.children,a),Ec(t,r),t===null&&(r.flags|=4194304),r.child;case 5:return t===null&&Be&&((h=l=lt)&&(l=Hw(l,r.type,r.pendingProps,di),l!==null?(r.stateNode=l,sn=r,lt=Qn(l.firstChild),di=!1,h=!0):h=!1),h||Ls(r)),ur(r),h=r.type,d=r.pendingProps,v=t!==null?t.memoizedProps:null,l=d.children,am(h,d)?l=null:v!==null&&am(h,v)&&(r.flags|=32),r.memoizedState!==null&&(h=sd(t,r,lw,null,null,a),xl._currentValue=h),Ec(t,r),jt(t,r,l,a),r.child;case 6:return t===null&&Be&&((t=a=lt)&&(a=Gw(a,r.pendingProps,di),a!==null?(r.stateNode=a,sn=r,lt=null,t=!0):t=!1),t||Ls(r)),null;case 13:return C_(t,r,a);case 4:return We(r,r.stateNode.containerInfo),l=r.pendingProps,t===null?r.child=za(r,null,l,a):jt(t,r,l,a),r.child;case 11:return T_(t,r,r.type,r.pendingProps,a);case 7:return jt(t,r,r.pendingProps,a),r.child;case 8:return jt(t,r,r.pendingProps.children,a),r.child;case 12:return jt(t,r,r.pendingProps.children,a),r.child;case 10:return l=r.pendingProps,yr(r,r.type,l.value),jt(t,r,l.children,a),r.child;case 9:return h=r.type._context,l=r.pendingProps.children,zs(r),h=Kt(h),l=l(h),r.flags|=1,jt(t,r,l,a),r.child;case 14:return E_(t,r,r.type,r.pendingProps,a);case 15:return A_(t,r,r.type,r.pendingProps,a);case 19:return D_(t,r,a);case 31:return l=r.pendingProps,a=r.mode,l={mode:l.mode,children:l.children},t===null?(a=Ac(l,a),a.ref=r.ref,r.child=a,a.return=r,r=a):(a=ji(t.child,l),a.ref=r.ref,r.child=a,a.return=r,r=a),r;case 22:return b_(t,r,a);case 24:return zs(r),l=Kt(St),t===null?(h=Xf(),h===null&&(h=Je,d=Qf(),h.pooledCache=d,d.refCount++,d!==null&&(h.pooledCacheLanes|=a),h=d),r.memoizedState={parent:l,cache:h},Wf(r),yr(r,St,h)):((t.lanes&a)!==0&&(Jf(t,r),hl(r,null,null,a),cl()),h=t.memoizedState,d=r.memoizedState,h.parent!==l?(h={parent:l,cache:l},r.memoizedState=h,r.lanes===0&&(r.memoizedState=r.updateQueue.baseState=h),yr(r,St,l)):(l=d.cache,yr(r,St,l),l!==h.cache&&Yf(r,[St],a,!0))),jt(t,r,r.pendingProps.children,a),r.child;case 29:throw r.pendingProps}throw Error(s(156,r.tag))}function Yi(t){t.flags|=4}function M_(t,r){if(r.type!=="stylesheet"||(r.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!zv(r)){if(r=Un.current,r!==null&&((Pe&4194048)===Pe?mi!==null:(Pe&62914560)!==Pe&&(Pe&536870912)===0||r!==mi))throw ll=Zf,py;t.flags|=8192}}function bc(t,r){r!==null&&(t.flags|=4),t.flags&16384&&(r=t.tag!==22?ko():536870912,t.lanes|=r,Ha|=r)}function _l(t,r){if(!Be)switch(t.tailMode){case"hidden":r=t.tail;for(var a=null;r!==null;)r.alternate!==null&&(a=r),r=r.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?r||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function rt(t){var r=t.alternate!==null&&t.alternate.child===t.child,a=0,l=0;if(r)for(var h=t.child;h!==null;)a|=h.lanes|h.childLanes,l|=h.subtreeFlags&65011712,l|=h.flags&65011712,h.return=t,h=h.sibling;else for(h=t.child;h!==null;)a|=h.lanes|h.childLanes,l|=h.subtreeFlags,l|=h.flags,h.return=t,h=h.sibling;return t.subtreeFlags|=l,t.childLanes=a,r}function yw(t,r,a){var l=r.pendingProps;switch(Ff(r),r.tag){case 31:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return rt(r),null;case 1:return rt(r),null;case 3:return a=r.stateNode,l=null,t!==null&&(l=t.memoizedState.cache),r.memoizedState.cache!==l&&(r.flags|=2048),Fi(St),ti(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(tl(r)?Yi(r):t===null||t.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,cy())),rt(r),null;case 26:return a=r.memoizedState,t===null?(Yi(r),a!==null?(rt(r),M_(r,a)):(rt(r),r.flags&=-16777217)):a?a!==t.memoizedState?(Yi(r),rt(r),M_(r,a)):(rt(r),r.flags&=-16777217):(t.memoizedProps!==l&&Yi(r),rt(r),r.flags&=-16777217),null;case 27:Ii(r),a=Ee.current;var h=r.type;if(t!==null&&r.stateNode!=null)t.memoizedProps!==l&&Yi(r);else{if(!l){if(r.stateNode===null)throw Error(s(166));return rt(r),null}t=pe.current,tl(r)?ly(r):(t=Mv(h,l,a),r.stateNode=t,Yi(r))}return rt(r),null;case 5:if(Ii(r),a=r.type,t!==null&&r.stateNode!=null)t.memoizedProps!==l&&Yi(r);else{if(!l){if(r.stateNode===null)throw Error(s(166));return rt(r),null}if(t=pe.current,tl(r))ly(r);else{switch(h=Pc(Ee.current),t){case 1:t=h.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:t=h.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":t=h.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":t=h.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":t=h.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild);break;case"select":t=typeof l.is=="string"?h.createElement("select",{is:l.is}):h.createElement("select"),l.multiple?t.multiple=!0:l.size&&(t.size=l.size);break;default:t=typeof l.is=="string"?h.createElement(a,{is:l.is}):h.createElement(a)}}t[Et]=r,t[pt]=l;e:for(h=r.child;h!==null;){if(h.tag===5||h.tag===6)t.appendChild(h.stateNode);else if(h.tag!==4&&h.tag!==27&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===r)break e;for(;h.sibling===null;){if(h.return===null||h.return===r)break e;h=h.return}h.sibling.return=h.return,h=h.sibling}r.stateNode=t;e:switch(Bt(t,a,l),a){case"button":case"input":case"select":case"textarea":t=!!l.autoFocus;break e;case"img":t=!0;break e;default:t=!1}t&&Yi(r)}}return rt(r),r.flags&=-16777217,null;case 6:if(t&&r.stateNode!=null)t.memoizedProps!==l&&Yi(r);else{if(typeof l!="string"&&r.stateNode===null)throw Error(s(166));if(t=Ee.current,tl(r)){if(t=r.stateNode,a=r.memoizedProps,l=null,h=sn,h!==null)switch(h.tag){case 27:case 5:l=h.memoizedProps}t[Et]=r,t=!!(t.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||wv(t.nodeValue,a)),t||Ls(r)}else t=Pc(t).createTextNode(l),t[Et]=r,r.stateNode=t}return rt(r),null;case 13:if(l=r.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(h=tl(r),l!==null&&l.dehydrated!==null){if(t===null){if(!h)throw Error(s(318));if(h=r.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(s(317));h[Et]=r}else nl(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;rt(r),h=!1}else h=cy(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=h),h=!0;if(!h)return r.flags&256?(Gi(r),r):(Gi(r),null)}if(Gi(r),(r.flags&128)!==0)return r.lanes=a,r;if(a=l!==null,t=t!==null&&t.memoizedState!==null,a){l=r.child,h=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(h=l.alternate.memoizedState.cachePool.pool);var d=null;l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(d=l.memoizedState.cachePool.pool),d!==h&&(l.flags|=2048)}return a!==t&&a&&(r.child.flags|=8192),bc(r,r.updateQueue),rt(r),null;case 4:return ti(),t===null&&tm(r.stateNode.containerInfo),rt(r),null;case 10:return Fi(r.type),rt(r),null;case 19:if(re(wt),h=r.memoizedState,h===null)return rt(r),null;if(l=(r.flags&128)!==0,d=h.rendering,d===null)if(l)_l(h,!1);else{if(ut!==0||t!==null&&(t.flags&128)!==0)for(t=r.child;t!==null;){if(d=_c(t),d!==null){for(r.flags|=128,_l(h,!1),t=d.updateQueue,r.updateQueue=t,bc(r,t),r.subtreeFlags=0,t=a,a=r.child;a!==null;)ay(a,t),a=a.sibling;return ee(wt,wt.current&1|2),r.child}t=t.sibling}h.tail!==null&&Rn()>Ic&&(r.flags|=128,l=!0,_l(h,!1),r.lanes=4194304)}else{if(!l)if(t=_c(d),t!==null){if(r.flags|=128,l=!0,t=t.updateQueue,r.updateQueue=t,bc(r,t),_l(h,!0),h.tail===null&&h.tailMode==="hidden"&&!d.alternate&&!Be)return rt(r),null}else 2*Rn()-h.renderingStartTime>Ic&&a!==536870912&&(r.flags|=128,l=!0,_l(h,!1),r.lanes=4194304);h.isBackwards?(d.sibling=r.child,r.child=d):(t=h.last,t!==null?t.sibling=d:r.child=d,h.last=d)}return h.tail!==null?(r=h.tail,h.rendering=r,h.tail=r.sibling,h.renderingStartTime=Rn(),r.sibling=null,t=wt.current,ee(wt,l?t&1|2:t&1),r):(rt(r),null);case 22:case 23:return Gi(r),id(),l=r.memoizedState!==null,t!==null?t.memoizedState!==null!==l&&(r.flags|=8192):l&&(r.flags|=8192),l?(a&536870912)!==0&&(r.flags&128)===0&&(rt(r),r.subtreeFlags&6&&(r.flags|=8192)):rt(r),a=r.updateQueue,a!==null&&bc(r,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),l=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(l=r.memoizedState.cachePool.pool),l!==a&&(r.flags|=2048),t!==null&&re(Bs),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),r.memoizedState.cache!==a&&(r.flags|=2048),Fi(St),rt(r),null;case 25:return null;case 30:return null}throw Error(s(156,r.tag))}function _w(t,r){switch(Ff(r),r.tag){case 1:return t=r.flags,t&65536?(r.flags=t&-65537|128,r):null;case 3:return Fi(St),ti(),t=r.flags,(t&65536)!==0&&(t&128)===0?(r.flags=t&-65537|128,r):null;case 26:case 27:case 5:return Ii(r),null;case 13:if(Gi(r),t=r.memoizedState,t!==null&&t.dehydrated!==null){if(r.alternate===null)throw Error(s(340));nl()}return t=r.flags,t&65536?(r.flags=t&-65537|128,r):null;case 19:return re(wt),null;case 4:return ti(),null;case 10:return Fi(r.type),null;case 22:case 23:return Gi(r),id(),t!==null&&re(Bs),t=r.flags,t&65536?(r.flags=t&-65537|128,r):null;case 24:return Fi(St),null;case 25:return null;default:return null}}function x_(t,r){switch(Ff(r),r.tag){case 3:Fi(St),ti();break;case 26:case 27:case 5:Ii(r);break;case 4:ti();break;case 13:Gi(r);break;case 19:re(wt);break;case 10:Fi(r.type);break;case 22:case 23:Gi(r),id(),t!==null&&re(Bs);break;case 24:Fi(St)}}function vl(t,r){try{var a=r.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var h=l.next;a=h;do{if((a.tag&t)===t){l=void 0;var d=a.create,v=a.inst;l=d(),v.destroy=l}a=a.next}while(a!==h)}}catch(A){Ze(r,r.return,A)}}function Sr(t,r,a){try{var l=r.updateQueue,h=l!==null?l.lastEffect:null;if(h!==null){var d=h.next;l=d;do{if((l.tag&t)===t){var v=l.inst,A=v.destroy;if(A!==void 0){v.destroy=void 0,h=r;var R=a,B=A;try{B()}catch(Q){Ze(h,R,Q)}}}l=l.next}while(l!==d)}}catch(Q){Ze(r,r.return,Q)}}function V_(t){var r=t.updateQueue;if(r!==null){var a=t.stateNode;try{Ey(r,a)}catch(l){Ze(t,t.return,l)}}}function k_(t,r,a){a.props=Fs(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(l){Ze(t,r,l)}}function Tl(t,r){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var l=t.stateNode;break;case 30:l=t.stateNode;break;default:l=t.stateNode}typeof a=="function"?t.refCleanup=a(l):a.current=l}}catch(h){Ze(t,r,h)}}function pi(t,r){var a=t.ref,l=t.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(h){Ze(t,r,h)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(h){Ze(t,r,h)}else a.current=null}function P_(t){var r=t.type,a=t.memoizedProps,l=t.stateNode;try{e:switch(r){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(h){Ze(t,t.return,h)}}function Od(t,r,a){try{var l=t.stateNode;jw(l,t.type,a,r),l[pt]=r}catch(h){Ze(t,t.return,h)}}function U_(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Mr(t.type)||t.tag===4}function Md(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||U_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Mr(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function xd(t,r,a){var l=t.tag;if(l===5||l===6)t=t.stateNode,r?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,r):(r=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,r.appendChild(t),a=a._reactRootContainer,a!=null||r.onclick!==null||(r.onclick=kc));else if(l!==4&&(l===27&&Mr(t.type)&&(a=t.stateNode,r=null),t=t.child,t!==null))for(xd(t,r,a),t=t.sibling;t!==null;)xd(t,r,a),t=t.sibling}function Sc(t,r,a){var l=t.tag;if(l===5||l===6)t=t.stateNode,r?a.insertBefore(t,r):a.appendChild(t);else if(l!==4&&(l===27&&Mr(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(Sc(t,r,a),t=t.sibling;t!==null;)Sc(t,r,a),t=t.sibling}function L_(t){var r=t.stateNode,a=t.memoizedProps;try{for(var l=t.type,h=r.attributes;h.length;)r.removeAttributeNode(h[0]);Bt(r,l,a),r[Et]=t,r[pt]=a}catch(d){Ze(t,t.return,d)}}var Qi=!1,ft=!1,Vd=!1,j_=typeof WeakSet=="function"?WeakSet:Set,xt=null;function vw(t,r){if(t=t.containerInfo,rm=qc,t=Xg(t),Mf(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var h=l.anchorOffset,d=l.focusNode;l=l.focusOffset;try{a.nodeType,d.nodeType}catch{a=null;break e}var v=0,A=-1,R=-1,B=0,Q=0,X=t,F=null;t:for(;;){for(var H;X!==a||h!==0&&X.nodeType!==3||(A=v+h),X!==d||l!==0&&X.nodeType!==3||(R=v+l),X.nodeType===3&&(v+=X.nodeValue.length),(H=X.firstChild)!==null;)F=X,X=H;for(;;){if(X===t)break t;if(F===a&&++B===h&&(A=v),F===d&&++Q===l&&(R=v),(H=X.nextSibling)!==null)break;X=F,F=X.parentNode}X=H}a=A===-1||R===-1?null:{start:A,end:R}}else a=null}a=a||{start:0,end:0}}else a=null;for(sm={focusedElem:t,selectionRange:a},qc=!1,xt=r;xt!==null;)if(r=xt,t=r.child,(r.subtreeFlags&1024)!==0&&t!==null)t.return=r,xt=t;else for(;xt!==null;){switch(r=xt,d=r.alternate,t=r.flags,r.tag){case 0:break;case 11:case 15:break;case 1:if((t&1024)!==0&&d!==null){t=void 0,a=r,h=d.memoizedProps,d=d.memoizedState,l=a.stateNode;try{var ve=Fs(a.type,h,a.elementType===a.type);t=l.getSnapshotBeforeUpdate(ve,d),l.__reactInternalSnapshotBeforeUpdate=t}catch(ge){Ze(a,a.return,ge)}}break;case 3:if((t&1024)!==0){if(t=r.stateNode.containerInfo,a=t.nodeType,a===9)lm(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":lm(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(s(163))}if(t=r.sibling,t!==null){t.return=r.return,xt=t;break}xt=r.return}}function z_(t,r,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:wr(t,a),l&4&&vl(5,a);break;case 1:if(wr(t,a),l&4)if(t=a.stateNode,r===null)try{t.componentDidMount()}catch(v){Ze(a,a.return,v)}else{var h=Fs(a.type,r.memoizedProps);r=r.memoizedState;try{t.componentDidUpdate(h,r,t.__reactInternalSnapshotBeforeUpdate)}catch(v){Ze(a,a.return,v)}}l&64&&V_(a),l&512&&Tl(a,a.return);break;case 3:if(wr(t,a),l&64&&(t=a.updateQueue,t!==null)){if(r=null,a.child!==null)switch(a.child.tag){case 27:case 5:r=a.child.stateNode;break;case 1:r=a.child.stateNode}try{Ey(t,r)}catch(v){Ze(a,a.return,v)}}break;case 27:r===null&&l&4&&L_(a);case 26:case 5:wr(t,a),r===null&&l&4&&P_(a),l&512&&Tl(a,a.return);break;case 12:wr(t,a);break;case 13:wr(t,a),l&4&&F_(t,a),l&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=Cw.bind(null,a),Kw(t,a))));break;case 22:if(l=a.memoizedState!==null||Qi,!l){r=r!==null&&r.memoizedState!==null||ft,h=Qi;var d=ft;Qi=l,(ft=r)&&!d?Ir(t,a,(a.subtreeFlags&8772)!==0):wr(t,a),Qi=h,ft=d}break;case 30:break;default:wr(t,a)}}function B_(t){var r=t.alternate;r!==null&&(t.alternate=null,B_(r)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(r=t.stateNode,r!==null&&dr(r)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var nt=null,ln=!1;function $i(t,r,a){for(a=a.child;a!==null;)q_(t,r,a),a=a.sibling}function q_(t,r,a){if(He&&typeof He.onCommitFiberUnmount=="function")try{He.onCommitFiberUnmount(ot,a)}catch{}switch(a.tag){case 26:ft||pi(a,r),$i(t,r,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:ft||pi(a,r);var l=nt,h=ln;Mr(a.type)&&(nt=a.stateNode,ln=!1),$i(t,r,a),Nl(a.stateNode),nt=l,ln=h;break;case 5:ft||pi(a,r);case 6:if(l=nt,h=ln,nt=null,$i(t,r,a),nt=l,ln=h,nt!==null)if(ln)try{(nt.nodeType===9?nt.body:nt.nodeName==="HTML"?nt.ownerDocument.body:nt).removeChild(a.stateNode)}catch(d){Ze(a,r,d)}else try{nt.removeChild(a.stateNode)}catch(d){Ze(a,r,d)}break;case 18:nt!==null&&(ln?(t=nt,Dv(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Ul(t)):Dv(nt,a.stateNode));break;case 4:l=nt,h=ln,nt=a.stateNode.containerInfo,ln=!0,$i(t,r,a),nt=l,ln=h;break;case 0:case 11:case 14:case 15:ft||Sr(2,a,r),ft||Sr(4,a,r),$i(t,r,a);break;case 1:ft||(pi(a,r),l=a.stateNode,typeof l.componentWillUnmount=="function"&&k_(a,r,l)),$i(t,r,a);break;case 21:$i(t,r,a);break;case 22:ft=(l=ft)||a.memoizedState!==null,$i(t,r,a),ft=l;break;default:$i(t,r,a)}}function F_(t,r){if(r.memoizedState===null&&(t=r.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Ul(t)}catch(a){Ze(r,r.return,a)}}function Tw(t){switch(t.tag){case 13:case 19:var r=t.stateNode;return r===null&&(r=t.stateNode=new j_),r;case 22:return t=t.stateNode,r=t._retryCache,r===null&&(r=t._retryCache=new j_),r;default:throw Error(s(435,t.tag))}}function kd(t,r){var a=Tw(t);r.forEach(function(l){var h=Nw.bind(null,t,l);a.has(l)||(a.add(l),l.then(h,h))})}function _n(t,r){var a=r.deletions;if(a!==null)for(var l=0;l<a.length;l++){var h=a[l],d=t,v=r,A=v;e:for(;A!==null;){switch(A.tag){case 27:if(Mr(A.type)){nt=A.stateNode,ln=!1;break e}break;case 5:nt=A.stateNode,ln=!1;break e;case 3:case 4:nt=A.stateNode.containerInfo,ln=!0;break e}A=A.return}if(nt===null)throw Error(s(160));q_(d,v,h),nt=null,ln=!1,d=h.alternate,d!==null&&(d.return=null),h.return=null}if(r.subtreeFlags&13878)for(r=r.child;r!==null;)H_(r,t),r=r.sibling}var Yn=null;function H_(t,r){var a=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:_n(r,t),vn(t),l&4&&(Sr(3,t,t.return),vl(3,t),Sr(5,t,t.return));break;case 1:_n(r,t),vn(t),l&512&&(ft||a===null||pi(a,a.return)),l&64&&Qi&&(t=t.updateQueue,t!==null&&(l=t.callbacks,l!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var h=Yn;if(_n(r,t),vn(t),l&512&&(ft||a===null||pi(a,a.return)),l&4){var d=a!==null?a.memoizedState:null;if(l=t.memoizedState,a===null)if(l===null)if(t.stateNode===null){e:{l=t.type,a=t.memoizedProps,h=h.ownerDocument||h;t:switch(l){case"title":d=h.getElementsByTagName("title")[0],(!d||d[_s]||d[Et]||d.namespaceURI==="http://www.w3.org/2000/svg"||d.hasAttribute("itemprop"))&&(d=h.createElement(l),h.head.insertBefore(d,h.querySelector("head > title"))),Bt(d,l,a),d[Et]=t,ct(d),l=d;break e;case"link":var v=Lv("link","href",h).get(l+(a.href||""));if(v){for(var A=0;A<v.length;A++)if(d=v[A],d.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&d.getAttribute("rel")===(a.rel==null?null:a.rel)&&d.getAttribute("title")===(a.title==null?null:a.title)&&d.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){v.splice(A,1);break t}}d=h.createElement(l),Bt(d,l,a),h.head.appendChild(d);break;case"meta":if(v=Lv("meta","content",h).get(l+(a.content||""))){for(A=0;A<v.length;A++)if(d=v[A],d.getAttribute("content")===(a.content==null?null:""+a.content)&&d.getAttribute("name")===(a.name==null?null:a.name)&&d.getAttribute("property")===(a.property==null?null:a.property)&&d.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&d.getAttribute("charset")===(a.charSet==null?null:a.charSet)){v.splice(A,1);break t}}d=h.createElement(l),Bt(d,l,a),h.head.appendChild(d);break;default:throw Error(s(468,l))}d[Et]=t,ct(d),l=d}t.stateNode=l}else jv(h,t.type,t.stateNode);else t.stateNode=Uv(h,l,t.memoizedProps);else d!==l?(d===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):d.count--,l===null?jv(h,t.type,t.stateNode):Uv(h,l,t.memoizedProps)):l===null&&t.stateNode!==null&&Od(t,t.memoizedProps,a.memoizedProps)}break;case 27:_n(r,t),vn(t),l&512&&(ft||a===null||pi(a,a.return)),a!==null&&l&4&&Od(t,t.memoizedProps,a.memoizedProps);break;case 5:if(_n(r,t),vn(t),l&512&&(ft||a===null||pi(a,a.return)),t.flags&32){h=t.stateNode;try{Nn(h,"")}catch(H){Ze(t,t.return,H)}}l&4&&t.stateNode!=null&&(h=t.memoizedProps,Od(t,h,a!==null?a.memoizedProps:h)),l&1024&&(Vd=!0);break;case 6:if(_n(r,t),vn(t),l&4){if(t.stateNode===null)throw Error(s(162));l=t.memoizedProps,a=t.stateNode;try{a.nodeValue=l}catch(H){Ze(t,t.return,H)}}break;case 3:if(jc=null,h=Yn,Yn=Uc(r.containerInfo),_n(r,t),Yn=h,vn(t),l&4&&a!==null&&a.memoizedState.isDehydrated)try{Ul(r.containerInfo)}catch(H){Ze(t,t.return,H)}Vd&&(Vd=!1,G_(t));break;case 4:l=Yn,Yn=Uc(t.stateNode.containerInfo),_n(r,t),vn(t),Yn=l;break;case 12:_n(r,t),vn(t);break;case 13:_n(r,t),vn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Bd=Rn()),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,kd(t,l)));break;case 22:h=t.memoizedState!==null;var R=a!==null&&a.memoizedState!==null,B=Qi,Q=ft;if(Qi=B||h,ft=Q||R,_n(r,t),ft=Q,Qi=B,vn(t),l&8192)e:for(r=t.stateNode,r._visibility=h?r._visibility&-2:r._visibility|1,h&&(a===null||R||Qi||ft||Hs(t)),a=null,r=t;;){if(r.tag===5||r.tag===26){if(a===null){R=a=r;try{if(d=R.stateNode,h)v=d.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none";else{A=R.stateNode;var X=R.memoizedProps.style,F=X!=null&&X.hasOwnProperty("display")?X.display:null;A.style.display=F==null||typeof F=="boolean"?"":(""+F).trim()}}catch(H){Ze(R,R.return,H)}}}else if(r.tag===6){if(a===null){R=r;try{R.stateNode.nodeValue=h?"":R.memoizedProps}catch(H){Ze(R,R.return,H)}}}else if((r.tag!==22&&r.tag!==23||r.memoizedState===null||r===t)&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break e;for(;r.sibling===null;){if(r.return===null||r.return===t)break e;a===r&&(a=null),r=r.return}a===r&&(a=null),r.sibling.return=r.return,r=r.sibling}l&4&&(l=t.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,kd(t,a))));break;case 19:_n(r,t),vn(t),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,kd(t,l)));break;case 30:break;case 21:break;default:_n(r,t),vn(t)}}function vn(t){var r=t.flags;if(r&2){try{for(var a,l=t.return;l!==null;){if(U_(l)){a=l;break}l=l.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var h=a.stateNode,d=Md(t);Sc(t,d,h);break;case 5:var v=a.stateNode;a.flags&32&&(Nn(v,""),a.flags&=-33);var A=Md(t);Sc(t,A,v);break;case 3:case 4:var R=a.stateNode.containerInfo,B=Md(t);xd(t,B,R);break;default:throw Error(s(161))}}catch(Q){Ze(t,t.return,Q)}t.flags&=-3}r&4096&&(t.flags&=-4097)}function G_(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var r=t;G_(r),r.tag===5&&r.flags&1024&&r.stateNode.reset(),t=t.sibling}}function wr(t,r){if(r.subtreeFlags&8772)for(r=r.child;r!==null;)z_(t,r.alternate,r),r=r.sibling}function Hs(t){for(t=t.child;t!==null;){var r=t;switch(r.tag){case 0:case 11:case 14:case 15:Sr(4,r,r.return),Hs(r);break;case 1:pi(r,r.return);var a=r.stateNode;typeof a.componentWillUnmount=="function"&&k_(r,r.return,a),Hs(r);break;case 27:Nl(r.stateNode);case 26:case 5:pi(r,r.return),Hs(r);break;case 22:r.memoizedState===null&&Hs(r);break;case 30:Hs(r);break;default:Hs(r)}t=t.sibling}}function Ir(t,r,a){for(a=a&&(r.subtreeFlags&8772)!==0,r=r.child;r!==null;){var l=r.alternate,h=t,d=r,v=d.flags;switch(d.tag){case 0:case 11:case 15:Ir(h,d,a),vl(4,d);break;case 1:if(Ir(h,d,a),l=d,h=l.stateNode,typeof h.componentDidMount=="function")try{h.componentDidMount()}catch(B){Ze(l,l.return,B)}if(l=d,h=l.updateQueue,h!==null){var A=l.stateNode;try{var R=h.shared.hiddenCallbacks;if(R!==null)for(h.shared.hiddenCallbacks=null,h=0;h<R.length;h++)Ty(R[h],A)}catch(B){Ze(l,l.return,B)}}a&&v&64&&V_(d),Tl(d,d.return);break;case 27:L_(d);case 26:case 5:Ir(h,d,a),a&&l===null&&v&4&&P_(d),Tl(d,d.return);break;case 12:Ir(h,d,a);break;case 13:Ir(h,d,a),a&&v&4&&F_(h,d);break;case 22:d.memoizedState===null&&Ir(h,d,a),Tl(d,d.return);break;case 30:break;default:Ir(h,d,a)}r=r.sibling}}function Pd(t,r){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(t=r.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&sl(a))}function Ud(t,r){t=null,r.alternate!==null&&(t=r.alternate.memoizedState.cache),r=r.memoizedState.cache,r!==t&&(r.refCount++,t!=null&&sl(t))}function gi(t,r,a,l){if(r.subtreeFlags&10256)for(r=r.child;r!==null;)K_(t,r,a,l),r=r.sibling}function K_(t,r,a,l){var h=r.flags;switch(r.tag){case 0:case 11:case 15:gi(t,r,a,l),h&2048&&vl(9,r);break;case 1:gi(t,r,a,l);break;case 3:gi(t,r,a,l),h&2048&&(t=null,r.alternate!==null&&(t=r.alternate.memoizedState.cache),r=r.memoizedState.cache,r!==t&&(r.refCount++,t!=null&&sl(t)));break;case 12:if(h&2048){gi(t,r,a,l),t=r.stateNode;try{var d=r.memoizedProps,v=d.id,A=d.onPostCommit;typeof A=="function"&&A(v,r.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(R){Ze(r,r.return,R)}}else gi(t,r,a,l);break;case 13:gi(t,r,a,l);break;case 23:break;case 22:d=r.stateNode,v=r.alternate,r.memoizedState!==null?d._visibility&2?gi(t,r,a,l):El(t,r):d._visibility&2?gi(t,r,a,l):(d._visibility|=2,Ba(t,r,a,l,(r.subtreeFlags&10256)!==0)),h&2048&&Pd(v,r);break;case 24:gi(t,r,a,l),h&2048&&Ud(r.alternate,r);break;default:gi(t,r,a,l)}}function Ba(t,r,a,l,h){for(h=h&&(r.subtreeFlags&10256)!==0,r=r.child;r!==null;){var d=t,v=r,A=a,R=l,B=v.flags;switch(v.tag){case 0:case 11:case 15:Ba(d,v,A,R,h),vl(8,v);break;case 23:break;case 22:var Q=v.stateNode;v.memoizedState!==null?Q._visibility&2?Ba(d,v,A,R,h):El(d,v):(Q._visibility|=2,Ba(d,v,A,R,h)),h&&B&2048&&Pd(v.alternate,v);break;case 24:Ba(d,v,A,R,h),h&&B&2048&&Ud(v.alternate,v);break;default:Ba(d,v,A,R,h)}r=r.sibling}}function El(t,r){if(r.subtreeFlags&10256)for(r=r.child;r!==null;){var a=t,l=r,h=l.flags;switch(l.tag){case 22:El(a,l),h&2048&&Pd(l.alternate,l);break;case 24:El(a,l),h&2048&&Ud(l.alternate,l);break;default:El(a,l)}r=r.sibling}}var Al=8192;function qa(t){if(t.subtreeFlags&Al)for(t=t.child;t!==null;)Y_(t),t=t.sibling}function Y_(t){switch(t.tag){case 26:qa(t),t.flags&Al&&t.memoizedState!==null&&sI(Yn,t.memoizedState,t.memoizedProps);break;case 5:qa(t);break;case 3:case 4:var r=Yn;Yn=Uc(t.stateNode.containerInfo),qa(t),Yn=r;break;case 22:t.memoizedState===null&&(r=t.alternate,r!==null&&r.memoizedState!==null?(r=Al,Al=16777216,qa(t),Al=r):qa(t));break;default:qa(t)}}function Q_(t){var r=t.alternate;if(r!==null&&(t=r.child,t!==null)){r.child=null;do r=t.sibling,t.sibling=null,t=r;while(t!==null)}}function bl(t){var r=t.deletions;if((t.flags&16)!==0){if(r!==null)for(var a=0;a<r.length;a++){var l=r[a];xt=l,X_(l,t)}Q_(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)$_(t),t=t.sibling}function $_(t){switch(t.tag){case 0:case 11:case 15:bl(t),t.flags&2048&&Sr(9,t,t.return);break;case 3:bl(t);break;case 12:bl(t);break;case 22:var r=t.stateNode;t.memoizedState!==null&&r._visibility&2&&(t.return===null||t.return.tag!==13)?(r._visibility&=-3,wc(t)):bl(t);break;default:bl(t)}}function wc(t){var r=t.deletions;if((t.flags&16)!==0){if(r!==null)for(var a=0;a<r.length;a++){var l=r[a];xt=l,X_(l,t)}Q_(t)}for(t=t.child;t!==null;){switch(r=t,r.tag){case 0:case 11:case 15:Sr(8,r,r.return),wc(r);break;case 22:a=r.stateNode,a._visibility&2&&(a._visibility&=-3,wc(r));break;default:wc(r)}t=t.sibling}}function X_(t,r){for(;xt!==null;){var a=xt;switch(a.tag){case 0:case 11:case 15:Sr(8,a,r);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:sl(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,xt=l;else e:for(a=t;xt!==null;){l=xt;var h=l.sibling,d=l.return;if(B_(l),l===a){xt=null;break e}if(h!==null){h.return=d,xt=h;break e}xt=d}}}var Ew={getCacheForType:function(t){var r=Kt(St),a=r.data.get(t);return a===void 0&&(a=t(),r.data.set(t,a)),a}},Aw=typeof WeakMap=="function"?WeakMap:Map,Ge=0,Je=null,De=null,Pe=0,Ke=0,Tn=null,Rr=!1,Fa=!1,Ld=!1,Xi=0,ut=0,Cr=0,Gs=0,jd=0,Ln=0,Ha=0,Sl=null,un=null,zd=!1,Bd=0,Ic=1/0,Rc=null,Nr=null,zt=0,Dr=null,Ga=null,Ka=0,qd=0,Fd=null,Z_=null,wl=0,Hd=null;function En(){if((Ge&2)!==0&&Pe!==0)return Pe&-Pe;if(Y.T!==null){var t=xa;return t!==0?t:Zd()}return hr()}function W_(){Ln===0&&(Ln=(Pe&536870912)===0||Be?Vo():536870912);var t=Un.current;return t!==null&&(t.flags|=32),Ln}function An(t,r,a){(t===Je&&(Ke===2||Ke===9)||t.cancelPendingCommit!==null)&&(Ya(t,0),Or(t,Pe,Ln,!1)),Ci(t,a),((Ge&2)===0||t!==Je)&&(t===Je&&((Ge&2)===0&&(Gs|=a),ut===4&&Or(t,Pe,Ln,!1)),yi(t))}function J_(t,r,a){if((Ge&6)!==0)throw Error(s(327));var l=!a&&(r&124)===0&&(r&t.expiredLanes)===0||ys(t,r),h=l?ww(t,r):Yd(t,r,!0),d=l;do{if(h===0){Fa&&!l&&Or(t,r,0,!1);break}else{if(a=t.current.alternate,d&&!bw(a)){h=Yd(t,r,!1),d=!1;continue}if(h===2){if(d=r,t.errorRecoveryDisabledLanes&d)var v=0;else v=t.pendingLanes&-536870913,v=v!==0?v:v&536870912?536870912:0;if(v!==0){r=v;e:{var A=t;h=Sl;var R=A.current.memoizedState.isDehydrated;if(R&&(Ya(A,v).flags|=256),v=Yd(A,v,!1),v!==2){if(Ld&&!R){A.errorRecoveryDisabledLanes|=d,Gs|=d,h=4;break e}d=un,un=h,d!==null&&(un===null?un=d:un.push.apply(un,d))}h=v}if(d=!1,h!==2)continue}}if(h===1){Ya(t,0),Or(t,r,0,!0);break}e:{switch(l=t,d=h,d){case 0:case 1:throw Error(s(345));case 4:if((r&4194048)!==r)break;case 6:Or(l,r,Ln,!Rr);break e;case 2:un=null;break;case 3:case 5:break;default:throw Error(s(329))}if((r&62914560)===r&&(h=Bd+300-Rn(),10<h)){if(Or(l,r,Ln,!Rr),ca(l,0,!0)!==0)break e;l.timeoutHandle=Cv(ev.bind(null,l,a,un,Rc,zd,r,Ln,Gs,Ha,Rr,d,2,-0,0),h);break e}ev(l,a,un,Rc,zd,r,Ln,Gs,Ha,Rr,d,0,-0,0)}}break}while(!0);yi(t)}function ev(t,r,a,l,h,d,v,A,R,B,Q,X,F,H){if(t.timeoutHandle=-1,X=r.subtreeFlags,(X&8192||(X&16785408)===16785408)&&(Ml={stylesheets:null,count:0,unsuspend:rI},Y_(r),X=aI(),X!==null)){t.cancelPendingCommit=X(ov.bind(null,t,r,d,a,l,h,v,A,R,Q,1,F,H)),Or(t,d,v,!B);return}ov(t,r,d,a,l,h,v,A,R)}function bw(t){for(var r=t;;){var a=r.tag;if((a===0||a===11||a===15)&&r.flags&16384&&(a=r.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var h=a[l],d=h.getSnapshot;h=h.value;try{if(!gn(d(),h))return!1}catch{return!1}}if(a=r.child,r.subtreeFlags&16384&&a!==null)a.return=r,r=a;else{if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function Or(t,r,a,l){r&=~jd,r&=~Gs,t.suspendedLanes|=r,t.pingedLanes&=~r,l&&(t.warmLanes|=r),l=t.expirationTimes;for(var h=r;0<h;){var d=31-Gt(h),v=1<<d;l[d]=-1,h&=~v}a!==0&&ni(t,a,r)}function Cc(){return(Ge&6)===0?(Il(0),!1):!0}function Gd(){if(De!==null){if(Ke===0)var t=De.return;else t=De,qi=js=null,ld(t),ja=null,gl=0,t=De;for(;t!==null;)x_(t.alternate,t),t=t.return;De=null}}function Ya(t,r){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,Bw(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Gd(),Je=t,De=a=ji(t.current,null),Pe=r,Ke=0,Tn=null,Rr=!1,Fa=ys(t,r),Ld=!1,Ha=Ln=jd=Gs=Cr=ut=0,un=Sl=null,zd=!1,(r&8)!==0&&(r|=r&32);var l=t.entangledLanes;if(l!==0)for(t=t.entanglements,l&=r;0<l;){var h=31-Gt(l),d=1<<h;r|=t[h],l&=~d}return Xi=r,Xu(),a}function tv(t,r){Ie=null,Y.H=pc,r===ol||r===sc?(r=_y(),Ke=3):r===py?(r=_y(),Ke=4):Ke=r===v_?8:r!==null&&typeof r=="object"&&typeof r.then=="function"?6:1,Tn=r,De===null&&(ut=1,Tc(t,xn(r,t.current)))}function nv(){var t=Y.H;return Y.H=pc,t===null?pc:t}function iv(){var t=Y.A;return Y.A=Ew,t}function Kd(){ut=4,Rr||(Pe&4194048)!==Pe&&Un.current!==null||(Fa=!0),(Cr&134217727)===0&&(Gs&134217727)===0||Je===null||Or(Je,Pe,Ln,!1)}function Yd(t,r,a){var l=Ge;Ge|=2;var h=nv(),d=iv();(Je!==t||Pe!==r)&&(Rc=null,Ya(t,r)),r=!1;var v=ut;e:do try{if(Ke!==0&&De!==null){var A=De,R=Tn;switch(Ke){case 8:Gd(),v=6;break e;case 3:case 2:case 9:case 6:Un.current===null&&(r=!0);var B=Ke;if(Ke=0,Tn=null,Qa(t,A,R,B),a&&Fa){v=0;break e}break;default:B=Ke,Ke=0,Tn=null,Qa(t,A,R,B)}}Sw(),v=ut;break}catch(Q){tv(t,Q)}while(!0);return r&&t.shellSuspendCounter++,qi=js=null,Ge=l,Y.H=h,Y.A=d,De===null&&(Je=null,Pe=0,Xu()),v}function Sw(){for(;De!==null;)rv(De)}function ww(t,r){var a=Ge;Ge|=2;var l=nv(),h=iv();Je!==t||Pe!==r?(Rc=null,Ic=Rn()+500,Ya(t,r)):Fa=ys(t,r);e:do try{if(Ke!==0&&De!==null){r=De;var d=Tn;t:switch(Ke){case 1:Ke=0,Tn=null,Qa(t,r,d,1);break;case 2:case 9:if(gy(d)){Ke=0,Tn=null,sv(r);break}r=function(){Ke!==2&&Ke!==9||Je!==t||(Ke=7),yi(t)},d.then(r,r);break e;case 3:Ke=7;break e;case 4:Ke=5;break e;case 7:gy(d)?(Ke=0,Tn=null,sv(r)):(Ke=0,Tn=null,Qa(t,r,d,7));break;case 5:var v=null;switch(De.tag){case 26:v=De.memoizedState;case 5:case 27:var A=De;if(!v||zv(v)){Ke=0,Tn=null;var R=A.sibling;if(R!==null)De=R;else{var B=A.return;B!==null?(De=B,Nc(B)):De=null}break t}}Ke=0,Tn=null,Qa(t,r,d,5);break;case 6:Ke=0,Tn=null,Qa(t,r,d,6);break;case 8:Gd(),ut=6;break e;default:throw Error(s(462))}}Iw();break}catch(Q){tv(t,Q)}while(!0);return qi=js=null,Y.H=l,Y.A=h,Ge=a,De!==null?0:(Je=null,Pe=0,Xu(),ut)}function Iw(){for(;De!==null&&!Do();)rv(De)}function rv(t){var r=O_(t.alternate,t,Xi);t.memoizedProps=t.pendingProps,r===null?Nc(t):De=r}function sv(t){var r=t,a=r.alternate;switch(r.tag){case 15:case 0:r=w_(a,r,r.pendingProps,r.type,void 0,Pe);break;case 11:r=w_(a,r,r.pendingProps,r.type.render,r.ref,Pe);break;case 5:ld(r);default:x_(a,r),r=De=ay(r,Xi),r=O_(a,r,Xi)}t.memoizedProps=t.pendingProps,r===null?Nc(t):De=r}function Qa(t,r,a,l){qi=js=null,ld(r),ja=null,gl=0;var h=r.return;try{if(pw(t,h,r,a,Pe)){ut=1,Tc(t,xn(a,t.current)),De=null;return}}catch(d){if(h!==null)throw De=h,d;ut=1,Tc(t,xn(a,t.current)),De=null;return}r.flags&32768?(Be||l===1?t=!0:Fa||(Pe&536870912)!==0?t=!1:(Rr=t=!0,(l===2||l===9||l===3||l===6)&&(l=Un.current,l!==null&&l.tag===13&&(l.flags|=16384))),av(r,t)):Nc(r)}function Nc(t){var r=t;do{if((r.flags&32768)!==0){av(r,Rr);return}t=r.return;var a=yw(r.alternate,r,Xi);if(a!==null){De=a;return}if(r=r.sibling,r!==null){De=r;return}De=r=t}while(r!==null);ut===0&&(ut=5)}function av(t,r){do{var a=_w(t.alternate,t);if(a!==null){a.flags&=32767,De=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!r&&(t=t.sibling,t!==null)){De=t;return}De=t=a}while(t!==null);ut=6,De=null}function ov(t,r,a,l,h,d,v,A,R){t.cancelPendingCommit=null;do Dc();while(zt!==0);if((Ge&6)!==0)throw Error(s(327));if(r!==null){if(r===t.current)throw Error(s(177));if(d=r.lanes|r.childLanes,d|=Uf,Po(t,a,d,v,A,R),t===Je&&(De=Je=null,Pe=0),Ga=r,Dr=t,Ka=a,qd=d,Fd=h,Z_=l,(r.subtreeFlags&10256)!==0||(r.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,Dw(ds,function(){return fv(),null})):(t.callbackNode=null,t.callbackPriority=0),l=(r.flags&13878)!==0,(r.subtreeFlags&13878)!==0||l){l=Y.T,Y.T=null,h=ie.p,ie.p=2,v=Ge,Ge|=4;try{vw(t,r,a)}finally{Ge=v,ie.p=h,Y.T=l}}zt=1,lv(),uv(),cv()}}function lv(){if(zt===1){zt=0;var t=Dr,r=Ga,a=(r.flags&13878)!==0;if((r.subtreeFlags&13878)!==0||a){a=Y.T,Y.T=null;var l=ie.p;ie.p=2;var h=Ge;Ge|=4;try{H_(r,t);var d=sm,v=Xg(t.containerInfo),A=d.focusedElem,R=d.selectionRange;if(v!==A&&A&&A.ownerDocument&&$g(A.ownerDocument.documentElement,A)){if(R!==null&&Mf(A)){var B=R.start,Q=R.end;if(Q===void 0&&(Q=B),"selectionStart"in A)A.selectionStart=B,A.selectionEnd=Math.min(Q,A.value.length);else{var X=A.ownerDocument||document,F=X&&X.defaultView||window;if(F.getSelection){var H=F.getSelection(),ve=A.textContent.length,ge=Math.min(R.start,ve),Xe=R.end===void 0?ge:Math.min(R.end,ve);!H.extend&&ge>Xe&&(v=Xe,Xe=ge,ge=v);var L=Qg(A,ge),M=Qg(A,Xe);if(L&&M&&(H.rangeCount!==1||H.anchorNode!==L.node||H.anchorOffset!==L.offset||H.focusNode!==M.node||H.focusOffset!==M.offset)){var z=X.createRange();z.setStart(L.node,L.offset),H.removeAllRanges(),ge>Xe?(H.addRange(z),H.extend(M.node,M.offset)):(z.setEnd(M.node,M.offset),H.addRange(z))}}}}for(X=[],H=A;H=H.parentNode;)H.nodeType===1&&X.push({element:H,left:H.scrollLeft,top:H.scrollTop});for(typeof A.focus=="function"&&A.focus(),A=0;A<X.length;A++){var $=X[A];$.element.scrollLeft=$.left,$.element.scrollTop=$.top}}qc=!!rm,sm=rm=null}finally{Ge=h,ie.p=l,Y.T=a}}t.current=r,zt=2}}function uv(){if(zt===2){zt=0;var t=Dr,r=Ga,a=(r.flags&8772)!==0;if((r.subtreeFlags&8772)!==0||a){a=Y.T,Y.T=null;var l=ie.p;ie.p=2;var h=Ge;Ge|=4;try{z_(t,r.alternate,r)}finally{Ge=h,ie.p=l,Y.T=a}}zt=3}}function cv(){if(zt===4||zt===3){zt=0,wu();var t=Dr,r=Ga,a=Ka,l=Z_;(r.subtreeFlags&10256)!==0||(r.flags&10256)!==0?zt=5:(zt=0,Ga=Dr=null,hv(t,t.pendingLanes));var h=t.pendingLanes;if(h===0&&(Nr=null),ha(a),r=r.stateNode,He&&typeof He.onCommitFiberRoot=="function")try{He.onCommitFiberRoot(ot,r,void 0,(r.current.flags&128)===128)}catch{}if(l!==null){r=Y.T,h=ie.p,ie.p=2,Y.T=null;try{for(var d=t.onRecoverableError,v=0;v<l.length;v++){var A=l[v];d(A.value,{componentStack:A.stack})}}finally{Y.T=r,ie.p=h}}(Ka&3)!==0&&Dc(),yi(t),h=t.pendingLanes,(a&4194090)!==0&&(h&42)!==0?t===Hd?wl++:(wl=0,Hd=t):wl=0,Il(0)}}function hv(t,r){(t.pooledCacheLanes&=r)===0&&(r=t.pooledCache,r!=null&&(t.pooledCache=null,sl(r)))}function Dc(t){return lv(),uv(),cv(),fv()}function fv(){if(zt!==5)return!1;var t=Dr,r=qd;qd=0;var a=ha(Ka),l=Y.T,h=ie.p;try{ie.p=32>a?32:a,Y.T=null,a=Fd,Fd=null;var d=Dr,v=Ka;if(zt=0,Ga=Dr=null,Ka=0,(Ge&6)!==0)throw Error(s(331));var A=Ge;if(Ge|=4,$_(d.current),K_(d,d.current,v,a),Ge=A,Il(0,!1),He&&typeof He.onPostCommitFiberRoot=="function")try{He.onPostCommitFiberRoot(ot,d)}catch{}return!0}finally{ie.p=h,Y.T=l,hv(t,r)}}function dv(t,r,a){r=xn(a,r),r=Ad(t.stateNode,r,2),t=Tr(t,r,2),t!==null&&(Ci(t,2),yi(t))}function Ze(t,r,a){if(t.tag===3)dv(t,t,a);else for(;r!==null;){if(r.tag===3){dv(r,t,a);break}else if(r.tag===1){var l=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Nr===null||!Nr.has(l))){t=xn(a,t),a=y_(2),l=Tr(r,a,2),l!==null&&(__(a,l,r,t),Ci(l,2),yi(l));break}}r=r.return}}function Qd(t,r,a){var l=t.pingCache;if(l===null){l=t.pingCache=new Aw;var h=new Set;l.set(r,h)}else h=l.get(r),h===void 0&&(h=new Set,l.set(r,h));h.has(a)||(Ld=!0,h.add(a),t=Rw.bind(null,t,r,a),r.then(t,t))}function Rw(t,r,a){var l=t.pingCache;l!==null&&l.delete(r),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Je===t&&(Pe&a)===a&&(ut===4||ut===3&&(Pe&62914560)===Pe&&300>Rn()-Bd?(Ge&2)===0&&Ya(t,0):jd|=a,Ha===Pe&&(Ha=0)),yi(t)}function mv(t,r){r===0&&(r=ko()),t=Na(t,r),t!==null&&(Ci(t,r),yi(t))}function Cw(t){var r=t.memoizedState,a=0;r!==null&&(a=r.retryLane),mv(t,a)}function Nw(t,r){var a=0;switch(t.tag){case 13:var l=t.stateNode,h=t.memoizedState;h!==null&&(a=h.retryLane);break;case 19:l=t.stateNode;break;case 22:l=t.stateNode._retryCache;break;default:throw Error(s(314))}l!==null&&l.delete(r),mv(t,a)}function Dw(t,r){return hs(t,r)}var Oc=null,$a=null,$d=!1,Mc=!1,Xd=!1,Ks=0;function yi(t){t!==$a&&t.next===null&&($a===null?Oc=$a=t:$a=$a.next=t),Mc=!0,$d||($d=!0,Mw())}function Il(t,r){if(!Xd&&Mc){Xd=!0;do for(var a=!1,l=Oc;l!==null;){if(t!==0){var h=l.pendingLanes;if(h===0)var d=0;else{var v=l.suspendedLanes,A=l.pingedLanes;d=(1<<31-Gt(42|t)+1)-1,d&=h&~(v&~A),d=d&201326741?d&201326741|1:d?d|2:0}d!==0&&(a=!0,_v(l,d))}else d=Pe,d=ca(l,l===Je?d:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(d&3)===0||ys(l,d)||(a=!0,_v(l,d));l=l.next}while(a);Xd=!1}}function Ow(){pv()}function pv(){Mc=$d=!1;var t=0;Ks!==0&&(zw()&&(t=Ks),Ks=0);for(var r=Rn(),a=null,l=Oc;l!==null;){var h=l.next,d=gv(l,r);d===0?(l.next=null,a===null?Oc=h:a.next=h,h===null&&($a=a)):(a=l,(t!==0||(d&3)!==0)&&(Mc=!0)),l=h}Il(t)}function gv(t,r){for(var a=t.suspendedLanes,l=t.pingedLanes,h=t.expirationTimes,d=t.pendingLanes&-62914561;0<d;){var v=31-Gt(d),A=1<<v,R=h[v];R===-1?((A&a)===0||(A&l)!==0)&&(h[v]=xo(A,r)):R<=r&&(t.expiredLanes|=A),d&=~A}if(r=Je,a=Pe,a=ca(t,t===r?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),l=t.callbackNode,a===0||t===r&&(Ke===2||Ke===9)||t.cancelPendingCommit!==null)return l!==null&&l!==null&&fs(l),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||ys(t,a)){if(r=a&-a,r===t.callbackPriority)return r;switch(l!==null&&fs(l),ha(a)){case 2:case 8:a=la;break;case 32:a=ds;break;case 268435456:a=ua;break;default:a=ds}return l=yv.bind(null,t),a=hs(a,l),t.callbackPriority=r,t.callbackNode=a,r}return l!==null&&l!==null&&fs(l),t.callbackPriority=2,t.callbackNode=null,2}function yv(t,r){if(zt!==0&&zt!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Dc()&&t.callbackNode!==a)return null;var l=Pe;return l=ca(t,t===Je?l:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),l===0?null:(J_(t,l,r),gv(t,Rn()),t.callbackNode!=null&&t.callbackNode===a?yv.bind(null,t):null)}function _v(t,r){if(Dc())return null;J_(t,r,!0)}function Mw(){qw(function(){(Ge&6)!==0?hs(Oo,Ow):pv()})}function Zd(){return Ks===0&&(Ks=Vo()),Ks}function vv(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:ya(""+t)}function Tv(t,r){var a=r.ownerDocument.createElement("input");return a.name=r.name,a.value=r.value,t.id&&a.setAttribute("form",t.id),r.parentNode.insertBefore(a,r),t=new FormData(t),a.parentNode.removeChild(a),t}function xw(t,r,a,l,h){if(r==="submit"&&a&&a.stateNode===h){var d=vv((h[pt]||null).action),v=l.submitter;v&&(r=(r=v[pt]||null)?vv(r.formAction):v.getAttribute("formAction"),r!==null&&(d=r,v=null));var A=new _a("action","action",null,l,h);t.push({event:A,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Ks!==0){var R=v?Tv(h,v):new FormData(h);yd(a,{pending:!0,data:R,method:h.method,action:d},null,R)}}else typeof d=="function"&&(A.preventDefault(),R=v?Tv(h,v):new FormData(h),yd(a,{pending:!0,data:R,method:h.method,action:d},d,R))},currentTarget:h}]})}}for(var Wd=0;Wd<Pf.length;Wd++){var Jd=Pf[Wd],Vw=Jd.toLowerCase(),kw=Jd[0].toUpperCase()+Jd.slice(1);Kn(Vw,"on"+kw)}Kn(Jg,"onAnimationEnd"),Kn(ey,"onAnimationIteration"),Kn(ty,"onAnimationStart"),Kn("dblclick","onDoubleClick"),Kn("focusin","onFocus"),Kn("focusout","onBlur"),Kn(WS,"onTransitionRun"),Kn(JS,"onTransitionStart"),Kn(ew,"onTransitionCancel"),Kn(ny,"onTransitionEnd"),Di("onMouseEnter",["mouseout","mouseover"]),Di("onMouseLeave",["mouseout","mouseover"]),Di("onPointerEnter",["pointerout","pointerover"]),Di("onPointerLeave",["pointerout","pointerover"]),Hn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Hn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Hn("onBeforeInput",["compositionend","keypress","textInput","paste"]),Hn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Hn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Hn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Rl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Pw=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Rl));function Ev(t,r){r=(r&4)!==0;for(var a=0;a<t.length;a++){var l=t[a],h=l.event;l=l.listeners;e:{var d=void 0;if(r)for(var v=l.length-1;0<=v;v--){var A=l[v],R=A.instance,B=A.currentTarget;if(A=A.listener,R!==d&&h.isPropagationStopped())break e;d=A,h.currentTarget=B;try{d(h)}catch(Q){vc(Q)}h.currentTarget=null,d=R}else for(v=0;v<l.length;v++){if(A=l[v],R=A.instance,B=A.currentTarget,A=A.listener,R!==d&&h.isPropagationStopped())break e;d=A,h.currentTarget=B;try{d(h)}catch(Q){vc(Q)}h.currentTarget=null,d=R}}}}function Oe(t,r){var a=r[Lo];a===void 0&&(a=r[Lo]=new Set);var l=t+"__bubble";a.has(l)||(Av(r,t,2,!1),a.add(l))}function em(t,r,a){var l=0;r&&(l|=4),Av(a,t,l,r)}var xc="_reactListening"+Math.random().toString(36).slice(2);function tm(t){if(!t[xc]){t[xc]=!0,jo.forEach(function(a){a!=="selectionchange"&&(Pw.has(a)||em(a,!1,t),em(a,!0,t))});var r=t.nodeType===9?t:t.ownerDocument;r===null||r[xc]||(r[xc]=!0,em("selectionchange",!1,r))}}function Av(t,r,a,l){switch(Kv(r)){case 2:var h=uI;break;case 8:h=cI;break;default:h=pm}a=h.bind(null,r,a,t),h=void 0,!On||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(h=!0),l?h!==void 0?t.addEventListener(r,a,{capture:!0,passive:h}):t.addEventListener(r,a,!0):h!==void 0?t.addEventListener(r,a,{passive:h}):t.addEventListener(r,a,!1)}function nm(t,r,a,l,h){var d=l;if((r&1)===0&&(r&2)===0&&l!==null)e:for(;;){if(l===null)return;var v=l.tag;if(v===3||v===4){var A=l.stateNode.containerInfo;if(A===h)break;if(v===4)for(v=l.return;v!==null;){var R=v.tag;if((R===3||R===4)&&v.stateNode.containerInfo===h)return;v=v.return}for(;A!==null;){if(v=Ni(A),v===null)return;if(R=v.tag,R===5||R===6||R===26||R===27){l=d=v;continue e}A=A.parentNode}}l=l.return}ku(function(){var B=d,Q=Dn(a),X=[];e:{var F=iy.get(t);if(F!==void 0){var H=_a,ve=t;switch(t){case"keypress":if(li(a)===0)break e;case"keydown":case"keyup":H=Sa;break;case"focusin":ve="focus",H=Ea;break;case"focusout":ve="blur",H=Ea;break;case"beforeblur":case"afterblur":H=Ea;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":H=Mn;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":H=Cf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":H=Fu;break;case Jg:case ey:case ty:H=Aa;break;case ny:H=Gu;break;case"scroll":case"scrollend":H=Pu;break;case"wheel":H=wa;break;case"copy":case"cut":case"paste":H=ba;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":H=Zo;break;case"toggle":case"beforetoggle":H=Yu}var ge=(r&4)!==0,Xe=!ge&&(t==="scroll"||t==="scrollend"),L=ge?F!==null?F+"Capture":null:F;ge=[];for(var M=B,z;M!==null;){var $=M;if(z=$.stateNode,$=$.tag,$!==5&&$!==26&&$!==27||z===null||L===null||($=ws(M,L),$!=null&&ge.push(Cl(M,$,z))),Xe)break;M=M.return}0<ge.length&&(F=new H(F,ve,null,a,Q),X.push({event:F,listeners:ge}))}}if((r&7)===0){e:{if(F=t==="mouseover"||t==="pointerover",H=t==="mouseout"||t==="pointerout",F&&a!==xi&&(ve=a.relatedTarget||a.fromElement)&&(Ni(ve)||ve[Cn]))break e;if((H||F)&&(F=Q.window===Q?Q:(F=Q.ownerDocument)?F.defaultView||F.parentWindow:window,H?(ve=a.relatedTarget||a.toElement,H=B,ve=ve?Ni(ve):null,ve!==null&&(Xe=u(ve),ge=ve.tag,ve!==Xe||ge!==5&&ge!==27&&ge!==6)&&(ve=null)):(H=null,ve=B),H!==ve)){if(ge=Mn,$="onMouseLeave",L="onMouseEnter",M="mouse",(t==="pointerout"||t==="pointerover")&&(ge=Zo,$="onPointerLeave",L="onPointerEnter",M="pointer"),Xe=H==null?F:ri(H),z=ve==null?F:ri(ve),F=new ge($,M+"leave",H,a,Q),F.target=Xe,F.relatedTarget=z,$=null,Ni(Q)===B&&(ge=new ge(L,M+"enter",ve,a,Q),ge.target=z,ge.relatedTarget=Xe,$=ge),Xe=$,H&&ve)t:{for(ge=H,L=ve,M=0,z=ge;z;z=Xa(z))M++;for(z=0,$=L;$;$=Xa($))z++;for(;0<M-z;)ge=Xa(ge),M--;for(;0<z-M;)L=Xa(L),z--;for(;M--;){if(ge===L||L!==null&&ge===L.alternate)break t;ge=Xa(ge),L=Xa(L)}ge=null}else ge=null;H!==null&&bv(X,F,H,ge,!1),ve!==null&&Xe!==null&&bv(X,Xe,ve,ge,!0)}}e:{if(F=B?ri(B):window,H=F.nodeName&&F.nodeName.toLowerCase(),H==="select"||H==="input"&&F.type==="file")var ue=qg;else if(bt(F))if(Fg)ue=$S;else{ue=YS;var Ne=KS}else H=F.nodeName,!H||H.toLowerCase()!=="input"||F.type!=="checkbox"&&F.type!=="radio"?B&&Ho(B.elementType)&&(ue=qg):ue=QS;if(ue&&(ue=ue(t,B))){Li(X,ue,a,Q);break e}Ne&&Ne(t,F,B),t==="focusout"&&B&&F.type==="number"&&B.memoizedProps.value!=null&&pr(F,"number",F.value)}switch(Ne=B?ri(B):window,t){case"focusin":(bt(Ne)||Ne.contentEditable==="true")&&(Ia=Ne,xf=B,el=null);break;case"focusout":el=xf=Ia=null;break;case"mousedown":Vf=!0;break;case"contextmenu":case"mouseup":case"dragend":Vf=!1,Zg(X,a,Q);break;case"selectionchange":if(ZS)break;case"keydown":case"keyup":Zg(X,a,Q)}var ce;if(hi)e:{switch(t){case"compositionstart":var ye="onCompositionStart";break e;case"compositionend":ye="onCompositionEnd";break e;case"compositionupdate":ye="onCompositionUpdate";break e}ye=void 0}else Ve?G(t,a)&&(ye="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(ye="onCompositionStart");ye&&(_&&a.locale!=="ko"&&(Ve||ye!=="onCompositionStart"?ye==="onCompositionEnd"&&Ve&&(ce=Ko()):(oi=Q,gr="value"in oi?oi.value:oi.textContent,Ve=!0)),Ne=Vc(B,ye),0<Ne.length&&(ye=new $o(ye,t,null,a,Q),X.push({event:ye,listeners:Ne}),ce?ye.data=ce:(ce=te(a),ce!==null&&(ye.data=ce)))),(ce=g?At(t,a):ke(t,a))&&(ye=Vc(B,"onBeforeInput"),0<ye.length&&(Ne=new $o("onBeforeInput","beforeinput",null,a,Q),X.push({event:Ne,listeners:ye}),Ne.data=ce)),xw(X,t,B,a,Q)}Ev(X,r)})}function Cl(t,r,a){return{instance:t,listener:r,currentTarget:a}}function Vc(t,r){for(var a=r+"Capture",l=[];t!==null;){var h=t,d=h.stateNode;if(h=h.tag,h!==5&&h!==26&&h!==27||d===null||(h=ws(t,a),h!=null&&l.unshift(Cl(t,h,d)),h=ws(t,r),h!=null&&l.push(Cl(t,h,d))),t.tag===3)return l;t=t.return}return[]}function Xa(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function bv(t,r,a,l,h){for(var d=r._reactName,v=[];a!==null&&a!==l;){var A=a,R=A.alternate,B=A.stateNode;if(A=A.tag,R!==null&&R===l)break;A!==5&&A!==26&&A!==27||B===null||(R=B,h?(B=ws(a,d),B!=null&&v.unshift(Cl(a,B,R))):h||(B=ws(a,d),B!=null&&v.push(Cl(a,B,R)))),a=a.return}v.length!==0&&t.push({event:r,listeners:v})}var Uw=/\r\n?/g,Lw=/\u0000|\uFFFD/g;function Sv(t){return(typeof t=="string"?t:""+t).replace(Uw,`
`).replace(Lw,"")}function wv(t,r){return r=Sv(r),Sv(t)===r}function kc(){}function $e(t,r,a,l,h,d){switch(a){case"children":typeof l=="string"?r==="body"||r==="textarea"&&l===""||Nn(t,l):(typeof l=="number"||typeof l=="bigint")&&r!=="body"&&Nn(t,""+l);break;case"className":si(t,"class",l);break;case"tabIndex":si(t,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":si(t,a,l);break;case"style":Fo(t,l,d);break;case"data":if(r!=="object"){si(t,"data",l);break}case"src":case"href":if(l===""&&(r!=="a"||a!=="href")){t.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){t.removeAttribute(a);break}l=ya(""+l),t.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof d=="function"&&(a==="formAction"?(r!=="input"&&$e(t,r,"name",h.name,h,null),$e(t,r,"formEncType",h.formEncType,h,null),$e(t,r,"formMethod",h.formMethod,h,null),$e(t,r,"formTarget",h.formTarget,h,null)):($e(t,r,"encType",h.encType,h,null),$e(t,r,"method",h.method,h,null),$e(t,r,"target",h.target,h,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){t.removeAttribute(a);break}l=ya(""+l),t.setAttribute(a,l);break;case"onClick":l!=null&&(t.onclick=kc);break;case"onScroll":l!=null&&Oe("scroll",t);break;case"onScrollEnd":l!=null&&Oe("scrollend",t);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(s(61));if(a=l.__html,a!=null){if(h.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"multiple":t.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":t.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){t.removeAttribute("xlink:href");break}a=ya(""+l),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(a,""+l):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":l===!0?t.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(a,l):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?t.setAttribute(a,l):t.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?t.removeAttribute(a):t.setAttribute(a,l);break;case"popover":Oe("beforetoggle",t),Oe("toggle",t),mr(t,"popover",l);break;case"xlinkActuate":Ut(t,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Ut(t,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Ut(t,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Ut(t,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Ut(t,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Ut(t,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Ut(t,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Ut(t,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Ut(t,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":mr(t,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=If.get(a)||a,mr(t,a,l))}}function im(t,r,a,l,h,d){switch(a){case"style":Fo(t,l,d);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(s(61));if(a=l.__html,a!=null){if(h.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"children":typeof l=="string"?Nn(t,l):(typeof l=="number"||typeof l=="bigint")&&Nn(t,""+l);break;case"onScroll":l!=null&&Oe("scroll",t);break;case"onScrollEnd":l!=null&&Oe("scrollend",t);break;case"onClick":l!=null&&(t.onclick=kc);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!fa.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(h=a.endsWith("Capture"),r=a.slice(2,h?a.length-7:void 0),d=t[pt]||null,d=d!=null?d[a]:null,typeof d=="function"&&t.removeEventListener(r,d,h),typeof l=="function")){typeof d!="function"&&d!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(r,l,h);break e}a in t?t[a]=l:l===!0?t.setAttribute(a,""):mr(t,a,l)}}}function Bt(t,r,a){switch(r){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Oe("error",t),Oe("load",t);var l=!1,h=!1,d;for(d in a)if(a.hasOwnProperty(d)){var v=a[d];if(v!=null)switch(d){case"src":l=!0;break;case"srcSet":h=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,r));default:$e(t,r,d,v,a,null)}}h&&$e(t,r,"srcSet",a.srcSet,a,null),l&&$e(t,r,"src",a.src,a,null);return;case"input":Oe("invalid",t);var A=d=v=h=null,R=null,B=null;for(l in a)if(a.hasOwnProperty(l)){var Q=a[l];if(Q!=null)switch(l){case"name":h=Q;break;case"type":v=Q;break;case"checked":R=Q;break;case"defaultChecked":B=Q;break;case"value":d=Q;break;case"defaultValue":A=Q;break;case"children":case"dangerouslySetInnerHTML":if(Q!=null)throw Error(s(137,r));break;default:$e(t,r,l,Q,a,null)}}As(t,d,A,R,B,v,h,!1),ga(t);return;case"select":Oe("invalid",t),l=v=d=null;for(h in a)if(a.hasOwnProperty(h)&&(A=a[h],A!=null))switch(h){case"value":d=A;break;case"defaultValue":v=A;break;case"multiple":l=A;default:$e(t,r,h,A,a,null)}r=d,a=v,t.multiple=!!l,r!=null?Mi(t,!!l,r,!1):a!=null&&Mi(t,!!l,a,!0);return;case"textarea":Oe("invalid",t),d=h=l=null;for(v in a)if(a.hasOwnProperty(v)&&(A=a[v],A!=null))switch(v){case"value":l=A;break;case"defaultValue":h=A;break;case"children":d=A;break;case"dangerouslySetInnerHTML":if(A!=null)throw Error(s(91));break;default:$e(t,r,v,A,a,null)}bs(t,l,h,d),ga(t);return;case"option":for(R in a)if(a.hasOwnProperty(R)&&(l=a[R],l!=null))switch(R){case"selected":t.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:$e(t,r,R,l,a,null)}return;case"dialog":Oe("beforetoggle",t),Oe("toggle",t),Oe("cancel",t),Oe("close",t);break;case"iframe":case"object":Oe("load",t);break;case"video":case"audio":for(l=0;l<Rl.length;l++)Oe(Rl[l],t);break;case"image":Oe("error",t),Oe("load",t);break;case"details":Oe("toggle",t);break;case"embed":case"source":case"link":Oe("error",t),Oe("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(B in a)if(a.hasOwnProperty(B)&&(l=a[B],l!=null))switch(B){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,r));default:$e(t,r,B,l,a,null)}return;default:if(Ho(r)){for(Q in a)a.hasOwnProperty(Q)&&(l=a[Q],l!==void 0&&im(t,r,Q,l,a,void 0));return}}for(A in a)a.hasOwnProperty(A)&&(l=a[A],l!=null&&$e(t,r,A,l,a,null))}function jw(t,r,a,l){switch(r){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var h=null,d=null,v=null,A=null,R=null,B=null,Q=null;for(H in a){var X=a[H];if(a.hasOwnProperty(H)&&X!=null)switch(H){case"checked":break;case"value":break;case"defaultValue":R=X;default:l.hasOwnProperty(H)||$e(t,r,H,null,l,X)}}for(var F in l){var H=l[F];if(X=a[F],l.hasOwnProperty(F)&&(H!=null||X!=null))switch(F){case"type":d=H;break;case"name":h=H;break;case"checked":B=H;break;case"defaultChecked":Q=H;break;case"value":v=H;break;case"defaultValue":A=H;break;case"children":case"dangerouslySetInnerHTML":if(H!=null)throw Error(s(137,r));break;default:H!==X&&$e(t,r,F,H,l,X)}}pn(t,v,A,R,B,Q,d,h);return;case"select":H=v=A=F=null;for(d in a)if(R=a[d],a.hasOwnProperty(d)&&R!=null)switch(d){case"value":break;case"multiple":H=R;default:l.hasOwnProperty(d)||$e(t,r,d,null,l,R)}for(h in l)if(d=l[h],R=a[h],l.hasOwnProperty(h)&&(d!=null||R!=null))switch(h){case"value":F=d;break;case"defaultValue":A=d;break;case"multiple":v=d;default:d!==R&&$e(t,r,h,d,l,R)}r=A,a=v,l=H,F!=null?Mi(t,!!a,F,!1):!!l!=!!a&&(r!=null?Mi(t,!!a,r,!0):Mi(t,!!a,a?[]:"",!1));return;case"textarea":H=F=null;for(A in a)if(h=a[A],a.hasOwnProperty(A)&&h!=null&&!l.hasOwnProperty(A))switch(A){case"value":break;case"children":break;default:$e(t,r,A,null,l,h)}for(v in l)if(h=l[v],d=a[v],l.hasOwnProperty(v)&&(h!=null||d!=null))switch(v){case"value":F=h;break;case"defaultValue":H=h;break;case"children":break;case"dangerouslySetInnerHTML":if(h!=null)throw Error(s(91));break;default:h!==d&&$e(t,r,v,h,l,d)}Ye(t,F,H);return;case"option":for(var ve in a)if(F=a[ve],a.hasOwnProperty(ve)&&F!=null&&!l.hasOwnProperty(ve))switch(ve){case"selected":t.selected=!1;break;default:$e(t,r,ve,null,l,F)}for(R in l)if(F=l[R],H=a[R],l.hasOwnProperty(R)&&F!==H&&(F!=null||H!=null))switch(R){case"selected":t.selected=F&&typeof F!="function"&&typeof F!="symbol";break;default:$e(t,r,R,F,l,H)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ge in a)F=a[ge],a.hasOwnProperty(ge)&&F!=null&&!l.hasOwnProperty(ge)&&$e(t,r,ge,null,l,F);for(B in l)if(F=l[B],H=a[B],l.hasOwnProperty(B)&&F!==H&&(F!=null||H!=null))switch(B){case"children":case"dangerouslySetInnerHTML":if(F!=null)throw Error(s(137,r));break;default:$e(t,r,B,F,l,H)}return;default:if(Ho(r)){for(var Xe in a)F=a[Xe],a.hasOwnProperty(Xe)&&F!==void 0&&!l.hasOwnProperty(Xe)&&im(t,r,Xe,void 0,l,F);for(Q in l)F=l[Q],H=a[Q],!l.hasOwnProperty(Q)||F===H||F===void 0&&H===void 0||im(t,r,Q,F,l,H);return}}for(var L in a)F=a[L],a.hasOwnProperty(L)&&F!=null&&!l.hasOwnProperty(L)&&$e(t,r,L,null,l,F);for(X in l)F=l[X],H=a[X],!l.hasOwnProperty(X)||F===H||F==null&&H==null||$e(t,r,X,F,l,H)}var rm=null,sm=null;function Pc(t){return t.nodeType===9?t:t.ownerDocument}function Iv(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Rv(t,r){if(t===0)switch(r){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&r==="foreignObject"?0:t}function am(t,r){return t==="textarea"||t==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.children=="bigint"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var om=null;function zw(){var t=window.event;return t&&t.type==="popstate"?t===om?!1:(om=t,!0):(om=null,!1)}var Cv=typeof setTimeout=="function"?setTimeout:void 0,Bw=typeof clearTimeout=="function"?clearTimeout:void 0,Nv=typeof Promise=="function"?Promise:void 0,qw=typeof queueMicrotask=="function"?queueMicrotask:typeof Nv<"u"?function(t){return Nv.resolve(null).then(t).catch(Fw)}:Cv;function Fw(t){setTimeout(function(){throw t})}function Mr(t){return t==="head"}function Dv(t,r){var a=r,l=0,h=0;do{var d=a.nextSibling;if(t.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(0<l&&8>l){a=l;var v=t.ownerDocument;if(a&1&&Nl(v.documentElement),a&2&&Nl(v.body),a&4)for(a=v.head,Nl(a),v=a.firstChild;v;){var A=v.nextSibling,R=v.nodeName;v[_s]||R==="SCRIPT"||R==="STYLE"||R==="LINK"&&v.rel.toLowerCase()==="stylesheet"||a.removeChild(v),v=A}}if(h===0){t.removeChild(d),Ul(r);return}h--}else a==="$"||a==="$?"||a==="$!"?h++:l=a.charCodeAt(0)-48;else l=0;a=d}while(a);Ul(r)}function lm(t){var r=t.firstChild;for(r&&r.nodeType===10&&(r=r.nextSibling);r;){var a=r;switch(r=r.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":lm(a),dr(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function Hw(t,r,a,l){for(;t.nodeType===1;){var h=a;if(t.nodeName.toLowerCase()!==r.toLowerCase()){if(!l&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(l){if(!t[_s])switch(r){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(d=t.getAttribute("rel"),d==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(d!==h.rel||t.getAttribute("href")!==(h.href==null||h.href===""?null:h.href)||t.getAttribute("crossorigin")!==(h.crossOrigin==null?null:h.crossOrigin)||t.getAttribute("title")!==(h.title==null?null:h.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(d=t.getAttribute("src"),(d!==(h.src==null?null:h.src)||t.getAttribute("type")!==(h.type==null?null:h.type)||t.getAttribute("crossorigin")!==(h.crossOrigin==null?null:h.crossOrigin))&&d&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(r==="input"&&t.type==="hidden"){var d=h.name==null?null:""+h.name;if(h.type==="hidden"&&t.getAttribute("name")===d)return t}else return t;if(t=Qn(t.nextSibling),t===null)break}return null}function Gw(t,r,a){if(r==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Qn(t.nextSibling),t===null))return null;return t}function um(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState==="complete"}function Kw(t,r){var a=t.ownerDocument;if(t.data!=="$?"||a.readyState==="complete")r();else{var l=function(){r(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),t._reactRetry=l}}function Qn(t){for(;t!=null;t=t.nextSibling){var r=t.nodeType;if(r===1||r===3)break;if(r===8){if(r=t.data,r==="$"||r==="$!"||r==="$?"||r==="F!"||r==="F")break;if(r==="/$")return null}}return t}var cm=null;function Ov(t){t=t.previousSibling;for(var r=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"){if(r===0)return t;r--}else a==="/$"&&r++}t=t.previousSibling}return null}function Mv(t,r,a){switch(r=Pc(a),t){case"html":if(t=r.documentElement,!t)throw Error(s(452));return t;case"head":if(t=r.head,!t)throw Error(s(453));return t;case"body":if(t=r.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function Nl(t){for(var r=t.attributes;r.length;)t.removeAttributeNode(r[0]);dr(t)}var jn=new Map,xv=new Set;function Uc(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Zi=ie.d;ie.d={f:Yw,r:Qw,D:$w,C:Xw,L:Zw,m:Ww,X:eI,S:Jw,M:tI};function Yw(){var t=Zi.f(),r=Cc();return t||r}function Qw(t){var r=ii(t);r!==null&&r.tag===5&&r.type==="form"?Jy(r):Zi.r(t)}var Za=typeof document>"u"?null:document;function Vv(t,r,a){var l=Za;if(l&&typeof r=="string"&&r){var h=gt(r);h='link[rel="'+t+'"][href="'+h+'"]',typeof a=="string"&&(h+='[crossorigin="'+a+'"]'),xv.has(h)||(xv.add(h),t={rel:t,crossOrigin:a,href:r},l.querySelector(h)===null&&(r=l.createElement("link"),Bt(r,"link",t),ct(r),l.head.appendChild(r)))}}function $w(t){Zi.D(t),Vv("dns-prefetch",t,null)}function Xw(t,r){Zi.C(t,r),Vv("preconnect",t,r)}function Zw(t,r,a){Zi.L(t,r,a);var l=Za;if(l&&t&&r){var h='link[rel="preload"][as="'+gt(r)+'"]';r==="image"&&a&&a.imageSrcSet?(h+='[imagesrcset="'+gt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(h+='[imagesizes="'+gt(a.imageSizes)+'"]')):h+='[href="'+gt(t)+'"]';var d=h;switch(r){case"style":d=Wa(t);break;case"script":d=Ja(t)}jn.has(d)||(t=T({rel:"preload",href:r==="image"&&a&&a.imageSrcSet?void 0:t,as:r},a),jn.set(d,t),l.querySelector(h)!==null||r==="style"&&l.querySelector(Dl(d))||r==="script"&&l.querySelector(Ol(d))||(r=l.createElement("link"),Bt(r,"link",t),ct(r),l.head.appendChild(r)))}}function Ww(t,r){Zi.m(t,r);var a=Za;if(a&&t){var l=r&&typeof r.as=="string"?r.as:"script",h='link[rel="modulepreload"][as="'+gt(l)+'"][href="'+gt(t)+'"]',d=h;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":d=Ja(t)}if(!jn.has(d)&&(t=T({rel:"modulepreload",href:t},r),jn.set(d,t),a.querySelector(h)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Ol(d)))return}l=a.createElement("link"),Bt(l,"link",t),ct(l),a.head.appendChild(l)}}}function Jw(t,r,a){Zi.S(t,r,a);var l=Za;if(l&&t){var h=tn(l).hoistableStyles,d=Wa(t);r=r||"default";var v=h.get(d);if(!v){var A={loading:0,preload:null};if(v=l.querySelector(Dl(d)))A.loading=5;else{t=T({rel:"stylesheet",href:t,"data-precedence":r},a),(a=jn.get(d))&&hm(t,a);var R=v=l.createElement("link");ct(R),Bt(R,"link",t),R._p=new Promise(function(B,Q){R.onload=B,R.onerror=Q}),R.addEventListener("load",function(){A.loading|=1}),R.addEventListener("error",function(){A.loading|=2}),A.loading|=4,Lc(v,r,l)}v={type:"stylesheet",instance:v,count:1,state:A},h.set(d,v)}}}function eI(t,r){Zi.X(t,r);var a=Za;if(a&&t){var l=tn(a).hoistableScripts,h=Ja(t),d=l.get(h);d||(d=a.querySelector(Ol(h)),d||(t=T({src:t,async:!0},r),(r=jn.get(h))&&fm(t,r),d=a.createElement("script"),ct(d),Bt(d,"link",t),a.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},l.set(h,d))}}function tI(t,r){Zi.M(t,r);var a=Za;if(a&&t){var l=tn(a).hoistableScripts,h=Ja(t),d=l.get(h);d||(d=a.querySelector(Ol(h)),d||(t=T({src:t,async:!0,type:"module"},r),(r=jn.get(h))&&fm(t,r),d=a.createElement("script"),ct(d),Bt(d,"link",t),a.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},l.set(h,d))}}function kv(t,r,a,l){var h=(h=Ee.current)?Uc(h):null;if(!h)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(r=Wa(a.href),a=tn(h).hoistableStyles,l=a.get(r),l||(l={type:"style",instance:null,count:0,state:null},a.set(r,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Wa(a.href);var d=tn(h).hoistableStyles,v=d.get(t);if(v||(h=h.ownerDocument||h,v={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},d.set(t,v),(d=h.querySelector(Dl(t)))&&!d._p&&(v.instance=d,v.state.loading=5),jn.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},jn.set(t,a),d||nI(h,t,a,v.state))),r&&l===null)throw Error(s(528,""));return v}if(r&&l!==null)throw Error(s(529,""));return null;case"script":return r=a.async,a=a.src,typeof a=="string"&&r&&typeof r!="function"&&typeof r!="symbol"?(r=Ja(a),a=tn(h).hoistableScripts,l=a.get(r),l||(l={type:"script",instance:null,count:0,state:null},a.set(r,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function Wa(t){return'href="'+gt(t)+'"'}function Dl(t){return'link[rel="stylesheet"]['+t+"]"}function Pv(t){return T({},t,{"data-precedence":t.precedence,precedence:null})}function nI(t,r,a,l){t.querySelector('link[rel="preload"][as="style"]['+r+"]")?l.loading=1:(r=t.createElement("link"),l.preload=r,r.addEventListener("load",function(){return l.loading|=1}),r.addEventListener("error",function(){return l.loading|=2}),Bt(r,"link",a),ct(r),t.head.appendChild(r))}function Ja(t){return'[src="'+gt(t)+'"]'}function Ol(t){return"script[async]"+t}function Uv(t,r,a){if(r.count++,r.instance===null)switch(r.type){case"style":var l=t.querySelector('style[data-href~="'+gt(a.href)+'"]');if(l)return r.instance=l,ct(l),l;var h=T({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(t.ownerDocument||t).createElement("style"),ct(l),Bt(l,"style",h),Lc(l,a.precedence,t),r.instance=l;case"stylesheet":h=Wa(a.href);var d=t.querySelector(Dl(h));if(d)return r.state.loading|=4,r.instance=d,ct(d),d;l=Pv(a),(h=jn.get(h))&&hm(l,h),d=(t.ownerDocument||t).createElement("link"),ct(d);var v=d;return v._p=new Promise(function(A,R){v.onload=A,v.onerror=R}),Bt(d,"link",l),r.state.loading|=4,Lc(d,a.precedence,t),r.instance=d;case"script":return d=Ja(a.src),(h=t.querySelector(Ol(d)))?(r.instance=h,ct(h),h):(l=a,(h=jn.get(d))&&(l=T({},a),fm(l,h)),t=t.ownerDocument||t,h=t.createElement("script"),ct(h),Bt(h,"link",l),t.head.appendChild(h),r.instance=h);case"void":return null;default:throw Error(s(443,r.type))}else r.type==="stylesheet"&&(r.state.loading&4)===0&&(l=r.instance,r.state.loading|=4,Lc(l,a.precedence,t));return r.instance}function Lc(t,r,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),h=l.length?l[l.length-1]:null,d=h,v=0;v<l.length;v++){var A=l[v];if(A.dataset.precedence===r)d=A;else if(d!==h)break}d?d.parentNode.insertBefore(t,d.nextSibling):(r=a.nodeType===9?a.head:a,r.insertBefore(t,r.firstChild))}function hm(t,r){t.crossOrigin==null&&(t.crossOrigin=r.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=r.referrerPolicy),t.title==null&&(t.title=r.title)}function fm(t,r){t.crossOrigin==null&&(t.crossOrigin=r.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=r.referrerPolicy),t.integrity==null&&(t.integrity=r.integrity)}var jc=null;function Lv(t,r,a){if(jc===null){var l=new Map,h=jc=new Map;h.set(a,l)}else h=jc,l=h.get(a),l||(l=new Map,h.set(a,l));if(l.has(t))return l;for(l.set(t,null),a=a.getElementsByTagName(t),h=0;h<a.length;h++){var d=a[h];if(!(d[_s]||d[Et]||t==="link"&&d.getAttribute("rel")==="stylesheet")&&d.namespaceURI!=="http://www.w3.org/2000/svg"){var v=d.getAttribute(r)||"";v=t+v;var A=l.get(v);A?A.push(d):l.set(v,[d])}}return l}function jv(t,r,a){t=t.ownerDocument||t,t.head.insertBefore(a,r==="title"?t.querySelector("head > title"):null)}function iI(t,r,a){if(a===1||r.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof r.precedence!="string"||typeof r.href!="string"||r.href==="")break;return!0;case"link":if(typeof r.rel!="string"||typeof r.href!="string"||r.href===""||r.onLoad||r.onError)break;switch(r.rel){case"stylesheet":return t=r.disabled,typeof r.precedence=="string"&&t==null;default:return!0}case"script":if(r.async&&typeof r.async!="function"&&typeof r.async!="symbol"&&!r.onLoad&&!r.onError&&r.src&&typeof r.src=="string")return!0}return!1}function zv(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}var Ml=null;function rI(){}function sI(t,r,a){if(Ml===null)throw Error(s(475));var l=Ml;if(r.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(r.state.loading&4)===0){if(r.instance===null){var h=Wa(a.href),d=t.querySelector(Dl(h));if(d){t=d._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(l.count++,l=zc.bind(l),t.then(l,l)),r.state.loading|=4,r.instance=d,ct(d);return}d=t.ownerDocument||t,a=Pv(a),(h=jn.get(h))&&hm(a,h),d=d.createElement("link"),ct(d);var v=d;v._p=new Promise(function(A,R){v.onload=A,v.onerror=R}),Bt(d,"link",a),r.instance=d}l.stylesheets===null&&(l.stylesheets=new Map),l.stylesheets.set(r,t),(t=r.state.preload)&&(r.state.loading&3)===0&&(l.count++,r=zc.bind(l),t.addEventListener("load",r),t.addEventListener("error",r))}}function aI(){if(Ml===null)throw Error(s(475));var t=Ml;return t.stylesheets&&t.count===0&&dm(t,t.stylesheets),0<t.count?function(r){var a=setTimeout(function(){if(t.stylesheets&&dm(t,t.stylesheets),t.unsuspend){var l=t.unsuspend;t.unsuspend=null,l()}},6e4);return t.unsuspend=r,function(){t.unsuspend=null,clearTimeout(a)}}:null}function zc(){if(this.count--,this.count===0){if(this.stylesheets)dm(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Bc=null;function dm(t,r){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Bc=new Map,r.forEach(oI,t),Bc=null,zc.call(t))}function oI(t,r){if(!(r.state.loading&4)){var a=Bc.get(t);if(a)var l=a.get(null);else{a=new Map,Bc.set(t,a);for(var h=t.querySelectorAll("link[data-precedence],style[data-precedence]"),d=0;d<h.length;d++){var v=h[d];(v.nodeName==="LINK"||v.getAttribute("media")!=="not all")&&(a.set(v.dataset.precedence,v),l=v)}l&&a.set(null,l)}h=r.instance,v=h.getAttribute("data-precedence"),d=a.get(v)||l,d===l&&a.set(null,h),a.set(v,h),this.count++,l=zc.bind(this),h.addEventListener("load",l),h.addEventListener("error",l),d?d.parentNode.insertBefore(h,d.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(h,t.firstChild)),r.state.loading|=4}}var xl={$$typeof:le,Provider:null,Consumer:null,_currentValue:he,_currentValue2:he,_threadCount:0};function lI(t,r,a,l,h,d,v,A){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ri(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ri(0),this.hiddenUpdates=Ri(null),this.identifierPrefix=l,this.onUncaughtError=h,this.onCaughtError=d,this.onRecoverableError=v,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=A,this.incompleteTransitions=new Map}function Bv(t,r,a,l,h,d,v,A,R,B,Q,X){return t=new lI(t,r,a,v,A,R,B,X),r=1,d===!0&&(r|=24),d=yn(3,null,null,r),t.current=d,d.stateNode=t,r=Qf(),r.refCount++,t.pooledCache=r,r.refCount++,d.memoizedState={element:l,isDehydrated:a,cache:r},Wf(d),t}function qv(t){return t?(t=Da,t):Da}function Fv(t,r,a,l,h,d){h=qv(h),l.context===null?l.context=h:l.pendingContext=h,l=vr(r),l.payload={element:a},d=d===void 0?null:d,d!==null&&(l.callback=d),a=Tr(t,l,r),a!==null&&(An(a,t,r),ul(a,t,r))}function Hv(t,r){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<r?a:r}}function mm(t,r){Hv(t,r),(t=t.alternate)&&Hv(t,r)}function Gv(t){if(t.tag===13){var r=Na(t,67108864);r!==null&&An(r,t,67108864),mm(t,67108864)}}var qc=!0;function uI(t,r,a,l){var h=Y.T;Y.T=null;var d=ie.p;try{ie.p=2,pm(t,r,a,l)}finally{ie.p=d,Y.T=h}}function cI(t,r,a,l){var h=Y.T;Y.T=null;var d=ie.p;try{ie.p=8,pm(t,r,a,l)}finally{ie.p=d,Y.T=h}}function pm(t,r,a,l){if(qc){var h=gm(l);if(h===null)nm(t,r,l,Fc,a),Yv(t,l);else if(fI(h,t,r,a,l))l.stopPropagation();else if(Yv(t,l),r&4&&-1<hI.indexOf(t)){for(;h!==null;){var d=ii(h);if(d!==null)switch(d.tag){case 3:if(d=d.stateNode,d.current.memoizedState.isDehydrated){var v=Fn(d.pendingLanes);if(v!==0){var A=d;for(A.pendingLanes|=2,A.entangledLanes|=2;v;){var R=1<<31-Gt(v);A.entanglements[1]|=R,v&=~R}yi(d),(Ge&6)===0&&(Ic=Rn()+500,Il(0))}}break;case 13:A=Na(d,2),A!==null&&An(A,d,2),Cc(),mm(d,2)}if(d=gm(l),d===null&&nm(t,r,l,Fc,a),d===h)break;h=d}h!==null&&l.stopPropagation()}else nm(t,r,l,null,a)}}function gm(t){return t=Dn(t),ym(t)}var Fc=null;function ym(t){if(Fc=null,t=Ni(t),t!==null){var r=u(t);if(r===null)t=null;else{var a=r.tag;if(a===13){if(t=f(r),t!==null)return t;t=null}else if(a===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;t=null}else r!==t&&(t=null)}}return Fc=t,null}function Kv(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Tf()){case Oo:return 2;case la:return 8;case ds:case Ef:return 32;case ua:return 268435456;default:return 32}default:return 32}}var _m=!1,xr=null,Vr=null,kr=null,Vl=new Map,kl=new Map,Pr=[],hI="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Yv(t,r){switch(t){case"focusin":case"focusout":xr=null;break;case"dragenter":case"dragleave":Vr=null;break;case"mouseover":case"mouseout":kr=null;break;case"pointerover":case"pointerout":Vl.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":kl.delete(r.pointerId)}}function Pl(t,r,a,l,h,d){return t===null||t.nativeEvent!==d?(t={blockedOn:r,domEventName:a,eventSystemFlags:l,nativeEvent:d,targetContainers:[h]},r!==null&&(r=ii(r),r!==null&&Gv(r)),t):(t.eventSystemFlags|=l,r=t.targetContainers,h!==null&&r.indexOf(h)===-1&&r.push(h),t)}function fI(t,r,a,l,h){switch(r){case"focusin":return xr=Pl(xr,t,r,a,l,h),!0;case"dragenter":return Vr=Pl(Vr,t,r,a,l,h),!0;case"mouseover":return kr=Pl(kr,t,r,a,l,h),!0;case"pointerover":var d=h.pointerId;return Vl.set(d,Pl(Vl.get(d)||null,t,r,a,l,h)),!0;case"gotpointercapture":return d=h.pointerId,kl.set(d,Pl(kl.get(d)||null,t,r,a,l,h)),!0}return!1}function Qv(t){var r=Ni(t.target);if(r!==null){var a=u(r);if(a!==null){if(r=a.tag,r===13){if(r=f(a),r!==null){t.blockedOn=r,Cu(t.priority,function(){if(a.tag===13){var l=En();l=cr(l);var h=Na(a,l);h!==null&&An(h,a,l),mm(a,l)}});return}}else if(r===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Hc(t){if(t.blockedOn!==null)return!1;for(var r=t.targetContainers;0<r.length;){var a=gm(t.nativeEvent);if(a===null){a=t.nativeEvent;var l=new a.constructor(a.type,a);xi=l,a.target.dispatchEvent(l),xi=null}else return r=ii(a),r!==null&&Gv(r),t.blockedOn=a,!1;r.shift()}return!0}function $v(t,r,a){Hc(t)&&a.delete(r)}function dI(){_m=!1,xr!==null&&Hc(xr)&&(xr=null),Vr!==null&&Hc(Vr)&&(Vr=null),kr!==null&&Hc(kr)&&(kr=null),Vl.forEach($v),kl.forEach($v)}function Gc(t,r){t.blockedOn===r&&(t.blockedOn=null,_m||(_m=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,dI)))}var Kc=null;function Xv(t){Kc!==t&&(Kc=t,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){Kc===t&&(Kc=null);for(var r=0;r<t.length;r+=3){var a=t[r],l=t[r+1],h=t[r+2];if(typeof l!="function"){if(ym(l||a)===null)continue;break}var d=ii(a);d!==null&&(t.splice(r,3),r-=3,yd(d,{pending:!0,data:h,method:a.method,action:l},l,h))}}))}function Ul(t){function r(R){return Gc(R,t)}xr!==null&&Gc(xr,t),Vr!==null&&Gc(Vr,t),kr!==null&&Gc(kr,t),Vl.forEach(r),kl.forEach(r);for(var a=0;a<Pr.length;a++){var l=Pr[a];l.blockedOn===t&&(l.blockedOn=null)}for(;0<Pr.length&&(a=Pr[0],a.blockedOn===null);)Qv(a),a.blockedOn===null&&Pr.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var h=a[l],d=a[l+1],v=h[pt]||null;if(typeof d=="function")v||Xv(a);else if(v){var A=null;if(d&&d.hasAttribute("formAction")){if(h=d,v=d[pt]||null)A=v.formAction;else if(ym(h)!==null)continue}else A=v.action;typeof A=="function"?a[l+1]=A:(a.splice(l,3),l-=3),Xv(a)}}}function vm(t){this._internalRoot=t}Yc.prototype.render=vm.prototype.render=function(t){var r=this._internalRoot;if(r===null)throw Error(s(409));var a=r.current,l=En();Fv(a,l,t,r,null,null)},Yc.prototype.unmount=vm.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var r=t.containerInfo;Fv(t.current,2,null,t,null,null),Cc(),r[Cn]=null}};function Yc(t){this._internalRoot=t}Yc.prototype.unstable_scheduleHydration=function(t){if(t){var r=hr();t={blockedOn:null,target:t,priority:r};for(var a=0;a<Pr.length&&r!==0&&r<Pr[a].priority;a++);Pr.splice(a,0,t),a===0&&Qv(t)}};var Zv=e.version;if(Zv!=="19.1.0")throw Error(s(527,Zv,"19.1.0"));ie.findDOMNode=function(t){var r=t._reactInternals;if(r===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=p(r),t=t!==null?y(t):null,t=t===null?null:t.stateNode,t};var mI={bundleType:0,version:"19.1.0",rendererPackageName:"react-dom",currentDispatcherRef:Y,reconcilerVersion:"19.1.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Qc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Qc.isDisabled&&Qc.supportsFiber)try{ot=Qc.inject(mI),He=Qc}catch{}}return jl.createRoot=function(t,r){if(!o(t))throw Error(s(299));var a=!1,l="",h=d_,d=m_,v=p_,A=null;return r!=null&&(r.unstable_strictMode===!0&&(a=!0),r.identifierPrefix!==void 0&&(l=r.identifierPrefix),r.onUncaughtError!==void 0&&(h=r.onUncaughtError),r.onCaughtError!==void 0&&(d=r.onCaughtError),r.onRecoverableError!==void 0&&(v=r.onRecoverableError),r.unstable_transitionCallbacks!==void 0&&(A=r.unstable_transitionCallbacks)),r=Bv(t,1,!1,null,null,a,l,h,d,v,A,null),t[Cn]=r.current,tm(t),new vm(r)},jl.hydrateRoot=function(t,r,a){if(!o(t))throw Error(s(299));var l=!1,h="",d=d_,v=m_,A=p_,R=null,B=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(h=a.identifierPrefix),a.onUncaughtError!==void 0&&(d=a.onUncaughtError),a.onCaughtError!==void 0&&(v=a.onCaughtError),a.onRecoverableError!==void 0&&(A=a.onRecoverableError),a.unstable_transitionCallbacks!==void 0&&(R=a.unstable_transitionCallbacks),a.formState!==void 0&&(B=a.formState)),r=Bv(t,1,!0,r,a??null,l,h,d,v,A,R,B),r.context=qv(null),a=r.current,l=En(),l=cr(l),h=vr(l),h.callback=null,Tr(a,h,l),a=l,r.current.lanes=a,Ci(r,a),yi(r),t[Cn]=r.current,tm(t),new Yc(r)},jl.version="19.1.0",jl}var oT;function SI(){if(oT)return Am.exports;oT=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(e){console.error(e)}}return i(),Am.exports=bI(),Am.exports}var wI=SI();const II=()=>{};var lT={};/**
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
 */const g0=function(i){const e=[];let n=0;for(let s=0;s<i.length;s++){let o=i.charCodeAt(s);o<128?e[n++]=o:o<2048?(e[n++]=o>>6|192,e[n++]=o&63|128):(o&64512)===55296&&s+1<i.length&&(i.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++s)&1023),e[n++]=o>>18|240,e[n++]=o>>12&63|128,e[n++]=o>>6&63|128,e[n++]=o&63|128):(e[n++]=o>>12|224,e[n++]=o>>6&63|128,e[n++]=o&63|128)}return e},RI=function(i){const e=[];let n=0,s=0;for(;n<i.length;){const o=i[n++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const u=i[n++];e[s++]=String.fromCharCode((o&31)<<6|u&63)}else if(o>239&&o<365){const u=i[n++],f=i[n++],m=i[n++],p=((o&7)<<18|(u&63)<<12|(f&63)<<6|m&63)-65536;e[s++]=String.fromCharCode(55296+(p>>10)),e[s++]=String.fromCharCode(56320+(p&1023))}else{const u=i[n++],f=i[n++];e[s++]=String.fromCharCode((o&15)<<12|(u&63)<<6|f&63)}}return e.join("")},y0={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<i.length;o+=3){const u=i[o],f=o+1<i.length,m=f?i[o+1]:0,p=o+2<i.length,y=p?i[o+2]:0,T=u>>2,S=(u&3)<<4|m>>4;let w=(m&15)<<2|y>>6,P=y&63;p||(P=64,f||(w=64)),s.push(n[T],n[S],n[w],n[P])}return s.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(g0(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):RI(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<i.length;){const u=n[i.charAt(o++)],m=o<i.length?n[i.charAt(o)]:0;++o;const y=o<i.length?n[i.charAt(o)]:64;++o;const S=o<i.length?n[i.charAt(o)]:64;if(++o,u==null||m==null||y==null||S==null)throw new CI;const w=u<<2|m>>4;if(s.push(w),y!==64){const P=m<<4&240|y>>2;if(s.push(P),S!==64){const k=y<<6&192|S;s.push(k)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class CI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const NI=function(i){const e=g0(i);return y0.encodeByteArray(e,!0)},gh=function(i){return NI(i).replace(/\./g,"")},_0=function(i){try{return y0.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function DI(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const OI=()=>DI().__FIREBASE_DEFAULTS__,MI=()=>{if(typeof process>"u"||typeof lT>"u")return;const i=lT.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},xI=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&_0(i[1]);return e&&JSON.parse(e)},Fh=()=>{try{return II()||OI()||MI()||xI()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},v0=i=>{var e,n;return(n=(e=Fh())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[i]},T0=i=>{const e=v0(i);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},E0=()=>{var i;return(i=Fh())===null||i===void 0?void 0:i.config},A0=i=>{var e;return(e=Fh())===null||e===void 0?void 0:e[`_${i}`]};/**
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
 */class VI{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function ra(i){return i.endsWith(".cloudworkstations.dev")}async function Rp(i){return(await fetch(i,{credentials:"include"})).ok}/**
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
 */function b0(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",o=i.iat||0,u=i.sub||i.user_id;if(!u)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const f=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:u,user_id:u,firebase:{sign_in_provider:"custom",identities:{}}},i);return[gh(JSON.stringify(n)),gh(JSON.stringify(f)),""].join(".")}const Hl={};function kI(){const i={prod:[],emulator:[]};for(const e of Object.keys(Hl))Hl[e]?i.emulator.push(e):i.prod.push(e);return i}function PI(i){let e=document.getElementById(i),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",i),n=!0),{created:n,element:e}}let uT=!1;function Cp(i,e){if(typeof window>"u"||typeof document>"u"||!ra(window.location.host)||Hl[i]===e||Hl[i]||uT)return;Hl[i]=e;function n(w){return`__firebase__banner__${w}`}const s="__firebase__banner",u=kI().prod.length>0;function f(){const w=document.getElementById(s);w&&w.remove()}function m(w){w.style.display="flex",w.style.background="#7faaf0",w.style.position="fixed",w.style.bottom="5px",w.style.left="5px",w.style.padding=".5em",w.style.borderRadius="5px",w.style.alignItems="center"}function p(w,P){w.setAttribute("width","24"),w.setAttribute("id",P),w.setAttribute("height","24"),w.setAttribute("viewBox","0 0 24 24"),w.setAttribute("fill","none"),w.style.marginLeft="-6px"}function y(){const w=document.createElement("span");return w.style.cursor="pointer",w.style.marginLeft="16px",w.style.fontSize="24px",w.innerHTML=" &times;",w.onclick=()=>{uT=!0,f()},w}function T(w,P){w.setAttribute("id",P),w.innerText="Learn more",w.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",w.setAttribute("target","__blank"),w.style.paddingLeft="5px",w.style.textDecoration="underline"}function S(){const w=PI(s),P=n("text"),k=document.getElementById(P)||document.createElement("span"),K=n("learnmore"),q=document.getElementById(K)||document.createElement("a"),ne=n("preprendIcon"),se=document.getElementById(ne)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(w.created){const le=w.element;m(le),T(q,K);const fe=y();p(se,ne),le.append(se,k,q,fe),document.body.appendChild(le)}u?(k.innerText="Preview backend disconnected.",se.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(se.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,k.innerText="Preview backend running in this workspace."),k.setAttribute("id",P)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",S):S()}/**
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
 */function en(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function UI(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(en())}function LI(){var i;const e=(i=Fh())===null||i===void 0?void 0:i.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function jI(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function S0(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function zI(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function BI(){const i=en();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function qI(){return!LI()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Np(){try{return typeof indexedDB=="object"}catch{return!1}}function Dp(){return new Promise((i,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),n||self.indexedDB.deleteDatabase(s),i(!0)},o.onupgradeneeded=()=>{n=!1},o.onerror=()=>{var u;e(((u=o.error)===null||u===void 0?void 0:u.message)||"")}}catch(n){e(n)}})}function w0(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const FI="FirebaseError";class qn extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=FI,Object.setPrototypeOf(this,qn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,as.prototype.create)}}class as{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},o=`${this.service}/${e}`,u=this.errors[e],f=u?HI(u,s):"Error",m=`${this.serviceName}: ${f} (${o}).`;return new qn(o,m,s)}}function HI(i,e){return i.replace(GI,(n,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const GI=/\{\$([^}]+)}/g;function KI(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function $r(i,e){if(i===e)return!0;const n=Object.keys(i),s=Object.keys(e);for(const o of n){if(!s.includes(o))return!1;const u=i[o],f=e[o];if(cT(u)&&cT(f)){if(!$r(u,f))return!1}else if(u!==f)return!1}for(const o of s)if(!n.includes(o))return!1;return!0}function cT(i){return i!==null&&typeof i=="object"}/**
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
 */function hu(i){const e=[];for(const[n,s]of Object.entries(i))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function YI(i,e){const n=new QI(i,e);return n.subscribe.bind(n)}class QI{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let o;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");$I(e,["next","error","complete"])?o=e:o={next:e,error:n,complete:s},o.next===void 0&&(o.next=Im),o.error===void 0&&(o.error=Im),o.complete===void 0&&(o.complete=Im);const u=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),u}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function $I(i,e){if(typeof i!="object"||i===null)return!1;for(const n of e)if(n in i&&typeof i[n]=="function")return!0;return!1}function Im(){}/**
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
 */const XI=1e3,ZI=2,WI=4*60*60*1e3,JI=.5;function hT(i,e=XI,n=ZI){const s=e*Math.pow(n,i),o=Math.round(JI*s*(Math.random()-.5)*2);return Math.min(WI,s+o)}/**
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
 */function mt(i){return i&&i._delegate?i._delegate:i}class In{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Ys="[DEFAULT]";/**
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
 */class e1{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new VI;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:n});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e?.identifier),o=(n=e?.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(u){if(o)return null;throw u}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(n1(e))try{this.getOrInitializeService({instanceIdentifier:Ys})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(n);try{const u=this.getOrInitializeService({instanceIdentifier:o});s.resolve(u)}catch{}}}}clearInstance(e=Ys){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ys){return this.instances.has(e)}getOptions(e=Ys){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[u,f]of this.instancesDeferred.entries()){const m=this.normalizeInstanceIdentifier(u);s===m&&f.resolve(o)}return o}onInit(e,n){var s;const o=this.normalizeInstanceIdentifier(n),u=(s=this.onInitCallbacks.get(o))!==null&&s!==void 0?s:new Set;u.add(e),this.onInitCallbacks.set(o,u);const f=this.instances.get(o);return f&&e(f,o),()=>{u.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const o of s)try{o(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:t1(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Ys){return this.component?this.component.multipleInstances?e:Ys:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function t1(i){return i===Ys?void 0:i}function n1(i){return i.instantiationMode==="EAGER"}/**
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
 */class i1{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new e1(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Me;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(Me||(Me={}));const r1={debug:Me.DEBUG,verbose:Me.VERBOSE,info:Me.INFO,warn:Me.WARN,error:Me.ERROR,silent:Me.SILENT},s1=Me.INFO,a1={[Me.DEBUG]:"log",[Me.VERBOSE]:"log",[Me.INFO]:"info",[Me.WARN]:"warn",[Me.ERROR]:"error"},o1=(i,e,...n)=>{if(e<i.logLevel)return;const s=new Date().toISOString(),o=a1[e];if(o)console[o](`[${s}]  ${i.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class fu{constructor(e){this.name=e,this._logLevel=s1,this._logHandler=o1,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Me))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?r1[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Me.DEBUG,...e),this._logHandler(this,Me.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Me.VERBOSE,...e),this._logHandler(this,Me.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Me.INFO,...e),this._logHandler(this,Me.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Me.WARN,...e),this._logHandler(this,Me.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Me.ERROR,...e),this._logHandler(this,Me.ERROR,...e)}}const l1=(i,e)=>e.some(n=>i instanceof n);let fT,dT;function u1(){return fT||(fT=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function c1(){return dT||(dT=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const I0=new WeakMap,Qm=new WeakMap,R0=new WeakMap,Rm=new WeakMap,Op=new WeakMap;function h1(i){const e=new Promise((n,s)=>{const o=()=>{i.removeEventListener("success",u),i.removeEventListener("error",f)},u=()=>{n(Gr(i.result)),o()},f=()=>{s(i.error),o()};i.addEventListener("success",u),i.addEventListener("error",f)});return e.then(n=>{n instanceof IDBCursor&&I0.set(n,i)}).catch(()=>{}),Op.set(e,i),e}function f1(i){if(Qm.has(i))return;const e=new Promise((n,s)=>{const o=()=>{i.removeEventListener("complete",u),i.removeEventListener("error",f),i.removeEventListener("abort",f)},u=()=>{n(),o()},f=()=>{s(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",u),i.addEventListener("error",f),i.addEventListener("abort",f)});Qm.set(i,e)}let $m={get(i,e,n){if(i instanceof IDBTransaction){if(e==="done")return Qm.get(i);if(e==="objectStoreNames")return i.objectStoreNames||R0.get(i);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Gr(i[e])},set(i,e,n){return i[e]=n,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function d1(i){$m=i($m)}function m1(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=i.call(Cm(this),e,...n);return R0.set(s,e.sort?e.sort():[e]),Gr(s)}:c1().includes(i)?function(...e){return i.apply(Cm(this),e),Gr(I0.get(this))}:function(...e){return Gr(i.apply(Cm(this),e))}}function p1(i){return typeof i=="function"?m1(i):(i instanceof IDBTransaction&&f1(i),l1(i,u1())?new Proxy(i,$m):i)}function Gr(i){if(i instanceof IDBRequest)return h1(i);if(Rm.has(i))return Rm.get(i);const e=p1(i);return e!==i&&(Rm.set(i,e),Op.set(e,i)),e}const Cm=i=>Op.get(i);function C0(i,e,{blocked:n,upgrade:s,blocking:o,terminated:u}={}){const f=indexedDB.open(i,e),m=Gr(f);return s&&f.addEventListener("upgradeneeded",p=>{s(Gr(f.result),p.oldVersion,p.newVersion,Gr(f.transaction),p)}),n&&f.addEventListener("blocked",p=>n(p.oldVersion,p.newVersion,p)),m.then(p=>{u&&p.addEventListener("close",()=>u()),o&&p.addEventListener("versionchange",y=>o(y.oldVersion,y.newVersion,y))}).catch(()=>{}),m}const g1=["get","getKey","getAll","getAllKeys","count"],y1=["put","add","delete","clear"],Nm=new Map;function mT(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(Nm.get(e))return Nm.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,o=y1.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(o||g1.includes(n)))return;const u=async function(f,...m){const p=this.transaction(f,o?"readwrite":"readonly");let y=p.store;return s&&(y=y.index(m.shift())),(await Promise.all([y[n](...m),o&&p.done]))[0]};return Nm.set(e,u),u}d1(i=>({...i,get:(e,n,s)=>mT(e,n)||i.get(e,n,s),has:(e,n)=>!!mT(e,n)||i.has(e,n)}));/**
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
 */class _1{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(v1(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function v1(i){const e=i.getComponent();return e?.type==="VERSION"}const Xm="@firebase/app",pT="0.13.1";/**
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
 */const nr=new fu("@firebase/app"),T1="@firebase/app-compat",E1="@firebase/analytics-compat",A1="@firebase/analytics",b1="@firebase/app-check-compat",S1="@firebase/app-check",w1="@firebase/auth",I1="@firebase/auth-compat",R1="@firebase/database",C1="@firebase/data-connect",N1="@firebase/database-compat",D1="@firebase/functions",O1="@firebase/functions-compat",M1="@firebase/installations",x1="@firebase/installations-compat",V1="@firebase/messaging",k1="@firebase/messaging-compat",P1="@firebase/performance",U1="@firebase/performance-compat",L1="@firebase/remote-config",j1="@firebase/remote-config-compat",z1="@firebase/storage",B1="@firebase/storage-compat",q1="@firebase/firestore",F1="@firebase/ai",H1="@firebase/firestore-compat",G1="firebase",K1="11.9.0";/**
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
 */const Zm="[DEFAULT]",Y1={[Xm]:"fire-core",[T1]:"fire-core-compat",[A1]:"fire-analytics",[E1]:"fire-analytics-compat",[S1]:"fire-app-check",[b1]:"fire-app-check-compat",[w1]:"fire-auth",[I1]:"fire-auth-compat",[R1]:"fire-rtdb",[C1]:"fire-data-connect",[N1]:"fire-rtdb-compat",[D1]:"fire-fn",[O1]:"fire-fn-compat",[M1]:"fire-iid",[x1]:"fire-iid-compat",[V1]:"fire-fcm",[k1]:"fire-fcm-compat",[P1]:"fire-perf",[U1]:"fire-perf-compat",[L1]:"fire-rc",[j1]:"fire-rc-compat",[z1]:"fire-gcs",[B1]:"fire-gcs-compat",[q1]:"fire-fst",[H1]:"fire-fst-compat",[F1]:"fire-vertex","fire-js":"fire-js",[G1]:"fire-js-all"};/**
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
 */const yh=new Map,Q1=new Map,Wm=new Map;function gT(i,e){try{i.container.addComponent(e)}catch(n){nr.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,n)}}function Bn(i){const e=i.name;if(Wm.has(e))return nr.debug(`There were multiple attempts to register component ${e}.`),!1;Wm.set(e,i);for(const n of yh.values())gT(n,i);for(const n of Q1.values())gT(n,i);return!0}function lr(i,e){const n=i.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),i.container.getProvider(e)}function Zn(i){return i==null?!1:i.settings!==void 0}/**
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
 */const $1={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Kr=new as("app","Firebase",$1);/**
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
 */class X1{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new In("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Kr.create("app-deleted",{appName:this._name})}}/**
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
 */const sa=K1;function N0(i,e={}){let n=i;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Zm,automaticDataCollectionEnabled:!0},e),o=s.name;if(typeof o!="string"||!o)throw Kr.create("bad-app-name",{appName:String(o)});if(n||(n=E0()),!n)throw Kr.create("no-options");const u=yh.get(o);if(u){if($r(n,u.options)&&$r(s,u.config))return u;throw Kr.create("duplicate-app",{appName:o})}const f=new i1(o);for(const p of Wm.values())f.addComponent(p);const m=new X1(n,s,f);return yh.set(o,m),m}function du(i=Zm){const e=yh.get(i);if(!e&&i===Zm&&E0())return N0();if(!e)throw Kr.create("no-app",{appName:i});return e}function Wt(i,e,n){var s;let o=(s=Y1[i])!==null&&s!==void 0?s:i;n&&(o+=`-${n}`);const u=o.match(/\s|\//),f=e.match(/\s|\//);if(u||f){const m=[`Unable to register library "${o}" with version "${e}":`];u&&m.push(`library name "${o}" contains illegal characters (whitespace or "/")`),u&&f&&m.push("and"),f&&m.push(`version name "${e}" contains illegal characters (whitespace or "/")`),nr.warn(m.join(" "));return}Bn(new In(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
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
 */const Z1="firebase-heartbeat-database",W1=1,tu="firebase-heartbeat-store";let Dm=null;function D0(){return Dm||(Dm=C0(Z1,W1,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(tu)}catch(n){console.warn(n)}}}}).catch(i=>{throw Kr.create("idb-open",{originalErrorMessage:i.message})})),Dm}async function J1(i){try{const n=(await D0()).transaction(tu),s=await n.objectStore(tu).get(O0(i));return await n.done,s}catch(e){if(e instanceof qn)nr.warn(e.message);else{const n=Kr.create("idb-get",{originalErrorMessage:e?.message});nr.warn(n.message)}}}async function yT(i,e){try{const s=(await D0()).transaction(tu,"readwrite");await s.objectStore(tu).put(e,O0(i)),await s.done}catch(n){if(n instanceof qn)nr.warn(n.message);else{const s=Kr.create("idb-set",{originalErrorMessage:n?.message});nr.warn(s.message)}}}function O0(i){return`${i.name}!${i.options.appId}`}/**
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
 */const eR=1024,tR=30;class nR{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new rR(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),u=_T();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===u||this._heartbeatsCache.heartbeats.some(f=>f.date===u))return;if(this._heartbeatsCache.heartbeats.push({date:u,agent:o}),this._heartbeatsCache.heartbeats.length>tR){const f=sR(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(f,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){nr.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=_T(),{heartbeatsToSend:s,unsentEntries:o}=iR(this._heartbeatsCache.heartbeats),u=gh(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),u}catch(n){return nr.warn(n),""}}}function _T(){return new Date().toISOString().substring(0,10)}function iR(i,e=eR){const n=[];let s=i.slice();for(const o of i){const u=n.find(f=>f.agent===o.agent);if(u){if(u.dates.push(o.date),vT(n)>e){u.dates.pop();break}}else if(n.push({agent:o.agent,dates:[o.date]}),vT(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class rR{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Np()?Dp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await J1(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return yT(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return yT(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function vT(i){return gh(JSON.stringify({version:2,heartbeats:i})).length}function sR(i){if(i.length===0)return-1;let e=0,n=i[0].date;for(let s=1;s<i.length;s++)i[s].date<n&&(n=i[s].date,e=s);return e}/**
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
 */function aR(i){Bn(new In("platform-logger",e=>new _1(e),"PRIVATE")),Bn(new In("heartbeat",e=>new nR(e),"PRIVATE")),Wt(Xm,pT,i),Wt(Xm,pT,"esm2017"),Wt("fire-js","")}aR("");function Mp(i,e){var n={};for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&e.indexOf(s)<0&&(n[s]=i[s]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(i);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(i,s[o])&&(n[s[o]]=i[s[o]]);return n}function M0(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const oR=M0,x0=new as("auth","Firebase",M0());/**
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
 */const _h=new fu("@firebase/auth");function lR(i,...e){_h.logLevel<=Me.WARN&&_h.warn(`Auth (${sa}): ${i}`,...e)}function rh(i,...e){_h.logLevel<=Me.ERROR&&_h.error(`Auth (${sa}): ${i}`,...e)}/**
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
 */function ir(i,...e){throw xp(i,...e)}function vi(i,...e){return xp(i,...e)}function V0(i,e,n){const s=Object.assign(Object.assign({},oR()),{[e]:n});return new as("auth","Firebase",s).create(e,{appName:i.name})}function Zs(i){return V0(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function xp(i,...e){if(typeof i!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=i.name),i._errorFactory.create(n,...s)}return x0.create(i,...e)}function Te(i,e,...n){if(!i)throw xp(e,...n)}function Wi(i){const e="INTERNAL ASSERTION FAILED: "+i;throw rh(e),new Error(e)}function rr(i,e){i||Wi(e)}/**
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
 */function Jm(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.href)||""}function uR(){return TT()==="http:"||TT()==="https:"}function TT(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
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
 */function cR(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(uR()||S0()||"connection"in navigator)?navigator.onLine:!0}function hR(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
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
 */class mu{constructor(e,n){this.shortDelay=e,this.longDelay=n,rr(n>e,"Short delay should be less than long delay!"),this.isMobile=UI()||zI()}get(){return cR()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Vp(i,e){rr(i.emulator,"Emulator should always be set here");const{url:n}=i.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class k0{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Wi("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Wi("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Wi("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const fR={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const dR=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],mR=new mu(3e4,6e4);function kp(i,e){return i.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:i.tenantId}):e}async function bo(i,e,n,s,o={}){return P0(i,o,async()=>{let u={},f={};s&&(e==="GET"?f=s:u={body:JSON.stringify(s)});const m=hu(Object.assign({key:i.config.apiKey},f)).slice(1),p=await i._getAdditionalHeaders();p["Content-Type"]="application/json",i.languageCode&&(p["X-Firebase-Locale"]=i.languageCode);const y=Object.assign({method:e,headers:p},u);return jI()||(y.referrerPolicy="no-referrer"),i.emulatorConfig&&ra(i.emulatorConfig.host)&&(y.credentials="include"),k0.fetch()(await U0(i,i.config.apiHost,n,m),y)})}async function P0(i,e,n){i._canInitEmulator=!1;const s=Object.assign(Object.assign({},fR),e);try{const o=new gR(i),u=await Promise.race([n(),o.promise]);o.clearNetworkTimeout();const f=await u.json();if("needConfirmation"in f)throw $c(i,"account-exists-with-different-credential",f);if(u.ok&&!("errorMessage"in f))return f;{const m=u.ok?f.errorMessage:f.error.message,[p,y]=m.split(" : ");if(p==="FEDERATED_USER_ID_ALREADY_LINKED")throw $c(i,"credential-already-in-use",f);if(p==="EMAIL_EXISTS")throw $c(i,"email-already-in-use",f);if(p==="USER_DISABLED")throw $c(i,"user-disabled",f);const T=s[p]||p.toLowerCase().replace(/[_\s]+/g,"-");if(y)throw V0(i,T,y);ir(i,T)}}catch(o){if(o instanceof qn)throw o;ir(i,"network-request-failed",{message:String(o)})}}async function pR(i,e,n,s,o={}){const u=await bo(i,e,n,s,o);return"mfaPendingCredential"in u&&ir(i,"multi-factor-auth-required",{_serverResponse:u}),u}async function U0(i,e,n,s){const o=`${e}${n}?${s}`,u=i,f=u.config.emulator?Vp(i.config,o):`${i.config.apiScheme}://${o}`;return dR.includes(n)&&(await u._persistenceManagerAvailable,u._getPersistenceType()==="COOKIE")?u._getPersistence()._getFinalTarget(f).toString():f}class gR{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(vi(this.auth,"network-request-failed")),mR.get())})}}function $c(i,e,n){const s={appName:i.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const o=vi(i,e,s);return o.customData._tokenResponse=n,o}/**
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
 */async function yR(i,e){return bo(i,"POST","/v1/accounts:delete",e)}async function vh(i,e){return bo(i,"POST","/v1/accounts:lookup",e)}/**
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
 */function Gl(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function _R(i,e=!1){const n=mt(i),s=await n.getIdToken(e),o=Pp(s);Te(o&&o.exp&&o.auth_time&&o.iat,n.auth,"internal-error");const u=typeof o.firebase=="object"?o.firebase:void 0,f=u?.sign_in_provider;return{claims:o,token:s,authTime:Gl(Om(o.auth_time)),issuedAtTime:Gl(Om(o.iat)),expirationTime:Gl(Om(o.exp)),signInProvider:f||null,signInSecondFactor:u?.sign_in_second_factor||null}}function Om(i){return Number(i)*1e3}function Pp(i){const[e,n,s]=i.split(".");if(e===void 0||n===void 0||s===void 0)return rh("JWT malformed, contained fewer than 3 sections"),null;try{const o=_0(n);return o?JSON.parse(o):(rh("Failed to decode base64 JWT payload"),null)}catch(o){return rh("Caught error parsing JWT payload as JSON",o?.toString()),null}}function ET(i){const e=Pp(i);return Te(e,"internal-error"),Te(typeof e.exp<"u","internal-error"),Te(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function nu(i,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof qn&&vR(s)&&i.auth.currentUser===i&&await i.auth.signOut(),s}}function vR({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
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
 */class TR{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const o=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class ep{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Gl(this.lastLoginAt),this.creationTime=Gl(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Th(i){var e;const n=i.auth,s=await i.getIdToken(),o=await nu(i,vh(n,{idToken:s}));Te(o?.users.length,n,"internal-error");const u=o.users[0];i._notifyReloadListener(u);const f=!((e=u.providerUserInfo)===null||e===void 0)&&e.length?L0(u.providerUserInfo):[],m=AR(i.providerData,f),p=i.isAnonymous,y=!(i.email&&u.passwordHash)&&!m?.length,T=p?y:!1,S={uid:u.localId,displayName:u.displayName||null,photoURL:u.photoUrl||null,email:u.email||null,emailVerified:u.emailVerified||!1,phoneNumber:u.phoneNumber||null,tenantId:u.tenantId||null,providerData:m,metadata:new ep(u.createdAt,u.lastLoginAt),isAnonymous:T};Object.assign(i,S)}async function ER(i){const e=mt(i);await Th(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function AR(i,e){return[...i.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function L0(i){return i.map(e=>{var{providerId:n}=e,s=Mp(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function bR(i,e){const n=await P0(i,{},async()=>{const s=hu({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:u}=i.config,f=await U0(i,o,"/v1/token",`key=${u}`),m=await i._getAdditionalHeaders();m["Content-Type"]="application/x-www-form-urlencoded";const p={method:"POST",headers:m,body:s};return i.emulatorConfig&&ra(i.emulatorConfig.host)&&(p.credentials="include"),k0.fetch()(f,p)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function SR(i,e){return bo(i,"POST","/v2/accounts:revokeToken",kp(i,e))}/**
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
 */class oo{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Te(e.idToken,"internal-error"),Te(typeof e.idToken<"u","internal-error"),Te(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ET(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){Te(e.length!==0,"internal-error");const n=ET(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(Te(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:o,expiresIn:u}=await bR(e,n);this.updateTokensAndExpiration(s,o,Number(u))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:o,expirationTime:u}=n,f=new oo;return s&&(Te(typeof s=="string","internal-error",{appName:e}),f.refreshToken=s),o&&(Te(typeof o=="string","internal-error",{appName:e}),f.accessToken=o),u&&(Te(typeof u=="number","internal-error",{appName:e}),f.expirationTime=u),f}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new oo,this.toJSON())}_performRefresh(){return Wi("not implemented")}}/**
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
 */function Lr(i,e){Te(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class Wn{constructor(e){var{uid:n,auth:s,stsTokenManager:o}=e,u=Mp(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new TR(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=u.displayName||null,this.email=u.email||null,this.emailVerified=u.emailVerified||!1,this.phoneNumber=u.phoneNumber||null,this.photoURL=u.photoURL||null,this.isAnonymous=u.isAnonymous||!1,this.tenantId=u.tenantId||null,this.providerData=u.providerData?[...u.providerData]:[],this.metadata=new ep(u.createdAt||void 0,u.lastLoginAt||void 0)}async getIdToken(e){const n=await nu(this,this.stsTokenManager.getToken(this.auth,e));return Te(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return _R(this,e)}reload(){return ER(this)}_assign(e){this!==e&&(Te(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Wn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){Te(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await Th(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Zn(this.auth.app))return Promise.reject(Zs(this.auth));const e=await this.getIdToken();return await nu(this,yR(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,o,u,f,m,p,y,T;const S=(s=n.displayName)!==null&&s!==void 0?s:void 0,w=(o=n.email)!==null&&o!==void 0?o:void 0,P=(u=n.phoneNumber)!==null&&u!==void 0?u:void 0,k=(f=n.photoURL)!==null&&f!==void 0?f:void 0,K=(m=n.tenantId)!==null&&m!==void 0?m:void 0,q=(p=n._redirectEventId)!==null&&p!==void 0?p:void 0,ne=(y=n.createdAt)!==null&&y!==void 0?y:void 0,se=(T=n.lastLoginAt)!==null&&T!==void 0?T:void 0,{uid:le,emailVerified:fe,isAnonymous:de,providerData:Se,stsTokenManager:V}=n;Te(le&&V,e,"internal-error");const I=oo.fromJSON(this.name,V);Te(typeof le=="string",e,"internal-error"),Lr(S,e.name),Lr(w,e.name),Te(typeof fe=="boolean",e,"internal-error"),Te(typeof de=="boolean",e,"internal-error"),Lr(P,e.name),Lr(k,e.name),Lr(K,e.name),Lr(q,e.name),Lr(ne,e.name),Lr(se,e.name);const C=new Wn({uid:le,auth:e,email:w,emailVerified:fe,displayName:S,isAnonymous:de,photoURL:k,phoneNumber:P,tenantId:K,stsTokenManager:I,createdAt:ne,lastLoginAt:se});return Se&&Array.isArray(Se)&&(C.providerData=Se.map(D=>Object.assign({},D))),q&&(C._redirectEventId=q),C}static async _fromIdTokenResponse(e,n,s=!1){const o=new oo;o.updateFromServerResponse(n);const u=new Wn({uid:n.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await Th(u),u}static async _fromGetAccountInfoResponse(e,n,s){const o=n.users[0];Te(o.localId!==void 0,"internal-error");const u=o.providerUserInfo!==void 0?L0(o.providerUserInfo):[],f=!(o.email&&o.passwordHash)&&!u?.length,m=new oo;m.updateFromIdToken(s);const p=new Wn({uid:o.localId,auth:e,stsTokenManager:m,isAnonymous:f}),y={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new ep(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!u?.length};return Object.assign(p,y),p}}/**
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
 */const AT=new Map;function Ji(i){rr(i instanceof Function,"Expected a class definition");let e=AT.get(i);return e?(rr(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,AT.set(i,e),e)}/**
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
 */class j0{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}j0.type="NONE";const bT=j0;/**
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
 */function sh(i,e,n){return`firebase:${i}:${e}:${n}`}class lo{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:o,name:u}=this.auth;this.fullUserKey=sh(this.userKey,o.apiKey,u),this.fullPersistenceKey=sh("persistence",o.apiKey,u),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await vh(this.auth,{idToken:e}).catch(()=>{});return n?Wn._fromGetAccountInfoResponse(this.auth,n,e):null}return Wn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new lo(Ji(bT),e,s);const o=(await Promise.all(n.map(async y=>{if(await y._isAvailable())return y}))).filter(y=>y);let u=o[0]||Ji(bT);const f=sh(s,e.config.apiKey,e.name);let m=null;for(const y of n)try{const T=await y._get(f);if(T){let S;if(typeof T=="string"){const w=await vh(e,{idToken:T}).catch(()=>{});if(!w)break;S=await Wn._fromGetAccountInfoResponse(e,w,T)}else S=Wn._fromJSON(e,T);y!==u&&(m=S),u=y;break}}catch{}const p=o.filter(y=>y._shouldAllowMigration);return!u._shouldAllowMigration||!p.length?new lo(u,e,s):(u=p[0],m&&await u._set(f,m.toJSON()),await Promise.all(n.map(async y=>{if(y!==u)try{await y._remove(f)}catch{}})),new lo(u,e,s))}}/**
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
 */function ST(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(F0(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(z0(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(G0(e))return"Blackberry";if(K0(e))return"Webos";if(B0(e))return"Safari";if((e.includes("chrome/")||q0(e))&&!e.includes("edge/"))return"Chrome";if(H0(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=i.match(n);if(s?.length===2)return s[1]}return"Other"}function z0(i=en()){return/firefox\//i.test(i)}function B0(i=en()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function q0(i=en()){return/crios\//i.test(i)}function F0(i=en()){return/iemobile/i.test(i)}function H0(i=en()){return/android/i.test(i)}function G0(i=en()){return/blackberry/i.test(i)}function K0(i=en()){return/webos/i.test(i)}function Up(i=en()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function wR(i=en()){var e;return Up(i)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function IR(){return BI()&&document.documentMode===10}function Y0(i=en()){return Up(i)||H0(i)||K0(i)||G0(i)||/windows phone/i.test(i)||F0(i)}/**
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
 */function Q0(i,e=[]){let n;switch(i){case"Browser":n=ST(en());break;case"Worker":n=`${ST(en())}-${i}`;break;default:n=i}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${sa}/${s}`}/**
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
 */class RR{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=u=>new Promise((f,m)=>{try{const p=e(u);f(p)}catch(p){m(p)}});s.onAbort=n,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const o of n)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s?.message})}}}/**
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
 */async function CR(i,e={}){return bo(i,"GET","/v2/passwordPolicy",kp(i,e))}/**
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
 */const NR=6;class DR{constructor(e){var n,s,o,u;const f=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=f.minPasswordLength)!==null&&n!==void 0?n:NR,f.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=f.maxPasswordLength),f.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=f.containsLowercaseCharacter),f.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=f.containsUppercaseCharacter),f.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=f.containsNumericCharacter),f.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=f.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(u=e.forceUpgradeOnSignin)!==null&&u!==void 0?u:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,o,u,f,m;const p={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,p),this.validatePasswordCharacterOptions(e,p),p.isValid&&(p.isValid=(n=p.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),p.isValid&&(p.isValid=(s=p.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),p.isValid&&(p.isValid=(o=p.containsLowercaseLetter)!==null&&o!==void 0?o:!0),p.isValid&&(p.isValid=(u=p.containsUppercaseLetter)!==null&&u!==void 0?u:!0),p.isValid&&(p.isValid=(f=p.containsNumericCharacter)!==null&&f!==void 0?f:!0),p.isValid&&(p.isValid=(m=p.containsNonAlphanumericCharacter)!==null&&m!==void 0?m:!0),p}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),o&&(n.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,o,u){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=u))}}/**
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
 */class OR{constructor(e,n,s,o){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new wT(this),this.idTokenSubscription=new wT(this),this.beforeStateQueue=new RR(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=x0,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(u=>this._resolvePersistenceManagerAvailable=u)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ji(n)),this._initializationPromise=this.queue(async()=>{var s,o,u;if(!this._deleted&&(this.persistenceManager=await lo.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((u=this.currentUser)===null||u===void 0?void 0:u.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await vh(this,{idToken:e}),s=await Wn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Zn(this.app)){const f=this.app.settings.authIdToken;return f?new Promise(m=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(f).then(m,m))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let o=s,u=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const f=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,m=o?._redirectEventId,p=await this.tryRedirectSignIn(e);(!f||f===m)&&p?.user&&(o=p.user,u=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(u)try{await this.beforeStateQueue.runMiddleware(o)}catch(f){o=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(f))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return Te(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Th(e)}catch(n){if(n?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=hR()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Zn(this.app))return Promise.reject(Zs(this));const n=e?mt(e):null;return n&&Te(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&Te(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Zn(this.app)?Promise.reject(Zs(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Zn(this.app)?Promise.reject(Zs(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ji(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await CR(this),n=new DR(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new as("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await SR(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ji(e)||this._popupRedirectResolver;Te(n,this,"argument-error"),this.redirectPersistenceManager=await lo.create(this,[Ji(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,o){if(this._deleted)return()=>{};const u=typeof n=="function"?n:n.next.bind(n);let f=!1;const m=this._isInitialized?Promise.resolve():this._initializationPromise;if(Te(m,this,"internal-error"),m.then(()=>{f||u(this.currentUser)}),typeof n=="function"){const p=e.addObserver(n,s,o);return()=>{f=!0,p()}}else{const p=e.addObserver(n);return()=>{f=!0,p()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Te(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Q0(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const o=await this._getAppCheckToken();return o&&(n["X-Firebase-AppCheck"]=o),n}async _getAppCheckToken(){var e;if(Zn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n?.error&&lR(`Error while retrieving App Check token: ${n.error}`),n?.token}}function Lp(i){return mt(i)}class wT{constructor(e){this.auth=e,this.observer=null,this.addObserver=YI(n=>this.observer=n)}get next(){return Te(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let jp={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function MR(i){jp=i}function xR(i){return jp.loadJS(i)}function VR(){return jp.gapiScript}function kR(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
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
 */function PR(i,e){const n=lr(i,"auth");if(n.isInitialized()){const o=n.getImmediate(),u=n.getOptions();if($r(u,e??{}))return o;ir(o,"already-initialized")}return n.initialize({options:e})}function UR(i,e){const n=e?.persistence||[],s=(Array.isArray(n)?n:[n]).map(Ji);e?.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(s,e?.popupRedirectResolver)}function LR(i,e,n){const s=Lp(i);Te(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,u=$0(e),{host:f,port:m}=jR(e),p=m===null?"":`:${m}`,y={url:`${u}//${f}${p}/`},T=Object.freeze({host:f,port:m,protocol:u.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){Te(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),Te($r(y,s.config.emulator)&&$r(T,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=y,s.emulatorConfig=T,s.settings.appVerificationDisabledForTesting=!0,ra(f)?(Rp(`${u}//${f}${p}`),Cp("Auth",!0)):zR()}function $0(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function jR(i){const e=$0(i),n=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const u=o[1];return{host:u,port:IT(s.substr(u.length+1))}}else{const[u,f]=s.split(":");return{host:u,port:IT(f)}}}function IT(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function zR(){function i(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
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
 */class X0{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Wi("not implemented")}_getIdTokenResponse(e){return Wi("not implemented")}_linkToIdToken(e,n){return Wi("not implemented")}_getReauthenticationResolver(e){return Wi("not implemented")}}/**
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
 */async function uo(i,e){return pR(i,"POST","/v1/accounts:signInWithIdp",kp(i,e))}/**
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
 */const BR="http://localhost";class Js extends X0{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Js(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ir("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o}=n,u=Mp(n,["providerId","signInMethod"]);if(!s||!o)return null;const f=new Js(s,o);return f.idToken=u.idToken||void 0,f.accessToken=u.accessToken||void 0,f.secret=u.secret,f.nonce=u.nonce,f.pendingToken=u.pendingToken||null,f}_getIdTokenResponse(e){const n=this.buildRequest();return uo(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,uo(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,uo(e,n)}buildRequest(){const e={requestUri:BR,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=hu(n)}return e}}/**
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
 */class Z0{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class pu extends Z0{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class jr extends pu{constructor(){super("facebook.com")}static credential(e){return Js._fromParams({providerId:jr.PROVIDER_ID,signInMethod:jr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return jr.credentialFromTaggedObject(e)}static credentialFromError(e){return jr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return jr.credential(e.oauthAccessToken)}catch{return null}}}jr.FACEBOOK_SIGN_IN_METHOD="facebook.com";jr.PROVIDER_ID="facebook.com";/**
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
 */class zr extends pu{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Js._fromParams({providerId:zr.PROVIDER_ID,signInMethod:zr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return zr.credentialFromTaggedObject(e)}static credentialFromError(e){return zr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return zr.credential(n,s)}catch{return null}}}zr.GOOGLE_SIGN_IN_METHOD="google.com";zr.PROVIDER_ID="google.com";/**
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
 */class Br extends pu{constructor(){super("github.com")}static credential(e){return Js._fromParams({providerId:Br.PROVIDER_ID,signInMethod:Br.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Br.credentialFromTaggedObject(e)}static credentialFromError(e){return Br.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Br.credential(e.oauthAccessToken)}catch{return null}}}Br.GITHUB_SIGN_IN_METHOD="github.com";Br.PROVIDER_ID="github.com";/**
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
 */class qr extends pu{constructor(){super("twitter.com")}static credential(e,n){return Js._fromParams({providerId:qr.PROVIDER_ID,signInMethod:qr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return qr.credentialFromTaggedObject(e)}static credentialFromError(e){return qr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return qr.credential(n,s)}catch{return null}}}qr.TWITTER_SIGN_IN_METHOD="twitter.com";qr.PROVIDER_ID="twitter.com";/**
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
 */class mo{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,o=!1){const u=await Wn._fromIdTokenResponse(e,s,o),f=RT(s);return new mo({user:u,providerId:f,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const o=RT(s);return new mo({user:e,providerId:o,_tokenResponse:s,operationType:n})}}function RT(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
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
 */class Eh extends qn{constructor(e,n,s,o){var u;super(n.code,n.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,Eh.prototype),this.customData={appName:e.name,tenantId:(u=e.tenantId)!==null&&u!==void 0?u:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,o){return new Eh(e,n,s,o)}}function W0(i,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(i):n._getIdTokenResponse(i)).catch(u=>{throw u.code==="auth/multi-factor-auth-required"?Eh._fromErrorAndOperation(i,u,e,s):u})}async function qR(i,e,n=!1){const s=await nu(i,e._linkToIdToken(i.auth,await i.getIdToken()),n);return mo._forOperation(i,"link",s)}/**
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
 */async function FR(i,e,n=!1){const{auth:s}=i;if(Zn(s.app))return Promise.reject(Zs(s));const o="reauthenticate";try{const u=await nu(i,W0(s,o,e,i),n);Te(u.idToken,s,"internal-error");const f=Pp(u.idToken);Te(f,s,"internal-error");const{sub:m}=f;return Te(i.uid===m,s,"user-mismatch"),mo._forOperation(i,o,u)}catch(u){throw u?.code==="auth/user-not-found"&&ir(s,"user-mismatch"),u}}/**
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
 */async function HR(i,e,n=!1){if(Zn(i.app))return Promise.reject(Zs(i));const s="signIn",o=await W0(i,s,e),u=await mo._fromIdTokenResponse(i,s,o);return n||await i._updateCurrentUser(u.user),u}function GR(i,e,n,s){return mt(i).onIdTokenChanged(e,n,s)}function KR(i,e,n){return mt(i).beforeAuthStateChanged(e,n)}function YR(i,e,n,s){return mt(i).onAuthStateChanged(e,n,s)}const Ah="__sak";/**
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
 */class J0{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Ah,"1"),this.storage.removeItem(Ah),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const QR=1e3,$R=10;class eA extends J0{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Y0(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),o=this.localCache[n];s!==o&&e(n,o,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((f,m,p)=>{this.notifyListeners(f,p)});return}const s=e.key;n?this.detachListener():this.stopPolling();const o=()=>{const f=this.storage.getItem(s);!n&&this.localCache[s]===f||this.notifyListeners(s,f)},u=this.storage.getItem(s);IR()&&u!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,$R):o()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},QR)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}eA.type="LOCAL";const XR=eA;/**
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
 */class tA extends J0{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}tA.type="SESSION";const nA=tA;/**
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
 */function ZR(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Hh{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(o=>o.isListeningto(e));if(n)return n;const s=new Hh(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:o,data:u}=n.data,f=this.handlersMap[o];if(!f?.size)return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const m=Array.from(f).map(async y=>y(n.origin,u)),p=await ZR(m);n.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:p})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Hh.receivers=[];/**
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
 */function zp(i="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return i+n}/**
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
 */class WR{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let u,f;return new Promise((m,p)=>{const y=zp("",20);o.port1.start();const T=setTimeout(()=>{p(new Error("unsupported_event"))},s);f={messageChannel:o,onMessage(S){const w=S;if(w.data.eventId===y)switch(w.data.status){case"ack":clearTimeout(T),u=setTimeout(()=>{p(new Error("timeout"))},3e3);break;case"done":clearTimeout(u),m(w.data.response);break;default:clearTimeout(T),clearTimeout(u),p(new Error("invalid_response"));break}}},this.handlers.add(f),o.port1.addEventListener("message",f.onMessage),this.target.postMessage({eventType:e,eventId:y,data:n},[o.port2])}).finally(()=>{f&&this.removeMessageHandler(f)})}}/**
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
 */function Ti(){return window}function JR(i){Ti().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */function iA(){return typeof Ti().WorkerGlobalScope<"u"&&typeof Ti().importScripts=="function"}async function eC(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function tC(){var i;return((i=navigator?.serviceWorker)===null||i===void 0?void 0:i.controller)||null}function nC(){return iA()?self:null}/**
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
 */const rA="firebaseLocalStorageDb",iC=1,bh="firebaseLocalStorage",sA="fbase_key";class gu{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Gh(i,e){return i.transaction([bh],e?"readwrite":"readonly").objectStore(bh)}function rC(){const i=indexedDB.deleteDatabase(rA);return new gu(i).toPromise()}function tp(){const i=indexedDB.open(rA,iC);return new Promise((e,n)=>{i.addEventListener("error",()=>{n(i.error)}),i.addEventListener("upgradeneeded",()=>{const s=i.result;try{s.createObjectStore(bh,{keyPath:sA})}catch(o){n(o)}}),i.addEventListener("success",async()=>{const s=i.result;s.objectStoreNames.contains(bh)?e(s):(s.close(),await rC(),e(await tp()))})})}async function CT(i,e,n){const s=Gh(i,!0).put({[sA]:e,value:n});return new gu(s).toPromise()}async function sC(i,e){const n=Gh(i,!1).get(e),s=await new gu(n).toPromise();return s===void 0?null:s.value}function NT(i,e){const n=Gh(i,!0).delete(e);return new gu(n).toPromise()}const aC=800,oC=3;class aA{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await tp(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>oC)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return iA()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Hh._getInstance(nC()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await eC(),!this.activeServiceWorker)return;this.sender=new WR(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||tC()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await tp();return await CT(e,Ah,"1"),await NT(e,Ah),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>CT(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>sC(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>NT(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const u=Gh(o,!1).getAll();return new gu(u).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:u}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(u)&&(this.notifyListeners(o,u),n.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),n.push(o));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),aC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}aA.type="LOCAL";const lC=aA;new mu(3e4,6e4);/**
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
 */function uC(i,e){return e?Ji(e):(Te(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
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
 */class Bp extends X0{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return uo(e,this._buildIdpRequest())}_linkToIdToken(e,n){return uo(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return uo(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function cC(i){return HR(i.auth,new Bp(i),i.bypassAuthState)}function hC(i){const{auth:e,user:n}=i;return Te(n,e,"internal-error"),FR(n,new Bp(i),i.bypassAuthState)}async function fC(i){const{auth:e,user:n}=i;return Te(n,e,"internal-error"),qR(n,new Bp(i),i.bypassAuthState)}/**
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
 */class oA{constructor(e,n,s,o,u=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=u,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:o,tenantId:u,error:f,type:m}=e;if(f){this.reject(f);return}const p={auth:this.auth,requestUri:n,sessionId:s,tenantId:u||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(m)(p))}catch(y){this.reject(y)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return cC;case"linkViaPopup":case"linkViaRedirect":return fC;case"reauthViaPopup":case"reauthViaRedirect":return hC;default:ir(this.auth,"internal-error")}}resolve(e){rr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){rr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const dC=new mu(2e3,1e4);class so extends oA{constructor(e,n,s,o,u){super(e,n,o,u),this.provider=s,this.authWindow=null,this.pollId=null,so.currentPopupAction&&so.currentPopupAction.cancel(),so.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Te(e,this.auth,"internal-error"),e}async onExecution(){rr(this.filter.length===1,"Popup operations only handle one event");const e=zp();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(vi(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(vi(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,so.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(vi(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,dC.get())};e()}}so.currentPopupAction=null;/**
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
 */const mC="pendingRedirect",ah=new Map;class pC extends oA{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=ah.get(this.auth._key());if(!e){try{const s=await gC(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}ah.set(this.auth._key(),e)}return this.bypassAuthState||ah.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function gC(i,e){const n=vC(e),s=_C(i);if(!await s._isAvailable())return!1;const o=await s._get(n)==="true";return await s._remove(n),o}function yC(i,e){ah.set(i._key(),e)}function _C(i){return Ji(i._redirectPersistence)}function vC(i){return sh(mC,i.config.apiKey,i.name)}async function TC(i,e,n=!1){if(Zn(i.app))return Promise.reject(Zs(i));const s=Lp(i),o=uC(s,e),f=await new pC(s,o,n).execute();return f&&!n&&(delete f.user._redirectEventId,await s._persistUserIfCurrent(f.user),await s._setRedirectUser(null,e)),f}/**
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
 */const EC=10*60*1e3;class AC{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!bC(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!lA(e)){const o=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(vi(this.auth,o))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=EC&&this.cachedEventUids.clear(),this.cachedEventUids.has(DT(e))}saveEventToCache(e){this.cachedEventUids.add(DT(e)),this.lastProcessedEventTime=Date.now()}}function DT(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function lA({type:i,error:e}){return i==="unknown"&&e?.code==="auth/no-auth-event"}function bC(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return lA(i);default:return!1}}/**
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
 */async function SC(i,e={}){return bo(i,"GET","/v1/projects",e)}/**
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
 */const wC=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,IC=/^https?/;async function RC(i){if(i.config.emulator)return;const{authorizedDomains:e}=await SC(i);for(const n of e)try{if(CC(n))return}catch{}ir(i,"unauthorized-domain")}function CC(i){const e=Jm(),{protocol:n,hostname:s}=new URL(e);if(i.startsWith("chrome-extension://")){const f=new URL(i);return f.hostname===""&&s===""?n==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&f.hostname===s}if(!IC.test(n))return!1;if(wC.test(i))return s===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const NC=new mu(3e4,6e4);function OT(){const i=Ti().___jsl;if(i?.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let n=0;n<i.CP.length;n++)i.CP[n]=null}}function DC(i){return new Promise((e,n)=>{var s,o,u;function f(){OT(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{OT(),n(vi(i,"network-request-failed"))},timeout:NC.get()})}if(!((o=(s=Ti().gapi)===null||s===void 0?void 0:s.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((u=Ti().gapi)===null||u===void 0)&&u.load)f();else{const m=kR("iframefcb");return Ti()[m]=()=>{gapi.load?f():n(vi(i,"network-request-failed"))},xR(`${VR()}?onload=${m}`).catch(p=>n(p))}}).catch(e=>{throw oh=null,e})}let oh=null;function OC(i){return oh=oh||DC(i),oh}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const MC=new mu(5e3,15e3),xC="__/auth/iframe",VC="emulator/auth/iframe",kC={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},PC=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function UC(i){const e=i.config;Te(e.authDomain,i,"auth-domain-config-required");const n=e.emulator?Vp(e,VC):`https://${i.config.authDomain}/${xC}`,s={apiKey:e.apiKey,appName:i.name,v:sa},o=PC.get(i.config.apiHost);o&&(s.eid=o);const u=i._getFrameworks();return u.length&&(s.fw=u.join(",")),`${n}?${hu(s).slice(1)}`}async function LC(i){const e=await OC(i),n=Ti().gapi;return Te(n,i,"internal-error"),e.open({where:document.body,url:UC(i),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:kC,dontclear:!0},s=>new Promise(async(o,u)=>{await s.restyle({setHideOnLeave:!1});const f=vi(i,"network-request-failed"),m=Ti().setTimeout(()=>{u(f)},MC.get());function p(){Ti().clearTimeout(m),o(s)}s.ping(p).then(p,()=>{u(f)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const jC={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},zC=500,BC=600,qC="_blank",FC="http://localhost";class MT{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function HC(i,e,n,s=zC,o=BC){const u=Math.max((window.screen.availHeight-o)/2,0).toString(),f=Math.max((window.screen.availWidth-s)/2,0).toString();let m="";const p=Object.assign(Object.assign({},jC),{width:s.toString(),height:o.toString(),top:u,left:f}),y=en().toLowerCase();n&&(m=q0(y)?qC:n),z0(y)&&(e=e||FC,p.scrollbars="yes");const T=Object.entries(p).reduce((w,[P,k])=>`${w}${P}=${k},`,"");if(wR(y)&&m!=="_self")return GC(e||"",m),new MT(null);const S=window.open(e||"",m,T);Te(S,i,"popup-blocked");try{S.focus()}catch{}return new MT(S)}function GC(i,e){const n=document.createElement("a");n.href=i,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const KC="__/auth/handler",YC="emulator/auth/handler",QC=encodeURIComponent("fac");async function xT(i,e,n,s,o,u){Te(i.config.authDomain,i,"auth-domain-config-required"),Te(i.config.apiKey,i,"invalid-api-key");const f={apiKey:i.config.apiKey,appName:i.name,authType:n,redirectUrl:s,v:sa,eventId:o};if(e instanceof Z0){e.setDefaultLanguage(i.languageCode),f.providerId=e.providerId||"",KI(e.getCustomParameters())||(f.customParameters=JSON.stringify(e.getCustomParameters()));for(const[T,S]of Object.entries({}))f[T]=S}if(e instanceof pu){const T=e.getScopes().filter(S=>S!=="");T.length>0&&(f.scopes=T.join(","))}i.tenantId&&(f.tid=i.tenantId);const m=f;for(const T of Object.keys(m))m[T]===void 0&&delete m[T];const p=await i._getAppCheckToken(),y=p?`#${QC}=${encodeURIComponent(p)}`:"";return`${$C(i)}?${hu(m).slice(1)}${y}`}function $C({config:i}){return i.emulator?Vp(i,YC):`https://${i.authDomain}/${KC}`}/**
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
 */const Mm="webStorageSupport";class XC{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=nA,this._completeRedirectFn=TC,this._overrideRedirectResult=yC}async _openPopup(e,n,s,o){var u;rr((u=this.eventManagers[e._key()])===null||u===void 0?void 0:u.manager,"_initialize() not called before _openPopup()");const f=await xT(e,n,s,Jm(),o);return HC(e,f,zp())}async _openRedirect(e,n,s,o){await this._originValidation(e);const u=await xT(e,n,s,Jm(),o);return JR(u),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:o,promise:u}=this.eventManagers[n];return o?Promise.resolve(o):(rr(u,"If manager is not set, promise should be"),u)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await LC(e),s=new AC(e);return n.register("authEvent",o=>(Te(o?.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Mm,{type:Mm},o=>{var u;const f=(u=o?.[0])===null||u===void 0?void 0:u[Mm];f!==void 0&&n(!!f),ir(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=RC(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Y0()||B0()||Up()}}const ZC=XC;var VT="@firebase/auth",kT="1.10.7";/**
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
 */class WC{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e(s?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){Te(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function JC(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function eN(i){Bn(new In("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),u=e.getProvider("app-check-internal"),{apiKey:f,authDomain:m}=s.options;Te(f&&!f.includes(":"),"invalid-api-key",{appName:s.name});const p={apiKey:f,authDomain:m,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Q0(i)},y=new OR(s,o,u,p);return UR(y,n),y},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Bn(new In("auth-internal",e=>{const n=Lp(e.getProvider("auth").getImmediate());return(s=>new WC(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Wt(VT,kT,JC(i)),Wt(VT,kT,"esm2017")}/**
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
 */const tN=5*60,nN=A0("authIdTokenMaxAge")||tN;let PT=null;const iN=i=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>nN)return;const o=n?.token;PT!==o&&(PT=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function rN(i=du()){const e=lr(i,"auth");if(e.isInitialized())return e.getImmediate();const n=PR(i,{popupRedirectResolver:ZC,persistence:[lC,XR,nA]}),s=A0("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const u=new URL(s,location.origin);if(location.origin===u.origin){const f=iN(u.toString());KR(n,f,()=>f(n.currentUser)),GR(n,m=>f(m))}}const o=v0("auth");return o&&LR(n,`http://${o}`),n}function sN(){var i,e;return(e=(i=document.getElementsByTagName("head"))===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:document}MR({loadJS(i){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",i),s.onload=e,s.onerror=o=>{const u=vi("internal-error");u.customData=o,n(u)},s.type="text/javascript",s.charset="UTF-8",sN().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});eN("Browser");var aN="firebase",oN="11.9.1";/**
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
 */Wt(aN,oN,"app");var UT=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Yr,uA;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(V,I){function C(){}C.prototype=I.prototype,V.D=I.prototype,V.prototype=new C,V.prototype.constructor=V,V.C=function(D,x,U){for(var N=Array(arguments.length-2),Pt=2;Pt<arguments.length;Pt++)N[Pt-2]=arguments[Pt];return I.prototype[x].apply(D,N)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(V,I,C){C||(C=0);var D=Array(16);if(typeof I=="string")for(var x=0;16>x;++x)D[x]=I.charCodeAt(C++)|I.charCodeAt(C++)<<8|I.charCodeAt(C++)<<16|I.charCodeAt(C++)<<24;else for(x=0;16>x;++x)D[x]=I[C++]|I[C++]<<8|I[C++]<<16|I[C++]<<24;I=V.g[0],C=V.g[1],x=V.g[2];var U=V.g[3],N=I+(U^C&(x^U))+D[0]+3614090360&4294967295;I=C+(N<<7&4294967295|N>>>25),N=U+(x^I&(C^x))+D[1]+3905402710&4294967295,U=I+(N<<12&4294967295|N>>>20),N=x+(C^U&(I^C))+D[2]+606105819&4294967295,x=U+(N<<17&4294967295|N>>>15),N=C+(I^x&(U^I))+D[3]+3250441966&4294967295,C=x+(N<<22&4294967295|N>>>10),N=I+(U^C&(x^U))+D[4]+4118548399&4294967295,I=C+(N<<7&4294967295|N>>>25),N=U+(x^I&(C^x))+D[5]+1200080426&4294967295,U=I+(N<<12&4294967295|N>>>20),N=x+(C^U&(I^C))+D[6]+2821735955&4294967295,x=U+(N<<17&4294967295|N>>>15),N=C+(I^x&(U^I))+D[7]+4249261313&4294967295,C=x+(N<<22&4294967295|N>>>10),N=I+(U^C&(x^U))+D[8]+1770035416&4294967295,I=C+(N<<7&4294967295|N>>>25),N=U+(x^I&(C^x))+D[9]+2336552879&4294967295,U=I+(N<<12&4294967295|N>>>20),N=x+(C^U&(I^C))+D[10]+4294925233&4294967295,x=U+(N<<17&4294967295|N>>>15),N=C+(I^x&(U^I))+D[11]+2304563134&4294967295,C=x+(N<<22&4294967295|N>>>10),N=I+(U^C&(x^U))+D[12]+1804603682&4294967295,I=C+(N<<7&4294967295|N>>>25),N=U+(x^I&(C^x))+D[13]+4254626195&4294967295,U=I+(N<<12&4294967295|N>>>20),N=x+(C^U&(I^C))+D[14]+2792965006&4294967295,x=U+(N<<17&4294967295|N>>>15),N=C+(I^x&(U^I))+D[15]+1236535329&4294967295,C=x+(N<<22&4294967295|N>>>10),N=I+(x^U&(C^x))+D[1]+4129170786&4294967295,I=C+(N<<5&4294967295|N>>>27),N=U+(C^x&(I^C))+D[6]+3225465664&4294967295,U=I+(N<<9&4294967295|N>>>23),N=x+(I^C&(U^I))+D[11]+643717713&4294967295,x=U+(N<<14&4294967295|N>>>18),N=C+(U^I&(x^U))+D[0]+3921069994&4294967295,C=x+(N<<20&4294967295|N>>>12),N=I+(x^U&(C^x))+D[5]+3593408605&4294967295,I=C+(N<<5&4294967295|N>>>27),N=U+(C^x&(I^C))+D[10]+38016083&4294967295,U=I+(N<<9&4294967295|N>>>23),N=x+(I^C&(U^I))+D[15]+3634488961&4294967295,x=U+(N<<14&4294967295|N>>>18),N=C+(U^I&(x^U))+D[4]+3889429448&4294967295,C=x+(N<<20&4294967295|N>>>12),N=I+(x^U&(C^x))+D[9]+568446438&4294967295,I=C+(N<<5&4294967295|N>>>27),N=U+(C^x&(I^C))+D[14]+3275163606&4294967295,U=I+(N<<9&4294967295|N>>>23),N=x+(I^C&(U^I))+D[3]+4107603335&4294967295,x=U+(N<<14&4294967295|N>>>18),N=C+(U^I&(x^U))+D[8]+1163531501&4294967295,C=x+(N<<20&4294967295|N>>>12),N=I+(x^U&(C^x))+D[13]+2850285829&4294967295,I=C+(N<<5&4294967295|N>>>27),N=U+(C^x&(I^C))+D[2]+4243563512&4294967295,U=I+(N<<9&4294967295|N>>>23),N=x+(I^C&(U^I))+D[7]+1735328473&4294967295,x=U+(N<<14&4294967295|N>>>18),N=C+(U^I&(x^U))+D[12]+2368359562&4294967295,C=x+(N<<20&4294967295|N>>>12),N=I+(C^x^U)+D[5]+4294588738&4294967295,I=C+(N<<4&4294967295|N>>>28),N=U+(I^C^x)+D[8]+2272392833&4294967295,U=I+(N<<11&4294967295|N>>>21),N=x+(U^I^C)+D[11]+1839030562&4294967295,x=U+(N<<16&4294967295|N>>>16),N=C+(x^U^I)+D[14]+4259657740&4294967295,C=x+(N<<23&4294967295|N>>>9),N=I+(C^x^U)+D[1]+2763975236&4294967295,I=C+(N<<4&4294967295|N>>>28),N=U+(I^C^x)+D[4]+1272893353&4294967295,U=I+(N<<11&4294967295|N>>>21),N=x+(U^I^C)+D[7]+4139469664&4294967295,x=U+(N<<16&4294967295|N>>>16),N=C+(x^U^I)+D[10]+3200236656&4294967295,C=x+(N<<23&4294967295|N>>>9),N=I+(C^x^U)+D[13]+681279174&4294967295,I=C+(N<<4&4294967295|N>>>28),N=U+(I^C^x)+D[0]+3936430074&4294967295,U=I+(N<<11&4294967295|N>>>21),N=x+(U^I^C)+D[3]+3572445317&4294967295,x=U+(N<<16&4294967295|N>>>16),N=C+(x^U^I)+D[6]+76029189&4294967295,C=x+(N<<23&4294967295|N>>>9),N=I+(C^x^U)+D[9]+3654602809&4294967295,I=C+(N<<4&4294967295|N>>>28),N=U+(I^C^x)+D[12]+3873151461&4294967295,U=I+(N<<11&4294967295|N>>>21),N=x+(U^I^C)+D[15]+530742520&4294967295,x=U+(N<<16&4294967295|N>>>16),N=C+(x^U^I)+D[2]+3299628645&4294967295,C=x+(N<<23&4294967295|N>>>9),N=I+(x^(C|~U))+D[0]+4096336452&4294967295,I=C+(N<<6&4294967295|N>>>26),N=U+(C^(I|~x))+D[7]+1126891415&4294967295,U=I+(N<<10&4294967295|N>>>22),N=x+(I^(U|~C))+D[14]+2878612391&4294967295,x=U+(N<<15&4294967295|N>>>17),N=C+(U^(x|~I))+D[5]+4237533241&4294967295,C=x+(N<<21&4294967295|N>>>11),N=I+(x^(C|~U))+D[12]+1700485571&4294967295,I=C+(N<<6&4294967295|N>>>26),N=U+(C^(I|~x))+D[3]+2399980690&4294967295,U=I+(N<<10&4294967295|N>>>22),N=x+(I^(U|~C))+D[10]+4293915773&4294967295,x=U+(N<<15&4294967295|N>>>17),N=C+(U^(x|~I))+D[1]+2240044497&4294967295,C=x+(N<<21&4294967295|N>>>11),N=I+(x^(C|~U))+D[8]+1873313359&4294967295,I=C+(N<<6&4294967295|N>>>26),N=U+(C^(I|~x))+D[15]+4264355552&4294967295,U=I+(N<<10&4294967295|N>>>22),N=x+(I^(U|~C))+D[6]+2734768916&4294967295,x=U+(N<<15&4294967295|N>>>17),N=C+(U^(x|~I))+D[13]+1309151649&4294967295,C=x+(N<<21&4294967295|N>>>11),N=I+(x^(C|~U))+D[4]+4149444226&4294967295,I=C+(N<<6&4294967295|N>>>26),N=U+(C^(I|~x))+D[11]+3174756917&4294967295,U=I+(N<<10&4294967295|N>>>22),N=x+(I^(U|~C))+D[2]+718787259&4294967295,x=U+(N<<15&4294967295|N>>>17),N=C+(U^(x|~I))+D[9]+3951481745&4294967295,V.g[0]=V.g[0]+I&4294967295,V.g[1]=V.g[1]+(x+(N<<21&4294967295|N>>>11))&4294967295,V.g[2]=V.g[2]+x&4294967295,V.g[3]=V.g[3]+U&4294967295}s.prototype.u=function(V,I){I===void 0&&(I=V.length);for(var C=I-this.blockSize,D=this.B,x=this.h,U=0;U<I;){if(x==0)for(;U<=C;)o(this,V,U),U+=this.blockSize;if(typeof V=="string"){for(;U<I;)if(D[x++]=V.charCodeAt(U++),x==this.blockSize){o(this,D),x=0;break}}else for(;U<I;)if(D[x++]=V[U++],x==this.blockSize){o(this,D),x=0;break}}this.h=x,this.o+=I},s.prototype.v=function(){var V=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);V[0]=128;for(var I=1;I<V.length-8;++I)V[I]=0;var C=8*this.o;for(I=V.length-8;I<V.length;++I)V[I]=C&255,C/=256;for(this.u(V),V=Array(16),I=C=0;4>I;++I)for(var D=0;32>D;D+=8)V[C++]=this.g[I]>>>D&255;return V};function u(V,I){var C=m;return Object.prototype.hasOwnProperty.call(C,V)?C[V]:C[V]=I(V)}function f(V,I){this.h=I;for(var C=[],D=!0,x=V.length-1;0<=x;x--){var U=V[x]|0;D&&U==I||(C[x]=U,D=!1)}this.g=C}var m={};function p(V){return-128<=V&&128>V?u(V,function(I){return new f([I|0],0>I?-1:0)}):new f([V|0],0>V?-1:0)}function y(V){if(isNaN(V)||!isFinite(V))return S;if(0>V)return q(y(-V));for(var I=[],C=1,D=0;V>=C;D++)I[D]=V/C|0,C*=4294967296;return new f(I,0)}function T(V,I){if(V.length==0)throw Error("number format error: empty string");if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(V.charAt(0)=="-")return q(T(V.substring(1),I));if(0<=V.indexOf("-"))throw Error('number format error: interior "-" character');for(var C=y(Math.pow(I,8)),D=S,x=0;x<V.length;x+=8){var U=Math.min(8,V.length-x),N=parseInt(V.substring(x,x+U),I);8>U?(U=y(Math.pow(I,U)),D=D.j(U).add(y(N))):(D=D.j(C),D=D.add(y(N)))}return D}var S=p(0),w=p(1),P=p(16777216);i=f.prototype,i.m=function(){if(K(this))return-q(this).m();for(var V=0,I=1,C=0;C<this.g.length;C++){var D=this.i(C);V+=(0<=D?D:4294967296+D)*I,I*=4294967296}return V},i.toString=function(V){if(V=V||10,2>V||36<V)throw Error("radix out of range: "+V);if(k(this))return"0";if(K(this))return"-"+q(this).toString(V);for(var I=y(Math.pow(V,6)),C=this,D="";;){var x=fe(C,I).g;C=ne(C,x.j(I));var U=((0<C.g.length?C.g[0]:C.h)>>>0).toString(V);if(C=x,k(C))return U+D;for(;6>U.length;)U="0"+U;D=U+D}},i.i=function(V){return 0>V?0:V<this.g.length?this.g[V]:this.h};function k(V){if(V.h!=0)return!1;for(var I=0;I<V.g.length;I++)if(V.g[I]!=0)return!1;return!0}function K(V){return V.h==-1}i.l=function(V){return V=ne(this,V),K(V)?-1:k(V)?0:1};function q(V){for(var I=V.g.length,C=[],D=0;D<I;D++)C[D]=~V.g[D];return new f(C,~V.h).add(w)}i.abs=function(){return K(this)?q(this):this},i.add=function(V){for(var I=Math.max(this.g.length,V.g.length),C=[],D=0,x=0;x<=I;x++){var U=D+(this.i(x)&65535)+(V.i(x)&65535),N=(U>>>16)+(this.i(x)>>>16)+(V.i(x)>>>16);D=N>>>16,U&=65535,N&=65535,C[x]=N<<16|U}return new f(C,C[C.length-1]&-2147483648?-1:0)};function ne(V,I){return V.add(q(I))}i.j=function(V){if(k(this)||k(V))return S;if(K(this))return K(V)?q(this).j(q(V)):q(q(this).j(V));if(K(V))return q(this.j(q(V)));if(0>this.l(P)&&0>V.l(P))return y(this.m()*V.m());for(var I=this.g.length+V.g.length,C=[],D=0;D<2*I;D++)C[D]=0;for(D=0;D<this.g.length;D++)for(var x=0;x<V.g.length;x++){var U=this.i(D)>>>16,N=this.i(D)&65535,Pt=V.i(x)>>>16,at=V.i(x)&65535;C[2*D+2*x]+=N*at,se(C,2*D+2*x),C[2*D+2*x+1]+=U*at,se(C,2*D+2*x+1),C[2*D+2*x+1]+=N*Pt,se(C,2*D+2*x+1),C[2*D+2*x+2]+=U*Pt,se(C,2*D+2*x+2)}for(D=0;D<I;D++)C[D]=C[2*D+1]<<16|C[2*D];for(D=I;D<2*I;D++)C[D]=0;return new f(C,0)};function se(V,I){for(;(V[I]&65535)!=V[I];)V[I+1]+=V[I]>>>16,V[I]&=65535,I++}function le(V,I){this.g=V,this.h=I}function fe(V,I){if(k(I))throw Error("division by zero");if(k(V))return new le(S,S);if(K(V))return I=fe(q(V),I),new le(q(I.g),q(I.h));if(K(I))return I=fe(V,q(I)),new le(q(I.g),I.h);if(30<V.g.length){if(K(V)||K(I))throw Error("slowDivide_ only works with positive integers.");for(var C=w,D=I;0>=D.l(V);)C=de(C),D=de(D);var x=Se(C,1),U=Se(D,1);for(D=Se(D,2),C=Se(C,2);!k(D);){var N=U.add(D);0>=N.l(V)&&(x=x.add(C),U=N),D=Se(D,1),C=Se(C,1)}return I=ne(V,x.j(I)),new le(x,I)}for(x=S;0<=V.l(I);){for(C=Math.max(1,Math.floor(V.m()/I.m())),D=Math.ceil(Math.log(C)/Math.LN2),D=48>=D?1:Math.pow(2,D-48),U=y(C),N=U.j(I);K(N)||0<N.l(V);)C-=D,U=y(C),N=U.j(I);k(U)&&(U=w),x=x.add(U),V=ne(V,N)}return new le(x,V)}i.A=function(V){return fe(this,V).h},i.and=function(V){for(var I=Math.max(this.g.length,V.g.length),C=[],D=0;D<I;D++)C[D]=this.i(D)&V.i(D);return new f(C,this.h&V.h)},i.or=function(V){for(var I=Math.max(this.g.length,V.g.length),C=[],D=0;D<I;D++)C[D]=this.i(D)|V.i(D);return new f(C,this.h|V.h)},i.xor=function(V){for(var I=Math.max(this.g.length,V.g.length),C=[],D=0;D<I;D++)C[D]=this.i(D)^V.i(D);return new f(C,this.h^V.h)};function de(V){for(var I=V.g.length+1,C=[],D=0;D<I;D++)C[D]=V.i(D)<<1|V.i(D-1)>>>31;return new f(C,V.h)}function Se(V,I){var C=I>>5;I%=32;for(var D=V.g.length-C,x=[],U=0;U<D;U++)x[U]=0<I?V.i(U+C)>>>I|V.i(U+C+1)<<32-I:V.i(U+C);return new f(x,V.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,uA=s,f.prototype.add=f.prototype.add,f.prototype.multiply=f.prototype.j,f.prototype.modulo=f.prototype.A,f.prototype.compare=f.prototype.l,f.prototype.toNumber=f.prototype.m,f.prototype.toString=f.prototype.toString,f.prototype.getBits=f.prototype.i,f.fromNumber=y,f.fromString=T,Yr=f}).apply(typeof UT<"u"?UT:typeof self<"u"?self:typeof window<"u"?window:{});var Xc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var cA,zl,hA,lh,np,fA,dA,mA;(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(c,g,_){return c==Array.prototype||c==Object.prototype||(c[g]=_.value),c};function n(c){c=[typeof globalThis=="object"&&globalThis,c,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xc=="object"&&Xc];for(var g=0;g<c.length;++g){var _=c[g];if(_&&_.Math==Math)return _}throw Error("Cannot find global object")}var s=n(this);function o(c,g){if(g)e:{var _=s;c=c.split(".");for(var b=0;b<c.length-1;b++){var j=c[b];if(!(j in _))break e;_=_[j]}c=c[c.length-1],b=_[c],g=g(b),g!=b&&g!=null&&e(_,c,{configurable:!0,writable:!0,value:g})}}function u(c,g){c instanceof String&&(c+="");var _=0,b=!1,j={next:function(){if(!b&&_<c.length){var G=_++;return{value:g(G,c[G]),done:!1}}return b=!0,{done:!0,value:void 0}}};return j[Symbol.iterator]=function(){return j},j}o("Array.prototype.values",function(c){return c||function(){return u(this,function(g,_){return _})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var f=f||{},m=this||self;function p(c){var g=typeof c;return g=g!="object"?g:c?Array.isArray(c)?"array":g:"null",g=="array"||g=="object"&&typeof c.length=="number"}function y(c){var g=typeof c;return g=="object"&&c!=null||g=="function"}function T(c,g,_){return c.call.apply(c.bind,arguments)}function S(c,g,_){if(!c)throw Error();if(2<arguments.length){var b=Array.prototype.slice.call(arguments,2);return function(){var j=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(j,b),c.apply(g,j)}}return function(){return c.apply(g,arguments)}}function w(c,g,_){return w=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?T:S,w.apply(null,arguments)}function P(c,g){var _=Array.prototype.slice.call(arguments,1);return function(){var b=_.slice();return b.push.apply(b,arguments),c.apply(this,b)}}function k(c,g){function _(){}_.prototype=g.prototype,c.aa=g.prototype,c.prototype=new _,c.prototype.constructor=c,c.Qb=function(b,j,G){for(var te=Array(arguments.length-2),Ve=2;Ve<arguments.length;Ve++)te[Ve-2]=arguments[Ve];return g.prototype[j].apply(b,te)}}function K(c){const g=c.length;if(0<g){const _=Array(g);for(let b=0;b<g;b++)_[b]=c[b];return _}return[]}function q(c,g){for(let _=1;_<arguments.length;_++){const b=arguments[_];if(p(b)){const j=c.length||0,G=b.length||0;c.length=j+G;for(let te=0;te<G;te++)c[j+te]=b[te]}else c.push(b)}}class ne{constructor(g,_){this.i=g,this.j=_,this.h=0,this.g=null}get(){let g;return 0<this.h?(this.h--,g=this.g,this.g=g.next,g.next=null):g=this.i(),g}}function se(c){return/^[\s\xa0]*$/.test(c)}function le(){var c=m.navigator;return c&&(c=c.userAgent)?c:""}function fe(c){return fe[" "](c),c}fe[" "]=function(){};var de=le().indexOf("Gecko")!=-1&&!(le().toLowerCase().indexOf("webkit")!=-1&&le().indexOf("Edge")==-1)&&!(le().indexOf("Trident")!=-1||le().indexOf("MSIE")!=-1)&&le().indexOf("Edge")==-1;function Se(c,g,_){for(const b in c)g.call(_,c[b],b,c)}function V(c,g){for(const _ in c)g.call(void 0,c[_],_,c)}function I(c){const g={};for(const _ in c)g[_]=c[_];return g}const C="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function D(c,g){let _,b;for(let j=1;j<arguments.length;j++){b=arguments[j];for(_ in b)c[_]=b[_];for(let G=0;G<C.length;G++)_=C[G],Object.prototype.hasOwnProperty.call(b,_)&&(c[_]=b[_])}}function x(c){var g=1;c=c.split(":");const _=[];for(;0<g&&c.length;)_.push(c.shift()),g--;return c.length&&_.push(c.join(":")),_}function U(c){m.setTimeout(()=>{throw c},0)}function N(){var c=ze;let g=null;return c.g&&(g=c.g,c.g=c.g.next,c.g||(c.h=null),g.next=null),g}class Pt{constructor(){this.h=this.g=null}add(g,_){const b=at.get();b.set(g,_),this.h?this.h.next=b:this.g=b,this.h=b}}var at=new ne(()=>new Y,c=>c.reset());class Y{constructor(){this.next=this.g=this.h=null}set(g,_){this.h=g,this.g=_,this.next=null}reset(){this.next=this.g=this.h=null}}let ie,he=!1,ze=new Pt,O=()=>{const c=m.Promise.resolve(void 0);ie=()=>{c.then(J)}};var J=()=>{for(var c;c=N();){try{c.h.call(c.g)}catch(_){U(_)}var g=at;g.j(c),100>g.h&&(g.h++,c.next=g.g,g.g=c)}he=!1};function re(){this.s=this.s,this.C=this.C}re.prototype.s=!1,re.prototype.ma=function(){this.s||(this.s=!0,this.N())},re.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ee(c,g){this.type=c,this.g=this.target=g,this.defaultPrevented=!1}ee.prototype.h=function(){this.defaultPrevented=!0};var pe=function(){if(!m.addEventListener||!Object.defineProperty)return!1;var c=!1,g=Object.defineProperty({},"passive",{get:function(){c=!0}});try{const _=()=>{};m.addEventListener("test",_,g),m.removeEventListener("test",_,g)}catch{}return c}();function Ce(c,g){if(ee.call(this,c?c.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,c){var _=this.type=c.type,b=c.changedTouches&&c.changedTouches.length?c.changedTouches[0]:null;if(this.target=c.target||c.srcElement,this.g=g,g=c.relatedTarget){if(de){e:{try{fe(g.nodeName);var j=!0;break e}catch{}j=!1}j||(g=null)}}else _=="mouseover"?g=c.fromElement:_=="mouseout"&&(g=c.toElement);this.relatedTarget=g,b?(this.clientX=b.clientX!==void 0?b.clientX:b.pageX,this.clientY=b.clientY!==void 0?b.clientY:b.pageY,this.screenX=b.screenX||0,this.screenY=b.screenY||0):(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0),this.button=c.button,this.key=c.key||"",this.ctrlKey=c.ctrlKey,this.altKey=c.altKey,this.shiftKey=c.shiftKey,this.metaKey=c.metaKey,this.pointerId=c.pointerId||0,this.pointerType=typeof c.pointerType=="string"?c.pointerType:Ee[c.pointerType]||"",this.state=c.state,this.i=c,c.defaultPrevented&&Ce.aa.h.call(this)}}k(Ce,ee);var Ee={2:"touch",3:"pen",4:"mouse"};Ce.prototype.h=function(){Ce.aa.h.call(this);var c=this.i;c.preventDefault?c.preventDefault():c.returnValue=!1};var Nt="closure_listenable_"+(1e6*Math.random()|0),We=0;function ti(c,g,_,b,j){this.listener=c,this.proxy=null,this.src=g,this.type=_,this.capture=!!b,this.ha=j,this.key=++We,this.da=this.fa=!1}function ur(c){c.da=!0,c.listener=null,c.proxy=null,c.src=null,c.ha=null}function Ii(c){this.src=c,this.g={},this.h=0}Ii.prototype.add=function(c,g,_,b,j){var G=c.toString();c=this.g[G],c||(c=this.g[G]=[],this.h++);var te=hs(c,g,b,j);return-1<te?(g=c[te],_||(g.fa=!1)):(g=new ti(g,this.src,G,!!b,j),g.fa=_,c.push(g)),g};function cs(c,g){var _=g.type;if(_ in c.g){var b=c.g[_],j=Array.prototype.indexOf.call(b,g,void 0),G;(G=0<=j)&&Array.prototype.splice.call(b,j,1),G&&(ur(g),c.g[_].length==0&&(delete c.g[_],c.h--))}}function hs(c,g,_,b){for(var j=0;j<c.length;++j){var G=c[j];if(!G.da&&G.listener==g&&G.capture==!!_&&G.ha==b)return j}return-1}var fs="closure_lm_"+(1e6*Math.random()|0),Do={};function wu(c,g,_,b,j){if(Array.isArray(g)){for(var G=0;G<g.length;G++)wu(c,g[G],_,b,j);return null}return _=Iu(_),c&&c[Nt]?c.K(g,_,y(b)?!!b.capture:!1,j):Rn(c,g,_,!1,b,j)}function Rn(c,g,_,b,j,G){if(!g)throw Error("Invalid event type");var te=y(j)?!!j.capture:!!j,Ve=ua(c);if(Ve||(c[fs]=Ve=new Ii(c)),_=Ve.add(g,_,b,te,G),_.proxy)return _;if(b=Tf(),_.proxy=b,b.src=c,b.listener=_,c.addEventListener)pe||(j=te),j===void 0&&(j=!1),c.addEventListener(g.toString(),b,j);else if(c.attachEvent)c.attachEvent(ds(g.toString()),b);else if(c.addListener&&c.removeListener)c.addListener(b);else throw Error("addEventListener and attachEvent are unavailable.");return _}function Tf(){function c(_){return g.call(c.src,c.listener,_)}const g=Ef;return c}function Oo(c,g,_,b,j){if(Array.isArray(g))for(var G=0;G<g.length;G++)Oo(c,g[G],_,b,j);else b=y(b)?!!b.capture:!!b,_=Iu(_),c&&c[Nt]?(c=c.i,g=String(g).toString(),g in c.g&&(G=c.g[g],_=hs(G,_,b,j),-1<_&&(ur(G[_]),Array.prototype.splice.call(G,_,1),G.length==0&&(delete c.g[g],c.h--)))):c&&(c=ua(c))&&(g=c.g[g.toString()],c=-1,g&&(c=hs(g,_,b,j)),(_=-1<c?g[c]:null)&&la(_))}function la(c){if(typeof c!="number"&&c&&!c.da){var g=c.src;if(g&&g[Nt])cs(g.i,c);else{var _=c.type,b=c.proxy;g.removeEventListener?g.removeEventListener(_,b,c.capture):g.detachEvent?g.detachEvent(ds(_),b):g.addListener&&g.removeListener&&g.removeListener(b),(_=ua(g))?(cs(_,c),_.h==0&&(_.src=null,g[fs]=null)):ur(c)}}}function ds(c){return c in Do?Do[c]:Do[c]="on"+c}function Ef(c,g){if(c.da)c=!0;else{g=new Ce(g,this);var _=c.listener,b=c.ha||c.src;c.fa&&la(c),c=_.call(b,g)}return c}function ua(c){return c=c[fs],c instanceof Ii?c:null}var Mo="__closure_events_fn_"+(1e9*Math.random()>>>0);function Iu(c){return typeof c=="function"?c:(c[Mo]||(c[Mo]=function(g){return c.handleEvent(g)}),c[Mo])}function ot(){re.call(this),this.i=new Ii(this),this.M=this,this.F=null}k(ot,re),ot.prototype[Nt]=!0,ot.prototype.removeEventListener=function(c,g,_,b){Oo(this,c,g,_,b)};function He(c,g){var _,b=c.F;if(b)for(_=[];b;b=b.F)_.push(b);if(c=c.M,b=g.type||g,typeof g=="string")g=new ee(g,c);else if(g instanceof ee)g.target=g.target||c;else{var j=g;g=new ee(b,c),D(g,j)}if(j=!0,_)for(var G=_.length-1;0<=G;G--){var te=g.g=_[G];j=mn(te,b,!0,g)&&j}if(te=g.g=c,j=mn(te,b,!0,g)&&j,j=mn(te,b,!1,g)&&j,_)for(G=0;G<_.length;G++)te=g.g=_[G],j=mn(te,b,!1,g)&&j}ot.prototype.N=function(){if(ot.aa.N.call(this),this.i){var c=this.i,g;for(g in c.g){for(var _=c.g[g],b=0;b<_.length;b++)ur(_[b]);delete c.g[g],c.h--}}this.F=null},ot.prototype.K=function(c,g,_,b){return this.i.add(String(c),g,!1,_,b)},ot.prototype.L=function(c,g,_,b){return this.i.add(String(c),g,!0,_,b)};function mn(c,g,_,b){if(g=c.i.g[String(g)],!g)return!0;g=g.concat();for(var j=!0,G=0;G<g.length;++G){var te=g[G];if(te&&!te.da&&te.capture==_){var Ve=te.listener,At=te.ha||te.src;te.fa&&cs(c.i,te),j=Ve.call(At,b)!==!1&&j}}return j&&!b.defaultPrevented}function Gt(c,g,_){if(typeof c=="function")_&&(c=w(c,_));else if(c&&typeof c.handleEvent=="function")c=w(c.handleEvent,c);else throw Error("Invalid listener argument");return 2147483647<Number(g)?-1:m.setTimeout(c,g||0)}function Ru(c){c.g=Gt(()=>{c.g=null,c.i&&(c.i=!1,Ru(c))},c.l);const g=c.h;c.h=null,c.m.apply(null,g)}class Af extends re{constructor(g,_){super(),this.m=g,this.l=_,this.h=null,this.i=!1,this.g=null}j(g){this.h=arguments,this.g?this.i=!0:Ru(this)}N(){super.N(),this.g&&(m.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ms(c){re.call(this),this.h=c,this.g={}}k(ms,re);var ps=[];function gs(c){Se(c.g,function(g,_){this.g.hasOwnProperty(_)&&la(g)},c),c.g={}}ms.prototype.N=function(){ms.aa.N.call(this),gs(this)},ms.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Fn=m.JSON.stringify,ca=m.JSON.parse,ys=class{stringify(c){return m.JSON.stringify(c,void 0)}parse(c){return m.JSON.parse(c,void 0)}};function xo(){}xo.prototype.h=null;function Vo(c){return c.h||(c.h=c.i())}function ko(){}var Ri={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ci(){ee.call(this,"d")}k(Ci,ee);function Po(){ee.call(this,"c")}k(Po,ee);var ni={},Uo=null;function cr(){return Uo=Uo||new ot}ni.La="serverreachability";function ha(c){ee.call(this,ni.La,c)}k(ha,ee);function hr(c){const g=cr();He(g,new ha(g))}ni.STAT_EVENT="statevent";function Cu(c,g){ee.call(this,ni.STAT_EVENT,c),this.stat=g}k(Cu,ee);function tt(c){const g=cr();He(g,new Cu(g,c))}ni.Ma="timingevent";function Et(c,g){ee.call(this,ni.Ma,c),this.size=g}k(Et,ee);function pt(c,g){if(typeof c!="function")throw Error("Fn must not be null and must be a function");return m.setTimeout(function(){c()},g)}function Cn(){this.g=!0}Cn.prototype.xa=function(){this.g=!1};function Lo(c,g,_,b,j,G){c.info(function(){if(c.g)if(G)for(var te="",Ve=G.split("&"),At=0;At<Ve.length;At++){var ke=Ve[At].split("=");if(1<ke.length){var Ot=ke[0];ke=ke[1];var bt=Ot.split("_");te=2<=bt.length&&bt[1]=="type"?te+(Ot+"="+ke+"&"):te+(Ot+"=redacted&")}}else te=null;else te=G;return"XMLHTTP REQ ("+b+") [attempt "+j+"]: "+g+`
`+_+`
`+te})}function bf(c,g,_,b,j,G,te){c.info(function(){return"XMLHTTP RESP ("+b+") [ attempt "+j+"]: "+g+`
`+_+`
`+G+" "+te})}function fr(c,g,_,b){c.info(function(){return"XMLHTTP TEXT ("+g+"): "+_s(c,_)+(b?" "+b:"")})}function Nu(c,g){c.info(function(){return"TIMEOUT: "+g})}Cn.prototype.info=function(){};function _s(c,g){if(!c.g)return g;if(!g)return null;try{var _=JSON.parse(g);if(_){for(c=0;c<_.length;c++)if(Array.isArray(_[c])){var b=_[c];if(!(2>b.length)){var j=b[1];if(Array.isArray(j)&&!(1>j.length)){var G=j[0];if(G!="noop"&&G!="stop"&&G!="close")for(var te=1;te<j.length;te++)j[te]=""}}}}return Fn(_)}catch{return g}}var dr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ni={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ii;function ri(){}k(ri,xo),ri.prototype.g=function(){return new XMLHttpRequest},ri.prototype.i=function(){return{}},ii=new ri;function tn(c,g,_,b){this.j=c,this.i=g,this.l=_,this.R=b||1,this.U=new ms(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ct}function ct(){this.i=null,this.g="",this.h=!1}var jo={},fa={};function Hn(c,g,_){c.L=1,c.v=bs(pn(g)),c.m=_,c.P=!0,Di(c,null)}function Di(c,g){c.F=Date.now(),vs(c),c.A=pn(c.v);var _=c.A,b=c.R;Array.isArray(b)||(b=[String(b)]),Go(_.i,"t",b),c.C=0,_=c.j.J,c.h=new ct,c.g=Gu(c.j,_?g:null,!c.m),0<c.O&&(c.M=new Af(w(c.Y,c,c.g),c.O)),g=c.U,_=c.g,b=c.ca;var j="readystatechange";Array.isArray(j)||(j&&(ps[0]=j.toString()),j=ps);for(var G=0;G<j.length;G++){var te=wu(_,j[G],b||g.handleEvent,!1,g.h||g);if(!te)break;g.g[te.key]=te}g=c.H?I(c.H):{},c.m?(c.u||(c.u="POST"),g["Content-Type"]="application/x-www-form-urlencoded",c.g.ea(c.A,c.u,c.m,g)):(c.u="GET",c.g.ea(c.A,c.u,null,g)),hr(),Lo(c.i,c.u,c.A,c.l,c.R,c.m)}tn.prototype.ca=function(c){c=c.target;const g=this.M;g&&Mn(c)==3?g.j():this.Y(c)},tn.prototype.Y=function(c){try{if(c==this.g)e:{const bt=Mn(this.g);var g=this.g.Ba();const Li=this.g.Z();if(!(3>bt)&&(bt!=3||this.g&&(this.h.h||this.g.oa()||Uu(this.g)))){this.J||bt!=4||g==7||(g==8||0>=Li?hr(3):hr(2)),mr(this);var _=this.g.Z();this.X=_;t:if(Du(this)){var b=Uu(this.g);c="";var j=b.length,G=Mn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ut(this),si(this);var te="";break t}this.h.i=new m.TextDecoder}for(g=0;g<j;g++)this.h.h=!0,c+=this.h.i.decode(b[g],{stream:!(G&&g==j-1)});b.length=0,this.h.g+=c,this.C=0,te=this.h.g}else te=this.g.oa();if(this.o=_==200,bf(this.i,this.u,this.A,this.l,this.R,bt,_),this.o){if(this.T&&!this.K){t:{if(this.g){var Ve,At=this.g;if((Ve=At.g?At.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!se(Ve)){var ke=Ve;break t}}ke=null}if(_=ke)fr(this.i,this.l,_,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ts(this,_);else{this.o=!1,this.s=3,tt(12),Ut(this),si(this);break e}}if(this.P){_=!0;let Lt;for(;!this.J&&this.C<te.length;)if(Lt=Ou(this,te),Lt==fa){bt==4&&(this.s=4,tt(14),_=!1),fr(this.i,this.l,null,"[Incomplete Response]");break}else if(Lt==jo){this.s=4,tt(15),fr(this.i,this.l,te,"[Invalid Chunk]"),_=!1;break}else fr(this.i,this.l,Lt,null),Ts(this,Lt);if(Du(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),bt!=4||te.length!=0||this.h.h||(this.s=1,tt(16),_=!1),this.o=this.o&&_,!_)fr(this.i,this.l,te,"[Invalid Chunked Response]"),Ut(this),si(this);else if(0<te.length&&!this.W){this.W=!0;var Ot=this.j;Ot.g==this&&Ot.ba&&!Ot.M&&(Ot.j.info("Great, no buffering proxy detected. Bytes received: "+te.length),Os(Ot),Ot.M=!0,tt(11))}}else fr(this.i,this.l,te,null),Ts(this,te);bt==4&&Ut(this),this.o&&!this.J&&(bt==4?qu(this.j,this):(this.o=!1,vs(this)))}else Cf(this.g),_==400&&0<te.indexOf("Unknown SID")?(this.s=3,tt(12)):(this.s=0,tt(13)),Ut(this),si(this)}}}catch{}finally{}};function Du(c){return c.g?c.u=="GET"&&c.L!=2&&c.j.Ca:!1}function Ou(c,g){var _=c.C,b=g.indexOf(`
`,_);return b==-1?fa:(_=Number(g.substring(_,b)),isNaN(_)?jo:(b+=1,b+_>g.length?fa:(g=g.slice(b,b+_),c.C=b+_,g)))}tn.prototype.cancel=function(){this.J=!0,Ut(this)};function vs(c){c.S=Date.now()+c.I,Mu(c,c.I)}function Mu(c,g){if(c.B!=null)throw Error("WatchDog timer not null");c.B=pt(w(c.ba,c),g)}function mr(c){c.B&&(m.clearTimeout(c.B),c.B=null)}tn.prototype.ba=function(){this.B=null;const c=Date.now();0<=c-this.S?(Nu(this.i,this.A),this.L!=2&&(hr(),tt(17)),Ut(this),this.s=2,si(this)):Mu(this,this.S-c)};function si(c){c.j.G==0||c.J||qu(c.j,c)}function Ut(c){mr(c);var g=c.M;g&&typeof g.ma=="function"&&g.ma(),c.M=null,gs(c.U),c.g&&(g=c.g,c.g=null,g.abort(),g.ma())}function Ts(c,g){try{var _=c.j;if(_.G!=0&&(_.g==c||zo(_.h,c))){if(!c.K&&zo(_.h,c)&&_.G==3){try{var b=_.Da.g.parse(g)}catch{b=null}if(Array.isArray(b)&&b.length==3){var j=b;if(j[0]==0){e:if(!_.u){if(_.g)if(_.g.F+3e3<c.F)Sa(_),Aa(_);else break e;Xo(_),tt(18)}}else _.za=j[1],0<_.za-_.T&&37500>j[2]&&_.F&&_.v==0&&!_.C&&(_.C=pt(w(_.Za,_),6e3));if(1>=ma(_.h)&&_.ca){try{_.ca()}catch{}_.ca=void 0}}else Ui(_,11)}else if((c.K||_.g==c)&&Sa(_),!se(g))for(j=_.Da.g.parse(g),g=0;g<j.length;g++){let ke=j[g];if(_.T=ke[0],ke=ke[1],_.G==2)if(ke[0]=="c"){_.K=ke[1],_.ia=ke[2];const Ot=ke[3];Ot!=null&&(_.la=Ot,_.j.info("VER="+_.la));const bt=ke[4];bt!=null&&(_.Aa=bt,_.j.info("SVER="+_.Aa));const Li=ke[5];Li!=null&&typeof Li=="number"&&0<Li&&(b=1.5*Li,_.L=b,_.j.info("backChannelRequestTimeoutMs_="+b)),b=_;const Lt=c.g;if(Lt){const fi=Lt.g?Lt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(fi){var G=b.h;G.g||fi.indexOf("spdy")==-1&&fi.indexOf("quic")==-1&&fi.indexOf("h2")==-1||(G.j=G.l,G.g=new Set,G.h&&(pa(G,G.h),G.h=null))}if(b.D){const Wo=Lt.g?Lt.g.getResponseHeader("X-HTTP-Session-Id"):null;Wo&&(b.ya=Wo,Ye(b.I,b.D,Wo))}}_.G=3,_.l&&_.l.ua(),_.ba&&(_.R=Date.now()-c.F,_.j.info("Handshake RTT: "+_.R+"ms")),b=_;var te=c;if(b.qa=Hu(b,b.J?b.ia:null,b.W),te.K){nn(b.h,te);var Ve=te,At=b.L;At&&(Ve.I=At),Ve.B&&(mr(Ve),vs(Ve)),b.g=te}else zu(b);0<_.i.length&&ba(_)}else ke[0]!="stop"&&ke[0]!="close"||Ui(_,7);else _.G==3&&(ke[0]=="stop"||ke[0]=="close"?ke[0]=="stop"?Ui(_,7):Qo(_):ke[0]!="noop"&&_.l&&_.l.ta(ke),_.v=0)}}hr(4)}catch{}}var xu=class{constructor(c,g){this.g=c,this.map=g}};function Oi(c){this.l=c||10,m.PerformanceNavigationTiming?(c=m.performance.getEntriesByType("navigation"),c=0<c.length&&(c[0].nextHopProtocol=="hq"||c[0].nextHopProtocol=="h2")):c=!!(m.chrome&&m.chrome.loadTimes&&m.chrome.loadTimes()&&m.chrome.loadTimes().wasFetchedViaSpdy),this.j=c?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function da(c){return c.h?!0:c.g?c.g.size>=c.j:!1}function ma(c){return c.h?1:c.g?c.g.size:0}function zo(c,g){return c.h?c.h==g:c.g?c.g.has(g):!1}function pa(c,g){c.g?c.g.add(g):c.h=g}function nn(c,g){c.h&&c.h==g?c.h=null:c.g&&c.g.has(g)&&c.g.delete(g)}Oi.prototype.cancel=function(){if(this.i=Bo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const c of this.g.values())c.cancel();this.g.clear()}};function Bo(c){if(c.h!=null)return c.i.concat(c.h.D);if(c.g!=null&&c.g.size!==0){let g=c.i;for(const _ of c.g.values())g=g.concat(_.D);return g}return K(c.i)}function Sf(c){if(c.V&&typeof c.V=="function")return c.V();if(typeof Map<"u"&&c instanceof Map||typeof Set<"u"&&c instanceof Set)return Array.from(c.values());if(typeof c=="string")return c.split("");if(p(c)){for(var g=[],_=c.length,b=0;b<_;b++)g.push(c[b]);return g}g=[],_=0;for(b in c)g[_++]=c[b];return g}function ga(c){if(c.na&&typeof c.na=="function")return c.na();if(!c.V||typeof c.V!="function"){if(typeof Map<"u"&&c instanceof Map)return Array.from(c.keys());if(!(typeof Set<"u"&&c instanceof Set)){if(p(c)||typeof c=="string"){var g=[];c=c.length;for(var _=0;_<c;_++)g.push(_);return g}g=[],_=0;for(const b in c)g[_++]=b;return g}}}function qo(c,g){if(c.forEach&&typeof c.forEach=="function")c.forEach(g,void 0);else if(p(c)||typeof c=="string")Array.prototype.forEach.call(c,g,void 0);else for(var _=ga(c),b=Sf(c),j=b.length,G=0;G<j;G++)g.call(void 0,b[G],_&&_[G],c)}var Es=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function wf(c,g){if(c){c=c.split("&");for(var _=0;_<c.length;_++){var b=c[_].indexOf("="),j=null;if(0<=b){var G=c[_].substring(0,b);j=c[_].substring(b+1)}else G=c[_];g(G,j?decodeURIComponent(j.replace(/\+/g," ")):"")}}}function gt(c){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,c instanceof gt){this.h=c.h,As(this,c.j),this.o=c.o,this.g=c.g,pr(this,c.s),this.l=c.l;var g=c.i,_=new xi;_.i=g.i,g.g&&(_.g=new Map(g.g),_.h=g.h),Mi(this,_),this.m=c.m}else c&&(g=String(c).match(Es))?(this.h=!1,As(this,g[1]||"",!0),this.o=Nn(g[2]||""),this.g=Nn(g[3]||"",!0),pr(this,g[4]),this.l=Nn(g[5]||"",!0),Mi(this,g[6]||"",!0),this.m=Nn(g[7]||"")):(this.h=!1,this.i=new xi(null,this.h))}gt.prototype.toString=function(){var c=[],g=this.j;g&&c.push(Ss(g,Fo,!0),":");var _=this.g;return(_||g=="file")&&(c.push("//"),(g=this.o)&&c.push(Ss(g,Fo,!0),"@"),c.push(encodeURIComponent(String(_)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),_=this.s,_!=null&&c.push(":",String(_))),(_=this.l)&&(this.g&&_.charAt(0)!="/"&&c.push("/"),c.push(Ss(_,_.charAt(0)=="/"?If:Ho,!0))),(_=this.i.toString())&&c.push("?",_),(_=this.m)&&c.push("#",Ss(_,ya)),c.join("")};function pn(c){return new gt(c)}function As(c,g,_){c.j=_?Nn(g,!0):g,c.j&&(c.j=c.j.replace(/:$/,""))}function pr(c,g){if(g){if(g=Number(g),isNaN(g)||0>g)throw Error("Bad port number "+g);c.s=g}else c.s=null}function Mi(c,g,_){g instanceof xi?(c.i=g,ku(c.i,c.h)):(_||(g=Ss(g,Rf)),c.i=new xi(g,c.h))}function Ye(c,g,_){c.i.set(g,_)}function bs(c){return Ye(c,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),c}function Nn(c,g){return c?g?decodeURI(c.replace(/%25/g,"%2525")):decodeURIComponent(c):""}function Ss(c,g,_){return typeof c=="string"?(c=encodeURI(c).replace(g,Vu),_&&(c=c.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c):null}function Vu(c){return c=c.charCodeAt(0),"%"+(c>>4&15).toString(16)+(c&15).toString(16)}var Fo=/[#\/\?@]/g,Ho=/[#\?:]/g,If=/[#\?]/g,Rf=/[#\?@]/g,ya=/#/g;function xi(c,g){this.h=this.g=null,this.i=c||null,this.j=!!g}function Dn(c){c.g||(c.g=new Map,c.h=0,c.i&&wf(c.i,function(g,_){c.add(decodeURIComponent(g.replace(/\+/g," ")),_)}))}i=xi.prototype,i.add=function(c,g){Dn(this),this.i=null,c=ai(this,c);var _=this.g.get(c);return _||this.g.set(c,_=[]),_.push(g),this.h+=1,this};function Vi(c,g){Dn(c),g=ai(c,g),c.g.has(g)&&(c.i=null,c.h-=c.g.get(g).length,c.g.delete(g))}function ki(c,g){return Dn(c),g=ai(c,g),c.g.has(g)}i.forEach=function(c,g){Dn(this),this.g.forEach(function(_,b){_.forEach(function(j){c.call(g,j,b,this)},this)},this)},i.na=function(){Dn(this);const c=Array.from(this.g.values()),g=Array.from(this.g.keys()),_=[];for(let b=0;b<g.length;b++){const j=c[b];for(let G=0;G<j.length;G++)_.push(g[b])}return _},i.V=function(c){Dn(this);let g=[];if(typeof c=="string")ki(this,c)&&(g=g.concat(this.g.get(ai(this,c))));else{c=Array.from(this.g.values());for(let _=0;_<c.length;_++)g=g.concat(c[_])}return g},i.set=function(c,g){return Dn(this),this.i=null,c=ai(this,c),ki(this,c)&&(this.h-=this.g.get(c).length),this.g.set(c,[g]),this.h+=1,this},i.get=function(c,g){return c?(c=this.V(c),0<c.length?String(c[0]):g):g};function Go(c,g,_){Vi(c,g),0<_.length&&(c.i=null,c.g.set(ai(c,g),K(_)),c.h+=_.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const c=[],g=Array.from(this.g.keys());for(var _=0;_<g.length;_++){var b=g[_];const G=encodeURIComponent(String(b)),te=this.V(b);for(b=0;b<te.length;b++){var j=G;te[b]!==""&&(j+="="+encodeURIComponent(String(te[b]))),c.push(j)}}return this.i=c.join("&")};function ai(c,g){return g=String(g),c.j&&(g=g.toLowerCase()),g}function ku(c,g){g&&!c.j&&(Dn(c),c.i=null,c.g.forEach(function(_,b){var j=b.toLowerCase();b!=j&&(Vi(this,b),Go(this,j,_))},c)),c.j=g}function ws(c,g){const _=new Cn;if(m.Image){const b=new Image;b.onload=P(On,_,"TestLoadImage: loaded",!0,g,b),b.onerror=P(On,_,"TestLoadImage: error",!1,g,b),b.onabort=P(On,_,"TestLoadImage: abort",!1,g,b),b.ontimeout=P(On,_,"TestLoadImage: timeout",!1,g,b),m.setTimeout(function(){b.ontimeout&&b.ontimeout()},1e4),b.src=c}else g(!1)}function Gn(c,g){const _=new Cn,b=new AbortController,j=setTimeout(()=>{b.abort(),On(_,"TestPingServer: timeout",!1,g)},1e4);fetch(c,{signal:b.signal}).then(G=>{clearTimeout(j),G.ok?On(_,"TestPingServer: ok",!0,g):On(_,"TestPingServer: server error",!1,g)}).catch(()=>{clearTimeout(j),On(_,"TestPingServer: error",!1,g)})}function On(c,g,_,b,j){try{j&&(j.onload=null,j.onerror=null,j.onabort=null,j.ontimeout=null),b(_)}catch{}}function Is(){this.g=new ys}function oi(c,g,_){const b=_||"";try{qo(c,function(j,G){let te=j;y(j)&&(te=Fn(j)),g.push(b+G+"="+encodeURIComponent(te))})}catch(j){throw g.push(b+"type="+encodeURIComponent("_badmap")),j}}function gr(c){this.l=c.Ub||null,this.j=c.eb||!1}k(gr,xo),gr.prototype.g=function(){return new Pi(this.l,this.j)},gr.prototype.i=function(c){return function(){return c}}({});function Pi(c,g){ot.call(this),this.D=c,this.o=g,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(Pi,ot),i=Pi.prototype,i.open=function(c,g){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=c,this.A=g,this.readyState=1,ui(this)},i.send=function(c){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const g={headers:this.u,method:this.B,credentials:this.m,cache:void 0};c&&(g.body=c),(this.D||m).fetch(new Request(this.A,g)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,li(this)),this.readyState=0},i.Sa=function(c){if(this.g&&(this.l=c,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=c.headers,this.readyState=2,ui(this)),this.g&&(this.readyState=3,ui(this),this.g)))if(this.responseType==="arraybuffer")c.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof m.ReadableStream<"u"&&"body"in c){if(this.j=c.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ko(this)}else c.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ko(c){c.j.read().then(c.Pa.bind(c)).catch(c.ga.bind(c))}i.Pa=function(c){if(this.g){if(this.o&&c.value)this.response.push(c.value);else if(!this.o){var g=c.value?c.value:new Uint8Array(0);(g=this.v.decode(g,{stream:!c.done}))&&(this.response=this.responseText+=g)}c.done?li(this):ui(this),this.readyState==3&&Ko(this)}},i.Ra=function(c){this.g&&(this.response=this.responseText=c,li(this))},i.Qa=function(c){this.g&&(this.response=c,li(this))},i.ga=function(){this.g&&li(this)};function li(c){c.readyState=4,c.l=null,c.j=null,c.v=null,ui(c)}i.setRequestHeader=function(c,g){this.u.append(c,g)},i.getResponseHeader=function(c){return this.h&&this.h.get(c.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const c=[],g=this.h.entries();for(var _=g.next();!_.done;)_=_.value,c.push(_[0]+": "+_[1]),_=g.next();return c.join(`\r
`)};function ui(c){c.onreadystatechange&&c.onreadystatechange.call(c)}Object.defineProperty(Pi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(c){this.m=c?"include":"same-origin"}});function Yo(c){let g="";return Se(c,function(_,b){g+=b,g+=":",g+=_,g+=`\r
`}),g}function Dt(c,g,_){e:{for(b in _){var b=!1;break e}b=!0}b||(_=Yo(_),typeof c=="string"?_!=null&&encodeURIComponent(String(_)):Ye(c,g,_))}function qe(c){ot.call(this),this.headers=new Map,this.o=c||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(qe,ot);var _a=/^https?$/i,Rs=["POST","PUT"];i=qe.prototype,i.Ha=function(c){this.J=c},i.ea=function(c,g,_,b){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+c);g=g?g.toUpperCase():"GET",this.D=c,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ii.g(),this.v=this.o?Vo(this.o):Vo(ii),this.g.onreadystatechange=w(this.Ea,this);try{this.B=!0,this.g.open(g,String(c),!0),this.B=!1}catch(G){Pu(this,G);return}if(c=_||"",_=new Map(this.headers),b)if(Object.getPrototypeOf(b)===Object.prototype)for(var j in b)_.set(j,b[j]);else if(typeof b.keys=="function"&&typeof b.get=="function")for(const G of b.keys())_.set(G,b.get(G));else throw Error("Unknown input type for opt_headers: "+String(b));b=Array.from(_.keys()).find(G=>G.toLowerCase()=="content-type"),j=m.FormData&&c instanceof m.FormData,!(0<=Array.prototype.indexOf.call(Rs,g,void 0))||b||j||_.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[G,te]of _)this.g.setRequestHeader(G,te);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Cs(this),this.u=!0,this.g.send(c),this.u=!1}catch(G){Pu(this,G)}};function Pu(c,g){c.h=!1,c.g&&(c.j=!0,c.g.abort(),c.j=!1),c.l=g,c.m=5,va(c),ci(c)}function va(c){c.A||(c.A=!0,He(c,"complete"),He(c,"error"))}i.abort=function(c){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=c||7,He(this,"complete"),He(this,"abort"),ci(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ci(this,!0)),qe.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?Ta(this):this.bb())},i.bb=function(){Ta(this)};function Ta(c){if(c.h&&typeof f<"u"&&(!c.v[1]||Mn(c)!=4||c.Z()!=2)){if(c.u&&Mn(c)==4)Gt(c.Ea,0,c);else if(He(c,"readystatechange"),Mn(c)==4){c.h=!1;try{const te=c.Z();e:switch(te){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var g=!0;break e;default:g=!1}var _;if(!(_=g)){var b;if(b=te===0){var j=String(c.D).match(Es)[1]||null;!j&&m.self&&m.self.location&&(j=m.self.location.protocol.slice(0,-1)),b=!_a.test(j?j.toLowerCase():"")}_=b}if(_)He(c,"complete"),He(c,"success");else{c.m=6;try{var G=2<Mn(c)?c.g.statusText:""}catch{G=""}c.l=G+" ["+c.Z()+"]",va(c)}}finally{ci(c)}}}}function ci(c,g){if(c.g){Cs(c);const _=c.g,b=c.v[0]?()=>{}:null;c.g=null,c.v=null,g||He(c,"ready");try{_.onreadystatechange=b}catch{}}}function Cs(c){c.I&&(m.clearTimeout(c.I),c.I=null)}i.isActive=function(){return!!this.g};function Mn(c){return c.g?c.g.readyState:0}i.Z=function(){try{return 2<Mn(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(c){if(this.g){var g=this.g.responseText;return c&&g.indexOf(c)==0&&(g=g.substring(c.length)),ca(g)}};function Uu(c){try{if(!c.g)return null;if("response"in c.g)return c.g.response;switch(c.H){case"":case"text":return c.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in c.g)return c.g.mozResponseArrayBuffer}return null}catch{return null}}function Cf(c){const g={};c=(c.g&&2<=Mn(c)&&c.g.getAllResponseHeaders()||"").split(`\r
`);for(let b=0;b<c.length;b++){if(se(c[b]))continue;var _=x(c[b]);const j=_[0];if(_=_[1],typeof _!="string")continue;_=_.trim();const G=g[j]||[];g[j]=G,G.push(_)}V(g,function(b){return b.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ns(c,g,_){return _&&_.internalChannelParams&&_.internalChannelParams[c]||g}function Ea(c){this.Aa=0,this.i=[],this.j=new Cn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ns("failFast",!1,c),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ns("baseRetryDelayMs",5e3,c),this.cb=Ns("retryDelaySeedMs",1e4,c),this.Wa=Ns("forwardChannelMaxRetries",2,c),this.wa=Ns("forwardChannelRequestTimeoutMs",2e4,c),this.pa=c&&c.xmlHttpFactory||void 0,this.Xa=c&&c.Tb||void 0,this.Ca=c&&c.useFetchStreams||!1,this.L=void 0,this.J=c&&c.supportsCrossDomainXhr||!1,this.K="",this.h=new Oi(c&&c.concurrentRequestLimit),this.Da=new Is,this.P=c&&c.fastHandshake||!1,this.O=c&&c.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=c&&c.Rb||!1,c&&c.xa&&this.j.xa(),c&&c.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&c&&c.detectBufferingProxy||!1,this.ja=void 0,c&&c.longPollingTimeout&&0<c.longPollingTimeout&&(this.ja=c.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Ea.prototype,i.la=8,i.G=1,i.connect=function(c,g,_,b){tt(0),this.W=c,this.H=g||{},_&&b!==void 0&&(this.H.OSID=_,this.H.OAID=b),this.F=this.X,this.I=Hu(this,null,this.W),ba(this)};function Qo(c){if(Lu(c),c.G==3){var g=c.U++,_=pn(c.I);if(Ye(_,"SID",c.K),Ye(_,"RID",g),Ye(_,"TYPE","terminate"),Ds(c,_),g=new tn(c,c.j,g),g.L=2,g.v=bs(pn(_)),_=!1,m.navigator&&m.navigator.sendBeacon)try{_=m.navigator.sendBeacon(g.v.toString(),"")}catch{}!_&&m.Image&&(new Image().src=g.v,_=!0),_||(g.g=Gu(g.j,null),g.g.ea(g.v)),g.F=Date.now(),vs(g)}Fu(c)}function Aa(c){c.g&&(Os(c),c.g.cancel(),c.g=null)}function Lu(c){Aa(c),c.u&&(m.clearTimeout(c.u),c.u=null),Sa(c),c.h.cancel(),c.s&&(typeof c.s=="number"&&m.clearTimeout(c.s),c.s=null)}function ba(c){if(!da(c.h)&&!c.s){c.s=!0;var g=c.Ga;ie||O(),he||(ie(),he=!0),ze.add(g,c),c.B=0}}function Nf(c,g){return ma(c.h)>=c.h.j-(c.s?1:0)?!1:c.s?(c.i=g.D.concat(c.i),!0):c.G==1||c.G==2||c.B>=(c.Va?0:c.Wa)?!1:(c.s=pt(w(c.Ga,c,g),Zo(c,c.B)),c.B++,!0)}i.Ga=function(c){if(this.s)if(this.s=null,this.G==1){if(!c){this.U=Math.floor(1e5*Math.random()),c=this.U++;const j=new tn(this,this.j,c);let G=this.o;if(this.S&&(G?(G=I(G),D(G,this.S)):G=this.S),this.m!==null||this.O||(j.H=G,G=null),this.P)e:{for(var g=0,_=0;_<this.i.length;_++){t:{var b=this.i[_];if("__data__"in b.map&&(b=b.map.__data__,typeof b=="string")){b=b.length;break t}b=void 0}if(b===void 0)break;if(g+=b,4096<g){g=_;break e}if(g===4096||_===this.i.length-1){g=_+1;break e}}g=1e3}else g=1e3;g=ju(this,j,g),_=pn(this.I),Ye(_,"RID",c),Ye(_,"CVER",22),this.D&&Ye(_,"X-HTTP-Session-Id",this.D),Ds(this,_),G&&(this.O?g="headers="+encodeURIComponent(String(Yo(G)))+"&"+g:this.m&&Dt(_,this.m,G)),pa(this.h,j),this.Ua&&Ye(_,"TYPE","init"),this.P?(Ye(_,"$req",g),Ye(_,"SID","null"),j.T=!0,Hn(j,_,null)):Hn(j,_,g),this.G=2}}else this.G==3&&(c?$o(this,c):this.i.length==0||da(this.h)||$o(this))};function $o(c,g){var _;g?_=g.l:_=c.U++;const b=pn(c.I);Ye(b,"SID",c.K),Ye(b,"RID",_),Ye(b,"AID",c.T),Ds(c,b),c.m&&c.o&&Dt(b,c.m,c.o),_=new tn(c,c.j,_,c.B+1),c.m===null&&(_.H=c.o),g&&(c.i=g.D.concat(c.i)),g=ju(c,_,1e3),_.I=Math.round(.5*c.wa)+Math.round(.5*c.wa*Math.random()),pa(c.h,_),Hn(_,b,g)}function Ds(c,g){c.H&&Se(c.H,function(_,b){Ye(g,b,_)}),c.l&&qo({},function(_,b){Ye(g,b,_)})}function ju(c,g,_){_=Math.min(c.i.length,_);var b=c.l?w(c.l.Na,c.l,c):null;e:{var j=c.i;let G=-1;for(;;){const te=["count="+_];G==-1?0<_?(G=j[0].g,te.push("ofs="+G)):G=0:te.push("ofs="+G);let Ve=!0;for(let At=0;At<_;At++){let ke=j[At].g;const Ot=j[At].map;if(ke-=G,0>ke)G=Math.max(0,j[At].g-100),Ve=!1;else try{oi(Ot,te,"req"+ke+"_")}catch{b&&b(Ot)}}if(Ve){b=te.join("&");break e}}}return c=c.i.splice(0,_),g.D=c,b}function zu(c){if(!c.g&&!c.u){c.Y=1;var g=c.Fa;ie||O(),he||(ie(),he=!0),ze.add(g,c),c.v=0}}function Xo(c){return c.g||c.u||3<=c.v?!1:(c.Y++,c.u=pt(w(c.Fa,c),Zo(c,c.v)),c.v++,!0)}i.Fa=function(){if(this.u=null,Bu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var c=2*this.R;this.j.info("BP detection timer enabled: "+c),this.A=pt(w(this.ab,this),c)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,tt(10),Aa(this),Bu(this))};function Os(c){c.A!=null&&(m.clearTimeout(c.A),c.A=null)}function Bu(c){c.g=new tn(c,c.j,"rpc",c.Y),c.m===null&&(c.g.H=c.o),c.g.O=0;var g=pn(c.qa);Ye(g,"RID","rpc"),Ye(g,"SID",c.K),Ye(g,"AID",c.T),Ye(g,"CI",c.F?"0":"1"),!c.F&&c.ja&&Ye(g,"TO",c.ja),Ye(g,"TYPE","xmlhttp"),Ds(c,g),c.m&&c.o&&Dt(g,c.m,c.o),c.L&&(c.g.I=c.L);var _=c.g;c=c.ia,_.L=1,_.v=bs(pn(g)),_.m=null,_.P=!0,Di(_,c)}i.Za=function(){this.C!=null&&(this.C=null,Aa(this),Xo(this),tt(19))};function Sa(c){c.C!=null&&(m.clearTimeout(c.C),c.C=null)}function qu(c,g){var _=null;if(c.g==g){Sa(c),Os(c),c.g=null;var b=2}else if(zo(c.h,g))_=g.D,nn(c.h,g),b=1;else return;if(c.G!=0){if(g.o)if(b==1){_=g.m?g.m.length:0,g=Date.now()-g.F;var j=c.B;b=cr(),He(b,new Et(b,_)),ba(c)}else zu(c);else if(j=g.s,j==3||j==0&&0<g.X||!(b==1&&Nf(c,g)||b==2&&Xo(c)))switch(_&&0<_.length&&(g=c.h,g.i=g.i.concat(_)),j){case 1:Ui(c,5);break;case 4:Ui(c,10);break;case 3:Ui(c,6);break;default:Ui(c,2)}}}function Zo(c,g){let _=c.Ta+Math.floor(Math.random()*c.cb);return c.isActive()||(_*=2),_*g}function Ui(c,g){if(c.j.info("Error code "+g),g==2){var _=w(c.fb,c),b=c.Xa;const j=!b;b=new gt(b||"//www.google.com/images/cleardot.gif"),m.location&&m.location.protocol=="http"||As(b,"https"),bs(b),j?ws(b.toString(),_):Gn(b.toString(),_)}else tt(2);c.G=0,c.l&&c.l.sa(g),Fu(c),Lu(c)}i.fb=function(c){c?(this.j.info("Successfully pinged google.com"),tt(2)):(this.j.info("Failed to ping google.com"),tt(1))};function Fu(c){if(c.G=0,c.ka=[],c.l){const g=Bo(c.h);(g.length!=0||c.i.length!=0)&&(q(c.ka,g),q(c.ka,c.i),c.h.i.length=0,K(c.i),c.i.length=0),c.l.ra()}}function Hu(c,g,_){var b=_ instanceof gt?pn(_):new gt(_);if(b.g!="")g&&(b.g=g+"."+b.g),pr(b,b.s);else{var j=m.location;b=j.protocol,g=g?g+"."+j.hostname:j.hostname,j=+j.port;var G=new gt(null);b&&As(G,b),g&&(G.g=g),j&&pr(G,j),_&&(G.l=_),b=G}return _=c.D,g=c.ya,_&&g&&Ye(b,_,g),Ye(b,"VER",c.la),Ds(c,b),b}function Gu(c,g,_){if(g&&!c.J)throw Error("Can't create secondary domain capable XhrIo object.");return g=c.Ca&&!c.pa?new qe(new gr({eb:_})):new qe(c.pa),g.Ha(c.J),g}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ku(){}i=Ku.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function wa(){}wa.prototype.g=function(c,g){return new rn(c,g)};function rn(c,g){ot.call(this),this.g=new Ea(g),this.l=c,this.h=g&&g.messageUrlParams||null,c=g&&g.messageHeaders||null,g&&g.clientProtocolHeaderRequired&&(c?c["X-Client-Protocol"]="webchannel":c={"X-Client-Protocol":"webchannel"}),this.g.o=c,c=g&&g.initMessageHeaders||null,g&&g.messageContentType&&(c?c["X-WebChannel-Content-Type"]=g.messageContentType:c={"X-WebChannel-Content-Type":g.messageContentType}),g&&g.va&&(c?c["X-WebChannel-Client-Profile"]=g.va:c={"X-WebChannel-Client-Profile":g.va}),this.g.S=c,(c=g&&g.Sb)&&!se(c)&&(this.g.m=c),this.v=g&&g.supportsCrossDomainXhr||!1,this.u=g&&g.sendRawJson||!1,(g=g&&g.httpSessionIdParam)&&!se(g)&&(this.g.D=g,c=this.h,c!==null&&g in c&&(c=this.h,g in c&&delete c[g])),this.j=new hi(this)}k(rn,ot),rn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},rn.prototype.close=function(){Qo(this.g)},rn.prototype.o=function(c){var g=this.g;if(typeof c=="string"){var _={};_.__data__=c,c=_}else this.u&&(_={},_.__data__=Fn(c),c=_);g.i.push(new xu(g.Ya++,c)),g.G==3&&ba(g)},rn.prototype.N=function(){this.g.l=null,delete this.j,Qo(this.g),delete this.g,rn.aa.N.call(this)};function Yu(c){Ci.call(this),c.__headers__&&(this.headers=c.__headers__,this.statusCode=c.__status__,delete c.__headers__,delete c.__status__);var g=c.__sm__;if(g){e:{for(const _ in g){c=_;break e}c=void 0}(this.i=c)&&(c=this.i,g=g!==null&&c in g?g[c]:void 0),this.data=g}else this.data=c}k(Yu,Ci);function Qu(){Po.call(this),this.status=1}k(Qu,Po);function hi(c){this.g=c}k(hi,Ku),hi.prototype.ua=function(){He(this.g,"a")},hi.prototype.ta=function(c){He(this.g,new Yu(c))},hi.prototype.sa=function(c){He(this.g,new Qu)},hi.prototype.ra=function(){He(this.g,"b")},wa.prototype.createWebChannel=wa.prototype.g,rn.prototype.send=rn.prototype.o,rn.prototype.open=rn.prototype.m,rn.prototype.close=rn.prototype.close,mA=function(){return new wa},dA=function(){return cr()},fA=ni,np={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},dr.NO_ERROR=0,dr.TIMEOUT=8,dr.HTTP_ERROR=6,lh=dr,Ni.COMPLETE="complete",hA=Ni,ko.EventType=Ri,Ri.OPEN="a",Ri.CLOSE="b",Ri.ERROR="c",Ri.MESSAGE="d",ot.prototype.listen=ot.prototype.K,zl=ko,qe.prototype.listenOnce=qe.prototype.L,qe.prototype.getLastError=qe.prototype.Ka,qe.prototype.getLastErrorCode=qe.prototype.Ba,qe.prototype.getStatus=qe.prototype.Z,qe.prototype.getResponseJson=qe.prototype.Oa,qe.prototype.getResponseText=qe.prototype.oa,qe.prototype.send=qe.prototype.ea,qe.prototype.setWithCredentials=qe.prototype.Ha,cA=qe}).apply(typeof Xc<"u"?Xc:typeof self<"u"?self:typeof window<"u"?window:{});const LT="@firebase/firestore",jT="4.7.17";/**
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
 */class $t{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}$t.UNAUTHENTICATED=new $t(null),$t.GOOGLE_CREDENTIALS=new $t("google-credentials-uid"),$t.FIRST_PARTY=new $t("first-party-uid"),$t.MOCK_USER=new $t("mock-user");/**
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
 */let So="11.9.0";/**
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
 */const ea=new fu("@firebase/firestore");function eo(){return ea.logLevel}function ae(i,...e){if(ea.logLevel<=Me.DEBUG){const n=e.map(qp);ea.debug(`Firestore (${So}): ${i}`,...n)}}function sr(i,...e){if(ea.logLevel<=Me.ERROR){const n=e.map(qp);ea.error(`Firestore (${So}): ${i}`,...n)}}function po(i,...e){if(ea.logLevel<=Me.WARN){const n=e.map(qp);ea.warn(`Firestore (${So}): ${i}`,...n)}}function qp(i){if(typeof i=="string")return i;try{/**
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
*/return function(n){return JSON.stringify(n)}(i)}catch{return i}}/**
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
 */function _e(i,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,pA(i,s,n)}function pA(i,e,n){let s=`FIRESTORE (${So}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(n!==void 0)try{s+=" CONTEXT: "+JSON.stringify(n)}catch{s+=" CONTEXT: "+n}throw sr(s),new Error(s)}function Fe(i,e,n,s){let o="Unexpected state";typeof n=="string"?o=n:s=n,i||pA(e,o,s)}function be(i,e){return i}/**
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
 */const Z={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class oe extends qn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class er{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
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
 */class gA{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class lN{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n($t.UNAUTHENTICATED))}shutdown(){}}class uN{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class cN{constructor(e){this.t=e,this.currentUser=$t.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Fe(this.o===void 0,42304);let s=this.i;const o=p=>this.i!==s?(s=this.i,n(p)):Promise.resolve();let u=new er;this.o=()=>{this.i++,this.currentUser=this.u(),u.resolve(),u=new er,e.enqueueRetryable(()=>o(this.currentUser))};const f=()=>{const p=u;e.enqueueRetryable(async()=>{await p.promise,await o(this.currentUser)})},m=p=>{ae("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=p,this.o&&(this.auth.addAuthTokenListener(this.o),f())};this.t.onInit(p=>m(p)),setTimeout(()=>{if(!this.auth){const p=this.t.getImmediate({optional:!0});p?m(p):(ae("FirebaseAuthCredentialsProvider","Auth not yet detected"),u.resolve(),u=new er)}},0),f()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==e?(ae("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Fe(typeof s.accessToken=="string",31837,{l:s}),new gA(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Fe(e===null||typeof e=="string",2055,{h:e}),new $t(e)}}class hN{constructor(e,n,s){this.P=e,this.T=n,this.I=s,this.type="FirstParty",this.user=$t.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class fN{constructor(e,n,s){this.P=e,this.T=n,this.I=s}getToken(){return Promise.resolve(new hN(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n($t.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class zT{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class dN{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Zn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){Fe(this.o===void 0,3512);const s=u=>{u.error!=null&&ae("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${u.error.message}`);const f=u.token!==this.m;return this.m=u.token,ae("FirebaseAppCheckTokenProvider",`Received ${f?"new":"existing"} token.`),f?n(u.token):Promise.resolve()};this.o=u=>{e.enqueueRetryable(()=>s(u))};const o=u=>{ae("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=u,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(u=>o(u)),setTimeout(()=>{if(!this.appCheck){const u=this.V.getImmediate({optional:!0});u?o(u):ae("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new zT(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Fe(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new zT(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function mN(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<i;s++)n[s]=Math.floor(256*Math.random());return n}/**
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
 */function yA(){return new TextEncoder}/**
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
 */class _A{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=mN(40);for(let u=0;u<o.length;++u)s.length<20&&o[u]<n&&(s+=e.charAt(o[u]%62))}return s}}function Re(i,e){return i<e?-1:i>e?1:0}function ip(i,e){let n=0;for(;n<i.length&&n<e.length;){const s=i.codePointAt(n),o=e.codePointAt(n);if(s!==o){if(s<128&&o<128)return Re(s,o);{const u=yA(),f=pN(u.encode(BT(i,n)),u.encode(BT(e,n)));return f!==0?f:Re(s,o)}}n+=s>65535?2:1}return Re(i.length,e.length)}function BT(i,e){return i.codePointAt(e)>65535?i.substring(e,e+2):i.substring(e,e+1)}function pN(i,e){for(let n=0;n<i.length&&n<e.length;++n)if(i[n]!==e[n])return Re(i[n],e[n]);return Re(i.length,e.length)}function go(i,e,n){return i.length===e.length&&i.every((s,o)=>n(s,e[o]))}/**
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
 */const qT=-62135596800,FT=1e6;class It{static now(){return It.fromMillis(Date.now())}static fromDate(e){return It.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor((e-1e3*n)*FT);return new It(n,s)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new oe(Z.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new oe(Z.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<qT)throw new oe(Z.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new oe(Z.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/FT}_compareTo(e){return this.seconds===e.seconds?Re(this.nanoseconds,e.nanoseconds):Re(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds-qT;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class Ae{static fromTimestamp(e){return new Ae(e)}static min(){return new Ae(new It(0,0))}static max(){return new Ae(new It(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const HT="__name__";class _i{constructor(e,n,s){n===void 0?n=0:n>e.length&&_e(637,{offset:n,range:e.length}),s===void 0?s=e.length-n:s>e.length-n&&_e(1746,{length:s,range:e.length-n}),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return _i.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof _i?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let o=0;o<s;o++){const u=_i.compareSegments(e.get(o),n.get(o));if(u!==0)return u}return Re(e.length,n.length)}static compareSegments(e,n){const s=_i.isNumericId(e),o=_i.isNumericId(n);return s&&!o?-1:!s&&o?1:s&&o?_i.extractNumericId(e).compare(_i.extractNumericId(n)):ip(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Yr.fromString(e.substring(4,e.length-2))}}class et extends _i{construct(e,n,s){return new et(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new oe(Z.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(o=>o.length>0))}return new et(n)}static emptyPath(){return new et([])}}const gN=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ft extends _i{construct(e,n,s){return new Ft(e,n,s)}static isValidIdentifier(e){return gN.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ft.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===HT}static keyField(){return new Ft([HT])}static fromServerFormat(e){const n=[];let s="",o=0;const u=()=>{if(s.length===0)throw new oe(Z.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let f=!1;for(;o<e.length;){const m=e[o];if(m==="\\"){if(o+1===e.length)throw new oe(Z.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const p=e[o+1];if(p!=="\\"&&p!=="."&&p!=="`")throw new oe(Z.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=p,o+=2}else m==="`"?(f=!f,o++):m!=="."||f?(s+=m,o++):(u(),o++)}if(u(),f)throw new oe(Z.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ft(n)}static emptyPath(){return new Ft([])}}/**
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
 */class me{constructor(e){this.path=e}static fromPath(e){return new me(et.fromString(e))}static fromName(e){return new me(et.fromString(e).popFirst(5))}static empty(){return new me(et.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&et.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return et.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new me(new et(e.slice()))}}/**
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
 */const iu=-1;function yN(i,e){const n=i.toTimestamp().seconds,s=i.toTimestamp().nanoseconds+1,o=Ae.fromTimestamp(s===1e9?new It(n+1,0):new It(n,s));return new Xr(o,me.empty(),e)}function _N(i){return new Xr(i.readTime,i.key,iu)}class Xr{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new Xr(Ae.min(),me.empty(),iu)}static max(){return new Xr(Ae.max(),me.empty(),iu)}}function vN(i,e){let n=i.readTime.compareTo(e.readTime);return n!==0?n:(n=me.comparator(i.documentKey,e.documentKey),n!==0?n:Re(i.largestBatchId,e.largestBatchId))}/**
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
 */const TN="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class EN{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function wo(i){if(i.code!==Z.FAILED_PRECONDITION||i.message!==TN)throw i;ae("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class W{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&_e(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new W((s,o)=>{this.nextCallback=u=>{this.wrapSuccess(e,u).next(s,o)},this.catchCallback=u=>{this.wrapFailure(n,u).next(s,o)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof W?n:W.resolve(n)}catch(n){return W.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):W.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):W.reject(n)}static resolve(e){return new W((n,s)=>{n(e)})}static reject(e){return new W((n,s)=>{s(e)})}static waitFor(e){return new W((n,s)=>{let o=0,u=0,f=!1;e.forEach(m=>{++o,m.next(()=>{++u,f&&u===o&&n()},p=>s(p))}),f=!0,u===o&&n()})}static or(e){let n=W.resolve(!1);for(const s of e)n=n.next(o=>o?W.resolve(o):s());return n}static forEach(e,n){const s=[];return e.forEach((o,u)=>{s.push(n.call(this,o,u))}),this.waitFor(s)}static mapArray(e,n){return new W((s,o)=>{const u=e.length,f=new Array(u);let m=0;for(let p=0;p<u;p++){const y=p;n(e[y]).next(T=>{f[y]=T,++m,m===u&&s(f)},T=>o(T))}})}static doWhile(e,n){return new W((s,o)=>{const u=()=>{e()===!0?n().next(()=>{u()},o):s()};u()})}}function AN(i){const e=i.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Io(i){return i.name==="IndexedDbTransactionError"}/**
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
 */class Kh{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ue(s),this.ce=s=>n.writeSequenceNumber(s))}ue(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ce&&this.ce(e),e}}Kh.le=-1;/**
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
 */const Fp=-1;function Yh(i){return i==null}function Sh(i){return i===0&&1/i==-1/0}function bN(i){return typeof i=="number"&&Number.isInteger(i)&&!Sh(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER}/**
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
 */const vA="";function SN(i){let e="";for(let n=0;n<i.length;n++)e.length>0&&(e=GT(e)),e=wN(i.get(n),e);return GT(e)}function wN(i,e){let n=e;const s=i.length;for(let o=0;o<s;o++){const u=i.charAt(o);switch(u){case"\0":n+="";break;case vA:n+="";break;default:n+=u}}return n}function GT(i){return i+vA+""}/**
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
 */function KT(i){let e=0;for(const n in i)Object.prototype.hasOwnProperty.call(i,n)&&e++;return e}function os(i,e){for(const n in i)Object.prototype.hasOwnProperty.call(i,n)&&e(n,i[n])}function TA(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}/**
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
 */class st{constructor(e,n){this.comparator=e,this.root=n||qt.EMPTY}insert(e,n){return new st(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,qt.BLACK,null,null))}remove(e){return new st(this.comparator,this.root.remove(e,this.comparator).copy(null,null,qt.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(e,s.key);if(o===0)return n+s.left.size;o<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Zc(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Zc(this.root,e,this.comparator,!1)}getReverseIterator(){return new Zc(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Zc(this.root,e,this.comparator,!0)}}class Zc{constructor(e,n,s,o){this.isReverse=o,this.nodeStack=[];let u=1;for(;!e.isEmpty();)if(u=n?s(e.key,n):1,n&&o&&(u*=-1),u<0)e=this.isReverse?e.left:e.right;else{if(u===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class qt{constructor(e,n,s,o,u){this.key=e,this.value=n,this.color=s??qt.RED,this.left=o??qt.EMPTY,this.right=u??qt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,o,u){return new qt(e??this.key,n??this.value,s??this.color,o??this.left,u??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let o=this;const u=s(e,o.key);return o=u<0?o.copy(null,null,null,o.left.insert(e,n,s),null):u===0?o.copy(null,n,null,null,null):o.copy(null,null,null,null,o.right.insert(e,n,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return qt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,o=this;if(n(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,n),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),n(e,o.key)===0){if(o.right.isEmpty())return qt.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,n))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,qt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,qt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw _e(43730,{key:this.key,value:this.value});if(this.right.isRed())throw _e(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw _e(27949);return e+(this.isRed()?0:1)}}qt.EMPTY=null,qt.RED=!0,qt.BLACK=!1;qt.EMPTY=new class{constructor(){this.size=0}get key(){throw _e(57766)}get value(){throw _e(16141)}get color(){throw _e(16727)}get left(){throw _e(29726)}get right(){throw _e(36894)}copy(e,n,s,o,u){return this}insert(e,n,s){return new qt(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Rt{constructor(e){this.comparator=e,this.data=new st(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,e[1])>=0)return;n(o.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new YT(this.data.getIterator())}getIteratorFrom(e){return new YT(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof Rt)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const o=n.getNext().key,u=s.getNext().key;if(this.comparator(o,u)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Rt(this.comparator);return n.data=e,n}}class YT{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class bn{constructor(e){this.fields=e,e.sort(Ft.comparator)}static empty(){return new bn([])}unionWith(e){let n=new Rt(Ft.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new bn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return go(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
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
 */class EA extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ht{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(o){try{return atob(o)}catch(u){throw typeof DOMException<"u"&&u instanceof DOMException?new EA("Invalid base64 string: "+u):u}}(e);return new Ht(n)}static fromUint8Array(e){const n=function(o){let u="";for(let f=0;f<o.length;++f)u+=String.fromCharCode(o[f]);return u}(e);return new Ht(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Re(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ht.EMPTY_BYTE_STRING=new Ht("");const IN=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Zr(i){if(Fe(!!i,39018),typeof i=="string"){let e=0;const n=IN.exec(i);if(Fe(!!n,46558,{timestamp:i}),n[1]){let o=n[1];o=(o+"000000000").substr(0,9),e=Number(o)}const s=new Date(i);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:dt(i.seconds),nanos:dt(i.nanos)}}function dt(i){return typeof i=="number"?i:typeof i=="string"?Number(i):0}function Wr(i){return typeof i=="string"?Ht.fromBase64String(i):Ht.fromUint8Array(i)}/**
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
 */const AA="server_timestamp",bA="__type__",SA="__previous_value__",wA="__local_write_time__";function Hp(i){var e,n;return((n=(((e=i?.mapValue)===null||e===void 0?void 0:e.fields)||{})[bA])===null||n===void 0?void 0:n.stringValue)===AA}function Qh(i){const e=i.mapValue.fields[SA];return Hp(e)?Qh(e):e}function ru(i){const e=Zr(i.mapValue.fields[wA].timestampValue);return new It(e.seconds,e.nanos)}/**
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
 */class RN{constructor(e,n,s,o,u,f,m,p,y,T){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=o,this.ssl=u,this.forceLongPolling=f,this.autoDetectLongPolling=m,this.longPollingOptions=p,this.useFetchStreams=y,this.isUsingEmulator=T}}const wh="(default)";class su{constructor(e,n){this.projectId=e,this.database=n||wh}static empty(){return new su("","")}get isDefaultDatabase(){return this.database===wh}isEqual(e){return e instanceof su&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const IA="__type__",CN="__max__",Wc={mapValue:{}},RA="__vector__",Ih="value";function Jr(i){return"nullValue"in i?0:"booleanValue"in i?1:"integerValue"in i||"doubleValue"in i?2:"timestampValue"in i?3:"stringValue"in i?5:"bytesValue"in i?6:"referenceValue"in i?7:"geoPointValue"in i?8:"arrayValue"in i?9:"mapValue"in i?Hp(i)?4:DN(i)?9007199254740991:NN(i)?10:11:_e(28295,{value:i})}function bi(i,e){if(i===e)return!0;const n=Jr(i);if(n!==Jr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return i.booleanValue===e.booleanValue;case 4:return ru(i).isEqual(ru(e));case 3:return function(o,u){if(typeof o.timestampValue=="string"&&typeof u.timestampValue=="string"&&o.timestampValue.length===u.timestampValue.length)return o.timestampValue===u.timestampValue;const f=Zr(o.timestampValue),m=Zr(u.timestampValue);return f.seconds===m.seconds&&f.nanos===m.nanos}(i,e);case 5:return i.stringValue===e.stringValue;case 6:return function(o,u){return Wr(o.bytesValue).isEqual(Wr(u.bytesValue))}(i,e);case 7:return i.referenceValue===e.referenceValue;case 8:return function(o,u){return dt(o.geoPointValue.latitude)===dt(u.geoPointValue.latitude)&&dt(o.geoPointValue.longitude)===dt(u.geoPointValue.longitude)}(i,e);case 2:return function(o,u){if("integerValue"in o&&"integerValue"in u)return dt(o.integerValue)===dt(u.integerValue);if("doubleValue"in o&&"doubleValue"in u){const f=dt(o.doubleValue),m=dt(u.doubleValue);return f===m?Sh(f)===Sh(m):isNaN(f)&&isNaN(m)}return!1}(i,e);case 9:return go(i.arrayValue.values||[],e.arrayValue.values||[],bi);case 10:case 11:return function(o,u){const f=o.mapValue.fields||{},m=u.mapValue.fields||{};if(KT(f)!==KT(m))return!1;for(const p in f)if(f.hasOwnProperty(p)&&(m[p]===void 0||!bi(f[p],m[p])))return!1;return!0}(i,e);default:return _e(52216,{left:i})}}function au(i,e){return(i.values||[]).find(n=>bi(n,e))!==void 0}function yo(i,e){if(i===e)return 0;const n=Jr(i),s=Jr(e);if(n!==s)return Re(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return Re(i.booleanValue,e.booleanValue);case 2:return function(u,f){const m=dt(u.integerValue||u.doubleValue),p=dt(f.integerValue||f.doubleValue);return m<p?-1:m>p?1:m===p?0:isNaN(m)?isNaN(p)?0:-1:1}(i,e);case 3:return QT(i.timestampValue,e.timestampValue);case 4:return QT(ru(i),ru(e));case 5:return ip(i.stringValue,e.stringValue);case 6:return function(u,f){const m=Wr(u),p=Wr(f);return m.compareTo(p)}(i.bytesValue,e.bytesValue);case 7:return function(u,f){const m=u.split("/"),p=f.split("/");for(let y=0;y<m.length&&y<p.length;y++){const T=Re(m[y],p[y]);if(T!==0)return T}return Re(m.length,p.length)}(i.referenceValue,e.referenceValue);case 8:return function(u,f){const m=Re(dt(u.latitude),dt(f.latitude));return m!==0?m:Re(dt(u.longitude),dt(f.longitude))}(i.geoPointValue,e.geoPointValue);case 9:return $T(i.arrayValue,e.arrayValue);case 10:return function(u,f){var m,p,y,T;const S=u.fields||{},w=f.fields||{},P=(m=S[Ih])===null||m===void 0?void 0:m.arrayValue,k=(p=w[Ih])===null||p===void 0?void 0:p.arrayValue,K=Re(((y=P?.values)===null||y===void 0?void 0:y.length)||0,((T=k?.values)===null||T===void 0?void 0:T.length)||0);return K!==0?K:$T(P,k)}(i.mapValue,e.mapValue);case 11:return function(u,f){if(u===Wc.mapValue&&f===Wc.mapValue)return 0;if(u===Wc.mapValue)return 1;if(f===Wc.mapValue)return-1;const m=u.fields||{},p=Object.keys(m),y=f.fields||{},T=Object.keys(y);p.sort(),T.sort();for(let S=0;S<p.length&&S<T.length;++S){const w=ip(p[S],T[S]);if(w!==0)return w;const P=yo(m[p[S]],y[T[S]]);if(P!==0)return P}return Re(p.length,T.length)}(i.mapValue,e.mapValue);default:throw _e(23264,{Pe:n})}}function QT(i,e){if(typeof i=="string"&&typeof e=="string"&&i.length===e.length)return Re(i,e);const n=Zr(i),s=Zr(e),o=Re(n.seconds,s.seconds);return o!==0?o:Re(n.nanos,s.nanos)}function $T(i,e){const n=i.values||[],s=e.values||[];for(let o=0;o<n.length&&o<s.length;++o){const u=yo(n[o],s[o]);if(u)return u}return Re(n.length,s.length)}function _o(i){return rp(i)}function rp(i){return"nullValue"in i?"null":"booleanValue"in i?""+i.booleanValue:"integerValue"in i?""+i.integerValue:"doubleValue"in i?""+i.doubleValue:"timestampValue"in i?function(n){const s=Zr(n);return`time(${s.seconds},${s.nanos})`}(i.timestampValue):"stringValue"in i?i.stringValue:"bytesValue"in i?function(n){return Wr(n).toBase64()}(i.bytesValue):"referenceValue"in i?function(n){return me.fromName(n).toString()}(i.referenceValue):"geoPointValue"in i?function(n){return`geo(${n.latitude},${n.longitude})`}(i.geoPointValue):"arrayValue"in i?function(n){let s="[",o=!0;for(const u of n.values||[])o?o=!1:s+=",",s+=rp(u);return s+"]"}(i.arrayValue):"mapValue"in i?function(n){const s=Object.keys(n.fields||{}).sort();let o="{",u=!0;for(const f of s)u?u=!1:o+=",",o+=`${f}:${rp(n.fields[f])}`;return o+"}"}(i.mapValue):_e(61005,{value:i})}function uh(i){switch(Jr(i)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Qh(i);return e?16+uh(e):16;case 5:return 2*i.stringValue.length;case 6:return Wr(i.bytesValue).approximateByteSize();case 7:return i.referenceValue.length;case 9:return function(s){return(s.values||[]).reduce((o,u)=>o+uh(u),0)}(i.arrayValue);case 10:case 11:return function(s){let o=0;return os(s.fields,(u,f)=>{o+=u.length+uh(f)}),o}(i.mapValue);default:throw _e(13486,{value:i})}}function XT(i,e){return{referenceValue:`projects/${i.projectId}/databases/${i.database}/documents/${e.path.canonicalString()}`}}function sp(i){return!!i&&"integerValue"in i}function Gp(i){return!!i&&"arrayValue"in i}function ZT(i){return!!i&&"nullValue"in i}function WT(i){return!!i&&"doubleValue"in i&&isNaN(Number(i.doubleValue))}function ch(i){return!!i&&"mapValue"in i}function NN(i){var e,n;return((n=(((e=i?.mapValue)===null||e===void 0?void 0:e.fields)||{})[IA])===null||n===void 0?void 0:n.stringValue)===RA}function Kl(i){if(i.geoPointValue)return{geoPointValue:Object.assign({},i.geoPointValue)};if(i.timestampValue&&typeof i.timestampValue=="object")return{timestampValue:Object.assign({},i.timestampValue)};if(i.mapValue){const e={mapValue:{fields:{}}};return os(i.mapValue.fields,(n,s)=>e.mapValue.fields[n]=Kl(s)),e}if(i.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(i.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Kl(i.arrayValue.values[n]);return e}return Object.assign({},i)}function DN(i){return(((i.mapValue||{}).fields||{}).__type__||{}).stringValue===CN}/**
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
 */class hn{constructor(e){this.value=e}static empty(){return new hn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!ch(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Kl(n)}setAll(e){let n=Ft.emptyPath(),s={},o=[];e.forEach((f,m)=>{if(!n.isImmediateParentOf(m)){const p=this.getFieldsMap(n);this.applyChanges(p,s,o),s={},o=[],n=m.popLast()}f?s[m.lastSegment()]=Kl(f):o.push(m.lastSegment())});const u=this.getFieldsMap(n);this.applyChanges(u,s,o)}delete(e){const n=this.field(e.popLast());ch(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return bi(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let o=n.mapValue.fields[e.get(s)];ch(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=o),n=o}return n.mapValue.fields}applyChanges(e,n,s){os(n,(o,u)=>e[o]=u);for(const o of s)delete e[o]}clone(){return new hn(Kl(this.value))}}function CA(i){const e=[];return os(i.fields,(n,s)=>{const o=new Ft([n]);if(ch(s)){const u=CA(s.mapValue).fields;if(u.length===0)e.push(o);else for(const f of u)e.push(o.child(f))}else e.push(o)}),new bn(e)}/**
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
 */class Zt{constructor(e,n,s,o,u,f,m){this.key=e,this.documentType=n,this.version=s,this.readTime=o,this.createTime=u,this.data=f,this.documentState=m}static newInvalidDocument(e){return new Zt(e,0,Ae.min(),Ae.min(),Ae.min(),hn.empty(),0)}static newFoundDocument(e,n,s,o){return new Zt(e,1,n,Ae.min(),s,o,0)}static newNoDocument(e,n){return new Zt(e,2,n,Ae.min(),Ae.min(),hn.empty(),0)}static newUnknownDocument(e,n){return new Zt(e,3,n,Ae.min(),Ae.min(),hn.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Ae.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=hn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=hn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Ae.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Zt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Zt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Rh{constructor(e,n){this.position=e,this.inclusive=n}}function JT(i,e,n){let s=0;for(let o=0;o<i.position.length;o++){const u=e[o],f=i.position[o];if(u.field.isKeyField()?s=me.comparator(me.fromName(f.referenceValue),n.key):s=yo(f,n.data.field(u.field)),u.dir==="desc"&&(s*=-1),s!==0)break}return s}function eE(i,e){if(i===null)return e===null;if(e===null||i.inclusive!==e.inclusive||i.position.length!==e.position.length)return!1;for(let n=0;n<i.position.length;n++)if(!bi(i.position[n],e.position[n]))return!1;return!0}/**
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
 */class ou{constructor(e,n="asc"){this.field=e,this.dir=n}}function ON(i,e){return i.dir===e.dir&&i.field.isEqual(e.field)}/**
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
 */class NA{}class Tt extends NA{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new xN(e,n,s):n==="array-contains"?new PN(e,s):n==="in"?new UN(e,s):n==="not-in"?new LN(e,s):n==="array-contains-any"?new jN(e,s):new Tt(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new VN(e,s):new kN(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(yo(n,this.value)):n!==null&&Jr(this.value)===Jr(n)&&this.matchesComparison(yo(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return _e(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ei extends NA{constructor(e,n){super(),this.filters=e,this.op=n,this.Te=null}static create(e,n){return new ei(e,n)}matches(e){return DA(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.Te!==null||(this.Te=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.Te}getFilters(){return Object.assign([],this.filters)}}function DA(i){return i.op==="and"}function OA(i){return MN(i)&&DA(i)}function MN(i){for(const e of i.filters)if(e instanceof ei)return!1;return!0}function ap(i){if(i instanceof Tt)return i.field.canonicalString()+i.op.toString()+_o(i.value);if(OA(i))return i.filters.map(e=>ap(e)).join(",");{const e=i.filters.map(n=>ap(n)).join(",");return`${i.op}(${e})`}}function MA(i,e){return i instanceof Tt?function(s,o){return o instanceof Tt&&s.op===o.op&&s.field.isEqual(o.field)&&bi(s.value,o.value)}(i,e):i instanceof ei?function(s,o){return o instanceof ei&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce((u,f,m)=>u&&MA(f,o.filters[m]),!0):!1}(i,e):void _e(19439)}function xA(i){return i instanceof Tt?function(n){return`${n.field.canonicalString()} ${n.op} ${_o(n.value)}`}(i):i instanceof ei?function(n){return n.op.toString()+" {"+n.getFilters().map(xA).join(" ,")+"}"}(i):"Filter"}class xN extends Tt{constructor(e,n,s){super(e,n,s),this.key=me.fromName(s.referenceValue)}matches(e){const n=me.comparator(e.key,this.key);return this.matchesComparison(n)}}class VN extends Tt{constructor(e,n){super(e,"in",n),this.keys=VA("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class kN extends Tt{constructor(e,n){super(e,"not-in",n),this.keys=VA("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function VA(i,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>me.fromName(s.referenceValue))}class PN extends Tt{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Gp(n)&&au(n.arrayValue,this.value)}}class UN extends Tt{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&au(this.value.arrayValue,n)}}class LN extends Tt{constructor(e,n){super(e,"not-in",n)}matches(e){if(au(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!au(this.value.arrayValue,n)}}class jN extends Tt{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Gp(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>au(this.value.arrayValue,s))}}/**
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
 */class zN{constructor(e,n=null,s=[],o=[],u=null,f=null,m=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=o,this.limit=u,this.startAt=f,this.endAt=m,this.Ie=null}}function tE(i,e=null,n=[],s=[],o=null,u=null,f=null){return new zN(i,e,n,s,o,u,f)}function Kp(i){const e=be(i);if(e.Ie===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(s=>ap(s)).join(","),n+="|ob:",n+=e.orderBy.map(s=>function(u){return u.field.canonicalString()+u.dir}(s)).join(","),Yh(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>_o(s)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>_o(s)).join(",")),e.Ie=n}return e.Ie}function Yp(i,e){if(i.limit!==e.limit||i.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<i.orderBy.length;n++)if(!ON(i.orderBy[n],e.orderBy[n]))return!1;if(i.filters.length!==e.filters.length)return!1;for(let n=0;n<i.filters.length;n++)if(!MA(i.filters[n],e.filters[n]))return!1;return i.collectionGroup===e.collectionGroup&&!!i.path.isEqual(e.path)&&!!eE(i.startAt,e.startAt)&&eE(i.endAt,e.endAt)}function op(i){return me.isDocumentKey(i.path)&&i.collectionGroup===null&&i.filters.length===0}/**
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
 */class Ro{constructor(e,n=null,s=[],o=[],u=null,f="F",m=null,p=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=o,this.limit=u,this.limitType=f,this.startAt=m,this.endAt=p,this.Ee=null,this.de=null,this.Ae=null,this.startAt,this.endAt}}function BN(i,e,n,s,o,u,f,m){return new Ro(i,e,n,s,o,u,f,m)}function $h(i){return new Ro(i)}function nE(i){return i.filters.length===0&&i.limit===null&&i.startAt==null&&i.endAt==null&&(i.explicitOrderBy.length===0||i.explicitOrderBy.length===1&&i.explicitOrderBy[0].field.isKeyField())}function kA(i){return i.collectionGroup!==null}function Yl(i){const e=be(i);if(e.Ee===null){e.Ee=[];const n=new Set;for(const u of e.explicitOrderBy)e.Ee.push(u),n.add(u.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(f){let m=new Rt(Ft.comparator);return f.filters.forEach(p=>{p.getFlattenedFilters().forEach(y=>{y.isInequality()&&(m=m.add(y.field))})}),m})(e).forEach(u=>{n.has(u.canonicalString())||u.isKeyField()||e.Ee.push(new ou(u,s))}),n.has(Ft.keyField().canonicalString())||e.Ee.push(new ou(Ft.keyField(),s))}return e.Ee}function Ei(i){const e=be(i);return e.de||(e.de=qN(e,Yl(i))),e.de}function qN(i,e){if(i.limitType==="F")return tE(i.path,i.collectionGroup,e,i.filters,i.limit,i.startAt,i.endAt);{e=e.map(o=>{const u=o.dir==="desc"?"asc":"desc";return new ou(o.field,u)});const n=i.endAt?new Rh(i.endAt.position,i.endAt.inclusive):null,s=i.startAt?new Rh(i.startAt.position,i.startAt.inclusive):null;return tE(i.path,i.collectionGroup,e,i.filters,i.limit,n,s)}}function lp(i,e){const n=i.filters.concat([e]);return new Ro(i.path,i.collectionGroup,i.explicitOrderBy.slice(),n,i.limit,i.limitType,i.startAt,i.endAt)}function up(i,e,n){return new Ro(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),e,n,i.startAt,i.endAt)}function Xh(i,e){return Yp(Ei(i),Ei(e))&&i.limitType===e.limitType}function PA(i){return`${Kp(Ei(i))}|lt:${i.limitType}`}function to(i){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(o=>xA(o)).join(", ")}]`),Yh(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(o=>function(f){return`${f.field.canonicalString()} (${f.dir})`}(o)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(o=>_o(o)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(o=>_o(o)).join(",")),`Target(${s})`}(Ei(i))}; limitType=${i.limitType})`}function Zh(i,e){return e.isFoundDocument()&&function(s,o){const u=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(u):me.isDocumentKey(s.path)?s.path.isEqual(u):s.path.isImmediateParentOf(u)}(i,e)&&function(s,o){for(const u of Yl(s))if(!u.field.isKeyField()&&o.data.field(u.field)===null)return!1;return!0}(i,e)&&function(s,o){for(const u of s.filters)if(!u.matches(o))return!1;return!0}(i,e)&&function(s,o){return!(s.startAt&&!function(f,m,p){const y=JT(f,m,p);return f.inclusive?y<=0:y<0}(s.startAt,Yl(s),o)||s.endAt&&!function(f,m,p){const y=JT(f,m,p);return f.inclusive?y>=0:y>0}(s.endAt,Yl(s),o))}(i,e)}function FN(i){return i.collectionGroup||(i.path.length%2==1?i.path.lastSegment():i.path.get(i.path.length-2))}function UA(i){return(e,n)=>{let s=!1;for(const o of Yl(i)){const u=HN(o,e,n);if(u!==0)return u;s=s||o.field.isKeyField()}return 0}}function HN(i,e,n){const s=i.field.isKeyField()?me.comparator(e.key,n.key):function(u,f,m){const p=f.data.field(u),y=m.data.field(u);return p!==null&&y!==null?yo(p,y):_e(42886)}(i.field,e,n);switch(i.dir){case"asc":return s;case"desc":return-1*s;default:return _e(19790,{direction:i.dir})}}/**
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
 */class aa{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[o,u]of s)if(this.equalsFn(o,e))return u}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),o=this.inner[s];if(o===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let u=0;u<o.length;u++)if(this.equalsFn(o[u][0],e))return void(o[u]=[e,n]);o.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return s.length===1?delete this.inner[n]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(e){os(this.inner,(n,s)=>{for(const[o,u]of s)e(o,u)})}isEmpty(){return TA(this.inner)}size(){return this.innerSize}}/**
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
 */const GN=new st(me.comparator);function ar(){return GN}const LA=new st(me.comparator);function Bl(...i){let e=LA;for(const n of i)e=e.insert(n.key,n);return e}function jA(i){let e=LA;return i.forEach((n,s)=>e=e.insert(n,s.overlayedDocument)),e}function Qs(){return Ql()}function zA(){return Ql()}function Ql(){return new aa(i=>i.toString(),(i,e)=>i.isEqual(e))}const KN=new st(me.comparator),YN=new Rt(me.comparator);function xe(...i){let e=YN;for(const n of i)e=e.add(n);return e}const QN=new Rt(Re);function $N(){return QN}/**
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
 */function Qp(i,e){if(i.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Sh(e)?"-0":e}}function BA(i){return{integerValue:""+i}}function XN(i,e){return bN(e)?BA(e):Qp(i,e)}/**
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
 */class Wh{constructor(){this._=void 0}}function ZN(i,e,n){return i instanceof Ch?function(o,u){const f={fields:{[bA]:{stringValue:AA},[wA]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return u&&Hp(u)&&(u=Qh(u)),u&&(f.fields[SA]=u),{mapValue:f}}(n,e):i instanceof lu?FA(i,e):i instanceof uu?HA(i,e):function(o,u){const f=qA(o,u),m=iE(f)+iE(o.Re);return sp(f)&&sp(o.Re)?BA(m):Qp(o.serializer,m)}(i,e)}function WN(i,e,n){return i instanceof lu?FA(i,e):i instanceof uu?HA(i,e):n}function qA(i,e){return i instanceof Nh?function(s){return sp(s)||function(u){return!!u&&"doubleValue"in u}(s)}(e)?e:{integerValue:0}:null}class Ch extends Wh{}class lu extends Wh{constructor(e){super(),this.elements=e}}function FA(i,e){const n=GA(e);for(const s of i.elements)n.some(o=>bi(o,s))||n.push(s);return{arrayValue:{values:n}}}class uu extends Wh{constructor(e){super(),this.elements=e}}function HA(i,e){let n=GA(e);for(const s of i.elements)n=n.filter(o=>!bi(o,s));return{arrayValue:{values:n}}}class Nh extends Wh{constructor(e,n){super(),this.serializer=e,this.Re=n}}function iE(i){return dt(i.integerValue||i.doubleValue)}function GA(i){return Gp(i)&&i.arrayValue.values?i.arrayValue.values.slice():[]}function JN(i,e){return i.field.isEqual(e.field)&&function(s,o){return s instanceof lu&&o instanceof lu||s instanceof uu&&o instanceof uu?go(s.elements,o.elements,bi):s instanceof Nh&&o instanceof Nh?bi(s.Re,o.Re):s instanceof Ch&&o instanceof Ch}(i.transform,e.transform)}class eD{constructor(e,n){this.version=e,this.transformResults=n}}class zn{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new zn}static exists(e){return new zn(void 0,e)}static updateTime(e){return new zn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function hh(i,e){return i.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(i.updateTime):i.exists===void 0||i.exists===e.isFoundDocument()}class Jh{}function KA(i,e){if(!i.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return i.isNoDocument()?new $p(i.key,zn.none()):new yu(i.key,i.data,zn.none());{const n=i.data,s=hn.empty();let o=new Rt(Ft.comparator);for(let u of e.fields)if(!o.has(u)){let f=n.field(u);f===null&&u.length>1&&(u=u.popLast(),f=n.field(u)),f===null?s.delete(u):s.set(u,f),o=o.add(u)}return new ls(i.key,s,new bn(o.toArray()),zn.none())}}function tD(i,e,n){i instanceof yu?function(o,u,f){const m=o.value.clone(),p=sE(o.fieldTransforms,u,f.transformResults);m.setAll(p),u.convertToFoundDocument(f.version,m).setHasCommittedMutations()}(i,e,n):i instanceof ls?function(o,u,f){if(!hh(o.precondition,u))return void u.convertToUnknownDocument(f.version);const m=sE(o.fieldTransforms,u,f.transformResults),p=u.data;p.setAll(YA(o)),p.setAll(m),u.convertToFoundDocument(f.version,p).setHasCommittedMutations()}(i,e,n):function(o,u,f){u.convertToNoDocument(f.version).setHasCommittedMutations()}(0,e,n)}function $l(i,e,n,s){return i instanceof yu?function(u,f,m,p){if(!hh(u.precondition,f))return m;const y=u.value.clone(),T=aE(u.fieldTransforms,p,f);return y.setAll(T),f.convertToFoundDocument(f.version,y).setHasLocalMutations(),null}(i,e,n,s):i instanceof ls?function(u,f,m,p){if(!hh(u.precondition,f))return m;const y=aE(u.fieldTransforms,p,f),T=f.data;return T.setAll(YA(u)),T.setAll(y),f.convertToFoundDocument(f.version,T).setHasLocalMutations(),m===null?null:m.unionWith(u.fieldMask.fields).unionWith(u.fieldTransforms.map(S=>S.field))}(i,e,n,s):function(u,f,m){return hh(u.precondition,f)?(f.convertToNoDocument(f.version).setHasLocalMutations(),null):m}(i,e,n)}function nD(i,e){let n=null;for(const s of i.fieldTransforms){const o=e.data.field(s.field),u=qA(s.transform,o||null);u!=null&&(n===null&&(n=hn.empty()),n.set(s.field,u))}return n||null}function rE(i,e){return i.type===e.type&&!!i.key.isEqual(e.key)&&!!i.precondition.isEqual(e.precondition)&&!!function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&go(s,o,(u,f)=>JN(u,f))}(i.fieldTransforms,e.fieldTransforms)&&(i.type===0?i.value.isEqual(e.value):i.type!==1||i.data.isEqual(e.data)&&i.fieldMask.isEqual(e.fieldMask))}class yu extends Jh{constructor(e,n,s,o=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class ls extends Jh{constructor(e,n,s,o,u=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=o,this.fieldTransforms=u,this.type=1}getFieldMask(){return this.fieldMask}}function YA(i){const e=new Map;return i.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=i.data.field(n);e.set(n,s)}}),e}function sE(i,e,n){const s=new Map;Fe(i.length===n.length,32656,{Ve:n.length,me:i.length});for(let o=0;o<n.length;o++){const u=i[o],f=u.transform,m=e.data.field(u.field);s.set(u.field,WN(f,m,n[o]))}return s}function aE(i,e,n){const s=new Map;for(const o of i){const u=o.transform,f=n.data.field(o.field);s.set(o.field,ZN(u,f,e))}return s}class $p extends Jh{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class iD extends Jh{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class rD{constructor(e,n,s,o){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let o=0;o<this.mutations.length;o++){const u=this.mutations[o];u.key.isEqual(e.key)&&tD(u,e,s[o])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=$l(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=$l(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=zA();return this.mutations.forEach(o=>{const u=e.get(o.key),f=u.overlayedDocument;let m=this.applyToLocalView(f,u.mutatedFields);m=n.has(o.key)?null:m;const p=KA(f,m);p!==null&&s.set(o.key,p),f.isValidDocument()||f.convertToNoDocument(Ae.min())}),s}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),xe())}isEqual(e){return this.batchId===e.batchId&&go(this.mutations,e.mutations,(n,s)=>rE(n,s))&&go(this.baseMutations,e.baseMutations,(n,s)=>rE(n,s))}}class Xp{constructor(e,n,s,o){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=o}static from(e,n,s){Fe(e.mutations.length===s.length,58842,{fe:e.mutations.length,ge:s.length});let o=function(){return KN}();const u=e.mutations;for(let f=0;f<u.length;f++)o=o.insert(u[f].key,s[f].version);return new Xp(e,n,s,o)}}/**
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
 */class sD{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class aD{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
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
 */var vt,Ue;function oD(i){switch(i){case Z.OK:return _e(64938);case Z.CANCELLED:case Z.UNKNOWN:case Z.DEADLINE_EXCEEDED:case Z.RESOURCE_EXHAUSTED:case Z.INTERNAL:case Z.UNAVAILABLE:case Z.UNAUTHENTICATED:return!1;case Z.INVALID_ARGUMENT:case Z.NOT_FOUND:case Z.ALREADY_EXISTS:case Z.PERMISSION_DENIED:case Z.FAILED_PRECONDITION:case Z.ABORTED:case Z.OUT_OF_RANGE:case Z.UNIMPLEMENTED:case Z.DATA_LOSS:return!0;default:return _e(15467,{code:i})}}function QA(i){if(i===void 0)return sr("GRPC error has no .code"),Z.UNKNOWN;switch(i){case vt.OK:return Z.OK;case vt.CANCELLED:return Z.CANCELLED;case vt.UNKNOWN:return Z.UNKNOWN;case vt.DEADLINE_EXCEEDED:return Z.DEADLINE_EXCEEDED;case vt.RESOURCE_EXHAUSTED:return Z.RESOURCE_EXHAUSTED;case vt.INTERNAL:return Z.INTERNAL;case vt.UNAVAILABLE:return Z.UNAVAILABLE;case vt.UNAUTHENTICATED:return Z.UNAUTHENTICATED;case vt.INVALID_ARGUMENT:return Z.INVALID_ARGUMENT;case vt.NOT_FOUND:return Z.NOT_FOUND;case vt.ALREADY_EXISTS:return Z.ALREADY_EXISTS;case vt.PERMISSION_DENIED:return Z.PERMISSION_DENIED;case vt.FAILED_PRECONDITION:return Z.FAILED_PRECONDITION;case vt.ABORTED:return Z.ABORTED;case vt.OUT_OF_RANGE:return Z.OUT_OF_RANGE;case vt.UNIMPLEMENTED:return Z.UNIMPLEMENTED;case vt.DATA_LOSS:return Z.DATA_LOSS;default:return _e(39323,{code:i})}}(Ue=vt||(vt={}))[Ue.OK=0]="OK",Ue[Ue.CANCELLED=1]="CANCELLED",Ue[Ue.UNKNOWN=2]="UNKNOWN",Ue[Ue.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ue[Ue.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ue[Ue.NOT_FOUND=5]="NOT_FOUND",Ue[Ue.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ue[Ue.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ue[Ue.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ue[Ue.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ue[Ue.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ue[Ue.ABORTED=10]="ABORTED",Ue[Ue.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ue[Ue.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ue[Ue.INTERNAL=13]="INTERNAL",Ue[Ue.UNAVAILABLE=14]="UNAVAILABLE",Ue[Ue.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const lD=new Yr([4294967295,4294967295],0);function oE(i){const e=yA().encode(i),n=new uA;return n.update(e),new Uint8Array(n.digest())}function lE(i){const e=new DataView(i.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),o=e.getUint32(8,!0),u=e.getUint32(12,!0);return[new Yr([n,s],0),new Yr([o,u],0)]}class Zp{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new ql(`Invalid padding: ${n}`);if(s<0)throw new ql(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new ql(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new ql(`Invalid padding when bitmap length is 0: ${n}`);this.pe=8*e.length-n,this.ye=Yr.fromNumber(this.pe)}we(e,n,s){let o=e.add(n.multiply(Yr.fromNumber(s)));return o.compare(lD)===1&&(o=new Yr([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ye).toNumber()}be(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.pe===0)return!1;const n=oE(e),[s,o]=lE(n);for(let u=0;u<this.hashCount;u++){const f=this.we(s,o,u);if(!this.be(f))return!1}return!0}static create(e,n,s){const o=e%8==0?0:8-e%8,u=new Uint8Array(Math.ceil(e/8)),f=new Zp(u,o,n);return s.forEach(m=>f.insert(m)),f}insert(e){if(this.pe===0)return;const n=oE(e),[s,o]=lE(n);for(let u=0;u<this.hashCount;u++){const f=this.we(s,o,u);this.Se(f)}}Se(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class ql extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class ef{constructor(e,n,s,o,u){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=u}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const o=new Map;return o.set(e,_u.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new ef(Ae.min(),o,new st(Re),ar(),xe())}}class _u{constructor(e,n,s,o,u){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=u}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new _u(s,n,xe(),xe(),xe())}}/**
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
 */class fh{constructor(e,n,s,o){this.De=e,this.removedTargetIds=n,this.key=s,this.ve=o}}class $A{constructor(e,n){this.targetId=e,this.Ce=n}}class XA{constructor(e,n,s=Ht.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=o}}class uE{constructor(){this.Fe=0,this.Me=cE(),this.xe=Ht.EMPTY_BYTE_STRING,this.Oe=!1,this.Ne=!0}get current(){return this.Oe}get resumeToken(){return this.xe}get Be(){return this.Fe!==0}get Le(){return this.Ne}ke(e){e.approximateByteSize()>0&&(this.Ne=!0,this.xe=e)}qe(){let e=xe(),n=xe(),s=xe();return this.Me.forEach((o,u)=>{switch(u){case 0:e=e.add(o);break;case 2:n=n.add(o);break;case 1:s=s.add(o);break;default:_e(38017,{changeType:u})}}),new _u(this.xe,this.Oe,e,n,s)}Qe(){this.Ne=!1,this.Me=cE()}$e(e,n){this.Ne=!0,this.Me=this.Me.insert(e,n)}Ue(e){this.Ne=!0,this.Me=this.Me.remove(e)}Ke(){this.Fe+=1}We(){this.Fe-=1,Fe(this.Fe>=0,3241,{Fe:this.Fe})}Ge(){this.Ne=!0,this.Oe=!0}}class uD{constructor(e){this.ze=e,this.je=new Map,this.He=ar(),this.Je=Jc(),this.Ye=Jc(),this.Ze=new st(Re)}Xe(e){for(const n of e.De)e.ve&&e.ve.isFoundDocument()?this.et(n,e.ve):this.tt(n,e.key,e.ve);for(const n of e.removedTargetIds)this.tt(n,e.key,e.ve)}nt(e){this.forEachTarget(e,n=>{const s=this.rt(n);switch(e.state){case 0:this.it(n)&&s.ke(e.resumeToken);break;case 1:s.We(),s.Be||s.Qe(),s.ke(e.resumeToken);break;case 2:s.We(),s.Be||this.removeTarget(n);break;case 3:this.it(n)&&(s.Ge(),s.ke(e.resumeToken));break;case 4:this.it(n)&&(this.st(n),s.ke(e.resumeToken));break;default:_e(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.je.forEach((s,o)=>{this.it(o)&&n(o)})}ot(e){const n=e.targetId,s=e.Ce.count,o=this._t(n);if(o){const u=o.target;if(op(u))if(s===0){const f=new me(u.path);this.tt(n,f,Zt.newNoDocument(f,Ae.min()))}else Fe(s===1,20013,{expectedCount:s});else{const f=this.ut(n);if(f!==s){const m=this.ct(e),p=m?this.lt(m,e,f):1;if(p!==0){this.st(n);const y=p===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(n,y)}}}}}ct(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:u=0}=n;let f,m;try{f=Wr(s).toUint8Array()}catch(p){if(p instanceof EA)return po("Decoding the base64 bloom filter in existence filter failed ("+p.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw p}try{m=new Zp(f,o,u)}catch(p){return po(p instanceof ql?"BloomFilter error: ":"Applying bloom filter failed: ",p),null}return m.pe===0?null:m}lt(e,n,s){return n.Ce.count===s-this.Tt(e,n.targetId)?0:2}Tt(e,n){const s=this.ze.getRemoteKeysForTarget(n);let o=0;return s.forEach(u=>{const f=this.ze.Pt(),m=`projects/${f.projectId}/databases/${f.database}/documents/${u.path.canonicalString()}`;e.mightContain(m)||(this.tt(n,u,null),o++)}),o}It(e){const n=new Map;this.je.forEach((u,f)=>{const m=this._t(f);if(m){if(u.current&&op(m.target)){const p=new me(m.target.path);this.Et(p).has(f)||this.dt(f,p)||this.tt(f,p,Zt.newNoDocument(p,e))}u.Le&&(n.set(f,u.qe()),u.Qe())}});let s=xe();this.Ye.forEach((u,f)=>{let m=!0;f.forEachWhile(p=>{const y=this._t(p);return!y||y.purpose==="TargetPurposeLimboResolution"||(m=!1,!1)}),m&&(s=s.add(u))}),this.He.forEach((u,f)=>f.setReadTime(e));const o=new ef(e,n,this.Ze,this.He,s);return this.He=ar(),this.Je=Jc(),this.Ye=Jc(),this.Ze=new st(Re),o}et(e,n){if(!this.it(e))return;const s=this.dt(e,n.key)?2:0;this.rt(e).$e(n.key,s),this.He=this.He.insert(n.key,n),this.Je=this.Je.insert(n.key,this.Et(n.key).add(e)),this.Ye=this.Ye.insert(n.key,this.At(n.key).add(e))}tt(e,n,s){if(!this.it(e))return;const o=this.rt(e);this.dt(e,n)?o.$e(n,1):o.Ue(n),this.Ye=this.Ye.insert(n,this.At(n).delete(e)),this.Ye=this.Ye.insert(n,this.At(n).add(e)),s&&(this.He=this.He.insert(n,s))}removeTarget(e){this.je.delete(e)}ut(e){const n=this.rt(e).qe();return this.ze.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}Ke(e){this.rt(e).Ke()}rt(e){let n=this.je.get(e);return n||(n=new uE,this.je.set(e,n)),n}At(e){let n=this.Ye.get(e);return n||(n=new Rt(Re),this.Ye=this.Ye.insert(e,n)),n}Et(e){let n=this.Je.get(e);return n||(n=new Rt(Re),this.Je=this.Je.insert(e,n)),n}it(e){const n=this._t(e)!==null;return n||ae("WatchChangeAggregator","Detected inactive target",e),n}_t(e){const n=this.je.get(e);return n&&n.Be?null:this.ze.Rt(e)}st(e){this.je.set(e,new uE),this.ze.getRemoteKeysForTarget(e).forEach(n=>{this.tt(e,n,null)})}dt(e,n){return this.ze.getRemoteKeysForTarget(e).has(n)}}function Jc(){return new st(me.comparator)}function cE(){return new st(me.comparator)}const cD={asc:"ASCENDING",desc:"DESCENDING"},hD={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},fD={and:"AND",or:"OR"};class dD{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function cp(i,e){return i.useProto3Json||Yh(e)?e:{value:e}}function Dh(i,e){return i.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ZA(i,e){return i.useProto3Json?e.toBase64():e.toUint8Array()}function mD(i,e){return Dh(i,e.toTimestamp())}function Ai(i){return Fe(!!i,49232),Ae.fromTimestamp(function(n){const s=Zr(n);return new It(s.seconds,s.nanos)}(i))}function Wp(i,e){return hp(i,e).canonicalString()}function hp(i,e){const n=function(o){return new et(["projects",o.projectId,"databases",o.database])}(i).child("documents");return e===void 0?n:n.child(e)}function WA(i){const e=et.fromString(i);return Fe(ib(e),10190,{key:e.toString()}),e}function fp(i,e){return Wp(i.databaseId,e.path)}function xm(i,e){const n=WA(e);if(n.get(1)!==i.databaseId.projectId)throw new oe(Z.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+i.databaseId.projectId);if(n.get(3)!==i.databaseId.database)throw new oe(Z.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+i.databaseId.database);return new me(eb(n))}function JA(i,e){return Wp(i.databaseId,e)}function pD(i){const e=WA(i);return e.length===4?et.emptyPath():eb(e)}function dp(i){return new et(["projects",i.databaseId.projectId,"databases",i.databaseId.database]).canonicalString()}function eb(i){return Fe(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)}function hE(i,e,n){return{name:fp(i,e),fields:n.value.mapValue.fields}}function gD(i,e){let n;if("targetChange"in e){e.targetChange;const s=function(y){return y==="NO_CHANGE"?0:y==="ADD"?1:y==="REMOVE"?2:y==="CURRENT"?3:y==="RESET"?4:_e(39313,{state:y})}(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],u=function(y,T){return y.useProto3Json?(Fe(T===void 0||typeof T=="string",58123),Ht.fromBase64String(T||"")):(Fe(T===void 0||T instanceof Buffer||T instanceof Uint8Array,16193),Ht.fromUint8Array(T||new Uint8Array))}(i,e.targetChange.resumeToken),f=e.targetChange.cause,m=f&&function(y){const T=y.code===void 0?Z.UNKNOWN:QA(y.code);return new oe(T,y.message||"")}(f);n=new XA(s,o,u,m||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const o=xm(i,s.document.name),u=Ai(s.document.updateTime),f=s.document.createTime?Ai(s.document.createTime):Ae.min(),m=new hn({mapValue:{fields:s.document.fields}}),p=Zt.newFoundDocument(o,u,f,m),y=s.targetIds||[],T=s.removedTargetIds||[];n=new fh(y,T,p.key,p)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const o=xm(i,s.document),u=s.readTime?Ai(s.readTime):Ae.min(),f=Zt.newNoDocument(o,u),m=s.removedTargetIds||[];n=new fh([],m,f.key,f)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const o=xm(i,s.document),u=s.removedTargetIds||[];n=new fh([],u,o,null)}else{if(!("filter"in e))return _e(11601,{Vt:e});{e.filter;const s=e.filter;s.targetId;const{count:o=0,unchangedNames:u}=s,f=new aD(o,u),m=s.targetId;n=new $A(m,f)}}return n}function yD(i,e){let n;if(e instanceof yu)n={update:hE(i,e.key,e.value)};else if(e instanceof $p)n={delete:fp(i,e.key)};else if(e instanceof ls)n={update:hE(i,e.key,e.data),updateMask:ID(e.fieldMask)};else{if(!(e instanceof iD))return _e(16599,{ft:e.type});n={verify:fp(i,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(u,f){const m=f.transform;if(m instanceof Ch)return{fieldPath:f.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(m instanceof lu)return{fieldPath:f.field.canonicalString(),appendMissingElements:{values:m.elements}};if(m instanceof uu)return{fieldPath:f.field.canonicalString(),removeAllFromArray:{values:m.elements}};if(m instanceof Nh)return{fieldPath:f.field.canonicalString(),increment:m.Re};throw _e(20930,{transform:f.transform})}(0,s))),e.precondition.isNone||(n.currentDocument=function(o,u){return u.updateTime!==void 0?{updateTime:mD(o,u.updateTime)}:u.exists!==void 0?{exists:u.exists}:_e(27497)}(i,e.precondition)),n}function _D(i,e){return i&&i.length>0?(Fe(e!==void 0,14353),i.map(n=>function(o,u){let f=o.updateTime?Ai(o.updateTime):Ai(u);return f.isEqual(Ae.min())&&(f=Ai(u)),new eD(f,o.transformResults||[])}(n,e))):[]}function vD(i,e){return{documents:[JA(i,e.path)]}}function TD(i,e){const n={structuredQuery:{}},s=e.path;let o;e.collectionGroup!==null?(o=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=JA(i,o);const u=function(y){if(y.length!==0)return nb(ei.create(y,"and"))}(e.filters);u&&(n.structuredQuery.where=u);const f=function(y){if(y.length!==0)return y.map(T=>function(w){return{field:no(w.field),direction:bD(w.dir)}}(T))}(e.orderBy);f&&(n.structuredQuery.orderBy=f);const m=cp(i,e.limit);return m!==null&&(n.structuredQuery.limit=m),e.startAt&&(n.structuredQuery.startAt=function(y){return{before:y.inclusive,values:y.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(y){return{before:!y.inclusive,values:y.position}}(e.endAt)),{gt:n,parent:o}}function ED(i){let e=pD(i.parent);const n=i.structuredQuery,s=n.from?n.from.length:0;let o=null;if(s>0){Fe(s===1,65062);const T=n.from[0];T.allDescendants?o=T.collectionId:e=e.child(T.collectionId)}let u=[];n.where&&(u=function(S){const w=tb(S);return w instanceof ei&&OA(w)?w.getFilters():[w]}(n.where));let f=[];n.orderBy&&(f=function(S){return S.map(w=>function(k){return new ou(io(k.field),function(q){switch(q){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(w))}(n.orderBy));let m=null;n.limit&&(m=function(S){let w;return w=typeof S=="object"?S.value:S,Yh(w)?null:w}(n.limit));let p=null;n.startAt&&(p=function(S){const w=!!S.before,P=S.values||[];return new Rh(P,w)}(n.startAt));let y=null;return n.endAt&&(y=function(S){const w=!S.before,P=S.values||[];return new Rh(P,w)}(n.endAt)),BN(e,o,f,u,m,"F",p,y)}function AD(i,e){const n=function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return _e(28987,{purpose:o})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function tb(i){return i.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=io(n.unaryFilter.field);return Tt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=io(n.unaryFilter.field);return Tt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const u=io(n.unaryFilter.field);return Tt.create(u,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const f=io(n.unaryFilter.field);return Tt.create(f,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return _e(61313);default:return _e(60726)}}(i):i.fieldFilter!==void 0?function(n){return Tt.create(io(n.fieldFilter.field),function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return _e(58110);default:return _e(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(i):i.compositeFilter!==void 0?function(n){return ei.create(n.compositeFilter.filters.map(s=>tb(s)),function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return _e(1026)}}(n.compositeFilter.op))}(i):_e(30097,{filter:i})}function bD(i){return cD[i]}function SD(i){return hD[i]}function wD(i){return fD[i]}function no(i){return{fieldPath:i.canonicalString()}}function io(i){return Ft.fromServerFormat(i.fieldPath)}function nb(i){return i instanceof Tt?function(n){if(n.op==="=="){if(WT(n.value))return{unaryFilter:{field:no(n.field),op:"IS_NAN"}};if(ZT(n.value))return{unaryFilter:{field:no(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(WT(n.value))return{unaryFilter:{field:no(n.field),op:"IS_NOT_NAN"}};if(ZT(n.value))return{unaryFilter:{field:no(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:no(n.field),op:SD(n.op),value:n.value}}}(i):i instanceof ei?function(n){const s=n.getFilters().map(o=>nb(o));return s.length===1?s[0]:{compositeFilter:{op:wD(n.op),filters:s}}}(i):_e(54877,{filter:i})}function ID(i){const e=[];return i.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function ib(i){return i.length>=4&&i.get(0)==="projects"&&i.get(2)==="databases"}/**
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
 */class Hr{constructor(e,n,s,o,u=Ae.min(),f=Ae.min(),m=Ht.EMPTY_BYTE_STRING,p=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=u,this.lastLimboFreeSnapshotVersion=f,this.resumeToken=m,this.expectedCount=p}withSequenceNumber(e){return new Hr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Hr(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Hr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Hr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class RD{constructor(e){this.wt=e}}function CD(i){const e=ED({parent:i.parent,structuredQuery:i.structuredQuery});return i.limitType==="LAST"?up(e,e.limit,"L"):e}/**
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
 */class ND{constructor(){this.Cn=new DD}addToCollectionParentIndex(e,n){return this.Cn.add(n),W.resolve()}getCollectionParents(e,n){return W.resolve(this.Cn.getEntries(n))}addFieldIndex(e,n){return W.resolve()}deleteFieldIndex(e,n){return W.resolve()}deleteAllFieldIndexes(e){return W.resolve()}createTargetIndexes(e,n){return W.resolve()}getDocumentsMatchingTarget(e,n){return W.resolve(null)}getIndexType(e,n){return W.resolve(0)}getFieldIndexes(e,n){return W.resolve([])}getNextCollectionGroupToUpdate(e){return W.resolve(null)}getMinOffset(e,n){return W.resolve(Xr.min())}getMinOffsetFromCollectionGroup(e,n){return W.resolve(Xr.min())}updateCollectionGroup(e,n,s){return W.resolve()}updateIndexEntries(e,n){return W.resolve()}}class DD{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),o=this.index[n]||new Rt(et.comparator),u=!o.has(s);return this.index[n]=o.add(s),u}has(e){const n=e.lastSegment(),s=e.popLast(),o=this.index[n];return o&&o.has(s)}getEntries(e){return(this.index[e]||new Rt(et.comparator)).toArray()}}/**
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
 */const fE={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},rb=41943040;class cn{static withCacheSize(e){return new cn(e,cn.DEFAULT_COLLECTION_PERCENTILE,cn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=s}}/**
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
 */cn.DEFAULT_COLLECTION_PERCENTILE=10,cn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,cn.DEFAULT=new cn(rb,cn.DEFAULT_COLLECTION_PERCENTILE,cn.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),cn.DISABLED=new cn(-1,0,0);/**
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
 */class vo{constructor(e){this.ur=e}next(){return this.ur+=2,this.ur}static cr(){return new vo(0)}static lr(){return new vo(-1)}}/**
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
 */const dE="LruGarbageCollector",OD=1048576;function mE([i,e],[n,s]){const o=Re(i,n);return o===0?Re(e,s):o}class MD{constructor(e){this.Er=e,this.buffer=new Rt(mE),this.dr=0}Ar(){return++this.dr}Rr(e){const n=[e,this.Ar()];if(this.buffer.size<this.Er)this.buffer=this.buffer.add(n);else{const s=this.buffer.last();mE(n,s)<0&&(this.buffer=this.buffer.delete(s).add(n))}}get maxValue(){return this.buffer.last()[0]}}class xD{constructor(e,n,s){this.garbageCollector=e,this.asyncQueue=n,this.localStore=s,this.Vr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.mr(6e4)}stop(){this.Vr&&(this.Vr.cancel(),this.Vr=null)}get started(){return this.Vr!==null}mr(e){ae(dE,`Garbage collection scheduled in ${e}ms`),this.Vr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Vr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){Io(n)?ae(dE,"Ignoring IndexedDB error during garbage collection: ",n):await wo(n)}await this.mr(3e5)})}}class VD{constructor(e,n){this.gr=e,this.params=n}calculateTargetCount(e,n){return this.gr.pr(e).next(s=>Math.floor(n/100*s))}nthSequenceNumber(e,n){if(n===0)return W.resolve(Kh.le);const s=new MD(n);return this.gr.forEachTarget(e,o=>s.Rr(o.sequenceNumber)).next(()=>this.gr.yr(e,o=>s.Rr(o))).next(()=>s.maxValue)}removeTargets(e,n,s){return this.gr.removeTargets(e,n,s)}removeOrphanedDocuments(e,n){return this.gr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(ae("LruGarbageCollector","Garbage collection skipped; disabled"),W.resolve(fE)):this.getCacheSize(e).next(s=>s<this.params.cacheSizeCollectionThreshold?(ae("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),fE):this.wr(e,n))}getCacheSize(e){return this.gr.getCacheSize(e)}wr(e,n){let s,o,u,f,m,p,y;const T=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(S=>(S>this.params.maximumSequenceNumbersToCollect?(ae("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${S}`),o=this.params.maximumSequenceNumbersToCollect):o=S,f=Date.now(),this.nthSequenceNumber(e,o))).next(S=>(s=S,m=Date.now(),this.removeTargets(e,s,n))).next(S=>(u=S,p=Date.now(),this.removeOrphanedDocuments(e,s))).next(S=>(y=Date.now(),eo()<=Me.DEBUG&&ae("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${f-T}ms
	Determined least recently used ${o} in `+(m-f)+`ms
	Removed ${u} targets in `+(p-m)+`ms
	Removed ${S} documents in `+(y-p)+`ms
Total Duration: ${y-T}ms`),W.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:u,documentsRemoved:S})))}}function kD(i,e){return new VD(i,e)}/**
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
 */class PD{constructor(){this.changes=new aa(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Zt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?W.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class UD{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
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
 */class LD{constructor(e,n,s,o){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=o}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next(o=>(s=o,this.remoteDocumentCache.getEntry(e,n))).next(o=>(s!==null&&$l(s.mutation,o,bn.empty(),It.now()),o))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.getLocalViewOfDocuments(e,s,xe()).next(()=>s))}getLocalViewOfDocuments(e,n,s=xe()){const o=Qs();return this.populateOverlays(e,o,n).next(()=>this.computeViews(e,n,o,s).next(u=>{let f=Bl();return u.forEach((m,p)=>{f=f.insert(m,p.overlayedDocument)}),f}))}getOverlayedDocuments(e,n){const s=Qs();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,xe()))}populateOverlays(e,n,s){const o=[];return s.forEach(u=>{n.has(u)||o.push(u)}),this.documentOverlayCache.getOverlays(e,o).next(u=>{u.forEach((f,m)=>{n.set(f,m)})})}computeViews(e,n,s,o){let u=ar();const f=Ql(),m=function(){return Ql()}();return n.forEach((p,y)=>{const T=s.get(y.key);o.has(y.key)&&(T===void 0||T.mutation instanceof ls)?u=u.insert(y.key,y):T!==void 0?(f.set(y.key,T.mutation.getFieldMask()),$l(T.mutation,y,T.mutation.getFieldMask(),It.now())):f.set(y.key,bn.empty())}),this.recalculateAndSaveOverlays(e,u).next(p=>(p.forEach((y,T)=>f.set(y,T)),n.forEach((y,T)=>{var S;return m.set(y,new UD(T,(S=f.get(y))!==null&&S!==void 0?S:null))}),m))}recalculateAndSaveOverlays(e,n){const s=Ql();let o=new st((f,m)=>f-m),u=xe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(f=>{for(const m of f)m.keys().forEach(p=>{const y=n.get(p);if(y===null)return;let T=s.get(p)||bn.empty();T=m.applyToLocalView(y,T),s.set(p,T);const S=(o.get(m.batchId)||xe()).add(p);o=o.insert(m.batchId,S)})}).next(()=>{const f=[],m=o.getReverseIterator();for(;m.hasNext();){const p=m.getNext(),y=p.key,T=p.value,S=zA();T.forEach(w=>{if(!u.has(w)){const P=KA(n.get(w),s.get(w));P!==null&&S.set(w,P),u=u.add(w)}}),f.push(this.documentOverlayCache.saveOverlays(e,y,S))}return W.waitFor(f)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,n,s,o){return function(f){return me.isDocumentKey(f.path)&&f.collectionGroup===null&&f.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):kA(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s,o):this.getDocumentsMatchingCollectionQuery(e,n,s,o)}getNextDocuments(e,n,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,o).next(u=>{const f=o-u.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,o-u.size):W.resolve(Qs());let m=iu,p=u;return f.next(y=>W.forEach(y,(T,S)=>(m<S.largestBatchId&&(m=S.largestBatchId),u.get(T)?W.resolve():this.remoteDocumentCache.getEntry(e,T).next(w=>{p=p.insert(T,w)}))).next(()=>this.populateOverlays(e,y,u)).next(()=>this.computeViews(e,p,y,xe())).next(T=>({batchId:m,changes:jA(T)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new me(n)).next(s=>{let o=Bl();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o})}getDocumentsMatchingCollectionGroupQuery(e,n,s,o){const u=n.collectionGroup;let f=Bl();return this.indexManager.getCollectionParents(e,u).next(m=>W.forEach(m,p=>{const y=function(S,w){return new Ro(w,null,S.explicitOrderBy.slice(),S.filters.slice(),S.limit,S.limitType,S.startAt,S.endAt)}(n,p.child(u));return this.getDocumentsMatchingCollectionQuery(e,y,s,o).next(T=>{T.forEach((S,w)=>{f=f.insert(S,w)})})}).next(()=>f))}getDocumentsMatchingCollectionQuery(e,n,s,o){let u;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next(f=>(u=f,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,u,o))).next(f=>{u.forEach((p,y)=>{const T=y.getKey();f.get(T)===null&&(f=f.insert(T,Zt.newInvalidDocument(T)))});let m=Bl();return f.forEach((p,y)=>{const T=u.get(p);T!==void 0&&$l(T.mutation,y,bn.empty(),It.now()),Zh(n,y)&&(m=m.insert(p,y))}),m})}}/**
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
 */class jD{constructor(e){this.serializer=e,this.kr=new Map,this.qr=new Map}getBundleMetadata(e,n){return W.resolve(this.kr.get(n))}saveBundleMetadata(e,n){return this.kr.set(n.id,function(o){return{id:o.id,version:o.version,createTime:Ai(o.createTime)}}(n)),W.resolve()}getNamedQuery(e,n){return W.resolve(this.qr.get(n))}saveNamedQuery(e,n){return this.qr.set(n.name,function(o){return{name:o.name,query:CD(o.bundledQuery),readTime:Ai(o.readTime)}}(n)),W.resolve()}}/**
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
 */class zD{constructor(){this.overlays=new st(me.comparator),this.Qr=new Map}getOverlay(e,n){return W.resolve(this.overlays.get(n))}getOverlays(e,n){const s=Qs();return W.forEach(n,o=>this.getOverlay(e,o).next(u=>{u!==null&&s.set(o,u)})).next(()=>s)}saveOverlays(e,n,s){return s.forEach((o,u)=>{this.St(e,n,u)}),W.resolve()}removeOverlaysForBatchId(e,n,s){const o=this.Qr.get(s);return o!==void 0&&(o.forEach(u=>this.overlays=this.overlays.remove(u)),this.Qr.delete(s)),W.resolve()}getOverlaysForCollection(e,n,s){const o=Qs(),u=n.length+1,f=new me(n.child("")),m=this.overlays.getIteratorFrom(f);for(;m.hasNext();){const p=m.getNext().value,y=p.getKey();if(!n.isPrefixOf(y.path))break;y.path.length===u&&p.largestBatchId>s&&o.set(p.getKey(),p)}return W.resolve(o)}getOverlaysForCollectionGroup(e,n,s,o){let u=new st((y,T)=>y-T);const f=this.overlays.getIterator();for(;f.hasNext();){const y=f.getNext().value;if(y.getKey().getCollectionGroup()===n&&y.largestBatchId>s){let T=u.get(y.largestBatchId);T===null&&(T=Qs(),u=u.insert(y.largestBatchId,T)),T.set(y.getKey(),y)}}const m=Qs(),p=u.getIterator();for(;p.hasNext()&&(p.getNext().value.forEach((y,T)=>m.set(y,T)),!(m.size()>=o)););return W.resolve(m)}St(e,n,s){const o=this.overlays.get(s.key);if(o!==null){const f=this.Qr.get(o.largestBatchId).delete(s.key);this.Qr.set(o.largestBatchId,f)}this.overlays=this.overlays.insert(s.key,new sD(n,s));let u=this.Qr.get(n);u===void 0&&(u=xe(),this.Qr.set(n,u)),this.Qr.set(n,u.add(s.key))}}/**
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
 */class BD{constructor(){this.sessionToken=Ht.EMPTY_BYTE_STRING}getSessionToken(e){return W.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,W.resolve()}}/**
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
 */class Jp{constructor(){this.$r=new Rt(kt.Ur),this.Kr=new Rt(kt.Wr)}isEmpty(){return this.$r.isEmpty()}addReference(e,n){const s=new kt(e,n);this.$r=this.$r.add(s),this.Kr=this.Kr.add(s)}Gr(e,n){e.forEach(s=>this.addReference(s,n))}removeReference(e,n){this.zr(new kt(e,n))}jr(e,n){e.forEach(s=>this.removeReference(s,n))}Hr(e){const n=new me(new et([])),s=new kt(n,e),o=new kt(n,e+1),u=[];return this.Kr.forEachInRange([s,o],f=>{this.zr(f),u.push(f.key)}),u}Jr(){this.$r.forEach(e=>this.zr(e))}zr(e){this.$r=this.$r.delete(e),this.Kr=this.Kr.delete(e)}Yr(e){const n=new me(new et([])),s=new kt(n,e),o=new kt(n,e+1);let u=xe();return this.Kr.forEachInRange([s,o],f=>{u=u.add(f.key)}),u}containsKey(e){const n=new kt(e,0),s=this.$r.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class kt{constructor(e,n){this.key=e,this.Zr=n}static Ur(e,n){return me.comparator(e.key,n.key)||Re(e.Zr,n.Zr)}static Wr(e,n){return Re(e.Zr,n.Zr)||me.comparator(e.key,n.key)}}/**
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
 */class qD{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.nr=1,this.Xr=new Rt(kt.Ur)}checkEmpty(e){return W.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,o){const u=this.nr;this.nr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const f=new rD(u,n,s,o);this.mutationQueue.push(f);for(const m of o)this.Xr=this.Xr.add(new kt(m.key,u)),this.indexManager.addToCollectionParentIndex(e,m.key.path.popLast());return W.resolve(f)}lookupMutationBatch(e,n){return W.resolve(this.ei(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,o=this.ti(s),u=o<0?0:o;return W.resolve(this.mutationQueue.length>u?this.mutationQueue[u]:null)}getHighestUnacknowledgedBatchId(){return W.resolve(this.mutationQueue.length===0?Fp:this.nr-1)}getAllMutationBatches(e){return W.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new kt(n,0),o=new kt(n,Number.POSITIVE_INFINITY),u=[];return this.Xr.forEachInRange([s,o],f=>{const m=this.ei(f.Zr);u.push(m)}),W.resolve(u)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new Rt(Re);return n.forEach(o=>{const u=new kt(o,0),f=new kt(o,Number.POSITIVE_INFINITY);this.Xr.forEachInRange([u,f],m=>{s=s.add(m.Zr)})}),W.resolve(this.ni(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,o=s.length+1;let u=s;me.isDocumentKey(u)||(u=u.child(""));const f=new kt(new me(u),0);let m=new Rt(Re);return this.Xr.forEachWhile(p=>{const y=p.key.path;return!!s.isPrefixOf(y)&&(y.length===o&&(m=m.add(p.Zr)),!0)},f),W.resolve(this.ni(m))}ni(e){const n=[];return e.forEach(s=>{const o=this.ei(s);o!==null&&n.push(o)}),n}removeMutationBatch(e,n){Fe(this.ri(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Xr;return W.forEach(n.mutations,o=>{const u=new kt(o.key,n.batchId);return s=s.delete(u),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)}).next(()=>{this.Xr=s})}sr(e){}containsKey(e,n){const s=new kt(n,0),o=this.Xr.firstAfterOrEqual(s);return W.resolve(n.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,W.resolve()}ri(e,n){return this.ti(e)}ti(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}ei(e){const n=this.ti(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
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
 */class FD{constructor(e){this.ii=e,this.docs=function(){return new st(me.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,o=this.docs.get(s),u=o?o.size:0,f=this.ii(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:f}),this.size+=f-u,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return W.resolve(s?s.document.mutableCopy():Zt.newInvalidDocument(n))}getEntries(e,n){let s=ar();return n.forEach(o=>{const u=this.docs.get(o);s=s.insert(o,u?u.document.mutableCopy():Zt.newInvalidDocument(o))}),W.resolve(s)}getDocumentsMatchingQuery(e,n,s,o){let u=ar();const f=n.path,m=new me(f.child("__id-9223372036854775808__")),p=this.docs.getIteratorFrom(m);for(;p.hasNext();){const{key:y,value:{document:T}}=p.getNext();if(!f.isPrefixOf(y.path))break;y.path.length>f.length+1||vN(_N(T),s)<=0||(o.has(T.key)||Zh(n,T))&&(u=u.insert(T.key,T.mutableCopy()))}return W.resolve(u)}getAllFromCollectionGroup(e,n,s,o){_e(9500)}si(e,n){return W.forEach(this.docs,s=>n(s))}newChangeBuffer(e){return new HD(this)}getSize(e){return W.resolve(this.size)}}class HD extends PD{constructor(e){super(),this.Br=e}applyChanges(e){const n=[];return this.changes.forEach((s,o)=>{o.isValidDocument()?n.push(this.Br.addEntry(e,o)):this.Br.removeEntry(s)}),W.waitFor(n)}getFromCache(e,n){return this.Br.getEntry(e,n)}getAllFromCache(e,n){return this.Br.getEntries(e,n)}}/**
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
 */class GD{constructor(e){this.persistence=e,this.oi=new aa(n=>Kp(n),Yp),this.lastRemoteSnapshotVersion=Ae.min(),this.highestTargetId=0,this._i=0,this.ai=new Jp,this.targetCount=0,this.ui=vo.cr()}forEachTarget(e,n){return this.oi.forEach((s,o)=>n(o)),W.resolve()}getLastRemoteSnapshotVersion(e){return W.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return W.resolve(this._i)}allocateTargetId(e){return this.highestTargetId=this.ui.next(),W.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this._i&&(this._i=n),W.resolve()}Tr(e){this.oi.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.ui=new vo(n),this.highestTargetId=n),e.sequenceNumber>this._i&&(this._i=e.sequenceNumber)}addTargetData(e,n){return this.Tr(n),this.targetCount+=1,W.resolve()}updateTargetData(e,n){return this.Tr(n),W.resolve()}removeTargetData(e,n){return this.oi.delete(n.target),this.ai.Hr(n.targetId),this.targetCount-=1,W.resolve()}removeTargets(e,n,s){let o=0;const u=[];return this.oi.forEach((f,m)=>{m.sequenceNumber<=n&&s.get(m.targetId)===null&&(this.oi.delete(f),u.push(this.removeMatchingKeysForTargetId(e,m.targetId)),o++)}),W.waitFor(u).next(()=>o)}getTargetCount(e){return W.resolve(this.targetCount)}getTargetData(e,n){const s=this.oi.get(n)||null;return W.resolve(s)}addMatchingKeys(e,n,s){return this.ai.Gr(n,s),W.resolve()}removeMatchingKeys(e,n,s){this.ai.jr(n,s);const o=this.persistence.referenceDelegate,u=[];return o&&n.forEach(f=>{u.push(o.markPotentiallyOrphaned(e,f))}),W.waitFor(u)}removeMatchingKeysForTargetId(e,n){return this.ai.Hr(n),W.resolve()}getMatchingKeysForTargetId(e,n){const s=this.ai.Yr(n);return W.resolve(s)}containsKey(e,n){return W.resolve(this.ai.containsKey(n))}}/**
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
 */class sb{constructor(e,n){this.ci={},this.overlays={},this.li=new Kh(0),this.hi=!1,this.hi=!0,this.Pi=new BD,this.referenceDelegate=e(this),this.Ti=new GD(this),this.indexManager=new ND,this.remoteDocumentCache=function(o){return new FD(o)}(s=>this.referenceDelegate.Ii(s)),this.serializer=new RD(n),this.Ei=new jD(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.hi=!1,Promise.resolve()}get started(){return this.hi}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new zD,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.ci[e.toKey()];return s||(s=new qD(n,this.referenceDelegate),this.ci[e.toKey()]=s),s}getGlobalsCache(){return this.Pi}getTargetCache(){return this.Ti}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ei}runTransaction(e,n,s){ae("MemoryPersistence","Starting transaction:",e);const o=new KD(this.li.next());return this.referenceDelegate.di(),s(o).next(u=>this.referenceDelegate.Ai(o).next(()=>u)).toPromise().then(u=>(o.raiseOnCommittedEvent(),u))}Ri(e,n){return W.or(Object.values(this.ci).map(s=>()=>s.containsKey(e,n)))}}class KD extends EN{constructor(e){super(),this.currentSequenceNumber=e}}class eg{constructor(e){this.persistence=e,this.Vi=new Jp,this.mi=null}static fi(e){return new eg(e)}get gi(){if(this.mi)return this.mi;throw _e(60996)}addReference(e,n,s){return this.Vi.addReference(s,n),this.gi.delete(s.toString()),W.resolve()}removeReference(e,n,s){return this.Vi.removeReference(s,n),this.gi.add(s.toString()),W.resolve()}markPotentiallyOrphaned(e,n){return this.gi.add(n.toString()),W.resolve()}removeTarget(e,n){this.Vi.Hr(n.targetId).forEach(o=>this.gi.add(o.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next(o=>{o.forEach(u=>this.gi.add(u.toString()))}).next(()=>s.removeTargetData(e,n))}di(){this.mi=new Set}Ai(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return W.forEach(this.gi,s=>{const o=me.fromPath(s);return this.pi(e,o).next(u=>{u||n.removeEntry(o,Ae.min())})}).next(()=>(this.mi=null,n.apply(e)))}updateLimboDocument(e,n){return this.pi(e,n).next(s=>{s?this.gi.delete(n.toString()):this.gi.add(n.toString())})}Ii(e){return 0}pi(e,n){return W.or([()=>W.resolve(this.Vi.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ri(e,n)])}}class Oh{constructor(e,n){this.persistence=e,this.yi=new aa(s=>SN(s.path),(s,o)=>s.isEqual(o)),this.garbageCollector=kD(this,n)}static fi(e,n){return new Oh(e,n)}di(){}Ai(e){return W.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}pr(e){const n=this.br(e);return this.persistence.getTargetCache().getTargetCount(e).next(s=>n.next(o=>s+o))}br(e){let n=0;return this.yr(e,s=>{n++}).next(()=>n)}yr(e,n){return W.forEach(this.yi,(s,o)=>this.Dr(e,s,o).next(u=>u?W.resolve():n(o)))}removeTargets(e,n,s){return this.persistence.getTargetCache().removeTargets(e,n,s)}removeOrphanedDocuments(e,n){let s=0;const o=this.persistence.getRemoteDocumentCache(),u=o.newChangeBuffer();return o.si(e,f=>this.Dr(e,f,n).next(m=>{m||(s++,u.removeEntry(f,Ae.min()))})).next(()=>u.apply(e)).next(()=>s)}markPotentiallyOrphaned(e,n){return this.yi.set(n,e.currentSequenceNumber),W.resolve()}removeTarget(e,n){const s=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,n,s){return this.yi.set(s,e.currentSequenceNumber),W.resolve()}removeReference(e,n,s){return this.yi.set(s,e.currentSequenceNumber),W.resolve()}updateLimboDocument(e,n){return this.yi.set(n,e.currentSequenceNumber),W.resolve()}Ii(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=uh(e.data.value)),n}Dr(e,n,s){return W.or([()=>this.persistence.Ri(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const o=this.yi.get(n);return W.resolve(o!==void 0&&o>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class tg{constructor(e,n,s,o){this.targetId=e,this.fromCache=n,this.ds=s,this.As=o}static Rs(e,n){let s=xe(),o=xe();for(const u of n.docChanges)switch(u.type){case 0:s=s.add(u.doc.key);break;case 1:o=o.add(u.doc.key)}return new tg(e,n.fromCache,s,o)}}/**
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
 */class YD{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class QD{constructor(){this.Vs=!1,this.fs=!1,this.gs=100,this.ps=function(){return qI()?8:AN(en())>0?6:4}()}initialize(e,n){this.ys=e,this.indexManager=n,this.Vs=!0}getDocumentsMatchingQuery(e,n,s,o){const u={result:null};return this.ws(e,n).next(f=>{u.result=f}).next(()=>{if(!u.result)return this.bs(e,n,o,s).next(f=>{u.result=f})}).next(()=>{if(u.result)return;const f=new YD;return this.Ss(e,n,f).next(m=>{if(u.result=m,this.fs)return this.Ds(e,n,f,m.size)})}).next(()=>u.result)}Ds(e,n,s,o){return s.documentReadCount<this.gs?(eo()<=Me.DEBUG&&ae("QueryEngine","SDK will not create cache indexes for query:",to(n),"since it only creates cache indexes for collection contains","more than or equal to",this.gs,"documents"),W.resolve()):(eo()<=Me.DEBUG&&ae("QueryEngine","Query:",to(n),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.ps*o?(eo()<=Me.DEBUG&&ae("QueryEngine","The SDK decides to create cache indexes for query:",to(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ei(n))):W.resolve())}ws(e,n){if(nE(n))return W.resolve(null);let s=Ei(n);return this.indexManager.getIndexType(e,s).next(o=>o===0?null:(n.limit!==null&&o===1&&(n=up(n,null,"F"),s=Ei(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(u=>{const f=xe(...u);return this.ys.getDocuments(e,f).next(m=>this.indexManager.getMinOffset(e,s).next(p=>{const y=this.vs(n,m);return this.Cs(n,y,f,p.readTime)?this.ws(e,up(n,null,"F")):this.Fs(e,y,n,p)}))})))}bs(e,n,s,o){return nE(n)||o.isEqual(Ae.min())?W.resolve(null):this.ys.getDocuments(e,s).next(u=>{const f=this.vs(n,u);return this.Cs(n,f,s,o)?W.resolve(null):(eo()<=Me.DEBUG&&ae("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),to(n)),this.Fs(e,f,n,yN(o,iu)).next(m=>m))})}vs(e,n){let s=new Rt(UA(e));return n.forEach((o,u)=>{Zh(e,u)&&(s=s.add(u))}),s}Cs(e,n,s,o){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const u=e.limitType==="F"?n.last():n.first();return!!u&&(u.hasPendingWrites||u.version.compareTo(o)>0)}Ss(e,n,s){return eo()<=Me.DEBUG&&ae("QueryEngine","Using full collection scan to execute query:",to(n)),this.ys.getDocumentsMatchingQuery(e,n,Xr.min(),s)}Fs(e,n,s,o){return this.ys.getDocumentsMatchingQuery(e,s,o).next(u=>(n.forEach(f=>{u=u.insert(f.key,f)}),u))}}/**
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
 */const ng="LocalStore",$D=3e8;class XD{constructor(e,n,s,o){this.persistence=e,this.Ms=n,this.serializer=o,this.xs=new st(Re),this.Os=new aa(u=>Kp(u),Yp),this.Ns=new Map,this.Bs=e.getRemoteDocumentCache(),this.Ti=e.getTargetCache(),this.Ei=e.getBundleCache(),this.Ls(s)}Ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new LD(this.Bs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Bs.setIndexManager(this.indexManager),this.Ms.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.xs))}}function ZD(i,e,n,s){return new XD(i,e,n,s)}async function ab(i,e){const n=be(i);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let o;return n.mutationQueue.getAllMutationBatches(s).next(u=>(o=u,n.Ls(e),n.mutationQueue.getAllMutationBatches(s))).next(u=>{const f=[],m=[];let p=xe();for(const y of o){f.push(y.batchId);for(const T of y.mutations)p=p.add(T.key)}for(const y of u){m.push(y.batchId);for(const T of y.mutations)p=p.add(T.key)}return n.localDocuments.getDocuments(s,p).next(y=>({ks:y,removedBatchIds:f,addedBatchIds:m}))})})}function WD(i,e){const n=be(i);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const o=e.batch.keys(),u=n.Bs.newChangeBuffer({trackRemovals:!0});return function(m,p,y,T){const S=y.batch,w=S.keys();let P=W.resolve();return w.forEach(k=>{P=P.next(()=>T.getEntry(p,k)).next(K=>{const q=y.docVersions.get(k);Fe(q!==null,48541),K.version.compareTo(q)<0&&(S.applyToRemoteDocument(K,y),K.isValidDocument()&&(K.setReadTime(y.commitVersion),T.addEntry(K)))})}),P.next(()=>m.mutationQueue.removeMutationBatch(p,S))}(n,s,e,u).next(()=>u.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,o,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(m){let p=xe();for(let y=0;y<m.mutationResults.length;++y)m.mutationResults[y].transformResults.length>0&&(p=p.add(m.batch.mutations[y].key));return p}(e))).next(()=>n.localDocuments.getDocuments(s,o))})}function ob(i){const e=be(i);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ti.getLastRemoteSnapshotVersion(n))}function JD(i,e){const n=be(i),s=e.snapshotVersion;let o=n.xs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",u=>{const f=n.Bs.newChangeBuffer({trackRemovals:!0});o=n.xs;const m=[];e.targetChanges.forEach((T,S)=>{const w=o.get(S);if(!w)return;m.push(n.Ti.removeMatchingKeys(u,T.removedDocuments,S).next(()=>n.Ti.addMatchingKeys(u,T.addedDocuments,S)));let P=w.withSequenceNumber(u.currentSequenceNumber);e.targetMismatches.get(S)!==null?P=P.withResumeToken(Ht.EMPTY_BYTE_STRING,Ae.min()).withLastLimboFreeSnapshotVersion(Ae.min()):T.resumeToken.approximateByteSize()>0&&(P=P.withResumeToken(T.resumeToken,s)),o=o.insert(S,P),function(K,q,ne){return K.resumeToken.approximateByteSize()===0||q.snapshotVersion.toMicroseconds()-K.snapshotVersion.toMicroseconds()>=$D?!0:ne.addedDocuments.size+ne.modifiedDocuments.size+ne.removedDocuments.size>0}(w,P,T)&&m.push(n.Ti.updateTargetData(u,P))});let p=ar(),y=xe();if(e.documentUpdates.forEach(T=>{e.resolvedLimboDocuments.has(T)&&m.push(n.persistence.referenceDelegate.updateLimboDocument(u,T))}),m.push(e2(u,f,e.documentUpdates).next(T=>{p=T.qs,y=T.Qs})),!s.isEqual(Ae.min())){const T=n.Ti.getLastRemoteSnapshotVersion(u).next(S=>n.Ti.setTargetsMetadata(u,u.currentSequenceNumber,s));m.push(T)}return W.waitFor(m).next(()=>f.apply(u)).next(()=>n.localDocuments.getLocalViewOfDocuments(u,p,y)).next(()=>p)}).then(u=>(n.xs=o,u))}function e2(i,e,n){let s=xe(),o=xe();return n.forEach(u=>s=s.add(u)),e.getEntries(i,s).next(u=>{let f=ar();return n.forEach((m,p)=>{const y=u.get(m);p.isFoundDocument()!==y.isFoundDocument()&&(o=o.add(m)),p.isNoDocument()&&p.version.isEqual(Ae.min())?(e.removeEntry(m,p.readTime),f=f.insert(m,p)):!y.isValidDocument()||p.version.compareTo(y.version)>0||p.version.compareTo(y.version)===0&&y.hasPendingWrites?(e.addEntry(p),f=f.insert(m,p)):ae(ng,"Ignoring outdated watch update for ",m,". Current version:",y.version," Watch version:",p.version)}),{qs:f,Qs:o}})}function t2(i,e){const n=be(i);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=Fp),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function n2(i,e){const n=be(i);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let o;return n.Ti.getTargetData(s,e).next(u=>u?(o=u,W.resolve(o)):n.Ti.allocateTargetId(s).next(f=>(o=new Hr(e,f,"TargetPurposeListen",s.currentSequenceNumber),n.Ti.addTargetData(s,o).next(()=>o))))}).then(s=>{const o=n.xs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(n.xs=n.xs.insert(s.targetId,s),n.Os.set(e,s.targetId)),s})}async function mp(i,e,n){const s=be(i),o=s.xs.get(e),u=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",u,f=>s.persistence.referenceDelegate.removeTarget(f,o))}catch(f){if(!Io(f))throw f;ae(ng,`Failed to update sequence numbers for target ${e}: ${f}`)}s.xs=s.xs.remove(e),s.Os.delete(o.target)}function pE(i,e,n){const s=be(i);let o=Ae.min(),u=xe();return s.persistence.runTransaction("Execute query","readwrite",f=>function(p,y,T){const S=be(p),w=S.Os.get(T);return w!==void 0?W.resolve(S.xs.get(w)):S.Ti.getTargetData(y,T)}(s,f,Ei(e)).next(m=>{if(m)return o=m.lastLimboFreeSnapshotVersion,s.Ti.getMatchingKeysForTargetId(f,m.targetId).next(p=>{u=p})}).next(()=>s.Ms.getDocumentsMatchingQuery(f,e,n?o:Ae.min(),n?u:xe())).next(m=>(i2(s,FN(e),m),{documents:m,$s:u})))}function i2(i,e,n){let s=i.Ns.get(e)||Ae.min();n.forEach((o,u)=>{u.readTime.compareTo(s)>0&&(s=u.readTime)}),i.Ns.set(e,s)}class gE{constructor(){this.activeTargetIds=$N()}js(e){this.activeTargetIds=this.activeTargetIds.add(e)}Hs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}zs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class r2{constructor(){this.xo=new gE,this.Oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e,n=!0){return n&&this.xo.js(e),this.Oo[e]||"not-current"}updateQueryState(e,n,s){this.Oo[e]=n}removeLocalQueryTarget(e){this.xo.Hs(e)}isLocalQueryTarget(e){return this.xo.activeTargetIds.has(e)}clearQueryState(e){delete this.Oo[e]}getAllActiveQueryTargets(){return this.xo.activeTargetIds}isActiveQueryTarget(e){return this.xo.activeTargetIds.has(e)}start(){return this.xo=new gE,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class s2{No(e){}shutdown(){}}/**
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
 */const yE="ConnectivityMonitor";class _E{constructor(){this.Bo=()=>this.Lo(),this.ko=()=>this.qo(),this.Qo=[],this.$o()}No(e){this.Qo.push(e)}shutdown(){window.removeEventListener("online",this.Bo),window.removeEventListener("offline",this.ko)}$o(){window.addEventListener("online",this.Bo),window.addEventListener("offline",this.ko)}Lo(){ae(yE,"Network connectivity changed: AVAILABLE");for(const e of this.Qo)e(0)}qo(){ae(yE,"Network connectivity changed: UNAVAILABLE");for(const e of this.Qo)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let eh=null;function pp(){return eh===null?eh=function(){return 268435456+Math.round(2147483648*Math.random())}():eh++,"0x"+eh.toString(16)}/**
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
 */const Vm="RestConnection",a2={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class o2{get Uo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Ko=n+"://"+e.host,this.Wo=`projects/${s}/databases/${o}`,this.Go=this.databaseId.database===wh?`project_id=${s}`:`project_id=${s}&database_id=${o}`}zo(e,n,s,o,u){const f=pp(),m=this.jo(e,n.toUriEncodedString());ae(Vm,`Sending RPC '${e}' ${f}:`,m,s);const p={"google-cloud-resource-prefix":this.Wo,"x-goog-request-params":this.Go};this.Ho(p,o,u);const{host:y}=new URL(m),T=ra(y);return this.Jo(e,m,p,s,T).then(S=>(ae(Vm,`Received RPC '${e}' ${f}: `,S),S),S=>{throw po(Vm,`RPC '${e}' ${f} failed with error: `,S,"url: ",m,"request:",s),S})}Yo(e,n,s,o,u,f){return this.zo(e,n,s,o,u)}Ho(e,n,s){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+So}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((o,u)=>e[u]=o),s&&s.headers.forEach((o,u)=>e[u]=o)}jo(e,n){const s=a2[e];return`${this.Ko}/v1/${n}:${s}`}terminate(){}}/**
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
 */class l2{constructor(e){this.Zo=e.Zo,this.Xo=e.Xo}e_(e){this.t_=e}n_(e){this.r_=e}i_(e){this.s_=e}onMessage(e){this.o_=e}close(){this.Xo()}send(e){this.Zo(e)}__(){this.t_()}a_(){this.r_()}u_(e){this.s_(e)}c_(e){this.o_(e)}}/**
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
 */const Qt="WebChannelConnection";class u2 extends o2{constructor(e){super(e),this.l_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,n,s,o,u){const f=pp();return new Promise((m,p)=>{const y=new cA;y.setWithCredentials(!0),y.listenOnce(hA.COMPLETE,()=>{try{switch(y.getLastErrorCode()){case lh.NO_ERROR:const S=y.getResponseJson();ae(Qt,`XHR for RPC '${e}' ${f} received:`,JSON.stringify(S)),m(S);break;case lh.TIMEOUT:ae(Qt,`RPC '${e}' ${f} timed out`),p(new oe(Z.DEADLINE_EXCEEDED,"Request time out"));break;case lh.HTTP_ERROR:const w=y.getStatus();if(ae(Qt,`RPC '${e}' ${f} failed with status:`,w,"response text:",y.getResponseText()),w>0){let P=y.getResponseJson();Array.isArray(P)&&(P=P[0]);const k=P?.error;if(k&&k.status&&k.message){const K=function(ne){const se=ne.toLowerCase().replace(/_/g,"-");return Object.values(Z).indexOf(se)>=0?se:Z.UNKNOWN}(k.status);p(new oe(K,k.message))}else p(new oe(Z.UNKNOWN,"Server responded with status "+y.getStatus()))}else p(new oe(Z.UNAVAILABLE,"Connection failed."));break;default:_e(9055,{h_:e,streamId:f,P_:y.getLastErrorCode(),T_:y.getLastError()})}}finally{ae(Qt,`RPC '${e}' ${f} completed.`)}});const T=JSON.stringify(o);ae(Qt,`RPC '${e}' ${f} sending request:`,o),y.send(n,"POST",T,s,15)})}I_(e,n,s){const o=pp(),u=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],f=mA(),m=dA(),p={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},y=this.longPollingOptions.timeoutSeconds;y!==void 0&&(p.longPollingTimeout=Math.round(1e3*y)),this.useFetchStreams&&(p.useFetchStreams=!0),this.Ho(p.initMessageHeaders,n,s),p.encodeInitMessageHeaders=!0;const T=u.join("");ae(Qt,`Creating RPC '${e}' stream ${o}: ${T}`,p);const S=f.createWebChannel(T,p);this.E_(S);let w=!1,P=!1;const k=new l2({Zo:q=>{P?ae(Qt,`Not sending because RPC '${e}' stream ${o} is closed:`,q):(w||(ae(Qt,`Opening RPC '${e}' stream ${o} transport.`),S.open(),w=!0),ae(Qt,`RPC '${e}' stream ${o} sending:`,q),S.send(q))},Xo:()=>S.close()}),K=(q,ne,se)=>{q.listen(ne,le=>{try{se(le)}catch(fe){setTimeout(()=>{throw fe},0)}})};return K(S,zl.EventType.OPEN,()=>{P||(ae(Qt,`RPC '${e}' stream ${o} transport opened.`),k.__())}),K(S,zl.EventType.CLOSE,()=>{P||(P=!0,ae(Qt,`RPC '${e}' stream ${o} transport closed`),k.u_(),this.d_(S))}),K(S,zl.EventType.ERROR,q=>{P||(P=!0,po(Qt,`RPC '${e}' stream ${o} transport errored. Name:`,q.name,"Message:",q.message),k.u_(new oe(Z.UNAVAILABLE,"The operation could not be completed")))}),K(S,zl.EventType.MESSAGE,q=>{var ne;if(!P){const se=q.data[0];Fe(!!se,16349);const le=se,fe=le?.error||((ne=le[0])===null||ne===void 0?void 0:ne.error);if(fe){ae(Qt,`RPC '${e}' stream ${o} received error:`,fe);const de=fe.status;let Se=function(C){const D=vt[C];if(D!==void 0)return QA(D)}(de),V=fe.message;Se===void 0&&(Se=Z.INTERNAL,V="Unknown error status: "+de+" with message "+fe.message),P=!0,k.u_(new oe(Se,V)),S.close()}else ae(Qt,`RPC '${e}' stream ${o} received:`,se),k.c_(se)}}),K(m,fA.STAT_EVENT,q=>{q.stat===np.PROXY?ae(Qt,`RPC '${e}' stream ${o} detected buffering proxy`):q.stat===np.NOPROXY&&ae(Qt,`RPC '${e}' stream ${o} detected no buffering proxy`)}),setTimeout(()=>{k.a_()},0),k}terminate(){this.l_.forEach(e=>e.close()),this.l_=[]}E_(e){this.l_.push(e)}d_(e){this.l_=this.l_.filter(n=>n===e)}}function km(){return typeof document<"u"?document:null}/**
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
 */function tf(i){return new dD(i,!0)}/**
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
 */class lb{constructor(e,n,s=1e3,o=1.5,u=6e4){this.xi=e,this.timerId=n,this.A_=s,this.R_=o,this.V_=u,this.m_=0,this.f_=null,this.g_=Date.now(),this.reset()}reset(){this.m_=0}p_(){this.m_=this.V_}y_(e){this.cancel();const n=Math.floor(this.m_+this.w_()),s=Math.max(0,Date.now()-this.g_),o=Math.max(0,n-s);o>0&&ae("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.m_} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.f_=this.xi.enqueueAfterDelay(this.timerId,o,()=>(this.g_=Date.now(),e())),this.m_*=this.R_,this.m_<this.A_&&(this.m_=this.A_),this.m_>this.V_&&(this.m_=this.V_)}b_(){this.f_!==null&&(this.f_.skipDelay(),this.f_=null)}cancel(){this.f_!==null&&(this.f_.cancel(),this.f_=null)}w_(){return(Math.random()-.5)*this.m_}}/**
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
 */const vE="PersistentStream";class ub{constructor(e,n,s,o,u,f,m,p){this.xi=e,this.S_=s,this.D_=o,this.connection=u,this.authCredentialsProvider=f,this.appCheckCredentialsProvider=m,this.listener=p,this.state=0,this.v_=0,this.C_=null,this.F_=null,this.stream=null,this.M_=0,this.x_=new lb(e,n)}O_(){return this.state===1||this.state===5||this.N_()}N_(){return this.state===2||this.state===3}start(){this.M_=0,this.state!==4?this.auth():this.B_()}async stop(){this.O_()&&await this.close(0)}L_(){this.state=0,this.x_.reset()}k_(){this.N_()&&this.C_===null&&(this.C_=this.xi.enqueueAfterDelay(this.S_,6e4,()=>this.q_()))}Q_(e){this.U_(),this.stream.send(e)}async q_(){if(this.N_())return this.close(0)}U_(){this.C_&&(this.C_.cancel(),this.C_=null)}K_(){this.F_&&(this.F_.cancel(),this.F_=null)}async close(e,n){this.U_(),this.K_(),this.x_.cancel(),this.v_++,e!==4?this.x_.reset():n&&n.code===Z.RESOURCE_EXHAUSTED?(sr(n.toString()),sr("Using maximum backoff delay to prevent overloading the backend."),this.x_.p_()):n&&n.code===Z.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.i_(n)}W_(){}auth(){this.state=1;const e=this.G_(this.v_),n=this.v_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,o])=>{this.v_===n&&this.z_(s,o)},s=>{e(()=>{const o=new oe(Z.UNKNOWN,"Fetching auth token failed: "+s.message);return this.j_(o)})})}z_(e,n){const s=this.G_(this.v_);this.stream=this.H_(e,n),this.stream.e_(()=>{s(()=>this.listener.e_())}),this.stream.n_(()=>{s(()=>(this.state=2,this.F_=this.xi.enqueueAfterDelay(this.D_,1e4,()=>(this.N_()&&(this.state=3),Promise.resolve())),this.listener.n_()))}),this.stream.i_(o=>{s(()=>this.j_(o))}),this.stream.onMessage(o=>{s(()=>++this.M_==1?this.J_(o):this.onNext(o))})}B_(){this.state=5,this.x_.y_(async()=>{this.state=0,this.start()})}j_(e){return ae(vE,`close with error: ${e}`),this.stream=null,this.close(4,e)}G_(e){return n=>{this.xi.enqueueAndForget(()=>this.v_===e?n():(ae(vE,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class c2 extends ub{constructor(e,n,s,o,u,f){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,o,f),this.serializer=u}H_(e,n){return this.connection.I_("Listen",e,n)}J_(e){return this.onNext(e)}onNext(e){this.x_.reset();const n=gD(this.serializer,e),s=function(u){if(!("targetChange"in u))return Ae.min();const f=u.targetChange;return f.targetIds&&f.targetIds.length?Ae.min():f.readTime?Ai(f.readTime):Ae.min()}(e);return this.listener.Y_(n,s)}Z_(e){const n={};n.database=dp(this.serializer),n.addTarget=function(u,f){let m;const p=f.target;if(m=op(p)?{documents:vD(u,p)}:{query:TD(u,p).gt},m.targetId=f.targetId,f.resumeToken.approximateByteSize()>0){m.resumeToken=ZA(u,f.resumeToken);const y=cp(u,f.expectedCount);y!==null&&(m.expectedCount=y)}else if(f.snapshotVersion.compareTo(Ae.min())>0){m.readTime=Dh(u,f.snapshotVersion.toTimestamp());const y=cp(u,f.expectedCount);y!==null&&(m.expectedCount=y)}return m}(this.serializer,e);const s=AD(this.serializer,e);s&&(n.labels=s),this.Q_(n)}X_(e){const n={};n.database=dp(this.serializer),n.removeTarget=e,this.Q_(n)}}class h2 extends ub{constructor(e,n,s,o,u,f){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,o,f),this.serializer=u}get ea(){return this.M_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.ea&&this.ta([])}H_(e,n){return this.connection.I_("Write",e,n)}J_(e){return Fe(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Fe(!e.writeResults||e.writeResults.length===0,55816),this.listener.na()}onNext(e){Fe(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.x_.reset();const n=_D(e.writeResults,e.commitTime),s=Ai(e.commitTime);return this.listener.ra(s,n)}ia(){const e={};e.database=dp(this.serializer),this.Q_(e)}ta(e){const n={streamToken:this.lastStreamToken,writes:e.map(s=>yD(this.serializer,s))};this.Q_(n)}}/**
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
 */class f2{}class d2 extends f2{constructor(e,n,s,o){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=o,this.sa=!1}oa(){if(this.sa)throw new oe(Z.FAILED_PRECONDITION,"The client has already been terminated.")}zo(e,n,s,o){return this.oa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([u,f])=>this.connection.zo(e,hp(n,s),o,u,f)).catch(u=>{throw u.name==="FirebaseError"?(u.code===Z.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),u):new oe(Z.UNKNOWN,u.toString())})}Yo(e,n,s,o,u){return this.oa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([f,m])=>this.connection.Yo(e,hp(n,s),o,f,m,u)).catch(f=>{throw f.name==="FirebaseError"?(f.code===Z.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),f):new oe(Z.UNKNOWN,f.toString())})}terminate(){this.sa=!0,this.connection.terminate()}}class m2{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this._a=0,this.aa=null,this.ua=!0}ca(){this._a===0&&(this.la("Unknown"),this.aa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.aa=null,this.ha("Backend didn't respond within 10 seconds."),this.la("Offline"),Promise.resolve())))}Pa(e){this.state==="Online"?this.la("Unknown"):(this._a++,this._a>=1&&(this.Ta(),this.ha(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.la("Offline")))}set(e){this.Ta(),this._a=0,e==="Online"&&(this.ua=!1),this.la(e)}la(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ha(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.ua?(sr(n),this.ua=!1):ae("OnlineStateTracker",n)}Ta(){this.aa!==null&&(this.aa.cancel(),this.aa=null)}}/**
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
 */const ta="RemoteStore";class p2{constructor(e,n,s,o,u){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.Ia=[],this.Ea=new Map,this.da=new Set,this.Aa=[],this.Ra=u,this.Ra.No(f=>{s.enqueueAndForget(async()=>{oa(this)&&(ae(ta,"Restarting streams for network reachability change."),await async function(p){const y=be(p);y.da.add(4),await vu(y),y.Va.set("Unknown"),y.da.delete(4),await nf(y)}(this))})}),this.Va=new m2(s,o)}}async function nf(i){if(oa(i))for(const e of i.Aa)await e(!0)}async function vu(i){for(const e of i.Aa)await e(!1)}function cb(i,e){const n=be(i);n.Ea.has(e.targetId)||(n.Ea.set(e.targetId,e),ag(n)?sg(n):Co(n).N_()&&rg(n,e))}function ig(i,e){const n=be(i),s=Co(n);n.Ea.delete(e),s.N_()&&hb(n,e),n.Ea.size===0&&(s.N_()?s.k_():oa(n)&&n.Va.set("Unknown"))}function rg(i,e){if(i.ma.Ke(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Ae.min())>0){const n=i.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Co(i).Z_(e)}function hb(i,e){i.ma.Ke(e),Co(i).X_(e)}function sg(i){i.ma=new uD({getRemoteKeysForTarget:e=>i.remoteSyncer.getRemoteKeysForTarget(e),Rt:e=>i.Ea.get(e)||null,Pt:()=>i.datastore.serializer.databaseId}),Co(i).start(),i.Va.ca()}function ag(i){return oa(i)&&!Co(i).O_()&&i.Ea.size>0}function oa(i){return be(i).da.size===0}function fb(i){i.ma=void 0}async function g2(i){i.Va.set("Online")}async function y2(i){i.Ea.forEach((e,n)=>{rg(i,e)})}async function _2(i,e){fb(i),ag(i)?(i.Va.Pa(e),sg(i)):i.Va.set("Unknown")}async function v2(i,e,n){if(i.Va.set("Online"),e instanceof XA&&e.state===2&&e.cause)try{await async function(o,u){const f=u.cause;for(const m of u.targetIds)o.Ea.has(m)&&(await o.remoteSyncer.rejectListen(m,f),o.Ea.delete(m),o.ma.removeTarget(m))}(i,e)}catch(s){ae(ta,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Mh(i,s)}else if(e instanceof fh?i.ma.Xe(e):e instanceof $A?i.ma.ot(e):i.ma.nt(e),!n.isEqual(Ae.min()))try{const s=await ob(i.localStore);n.compareTo(s)>=0&&await function(u,f){const m=u.ma.It(f);return m.targetChanges.forEach((p,y)=>{if(p.resumeToken.approximateByteSize()>0){const T=u.Ea.get(y);T&&u.Ea.set(y,T.withResumeToken(p.resumeToken,f))}}),m.targetMismatches.forEach((p,y)=>{const T=u.Ea.get(p);if(!T)return;u.Ea.set(p,T.withResumeToken(Ht.EMPTY_BYTE_STRING,T.snapshotVersion)),hb(u,p);const S=new Hr(T.target,p,y,T.sequenceNumber);rg(u,S)}),u.remoteSyncer.applyRemoteEvent(m)}(i,n)}catch(s){ae(ta,"Failed to raise snapshot:",s),await Mh(i,s)}}async function Mh(i,e,n){if(!Io(e))throw e;i.da.add(1),await vu(i),i.Va.set("Offline"),n||(n=()=>ob(i.localStore)),i.asyncQueue.enqueueRetryable(async()=>{ae(ta,"Retrying IndexedDB access"),await n(),i.da.delete(1),await nf(i)})}function db(i,e){return e().catch(n=>Mh(i,n,e))}async function rf(i){const e=be(i),n=es(e);let s=e.Ia.length>0?e.Ia[e.Ia.length-1].batchId:Fp;for(;T2(e);)try{const o=await t2(e.localStore,s);if(o===null){e.Ia.length===0&&n.k_();break}s=o.batchId,E2(e,o)}catch(o){await Mh(e,o)}mb(e)&&pb(e)}function T2(i){return oa(i)&&i.Ia.length<10}function E2(i,e){i.Ia.push(e);const n=es(i);n.N_()&&n.ea&&n.ta(e.mutations)}function mb(i){return oa(i)&&!es(i).O_()&&i.Ia.length>0}function pb(i){es(i).start()}async function A2(i){es(i).ia()}async function b2(i){const e=es(i);for(const n of i.Ia)e.ta(n.mutations)}async function S2(i,e,n){const s=i.Ia.shift(),o=Xp.from(s,e,n);await db(i,()=>i.remoteSyncer.applySuccessfulWrite(o)),await rf(i)}async function w2(i,e){e&&es(i).ea&&await async function(s,o){if(function(f){return oD(f)&&f!==Z.ABORTED}(o.code)){const u=s.Ia.shift();es(s).L_(),await db(s,()=>s.remoteSyncer.rejectFailedWrite(u.batchId,o)),await rf(s)}}(i,e),mb(i)&&pb(i)}async function TE(i,e){const n=be(i);n.asyncQueue.verifyOperationInProgress(),ae(ta,"RemoteStore received new credentials");const s=oa(n);n.da.add(3),await vu(n),s&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.da.delete(3),await nf(n)}async function I2(i,e){const n=be(i);e?(n.da.delete(2),await nf(n)):e||(n.da.add(2),await vu(n),n.Va.set("Unknown"))}function Co(i){return i.fa||(i.fa=function(n,s,o){const u=be(n);return u.oa(),new c2(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)}(i.datastore,i.asyncQueue,{e_:g2.bind(null,i),n_:y2.bind(null,i),i_:_2.bind(null,i),Y_:v2.bind(null,i)}),i.Aa.push(async e=>{e?(i.fa.L_(),ag(i)?sg(i):i.Va.set("Unknown")):(await i.fa.stop(),fb(i))})),i.fa}function es(i){return i.ga||(i.ga=function(n,s,o){const u=be(n);return u.oa(),new h2(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)}(i.datastore,i.asyncQueue,{e_:()=>Promise.resolve(),n_:A2.bind(null,i),i_:w2.bind(null,i),na:b2.bind(null,i),ra:S2.bind(null,i)}),i.Aa.push(async e=>{e?(i.ga.L_(),await rf(i)):(await i.ga.stop(),i.Ia.length>0&&(ae(ta,`Stopping write stream with ${i.Ia.length} pending writes`),i.Ia=[]))})),i.ga}/**
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
 */class og{constructor(e,n,s,o,u){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=o,this.removalCallback=u,this.deferred=new er,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(f=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,s,o,u){const f=Date.now()+s,m=new og(e,n,f,o,u);return m.start(s),m}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new oe(Z.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function lg(i,e){if(sr("AsyncQueue",`${e}: ${i}`),Io(i))return new oe(Z.UNAVAILABLE,`${e}: ${i}`);throw i}/**
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
 */class co{static emptySet(e){return new co(e.comparator)}constructor(e){this.comparator=e?(n,s)=>e(n,s)||me.comparator(n.key,s.key):(n,s)=>me.comparator(n.key,s.key),this.keyedMap=Bl(),this.sortedSet=new st(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,s)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof co)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const o=n.getNext().key,u=s.getNext().key;if(!o.isEqual(u))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new co;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
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
 */class EE{constructor(){this.pa=new st(me.comparator)}track(e){const n=e.doc.key,s=this.pa.get(n);s?e.type!==0&&s.type===3?this.pa=this.pa.insert(n,e):e.type===3&&s.type!==1?this.pa=this.pa.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.pa=this.pa.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.pa=this.pa.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.pa=this.pa.remove(n):e.type===1&&s.type===2?this.pa=this.pa.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.pa=this.pa.insert(n,{type:2,doc:e.doc}):_e(63341,{Vt:e,ya:s}):this.pa=this.pa.insert(n,e)}wa(){const e=[];return this.pa.inorderTraversal((n,s)=>{e.push(s)}),e}}class To{constructor(e,n,s,o,u,f,m,p,y){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=u,this.fromCache=f,this.syncStateChanged=m,this.excludesMetadataChanges=p,this.hasCachedResults=y}static fromInitialDocuments(e,n,s,o,u){const f=[];return n.forEach(m=>{f.push({type:0,doc:m})}),new To(e,n,co.emptySet(n),f,s,o,!0,!1,u)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Xh(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let o=0;o<n.length;o++)if(n[o].type!==s[o].type||!n[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
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
 */class R2{constructor(){this.ba=void 0,this.Sa=[]}Da(){return this.Sa.some(e=>e.va())}}class C2{constructor(){this.queries=AE(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,s){const o=be(n),u=o.queries;o.queries=AE(),u.forEach((f,m)=>{for(const p of m.Sa)p.onError(s)})})(this,new oe(Z.ABORTED,"Firestore shutting down"))}}function AE(){return new aa(i=>PA(i),Xh)}async function ug(i,e){const n=be(i);let s=3;const o=e.query;let u=n.queries.get(o);u?!u.Da()&&e.va()&&(s=2):(u=new R2,s=e.va()?0:1);try{switch(s){case 0:u.ba=await n.onListen(o,!0);break;case 1:u.ba=await n.onListen(o,!1);break;case 2:await n.onFirstRemoteStoreListen(o)}}catch(f){const m=lg(f,`Initialization of query '${to(e.query)}' failed`);return void e.onError(m)}n.queries.set(o,u),u.Sa.push(e),e.Fa(n.onlineState),u.ba&&e.Ma(u.ba)&&hg(n)}async function cg(i,e){const n=be(i),s=e.query;let o=3;const u=n.queries.get(s);if(u){const f=u.Sa.indexOf(e);f>=0&&(u.Sa.splice(f,1),u.Sa.length===0?o=e.va()?0:1:!u.Da()&&e.va()&&(o=2))}switch(o){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function N2(i,e){const n=be(i);let s=!1;for(const o of e){const u=o.query,f=n.queries.get(u);if(f){for(const m of f.Sa)m.Ma(o)&&(s=!0);f.ba=o}}s&&hg(n)}function D2(i,e,n){const s=be(i),o=s.queries.get(e);if(o)for(const u of o.Sa)u.onError(n);s.queries.delete(e)}function hg(i){i.Ca.forEach(e=>{e.next()})}var gp,bE;(bE=gp||(gp={})).xa="default",bE.Cache="cache";class fg{constructor(e,n,s){this.query=e,this.Oa=n,this.Na=!1,this.Ba=null,this.onlineState="Unknown",this.options=s||{}}Ma(e){if(!this.options.includeMetadataChanges){const s=[];for(const o of e.docChanges)o.type!==3&&s.push(o);e=new To(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Na?this.La(e)&&(this.Oa.next(e),n=!0):this.ka(e,this.onlineState)&&(this.qa(e),n=!0),this.Ba=e,n}onError(e){this.Oa.error(e)}Fa(e){this.onlineState=e;let n=!1;return this.Ba&&!this.Na&&this.ka(this.Ba,e)&&(this.qa(this.Ba),n=!0),n}ka(e,n){if(!e.fromCache||!this.va())return!0;const s=n!=="Offline";return(!this.options.Qa||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}La(e){if(e.docChanges.length>0)return!0;const n=this.Ba&&this.Ba.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}qa(e){e=To.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Na=!0,this.Oa.next(e)}va(){return this.options.source!==gp.Cache}}/**
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
 */class gb{constructor(e){this.key=e}}class yb{constructor(e){this.key=e}}class O2{constructor(e,n){this.query=e,this.Ha=n,this.Ja=null,this.hasCachedResults=!1,this.current=!1,this.Ya=xe(),this.mutatedKeys=xe(),this.Za=UA(e),this.Xa=new co(this.Za)}get eu(){return this.Ha}tu(e,n){const s=n?n.nu:new EE,o=n?n.Xa:this.Xa;let u=n?n.mutatedKeys:this.mutatedKeys,f=o,m=!1;const p=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,y=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal((T,S)=>{const w=o.get(T),P=Zh(this.query,S)?S:null,k=!!w&&this.mutatedKeys.has(w.key),K=!!P&&(P.hasLocalMutations||this.mutatedKeys.has(P.key)&&P.hasCommittedMutations);let q=!1;w&&P?w.data.isEqual(P.data)?k!==K&&(s.track({type:3,doc:P}),q=!0):this.ru(w,P)||(s.track({type:2,doc:P}),q=!0,(p&&this.Za(P,p)>0||y&&this.Za(P,y)<0)&&(m=!0)):!w&&P?(s.track({type:0,doc:P}),q=!0):w&&!P&&(s.track({type:1,doc:w}),q=!0,(p||y)&&(m=!0)),q&&(P?(f=f.add(P),u=K?u.add(T):u.delete(T)):(f=f.delete(T),u=u.delete(T)))}),this.query.limit!==null)for(;f.size>this.query.limit;){const T=this.query.limitType==="F"?f.last():f.first();f=f.delete(T.key),u=u.delete(T.key),s.track({type:1,doc:T})}return{Xa:f,nu:s,Cs:m,mutatedKeys:u}}ru(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s,o){const u=this.Xa;this.Xa=e.Xa,this.mutatedKeys=e.mutatedKeys;const f=e.nu.wa();f.sort((T,S)=>function(P,k){const K=q=>{switch(q){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return _e(20277,{Vt:q})}};return K(P)-K(k)}(T.type,S.type)||this.Za(T.doc,S.doc)),this.iu(s),o=o!=null&&o;const m=n&&!o?this.su():[],p=this.Ya.size===0&&this.current&&!o?1:0,y=p!==this.Ja;return this.Ja=p,f.length!==0||y?{snapshot:new To(this.query,e.Xa,u,f,e.mutatedKeys,p===0,y,!1,!!s&&s.resumeToken.approximateByteSize()>0),ou:m}:{ou:m}}Fa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Xa:this.Xa,nu:new EE,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{ou:[]}}_u(e){return!this.Ha.has(e)&&!!this.Xa.has(e)&&!this.Xa.get(e).hasLocalMutations}iu(e){e&&(e.addedDocuments.forEach(n=>this.Ha=this.Ha.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ha=this.Ha.delete(n)),this.current=e.current)}su(){if(!this.current)return[];const e=this.Ya;this.Ya=xe(),this.Xa.forEach(s=>{this._u(s.key)&&(this.Ya=this.Ya.add(s.key))});const n=[];return e.forEach(s=>{this.Ya.has(s)||n.push(new yb(s))}),this.Ya.forEach(s=>{e.has(s)||n.push(new gb(s))}),n}au(e){this.Ha=e.$s,this.Ya=xe();const n=this.tu(e.documents);return this.applyChanges(n,!0)}uu(){return To.fromInitialDocuments(this.query,this.Xa,this.mutatedKeys,this.Ja===0,this.hasCachedResults)}}const dg="SyncEngine";class M2{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class x2{constructor(e){this.key=e,this.cu=!1}}class V2{constructor(e,n,s,o,u,f){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=o,this.currentUser=u,this.maxConcurrentLimboResolutions=f,this.lu={},this.hu=new aa(m=>PA(m),Xh),this.Pu=new Map,this.Tu=new Set,this.Iu=new st(me.comparator),this.Eu=new Map,this.du=new Jp,this.Au={},this.Ru=new Map,this.Vu=vo.lr(),this.onlineState="Unknown",this.mu=void 0}get isPrimaryClient(){return this.mu===!0}}async function k2(i,e,n=!0){const s=bb(i);let o;const u=s.hu.get(e);return u?(s.sharedClientState.addLocalQueryTarget(u.targetId),o=u.view.uu()):o=await _b(s,e,n,!0),o}async function P2(i,e){const n=bb(i);await _b(n,e,!0,!1)}async function _b(i,e,n,s){const o=await n2(i.localStore,Ei(e)),u=o.targetId,f=i.sharedClientState.addLocalQueryTarget(u,n);let m;return s&&(m=await U2(i,e,u,f==="current",o.resumeToken)),i.isPrimaryClient&&n&&cb(i.remoteStore,o),m}async function U2(i,e,n,s,o){i.fu=(S,w,P)=>async function(K,q,ne,se){let le=q.view.tu(ne);le.Cs&&(le=await pE(K.localStore,q.query,!1).then(({documents:V})=>q.view.tu(V,le)));const fe=se&&se.targetChanges.get(q.targetId),de=se&&se.targetMismatches.get(q.targetId)!=null,Se=q.view.applyChanges(le,K.isPrimaryClient,fe,de);return wE(K,q.targetId,Se.ou),Se.snapshot}(i,S,w,P);const u=await pE(i.localStore,e,!0),f=new O2(e,u.$s),m=f.tu(u.documents),p=_u.createSynthesizedTargetChangeForCurrentChange(n,s&&i.onlineState!=="Offline",o),y=f.applyChanges(m,i.isPrimaryClient,p);wE(i,n,y.ou);const T=new M2(e,n,f);return i.hu.set(e,T),i.Pu.has(n)?i.Pu.get(n).push(e):i.Pu.set(n,[e]),y.snapshot}async function L2(i,e,n){const s=be(i),o=s.hu.get(e),u=s.Pu.get(o.targetId);if(u.length>1)return s.Pu.set(o.targetId,u.filter(f=>!Xh(f,e))),void s.hu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await mp(s.localStore,o.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(o.targetId),n&&ig(s.remoteStore,o.targetId),yp(s,o.targetId)}).catch(wo)):(yp(s,o.targetId),await mp(s.localStore,o.targetId,!0))}async function j2(i,e){const n=be(i),s=n.hu.get(e),o=n.Pu.get(s.targetId);n.isPrimaryClient&&o.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),ig(n.remoteStore,s.targetId))}async function z2(i,e,n){const s=Y2(i);try{const o=await function(f,m){const p=be(f),y=It.now(),T=m.reduce((P,k)=>P.add(k.key),xe());let S,w;return p.persistence.runTransaction("Locally write mutations","readwrite",P=>{let k=ar(),K=xe();return p.Bs.getEntries(P,T).next(q=>{k=q,k.forEach((ne,se)=>{se.isValidDocument()||(K=K.add(ne))})}).next(()=>p.localDocuments.getOverlayedDocuments(P,k)).next(q=>{S=q;const ne=[];for(const se of m){const le=nD(se,S.get(se.key).overlayedDocument);le!=null&&ne.push(new ls(se.key,le,CA(le.value.mapValue),zn.exists(!0)))}return p.mutationQueue.addMutationBatch(P,y,ne,m)}).next(q=>{w=q;const ne=q.applyToLocalDocumentSet(S,K);return p.documentOverlayCache.saveOverlays(P,q.batchId,ne)})}).then(()=>({batchId:w.batchId,changes:jA(S)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(o.batchId),function(f,m,p){let y=f.Au[f.currentUser.toKey()];y||(y=new st(Re)),y=y.insert(m,p),f.Au[f.currentUser.toKey()]=y}(s,o.batchId,n),await Tu(s,o.changes),await rf(s.remoteStore)}catch(o){const u=lg(o,"Failed to persist write");n.reject(u)}}async function vb(i,e){const n=be(i);try{const s=await JD(n.localStore,e);e.targetChanges.forEach((o,u)=>{const f=n.Eu.get(u);f&&(Fe(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?f.cu=!0:o.modifiedDocuments.size>0?Fe(f.cu,14607):o.removedDocuments.size>0&&(Fe(f.cu,42227),f.cu=!1))}),await Tu(n,s,e)}catch(s){await wo(s)}}function SE(i,e,n){const s=be(i);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const o=[];s.hu.forEach((u,f)=>{const m=f.view.Fa(e);m.snapshot&&o.push(m.snapshot)}),function(f,m){const p=be(f);p.onlineState=m;let y=!1;p.queries.forEach((T,S)=>{for(const w of S.Sa)w.Fa(m)&&(y=!0)}),y&&hg(p)}(s.eventManager,e),o.length&&s.lu.Y_(o),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function B2(i,e,n){const s=be(i);s.sharedClientState.updateQueryState(e,"rejected",n);const o=s.Eu.get(e),u=o&&o.key;if(u){let f=new st(me.comparator);f=f.insert(u,Zt.newNoDocument(u,Ae.min()));const m=xe().add(u),p=new ef(Ae.min(),new Map,new st(Re),f,m);await vb(s,p),s.Iu=s.Iu.remove(u),s.Eu.delete(e),mg(s)}else await mp(s.localStore,e,!1).then(()=>yp(s,e,n)).catch(wo)}async function q2(i,e){const n=be(i),s=e.batch.batchId;try{const o=await WD(n.localStore,e);Eb(n,s,null),Tb(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await Tu(n,o)}catch(o){await wo(o)}}async function F2(i,e,n){const s=be(i);try{const o=await function(f,m){const p=be(f);return p.persistence.runTransaction("Reject batch","readwrite-primary",y=>{let T;return p.mutationQueue.lookupMutationBatch(y,m).next(S=>(Fe(S!==null,37113),T=S.keys(),p.mutationQueue.removeMutationBatch(y,S))).next(()=>p.mutationQueue.performConsistencyCheck(y)).next(()=>p.documentOverlayCache.removeOverlaysForBatchId(y,T,m)).next(()=>p.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(y,T)).next(()=>p.localDocuments.getDocuments(y,T))})}(s.localStore,e);Eb(s,e,n),Tb(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await Tu(s,o)}catch(o){await wo(o)}}function Tb(i,e){(i.Ru.get(e)||[]).forEach(n=>{n.resolve()}),i.Ru.delete(e)}function Eb(i,e,n){const s=be(i);let o=s.Au[s.currentUser.toKey()];if(o){const u=o.get(e);u&&(n?u.reject(n):u.resolve(),o=o.remove(e)),s.Au[s.currentUser.toKey()]=o}}function yp(i,e,n=null){i.sharedClientState.removeLocalQueryTarget(e);for(const s of i.Pu.get(e))i.hu.delete(s),n&&i.lu.gu(s,n);i.Pu.delete(e),i.isPrimaryClient&&i.du.Hr(e).forEach(s=>{i.du.containsKey(s)||Ab(i,s)})}function Ab(i,e){i.Tu.delete(e.path.canonicalString());const n=i.Iu.get(e);n!==null&&(ig(i.remoteStore,n),i.Iu=i.Iu.remove(e),i.Eu.delete(n),mg(i))}function wE(i,e,n){for(const s of n)s instanceof gb?(i.du.addReference(s.key,e),H2(i,s)):s instanceof yb?(ae(dg,"Document no longer in limbo: "+s.key),i.du.removeReference(s.key,e),i.du.containsKey(s.key)||Ab(i,s.key)):_e(19791,{pu:s})}function H2(i,e){const n=e.key,s=n.path.canonicalString();i.Iu.get(n)||i.Tu.has(s)||(ae(dg,"New document in limbo: "+n),i.Tu.add(s),mg(i))}function mg(i){for(;i.Tu.size>0&&i.Iu.size<i.maxConcurrentLimboResolutions;){const e=i.Tu.values().next().value;i.Tu.delete(e);const n=new me(et.fromString(e)),s=i.Vu.next();i.Eu.set(s,new x2(n)),i.Iu=i.Iu.insert(n,s),cb(i.remoteStore,new Hr(Ei($h(n.path)),s,"TargetPurposeLimboResolution",Kh.le))}}async function Tu(i,e,n){const s=be(i),o=[],u=[],f=[];s.hu.isEmpty()||(s.hu.forEach((m,p)=>{f.push(s.fu(p,e,n).then(y=>{var T;if((y||n)&&s.isPrimaryClient){const S=y?!y.fromCache:(T=n?.targetChanges.get(p.targetId))===null||T===void 0?void 0:T.current;s.sharedClientState.updateQueryState(p.targetId,S?"current":"not-current")}if(y){o.push(y);const S=tg.Rs(p.targetId,y);u.push(S)}}))}),await Promise.all(f),s.lu.Y_(o),await async function(p,y){const T=be(p);try{await T.persistence.runTransaction("notifyLocalViewChanges","readwrite",S=>W.forEach(y,w=>W.forEach(w.ds,P=>T.persistence.referenceDelegate.addReference(S,w.targetId,P)).next(()=>W.forEach(w.As,P=>T.persistence.referenceDelegate.removeReference(S,w.targetId,P)))))}catch(S){if(!Io(S))throw S;ae(ng,"Failed to update sequence numbers: "+S)}for(const S of y){const w=S.targetId;if(!S.fromCache){const P=T.xs.get(w),k=P.snapshotVersion,K=P.withLastLimboFreeSnapshotVersion(k);T.xs=T.xs.insert(w,K)}}}(s.localStore,u))}async function G2(i,e){const n=be(i);if(!n.currentUser.isEqual(e)){ae(dg,"User change. New user:",e.toKey());const s=await ab(n.localStore,e);n.currentUser=e,function(u,f){u.Ru.forEach(m=>{m.forEach(p=>{p.reject(new oe(Z.CANCELLED,f))})}),u.Ru.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Tu(n,s.ks)}}function K2(i,e){const n=be(i),s=n.Eu.get(e);if(s&&s.cu)return xe().add(s.key);{let o=xe();const u=n.Pu.get(e);if(!u)return o;for(const f of u){const m=n.hu.get(f);o=o.unionWith(m.view.eu)}return o}}function bb(i){const e=be(i);return e.remoteStore.remoteSyncer.applyRemoteEvent=vb.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=K2.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=B2.bind(null,e),e.lu.Y_=N2.bind(null,e.eventManager),e.lu.gu=D2.bind(null,e.eventManager),e}function Y2(i){const e=be(i);return e.remoteStore.remoteSyncer.applySuccessfulWrite=q2.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=F2.bind(null,e),e}class xh{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=tf(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Su(e),await this.persistence.start(),this.localStore=this.Du(e),this.gcScheduler=this.vu(e,this.localStore),this.indexBackfillerScheduler=this.Cu(e,this.localStore)}vu(e,n){return null}Cu(e,n){return null}Du(e){return ZD(this.persistence,new QD,e.initialUser,this.serializer)}Su(e){return new sb(eg.fi,this.serializer)}bu(e){return new r2}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}xh.provider={build:()=>new xh};class Q2 extends xh{constructor(e){super(),this.cacheSizeBytes=e}vu(e,n){Fe(this.persistence.referenceDelegate instanceof Oh,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new xD(s,e.asyncQueue,n)}Su(e){const n=this.cacheSizeBytes!==void 0?cn.withCacheSize(this.cacheSizeBytes):cn.DEFAULT;return new sb(s=>Oh.fi(s,n),this.serializer)}}class _p{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>SE(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=G2.bind(null,this.syncEngine),await I2(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new C2}()}createDatastore(e){const n=tf(e.databaseInfo.databaseId),s=function(u){return new u2(u)}(e.databaseInfo);return function(u,f,m,p){return new d2(u,f,m,p)}(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return function(s,o,u,f,m){return new p2(s,o,u,f,m)}(this.localStore,this.datastore,e.asyncQueue,n=>SE(this.syncEngine,n,0),function(){return _E.C()?new _E:new s2}())}createSyncEngine(e,n){return function(o,u,f,m,p,y,T){const S=new V2(o,u,f,m,p,y);return T&&(S.mu=!0),S}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(o){const u=be(o);ae(ta,"RemoteStore shutting down."),u.da.add(5),await vu(u),u.Ra.shutdown(),u.Va.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}_p.provider={build:()=>new _p};/**
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
 */class pg{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Mu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Mu(this.observer.error,e):sr("Uncaught Error in snapshot listener:",e.toString()))}xu(){this.muted=!0}Mu(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
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
 */const ts="FirestoreClient";class $2{constructor(e,n,s,o,u){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=o,this.user=$t.UNAUTHENTICATED,this.clientId=_A.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=u,this.authCredentials.start(s,async f=>{ae(ts,"Received user=",f.uid),await this.authCredentialListener(f),this.user=f}),this.appCheckCredentials.start(s,f=>(ae(ts,"Received new app check token=",f),this.appCheckCredentialListener(f,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new er;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=lg(n,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function Pm(i,e){i.asyncQueue.verifyOperationInProgress(),ae(ts,"Initializing OfflineComponentProvider");const n=i.configuration;await e.initialize(n);let s=n.initialUser;i.setCredentialChangeListener(async o=>{s.isEqual(o)||(await ab(e.localStore,o),s=o)}),e.persistence.setDatabaseDeletedListener(()=>i.terminate()),i._offlineComponents=e}async function IE(i,e){i.asyncQueue.verifyOperationInProgress();const n=await X2(i);ae(ts,"Initializing OnlineComponentProvider"),await e.initialize(n,i.configuration),i.setCredentialChangeListener(s=>TE(e.remoteStore,s)),i.setAppCheckTokenChangeListener((s,o)=>TE(e.remoteStore,o)),i._onlineComponents=e}async function X2(i){if(!i._offlineComponents)if(i._uninitializedComponentsProvider){ae(ts,"Using user provided OfflineComponentProvider");try{await Pm(i,i._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(o){return o.name==="FirebaseError"?o.code===Z.FAILED_PRECONDITION||o.code===Z.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11}(n))throw n;po("Error using user provided cache. Falling back to memory cache: "+n),await Pm(i,new xh)}}else ae(ts,"Using default OfflineComponentProvider"),await Pm(i,new Q2(void 0));return i._offlineComponents}async function Sb(i){return i._onlineComponents||(i._uninitializedComponentsProvider?(ae(ts,"Using user provided OnlineComponentProvider"),await IE(i,i._uninitializedComponentsProvider._online)):(ae(ts,"Using default OnlineComponentProvider"),await IE(i,new _p))),i._onlineComponents}function Z2(i){return Sb(i).then(e=>e.syncEngine)}async function Vh(i){const e=await Sb(i),n=e.eventManager;return n.onListen=k2.bind(null,e.syncEngine),n.onUnlisten=L2.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=P2.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=j2.bind(null,e.syncEngine),n}function W2(i,e,n={}){const s=new er;return i.asyncQueue.enqueueAndForget(async()=>function(u,f,m,p,y){const T=new pg({next:w=>{T.xu(),f.enqueueAndForget(()=>cg(u,S));const P=w.docs.has(m);!P&&w.fromCache?y.reject(new oe(Z.UNAVAILABLE,"Failed to get document because the client is offline.")):P&&w.fromCache&&p&&p.source==="server"?y.reject(new oe(Z.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):y.resolve(w)},error:w=>y.reject(w)}),S=new fg($h(m.path),T,{includeMetadataChanges:!0,Qa:!0});return ug(u,S)}(await Vh(i),i.asyncQueue,e,n,s)),s.promise}function J2(i,e,n={}){const s=new er;return i.asyncQueue.enqueueAndForget(async()=>function(u,f,m,p,y){const T=new pg({next:w=>{T.xu(),f.enqueueAndForget(()=>cg(u,S)),w.fromCache&&p.source==="server"?y.reject(new oe(Z.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):y.resolve(w)},error:w=>y.reject(w)}),S=new fg(m,T,{includeMetadataChanges:!0,Qa:!0});return ug(u,S)}(await Vh(i),i.asyncQueue,e,n,s)),s.promise}/**
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
 */function wb(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
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
 */const RE=new Map;/**
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
 */function Ib(i,e,n){if(!n)throw new oe(Z.INVALID_ARGUMENT,`Function ${i}() cannot be called with an empty ${e}.`)}function eO(i,e,n,s){if(e===!0&&s===!0)throw new oe(Z.INVALID_ARGUMENT,`${i} and ${n} cannot be used together.`)}function CE(i){if(!me.isDocumentKey(i))throw new oe(Z.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${i} has ${i.length}.`)}function NE(i){if(me.isDocumentKey(i))throw new oe(Z.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${i} has ${i.length}.`)}function sf(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":_e(12329,{type:typeof i})}function fn(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new oe(Z.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=sf(i);throw new oe(Z.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return i}/**
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
 */const Rb="firestore.googleapis.com",DE=!0;class OE{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new oe(Z.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Rb,this.ssl=DE}else this.host=e.host,this.ssl=(n=e.ssl)!==null&&n!==void 0?n:DE;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=rb;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<OD)throw new oe(Z.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}eO("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=wb((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(u){if(u.timeoutSeconds!==void 0){if(isNaN(u.timeoutSeconds))throw new oe(Z.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (must not be NaN)`);if(u.timeoutSeconds<5)throw new oe(Z.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (minimum allowed value is 5)`);if(u.timeoutSeconds>30)throw new oe(Z.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,o){return s.timeoutSeconds===o.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class af{constructor(e,n,s,o){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new OE({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new oe(Z.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new oe(Z.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new OE(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new lN;switch(s.type){case"firstParty":return new fN(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new oe(Z.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=RE.get(n);s&&(ae("ComponentProvider","Removing Datastore"),RE.delete(n),s.terminate())}(this),Promise.resolve()}}function tO(i,e,n,s={}){var o;i=fn(i,af);const u=ra(e),f=i._getSettings(),m=Object.assign(Object.assign({},f),{emulatorOptions:i._getEmulatorOptions()}),p=`${e}:${n}`;u&&(Rp(`https://${p}`),Cp("Firestore",!0)),f.host!==Rb&&f.host!==p&&po("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const y=Object.assign(Object.assign({},f),{host:p,ssl:u,emulatorOptions:s});if(!$r(y,m)&&(i._setSettings(y),s.mockUserToken)){let T,S;if(typeof s.mockUserToken=="string")T=s.mockUserToken,S=$t.MOCK_USER;else{T=b0(s.mockUserToken,(o=i._app)===null||o===void 0?void 0:o.options.projectId);const w=s.mockUserToken.sub||s.mockUserToken.user_id;if(!w)throw new oe(Z.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");S=new $t(w)}i._authCredentials=new uN(new gA(T,S))}}/**
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
 */class us{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new us(this.firestore,e,this._query)}}class Jt{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Qr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Jt(this.firestore,e,this._key)}}class Qr extends us{constructor(e,n,s){super(e,n,$h(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Jt(this.firestore,null,new me(e))}withConverter(e){return new Qr(this.firestore,e,this._path)}}function kh(i,e,...n){if(i=mt(i),Ib("collection","path",e),i instanceof af){const s=et.fromString(e,...n);return NE(s),new Qr(i,null,s)}{if(!(i instanceof Jt||i instanceof Qr))throw new oe(Z.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=i._path.child(et.fromString(e,...n));return NE(s),new Qr(i.firestore,null,s)}}function Eu(i,e,...n){if(i=mt(i),arguments.length===1&&(e=_A.newId()),Ib("doc","path",e),i instanceof af){const s=et.fromString(e,...n);return CE(s),new Jt(i,null,new me(s))}{if(!(i instanceof Jt||i instanceof Qr))throw new oe(Z.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=i._path.child(et.fromString(e,...n));return CE(s),new Jt(i.firestore,i instanceof Qr?i.converter:null,new me(s))}}/**
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
 */const ME="AsyncQueue";class xE{constructor(e=Promise.resolve()){this.Ju=[],this.Yu=!1,this.Zu=[],this.Xu=null,this.ec=!1,this.tc=!1,this.nc=[],this.x_=new lb(this,"async_queue_retry"),this.rc=()=>{const s=km();s&&ae(ME,"Visibility state changed to "+s.visibilityState),this.x_.b_()},this.sc=e;const n=km();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.rc)}get isShuttingDown(){return this.Yu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.oc(),this._c(e)}enterRestrictedMode(e){if(!this.Yu){this.Yu=!0,this.tc=e||!1;const n=km();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.rc)}}enqueue(e){if(this.oc(),this.Yu)return new Promise(()=>{});const n=new er;return this._c(()=>this.Yu&&this.tc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Ju.push(e),this.ac()))}async ac(){if(this.Ju.length!==0){try{await this.Ju[0](),this.Ju.shift(),this.x_.reset()}catch(e){if(!Io(e))throw e;ae(ME,"Operation failed with retryable error: "+e)}this.Ju.length>0&&this.x_.y_(()=>this.ac())}}_c(e){const n=this.sc.then(()=>(this.ec=!0,e().catch(s=>{throw this.Xu=s,this.ec=!1,sr("INTERNAL UNHANDLED ERROR: ",VE(s)),s}).then(s=>(this.ec=!1,s))));return this.sc=n,n}enqueueAfterDelay(e,n,s){this.oc(),this.nc.indexOf(e)>-1&&(n=0);const o=og.createAndSchedule(this,e,n,s,u=>this.uc(u));return this.Zu.push(o),o}oc(){this.Xu&&_e(47125,{cc:VE(this.Xu)})}verifyOperationInProgress(){}async lc(){let e;do e=this.sc,await e;while(e!==this.sc)}hc(e){for(const n of this.Zu)if(n.timerId===e)return!0;return!1}Pc(e){return this.lc().then(()=>{this.Zu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Zu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.lc()})}Tc(e){this.nc.push(e)}uc(e){const n=this.Zu.indexOf(e);this.Zu.splice(n,1)}}function VE(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}/**
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
 */function kE(i){return function(n,s){if(typeof n!="object"||n===null)return!1;const o=n;for(const u of s)if(u in o&&typeof o[u]=="function")return!0;return!1}(i,["next","error","complete"])}class or extends af{constructor(e,n,s,o){super(e,n,s,o),this.type="firestore",this._queue=new xE,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new xE(e),this._firestoreClient=void 0,await e}}}function nO(i,e){const n=typeof i=="object"?i:du(),s=typeof i=="string"?i:wh,o=lr(n,"firestore").getImmediate({identifier:s});if(!o._initialized){const u=T0("firestore");u&&tO(o,...u)}return o}function of(i){if(i._terminated)throw new oe(Z.FAILED_PRECONDITION,"The client has already been terminated.");return i._firestoreClient||iO(i),i._firestoreClient}function iO(i){var e,n,s;const o=i._freezeSettings(),u=function(m,p,y,T){return new RN(m,p,y,T.host,T.ssl,T.experimentalForceLongPolling,T.experimentalAutoDetectLongPolling,wb(T.experimentalLongPollingOptions),T.useFetchStreams,T.isUsingEmulator)}(i._databaseId,((e=i._app)===null||e===void 0?void 0:e.options.appId)||"",i._persistenceKey,o);i._componentsProvider||!((n=o.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=o.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(i._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),i._firestoreClient=new $2(i._authCredentials,i._appCheckCredentials,i._queue,u,i._componentsProvider&&function(m){const p=m?._online.build();return{_offline:m?._offline.build(p),_online:p}}(i._componentsProvider))}/**
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
 */class Eo{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Eo(Ht.fromBase64String(e))}catch(n){throw new oe(Z.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Eo(Ht.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class lf{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new oe(Z.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ft(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class gg{constructor(e){this._methodName=e}}/**
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
 */class yg{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new oe(Z.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new oe(Z.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return Re(this._lat,e._lat)||Re(this._long,e._long)}}/**
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
 */class _g{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,o){if(s.length!==o.length)return!1;for(let u=0;u<s.length;++u)if(s[u]!==o[u])return!1;return!0}(this._values,e._values)}}/**
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
 */const rO=/^__.*__$/;class sO{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new ls(e,this.data,this.fieldMask,n,this.fieldTransforms):new yu(e,this.data,n,this.fieldTransforms)}}class Cb{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new ls(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Nb(i){switch(i){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw _e(40011,{Ic:i})}}class vg{constructor(e,n,s,o,u,f){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=o,u===void 0&&this.Ec(),this.fieldTransforms=u||[],this.fieldMask=f||[]}get path(){return this.settings.path}get Ic(){return this.settings.Ic}dc(e){return new vg(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Ac(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),o=this.dc({path:s,Rc:!1});return o.Vc(e),o}mc(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),o=this.dc({path:s,Rc:!1});return o.Ec(),o}fc(e){return this.dc({path:void 0,Rc:!0})}gc(e){return Ph(e,this.settings.methodName,this.settings.yc||!1,this.path,this.settings.wc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Ec(){if(this.path)for(let e=0;e<this.path.length;e++)this.Vc(this.path.get(e))}Vc(e){if(e.length===0)throw this.gc("Document fields must not be empty");if(Nb(this.Ic)&&rO.test(e))throw this.gc('Document fields cannot begin and end with "__"')}}class aO{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||tf(e)}bc(e,n,s,o=!1){return new vg({Ic:e,methodName:n,wc:s,path:Ft.emptyPath(),Rc:!1,yc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function uf(i){const e=i._freezeSettings(),n=tf(i._databaseId);return new aO(i._databaseId,!!e.ignoreUndefinedProperties,n)}function Db(i,e,n,s,o,u={}){const f=i.bc(u.merge||u.mergeFields?2:0,e,n,o);Tg("Data must be an object, but it was:",f,s);const m=Ob(s,f);let p,y;if(u.merge)p=new bn(f.fieldMask),y=f.fieldTransforms;else if(u.mergeFields){const T=[];for(const S of u.mergeFields){const w=vp(e,S,n);if(!f.contains(w))throw new oe(Z.INVALID_ARGUMENT,`Field '${w}' is specified in your field mask but missing from your input data.`);xb(T,w)||T.push(w)}p=new bn(T),y=f.fieldTransforms.filter(S=>p.covers(S.field))}else p=null,y=f.fieldTransforms;return new sO(new hn(m),p,y)}class cf extends gg{_toFieldTransform(e){if(e.Ic!==2)throw e.Ic===1?e.gc(`${this._methodName}() can only appear at the top level of your update data`):e.gc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof cf}}function oO(i,e,n,s){const o=i.bc(1,e,n);Tg("Data must be an object, but it was:",o,s);const u=[],f=hn.empty();os(s,(p,y)=>{const T=Eg(e,p,n);y=mt(y);const S=o.mc(T);if(y instanceof cf)u.push(T);else{const w=Au(y,S);w!=null&&(u.push(T),f.set(T,w))}});const m=new bn(u);return new Cb(f,m,o.fieldTransforms)}function lO(i,e,n,s,o,u){const f=i.bc(1,e,n),m=[vp(e,s,n)],p=[o];if(u.length%2!=0)throw new oe(Z.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let w=0;w<u.length;w+=2)m.push(vp(e,u[w])),p.push(u[w+1]);const y=[],T=hn.empty();for(let w=m.length-1;w>=0;--w)if(!xb(y,m[w])){const P=m[w];let k=p[w];k=mt(k);const K=f.mc(P);if(k instanceof cf)y.push(P);else{const q=Au(k,K);q!=null&&(y.push(P),T.set(P,q))}}const S=new bn(y);return new Cb(T,S,f.fieldTransforms)}function uO(i,e,n,s=!1){return Au(n,i.bc(s?4:3,e))}function Au(i,e){if(Mb(i=mt(i)))return Tg("Unsupported field value:",e,i),Ob(i,e);if(i instanceof gg)return function(s,o){if(!Nb(o.Ic))throw o.gc(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.gc(`${s._methodName}() is not currently supported inside arrays`);const u=s._toFieldTransform(o);u&&o.fieldTransforms.push(u)}(i,e),null;if(i===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),i instanceof Array){if(e.settings.Rc&&e.Ic!==4)throw e.gc("Nested arrays are not supported");return function(s,o){const u=[];let f=0;for(const m of s){let p=Au(m,o.fc(f));p==null&&(p={nullValue:"NULL_VALUE"}),u.push(p),f++}return{arrayValue:{values:u}}}(i,e)}return function(s,o){if((s=mt(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return XN(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const u=It.fromDate(s);return{timestampValue:Dh(o.serializer,u)}}if(s instanceof It){const u=new It(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Dh(o.serializer,u)}}if(s instanceof yg)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Eo)return{bytesValue:ZA(o.serializer,s._byteString)};if(s instanceof Jt){const u=o.databaseId,f=s.firestore._databaseId;if(!f.isEqual(u))throw o.gc(`Document reference is for database ${f.projectId}/${f.database} but should be for database ${u.projectId}/${u.database}`);return{referenceValue:Wp(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof _g)return function(f,m){return{mapValue:{fields:{[IA]:{stringValue:RA},[Ih]:{arrayValue:{values:f.toArray().map(y=>{if(typeof y!="number")throw m.gc("VectorValues must only contain numeric values.");return Qp(m.serializer,y)})}}}}}}(s,o);throw o.gc(`Unsupported field value: ${sf(s)}`)}(i,e)}function Ob(i,e){const n={};return TA(i)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):os(i,(s,o)=>{const u=Au(o,e.Ac(s));u!=null&&(n[s]=u)}),{mapValue:{fields:n}}}function Mb(i){return!(typeof i!="object"||i===null||i instanceof Array||i instanceof Date||i instanceof It||i instanceof yg||i instanceof Eo||i instanceof Jt||i instanceof gg||i instanceof _g)}function Tg(i,e,n){if(!Mb(n)||!function(o){return typeof o=="object"&&o!==null&&(Object.getPrototypeOf(o)===Object.prototype||Object.getPrototypeOf(o)===null)}(n)){const s=sf(n);throw s==="an object"?e.gc(i+" a custom object"):e.gc(i+" "+s)}}function vp(i,e,n){if((e=mt(e))instanceof lf)return e._internalPath;if(typeof e=="string")return Eg(i,e);throw Ph("Field path arguments must be of type string or ",i,!1,void 0,n)}const cO=new RegExp("[~\\*/\\[\\]]");function Eg(i,e,n){if(e.search(cO)>=0)throw Ph(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i,!1,void 0,n);try{return new lf(...e.split("."))._internalPath}catch{throw Ph(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i,!1,void 0,n)}}function Ph(i,e,n,s,o){const u=s&&!s.isEmpty(),f=o!==void 0;let m=`Function ${e}() called with invalid data`;n&&(m+=" (via `toFirestore()`)"),m+=". ";let p="";return(u||f)&&(p+=" (found",u&&(p+=` in field ${s}`),f&&(p+=` in document ${o}`),p+=")"),new oe(Z.INVALID_ARGUMENT,m+i+p)}function xb(i,e){return i.some(n=>n.isEqual(e))}/**
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
 */class Vb{constructor(e,n,s,o,u){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=o,this._converter=u}get id(){return this._key.path.lastSegment()}get ref(){return new Jt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new hO(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(hf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class hO extends Vb{data(){return super.data()}}function hf(i,e){return typeof e=="string"?Eg(i,e):e instanceof lf?e._internalPath:e._delegate._internalPath}/**
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
 */function kb(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new oe(Z.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ag{}class Pb extends Ag{}function bg(i,e,...n){let s=[];e instanceof Ag&&s.push(e),s=s.concat(n),function(u){const f=u.filter(p=>p instanceof Sg).length,m=u.filter(p=>p instanceof ff).length;if(f>1||f>0&&m>0)throw new oe(Z.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const o of s)i=o._apply(i);return i}class ff extends Pb{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new ff(e,n,s)}_apply(e){const n=this._parse(e);return Lb(e._query,n),new us(e.firestore,e.converter,lp(e._query,n))}_parse(e){const n=uf(e.firestore);return function(u,f,m,p,y,T,S){let w;if(y.isKeyField()){if(T==="array-contains"||T==="array-contains-any")throw new oe(Z.INVALID_ARGUMENT,`Invalid Query. You can't perform '${T}' queries on documentId().`);if(T==="in"||T==="not-in"){LE(S,T);const k=[];for(const K of S)k.push(UE(p,u,K));w={arrayValue:{values:k}}}else w=UE(p,u,S)}else T!=="in"&&T!=="not-in"&&T!=="array-contains-any"||LE(S,T),w=uO(m,f,S,T==="in"||T==="not-in");return Tt.create(y,T,w)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function PE(i,e,n){const s=e,o=hf("where",i);return ff._create(o,s,n)}class Sg extends Ag{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new Sg(e,n)}_parse(e){const n=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return n.length===1?n[0]:ei.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(o,u){let f=o;const m=u.getFlattenedFilters();for(const p of m)Lb(f,p),f=lp(f,p)}(e._query,n),new us(e.firestore,e.converter,lp(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class wg extends Pb{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new wg(e,n)}_apply(e){const n=function(o,u,f){if(o.startAt!==null)throw new oe(Z.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new oe(Z.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ou(u,f)}(e._query,this._field,this._direction);return new us(e.firestore,e.converter,function(o,u){const f=o.explicitOrderBy.concat([u]);return new Ro(o.path,o.collectionGroup,f,o.filters.slice(),o.limit,o.limitType,o.startAt,o.endAt)}(e._query,n))}}function Ub(i,e="asc"){const n=e,s=hf("orderBy",i);return wg._create(s,n)}function UE(i,e,n){if(typeof(n=mt(n))=="string"){if(n==="")throw new oe(Z.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!kA(e)&&n.indexOf("/")!==-1)throw new oe(Z.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(et.fromString(n));if(!me.isDocumentKey(s))throw new oe(Z.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return XT(i,new me(s))}if(n instanceof Jt)return XT(i,n._key);throw new oe(Z.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${sf(n)}.`)}function LE(i,e){if(!Array.isArray(i)||i.length===0)throw new oe(Z.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Lb(i,e){const n=function(o,u){for(const f of o)for(const m of f.getFlattenedFilters())if(u.indexOf(m.op)>=0)return m.op;return null}(i.filters,function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new oe(Z.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new oe(Z.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class fO{convertValue(e,n="none"){switch(Jr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return dt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Wr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw _e(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return os(e,(o,u)=>{s[o]=this.convertValue(u,n)}),s}convertVectorValue(e){var n,s,o;const u=(o=(s=(n=e.fields)===null||n===void 0?void 0:n[Ih].arrayValue)===null||s===void 0?void 0:s.values)===null||o===void 0?void 0:o.map(f=>dt(f.doubleValue));return new _g(u)}convertGeoPoint(e){return new yg(dt(e.latitude),dt(e.longitude))}convertArray(e,n){return(e.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(e,n){switch(n){case"previous":const s=Qh(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(ru(e));default:return null}}convertTimestamp(e){const n=Zr(e);return new It(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=et.fromString(e);Fe(ib(s),9688,{name:e});const o=new su(s.get(1),s.get(3)),u=new me(s.popFirst(5));return o.isEqual(n)||sr(`Document ${u} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),u}}/**
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
 */function jb(i,e,n){let s;return s=i?i.toFirestore(e):e,s}/**
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
 */class Fl{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class zb extends Vb{constructor(e,n,s,o,u,f){super(e,n,s,o,f),this._firestore=e,this._firestoreImpl=e,this.metadata=u}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new dh(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(hf("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class dh extends zb{data(e={}){return super.data(e)}}class Bb{constructor(e,n,s,o){this._firestore=e,this._userDataWriter=n,this._snapshot=o,this.metadata=new Fl(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(s=>{e.call(n,new dh(this._firestore,this._userDataWriter,s.key,s,new Fl(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new oe(Z.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(o,u){if(o._snapshot.oldDocs.isEmpty()){let f=0;return o._snapshot.docChanges.map(m=>{const p=new dh(o._firestore,o._userDataWriter,m.doc.key,m.doc,new Fl(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);return m.doc,{type:"added",doc:p,oldIndex:-1,newIndex:f++}})}{let f=o._snapshot.oldDocs;return o._snapshot.docChanges.filter(m=>u||m.type!==3).map(m=>{const p=new dh(o._firestore,o._userDataWriter,m.doc.key,m.doc,new Fl(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);let y=-1,T=-1;return m.type!==0&&(y=f.indexOf(m.doc.key),f=f.delete(m.doc.key)),m.type!==1&&(f=f.add(m.doc),T=f.indexOf(m.doc.key)),{type:dO(m.type),doc:p,oldIndex:y,newIndex:T}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function dO(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return _e(61501,{type:i})}}/**
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
 */function df(i){i=fn(i,Jt);const e=fn(i.firestore,or);return W2(of(e),i._key).then(n=>Fb(e,i,n))}class Ig extends fO{constructor(e){super(),this.firestore=e}convertBytes(e){return new Eo(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Jt(this.firestore,null,n)}}function qb(i){i=fn(i,us);const e=fn(i.firestore,or),n=of(e),s=new Ig(e);return kb(i._query),J2(n,i._query).then(o=>new Bb(e,s,i,o))}function mO(i,e,n){i=fn(i,Jt);const s=fn(i.firestore,or),o=jb(i.converter,e);return mf(s,[Db(uf(s),"setDoc",i._key,o,i.converter!==null,n).toMutation(i._key,zn.none())])}function pO(i,e,n,...s){i=fn(i,Jt);const o=fn(i.firestore,or),u=uf(o);let f;return f=typeof(e=mt(e))=="string"||e instanceof lf?lO(u,"updateDoc",i._key,e,n,s):oO(u,"updateDoc",i._key,e),mf(o,[f.toMutation(i._key,zn.exists(!0))])}function gO(i){return mf(fn(i.firestore,or),[new $p(i._key,zn.none())])}function yO(i,e){const n=fn(i.firestore,or),s=Eu(i),o=jb(i.converter,e);return mf(n,[Db(uf(i.firestore),"addDoc",s._key,o,i.converter!==null,{}).toMutation(s._key,zn.exists(!1))]).then(()=>s)}function _O(i,...e){var n,s,o;i=mt(i);let u={includeMetadataChanges:!1,source:"default"},f=0;typeof e[f]!="object"||kE(e[f])||(u=e[f],f++);const m={includeMetadataChanges:u.includeMetadataChanges,source:u.source};if(kE(e[f])){const S=e[f];e[f]=(n=S.next)===null||n===void 0?void 0:n.bind(S),e[f+1]=(s=S.error)===null||s===void 0?void 0:s.bind(S),e[f+2]=(o=S.complete)===null||o===void 0?void 0:o.bind(S)}let p,y,T;if(i instanceof Jt)y=fn(i.firestore,or),T=$h(i._key.path),p={next:S=>{e[f]&&e[f](Fb(y,i,S))},error:e[f+1],complete:e[f+2]};else{const S=fn(i,us);y=fn(S.firestore,or),T=S._query;const w=new Ig(y);p={next:P=>{e[f]&&e[f](new Bb(y,w,S,P))},error:e[f+1],complete:e[f+2]},kb(i._query)}return function(w,P,k,K){const q=new pg(K),ne=new fg(P,q,k);return w.asyncQueue.enqueueAndForget(async()=>ug(await Vh(w),ne)),()=>{q.xu(),w.asyncQueue.enqueueAndForget(async()=>cg(await Vh(w),ne))}}(of(y),T,m,p)}function mf(i,e){return function(s,o){const u=new er;return s.asyncQueue.enqueueAndForget(async()=>z2(await Z2(s),o,u)),u.promise}(of(i),e)}function Fb(i,e,n){const s=n.docs.get(e._key),o=new Ig(i);return new zb(i,o,e._key,s,new Fl(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(o){So=o})(sa),Bn(new In("firestore",(s,{instanceIdentifier:o,options:u})=>{const f=s.getProvider("app").getImmediate(),m=new or(new cN(s.getProvider("auth-internal")),new dN(f,s.getProvider("app-check-internal")),function(y,T){if(!Object.prototype.hasOwnProperty.apply(y.options,["projectId"]))throw new oe(Z.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new su(y.options.projectId,T)}(f,o),f);return u=Object.assign({useFetchStreams:n},u),m._setSettings(u),m},"PUBLIC").setMultipleInstances(!0)),Wt(LT,jT,e),Wt(LT,jT,"esm2017")})();/**
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
 */const Hb="firebasestorage.googleapis.com",vO="storageBucket",TO=2*60*1e3,EO=10*60*1e3;/**
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
 */class wi extends qn{constructor(e,n,s=0){super(Um(e),`Firebase Storage: ${n} (${Um(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,wi.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Um(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Si;(function(i){i.UNKNOWN="unknown",i.OBJECT_NOT_FOUND="object-not-found",i.BUCKET_NOT_FOUND="bucket-not-found",i.PROJECT_NOT_FOUND="project-not-found",i.QUOTA_EXCEEDED="quota-exceeded",i.UNAUTHENTICATED="unauthenticated",i.UNAUTHORIZED="unauthorized",i.UNAUTHORIZED_APP="unauthorized-app",i.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",i.INVALID_CHECKSUM="invalid-checksum",i.CANCELED="canceled",i.INVALID_EVENT_NAME="invalid-event-name",i.INVALID_URL="invalid-url",i.INVALID_DEFAULT_BUCKET="invalid-default-bucket",i.NO_DEFAULT_BUCKET="no-default-bucket",i.CANNOT_SLICE_BLOB="cannot-slice-blob",i.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",i.NO_DOWNLOAD_URL="no-download-url",i.INVALID_ARGUMENT="invalid-argument",i.INVALID_ARGUMENT_COUNT="invalid-argument-count",i.APP_DELETED="app-deleted",i.INVALID_ROOT_OPERATION="invalid-root-operation",i.INVALID_FORMAT="invalid-format",i.INTERNAL_ERROR="internal-error",i.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Si||(Si={}));function Um(i){return"storage/"+i}function AO(){const i="An unknown error occurred, please check the error payload for server response.";return new wi(Si.UNKNOWN,i)}function bO(){return new wi(Si.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function SO(){return new wi(Si.CANCELED,"User canceled the upload/download.")}function wO(i){return new wi(Si.INVALID_URL,"Invalid URL '"+i+"'.")}function IO(i){return new wi(Si.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+i+"'.")}function jE(i){return new wi(Si.INVALID_ARGUMENT,i)}function Gb(){return new wi(Si.APP_DELETED,"The Firebase app was deleted.")}function RO(i){return new wi(Si.INVALID_ROOT_OPERATION,"The operation '"+i+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
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
 */class Jn{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let s;try{s=Jn.makeFromUrl(e,n)}catch{return new Jn(e,"")}if(s.path==="")return s;throw IO(e)}static makeFromUrl(e,n){let s=null;const o="([A-Za-z0-9.\\-_]+)";function u(fe){fe.path.charAt(fe.path.length-1)==="/"&&(fe.path_=fe.path_.slice(0,-1))}const f="(/(.*))?$",m=new RegExp("^gs://"+o+f,"i"),p={bucket:1,path:3};function y(fe){fe.path_=decodeURIComponent(fe.path)}const T="v[A-Za-z0-9_]+",S=n.replace(/[.]/g,"\\."),w="(/([^?#]*).*)?$",P=new RegExp(`^https?://${S}/${T}/b/${o}/o${w}`,"i"),k={bucket:1,path:3},K=n===Hb?"(?:storage.googleapis.com|storage.cloud.google.com)":n,q="([^?#]*)",ne=new RegExp(`^https?://${K}/${o}/${q}`,"i"),le=[{regex:m,indices:p,postModify:u},{regex:P,indices:k,postModify:y},{regex:ne,indices:{bucket:1,path:2},postModify:y}];for(let fe=0;fe<le.length;fe++){const de=le[fe],Se=de.regex.exec(e);if(Se){const V=Se[de.indices.bucket];let I=Se[de.indices.path];I||(I=""),s=new Jn(V,I),de.postModify(s);break}}if(s==null)throw wO(e);return s}}class CO{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function NO(i,e,n){let s=1,o=null,u=null,f=!1,m=0;function p(){return m===2}let y=!1;function T(...q){y||(y=!0,e.apply(null,q))}function S(q){o=setTimeout(()=>{o=null,i(P,p())},q)}function w(){u&&clearTimeout(u)}function P(q,...ne){if(y){w();return}if(q){w(),T.call(null,q,...ne);return}if(p()||f){w(),T.call(null,q,...ne);return}s<64&&(s*=2);let le;m===1?(m=2,le=0):le=(s+Math.random())*1e3,S(le)}let k=!1;function K(q){k||(k=!0,w(),!y&&(o!==null?(q||(m=2),clearTimeout(o),S(0)):q||(m=1)))}return S(0),u=setTimeout(()=>{f=!0,K(!0)},n),K}function DO(i){i(!1)}/**
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
 */function OO(i){return i!==void 0}function zE(i,e,n,s){if(s<e)throw jE(`Invalid value for '${i}'. Expected ${e} or greater.`);if(s>n)throw jE(`Invalid value for '${i}'. Expected ${n} or less.`)}function MO(i){const e=encodeURIComponent;let n="?";for(const s in i)if(i.hasOwnProperty(s)){const o=e(s)+"="+e(i[s]);n=n+o+"&"}return n=n.slice(0,-1),n}var Uh;(function(i){i[i.NO_ERROR=0]="NO_ERROR",i[i.NETWORK_ERROR=1]="NETWORK_ERROR",i[i.ABORT=2]="ABORT"})(Uh||(Uh={}));/**
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
 */function xO(i,e){const n=i>=500&&i<600,o=[408,429].indexOf(i)!==-1,u=e.indexOf(i)!==-1;return n||o||u}/**
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
 */class VO{constructor(e,n,s,o,u,f,m,p,y,T,S,w=!0,P=!1){this.url_=e,this.method_=n,this.headers_=s,this.body_=o,this.successCodes_=u,this.additionalRetryCodes_=f,this.callback_=m,this.errorCallback_=p,this.timeout_=y,this.progressCallback_=T,this.connectionFactory_=S,this.retry=w,this.isUsingEmulator=P,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((k,K)=>{this.resolve_=k,this.reject_=K,this.start_()})}start_(){const e=(s,o)=>{if(o){s(!1,new th(!1,null,!0));return}const u=this.connectionFactory_();this.pendingConnection_=u;const f=m=>{const p=m.loaded,y=m.lengthComputable?m.total:-1;this.progressCallback_!==null&&this.progressCallback_(p,y)};this.progressCallback_!==null&&u.addUploadProgressListener(f),u.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&u.removeUploadProgressListener(f),this.pendingConnection_=null;const m=u.getErrorCode()===Uh.NO_ERROR,p=u.getStatus();if(!m||xO(p,this.additionalRetryCodes_)&&this.retry){const T=u.getErrorCode()===Uh.ABORT;s(!1,new th(!1,null,T));return}const y=this.successCodes_.indexOf(p)!==-1;s(!0,new th(y,u))})},n=(s,o)=>{const u=this.resolve_,f=this.reject_,m=o.connection;if(o.wasSuccessCode)try{const p=this.callback_(m,m.getResponse());OO(p)?u(p):u()}catch(p){f(p)}else if(m!==null){const p=AO();p.serverResponse=m.getErrorText(),this.errorCallback_?f(this.errorCallback_(m,p)):f(p)}else if(o.canceled){const p=this.appDelete_?Gb():SO();f(p)}else{const p=bO();f(p)}};this.canceled_?n(!1,new th(!1,null,!0)):this.backoffId_=NO(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&DO(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class th{constructor(e,n,s){this.wasSuccessCode=e,this.connection=n,this.canceled=!!s}}function kO(i,e){e!==null&&e.length>0&&(i.Authorization="Firebase "+e)}function PO(i,e){i["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function UO(i,e){e&&(i["X-Firebase-GMPID"]=e)}function LO(i,e){e!==null&&(i["X-Firebase-AppCheck"]=e)}function jO(i,e,n,s,o,u,f=!0,m=!1){const p=MO(i.urlParams),y=i.url+p,T=Object.assign({},i.headers);return UO(T,e),kO(T,n),PO(T,u),LO(T,s),new VO(y,i.method,T,i.body,i.successCodes,i.additionalRetryCodes,i.handler,i.errorHandler,i.timeout,i.progressCallback,o,f,m)}/**
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
 */function zO(i){if(i.length===0)return null;const e=i.lastIndexOf("/");return e===-1?"":i.slice(0,e)}function BO(i){const e=i.lastIndexOf("/",i.length-2);return e===-1?i:i.slice(e+1)}/**
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
 */class Lh{constructor(e,n){this._service=e,n instanceof Jn?this._location=n:this._location=Jn.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new Lh(e,n)}get root(){const e=new Jn(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return BO(this._location.path)}get storage(){return this._service}get parent(){const e=zO(this._location.path);if(e===null)return null;const n=new Jn(this._location.bucket,e);return new Lh(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw RO(e)}}function BE(i,e){const n=e?.[vO];return n==null?null:Jn.makeFromBucketSpec(n,i)}function qO(i,e,n,s={}){i.host=`${e}:${n}`;const o=ra(e);o&&(Rp(`https://${i.host}/b`),Cp("Storage",!0)),i._isUsingEmulator=!0,i._protocol=o?"https":"http";const{mockUserToken:u}=s;u&&(i._overrideAuthToken=typeof u=="string"?u:b0(u,i.app.options.projectId))}class FO{constructor(e,n,s,o,u,f=!1){this.app=e,this._authProvider=n,this._appCheckProvider=s,this._url=o,this._firebaseVersion=u,this._isUsingEmulator=f,this._bucket=null,this._host=Hb,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=TO,this._maxUploadRetryTime=EO,this._requests=new Set,o!=null?this._bucket=Jn.makeFromBucketSpec(o,this._host):this._bucket=BE(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Jn.makeFromBucketSpec(this._url,e):this._bucket=BE(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){zE("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){zE("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(Zn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Lh(this,e)}_makeRequest(e,n,s,o,u=!0){if(this._deleted)return new CO(Gb());{const f=jO(e,this._appId,s,o,n,this._firebaseVersion,u,this._isUsingEmulator);return this._requests.add(f),f.getPromise().then(()=>this._requests.delete(f),()=>this._requests.delete(f)),f}}async makeRequestWithTokens(e,n){const[s,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,s,o).getPromise()}}const qE="@firebase/storage",FE="0.13.13";/**
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
 */const Kb="storage";function HO(i=du(),e){i=mt(i);const s=lr(i,Kb).getImmediate({identifier:e}),o=T0("storage");return o&&GO(s,...o),s}function GO(i,e,n,s={}){qO(i,e,n,s)}function KO(i,{instanceIdentifier:e}){const n=i.getProvider("app").getImmediate(),s=i.getProvider("auth-internal"),o=i.getProvider("app-check-internal");return new FO(n,s,o,e,sa)}function YO(){Bn(new In(Kb,KO,"PUBLIC").setMultipleInstances(!0)),Wt(qE,FE,""),Wt(qE,FE,"esm2017")}YO();const Yb="@firebase/installations",Rg="0.6.17";/**
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
 */const Qb=1e4,$b=`w:${Rg}`,Xb="FIS_v2",QO="https://firebaseinstallations.googleapis.com/v1",$O=60*60*1e3,XO="installations",ZO="Installations";/**
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
 */const WO={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},na=new as(XO,ZO,WO);function Zb(i){return i instanceof qn&&i.code.includes("request-failed")}/**
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
 */function Wb({projectId:i}){return`${QO}/projects/${i}/installations`}function Jb(i){return{token:i.token,requestStatus:2,expiresIn:eM(i.expiresIn),creationTime:Date.now()}}async function eS(i,e){const s=(await e.json()).error;return na.create("request-failed",{requestName:i,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function tS({apiKey:i}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":i})}function JO(i,{refreshToken:e}){const n=tS(i);return n.append("Authorization",tM(e)),n}async function nS(i){const e=await i();return e.status>=500&&e.status<600?i():e}function eM(i){return Number(i.replace("s","000"))}function tM(i){return`${Xb} ${i}`}/**
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
 */async function nM({appConfig:i,heartbeatServiceProvider:e},{fid:n}){const s=Wb(i),o=tS(i),u=e.getImmediate({optional:!0});if(u){const y=await u.getHeartbeatsHeader();y&&o.append("x-firebase-client",y)}const f={fid:n,authVersion:Xb,appId:i.appId,sdkVersion:$b},m={method:"POST",headers:o,body:JSON.stringify(f)},p=await nS(()=>fetch(s,m));if(p.ok){const y=await p.json();return{fid:y.fid||n,registrationStatus:2,refreshToken:y.refreshToken,authToken:Jb(y.authToken)}}else throw await eS("Create Installation",p)}/**
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
 */function iS(i){return new Promise(e=>{setTimeout(e,i)})}/**
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
 */function iM(i){return btoa(String.fromCharCode(...i)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const rM=/^[cdef][\w-]{21}$/,Tp="";function sM(){try{const i=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(i),i[0]=112+i[0]%16;const n=aM(i);return rM.test(n)?n:Tp}catch{return Tp}}function aM(i){return iM(i).substr(0,22)}/**
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
 */function pf(i){return`${i.appName}!${i.appId}`}/**
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
 */const rS=new Map;function sS(i,e){const n=pf(i);aS(n,e),oM(n,e)}function aS(i,e){const n=rS.get(i);if(n)for(const s of n)s(e)}function oM(i,e){const n=lM();n&&n.postMessage({key:i,fid:e}),uM()}let $s=null;function lM(){return!$s&&"BroadcastChannel"in self&&($s=new BroadcastChannel("[Firebase] FID Change"),$s.onmessage=i=>{aS(i.data.key,i.data.fid)}),$s}function uM(){rS.size===0&&$s&&($s.close(),$s=null)}/**
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
 */const cM="firebase-installations-database",hM=1,ia="firebase-installations-store";let Lm=null;function Cg(){return Lm||(Lm=C0(cM,hM,{upgrade:(i,e)=>{switch(e){case 0:i.createObjectStore(ia)}}})),Lm}async function jh(i,e){const n=pf(i),o=(await Cg()).transaction(ia,"readwrite"),u=o.objectStore(ia),f=await u.get(n);return await u.put(e,n),await o.done,(!f||f.fid!==e.fid)&&sS(i,e.fid),e}async function oS(i){const e=pf(i),s=(await Cg()).transaction(ia,"readwrite");await s.objectStore(ia).delete(e),await s.done}async function gf(i,e){const n=pf(i),o=(await Cg()).transaction(ia,"readwrite"),u=o.objectStore(ia),f=await u.get(n),m=e(f);return m===void 0?await u.delete(n):await u.put(m,n),await o.done,m&&(!f||f.fid!==m.fid)&&sS(i,m.fid),m}/**
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
 */async function Ng(i){let e;const n=await gf(i.appConfig,s=>{const o=fM(s),u=dM(i,o);return e=u.registrationPromise,u.installationEntry});return n.fid===Tp?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function fM(i){const e=i||{fid:sM(),registrationStatus:0};return lS(e)}function dM(i,e){if(e.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(na.create("app-offline"));return{installationEntry:e,registrationPromise:o}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},s=mM(i,n);return{installationEntry:n,registrationPromise:s}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:pM(i)}:{installationEntry:e}}async function mM(i,e){try{const n=await nM(i,e);return jh(i.appConfig,n)}catch(n){throw Zb(n)&&n.customData.serverCode===409?await oS(i.appConfig):await jh(i.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function pM(i){let e=await HE(i.appConfig);for(;e.registrationStatus===1;)await iS(100),e=await HE(i.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:s}=await Ng(i);return s||n}return e}function HE(i){return gf(i,e=>{if(!e)throw na.create("installation-not-found");return lS(e)})}function lS(i){return gM(i)?{fid:i.fid,registrationStatus:0}:i}function gM(i){return i.registrationStatus===1&&i.registrationTime+Qb<Date.now()}/**
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
 */async function yM({appConfig:i,heartbeatServiceProvider:e},n){const s=_M(i,n),o=JO(i,n),u=e.getImmediate({optional:!0});if(u){const y=await u.getHeartbeatsHeader();y&&o.append("x-firebase-client",y)}const f={installation:{sdkVersion:$b,appId:i.appId}},m={method:"POST",headers:o,body:JSON.stringify(f)},p=await nS(()=>fetch(s,m));if(p.ok){const y=await p.json();return Jb(y)}else throw await eS("Generate Auth Token",p)}function _M(i,{fid:e}){return`${Wb(i)}/${e}/authTokens:generate`}/**
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
 */async function Dg(i,e=!1){let n;const s=await gf(i.appConfig,u=>{if(!uS(u))throw na.create("not-registered");const f=u.authToken;if(!e&&EM(f))return u;if(f.requestStatus===1)return n=vM(i,e),u;{if(!navigator.onLine)throw na.create("app-offline");const m=bM(u);return n=TM(i,m),m}});return n?await n:s.authToken}async function vM(i,e){let n=await GE(i.appConfig);for(;n.authToken.requestStatus===1;)await iS(100),n=await GE(i.appConfig);const s=n.authToken;return s.requestStatus===0?Dg(i,e):s}function GE(i){return gf(i,e=>{if(!uS(e))throw na.create("not-registered");const n=e.authToken;return SM(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function TM(i,e){try{const n=await yM(i,e),s=Object.assign(Object.assign({},e),{authToken:n});return await jh(i.appConfig,s),n}catch(n){if(Zb(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await oS(i.appConfig);else{const s=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await jh(i.appConfig,s)}throw n}}function uS(i){return i!==void 0&&i.registrationStatus===2}function EM(i){return i.requestStatus===2&&!AM(i)}function AM(i){const e=Date.now();return e<i.creationTime||i.creationTime+i.expiresIn<e+$O}function bM(i){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},i),{authToken:e})}function SM(i){return i.requestStatus===1&&i.requestTime+Qb<Date.now()}/**
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
 */async function wM(i){const e=i,{installationEntry:n,registrationPromise:s}=await Ng(e);return s?s.catch(console.error):Dg(e).catch(console.error),n.fid}/**
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
 */async function IM(i,e=!1){const n=i;return await RM(n),(await Dg(n,e)).token}async function RM(i){const{registrationPromise:e}=await Ng(i);e&&await e}/**
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
 */function CM(i){if(!i||!i.options)throw jm("App Configuration");if(!i.name)throw jm("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!i.options[n])throw jm(n);return{appName:i.name,projectId:i.options.projectId,apiKey:i.options.apiKey,appId:i.options.appId}}function jm(i){return na.create("missing-app-config-values",{valueName:i})}/**
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
 */const cS="installations",NM="installations-internal",DM=i=>{const e=i.getProvider("app").getImmediate(),n=CM(e),s=lr(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},OM=i=>{const e=i.getProvider("app").getImmediate(),n=lr(e,cS).getImmediate();return{getId:()=>wM(n),getToken:o=>IM(n,o)}};function MM(){Bn(new In(cS,DM,"PUBLIC")),Bn(new In(NM,OM,"PRIVATE"))}MM();Wt(Yb,Rg);Wt(Yb,Rg,"esm2017");/**
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
 */const zh="analytics",xM="firebase_id",VM="origin",kM=60*1e3,PM="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Og="https://www.googletagmanager.com/gtag/js";/**
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
 */const dn=new fu("@firebase/analytics");/**
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
 */const UM={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},wn=new as("analytics","Analytics",UM);/**
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
 */function LM(i){if(!i.startsWith(Og)){const e=wn.create("invalid-gtag-resource",{gtagURL:i});return dn.warn(e.message),""}return i}function hS(i){return Promise.all(i.map(e=>e.catch(n=>n)))}function jM(i,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(i,e)),n}function zM(i,e){const n=jM("firebase-js-sdk-policy",{createScriptURL:LM}),s=document.createElement("script"),o=`${Og}?l=${i}&id=${e}`;s.src=n?n?.createScriptURL(o):o,s.async=!0,document.head.appendChild(s)}function BM(i){let e=[];return Array.isArray(window[i])?e=window[i]:window[i]=e,e}async function qM(i,e,n,s,o,u){const f=s[o];try{if(f)await e[f];else{const p=(await hS(n)).find(y=>y.measurementId===o);p&&await e[p.appId]}}catch(m){dn.error(m)}i("config",o,u)}async function FM(i,e,n,s,o){try{let u=[];if(o&&o.send_to){let f=o.send_to;Array.isArray(f)||(f=[f]);const m=await hS(n);for(const p of f){const y=m.find(S=>S.measurementId===p),T=y&&e[y.appId];if(T)u.push(T);else{u=[];break}}}u.length===0&&(u=Object.values(e)),await Promise.all(u),i("event",s,o||{})}catch(u){dn.error(u)}}function HM(i,e,n,s){async function o(u,...f){try{if(u==="event"){const[m,p]=f;await FM(i,e,n,m,p)}else if(u==="config"){const[m,p]=f;await qM(i,e,n,s,m,p)}else if(u==="consent"){const[m,p]=f;i("consent",m,p)}else if(u==="get"){const[m,p,y]=f;i("get",m,p,y)}else if(u==="set"){const[m]=f;i("set",m)}else i(u,...f)}catch(m){dn.error(m)}}return o}function GM(i,e,n,s,o){let u=function(...f){window[s].push(arguments)};return window[o]&&typeof window[o]=="function"&&(u=window[o]),window[o]=HM(u,i,e,n),{gtagCore:u,wrappedGtag:window[o]}}function KM(i){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(Og)&&n.src.includes(i))return n;return null}/**
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
 */const YM=30,QM=1e3;class $M{constructor(e={},n=QM){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const fS=new $M;function XM(i){return new Headers({Accept:"application/json","x-goog-api-key":i})}async function ZM(i){var e;const{appId:n,apiKey:s}=i,o={method:"GET",headers:XM(s)},u=PM.replace("{app-id}",n),f=await fetch(u,o);if(f.status!==200&&f.status!==304){let m="";try{const p=await f.json();!((e=p.error)===null||e===void 0)&&e.message&&(m=p.error.message)}catch{}throw wn.create("config-fetch-failed",{httpStatus:f.status,responseMessage:m})}return f.json()}async function WM(i,e=fS,n){const{appId:s,apiKey:o,measurementId:u}=i.options;if(!s)throw wn.create("no-app-id");if(!o){if(u)return{measurementId:u,appId:s};throw wn.create("no-api-key")}const f=e.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},m=new tx;return setTimeout(async()=>{m.abort()},kM),dS({appId:s,apiKey:o,measurementId:u},f,m,e)}async function dS(i,{throttleEndTimeMillis:e,backoffCount:n},s,o=fS){var u;const{appId:f,measurementId:m}=i;try{await JM(s,e)}catch(p){if(m)return dn.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${m} provided in the "measurementId" field in the local Firebase config. [${p?.message}]`),{appId:f,measurementId:m};throw p}try{const p=await ZM(i);return o.deleteThrottleMetadata(f),p}catch(p){const y=p;if(!ex(y)){if(o.deleteThrottleMetadata(f),m)return dn.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${m} provided in the "measurementId" field in the local Firebase config. [${y?.message}]`),{appId:f,measurementId:m};throw p}const T=Number((u=y?.customData)===null||u===void 0?void 0:u.httpStatus)===503?hT(n,o.intervalMillis,YM):hT(n,o.intervalMillis),S={throttleEndTimeMillis:Date.now()+T,backoffCount:n+1};return o.setThrottleMetadata(f,S),dn.debug(`Calling attemptFetch again in ${T} millis`),dS(i,S,s,o)}}function JM(i,e){return new Promise((n,s)=>{const o=Math.max(e-Date.now(),0),u=setTimeout(n,o);i.addEventListener(()=>{clearTimeout(u),s(wn.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function ex(i){if(!(i instanceof qn)||!i.customData)return!1;const e=Number(i.customData.httpStatus);return e===429||e===500||e===503||e===504}class tx{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function nx(i,e,n,s,o){if(o&&o.global){i("event",n,s);return}else{const u=await e,f=Object.assign(Object.assign({},s),{send_to:u});i("event",n,f)}}/**
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
 */async function ix(){if(Np())try{await Dp()}catch(i){return dn.warn(wn.create("indexeddb-unavailable",{errorInfo:i?.toString()}).message),!1}else return dn.warn(wn.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function rx(i,e,n,s,o,u,f){var m;const p=WM(i);p.then(P=>{n[P.measurementId]=P.appId,i.options.measurementId&&P.measurementId!==i.options.measurementId&&dn.warn(`The measurement ID in the local Firebase config (${i.options.measurementId}) does not match the measurement ID fetched from the server (${P.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(P=>dn.error(P)),e.push(p);const y=ix().then(P=>{if(P)return s.getId()}),[T,S]=await Promise.all([p,y]);KM(u)||zM(u,T.measurementId),o("js",new Date);const w=(m=f?.config)!==null&&m!==void 0?m:{};return w[VM]="firebase",w.update=!0,S!=null&&(w[xM]=S),o("config",T.measurementId,w),T.measurementId}/**
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
 */class sx{constructor(e){this.app=e}_delete(){return delete Xl[this.app.options.appId],Promise.resolve()}}let Xl={},KE=[];const YE={};let zm="dataLayer",ax="gtag",QE,mS,$E=!1;function ox(){const i=[];if(S0()&&i.push("This is a browser extension environment."),w0()||i.push("Cookies are not available."),i.length>0){const e=i.map((s,o)=>`(${o+1}) ${s}`).join(" "),n=wn.create("invalid-analytics-context",{errorInfo:e});dn.warn(n.message)}}function lx(i,e,n){ox();const s=i.options.appId;if(!s)throw wn.create("no-app-id");if(!i.options.apiKey)if(i.options.measurementId)dn.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${i.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw wn.create("no-api-key");if(Xl[s]!=null)throw wn.create("already-exists",{id:s});if(!$E){BM(zm);const{wrappedGtag:u,gtagCore:f}=GM(Xl,KE,YE,zm,ax);mS=u,QE=f,$E=!0}return Xl[s]=rx(i,KE,YE,e,QE,zm,n),new sx(i)}function ux(i=du()){i=mt(i);const e=lr(i,zh);return e.isInitialized()?e.getImmediate():cx(i)}function cx(i,e={}){const n=lr(i,zh);if(n.isInitialized()){const o=n.getImmediate();if($r(e,n.getOptions()))return o;throw wn.create("already-initialized")}return n.initialize({options:e})}function hx(i,e,n,s){i=mt(i),nx(mS,Xl[i.app.options.appId],e,n,s).catch(o=>dn.error(o))}const XE="@firebase/analytics",ZE="0.10.16";function fx(){Bn(new In(zh,(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("installations-internal").getImmediate();return lx(s,o,n)},"PUBLIC")),Bn(new In("analytics-internal",i,"PRIVATE")),Wt(XE,ZE),Wt(XE,ZE,"esm2017");function i(e){try{const n=e.getProvider(zh).getImmediate();return{logEvent:(s,o,u)=>hx(n,s,o,u)}}catch(n){throw wn.create("interop-component-reg-failed",{reason:n})}}}fx();var Ep,WE,yf=function(){var i=self.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(i&&i.responseStart>0&&i.responseStart<performance.now())return i},pS=function(i){if(document.readyState==="loading")return"loading";var e=yf();if(e){if(i<e.domInteractive)return"loading";if(e.domContentLoadedEventStart===0||i<e.domContentLoadedEventStart)return"dom-interactive";if(e.domComplete===0||i<e.domComplete)return"dom-content-loaded"}return"complete"},dx=function(i){var e=i.nodeName;return i.nodeType===1?e.toLowerCase():e.toUpperCase().replace(/^#/,"")},Mg=function(i,e){var n="";try{for(;i&&i.nodeType!==9;){var s=i,o=s.id?"#"+s.id:dx(s)+(s.classList&&s.classList.value&&s.classList.value.trim()&&s.classList.value.trim().length?"."+s.classList.value.trim().replace(/\s+/g,"."):"");if(n.length+o.length>(e||100)-1)return n||o;if(n=n?o+">"+n:o,s.id)break;i=s.parentNode}}catch{}return n},gS=-1,mx=function(){return gS},bu=function(i){addEventListener("pageshow",function(e){e.persisted&&(gS=e.timeStamp,i(e))},!0)},xg=function(){var i=yf();return i&&i.activationStart||0},ns=function(i,e){var n=yf(),s="navigate";return mx()>=0?s="back-forward-cache":n&&(document.prerendering||xg()>0?s="prerender":document.wasDiscarded?s="restore":n.type&&(s=n.type.replace(/_/g,"-"))),{name:i,value:e===void 0?-1:e,rating:"good",delta:0,entries:[],id:"v4-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:s}},No=function(i,e,n){try{if(PerformanceObserver.supportedEntryTypes.includes(i)){var s=new PerformanceObserver(function(o){Promise.resolve().then(function(){e(o.getEntries())})});return s.observe(Object.assign({type:i,buffered:!0},n||{})),s}}catch{}},is=function(i,e,n,s){var o,u;return function(f){e.value>=0&&(f||s)&&((u=e.value-(o||0))||o===void 0)&&(o=e.value,e.delta=u,e.rating=function(m,p){return m>p[1]?"poor":m>p[0]?"needs-improvement":"good"}(e.value,n),i(e))}},Vg=function(i){requestAnimationFrame(function(){return requestAnimationFrame(function(){return i()})})},_f=function(i){document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"&&i()})},kg=function(i){var e=!1;return function(){e||(i(),e=!0)}},ao=-1,JE=function(){return document.visibilityState!=="hidden"||document.prerendering?1/0:0},Bh=function(i){document.visibilityState==="hidden"&&ao>-1&&(ao=i.type==="visibilitychange"?i.timeStamp:0,px())},e0=function(){addEventListener("visibilitychange",Bh,!0),addEventListener("prerenderingchange",Bh,!0)},px=function(){removeEventListener("visibilitychange",Bh,!0),removeEventListener("prerenderingchange",Bh,!0)},yS=function(){return ao<0&&(ao=JE(),e0(),bu(function(){setTimeout(function(){ao=JE(),e0()},0)})),{get firstHiddenTime(){return ao}}},Pg=function(i){document.prerendering?addEventListener("prerenderingchange",function(){return i()},!0):i()},t0=[1800,3e3],gx=function(i,e){e=e||{},Pg(function(){var n,s=yS(),o=ns("FCP"),u=No("paint",function(f){f.forEach(function(m){m.name==="first-contentful-paint"&&(u.disconnect(),m.startTime<s.firstHiddenTime&&(o.value=Math.max(m.startTime-xg(),0),o.entries.push(m),n(!0)))})});u&&(n=is(i,o,t0,e.reportAllChanges),bu(function(f){o=ns("FCP"),n=is(i,o,t0,e.reportAllChanges),Vg(function(){o.value=performance.now()-f.timeStamp,n(!0)})}))})},n0=[.1,.25],yx=function(i,e){(function(n,s){s=s||{},gx(kg(function(){var o,u=ns("CLS",0),f=0,m=[],p=function(T){T.forEach(function(S){if(!S.hadRecentInput){var w=m[0],P=m[m.length-1];f&&S.startTime-P.startTime<1e3&&S.startTime-w.startTime<5e3?(f+=S.value,m.push(S)):(f=S.value,m=[S])}}),f>u.value&&(u.value=f,u.entries=m,o())},y=No("layout-shift",p);y&&(o=is(n,u,n0,s.reportAllChanges),_f(function(){p(y.takeRecords()),o(!0)}),bu(function(){f=0,u=ns("CLS",0),o=is(n,u,n0,s.reportAllChanges),Vg(function(){return o()})}),setTimeout(o,0))}))})(function(n){var s=function(o){var u,f={};if(o.entries.length){var m=o.entries.reduce(function(y,T){return y&&y.value>T.value?y:T});if(m&&m.sources&&m.sources.length){var p=(u=m.sources).find(function(y){return y.node&&y.node.nodeType===1})||u[0];p&&(f={largestShiftTarget:Mg(p.node),largestShiftTime:m.startTime,largestShiftValue:m.value,largestShiftSource:p,largestShiftEntry:m,loadState:pS(m.startTime)})}}return Object.assign(o,{attribution:f})}(n);i(s)},e)},_S=0,Bm=1/0,nh=0,_x=function(i){i.forEach(function(e){e.interactionId&&(Bm=Math.min(Bm,e.interactionId),nh=Math.max(nh,e.interactionId),_S=nh?(nh-Bm)/7+1:0)})},vS=function(){return Ep?_S:performance.interactionCount||0},vx=function(){"interactionCount"in performance||Ep||(Ep=No("event",_x,{type:"event",buffered:!0,durationThreshold:0}))},Xn=[],Zl=new Map,TS=0,Tx=function(){var i=Math.min(Xn.length-1,Math.floor((vS()-TS)/50));return Xn[i]},ES=[],Ex=function(i){if(ES.forEach(function(o){return o(i)}),i.interactionId||i.entryType==="first-input"){var e=Xn[Xn.length-1],n=Zl.get(i.interactionId);if(n||Xn.length<10||i.duration>e.latency){if(n)i.duration>n.latency?(n.entries=[i],n.latency=i.duration):i.duration===n.latency&&i.startTime===n.entries[0].startTime&&n.entries.push(i);else{var s={id:i.interactionId,latency:i.duration,entries:[i]};Zl.set(s.id,s),Xn.push(s)}Xn.sort(function(o,u){return u.latency-o.latency}),Xn.length>10&&Xn.splice(10).forEach(function(o){return Zl.delete(o.id)})}}},Ug=function(i){var e=self.requestIdleCallback||self.setTimeout,n=-1;return i=kg(i),document.visibilityState==="hidden"?i():(n=e(i),_f(i)),n},i0=[200,500],Ax=function(i,e){"PerformanceEventTiming"in self&&"interactionId"in PerformanceEventTiming.prototype&&(e=e||{},Pg(function(){var n;vx();var s,o=ns("INP"),u=function(m){Ug(function(){m.forEach(Ex);var p=Tx();p&&p.latency!==o.value&&(o.value=p.latency,o.entries=p.entries,s())})},f=No("event",u,{durationThreshold:(n=e.durationThreshold)!==null&&n!==void 0?n:40});s=is(i,o,i0,e.reportAllChanges),f&&(f.observe({type:"first-input",buffered:!0}),_f(function(){u(f.takeRecords()),s(!0)}),bu(function(){TS=vS(),Xn.length=0,Zl.clear(),o=ns("INP"),s=is(i,o,i0,e.reportAllChanges)}))}))},ho=[],Fr=[],Ap=0,Lg=new WeakMap,fo=new Map,bp=-1,bx=function(i){ho=ho.concat(i),AS()},AS=function(){bp<0&&(bp=Ug(Sx))},Sx=function(){fo.size>10&&fo.forEach(function(f,m){Zl.has(m)||fo.delete(m)});var i=Xn.map(function(f){return Lg.get(f.entries[0])}),e=Fr.length-50;Fr=Fr.filter(function(f,m){return m>=e||i.includes(f)});for(var n=new Set,s=0;s<Fr.length;s++){var o=Fr[s];bS(o.startTime,o.processingEnd).forEach(function(f){n.add(f)})}var u=ho.length-1-50;ho=ho.filter(function(f,m){return f.startTime>Ap&&m>u||n.has(f)}),bp=-1};ES.push(function(i){i.interactionId&&i.target&&!fo.has(i.interactionId)&&fo.set(i.interactionId,i.target)},function(i){var e,n=i.startTime+i.duration;Ap=Math.max(Ap,i.processingEnd);for(var s=Fr.length-1;s>=0;s--){var o=Fr[s];if(Math.abs(n-o.renderTime)<=8){(e=o).startTime=Math.min(i.startTime,e.startTime),e.processingStart=Math.min(i.processingStart,e.processingStart),e.processingEnd=Math.max(i.processingEnd,e.processingEnd),e.entries.push(i);break}}e||(e={startTime:i.startTime,processingStart:i.processingStart,processingEnd:i.processingEnd,renderTime:n,entries:[i]},Fr.push(e)),(i.interactionId||i.entryType==="first-input")&&Lg.set(i,e),AS()});var bS=function(i,e){for(var n,s=[],o=0;n=ho[o];o++)if(!(n.startTime+n.duration<i)){if(n.startTime>e)break;s.push(n)}return s},wx=function(i,e){WE||(WE=No("long-animation-frame",bx)),Ax(function(n){var s=function(o){var u=o.entries[0],f=Lg.get(u),m=u.processingStart,p=f.processingEnd,y=f.entries.sort(function(q,ne){return q.processingStart-ne.processingStart}),T=bS(u.startTime,p),S=o.entries.find(function(q){return q.target}),w=S&&S.target||fo.get(u.interactionId),P=[u.startTime+u.duration,p].concat(T.map(function(q){return q.startTime+q.duration})),k=Math.max.apply(Math,P),K={interactionTarget:Mg(w),interactionTargetElement:w,interactionType:u.name.startsWith("key")?"keyboard":"pointer",interactionTime:u.startTime,nextPaintTime:k,processedEventEntries:y,longAnimationFrameEntries:T,inputDelay:m-u.startTime,processingDuration:p-m,presentationDelay:Math.max(k-p,0),loadState:pS(u.startTime)};return Object.assign(o,{attribution:K})}(n);i(s)},e)},r0=[2500,4e3],qm={},Ix=function(i,e){(function(n,s){s=s||{},Pg(function(){var o,u=yS(),f=ns("LCP"),m=function(T){s.reportAllChanges||(T=T.slice(-1)),T.forEach(function(S){S.startTime<u.firstHiddenTime&&(f.value=Math.max(S.startTime-xg(),0),f.entries=[S],o())})},p=No("largest-contentful-paint",m);if(p){o=is(n,f,r0,s.reportAllChanges);var y=kg(function(){qm[f.id]||(m(p.takeRecords()),p.disconnect(),qm[f.id]=!0,o(!0))});["keydown","click"].forEach(function(T){addEventListener(T,function(){return Ug(y)},{once:!0,capture:!0})}),_f(y),bu(function(T){f=ns("LCP"),o=is(n,f,r0,s.reportAllChanges),Vg(function(){f.value=performance.now()-T.timeStamp,qm[f.id]=!0,o(!0)})})}})})(function(n){var s=function(o){var u={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadDuration:0,elementRenderDelay:o.value};if(o.entries.length){var f=yf();if(f){var m=f.activationStart||0,p=o.entries[o.entries.length-1],y=p.url&&performance.getEntriesByType("resource").filter(function(k){return k.name===p.url})[0],T=Math.max(0,f.responseStart-m),S=Math.max(T,y?(y.requestStart||y.startTime)-m:0),w=Math.max(S,y?y.responseEnd-m:0),P=Math.max(w,p.startTime-m);u={element:Mg(p.element),timeToFirstByte:T,resourceLoadDelay:S-T,resourceLoadDuration:w-S,elementRenderDelay:P-w,navigationEntry:f,lcpEntry:p},p.url&&(u.url=p.url),y&&(u.lcpResourceEntry=y)}}return Object.assign(o,{attribution:u})}(n);i(s)},e)};const s0="@firebase/performance",Sp="0.7.6";/**
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
 */const SS=Sp,Rx="FB-PERF-TRACE-START",Cx="FB-PERF-TRACE-STOP",wp="FB-PERF-TRACE-MEASURE",wS="_wt_",IS="_fp",RS="_fcp",CS="_fid",NS="_lcp",Nx="lcp_element",DS="_inp",Dx="inp_interactionTarget",OS="_cls",Ox="cls_largestShiftTarget",MS="@firebase/performance/config",xS="@firebase/performance/configexpire",Mx="performance",VS="Performance";/**
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
 */const xx={"trace started":"Trace {$traceName} was started before.","trace stopped":"Trace {$traceName} is not running.","nonpositive trace startTime":"Trace {$traceName} startTime should be positive.","nonpositive trace duration":"Trace {$traceName} duration should be positive.","no window":"Window is not available.","no app id":"App id is not available.","no project id":"Project id is not available.","no api key":"Api key is not available.","invalid cc log":"Attempted to queue invalid cc event","FB not default":"Performance can only start when Firebase app instance is the default one.","RC response not ok":"RC response is not ok","invalid attribute name":"Attribute name {$attributeName} is invalid.","invalid attribute value":"Attribute value {$attributeValue} is invalid.","invalid custom metric name":"Custom metric name {$customMetricName} is invalid","invalid String merger input":"Input for String merger is invalid, contact support team to resolve.","already initialized":"initializePerformance() has already been called with different options. To avoid this error, call initializePerformance() with the same options as when it was originally called, or call getPerformance() to return the already initialized instance."},Xt=new as(Mx,VS,xx);/**
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
 */const rs=new fu(VS);rs.logLevel=Me.INFO;/**
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
 */let Fm,kS;class Ct{constructor(e){if(this.window=e,!e)throw Xt.create("no window");this.performance=e.performance,this.PerformanceObserver=e.PerformanceObserver,this.windowLocation=e.location,this.navigator=e.navigator,this.document=e.document,this.navigator&&this.navigator.cookieEnabled&&(this.localStorage=e.localStorage),e.perfMetrics&&e.perfMetrics.onFirstInputDelay&&(this.onFirstInputDelay=e.perfMetrics.onFirstInputDelay),this.onLCP=Ix,this.onINP=wx,this.onCLS=yx}getUrl(){return this.windowLocation.href.split("?")[0]}mark(e){!this.performance||!this.performance.mark||this.performance.mark(e)}measure(e,n,s){!this.performance||!this.performance.measure||this.performance.measure(e,n,s)}getEntriesByType(e){return!this.performance||!this.performance.getEntriesByType?[]:this.performance.getEntriesByType(e)}getEntriesByName(e){return!this.performance||!this.performance.getEntriesByName?[]:this.performance.getEntriesByName(e)}getTimeOrigin(){return this.performance&&(this.performance.timeOrigin||this.performance.timing.navigationStart)}requiredApisAvailable(){return!fetch||!Promise||!w0()?(rs.info("Firebase Performance cannot start if browser does not support fetch and Promise or cookie is disabled."),!1):Np()?!0:(rs.info("IndexedDB is not supported by current browser"),!1)}setupObserver(e,n){if(!this.PerformanceObserver)return;new this.PerformanceObserver(o=>{for(const u of o.getEntries())n(u)}).observe({entryTypes:[e]})}static getInstance(){return Fm===void 0&&(Fm=new Ct(kS)),Fm}}function Vx(i){kS=i}/**
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
 */let PS;function kx(i){const e=i.getId();return e.then(n=>{PS=n}),e}function jg(){return PS}function Px(i){const e=i.getToken();return e.then(n=>{}),e}/**
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
 */function a0(i,e){const n=i.length-e.length;if(n<0||n>1)throw Xt.create("invalid String merger input");const s=[];for(let o=0;o<i.length;o++)s.push(i.charAt(o)),e.length>o&&s.push(e.charAt(o));return s.join("")}/**
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
 */let Hm;class Sn{constructor(){this.instrumentationEnabled=!0,this.dataCollectionEnabled=!0,this.loggingEnabled=!1,this.tracesSamplingRate=1,this.networkRequestsSamplingRate=1,this.logEndPointUrl="https://firebaselogging.googleapis.com/v0cc/log?format=json_proto",this.flTransportEndpointUrl=a0("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),this.transportKey=a0("AzSC8r6ReiGqFMyfvgow","Iayx0u-XT3vksVM-pIV"),this.logSource=462,this.logTraceAfterSampling=!1,this.logNetworkAfterSampling=!1,this.configTimeToLive=12}getFlTransportFullUrl(){return this.flTransportEndpointUrl.concat("?key=",this.transportKey)}static getInstance(){return Hm===void 0&&(Hm=new Sn),Hm}}/**
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
 */var Wl;(function(i){i[i.UNKNOWN=0]="UNKNOWN",i[i.VISIBLE=1]="VISIBLE",i[i.HIDDEN=2]="HIDDEN"})(Wl||(Wl={}));const Ux=["firebase_","google_","ga_"],Lx=new RegExp("^[a-zA-Z]\\w*$"),jx=40,zx=100;function Bx(){const i=Ct.getInstance().navigator;return i?.serviceWorker?i.serviceWorker.controller?2:3:1}function qx(){switch(Ct.getInstance().document.visibilityState){case"visible":return Wl.VISIBLE;case"hidden":return Wl.HIDDEN;default:return Wl.UNKNOWN}}function Fx(){const e=Ct.getInstance().navigator.connection;switch(e&&e.effectiveType){case"slow-2g":return 1;case"2g":return 2;case"3g":return 3;case"4g":return 4;default:return 0}}function Hx(i){return i.length===0||i.length>jx?!1:!Ux.some(n=>i.startsWith(n))&&!!i.match(Lx)}function Gx(i){return i.length!==0&&i.length<=zx}/**
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
 */function US(i){var e;const n=(e=i.options)===null||e===void 0?void 0:e.appId;if(!n)throw Xt.create("no app id");return n}function Kx(i){var e;const n=(e=i.options)===null||e===void 0?void 0:e.projectId;if(!n)throw Xt.create("no project id");return n}function Yx(i){var e;const n=(e=i.options)===null||e===void 0?void 0:e.apiKey;if(!n)throw Xt.create("no api key");return n}/**
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
 */const Qx="0.0.1",$n={loggingEnabled:!0},$x="FIREBASE_INSTALLATIONS_AUTH";function Xx(i,e){const n=Zx();return n?(o0(n),Promise.resolve()):eV(i,e).then(o0).then(s=>Wx(s),()=>{})}function Zx(){const i=Ct.getInstance().localStorage;if(!i)return;const e=i.getItem(xS);if(!e||!tV(e))return;const n=i.getItem(MS);if(n)try{return JSON.parse(n)}catch{return}}function Wx(i){const e=Ct.getInstance().localStorage;!i||!e||(e.setItem(MS,JSON.stringify(i)),e.setItem(xS,String(Date.now()+Sn.getInstance().configTimeToLive*60*60*1e3)))}const Jx="Could not fetch config, will use default configs";function eV(i,e){return Px(i.installations).then(n=>{const s=Kx(i.app),o=Yx(i.app),u=`https://firebaseremoteconfig.googleapis.com/v1/projects/${s}/namespaces/fireperf:fetch?key=${o}`,f=new Request(u,{method:"POST",headers:{Authorization:`${$x} ${n}`},body:JSON.stringify({app_instance_id:e,app_instance_id_token:n,app_id:US(i.app),app_version:SS,sdk_version:Qx})});return fetch(f).then(m=>{if(m.ok)return m.json();throw Xt.create("RC response not ok")})}).catch(()=>{rs.info(Jx)})}function o0(i){if(!i)return i;const e=Sn.getInstance(),n=i.entries||{};return n.fpr_enabled!==void 0?e.loggingEnabled=String(n.fpr_enabled)==="true":e.loggingEnabled=$n.loggingEnabled,n.fpr_log_source?e.logSource=Number(n.fpr_log_source):$n.logSource&&(e.logSource=$n.logSource),n.fpr_log_endpoint_url?e.logEndPointUrl=n.fpr_log_endpoint_url:$n.logEndPointUrl&&(e.logEndPointUrl=$n.logEndPointUrl),n.fpr_log_transport_key?e.transportKey=n.fpr_log_transport_key:$n.transportKey&&(e.transportKey=$n.transportKey),n.fpr_vc_network_request_sampling_rate!==void 0?e.networkRequestsSamplingRate=Number(n.fpr_vc_network_request_sampling_rate):$n.networkRequestsSamplingRate!==void 0&&(e.networkRequestsSamplingRate=$n.networkRequestsSamplingRate),n.fpr_vc_trace_sampling_rate!==void 0?e.tracesSamplingRate=Number(n.fpr_vc_trace_sampling_rate):$n.tracesSamplingRate!==void 0&&(e.tracesSamplingRate=$n.tracesSamplingRate),e.logTraceAfterSampling=l0(e.tracesSamplingRate),e.logNetworkAfterSampling=l0(e.networkRequestsSamplingRate),i}function tV(i){return Number(i)>Date.now()}function l0(i){return Math.random()<=i}/**
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
 */let zg=1,Gm;function LS(i){return zg=2,Gm=Gm||iV(i),Gm}function nV(){return zg===3}function iV(i){return rV().then(()=>kx(i.installations)).then(e=>Xx(i,e)).then(()=>u0(),()=>u0())}function rV(){const i=Ct.getInstance().document;return new Promise(e=>{if(i&&i.readyState!=="complete"){const n=()=>{i.readyState==="complete"&&(i.removeEventListener("readystatechange",n),e())};i.addEventListener("readystatechange",n)}else e()})}function u0(){zg=3}/**
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
 */const jS=10*1e3,sV=5.5*1e3,aV=1e3,zS=3;let mh=zS,Ws=[],c0=!1;function oV(){c0||(Bg(sV),c0=!0)}function Bg(i){setTimeout(()=>{mh<=0||(Ws.length>0&&BS(),Bg(jS))},i)}function BS(){const i=Ws.splice(0,aV),e=i.map(s=>({source_extension_json_proto3:s.message,event_time_ms:String(s.eventTime)})),n={request_time_ms:String(Date.now()),client_info:{client_type:1,js_client_info:{}},log_source:Sn.getInstance().logSource,log_event:e};lV(n).then(()=>{mh=zS}).catch(()=>{Ws=[...i,...Ws],mh--,rs.info(`Tries left: ${mh}.`),Bg(jS)})}function lV(i){const e=Sn.getInstance().getFlTransportFullUrl(),n=JSON.stringify(i);return navigator.sendBeacon&&navigator.sendBeacon(e,n)?Promise.resolve():fetch(e,{method:"POST",body:n,keepalive:!0}).then()}function uV(i){if(!i.eventTime||!i.message)throw Xt.create("invalid cc log");Ws=[...Ws,i]}function cV(i){return(...e)=>{const n=i(...e);uV({message:n,eventTime:Date.now()})}}function hV(){for(;Ws.length>0;)BS()}/**
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
 */let Jl;function qS(i,e){Jl||(Jl={send:cV(mV),flush:hV}),Jl.send(i,e)}function ih(i){const e=Sn.getInstance();!e.instrumentationEnabled&&i.isAuto||!e.dataCollectionEnabled&&!i.isAuto||Ct.getInstance().requiredApisAvailable()&&(nV()?Km(i):LS(i.performanceController).then(()=>Km(i),()=>Km(i)))}function fV(){Jl&&Jl.flush()}function Km(i){if(!jg())return;const e=Sn.getInstance();!e.loggingEnabled||!e.logTraceAfterSampling||qS(i,1)}function dV(i){const e=Sn.getInstance();if(!e.instrumentationEnabled)return;const n=i.url,s=e.logEndPointUrl.split("?")[0],o=e.flTransportEndpointUrl.split("?")[0];n===s||n===o||!e.loggingEnabled||!e.logNetworkAfterSampling||qS(i,0)}function mV(i,e){return e===0?pV(i):gV(i)}function pV(i){const e={url:i.url,http_method:i.httpMethod||0,http_response_code:200,response_payload_bytes:i.responsePayloadBytes,client_start_time_us:i.startTimeUs,time_to_response_initiated_us:i.timeToResponseInitiatedUs,time_to_response_completed_us:i.timeToResponseCompletedUs},n={application_info:FS(i.performanceController.app),network_request_metric:e};return JSON.stringify(n)}function gV(i){const e={name:i.name,is_auto:i.isAuto,client_start_time_us:i.startTimeUs,duration_us:i.durationUs};Object.keys(i.counters).length!==0&&(e.counters=i.counters);const n=i.getAttributes();Object.keys(n).length!==0&&(e.custom_attributes=n);const s={application_info:FS(i.performanceController.app),trace_metric:e};return JSON.stringify(s)}function FS(i){return{google_app_id:US(i),app_instance_id:jg(),web_app_info:{sdk_version:SS,page_url:Ct.getInstance().getUrl(),service_worker_status:Bx(),visibility_state:qx(),effective_connection_type:Fx()},application_process_state:0}}/**
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
 */function h0(i,e){const n=e;if(!n||n.responseStart===void 0)return;const s=Ct.getInstance().getTimeOrigin(),o=Math.floor((n.startTime+s)*1e3),u=n.responseStart?Math.floor((n.responseStart-n.startTime)*1e3):void 0,f=Math.floor((n.responseEnd-n.startTime)*1e3),m=n.name&&n.name.split("?")[0],p={performanceController:i,url:m,responsePayloadBytes:n.transferSize,startTimeUs:o,timeToResponseInitiatedUs:u,timeToResponseCompletedUs:f};dV(p)}/**
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
 */const yV=100,_V="_",vV=[IS,RS,CS,NS,OS,DS];function TV(i,e){return i.length===0||i.length>yV?!1:e&&e.startsWith(wS)&&vV.indexOf(i)>-1||!i.startsWith(_V)}function EV(i){const e=Math.floor(i);return e<i&&rs.info(`Metric value should be an Integer, setting the value as : ${e}.`),e}/**
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
 */class cu{constructor(e,n,s=!1,o){this.performanceController=e,this.name=n,this.isAuto=s,this.state=1,this.customAttributes={},this.counters={},this.api=Ct.getInstance(),this.randomId=Math.floor(Math.random()*1e6),this.isAuto||(this.traceStartMark=`${Rx}-${this.randomId}-${this.name}`,this.traceStopMark=`${Cx}-${this.randomId}-${this.name}`,this.traceMeasure=o||`${wp}-${this.randomId}-${this.name}`,o&&this.calculateTraceMetrics())}start(){if(this.state!==1)throw Xt.create("trace started",{traceName:this.name});this.api.mark(this.traceStartMark),this.state=2}stop(){if(this.state!==2)throw Xt.create("trace stopped",{traceName:this.name});this.state=3,this.api.mark(this.traceStopMark),this.api.measure(this.traceMeasure,this.traceStartMark,this.traceStopMark),this.calculateTraceMetrics(),ih(this)}record(e,n,s){if(e<=0)throw Xt.create("nonpositive trace startTime",{traceName:this.name});if(n<=0)throw Xt.create("nonpositive trace duration",{traceName:this.name});if(this.durationUs=Math.floor(n*1e3),this.startTimeUs=Math.floor(e*1e3),s&&s.attributes&&(this.customAttributes=Object.assign({},s.attributes)),s&&s.metrics)for(const o of Object.keys(s.metrics))isNaN(Number(s.metrics[o]))||(this.counters[o]=Math.floor(Number(s.metrics[o])));ih(this)}incrementMetric(e,n=1){this.counters[e]===void 0?this.putMetric(e,n):this.putMetric(e,this.counters[e]+n)}putMetric(e,n){if(TV(e,this.name))this.counters[e]=EV(n??0);else throw Xt.create("invalid custom metric name",{customMetricName:e})}getMetric(e){return this.counters[e]||0}putAttribute(e,n){const s=Hx(e),o=Gx(n);if(s&&o){this.customAttributes[e]=n;return}if(!s)throw Xt.create("invalid attribute name",{attributeName:e});if(!o)throw Xt.create("invalid attribute value",{attributeValue:n})}getAttribute(e){return this.customAttributes[e]}removeAttribute(e){this.customAttributes[e]!==void 0&&delete this.customAttributes[e]}getAttributes(){return Object.assign({},this.customAttributes)}setStartTime(e){this.startTimeUs=e}setDuration(e){this.durationUs=e}calculateTraceMetrics(){const e=this.api.getEntriesByName(this.traceMeasure),n=e&&e[0];n&&(this.durationUs=Math.floor(n.duration*1e3),this.startTimeUs=Math.floor((n.startTime+this.api.getTimeOrigin())*1e3))}static createOobTrace(e,n,s,o,u){const f=Ct.getInstance().getUrl();if(!f)return;const m=new cu(e,wS+f,!0),p=Math.floor(Ct.getInstance().getTimeOrigin()*1e3);m.setStartTime(p),n&&n[0]&&(m.setDuration(Math.floor(n[0].duration*1e3)),m.putMetric("domInteractive",Math.floor(n[0].domInteractive*1e3)),m.putMetric("domContentLoadedEventEnd",Math.floor(n[0].domContentLoadedEventEnd*1e3)),m.putMetric("loadEventEnd",Math.floor(n[0].loadEventEnd*1e3)));const y="first-paint",T="first-contentful-paint";if(s){const S=s.find(P=>P.name===y);S&&S.startTime&&m.putMetric(IS,Math.floor(S.startTime*1e3));const w=s.find(P=>P.name===T);w&&w.startTime&&m.putMetric(RS,Math.floor(w.startTime*1e3)),u&&m.putMetric(CS,Math.floor(u*1e3))}this.addWebVitalMetric(m,NS,Nx,o.lcp),this.addWebVitalMetric(m,OS,Ox,o.cls),this.addWebVitalMetric(m,DS,Dx,o.inp),ih(m),fV()}static addWebVitalMetric(e,n,s,o){o&&(e.putMetric(n,Math.floor(o.value*1e3)),o.elementAttribution&&e.putAttribute(s,o.elementAttribution))}static createUserTimingTrace(e,n){const s=new cu(e,n,!1,n);ih(s)}}/**
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
 */let ph={},f0=!1,HS;function d0(i){jg()&&(setTimeout(()=>bV(i),0),setTimeout(()=>AV(i),0),setTimeout(()=>SV(i),0))}function AV(i){const e=Ct.getInstance(),n=e.getEntriesByType("resource");for(const s of n)h0(i,s);e.setupObserver("resource",s=>h0(i,s))}function bV(i){const e=Ct.getInstance();"onpagehide"in window?e.document.addEventListener("pagehide",()=>Ym(i)):e.document.addEventListener("unload",()=>Ym(i)),e.document.addEventListener("visibilitychange",()=>{e.document.visibilityState==="hidden"&&Ym(i)}),e.onFirstInputDelay&&e.onFirstInputDelay(n=>{HS=n}),e.onLCP(n=>{var s;ph.lcp={value:n.value,elementAttribution:(s=n.attribution)===null||s===void 0?void 0:s.element}}),e.onCLS(n=>{var s;ph.cls={value:n.value,elementAttribution:(s=n.attribution)===null||s===void 0?void 0:s.largestShiftTarget}}),e.onINP(n=>{var s;ph.inp={value:n.value,elementAttribution:(s=n.attribution)===null||s===void 0?void 0:s.interactionTarget}})}function SV(i){const e=Ct.getInstance(),n=e.getEntriesByType("measure");for(const s of n)m0(i,s);e.setupObserver("measure",s=>m0(i,s))}function m0(i,e){const n=e.name;n.substring(0,wp.length)!==wp&&cu.createUserTimingTrace(i,n)}function Ym(i){if(!f0){f0=!0;const e=Ct.getInstance(),n=e.getEntriesByType("navigation"),s=e.getEntriesByType("paint");setTimeout(()=>{cu.createOobTrace(i,n,s,ph,HS)},0)}}/**
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
 */class wV{constructor(e,n){this.app=e,this.installations=n,this.initialized=!1}_init(e){this.initialized||(e?.dataCollectionEnabled!==void 0&&(this.dataCollectionEnabled=e.dataCollectionEnabled),e?.instrumentationEnabled!==void 0&&(this.instrumentationEnabled=e.instrumentationEnabled),Ct.getInstance().requiredApisAvailable()?Dp().then(n=>{n&&(oV(),LS(this).then(()=>d0(this),()=>d0(this)),this.initialized=!0)}).catch(n=>{rs.info(`Environment doesn't support IndexedDB: ${n}`)}):rs.info('Firebase Performance cannot start if the browser does not support "Fetch" and "Promise", or cookies are disabled.'))}set instrumentationEnabled(e){Sn.getInstance().instrumentationEnabled=e}get instrumentationEnabled(){return Sn.getInstance().instrumentationEnabled}set dataCollectionEnabled(e){Sn.getInstance().dataCollectionEnabled=e}get dataCollectionEnabled(){return Sn.getInstance().dataCollectionEnabled}}const IV="[DEFAULT]";function RV(i=du()){return i=mt(i),lr(i,"performance").getImmediate()}const CV=(i,{options:e})=>{const n=i.getProvider("app").getImmediate(),s=i.getProvider("installations-internal").getImmediate();if(n.name!==IV)throw Xt.create("FB not default");if(typeof window>"u")throw Xt.create("no window");Vx(window);const o=new wV(n,s);return o._init(e),o};function NV(){Bn(new In("performance",CV,"PUBLIC")),Wt(s0,Sp),Wt(s0,Sp,"esm2017")}NV();const DV={apiKey:"AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",authDomain:"liquidacionapp-62962.firebaseapp.com",projectId:"liquidacionapp-62962",storageBucket:"liquidacionapp-62962.firebasestorage.app",messagingSenderId:"851382130132",appId:"1:851382130132:web:eaba38fab449f14fb5b241"},Su=N0(DV);typeof window<"u"&&ux(Su);typeof window<"u"&&RV(Su);const OV=rN(Su),ss=nO(Su);HO(Su);const eu={ADMIN:"admin",CONTADOR:"contador",CLIENTE:"cliente"},it={MANAGE_INVENTORY:"canManageInventory",CREATE_MOVEMENTS:"canCreateMovements",VIEW_ALL_MOVEMENTS:"canViewAllMovements",MANAGE_VEHICLES:"canManageVehicles",MANAGE_SUPPLIERS:"canManageSuppliers",VIEW_REPORTS:"canViewReports",EXPORT_REPORTS:"canExportReports",MODIFY_SETTINGS:"canModifySettings"},MV="contacto.evert@gmail.com",xV=i=>{switch(i){case eu.ADMIN:return{[it.MANAGE_INVENTORY]:!0,[it.CREATE_MOVEMENTS]:!0,[it.VIEW_ALL_MOVEMENTS]:!0,[it.MANAGE_VEHICLES]:!0,[it.MANAGE_SUPPLIERS]:!0,[it.VIEW_REPORTS]:!0,[it.EXPORT_REPORTS]:!0,[it.MODIFY_SETTINGS]:!0};case eu.CONTADOR:return{[it.MANAGE_INVENTORY]:!0,[it.CREATE_MOVEMENTS]:!0,[it.VIEW_ALL_MOVEMENTS]:!0,[it.MANAGE_VEHICLES]:!1,[it.MANAGE_SUPPLIERS]:!1,[it.VIEW_REPORTS]:!0,[it.EXPORT_REPORTS]:!0,[it.MODIFY_SETTINGS]:!1};case eu.CLIENTE:default:return{[it.MANAGE_INVENTORY]:!1,[it.CREATE_MOVEMENTS]:!0,[it.VIEW_ALL_MOVEMENTS]:!1,[it.MANAGE_VEHICLES]:!1,[it.MANAGE_SUPPLIERS]:!1,[it.VIEW_REPORTS]:!1,[it.EXPORT_REPORTS]:!1,[it.MODIFY_SETTINGS]:!1}}},VV=i=>i===MV?eu.ADMIN:eu.CLIENTE,kV=async(i,e={})=>{const n=Eu(ss,"artifacts/1:851382130132:web:eaba38fab449f14fb5b241/users",i.uid);try{const s=await df(n);if(s.exists())return{success:!0,userData:s.data(),isNewUser:!1};{const o=VV(i.email),u={uid:i.uid,email:i.email,displayName:i.displayName||"",photoURL:i.photoURL||"",role:o,emailVerified:i.emailVerified,combustiblesPermissions:xV(o),createdAt:new Date().toISOString(),lastLogin:new Date().toISOString(),...e};return await mO(n,u),{success:!0,userData:u,isNewUser:!0}}}catch(s){return console.error("Error creating/updating user profile:",s),{success:!1,error:s.message}}},PV=async i=>{try{const e=Eu(ss,"artifacts/1:851382130132:web:eaba38fab449f14fb5b241/users",i),n=await df(e);return n.exists()?{success:!0,userData:n.data()}:{success:!1,error:"Usuario no encontrado"}}catch(e){return console.error("Error fetching user profile:",e),{success:!1,error:e.message}}},GS=je.createContext(),vf=()=>{const i=je.useContext(GS);if(i===void 0)throw new Error("useCombustibles must be used within a CombustiblesProvider");return i},UV=({children:i})=>{const[e,n]=je.useState(null),[s,o]=je.useState(null),[u,f]=je.useState(!0),[m,p]=je.useState(null),[y,T]=je.useState([]),[S,w]=je.useState([]),[P,k]=je.useState([]),[K,q]=je.useState([]);je.useEffect(()=>{const C=YR(OV,async D=>{try{if(f(!0),D){n(D);let x=await PV(D.uid);x.success||(x=await kV(D,{provider:"existing_account",appContext:"combustibles"})),x.success?o(x.userData):p("Error cargando perfil de usuario")}else n(null),o(null),T([]),w([]),k([]),q([])}catch(x){console.error("Error en autenticación:",x),p("Error de autenticación")}finally{f(!1)}});return()=>C()},[]);const I={user:e,userProfile:s,loading:u,error:m,hasPermission:C=>s?.combustiblesPermissions?.[C]||!1,isAdmin:()=>s?.role==="admin",isCounterOrAbove:()=>s?.role==="admin"||s?.role==="contador",inventory:y,movements:S,vehicles:P,suppliers:K,setInventory:T,setMovements:w,setVehicles:k,setSuppliers:q,refreshInventory:async()=>{console.log("Refrescando inventario...")},refreshMovements:async()=>{console.log("Refrescando movimientos...")},refreshVehicles:async()=>{console.log("Refrescando vehículos...")},refreshSuppliers:async()=>{console.log("Refrescando proveedores...")}};return E.jsx(GS.Provider,{value:I,children:i})},LV=({children:i,currentView:e,onViewChange:n})=>{const{userProfile:s,isAdmin:o,isCounterOrAbove:u}=vf(),[f,m]=je.useState(!1),p=[{id:"dashboard",name:"Dashboard",icon:"📊",description:"Vista general",requiredPermission:null},{id:"inventory",name:"Inventario",icon:"🛢️",description:"Gestión de stock",requiredPermission:"canManageInventory"},{id:"movements",name:"Movimientos",icon:"📈",description:"Entradas y salidas",requiredPermission:"canCreateMovements"},{id:"vehicles",name:"Vehículos",icon:"🚜",description:"Maquinaria forestal",requiredPermission:null},{id:"suppliers",name:"Proveedores",icon:"🏪",description:"Gestión de proveedores",requiredPermission:"canManageSuppliers"},{id:"reports",name:"Reportes",icon:"📋",description:"Análisis y reportes",requiredPermission:"canViewReports"}],y=w=>{n(w),m(!1)},T=w=>w?s?.combustiblesPermissions?.[w]||!1:!0,S=p.filter(w=>T(w.requiredPermission));return E.jsxs("div",{className:"dashboard-layout",children:[E.jsx("header",{className:"dashboard-header",children:E.jsxs("div",{className:"header-content",children:[E.jsx("button",{className:"sidebar-toggle",onClick:()=>m(!f),children:"☰"}),E.jsxs("div",{className:"header-title",children:[E.jsx("h1",{children:"⛽ Gestión de Combustibles"}),E.jsx("span",{className:"subtitle",children:"Forestech Colombia"})]}),E.jsxs("div",{className:"header-user",children:[E.jsxs("div",{className:"user-info",children:[E.jsx("span",{className:"user-name",children:s?.displayName||s?.email}),E.jsx("span",{className:"user-role",children:s?.role})]}),E.jsx("div",{className:"user-avatar",children:s?.photoURL?E.jsx("img",{src:s.photoURL,alt:"Avatar"}):E.jsx("div",{className:"avatar-placeholder",children:(s?.displayName||s?.email||"U").charAt(0).toUpperCase()})})]})]})}),E.jsxs("div",{className:"dashboard-body",children:[E.jsxs("aside",{className:`dashboard-sidebar ${f?"open":""}`,children:[E.jsx("nav",{className:"sidebar-nav",children:S.map(w=>E.jsxs("button",{className:`nav-item ${e===w.id?"active":""}`,onClick:()=>y(w.id),children:[E.jsx("span",{className:"nav-icon",children:w.icon}),E.jsxs("div",{className:"nav-content",children:[E.jsx("span",{className:"nav-name",children:w.name}),E.jsx("span",{className:"nav-description",children:w.description})]})]},w.id))}),E.jsx("div",{className:"sidebar-footer",children:E.jsxs("div",{className:"user-permissions",children:[E.jsx("h4",{children:"Permisos Activos:"}),E.jsxs("div",{className:"permission-list",children:[o()&&E.jsx("span",{className:"permission admin",children:"👑 Administrador"}),u()&&E.jsx("span",{className:"permission counter",children:"📊 Gestión Operativa"}),T("canManageInventory")&&E.jsx("span",{className:"permission",children:"🛢️ Inventario"}),T("canManageVehicles")&&E.jsx("span",{className:"permission",children:"🚜 Vehículos"})]})]})})]}),E.jsx("main",{className:"dashboard-main",children:E.jsx("div",{className:"main-content",children:i})})]}),f&&E.jsx("div",{className:"sidebar-overlay",onClick:()=>m(!1)})]})},ro={DIESEL:"diesel",GASOLINE:"gasoline",ACPM:"acpm",LUBRICANTS:"lubricants",TWO_STROKE:"two_stroke"},tr={[ro.DIESEL]:{name:"Diésel",description:"Combustible para maquinaria pesada",unit:"galones",category:"Combustible",color:"#fbbf24",icon:"🚛",density:.85,priceUnit:"COP/galón"},[ro.GASOLINE]:{name:"Gasolina",description:"Combustible para vehículos livianos",unit:"galones",category:"Combustible",color:"#ef4444",icon:"⛽",density:.75,priceUnit:"COP/galón"},[ro.ACPM]:{name:"ACPM",description:"Aceite Combustible Para Motor",unit:"galones",category:"Combustible",color:"#8b5cf6",icon:"🚜",density:.85,priceUnit:"COP/galón"},[ro.LUBRICANTS]:{name:"Lubricantes",description:"Aceites y lubricantes para mantenimiento",unit:"litros",category:"Mantenimiento",color:"#06b6d4",icon:"🛢️",density:.9,priceUnit:"COP/litro"},[ro.TWO_STROKE]:{name:"Mezcla 2T",description:"Mezcla para motores de 2 tiempos (motosierras)",unit:"litros",category:"Especializado",color:"#10b981",icon:"🪚",density:.78,priceUnit:"COP/litro"}},an={CRITICAL:"critical",LOW:"low",MEDIUM:"medium",HIGH:"high",FULL:"full"},Xs={[an.CRITICAL]:{label:"Crítico",color:"#dc2626",icon:"🚨",threshold:.1},[an.LOW]:{label:"Bajo",color:"#ea580c",icon:"⚠️",threshold:.25},[an.MEDIUM]:{label:"Medio",color:"#ca8a04",icon:"📊",threshold:.5},[an.HIGH]:{label:"Alto",color:"#16a34a",icon:"✅",threshold:.75},[an.FULL]:{label:"Completo",color:"#059669",icon:"🟢",threshold:1}},qh=(i,e)=>{if(e===0)return an.CRITICAL;const n=i/e;return n<Xs[an.CRITICAL].threshold?an.CRITICAL:n<Xs[an.LOW].threshold?an.LOW:n<Xs[an.MEDIUM].threshold?an.MEDIUM:n<Xs[an.HIGH].threshold?an.HIGH:an.FULL},p0=()=>{const{userProfile:i}=vf(),e=[{fuelType:"diesel",currentStock:1250,maxCapacity:2e3,location:"Tanque Principal",lastUpdated:new Date(Date.now()-2*60*60*1e3)},{fuelType:"gasoline",currentStock:180,maxCapacity:500,location:"Tanque Auxiliar",lastUpdated:new Date(Date.now()-4*60*60*1e3)},{fuelType:"acpm",currentStock:95,maxCapacity:1200,location:"Depósito Central",lastUpdated:new Date(Date.now()-1*60*60*1e3)},{fuelType:"lubricants",currentStock:85,maxCapacity:200,location:"Bodega",lastUpdated:new Date(Date.now()-6*60*60*1e3)}],n=[{type:"entry",quantity:500,fuelType:"diesel",date:new Date(Date.now()-1*24*60*60*1e3)},{type:"exit",quantity:120,fuelType:"gasoline",date:new Date(Date.now()-1*60*60*1e3)},{type:"exit",quantity:250,fuelType:"diesel",date:new Date(Date.now()-3*60*60*1e3)},{type:"entry",quantity:200,fuelType:"acpm",date:new Date(Date.now()-2*24*60*60*1e3)}],s=[{vehicleType:"harvester",name:"Cosechadora 001",status:"active",fuelType:"diesel",lastUsed:new Date},{vehicleType:"chainsaw",name:"Motosierra 015",status:"active",fuelType:"two_stroke",lastUsed:new Date},{vehicleType:"log_truck",name:"Camión MD-789",status:"maintenance",fuelType:"acpm",lastUsed:new Date(Date.now()-2*24*60*60*1e3)},{vehicleType:"pickup_truck",name:"Toyota Hilux",status:"active",fuelType:"gasoline",lastUsed:new Date}],o=e.reduce((T,S)=>{const w=tr[S.fuelType];return T+S.currentStock*(w?12e3:0)},0),u=n.filter(T=>T.date.toDateString()===new Date().toDateString()).length,f=s.filter(T=>T.status==="active").length,m=e.filter(T=>{const S=qh(T.currentStock,T.maxCapacity);return S==="critical"||S==="low"}),p=T=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(T),y=T=>new Intl.NumberFormat("es-CO").format(T);return E.jsxs("div",{className:"dashboard-main-content",children:[E.jsxs("div",{className:"dashboard-welcome",children:[E.jsxs("h2",{children:["Bienvenido, ",i?.displayName||"Usuario"]}),E.jsxs("p",{children:["Dashboard de Gestión de Combustibles - ",new Date().toLocaleDateString("es-CO",{weekday:"long",year:"numeric",month:"long",day:"numeric"})]})]}),E.jsxs("div",{className:"dashboard-cards",children:[E.jsxs("div",{className:"dashboard-card",children:[E.jsx("div",{className:"card-header",children:E.jsxs("div",{className:"card-title",children:[E.jsx("span",{className:"card-icon",children:"💰"}),"Valor Total Inventario"]})}),E.jsx("div",{className:"card-value",children:p(o)}),E.jsxs("div",{className:"card-description",children:[e.length," tipos de combustible en stock"]}),E.jsx("div",{className:"card-trend trend-positive",children:"↗ +5.2% vs mes anterior"})]}),E.jsxs("div",{className:"dashboard-card",children:[E.jsx("div",{className:"card-header",children:E.jsxs("div",{className:"card-title",children:[E.jsx("span",{className:"card-icon",children:"📈"}),"Movimientos Hoy"]})}),E.jsx("div",{className:"card-value",children:u}),E.jsx("div",{className:"card-description",children:"Entradas y salidas registradas"}),E.jsx("div",{className:"card-trend trend-positive",children:"↗ Actividad normal"})]}),E.jsxs("div",{className:"dashboard-card",children:[E.jsx("div",{className:"card-header",children:E.jsxs("div",{className:"card-title",children:[E.jsx("span",{className:"card-icon",children:"🚜"}),"Vehículos Activos"]})}),E.jsx("div",{className:"card-value",children:f}),E.jsxs("div",{className:"card-description",children:["de ",s.length," vehículos totales"]}),E.jsxs("div",{className:"card-trend trend-positive",children:["↗ ",Math.round(f/s.length*100),"% operatividad"]})]}),E.jsxs("div",{className:"dashboard-card",children:[E.jsx("div",{className:"card-header",children:E.jsxs("div",{className:"card-title",children:[E.jsx("span",{className:"card-icon",children:"⚠️"}),"Alertas de Stock"]})}),E.jsx("div",{className:"card-value",style:{color:m.length>0?"#dc2626":"#16a34a"},children:m.length}),E.jsx("div",{className:"card-description",children:m.length>0?"Requieren atención":"Niveles normales"}),m.length>0&&E.jsx("div",{className:"card-trend trend-negative",children:"⚠ Revisar stock crítico"})]})]}),E.jsxs("div",{className:"dashboard-section",children:[E.jsx("h3",{children:"🛢️ Resumen de Inventario"}),E.jsx("div",{className:"inventory-grid",children:e.map((T,S)=>{const w=tr[T.fuelType],P=qh(T.currentStock,T.maxCapacity),k=Xs[P],K=Math.round(T.currentStock/T.maxCapacity*100);return E.jsxs("div",{className:"inventory-card",children:[E.jsxs("div",{className:"inventory-header",children:[E.jsx("span",{className:"fuel-icon",style:{color:w?.color},children:w?.icon}),E.jsxs("div",{children:[E.jsx("h4",{children:w?.name}),E.jsx("p",{children:T.location})]}),E.jsx("span",{className:"stock-badge",style:{background:k?.color,color:"white"},children:k?.icon})]}),E.jsxs("div",{className:"inventory-progress",children:[E.jsx("div",{className:"progress-bar",children:E.jsx("div",{className:"progress-fill",style:{width:`${K}%`,background:k?.color}})}),E.jsxs("div",{className:"progress-text",children:[y(T.currentStock)," / ",y(T.maxCapacity)," ",w?.unit]})]}),E.jsxs("div",{className:"inventory-meta",children:[E.jsxs("span",{children:[K,"% capacidad"]}),E.jsxs("span",{children:["Actualizado: ",T.lastUpdated.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"})]})]})]},S)})})]}),E.jsxs("div",{className:"dashboard-section",children:[E.jsx("h3",{children:"📊 Actividad Reciente"}),E.jsx("div",{className:"activity-list",children:n.slice(0,5).map((T,S)=>{const w=tr[T.fuelType],P=T.type==="entry";return E.jsxs("div",{className:"activity-item",children:[E.jsx("div",{className:"activity-icon",style:{background:P?"#dcfce7":"#fef2f2"},children:P?"📥":"📤"}),E.jsxs("div",{className:"activity-content",children:[E.jsxs("div",{className:"activity-title",children:[P?"Entrada":"Salida"," de ",w?.name]}),E.jsxs("div",{className:"activity-description",children:[y(T.quantity)," ",w?.unit," - ",T.date.toLocaleString("es-CO")]})]}),E.jsxs("div",{className:"activity-amount",style:{color:P?"#16a34a":"#dc2626"},children:[P?"+":"-",y(T.quantity)]})]},S)})})]})]})},Ao="artifacts/1:851382130132:web:eaba38fab449f14fb5b241/combustibles/inventory",jV=async(i,e)=>{try{const n=tr[i.fuelType];if(!n)return{success:!1,error:"Tipo de combustible no válido"};const s=bg(kh(ss,Ao),PE("fuelType","==",i.fuelType),PE("location","==",i.location));if(!(await qb(s)).empty)return{success:!1,error:`Ya existe ${n.name} en ${i.location}`};const u={fuelType:i.fuelType,name:n.name,description:i.description||n.description,currentStock:Number(i.currentStock)||0,maxCapacity:Number(i.maxCapacity),minThreshold:Number(i.minThreshold)||i.maxCapacity*.15,unit:n.unit,location:i.location,pricePerUnit:Number(i.pricePerUnit)||0,supplier:i.supplier||"",status:i.status||"active",createdAt:new Date,createdBy:e,lastUpdated:new Date,updatedBy:e};return{success:!0,data:{id:(await yO(kh(ss,Ao),u)).id,...u},message:`${n.name} agregado al inventario exitosamente`}}catch(n){return console.error("Error creating inventory item:",n),{success:!1,error:n.message}}},zV=async()=>{try{const i=bg(kh(ss,Ao),Ub("fuelType","asc")),e=await qb(i),n=[];return e.forEach(s=>{const o=s.data();n.push({id:s.id,...o,stockLevel:qh(o.currentStock,o.maxCapacity),stockPercentage:Math.round(o.currentStock/o.maxCapacity*100),needsRestock:o.currentStock<=o.minThreshold})}),{success:!0,data:n}}catch(i){return console.error("Error fetching inventory items:",i),{success:!1,error:i.message}}},BV=async(i,e,n)=>{try{const s=Eu(ss,Ao,i);if(!(await df(s)).exists())return{success:!1,error:"Item no encontrado"};const u={...e,lastUpdated:new Date,updatedBy:n};return delete u.id,delete u.createdAt,delete u.createdBy,await pO(s,u),{success:!0,message:"Item actualizado exitosamente",data:{id:i,...u}}}catch(s){return console.error("Error updating inventory item:",s),{success:!1,error:s.message}}},qV=async i=>{try{const e=Eu(ss,Ao,i);return(await df(e)).exists()?(await gO(e),{success:!0,message:"Item eliminado exitosamente"}):{success:!1,error:"Item no encontrado"}}catch(e){return console.error("Error deleting inventory item:",e),{success:!1,error:e.message}}},FV=i=>{const e=bg(kh(ss,Ao),Ub("fuelType","asc"));return _O(e,n=>{const s=[];n.forEach(o=>{const u=o.data();s.push({id:o.id,...u,stockLevel:qh(u.currentStock,u.maxCapacity),stockPercentage:Math.round(u.currentStock/u.maxCapacity*100),needsRestock:u.currentStock<=u.minThreshold})}),i(s)},n=>{console.error("Error in inventory subscription:",n),i(null,n)})},HV=async()=>{try{const i=await zV();if(!i.success)return i;const e=i.data,n={totalItems:e.length,activeItems:e.filter(s=>s.status==="active").length,lowStockItems:e.filter(s=>s.needsRestock).length,totalValue:e.reduce((s,o)=>s+o.currentStock*o.pricePerUnit,0),averageStockLevel:e.length>0?Math.round(e.reduce((s,o)=>s+o.stockPercentage,0)/e.length):0,byFuelType:{}};return e.forEach(s=>{n.byFuelType[s.fuelType]||(n.byFuelType[s.fuelType]={count:0,totalStock:0,totalCapacity:0,totalValue:0}),n.byFuelType[s.fuelType].count++,n.byFuelType[s.fuelType].totalStock+=s.currentStock,n.byFuelType[s.fuelType].totalCapacity+=s.maxCapacity,n.byFuelType[s.fuelType].totalValue+=s.currentStock*s.pricePerUnit}),{success:!0,data:n}}catch(i){return console.error("Error calculating inventory stats:",i),{success:!1,error:i.message}}},GV=({items:i,onEdit:e,onDelete:n,canManage:s})=>{const[o,u]=je.useState("name"),[f,m]=je.useState("asc"),p=k=>new Intl.NumberFormat("es-CO").format(k),y=k=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(k),T=k=>{const q=new Date-new Date(k.seconds?k.seconds*1e3:k),ne=Math.floor(q/(1e3*60*60)),se=Math.floor(ne/24);return se>0?`${se}d`:ne>0?`${ne}h`:"ahora"},S=k=>{o===k?m(f==="asc"?"desc":"asc"):(u(k),m("asc"))},w=[...i].sort((k,K)=>{let q=k[o],ne=K[o];return o==="lastUpdated"&&(q=new Date(q.seconds?q.seconds*1e3:q),ne=new Date(ne.seconds?ne.seconds*1e3:ne)),q<ne?f==="asc"?-1:1:q>ne?f==="asc"?1:-1:0}),P=k=>o!==k?"↕️":f==="asc"?"↑":"↓";return E.jsxs("div",{className:"inventory-table-container",children:[E.jsx("div",{className:"table-wrapper",children:E.jsxs("table",{className:"inventory-table",children:[E.jsx("thead",{children:E.jsxs("tr",{children:[E.jsxs("th",{onClick:()=>S("name"),className:"sortable",children:["Combustible ",P("name")]}),E.jsxs("th",{onClick:()=>S("location"),className:"sortable",children:["Ubicación ",P("location")]}),E.jsxs("th",{onClick:()=>S("currentStock"),className:"sortable",children:["Stock Actual ",P("currentStock")]}),E.jsxs("th",{onClick:()=>S("stockPercentage"),className:"sortable",children:["Nivel ",P("stockPercentage")]}),E.jsxs("th",{onClick:()=>S("pricePerUnit"),className:"sortable",children:["Precio ",P("pricePerUnit")]}),E.jsx("th",{children:"Valor Total"}),E.jsxs("th",{onClick:()=>S("status"),className:"sortable",children:["Estado ",P("status")]}),E.jsxs("th",{onClick:()=>S("lastUpdated"),className:"sortable",children:["Actualizado ",P("lastUpdated")]}),s&&E.jsx("th",{children:"Acciones"})]})}),E.jsx("tbody",{children:w.map(k=>{const K=tr[k.fuelType],q=Xs[k.stockLevel],ne=k.currentStock*k.pricePerUnit;return E.jsxs("tr",{className:k.needsRestock?"needs-restock":"",children:[E.jsx("td",{className:"fuel-cell",children:E.jsxs("div",{className:"fuel-info",children:[E.jsx("span",{className:"fuel-icon",style:{color:K?.color},children:K?.icon}),E.jsxs("div",{children:[E.jsx("div",{className:"fuel-name",children:K?.name}),E.jsx("div",{className:"fuel-type",children:k.fuelType})]})]})}),E.jsx("td",{children:k.location}),E.jsxs("td",{className:"stock-cell",children:[E.jsxs("div",{className:"stock-info",children:[E.jsx("span",{className:"stock-amount",children:p(k.currentStock)}),E.jsxs("span",{className:"stock-unit",children:["/ ",p(k.maxCapacity)," ",k.unit]})]}),k.needsRestock&&E.jsx("div",{className:"restock-indicator",children:"⚠️ Bajo mínimo"})]}),E.jsx("td",{className:"level-cell",children:E.jsxs("div",{className:"level-info",children:[E.jsxs("div",{className:"level-badge",style:{backgroundColor:q?.color,color:"white"},children:[k.stockPercentage,"%"]}),E.jsx("div",{className:"level-bar",children:E.jsx("div",{className:"level-fill",style:{width:`${k.stockPercentage}%`,backgroundColor:q?.color}})})]})}),E.jsx("td",{className:"price-cell",children:E.jsxs("div",{className:"price-info",children:[E.jsx("span",{className:"price-amount",children:y(k.pricePerUnit)}),E.jsxs("span",{className:"price-unit",children:["/ ",k.unit]})]})}),E.jsx("td",{className:"value-cell",children:E.jsx("span",{className:"total-value",children:y(ne)})}),E.jsx("td",{className:"status-cell",children:E.jsxs("span",{className:`status-badge ${k.status}`,children:[E.jsx("span",{className:"status-dot"}),k.status==="active"?"Activo":k.status==="inactive"?"Inactivo":k.status==="maintenance"?"Mantenimiento":k.status]})}),E.jsx("td",{className:"updated-cell",children:E.jsx("span",{className:"time-ago",children:T(k.lastUpdated)})}),s&&E.jsx("td",{className:"actions-cell",children:E.jsxs("div",{className:"action-buttons",children:[E.jsx("button",{className:"btn btn-sm btn-secondary",onClick:()=>e(k),title:"Editar",children:"✏️"}),E.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>n(k),title:"Eliminar",children:"🗑️"})]})})]},k.id)})})]})}),E.jsxs("div",{className:"table-footer",children:[E.jsxs("div",{className:"table-info",children:[w.length," items ordenados por ",o,"(",f==="asc"?"ascendente":"descendente",")"]}),E.jsxs("div",{className:"table-legend",children:[E.jsxs("span",{className:"legend-item",children:[E.jsx("span",{className:"legend-dot critical"}),"Crítico"]}),E.jsxs("span",{className:"legend-item",children:[E.jsx("span",{className:"legend-dot low"}),"Bajo"]}),E.jsxs("span",{className:"legend-item",children:[E.jsx("span",{className:"legend-dot normal"}),"Normal"]}),E.jsxs("span",{className:"legend-item",children:[E.jsx("span",{className:"legend-dot high"}),"Alto"]})]})]})]})},KV=({items:i,onEdit:e,onDelete:n,canManage:s})=>{const o=m=>new Intl.NumberFormat("es-CO").format(m),u=m=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(m),f=m=>{const y=new Date-new Date(m.seconds?m.seconds*1e3:m),T=Math.floor(y/(1e3*60*60)),S=Math.floor(T/24);return S>0?`hace ${S} día${S>1?"s":""}`:T>0?`hace ${T} hora${T>1?"s":""}`:"hace unos minutos"};return E.jsx("div",{className:"inventory-cards-grid",children:i.map(m=>{const p=tr[m.fuelType],y=Xs[m.stockLevel],T=m.currentStock*m.pricePerUnit;return E.jsxs("div",{className:"inventory-card",children:[E.jsxs("div",{className:"card-header",children:[E.jsxs("div",{className:"fuel-info",children:[E.jsx("span",{className:"fuel-icon",style:{color:p?.color},children:p?.icon}),E.jsxs("div",{className:"fuel-details",children:[E.jsx("h3",{children:p?.name}),E.jsx("p",{className:"location",children:m.location})]})]}),E.jsx("div",{className:"stock-status",children:E.jsxs("span",{className:"status-badge",style:{backgroundColor:y?.color,color:"white"},children:[y?.icon," ",y?.label]})})]}),E.jsxs("div",{className:"stock-progress",children:[E.jsxs("div",{className:"progress-header",children:[E.jsxs("span",{className:"stock-text",children:[o(m.currentStock)," / ",o(m.maxCapacity)," ",m.unit]}),E.jsxs("span",{className:"percentage",children:[m.stockPercentage,"%"]})]}),E.jsx("div",{className:"progress-bar",children:E.jsx("div",{className:"progress-fill",style:{width:`${m.stockPercentage}%`,backgroundColor:y?.color}})}),m.needsRestock&&E.jsxs("div",{className:"restock-warning",children:["⚠️ Bajo nivel mínimo (",o(m.minThreshold)," ",m.unit,")"]})]}),E.jsxs("div",{className:"card-metrics",children:[E.jsxs("div",{className:"metric",children:[E.jsxs("span",{className:"metric-label",children:["Precio por ",m.unit,":"]}),E.jsx("span",{className:"metric-value",children:u(m.pricePerUnit)})]}),E.jsxs("div",{className:"metric",children:[E.jsx("span",{className:"metric-label",children:"Valor total:"}),E.jsx("span",{className:"metric-value",children:u(T)})]}),m.supplier&&E.jsxs("div",{className:"metric",children:[E.jsx("span",{className:"metric-label",children:"Proveedor:"}),E.jsx("span",{className:"metric-value",children:m.supplier})]})]}),E.jsxs("div",{className:"card-footer",children:[E.jsxs("div",{className:"status-info",children:[E.jsx("span",{className:`status-dot ${m.status}`}),E.jsx("span",{className:"status-text",children:m.status==="active"?"Activo":m.status==="inactive"?"Inactivo":m.status==="maintenance"?"Mantenimiento":m.status})]}),E.jsxs("div",{className:"last-update",children:["Actualizado ",f(m.lastUpdated)]})]}),s&&E.jsxs("div",{className:"card-actions",children:[E.jsx("button",{className:"btn btn-secondary btn-sm",onClick:()=>e(m),title:"Editar combustible",children:"✏️ Editar"}),E.jsx("button",{className:"btn btn-danger btn-sm",onClick:()=>n(m),title:"Eliminar combustible",children:"🗑️ Eliminar"})]}),m.description&&m.description!==p?.description&&E.jsx("div",{className:"card-description",children:E.jsx("p",{children:m.description})})]},m.id)})})},YV=({item:i,onClose:e,onSuccess:n})=>{const{userProfile:s}=vf(),o=!!i,[u,f]=je.useState({fuelType:"",location:"",currentStock:"",maxCapacity:"",minThreshold:"",pricePerUnit:"",supplier:"",description:"",status:"active"}),[m,p]=je.useState({}),[y,T]=je.useState(!1);je.useEffect(()=>{o&&i&&f({fuelType:i.fuelType||"",location:i.location||"",currentStock:i.currentStock||"",maxCapacity:i.maxCapacity||"",minThreshold:i.minThreshold||"",pricePerUnit:i.pricePerUnit||"",supplier:i.supplier||"",description:i.description||"",status:i.status||"active"})},[o,i]),je.useEffect(()=>{if(u.maxCapacity&&!u.minThreshold){const K=Math.round(Number(u.maxCapacity)*.15);f(q=>({...q,minThreshold:K}))}},[u.maxCapacity]);const S=K=>{const{name:q,value:ne}=K.target;f(se=>({...se,[q]:ne})),m[q]&&p(se=>({...se,[q]:null}))},w=()=>{const K={};u.fuelType||(K.fuelType="Tipo de combustible es requerido"),u.location||(K.location="Ubicación es requerida"),u.maxCapacity||(K.maxCapacity="Capacidad máxima es requerida");const q=Number(u.currentStock),ne=Number(u.maxCapacity),se=Number(u.minThreshold),le=Number(u.pricePerUnit);return u.currentStock&&(isNaN(q)||q<0)&&(K.currentStock="Stock actual debe ser un número válido mayor o igual a 0"),u.maxCapacity&&(isNaN(ne)||ne<=0)&&(K.maxCapacity="Capacidad máxima debe ser un número válido mayor a 0"),u.minThreshold&&(isNaN(se)||se<0)&&(K.minThreshold="Umbral mínimo debe ser un número válido mayor o igual a 0"),u.pricePerUnit&&(isNaN(le)||le<0)&&(K.pricePerUnit="Precio debe ser un número válido mayor o igual a 0"),q>ne&&(K.currentStock="Stock actual no puede ser mayor a la capacidad máxima"),se>ne&&(K.minThreshold="Umbral mínimo no puede ser mayor a la capacidad máxima"),p(K),Object.keys(K).length===0},P=async K=>{if(K.preventDefault(),!!w()){T(!0);try{let q;o?q=await BV(i.id,{location:u.location,currentStock:Number(u.currentStock)||0,maxCapacity:Number(u.maxCapacity),minThreshold:Number(u.minThreshold)||Number(u.maxCapacity)*.15,pricePerUnit:Number(u.pricePerUnit)||0,supplier:u.supplier,description:u.description,status:u.status},s.uid):q=await jV({fuelType:u.fuelType,location:u.location,currentStock:Number(u.currentStock)||0,maxCapacity:Number(u.maxCapacity),minThreshold:Number(u.minThreshold)||Number(u.maxCapacity)*.15,pricePerUnit:Number(u.pricePerUnit)||0,supplier:u.supplier,description:u.description,status:u.status},s.uid),q.success?(alert(q.message),n()):alert(`Error: ${q.error}`)}catch(q){console.error("Error saving inventory item:",q),alert("Error inesperado al guardar el item")}finally{T(!1)}}},k=tr[u.fuelType];return E.jsx("div",{className:"modal-overlay",onClick:e,children:E.jsxs("div",{className:"modal-content inventory-modal",onClick:K=>K.stopPropagation(),children:[E.jsxs("div",{className:"modal-header",children:[E.jsx("h2",{children:o?"✏️ Editar Combustible":"➕ Agregar Nuevo Combustible"}),E.jsx("button",{className:"modal-close",onClick:e,children:"✕"})]}),E.jsxs("form",{onSubmit:P,className:"modal-form",children:[E.jsxs("div",{className:"form-grid",children:[E.jsxs("div",{className:"form-group",children:[E.jsxs("label",{htmlFor:"fuelType",children:["Tipo de Combustible *",k&&E.jsxs("span",{className:"fuel-preview",children:[k.icon," ",k.name]})]}),E.jsxs("select",{id:"fuelType",name:"fuelType",value:u.fuelType,onChange:S,disabled:o,className:m.fuelType?"error":"",required:!0,children:[E.jsx("option",{value:"",children:"Seleccionar tipo..."}),Object.entries(ro).map(([K,q])=>{const ne=tr[q];return E.jsxs("option",{value:q,children:[ne.icon," ",ne.name," (",ne.unit,")"]},K)})]}),m.fuelType&&E.jsx("span",{className:"error-text",children:m.fuelType})]}),E.jsxs("div",{className:"form-group",children:[E.jsx("label",{htmlFor:"location",children:"Ubicación / Tanque *"}),E.jsx("input",{type:"text",id:"location",name:"location",value:u.location,onChange:S,placeholder:"ej. Tanque Principal, Depósito A, Bodega Norte",className:m.location?"error":"",required:!0}),m.location&&E.jsx("span",{className:"error-text",children:m.location})]}),E.jsxs("div",{className:"form-group",children:[E.jsxs("label",{htmlFor:"currentStock",children:["Stock Actual ",k&&`(${k.unit})`]}),E.jsx("input",{type:"number",id:"currentStock",name:"currentStock",value:u.currentStock,onChange:S,placeholder:"0",min:"0",step:"0.01",className:m.currentStock?"error":""}),m.currentStock&&E.jsx("span",{className:"error-text",children:m.currentStock})]}),E.jsxs("div",{className:"form-group",children:[E.jsxs("label",{htmlFor:"maxCapacity",children:["Capacidad Máxima * ",k&&`(${k.unit})`]}),E.jsx("input",{type:"number",id:"maxCapacity",name:"maxCapacity",value:u.maxCapacity,onChange:S,placeholder:"1000",min:"1",step:"0.01",className:m.maxCapacity?"error":"",required:!0}),m.maxCapacity&&E.jsx("span",{className:"error-text",children:m.maxCapacity})]}),E.jsxs("div",{className:"form-group",children:[E.jsxs("label",{htmlFor:"minThreshold",children:["Umbral Mínimo ",k&&`(${k.unit})`,E.jsx("span",{className:"field-hint",children:"Para alertas de stock bajo"})]}),E.jsx("input",{type:"number",id:"minThreshold",name:"minThreshold",value:u.minThreshold,onChange:S,placeholder:"Auto: 15% de capacidad máxima",min:"0",step:"0.01",className:m.minThreshold?"error":""}),m.minThreshold&&E.jsx("span",{className:"error-text",children:m.minThreshold}),u.maxCapacity&&E.jsxs("span",{className:"field-hint",children:["Sugerido: ",Math.round(Number(u.maxCapacity)*.15)," ",k?.unit||"unidades"]})]}),E.jsxs("div",{className:"form-group",children:[E.jsxs("label",{htmlFor:"pricePerUnit",children:["Precio por ",k?.unit||"Unidad"]}),E.jsx("input",{type:"number",id:"pricePerUnit",name:"pricePerUnit",value:u.pricePerUnit,onChange:S,placeholder:"12000",min:"0",step:"0.01",className:m.pricePerUnit?"error":""}),m.pricePerUnit&&E.jsx("span",{className:"error-text",children:m.pricePerUnit})]}),E.jsxs("div",{className:"form-group",children:[E.jsx("label",{htmlFor:"supplier",children:"Proveedor Principal"}),E.jsx("input",{type:"text",id:"supplier",name:"supplier",value:u.supplier,onChange:S,placeholder:"ej. Petrobras, Terpel, Mobil"})]}),E.jsxs("div",{className:"form-group",children:[E.jsx("label",{htmlFor:"status",children:"Estado"}),E.jsxs("select",{id:"status",name:"status",value:u.status,onChange:S,children:[E.jsx("option",{value:"active",children:"Activo"}),E.jsx("option",{value:"inactive",children:"Inactivo"}),E.jsx("option",{value:"maintenance",children:"Mantenimiento"})]})]}),E.jsxs("div",{className:"form-group full-width",children:[E.jsx("label",{htmlFor:"description",children:"Descripción / Notas"}),E.jsx("textarea",{id:"description",name:"description",value:u.description,onChange:S,placeholder:"Información adicional sobre este combustible...",rows:"3"})]})]}),k&&u.maxCapacity&&E.jsxs("div",{className:"form-preview",children:[E.jsx("h4",{children:"📊 Vista Previa"}),E.jsxs("div",{className:"preview-card",children:[E.jsxs("div",{className:"preview-header",children:[E.jsxs("span",{style:{color:k.color},children:[k.icon," ",k.name]}),E.jsx("span",{children:u.location})]}),E.jsxs("div",{className:"preview-capacity",children:[u.currentStock||0," / ",u.maxCapacity," ",k.unit,u.currentStock&&u.maxCapacity&&E.jsxs("span",{className:"preview-percentage",children:["(",Math.round(Number(u.currentStock)/Number(u.maxCapacity)*100),"%)"]})]}),u.pricePerUnit&&E.jsxs("div",{className:"preview-value",children:["Valor total: ",new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format((Number(u.currentStock)||0)*Number(u.pricePerUnit))]})]})]}),E.jsxs("div",{className:"modal-actions",children:[E.jsx("button",{type:"button",onClick:e,className:"btn btn-secondary",children:"Cancelar"}),E.jsx("button",{type:"submit",className:"btn btn-primary",disabled:y,children:y?"Guardando...":o?"Actualizar":"Crear"})]})]})]})})},QV=({stats:i})=>{const e=s=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(s),n=s=>new Intl.NumberFormat("es-CO").format(s);return E.jsxs("div",{className:"inventory-stats",children:[E.jsxs("div",{className:"stats-grid",children:[E.jsxs("div",{className:"stat-card primary",children:[E.jsx("div",{className:"stat-icon",children:"💰"}),E.jsxs("div",{className:"stat-content",children:[E.jsx("h3",{children:"Valor Total"}),E.jsx("div",{className:"stat-value",children:e(i.totalValue)}),E.jsxs("div",{className:"stat-subtitle",children:[n(i.totalItems)," tipos de combustible"]})]})]}),E.jsxs("div",{className:"stat-card success",children:[E.jsx("div",{className:"stat-icon",children:"✅"}),E.jsxs("div",{className:"stat-content",children:[E.jsx("h3",{children:"Items Activos"}),E.jsx("div",{className:"stat-value",children:i.activeItems}),E.jsxs("div",{className:"stat-subtitle",children:[Math.round(i.activeItems/i.totalItems*100),"% del total"]})]})]}),E.jsxs("div",{className:`stat-card ${i.lowStockItems>0?"warning":"info"}`,children:[E.jsx("div",{className:"stat-icon",children:i.lowStockItems>0?"⚠️":"📊"}),E.jsxs("div",{className:"stat-content",children:[E.jsx("h3",{children:"Stock Bajo"}),E.jsx("div",{className:"stat-value",children:i.lowStockItems}),E.jsx("div",{className:"stat-subtitle",children:i.lowStockItems>0?"Requieren atención":"Niveles normales"})]})]}),E.jsxs("div",{className:"stat-card info",children:[E.jsx("div",{className:"stat-icon",children:"📈"}),E.jsxs("div",{className:"stat-content",children:[E.jsx("h3",{children:"Nivel Promedio"}),E.jsxs("div",{className:"stat-value",children:[i.averageStockLevel,"%"]}),E.jsx("div",{className:"stat-subtitle",children:"Capacidad promedio utilizada"})]})]})]}),E.jsxs("div",{className:"fuel-type-summary",children:[E.jsx("h4",{children:"📊 Resumen por Tipo de Combustible"}),E.jsx("div",{className:"fuel-types-grid",children:Object.entries(i.byFuelType).map(([s,o])=>{const u=tr[s],f=o.totalCapacity>0?Math.round(o.totalStock/o.totalCapacity*100):0;return E.jsxs("div",{className:"fuel-type-card",children:[E.jsxs("div",{className:"fuel-header",children:[E.jsx("span",{className:"fuel-icon",style:{color:u?.color||"#6b7280"},children:u?.icon||"⛽"}),E.jsxs("div",{className:"fuel-info",children:[E.jsx("h5",{children:u?.name||s}),E.jsxs("span",{className:"fuel-count",children:[o.count," ubicaciones"]})]})]}),E.jsxs("div",{className:"fuel-metrics",children:[E.jsxs("div",{className:"metric",children:[E.jsx("span",{className:"metric-label",children:"Stock Total:"}),E.jsxs("span",{className:"metric-value",children:[n(o.totalStock)," ",u?.unit||"unidades"]})]}),E.jsxs("div",{className:"metric",children:[E.jsx("span",{className:"metric-label",children:"Capacidad:"}),E.jsxs("span",{className:"metric-value",children:[n(o.totalCapacity)," ",u?.unit||"unidades"]})]}),E.jsxs("div",{className:"metric",children:[E.jsx("span",{className:"metric-label",children:"Utilización:"}),E.jsxs("span",{className:`metric-value ${f<25?"low":f>75?"high":"normal"}`,children:[f,"%"]})]}),E.jsxs("div",{className:"metric",children:[E.jsx("span",{className:"metric-label",children:"Valor:"}),E.jsx("span",{className:"metric-value",children:e(o.totalValue)})]})]}),E.jsx("div",{className:"progress-bar",children:E.jsx("div",{className:"progress-fill",style:{width:`${f}%`,backgroundColor:u?.color||"#6b7280"}})})]},s)})}),Object.keys(i.byFuelType).length===0&&E.jsx("div",{className:"empty-fuel-types",children:E.jsx("p",{children:"No hay tipos de combustible registrados en el inventario."})})]})]})},$V=()=>{const{userProfile:i,hasPermission:e}=vf(),[n,s]=je.useState([]),[o,u]=je.useState(null),[f,m]=je.useState(!0),[p,y]=je.useState(null),[T,S]=je.useState("cards"),[w,P]=je.useState(!1),[k,K]=je.useState(null),[q,ne]=je.useState("all"),[se,le]=je.useState("");je.useEffect(()=>{let D=null;return(()=>{D=FV((U,N)=>{if(N){console.error("Error in inventory subscription:",N),y("Error cargando inventario en tiempo real");return}s(U||[]),m(!1)})})(),()=>{D&&D()}},[]),je.useEffect(()=>{(async()=>{const x=await HV();x.success&&u(x.data)})()},[n]);const fe=n.filter(D=>{if(q==="active"&&D.status!=="active"||q==="low-stock"&&!D.needsRestock)return!1;if(se){const x=se.toLowerCase();return D.name.toLowerCase().includes(x)||D.location.toLowerCase().includes(x)||D.fuelType.toLowerCase().includes(x)}return!0}),de=()=>{if(!e("canManageInventory")){alert("No tienes permisos para crear items de inventario");return}K(null),P(!0)},Se=D=>{if(!e("canManageInventory")){alert("No tienes permisos para editar items de inventario");return}K(D),P(!0)},V=async D=>{if(!e("canManageInventory")){alert("No tienes permisos para eliminar items de inventario");return}if(!window.confirm(`¿Estás seguro de eliminar ${D.name} de ${D.location}?

Esta acción no se puede deshacer.`))return;m(!0);const U=await qV(D.id);U.success?alert("Item eliminado exitosamente"):(y(U.error),alert(`Error al eliminar: ${U.error}`)),m(!1)},I=()=>{P(!1),K(null)},C=()=>{I()};return f&&n.length===0?E.jsxs("div",{className:"inventory-loading",children:[E.jsx("div",{className:"loading-spinner"}),E.jsx("p",{children:"Cargando inventario..."})]}):E.jsxs("div",{className:"inventory-main",children:[E.jsxs("div",{className:"inventory-header",children:[E.jsxs("div",{className:"header-title",children:[E.jsx("h2",{children:"🛢️ Gestión de Inventario"}),E.jsx("p",{children:"Control de stock de combustibles en tiempo real"})]}),e("canManageInventory")&&E.jsx("button",{className:"btn btn-primary",onClick:de,children:"➕ Agregar Combustible"})]}),o&&E.jsx(QV,{stats:o}),E.jsxs("div",{className:"inventory-controls",children:[E.jsxs("div",{className:"search-filters",children:[E.jsx("input",{type:"text",placeholder:"Buscar por nombre, ubicación o tipo...",value:se,onChange:D=>le(D.target.value),className:"search-input"}),E.jsxs("select",{value:q,onChange:D=>ne(D.target.value),className:"filter-select",children:[E.jsx("option",{value:"all",children:"Todos los items"}),E.jsx("option",{value:"active",children:"Solo activos"}),E.jsx("option",{value:"low-stock",children:"Stock bajo"})]})]}),E.jsxs("div",{className:"view-toggle",children:[E.jsx("button",{className:`toggle-btn ${T==="cards"?"active":""}`,onClick:()=>S("cards"),children:"📱 Cards"}),E.jsx("button",{className:`toggle-btn ${T==="table"?"active":""}`,onClick:()=>S("table"),children:"📊 Tabla"})]})]}),p&&E.jsxs("div",{className:"error-banner",children:[E.jsxs("span",{children:["⚠️ ",p]}),E.jsx("button",{onClick:()=>y(null),children:"✕"})]}),E.jsx("div",{className:"inventory-content",children:fe.length===0?E.jsxs("div",{className:"empty-state",children:[E.jsx("div",{className:"empty-icon",children:"📦"}),E.jsx("h3",{children:"No hay items de inventario"}),E.jsx("p",{children:se||q!=="all"?"No se encontraron items con los filtros aplicados":"Comienza agregando tu primer tipo de combustible al inventario"}),e("canManageInventory")&&E.jsx("button",{className:"btn btn-primary",onClick:de,children:"➕ Agregar Primer Combustible"})]}):E.jsx(E.Fragment,{children:T==="cards"?E.jsx(KV,{items:fe,onEdit:Se,onDelete:V,canManage:e("canManageInventory")}):E.jsx(GV,{items:fe,onEdit:Se,onDelete:V,canManage:e("canManageInventory")})})}),fe.length>0&&E.jsx("div",{className:"results-footer",children:E.jsxs("p",{children:["Mostrando ",fe.length," de ",n.length," items",se&&` · Filtro: "${se}"`,q!=="all"&&` · Estado: ${q}`]})}),w&&E.jsx(YV,{item:k,onClose:I,onSuccess:C})]})},XV=()=>E.jsxs("div",{className:"module-placeholder",children:[E.jsx("h2",{children:"📈 Módulo de Movimientos"}),E.jsx("p",{children:"Registro de entradas y salidas de combustible"}),E.jsxs("div",{className:"coming-soon",children:[E.jsx("span",{children:"🚧 En desarrollo"}),E.jsx("p",{children:"Próximamente: Formularios de movimientos, validaciones automáticas, y tracking por vehículo."})]})]}),ZV=()=>E.jsxs("div",{className:"module-placeholder",children:[E.jsx("h2",{children:"🚜 Módulo de Vehículos"}),E.jsx("p",{children:"Gestión de maquinaria forestal"}),E.jsxs("div",{className:"coming-soon",children:[E.jsx("span",{children:"🚧 En desarrollo"}),E.jsx("p",{children:"Próximamente: Catálogo de vehículos, tracking de consumo, y mantenimientos."})]})]}),WV=()=>E.jsxs("div",{className:"module-placeholder",children:[E.jsx("h2",{children:"🏪 Módulo de Proveedores"}),E.jsx("p",{children:"Gestión de proveedores de combustible"}),E.jsxs("div",{className:"coming-soon",children:[E.jsx("span",{children:"🚧 En desarrollo"}),E.jsx("p",{children:"Próximamente: Base de datos de proveedores, comparación de precios, y evaluación."})]})]}),JV=()=>E.jsxs("div",{className:"module-placeholder",children:[E.jsx("h2",{children:"📋 Módulo de Reportes"}),E.jsx("p",{children:"Análisis y reportes de combustibles"}),E.jsxs("div",{className:"coming-soon",children:[E.jsx("span",{children:"🚧 En desarrollo"}),E.jsx("p",{children:"Próximamente: Reportes personalizables, gráficos interactivos, y exportación."})]})]}),ek=()=>{const[i,e]=je.useState("dashboard"),n=()=>{switch(i){case"dashboard":return E.jsx(p0,{});case"inventory":return E.jsx($V,{});case"movements":return E.jsx(XV,{});case"vehicles":return E.jsx(ZV,{});case"suppliers":return E.jsx(WV,{});case"reports":return E.jsx(JV,{});default:return E.jsx(p0,{})}};return E.jsx(LV,{currentView:i,onViewChange:e,children:n()})};function tk(){return E.jsx(UV,{children:E.jsx("div",{className:"App",children:E.jsx(ek,{})})})}wI.createRoot(document.getElementById("root")).render(E.jsx(je.StrictMode,{children:E.jsx(tk,{})}));
