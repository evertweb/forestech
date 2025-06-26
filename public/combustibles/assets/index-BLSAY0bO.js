(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const u of o)if(u.type==="childList")for(const f of u.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function n(o){const u={};return o.integrity&&(u.integrity=o.integrity),o.referrerPolicy&&(u.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?u.credentials="include":o.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(o){if(o.ep)return;o.ep=!0;const u=n(o);fetch(o.href,u)}})();var $d={exports:{}},Cl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Tv;function D1(){if(Tv)return Cl;Tv=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function n(s,o,u){var f=null;if(u!==void 0&&(f=""+u),o.key!==void 0&&(f=""+o.key),"key"in o){u={};for(var m in o)m!=="key"&&(u[m]=o[m])}else u=o;return o=u.ref,{$$typeof:r,type:s,key:f,ref:o!==void 0?o:null,props:u}}return Cl.Fragment=t,Cl.jsx=n,Cl.jsxs=n,Cl}var Ev;function M1(){return Ev||(Ev=1,$d.exports=D1()),$d.exports}var H=M1(),Zd={exports:{}},bt={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Av;function V1(){if(Av)return bt;Av=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),f=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),S=Symbol.iterator;function R(N){return N===null||typeof N!="object"?null:(N=S&&N[S]||N["@@iterator"],typeof N=="function"?N:null)}var z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},X=Object.assign,tt={};function Y(N,Z,it){this.props=N,this.context=Z,this.refs=tt,this.updater=it||z}Y.prototype.isReactComponent={},Y.prototype.setState=function(N,Z){if(typeof N!="object"&&typeof N!="function"&&N!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,N,Z,"setState")},Y.prototype.forceUpdate=function(N){this.updater.enqueueForceUpdate(this,N,"forceUpdate")};function gt(){}gt.prototype=Y.prototype;function ut(N,Z,it){this.props=N,this.context=Z,this.refs=tt,this.updater=it||z}var at=ut.prototype=new gt;at.constructor=ut,X(at,Y.prototype),at.isPureReactComponent=!0;var _t=Array.isArray,ht={H:null,A:null,T:null,S:null,V:null},Rt=Object.prototype.hasOwnProperty;function M(N,Z,it,J,ct,Ct){return it=Ct.ref,{$$typeof:r,type:N,key:Z,ref:it!==void 0?it:null,props:Ct}}function b(N,Z){return M(N.type,Z,void 0,void 0,void 0,N.props)}function w(N){return typeof N=="object"&&N!==null&&N.$$typeof===r}function D(N){var Z={"=":"=0",":":"=2"};return"$"+N.replace(/[=:]/g,function(it){return Z[it]})}var V=/\/+/g;function k(N,Z){return typeof N=="object"&&N!==null&&N.key!=null?D(""+N.key):Z.toString(36)}function C(){}function Pe(N){switch(N.status){case"fulfilled":return N.value;case"rejected":throw N.reason;default:switch(typeof N.status=="string"?N.then(C,C):(N.status="pending",N.then(function(Z){N.status==="pending"&&(N.status="fulfilled",N.value=Z)},function(Z){N.status==="pending"&&(N.status="rejected",N.reason=Z)})),N.status){case"fulfilled":return N.value;case"rejected":throw N.reason}}throw N}function re(N,Z,it,J,ct){var Ct=typeof N;(Ct==="undefined"||Ct==="boolean")&&(N=null);var Et=!1;if(N===null)Et=!0;else switch(Ct){case"bigint":case"string":case"number":Et=!0;break;case"object":switch(N.$$typeof){case r:case t:Et=!0;break;case T:return Et=N._init,re(Et(N._payload),Z,it,J,ct)}}if(Et)return ct=ct(N),Et=J===""?"."+k(N,0):J,_t(ct)?(it="",Et!=null&&(it=Et.replace(V,"$&/")+"/"),re(ct,Z,it,"",function(Wn){return Wn})):ct!=null&&(w(ct)&&(ct=b(ct,it+(ct.key==null||N&&N.key===ct.key?"":(""+ct.key).replace(V,"$&/")+"/")+Et)),Z.push(ct)),1;Et=0;var we=J===""?".":J+":";if(_t(N))for(var Zt=0;Zt<N.length;Zt++)J=N[Zt],Ct=we+k(J,Zt),Et+=re(J,Z,it,Ct,ct);else if(Zt=R(N),typeof Zt=="function")for(N=Zt.call(N),Zt=0;!(J=N.next()).done;)J=J.value,Ct=we+k(J,Zt++),Et+=re(J,Z,it,Ct,ct);else if(Ct==="object"){if(typeof N.then=="function")return re(Pe(N),Z,it,J,ct);throw Z=String(N),Error("Objects are not valid as a React child (found: "+(Z==="[object Object]"?"object with keys {"+Object.keys(N).join(", ")+"}":Z)+"). If you meant to render a collection of children, use an array instead.")}return Et}function F(N,Z,it){if(N==null)return N;var J=[],ct=0;return re(N,J,"","",function(Ct){return Z.call(it,Ct,ct++)}),J}function nt(N){if(N._status===-1){var Z=N._result;Z=Z(),Z.then(function(it){(N._status===0||N._status===-1)&&(N._status=1,N._result=it)},function(it){(N._status===0||N._status===-1)&&(N._status=2,N._result=it)}),N._status===-1&&(N._status=0,N._result=Z)}if(N._status===1)return N._result.default;throw N._result}var lt=typeof reportError=="function"?reportError:function(N){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Z=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof N=="object"&&N!==null&&typeof N.message=="string"?String(N.message):String(N),error:N});if(!window.dispatchEvent(Z))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",N);return}console.error(N)};function zt(){}return bt.Children={map:F,forEach:function(N,Z,it){F(N,function(){Z.apply(this,arguments)},it)},count:function(N){var Z=0;return F(N,function(){Z++}),Z},toArray:function(N){return F(N,function(Z){return Z})||[]},only:function(N){if(!w(N))throw Error("React.Children.only expected to receive a single React element child.");return N}},bt.Component=Y,bt.Fragment=n,bt.Profiler=o,bt.PureComponent=ut,bt.StrictMode=s,bt.Suspense=g,bt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ht,bt.__COMPILER_RUNTIME={__proto__:null,c:function(N){return ht.H.useMemoCache(N)}},bt.cache=function(N){return function(){return N.apply(null,arguments)}},bt.cloneElement=function(N,Z,it){if(N==null)throw Error("The argument must be a React element, but you passed "+N+".");var J=X({},N.props),ct=N.key,Ct=void 0;if(Z!=null)for(Et in Z.ref!==void 0&&(Ct=void 0),Z.key!==void 0&&(ct=""+Z.key),Z)!Rt.call(Z,Et)||Et==="key"||Et==="__self"||Et==="__source"||Et==="ref"&&Z.ref===void 0||(J[Et]=Z[Et]);var Et=arguments.length-2;if(Et===1)J.children=it;else if(1<Et){for(var we=Array(Et),Zt=0;Zt<Et;Zt++)we[Zt]=arguments[Zt+2];J.children=we}return M(N.type,ct,void 0,void 0,Ct,J)},bt.createContext=function(N){return N={$$typeof:f,_currentValue:N,_currentValue2:N,_threadCount:0,Provider:null,Consumer:null},N.Provider=N,N.Consumer={$$typeof:u,_context:N},N},bt.createElement=function(N,Z,it){var J,ct={},Ct=null;if(Z!=null)for(J in Z.key!==void 0&&(Ct=""+Z.key),Z)Rt.call(Z,J)&&J!=="key"&&J!=="__self"&&J!=="__source"&&(ct[J]=Z[J]);var Et=arguments.length-2;if(Et===1)ct.children=it;else if(1<Et){for(var we=Array(Et),Zt=0;Zt<Et;Zt++)we[Zt]=arguments[Zt+2];ct.children=we}if(N&&N.defaultProps)for(J in Et=N.defaultProps,Et)ct[J]===void 0&&(ct[J]=Et[J]);return M(N,Ct,void 0,void 0,null,ct)},bt.createRef=function(){return{current:null}},bt.forwardRef=function(N){return{$$typeof:m,render:N}},bt.isValidElement=w,bt.lazy=function(N){return{$$typeof:T,_payload:{_status:-1,_result:N},_init:nt}},bt.memo=function(N,Z){return{$$typeof:_,type:N,compare:Z===void 0?null:Z}},bt.startTransition=function(N){var Z=ht.T,it={};ht.T=it;try{var J=N(),ct=ht.S;ct!==null&&ct(it,J),typeof J=="object"&&J!==null&&typeof J.then=="function"&&J.then(zt,lt)}catch(Ct){lt(Ct)}finally{ht.T=Z}},bt.unstable_useCacheRefresh=function(){return ht.H.useCacheRefresh()},bt.use=function(N){return ht.H.use(N)},bt.useActionState=function(N,Z,it){return ht.H.useActionState(N,Z,it)},bt.useCallback=function(N,Z){return ht.H.useCallback(N,Z)},bt.useContext=function(N){return ht.H.useContext(N)},bt.useDebugValue=function(){},bt.useDeferredValue=function(N,Z){return ht.H.useDeferredValue(N,Z)},bt.useEffect=function(N,Z,it){var J=ht.H;if(typeof it=="function")throw Error("useEffect CRUD overload is not enabled in this build of React.");return J.useEffect(N,Z)},bt.useId=function(){return ht.H.useId()},bt.useImperativeHandle=function(N,Z,it){return ht.H.useImperativeHandle(N,Z,it)},bt.useInsertionEffect=function(N,Z){return ht.H.useInsertionEffect(N,Z)},bt.useLayoutEffect=function(N,Z){return ht.H.useLayoutEffect(N,Z)},bt.useMemo=function(N,Z){return ht.H.useMemo(N,Z)},bt.useOptimistic=function(N,Z){return ht.H.useOptimistic(N,Z)},bt.useReducer=function(N,Z,it){return ht.H.useReducer(N,Z,it)},bt.useRef=function(N){return ht.H.useRef(N)},bt.useState=function(N){return ht.H.useState(N)},bt.useSyncExternalStore=function(N,Z,it){return ht.H.useSyncExternalStore(N,Z,it)},bt.useTransition=function(){return ht.H.useTransition()},bt.version="19.1.0",bt}var Sv;function ep(){return Sv||(Sv=1,Zd.exports=V1()),Zd.exports}var ln=ep(),Wd={exports:{}},Nl={},Jd={exports:{}},tm={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bv;function P1(){return bv||(bv=1,function(r){function t(F,nt){var lt=F.length;F.push(nt);t:for(;0<lt;){var zt=lt-1>>>1,N=F[zt];if(0<o(N,nt))F[zt]=nt,F[lt]=N,lt=zt;else break t}}function n(F){return F.length===0?null:F[0]}function s(F){if(F.length===0)return null;var nt=F[0],lt=F.pop();if(lt!==nt){F[0]=lt;t:for(var zt=0,N=F.length,Z=N>>>1;zt<Z;){var it=2*(zt+1)-1,J=F[it],ct=it+1,Ct=F[ct];if(0>o(J,lt))ct<N&&0>o(Ct,J)?(F[zt]=Ct,F[ct]=lt,zt=ct):(F[zt]=J,F[it]=lt,zt=it);else if(ct<N&&0>o(Ct,lt))F[zt]=Ct,F[ct]=lt,zt=ct;else break t}}return nt}function o(F,nt){var lt=F.sortIndex-nt.sortIndex;return lt!==0?lt:F.id-nt.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;r.unstable_now=function(){return u.now()}}else{var f=Date,m=f.now();r.unstable_now=function(){return f.now()-m}}var g=[],_=[],T=1,S=null,R=3,z=!1,X=!1,tt=!1,Y=!1,gt=typeof setTimeout=="function"?setTimeout:null,ut=typeof clearTimeout=="function"?clearTimeout:null,at=typeof setImmediate<"u"?setImmediate:null;function _t(F){for(var nt=n(_);nt!==null;){if(nt.callback===null)s(_);else if(nt.startTime<=F)s(_),nt.sortIndex=nt.expirationTime,t(g,nt);else break;nt=n(_)}}function ht(F){if(tt=!1,_t(F),!X)if(n(g)!==null)X=!0,Rt||(Rt=!0,k());else{var nt=n(_);nt!==null&&re(ht,nt.startTime-F)}}var Rt=!1,M=-1,b=5,w=-1;function D(){return Y?!0:!(r.unstable_now()-w<b)}function V(){if(Y=!1,Rt){var F=r.unstable_now();w=F;var nt=!0;try{t:{X=!1,tt&&(tt=!1,ut(M),M=-1),z=!0;var lt=R;try{e:{for(_t(F),S=n(g);S!==null&&!(S.expirationTime>F&&D());){var zt=S.callback;if(typeof zt=="function"){S.callback=null,R=S.priorityLevel;var N=zt(S.expirationTime<=F);if(F=r.unstable_now(),typeof N=="function"){S.callback=N,_t(F),nt=!0;break e}S===n(g)&&s(g),_t(F)}else s(g);S=n(g)}if(S!==null)nt=!0;else{var Z=n(_);Z!==null&&re(ht,Z.startTime-F),nt=!1}}break t}finally{S=null,R=lt,z=!1}nt=void 0}}finally{nt?k():Rt=!1}}}var k;if(typeof at=="function")k=function(){at(V)};else if(typeof MessageChannel<"u"){var C=new MessageChannel,Pe=C.port2;C.port1.onmessage=V,k=function(){Pe.postMessage(null)}}else k=function(){gt(V,0)};function re(F,nt){M=gt(function(){F(r.unstable_now())},nt)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(F){F.callback=null},r.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):b=0<F?Math.floor(1e3/F):5},r.unstable_getCurrentPriorityLevel=function(){return R},r.unstable_next=function(F){switch(R){case 1:case 2:case 3:var nt=3;break;default:nt=R}var lt=R;R=nt;try{return F()}finally{R=lt}},r.unstable_requestPaint=function(){Y=!0},r.unstable_runWithPriority=function(F,nt){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var lt=R;R=F;try{return nt()}finally{R=lt}},r.unstable_scheduleCallback=function(F,nt,lt){var zt=r.unstable_now();switch(typeof lt=="object"&&lt!==null?(lt=lt.delay,lt=typeof lt=="number"&&0<lt?zt+lt:zt):lt=zt,F){case 1:var N=-1;break;case 2:N=250;break;case 5:N=1073741823;break;case 4:N=1e4;break;default:N=5e3}return N=lt+N,F={id:T++,callback:nt,priorityLevel:F,startTime:lt,expirationTime:N,sortIndex:-1},lt>zt?(F.sortIndex=lt,t(_,F),n(g)===null&&F===n(_)&&(tt?(ut(M),M=-1):tt=!0,re(ht,lt-zt))):(F.sortIndex=N,t(g,F),X||z||(X=!0,Rt||(Rt=!0,k()))),F},r.unstable_shouldYield=D,r.unstable_wrapCallback=function(F){var nt=R;return function(){var lt=R;R=nt;try{return F.apply(this,arguments)}finally{R=lt}}}}(tm)),tm}var Rv;function k1(){return Rv||(Rv=1,Jd.exports=P1()),Jd.exports}var em={exports:{}},Ge={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Iv;function x1(){if(Iv)return Ge;Iv=1;var r=ep();function t(g){var _="https://react.dev/errors/"+g;if(1<arguments.length){_+="?args[]="+encodeURIComponent(arguments[1]);for(var T=2;T<arguments.length;T++)_+="&args[]="+encodeURIComponent(arguments[T])}return"Minified React error #"+g+"; visit "+_+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function n(){}var s={d:{f:n,r:function(){throw Error(t(522))},D:n,C:n,L:n,m:n,X:n,S:n,M:n},p:0,findDOMNode:null},o=Symbol.for("react.portal");function u(g,_,T){var S=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:S==null?null:""+S,children:g,containerInfo:_,implementation:T}}var f=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(g,_){if(g==="font")return"";if(typeof _=="string")return _==="use-credentials"?_:""}return Ge.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Ge.createPortal=function(g,_){var T=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!_||_.nodeType!==1&&_.nodeType!==9&&_.nodeType!==11)throw Error(t(299));return u(g,_,null,T)},Ge.flushSync=function(g){var _=f.T,T=s.p;try{if(f.T=null,s.p=2,g)return g()}finally{f.T=_,s.p=T,s.d.f()}},Ge.preconnect=function(g,_){typeof g=="string"&&(_?(_=_.crossOrigin,_=typeof _=="string"?_==="use-credentials"?_:"":void 0):_=null,s.d.C(g,_))},Ge.prefetchDNS=function(g){typeof g=="string"&&s.d.D(g)},Ge.preinit=function(g,_){if(typeof g=="string"&&_&&typeof _.as=="string"){var T=_.as,S=m(T,_.crossOrigin),R=typeof _.integrity=="string"?_.integrity:void 0,z=typeof _.fetchPriority=="string"?_.fetchPriority:void 0;T==="style"?s.d.S(g,typeof _.precedence=="string"?_.precedence:void 0,{crossOrigin:S,integrity:R,fetchPriority:z}):T==="script"&&s.d.X(g,{crossOrigin:S,integrity:R,fetchPriority:z,nonce:typeof _.nonce=="string"?_.nonce:void 0})}},Ge.preinitModule=function(g,_){if(typeof g=="string")if(typeof _=="object"&&_!==null){if(_.as==null||_.as==="script"){var T=m(_.as,_.crossOrigin);s.d.M(g,{crossOrigin:T,integrity:typeof _.integrity=="string"?_.integrity:void 0,nonce:typeof _.nonce=="string"?_.nonce:void 0})}}else _==null&&s.d.M(g)},Ge.preload=function(g,_){if(typeof g=="string"&&typeof _=="object"&&_!==null&&typeof _.as=="string"){var T=_.as,S=m(T,_.crossOrigin);s.d.L(g,T,{crossOrigin:S,integrity:typeof _.integrity=="string"?_.integrity:void 0,nonce:typeof _.nonce=="string"?_.nonce:void 0,type:typeof _.type=="string"?_.type:void 0,fetchPriority:typeof _.fetchPriority=="string"?_.fetchPriority:void 0,referrerPolicy:typeof _.referrerPolicy=="string"?_.referrerPolicy:void 0,imageSrcSet:typeof _.imageSrcSet=="string"?_.imageSrcSet:void 0,imageSizes:typeof _.imageSizes=="string"?_.imageSizes:void 0,media:typeof _.media=="string"?_.media:void 0})}},Ge.preloadModule=function(g,_){if(typeof g=="string")if(_){var T=m(_.as,_.crossOrigin);s.d.m(g,{as:typeof _.as=="string"&&_.as!=="script"?_.as:void 0,crossOrigin:T,integrity:typeof _.integrity=="string"?_.integrity:void 0})}else s.d.m(g)},Ge.requestFormReset=function(g){s.d.r(g)},Ge.unstable_batchedUpdates=function(g,_){return g(_)},Ge.useFormState=function(g,_,T){return f.H.useFormState(g,_,T)},Ge.useFormStatus=function(){return f.H.useHostTransitionStatus()},Ge.version="19.1.0",Ge}var wv;function U1(){if(wv)return em.exports;wv=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),em.exports=x1(),em.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cv;function L1(){if(Cv)return Nl;Cv=1;var r=k1(),t=ep(),n=U1();function s(e){var i="https://react.dev/errors/"+e;if(1<arguments.length){i+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function u(e){var i=e,a=e;if(e.alternate)for(;i.return;)i=i.return;else{e=i;do i=e,(i.flags&4098)!==0&&(a=i.return),e=i.return;while(e)}return i.tag===3?a:null}function f(e){if(e.tag===13){var i=e.memoizedState;if(i===null&&(e=e.alternate,e!==null&&(i=e.memoizedState)),i!==null)return i.dehydrated}return null}function m(e){if(u(e)!==e)throw Error(s(188))}function g(e){var i=e.alternate;if(!i){if(i=u(e),i===null)throw Error(s(188));return i!==e?null:e}for(var a=e,l=i;;){var h=a.return;if(h===null)break;var d=h.alternate;if(d===null){if(l=h.return,l!==null){a=l;continue}break}if(h.child===d.child){for(d=h.child;d;){if(d===a)return m(h),e;if(d===l)return m(h),i;d=d.sibling}throw Error(s(188))}if(a.return!==l.return)a=h,l=d;else{for(var v=!1,E=h.child;E;){if(E===a){v=!0,a=h,l=d;break}if(E===l){v=!0,l=h,a=d;break}E=E.sibling}if(!v){for(E=d.child;E;){if(E===a){v=!0,a=d,l=h;break}if(E===l){v=!0,l=d,a=h;break}E=E.sibling}if(!v)throw Error(s(189))}}if(a.alternate!==l)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:i}function _(e){var i=e.tag;if(i===5||i===26||i===27||i===6)return e;for(e=e.child;e!==null;){if(i=_(e),i!==null)return i;e=e.sibling}return null}var T=Object.assign,S=Symbol.for("react.element"),R=Symbol.for("react.transitional.element"),z=Symbol.for("react.portal"),X=Symbol.for("react.fragment"),tt=Symbol.for("react.strict_mode"),Y=Symbol.for("react.profiler"),gt=Symbol.for("react.provider"),ut=Symbol.for("react.consumer"),at=Symbol.for("react.context"),_t=Symbol.for("react.forward_ref"),ht=Symbol.for("react.suspense"),Rt=Symbol.for("react.suspense_list"),M=Symbol.for("react.memo"),b=Symbol.for("react.lazy"),w=Symbol.for("react.activity"),D=Symbol.for("react.memo_cache_sentinel"),V=Symbol.iterator;function k(e){return e===null||typeof e!="object"?null:(e=V&&e[V]||e["@@iterator"],typeof e=="function"?e:null)}var C=Symbol.for("react.client.reference");function Pe(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===C?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case X:return"Fragment";case Y:return"Profiler";case tt:return"StrictMode";case ht:return"Suspense";case Rt:return"SuspenseList";case w:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case z:return"Portal";case at:return(e.displayName||"Context")+".Provider";case ut:return(e._context.displayName||"Context")+".Consumer";case _t:var i=e.render;return e=e.displayName,e||(e=i.displayName||i.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case M:return i=e.displayName||null,i!==null?i:Pe(e.type)||"Memo";case b:i=e._payload,e=e._init;try{return Pe(e(i))}catch{}}return null}var re=Array.isArray,F=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,nt=n.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,lt={pending:!1,data:null,method:null,action:null},zt=[],N=-1;function Z(e){return{current:e}}function it(e){0>N||(e.current=zt[N],zt[N]=null,N--)}function J(e,i){N++,zt[N]=e.current,e.current=i}var ct=Z(null),Ct=Z(null),Et=Z(null),we=Z(null);function Zt(e,i){switch(J(Et,i),J(Ct,e),J(ct,null),i.nodeType){case 9:case 11:e=(e=i.documentElement)&&(e=e.namespaceURI)?Qy(e):0;break;default:if(e=i.tagName,i=i.namespaceURI)i=Qy(i),e=Xy(i,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}it(ct),J(ct,e)}function Wn(){it(ct),it(Ct),it(Et)}function sr(e){e.memoizedState!==null&&J(we,e);var i=ct.current,a=Xy(i,e.type);i!==a&&(J(Ct,e),J(ct,a))}function bi(e){Ct.current===e&&(it(ct),it(Ct)),we.current===e&&(it(we),Sl._currentValue=lt)}var ns=Object.prototype.hasOwnProperty,is=r.unstable_scheduleCallback,rs=r.unstable_cancelCallback,To=r.unstable_shouldYield,pu=r.unstable_requestPaint,Sn=r.unstable_now,Xh=r.unstable_getCurrentPriorityLevel,Eo=r.unstable_ImmediatePriority,ea=r.unstable_UserBlockingPriority,ss=r.unstable_NormalPriority,$h=r.unstable_LowPriority,na=r.unstable_IdlePriority,Ao=r.log,gu=r.unstable_setDisableYieldValue,se=null,Ht=null;function hn(e){if(typeof Ao=="function"&&gu(e),Ht&&typeof Ht.setStrictMode=="function")try{Ht.setStrictMode(se,e)}catch{}}var He=Math.clz32?Math.clz32:as,_u=Math.log,Zh=Math.LN2;function as(e){return e>>>=0,e===0?32:31-(_u(e)/Zh|0)|0}var os=256,ls=4194304;function Bn(e){var i=e&42;if(i!==0)return i;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194048;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ia(e,i,a){var l=e.pendingLanes;if(l===0)return 0;var h=0,d=e.suspendedLanes,v=e.pingedLanes;e=e.warmLanes;var E=l&134217727;return E!==0?(l=E&~d,l!==0?h=Bn(l):(v&=E,v!==0?h=Bn(v):a||(a=E&~e,a!==0&&(h=Bn(a))))):(E=l&~d,E!==0?h=Bn(E):v!==0?h=Bn(v):a||(a=l&~e,a!==0&&(h=Bn(a)))),h===0?0:i!==0&&i!==h&&(i&d)===0&&(d=h&-h,a=i&-i,d>=a||d===32&&(a&4194048)!==0)?i:h}function us(e,i){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&i)===0}function So(e,i){switch(e){case 1:case 2:case 4:case 8:case 64:return i+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function bo(){var e=os;return os<<=1,(os&4194048)===0&&(os=256),e}function Ro(){var e=ls;return ls<<=1,(ls&62914560)===0&&(ls=4194304),e}function Ri(e){for(var i=[],a=0;31>a;a++)i.push(e);return i}function Ii(e,i){e.pendingLanes|=i,i!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Io(e,i,a,l,h,d){var v=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var E=e.entanglements,I=e.expirationTimes,L=e.hiddenUpdates;for(a=v&~a;0<a;){var G=31-He(a),Q=1<<G;E[G]=0,I[G]=-1;var B=L[G];if(B!==null)for(L[G]=null,G=0;G<B.length;G++){var j=B[G];j!==null&&(j.lane&=-536870913)}a&=~Q}l!==0&&Jn(e,l,0),d!==0&&h===0&&e.tag!==0&&(e.suspendedLanes|=d&~(v&~i))}function Jn(e,i,a){e.pendingLanes|=i,e.suspendedLanes&=~i;var l=31-He(i);e.entangledLanes|=i,e.entanglements[l]=e.entanglements[l]|1073741824|a&4194090}function wo(e,i){var a=e.entangledLanes|=i;for(e=e.entanglements;a;){var l=31-He(a),h=1<<l;h&i|e[l]&i&&(e[l]|=i),a&=~h}}function ar(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ra(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function or(){var e=nt.p;return e!==0?e:(e=window.event,e===void 0?32:mv(e.type))}function yu(e,i){var a=nt.p;try{return nt.p=e,i()}finally{nt.p=a}}var Jt=Math.random().toString(36).slice(2),ye="__reactFiber$"+Jt,de="__reactProps$"+Jt,bn="__reactContainer$"+Jt,Co="__reactEvents$"+Jt,Wh="__reactListeners$"+Jt,lr="__reactHandles$"+Jt,vu="__reactResources$"+Jt,cs="__reactMarker$"+Jt;function ur(e){delete e[ye],delete e[de],delete e[Co],delete e[Wh],delete e[lr]}function wi(e){var i=e[ye];if(i)return i;for(var a=e.parentNode;a;){if(i=a[bn]||a[ye]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(e=Jy(e);e!==null;){if(a=e[ye])return a;e=Jy(e)}return i}e=a,a=e.parentNode}return null}function ti(e){if(e=e[ye]||e[bn]){var i=e.tag;if(i===5||i===6||i===13||i===26||i===27||i===3)return e}return null}function ei(e){var i=e.tag;if(i===5||i===26||i===27||i===6)return e.stateNode;throw Error(s(33))}function We(e){var i=e[vu];return i||(i=e[vu]={hoistableStyles:new Map,hoistableScripts:new Map}),i}function ue(e){e[cs]=!0}var No=new Set,sa={};function jn(e,i){Ci(e,i),Ci(e+"Capture",i)}function Ci(e,i){for(sa[e]=i,e=0;e<i.length;e++)No.add(i[e])}var Tu=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Eu={},hs={};function Au(e){return ns.call(hs,e)?!0:ns.call(Eu,e)?!1:Tu.test(e)?hs[e]=!0:(Eu[e]=!0,!1)}function cr(e,i,a){if(Au(i))if(a===null)e.removeAttribute(i);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(i);return;case"boolean":var l=i.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(i);return}}e.setAttribute(i,""+a)}}function ni(e,i,a){if(a===null)e.removeAttribute(i);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(i);return}e.setAttribute(i,""+a)}}function ke(e,i,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(i,a,""+l)}}var fs,Su;function Ni(e){if(fs===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);fs=i&&i[1]||"",Su=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+fs+e+Su}var aa=!1;function oa(e,i){if(!e||aa)return"";aa=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(i){var Q=function(){throw Error()};if(Object.defineProperty(Q.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Q,[])}catch(j){var B=j}Reflect.construct(e,[],Q)}else{try{Q.call()}catch(j){B=j}e.call(Q.prototype)}}else{try{throw Error()}catch(j){B=j}(Q=e())&&typeof Q.catch=="function"&&Q.catch(function(){})}}catch(j){if(j&&B&&typeof j.stack=="string")return[j.stack,B.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var h=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");h&&h.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var d=l.DetermineComponentFrameRoot(),v=d[0],E=d[1];if(v&&E){var I=v.split(`
`),L=E.split(`
`);for(h=l=0;l<I.length&&!I[l].includes("DetermineComponentFrameRoot");)l++;for(;h<L.length&&!L[h].includes("DetermineComponentFrameRoot");)h++;if(l===I.length||h===L.length)for(l=I.length-1,h=L.length-1;1<=l&&0<=h&&I[l]!==L[h];)h--;for(;1<=l&&0<=h;l--,h--)if(I[l]!==L[h]){if(l!==1||h!==1)do if(l--,h--,0>h||I[l]!==L[h]){var G=`
`+I[l].replace(" at new "," at ");return e.displayName&&G.includes("<anonymous>")&&(G=G.replace("<anonymous>",e.displayName)),G}while(1<=l&&0<=h);break}}}finally{aa=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Ni(a):""}function Oo(e){switch(e.tag){case 26:case 27:case 5:return Ni(e.type);case 16:return Ni("Lazy");case 13:return Ni("Suspense");case 19:return Ni("SuspenseList");case 0:case 15:return oa(e.type,!1);case 11:return oa(e.type.render,!1);case 1:return oa(e.type,!0);case 31:return Ni("Activity");default:return""}}function la(e){try{var i="";do i+=Oo(e),e=e.return;while(e);return i}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}function Je(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Do(e){var i=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Jh(e){var i=Do(e)?"checked":"value",a=Object.getOwnPropertyDescriptor(e.constructor.prototype,i),l=""+e[i];if(!e.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var h=a.get,d=a.set;return Object.defineProperty(e,i,{configurable:!0,get:function(){return h.call(this)},set:function(v){l=""+v,d.call(this,v)}}),Object.defineProperty(e,i,{enumerable:a.enumerable}),{getValue:function(){return l},setValue:function(v){l=""+v},stopTracking:function(){e._valueTracker=null,delete e[i]}}}}function ua(e){e._valueTracker||(e._valueTracker=Jh(e))}function Mo(e){if(!e)return!1;var i=e._valueTracker;if(!i)return!0;var a=i.getValue(),l="";return e&&(l=Do(e)?e.checked?"true":"false":e.value),e=l,e!==a?(i.setValue(e),!0):!1}function ds(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var tf=/[\n"\\]/g;function me(e){return e.replace(tf,function(i){return"\\"+i.charCodeAt(0).toString(16)+" "})}function fn(e,i,a,l,h,d,v,E){e.name="",v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"?e.type=v:e.removeAttribute("type"),i!=null?v==="number"?(i===0&&e.value===""||e.value!=i)&&(e.value=""+Je(i)):e.value!==""+Je(i)&&(e.value=""+Je(i)):v!=="submit"&&v!=="reset"||e.removeAttribute("value"),i!=null?hr(e,v,Je(i)):a!=null?hr(e,v,Je(a)):l!=null&&e.removeAttribute("value"),h==null&&d!=null&&(e.defaultChecked=!!d),h!=null&&(e.checked=h&&typeof h!="function"&&typeof h!="symbol"),E!=null&&typeof E!="function"&&typeof E!="symbol"&&typeof E!="boolean"?e.name=""+Je(E):e.removeAttribute("name")}function ms(e,i,a,l,h,d,v,E){if(d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(e.type=d),i!=null||a!=null){if(!(d!=="submit"&&d!=="reset"||i!=null))return;a=a!=null?""+Je(a):"",i=i!=null?""+Je(i):a,E||i===e.value||(e.value=i),e.defaultValue=i}l=l??h,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=E?e.checked:!!l,e.defaultChecked=!!l,v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"&&(e.name=v)}function hr(e,i,a){i==="number"&&ds(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function Oi(e,i,a,l){if(e=e.options,i){i={};for(var h=0;h<a.length;h++)i["$"+a[h]]=!0;for(a=0;a<e.length;a++)h=i.hasOwnProperty("$"+e[a].value),e[a].selected!==h&&(e[a].selected=h),h&&l&&(e[a].defaultSelected=!0)}else{for(a=""+Je(a),i=null,h=0;h<e.length;h++){if(e[h].value===a){e[h].selected=!0,l&&(e[h].defaultSelected=!0);return}i!==null||e[h].disabled||(i=e[h])}i!==null&&(i.selected=!0)}}function Kt(e,i,a){if(i!=null&&(i=""+Je(i),i!==e.value&&(e.value=i),a==null)){e.defaultValue!==i&&(e.defaultValue=i);return}e.defaultValue=a!=null?""+Je(a):""}function ps(e,i,a,l){if(i==null){if(l!=null){if(a!=null)throw Error(s(92));if(re(l)){if(1<l.length)throw Error(s(93));l=l[0]}a=l}a==null&&(a=""),i=a}a=Je(i),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l)}function Rn(e,i){if(i){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=i;return}}e.textContent=i}var gs=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function bu(e,i,a){var l=i.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="":l?e.setProperty(i,a):typeof a!="number"||a===0||gs.has(i)?i==="float"?e.cssFloat=a:e[i]=(""+a).trim():e[i]=a+"px"}function Vo(e,i,a){if(i!=null&&typeof i!="object")throw Error(s(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||i!=null&&i.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var h in i)l=i[h],i.hasOwnProperty(h)&&a[h]!==l&&bu(e,h,l)}else for(var d in i)i.hasOwnProperty(d)&&bu(e,d,i[d])}function Po(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ef=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),nf=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ca(e){return nf.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}var Di=null;function In(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Mi=null,Vi=null;function ko(e){var i=ti(e);if(i&&(e=i.stateNode)){var a=e[de]||null;t:switch(e=i.stateNode,i.type){case"input":if(fn(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),i=a.name,a.type==="radio"&&i!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+me(""+i)+'"][type="radio"]'),i=0;i<a.length;i++){var l=a[i];if(l!==e&&l.form===e.form){var h=l[de]||null;if(!h)throw Error(s(90));fn(l,h.value,h.defaultValue,h.defaultValue,h.checked,h.defaultChecked,h.type,h.name)}}for(i=0;i<a.length;i++)l=a[i],l.form===e.form&&Mo(l)}break t;case"textarea":Kt(e,a.value,a.defaultValue);break t;case"select":i=a.value,i!=null&&Oi(e,!!a.multiple,i,!1)}}}var ii=!1;function Ru(e,i,a){if(ii)return e(i,a);ii=!0;try{var l=e(i);return l}finally{if(ii=!1,(Mi!==null||Vi!==null)&&(yc(),Mi&&(i=Mi,e=Vi,Vi=Mi=null,ko(i),e)))for(i=0;i<e.length;i++)ko(e[i])}}function _s(e,i){var a=e.stateNode;if(a===null)return null;var l=a[de]||null;if(l===null)return null;a=l[i];t:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,i,typeof a));return a}var qn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),wn=!1;if(qn)try{var ys={};Object.defineProperty(ys,"passive",{get:function(){wn=!0}}),window.addEventListener("test",ys,ys),window.removeEventListener("test",ys,ys)}catch{wn=!1}var ri=null,fr=null,Pi=null;function xo(){if(Pi)return Pi;var e,i=fr,a=i.length,l,h="value"in ri?ri.value:ri.textContent,d=h.length;for(e=0;e<a&&i[e]===h[e];e++);var v=a-e;for(l=1;l<=v&&i[a-l]===h[d-l];l++);return Pi=h.slice(e,1<l?1-l:void 0)}function si(e){var i=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&i===13&&(e=13)):e=i,e===10&&(e=13),32<=e||e===13?e:0}function ai(){return!0}function Uo(){return!1}function Ce(e){function i(a,l,h,d,v){this._reactName=a,this._targetInst=h,this.type=l,this.nativeEvent=d,this.target=v,this.currentTarget=null;for(var E in e)e.hasOwnProperty(E)&&(a=e[E],this[E]=a?a(d):d[E]);return this.isDefaultPrevented=(d.defaultPrevented!=null?d.defaultPrevented:d.returnValue===!1)?ai:Uo,this.isPropagationStopped=Uo,this}return T(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ai)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ai)},persist:function(){},isPersistent:ai}),i}var jt={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ha=Ce(jt),vs=T({},jt,{view:0,detail:0}),Iu=Ce(vs),fa,da,oi,Ts=T({},vs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ss,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==oi&&(oi&&e.type==="mousemove"?(fa=e.screenX-oi.screenX,da=e.screenY-oi.screenY):da=fa=0,oi=e),fa)},movementY:function(e){return"movementY"in e?e.movementY:da}}),Cn=Ce(Ts),wu=T({},Ts,{dataTransfer:0}),rf=Ce(wu),Es=T({},vs,{relatedTarget:0}),ma=Ce(Es),Lo=T({},jt,{animationName:0,elapsedTime:0,pseudoElement:0}),pa=Ce(Lo),Cu=T({},jt,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ga=Ce(Cu),sf=T({},jt,{data:0}),zo=Ce(sf),As={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nu={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ou={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Bo(e){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(e):(e=Ou[e])?!!i[e]:!1}function Ss(){return Bo}var Du=T({},vs,{key:function(e){if(e.key){var i=As[e.key]||e.key;if(i!=="Unidentified")return i}return e.type==="keypress"?(e=si(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Nu[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ss,charCode:function(e){return e.type==="keypress"?si(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?si(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),_a=Ce(Du),Mu=T({},Ts,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),jo=Ce(Mu),ki=T({},vs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ss}),Vu=Ce(ki),Pu=T({},jt,{propertyName:0,elapsedTime:0,pseudoElement:0}),ku=Ce(Pu),xu=T({},Ts,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),ya=Ce(xu),tn=T({},jt,{newState:0,oldState:0}),Uu=Ce(tn),Lu=[9,13,27,32],li=qn&&"CompositionEvent"in window,c=null;qn&&"documentMode"in document&&(c=document.documentMode);var p=qn&&"TextEvent"in window&&!c,y=qn&&(!li||c&&8<c&&11>=c),A=" ",x=!1;function q(e,i){switch(e){case"keyup":return Lu.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function et(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Pt=!1;function ve(e,i){switch(e){case"compositionend":return et(i);case"keypress":return i.which!==32?null:(x=!0,A);case"textInput":return e=i.data,e===A&&x?null:e;default:return null}}function kt(e,i){if(Pt)return e==="compositionend"||!li&&q(e,i)?(e=xo(),Pi=fr=ri=null,Pt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return y&&i.locale!=="ko"?null:i.data;default:return null}}var Ne={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Te(e){var i=e&&e.nodeName&&e.nodeName.toLowerCase();return i==="input"?!!Ne[e.type]:i==="textarea"}function xi(e,i,a,l){Mi?Vi?Vi.push(l):Vi=[l]:Mi=l,i=bc(i,"onChange"),0<i.length&&(a=new ha("onChange","change",null,a,l),e.push({event:a,listeners:i}))}var xe=null,ui=null;function qo(e){Hy(e,0)}function zu(e){var i=ei(e);if(Mo(i))return e}function cg(e,i){if(e==="change")return i}var hg=!1;if(qn){var af;if(qn){var of="oninput"in document;if(!of){var fg=document.createElement("div");fg.setAttribute("oninput","return;"),of=typeof fg.oninput=="function"}af=of}else af=!1;hg=af&&(!document.documentMode||9<document.documentMode)}function dg(){xe&&(xe.detachEvent("onpropertychange",mg),ui=xe=null)}function mg(e){if(e.propertyName==="value"&&zu(ui)){var i=[];xi(i,ui,e,In(e)),Ru(qo,i)}}function ob(e,i,a){e==="focusin"?(dg(),xe=i,ui=a,xe.attachEvent("onpropertychange",mg)):e==="focusout"&&dg()}function lb(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return zu(ui)}function ub(e,i){if(e==="click")return zu(i)}function cb(e,i){if(e==="input"||e==="change")return zu(i)}function hb(e,i){return e===i&&(e!==0||1/e===1/i)||e!==e&&i!==i}var dn=typeof Object.is=="function"?Object.is:hb;function Ho(e,i){if(dn(e,i))return!0;if(typeof e!="object"||e===null||typeof i!="object"||i===null)return!1;var a=Object.keys(e),l=Object.keys(i);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var h=a[l];if(!ns.call(i,h)||!dn(e[h],i[h]))return!1}return!0}function pg(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function gg(e,i){var a=pg(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=i&&l>=i)return{node:a,offset:i-e};e=l}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=pg(a)}}function _g(e,i){return e&&i?e===i?!0:e&&e.nodeType===3?!1:i&&i.nodeType===3?_g(e,i.parentNode):"contains"in e?e.contains(i):e.compareDocumentPosition?!!(e.compareDocumentPosition(i)&16):!1:!1}function yg(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var i=ds(e.document);i instanceof e.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)e=i.contentWindow;else break;i=ds(e.document)}return i}function lf(e){var i=e&&e.nodeName&&e.nodeName.toLowerCase();return i&&(i==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||i==="textarea"||e.contentEditable==="true")}var fb=qn&&"documentMode"in document&&11>=document.documentMode,va=null,uf=null,Fo=null,cf=!1;function vg(e,i,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;cf||va==null||va!==ds(l)||(l=va,"selectionStart"in l&&lf(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Fo&&Ho(Fo,l)||(Fo=l,l=bc(uf,"onSelect"),0<l.length&&(i=new ha("onSelect","select",null,i,a),e.push({event:i,listeners:l}),i.target=va)))}function bs(e,i){var a={};return a[e.toLowerCase()]=i.toLowerCase(),a["Webkit"+e]="webkit"+i,a["Moz"+e]="moz"+i,a}var Ta={animationend:bs("Animation","AnimationEnd"),animationiteration:bs("Animation","AnimationIteration"),animationstart:bs("Animation","AnimationStart"),transitionrun:bs("Transition","TransitionRun"),transitionstart:bs("Transition","TransitionStart"),transitioncancel:bs("Transition","TransitionCancel"),transitionend:bs("Transition","TransitionEnd")},hf={},Tg={};qn&&(Tg=document.createElement("div").style,"AnimationEvent"in window||(delete Ta.animationend.animation,delete Ta.animationiteration.animation,delete Ta.animationstart.animation),"TransitionEvent"in window||delete Ta.transitionend.transition);function Rs(e){if(hf[e])return hf[e];if(!Ta[e])return e;var i=Ta[e],a;for(a in i)if(i.hasOwnProperty(a)&&a in Tg)return hf[e]=i[a];return e}var Eg=Rs("animationend"),Ag=Rs("animationiteration"),Sg=Rs("animationstart"),db=Rs("transitionrun"),mb=Rs("transitionstart"),pb=Rs("transitioncancel"),bg=Rs("transitionend"),Rg=new Map,ff="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");ff.push("scrollEnd");function Hn(e,i){Rg.set(e,i),jn(i,[e])}var Ig=new WeakMap;function Nn(e,i){if(typeof e=="object"&&e!==null){var a=Ig.get(e);return a!==void 0?a:(i={value:e,source:i,stack:la(i)},Ig.set(e,i),i)}return{value:e,source:i,stack:la(i)}}var On=[],Ea=0,df=0;function Bu(){for(var e=Ea,i=df=Ea=0;i<e;){var a=On[i];On[i++]=null;var l=On[i];On[i++]=null;var h=On[i];On[i++]=null;var d=On[i];if(On[i++]=null,l!==null&&h!==null){var v=l.pending;v===null?h.next=h:(h.next=v.next,v.next=h),l.pending=h}d!==0&&wg(a,h,d)}}function ju(e,i,a,l){On[Ea++]=e,On[Ea++]=i,On[Ea++]=a,On[Ea++]=l,df|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function mf(e,i,a,l){return ju(e,i,a,l),qu(e)}function Aa(e,i){return ju(e,null,null,i),qu(e)}function wg(e,i,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var h=!1,d=e.return;d!==null;)d.childLanes|=a,l=d.alternate,l!==null&&(l.childLanes|=a),d.tag===22&&(e=d.stateNode,e===null||e._visibility&1||(h=!0)),e=d,d=d.return;return e.tag===3?(d=e.stateNode,h&&i!==null&&(h=31-He(a),e=d.hiddenUpdates,l=e[h],l===null?e[h]=[i]:l.push(i),i.lane=a|536870912),d):null}function qu(e){if(50<pl)throw pl=0,Td=null,Error(s(185));for(var i=e.return;i!==null;)e=i,i=e.return;return e.tag===3?e.stateNode:null}var Sa={};function gb(e,i,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function mn(e,i,a,l){return new gb(e,i,a,l)}function pf(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ui(e,i){var a=e.alternate;return a===null?(a=mn(e.tag,i,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=i,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,i=e.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Cg(e,i){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=i,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,i=a.dependencies,e.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext}),e}function Hu(e,i,a,l,h,d){var v=0;if(l=e,typeof e=="function")pf(e)&&(v=1);else if(typeof e=="string")v=y1(e,a,ct.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case w:return e=mn(31,a,i,h),e.elementType=w,e.lanes=d,e;case X:return Is(a.children,h,d,i);case tt:v=8,h|=24;break;case Y:return e=mn(12,a,i,h|2),e.elementType=Y,e.lanes=d,e;case ht:return e=mn(13,a,i,h),e.elementType=ht,e.lanes=d,e;case Rt:return e=mn(19,a,i,h),e.elementType=Rt,e.lanes=d,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case gt:case at:v=10;break t;case ut:v=9;break t;case _t:v=11;break t;case M:v=14;break t;case b:v=16,l=null;break t}v=29,a=Error(s(130,e===null?"null":typeof e,"")),l=null}return i=mn(v,a,i,h),i.elementType=e,i.type=l,i.lanes=d,i}function Is(e,i,a,l){return e=mn(7,e,l,i),e.lanes=a,e}function gf(e,i,a){return e=mn(6,e,null,i),e.lanes=a,e}function _f(e,i,a){return i=mn(4,e.children!==null?e.children:[],e.key,i),i.lanes=a,i.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},i}var ba=[],Ra=0,Fu=null,Gu=0,Dn=[],Mn=0,ws=null,Li=1,zi="";function Cs(e,i){ba[Ra++]=Gu,ba[Ra++]=Fu,Fu=e,Gu=i}function Ng(e,i,a){Dn[Mn++]=Li,Dn[Mn++]=zi,Dn[Mn++]=ws,ws=e;var l=Li;e=zi;var h=32-He(l)-1;l&=~(1<<h),a+=1;var d=32-He(i)+h;if(30<d){var v=h-h%5;d=(l&(1<<v)-1).toString(32),l>>=v,h-=v,Li=1<<32-He(i)+h|a<<h|l,zi=d+e}else Li=1<<d|a<<h|l,zi=e}function yf(e){e.return!==null&&(Cs(e,1),Ng(e,1,0))}function vf(e){for(;e===Fu;)Fu=ba[--Ra],ba[Ra]=null,Gu=ba[--Ra],ba[Ra]=null;for(;e===ws;)ws=Dn[--Mn],Dn[Mn]=null,zi=Dn[--Mn],Dn[Mn]=null,Li=Dn[--Mn],Dn[Mn]=null}var en=null,ae=null,Bt=!1,Ns=null,ci=!1,Tf=Error(s(519));function Os(e){var i=Error(s(418,""));throw Yo(Nn(i,e)),Tf}function Og(e){var i=e.stateNode,a=e.type,l=e.memoizedProps;switch(i[ye]=e,i[de]=l,a){case"dialog":Dt("cancel",i),Dt("close",i);break;case"iframe":case"object":case"embed":Dt("load",i);break;case"video":case"audio":for(a=0;a<_l.length;a++)Dt(_l[a],i);break;case"source":Dt("error",i);break;case"img":case"image":case"link":Dt("error",i),Dt("load",i);break;case"details":Dt("toggle",i);break;case"input":Dt("invalid",i),ms(i,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0),ua(i);break;case"select":Dt("invalid",i);break;case"textarea":Dt("invalid",i),ps(i,l.value,l.defaultValue,l.children),ua(i)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||i.textContent===""+a||l.suppressHydrationWarning===!0||Yy(i.textContent,a)?(l.popover!=null&&(Dt("beforetoggle",i),Dt("toggle",i)),l.onScroll!=null&&Dt("scroll",i),l.onScrollEnd!=null&&Dt("scrollend",i),l.onClick!=null&&(i.onclick=Rc),i=!0):i=!1,i||Os(e)}function Dg(e){for(en=e.return;en;)switch(en.tag){case 5:case 13:ci=!1;return;case 27:case 3:ci=!0;return;default:en=en.return}}function Go(e){if(e!==en)return!1;if(!Bt)return Dg(e),Bt=!0,!1;var i=e.tag,a;if((a=i!==3&&i!==27)&&((a=i===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||xd(e.type,e.memoizedProps)),a=!a),a&&ae&&Os(e),Dg(e),i===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));t:{for(e=e.nextSibling,i=0;e;){if(e.nodeType===8)if(a=e.data,a==="/$"){if(i===0){ae=Gn(e.nextSibling);break t}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++;e=e.nextSibling}ae=null}}else i===27?(i=ae,Cr(e.type)?(e=Bd,Bd=null,ae=e):ae=i):ae=en?Gn(e.stateNode.nextSibling):null;return!0}function Ko(){ae=en=null,Bt=!1}function Mg(){var e=Ns;return e!==null&&(on===null?on=e:on.push.apply(on,e),Ns=null),e}function Yo(e){Ns===null?Ns=[e]:Ns.push(e)}var Ef=Z(null),Ds=null,Bi=null;function dr(e,i,a){J(Ef,i._currentValue),i._currentValue=a}function ji(e){e._currentValue=Ef.current,it(Ef)}function Af(e,i,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&i)!==i?(e.childLanes|=i,l!==null&&(l.childLanes|=i)):l!==null&&(l.childLanes&i)!==i&&(l.childLanes|=i),e===a)break;e=e.return}}function Sf(e,i,a,l){var h=e.child;for(h!==null&&(h.return=e);h!==null;){var d=h.dependencies;if(d!==null){var v=h.child;d=d.firstContext;t:for(;d!==null;){var E=d;d=h;for(var I=0;I<i.length;I++)if(E.context===i[I]){d.lanes|=a,E=d.alternate,E!==null&&(E.lanes|=a),Af(d.return,a,e),l||(v=null);break t}d=E.next}}else if(h.tag===18){if(v=h.return,v===null)throw Error(s(341));v.lanes|=a,d=v.alternate,d!==null&&(d.lanes|=a),Af(v,a,e),v=null}else v=h.child;if(v!==null)v.return=h;else for(v=h;v!==null;){if(v===e){v=null;break}if(h=v.sibling,h!==null){h.return=v.return,v=h;break}v=v.return}h=v}}function Qo(e,i,a,l){e=null;for(var h=i,d=!1;h!==null;){if(!d){if((h.flags&524288)!==0)d=!0;else if((h.flags&262144)!==0)break}if(h.tag===10){var v=h.alternate;if(v===null)throw Error(s(387));if(v=v.memoizedProps,v!==null){var E=h.type;dn(h.pendingProps.value,v.value)||(e!==null?e.push(E):e=[E])}}else if(h===we.current){if(v=h.alternate,v===null)throw Error(s(387));v.memoizedState.memoizedState!==h.memoizedState.memoizedState&&(e!==null?e.push(Sl):e=[Sl])}h=h.return}e!==null&&Sf(i,e,a,l),i.flags|=262144}function Ku(e){for(e=e.firstContext;e!==null;){if(!dn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ms(e){Ds=e,Bi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Fe(e){return Vg(Ds,e)}function Yu(e,i){return Ds===null&&Ms(e),Vg(e,i)}function Vg(e,i){var a=i._currentValue;if(i={context:i,memoizedValue:a,next:null},Bi===null){if(e===null)throw Error(s(308));Bi=i,e.dependencies={lanes:0,firstContext:i},e.flags|=524288}else Bi=Bi.next=i;return a}var _b=typeof AbortController<"u"?AbortController:function(){var e=[],i=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){i.aborted=!0,e.forEach(function(a){return a()})}},yb=r.unstable_scheduleCallback,vb=r.unstable_NormalPriority,Ee={$$typeof:at,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function bf(){return{controller:new _b,data:new Map,refCount:0}}function Xo(e){e.refCount--,e.refCount===0&&yb(vb,function(){e.controller.abort()})}var $o=null,Rf=0,Ia=0,wa=null;function Tb(e,i){if($o===null){var a=$o=[];Rf=0,Ia=wd(),wa={status:"pending",value:void 0,then:function(l){a.push(l)}}}return Rf++,i.then(Pg,Pg),i}function Pg(){if(--Rf===0&&$o!==null){wa!==null&&(wa.status="fulfilled");var e=$o;$o=null,Ia=0,wa=null;for(var i=0;i<e.length;i++)(0,e[i])()}}function Eb(e,i){var a=[],l={status:"pending",value:null,reason:null,then:function(h){a.push(h)}};return e.then(function(){l.status="fulfilled",l.value=i;for(var h=0;h<a.length;h++)(0,a[h])(i)},function(h){for(l.status="rejected",l.reason=h,h=0;h<a.length;h++)(0,a[h])(void 0)}),l}var kg=F.S;F.S=function(e,i){typeof i=="object"&&i!==null&&typeof i.then=="function"&&Tb(e,i),kg!==null&&kg(e,i)};var Vs=Z(null);function If(){var e=Vs.current;return e!==null?e:Wt.pooledCache}function Qu(e,i){i===null?J(Vs,Vs.current):J(Vs,i.pool)}function xg(){var e=If();return e===null?null:{parent:Ee._currentValue,pool:e}}var Zo=Error(s(460)),Ug=Error(s(474)),Xu=Error(s(542)),wf={then:function(){}};function Lg(e){return e=e.status,e==="fulfilled"||e==="rejected"}function $u(){}function zg(e,i,a){switch(a=e[a],a===void 0?e.push(i):a!==i&&(i.then($u,$u),i=a),i.status){case"fulfilled":return i.value;case"rejected":throw e=i.reason,jg(e),e;default:if(typeof i.status=="string")i.then($u,$u);else{if(e=Wt,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=i,e.status="pending",e.then(function(l){if(i.status==="pending"){var h=i;h.status="fulfilled",h.value=l}},function(l){if(i.status==="pending"){var h=i;h.status="rejected",h.reason=l}})}switch(i.status){case"fulfilled":return i.value;case"rejected":throw e=i.reason,jg(e),e}throw Wo=i,Zo}}var Wo=null;function Bg(){if(Wo===null)throw Error(s(459));var e=Wo;return Wo=null,e}function jg(e){if(e===Zo||e===Xu)throw Error(s(483))}var mr=!1;function Cf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Nf(e,i){e=e.updateQueue,i.updateQueue===e&&(i.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function pr(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function gr(e,i,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Ft&2)!==0){var h=l.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),l.pending=i,i=qu(e),wg(e,null,a),i}return ju(e,l,i,a),qu(e)}function Jo(e,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194048)!==0)){var l=i.lanes;l&=e.pendingLanes,a|=l,i.lanes=a,wo(e,a)}}function Of(e,i){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var h=null,d=null;if(a=a.firstBaseUpdate,a!==null){do{var v={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};d===null?h=d=v:d=d.next=v,a=a.next}while(a!==null);d===null?h=d=i:d=d.next=i}else h=d=i;a={baseState:l.baseState,firstBaseUpdate:h,lastBaseUpdate:d,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=i:e.next=i,a.lastBaseUpdate=i}var Df=!1;function tl(){if(Df){var e=wa;if(e!==null)throw e}}function el(e,i,a,l){Df=!1;var h=e.updateQueue;mr=!1;var d=h.firstBaseUpdate,v=h.lastBaseUpdate,E=h.shared.pending;if(E!==null){h.shared.pending=null;var I=E,L=I.next;I.next=null,v===null?d=L:v.next=L,v=I;var G=e.alternate;G!==null&&(G=G.updateQueue,E=G.lastBaseUpdate,E!==v&&(E===null?G.firstBaseUpdate=L:E.next=L,G.lastBaseUpdate=I))}if(d!==null){var Q=h.baseState;v=0,G=L=I=null,E=d;do{var B=E.lane&-536870913,j=B!==E.lane;if(j?(xt&B)===B:(l&B)===B){B!==0&&B===Ia&&(Df=!0),G!==null&&(G=G.next={lane:0,tag:E.tag,payload:E.payload,callback:null,next:null});t:{var yt=e,ft=E;B=i;var Xt=a;switch(ft.tag){case 1:if(yt=ft.payload,typeof yt=="function"){Q=yt.call(Xt,Q,B);break t}Q=yt;break t;case 3:yt.flags=yt.flags&-65537|128;case 0:if(yt=ft.payload,B=typeof yt=="function"?yt.call(Xt,Q,B):yt,B==null)break t;Q=T({},Q,B);break t;case 2:mr=!0}}B=E.callback,B!==null&&(e.flags|=64,j&&(e.flags|=8192),j=h.callbacks,j===null?h.callbacks=[B]:j.push(B))}else j={lane:B,tag:E.tag,payload:E.payload,callback:E.callback,next:null},G===null?(L=G=j,I=Q):G=G.next=j,v|=B;if(E=E.next,E===null){if(E=h.shared.pending,E===null)break;j=E,E=j.next,j.next=null,h.lastBaseUpdate=j,h.shared.pending=null}}while(!0);G===null&&(I=Q),h.baseState=I,h.firstBaseUpdate=L,h.lastBaseUpdate=G,d===null&&(h.shared.lanes=0),br|=v,e.lanes=v,e.memoizedState=Q}}function qg(e,i){if(typeof e!="function")throw Error(s(191,e));e.call(i)}function Hg(e,i){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)qg(a[e],i)}var Ca=Z(null),Zu=Z(0);function Fg(e,i){e=Qi,J(Zu,e),J(Ca,i),Qi=e|i.baseLanes}function Mf(){J(Zu,Qi),J(Ca,Ca.current)}function Vf(){Qi=Zu.current,it(Ca),it(Zu)}var _r=0,It=null,Yt=null,pe=null,Wu=!1,Na=!1,Ps=!1,Ju=0,nl=0,Oa=null,Ab=0;function ce(){throw Error(s(321))}function Pf(e,i){if(i===null)return!1;for(var a=0;a<i.length&&a<e.length;a++)if(!dn(e[a],i[a]))return!1;return!0}function kf(e,i,a,l,h,d){return _r=d,It=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,F.H=e===null||e.memoizedState===null?w_:C_,Ps=!1,d=a(l,h),Ps=!1,Na&&(d=Kg(i,a,l,h)),Gg(e),d}function Gg(e){F.H=sc;var i=Yt!==null&&Yt.next!==null;if(_r=0,pe=Yt=It=null,Wu=!1,nl=0,Oa=null,i)throw Error(s(300));e===null||Oe||(e=e.dependencies,e!==null&&Ku(e)&&(Oe=!0))}function Kg(e,i,a,l){It=e;var h=0;do{if(Na&&(Oa=null),nl=0,Na=!1,25<=h)throw Error(s(301));if(h+=1,pe=Yt=null,e.updateQueue!=null){var d=e.updateQueue;d.lastEffect=null,d.events=null,d.stores=null,d.memoCache!=null&&(d.memoCache.index=0)}F.H=Nb,d=i(a,l)}while(Na);return d}function Sb(){var e=F.H,i=e.useState()[0];return i=typeof i.then=="function"?il(i):i,e=e.useState()[0],(Yt!==null?Yt.memoizedState:null)!==e&&(It.flags|=1024),i}function xf(){var e=Ju!==0;return Ju=0,e}function Uf(e,i,a){i.updateQueue=e.updateQueue,i.flags&=-2053,e.lanes&=~a}function Lf(e){if(Wu){for(e=e.memoizedState;e!==null;){var i=e.queue;i!==null&&(i.pending=null),e=e.next}Wu=!1}_r=0,pe=Yt=It=null,Na=!1,nl=Ju=0,Oa=null}function sn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return pe===null?It.memoizedState=pe=e:pe=pe.next=e,pe}function ge(){if(Yt===null){var e=It.alternate;e=e!==null?e.memoizedState:null}else e=Yt.next;var i=pe===null?It.memoizedState:pe.next;if(i!==null)pe=i,Yt=e;else{if(e===null)throw It.alternate===null?Error(s(467)):Error(s(310));Yt=e,e={memoizedState:Yt.memoizedState,baseState:Yt.baseState,baseQueue:Yt.baseQueue,queue:Yt.queue,next:null},pe===null?It.memoizedState=pe=e:pe=pe.next=e}return pe}function zf(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function il(e){var i=nl;return nl+=1,Oa===null&&(Oa=[]),e=zg(Oa,e,i),i=It,(pe===null?i.memoizedState:pe.next)===null&&(i=i.alternate,F.H=i===null||i.memoizedState===null?w_:C_),e}function tc(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return il(e);if(e.$$typeof===at)return Fe(e)}throw Error(s(438,String(e)))}function Bf(e){var i=null,a=It.updateQueue;if(a!==null&&(i=a.memoCache),i==null){var l=It.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(i={data:l.data.map(function(h){return h.slice()}),index:0})))}if(i==null&&(i={data:[],index:0}),a===null&&(a=zf(),It.updateQueue=a),a.memoCache=i,a=i.data[i.index],a===void 0)for(a=i.data[i.index]=Array(e),l=0;l<e;l++)a[l]=D;return i.index++,a}function qi(e,i){return typeof i=="function"?i(e):i}function ec(e){var i=ge();return jf(i,Yt,e)}function jf(e,i,a){var l=e.queue;if(l===null)throw Error(s(311));l.lastRenderedReducer=a;var h=e.baseQueue,d=l.pending;if(d!==null){if(h!==null){var v=h.next;h.next=d.next,d.next=v}i.baseQueue=h=d,l.pending=null}if(d=e.baseState,h===null)e.memoizedState=d;else{i=h.next;var E=v=null,I=null,L=i,G=!1;do{var Q=L.lane&-536870913;if(Q!==L.lane?(xt&Q)===Q:(_r&Q)===Q){var B=L.revertLane;if(B===0)I!==null&&(I=I.next={lane:0,revertLane:0,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null}),Q===Ia&&(G=!0);else if((_r&B)===B){L=L.next,B===Ia&&(G=!0);continue}else Q={lane:0,revertLane:L.revertLane,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null},I===null?(E=I=Q,v=d):I=I.next=Q,It.lanes|=B,br|=B;Q=L.action,Ps&&a(d,Q),d=L.hasEagerState?L.eagerState:a(d,Q)}else B={lane:Q,revertLane:L.revertLane,action:L.action,hasEagerState:L.hasEagerState,eagerState:L.eagerState,next:null},I===null?(E=I=B,v=d):I=I.next=B,It.lanes|=Q,br|=Q;L=L.next}while(L!==null&&L!==i);if(I===null?v=d:I.next=E,!dn(d,e.memoizedState)&&(Oe=!0,G&&(a=wa,a!==null)))throw a;e.memoizedState=d,e.baseState=v,e.baseQueue=I,l.lastRenderedState=d}return h===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function qf(e){var i=ge(),a=i.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var l=a.dispatch,h=a.pending,d=i.memoizedState;if(h!==null){a.pending=null;var v=h=h.next;do d=e(d,v.action),v=v.next;while(v!==h);dn(d,i.memoizedState)||(Oe=!0),i.memoizedState=d,i.baseQueue===null&&(i.baseState=d),a.lastRenderedState=d}return[d,l]}function Yg(e,i,a){var l=It,h=ge(),d=Bt;if(d){if(a===void 0)throw Error(s(407));a=a()}else a=i();var v=!dn((Yt||h).memoizedState,a);v&&(h.memoizedState=a,Oe=!0),h=h.queue;var E=$g.bind(null,l,h,e);if(rl(2048,8,E,[e]),h.getSnapshot!==i||v||pe!==null&&pe.memoizedState.tag&1){if(l.flags|=2048,Da(9,nc(),Xg.bind(null,l,h,a,i),null),Wt===null)throw Error(s(349));d||(_r&124)!==0||Qg(l,i,a)}return a}function Qg(e,i,a){e.flags|=16384,e={getSnapshot:i,value:a},i=It.updateQueue,i===null?(i=zf(),It.updateQueue=i,i.stores=[e]):(a=i.stores,a===null?i.stores=[e]:a.push(e))}function Xg(e,i,a,l){i.value=a,i.getSnapshot=l,Zg(i)&&Wg(e)}function $g(e,i,a){return a(function(){Zg(i)&&Wg(e)})}function Zg(e){var i=e.getSnapshot;e=e.value;try{var a=i();return!dn(e,a)}catch{return!0}}function Wg(e){var i=Aa(e,2);i!==null&&vn(i,e,2)}function Hf(e){var i=sn();if(typeof e=="function"){var a=e;if(e=a(),Ps){hn(!0);try{a()}finally{hn(!1)}}}return i.memoizedState=i.baseState=e,i.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:qi,lastRenderedState:e},i}function Jg(e,i,a,l){return e.baseState=a,jf(e,Yt,typeof l=="function"?l:qi)}function bb(e,i,a,l,h){if(rc(e))throw Error(s(485));if(e=i.action,e!==null){var d={payload:h,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(v){d.listeners.push(v)}};F.T!==null?a(!0):d.isTransition=!1,l(d),a=i.pending,a===null?(d.next=i.pending=d,t_(i,d)):(d.next=a.next,i.pending=a.next=d)}}function t_(e,i){var a=i.action,l=i.payload,h=e.state;if(i.isTransition){var d=F.T,v={};F.T=v;try{var E=a(h,l),I=F.S;I!==null&&I(v,E),e_(e,i,E)}catch(L){Ff(e,i,L)}finally{F.T=d}}else try{d=a(h,l),e_(e,i,d)}catch(L){Ff(e,i,L)}}function e_(e,i,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){n_(e,i,l)},function(l){return Ff(e,i,l)}):n_(e,i,a)}function n_(e,i,a){i.status="fulfilled",i.value=a,i_(i),e.state=a,i=e.pending,i!==null&&(a=i.next,a===i?e.pending=null:(a=a.next,i.next=a,t_(e,a)))}function Ff(e,i,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do i.status="rejected",i.reason=a,i_(i),i=i.next;while(i!==l)}e.action=null}function i_(e){e=e.listeners;for(var i=0;i<e.length;i++)(0,e[i])()}function r_(e,i){return i}function s_(e,i){if(Bt){var a=Wt.formState;if(a!==null){t:{var l=It;if(Bt){if(ae){e:{for(var h=ae,d=ci;h.nodeType!==8;){if(!d){h=null;break e}if(h=Gn(h.nextSibling),h===null){h=null;break e}}d=h.data,h=d==="F!"||d==="F"?h:null}if(h){ae=Gn(h.nextSibling),l=h.data==="F!";break t}}Os(l)}l=!1}l&&(i=a[0])}}return a=sn(),a.memoizedState=a.baseState=i,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:r_,lastRenderedState:i},a.queue=l,a=b_.bind(null,It,l),l.dispatch=a,l=Hf(!1),d=Xf.bind(null,It,!1,l.queue),l=sn(),h={state:i,dispatch:null,action:e,pending:null},l.queue=h,a=bb.bind(null,It,h,d,a),h.dispatch=a,l.memoizedState=e,[i,a,!1]}function a_(e){var i=ge();return o_(i,Yt,e)}function o_(e,i,a){if(i=jf(e,i,r_)[0],e=ec(qi)[0],typeof i=="object"&&i!==null&&typeof i.then=="function")try{var l=il(i)}catch(v){throw v===Zo?Xu:v}else l=i;i=ge();var h=i.queue,d=h.dispatch;return a!==i.memoizedState&&(It.flags|=2048,Da(9,nc(),Rb.bind(null,h,a),null)),[l,d,e]}function Rb(e,i){e.action=i}function l_(e){var i=ge(),a=Yt;if(a!==null)return o_(i,a,e);ge(),i=i.memoizedState,a=ge();var l=a.queue.dispatch;return a.memoizedState=e,[i,l,!1]}function Da(e,i,a,l){return e={tag:e,create:a,deps:l,inst:i,next:null},i=It.updateQueue,i===null&&(i=zf(),It.updateQueue=i),a=i.lastEffect,a===null?i.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,i.lastEffect=e),e}function nc(){return{destroy:void 0,resource:void 0}}function u_(){return ge().memoizedState}function ic(e,i,a,l){var h=sn();l=l===void 0?null:l,It.flags|=e,h.memoizedState=Da(1|i,nc(),a,l)}function rl(e,i,a,l){var h=ge();l=l===void 0?null:l;var d=h.memoizedState.inst;Yt!==null&&l!==null&&Pf(l,Yt.memoizedState.deps)?h.memoizedState=Da(i,d,a,l):(It.flags|=e,h.memoizedState=Da(1|i,d,a,l))}function c_(e,i){ic(8390656,8,e,i)}function h_(e,i){rl(2048,8,e,i)}function f_(e,i){return rl(4,2,e,i)}function d_(e,i){return rl(4,4,e,i)}function m_(e,i){if(typeof i=="function"){e=e();var a=i(e);return function(){typeof a=="function"?a():i(null)}}if(i!=null)return e=e(),i.current=e,function(){i.current=null}}function p_(e,i,a){a=a!=null?a.concat([e]):null,rl(4,4,m_.bind(null,i,e),a)}function Gf(){}function g_(e,i){var a=ge();i=i===void 0?null:i;var l=a.memoizedState;return i!==null&&Pf(i,l[1])?l[0]:(a.memoizedState=[e,i],e)}function __(e,i){var a=ge();i=i===void 0?null:i;var l=a.memoizedState;if(i!==null&&Pf(i,l[1]))return l[0];if(l=e(),Ps){hn(!0);try{e()}finally{hn(!1)}}return a.memoizedState=[l,i],l}function Kf(e,i,a){return a===void 0||(_r&1073741824)!==0?e.memoizedState=i:(e.memoizedState=a,e=Ty(),It.lanes|=e,br|=e,a)}function y_(e,i,a,l){return dn(a,i)?a:Ca.current!==null?(e=Kf(e,a,l),dn(e,i)||(Oe=!0),e):(_r&42)===0?(Oe=!0,e.memoizedState=a):(e=Ty(),It.lanes|=e,br|=e,i)}function v_(e,i,a,l,h){var d=nt.p;nt.p=d!==0&&8>d?d:8;var v=F.T,E={};F.T=E,Xf(e,!1,i,a);try{var I=h(),L=F.S;if(L!==null&&L(E,I),I!==null&&typeof I=="object"&&typeof I.then=="function"){var G=Eb(I,l);sl(e,i,G,yn(e))}else sl(e,i,l,yn(e))}catch(Q){sl(e,i,{then:function(){},status:"rejected",reason:Q},yn())}finally{nt.p=d,F.T=v}}function Ib(){}function Yf(e,i,a,l){if(e.tag!==5)throw Error(s(476));var h=T_(e).queue;v_(e,h,i,lt,a===null?Ib:function(){return E_(e),a(l)})}function T_(e){var i=e.memoizedState;if(i!==null)return i;i={memoizedState:lt,baseState:lt,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:qi,lastRenderedState:lt},next:null};var a={};return i.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:qi,lastRenderedState:a},next:null},e.memoizedState=i,e=e.alternate,e!==null&&(e.memoizedState=i),i}function E_(e){var i=T_(e).next.queue;sl(e,i,{},yn())}function Qf(){return Fe(Sl)}function A_(){return ge().memoizedState}function S_(){return ge().memoizedState}function wb(e){for(var i=e.return;i!==null;){switch(i.tag){case 24:case 3:var a=yn();e=pr(a);var l=gr(i,e,a);l!==null&&(vn(l,i,a),Jo(l,i,a)),i={cache:bf()},e.payload=i;return}i=i.return}}function Cb(e,i,a){var l=yn();a={lane:l,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null},rc(e)?R_(i,a):(a=mf(e,i,a,l),a!==null&&(vn(a,e,l),I_(a,i,l)))}function b_(e,i,a){var l=yn();sl(e,i,a,l)}function sl(e,i,a,l){var h={lane:l,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null};if(rc(e))R_(i,h);else{var d=e.alternate;if(e.lanes===0&&(d===null||d.lanes===0)&&(d=i.lastRenderedReducer,d!==null))try{var v=i.lastRenderedState,E=d(v,a);if(h.hasEagerState=!0,h.eagerState=E,dn(E,v))return ju(e,i,h,0),Wt===null&&Bu(),!1}catch{}finally{}if(a=mf(e,i,h,l),a!==null)return vn(a,e,l),I_(a,i,l),!0}return!1}function Xf(e,i,a,l){if(l={lane:2,revertLane:wd(),action:l,hasEagerState:!1,eagerState:null,next:null},rc(e)){if(i)throw Error(s(479))}else i=mf(e,a,l,2),i!==null&&vn(i,e,2)}function rc(e){var i=e.alternate;return e===It||i!==null&&i===It}function R_(e,i){Na=Wu=!0;var a=e.pending;a===null?i.next=i:(i.next=a.next,a.next=i),e.pending=i}function I_(e,i,a){if((a&4194048)!==0){var l=i.lanes;l&=e.pendingLanes,a|=l,i.lanes=a,wo(e,a)}}var sc={readContext:Fe,use:tc,useCallback:ce,useContext:ce,useEffect:ce,useImperativeHandle:ce,useLayoutEffect:ce,useInsertionEffect:ce,useMemo:ce,useReducer:ce,useRef:ce,useState:ce,useDebugValue:ce,useDeferredValue:ce,useTransition:ce,useSyncExternalStore:ce,useId:ce,useHostTransitionStatus:ce,useFormState:ce,useActionState:ce,useOptimistic:ce,useMemoCache:ce,useCacheRefresh:ce},w_={readContext:Fe,use:tc,useCallback:function(e,i){return sn().memoizedState=[e,i===void 0?null:i],e},useContext:Fe,useEffect:c_,useImperativeHandle:function(e,i,a){a=a!=null?a.concat([e]):null,ic(4194308,4,m_.bind(null,i,e),a)},useLayoutEffect:function(e,i){return ic(4194308,4,e,i)},useInsertionEffect:function(e,i){ic(4,2,e,i)},useMemo:function(e,i){var a=sn();i=i===void 0?null:i;var l=e();if(Ps){hn(!0);try{e()}finally{hn(!1)}}return a.memoizedState=[l,i],l},useReducer:function(e,i,a){var l=sn();if(a!==void 0){var h=a(i);if(Ps){hn(!0);try{a(i)}finally{hn(!1)}}}else h=i;return l.memoizedState=l.baseState=h,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:h},l.queue=e,e=e.dispatch=Cb.bind(null,It,e),[l.memoizedState,e]},useRef:function(e){var i=sn();return e={current:e},i.memoizedState=e},useState:function(e){e=Hf(e);var i=e.queue,a=b_.bind(null,It,i);return i.dispatch=a,[e.memoizedState,a]},useDebugValue:Gf,useDeferredValue:function(e,i){var a=sn();return Kf(a,e,i)},useTransition:function(){var e=Hf(!1);return e=v_.bind(null,It,e.queue,!0,!1),sn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,i,a){var l=It,h=sn();if(Bt){if(a===void 0)throw Error(s(407));a=a()}else{if(a=i(),Wt===null)throw Error(s(349));(xt&124)!==0||Qg(l,i,a)}h.memoizedState=a;var d={value:a,getSnapshot:i};return h.queue=d,c_($g.bind(null,l,d,e),[e]),l.flags|=2048,Da(9,nc(),Xg.bind(null,l,d,a,i),null),a},useId:function(){var e=sn(),i=Wt.identifierPrefix;if(Bt){var a=zi,l=Li;a=(l&~(1<<32-He(l)-1)).toString(32)+a,i="«"+i+"R"+a,a=Ju++,0<a&&(i+="H"+a.toString(32)),i+="»"}else a=Ab++,i="«"+i+"r"+a.toString(32)+"»";return e.memoizedState=i},useHostTransitionStatus:Qf,useFormState:s_,useActionState:s_,useOptimistic:function(e){var i=sn();i.memoizedState=i.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return i.queue=a,i=Xf.bind(null,It,!0,a),a.dispatch=i,[e,i]},useMemoCache:Bf,useCacheRefresh:function(){return sn().memoizedState=wb.bind(null,It)}},C_={readContext:Fe,use:tc,useCallback:g_,useContext:Fe,useEffect:h_,useImperativeHandle:p_,useInsertionEffect:f_,useLayoutEffect:d_,useMemo:__,useReducer:ec,useRef:u_,useState:function(){return ec(qi)},useDebugValue:Gf,useDeferredValue:function(e,i){var a=ge();return y_(a,Yt.memoizedState,e,i)},useTransition:function(){var e=ec(qi)[0],i=ge().memoizedState;return[typeof e=="boolean"?e:il(e),i]},useSyncExternalStore:Yg,useId:A_,useHostTransitionStatus:Qf,useFormState:a_,useActionState:a_,useOptimistic:function(e,i){var a=ge();return Jg(a,Yt,e,i)},useMemoCache:Bf,useCacheRefresh:S_},Nb={readContext:Fe,use:tc,useCallback:g_,useContext:Fe,useEffect:h_,useImperativeHandle:p_,useInsertionEffect:f_,useLayoutEffect:d_,useMemo:__,useReducer:qf,useRef:u_,useState:function(){return qf(qi)},useDebugValue:Gf,useDeferredValue:function(e,i){var a=ge();return Yt===null?Kf(a,e,i):y_(a,Yt.memoizedState,e,i)},useTransition:function(){var e=qf(qi)[0],i=ge().memoizedState;return[typeof e=="boolean"?e:il(e),i]},useSyncExternalStore:Yg,useId:A_,useHostTransitionStatus:Qf,useFormState:l_,useActionState:l_,useOptimistic:function(e,i){var a=ge();return Yt!==null?Jg(a,Yt,e,i):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Bf,useCacheRefresh:S_},Ma=null,al=0;function ac(e){var i=al;return al+=1,Ma===null&&(Ma=[]),zg(Ma,e,i)}function ol(e,i){i=i.props.ref,e.ref=i!==void 0?i:null}function oc(e,i){throw i.$$typeof===S?Error(s(525)):(e=Object.prototype.toString.call(i),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":e)))}function N_(e){var i=e._init;return i(e._payload)}function O_(e){function i(P,O){if(e){var U=P.deletions;U===null?(P.deletions=[O],P.flags|=16):U.push(O)}}function a(P,O){if(!e)return null;for(;O!==null;)i(P,O),O=O.sibling;return null}function l(P){for(var O=new Map;P!==null;)P.key!==null?O.set(P.key,P):O.set(P.index,P),P=P.sibling;return O}function h(P,O){return P=Ui(P,O),P.index=0,P.sibling=null,P}function d(P,O,U){return P.index=U,e?(U=P.alternate,U!==null?(U=U.index,U<O?(P.flags|=67108866,O):U):(P.flags|=67108866,O)):(P.flags|=1048576,O)}function v(P){return e&&P.alternate===null&&(P.flags|=67108866),P}function E(P,O,U,K){return O===null||O.tag!==6?(O=gf(U,P.mode,K),O.return=P,O):(O=h(O,U),O.return=P,O)}function I(P,O,U,K){var st=U.type;return st===X?G(P,O,U.props.children,K,U.key):O!==null&&(O.elementType===st||typeof st=="object"&&st!==null&&st.$$typeof===b&&N_(st)===O.type)?(O=h(O,U.props),ol(O,U),O.return=P,O):(O=Hu(U.type,U.key,U.props,null,P.mode,K),ol(O,U),O.return=P,O)}function L(P,O,U,K){return O===null||O.tag!==4||O.stateNode.containerInfo!==U.containerInfo||O.stateNode.implementation!==U.implementation?(O=_f(U,P.mode,K),O.return=P,O):(O=h(O,U.children||[]),O.return=P,O)}function G(P,O,U,K,st){return O===null||O.tag!==7?(O=Is(U,P.mode,K,st),O.return=P,O):(O=h(O,U),O.return=P,O)}function Q(P,O,U){if(typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint")return O=gf(""+O,P.mode,U),O.return=P,O;if(typeof O=="object"&&O!==null){switch(O.$$typeof){case R:return U=Hu(O.type,O.key,O.props,null,P.mode,U),ol(U,O),U.return=P,U;case z:return O=_f(O,P.mode,U),O.return=P,O;case b:var K=O._init;return O=K(O._payload),Q(P,O,U)}if(re(O)||k(O))return O=Is(O,P.mode,U,null),O.return=P,O;if(typeof O.then=="function")return Q(P,ac(O),U);if(O.$$typeof===at)return Q(P,Yu(P,O),U);oc(P,O)}return null}function B(P,O,U,K){var st=O!==null?O.key:null;if(typeof U=="string"&&U!==""||typeof U=="number"||typeof U=="bigint")return st!==null?null:E(P,O,""+U,K);if(typeof U=="object"&&U!==null){switch(U.$$typeof){case R:return U.key===st?I(P,O,U,K):null;case z:return U.key===st?L(P,O,U,K):null;case b:return st=U._init,U=st(U._payload),B(P,O,U,K)}if(re(U)||k(U))return st!==null?null:G(P,O,U,K,null);if(typeof U.then=="function")return B(P,O,ac(U),K);if(U.$$typeof===at)return B(P,O,Yu(P,U),K);oc(P,U)}return null}function j(P,O,U,K,st){if(typeof K=="string"&&K!==""||typeof K=="number"||typeof K=="bigint")return P=P.get(U)||null,E(O,P,""+K,st);if(typeof K=="object"&&K!==null){switch(K.$$typeof){case R:return P=P.get(K.key===null?U:K.key)||null,I(O,P,K,st);case z:return P=P.get(K.key===null?U:K.key)||null,L(O,P,K,st);case b:var Nt=K._init;return K=Nt(K._payload),j(P,O,U,K,st)}if(re(K)||k(K))return P=P.get(U)||null,G(O,P,K,st,null);if(typeof K.then=="function")return j(P,O,U,ac(K),st);if(K.$$typeof===at)return j(P,O,U,Yu(O,K),st);oc(O,K)}return null}function yt(P,O,U,K){for(var st=null,Nt=null,ot=O,pt=O=0,Me=null;ot!==null&&pt<U.length;pt++){ot.index>pt?(Me=ot,ot=null):Me=ot.sibling;var Lt=B(P,ot,U[pt],K);if(Lt===null){ot===null&&(ot=Me);break}e&&ot&&Lt.alternate===null&&i(P,ot),O=d(Lt,O,pt),Nt===null?st=Lt:Nt.sibling=Lt,Nt=Lt,ot=Me}if(pt===U.length)return a(P,ot),Bt&&Cs(P,pt),st;if(ot===null){for(;pt<U.length;pt++)ot=Q(P,U[pt],K),ot!==null&&(O=d(ot,O,pt),Nt===null?st=ot:Nt.sibling=ot,Nt=ot);return Bt&&Cs(P,pt),st}for(ot=l(ot);pt<U.length;pt++)Me=j(ot,P,pt,U[pt],K),Me!==null&&(e&&Me.alternate!==null&&ot.delete(Me.key===null?pt:Me.key),O=d(Me,O,pt),Nt===null?st=Me:Nt.sibling=Me,Nt=Me);return e&&ot.forEach(function(Vr){return i(P,Vr)}),Bt&&Cs(P,pt),st}function ft(P,O,U,K){if(U==null)throw Error(s(151));for(var st=null,Nt=null,ot=O,pt=O=0,Me=null,Lt=U.next();ot!==null&&!Lt.done;pt++,Lt=U.next()){ot.index>pt?(Me=ot,ot=null):Me=ot.sibling;var Vr=B(P,ot,Lt.value,K);if(Vr===null){ot===null&&(ot=Me);break}e&&ot&&Vr.alternate===null&&i(P,ot),O=d(Vr,O,pt),Nt===null?st=Vr:Nt.sibling=Vr,Nt=Vr,ot=Me}if(Lt.done)return a(P,ot),Bt&&Cs(P,pt),st;if(ot===null){for(;!Lt.done;pt++,Lt=U.next())Lt=Q(P,Lt.value,K),Lt!==null&&(O=d(Lt,O,pt),Nt===null?st=Lt:Nt.sibling=Lt,Nt=Lt);return Bt&&Cs(P,pt),st}for(ot=l(ot);!Lt.done;pt++,Lt=U.next())Lt=j(ot,P,pt,Lt.value,K),Lt!==null&&(e&&Lt.alternate!==null&&ot.delete(Lt.key===null?pt:Lt.key),O=d(Lt,O,pt),Nt===null?st=Lt:Nt.sibling=Lt,Nt=Lt);return e&&ot.forEach(function(O1){return i(P,O1)}),Bt&&Cs(P,pt),st}function Xt(P,O,U,K){if(typeof U=="object"&&U!==null&&U.type===X&&U.key===null&&(U=U.props.children),typeof U=="object"&&U!==null){switch(U.$$typeof){case R:t:{for(var st=U.key;O!==null;){if(O.key===st){if(st=U.type,st===X){if(O.tag===7){a(P,O.sibling),K=h(O,U.props.children),K.return=P,P=K;break t}}else if(O.elementType===st||typeof st=="object"&&st!==null&&st.$$typeof===b&&N_(st)===O.type){a(P,O.sibling),K=h(O,U.props),ol(K,U),K.return=P,P=K;break t}a(P,O);break}else i(P,O);O=O.sibling}U.type===X?(K=Is(U.props.children,P.mode,K,U.key),K.return=P,P=K):(K=Hu(U.type,U.key,U.props,null,P.mode,K),ol(K,U),K.return=P,P=K)}return v(P);case z:t:{for(st=U.key;O!==null;){if(O.key===st)if(O.tag===4&&O.stateNode.containerInfo===U.containerInfo&&O.stateNode.implementation===U.implementation){a(P,O.sibling),K=h(O,U.children||[]),K.return=P,P=K;break t}else{a(P,O);break}else i(P,O);O=O.sibling}K=_f(U,P.mode,K),K.return=P,P=K}return v(P);case b:return st=U._init,U=st(U._payload),Xt(P,O,U,K)}if(re(U))return yt(P,O,U,K);if(k(U)){if(st=k(U),typeof st!="function")throw Error(s(150));return U=st.call(U),ft(P,O,U,K)}if(typeof U.then=="function")return Xt(P,O,ac(U),K);if(U.$$typeof===at)return Xt(P,O,Yu(P,U),K);oc(P,U)}return typeof U=="string"&&U!==""||typeof U=="number"||typeof U=="bigint"?(U=""+U,O!==null&&O.tag===6?(a(P,O.sibling),K=h(O,U),K.return=P,P=K):(a(P,O),K=gf(U,P.mode,K),K.return=P,P=K),v(P)):a(P,O)}return function(P,O,U,K){try{al=0;var st=Xt(P,O,U,K);return Ma=null,st}catch(ot){if(ot===Zo||ot===Xu)throw ot;var Nt=mn(29,ot,null,P.mode);return Nt.lanes=K,Nt.return=P,Nt}finally{}}}var Va=O_(!0),D_=O_(!1),Vn=Z(null),hi=null;function yr(e){var i=e.alternate;J(Ae,Ae.current&1),J(Vn,e),hi===null&&(i===null||Ca.current!==null||i.memoizedState!==null)&&(hi=e)}function M_(e){if(e.tag===22){if(J(Ae,Ae.current),J(Vn,e),hi===null){var i=e.alternate;i!==null&&i.memoizedState!==null&&(hi=e)}}else vr()}function vr(){J(Ae,Ae.current),J(Vn,Vn.current)}function Hi(e){it(Vn),hi===e&&(hi=null),it(Ae)}var Ae=Z(0);function lc(e){for(var i=e;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||zd(a)))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===e)break;for(;i.sibling===null;){if(i.return===null||i.return===e)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}function $f(e,i,a,l){i=e.memoizedState,a=a(l,i),a=a==null?i:T({},i,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Zf={enqueueSetState:function(e,i,a){e=e._reactInternals;var l=yn(),h=pr(l);h.payload=i,a!=null&&(h.callback=a),i=gr(e,h,l),i!==null&&(vn(i,e,l),Jo(i,e,l))},enqueueReplaceState:function(e,i,a){e=e._reactInternals;var l=yn(),h=pr(l);h.tag=1,h.payload=i,a!=null&&(h.callback=a),i=gr(e,h,l),i!==null&&(vn(i,e,l),Jo(i,e,l))},enqueueForceUpdate:function(e,i){e=e._reactInternals;var a=yn(),l=pr(a);l.tag=2,i!=null&&(l.callback=i),i=gr(e,l,a),i!==null&&(vn(i,e,a),Jo(i,e,a))}};function V_(e,i,a,l,h,d,v){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,d,v):i.prototype&&i.prototype.isPureReactComponent?!Ho(a,l)||!Ho(h,d):!0}function P_(e,i,a,l){e=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,l),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,l),i.state!==e&&Zf.enqueueReplaceState(i,i.state,null)}function ks(e,i){var a=i;if("ref"in i){a={};for(var l in i)l!=="ref"&&(a[l]=i[l])}if(e=e.defaultProps){a===i&&(a=T({},a));for(var h in e)a[h]===void 0&&(a[h]=e[h])}return a}var uc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var i=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(i))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function k_(e){uc(e)}function x_(e){console.error(e)}function U_(e){uc(e)}function cc(e,i){try{var a=e.onUncaughtError;a(i.value,{componentStack:i.stack})}catch(l){setTimeout(function(){throw l})}}function L_(e,i,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:i.tag===1?i.stateNode:null})}catch(h){setTimeout(function(){throw h})}}function Wf(e,i,a){return a=pr(a),a.tag=3,a.payload={element:null},a.callback=function(){cc(e,i)},a}function z_(e){return e=pr(e),e.tag=3,e}function B_(e,i,a,l){var h=a.type.getDerivedStateFromError;if(typeof h=="function"){var d=l.value;e.payload=function(){return h(d)},e.callback=function(){L_(i,a,l)}}var v=a.stateNode;v!==null&&typeof v.componentDidCatch=="function"&&(e.callback=function(){L_(i,a,l),typeof h!="function"&&(Rr===null?Rr=new Set([this]):Rr.add(this));var E=l.stack;this.componentDidCatch(l.value,{componentStack:E!==null?E:""})})}function Ob(e,i,a,l,h){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(i=a.alternate,i!==null&&Qo(i,a,h,!0),a=Vn.current,a!==null){switch(a.tag){case 13:return hi===null?Ad():a.alternate===null&&oe===0&&(oe=3),a.flags&=-257,a.flags|=65536,a.lanes=h,l===wf?a.flags|=16384:(i=a.updateQueue,i===null?a.updateQueue=new Set([l]):i.add(l),bd(e,l,h)),!1;case 22:return a.flags|=65536,l===wf?a.flags|=16384:(i=a.updateQueue,i===null?(i={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=i):(a=i.retryQueue,a===null?i.retryQueue=new Set([l]):a.add(l)),bd(e,l,h)),!1}throw Error(s(435,a.tag))}return bd(e,l,h),Ad(),!1}if(Bt)return i=Vn.current,i!==null?((i.flags&65536)===0&&(i.flags|=256),i.flags|=65536,i.lanes=h,l!==Tf&&(e=Error(s(422),{cause:l}),Yo(Nn(e,a)))):(l!==Tf&&(i=Error(s(423),{cause:l}),Yo(Nn(i,a))),e=e.current.alternate,e.flags|=65536,h&=-h,e.lanes|=h,l=Nn(l,a),h=Wf(e.stateNode,l,h),Of(e,h),oe!==4&&(oe=2)),!1;var d=Error(s(520),{cause:l});if(d=Nn(d,a),ml===null?ml=[d]:ml.push(d),oe!==4&&(oe=2),i===null)return!0;l=Nn(l,a),a=i;do{switch(a.tag){case 3:return a.flags|=65536,e=h&-h,a.lanes|=e,e=Wf(a.stateNode,l,e),Of(a,e),!1;case 1:if(i=a.type,d=a.stateNode,(a.flags&128)===0&&(typeof i.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(Rr===null||!Rr.has(d))))return a.flags|=65536,h&=-h,a.lanes|=h,h=z_(h),B_(h,e,a,l),Of(a,h),!1}a=a.return}while(a!==null);return!1}var j_=Error(s(461)),Oe=!1;function Ue(e,i,a,l){i.child=e===null?D_(i,null,a,l):Va(i,e.child,a,l)}function q_(e,i,a,l,h){a=a.render;var d=i.ref;if("ref"in l){var v={};for(var E in l)E!=="ref"&&(v[E]=l[E])}else v=l;return Ms(i),l=kf(e,i,a,v,d,h),E=xf(),e!==null&&!Oe?(Uf(e,i,h),Fi(e,i,h)):(Bt&&E&&yf(i),i.flags|=1,Ue(e,i,l,h),i.child)}function H_(e,i,a,l,h){if(e===null){var d=a.type;return typeof d=="function"&&!pf(d)&&d.defaultProps===void 0&&a.compare===null?(i.tag=15,i.type=d,F_(e,i,d,l,h)):(e=Hu(a.type,null,l,i,i.mode,h),e.ref=i.ref,e.return=i,i.child=e)}if(d=e.child,!ad(e,h)){var v=d.memoizedProps;if(a=a.compare,a=a!==null?a:Ho,a(v,l)&&e.ref===i.ref)return Fi(e,i,h)}return i.flags|=1,e=Ui(d,l),e.ref=i.ref,e.return=i,i.child=e}function F_(e,i,a,l,h){if(e!==null){var d=e.memoizedProps;if(Ho(d,l)&&e.ref===i.ref)if(Oe=!1,i.pendingProps=l=d,ad(e,h))(e.flags&131072)!==0&&(Oe=!0);else return i.lanes=e.lanes,Fi(e,i,h)}return Jf(e,i,a,l,h)}function G_(e,i,a){var l=i.pendingProps,h=l.children,d=e!==null?e.memoizedState:null;if(l.mode==="hidden"){if((i.flags&128)!==0){if(l=d!==null?d.baseLanes|a:a,e!==null){for(h=i.child=e.child,d=0;h!==null;)d=d|h.lanes|h.childLanes,h=h.sibling;i.childLanes=d&~l}else i.childLanes=0,i.child=null;return K_(e,i,l,a)}if((a&536870912)!==0)i.memoizedState={baseLanes:0,cachePool:null},e!==null&&Qu(i,d!==null?d.cachePool:null),d!==null?Fg(i,d):Mf(),M_(i);else return i.lanes=i.childLanes=536870912,K_(e,i,d!==null?d.baseLanes|a:a,a)}else d!==null?(Qu(i,d.cachePool),Fg(i,d),vr(),i.memoizedState=null):(e!==null&&Qu(i,null),Mf(),vr());return Ue(e,i,h,a),i.child}function K_(e,i,a,l){var h=If();return h=h===null?null:{parent:Ee._currentValue,pool:h},i.memoizedState={baseLanes:a,cachePool:h},e!==null&&Qu(i,null),Mf(),M_(i),e!==null&&Qo(e,i,l,!0),null}function hc(e,i){var a=i.ref;if(a===null)e!==null&&e.ref!==null&&(i.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(i.flags|=4194816)}}function Jf(e,i,a,l,h){return Ms(i),a=kf(e,i,a,l,void 0,h),l=xf(),e!==null&&!Oe?(Uf(e,i,h),Fi(e,i,h)):(Bt&&l&&yf(i),i.flags|=1,Ue(e,i,a,h),i.child)}function Y_(e,i,a,l,h,d){return Ms(i),i.updateQueue=null,a=Kg(i,l,a,h),Gg(e),l=xf(),e!==null&&!Oe?(Uf(e,i,d),Fi(e,i,d)):(Bt&&l&&yf(i),i.flags|=1,Ue(e,i,a,d),i.child)}function Q_(e,i,a,l,h){if(Ms(i),i.stateNode===null){var d=Sa,v=a.contextType;typeof v=="object"&&v!==null&&(d=Fe(v)),d=new a(l,d),i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,d.updater=Zf,i.stateNode=d,d._reactInternals=i,d=i.stateNode,d.props=l,d.state=i.memoizedState,d.refs={},Cf(i),v=a.contextType,d.context=typeof v=="object"&&v!==null?Fe(v):Sa,d.state=i.memoizedState,v=a.getDerivedStateFromProps,typeof v=="function"&&($f(i,a,v,l),d.state=i.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(v=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),v!==d.state&&Zf.enqueueReplaceState(d,d.state,null),el(i,l,d,h),tl(),d.state=i.memoizedState),typeof d.componentDidMount=="function"&&(i.flags|=4194308),l=!0}else if(e===null){d=i.stateNode;var E=i.memoizedProps,I=ks(a,E);d.props=I;var L=d.context,G=a.contextType;v=Sa,typeof G=="object"&&G!==null&&(v=Fe(G));var Q=a.getDerivedStateFromProps;G=typeof Q=="function"||typeof d.getSnapshotBeforeUpdate=="function",E=i.pendingProps!==E,G||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(E||L!==v)&&P_(i,d,l,v),mr=!1;var B=i.memoizedState;d.state=B,el(i,l,d,h),tl(),L=i.memoizedState,E||B!==L||mr?(typeof Q=="function"&&($f(i,a,Q,l),L=i.memoizedState),(I=mr||V_(i,a,I,l,B,L,v))?(G||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(i.flags|=4194308)):(typeof d.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=l,i.memoizedState=L),d.props=l,d.state=L,d.context=v,l=I):(typeof d.componentDidMount=="function"&&(i.flags|=4194308),l=!1)}else{d=i.stateNode,Nf(e,i),v=i.memoizedProps,G=ks(a,v),d.props=G,Q=i.pendingProps,B=d.context,L=a.contextType,I=Sa,typeof L=="object"&&L!==null&&(I=Fe(L)),E=a.getDerivedStateFromProps,(L=typeof E=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(v!==Q||B!==I)&&P_(i,d,l,I),mr=!1,B=i.memoizedState,d.state=B,el(i,l,d,h),tl();var j=i.memoizedState;v!==Q||B!==j||mr||e!==null&&e.dependencies!==null&&Ku(e.dependencies)?(typeof E=="function"&&($f(i,a,E,l),j=i.memoizedState),(G=mr||V_(i,a,G,l,B,j,I)||e!==null&&e.dependencies!==null&&Ku(e.dependencies))?(L||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(l,j,I),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(l,j,I)),typeof d.componentDidUpdate=="function"&&(i.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof d.componentDidUpdate!="function"||v===e.memoizedProps&&B===e.memoizedState||(i.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||v===e.memoizedProps&&B===e.memoizedState||(i.flags|=1024),i.memoizedProps=l,i.memoizedState=j),d.props=l,d.state=j,d.context=I,l=G):(typeof d.componentDidUpdate!="function"||v===e.memoizedProps&&B===e.memoizedState||(i.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||v===e.memoizedProps&&B===e.memoizedState||(i.flags|=1024),l=!1)}return d=l,hc(e,i),l=(i.flags&128)!==0,d||l?(d=i.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:d.render(),i.flags|=1,e!==null&&l?(i.child=Va(i,e.child,null,h),i.child=Va(i,null,a,h)):Ue(e,i,a,h),i.memoizedState=d.state,e=i.child):e=Fi(e,i,h),e}function X_(e,i,a,l){return Ko(),i.flags|=256,Ue(e,i,a,l),i.child}var td={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function ed(e){return{baseLanes:e,cachePool:xg()}}function nd(e,i,a){return e=e!==null?e.childLanes&~a:0,i&&(e|=Pn),e}function $_(e,i,a){var l=i.pendingProps,h=!1,d=(i.flags&128)!==0,v;if((v=d)||(v=e!==null&&e.memoizedState===null?!1:(Ae.current&2)!==0),v&&(h=!0,i.flags&=-129),v=(i.flags&32)!==0,i.flags&=-33,e===null){if(Bt){if(h?yr(i):vr(),Bt){var E=ae,I;if(I=E){t:{for(I=E,E=ci;I.nodeType!==8;){if(!E){E=null;break t}if(I=Gn(I.nextSibling),I===null){E=null;break t}}E=I}E!==null?(i.memoizedState={dehydrated:E,treeContext:ws!==null?{id:Li,overflow:zi}:null,retryLane:536870912,hydrationErrors:null},I=mn(18,null,null,0),I.stateNode=E,I.return=i,i.child=I,en=i,ae=null,I=!0):I=!1}I||Os(i)}if(E=i.memoizedState,E!==null&&(E=E.dehydrated,E!==null))return zd(E)?i.lanes=32:i.lanes=536870912,null;Hi(i)}return E=l.children,l=l.fallback,h?(vr(),h=i.mode,E=fc({mode:"hidden",children:E},h),l=Is(l,h,a,null),E.return=i,l.return=i,E.sibling=l,i.child=E,h=i.child,h.memoizedState=ed(a),h.childLanes=nd(e,v,a),i.memoizedState=td,l):(yr(i),id(i,E))}if(I=e.memoizedState,I!==null&&(E=I.dehydrated,E!==null)){if(d)i.flags&256?(yr(i),i.flags&=-257,i=rd(e,i,a)):i.memoizedState!==null?(vr(),i.child=e.child,i.flags|=128,i=null):(vr(),h=l.fallback,E=i.mode,l=fc({mode:"visible",children:l.children},E),h=Is(h,E,a,null),h.flags|=2,l.return=i,h.return=i,l.sibling=h,i.child=l,Va(i,e.child,null,a),l=i.child,l.memoizedState=ed(a),l.childLanes=nd(e,v,a),i.memoizedState=td,i=h);else if(yr(i),zd(E)){if(v=E.nextSibling&&E.nextSibling.dataset,v)var L=v.dgst;v=L,l=Error(s(419)),l.stack="",l.digest=v,Yo({value:l,source:null,stack:null}),i=rd(e,i,a)}else if(Oe||Qo(e,i,a,!1),v=(a&e.childLanes)!==0,Oe||v){if(v=Wt,v!==null&&(l=a&-a,l=(l&42)!==0?1:ar(l),l=(l&(v.suspendedLanes|a))!==0?0:l,l!==0&&l!==I.retryLane))throw I.retryLane=l,Aa(e,l),vn(v,e,l),j_;E.data==="$?"||Ad(),i=rd(e,i,a)}else E.data==="$?"?(i.flags|=192,i.child=e.child,i=null):(e=I.treeContext,ae=Gn(E.nextSibling),en=i,Bt=!0,Ns=null,ci=!1,e!==null&&(Dn[Mn++]=Li,Dn[Mn++]=zi,Dn[Mn++]=ws,Li=e.id,zi=e.overflow,ws=i),i=id(i,l.children),i.flags|=4096);return i}return h?(vr(),h=l.fallback,E=i.mode,I=e.child,L=I.sibling,l=Ui(I,{mode:"hidden",children:l.children}),l.subtreeFlags=I.subtreeFlags&65011712,L!==null?h=Ui(L,h):(h=Is(h,E,a,null),h.flags|=2),h.return=i,l.return=i,l.sibling=h,i.child=l,l=h,h=i.child,E=e.child.memoizedState,E===null?E=ed(a):(I=E.cachePool,I!==null?(L=Ee._currentValue,I=I.parent!==L?{parent:L,pool:L}:I):I=xg(),E={baseLanes:E.baseLanes|a,cachePool:I}),h.memoizedState=E,h.childLanes=nd(e,v,a),i.memoizedState=td,l):(yr(i),a=e.child,e=a.sibling,a=Ui(a,{mode:"visible",children:l.children}),a.return=i,a.sibling=null,e!==null&&(v=i.deletions,v===null?(i.deletions=[e],i.flags|=16):v.push(e)),i.child=a,i.memoizedState=null,a)}function id(e,i){return i=fc({mode:"visible",children:i},e.mode),i.return=e,e.child=i}function fc(e,i){return e=mn(22,e,null,i),e.lanes=0,e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null},e}function rd(e,i,a){return Va(i,e.child,null,a),e=id(i,i.pendingProps.children),e.flags|=2,i.memoizedState=null,e}function Z_(e,i,a){e.lanes|=i;var l=e.alternate;l!==null&&(l.lanes|=i),Af(e.return,i,a)}function sd(e,i,a,l,h){var d=e.memoizedState;d===null?e.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:h}:(d.isBackwards=i,d.rendering=null,d.renderingStartTime=0,d.last=l,d.tail=a,d.tailMode=h)}function W_(e,i,a){var l=i.pendingProps,h=l.revealOrder,d=l.tail;if(Ue(e,i,l.children,a),l=Ae.current,(l&2)!==0)l=l&1|2,i.flags|=128;else{if(e!==null&&(e.flags&128)!==0)t:for(e=i.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Z_(e,a,i);else if(e.tag===19)Z_(e,a,i);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===i)break t;for(;e.sibling===null;){if(e.return===null||e.return===i)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}l&=1}switch(J(Ae,l),h){case"forwards":for(a=i.child,h=null;a!==null;)e=a.alternate,e!==null&&lc(e)===null&&(h=a),a=a.sibling;a=h,a===null?(h=i.child,i.child=null):(h=a.sibling,a.sibling=null),sd(i,!1,h,a,d);break;case"backwards":for(a=null,h=i.child,i.child=null;h!==null;){if(e=h.alternate,e!==null&&lc(e)===null){i.child=h;break}e=h.sibling,h.sibling=a,a=h,h=e}sd(i,!0,a,null,d);break;case"together":sd(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Fi(e,i,a){if(e!==null&&(i.dependencies=e.dependencies),br|=i.lanes,(a&i.childLanes)===0)if(e!==null){if(Qo(e,i,a,!1),(a&i.childLanes)===0)return null}else return null;if(e!==null&&i.child!==e.child)throw Error(s(153));if(i.child!==null){for(e=i.child,a=Ui(e,e.pendingProps),i.child=a,a.return=i;e.sibling!==null;)e=e.sibling,a=a.sibling=Ui(e,e.pendingProps),a.return=i;a.sibling=null}return i.child}function ad(e,i){return(e.lanes&i)!==0?!0:(e=e.dependencies,!!(e!==null&&Ku(e)))}function Db(e,i,a){switch(i.tag){case 3:Zt(i,i.stateNode.containerInfo),dr(i,Ee,e.memoizedState.cache),Ko();break;case 27:case 5:sr(i);break;case 4:Zt(i,i.stateNode.containerInfo);break;case 10:dr(i,i.type,i.memoizedProps.value);break;case 13:var l=i.memoizedState;if(l!==null)return l.dehydrated!==null?(yr(i),i.flags|=128,null):(a&i.child.childLanes)!==0?$_(e,i,a):(yr(i),e=Fi(e,i,a),e!==null?e.sibling:null);yr(i);break;case 19:var h=(e.flags&128)!==0;if(l=(a&i.childLanes)!==0,l||(Qo(e,i,a,!1),l=(a&i.childLanes)!==0),h){if(l)return W_(e,i,a);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),J(Ae,Ae.current),l)break;return null;case 22:case 23:return i.lanes=0,G_(e,i,a);case 24:dr(i,Ee,e.memoizedState.cache)}return Fi(e,i,a)}function J_(e,i,a){if(e!==null)if(e.memoizedProps!==i.pendingProps)Oe=!0;else{if(!ad(e,a)&&(i.flags&128)===0)return Oe=!1,Db(e,i,a);Oe=(e.flags&131072)!==0}else Oe=!1,Bt&&(i.flags&1048576)!==0&&Ng(i,Gu,i.index);switch(i.lanes=0,i.tag){case 16:t:{e=i.pendingProps;var l=i.elementType,h=l._init;if(l=h(l._payload),i.type=l,typeof l=="function")pf(l)?(e=ks(l,e),i.tag=1,i=Q_(null,i,l,e,a)):(i.tag=0,i=Jf(null,i,l,e,a));else{if(l!=null){if(h=l.$$typeof,h===_t){i.tag=11,i=q_(null,i,l,e,a);break t}else if(h===M){i.tag=14,i=H_(null,i,l,e,a);break t}}throw i=Pe(l)||l,Error(s(306,i,""))}}return i;case 0:return Jf(e,i,i.type,i.pendingProps,a);case 1:return l=i.type,h=ks(l,i.pendingProps),Q_(e,i,l,h,a);case 3:t:{if(Zt(i,i.stateNode.containerInfo),e===null)throw Error(s(387));l=i.pendingProps;var d=i.memoizedState;h=d.element,Nf(e,i),el(i,l,null,a);var v=i.memoizedState;if(l=v.cache,dr(i,Ee,l),l!==d.cache&&Sf(i,[Ee],a,!0),tl(),l=v.element,d.isDehydrated)if(d={element:l,isDehydrated:!1,cache:v.cache},i.updateQueue.baseState=d,i.memoizedState=d,i.flags&256){i=X_(e,i,l,a);break t}else if(l!==h){h=Nn(Error(s(424)),i),Yo(h),i=X_(e,i,l,a);break t}else{switch(e=i.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(ae=Gn(e.firstChild),en=i,Bt=!0,Ns=null,ci=!0,a=D_(i,null,l,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(Ko(),l===h){i=Fi(e,i,a);break t}Ue(e,i,l,a)}i=i.child}return i;case 26:return hc(e,i),e===null?(a=iv(i.type,null,i.pendingProps,null))?i.memoizedState=a:Bt||(a=i.type,e=i.pendingProps,l=Ic(Et.current).createElement(a),l[ye]=i,l[de]=e,ze(l,a,e),ue(l),i.stateNode=l):i.memoizedState=iv(i.type,e.memoizedProps,i.pendingProps,e.memoizedState),null;case 27:return sr(i),e===null&&Bt&&(l=i.stateNode=tv(i.type,i.pendingProps,Et.current),en=i,ci=!0,h=ae,Cr(i.type)?(Bd=h,ae=Gn(l.firstChild)):ae=h),Ue(e,i,i.pendingProps.children,a),hc(e,i),e===null&&(i.flags|=4194304),i.child;case 5:return e===null&&Bt&&((h=l=ae)&&(l=s1(l,i.type,i.pendingProps,ci),l!==null?(i.stateNode=l,en=i,ae=Gn(l.firstChild),ci=!1,h=!0):h=!1),h||Os(i)),sr(i),h=i.type,d=i.pendingProps,v=e!==null?e.memoizedProps:null,l=d.children,xd(h,d)?l=null:v!==null&&xd(h,v)&&(i.flags|=32),i.memoizedState!==null&&(h=kf(e,i,Sb,null,null,a),Sl._currentValue=h),hc(e,i),Ue(e,i,l,a),i.child;case 6:return e===null&&Bt&&((e=a=ae)&&(a=a1(a,i.pendingProps,ci),a!==null?(i.stateNode=a,en=i,ae=null,e=!0):e=!1),e||Os(i)),null;case 13:return $_(e,i,a);case 4:return Zt(i,i.stateNode.containerInfo),l=i.pendingProps,e===null?i.child=Va(i,null,l,a):Ue(e,i,l,a),i.child;case 11:return q_(e,i,i.type,i.pendingProps,a);case 7:return Ue(e,i,i.pendingProps,a),i.child;case 8:return Ue(e,i,i.pendingProps.children,a),i.child;case 12:return Ue(e,i,i.pendingProps.children,a),i.child;case 10:return l=i.pendingProps,dr(i,i.type,l.value),Ue(e,i,l.children,a),i.child;case 9:return h=i.type._context,l=i.pendingProps.children,Ms(i),h=Fe(h),l=l(h),i.flags|=1,Ue(e,i,l,a),i.child;case 14:return H_(e,i,i.type,i.pendingProps,a);case 15:return F_(e,i,i.type,i.pendingProps,a);case 19:return W_(e,i,a);case 31:return l=i.pendingProps,a=i.mode,l={mode:l.mode,children:l.children},e===null?(a=fc(l,a),a.ref=i.ref,i.child=a,a.return=i,i=a):(a=Ui(e.child,l),a.ref=i.ref,i.child=a,a.return=i,i=a),i;case 22:return G_(e,i,a);case 24:return Ms(i),l=Fe(Ee),e===null?(h=If(),h===null&&(h=Wt,d=bf(),h.pooledCache=d,d.refCount++,d!==null&&(h.pooledCacheLanes|=a),h=d),i.memoizedState={parent:l,cache:h},Cf(i),dr(i,Ee,h)):((e.lanes&a)!==0&&(Nf(e,i),el(i,null,null,a),tl()),h=e.memoizedState,d=i.memoizedState,h.parent!==l?(h={parent:l,cache:l},i.memoizedState=h,i.lanes===0&&(i.memoizedState=i.updateQueue.baseState=h),dr(i,Ee,l)):(l=d.cache,dr(i,Ee,l),l!==h.cache&&Sf(i,[Ee],a,!0))),Ue(e,i,i.pendingProps.children,a),i.child;case 29:throw i.pendingProps}throw Error(s(156,i.tag))}function Gi(e){e.flags|=4}function ty(e,i){if(i.type!=="stylesheet"||(i.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!lv(i)){if(i=Vn.current,i!==null&&((xt&4194048)===xt?hi!==null:(xt&62914560)!==xt&&(xt&536870912)===0||i!==hi))throw Wo=wf,Ug;e.flags|=8192}}function dc(e,i){i!==null&&(e.flags|=4),e.flags&16384&&(i=e.tag!==22?Ro():536870912,e.lanes|=i,Ua|=i)}function ll(e,i){if(!Bt)switch(e.tailMode){case"hidden":i=e.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?i||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function ne(e){var i=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(i)for(var h=e.child;h!==null;)a|=h.lanes|h.childLanes,l|=h.subtreeFlags&65011712,l|=h.flags&65011712,h.return=e,h=h.sibling;else for(h=e.child;h!==null;)a|=h.lanes|h.childLanes,l|=h.subtreeFlags,l|=h.flags,h.return=e,h=h.sibling;return e.subtreeFlags|=l,e.childLanes=a,i}function Mb(e,i,a){var l=i.pendingProps;switch(vf(i),i.tag){case 31:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ne(i),null;case 1:return ne(i),null;case 3:return a=i.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),i.memoizedState.cache!==l&&(i.flags|=2048),ji(Ee),Wn(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Go(i)?Gi(i):e===null||e.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Mg())),ne(i),null;case 26:return a=i.memoizedState,e===null?(Gi(i),a!==null?(ne(i),ty(i,a)):(ne(i),i.flags&=-16777217)):a?a!==e.memoizedState?(Gi(i),ne(i),ty(i,a)):(ne(i),i.flags&=-16777217):(e.memoizedProps!==l&&Gi(i),ne(i),i.flags&=-16777217),null;case 27:bi(i),a=Et.current;var h=i.type;if(e!==null&&i.stateNode!=null)e.memoizedProps!==l&&Gi(i);else{if(!l){if(i.stateNode===null)throw Error(s(166));return ne(i),null}e=ct.current,Go(i)?Og(i):(e=tv(h,l,a),i.stateNode=e,Gi(i))}return ne(i),null;case 5:if(bi(i),a=i.type,e!==null&&i.stateNode!=null)e.memoizedProps!==l&&Gi(i);else{if(!l){if(i.stateNode===null)throw Error(s(166));return ne(i),null}if(e=ct.current,Go(i))Og(i);else{switch(h=Ic(Et.current),e){case 1:e=h.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:e=h.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":e=h.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":e=h.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":e=h.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild);break;case"select":e=typeof l.is=="string"?h.createElement("select",{is:l.is}):h.createElement("select"),l.multiple?e.multiple=!0:l.size&&(e.size=l.size);break;default:e=typeof l.is=="string"?h.createElement(a,{is:l.is}):h.createElement(a)}}e[ye]=i,e[de]=l;t:for(h=i.child;h!==null;){if(h.tag===5||h.tag===6)e.appendChild(h.stateNode);else if(h.tag!==4&&h.tag!==27&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===i)break t;for(;h.sibling===null;){if(h.return===null||h.return===i)break t;h=h.return}h.sibling.return=h.return,h=h.sibling}i.stateNode=e;t:switch(ze(e,a,l),a){case"button":case"input":case"select":case"textarea":e=!!l.autoFocus;break t;case"img":e=!0;break t;default:e=!1}e&&Gi(i)}}return ne(i),i.flags&=-16777217,null;case 6:if(e&&i.stateNode!=null)e.memoizedProps!==l&&Gi(i);else{if(typeof l!="string"&&i.stateNode===null)throw Error(s(166));if(e=Et.current,Go(i)){if(e=i.stateNode,a=i.memoizedProps,l=null,h=en,h!==null)switch(h.tag){case 27:case 5:l=h.memoizedProps}e[ye]=i,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||Yy(e.nodeValue,a)),e||Os(i)}else e=Ic(e).createTextNode(l),e[ye]=i,i.stateNode=e}return ne(i),null;case 13:if(l=i.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(h=Go(i),l!==null&&l.dehydrated!==null){if(e===null){if(!h)throw Error(s(318));if(h=i.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(s(317));h[ye]=i}else Ko(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;ne(i),h=!1}else h=Mg(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=h),h=!0;if(!h)return i.flags&256?(Hi(i),i):(Hi(i),null)}if(Hi(i),(i.flags&128)!==0)return i.lanes=a,i;if(a=l!==null,e=e!==null&&e.memoizedState!==null,a){l=i.child,h=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(h=l.alternate.memoizedState.cachePool.pool);var d=null;l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(d=l.memoizedState.cachePool.pool),d!==h&&(l.flags|=2048)}return a!==e&&a&&(i.child.flags|=8192),dc(i,i.updateQueue),ne(i),null;case 4:return Wn(),e===null&&Dd(i.stateNode.containerInfo),ne(i),null;case 10:return ji(i.type),ne(i),null;case 19:if(it(Ae),h=i.memoizedState,h===null)return ne(i),null;if(l=(i.flags&128)!==0,d=h.rendering,d===null)if(l)ll(h,!1);else{if(oe!==0||e!==null&&(e.flags&128)!==0)for(e=i.child;e!==null;){if(d=lc(e),d!==null){for(i.flags|=128,ll(h,!1),e=d.updateQueue,i.updateQueue=e,dc(i,e),i.subtreeFlags=0,e=a,a=i.child;a!==null;)Cg(a,e),a=a.sibling;return J(Ae,Ae.current&1|2),i.child}e=e.sibling}h.tail!==null&&Sn()>gc&&(i.flags|=128,l=!0,ll(h,!1),i.lanes=4194304)}else{if(!l)if(e=lc(d),e!==null){if(i.flags|=128,l=!0,e=e.updateQueue,i.updateQueue=e,dc(i,e),ll(h,!0),h.tail===null&&h.tailMode==="hidden"&&!d.alternate&&!Bt)return ne(i),null}else 2*Sn()-h.renderingStartTime>gc&&a!==536870912&&(i.flags|=128,l=!0,ll(h,!1),i.lanes=4194304);h.isBackwards?(d.sibling=i.child,i.child=d):(e=h.last,e!==null?e.sibling=d:i.child=d,h.last=d)}return h.tail!==null?(i=h.tail,h.rendering=i,h.tail=i.sibling,h.renderingStartTime=Sn(),i.sibling=null,e=Ae.current,J(Ae,l?e&1|2:e&1),i):(ne(i),null);case 22:case 23:return Hi(i),Vf(),l=i.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(i.flags|=8192):l&&(i.flags|=8192),l?(a&536870912)!==0&&(i.flags&128)===0&&(ne(i),i.subtreeFlags&6&&(i.flags|=8192)):ne(i),a=i.updateQueue,a!==null&&dc(i,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(l=i.memoizedState.cachePool.pool),l!==a&&(i.flags|=2048),e!==null&&it(Vs),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),i.memoizedState.cache!==a&&(i.flags|=2048),ji(Ee),ne(i),null;case 25:return null;case 30:return null}throw Error(s(156,i.tag))}function Vb(e,i){switch(vf(i),i.tag){case 1:return e=i.flags,e&65536?(i.flags=e&-65537|128,i):null;case 3:return ji(Ee),Wn(),e=i.flags,(e&65536)!==0&&(e&128)===0?(i.flags=e&-65537|128,i):null;case 26:case 27:case 5:return bi(i),null;case 13:if(Hi(i),e=i.memoizedState,e!==null&&e.dehydrated!==null){if(i.alternate===null)throw Error(s(340));Ko()}return e=i.flags,e&65536?(i.flags=e&-65537|128,i):null;case 19:return it(Ae),null;case 4:return Wn(),null;case 10:return ji(i.type),null;case 22:case 23:return Hi(i),Vf(),e!==null&&it(Vs),e=i.flags,e&65536?(i.flags=e&-65537|128,i):null;case 24:return ji(Ee),null;case 25:return null;default:return null}}function ey(e,i){switch(vf(i),i.tag){case 3:ji(Ee),Wn();break;case 26:case 27:case 5:bi(i);break;case 4:Wn();break;case 13:Hi(i);break;case 19:it(Ae);break;case 10:ji(i.type);break;case 22:case 23:Hi(i),Vf(),e!==null&&it(Vs);break;case 24:ji(Ee)}}function ul(e,i){try{var a=i.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var h=l.next;a=h;do{if((a.tag&e)===e){l=void 0;var d=a.create,v=a.inst;l=d(),v.destroy=l}a=a.next}while(a!==h)}}catch(E){$t(i,i.return,E)}}function Tr(e,i,a){try{var l=i.updateQueue,h=l!==null?l.lastEffect:null;if(h!==null){var d=h.next;l=d;do{if((l.tag&e)===e){var v=l.inst,E=v.destroy;if(E!==void 0){v.destroy=void 0,h=i;var I=a,L=E;try{L()}catch(G){$t(h,I,G)}}}l=l.next}while(l!==d)}}catch(G){$t(i,i.return,G)}}function ny(e){var i=e.updateQueue;if(i!==null){var a=e.stateNode;try{Hg(i,a)}catch(l){$t(e,e.return,l)}}}function iy(e,i,a){a.props=ks(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){$t(e,i,l)}}function cl(e,i){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(h){$t(e,i,h)}}function fi(e,i){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(h){$t(e,i,h)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(h){$t(e,i,h)}else a.current=null}function ry(e){var i=e.type,a=e.memoizedProps,l=e.stateNode;try{t:switch(i){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break t;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(h){$t(e,e.return,h)}}function od(e,i,a){try{var l=e.stateNode;t1(l,e.type,a,i),l[de]=i}catch(h){$t(e,e.return,h)}}function sy(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Cr(e.type)||e.tag===4}function ld(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||sy(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Cr(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ud(e,i,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,i?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,i):(i=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,i.appendChild(e),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Rc));else if(l!==4&&(l===27&&Cr(e.type)&&(a=e.stateNode,i=null),e=e.child,e!==null))for(ud(e,i,a),e=e.sibling;e!==null;)ud(e,i,a),e=e.sibling}function mc(e,i,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,i?a.insertBefore(e,i):a.appendChild(e);else if(l!==4&&(l===27&&Cr(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(mc(e,i,a),e=e.sibling;e!==null;)mc(e,i,a),e=e.sibling}function ay(e){var i=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,h=i.attributes;h.length;)i.removeAttributeNode(h[0]);ze(i,l,a),i[ye]=e,i[de]=a}catch(d){$t(e,e.return,d)}}var Ki=!1,he=!1,cd=!1,oy=typeof WeakSet=="function"?WeakSet:Set,De=null;function Pb(e,i){if(e=e.containerInfo,Pd=Mc,e=yg(e),lf(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var h=l.anchorOffset,d=l.focusNode;l=l.focusOffset;try{a.nodeType,d.nodeType}catch{a=null;break t}var v=0,E=-1,I=-1,L=0,G=0,Q=e,B=null;e:for(;;){for(var j;Q!==a||h!==0&&Q.nodeType!==3||(E=v+h),Q!==d||l!==0&&Q.nodeType!==3||(I=v+l),Q.nodeType===3&&(v+=Q.nodeValue.length),(j=Q.firstChild)!==null;)B=Q,Q=j;for(;;){if(Q===e)break e;if(B===a&&++L===h&&(E=v),B===d&&++G===l&&(I=v),(j=Q.nextSibling)!==null)break;Q=B,B=Q.parentNode}Q=j}a=E===-1||I===-1?null:{start:E,end:I}}else a=null}a=a||{start:0,end:0}}else a=null;for(kd={focusedElem:e,selectionRange:a},Mc=!1,De=i;De!==null;)if(i=De,e=i.child,(i.subtreeFlags&1024)!==0&&e!==null)e.return=i,De=e;else for(;De!==null;){switch(i=De,d=i.alternate,e=i.flags,i.tag){case 0:break;case 11:case 15:break;case 1:if((e&1024)!==0&&d!==null){e=void 0,a=i,h=d.memoizedProps,d=d.memoizedState,l=a.stateNode;try{var yt=ks(a.type,h,a.elementType===a.type);e=l.getSnapshotBeforeUpdate(yt,d),l.__reactInternalSnapshotBeforeUpdate=e}catch(ft){$t(a,a.return,ft)}}break;case 3:if((e&1024)!==0){if(e=i.stateNode.containerInfo,a=e.nodeType,a===9)Ld(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Ld(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=i.sibling,e!==null){e.return=i.return,De=e;break}De=i.return}}function ly(e,i,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:Er(e,a),l&4&&ul(5,a);break;case 1:if(Er(e,a),l&4)if(e=a.stateNode,i===null)try{e.componentDidMount()}catch(v){$t(a,a.return,v)}else{var h=ks(a.type,i.memoizedProps);i=i.memoizedState;try{e.componentDidUpdate(h,i,e.__reactInternalSnapshotBeforeUpdate)}catch(v){$t(a,a.return,v)}}l&64&&ny(a),l&512&&cl(a,a.return);break;case 3:if(Er(e,a),l&64&&(e=a.updateQueue,e!==null)){if(i=null,a.child!==null)switch(a.child.tag){case 27:case 5:i=a.child.stateNode;break;case 1:i=a.child.stateNode}try{Hg(e,i)}catch(v){$t(a,a.return,v)}}break;case 27:i===null&&l&4&&ay(a);case 26:case 5:Er(e,a),i===null&&l&4&&ry(a),l&512&&cl(a,a.return);break;case 12:Er(e,a);break;case 13:Er(e,a),l&4&&hy(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Hb.bind(null,a),o1(e,a))));break;case 22:if(l=a.memoizedState!==null||Ki,!l){i=i!==null&&i.memoizedState!==null||he,h=Ki;var d=he;Ki=l,(he=i)&&!d?Ar(e,a,(a.subtreeFlags&8772)!==0):Er(e,a),Ki=h,he=d}break;case 30:break;default:Er(e,a)}}function uy(e){var i=e.alternate;i!==null&&(e.alternate=null,uy(i)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(i=e.stateNode,i!==null&&ur(i)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var te=null,an=!1;function Yi(e,i,a){for(a=a.child;a!==null;)cy(e,i,a),a=a.sibling}function cy(e,i,a){if(Ht&&typeof Ht.onCommitFiberUnmount=="function")try{Ht.onCommitFiberUnmount(se,a)}catch{}switch(a.tag){case 26:he||fi(a,i),Yi(e,i,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:he||fi(a,i);var l=te,h=an;Cr(a.type)&&(te=a.stateNode,an=!1),Yi(e,i,a),vl(a.stateNode),te=l,an=h;break;case 5:he||fi(a,i);case 6:if(l=te,h=an,te=null,Yi(e,i,a),te=l,an=h,te!==null)if(an)try{(te.nodeType===9?te.body:te.nodeName==="HTML"?te.ownerDocument.body:te).removeChild(a.stateNode)}catch(d){$t(a,i,d)}else try{te.removeChild(a.stateNode)}catch(d){$t(a,i,d)}break;case 18:te!==null&&(an?(e=te,Wy(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),wl(e)):Wy(te,a.stateNode));break;case 4:l=te,h=an,te=a.stateNode.containerInfo,an=!0,Yi(e,i,a),te=l,an=h;break;case 0:case 11:case 14:case 15:he||Tr(2,a,i),he||Tr(4,a,i),Yi(e,i,a);break;case 1:he||(fi(a,i),l=a.stateNode,typeof l.componentWillUnmount=="function"&&iy(a,i,l)),Yi(e,i,a);break;case 21:Yi(e,i,a);break;case 22:he=(l=he)||a.memoizedState!==null,Yi(e,i,a),he=l;break;default:Yi(e,i,a)}}function hy(e,i){if(i.memoizedState===null&&(e=i.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{wl(e)}catch(a){$t(i,i.return,a)}}function kb(e){switch(e.tag){case 13:case 19:var i=e.stateNode;return i===null&&(i=e.stateNode=new oy),i;case 22:return e=e.stateNode,i=e._retryCache,i===null&&(i=e._retryCache=new oy),i;default:throw Error(s(435,e.tag))}}function hd(e,i){var a=kb(e);i.forEach(function(l){var h=Fb.bind(null,e,l);a.has(l)||(a.add(l),l.then(h,h))})}function pn(e,i){var a=i.deletions;if(a!==null)for(var l=0;l<a.length;l++){var h=a[l],d=e,v=i,E=v;t:for(;E!==null;){switch(E.tag){case 27:if(Cr(E.type)){te=E.stateNode,an=!1;break t}break;case 5:te=E.stateNode,an=!1;break t;case 3:case 4:te=E.stateNode.containerInfo,an=!0;break t}E=E.return}if(te===null)throw Error(s(160));cy(d,v,h),te=null,an=!1,d=h.alternate,d!==null&&(d.return=null),h.return=null}if(i.subtreeFlags&13878)for(i=i.child;i!==null;)fy(i,e),i=i.sibling}var Fn=null;function fy(e,i){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:pn(i,e),gn(e),l&4&&(Tr(3,e,e.return),ul(3,e),Tr(5,e,e.return));break;case 1:pn(i,e),gn(e),l&512&&(he||a===null||fi(a,a.return)),l&64&&Ki&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var h=Fn;if(pn(i,e),gn(e),l&512&&(he||a===null||fi(a,a.return)),l&4){var d=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){t:{l=e.type,a=e.memoizedProps,h=h.ownerDocument||h;e:switch(l){case"title":d=h.getElementsByTagName("title")[0],(!d||d[cs]||d[ye]||d.namespaceURI==="http://www.w3.org/2000/svg"||d.hasAttribute("itemprop"))&&(d=h.createElement(l),h.head.insertBefore(d,h.querySelector("head > title"))),ze(d,l,a),d[ye]=e,ue(d),l=d;break t;case"link":var v=av("link","href",h).get(l+(a.href||""));if(v){for(var E=0;E<v.length;E++)if(d=v[E],d.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&d.getAttribute("rel")===(a.rel==null?null:a.rel)&&d.getAttribute("title")===(a.title==null?null:a.title)&&d.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){v.splice(E,1);break e}}d=h.createElement(l),ze(d,l,a),h.head.appendChild(d);break;case"meta":if(v=av("meta","content",h).get(l+(a.content||""))){for(E=0;E<v.length;E++)if(d=v[E],d.getAttribute("content")===(a.content==null?null:""+a.content)&&d.getAttribute("name")===(a.name==null?null:a.name)&&d.getAttribute("property")===(a.property==null?null:a.property)&&d.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&d.getAttribute("charset")===(a.charSet==null?null:a.charSet)){v.splice(E,1);break e}}d=h.createElement(l),ze(d,l,a),h.head.appendChild(d);break;default:throw Error(s(468,l))}d[ye]=e,ue(d),l=d}e.stateNode=l}else ov(h,e.type,e.stateNode);else e.stateNode=sv(h,l,e.memoizedProps);else d!==l?(d===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):d.count--,l===null?ov(h,e.type,e.stateNode):sv(h,l,e.memoizedProps)):l===null&&e.stateNode!==null&&od(e,e.memoizedProps,a.memoizedProps)}break;case 27:pn(i,e),gn(e),l&512&&(he||a===null||fi(a,a.return)),a!==null&&l&4&&od(e,e.memoizedProps,a.memoizedProps);break;case 5:if(pn(i,e),gn(e),l&512&&(he||a===null||fi(a,a.return)),e.flags&32){h=e.stateNode;try{Rn(h,"")}catch(j){$t(e,e.return,j)}}l&4&&e.stateNode!=null&&(h=e.memoizedProps,od(e,h,a!==null?a.memoizedProps:h)),l&1024&&(cd=!0);break;case 6:if(pn(i,e),gn(e),l&4){if(e.stateNode===null)throw Error(s(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(j){$t(e,e.return,j)}}break;case 3:if(Nc=null,h=Fn,Fn=wc(i.containerInfo),pn(i,e),Fn=h,gn(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{wl(i.containerInfo)}catch(j){$t(e,e.return,j)}cd&&(cd=!1,dy(e));break;case 4:l=Fn,Fn=wc(e.stateNode.containerInfo),pn(i,e),gn(e),Fn=l;break;case 12:pn(i,e),gn(e);break;case 13:pn(i,e),gn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(_d=Sn()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,hd(e,l)));break;case 22:h=e.memoizedState!==null;var I=a!==null&&a.memoizedState!==null,L=Ki,G=he;if(Ki=L||h,he=G||I,pn(i,e),he=G,Ki=L,gn(e),l&8192)t:for(i=e.stateNode,i._visibility=h?i._visibility&-2:i._visibility|1,h&&(a===null||I||Ki||he||xs(e)),a=null,i=e;;){if(i.tag===5||i.tag===26){if(a===null){I=a=i;try{if(d=I.stateNode,h)v=d.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none";else{E=I.stateNode;var Q=I.memoizedProps.style,B=Q!=null&&Q.hasOwnProperty("display")?Q.display:null;E.style.display=B==null||typeof B=="boolean"?"":(""+B).trim()}}catch(j){$t(I,I.return,j)}}}else if(i.tag===6){if(a===null){I=i;try{I.stateNode.nodeValue=h?"":I.memoizedProps}catch(j){$t(I,I.return,j)}}}else if((i.tag!==22&&i.tag!==23||i.memoizedState===null||i===e)&&i.child!==null){i.child.return=i,i=i.child;continue}if(i===e)break t;for(;i.sibling===null;){if(i.return===null||i.return===e)break t;a===i&&(a=null),i=i.return}a===i&&(a=null),i.sibling.return=i.return,i=i.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,hd(e,a))));break;case 19:pn(i,e),gn(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,hd(e,l)));break;case 30:break;case 21:break;default:pn(i,e),gn(e)}}function gn(e){var i=e.flags;if(i&2){try{for(var a,l=e.return;l!==null;){if(sy(l)){a=l;break}l=l.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var h=a.stateNode,d=ld(e);mc(e,d,h);break;case 5:var v=a.stateNode;a.flags&32&&(Rn(v,""),a.flags&=-33);var E=ld(e);mc(e,E,v);break;case 3:case 4:var I=a.stateNode.containerInfo,L=ld(e);ud(e,L,I);break;default:throw Error(s(161))}}catch(G){$t(e,e.return,G)}e.flags&=-3}i&4096&&(e.flags&=-4097)}function dy(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var i=e;dy(i),i.tag===5&&i.flags&1024&&i.stateNode.reset(),e=e.sibling}}function Er(e,i){if(i.subtreeFlags&8772)for(i=i.child;i!==null;)ly(e,i.alternate,i),i=i.sibling}function xs(e){for(e=e.child;e!==null;){var i=e;switch(i.tag){case 0:case 11:case 14:case 15:Tr(4,i,i.return),xs(i);break;case 1:fi(i,i.return);var a=i.stateNode;typeof a.componentWillUnmount=="function"&&iy(i,i.return,a),xs(i);break;case 27:vl(i.stateNode);case 26:case 5:fi(i,i.return),xs(i);break;case 22:i.memoizedState===null&&xs(i);break;case 30:xs(i);break;default:xs(i)}e=e.sibling}}function Ar(e,i,a){for(a=a&&(i.subtreeFlags&8772)!==0,i=i.child;i!==null;){var l=i.alternate,h=e,d=i,v=d.flags;switch(d.tag){case 0:case 11:case 15:Ar(h,d,a),ul(4,d);break;case 1:if(Ar(h,d,a),l=d,h=l.stateNode,typeof h.componentDidMount=="function")try{h.componentDidMount()}catch(L){$t(l,l.return,L)}if(l=d,h=l.updateQueue,h!==null){var E=l.stateNode;try{var I=h.shared.hiddenCallbacks;if(I!==null)for(h.shared.hiddenCallbacks=null,h=0;h<I.length;h++)qg(I[h],E)}catch(L){$t(l,l.return,L)}}a&&v&64&&ny(d),cl(d,d.return);break;case 27:ay(d);case 26:case 5:Ar(h,d,a),a&&l===null&&v&4&&ry(d),cl(d,d.return);break;case 12:Ar(h,d,a);break;case 13:Ar(h,d,a),a&&v&4&&hy(h,d);break;case 22:d.memoizedState===null&&Ar(h,d,a),cl(d,d.return);break;case 30:break;default:Ar(h,d,a)}i=i.sibling}}function fd(e,i){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(e=i.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&Xo(a))}function dd(e,i){e=null,i.alternate!==null&&(e=i.alternate.memoizedState.cache),i=i.memoizedState.cache,i!==e&&(i.refCount++,e!=null&&Xo(e))}function di(e,i,a,l){if(i.subtreeFlags&10256)for(i=i.child;i!==null;)my(e,i,a,l),i=i.sibling}function my(e,i,a,l){var h=i.flags;switch(i.tag){case 0:case 11:case 15:di(e,i,a,l),h&2048&&ul(9,i);break;case 1:di(e,i,a,l);break;case 3:di(e,i,a,l),h&2048&&(e=null,i.alternate!==null&&(e=i.alternate.memoizedState.cache),i=i.memoizedState.cache,i!==e&&(i.refCount++,e!=null&&Xo(e)));break;case 12:if(h&2048){di(e,i,a,l),e=i.stateNode;try{var d=i.memoizedProps,v=d.id,E=d.onPostCommit;typeof E=="function"&&E(v,i.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(I){$t(i,i.return,I)}}else di(e,i,a,l);break;case 13:di(e,i,a,l);break;case 23:break;case 22:d=i.stateNode,v=i.alternate,i.memoizedState!==null?d._visibility&2?di(e,i,a,l):hl(e,i):d._visibility&2?di(e,i,a,l):(d._visibility|=2,Pa(e,i,a,l,(i.subtreeFlags&10256)!==0)),h&2048&&fd(v,i);break;case 24:di(e,i,a,l),h&2048&&dd(i.alternate,i);break;default:di(e,i,a,l)}}function Pa(e,i,a,l,h){for(h=h&&(i.subtreeFlags&10256)!==0,i=i.child;i!==null;){var d=e,v=i,E=a,I=l,L=v.flags;switch(v.tag){case 0:case 11:case 15:Pa(d,v,E,I,h),ul(8,v);break;case 23:break;case 22:var G=v.stateNode;v.memoizedState!==null?G._visibility&2?Pa(d,v,E,I,h):hl(d,v):(G._visibility|=2,Pa(d,v,E,I,h)),h&&L&2048&&fd(v.alternate,v);break;case 24:Pa(d,v,E,I,h),h&&L&2048&&dd(v.alternate,v);break;default:Pa(d,v,E,I,h)}i=i.sibling}}function hl(e,i){if(i.subtreeFlags&10256)for(i=i.child;i!==null;){var a=e,l=i,h=l.flags;switch(l.tag){case 22:hl(a,l),h&2048&&fd(l.alternate,l);break;case 24:hl(a,l),h&2048&&dd(l.alternate,l);break;default:hl(a,l)}i=i.sibling}}var fl=8192;function ka(e){if(e.subtreeFlags&fl)for(e=e.child;e!==null;)py(e),e=e.sibling}function py(e){switch(e.tag){case 26:ka(e),e.flags&fl&&e.memoizedState!==null&&T1(Fn,e.memoizedState,e.memoizedProps);break;case 5:ka(e);break;case 3:case 4:var i=Fn;Fn=wc(e.stateNode.containerInfo),ka(e),Fn=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=fl,fl=16777216,ka(e),fl=i):ka(e));break;default:ka(e)}}function gy(e){var i=e.alternate;if(i!==null&&(e=i.child,e!==null)){i.child=null;do i=e.sibling,e.sibling=null,e=i;while(e!==null)}}function dl(e){var i=e.deletions;if((e.flags&16)!==0){if(i!==null)for(var a=0;a<i.length;a++){var l=i[a];De=l,yy(l,e)}gy(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)_y(e),e=e.sibling}function _y(e){switch(e.tag){case 0:case 11:case 15:dl(e),e.flags&2048&&Tr(9,e,e.return);break;case 3:dl(e);break;case 12:dl(e);break;case 22:var i=e.stateNode;e.memoizedState!==null&&i._visibility&2&&(e.return===null||e.return.tag!==13)?(i._visibility&=-3,pc(e)):dl(e);break;default:dl(e)}}function pc(e){var i=e.deletions;if((e.flags&16)!==0){if(i!==null)for(var a=0;a<i.length;a++){var l=i[a];De=l,yy(l,e)}gy(e)}for(e=e.child;e!==null;){switch(i=e,i.tag){case 0:case 11:case 15:Tr(8,i,i.return),pc(i);break;case 22:a=i.stateNode,a._visibility&2&&(a._visibility&=-3,pc(i));break;default:pc(i)}e=e.sibling}}function yy(e,i){for(;De!==null;){var a=De;switch(a.tag){case 0:case 11:case 15:Tr(8,a,i);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Xo(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,De=l;else t:for(a=e;De!==null;){l=De;var h=l.sibling,d=l.return;if(uy(l),l===a){De=null;break t}if(h!==null){h.return=d,De=h;break t}De=d}}}var xb={getCacheForType:function(e){var i=Fe(Ee),a=i.data.get(e);return a===void 0&&(a=e(),i.data.set(e,a)),a}},Ub=typeof WeakMap=="function"?WeakMap:Map,Ft=0,Wt=null,Ot=null,xt=0,Gt=0,_n=null,Sr=!1,xa=!1,md=!1,Qi=0,oe=0,br=0,Us=0,pd=0,Pn=0,Ua=0,ml=null,on=null,gd=!1,_d=0,gc=1/0,_c=null,Rr=null,Le=0,Ir=null,La=null,za=0,yd=0,vd=null,vy=null,pl=0,Td=null;function yn(){if((Ft&2)!==0&&xt!==0)return xt&-xt;if(F.T!==null){var e=Ia;return e!==0?e:wd()}return or()}function Ty(){Pn===0&&(Pn=(xt&536870912)===0||Bt?bo():536870912);var e=Vn.current;return e!==null&&(e.flags|=32),Pn}function vn(e,i,a){(e===Wt&&(Gt===2||Gt===9)||e.cancelPendingCommit!==null)&&(Ba(e,0),wr(e,xt,Pn,!1)),Ii(e,a),((Ft&2)===0||e!==Wt)&&(e===Wt&&((Ft&2)===0&&(Us|=a),oe===4&&wr(e,xt,Pn,!1)),mi(e))}function Ey(e,i,a){if((Ft&6)!==0)throw Error(s(327));var l=!a&&(i&124)===0&&(i&e.expiredLanes)===0||us(e,i),h=l?Bb(e,i):Sd(e,i,!0),d=l;do{if(h===0){xa&&!l&&wr(e,i,0,!1);break}else{if(a=e.current.alternate,d&&!Lb(a)){h=Sd(e,i,!1),d=!1;continue}if(h===2){if(d=i,e.errorRecoveryDisabledLanes&d)var v=0;else v=e.pendingLanes&-536870913,v=v!==0?v:v&536870912?536870912:0;if(v!==0){i=v;t:{var E=e;h=ml;var I=E.current.memoizedState.isDehydrated;if(I&&(Ba(E,v).flags|=256),v=Sd(E,v,!1),v!==2){if(md&&!I){E.errorRecoveryDisabledLanes|=d,Us|=d,h=4;break t}d=on,on=h,d!==null&&(on===null?on=d:on.push.apply(on,d))}h=v}if(d=!1,h!==2)continue}}if(h===1){Ba(e,0),wr(e,i,0,!0);break}t:{switch(l=e,d=h,d){case 0:case 1:throw Error(s(345));case 4:if((i&4194048)!==i)break;case 6:wr(l,i,Pn,!Sr);break t;case 2:on=null;break;case 3:case 5:break;default:throw Error(s(329))}if((i&62914560)===i&&(h=_d+300-Sn(),10<h)){if(wr(l,i,Pn,!Sr),ia(l,0,!0)!==0)break t;l.timeoutHandle=$y(Ay.bind(null,l,a,on,_c,gd,i,Pn,Us,Ua,Sr,d,2,-0,0),h);break t}Ay(l,a,on,_c,gd,i,Pn,Us,Ua,Sr,d,0,-0,0)}}break}while(!0);mi(e)}function Ay(e,i,a,l,h,d,v,E,I,L,G,Q,B,j){if(e.timeoutHandle=-1,Q=i.subtreeFlags,(Q&8192||(Q&16785408)===16785408)&&(Al={stylesheets:null,count:0,unsuspend:v1},py(i),Q=E1(),Q!==null)){e.cancelPendingCommit=Q(Ny.bind(null,e,i,d,a,l,h,v,E,I,G,1,B,j)),wr(e,d,v,!L);return}Ny(e,i,d,a,l,h,v,E,I)}function Lb(e){for(var i=e;;){var a=i.tag;if((a===0||a===11||a===15)&&i.flags&16384&&(a=i.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var h=a[l],d=h.getSnapshot;h=h.value;try{if(!dn(d(),h))return!1}catch{return!1}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===e)break;for(;i.sibling===null;){if(i.return===null||i.return===e)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function wr(e,i,a,l){i&=~pd,i&=~Us,e.suspendedLanes|=i,e.pingedLanes&=~i,l&&(e.warmLanes|=i),l=e.expirationTimes;for(var h=i;0<h;){var d=31-He(h),v=1<<d;l[d]=-1,h&=~v}a!==0&&Jn(e,a,i)}function yc(){return(Ft&6)===0?(gl(0),!1):!0}function Ed(){if(Ot!==null){if(Gt===0)var e=Ot.return;else e=Ot,Bi=Ds=null,Lf(e),Ma=null,al=0,e=Ot;for(;e!==null;)ey(e.alternate,e),e=e.return;Ot=null}}function Ba(e,i){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,n1(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),Ed(),Wt=e,Ot=a=Ui(e.current,null),xt=i,Gt=0,_n=null,Sr=!1,xa=us(e,i),md=!1,Ua=Pn=pd=Us=br=oe=0,on=ml=null,gd=!1,(i&8)!==0&&(i|=i&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=i;0<l;){var h=31-He(l),d=1<<h;i|=e[h],l&=~d}return Qi=i,Bu(),a}function Sy(e,i){It=null,F.H=sc,i===Zo||i===Xu?(i=Bg(),Gt=3):i===Ug?(i=Bg(),Gt=4):Gt=i===j_?8:i!==null&&typeof i=="object"&&typeof i.then=="function"?6:1,_n=i,Ot===null&&(oe=1,cc(e,Nn(i,e.current)))}function by(){var e=F.H;return F.H=sc,e===null?sc:e}function Ry(){var e=F.A;return F.A=xb,e}function Ad(){oe=4,Sr||(xt&4194048)!==xt&&Vn.current!==null||(xa=!0),(br&134217727)===0&&(Us&134217727)===0||Wt===null||wr(Wt,xt,Pn,!1)}function Sd(e,i,a){var l=Ft;Ft|=2;var h=by(),d=Ry();(Wt!==e||xt!==i)&&(_c=null,Ba(e,i)),i=!1;var v=oe;t:do try{if(Gt!==0&&Ot!==null){var E=Ot,I=_n;switch(Gt){case 8:Ed(),v=6;break t;case 3:case 2:case 9:case 6:Vn.current===null&&(i=!0);var L=Gt;if(Gt=0,_n=null,ja(e,E,I,L),a&&xa){v=0;break t}break;default:L=Gt,Gt=0,_n=null,ja(e,E,I,L)}}zb(),v=oe;break}catch(G){Sy(e,G)}while(!0);return i&&e.shellSuspendCounter++,Bi=Ds=null,Ft=l,F.H=h,F.A=d,Ot===null&&(Wt=null,xt=0,Bu()),v}function zb(){for(;Ot!==null;)Iy(Ot)}function Bb(e,i){var a=Ft;Ft|=2;var l=by(),h=Ry();Wt!==e||xt!==i?(_c=null,gc=Sn()+500,Ba(e,i)):xa=us(e,i);t:do try{if(Gt!==0&&Ot!==null){i=Ot;var d=_n;e:switch(Gt){case 1:Gt=0,_n=null,ja(e,i,d,1);break;case 2:case 9:if(Lg(d)){Gt=0,_n=null,wy(i);break}i=function(){Gt!==2&&Gt!==9||Wt!==e||(Gt=7),mi(e)},d.then(i,i);break t;case 3:Gt=7;break t;case 4:Gt=5;break t;case 7:Lg(d)?(Gt=0,_n=null,wy(i)):(Gt=0,_n=null,ja(e,i,d,7));break;case 5:var v=null;switch(Ot.tag){case 26:v=Ot.memoizedState;case 5:case 27:var E=Ot;if(!v||lv(v)){Gt=0,_n=null;var I=E.sibling;if(I!==null)Ot=I;else{var L=E.return;L!==null?(Ot=L,vc(L)):Ot=null}break e}}Gt=0,_n=null,ja(e,i,d,5);break;case 6:Gt=0,_n=null,ja(e,i,d,6);break;case 8:Ed(),oe=6;break t;default:throw Error(s(462))}}jb();break}catch(G){Sy(e,G)}while(!0);return Bi=Ds=null,F.H=l,F.A=h,Ft=a,Ot!==null?0:(Wt=null,xt=0,Bu(),oe)}function jb(){for(;Ot!==null&&!To();)Iy(Ot)}function Iy(e){var i=J_(e.alternate,e,Qi);e.memoizedProps=e.pendingProps,i===null?vc(e):Ot=i}function wy(e){var i=e,a=i.alternate;switch(i.tag){case 15:case 0:i=Y_(a,i,i.pendingProps,i.type,void 0,xt);break;case 11:i=Y_(a,i,i.pendingProps,i.type.render,i.ref,xt);break;case 5:Lf(i);default:ey(a,i),i=Ot=Cg(i,Qi),i=J_(a,i,Qi)}e.memoizedProps=e.pendingProps,i===null?vc(e):Ot=i}function ja(e,i,a,l){Bi=Ds=null,Lf(i),Ma=null,al=0;var h=i.return;try{if(Ob(e,h,i,a,xt)){oe=1,cc(e,Nn(a,e.current)),Ot=null;return}}catch(d){if(h!==null)throw Ot=h,d;oe=1,cc(e,Nn(a,e.current)),Ot=null;return}i.flags&32768?(Bt||l===1?e=!0:xa||(xt&536870912)!==0?e=!1:(Sr=e=!0,(l===2||l===9||l===3||l===6)&&(l=Vn.current,l!==null&&l.tag===13&&(l.flags|=16384))),Cy(i,e)):vc(i)}function vc(e){var i=e;do{if((i.flags&32768)!==0){Cy(i,Sr);return}e=i.return;var a=Mb(i.alternate,i,Qi);if(a!==null){Ot=a;return}if(i=i.sibling,i!==null){Ot=i;return}Ot=i=e}while(i!==null);oe===0&&(oe=5)}function Cy(e,i){do{var a=Vb(e.alternate,e);if(a!==null){a.flags&=32767,Ot=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!i&&(e=e.sibling,e!==null)){Ot=e;return}Ot=e=a}while(e!==null);oe=6,Ot=null}function Ny(e,i,a,l,h,d,v,E,I){e.cancelPendingCommit=null;do Tc();while(Le!==0);if((Ft&6)!==0)throw Error(s(327));if(i!==null){if(i===e.current)throw Error(s(177));if(d=i.lanes|i.childLanes,d|=df,Io(e,a,d,v,E,I),e===Wt&&(Ot=Wt=null,xt=0),La=i,Ir=e,za=a,yd=d,vd=h,vy=l,(i.subtreeFlags&10256)!==0||(i.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Gb(ss,function(){return Py(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(i.flags&13878)!==0,(i.subtreeFlags&13878)!==0||l){l=F.T,F.T=null,h=nt.p,nt.p=2,v=Ft,Ft|=4;try{Pb(e,i,a)}finally{Ft=v,nt.p=h,F.T=l}}Le=1,Oy(),Dy(),My()}}function Oy(){if(Le===1){Le=0;var e=Ir,i=La,a=(i.flags&13878)!==0;if((i.subtreeFlags&13878)!==0||a){a=F.T,F.T=null;var l=nt.p;nt.p=2;var h=Ft;Ft|=4;try{fy(i,e);var d=kd,v=yg(e.containerInfo),E=d.focusedElem,I=d.selectionRange;if(v!==E&&E&&E.ownerDocument&&_g(E.ownerDocument.documentElement,E)){if(I!==null&&lf(E)){var L=I.start,G=I.end;if(G===void 0&&(G=L),"selectionStart"in E)E.selectionStart=L,E.selectionEnd=Math.min(G,E.value.length);else{var Q=E.ownerDocument||document,B=Q&&Q.defaultView||window;if(B.getSelection){var j=B.getSelection(),yt=E.textContent.length,ft=Math.min(I.start,yt),Xt=I.end===void 0?ft:Math.min(I.end,yt);!j.extend&&ft>Xt&&(v=Xt,Xt=ft,ft=v);var P=gg(E,ft),O=gg(E,Xt);if(P&&O&&(j.rangeCount!==1||j.anchorNode!==P.node||j.anchorOffset!==P.offset||j.focusNode!==O.node||j.focusOffset!==O.offset)){var U=Q.createRange();U.setStart(P.node,P.offset),j.removeAllRanges(),ft>Xt?(j.addRange(U),j.extend(O.node,O.offset)):(U.setEnd(O.node,O.offset),j.addRange(U))}}}}for(Q=[],j=E;j=j.parentNode;)j.nodeType===1&&Q.push({element:j,left:j.scrollLeft,top:j.scrollTop});for(typeof E.focus=="function"&&E.focus(),E=0;E<Q.length;E++){var K=Q[E];K.element.scrollLeft=K.left,K.element.scrollTop=K.top}}Mc=!!Pd,kd=Pd=null}finally{Ft=h,nt.p=l,F.T=a}}e.current=i,Le=2}}function Dy(){if(Le===2){Le=0;var e=Ir,i=La,a=(i.flags&8772)!==0;if((i.subtreeFlags&8772)!==0||a){a=F.T,F.T=null;var l=nt.p;nt.p=2;var h=Ft;Ft|=4;try{ly(e,i.alternate,i)}finally{Ft=h,nt.p=l,F.T=a}}Le=3}}function My(){if(Le===4||Le===3){Le=0,pu();var e=Ir,i=La,a=za,l=vy;(i.subtreeFlags&10256)!==0||(i.flags&10256)!==0?Le=5:(Le=0,La=Ir=null,Vy(e,e.pendingLanes));var h=e.pendingLanes;if(h===0&&(Rr=null),ra(a),i=i.stateNode,Ht&&typeof Ht.onCommitFiberRoot=="function")try{Ht.onCommitFiberRoot(se,i,void 0,(i.current.flags&128)===128)}catch{}if(l!==null){i=F.T,h=nt.p,nt.p=2,F.T=null;try{for(var d=e.onRecoverableError,v=0;v<l.length;v++){var E=l[v];d(E.value,{componentStack:E.stack})}}finally{F.T=i,nt.p=h}}(za&3)!==0&&Tc(),mi(e),h=e.pendingLanes,(a&4194090)!==0&&(h&42)!==0?e===Td?pl++:(pl=0,Td=e):pl=0,gl(0)}}function Vy(e,i){(e.pooledCacheLanes&=i)===0&&(i=e.pooledCache,i!=null&&(e.pooledCache=null,Xo(i)))}function Tc(e){return Oy(),Dy(),My(),Py()}function Py(){if(Le!==5)return!1;var e=Ir,i=yd;yd=0;var a=ra(za),l=F.T,h=nt.p;try{nt.p=32>a?32:a,F.T=null,a=vd,vd=null;var d=Ir,v=za;if(Le=0,La=Ir=null,za=0,(Ft&6)!==0)throw Error(s(331));var E=Ft;if(Ft|=4,_y(d.current),my(d,d.current,v,a),Ft=E,gl(0,!1),Ht&&typeof Ht.onPostCommitFiberRoot=="function")try{Ht.onPostCommitFiberRoot(se,d)}catch{}return!0}finally{nt.p=h,F.T=l,Vy(e,i)}}function ky(e,i,a){i=Nn(a,i),i=Wf(e.stateNode,i,2),e=gr(e,i,2),e!==null&&(Ii(e,2),mi(e))}function $t(e,i,a){if(e.tag===3)ky(e,e,a);else for(;i!==null;){if(i.tag===3){ky(i,e,a);break}else if(i.tag===1){var l=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Rr===null||!Rr.has(l))){e=Nn(a,e),a=z_(2),l=gr(i,a,2),l!==null&&(B_(a,l,i,e),Ii(l,2),mi(l));break}}i=i.return}}function bd(e,i,a){var l=e.pingCache;if(l===null){l=e.pingCache=new Ub;var h=new Set;l.set(i,h)}else h=l.get(i),h===void 0&&(h=new Set,l.set(i,h));h.has(a)||(md=!0,h.add(a),e=qb.bind(null,e,i,a),i.then(e,e))}function qb(e,i,a){var l=e.pingCache;l!==null&&l.delete(i),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Wt===e&&(xt&a)===a&&(oe===4||oe===3&&(xt&62914560)===xt&&300>Sn()-_d?(Ft&2)===0&&Ba(e,0):pd|=a,Ua===xt&&(Ua=0)),mi(e)}function xy(e,i){i===0&&(i=Ro()),e=Aa(e,i),e!==null&&(Ii(e,i),mi(e))}function Hb(e){var i=e.memoizedState,a=0;i!==null&&(a=i.retryLane),xy(e,a)}function Fb(e,i){var a=0;switch(e.tag){case 13:var l=e.stateNode,h=e.memoizedState;h!==null&&(a=h.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(s(314))}l!==null&&l.delete(i),xy(e,a)}function Gb(e,i){return is(e,i)}var Ec=null,qa=null,Rd=!1,Ac=!1,Id=!1,Ls=0;function mi(e){e!==qa&&e.next===null&&(qa===null?Ec=qa=e:qa=qa.next=e),Ac=!0,Rd||(Rd=!0,Yb())}function gl(e,i){if(!Id&&Ac){Id=!0;do for(var a=!1,l=Ec;l!==null;){if(e!==0){var h=l.pendingLanes;if(h===0)var d=0;else{var v=l.suspendedLanes,E=l.pingedLanes;d=(1<<31-He(42|e)+1)-1,d&=h&~(v&~E),d=d&201326741?d&201326741|1:d?d|2:0}d!==0&&(a=!0,By(l,d))}else d=xt,d=ia(l,l===Wt?d:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(d&3)===0||us(l,d)||(a=!0,By(l,d));l=l.next}while(a);Id=!1}}function Kb(){Uy()}function Uy(){Ac=Rd=!1;var e=0;Ls!==0&&(e1()&&(e=Ls),Ls=0);for(var i=Sn(),a=null,l=Ec;l!==null;){var h=l.next,d=Ly(l,i);d===0?(l.next=null,a===null?Ec=h:a.next=h,h===null&&(qa=a)):(a=l,(e!==0||(d&3)!==0)&&(Ac=!0)),l=h}gl(e)}function Ly(e,i){for(var a=e.suspendedLanes,l=e.pingedLanes,h=e.expirationTimes,d=e.pendingLanes&-62914561;0<d;){var v=31-He(d),E=1<<v,I=h[v];I===-1?((E&a)===0||(E&l)!==0)&&(h[v]=So(E,i)):I<=i&&(e.expiredLanes|=E),d&=~E}if(i=Wt,a=xt,a=ia(e,e===i?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===i&&(Gt===2||Gt===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&rs(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||us(e,a)){if(i=a&-a,i===e.callbackPriority)return i;switch(l!==null&&rs(l),ra(a)){case 2:case 8:a=ea;break;case 32:a=ss;break;case 268435456:a=na;break;default:a=ss}return l=zy.bind(null,e),a=is(a,l),e.callbackPriority=i,e.callbackNode=a,i}return l!==null&&l!==null&&rs(l),e.callbackPriority=2,e.callbackNode=null,2}function zy(e,i){if(Le!==0&&Le!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Tc()&&e.callbackNode!==a)return null;var l=xt;return l=ia(e,e===Wt?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Ey(e,l,i),Ly(e,Sn()),e.callbackNode!=null&&e.callbackNode===a?zy.bind(null,e):null)}function By(e,i){if(Tc())return null;Ey(e,i,!0)}function Yb(){i1(function(){(Ft&6)!==0?is(Eo,Kb):Uy()})}function wd(){return Ls===0&&(Ls=bo()),Ls}function jy(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ca(""+e)}function qy(e,i){var a=i.ownerDocument.createElement("input");return a.name=i.name,a.value=i.value,e.id&&a.setAttribute("form",e.id),i.parentNode.insertBefore(a,i),e=new FormData(e),a.parentNode.removeChild(a),e}function Qb(e,i,a,l,h){if(i==="submit"&&a&&a.stateNode===h){var d=jy((h[de]||null).action),v=l.submitter;v&&(i=(i=v[de]||null)?jy(i.formAction):v.getAttribute("formAction"),i!==null&&(d=i,v=null));var E=new ha("action","action",null,l,h);e.push({event:E,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Ls!==0){var I=v?qy(h,v):new FormData(h);Yf(a,{pending:!0,data:I,method:h.method,action:d},null,I)}}else typeof d=="function"&&(E.preventDefault(),I=v?qy(h,v):new FormData(h),Yf(a,{pending:!0,data:I,method:h.method,action:d},d,I))},currentTarget:h}]})}}for(var Cd=0;Cd<ff.length;Cd++){var Nd=ff[Cd],Xb=Nd.toLowerCase(),$b=Nd[0].toUpperCase()+Nd.slice(1);Hn(Xb,"on"+$b)}Hn(Eg,"onAnimationEnd"),Hn(Ag,"onAnimationIteration"),Hn(Sg,"onAnimationStart"),Hn("dblclick","onDoubleClick"),Hn("focusin","onFocus"),Hn("focusout","onBlur"),Hn(db,"onTransitionRun"),Hn(mb,"onTransitionStart"),Hn(pb,"onTransitionCancel"),Hn(bg,"onTransitionEnd"),Ci("onMouseEnter",["mouseout","mouseover"]),Ci("onMouseLeave",["mouseout","mouseover"]),Ci("onPointerEnter",["pointerout","pointerover"]),Ci("onPointerLeave",["pointerout","pointerover"]),jn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),jn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),jn("onBeforeInput",["compositionend","keypress","textInput","paste"]),jn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),jn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),jn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var _l="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Zb=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_l));function Hy(e,i){i=(i&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],h=l.event;l=l.listeners;t:{var d=void 0;if(i)for(var v=l.length-1;0<=v;v--){var E=l[v],I=E.instance,L=E.currentTarget;if(E=E.listener,I!==d&&h.isPropagationStopped())break t;d=E,h.currentTarget=L;try{d(h)}catch(G){uc(G)}h.currentTarget=null,d=I}else for(v=0;v<l.length;v++){if(E=l[v],I=E.instance,L=E.currentTarget,E=E.listener,I!==d&&h.isPropagationStopped())break t;d=E,h.currentTarget=L;try{d(h)}catch(G){uc(G)}h.currentTarget=null,d=I}}}}function Dt(e,i){var a=i[Co];a===void 0&&(a=i[Co]=new Set);var l=e+"__bubble";a.has(l)||(Fy(i,e,2,!1),a.add(l))}function Od(e,i,a){var l=0;i&&(l|=4),Fy(a,e,l,i)}var Sc="_reactListening"+Math.random().toString(36).slice(2);function Dd(e){if(!e[Sc]){e[Sc]=!0,No.forEach(function(a){a!=="selectionchange"&&(Zb.has(a)||Od(a,!1,e),Od(a,!0,e))});var i=e.nodeType===9?e:e.ownerDocument;i===null||i[Sc]||(i[Sc]=!0,Od("selectionchange",!1,i))}}function Fy(e,i,a,l){switch(mv(i)){case 2:var h=b1;break;case 8:h=R1;break;default:h=Gd}a=h.bind(null,i,a,e),h=void 0,!wn||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),l?h!==void 0?e.addEventListener(i,a,{capture:!0,passive:h}):e.addEventListener(i,a,!0):h!==void 0?e.addEventListener(i,a,{passive:h}):e.addEventListener(i,a,!1)}function Md(e,i,a,l,h){var d=l;if((i&1)===0&&(i&2)===0&&l!==null)t:for(;;){if(l===null)return;var v=l.tag;if(v===3||v===4){var E=l.stateNode.containerInfo;if(E===h)break;if(v===4)for(v=l.return;v!==null;){var I=v.tag;if((I===3||I===4)&&v.stateNode.containerInfo===h)return;v=v.return}for(;E!==null;){if(v=wi(E),v===null)return;if(I=v.tag,I===5||I===6||I===26||I===27){l=d=v;continue t}E=E.parentNode}}l=l.return}Ru(function(){var L=d,G=In(a),Q=[];t:{var B=Rg.get(e);if(B!==void 0){var j=ha,yt=e;switch(e){case"keypress":if(si(a)===0)break t;case"keydown":case"keyup":j=_a;break;case"focusin":yt="focus",j=ma;break;case"focusout":yt="blur",j=ma;break;case"beforeblur":case"afterblur":j=ma;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":j=Cn;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":j=rf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":j=Vu;break;case Eg:case Ag:case Sg:j=pa;break;case bg:j=ku;break;case"scroll":case"scrollend":j=Iu;break;case"wheel":j=ya;break;case"copy":case"cut":case"paste":j=ga;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":j=jo;break;case"toggle":case"beforetoggle":j=Uu}var ft=(i&4)!==0,Xt=!ft&&(e==="scroll"||e==="scrollend"),P=ft?B!==null?B+"Capture":null:B;ft=[];for(var O=L,U;O!==null;){var K=O;if(U=K.stateNode,K=K.tag,K!==5&&K!==26&&K!==27||U===null||P===null||(K=_s(O,P),K!=null&&ft.push(yl(O,K,U))),Xt)break;O=O.return}0<ft.length&&(B=new j(B,yt,null,a,G),Q.push({event:B,listeners:ft}))}}if((i&7)===0){t:{if(B=e==="mouseover"||e==="pointerover",j=e==="mouseout"||e==="pointerout",B&&a!==Di&&(yt=a.relatedTarget||a.fromElement)&&(wi(yt)||yt[bn]))break t;if((j||B)&&(B=G.window===G?G:(B=G.ownerDocument)?B.defaultView||B.parentWindow:window,j?(yt=a.relatedTarget||a.toElement,j=L,yt=yt?wi(yt):null,yt!==null&&(Xt=u(yt),ft=yt.tag,yt!==Xt||ft!==5&&ft!==27&&ft!==6)&&(yt=null)):(j=null,yt=L),j!==yt)){if(ft=Cn,K="onMouseLeave",P="onMouseEnter",O="mouse",(e==="pointerout"||e==="pointerover")&&(ft=jo,K="onPointerLeave",P="onPointerEnter",O="pointer"),Xt=j==null?B:ei(j),U=yt==null?B:ei(yt),B=new ft(K,O+"leave",j,a,G),B.target=Xt,B.relatedTarget=U,K=null,wi(G)===L&&(ft=new ft(P,O+"enter",yt,a,G),ft.target=U,ft.relatedTarget=Xt,K=ft),Xt=K,j&&yt)e:{for(ft=j,P=yt,O=0,U=ft;U;U=Ha(U))O++;for(U=0,K=P;K;K=Ha(K))U++;for(;0<O-U;)ft=Ha(ft),O--;for(;0<U-O;)P=Ha(P),U--;for(;O--;){if(ft===P||P!==null&&ft===P.alternate)break e;ft=Ha(ft),P=Ha(P)}ft=null}else ft=null;j!==null&&Gy(Q,B,j,ft,!1),yt!==null&&Xt!==null&&Gy(Q,Xt,yt,ft,!0)}}t:{if(B=L?ei(L):window,j=B.nodeName&&B.nodeName.toLowerCase(),j==="select"||j==="input"&&B.type==="file")var st=cg;else if(Te(B))if(hg)st=cb;else{st=lb;var Nt=ob}else j=B.nodeName,!j||j.toLowerCase()!=="input"||B.type!=="checkbox"&&B.type!=="radio"?L&&Po(L.elementType)&&(st=cg):st=ub;if(st&&(st=st(e,L))){xi(Q,st,a,G);break t}Nt&&Nt(e,B,L),e==="focusout"&&L&&B.type==="number"&&L.memoizedProps.value!=null&&hr(B,"number",B.value)}switch(Nt=L?ei(L):window,e){case"focusin":(Te(Nt)||Nt.contentEditable==="true")&&(va=Nt,uf=L,Fo=null);break;case"focusout":Fo=uf=va=null;break;case"mousedown":cf=!0;break;case"contextmenu":case"mouseup":case"dragend":cf=!1,vg(Q,a,G);break;case"selectionchange":if(fb)break;case"keydown":case"keyup":vg(Q,a,G)}var ot;if(li)t:{switch(e){case"compositionstart":var pt="onCompositionStart";break t;case"compositionend":pt="onCompositionEnd";break t;case"compositionupdate":pt="onCompositionUpdate";break t}pt=void 0}else Pt?q(e,a)&&(pt="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(pt="onCompositionStart");pt&&(y&&a.locale!=="ko"&&(Pt||pt!=="onCompositionStart"?pt==="onCompositionEnd"&&Pt&&(ot=xo()):(ri=G,fr="value"in ri?ri.value:ri.textContent,Pt=!0)),Nt=bc(L,pt),0<Nt.length&&(pt=new zo(pt,e,null,a,G),Q.push({event:pt,listeners:Nt}),ot?pt.data=ot:(ot=et(a),ot!==null&&(pt.data=ot)))),(ot=p?ve(e,a):kt(e,a))&&(pt=bc(L,"onBeforeInput"),0<pt.length&&(Nt=new zo("onBeforeInput","beforeinput",null,a,G),Q.push({event:Nt,listeners:pt}),Nt.data=ot)),Qb(Q,e,L,a,G)}Hy(Q,i)})}function yl(e,i,a){return{instance:e,listener:i,currentTarget:a}}function bc(e,i){for(var a=i+"Capture",l=[];e!==null;){var h=e,d=h.stateNode;if(h=h.tag,h!==5&&h!==26&&h!==27||d===null||(h=_s(e,a),h!=null&&l.unshift(yl(e,h,d)),h=_s(e,i),h!=null&&l.push(yl(e,h,d))),e.tag===3)return l;e=e.return}return[]}function Ha(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Gy(e,i,a,l,h){for(var d=i._reactName,v=[];a!==null&&a!==l;){var E=a,I=E.alternate,L=E.stateNode;if(E=E.tag,I!==null&&I===l)break;E!==5&&E!==26&&E!==27||L===null||(I=L,h?(L=_s(a,d),L!=null&&v.unshift(yl(a,L,I))):h||(L=_s(a,d),L!=null&&v.push(yl(a,L,I)))),a=a.return}v.length!==0&&e.push({event:i,listeners:v})}var Wb=/\r\n?/g,Jb=/\u0000|\uFFFD/g;function Ky(e){return(typeof e=="string"?e:""+e).replace(Wb,`
`).replace(Jb,"")}function Yy(e,i){return i=Ky(i),Ky(e)===i}function Rc(){}function Qt(e,i,a,l,h,d){switch(a){case"children":typeof l=="string"?i==="body"||i==="textarea"&&l===""||Rn(e,l):(typeof l=="number"||typeof l=="bigint")&&i!=="body"&&Rn(e,""+l);break;case"className":ni(e,"class",l);break;case"tabIndex":ni(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":ni(e,a,l);break;case"style":Vo(e,l,d);break;case"data":if(i!=="object"){ni(e,"data",l);break}case"src":case"href":if(l===""&&(i!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=ca(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof d=="function"&&(a==="formAction"?(i!=="input"&&Qt(e,i,"name",h.name,h,null),Qt(e,i,"formEncType",h.formEncType,h,null),Qt(e,i,"formMethod",h.formMethod,h,null),Qt(e,i,"formTarget",h.formTarget,h,null)):(Qt(e,i,"encType",h.encType,h,null),Qt(e,i,"method",h.method,h,null),Qt(e,i,"target",h.target,h,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=ca(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=Rc);break;case"onScroll":l!=null&&Dt("scroll",e);break;case"onScrollEnd":l!=null&&Dt("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(s(61));if(a=l.__html,a!=null){if(h.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=ca(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":Dt("beforetoggle",e),Dt("toggle",e),cr(e,"popover",l);break;case"xlinkActuate":ke(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":ke(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":ke(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":ke(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":ke(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":ke(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":ke(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":ke(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":ke(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":cr(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=ef.get(a)||a,cr(e,a,l))}}function Vd(e,i,a,l,h,d){switch(a){case"style":Vo(e,l,d);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(s(61));if(a=l.__html,a!=null){if(h.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof l=="string"?Rn(e,l):(typeof l=="number"||typeof l=="bigint")&&Rn(e,""+l);break;case"onScroll":l!=null&&Dt("scroll",e);break;case"onScrollEnd":l!=null&&Dt("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Rc);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!sa.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(h=a.endsWith("Capture"),i=a.slice(2,h?a.length-7:void 0),d=e[de]||null,d=d!=null?d[a]:null,typeof d=="function"&&e.removeEventListener(i,d,h),typeof l=="function")){typeof d!="function"&&d!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(i,l,h);break t}a in e?e[a]=l:l===!0?e.setAttribute(a,""):cr(e,a,l)}}}function ze(e,i,a){switch(i){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Dt("error",e),Dt("load",e);var l=!1,h=!1,d;for(d in a)if(a.hasOwnProperty(d)){var v=a[d];if(v!=null)switch(d){case"src":l=!0;break;case"srcSet":h=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,i));default:Qt(e,i,d,v,a,null)}}h&&Qt(e,i,"srcSet",a.srcSet,a,null),l&&Qt(e,i,"src",a.src,a,null);return;case"input":Dt("invalid",e);var E=d=v=h=null,I=null,L=null;for(l in a)if(a.hasOwnProperty(l)){var G=a[l];if(G!=null)switch(l){case"name":h=G;break;case"type":v=G;break;case"checked":I=G;break;case"defaultChecked":L=G;break;case"value":d=G;break;case"defaultValue":E=G;break;case"children":case"dangerouslySetInnerHTML":if(G!=null)throw Error(s(137,i));break;default:Qt(e,i,l,G,a,null)}}ms(e,d,E,I,L,v,h,!1),ua(e);return;case"select":Dt("invalid",e),l=v=d=null;for(h in a)if(a.hasOwnProperty(h)&&(E=a[h],E!=null))switch(h){case"value":d=E;break;case"defaultValue":v=E;break;case"multiple":l=E;default:Qt(e,i,h,E,a,null)}i=d,a=v,e.multiple=!!l,i!=null?Oi(e,!!l,i,!1):a!=null&&Oi(e,!!l,a,!0);return;case"textarea":Dt("invalid",e),d=h=l=null;for(v in a)if(a.hasOwnProperty(v)&&(E=a[v],E!=null))switch(v){case"value":l=E;break;case"defaultValue":h=E;break;case"children":d=E;break;case"dangerouslySetInnerHTML":if(E!=null)throw Error(s(91));break;default:Qt(e,i,v,E,a,null)}ps(e,l,h,d),ua(e);return;case"option":for(I in a)if(a.hasOwnProperty(I)&&(l=a[I],l!=null))switch(I){case"selected":e.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:Qt(e,i,I,l,a,null)}return;case"dialog":Dt("beforetoggle",e),Dt("toggle",e),Dt("cancel",e),Dt("close",e);break;case"iframe":case"object":Dt("load",e);break;case"video":case"audio":for(l=0;l<_l.length;l++)Dt(_l[l],e);break;case"image":Dt("error",e),Dt("load",e);break;case"details":Dt("toggle",e);break;case"embed":case"source":case"link":Dt("error",e),Dt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(L in a)if(a.hasOwnProperty(L)&&(l=a[L],l!=null))switch(L){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,i));default:Qt(e,i,L,l,a,null)}return;default:if(Po(i)){for(G in a)a.hasOwnProperty(G)&&(l=a[G],l!==void 0&&Vd(e,i,G,l,a,void 0));return}}for(E in a)a.hasOwnProperty(E)&&(l=a[E],l!=null&&Qt(e,i,E,l,a,null))}function t1(e,i,a,l){switch(i){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var h=null,d=null,v=null,E=null,I=null,L=null,G=null;for(j in a){var Q=a[j];if(a.hasOwnProperty(j)&&Q!=null)switch(j){case"checked":break;case"value":break;case"defaultValue":I=Q;default:l.hasOwnProperty(j)||Qt(e,i,j,null,l,Q)}}for(var B in l){var j=l[B];if(Q=a[B],l.hasOwnProperty(B)&&(j!=null||Q!=null))switch(B){case"type":d=j;break;case"name":h=j;break;case"checked":L=j;break;case"defaultChecked":G=j;break;case"value":v=j;break;case"defaultValue":E=j;break;case"children":case"dangerouslySetInnerHTML":if(j!=null)throw Error(s(137,i));break;default:j!==Q&&Qt(e,i,B,j,l,Q)}}fn(e,v,E,I,L,G,d,h);return;case"select":j=v=E=B=null;for(d in a)if(I=a[d],a.hasOwnProperty(d)&&I!=null)switch(d){case"value":break;case"multiple":j=I;default:l.hasOwnProperty(d)||Qt(e,i,d,null,l,I)}for(h in l)if(d=l[h],I=a[h],l.hasOwnProperty(h)&&(d!=null||I!=null))switch(h){case"value":B=d;break;case"defaultValue":E=d;break;case"multiple":v=d;default:d!==I&&Qt(e,i,h,d,l,I)}i=E,a=v,l=j,B!=null?Oi(e,!!a,B,!1):!!l!=!!a&&(i!=null?Oi(e,!!a,i,!0):Oi(e,!!a,a?[]:"",!1));return;case"textarea":j=B=null;for(E in a)if(h=a[E],a.hasOwnProperty(E)&&h!=null&&!l.hasOwnProperty(E))switch(E){case"value":break;case"children":break;default:Qt(e,i,E,null,l,h)}for(v in l)if(h=l[v],d=a[v],l.hasOwnProperty(v)&&(h!=null||d!=null))switch(v){case"value":B=h;break;case"defaultValue":j=h;break;case"children":break;case"dangerouslySetInnerHTML":if(h!=null)throw Error(s(91));break;default:h!==d&&Qt(e,i,v,h,l,d)}Kt(e,B,j);return;case"option":for(var yt in a)if(B=a[yt],a.hasOwnProperty(yt)&&B!=null&&!l.hasOwnProperty(yt))switch(yt){case"selected":e.selected=!1;break;default:Qt(e,i,yt,null,l,B)}for(I in l)if(B=l[I],j=a[I],l.hasOwnProperty(I)&&B!==j&&(B!=null||j!=null))switch(I){case"selected":e.selected=B&&typeof B!="function"&&typeof B!="symbol";break;default:Qt(e,i,I,B,l,j)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ft in a)B=a[ft],a.hasOwnProperty(ft)&&B!=null&&!l.hasOwnProperty(ft)&&Qt(e,i,ft,null,l,B);for(L in l)if(B=l[L],j=a[L],l.hasOwnProperty(L)&&B!==j&&(B!=null||j!=null))switch(L){case"children":case"dangerouslySetInnerHTML":if(B!=null)throw Error(s(137,i));break;default:Qt(e,i,L,B,l,j)}return;default:if(Po(i)){for(var Xt in a)B=a[Xt],a.hasOwnProperty(Xt)&&B!==void 0&&!l.hasOwnProperty(Xt)&&Vd(e,i,Xt,void 0,l,B);for(G in l)B=l[G],j=a[G],!l.hasOwnProperty(G)||B===j||B===void 0&&j===void 0||Vd(e,i,G,B,l,j);return}}for(var P in a)B=a[P],a.hasOwnProperty(P)&&B!=null&&!l.hasOwnProperty(P)&&Qt(e,i,P,null,l,B);for(Q in l)B=l[Q],j=a[Q],!l.hasOwnProperty(Q)||B===j||B==null&&j==null||Qt(e,i,Q,B,l,j)}var Pd=null,kd=null;function Ic(e){return e.nodeType===9?e:e.ownerDocument}function Qy(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Xy(e,i){if(e===0)switch(i){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&i==="foreignObject"?0:e}function xd(e,i){return e==="textarea"||e==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.children=="bigint"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Ud=null;function e1(){var e=window.event;return e&&e.type==="popstate"?e===Ud?!1:(Ud=e,!0):(Ud=null,!1)}var $y=typeof setTimeout=="function"?setTimeout:void 0,n1=typeof clearTimeout=="function"?clearTimeout:void 0,Zy=typeof Promise=="function"?Promise:void 0,i1=typeof queueMicrotask=="function"?queueMicrotask:typeof Zy<"u"?function(e){return Zy.resolve(null).then(e).catch(r1)}:$y;function r1(e){setTimeout(function(){throw e})}function Cr(e){return e==="head"}function Wy(e,i){var a=i,l=0,h=0;do{var d=a.nextSibling;if(e.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(0<l&&8>l){a=l;var v=e.ownerDocument;if(a&1&&vl(v.documentElement),a&2&&vl(v.body),a&4)for(a=v.head,vl(a),v=a.firstChild;v;){var E=v.nextSibling,I=v.nodeName;v[cs]||I==="SCRIPT"||I==="STYLE"||I==="LINK"&&v.rel.toLowerCase()==="stylesheet"||a.removeChild(v),v=E}}if(h===0){e.removeChild(d),wl(i);return}h--}else a==="$"||a==="$?"||a==="$!"?h++:l=a.charCodeAt(0)-48;else l=0;a=d}while(a);wl(i)}function Ld(e){var i=e.firstChild;for(i&&i.nodeType===10&&(i=i.nextSibling);i;){var a=i;switch(i=i.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Ld(a),ur(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function s1(e,i,a,l){for(;e.nodeType===1;){var h=a;if(e.nodeName.toLowerCase()!==i.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[cs])switch(i){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(d=e.getAttribute("rel"),d==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(d!==h.rel||e.getAttribute("href")!==(h.href==null||h.href===""?null:h.href)||e.getAttribute("crossorigin")!==(h.crossOrigin==null?null:h.crossOrigin)||e.getAttribute("title")!==(h.title==null?null:h.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(d=e.getAttribute("src"),(d!==(h.src==null?null:h.src)||e.getAttribute("type")!==(h.type==null?null:h.type)||e.getAttribute("crossorigin")!==(h.crossOrigin==null?null:h.crossOrigin))&&d&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(i==="input"&&e.type==="hidden"){var d=h.name==null?null:""+h.name;if(h.type==="hidden"&&e.getAttribute("name")===d)return e}else return e;if(e=Gn(e.nextSibling),e===null)break}return null}function a1(e,i,a){if(i==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Gn(e.nextSibling),e===null))return null;return e}function zd(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState==="complete"}function o1(e,i){var a=e.ownerDocument;if(e.data!=="$?"||a.readyState==="complete")i();else{var l=function(){i(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Gn(e){for(;e!=null;e=e.nextSibling){var i=e.nodeType;if(i===1||i===3)break;if(i===8){if(i=e.data,i==="$"||i==="$!"||i==="$?"||i==="F!"||i==="F")break;if(i==="/$")return null}}return e}var Bd=null;function Jy(e){e=e.previousSibling;for(var i=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return e;i--}else a==="/$"&&i++}e=e.previousSibling}return null}function tv(e,i,a){switch(i=Ic(a),e){case"html":if(e=i.documentElement,!e)throw Error(s(452));return e;case"head":if(e=i.head,!e)throw Error(s(453));return e;case"body":if(e=i.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function vl(e){for(var i=e.attributes;i.length;)e.removeAttributeNode(i[0]);ur(e)}var kn=new Map,ev=new Set;function wc(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Xi=nt.d;nt.d={f:l1,r:u1,D:c1,C:h1,L:f1,m:d1,X:p1,S:m1,M:g1};function l1(){var e=Xi.f(),i=yc();return e||i}function u1(e){var i=ti(e);i!==null&&i.tag===5&&i.type==="form"?E_(i):Xi.r(e)}var Fa=typeof document>"u"?null:document;function nv(e,i,a){var l=Fa;if(l&&typeof i=="string"&&i){var h=me(i);h='link[rel="'+e+'"][href="'+h+'"]',typeof a=="string"&&(h+='[crossorigin="'+a+'"]'),ev.has(h)||(ev.add(h),e={rel:e,crossOrigin:a,href:i},l.querySelector(h)===null&&(i=l.createElement("link"),ze(i,"link",e),ue(i),l.head.appendChild(i)))}}function c1(e){Xi.D(e),nv("dns-prefetch",e,null)}function h1(e,i){Xi.C(e,i),nv("preconnect",e,i)}function f1(e,i,a){Xi.L(e,i,a);var l=Fa;if(l&&e&&i){var h='link[rel="preload"][as="'+me(i)+'"]';i==="image"&&a&&a.imageSrcSet?(h+='[imagesrcset="'+me(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(h+='[imagesizes="'+me(a.imageSizes)+'"]')):h+='[href="'+me(e)+'"]';var d=h;switch(i){case"style":d=Ga(e);break;case"script":d=Ka(e)}kn.has(d)||(e=T({rel:"preload",href:i==="image"&&a&&a.imageSrcSet?void 0:e,as:i},a),kn.set(d,e),l.querySelector(h)!==null||i==="style"&&l.querySelector(Tl(d))||i==="script"&&l.querySelector(El(d))||(i=l.createElement("link"),ze(i,"link",e),ue(i),l.head.appendChild(i)))}}function d1(e,i){Xi.m(e,i);var a=Fa;if(a&&e){var l=i&&typeof i.as=="string"?i.as:"script",h='link[rel="modulepreload"][as="'+me(l)+'"][href="'+me(e)+'"]',d=h;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":d=Ka(e)}if(!kn.has(d)&&(e=T({rel:"modulepreload",href:e},i),kn.set(d,e),a.querySelector(h)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(El(d)))return}l=a.createElement("link"),ze(l,"link",e),ue(l),a.head.appendChild(l)}}}function m1(e,i,a){Xi.S(e,i,a);var l=Fa;if(l&&e){var h=We(l).hoistableStyles,d=Ga(e);i=i||"default";var v=h.get(d);if(!v){var E={loading:0,preload:null};if(v=l.querySelector(Tl(d)))E.loading=5;else{e=T({rel:"stylesheet",href:e,"data-precedence":i},a),(a=kn.get(d))&&jd(e,a);var I=v=l.createElement("link");ue(I),ze(I,"link",e),I._p=new Promise(function(L,G){I.onload=L,I.onerror=G}),I.addEventListener("load",function(){E.loading|=1}),I.addEventListener("error",function(){E.loading|=2}),E.loading|=4,Cc(v,i,l)}v={type:"stylesheet",instance:v,count:1,state:E},h.set(d,v)}}}function p1(e,i){Xi.X(e,i);var a=Fa;if(a&&e){var l=We(a).hoistableScripts,h=Ka(e),d=l.get(h);d||(d=a.querySelector(El(h)),d||(e=T({src:e,async:!0},i),(i=kn.get(h))&&qd(e,i),d=a.createElement("script"),ue(d),ze(d,"link",e),a.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},l.set(h,d))}}function g1(e,i){Xi.M(e,i);var a=Fa;if(a&&e){var l=We(a).hoistableScripts,h=Ka(e),d=l.get(h);d||(d=a.querySelector(El(h)),d||(e=T({src:e,async:!0,type:"module"},i),(i=kn.get(h))&&qd(e,i),d=a.createElement("script"),ue(d),ze(d,"link",e),a.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},l.set(h,d))}}function iv(e,i,a,l){var h=(h=Et.current)?wc(h):null;if(!h)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(i=Ga(a.href),a=We(h).hoistableStyles,l=a.get(i),l||(l={type:"style",instance:null,count:0,state:null},a.set(i,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Ga(a.href);var d=We(h).hoistableStyles,v=d.get(e);if(v||(h=h.ownerDocument||h,v={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},d.set(e,v),(d=h.querySelector(Tl(e)))&&!d._p&&(v.instance=d,v.state.loading=5),kn.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},kn.set(e,a),d||_1(h,e,a,v.state))),i&&l===null)throw Error(s(528,""));return v}if(i&&l!==null)throw Error(s(529,""));return null;case"script":return i=a.async,a=a.src,typeof a=="string"&&i&&typeof i!="function"&&typeof i!="symbol"?(i=Ka(a),a=We(h).hoistableScripts,l=a.get(i),l||(l={type:"script",instance:null,count:0,state:null},a.set(i,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function Ga(e){return'href="'+me(e)+'"'}function Tl(e){return'link[rel="stylesheet"]['+e+"]"}function rv(e){return T({},e,{"data-precedence":e.precedence,precedence:null})}function _1(e,i,a,l){e.querySelector('link[rel="preload"][as="style"]['+i+"]")?l.loading=1:(i=e.createElement("link"),l.preload=i,i.addEventListener("load",function(){return l.loading|=1}),i.addEventListener("error",function(){return l.loading|=2}),ze(i,"link",a),ue(i),e.head.appendChild(i))}function Ka(e){return'[src="'+me(e)+'"]'}function El(e){return"script[async]"+e}function sv(e,i,a){if(i.count++,i.instance===null)switch(i.type){case"style":var l=e.querySelector('style[data-href~="'+me(a.href)+'"]');if(l)return i.instance=l,ue(l),l;var h=T({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),ue(l),ze(l,"style",h),Cc(l,a.precedence,e),i.instance=l;case"stylesheet":h=Ga(a.href);var d=e.querySelector(Tl(h));if(d)return i.state.loading|=4,i.instance=d,ue(d),d;l=rv(a),(h=kn.get(h))&&jd(l,h),d=(e.ownerDocument||e).createElement("link"),ue(d);var v=d;return v._p=new Promise(function(E,I){v.onload=E,v.onerror=I}),ze(d,"link",l),i.state.loading|=4,Cc(d,a.precedence,e),i.instance=d;case"script":return d=Ka(a.src),(h=e.querySelector(El(d)))?(i.instance=h,ue(h),h):(l=a,(h=kn.get(d))&&(l=T({},a),qd(l,h)),e=e.ownerDocument||e,h=e.createElement("script"),ue(h),ze(h,"link",l),e.head.appendChild(h),i.instance=h);case"void":return null;default:throw Error(s(443,i.type))}else i.type==="stylesheet"&&(i.state.loading&4)===0&&(l=i.instance,i.state.loading|=4,Cc(l,a.precedence,e));return i.instance}function Cc(e,i,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),h=l.length?l[l.length-1]:null,d=h,v=0;v<l.length;v++){var E=l[v];if(E.dataset.precedence===i)d=E;else if(d!==h)break}d?d.parentNode.insertBefore(e,d.nextSibling):(i=a.nodeType===9?a.head:a,i.insertBefore(e,i.firstChild))}function jd(e,i){e.crossOrigin==null&&(e.crossOrigin=i.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=i.referrerPolicy),e.title==null&&(e.title=i.title)}function qd(e,i){e.crossOrigin==null&&(e.crossOrigin=i.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=i.referrerPolicy),e.integrity==null&&(e.integrity=i.integrity)}var Nc=null;function av(e,i,a){if(Nc===null){var l=new Map,h=Nc=new Map;h.set(a,l)}else h=Nc,l=h.get(a),l||(l=new Map,h.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),h=0;h<a.length;h++){var d=a[h];if(!(d[cs]||d[ye]||e==="link"&&d.getAttribute("rel")==="stylesheet")&&d.namespaceURI!=="http://www.w3.org/2000/svg"){var v=d.getAttribute(i)||"";v=e+v;var E=l.get(v);E?E.push(d):l.set(v,[d])}}return l}function ov(e,i,a){e=e.ownerDocument||e,e.head.insertBefore(a,i==="title"?e.querySelector("head > title"):null)}function y1(e,i,a){if(a===1||i.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof i.precedence!="string"||typeof i.href!="string"||i.href==="")break;return!0;case"link":if(typeof i.rel!="string"||typeof i.href!="string"||i.href===""||i.onLoad||i.onError)break;switch(i.rel){case"stylesheet":return e=i.disabled,typeof i.precedence=="string"&&e==null;default:return!0}case"script":if(i.async&&typeof i.async!="function"&&typeof i.async!="symbol"&&!i.onLoad&&!i.onError&&i.src&&typeof i.src=="string")return!0}return!1}function lv(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}var Al=null;function v1(){}function T1(e,i,a){if(Al===null)throw Error(s(475));var l=Al;if(i.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(i.state.loading&4)===0){if(i.instance===null){var h=Ga(a.href),d=e.querySelector(Tl(h));if(d){e=d._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(l.count++,l=Oc.bind(l),e.then(l,l)),i.state.loading|=4,i.instance=d,ue(d);return}d=e.ownerDocument||e,a=rv(a),(h=kn.get(h))&&jd(a,h),d=d.createElement("link"),ue(d);var v=d;v._p=new Promise(function(E,I){v.onload=E,v.onerror=I}),ze(d,"link",a),i.instance=d}l.stylesheets===null&&(l.stylesheets=new Map),l.stylesheets.set(i,e),(e=i.state.preload)&&(i.state.loading&3)===0&&(l.count++,i=Oc.bind(l),e.addEventListener("load",i),e.addEventListener("error",i))}}function E1(){if(Al===null)throw Error(s(475));var e=Al;return e.stylesheets&&e.count===0&&Hd(e,e.stylesheets),0<e.count?function(i){var a=setTimeout(function(){if(e.stylesheets&&Hd(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4);return e.unsuspend=i,function(){e.unsuspend=null,clearTimeout(a)}}:null}function Oc(){if(this.count--,this.count===0){if(this.stylesheets)Hd(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Dc=null;function Hd(e,i){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Dc=new Map,i.forEach(A1,e),Dc=null,Oc.call(e))}function A1(e,i){if(!(i.state.loading&4)){var a=Dc.get(e);if(a)var l=a.get(null);else{a=new Map,Dc.set(e,a);for(var h=e.querySelectorAll("link[data-precedence],style[data-precedence]"),d=0;d<h.length;d++){var v=h[d];(v.nodeName==="LINK"||v.getAttribute("media")!=="not all")&&(a.set(v.dataset.precedence,v),l=v)}l&&a.set(null,l)}h=i.instance,v=h.getAttribute("data-precedence"),d=a.get(v)||l,d===l&&a.set(null,h),a.set(v,h),this.count++,l=Oc.bind(this),h.addEventListener("load",l),h.addEventListener("error",l),d?d.parentNode.insertBefore(h,d.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(h,e.firstChild)),i.state.loading|=4}}var Sl={$$typeof:at,Provider:null,Consumer:null,_currentValue:lt,_currentValue2:lt,_threadCount:0};function S1(e,i,a,l,h,d,v,E){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ri(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ri(0),this.hiddenUpdates=Ri(null),this.identifierPrefix=l,this.onUncaughtError=h,this.onCaughtError=d,this.onRecoverableError=v,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=E,this.incompleteTransitions=new Map}function uv(e,i,a,l,h,d,v,E,I,L,G,Q){return e=new S1(e,i,a,v,E,I,L,Q),i=1,d===!0&&(i|=24),d=mn(3,null,null,i),e.current=d,d.stateNode=e,i=bf(),i.refCount++,e.pooledCache=i,i.refCount++,d.memoizedState={element:l,isDehydrated:a,cache:i},Cf(d),e}function cv(e){return e?(e=Sa,e):Sa}function hv(e,i,a,l,h,d){h=cv(h),l.context===null?l.context=h:l.pendingContext=h,l=pr(i),l.payload={element:a},d=d===void 0?null:d,d!==null&&(l.callback=d),a=gr(e,l,i),a!==null&&(vn(a,e,i),Jo(a,e,i))}function fv(e,i){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<i?a:i}}function Fd(e,i){fv(e,i),(e=e.alternate)&&fv(e,i)}function dv(e){if(e.tag===13){var i=Aa(e,67108864);i!==null&&vn(i,e,67108864),Fd(e,67108864)}}var Mc=!0;function b1(e,i,a,l){var h=F.T;F.T=null;var d=nt.p;try{nt.p=2,Gd(e,i,a,l)}finally{nt.p=d,F.T=h}}function R1(e,i,a,l){var h=F.T;F.T=null;var d=nt.p;try{nt.p=8,Gd(e,i,a,l)}finally{nt.p=d,F.T=h}}function Gd(e,i,a,l){if(Mc){var h=Kd(l);if(h===null)Md(e,i,l,Vc,a),pv(e,l);else if(w1(h,e,i,a,l))l.stopPropagation();else if(pv(e,l),i&4&&-1<I1.indexOf(e)){for(;h!==null;){var d=ti(h);if(d!==null)switch(d.tag){case 3:if(d=d.stateNode,d.current.memoizedState.isDehydrated){var v=Bn(d.pendingLanes);if(v!==0){var E=d;for(E.pendingLanes|=2,E.entangledLanes|=2;v;){var I=1<<31-He(v);E.entanglements[1]|=I,v&=~I}mi(d),(Ft&6)===0&&(gc=Sn()+500,gl(0))}}break;case 13:E=Aa(d,2),E!==null&&vn(E,d,2),yc(),Fd(d,2)}if(d=Kd(l),d===null&&Md(e,i,l,Vc,a),d===h)break;h=d}h!==null&&l.stopPropagation()}else Md(e,i,l,null,a)}}function Kd(e){return e=In(e),Yd(e)}var Vc=null;function Yd(e){if(Vc=null,e=wi(e),e!==null){var i=u(e);if(i===null)e=null;else{var a=i.tag;if(a===13){if(e=f(i),e!==null)return e;e=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;e=null}else i!==e&&(e=null)}}return Vc=e,null}function mv(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Xh()){case Eo:return 2;case ea:return 8;case ss:case $h:return 32;case na:return 268435456;default:return 32}default:return 32}}var Qd=!1,Nr=null,Or=null,Dr=null,bl=new Map,Rl=new Map,Mr=[],I1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function pv(e,i){switch(e){case"focusin":case"focusout":Nr=null;break;case"dragenter":case"dragleave":Or=null;break;case"mouseover":case"mouseout":Dr=null;break;case"pointerover":case"pointerout":bl.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":Rl.delete(i.pointerId)}}function Il(e,i,a,l,h,d){return e===null||e.nativeEvent!==d?(e={blockedOn:i,domEventName:a,eventSystemFlags:l,nativeEvent:d,targetContainers:[h]},i!==null&&(i=ti(i),i!==null&&dv(i)),e):(e.eventSystemFlags|=l,i=e.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),e)}function w1(e,i,a,l,h){switch(i){case"focusin":return Nr=Il(Nr,e,i,a,l,h),!0;case"dragenter":return Or=Il(Or,e,i,a,l,h),!0;case"mouseover":return Dr=Il(Dr,e,i,a,l,h),!0;case"pointerover":var d=h.pointerId;return bl.set(d,Il(bl.get(d)||null,e,i,a,l,h)),!0;case"gotpointercapture":return d=h.pointerId,Rl.set(d,Il(Rl.get(d)||null,e,i,a,l,h)),!0}return!1}function gv(e){var i=wi(e.target);if(i!==null){var a=u(i);if(a!==null){if(i=a.tag,i===13){if(i=f(a),i!==null){e.blockedOn=i,yu(e.priority,function(){if(a.tag===13){var l=yn();l=ar(l);var h=Aa(a,l);h!==null&&vn(h,a,l),Fd(a,l)}});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Pc(e){if(e.blockedOn!==null)return!1;for(var i=e.targetContainers;0<i.length;){var a=Kd(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);Di=l,a.target.dispatchEvent(l),Di=null}else return i=ti(a),i!==null&&dv(i),e.blockedOn=a,!1;i.shift()}return!0}function _v(e,i,a){Pc(e)&&a.delete(i)}function C1(){Qd=!1,Nr!==null&&Pc(Nr)&&(Nr=null),Or!==null&&Pc(Or)&&(Or=null),Dr!==null&&Pc(Dr)&&(Dr=null),bl.forEach(_v),Rl.forEach(_v)}function kc(e,i){e.blockedOn===i&&(e.blockedOn=null,Qd||(Qd=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,C1)))}var xc=null;function yv(e){xc!==e&&(xc=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){xc===e&&(xc=null);for(var i=0;i<e.length;i+=3){var a=e[i],l=e[i+1],h=e[i+2];if(typeof l!="function"){if(Yd(l||a)===null)continue;break}var d=ti(a);d!==null&&(e.splice(i,3),i-=3,Yf(d,{pending:!0,data:h,method:a.method,action:l},l,h))}}))}function wl(e){function i(I){return kc(I,e)}Nr!==null&&kc(Nr,e),Or!==null&&kc(Or,e),Dr!==null&&kc(Dr,e),bl.forEach(i),Rl.forEach(i);for(var a=0;a<Mr.length;a++){var l=Mr[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Mr.length&&(a=Mr[0],a.blockedOn===null);)gv(a),a.blockedOn===null&&Mr.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var h=a[l],d=a[l+1],v=h[de]||null;if(typeof d=="function")v||yv(a);else if(v){var E=null;if(d&&d.hasAttribute("formAction")){if(h=d,v=d[de]||null)E=v.formAction;else if(Yd(h)!==null)continue}else E=v.action;typeof E=="function"?a[l+1]=E:(a.splice(l,3),l-=3),yv(a)}}}function Xd(e){this._internalRoot=e}Uc.prototype.render=Xd.prototype.render=function(e){var i=this._internalRoot;if(i===null)throw Error(s(409));var a=i.current,l=yn();hv(a,l,e,i,null,null)},Uc.prototype.unmount=Xd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var i=e.containerInfo;hv(e.current,2,null,e,null,null),yc(),i[bn]=null}};function Uc(e){this._internalRoot=e}Uc.prototype.unstable_scheduleHydration=function(e){if(e){var i=or();e={blockedOn:null,target:e,priority:i};for(var a=0;a<Mr.length&&i!==0&&i<Mr[a].priority;a++);Mr.splice(a,0,e),a===0&&gv(e)}};var vv=t.version;if(vv!=="19.1.0")throw Error(s(527,vv,"19.1.0"));nt.findDOMNode=function(e){var i=e._reactInternals;if(i===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=g(i),e=e!==null?_(e):null,e=e===null?null:e.stateNode,e};var N1={bundleType:0,version:"19.1.0",rendererPackageName:"react-dom",currentDispatcherRef:F,reconcilerVersion:"19.1.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Lc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Lc.isDisabled&&Lc.supportsFiber)try{se=Lc.inject(N1),Ht=Lc}catch{}}return Nl.createRoot=function(e,i){if(!o(e))throw Error(s(299));var a=!1,l="",h=k_,d=x_,v=U_,E=null;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onUncaughtError!==void 0&&(h=i.onUncaughtError),i.onCaughtError!==void 0&&(d=i.onCaughtError),i.onRecoverableError!==void 0&&(v=i.onRecoverableError),i.unstable_transitionCallbacks!==void 0&&(E=i.unstable_transitionCallbacks)),i=uv(e,1,!1,null,null,a,l,h,d,v,E,null),e[bn]=i.current,Dd(e),new Xd(i)},Nl.hydrateRoot=function(e,i,a){if(!o(e))throw Error(s(299));var l=!1,h="",d=k_,v=x_,E=U_,I=null,L=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(h=a.identifierPrefix),a.onUncaughtError!==void 0&&(d=a.onUncaughtError),a.onCaughtError!==void 0&&(v=a.onCaughtError),a.onRecoverableError!==void 0&&(E=a.onRecoverableError),a.unstable_transitionCallbacks!==void 0&&(I=a.unstable_transitionCallbacks),a.formState!==void 0&&(L=a.formState)),i=uv(e,1,!0,i,a??null,l,h,d,v,E,I,L),i.context=cv(null),a=i.current,l=yn(),l=ar(l),h=pr(l),h.callback=null,gr(a,h,l),a=l,i.current.lanes=a,Ii(i,a),mi(i),e[bn]=i.current,Dd(e),new Uc(i)},Nl.version="19.1.0",Nl}var Nv;function z1(){if(Nv)return Wd.exports;Nv=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),Wd.exports=L1(),Wd.exports}var B1=z1();const j1=()=>{};var Ov={};/**
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
 */const VE=function(r){const t=[];let n=0;for(let s=0;s<r.length;s++){let o=r.charCodeAt(s);o<128?t[n++]=o:o<2048?(t[n++]=o>>6|192,t[n++]=o&63|128):(o&64512)===55296&&s+1<r.length&&(r.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++s)&1023),t[n++]=o>>18|240,t[n++]=o>>12&63|128,t[n++]=o>>6&63|128,t[n++]=o&63|128):(t[n++]=o>>12|224,t[n++]=o>>6&63|128,t[n++]=o&63|128)}return t},q1=function(r){const t=[];let n=0,s=0;for(;n<r.length;){const o=r[n++];if(o<128)t[s++]=String.fromCharCode(o);else if(o>191&&o<224){const u=r[n++];t[s++]=String.fromCharCode((o&31)<<6|u&63)}else if(o>239&&o<365){const u=r[n++],f=r[n++],m=r[n++],g=((o&7)<<18|(u&63)<<12|(f&63)<<6|m&63)-65536;t[s++]=String.fromCharCode(55296+(g>>10)),t[s++]=String.fromCharCode(56320+(g&1023))}else{const u=r[n++],f=r[n++];t[s++]=String.fromCharCode((o&15)<<12|(u&63)<<6|f&63)}}return t.join("")},PE={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,t){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<r.length;o+=3){const u=r[o],f=o+1<r.length,m=f?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,T=u>>2,S=(u&3)<<4|m>>4;let R=(m&15)<<2|_>>6,z=_&63;g||(z=64,f||(R=64)),s.push(n[T],n[S],n[R],n[z])}return s.join("")},encodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(r):this.encodeByteArray(VE(r),t)},decodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(r):q1(this.decodeStringToByteArray(r,t))},decodeStringToByteArray(r,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<r.length;){const u=n[r.charAt(o++)],m=o<r.length?n[r.charAt(o)]:0;++o;const _=o<r.length?n[r.charAt(o)]:64;++o;const S=o<r.length?n[r.charAt(o)]:64;if(++o,u==null||m==null||_==null||S==null)throw new H1;const R=u<<2|m>>4;if(s.push(R),_!==64){const z=m<<4&240|_>>2;if(s.push(z),S!==64){const X=_<<6&192|S;s.push(X)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class H1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const F1=function(r){const t=VE(r);return PE.encodeByteArray(t,!0)},sh=function(r){return F1(r).replace(/\./g,"")},kE=function(r){try{return PE.decodeString(r,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function G1(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const K1=()=>G1().__FIREBASE_DEFAULTS__,Y1=()=>{if(typeof process>"u"||typeof Ov>"u")return;const r=Ov.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Q1=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=r&&kE(r[1]);return t&&JSON.parse(t)},Oh=()=>{try{return j1()||K1()||Y1()||Q1()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},xE=r=>{var t,n;return(n=(t=Oh())===null||t===void 0?void 0:t.emulatorHosts)===null||n===void 0?void 0:n[r]},UE=r=>{const t=xE(r);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const s=parseInt(t.substring(n+1),10);return t[0]==="["?[t.substring(1,n-1),s]:[t.substring(0,n),s]},LE=()=>{var r;return(r=Oh())===null||r===void 0?void 0:r.config},zE=r=>{var t;return(t=Oh())===null||t===void 0?void 0:t[`_${r}`]};/**
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
 */class X1{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,s))}}}/**
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
 */function Xs(r){return r.endsWith(".cloudworkstations.dev")}async function np(r){return(await fetch(r,{credentials:"include"})).ok}/**
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
 */function BE(r,t){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=t||"demo-project",o=r.iat||0,u=r.sub||r.user_id;if(!u)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const f=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:u,user_id:u,firebase:{sign_in_provider:"custom",identities:{}}},r);return[sh(JSON.stringify(n)),sh(JSON.stringify(f)),""].join(".")}const kl={};function $1(){const r={prod:[],emulator:[]};for(const t of Object.keys(kl))kl[t]?r.emulator.push(t):r.prod.push(t);return r}function Z1(r){let t=document.getElementById(r),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",r),n=!0),{created:n,element:t}}let Dv=!1;function ip(r,t){if(typeof window>"u"||typeof document>"u"||!Xs(window.location.host)||kl[r]===t||kl[r]||Dv)return;kl[r]=t;function n(R){return`__firebase__banner__${R}`}const s="__firebase__banner",u=$1().prod.length>0;function f(){const R=document.getElementById(s);R&&R.remove()}function m(R){R.style.display="flex",R.style.background="#7faaf0",R.style.position="fixed",R.style.bottom="5px",R.style.left="5px",R.style.padding=".5em",R.style.borderRadius="5px",R.style.alignItems="center"}function g(R,z){R.setAttribute("width","24"),R.setAttribute("id",z),R.setAttribute("height","24"),R.setAttribute("viewBox","0 0 24 24"),R.setAttribute("fill","none"),R.style.marginLeft="-6px"}function _(){const R=document.createElement("span");return R.style.cursor="pointer",R.style.marginLeft="16px",R.style.fontSize="24px",R.innerHTML=" &times;",R.onclick=()=>{Dv=!0,f()},R}function T(R,z){R.setAttribute("id",z),R.innerText="Learn more",R.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",R.setAttribute("target","__blank"),R.style.paddingLeft="5px",R.style.textDecoration="underline"}function S(){const R=Z1(s),z=n("text"),X=document.getElementById(z)||document.createElement("span"),tt=n("learnmore"),Y=document.getElementById(tt)||document.createElement("a"),gt=n("preprendIcon"),ut=document.getElementById(gt)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(R.created){const at=R.element;m(at),T(Y,tt);const _t=_();g(ut,gt),at.append(ut,X,Y,_t),document.body.appendChild(at)}u?(X.innerText="Preview backend disconnected.",ut.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ut.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,X.innerText="Preview backend running in this workspace."),X.setAttribute("id",z)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",S):S()}/**
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
 */function Ze(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function W1(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ze())}function J1(){var r;const t=(r=Oh())===null||r===void 0?void 0:r.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function tR(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function jE(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function eR(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function nR(){const r=Ze();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function iR(){return!J1()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function rp(){try{return typeof indexedDB=="object"}catch{return!1}}function sp(){return new Promise((r,t)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),n||self.indexedDB.deleteDatabase(s),r(!0)},o.onupgradeneeded=()=>{n=!1},o.onerror=()=>{var u;t(((u=o.error)===null||u===void 0?void 0:u.message)||"")}}catch(n){t(n)}})}function qE(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const rR="FirebaseError";class zn extends Error{constructor(t,n,s){super(n),this.code=t,this.customData=s,this.name=rR,Object.setPrototypeOf(this,zn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,es.prototype.create)}}class es{constructor(t,n,s){this.service=t,this.serviceName=n,this.errors=s}create(t,...n){const s=n[0]||{},o=`${this.service}/${t}`,u=this.errors[t],f=u?sR(u,s):"Error",m=`${this.serviceName}: ${f} (${o}).`;return new zn(o,m,s)}}function sR(r,t){return r.replace(aR,(n,s)=>{const o=t[s];return o!=null?String(o):`<${s}?>`})}const aR=/\{\$([^}]+)}/g;function oR(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}function Gr(r,t){if(r===t)return!0;const n=Object.keys(r),s=Object.keys(t);for(const o of n){if(!s.includes(o))return!1;const u=r[o],f=t[o];if(Mv(u)&&Mv(f)){if(!Gr(u,f))return!1}else if(u!==f)return!1}for(const o of s)if(!n.includes(o))return!1;return!0}function Mv(r){return r!==null&&typeof r=="object"}/**
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
 */function iu(r){const t=[];for(const[n,s]of Object.entries(r))Array.isArray(s)?s.forEach(o=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(o))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return t.length?"&"+t.join("&"):""}function lR(r,t){const n=new uR(r,t);return n.subscribe.bind(n)}class uR{constructor(t,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{t(this)}).catch(s=>{this.error(s)})}next(t){this.forEachObserver(n=>{n.next(t)})}error(t){this.forEachObserver(n=>{n.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,n,s){let o;if(t===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");cR(t,["next","error","complete"])?o=t:o={next:t,error:n,complete:s},o.next===void 0&&(o.next=nm),o.error===void 0&&(o.error=nm),o.complete===void 0&&(o.complete=nm);const u=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),u}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,t)}sendOne(t,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{n(this.observers[t])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function cR(r,t){if(typeof r!="object"||r===null)return!1;for(const n of t)if(n in r&&typeof r[n]=="function")return!0;return!1}function nm(){}/**
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
 */const hR=1e3,fR=2,dR=4*60*60*1e3,mR=.5;function Vv(r,t=hR,n=fR){const s=t*Math.pow(n,r),o=Math.round(mR*s*(Math.random()-.5)*2);return Math.min(dR,s+o)}/**
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
 */function rn(r){return r&&r._delegate?r._delegate:r}class An{constructor(t,n,s){this.name=t,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */const zs="[DEFAULT]";/**
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
 */class pR{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const s=new X1;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:n});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const s=this.normalizeInstanceIdentifier(t?.identifier),o=(n=t?.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(u){if(o)return null;throw u}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(_R(t))try{this.getOrInitializeService({instanceIdentifier:zs})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(n);try{const u=this.getOrInitializeService({instanceIdentifier:o});s.resolve(u)}catch{}}}}clearInstance(t=zs){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=zs){return this.instances.has(t)}getOptions(t=zs){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,s=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[u,f]of this.instancesDeferred.entries()){const m=this.normalizeInstanceIdentifier(u);s===m&&f.resolve(o)}return o}onInit(t,n){var s;const o=this.normalizeInstanceIdentifier(n),u=(s=this.onInitCallbacks.get(o))!==null&&s!==void 0?s:new Set;u.add(t),this.onInitCallbacks.set(o,u);const f=this.instances.get(o);return f&&t(f,o),()=>{u.delete(t)}}invokeOnInitCallbacks(t,n){const s=this.onInitCallbacks.get(n);if(s)for(const o of s)try{o(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let s=this.instances.get(t);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:gR(t),options:n}),this.instances.set(t,s),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(s,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,s)}catch{}return s||null}normalizeInstanceIdentifier(t=zs){return this.component?this.component.multipleInstances?t:zs:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function gR(r){return r===zs?void 0:r}function _R(r){return r.instantiationMode==="EAGER"}/**
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
 */class yR{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new pR(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Mt;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Mt||(Mt={}));const vR={debug:Mt.DEBUG,verbose:Mt.VERBOSE,info:Mt.INFO,warn:Mt.WARN,error:Mt.ERROR,silent:Mt.SILENT},TR=Mt.INFO,ER={[Mt.DEBUG]:"log",[Mt.VERBOSE]:"log",[Mt.INFO]:"info",[Mt.WARN]:"warn",[Mt.ERROR]:"error"},AR=(r,t,...n)=>{if(t<r.logLevel)return;const s=new Date().toISOString(),o=ER[t];if(o)console[o](`[${s}]  ${r.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class ru{constructor(t){this.name=t,this._logLevel=TR,this._logHandler=AR,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in Mt))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?vR[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,Mt.DEBUG,...t),this._logHandler(this,Mt.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,Mt.VERBOSE,...t),this._logHandler(this,Mt.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,Mt.INFO,...t),this._logHandler(this,Mt.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,Mt.WARN,...t),this._logHandler(this,Mt.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,Mt.ERROR,...t),this._logHandler(this,Mt.ERROR,...t)}}const SR=(r,t)=>t.some(n=>r instanceof n);let Pv,kv;function bR(){return Pv||(Pv=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function RR(){return kv||(kv=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const HE=new WeakMap,Rm=new WeakMap,FE=new WeakMap,im=new WeakMap,ap=new WeakMap;function IR(r){const t=new Promise((n,s)=>{const o=()=>{r.removeEventListener("success",u),r.removeEventListener("error",f)},u=()=>{n(jr(r.result)),o()},f=()=>{s(r.error),o()};r.addEventListener("success",u),r.addEventListener("error",f)});return t.then(n=>{n instanceof IDBCursor&&HE.set(n,r)}).catch(()=>{}),ap.set(t,r),t}function wR(r){if(Rm.has(r))return;const t=new Promise((n,s)=>{const o=()=>{r.removeEventListener("complete",u),r.removeEventListener("error",f),r.removeEventListener("abort",f)},u=()=>{n(),o()},f=()=>{s(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",u),r.addEventListener("error",f),r.addEventListener("abort",f)});Rm.set(r,t)}let Im={get(r,t,n){if(r instanceof IDBTransaction){if(t==="done")return Rm.get(r);if(t==="objectStoreNames")return r.objectStoreNames||FE.get(r);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return jr(r[t])},set(r,t,n){return r[t]=n,!0},has(r,t){return r instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in r}};function CR(r){Im=r(Im)}function NR(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const s=r.call(rm(this),t,...n);return FE.set(s,t.sort?t.sort():[t]),jr(s)}:RR().includes(r)?function(...t){return r.apply(rm(this),t),jr(HE.get(this))}:function(...t){return jr(r.apply(rm(this),t))}}function OR(r){return typeof r=="function"?NR(r):(r instanceof IDBTransaction&&wR(r),SR(r,bR())?new Proxy(r,Im):r)}function jr(r){if(r instanceof IDBRequest)return IR(r);if(im.has(r))return im.get(r);const t=OR(r);return t!==r&&(im.set(r,t),ap.set(t,r)),t}const rm=r=>ap.get(r);function GE(r,t,{blocked:n,upgrade:s,blocking:o,terminated:u}={}){const f=indexedDB.open(r,t),m=jr(f);return s&&f.addEventListener("upgradeneeded",g=>{s(jr(f.result),g.oldVersion,g.newVersion,jr(f.transaction),g)}),n&&f.addEventListener("blocked",g=>n(g.oldVersion,g.newVersion,g)),m.then(g=>{u&&g.addEventListener("close",()=>u()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),m}const DR=["get","getKey","getAll","getAllKeys","count"],MR=["put","add","delete","clear"],sm=new Map;function xv(r,t){if(!(r instanceof IDBDatabase&&!(t in r)&&typeof t=="string"))return;if(sm.get(t))return sm.get(t);const n=t.replace(/FromIndex$/,""),s=t!==n,o=MR.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(o||DR.includes(n)))return;const u=async function(f,...m){const g=this.transaction(f,o?"readwrite":"readonly");let _=g.store;return s&&(_=_.index(m.shift())),(await Promise.all([_[n](...m),o&&g.done]))[0]};return sm.set(t,u),u}CR(r=>({...r,get:(t,n,s)=>xv(t,n)||r.get(t,n,s),has:(t,n)=>!!xv(t,n)||r.has(t,n)}));/**
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
 */class VR{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(PR(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function PR(r){const t=r.getComponent();return t?.type==="VERSION"}const wm="@firebase/app",Uv="0.13.1";/**
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
 */const Ji=new ru("@firebase/app"),kR="@firebase/app-compat",xR="@firebase/analytics-compat",UR="@firebase/analytics",LR="@firebase/app-check-compat",zR="@firebase/app-check",BR="@firebase/auth",jR="@firebase/auth-compat",qR="@firebase/database",HR="@firebase/data-connect",FR="@firebase/database-compat",GR="@firebase/functions",KR="@firebase/functions-compat",YR="@firebase/installations",QR="@firebase/installations-compat",XR="@firebase/messaging",$R="@firebase/messaging-compat",ZR="@firebase/performance",WR="@firebase/performance-compat",JR="@firebase/remote-config",tI="@firebase/remote-config-compat",eI="@firebase/storage",nI="@firebase/storage-compat",iI="@firebase/firestore",rI="@firebase/ai",sI="@firebase/firestore-compat",aI="firebase",oI="11.9.0";/**
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
 */const Cm="[DEFAULT]",lI={[wm]:"fire-core",[kR]:"fire-core-compat",[UR]:"fire-analytics",[xR]:"fire-analytics-compat",[zR]:"fire-app-check",[LR]:"fire-app-check-compat",[BR]:"fire-auth",[jR]:"fire-auth-compat",[qR]:"fire-rtdb",[HR]:"fire-data-connect",[FR]:"fire-rtdb-compat",[GR]:"fire-fn",[KR]:"fire-fn-compat",[YR]:"fire-iid",[QR]:"fire-iid-compat",[XR]:"fire-fcm",[$R]:"fire-fcm-compat",[ZR]:"fire-perf",[WR]:"fire-perf-compat",[JR]:"fire-rc",[tI]:"fire-rc-compat",[eI]:"fire-gcs",[nI]:"fire-gcs-compat",[iI]:"fire-fst",[sI]:"fire-fst-compat",[rI]:"fire-vertex","fire-js":"fire-js",[aI]:"fire-js-all"};/**
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
 */const ah=new Map,uI=new Map,Nm=new Map;function Lv(r,t){try{r.container.addComponent(t)}catch(n){Ji.debug(`Component ${t.name} failed to register with FirebaseApp ${r.name}`,n)}}function Ln(r){const t=r.name;if(Nm.has(t))return Ji.debug(`There were multiple attempts to register component ${t}.`),!1;Nm.set(t,r);for(const n of ah.values())Lv(n,r);for(const n of uI.values())Lv(n,r);return!0}function rr(r,t){const n=r.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),r.container.getProvider(t)}function Qn(r){return r==null?!1:r.settings!==void 0}/**
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
 */const cI={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},qr=new es("app","Firebase",cI);/**
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
 */class hI{constructor(t,n,s){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new An("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw qr.create("app-deleted",{appName:this._name})}}/**
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
 */const $s=oI;function KE(r,t={}){let n=r;typeof t!="object"&&(t={name:t});const s=Object.assign({name:Cm,automaticDataCollectionEnabled:!0},t),o=s.name;if(typeof o!="string"||!o)throw qr.create("bad-app-name",{appName:String(o)});if(n||(n=LE()),!n)throw qr.create("no-options");const u=ah.get(o);if(u){if(Gr(n,u.options)&&Gr(s,u.config))return u;throw qr.create("duplicate-app",{appName:o})}const f=new yR(o);for(const g of Nm.values())f.addComponent(g);const m=new hI(n,s,f);return ah.set(o,m),m}function su(r=Cm){const t=ah.get(r);if(!t&&r===Cm&&LE())return KE();if(!t)throw qr.create("no-app",{appName:r});return t}function $e(r,t,n){var s;let o=(s=lI[r])!==null&&s!==void 0?s:r;n&&(o+=`-${n}`);const u=o.match(/\s|\//),f=t.match(/\s|\//);if(u||f){const m=[`Unable to register library "${o}" with version "${t}":`];u&&m.push(`library name "${o}" contains illegal characters (whitespace or "/")`),u&&f&&m.push("and"),f&&m.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Ji.warn(m.join(" "));return}Ln(new An(`${o}-version`,()=>({library:o,version:t}),"VERSION"))}/**
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
 */const fI="firebase-heartbeat-database",dI=1,Kl="firebase-heartbeat-store";let am=null;function YE(){return am||(am=GE(fI,dI,{upgrade:(r,t)=>{switch(t){case 0:try{r.createObjectStore(Kl)}catch(n){console.warn(n)}}}}).catch(r=>{throw qr.create("idb-open",{originalErrorMessage:r.message})})),am}async function mI(r){try{const n=(await YE()).transaction(Kl),s=await n.objectStore(Kl).get(QE(r));return await n.done,s}catch(t){if(t instanceof zn)Ji.warn(t.message);else{const n=qr.create("idb-get",{originalErrorMessage:t?.message});Ji.warn(n.message)}}}async function zv(r,t){try{const s=(await YE()).transaction(Kl,"readwrite");await s.objectStore(Kl).put(t,QE(r)),await s.done}catch(n){if(n instanceof zn)Ji.warn(n.message);else{const s=qr.create("idb-set",{originalErrorMessage:n?.message});Ji.warn(s.message)}}}function QE(r){return`${r.name}!${r.options.appId}`}/**
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
 */const pI=1024,gI=30;class _I{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new vI(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var t,n;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),u=Bv();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===u||this._heartbeatsCache.heartbeats.some(f=>f.date===u))return;if(this._heartbeatsCache.heartbeats.push({date:u,agent:o}),this._heartbeatsCache.heartbeats.length>gI){const f=TI(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(f,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){Ji.warn(s)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Bv(),{heartbeatsToSend:s,unsentEntries:o}=yI(this._heartbeatsCache.heartbeats),u=sh(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),u}catch(n){return Ji.warn(n),""}}}function Bv(){return new Date().toISOString().substring(0,10)}function yI(r,t=pI){const n=[];let s=r.slice();for(const o of r){const u=n.find(f=>f.agent===o.agent);if(u){if(u.dates.push(o.date),jv(n)>t){u.dates.pop();break}}else if(n.push({agent:o.agent,dates:[o.date]}),jv(n)>t){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class vI{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return rp()?sp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await mI(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return zv(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return zv(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...t.heartbeats]})}else return}}function jv(r){return sh(JSON.stringify({version:2,heartbeats:r})).length}function TI(r){if(r.length===0)return-1;let t=0,n=r[0].date;for(let s=1;s<r.length;s++)r[s].date<n&&(n=r[s].date,t=s);return t}/**
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
 */function EI(r){Ln(new An("platform-logger",t=>new VR(t),"PRIVATE")),Ln(new An("heartbeat",t=>new _I(t),"PRIVATE")),$e(wm,Uv,r),$e(wm,Uv,"esm2017"),$e("fire-js","")}EI("");function op(r,t){var n={};for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&t.indexOf(s)<0&&(n[s]=r[s]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(r);o<s.length;o++)t.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(r,s[o])&&(n[s[o]]=r[s[o]]);return n}function XE(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const AI=XE,$E=new es("auth","Firebase",XE());/**
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
 */const oh=new ru("@firebase/auth");function SI(r,...t){oh.logLevel<=Mt.WARN&&oh.warn(`Auth (${$s}): ${r}`,...t)}function Qc(r,...t){oh.logLevel<=Mt.ERROR&&oh.error(`Auth (${$s}): ${r}`,...t)}/**
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
 */function tr(r,...t){throw lp(r,...t)}function gi(r,...t){return lp(r,...t)}function ZE(r,t,n){const s=Object.assign(Object.assign({},AI()),{[t]:n});return new es("auth","Firebase",s).create(t,{appName:r.name})}function qs(r){return ZE(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function lp(r,...t){if(typeof r!="string"){const n=t[0],s=[...t.slice(1)];return s[0]&&(s[0].appName=r.name),r._errorFactory.create(n,...s)}return $E.create(r,...t)}function Tt(r,t,...n){if(!r)throw lp(t,...n)}function $i(r){const t="INTERNAL ASSERTION FAILED: "+r;throw Qc(t),new Error(t)}function er(r,t){r||$i(t)}/**
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
 */function Om(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function bI(){return qv()==="http:"||qv()==="https:"}function qv(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
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
 */function RI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(bI()||jE()||"connection"in navigator)?navigator.onLine:!0}function II(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
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
 */class au{constructor(t,n){this.shortDelay=t,this.longDelay=n,er(n>t,"Short delay should be less than long delay!"),this.isMobile=W1()||eR()}get(){return RI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function up(r,t){er(r.emulator,"Emulator should always be set here");const{url:n}=r.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}/**
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
 */class WE{static initialize(t,n,s){this.fetchImpl=t,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;$i("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;$i("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;$i("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const wI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const CI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],NI=new au(3e4,6e4);function cp(r,t){return r.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:r.tenantId}):t}async function mo(r,t,n,s,o={}){return JE(r,o,async()=>{let u={},f={};s&&(t==="GET"?f=s:u={body:JSON.stringify(s)});const m=iu(Object.assign({key:r.config.apiKey},f)).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _=Object.assign({method:t,headers:g},u);return tR()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&Xs(r.emulatorConfig.host)&&(_.credentials="include"),WE.fetch()(await t0(r,r.config.apiHost,n,m),_)})}async function JE(r,t,n){r._canInitEmulator=!1;const s=Object.assign(Object.assign({},wI),t);try{const o=new DI(r),u=await Promise.race([n(),o.promise]);o.clearNetworkTimeout();const f=await u.json();if("needConfirmation"in f)throw zc(r,"account-exists-with-different-credential",f);if(u.ok&&!("errorMessage"in f))return f;{const m=u.ok?f.errorMessage:f.error.message,[g,_]=m.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw zc(r,"credential-already-in-use",f);if(g==="EMAIL_EXISTS")throw zc(r,"email-already-in-use",f);if(g==="USER_DISABLED")throw zc(r,"user-disabled",f);const T=s[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw ZE(r,T,_);tr(r,T)}}catch(o){if(o instanceof zn)throw o;tr(r,"network-request-failed",{message:String(o)})}}async function OI(r,t,n,s,o={}){const u=await mo(r,t,n,s,o);return"mfaPendingCredential"in u&&tr(r,"multi-factor-auth-required",{_serverResponse:u}),u}async function t0(r,t,n,s){const o=`${t}${n}?${s}`,u=r,f=u.config.emulator?up(r.config,o):`${r.config.apiScheme}://${o}`;return CI.includes(n)&&(await u._persistenceManagerAvailable,u._getPersistenceType()==="COOKIE")?u._getPersistence()._getFinalTarget(f).toString():f}class DI{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(gi(this.auth,"network-request-failed")),NI.get())})}}function zc(r,t,n){const s={appName:r.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const o=gi(r,t,s);return o.customData._tokenResponse=n,o}/**
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
 */async function MI(r,t){return mo(r,"POST","/v1/accounts:delete",t)}async function lh(r,t){return mo(r,"POST","/v1/accounts:lookup",t)}/**
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
 */function xl(r){if(r)try{const t=new Date(Number(r));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function VI(r,t=!1){const n=rn(r),s=await n.getIdToken(t),o=hp(s);Tt(o&&o.exp&&o.auth_time&&o.iat,n.auth,"internal-error");const u=typeof o.firebase=="object"?o.firebase:void 0,f=u?.sign_in_provider;return{claims:o,token:s,authTime:xl(om(o.auth_time)),issuedAtTime:xl(om(o.iat)),expirationTime:xl(om(o.exp)),signInProvider:f||null,signInSecondFactor:u?.sign_in_second_factor||null}}function om(r){return Number(r)*1e3}function hp(r){const[t,n,s]=r.split(".");if(t===void 0||n===void 0||s===void 0)return Qc("JWT malformed, contained fewer than 3 sections"),null;try{const o=kE(n);return o?JSON.parse(o):(Qc("Failed to decode base64 JWT payload"),null)}catch(o){return Qc("Caught error parsing JWT payload as JSON",o?.toString()),null}}function Hv(r){const t=hp(r);return Tt(t,"internal-error"),Tt(typeof t.exp<"u","internal-error"),Tt(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
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
 */async function Yl(r,t,n=!1){if(n)return t;try{return await t}catch(s){throw s instanceof zn&&PI(s)&&r.auth.currentUser===r&&await r.auth.signOut(),s}}function PI({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
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
 */class kI{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var n;if(t){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const o=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(t=!1){if(!this.isRunning)return;const n=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){t?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Dm{constructor(t,n){this.createdAt=t,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=xl(this.lastLoginAt),this.creationTime=xl(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function uh(r){var t;const n=r.auth,s=await r.getIdToken(),o=await Yl(r,lh(n,{idToken:s}));Tt(o?.users.length,n,"internal-error");const u=o.users[0];r._notifyReloadListener(u);const f=!((t=u.providerUserInfo)===null||t===void 0)&&t.length?e0(u.providerUserInfo):[],m=UI(r.providerData,f),g=r.isAnonymous,_=!(r.email&&u.passwordHash)&&!m?.length,T=g?_:!1,S={uid:u.localId,displayName:u.displayName||null,photoURL:u.photoUrl||null,email:u.email||null,emailVerified:u.emailVerified||!1,phoneNumber:u.phoneNumber||null,tenantId:u.tenantId||null,providerData:m,metadata:new Dm(u.createdAt,u.lastLoginAt),isAnonymous:T};Object.assign(r,S)}async function xI(r){const t=rn(r);await uh(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function UI(r,t){return[...r.filter(s=>!t.some(o=>o.providerId===s.providerId)),...t]}function e0(r){return r.map(t=>{var{providerId:n}=t,s=op(t,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function LI(r,t){const n=await JE(r,{},async()=>{const s=iu({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:o,apiKey:u}=r.config,f=await t0(r,o,"/v1/token",`key=${u}`),m=await r._getAdditionalHeaders();m["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:m,body:s};return r.emulatorConfig&&Xs(r.emulatorConfig.host)&&(g.credentials="include"),WE.fetch()(f,g)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function zI(r,t){return mo(r,"POST","/v2/accounts:revokeToken",cp(r,t))}/**
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
 */class Ja{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){Tt(t.idToken,"internal-error"),Tt(typeof t.idToken<"u","internal-error"),Tt(typeof t.refreshToken<"u","internal-error");const n="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):Hv(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,n)}updateFromIdToken(t){Tt(t.length!==0,"internal-error");const n=Hv(t);this.updateTokensAndExpiration(t,null,n)}async getToken(t,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(Tt(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,n){const{accessToken:s,refreshToken:o,expiresIn:u}=await LI(t,n);this.updateTokensAndExpiration(s,o,Number(u))}updateTokensAndExpiration(t,n,s){this.refreshToken=n||null,this.accessToken=t||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(t,n){const{refreshToken:s,accessToken:o,expirationTime:u}=n,f=new Ja;return s&&(Tt(typeof s=="string","internal-error",{appName:t}),f.refreshToken=s),o&&(Tt(typeof o=="string","internal-error",{appName:t}),f.accessToken=o),u&&(Tt(typeof u=="number","internal-error",{appName:t}),f.expirationTime=u),f}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Ja,this.toJSON())}_performRefresh(){return $i("not implemented")}}/**
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
 */function Pr(r,t){Tt(typeof r=="string"||typeof r>"u","internal-error",{appName:t})}class Xn{constructor(t){var{uid:n,auth:s,stsTokenManager:o}=t,u=op(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=u.displayName||null,this.email=u.email||null,this.emailVerified=u.emailVerified||!1,this.phoneNumber=u.phoneNumber||null,this.photoURL=u.photoURL||null,this.isAnonymous=u.isAnonymous||!1,this.tenantId=u.tenantId||null,this.providerData=u.providerData?[...u.providerData]:[],this.metadata=new Dm(u.createdAt||void 0,u.lastLoginAt||void 0)}async getIdToken(t){const n=await Yl(this,this.stsTokenManager.getToken(this.auth,t));return Tt(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(t){return VI(this,t)}reload(){return xI(this)}_assign(t){this!==t&&(Tt(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(n=>Object.assign({},n)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const n=new Xn(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(t){Tt(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,n=!1){let s=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),s=!0),n&&await uh(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Qn(this.auth.app))return Promise.reject(qs(this.auth));const t=await this.getIdToken();return await Yl(this,MI(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,n){var s,o,u,f,m,g,_,T;const S=(s=n.displayName)!==null&&s!==void 0?s:void 0,R=(o=n.email)!==null&&o!==void 0?o:void 0,z=(u=n.phoneNumber)!==null&&u!==void 0?u:void 0,X=(f=n.photoURL)!==null&&f!==void 0?f:void 0,tt=(m=n.tenantId)!==null&&m!==void 0?m:void 0,Y=(g=n._redirectEventId)!==null&&g!==void 0?g:void 0,gt=(_=n.createdAt)!==null&&_!==void 0?_:void 0,ut=(T=n.lastLoginAt)!==null&&T!==void 0?T:void 0,{uid:at,emailVerified:_t,isAnonymous:ht,providerData:Rt,stsTokenManager:M}=n;Tt(at&&M,t,"internal-error");const b=Ja.fromJSON(this.name,M);Tt(typeof at=="string",t,"internal-error"),Pr(S,t.name),Pr(R,t.name),Tt(typeof _t=="boolean",t,"internal-error"),Tt(typeof ht=="boolean",t,"internal-error"),Pr(z,t.name),Pr(X,t.name),Pr(tt,t.name),Pr(Y,t.name),Pr(gt,t.name),Pr(ut,t.name);const w=new Xn({uid:at,auth:t,email:R,emailVerified:_t,displayName:S,isAnonymous:ht,photoURL:X,phoneNumber:z,tenantId:tt,stsTokenManager:b,createdAt:gt,lastLoginAt:ut});return Rt&&Array.isArray(Rt)&&(w.providerData=Rt.map(D=>Object.assign({},D))),Y&&(w._redirectEventId=Y),w}static async _fromIdTokenResponse(t,n,s=!1){const o=new Ja;o.updateFromServerResponse(n);const u=new Xn({uid:n.localId,auth:t,stsTokenManager:o,isAnonymous:s});return await uh(u),u}static async _fromGetAccountInfoResponse(t,n,s){const o=n.users[0];Tt(o.localId!==void 0,"internal-error");const u=o.providerUserInfo!==void 0?e0(o.providerUserInfo):[],f=!(o.email&&o.passwordHash)&&!u?.length,m=new Ja;m.updateFromIdToken(s);const g=new Xn({uid:o.localId,auth:t,stsTokenManager:m,isAnonymous:f}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new Dm(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!u?.length};return Object.assign(g,_),g}}/**
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
 */const Fv=new Map;function Zi(r){er(r instanceof Function,"Expected a class definition");let t=Fv.get(r);return t?(er(t instanceof r,"Instance stored in cache mismatched with class"),t):(t=new r,Fv.set(r,t),t)}/**
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
 */class n0{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,n){this.storage[t]=n}async _get(t){const n=this.storage[t];return n===void 0?null:n}async _remove(t){delete this.storage[t]}_addListener(t,n){}_removeListener(t,n){}}n0.type="NONE";const Gv=n0;/**
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
 */function Xc(r,t,n){return`firebase:${r}:${t}:${n}`}class to{constructor(t,n,s){this.persistence=t,this.auth=n,this.userKey=s;const{config:o,name:u}=this.auth;this.fullUserKey=Xc(this.userKey,o.apiKey,u),this.fullPersistenceKey=Xc("persistence",o.apiKey,u),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const n=await lh(this.auth,{idToken:t}).catch(()=>{});return n?Xn._fromGetAccountInfoResponse(this.auth,n,t):null}return Xn._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,n,s="authUser"){if(!n.length)return new to(Zi(Gv),t,s);const o=(await Promise.all(n.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let u=o[0]||Zi(Gv);const f=Xc(s,t.config.apiKey,t.name);let m=null;for(const _ of n)try{const T=await _._get(f);if(T){let S;if(typeof T=="string"){const R=await lh(t,{idToken:T}).catch(()=>{});if(!R)break;S=await Xn._fromGetAccountInfoResponse(t,R,T)}else S=Xn._fromJSON(t,T);_!==u&&(m=S),u=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!u._shouldAllowMigration||!g.length?new to(u,t,s):(u=g[0],m&&await u._set(f,m.toJSON()),await Promise.all(n.map(async _=>{if(_!==u)try{await _._remove(f)}catch{}})),new to(u,t,s))}}/**
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
 */function Kv(r){const t=r.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(a0(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(i0(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(l0(t))return"Blackberry";if(u0(t))return"Webos";if(r0(t))return"Safari";if((t.includes("chrome/")||s0(t))&&!t.includes("edge/"))return"Chrome";if(o0(t))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=r.match(n);if(s?.length===2)return s[1]}return"Other"}function i0(r=Ze()){return/firefox\//i.test(r)}function r0(r=Ze()){const t=r.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function s0(r=Ze()){return/crios\//i.test(r)}function a0(r=Ze()){return/iemobile/i.test(r)}function o0(r=Ze()){return/android/i.test(r)}function l0(r=Ze()){return/blackberry/i.test(r)}function u0(r=Ze()){return/webos/i.test(r)}function fp(r=Ze()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function BI(r=Ze()){var t;return fp(r)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function jI(){return nR()&&document.documentMode===10}function c0(r=Ze()){return fp(r)||o0(r)||u0(r)||l0(r)||/windows phone/i.test(r)||a0(r)}/**
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
 */function h0(r,t=[]){let n;switch(r){case"Browser":n=Kv(Ze());break;case"Worker":n=`${Kv(Ze())}-${r}`;break;default:n=r}const s=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${$s}/${s}`}/**
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
 */class qI{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,n){const s=u=>new Promise((f,m)=>{try{const g=t(u);f(g)}catch(g){m(g)}});s.onAbort=n,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const n=[];try{for(const s of this.queue)await s(t),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const o of n)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s?.message})}}}/**
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
 */async function HI(r,t={}){return mo(r,"GET","/v2/passwordPolicy",cp(r,t))}/**
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
 */const FI=6;class GI{constructor(t){var n,s,o,u;const f=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=f.minPasswordLength)!==null&&n!==void 0?n:FI,f.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=f.maxPasswordLength),f.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=f.containsLowercaseCharacter),f.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=f.containsUppercaseCharacter),f.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=f.containsNumericCharacter),f.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=f.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(s=t.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(u=t.forceUpgradeOnSignin)!==null&&u!==void 0?u:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var n,s,o,u,f,m;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,g),this.validatePasswordCharacterOptions(t,g),g.isValid&&(g.isValid=(n=g.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),g.isValid&&(g.isValid=(s=g.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(u=g.containsUppercaseLetter)!==null&&u!==void 0?u:!0),g.isValid&&(g.isValid=(f=g.containsNumericCharacter)!==null&&f!==void 0?f:!0),g.isValid&&(g.isValid=(m=g.containsNonAlphanumericCharacter)!==null&&m!==void 0?m:!0),g}validatePasswordLengthOptions(t,n){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=t.length>=s),o&&(n.meetsMaxPasswordLength=t.length<=o)}validatePasswordCharacterOptions(t,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let o=0;o<t.length;o++)s=t.charAt(o),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(t,n,s,o,u){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=u))}}/**
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
 */class KI{constructor(t,n,s,o){this.app=t,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Yv(this),this.idTokenSubscription=new Yv(this),this.beforeStateQueue=new qI(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$E,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(u=>this._resolvePersistenceManagerAvailable=u)}_initializeWithPersistence(t,n){return n&&(this._popupRedirectResolver=Zi(n)),this._initializationPromise=this.queue(async()=>{var s,o,u;if(!this._deleted&&(this.persistenceManager=await to.create(this,t),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((u=this.currentUser)===null||u===void 0?void 0:u.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const n=await lh(this,{idToken:t}),s=await Xn._fromGetAccountInfoResponse(this,n,t);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var n;if(Qn(this.app)){const f=this.app.settings.authIdToken;return f?new Promise(m=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(f).then(m,m))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let o=s,u=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const f=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,m=o?._redirectEventId,g=await this.tryRedirectSignIn(t);(!f||f===m)&&g?.user&&(o=g.user,u=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(u)try{await this.beforeStateQueue.runMiddleware(o)}catch(f){o=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(f))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return Tt(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(t){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(t){try{await uh(t)}catch(n){if(n?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=II()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(Qn(this.app))return Promise.reject(qs(this));const n=t?rn(t):null;return n&&Tt(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(t,n=!1){if(!this._deleted)return t&&Tt(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return Qn(this.app)?Promise.reject(qs(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return Qn(this.app)?Promise.reject(qs(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Zi(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await HI(this),n=new GI(t);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new es("auth","Firebase",t())}onAuthStateChanged(t,n,s){return this.registerStateListener(this.authStateSubscription,t,n,s)}beforeAuthStateChanged(t,n){return this.beforeStateQueue.pushCallback(t,n)}onIdTokenChanged(t,n,s){return this.registerStateListener(this.idTokenSubscription,t,n,s)}authStateReady(){return new Promise((t,n)=>{if(this.currentUser)t();else{const s=this.onAuthStateChanged(()=>{s(),t()},n)}})}async revokeAccessToken(t){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await zI(this,s)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,n){const s=await this.getOrInitRedirectPersistenceManager(n);return t===null?s.removeCurrentUser():s.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const n=t&&Zi(t)||this._popupRedirectResolver;Tt(n,this,"argument-error"),this.redirectPersistenceManager=await to.create(this,[Zi(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===t?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,n,s,o){if(this._deleted)return()=>{};const u=typeof n=="function"?n:n.next.bind(n);let f=!1;const m=this._isInitialized?Promise.resolve():this._initializationPromise;if(Tt(m,this,"internal-error"),m.then(()=>{f||u(this.currentUser)}),typeof n=="function"){const g=t.addObserver(n,s,o);return()=>{f=!0,g()}}else{const g=t.addObserver(n);return()=>{f=!0,g()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return Tt(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=h0(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const o=await this._getAppCheckToken();return o&&(n["X-Firebase-AppCheck"]=o),n}async _getAppCheckToken(){var t;if(Qn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const n=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return n?.error&&SI(`Error while retrieving App Check token: ${n.error}`),n?.token}}function dp(r){return rn(r)}class Yv{constructor(t){this.auth=t,this.observer=null,this.addObserver=lR(n=>this.observer=n)}get next(){return Tt(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let mp={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function YI(r){mp=r}function QI(r){return mp.loadJS(r)}function XI(){return mp.gapiScript}function $I(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
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
 */function ZI(r,t){const n=rr(r,"auth");if(n.isInitialized()){const o=n.getImmediate(),u=n.getOptions();if(Gr(u,t??{}))return o;tr(o,"already-initialized")}return n.initialize({options:t})}function WI(r,t){const n=t?.persistence||[],s=(Array.isArray(n)?n:[n]).map(Zi);t?.errorMap&&r._updateErrorMap(t.errorMap),r._initializeWithPersistence(s,t?.popupRedirectResolver)}function JI(r,t,n){const s=dp(r);Tt(/^https?:\/\//.test(t),s,"invalid-emulator-scheme");const o=!1,u=f0(t),{host:f,port:m}=tw(t),g=m===null?"":`:${m}`,_={url:`${u}//${f}${g}/`},T=Object.freeze({host:f,port:m,protocol:u.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){Tt(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),Tt(Gr(_,s.config.emulator)&&Gr(T,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=_,s.emulatorConfig=T,s.settings.appVerificationDisabledForTesting=!0,Xs(f)?(np(`${u}//${f}${g}`),ip("Auth",!0)):ew()}function f0(r){const t=r.indexOf(":");return t<0?"":r.substr(0,t+1)}function tw(r){const t=f0(r),n=/(\/\/)?([^?#/]+)/.exec(r.substr(t.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const u=o[1];return{host:u,port:Qv(s.substr(u.length+1))}}else{const[u,f]=s.split(":");return{host:u,port:Qv(f)}}}function Qv(r){if(!r)return null;const t=Number(r);return isNaN(t)?null:t}function ew(){function r(){const t=document.createElement("p"),n=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
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
 */class d0{constructor(t,n){this.providerId=t,this.signInMethod=n}toJSON(){return $i("not implemented")}_getIdTokenResponse(t){return $i("not implemented")}_linkToIdToken(t,n){return $i("not implemented")}_getReauthenticationResolver(t){return $i("not implemented")}}/**
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
 */async function eo(r,t){return OI(r,"POST","/v1/accounts:signInWithIdp",cp(r,t))}/**
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
 */const nw="http://localhost";class Fs extends d0{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const n=new Fs(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(n.idToken=t.idToken),t.accessToken&&(n.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(n.nonce=t.nonce),t.pendingToken&&(n.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(n.accessToken=t.oauthToken,n.secret=t.oauthTokenSecret):tr("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const n=typeof t=="string"?JSON.parse(t):t,{providerId:s,signInMethod:o}=n,u=op(n,["providerId","signInMethod"]);if(!s||!o)return null;const f=new Fs(s,o);return f.idToken=u.idToken||void 0,f.accessToken=u.accessToken||void 0,f.secret=u.secret,f.nonce=u.nonce,f.pendingToken=u.pendingToken||null,f}_getIdTokenResponse(t){const n=this.buildRequest();return eo(t,n)}_linkToIdToken(t,n){const s=this.buildRequest();return s.idToken=n,eo(t,s)}_getReauthenticationResolver(t){const n=this.buildRequest();return n.autoCreate=!1,eo(t,n)}buildRequest(){const t={requestUri:nw,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),t.postBody=iu(n)}return t}}/**
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
 */class m0{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ou extends m0{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
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
 */class kr extends ou{constructor(){super("facebook.com")}static credential(t){return Fs._fromParams({providerId:kr.PROVIDER_ID,signInMethod:kr.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return kr.credentialFromTaggedObject(t)}static credentialFromError(t){return kr.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return kr.credential(t.oauthAccessToken)}catch{return null}}}kr.FACEBOOK_SIGN_IN_METHOD="facebook.com";kr.PROVIDER_ID="facebook.com";/**
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
 */class xr extends ou{constructor(){super("google.com"),this.addScope("profile")}static credential(t,n){return Fs._fromParams({providerId:xr.PROVIDER_ID,signInMethod:xr.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:n})}static credentialFromResult(t){return xr.credentialFromTaggedObject(t)}static credentialFromError(t){return xr.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:n,oauthAccessToken:s}=t;if(!n&&!s)return null;try{return xr.credential(n,s)}catch{return null}}}xr.GOOGLE_SIGN_IN_METHOD="google.com";xr.PROVIDER_ID="google.com";/**
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
 */class Ur extends ou{constructor(){super("github.com")}static credential(t){return Fs._fromParams({providerId:Ur.PROVIDER_ID,signInMethod:Ur.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return Ur.credentialFromTaggedObject(t)}static credentialFromError(t){return Ur.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return Ur.credential(t.oauthAccessToken)}catch{return null}}}Ur.GITHUB_SIGN_IN_METHOD="github.com";Ur.PROVIDER_ID="github.com";/**
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
 */class Lr extends ou{constructor(){super("twitter.com")}static credential(t,n){return Fs._fromParams({providerId:Lr.PROVIDER_ID,signInMethod:Lr.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:n})}static credentialFromResult(t){return Lr.credentialFromTaggedObject(t)}static credentialFromError(t){return Lr.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=t;if(!n||!s)return null;try{return Lr.credential(n,s)}catch{return null}}}Lr.TWITTER_SIGN_IN_METHOD="twitter.com";Lr.PROVIDER_ID="twitter.com";/**
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
 */class so{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,n,s,o=!1){const u=await Xn._fromIdTokenResponse(t,s,o),f=Xv(s);return new so({user:u,providerId:f,_tokenResponse:s,operationType:n})}static async _forOperation(t,n,s){await t._updateTokensIfNecessary(s,!0);const o=Xv(s);return new so({user:t,providerId:o,_tokenResponse:s,operationType:n})}}function Xv(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
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
 */class ch extends zn{constructor(t,n,s,o){var u;super(n.code,n.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,ch.prototype),this.customData={appName:t.name,tenantId:(u=t.tenantId)!==null&&u!==void 0?u:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(t,n,s,o){return new ch(t,n,s,o)}}function p0(r,t,n,s){return(t==="reauthenticate"?n._getReauthenticationResolver(r):n._getIdTokenResponse(r)).catch(u=>{throw u.code==="auth/multi-factor-auth-required"?ch._fromErrorAndOperation(r,u,t,s):u})}async function iw(r,t,n=!1){const s=await Yl(r,t._linkToIdToken(r.auth,await r.getIdToken()),n);return so._forOperation(r,"link",s)}/**
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
 */async function rw(r,t,n=!1){const{auth:s}=r;if(Qn(s.app))return Promise.reject(qs(s));const o="reauthenticate";try{const u=await Yl(r,p0(s,o,t,r),n);Tt(u.idToken,s,"internal-error");const f=hp(u.idToken);Tt(f,s,"internal-error");const{sub:m}=f;return Tt(r.uid===m,s,"user-mismatch"),so._forOperation(r,o,u)}catch(u){throw u?.code==="auth/user-not-found"&&tr(s,"user-mismatch"),u}}/**
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
 */async function sw(r,t,n=!1){if(Qn(r.app))return Promise.reject(qs(r));const s="signIn",o=await p0(r,s,t),u=await so._fromIdTokenResponse(r,s,o);return n||await r._updateCurrentUser(u.user),u}function aw(r,t,n,s){return rn(r).onIdTokenChanged(t,n,s)}function ow(r,t,n){return rn(r).beforeAuthStateChanged(t,n)}function lw(r,t,n,s){return rn(r).onAuthStateChanged(t,n,s)}const hh="__sak";/**
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
 */class g0{constructor(t,n){this.storageRetriever=t,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(hh,"1"),this.storage.removeItem(hh),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,n){return this.storage.setItem(t,JSON.stringify(n)),Promise.resolve()}_get(t){const n=this.storage.getItem(t);return Promise.resolve(n?JSON.parse(n):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const uw=1e3,cw=10;class _0 extends g0{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,n)=>this.onStorageEvent(t,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=c0(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),o=this.localCache[n];s!==o&&t(n,o,s)}}onStorageEvent(t,n=!1){if(!t.key){this.forAllChangedKeys((f,m,g)=>{this.notifyListeners(f,g)});return}const s=t.key;n?this.detachListener():this.stopPolling();const o=()=>{const f=this.storage.getItem(s);!n&&this.localCache[s]===f||this.notifyListeners(s,f)},u=this.storage.getItem(s);jI()&&u!==t.newValue&&t.newValue!==t.oldValue?setTimeout(o,cw):o()}notifyListeners(t,n){this.localCache[t]=n;const s=this.listeners[t];if(s)for(const o of Array.from(s))o(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:n,newValue:s}),!0)})},uw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,n){await super._set(t,n),this.localCache[t]=JSON.stringify(n)}async _get(t){const n=await super._get(t);return this.localCache[t]=JSON.stringify(n),n}async _remove(t){await super._remove(t),delete this.localCache[t]}}_0.type="LOCAL";const hw=_0;/**
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
 */class y0 extends g0{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,n){}_removeListener(t,n){}}y0.type="SESSION";const v0=y0;/**
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
 */function fw(r){return Promise.all(r.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Dh{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const n=this.receivers.find(o=>o.isListeningto(t));if(n)return n;const s=new Dh(t);return this.receivers.push(s),s}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const n=t,{eventId:s,eventType:o,data:u}=n.data,f=this.handlersMap[o];if(!f?.size)return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const m=Array.from(f).map(async _=>_(n.origin,u)),g=await fw(m);n.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:g})}_subscribe(t,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(n)}_unsubscribe(t,n){this.handlersMap[t]&&n&&this.handlersMap[t].delete(n),(!n||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Dh.receivers=[];/**
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
 */function pp(r="",t=10){let n="";for(let s=0;s<t;s++)n+=Math.floor(Math.random()*10);return r+n}/**
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
 */class dw{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,n,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let u,f;return new Promise((m,g)=>{const _=pp("",20);o.port1.start();const T=setTimeout(()=>{g(new Error("unsupported_event"))},s);f={messageChannel:o,onMessage(S){const R=S;if(R.data.eventId===_)switch(R.data.status){case"ack":clearTimeout(T),u=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(u),m(R.data.response);break;default:clearTimeout(T),clearTimeout(u),g(new Error("invalid_response"));break}}},this.handlers.add(f),o.port1.addEventListener("message",f.onMessage),this.target.postMessage({eventType:t,eventId:_,data:n},[o.port2])}).finally(()=>{f&&this.removeMessageHandler(f)})}}/**
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
 */function _i(){return window}function mw(r){_i().location.href=r}/**
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
 */function T0(){return typeof _i().WorkerGlobalScope<"u"&&typeof _i().importScripts=="function"}async function pw(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function gw(){var r;return((r=navigator?.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function _w(){return T0()?self:null}/**
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
 */const E0="firebaseLocalStorageDb",yw=1,fh="firebaseLocalStorage",A0="fbase_key";class lu{constructor(t){this.request=t}toPromise(){return new Promise((t,n)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Mh(r,t){return r.transaction([fh],t?"readwrite":"readonly").objectStore(fh)}function vw(){const r=indexedDB.deleteDatabase(E0);return new lu(r).toPromise()}function Mm(){const r=indexedDB.open(E0,yw);return new Promise((t,n)=>{r.addEventListener("error",()=>{n(r.error)}),r.addEventListener("upgradeneeded",()=>{const s=r.result;try{s.createObjectStore(fh,{keyPath:A0})}catch(o){n(o)}}),r.addEventListener("success",async()=>{const s=r.result;s.objectStoreNames.contains(fh)?t(s):(s.close(),await vw(),t(await Mm()))})})}async function $v(r,t,n){const s=Mh(r,!0).put({[A0]:t,value:n});return new lu(s).toPromise()}async function Tw(r,t){const n=Mh(r,!1).get(t),s=await new lu(n).toPromise();return s===void 0?null:s.value}function Zv(r,t){const n=Mh(r,!0).delete(t);return new lu(n).toPromise()}const Ew=800,Aw=3;class S0{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Mm(),this.db)}async _withRetries(t){let n=0;for(;;)try{const s=await this._openDb();return await t(s)}catch(s){if(n++>Aw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return T0()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Dh._getInstance(_w()),this.receiver._subscribe("keyChanged",async(t,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(t,n)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await pw(),!this.activeServiceWorker)return;this.sender=new dw(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((t=s[0])===null||t===void 0)&&t.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||gw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await Mm();return await $v(t,hh,"1"),await Zv(t,hh),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>$v(s,t,n)),this.localCache[t]=n,this.notifyServiceWorker(t)))}async _get(t){const n=await this._withRetries(s=>Tw(s,t));return this.localCache[t]=n,n}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Zv(n,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(o=>{const u=Mh(o,!1).getAll();return new lu(u).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(t.length!==0)for(const{fbase_key:o,value:u}of t)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(u)&&(this.notifyListeners(o,u),n.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),n.push(o));return n}notifyListeners(t,n){this.localCache[t]=n;const s=this.listeners[t];if(s)for(const o of Array.from(s))o(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ew)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}S0.type="LOCAL";const Sw=S0;new au(3e4,6e4);/**
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
 */function bw(r,t){return t?Zi(t):(Tt(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
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
 */class gp extends d0{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return eo(t,this._buildIdpRequest())}_linkToIdToken(t,n){return eo(t,this._buildIdpRequest(n))}_getReauthenticationResolver(t){return eo(t,this._buildIdpRequest())}_buildIdpRequest(t){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(n.idToken=t),n}}function Rw(r){return sw(r.auth,new gp(r),r.bypassAuthState)}function Iw(r){const{auth:t,user:n}=r;return Tt(n,t,"internal-error"),rw(n,new gp(r),r.bypassAuthState)}async function ww(r){const{auth:t,user:n}=r;return Tt(n,t,"internal-error"),iw(n,new gp(r),r.bypassAuthState)}/**
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
 */class b0{constructor(t,n,s,o,u=!1){this.auth=t,this.resolver=s,this.user=o,this.bypassAuthState=u,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(t,n)=>{this.pendingPromise={resolve:t,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(t){const{urlResponse:n,sessionId:s,postBody:o,tenantId:u,error:f,type:m}=t;if(f){this.reject(f);return}const g={auth:this.auth,requestUri:n,sessionId:s,tenantId:u||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(m)(g))}catch(_){this.reject(_)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return Rw;case"linkViaPopup":case"linkViaRedirect":return ww;case"reauthViaPopup":case"reauthViaRedirect":return Iw;default:tr(this.auth,"internal-error")}}resolve(t){er(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){er(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Cw=new au(2e3,1e4);class Za extends b0{constructor(t,n,s,o,u){super(t,n,o,u),this.provider=s,this.authWindow=null,this.pollId=null,Za.currentPopupAction&&Za.currentPopupAction.cancel(),Za.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return Tt(t,this.auth,"internal-error"),t}async onExecution(){er(this.filter.length===1,"Popup operations only handle one event");const t=pp();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(gi(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(gi(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Za.currentPopupAction=null}pollUserCancellation(){const t=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(gi(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Cw.get())};t()}}Za.currentPopupAction=null;/**
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
 */const Nw="pendingRedirect",$c=new Map;class Ow extends b0{constructor(t,n,s=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let t=$c.get(this.auth._key());if(!t){try{const s=await Dw(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(s)}catch(n){t=()=>Promise.reject(n)}$c.set(this.auth._key(),t)}return this.bypassAuthState||$c.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const n=await this.auth._redirectUserForId(t.eventId);if(n)return this.user=n,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Dw(r,t){const n=Pw(t),s=Vw(r);if(!await s._isAvailable())return!1;const o=await s._get(n)==="true";return await s._remove(n),o}function Mw(r,t){$c.set(r._key(),t)}function Vw(r){return Zi(r._redirectPersistence)}function Pw(r){return Xc(Nw,r.config.apiKey,r.name)}async function kw(r,t,n=!1){if(Qn(r.app))return Promise.reject(qs(r));const s=dp(r),o=bw(s,t),f=await new Ow(s,o,n).execute();return f&&!n&&(delete f.user._redirectEventId,await s._persistUserIfCurrent(f.user),await s._setRedirectUser(null,t)),f}/**
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
 */const xw=10*60*1e3;class Uw{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(t,s)&&(n=!0,this.sendToConsumer(t,s),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!Lw(t)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=t,n=!0)),n}sendToConsumer(t,n){var s;if(t.error&&!R0(t)){const o=((s=t.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(gi(this.auth,o))}else n.onAuthEvent(t)}isEventForConsumer(t,n){const s=n.eventId===null||!!t.eventId&&t.eventId===n.eventId;return n.filter.includes(t.type)&&s}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=xw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Wv(t))}saveEventToCache(t){this.cachedEventUids.add(Wv(t)),this.lastProcessedEventTime=Date.now()}}function Wv(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(t=>t).join("-")}function R0({type:r,error:t}){return r==="unknown"&&t?.code==="auth/no-auth-event"}function Lw(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return R0(r);default:return!1}}/**
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
 */async function zw(r,t={}){return mo(r,"GET","/v1/projects",t)}/**
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
 */const Bw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,jw=/^https?/;async function qw(r){if(r.config.emulator)return;const{authorizedDomains:t}=await zw(r);for(const n of t)try{if(Hw(n))return}catch{}tr(r,"unauthorized-domain")}function Hw(r){const t=Om(),{protocol:n,hostname:s}=new URL(t);if(r.startsWith("chrome-extension://")){const f=new URL(r);return f.hostname===""&&s===""?n==="chrome-extension:"&&r.replace("chrome-extension://","")===t.replace("chrome-extension://",""):n==="chrome-extension:"&&f.hostname===s}if(!jw.test(n))return!1;if(Bw.test(r))return s===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
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
 */const Fw=new au(3e4,6e4);function Jv(){const r=_i().___jsl;if(r?.H){for(const t of Object.keys(r.H))if(r.H[t].r=r.H[t].r||[],r.H[t].L=r.H[t].L||[],r.H[t].r=[...r.H[t].L],r.CP)for(let n=0;n<r.CP.length;n++)r.CP[n]=null}}function Gw(r){return new Promise((t,n)=>{var s,o,u;function f(){Jv(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Jv(),n(gi(r,"network-request-failed"))},timeout:Fw.get()})}if(!((o=(s=_i().gapi)===null||s===void 0?void 0:s.iframes)===null||o===void 0)&&o.Iframe)t(gapi.iframes.getContext());else if(!((u=_i().gapi)===null||u===void 0)&&u.load)f();else{const m=$I("iframefcb");return _i()[m]=()=>{gapi.load?f():n(gi(r,"network-request-failed"))},QI(`${XI()}?onload=${m}`).catch(g=>n(g))}}).catch(t=>{throw Zc=null,t})}let Zc=null;function Kw(r){return Zc=Zc||Gw(r),Zc}/**
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
 */const Yw=new au(5e3,15e3),Qw="__/auth/iframe",Xw="emulator/auth/iframe",$w={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Zw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ww(r){const t=r.config;Tt(t.authDomain,r,"auth-domain-config-required");const n=t.emulator?up(t,Xw):`https://${r.config.authDomain}/${Qw}`,s={apiKey:t.apiKey,appName:r.name,v:$s},o=Zw.get(r.config.apiHost);o&&(s.eid=o);const u=r._getFrameworks();return u.length&&(s.fw=u.join(",")),`${n}?${iu(s).slice(1)}`}async function Jw(r){const t=await Kw(r),n=_i().gapi;return Tt(n,r,"internal-error"),t.open({where:document.body,url:Ww(r),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:$w,dontclear:!0},s=>new Promise(async(o,u)=>{await s.restyle({setHideOnLeave:!1});const f=gi(r,"network-request-failed"),m=_i().setTimeout(()=>{u(f)},Yw.get());function g(){_i().clearTimeout(m),o(s)}s.ping(g).then(g,()=>{u(f)})}))}/**
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
 */const tC={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},eC=500,nC=600,iC="_blank",rC="http://localhost";class tT{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function sC(r,t,n,s=eC,o=nC){const u=Math.max((window.screen.availHeight-o)/2,0).toString(),f=Math.max((window.screen.availWidth-s)/2,0).toString();let m="";const g=Object.assign(Object.assign({},tC),{width:s.toString(),height:o.toString(),top:u,left:f}),_=Ze().toLowerCase();n&&(m=s0(_)?iC:n),i0(_)&&(t=t||rC,g.scrollbars="yes");const T=Object.entries(g).reduce((R,[z,X])=>`${R}${z}=${X},`,"");if(BI(_)&&m!=="_self")return aC(t||"",m),new tT(null);const S=window.open(t||"",m,T);Tt(S,r,"popup-blocked");try{S.focus()}catch{}return new tT(S)}function aC(r,t){const n=document.createElement("a");n.href=r,n.target=t;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const oC="__/auth/handler",lC="emulator/auth/handler",uC=encodeURIComponent("fac");async function eT(r,t,n,s,o,u){Tt(r.config.authDomain,r,"auth-domain-config-required"),Tt(r.config.apiKey,r,"invalid-api-key");const f={apiKey:r.config.apiKey,appName:r.name,authType:n,redirectUrl:s,v:$s,eventId:o};if(t instanceof m0){t.setDefaultLanguage(r.languageCode),f.providerId=t.providerId||"",oR(t.getCustomParameters())||(f.customParameters=JSON.stringify(t.getCustomParameters()));for(const[T,S]of Object.entries({}))f[T]=S}if(t instanceof ou){const T=t.getScopes().filter(S=>S!=="");T.length>0&&(f.scopes=T.join(","))}r.tenantId&&(f.tid=r.tenantId);const m=f;for(const T of Object.keys(m))m[T]===void 0&&delete m[T];const g=await r._getAppCheckToken(),_=g?`#${uC}=${encodeURIComponent(g)}`:"";return`${cC(r)}?${iu(m).slice(1)}${_}`}function cC({config:r}){return r.emulator?up(r,lC):`https://${r.authDomain}/${oC}`}/**
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
 */const lm="webStorageSupport";class hC{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=v0,this._completeRedirectFn=kw,this._overrideRedirectResult=Mw}async _openPopup(t,n,s,o){var u;er((u=this.eventManagers[t._key()])===null||u===void 0?void 0:u.manager,"_initialize() not called before _openPopup()");const f=await eT(t,n,s,Om(),o);return sC(t,f,pp())}async _openRedirect(t,n,s,o){await this._originValidation(t);const u=await eT(t,n,s,Om(),o);return mw(u),new Promise(()=>{})}_initialize(t){const n=t._key();if(this.eventManagers[n]){const{manager:o,promise:u}=this.eventManagers[n];return o?Promise.resolve(o):(er(u,"If manager is not set, promise should be"),u)}const s=this.initAndGetManager(t);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(t){const n=await Jw(t),s=new Uw(t);return n.register("authEvent",o=>(Tt(o?.authEvent,t,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:s},this.iframes[t._key()]=n,s}_isIframeWebStorageSupported(t,n){this.iframes[t._key()].send(lm,{type:lm},o=>{var u;const f=(u=o?.[0])===null||u===void 0?void 0:u[lm];f!==void 0&&n(!!f),tr(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const n=t._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=qw(t)),this.originValidationPromises[n]}get _shouldInitProactively(){return c0()||r0()||fp()}}const fC=hC;var nT="@firebase/auth",iT="1.10.7";/**
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
 */class dC{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const n=this.auth.onIdTokenChanged(s=>{t(s?.stsTokenManager.accessToken||null)});this.internalListeners.set(t,n),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const n=this.internalListeners.get(t);n&&(this.internalListeners.delete(t),n(),this.updateProactiveRefresh())}assertAuthConfigured(){Tt(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function mC(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function pC(r){Ln(new An("auth",(t,{options:n})=>{const s=t.getProvider("app").getImmediate(),o=t.getProvider("heartbeat"),u=t.getProvider("app-check-internal"),{apiKey:f,authDomain:m}=s.options;Tt(f&&!f.includes(":"),"invalid-api-key",{appName:s.name});const g={apiKey:f,authDomain:m,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:h0(r)},_=new KI(s,o,u,g);return WI(_,n),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,n,s)=>{t.getProvider("auth-internal").initialize()})),Ln(new An("auth-internal",t=>{const n=dp(t.getProvider("auth").getImmediate());return(s=>new dC(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),$e(nT,iT,mC(r)),$e(nT,iT,"esm2017")}/**
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
 */const gC=5*60,_C=zE("authIdTokenMaxAge")||gC;let rT=null;const yC=r=>async t=>{const n=t&&await t.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>_C)return;const o=n?.token;rT!==o&&(rT=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function vC(r=su()){const t=rr(r,"auth");if(t.isInitialized())return t.getImmediate();const n=ZI(r,{popupRedirectResolver:fC,persistence:[Sw,hw,v0]}),s=zE("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const u=new URL(s,location.origin);if(location.origin===u.origin){const f=yC(u.toString());ow(n,f,()=>f(n.currentUser)),aw(n,m=>f(m))}}const o=xE("auth");return o&&JI(n,`http://${o}`),n}function TC(){var r,t;return(t=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&t!==void 0?t:document}YI({loadJS(r){return new Promise((t,n)=>{const s=document.createElement("script");s.setAttribute("src",r),s.onload=t,s.onerror=o=>{const u=gi("internal-error");u.customData=o,n(u)},s.type="text/javascript",s.charset="UTF-8",TC().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});pC("Browser");var EC="firebase",AC="11.9.1";/**
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
 */$e(EC,AC,"app");var sT=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Hr,I0;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(M,b){function w(){}w.prototype=b.prototype,M.D=b.prototype,M.prototype=new w,M.prototype.constructor=M,M.C=function(D,V,k){for(var C=Array(arguments.length-2),Pe=2;Pe<arguments.length;Pe++)C[Pe-2]=arguments[Pe];return b.prototype[V].apply(D,C)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(M,b,w){w||(w=0);var D=Array(16);if(typeof b=="string")for(var V=0;16>V;++V)D[V]=b.charCodeAt(w++)|b.charCodeAt(w++)<<8|b.charCodeAt(w++)<<16|b.charCodeAt(w++)<<24;else for(V=0;16>V;++V)D[V]=b[w++]|b[w++]<<8|b[w++]<<16|b[w++]<<24;b=M.g[0],w=M.g[1],V=M.g[2];var k=M.g[3],C=b+(k^w&(V^k))+D[0]+3614090360&4294967295;b=w+(C<<7&4294967295|C>>>25),C=k+(V^b&(w^V))+D[1]+3905402710&4294967295,k=b+(C<<12&4294967295|C>>>20),C=V+(w^k&(b^w))+D[2]+606105819&4294967295,V=k+(C<<17&4294967295|C>>>15),C=w+(b^V&(k^b))+D[3]+3250441966&4294967295,w=V+(C<<22&4294967295|C>>>10),C=b+(k^w&(V^k))+D[4]+4118548399&4294967295,b=w+(C<<7&4294967295|C>>>25),C=k+(V^b&(w^V))+D[5]+1200080426&4294967295,k=b+(C<<12&4294967295|C>>>20),C=V+(w^k&(b^w))+D[6]+2821735955&4294967295,V=k+(C<<17&4294967295|C>>>15),C=w+(b^V&(k^b))+D[7]+4249261313&4294967295,w=V+(C<<22&4294967295|C>>>10),C=b+(k^w&(V^k))+D[8]+1770035416&4294967295,b=w+(C<<7&4294967295|C>>>25),C=k+(V^b&(w^V))+D[9]+2336552879&4294967295,k=b+(C<<12&4294967295|C>>>20),C=V+(w^k&(b^w))+D[10]+4294925233&4294967295,V=k+(C<<17&4294967295|C>>>15),C=w+(b^V&(k^b))+D[11]+2304563134&4294967295,w=V+(C<<22&4294967295|C>>>10),C=b+(k^w&(V^k))+D[12]+1804603682&4294967295,b=w+(C<<7&4294967295|C>>>25),C=k+(V^b&(w^V))+D[13]+4254626195&4294967295,k=b+(C<<12&4294967295|C>>>20),C=V+(w^k&(b^w))+D[14]+2792965006&4294967295,V=k+(C<<17&4294967295|C>>>15),C=w+(b^V&(k^b))+D[15]+1236535329&4294967295,w=V+(C<<22&4294967295|C>>>10),C=b+(V^k&(w^V))+D[1]+4129170786&4294967295,b=w+(C<<5&4294967295|C>>>27),C=k+(w^V&(b^w))+D[6]+3225465664&4294967295,k=b+(C<<9&4294967295|C>>>23),C=V+(b^w&(k^b))+D[11]+643717713&4294967295,V=k+(C<<14&4294967295|C>>>18),C=w+(k^b&(V^k))+D[0]+3921069994&4294967295,w=V+(C<<20&4294967295|C>>>12),C=b+(V^k&(w^V))+D[5]+3593408605&4294967295,b=w+(C<<5&4294967295|C>>>27),C=k+(w^V&(b^w))+D[10]+38016083&4294967295,k=b+(C<<9&4294967295|C>>>23),C=V+(b^w&(k^b))+D[15]+3634488961&4294967295,V=k+(C<<14&4294967295|C>>>18),C=w+(k^b&(V^k))+D[4]+3889429448&4294967295,w=V+(C<<20&4294967295|C>>>12),C=b+(V^k&(w^V))+D[9]+568446438&4294967295,b=w+(C<<5&4294967295|C>>>27),C=k+(w^V&(b^w))+D[14]+3275163606&4294967295,k=b+(C<<9&4294967295|C>>>23),C=V+(b^w&(k^b))+D[3]+4107603335&4294967295,V=k+(C<<14&4294967295|C>>>18),C=w+(k^b&(V^k))+D[8]+1163531501&4294967295,w=V+(C<<20&4294967295|C>>>12),C=b+(V^k&(w^V))+D[13]+2850285829&4294967295,b=w+(C<<5&4294967295|C>>>27),C=k+(w^V&(b^w))+D[2]+4243563512&4294967295,k=b+(C<<9&4294967295|C>>>23),C=V+(b^w&(k^b))+D[7]+1735328473&4294967295,V=k+(C<<14&4294967295|C>>>18),C=w+(k^b&(V^k))+D[12]+2368359562&4294967295,w=V+(C<<20&4294967295|C>>>12),C=b+(w^V^k)+D[5]+4294588738&4294967295,b=w+(C<<4&4294967295|C>>>28),C=k+(b^w^V)+D[8]+2272392833&4294967295,k=b+(C<<11&4294967295|C>>>21),C=V+(k^b^w)+D[11]+1839030562&4294967295,V=k+(C<<16&4294967295|C>>>16),C=w+(V^k^b)+D[14]+4259657740&4294967295,w=V+(C<<23&4294967295|C>>>9),C=b+(w^V^k)+D[1]+2763975236&4294967295,b=w+(C<<4&4294967295|C>>>28),C=k+(b^w^V)+D[4]+1272893353&4294967295,k=b+(C<<11&4294967295|C>>>21),C=V+(k^b^w)+D[7]+4139469664&4294967295,V=k+(C<<16&4294967295|C>>>16),C=w+(V^k^b)+D[10]+3200236656&4294967295,w=V+(C<<23&4294967295|C>>>9),C=b+(w^V^k)+D[13]+681279174&4294967295,b=w+(C<<4&4294967295|C>>>28),C=k+(b^w^V)+D[0]+3936430074&4294967295,k=b+(C<<11&4294967295|C>>>21),C=V+(k^b^w)+D[3]+3572445317&4294967295,V=k+(C<<16&4294967295|C>>>16),C=w+(V^k^b)+D[6]+76029189&4294967295,w=V+(C<<23&4294967295|C>>>9),C=b+(w^V^k)+D[9]+3654602809&4294967295,b=w+(C<<4&4294967295|C>>>28),C=k+(b^w^V)+D[12]+3873151461&4294967295,k=b+(C<<11&4294967295|C>>>21),C=V+(k^b^w)+D[15]+530742520&4294967295,V=k+(C<<16&4294967295|C>>>16),C=w+(V^k^b)+D[2]+3299628645&4294967295,w=V+(C<<23&4294967295|C>>>9),C=b+(V^(w|~k))+D[0]+4096336452&4294967295,b=w+(C<<6&4294967295|C>>>26),C=k+(w^(b|~V))+D[7]+1126891415&4294967295,k=b+(C<<10&4294967295|C>>>22),C=V+(b^(k|~w))+D[14]+2878612391&4294967295,V=k+(C<<15&4294967295|C>>>17),C=w+(k^(V|~b))+D[5]+4237533241&4294967295,w=V+(C<<21&4294967295|C>>>11),C=b+(V^(w|~k))+D[12]+1700485571&4294967295,b=w+(C<<6&4294967295|C>>>26),C=k+(w^(b|~V))+D[3]+2399980690&4294967295,k=b+(C<<10&4294967295|C>>>22),C=V+(b^(k|~w))+D[10]+4293915773&4294967295,V=k+(C<<15&4294967295|C>>>17),C=w+(k^(V|~b))+D[1]+2240044497&4294967295,w=V+(C<<21&4294967295|C>>>11),C=b+(V^(w|~k))+D[8]+1873313359&4294967295,b=w+(C<<6&4294967295|C>>>26),C=k+(w^(b|~V))+D[15]+4264355552&4294967295,k=b+(C<<10&4294967295|C>>>22),C=V+(b^(k|~w))+D[6]+2734768916&4294967295,V=k+(C<<15&4294967295|C>>>17),C=w+(k^(V|~b))+D[13]+1309151649&4294967295,w=V+(C<<21&4294967295|C>>>11),C=b+(V^(w|~k))+D[4]+4149444226&4294967295,b=w+(C<<6&4294967295|C>>>26),C=k+(w^(b|~V))+D[11]+3174756917&4294967295,k=b+(C<<10&4294967295|C>>>22),C=V+(b^(k|~w))+D[2]+718787259&4294967295,V=k+(C<<15&4294967295|C>>>17),C=w+(k^(V|~b))+D[9]+3951481745&4294967295,M.g[0]=M.g[0]+b&4294967295,M.g[1]=M.g[1]+(V+(C<<21&4294967295|C>>>11))&4294967295,M.g[2]=M.g[2]+V&4294967295,M.g[3]=M.g[3]+k&4294967295}s.prototype.u=function(M,b){b===void 0&&(b=M.length);for(var w=b-this.blockSize,D=this.B,V=this.h,k=0;k<b;){if(V==0)for(;k<=w;)o(this,M,k),k+=this.blockSize;if(typeof M=="string"){for(;k<b;)if(D[V++]=M.charCodeAt(k++),V==this.blockSize){o(this,D),V=0;break}}else for(;k<b;)if(D[V++]=M[k++],V==this.blockSize){o(this,D),V=0;break}}this.h=V,this.o+=b},s.prototype.v=function(){var M=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);M[0]=128;for(var b=1;b<M.length-8;++b)M[b]=0;var w=8*this.o;for(b=M.length-8;b<M.length;++b)M[b]=w&255,w/=256;for(this.u(M),M=Array(16),b=w=0;4>b;++b)for(var D=0;32>D;D+=8)M[w++]=this.g[b]>>>D&255;return M};function u(M,b){var w=m;return Object.prototype.hasOwnProperty.call(w,M)?w[M]:w[M]=b(M)}function f(M,b){this.h=b;for(var w=[],D=!0,V=M.length-1;0<=V;V--){var k=M[V]|0;D&&k==b||(w[V]=k,D=!1)}this.g=w}var m={};function g(M){return-128<=M&&128>M?u(M,function(b){return new f([b|0],0>b?-1:0)}):new f([M|0],0>M?-1:0)}function _(M){if(isNaN(M)||!isFinite(M))return S;if(0>M)return Y(_(-M));for(var b=[],w=1,D=0;M>=w;D++)b[D]=M/w|0,w*=4294967296;return new f(b,0)}function T(M,b){if(M.length==0)throw Error("number format error: empty string");if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(M.charAt(0)=="-")return Y(T(M.substring(1),b));if(0<=M.indexOf("-"))throw Error('number format error: interior "-" character');for(var w=_(Math.pow(b,8)),D=S,V=0;V<M.length;V+=8){var k=Math.min(8,M.length-V),C=parseInt(M.substring(V,V+k),b);8>k?(k=_(Math.pow(b,k)),D=D.j(k).add(_(C))):(D=D.j(w),D=D.add(_(C)))}return D}var S=g(0),R=g(1),z=g(16777216);r=f.prototype,r.m=function(){if(tt(this))return-Y(this).m();for(var M=0,b=1,w=0;w<this.g.length;w++){var D=this.i(w);M+=(0<=D?D:4294967296+D)*b,b*=4294967296}return M},r.toString=function(M){if(M=M||10,2>M||36<M)throw Error("radix out of range: "+M);if(X(this))return"0";if(tt(this))return"-"+Y(this).toString(M);for(var b=_(Math.pow(M,6)),w=this,D="";;){var V=_t(w,b).g;w=gt(w,V.j(b));var k=((0<w.g.length?w.g[0]:w.h)>>>0).toString(M);if(w=V,X(w))return k+D;for(;6>k.length;)k="0"+k;D=k+D}},r.i=function(M){return 0>M?0:M<this.g.length?this.g[M]:this.h};function X(M){if(M.h!=0)return!1;for(var b=0;b<M.g.length;b++)if(M.g[b]!=0)return!1;return!0}function tt(M){return M.h==-1}r.l=function(M){return M=gt(this,M),tt(M)?-1:X(M)?0:1};function Y(M){for(var b=M.g.length,w=[],D=0;D<b;D++)w[D]=~M.g[D];return new f(w,~M.h).add(R)}r.abs=function(){return tt(this)?Y(this):this},r.add=function(M){for(var b=Math.max(this.g.length,M.g.length),w=[],D=0,V=0;V<=b;V++){var k=D+(this.i(V)&65535)+(M.i(V)&65535),C=(k>>>16)+(this.i(V)>>>16)+(M.i(V)>>>16);D=C>>>16,k&=65535,C&=65535,w[V]=C<<16|k}return new f(w,w[w.length-1]&-2147483648?-1:0)};function gt(M,b){return M.add(Y(b))}r.j=function(M){if(X(this)||X(M))return S;if(tt(this))return tt(M)?Y(this).j(Y(M)):Y(Y(this).j(M));if(tt(M))return Y(this.j(Y(M)));if(0>this.l(z)&&0>M.l(z))return _(this.m()*M.m());for(var b=this.g.length+M.g.length,w=[],D=0;D<2*b;D++)w[D]=0;for(D=0;D<this.g.length;D++)for(var V=0;V<M.g.length;V++){var k=this.i(D)>>>16,C=this.i(D)&65535,Pe=M.i(V)>>>16,re=M.i(V)&65535;w[2*D+2*V]+=C*re,ut(w,2*D+2*V),w[2*D+2*V+1]+=k*re,ut(w,2*D+2*V+1),w[2*D+2*V+1]+=C*Pe,ut(w,2*D+2*V+1),w[2*D+2*V+2]+=k*Pe,ut(w,2*D+2*V+2)}for(D=0;D<b;D++)w[D]=w[2*D+1]<<16|w[2*D];for(D=b;D<2*b;D++)w[D]=0;return new f(w,0)};function ut(M,b){for(;(M[b]&65535)!=M[b];)M[b+1]+=M[b]>>>16,M[b]&=65535,b++}function at(M,b){this.g=M,this.h=b}function _t(M,b){if(X(b))throw Error("division by zero");if(X(M))return new at(S,S);if(tt(M))return b=_t(Y(M),b),new at(Y(b.g),Y(b.h));if(tt(b))return b=_t(M,Y(b)),new at(Y(b.g),b.h);if(30<M.g.length){if(tt(M)||tt(b))throw Error("slowDivide_ only works with positive integers.");for(var w=R,D=b;0>=D.l(M);)w=ht(w),D=ht(D);var V=Rt(w,1),k=Rt(D,1);for(D=Rt(D,2),w=Rt(w,2);!X(D);){var C=k.add(D);0>=C.l(M)&&(V=V.add(w),k=C),D=Rt(D,1),w=Rt(w,1)}return b=gt(M,V.j(b)),new at(V,b)}for(V=S;0<=M.l(b);){for(w=Math.max(1,Math.floor(M.m()/b.m())),D=Math.ceil(Math.log(w)/Math.LN2),D=48>=D?1:Math.pow(2,D-48),k=_(w),C=k.j(b);tt(C)||0<C.l(M);)w-=D,k=_(w),C=k.j(b);X(k)&&(k=R),V=V.add(k),M=gt(M,C)}return new at(V,M)}r.A=function(M){return _t(this,M).h},r.and=function(M){for(var b=Math.max(this.g.length,M.g.length),w=[],D=0;D<b;D++)w[D]=this.i(D)&M.i(D);return new f(w,this.h&M.h)},r.or=function(M){for(var b=Math.max(this.g.length,M.g.length),w=[],D=0;D<b;D++)w[D]=this.i(D)|M.i(D);return new f(w,this.h|M.h)},r.xor=function(M){for(var b=Math.max(this.g.length,M.g.length),w=[],D=0;D<b;D++)w[D]=this.i(D)^M.i(D);return new f(w,this.h^M.h)};function ht(M){for(var b=M.g.length+1,w=[],D=0;D<b;D++)w[D]=M.i(D)<<1|M.i(D-1)>>>31;return new f(w,M.h)}function Rt(M,b){var w=b>>5;b%=32;for(var D=M.g.length-w,V=[],k=0;k<D;k++)V[k]=0<b?M.i(k+w)>>>b|M.i(k+w+1)<<32-b:M.i(k+w);return new f(V,M.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,I0=s,f.prototype.add=f.prototype.add,f.prototype.multiply=f.prototype.j,f.prototype.modulo=f.prototype.A,f.prototype.compare=f.prototype.l,f.prototype.toNumber=f.prototype.m,f.prototype.toString=f.prototype.toString,f.prototype.getBits=f.prototype.i,f.fromNumber=_,f.fromString=T,Hr=f}).apply(typeof sT<"u"?sT:typeof self<"u"?self:typeof window<"u"?window:{});var Bc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var w0,Dl,C0,Wc,Vm,N0,O0,D0;(function(){var r,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(c,p,y){return c==Array.prototype||c==Object.prototype||(c[p]=y.value),c};function n(c){c=[typeof globalThis=="object"&&globalThis,c,typeof window=="object"&&window,typeof self=="object"&&self,typeof Bc=="object"&&Bc];for(var p=0;p<c.length;++p){var y=c[p];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var s=n(this);function o(c,p){if(p)t:{var y=s;c=c.split(".");for(var A=0;A<c.length-1;A++){var x=c[A];if(!(x in y))break t;y=y[x]}c=c[c.length-1],A=y[c],p=p(A),p!=A&&p!=null&&t(y,c,{configurable:!0,writable:!0,value:p})}}function u(c,p){c instanceof String&&(c+="");var y=0,A=!1,x={next:function(){if(!A&&y<c.length){var q=y++;return{value:p(q,c[q]),done:!1}}return A=!0,{done:!0,value:void 0}}};return x[Symbol.iterator]=function(){return x},x}o("Array.prototype.values",function(c){return c||function(){return u(this,function(p,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var f=f||{},m=this||self;function g(c){var p=typeof c;return p=p!="object"?p:c?Array.isArray(c)?"array":p:"null",p=="array"||p=="object"&&typeof c.length=="number"}function _(c){var p=typeof c;return p=="object"&&c!=null||p=="function"}function T(c,p,y){return c.call.apply(c.bind,arguments)}function S(c,p,y){if(!c)throw Error();if(2<arguments.length){var A=Array.prototype.slice.call(arguments,2);return function(){var x=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(x,A),c.apply(p,x)}}return function(){return c.apply(p,arguments)}}function R(c,p,y){return R=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?T:S,R.apply(null,arguments)}function z(c,p){var y=Array.prototype.slice.call(arguments,1);return function(){var A=y.slice();return A.push.apply(A,arguments),c.apply(this,A)}}function X(c,p){function y(){}y.prototype=p.prototype,c.aa=p.prototype,c.prototype=new y,c.prototype.constructor=c,c.Qb=function(A,x,q){for(var et=Array(arguments.length-2),Pt=2;Pt<arguments.length;Pt++)et[Pt-2]=arguments[Pt];return p.prototype[x].apply(A,et)}}function tt(c){const p=c.length;if(0<p){const y=Array(p);for(let A=0;A<p;A++)y[A]=c[A];return y}return[]}function Y(c,p){for(let y=1;y<arguments.length;y++){const A=arguments[y];if(g(A)){const x=c.length||0,q=A.length||0;c.length=x+q;for(let et=0;et<q;et++)c[x+et]=A[et]}else c.push(A)}}class gt{constructor(p,y){this.i=p,this.j=y,this.h=0,this.g=null}get(){let p;return 0<this.h?(this.h--,p=this.g,this.g=p.next,p.next=null):p=this.i(),p}}function ut(c){return/^[\s\xa0]*$/.test(c)}function at(){var c=m.navigator;return c&&(c=c.userAgent)?c:""}function _t(c){return _t[" "](c),c}_t[" "]=function(){};var ht=at().indexOf("Gecko")!=-1&&!(at().toLowerCase().indexOf("webkit")!=-1&&at().indexOf("Edge")==-1)&&!(at().indexOf("Trident")!=-1||at().indexOf("MSIE")!=-1)&&at().indexOf("Edge")==-1;function Rt(c,p,y){for(const A in c)p.call(y,c[A],A,c)}function M(c,p){for(const y in c)p.call(void 0,c[y],y,c)}function b(c){const p={};for(const y in c)p[y]=c[y];return p}const w="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function D(c,p){let y,A;for(let x=1;x<arguments.length;x++){A=arguments[x];for(y in A)c[y]=A[y];for(let q=0;q<w.length;q++)y=w[q],Object.prototype.hasOwnProperty.call(A,y)&&(c[y]=A[y])}}function V(c){var p=1;c=c.split(":");const y=[];for(;0<p&&c.length;)y.push(c.shift()),p--;return c.length&&y.push(c.join(":")),y}function k(c){m.setTimeout(()=>{throw c},0)}function C(){var c=zt;let p=null;return c.g&&(p=c.g,c.g=c.g.next,c.g||(c.h=null),p.next=null),p}class Pe{constructor(){this.h=this.g=null}add(p,y){const A=re.get();A.set(p,y),this.h?this.h.next=A:this.g=A,this.h=A}}var re=new gt(()=>new F,c=>c.reset());class F{constructor(){this.next=this.g=this.h=null}set(p,y){this.h=p,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let nt,lt=!1,zt=new Pe,N=()=>{const c=m.Promise.resolve(void 0);nt=()=>{c.then(Z)}};var Z=()=>{for(var c;c=C();){try{c.h.call(c.g)}catch(y){k(y)}var p=re;p.j(c),100>p.h&&(p.h++,c.next=p.g,p.g=c)}lt=!1};function it(){this.s=this.s,this.C=this.C}it.prototype.s=!1,it.prototype.ma=function(){this.s||(this.s=!0,this.N())},it.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function J(c,p){this.type=c,this.g=this.target=p,this.defaultPrevented=!1}J.prototype.h=function(){this.defaultPrevented=!0};var ct=function(){if(!m.addEventListener||!Object.defineProperty)return!1;var c=!1,p=Object.defineProperty({},"passive",{get:function(){c=!0}});try{const y=()=>{};m.addEventListener("test",y,p),m.removeEventListener("test",y,p)}catch{}return c}();function Ct(c,p){if(J.call(this,c?c.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,c){var y=this.type=c.type,A=c.changedTouches&&c.changedTouches.length?c.changedTouches[0]:null;if(this.target=c.target||c.srcElement,this.g=p,p=c.relatedTarget){if(ht){t:{try{_t(p.nodeName);var x=!0;break t}catch{}x=!1}x||(p=null)}}else y=="mouseover"?p=c.fromElement:y=="mouseout"&&(p=c.toElement);this.relatedTarget=p,A?(this.clientX=A.clientX!==void 0?A.clientX:A.pageX,this.clientY=A.clientY!==void 0?A.clientY:A.pageY,this.screenX=A.screenX||0,this.screenY=A.screenY||0):(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0),this.button=c.button,this.key=c.key||"",this.ctrlKey=c.ctrlKey,this.altKey=c.altKey,this.shiftKey=c.shiftKey,this.metaKey=c.metaKey,this.pointerId=c.pointerId||0,this.pointerType=typeof c.pointerType=="string"?c.pointerType:Et[c.pointerType]||"",this.state=c.state,this.i=c,c.defaultPrevented&&Ct.aa.h.call(this)}}X(Ct,J);var Et={2:"touch",3:"pen",4:"mouse"};Ct.prototype.h=function(){Ct.aa.h.call(this);var c=this.i;c.preventDefault?c.preventDefault():c.returnValue=!1};var we="closure_listenable_"+(1e6*Math.random()|0),Zt=0;function Wn(c,p,y,A,x){this.listener=c,this.proxy=null,this.src=p,this.type=y,this.capture=!!A,this.ha=x,this.key=++Zt,this.da=this.fa=!1}function sr(c){c.da=!0,c.listener=null,c.proxy=null,c.src=null,c.ha=null}function bi(c){this.src=c,this.g={},this.h=0}bi.prototype.add=function(c,p,y,A,x){var q=c.toString();c=this.g[q],c||(c=this.g[q]=[],this.h++);var et=is(c,p,A,x);return-1<et?(p=c[et],y||(p.fa=!1)):(p=new Wn(p,this.src,q,!!A,x),p.fa=y,c.push(p)),p};function ns(c,p){var y=p.type;if(y in c.g){var A=c.g[y],x=Array.prototype.indexOf.call(A,p,void 0),q;(q=0<=x)&&Array.prototype.splice.call(A,x,1),q&&(sr(p),c.g[y].length==0&&(delete c.g[y],c.h--))}}function is(c,p,y,A){for(var x=0;x<c.length;++x){var q=c[x];if(!q.da&&q.listener==p&&q.capture==!!y&&q.ha==A)return x}return-1}var rs="closure_lm_"+(1e6*Math.random()|0),To={};function pu(c,p,y,A,x){if(Array.isArray(p)){for(var q=0;q<p.length;q++)pu(c,p[q],y,A,x);return null}return y=gu(y),c&&c[we]?c.K(p,y,_(A)?!!A.capture:!1,x):Sn(c,p,y,!1,A,x)}function Sn(c,p,y,A,x,q){if(!p)throw Error("Invalid event type");var et=_(x)?!!x.capture:!!x,Pt=na(c);if(Pt||(c[rs]=Pt=new bi(c)),y=Pt.add(p,y,A,et,q),y.proxy)return y;if(A=Xh(),y.proxy=A,A.src=c,A.listener=y,c.addEventListener)ct||(x=et),x===void 0&&(x=!1),c.addEventListener(p.toString(),A,x);else if(c.attachEvent)c.attachEvent(ss(p.toString()),A);else if(c.addListener&&c.removeListener)c.addListener(A);else throw Error("addEventListener and attachEvent are unavailable.");return y}function Xh(){function c(y){return p.call(c.src,c.listener,y)}const p=$h;return c}function Eo(c,p,y,A,x){if(Array.isArray(p))for(var q=0;q<p.length;q++)Eo(c,p[q],y,A,x);else A=_(A)?!!A.capture:!!A,y=gu(y),c&&c[we]?(c=c.i,p=String(p).toString(),p in c.g&&(q=c.g[p],y=is(q,y,A,x),-1<y&&(sr(q[y]),Array.prototype.splice.call(q,y,1),q.length==0&&(delete c.g[p],c.h--)))):c&&(c=na(c))&&(p=c.g[p.toString()],c=-1,p&&(c=is(p,y,A,x)),(y=-1<c?p[c]:null)&&ea(y))}function ea(c){if(typeof c!="number"&&c&&!c.da){var p=c.src;if(p&&p[we])ns(p.i,c);else{var y=c.type,A=c.proxy;p.removeEventListener?p.removeEventListener(y,A,c.capture):p.detachEvent?p.detachEvent(ss(y),A):p.addListener&&p.removeListener&&p.removeListener(A),(y=na(p))?(ns(y,c),y.h==0&&(y.src=null,p[rs]=null)):sr(c)}}}function ss(c){return c in To?To[c]:To[c]="on"+c}function $h(c,p){if(c.da)c=!0;else{p=new Ct(p,this);var y=c.listener,A=c.ha||c.src;c.fa&&ea(c),c=y.call(A,p)}return c}function na(c){return c=c[rs],c instanceof bi?c:null}var Ao="__closure_events_fn_"+(1e9*Math.random()>>>0);function gu(c){return typeof c=="function"?c:(c[Ao]||(c[Ao]=function(p){return c.handleEvent(p)}),c[Ao])}function se(){it.call(this),this.i=new bi(this),this.M=this,this.F=null}X(se,it),se.prototype[we]=!0,se.prototype.removeEventListener=function(c,p,y,A){Eo(this,c,p,y,A)};function Ht(c,p){var y,A=c.F;if(A)for(y=[];A;A=A.F)y.push(A);if(c=c.M,A=p.type||p,typeof p=="string")p=new J(p,c);else if(p instanceof J)p.target=p.target||c;else{var x=p;p=new J(A,c),D(p,x)}if(x=!0,y)for(var q=y.length-1;0<=q;q--){var et=p.g=y[q];x=hn(et,A,!0,p)&&x}if(et=p.g=c,x=hn(et,A,!0,p)&&x,x=hn(et,A,!1,p)&&x,y)for(q=0;q<y.length;q++)et=p.g=y[q],x=hn(et,A,!1,p)&&x}se.prototype.N=function(){if(se.aa.N.call(this),this.i){var c=this.i,p;for(p in c.g){for(var y=c.g[p],A=0;A<y.length;A++)sr(y[A]);delete c.g[p],c.h--}}this.F=null},se.prototype.K=function(c,p,y,A){return this.i.add(String(c),p,!1,y,A)},se.prototype.L=function(c,p,y,A){return this.i.add(String(c),p,!0,y,A)};function hn(c,p,y,A){if(p=c.i.g[String(p)],!p)return!0;p=p.concat();for(var x=!0,q=0;q<p.length;++q){var et=p[q];if(et&&!et.da&&et.capture==y){var Pt=et.listener,ve=et.ha||et.src;et.fa&&ns(c.i,et),x=Pt.call(ve,A)!==!1&&x}}return x&&!A.defaultPrevented}function He(c,p,y){if(typeof c=="function")y&&(c=R(c,y));else if(c&&typeof c.handleEvent=="function")c=R(c.handleEvent,c);else throw Error("Invalid listener argument");return 2147483647<Number(p)?-1:m.setTimeout(c,p||0)}function _u(c){c.g=He(()=>{c.g=null,c.i&&(c.i=!1,_u(c))},c.l);const p=c.h;c.h=null,c.m.apply(null,p)}class Zh extends it{constructor(p,y){super(),this.m=p,this.l=y,this.h=null,this.i=!1,this.g=null}j(p){this.h=arguments,this.g?this.i=!0:_u(this)}N(){super.N(),this.g&&(m.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function as(c){it.call(this),this.h=c,this.g={}}X(as,it);var os=[];function ls(c){Rt(c.g,function(p,y){this.g.hasOwnProperty(y)&&ea(p)},c),c.g={}}as.prototype.N=function(){as.aa.N.call(this),ls(this)},as.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Bn=m.JSON.stringify,ia=m.JSON.parse,us=class{stringify(c){return m.JSON.stringify(c,void 0)}parse(c){return m.JSON.parse(c,void 0)}};function So(){}So.prototype.h=null;function bo(c){return c.h||(c.h=c.i())}function Ro(){}var Ri={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ii(){J.call(this,"d")}X(Ii,J);function Io(){J.call(this,"c")}X(Io,J);var Jn={},wo=null;function ar(){return wo=wo||new se}Jn.La="serverreachability";function ra(c){J.call(this,Jn.La,c)}X(ra,J);function or(c){const p=ar();Ht(p,new ra(p))}Jn.STAT_EVENT="statevent";function yu(c,p){J.call(this,Jn.STAT_EVENT,c),this.stat=p}X(yu,J);function Jt(c){const p=ar();Ht(p,new yu(p,c))}Jn.Ma="timingevent";function ye(c,p){J.call(this,Jn.Ma,c),this.size=p}X(ye,J);function de(c,p){if(typeof c!="function")throw Error("Fn must not be null and must be a function");return m.setTimeout(function(){c()},p)}function bn(){this.g=!0}bn.prototype.xa=function(){this.g=!1};function Co(c,p,y,A,x,q){c.info(function(){if(c.g)if(q)for(var et="",Pt=q.split("&"),ve=0;ve<Pt.length;ve++){var kt=Pt[ve].split("=");if(1<kt.length){var Ne=kt[0];kt=kt[1];var Te=Ne.split("_");et=2<=Te.length&&Te[1]=="type"?et+(Ne+"="+kt+"&"):et+(Ne+"=redacted&")}}else et=null;else et=q;return"XMLHTTP REQ ("+A+") [attempt "+x+"]: "+p+`
`+y+`
`+et})}function Wh(c,p,y,A,x,q,et){c.info(function(){return"XMLHTTP RESP ("+A+") [ attempt "+x+"]: "+p+`
`+y+`
`+q+" "+et})}function lr(c,p,y,A){c.info(function(){return"XMLHTTP TEXT ("+p+"): "+cs(c,y)+(A?" "+A:"")})}function vu(c,p){c.info(function(){return"TIMEOUT: "+p})}bn.prototype.info=function(){};function cs(c,p){if(!c.g)return p;if(!p)return null;try{var y=JSON.parse(p);if(y){for(c=0;c<y.length;c++)if(Array.isArray(y[c])){var A=y[c];if(!(2>A.length)){var x=A[1];if(Array.isArray(x)&&!(1>x.length)){var q=x[0];if(q!="noop"&&q!="stop"&&q!="close")for(var et=1;et<x.length;et++)x[et]=""}}}}return Bn(y)}catch{return p}}var ur={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},wi={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ti;function ei(){}X(ei,So),ei.prototype.g=function(){return new XMLHttpRequest},ei.prototype.i=function(){return{}},ti=new ei;function We(c,p,y,A){this.j=c,this.i=p,this.l=y,this.R=A||1,this.U=new as(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ue}function ue(){this.i=null,this.g="",this.h=!1}var No={},sa={};function jn(c,p,y){c.L=1,c.v=ps(fn(p)),c.m=y,c.P=!0,Ci(c,null)}function Ci(c,p){c.F=Date.now(),hs(c),c.A=fn(c.v);var y=c.A,A=c.R;Array.isArray(A)||(A=[String(A)]),ko(y.i,"t",A),c.C=0,y=c.j.J,c.h=new ue,c.g=ku(c.j,y?p:null,!c.m),0<c.O&&(c.M=new Zh(R(c.Y,c,c.g),c.O)),p=c.U,y=c.g,A=c.ca;var x="readystatechange";Array.isArray(x)||(x&&(os[0]=x.toString()),x=os);for(var q=0;q<x.length;q++){var et=pu(y,x[q],A||p.handleEvent,!1,p.h||p);if(!et)break;p.g[et.key]=et}p=c.H?b(c.H):{},c.m?(c.u||(c.u="POST"),p["Content-Type"]="application/x-www-form-urlencoded",c.g.ea(c.A,c.u,c.m,p)):(c.u="GET",c.g.ea(c.A,c.u,null,p)),or(),Co(c.i,c.u,c.A,c.l,c.R,c.m)}We.prototype.ca=function(c){c=c.target;const p=this.M;p&&Cn(c)==3?p.j():this.Y(c)},We.prototype.Y=function(c){try{if(c==this.g)t:{const Te=Cn(this.g);var p=this.g.Ba();const xi=this.g.Z();if(!(3>Te)&&(Te!=3||this.g&&(this.h.h||this.g.oa()||wu(this.g)))){this.J||Te!=4||p==7||(p==8||0>=xi?or(3):or(2)),cr(this);var y=this.g.Z();this.X=y;e:if(Tu(this)){var A=wu(this.g);c="";var x=A.length,q=Cn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){ke(this),ni(this);var et="";break e}this.h.i=new m.TextDecoder}for(p=0;p<x;p++)this.h.h=!0,c+=this.h.i.decode(A[p],{stream:!(q&&p==x-1)});A.length=0,this.h.g+=c,this.C=0,et=this.h.g}else et=this.g.oa();if(this.o=y==200,Wh(this.i,this.u,this.A,this.l,this.R,Te,y),this.o){if(this.T&&!this.K){e:{if(this.g){var Pt,ve=this.g;if((Pt=ve.g?ve.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!ut(Pt)){var kt=Pt;break e}}kt=null}if(y=kt)lr(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,fs(this,y);else{this.o=!1,this.s=3,Jt(12),ke(this),ni(this);break t}}if(this.P){y=!0;let xe;for(;!this.J&&this.C<et.length;)if(xe=Eu(this,et),xe==sa){Te==4&&(this.s=4,Jt(14),y=!1),lr(this.i,this.l,null,"[Incomplete Response]");break}else if(xe==No){this.s=4,Jt(15),lr(this.i,this.l,et,"[Invalid Chunk]"),y=!1;break}else lr(this.i,this.l,xe,null),fs(this,xe);if(Tu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Te!=4||et.length!=0||this.h.h||(this.s=1,Jt(16),y=!1),this.o=this.o&&y,!y)lr(this.i,this.l,et,"[Invalid Chunked Response]"),ke(this),ni(this);else if(0<et.length&&!this.W){this.W=!0;var Ne=this.j;Ne.g==this&&Ne.ba&&!Ne.M&&(Ne.j.info("Great, no buffering proxy detected. Bytes received: "+et.length),Ss(Ne),Ne.M=!0,Jt(11))}}else lr(this.i,this.l,et,null),fs(this,et);Te==4&&ke(this),this.o&&!this.J&&(Te==4?Mu(this.j,this):(this.o=!1,hs(this)))}else rf(this.g),y==400&&0<et.indexOf("Unknown SID")?(this.s=3,Jt(12)):(this.s=0,Jt(13)),ke(this),ni(this)}}}catch{}finally{}};function Tu(c){return c.g?c.u=="GET"&&c.L!=2&&c.j.Ca:!1}function Eu(c,p){var y=c.C,A=p.indexOf(`
`,y);return A==-1?sa:(y=Number(p.substring(y,A)),isNaN(y)?No:(A+=1,A+y>p.length?sa:(p=p.slice(A,A+y),c.C=A+y,p)))}We.prototype.cancel=function(){this.J=!0,ke(this)};function hs(c){c.S=Date.now()+c.I,Au(c,c.I)}function Au(c,p){if(c.B!=null)throw Error("WatchDog timer not null");c.B=de(R(c.ba,c),p)}function cr(c){c.B&&(m.clearTimeout(c.B),c.B=null)}We.prototype.ba=function(){this.B=null;const c=Date.now();0<=c-this.S?(vu(this.i,this.A),this.L!=2&&(or(),Jt(17)),ke(this),this.s=2,ni(this)):Au(this,this.S-c)};function ni(c){c.j.G==0||c.J||Mu(c.j,c)}function ke(c){cr(c);var p=c.M;p&&typeof p.ma=="function"&&p.ma(),c.M=null,ls(c.U),c.g&&(p=c.g,c.g=null,p.abort(),p.ma())}function fs(c,p){try{var y=c.j;if(y.G!=0&&(y.g==c||Oo(y.h,c))){if(!c.K&&Oo(y.h,c)&&y.G==3){try{var A=y.Da.g.parse(p)}catch{A=null}if(Array.isArray(A)&&A.length==3){var x=A;if(x[0]==0){t:if(!y.u){if(y.g)if(y.g.F+3e3<c.F)_a(y),pa(y);else break t;Bo(y),Jt(18)}}else y.za=x[1],0<y.za-y.T&&37500>x[2]&&y.F&&y.v==0&&!y.C&&(y.C=de(R(y.Za,y),6e3));if(1>=oa(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else ki(y,11)}else if((c.K||y.g==c)&&_a(y),!ut(p))for(x=y.Da.g.parse(p),p=0;p<x.length;p++){let kt=x[p];if(y.T=kt[0],kt=kt[1],y.G==2)if(kt[0]=="c"){y.K=kt[1],y.ia=kt[2];const Ne=kt[3];Ne!=null&&(y.la=Ne,y.j.info("VER="+y.la));const Te=kt[4];Te!=null&&(y.Aa=Te,y.j.info("SVER="+y.Aa));const xi=kt[5];xi!=null&&typeof xi=="number"&&0<xi&&(A=1.5*xi,y.L=A,y.j.info("backChannelRequestTimeoutMs_="+A)),A=y;const xe=c.g;if(xe){const ui=xe.g?xe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ui){var q=A.h;q.g||ui.indexOf("spdy")==-1&&ui.indexOf("quic")==-1&&ui.indexOf("h2")==-1||(q.j=q.l,q.g=new Set,q.h&&(la(q,q.h),q.h=null))}if(A.D){const qo=xe.g?xe.g.getResponseHeader("X-HTTP-Session-Id"):null;qo&&(A.ya=qo,Kt(A.I,A.D,qo))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-c.F,y.j.info("Handshake RTT: "+y.R+"ms")),A=y;var et=c;if(A.qa=Pu(A,A.J?A.ia:null,A.W),et.K){Je(A.h,et);var Pt=et,ve=A.L;ve&&(Pt.I=ve),Pt.B&&(cr(Pt),hs(Pt)),A.g=et}else Ou(A);0<y.i.length&&ga(y)}else kt[0]!="stop"&&kt[0]!="close"||ki(y,7);else y.G==3&&(kt[0]=="stop"||kt[0]=="close"?kt[0]=="stop"?ki(y,7):Lo(y):kt[0]!="noop"&&y.l&&y.l.ta(kt),y.v=0)}}or(4)}catch{}}var Su=class{constructor(c,p){this.g=c,this.map=p}};function Ni(c){this.l=c||10,m.PerformanceNavigationTiming?(c=m.performance.getEntriesByType("navigation"),c=0<c.length&&(c[0].nextHopProtocol=="hq"||c[0].nextHopProtocol=="h2")):c=!!(m.chrome&&m.chrome.loadTimes&&m.chrome.loadTimes()&&m.chrome.loadTimes().wasFetchedViaSpdy),this.j=c?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function aa(c){return c.h?!0:c.g?c.g.size>=c.j:!1}function oa(c){return c.h?1:c.g?c.g.size:0}function Oo(c,p){return c.h?c.h==p:c.g?c.g.has(p):!1}function la(c,p){c.g?c.g.add(p):c.h=p}function Je(c,p){c.h&&c.h==p?c.h=null:c.g&&c.g.has(p)&&c.g.delete(p)}Ni.prototype.cancel=function(){if(this.i=Do(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const c of this.g.values())c.cancel();this.g.clear()}};function Do(c){if(c.h!=null)return c.i.concat(c.h.D);if(c.g!=null&&c.g.size!==0){let p=c.i;for(const y of c.g.values())p=p.concat(y.D);return p}return tt(c.i)}function Jh(c){if(c.V&&typeof c.V=="function")return c.V();if(typeof Map<"u"&&c instanceof Map||typeof Set<"u"&&c instanceof Set)return Array.from(c.values());if(typeof c=="string")return c.split("");if(g(c)){for(var p=[],y=c.length,A=0;A<y;A++)p.push(c[A]);return p}p=[],y=0;for(A in c)p[y++]=c[A];return p}function ua(c){if(c.na&&typeof c.na=="function")return c.na();if(!c.V||typeof c.V!="function"){if(typeof Map<"u"&&c instanceof Map)return Array.from(c.keys());if(!(typeof Set<"u"&&c instanceof Set)){if(g(c)||typeof c=="string"){var p=[];c=c.length;for(var y=0;y<c;y++)p.push(y);return p}p=[],y=0;for(const A in c)p[y++]=A;return p}}}function Mo(c,p){if(c.forEach&&typeof c.forEach=="function")c.forEach(p,void 0);else if(g(c)||typeof c=="string")Array.prototype.forEach.call(c,p,void 0);else for(var y=ua(c),A=Jh(c),x=A.length,q=0;q<x;q++)p.call(void 0,A[q],y&&y[q],c)}var ds=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function tf(c,p){if(c){c=c.split("&");for(var y=0;y<c.length;y++){var A=c[y].indexOf("="),x=null;if(0<=A){var q=c[y].substring(0,A);x=c[y].substring(A+1)}else q=c[y];p(q,x?decodeURIComponent(x.replace(/\+/g," ")):"")}}}function me(c){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,c instanceof me){this.h=c.h,ms(this,c.j),this.o=c.o,this.g=c.g,hr(this,c.s),this.l=c.l;var p=c.i,y=new Di;y.i=p.i,p.g&&(y.g=new Map(p.g),y.h=p.h),Oi(this,y),this.m=c.m}else c&&(p=String(c).match(ds))?(this.h=!1,ms(this,p[1]||"",!0),this.o=Rn(p[2]||""),this.g=Rn(p[3]||"",!0),hr(this,p[4]),this.l=Rn(p[5]||"",!0),Oi(this,p[6]||"",!0),this.m=Rn(p[7]||"")):(this.h=!1,this.i=new Di(null,this.h))}me.prototype.toString=function(){var c=[],p=this.j;p&&c.push(gs(p,Vo,!0),":");var y=this.g;return(y||p=="file")&&(c.push("//"),(p=this.o)&&c.push(gs(p,Vo,!0),"@"),c.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&c.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&c.push("/"),c.push(gs(y,y.charAt(0)=="/"?ef:Po,!0))),(y=this.i.toString())&&c.push("?",y),(y=this.m)&&c.push("#",gs(y,ca)),c.join("")};function fn(c){return new me(c)}function ms(c,p,y){c.j=y?Rn(p,!0):p,c.j&&(c.j=c.j.replace(/:$/,""))}function hr(c,p){if(p){if(p=Number(p),isNaN(p)||0>p)throw Error("Bad port number "+p);c.s=p}else c.s=null}function Oi(c,p,y){p instanceof Di?(c.i=p,Ru(c.i,c.h)):(y||(p=gs(p,nf)),c.i=new Di(p,c.h))}function Kt(c,p,y){c.i.set(p,y)}function ps(c){return Kt(c,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),c}function Rn(c,p){return c?p?decodeURI(c.replace(/%25/g,"%2525")):decodeURIComponent(c):""}function gs(c,p,y){return typeof c=="string"?(c=encodeURI(c).replace(p,bu),y&&(c=c.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c):null}function bu(c){return c=c.charCodeAt(0),"%"+(c>>4&15).toString(16)+(c&15).toString(16)}var Vo=/[#\/\?@]/g,Po=/[#\?:]/g,ef=/[#\?]/g,nf=/[#\?@]/g,ca=/#/g;function Di(c,p){this.h=this.g=null,this.i=c||null,this.j=!!p}function In(c){c.g||(c.g=new Map,c.h=0,c.i&&tf(c.i,function(p,y){c.add(decodeURIComponent(p.replace(/\+/g," ")),y)}))}r=Di.prototype,r.add=function(c,p){In(this),this.i=null,c=ii(this,c);var y=this.g.get(c);return y||this.g.set(c,y=[]),y.push(p),this.h+=1,this};function Mi(c,p){In(c),p=ii(c,p),c.g.has(p)&&(c.i=null,c.h-=c.g.get(p).length,c.g.delete(p))}function Vi(c,p){return In(c),p=ii(c,p),c.g.has(p)}r.forEach=function(c,p){In(this),this.g.forEach(function(y,A){y.forEach(function(x){c.call(p,x,A,this)},this)},this)},r.na=function(){In(this);const c=Array.from(this.g.values()),p=Array.from(this.g.keys()),y=[];for(let A=0;A<p.length;A++){const x=c[A];for(let q=0;q<x.length;q++)y.push(p[A])}return y},r.V=function(c){In(this);let p=[];if(typeof c=="string")Vi(this,c)&&(p=p.concat(this.g.get(ii(this,c))));else{c=Array.from(this.g.values());for(let y=0;y<c.length;y++)p=p.concat(c[y])}return p},r.set=function(c,p){return In(this),this.i=null,c=ii(this,c),Vi(this,c)&&(this.h-=this.g.get(c).length),this.g.set(c,[p]),this.h+=1,this},r.get=function(c,p){return c?(c=this.V(c),0<c.length?String(c[0]):p):p};function ko(c,p,y){Mi(c,p),0<y.length&&(c.i=null,c.g.set(ii(c,p),tt(y)),c.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const c=[],p=Array.from(this.g.keys());for(var y=0;y<p.length;y++){var A=p[y];const q=encodeURIComponent(String(A)),et=this.V(A);for(A=0;A<et.length;A++){var x=q;et[A]!==""&&(x+="="+encodeURIComponent(String(et[A]))),c.push(x)}}return this.i=c.join("&")};function ii(c,p){return p=String(p),c.j&&(p=p.toLowerCase()),p}function Ru(c,p){p&&!c.j&&(In(c),c.i=null,c.g.forEach(function(y,A){var x=A.toLowerCase();A!=x&&(Mi(this,A),ko(this,x,y))},c)),c.j=p}function _s(c,p){const y=new bn;if(m.Image){const A=new Image;A.onload=z(wn,y,"TestLoadImage: loaded",!0,p,A),A.onerror=z(wn,y,"TestLoadImage: error",!1,p,A),A.onabort=z(wn,y,"TestLoadImage: abort",!1,p,A),A.ontimeout=z(wn,y,"TestLoadImage: timeout",!1,p,A),m.setTimeout(function(){A.ontimeout&&A.ontimeout()},1e4),A.src=c}else p(!1)}function qn(c,p){const y=new bn,A=new AbortController,x=setTimeout(()=>{A.abort(),wn(y,"TestPingServer: timeout",!1,p)},1e4);fetch(c,{signal:A.signal}).then(q=>{clearTimeout(x),q.ok?wn(y,"TestPingServer: ok",!0,p):wn(y,"TestPingServer: server error",!1,p)}).catch(()=>{clearTimeout(x),wn(y,"TestPingServer: error",!1,p)})}function wn(c,p,y,A,x){try{x&&(x.onload=null,x.onerror=null,x.onabort=null,x.ontimeout=null),A(y)}catch{}}function ys(){this.g=new us}function ri(c,p,y){const A=y||"";try{Mo(c,function(x,q){let et=x;_(x)&&(et=Bn(x)),p.push(A+q+"="+encodeURIComponent(et))})}catch(x){throw p.push(A+"type="+encodeURIComponent("_badmap")),x}}function fr(c){this.l=c.Ub||null,this.j=c.eb||!1}X(fr,So),fr.prototype.g=function(){return new Pi(this.l,this.j)},fr.prototype.i=function(c){return function(){return c}}({});function Pi(c,p){se.call(this),this.D=c,this.o=p,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}X(Pi,se),r=Pi.prototype,r.open=function(c,p){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=c,this.A=p,this.readyState=1,ai(this)},r.send=function(c){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const p={headers:this.u,method:this.B,credentials:this.m,cache:void 0};c&&(p.body=c),(this.D||m).fetch(new Request(this.A,p)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,si(this)),this.readyState=0},r.Sa=function(c){if(this.g&&(this.l=c,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=c.headers,this.readyState=2,ai(this)),this.g&&(this.readyState=3,ai(this),this.g)))if(this.responseType==="arraybuffer")c.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof m.ReadableStream<"u"&&"body"in c){if(this.j=c.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;xo(this)}else c.text().then(this.Ra.bind(this),this.ga.bind(this))};function xo(c){c.j.read().then(c.Pa.bind(c)).catch(c.ga.bind(c))}r.Pa=function(c){if(this.g){if(this.o&&c.value)this.response.push(c.value);else if(!this.o){var p=c.value?c.value:new Uint8Array(0);(p=this.v.decode(p,{stream:!c.done}))&&(this.response=this.responseText+=p)}c.done?si(this):ai(this),this.readyState==3&&xo(this)}},r.Ra=function(c){this.g&&(this.response=this.responseText=c,si(this))},r.Qa=function(c){this.g&&(this.response=c,si(this))},r.ga=function(){this.g&&si(this)};function si(c){c.readyState=4,c.l=null,c.j=null,c.v=null,ai(c)}r.setRequestHeader=function(c,p){this.u.append(c,p)},r.getResponseHeader=function(c){return this.h&&this.h.get(c.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const c=[],p=this.h.entries();for(var y=p.next();!y.done;)y=y.value,c.push(y[0]+": "+y[1]),y=p.next();return c.join(`\r
`)};function ai(c){c.onreadystatechange&&c.onreadystatechange.call(c)}Object.defineProperty(Pi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(c){this.m=c?"include":"same-origin"}});function Uo(c){let p="";return Rt(c,function(y,A){p+=A,p+=":",p+=y,p+=`\r
`}),p}function Ce(c,p,y){t:{for(A in y){var A=!1;break t}A=!0}A||(y=Uo(y),typeof c=="string"?y!=null&&encodeURIComponent(String(y)):Kt(c,p,y))}function jt(c){se.call(this),this.headers=new Map,this.o=c||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}X(jt,se);var ha=/^https?$/i,vs=["POST","PUT"];r=jt.prototype,r.Ha=function(c){this.J=c},r.ea=function(c,p,y,A){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+c);p=p?p.toUpperCase():"GET",this.D=c,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ti.g(),this.v=this.o?bo(this.o):bo(ti),this.g.onreadystatechange=R(this.Ea,this);try{this.B=!0,this.g.open(p,String(c),!0),this.B=!1}catch(q){Iu(this,q);return}if(c=y||"",y=new Map(this.headers),A)if(Object.getPrototypeOf(A)===Object.prototype)for(var x in A)y.set(x,A[x]);else if(typeof A.keys=="function"&&typeof A.get=="function")for(const q of A.keys())y.set(q,A.get(q));else throw Error("Unknown input type for opt_headers: "+String(A));A=Array.from(y.keys()).find(q=>q.toLowerCase()=="content-type"),x=m.FormData&&c instanceof m.FormData,!(0<=Array.prototype.indexOf.call(vs,p,void 0))||A||x||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[q,et]of y)this.g.setRequestHeader(q,et);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ts(this),this.u=!0,this.g.send(c),this.u=!1}catch(q){Iu(this,q)}};function Iu(c,p){c.h=!1,c.g&&(c.j=!0,c.g.abort(),c.j=!1),c.l=p,c.m=5,fa(c),oi(c)}function fa(c){c.A||(c.A=!0,Ht(c,"complete"),Ht(c,"error"))}r.abort=function(c){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=c||7,Ht(this,"complete"),Ht(this,"abort"),oi(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),oi(this,!0)),jt.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?da(this):this.bb())},r.bb=function(){da(this)};function da(c){if(c.h&&typeof f<"u"&&(!c.v[1]||Cn(c)!=4||c.Z()!=2)){if(c.u&&Cn(c)==4)He(c.Ea,0,c);else if(Ht(c,"readystatechange"),Cn(c)==4){c.h=!1;try{const et=c.Z();t:switch(et){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var p=!0;break t;default:p=!1}var y;if(!(y=p)){var A;if(A=et===0){var x=String(c.D).match(ds)[1]||null;!x&&m.self&&m.self.location&&(x=m.self.location.protocol.slice(0,-1)),A=!ha.test(x?x.toLowerCase():"")}y=A}if(y)Ht(c,"complete"),Ht(c,"success");else{c.m=6;try{var q=2<Cn(c)?c.g.statusText:""}catch{q=""}c.l=q+" ["+c.Z()+"]",fa(c)}}finally{oi(c)}}}}function oi(c,p){if(c.g){Ts(c);const y=c.g,A=c.v[0]?()=>{}:null;c.g=null,c.v=null,p||Ht(c,"ready");try{y.onreadystatechange=A}catch{}}}function Ts(c){c.I&&(m.clearTimeout(c.I),c.I=null)}r.isActive=function(){return!!this.g};function Cn(c){return c.g?c.g.readyState:0}r.Z=function(){try{return 2<Cn(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(c){if(this.g){var p=this.g.responseText;return c&&p.indexOf(c)==0&&(p=p.substring(c.length)),ia(p)}};function wu(c){try{if(!c.g)return null;if("response"in c.g)return c.g.response;switch(c.H){case"":case"text":return c.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in c.g)return c.g.mozResponseArrayBuffer}return null}catch{return null}}function rf(c){const p={};c=(c.g&&2<=Cn(c)&&c.g.getAllResponseHeaders()||"").split(`\r
`);for(let A=0;A<c.length;A++){if(ut(c[A]))continue;var y=V(c[A]);const x=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const q=p[x]||[];p[x]=q,q.push(y)}M(p,function(A){return A.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Es(c,p,y){return y&&y.internalChannelParams&&y.internalChannelParams[c]||p}function ma(c){this.Aa=0,this.i=[],this.j=new bn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Es("failFast",!1,c),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Es("baseRetryDelayMs",5e3,c),this.cb=Es("retryDelaySeedMs",1e4,c),this.Wa=Es("forwardChannelMaxRetries",2,c),this.wa=Es("forwardChannelRequestTimeoutMs",2e4,c),this.pa=c&&c.xmlHttpFactory||void 0,this.Xa=c&&c.Tb||void 0,this.Ca=c&&c.useFetchStreams||!1,this.L=void 0,this.J=c&&c.supportsCrossDomainXhr||!1,this.K="",this.h=new Ni(c&&c.concurrentRequestLimit),this.Da=new ys,this.P=c&&c.fastHandshake||!1,this.O=c&&c.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=c&&c.Rb||!1,c&&c.xa&&this.j.xa(),c&&c.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&c&&c.detectBufferingProxy||!1,this.ja=void 0,c&&c.longPollingTimeout&&0<c.longPollingTimeout&&(this.ja=c.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=ma.prototype,r.la=8,r.G=1,r.connect=function(c,p,y,A){Jt(0),this.W=c,this.H=p||{},y&&A!==void 0&&(this.H.OSID=y,this.H.OAID=A),this.F=this.X,this.I=Pu(this,null,this.W),ga(this)};function Lo(c){if(Cu(c),c.G==3){var p=c.U++,y=fn(c.I);if(Kt(y,"SID",c.K),Kt(y,"RID",p),Kt(y,"TYPE","terminate"),As(c,y),p=new We(c,c.j,p),p.L=2,p.v=ps(fn(y)),y=!1,m.navigator&&m.navigator.sendBeacon)try{y=m.navigator.sendBeacon(p.v.toString(),"")}catch{}!y&&m.Image&&(new Image().src=p.v,y=!0),y||(p.g=ku(p.j,null),p.g.ea(p.v)),p.F=Date.now(),hs(p)}Vu(c)}function pa(c){c.g&&(Ss(c),c.g.cancel(),c.g=null)}function Cu(c){pa(c),c.u&&(m.clearTimeout(c.u),c.u=null),_a(c),c.h.cancel(),c.s&&(typeof c.s=="number"&&m.clearTimeout(c.s),c.s=null)}function ga(c){if(!aa(c.h)&&!c.s){c.s=!0;var p=c.Ga;nt||N(),lt||(nt(),lt=!0),zt.add(p,c),c.B=0}}function sf(c,p){return oa(c.h)>=c.h.j-(c.s?1:0)?!1:c.s?(c.i=p.D.concat(c.i),!0):c.G==1||c.G==2||c.B>=(c.Va?0:c.Wa)?!1:(c.s=de(R(c.Ga,c,p),jo(c,c.B)),c.B++,!0)}r.Ga=function(c){if(this.s)if(this.s=null,this.G==1){if(!c){this.U=Math.floor(1e5*Math.random()),c=this.U++;const x=new We(this,this.j,c);let q=this.o;if(this.S&&(q?(q=b(q),D(q,this.S)):q=this.S),this.m!==null||this.O||(x.H=q,q=null),this.P)t:{for(var p=0,y=0;y<this.i.length;y++){e:{var A=this.i[y];if("__data__"in A.map&&(A=A.map.__data__,typeof A=="string")){A=A.length;break e}A=void 0}if(A===void 0)break;if(p+=A,4096<p){p=y;break t}if(p===4096||y===this.i.length-1){p=y+1;break t}}p=1e3}else p=1e3;p=Nu(this,x,p),y=fn(this.I),Kt(y,"RID",c),Kt(y,"CVER",22),this.D&&Kt(y,"X-HTTP-Session-Id",this.D),As(this,y),q&&(this.O?p="headers="+encodeURIComponent(String(Uo(q)))+"&"+p:this.m&&Ce(y,this.m,q)),la(this.h,x),this.Ua&&Kt(y,"TYPE","init"),this.P?(Kt(y,"$req",p),Kt(y,"SID","null"),x.T=!0,jn(x,y,null)):jn(x,y,p),this.G=2}}else this.G==3&&(c?zo(this,c):this.i.length==0||aa(this.h)||zo(this))};function zo(c,p){var y;p?y=p.l:y=c.U++;const A=fn(c.I);Kt(A,"SID",c.K),Kt(A,"RID",y),Kt(A,"AID",c.T),As(c,A),c.m&&c.o&&Ce(A,c.m,c.o),y=new We(c,c.j,y,c.B+1),c.m===null&&(y.H=c.o),p&&(c.i=p.D.concat(c.i)),p=Nu(c,y,1e3),y.I=Math.round(.5*c.wa)+Math.round(.5*c.wa*Math.random()),la(c.h,y),jn(y,A,p)}function As(c,p){c.H&&Rt(c.H,function(y,A){Kt(p,A,y)}),c.l&&Mo({},function(y,A){Kt(p,A,y)})}function Nu(c,p,y){y=Math.min(c.i.length,y);var A=c.l?R(c.l.Na,c.l,c):null;t:{var x=c.i;let q=-1;for(;;){const et=["count="+y];q==-1?0<y?(q=x[0].g,et.push("ofs="+q)):q=0:et.push("ofs="+q);let Pt=!0;for(let ve=0;ve<y;ve++){let kt=x[ve].g;const Ne=x[ve].map;if(kt-=q,0>kt)q=Math.max(0,x[ve].g-100),Pt=!1;else try{ri(Ne,et,"req"+kt+"_")}catch{A&&A(Ne)}}if(Pt){A=et.join("&");break t}}}return c=c.i.splice(0,y),p.D=c,A}function Ou(c){if(!c.g&&!c.u){c.Y=1;var p=c.Fa;nt||N(),lt||(nt(),lt=!0),zt.add(p,c),c.v=0}}function Bo(c){return c.g||c.u||3<=c.v?!1:(c.Y++,c.u=de(R(c.Fa,c),jo(c,c.v)),c.v++,!0)}r.Fa=function(){if(this.u=null,Du(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var c=2*this.R;this.j.info("BP detection timer enabled: "+c),this.A=de(R(this.ab,this),c)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Jt(10),pa(this),Du(this))};function Ss(c){c.A!=null&&(m.clearTimeout(c.A),c.A=null)}function Du(c){c.g=new We(c,c.j,"rpc",c.Y),c.m===null&&(c.g.H=c.o),c.g.O=0;var p=fn(c.qa);Kt(p,"RID","rpc"),Kt(p,"SID",c.K),Kt(p,"AID",c.T),Kt(p,"CI",c.F?"0":"1"),!c.F&&c.ja&&Kt(p,"TO",c.ja),Kt(p,"TYPE","xmlhttp"),As(c,p),c.m&&c.o&&Ce(p,c.m,c.o),c.L&&(c.g.I=c.L);var y=c.g;c=c.ia,y.L=1,y.v=ps(fn(p)),y.m=null,y.P=!0,Ci(y,c)}r.Za=function(){this.C!=null&&(this.C=null,pa(this),Bo(this),Jt(19))};function _a(c){c.C!=null&&(m.clearTimeout(c.C),c.C=null)}function Mu(c,p){var y=null;if(c.g==p){_a(c),Ss(c),c.g=null;var A=2}else if(Oo(c.h,p))y=p.D,Je(c.h,p),A=1;else return;if(c.G!=0){if(p.o)if(A==1){y=p.m?p.m.length:0,p=Date.now()-p.F;var x=c.B;A=ar(),Ht(A,new ye(A,y)),ga(c)}else Ou(c);else if(x=p.s,x==3||x==0&&0<p.X||!(A==1&&sf(c,p)||A==2&&Bo(c)))switch(y&&0<y.length&&(p=c.h,p.i=p.i.concat(y)),x){case 1:ki(c,5);break;case 4:ki(c,10);break;case 3:ki(c,6);break;default:ki(c,2)}}}function jo(c,p){let y=c.Ta+Math.floor(Math.random()*c.cb);return c.isActive()||(y*=2),y*p}function ki(c,p){if(c.j.info("Error code "+p),p==2){var y=R(c.fb,c),A=c.Xa;const x=!A;A=new me(A||"//www.google.com/images/cleardot.gif"),m.location&&m.location.protocol=="http"||ms(A,"https"),ps(A),x?_s(A.toString(),y):qn(A.toString(),y)}else Jt(2);c.G=0,c.l&&c.l.sa(p),Vu(c),Cu(c)}r.fb=function(c){c?(this.j.info("Successfully pinged google.com"),Jt(2)):(this.j.info("Failed to ping google.com"),Jt(1))};function Vu(c){if(c.G=0,c.ka=[],c.l){const p=Do(c.h);(p.length!=0||c.i.length!=0)&&(Y(c.ka,p),Y(c.ka,c.i),c.h.i.length=0,tt(c.i),c.i.length=0),c.l.ra()}}function Pu(c,p,y){var A=y instanceof me?fn(y):new me(y);if(A.g!="")p&&(A.g=p+"."+A.g),hr(A,A.s);else{var x=m.location;A=x.protocol,p=p?p+"."+x.hostname:x.hostname,x=+x.port;var q=new me(null);A&&ms(q,A),p&&(q.g=p),x&&hr(q,x),y&&(q.l=y),A=q}return y=c.D,p=c.ya,y&&p&&Kt(A,y,p),Kt(A,"VER",c.la),As(c,A),A}function ku(c,p,y){if(p&&!c.J)throw Error("Can't create secondary domain capable XhrIo object.");return p=c.Ca&&!c.pa?new jt(new fr({eb:y})):new jt(c.pa),p.Ha(c.J),p}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function xu(){}r=xu.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function ya(){}ya.prototype.g=function(c,p){return new tn(c,p)};function tn(c,p){se.call(this),this.g=new ma(p),this.l=c,this.h=p&&p.messageUrlParams||null,c=p&&p.messageHeaders||null,p&&p.clientProtocolHeaderRequired&&(c?c["X-Client-Protocol"]="webchannel":c={"X-Client-Protocol":"webchannel"}),this.g.o=c,c=p&&p.initMessageHeaders||null,p&&p.messageContentType&&(c?c["X-WebChannel-Content-Type"]=p.messageContentType:c={"X-WebChannel-Content-Type":p.messageContentType}),p&&p.va&&(c?c["X-WebChannel-Client-Profile"]=p.va:c={"X-WebChannel-Client-Profile":p.va}),this.g.S=c,(c=p&&p.Sb)&&!ut(c)&&(this.g.m=c),this.v=p&&p.supportsCrossDomainXhr||!1,this.u=p&&p.sendRawJson||!1,(p=p&&p.httpSessionIdParam)&&!ut(p)&&(this.g.D=p,c=this.h,c!==null&&p in c&&(c=this.h,p in c&&delete c[p])),this.j=new li(this)}X(tn,se),tn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},tn.prototype.close=function(){Lo(this.g)},tn.prototype.o=function(c){var p=this.g;if(typeof c=="string"){var y={};y.__data__=c,c=y}else this.u&&(y={},y.__data__=Bn(c),c=y);p.i.push(new Su(p.Ya++,c)),p.G==3&&ga(p)},tn.prototype.N=function(){this.g.l=null,delete this.j,Lo(this.g),delete this.g,tn.aa.N.call(this)};function Uu(c){Ii.call(this),c.__headers__&&(this.headers=c.__headers__,this.statusCode=c.__status__,delete c.__headers__,delete c.__status__);var p=c.__sm__;if(p){t:{for(const y in p){c=y;break t}c=void 0}(this.i=c)&&(c=this.i,p=p!==null&&c in p?p[c]:void 0),this.data=p}else this.data=c}X(Uu,Ii);function Lu(){Io.call(this),this.status=1}X(Lu,Io);function li(c){this.g=c}X(li,xu),li.prototype.ua=function(){Ht(this.g,"a")},li.prototype.ta=function(c){Ht(this.g,new Uu(c))},li.prototype.sa=function(c){Ht(this.g,new Lu)},li.prototype.ra=function(){Ht(this.g,"b")},ya.prototype.createWebChannel=ya.prototype.g,tn.prototype.send=tn.prototype.o,tn.prototype.open=tn.prototype.m,tn.prototype.close=tn.prototype.close,D0=function(){return new ya},O0=function(){return ar()},N0=Jn,Vm={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ur.NO_ERROR=0,ur.TIMEOUT=8,ur.HTTP_ERROR=6,Wc=ur,wi.COMPLETE="complete",C0=wi,Ro.EventType=Ri,Ri.OPEN="a",Ri.CLOSE="b",Ri.ERROR="c",Ri.MESSAGE="d",se.prototype.listen=se.prototype.K,Dl=Ro,jt.prototype.listenOnce=jt.prototype.L,jt.prototype.getLastError=jt.prototype.Ka,jt.prototype.getLastErrorCode=jt.prototype.Ba,jt.prototype.getStatus=jt.prototype.Z,jt.prototype.getResponseJson=jt.prototype.Oa,jt.prototype.getResponseText=jt.prototype.oa,jt.prototype.send=jt.prototype.ea,jt.prototype.setWithCredentials=jt.prototype.Ha,w0=jt}).apply(typeof Bc<"u"?Bc:typeof self<"u"?self:typeof window<"u"?window:{});const aT="@firebase/firestore",oT="4.7.17";/**
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
 */class Ye{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Ye.UNAUTHENTICATED=new Ye(null),Ye.GOOGLE_CREDENTIALS=new Ye("google-credentials-uid"),Ye.FIRST_PARTY=new Ye("first-party-uid"),Ye.MOCK_USER=new Ye("mock-user");/**
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
 */let po="11.9.0";/**
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
 */const Gs=new ru("@firebase/firestore");function Ya(){return Gs.logLevel}function rt(r,...t){if(Gs.logLevel<=Mt.DEBUG){const n=t.map(_p);Gs.debug(`Firestore (${po}): ${r}`,...n)}}function nr(r,...t){if(Gs.logLevel<=Mt.ERROR){const n=t.map(_p);Gs.error(`Firestore (${po}): ${r}`,...n)}}function ao(r,...t){if(Gs.logLevel<=Mt.WARN){const n=t.map(_p);Gs.warn(`Firestore (${po}): ${r}`,...n)}}function _p(r){if(typeof r=="string")return r;try{/**
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
*/return function(n){return JSON.stringify(n)}(r)}catch{return r}}/**
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
 */function vt(r,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,M0(r,s,n)}function M0(r,t,n){let s=`FIRESTORE (${po}) INTERNAL ASSERTION FAILED: ${t} (ID: ${r.toString(16)})`;if(n!==void 0)try{s+=" CONTEXT: "+JSON.stringify(n)}catch{s+=" CONTEXT: "+n}throw nr(s),new Error(s)}function qt(r,t,n,s){let o="Unexpected state";typeof n=="string"?o=n:s=n,r||M0(t,o,s)}function St(r,t){return r}/**
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
 */const W={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class dt extends zn{constructor(t,n){super(t,n),this.code=t,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Fr{constructor(){this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}}/**
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
 */class V0{constructor(t,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class SC{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,n){t.enqueueRetryable(()=>n(Ye.UNAUTHENTICATED))}shutdown(){}}class bC{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,n){this.changeListener=n,t.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class RC{constructor(t){this.t=t,this.currentUser=Ye.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,n){qt(this.o===void 0,42304);let s=this.i;const o=g=>this.i!==s?(s=this.i,n(g)):Promise.resolve();let u=new Fr;this.o=()=>{this.i++,this.currentUser=this.u(),u.resolve(),u=new Fr,t.enqueueRetryable(()=>o(this.currentUser))};const f=()=>{const g=u;t.enqueueRetryable(async()=>{await g.promise,await o(this.currentUser)})},m=g=>{rt("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),f())};this.t.onInit(g=>m(g)),setTimeout(()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?m(g):(rt("FirebaseAuthCredentialsProvider","Auth not yet detected"),u.resolve(),u=new Fr)}},0),f()}getToken(){const t=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==t?(rt("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(qt(typeof s.accessToken=="string",31837,{l:s}),new V0(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return qt(t===null||typeof t=="string",2055,{h:t}),new Ye(t)}}class IC{constructor(t,n,s){this.P=t,this.T=n,this.I=s,this.type="FirstParty",this.user=Ye.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class wC{constructor(t,n,s){this.P=t,this.T=n,this.I=s}getToken(){return Promise.resolve(new IC(this.P,this.T,this.I))}start(t,n){t.enqueueRetryable(()=>n(Ye.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class lT{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class CC{constructor(t,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Qn(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,n){qt(this.o===void 0,3512);const s=u=>{u.error!=null&&rt("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${u.error.message}`);const f=u.token!==this.m;return this.m=u.token,rt("FirebaseAppCheckTokenProvider",`Received ${f?"new":"existing"} token.`),f?n(u.token):Promise.resolve()};this.o=u=>{t.enqueueRetryable(()=>s(u))};const o=u=>{rt("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=u,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(u=>o(u)),setTimeout(()=>{if(!this.appCheck){const u=this.V.getImmediate({optional:!0});u?o(u):rt("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new lT(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(n=>n?(qt(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new lT(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function NC(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(n);else for(let s=0;s<r;s++)n[s]=Math.floor(256*Math.random());return n}/**
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
 */function P0(){return new TextEncoder}/**
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
 */class k0{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=NC(40);for(let u=0;u<o.length;++u)s.length<20&&o[u]<n&&(s+=t.charAt(o[u]%62))}return s}}function wt(r,t){return r<t?-1:r>t?1:0}function Pm(r,t){let n=0;for(;n<r.length&&n<t.length;){const s=r.codePointAt(n),o=t.codePointAt(n);if(s!==o){if(s<128&&o<128)return wt(s,o);{const u=P0(),f=OC(u.encode(uT(r,n)),u.encode(uT(t,n)));return f!==0?f:wt(s,o)}}n+=s>65535?2:1}return wt(r.length,t.length)}function uT(r,t){return r.codePointAt(t)>65535?r.substring(t,t+2):r.substring(t,t+1)}function OC(r,t){for(let n=0;n<r.length&&n<t.length;++n)if(r[n]!==t[n])return wt(r[n],t[n]);return wt(r.length,t.length)}function oo(r,t,n){return r.length===t.length&&r.every((s,o)=>n(s,t[o]))}/**
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
 */const cT=-62135596800,hT=1e6;class be{static now(){return be.fromMillis(Date.now())}static fromDate(t){return be.fromMillis(t.getTime())}static fromMillis(t){const n=Math.floor(t/1e3),s=Math.floor((t-1e3*n)*hT);return new be(n,s)}constructor(t,n){if(this.seconds=t,this.nanoseconds=n,n<0)throw new dt(W.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new dt(W.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(t<cT)throw new dt(W.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new dt(W.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/hT}_compareTo(t){return this.seconds===t.seconds?wt(this.nanoseconds,t.nanoseconds):wt(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds-cT;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class At{static fromTimestamp(t){return new At(t)}static min(){return new At(new be(0,0))}static max(){return new At(new be(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const fT="__name__";class pi{constructor(t,n,s){n===void 0?n=0:n>t.length&&vt(637,{offset:n,range:t.length}),s===void 0?s=t.length-n:s>t.length-n&&vt(1746,{length:s,range:t.length-n}),this.segments=t,this.offset=n,this.len=s}get length(){return this.len}isEqual(t){return pi.comparator(this,t)===0}child(t){const n=this.segments.slice(this.offset,this.limit());return t instanceof pi?t.forEach(s=>{n.push(s)}):n.push(t),this.construct(n)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}forEach(t){for(let n=this.offset,s=this.limit();n<s;n++)t(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,n){const s=Math.min(t.length,n.length);for(let o=0;o<s;o++){const u=pi.compareSegments(t.get(o),n.get(o));if(u!==0)return u}return wt(t.length,n.length)}static compareSegments(t,n){const s=pi.isNumericId(t),o=pi.isNumericId(n);return s&&!o?-1:!s&&o?1:s&&o?pi.extractNumericId(t).compare(pi.extractNumericId(n)):Pm(t,n)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Hr.fromString(t.substring(4,t.length-2))}}class le extends pi{construct(t,n,s){return new le(t,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const n=[];for(const s of t){if(s.indexOf("//")>=0)throw new dt(W.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(o=>o.length>0))}return new le(n)}static emptyPath(){return new le([])}}const DC=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class je extends pi{construct(t,n,s){return new je(t,n,s)}static isValidIdentifier(t){return DC.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),je.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===fT}static keyField(){return new je([fT])}static fromServerFormat(t){const n=[];let s="",o=0;const u=()=>{if(s.length===0)throw new dt(W.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let f=!1;for(;o<t.length;){const m=t[o];if(m==="\\"){if(o+1===t.length)throw new dt(W.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const g=t[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new dt(W.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);s+=g,o+=2}else m==="`"?(f=!f,o++):m!=="."||f?(s+=m,o++):(u(),o++)}if(u(),f)throw new dt(W.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new je(n)}static emptyPath(){return new je([])}}/**
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
 */class mt{constructor(t){this.path=t}static fromPath(t){return new mt(le.fromString(t))}static fromName(t){return new mt(le.fromString(t).popFirst(5))}static empty(){return new mt(le.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&le.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,n){return le.comparator(t.path,n.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new mt(new le(t.slice()))}}/**
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
 */const Ql=-1;function MC(r,t){const n=r.toTimestamp().seconds,s=r.toTimestamp().nanoseconds+1,o=At.fromTimestamp(s===1e9?new be(n+1,0):new be(n,s));return new Kr(o,mt.empty(),t)}function VC(r){return new Kr(r.readTime,r.key,Ql)}class Kr{constructor(t,n,s){this.readTime=t,this.documentKey=n,this.largestBatchId=s}static min(){return new Kr(At.min(),mt.empty(),Ql)}static max(){return new Kr(At.max(),mt.empty(),Ql)}}function PC(r,t){let n=r.readTime.compareTo(t.readTime);return n!==0?n:(n=mt.comparator(r.documentKey,t.documentKey),n!==0?n:wt(r.largestBatchId,t.largestBatchId))}/**
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
 */const kC="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class xC{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
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
 */async function go(r){if(r.code!==W.FAILED_PRECONDITION||r.message!==kC)throw r;rt("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class ${constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(t){return this.next(void 0,t)}next(t,n){return this.callbackAttached&&vt(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(t,this.result):new $((s,o)=>{this.nextCallback=u=>{this.wrapSuccess(t,u).next(s,o)},this.catchCallback=u=>{this.wrapFailure(n,u).next(s,o)}})}toPromise(){return new Promise((t,n)=>{this.next(t,n)})}wrapUserFunction(t){try{const n=t();return n instanceof $?n:$.resolve(n)}catch(n){return $.reject(n)}}wrapSuccess(t,n){return t?this.wrapUserFunction(()=>t(n)):$.resolve(n)}wrapFailure(t,n){return t?this.wrapUserFunction(()=>t(n)):$.reject(n)}static resolve(t){return new $((n,s)=>{n(t)})}static reject(t){return new $((n,s)=>{s(t)})}static waitFor(t){return new $((n,s)=>{let o=0,u=0,f=!1;t.forEach(m=>{++o,m.next(()=>{++u,f&&u===o&&n()},g=>s(g))}),f=!0,u===o&&n()})}static or(t){let n=$.resolve(!1);for(const s of t)n=n.next(o=>o?$.resolve(o):s());return n}static forEach(t,n){const s=[];return t.forEach((o,u)=>{s.push(n.call(this,o,u))}),this.waitFor(s)}static mapArray(t,n){return new $((s,o)=>{const u=t.length,f=new Array(u);let m=0;for(let g=0;g<u;g++){const _=g;n(t[_]).next(T=>{f[_]=T,++m,m===u&&s(f)},T=>o(T))}})}static doWhile(t,n){return new $((s,o)=>{const u=()=>{t()===!0?n().next(()=>{u()},o):s()};u()})}}function UC(r){const t=r.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function _o(r){return r.name==="IndexedDbTransactionError"}/**
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
 */class Vh{constructor(t,n){this.previousValue=t,n&&(n.sequenceNumberHandler=s=>this.ue(s),this.ce=s=>n.writeSequenceNumber(s))}ue(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ce&&this.ce(t),t}}Vh.le=-1;/**
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
 */const yp=-1;function Ph(r){return r==null}function dh(r){return r===0&&1/r==-1/0}function LC(r){return typeof r=="number"&&Number.isInteger(r)&&!dh(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const x0="";function zC(r){let t="";for(let n=0;n<r.length;n++)t.length>0&&(t=dT(t)),t=BC(r.get(n),t);return dT(t)}function BC(r,t){let n=t;const s=r.length;for(let o=0;o<s;o++){const u=r.charAt(o);switch(u){case"\0":n+="";break;case x0:n+="";break;default:n+=u}}return n}function dT(r){return r+x0+""}/**
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
 */function mT(r){let t=0;for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t++;return t}function Zs(r,t){for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t(n,r[n])}function U0(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}/**
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
 */class ie{constructor(t,n){this.comparator=t,this.root=n||Be.EMPTY}insert(t,n){return new ie(this.comparator,this.root.insert(t,n,this.comparator).copy(null,null,Be.BLACK,null,null))}remove(t){return new ie(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Be.BLACK,null,null))}get(t){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(t,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(t){let n=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(t,s.key);if(o===0)return n+s.left.size;o<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((n,s)=>(t(n,s),!1))}toString(){const t=[];return this.inorderTraversal((n,s)=>(t.push(`${n}:${s}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new jc(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new jc(this.root,t,this.comparator,!1)}getReverseIterator(){return new jc(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new jc(this.root,t,this.comparator,!0)}}class jc{constructor(t,n,s,o){this.isReverse=o,this.nodeStack=[];let u=1;for(;!t.isEmpty();)if(u=n?s(t.key,n):1,n&&o&&(u*=-1),u<0)t=this.isReverse?t.left:t.right;else{if(u===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const n={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Be{constructor(t,n,s,o,u){this.key=t,this.value=n,this.color=s??Be.RED,this.left=o??Be.EMPTY,this.right=u??Be.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,n,s,o,u){return new Be(t??this.key,n??this.value,s??this.color,o??this.left,u??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,n,s){let o=this;const u=s(t,o.key);return o=u<0?o.copy(null,null,null,o.left.insert(t,n,s),null):u===0?o.copy(null,n,null,null,null):o.copy(null,null,null,null,o.right.insert(t,n,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Be.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,n){let s,o=this;if(n(t,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(t,n),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),n(t,o.key)===0){if(o.right.isEmpty())return Be.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(t,n))}return o.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Be.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Be.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,n)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw vt(43730,{key:this.key,value:this.value});if(this.right.isRed())throw vt(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw vt(27949);return t+(this.isRed()?0:1)}}Be.EMPTY=null,Be.RED=!0,Be.BLACK=!1;Be.EMPTY=new class{constructor(){this.size=0}get key(){throw vt(57766)}get value(){throw vt(16141)}get color(){throw vt(16727)}get left(){throw vt(29726)}get right(){throw vt(36894)}copy(t,n,s,o,u){return this}insert(t,n,s){return new Be(t,n)}remove(t,n){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Re{constructor(t){this.comparator=t,this.data=new ie(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((n,s)=>(t(n),!1))}forEachInRange(t,n){const s=this.data.getIteratorFrom(t[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,t[1])>=0)return;n(o.key)}}forEachWhile(t,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!t(s.getNext().key))return}firstAfterOrEqual(t){const n=this.data.getIteratorFrom(t);return n.hasNext()?n.getNext().key:null}getIterator(){return new pT(this.data.getIterator())}getIteratorFrom(t){return new pT(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let n=this;return n.size<t.size&&(n=t,t=this),t.forEach(s=>{n=n.add(s)}),n}isEqual(t){if(!(t instanceof Re)||this.size!==t.size)return!1;const n=this.data.getIterator(),s=t.data.getIterator();for(;n.hasNext();){const o=n.getNext().key,u=s.getNext().key;if(this.comparator(o,u)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(n=>{t.push(n)}),t}toString(){const t=[];return this.forEach(n=>t.push(n)),"SortedSet("+t.toString()+")"}copy(t){const n=new Re(this.comparator);return n.data=t,n}}class pT{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class $n{constructor(t){this.fields=t,t.sort(je.comparator)}static empty(){return new $n([])}unionWith(t){let n=new Re(je.comparator);for(const s of this.fields)n=n.add(s);for(const s of t)n=n.add(s);return new $n(n.toArray())}covers(t){for(const n of this.fields)if(n.isPrefixOf(t))return!0;return!1}isEqual(t){return oo(this.fields,t.fields,(n,s)=>n.isEqual(s))}}/**
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
 */class L0 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class qe{constructor(t){this.binaryString=t}static fromBase64String(t){const n=function(o){try{return atob(o)}catch(u){throw typeof DOMException<"u"&&u instanceof DOMException?new L0("Invalid base64 string: "+u):u}}(t);return new qe(n)}static fromUint8Array(t){const n=function(o){let u="";for(let f=0;f<o.length;++f)u+=String.fromCharCode(o[f]);return u}(t);return new qe(n)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return wt(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}qe.EMPTY_BYTE_STRING=new qe("");const jC=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Yr(r){if(qt(!!r,39018),typeof r=="string"){let t=0;const n=jC.exec(r);if(qt(!!n,46558,{timestamp:r}),n[1]){let o=n[1];o=(o+"000000000").substr(0,9),t=Number(o)}const s=new Date(r);return{seconds:Math.floor(s.getTime()/1e3),nanos:t}}return{seconds:fe(r.seconds),nanos:fe(r.nanos)}}function fe(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Qr(r){return typeof r=="string"?qe.fromBase64String(r):qe.fromUint8Array(r)}/**
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
 */const z0="server_timestamp",B0="__type__",j0="__previous_value__",q0="__local_write_time__";function vp(r){var t,n;return((n=(((t=r?.mapValue)===null||t===void 0?void 0:t.fields)||{})[B0])===null||n===void 0?void 0:n.stringValue)===z0}function kh(r){const t=r.mapValue.fields[j0];return vp(t)?kh(t):t}function Xl(r){const t=Yr(r.mapValue.fields[q0].timestampValue);return new be(t.seconds,t.nanos)}/**
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
 */class qC{constructor(t,n,s,o,u,f,m,g,_,T){this.databaseId=t,this.appId=n,this.persistenceKey=s,this.host=o,this.ssl=u,this.forceLongPolling=f,this.autoDetectLongPolling=m,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=T}}const mh="(default)";class $l{constructor(t,n){this.projectId=t,this.database=n||mh}static empty(){return new $l("","")}get isDefaultDatabase(){return this.database===mh}isEqual(t){return t instanceof $l&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */const H0="__type__",HC="__max__",qc={mapValue:{}},F0="__vector__",ph="value";function Xr(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?vp(r)?4:GC(r)?9007199254740991:FC(r)?10:11:vt(28295,{value:r})}function Ti(r,t){if(r===t)return!0;const n=Xr(r);if(n!==Xr(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return Xl(r).isEqual(Xl(t));case 3:return function(o,u){if(typeof o.timestampValue=="string"&&typeof u.timestampValue=="string"&&o.timestampValue.length===u.timestampValue.length)return o.timestampValue===u.timestampValue;const f=Yr(o.timestampValue),m=Yr(u.timestampValue);return f.seconds===m.seconds&&f.nanos===m.nanos}(r,t);case 5:return r.stringValue===t.stringValue;case 6:return function(o,u){return Qr(o.bytesValue).isEqual(Qr(u.bytesValue))}(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return function(o,u){return fe(o.geoPointValue.latitude)===fe(u.geoPointValue.latitude)&&fe(o.geoPointValue.longitude)===fe(u.geoPointValue.longitude)}(r,t);case 2:return function(o,u){if("integerValue"in o&&"integerValue"in u)return fe(o.integerValue)===fe(u.integerValue);if("doubleValue"in o&&"doubleValue"in u){const f=fe(o.doubleValue),m=fe(u.doubleValue);return f===m?dh(f)===dh(m):isNaN(f)&&isNaN(m)}return!1}(r,t);case 9:return oo(r.arrayValue.values||[],t.arrayValue.values||[],Ti);case 10:case 11:return function(o,u){const f=o.mapValue.fields||{},m=u.mapValue.fields||{};if(mT(f)!==mT(m))return!1;for(const g in f)if(f.hasOwnProperty(g)&&(m[g]===void 0||!Ti(f[g],m[g])))return!1;return!0}(r,t);default:return vt(52216,{left:r})}}function Zl(r,t){return(r.values||[]).find(n=>Ti(n,t))!==void 0}function lo(r,t){if(r===t)return 0;const n=Xr(r),s=Xr(t);if(n!==s)return wt(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return wt(r.booleanValue,t.booleanValue);case 2:return function(u,f){const m=fe(u.integerValue||u.doubleValue),g=fe(f.integerValue||f.doubleValue);return m<g?-1:m>g?1:m===g?0:isNaN(m)?isNaN(g)?0:-1:1}(r,t);case 3:return gT(r.timestampValue,t.timestampValue);case 4:return gT(Xl(r),Xl(t));case 5:return Pm(r.stringValue,t.stringValue);case 6:return function(u,f){const m=Qr(u),g=Qr(f);return m.compareTo(g)}(r.bytesValue,t.bytesValue);case 7:return function(u,f){const m=u.split("/"),g=f.split("/");for(let _=0;_<m.length&&_<g.length;_++){const T=wt(m[_],g[_]);if(T!==0)return T}return wt(m.length,g.length)}(r.referenceValue,t.referenceValue);case 8:return function(u,f){const m=wt(fe(u.latitude),fe(f.latitude));return m!==0?m:wt(fe(u.longitude),fe(f.longitude))}(r.geoPointValue,t.geoPointValue);case 9:return _T(r.arrayValue,t.arrayValue);case 10:return function(u,f){var m,g,_,T;const S=u.fields||{},R=f.fields||{},z=(m=S[ph])===null||m===void 0?void 0:m.arrayValue,X=(g=R[ph])===null||g===void 0?void 0:g.arrayValue,tt=wt(((_=z?.values)===null||_===void 0?void 0:_.length)||0,((T=X?.values)===null||T===void 0?void 0:T.length)||0);return tt!==0?tt:_T(z,X)}(r.mapValue,t.mapValue);case 11:return function(u,f){if(u===qc.mapValue&&f===qc.mapValue)return 0;if(u===qc.mapValue)return 1;if(f===qc.mapValue)return-1;const m=u.fields||{},g=Object.keys(m),_=f.fields||{},T=Object.keys(_);g.sort(),T.sort();for(let S=0;S<g.length&&S<T.length;++S){const R=Pm(g[S],T[S]);if(R!==0)return R;const z=lo(m[g[S]],_[T[S]]);if(z!==0)return z}return wt(g.length,T.length)}(r.mapValue,t.mapValue);default:throw vt(23264,{Pe:n})}}function gT(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return wt(r,t);const n=Yr(r),s=Yr(t),o=wt(n.seconds,s.seconds);return o!==0?o:wt(n.nanos,s.nanos)}function _T(r,t){const n=r.values||[],s=t.values||[];for(let o=0;o<n.length&&o<s.length;++o){const u=lo(n[o],s[o]);if(u)return u}return wt(n.length,s.length)}function uo(r){return km(r)}function km(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(n){const s=Yr(n);return`time(${s.seconds},${s.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(n){return Qr(n).toBase64()}(r.bytesValue):"referenceValue"in r?function(n){return mt.fromName(n).toString()}(r.referenceValue):"geoPointValue"in r?function(n){return`geo(${n.latitude},${n.longitude})`}(r.geoPointValue):"arrayValue"in r?function(n){let s="[",o=!0;for(const u of n.values||[])o?o=!1:s+=",",s+=km(u);return s+"]"}(r.arrayValue):"mapValue"in r?function(n){const s=Object.keys(n.fields||{}).sort();let o="{",u=!0;for(const f of s)u?u=!1:o+=",",o+=`${f}:${km(n.fields[f])}`;return o+"}"}(r.mapValue):vt(61005,{value:r})}function Jc(r){switch(Xr(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=kh(r);return t?16+Jc(t):16;case 5:return 2*r.stringValue.length;case 6:return Qr(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(s){return(s.values||[]).reduce((o,u)=>o+Jc(u),0)}(r.arrayValue);case 10:case 11:return function(s){let o=0;return Zs(s.fields,(u,f)=>{o+=u.length+Jc(f)}),o}(r.mapValue);default:throw vt(13486,{value:r})}}function xm(r){return!!r&&"integerValue"in r}function Tp(r){return!!r&&"arrayValue"in r}function yT(r){return!!r&&"nullValue"in r}function vT(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function th(r){return!!r&&"mapValue"in r}function FC(r){var t,n;return((n=(((t=r?.mapValue)===null||t===void 0?void 0:t.fields)||{})[H0])===null||n===void 0?void 0:n.stringValue)===F0}function Ul(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const t={mapValue:{fields:{}}};return Zs(r.mapValue.fields,(n,s)=>t.mapValue.fields[n]=Ul(s)),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(r.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=Ul(r.arrayValue.values[n]);return t}return Object.assign({},r)}function GC(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===HC}/**
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
 */class xn{constructor(t){this.value=t}static empty(){return new xn({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let n=this.value;for(let s=0;s<t.length-1;++s)if(n=(n.mapValue.fields||{})[t.get(s)],!th(n))return null;return n=(n.mapValue.fields||{})[t.lastSegment()],n||null}}set(t,n){this.getFieldsMap(t.popLast())[t.lastSegment()]=Ul(n)}setAll(t){let n=je.emptyPath(),s={},o=[];t.forEach((f,m)=>{if(!n.isImmediateParentOf(m)){const g=this.getFieldsMap(n);this.applyChanges(g,s,o),s={},o=[],n=m.popLast()}f?s[m.lastSegment()]=Ul(f):o.push(m.lastSegment())});const u=this.getFieldsMap(n);this.applyChanges(u,s,o)}delete(t){const n=this.field(t.popLast());th(n)&&n.mapValue.fields&&delete n.mapValue.fields[t.lastSegment()]}isEqual(t){return Ti(this.value,t.value)}getFieldsMap(t){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<t.length;++s){let o=n.mapValue.fields[t.get(s)];th(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},n.mapValue.fields[t.get(s)]=o),n=o}return n.mapValue.fields}applyChanges(t,n,s){Zs(n,(o,u)=>t[o]=u);for(const o of s)delete t[o]}clone(){return new xn(Ul(this.value))}}function G0(r){const t=[];return Zs(r.fields,(n,s)=>{const o=new je([n]);if(th(s)){const u=G0(s.mapValue).fields;if(u.length===0)t.push(o);else for(const f of u)t.push(o.child(f))}else t.push(o)}),new $n(t)}/**
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
 */class Xe{constructor(t,n,s,o,u,f,m){this.key=t,this.documentType=n,this.version=s,this.readTime=o,this.createTime=u,this.data=f,this.documentState=m}static newInvalidDocument(t){return new Xe(t,0,At.min(),At.min(),At.min(),xn.empty(),0)}static newFoundDocument(t,n,s,o){return new Xe(t,1,n,At.min(),s,o,0)}static newNoDocument(t,n){return new Xe(t,2,n,At.min(),At.min(),xn.empty(),0)}static newUnknownDocument(t,n){return new Xe(t,3,n,At.min(),At.min(),xn.empty(),2)}convertToFoundDocument(t,n){return!this.createTime.isEqual(At.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=xn.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=xn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=At.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Xe&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class gh{constructor(t,n){this.position=t,this.inclusive=n}}function TT(r,t,n){let s=0;for(let o=0;o<r.position.length;o++){const u=t[o],f=r.position[o];if(u.field.isKeyField()?s=mt.comparator(mt.fromName(f.referenceValue),n.key):s=lo(f,n.data.field(u.field)),u.dir==="desc"&&(s*=-1),s!==0)break}return s}function ET(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let n=0;n<r.position.length;n++)if(!Ti(r.position[n],t.position[n]))return!1;return!0}/**
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
 */class _h{constructor(t,n="asc"){this.field=t,this.dir=n}}function KC(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
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
 */class K0{}class Se extends K0{constructor(t,n,s){super(),this.field=t,this.op=n,this.value=s}static create(t,n,s){return t.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(t,n,s):new QC(t,n,s):n==="array-contains"?new ZC(t,s):n==="in"?new WC(t,s):n==="not-in"?new JC(t,s):n==="array-contains-any"?new tN(t,s):new Se(t,n,s)}static createKeyFieldInFilter(t,n,s){return n==="in"?new XC(t,s):new $C(t,s)}matches(t){const n=t.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(lo(n,this.value)):n!==null&&Xr(this.value)===Xr(n)&&this.matchesComparison(lo(n,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return vt(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ei extends K0{constructor(t,n){super(),this.filters=t,this.op=n,this.Te=null}static create(t,n){return new Ei(t,n)}matches(t){return Y0(this)?this.filters.find(n=>!n.matches(t))===void 0:this.filters.find(n=>n.matches(t))!==void 0}getFlattenedFilters(){return this.Te!==null||(this.Te=this.filters.reduce((t,n)=>t.concat(n.getFlattenedFilters()),[])),this.Te}getFilters(){return Object.assign([],this.filters)}}function Y0(r){return r.op==="and"}function Q0(r){return YC(r)&&Y0(r)}function YC(r){for(const t of r.filters)if(t instanceof Ei)return!1;return!0}function Um(r){if(r instanceof Se)return r.field.canonicalString()+r.op.toString()+uo(r.value);if(Q0(r))return r.filters.map(t=>Um(t)).join(",");{const t=r.filters.map(n=>Um(n)).join(",");return`${r.op}(${t})`}}function X0(r,t){return r instanceof Se?function(s,o){return o instanceof Se&&s.op===o.op&&s.field.isEqual(o.field)&&Ti(s.value,o.value)}(r,t):r instanceof Ei?function(s,o){return o instanceof Ei&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce((u,f,m)=>u&&X0(f,o.filters[m]),!0):!1}(r,t):void vt(19439)}function $0(r){return r instanceof Se?function(n){return`${n.field.canonicalString()} ${n.op} ${uo(n.value)}`}(r):r instanceof Ei?function(n){return n.op.toString()+" {"+n.getFilters().map($0).join(" ,")+"}"}(r):"Filter"}class QC extends Se{constructor(t,n,s){super(t,n,s),this.key=mt.fromName(s.referenceValue)}matches(t){const n=mt.comparator(t.key,this.key);return this.matchesComparison(n)}}class XC extends Se{constructor(t,n){super(t,"in",n),this.keys=Z0("in",n)}matches(t){return this.keys.some(n=>n.isEqual(t.key))}}class $C extends Se{constructor(t,n){super(t,"not-in",n),this.keys=Z0("not-in",n)}matches(t){return!this.keys.some(n=>n.isEqual(t.key))}}function Z0(r,t){var n;return(((n=t.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>mt.fromName(s.referenceValue))}class ZC extends Se{constructor(t,n){super(t,"array-contains",n)}matches(t){const n=t.data.field(this.field);return Tp(n)&&Zl(n.arrayValue,this.value)}}class WC extends Se{constructor(t,n){super(t,"in",n)}matches(t){const n=t.data.field(this.field);return n!==null&&Zl(this.value.arrayValue,n)}}class JC extends Se{constructor(t,n){super(t,"not-in",n)}matches(t){if(Zl(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=t.data.field(this.field);return n!==null&&n.nullValue===void 0&&!Zl(this.value.arrayValue,n)}}class tN extends Se{constructor(t,n){super(t,"array-contains-any",n)}matches(t){const n=t.data.field(this.field);return!(!Tp(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>Zl(this.value.arrayValue,s))}}/**
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
 */class eN{constructor(t,n=null,s=[],o=[],u=null,f=null,m=null){this.path=t,this.collectionGroup=n,this.orderBy=s,this.filters=o,this.limit=u,this.startAt=f,this.endAt=m,this.Ie=null}}function AT(r,t=null,n=[],s=[],o=null,u=null,f=null){return new eN(r,t,n,s,o,u,f)}function Ep(r){const t=St(r);if(t.Ie===null){let n=t.path.canonicalString();t.collectionGroup!==null&&(n+="|cg:"+t.collectionGroup),n+="|f:",n+=t.filters.map(s=>Um(s)).join(","),n+="|ob:",n+=t.orderBy.map(s=>function(u){return u.field.canonicalString()+u.dir}(s)).join(","),Ph(t.limit)||(n+="|l:",n+=t.limit),t.startAt&&(n+="|lb:",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(s=>uo(s)).join(",")),t.endAt&&(n+="|ub:",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(s=>uo(s)).join(",")),t.Ie=n}return t.Ie}function Ap(r,t){if(r.limit!==t.limit||r.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<r.orderBy.length;n++)if(!KC(r.orderBy[n],t.orderBy[n]))return!1;if(r.filters.length!==t.filters.length)return!1;for(let n=0;n<r.filters.length;n++)if(!X0(r.filters[n],t.filters[n]))return!1;return r.collectionGroup===t.collectionGroup&&!!r.path.isEqual(t.path)&&!!ET(r.startAt,t.startAt)&&ET(r.endAt,t.endAt)}function Lm(r){return mt.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
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
 */class xh{constructor(t,n=null,s=[],o=[],u=null,f="F",m=null,g=null){this.path=t,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=o,this.limit=u,this.limitType=f,this.startAt=m,this.endAt=g,this.Ee=null,this.de=null,this.Ae=null,this.startAt,this.endAt}}function nN(r,t,n,s,o,u,f,m){return new xh(r,t,n,s,o,u,f,m)}function Sp(r){return new xh(r)}function ST(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function iN(r){return r.collectionGroup!==null}function Ll(r){const t=St(r);if(t.Ee===null){t.Ee=[];const n=new Set;for(const u of t.explicitOrderBy)t.Ee.push(u),n.add(u.field.canonicalString());const s=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(f){let m=new Re(je.comparator);return f.filters.forEach(g=>{g.getFlattenedFilters().forEach(_=>{_.isInequality()&&(m=m.add(_.field))})}),m})(t).forEach(u=>{n.has(u.canonicalString())||u.isKeyField()||t.Ee.push(new _h(u,s))}),n.has(je.keyField().canonicalString())||t.Ee.push(new _h(je.keyField(),s))}return t.Ee}function yi(r){const t=St(r);return t.de||(t.de=rN(t,Ll(r))),t.de}function rN(r,t){if(r.limitType==="F")return AT(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map(o=>{const u=o.dir==="desc"?"asc":"desc";return new _h(o.field,u)});const n=r.endAt?new gh(r.endAt.position,r.endAt.inclusive):null,s=r.startAt?new gh(r.startAt.position,r.startAt.inclusive):null;return AT(r.path,r.collectionGroup,t,r.filters,r.limit,n,s)}}function zm(r,t,n){return new xh(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),t,n,r.startAt,r.endAt)}function Uh(r,t){return Ap(yi(r),yi(t))&&r.limitType===t.limitType}function W0(r){return`${Ep(yi(r))}|lt:${r.limitType}`}function Qa(r){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(o=>$0(o)).join(", ")}]`),Ph(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(o=>function(f){return`${f.field.canonicalString()} (${f.dir})`}(o)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(o=>uo(o)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(o=>uo(o)).join(",")),`Target(${s})`}(yi(r))}; limitType=${r.limitType})`}function Lh(r,t){return t.isFoundDocument()&&function(s,o){const u=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(u):mt.isDocumentKey(s.path)?s.path.isEqual(u):s.path.isImmediateParentOf(u)}(r,t)&&function(s,o){for(const u of Ll(s))if(!u.field.isKeyField()&&o.data.field(u.field)===null)return!1;return!0}(r,t)&&function(s,o){for(const u of s.filters)if(!u.matches(o))return!1;return!0}(r,t)&&function(s,o){return!(s.startAt&&!function(f,m,g){const _=TT(f,m,g);return f.inclusive?_<=0:_<0}(s.startAt,Ll(s),o)||s.endAt&&!function(f,m,g){const _=TT(f,m,g);return f.inclusive?_>=0:_>0}(s.endAt,Ll(s),o))}(r,t)}function sN(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function J0(r){return(t,n)=>{let s=!1;for(const o of Ll(r)){const u=aN(o,t,n);if(u!==0)return u;s=s||o.field.isKeyField()}return 0}}function aN(r,t,n){const s=r.field.isKeyField()?mt.comparator(t.key,n.key):function(u,f,m){const g=f.data.field(u),_=m.data.field(u);return g!==null&&_!==null?lo(g,_):vt(42886)}(r.field,t,n);switch(r.dir){case"asc":return s;case"desc":return-1*s;default:return vt(19790,{direction:r.dir})}}/**
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
 */class Ws{constructor(t,n){this.mapKeyFn=t,this.equalsFn=n,this.inner={},this.innerSize=0}get(t){const n=this.mapKeyFn(t),s=this.inner[n];if(s!==void 0){for(const[o,u]of s)if(this.equalsFn(o,t))return u}}has(t){return this.get(t)!==void 0}set(t,n){const s=this.mapKeyFn(t),o=this.inner[s];if(o===void 0)return this.inner[s]=[[t,n]],void this.innerSize++;for(let u=0;u<o.length;u++)if(this.equalsFn(o[u][0],t))return void(o[u]=[t,n]);o.push([t,n]),this.innerSize++}delete(t){const n=this.mapKeyFn(t),s=this.inner[n];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return s.length===1?delete this.inner[n]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(t){Zs(this.inner,(n,s)=>{for(const[o,u]of s)t(o,u)})}isEmpty(){return U0(this.inner)}size(){return this.innerSize}}/**
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
 */const oN=new ie(mt.comparator);function ir(){return oN}const tA=new ie(mt.comparator);function Ml(...r){let t=tA;for(const n of r)t=t.insert(n.key,n);return t}function eA(r){let t=tA;return r.forEach((n,s)=>t=t.insert(n,s.overlayedDocument)),t}function Bs(){return zl()}function nA(){return zl()}function zl(){return new Ws(r=>r.toString(),(r,t)=>r.isEqual(t))}const lN=new ie(mt.comparator),uN=new Re(mt.comparator);function Vt(...r){let t=uN;for(const n of r)t=t.add(n);return t}const cN=new Re(wt);function hN(){return cN}/**
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
 */function bp(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:dh(t)?"-0":t}}function iA(r){return{integerValue:""+r}}function fN(r,t){return LC(t)?iA(t):bp(r,t)}/**
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
 */class zh{constructor(){this._=void 0}}function dN(r,t,n){return r instanceof yh?function(o,u){const f={fields:{[B0]:{stringValue:z0},[q0]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return u&&vp(u)&&(u=kh(u)),u&&(f.fields[j0]=u),{mapValue:f}}(n,t):r instanceof Wl?sA(r,t):r instanceof Jl?aA(r,t):function(o,u){const f=rA(o,u),m=bT(f)+bT(o.Re);return xm(f)&&xm(o.Re)?iA(m):bp(o.serializer,m)}(r,t)}function mN(r,t,n){return r instanceof Wl?sA(r,t):r instanceof Jl?aA(r,t):n}function rA(r,t){return r instanceof vh?function(s){return xm(s)||function(u){return!!u&&"doubleValue"in u}(s)}(t)?t:{integerValue:0}:null}class yh extends zh{}class Wl extends zh{constructor(t){super(),this.elements=t}}function sA(r,t){const n=oA(t);for(const s of r.elements)n.some(o=>Ti(o,s))||n.push(s);return{arrayValue:{values:n}}}class Jl extends zh{constructor(t){super(),this.elements=t}}function aA(r,t){let n=oA(t);for(const s of r.elements)n=n.filter(o=>!Ti(o,s));return{arrayValue:{values:n}}}class vh extends zh{constructor(t,n){super(),this.serializer=t,this.Re=n}}function bT(r){return fe(r.integerValue||r.doubleValue)}function oA(r){return Tp(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}function pN(r,t){return r.field.isEqual(t.field)&&function(s,o){return s instanceof Wl&&o instanceof Wl||s instanceof Jl&&o instanceof Jl?oo(s.elements,o.elements,Ti):s instanceof vh&&o instanceof vh?Ti(s.Re,o.Re):s instanceof yh&&o instanceof yh}(r.transform,t.transform)}class gN{constructor(t,n){this.version=t,this.transformResults=n}}class Wi{constructor(t,n){this.updateTime=t,this.exists=n}static none(){return new Wi}static exists(t){return new Wi(void 0,t)}static updateTime(t){return new Wi(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function eh(r,t){return r.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(r.updateTime):r.exists===void 0||r.exists===t.isFoundDocument()}class Bh{}function lA(r,t){if(!r.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return r.isNoDocument()?new cA(r.key,Wi.none()):new uu(r.key,r.data,Wi.none());{const n=r.data,s=xn.empty();let o=new Re(je.comparator);for(let u of t.fields)if(!o.has(u)){let f=n.field(u);f===null&&u.length>1&&(u=u.popLast(),f=n.field(u)),f===null?s.delete(u):s.set(u,f),o=o.add(u)}return new Js(r.key,s,new $n(o.toArray()),Wi.none())}}function _N(r,t,n){r instanceof uu?function(o,u,f){const m=o.value.clone(),g=IT(o.fieldTransforms,u,f.transformResults);m.setAll(g),u.convertToFoundDocument(f.version,m).setHasCommittedMutations()}(r,t,n):r instanceof Js?function(o,u,f){if(!eh(o.precondition,u))return void u.convertToUnknownDocument(f.version);const m=IT(o.fieldTransforms,u,f.transformResults),g=u.data;g.setAll(uA(o)),g.setAll(m),u.convertToFoundDocument(f.version,g).setHasCommittedMutations()}(r,t,n):function(o,u,f){u.convertToNoDocument(f.version).setHasCommittedMutations()}(0,t,n)}function Bl(r,t,n,s){return r instanceof uu?function(u,f,m,g){if(!eh(u.precondition,f))return m;const _=u.value.clone(),T=wT(u.fieldTransforms,g,f);return _.setAll(T),f.convertToFoundDocument(f.version,_).setHasLocalMutations(),null}(r,t,n,s):r instanceof Js?function(u,f,m,g){if(!eh(u.precondition,f))return m;const _=wT(u.fieldTransforms,g,f),T=f.data;return T.setAll(uA(u)),T.setAll(_),f.convertToFoundDocument(f.version,T).setHasLocalMutations(),m===null?null:m.unionWith(u.fieldMask.fields).unionWith(u.fieldTransforms.map(S=>S.field))}(r,t,n,s):function(u,f,m){return eh(u.precondition,f)?(f.convertToNoDocument(f.version).setHasLocalMutations(),null):m}(r,t,n)}function yN(r,t){let n=null;for(const s of r.fieldTransforms){const o=t.data.field(s.field),u=rA(s.transform,o||null);u!=null&&(n===null&&(n=xn.empty()),n.set(s.field,u))}return n||null}function RT(r,t){return r.type===t.type&&!!r.key.isEqual(t.key)&&!!r.precondition.isEqual(t.precondition)&&!!function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&oo(s,o,(u,f)=>pN(u,f))}(r.fieldTransforms,t.fieldTransforms)&&(r.type===0?r.value.isEqual(t.value):r.type!==1||r.data.isEqual(t.data)&&r.fieldMask.isEqual(t.fieldMask))}class uu extends Bh{constructor(t,n,s,o=[]){super(),this.key=t,this.value=n,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class Js extends Bh{constructor(t,n,s,o,u=[]){super(),this.key=t,this.data=n,this.fieldMask=s,this.precondition=o,this.fieldTransforms=u,this.type=1}getFieldMask(){return this.fieldMask}}function uA(r){const t=new Map;return r.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=r.data.field(n);t.set(n,s)}}),t}function IT(r,t,n){const s=new Map;qt(r.length===n.length,32656,{Ve:n.length,me:r.length});for(let o=0;o<n.length;o++){const u=r[o],f=u.transform,m=t.data.field(u.field);s.set(u.field,mN(f,m,n[o]))}return s}function wT(r,t,n){const s=new Map;for(const o of r){const u=o.transform,f=n.data.field(o.field);s.set(o.field,dN(u,f,t))}return s}class cA extends Bh{constructor(t,n){super(),this.key=t,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class vN extends Bh{constructor(t,n){super(),this.key=t,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class TN{constructor(t,n,s,o){this.batchId=t,this.localWriteTime=n,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(t,n){const s=n.mutationResults;for(let o=0;o<this.mutations.length;o++){const u=this.mutations[o];u.key.isEqual(t.key)&&_N(u,t,s[o])}}applyToLocalView(t,n){for(const s of this.baseMutations)s.key.isEqual(t.key)&&(n=Bl(s,t,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(t.key)&&(n=Bl(s,t,n,this.localWriteTime));return n}applyToLocalDocumentSet(t,n){const s=nA();return this.mutations.forEach(o=>{const u=t.get(o.key),f=u.overlayedDocument;let m=this.applyToLocalView(f,u.mutatedFields);m=n.has(o.key)?null:m;const g=lA(f,m);g!==null&&s.set(o.key,g),f.isValidDocument()||f.convertToNoDocument(At.min())}),s}keys(){return this.mutations.reduce((t,n)=>t.add(n.key),Vt())}isEqual(t){return this.batchId===t.batchId&&oo(this.mutations,t.mutations,(n,s)=>RT(n,s))&&oo(this.baseMutations,t.baseMutations,(n,s)=>RT(n,s))}}class Rp{constructor(t,n,s,o){this.batch=t,this.commitVersion=n,this.mutationResults=s,this.docVersions=o}static from(t,n,s){qt(t.mutations.length===s.length,58842,{fe:t.mutations.length,ge:s.length});let o=function(){return lN}();const u=t.mutations;for(let f=0;f<u.length;f++)o=o.insert(u[f].key,s[f].version);return new Rp(t,n,s,o)}}/**
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
 */class EN{constructor(t,n){this.largestBatchId=t,this.mutation=n}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
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
 */class AN{constructor(t,n){this.count=t,this.unchangedNames=n}}/**
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
 */var _e,Ut;function SN(r){switch(r){case W.OK:return vt(64938);case W.CANCELLED:case W.UNKNOWN:case W.DEADLINE_EXCEEDED:case W.RESOURCE_EXHAUSTED:case W.INTERNAL:case W.UNAVAILABLE:case W.UNAUTHENTICATED:return!1;case W.INVALID_ARGUMENT:case W.NOT_FOUND:case W.ALREADY_EXISTS:case W.PERMISSION_DENIED:case W.FAILED_PRECONDITION:case W.ABORTED:case W.OUT_OF_RANGE:case W.UNIMPLEMENTED:case W.DATA_LOSS:return!0;default:return vt(15467,{code:r})}}function hA(r){if(r===void 0)return nr("GRPC error has no .code"),W.UNKNOWN;switch(r){case _e.OK:return W.OK;case _e.CANCELLED:return W.CANCELLED;case _e.UNKNOWN:return W.UNKNOWN;case _e.DEADLINE_EXCEEDED:return W.DEADLINE_EXCEEDED;case _e.RESOURCE_EXHAUSTED:return W.RESOURCE_EXHAUSTED;case _e.INTERNAL:return W.INTERNAL;case _e.UNAVAILABLE:return W.UNAVAILABLE;case _e.UNAUTHENTICATED:return W.UNAUTHENTICATED;case _e.INVALID_ARGUMENT:return W.INVALID_ARGUMENT;case _e.NOT_FOUND:return W.NOT_FOUND;case _e.ALREADY_EXISTS:return W.ALREADY_EXISTS;case _e.PERMISSION_DENIED:return W.PERMISSION_DENIED;case _e.FAILED_PRECONDITION:return W.FAILED_PRECONDITION;case _e.ABORTED:return W.ABORTED;case _e.OUT_OF_RANGE:return W.OUT_OF_RANGE;case _e.UNIMPLEMENTED:return W.UNIMPLEMENTED;case _e.DATA_LOSS:return W.DATA_LOSS;default:return vt(39323,{code:r})}}(Ut=_e||(_e={}))[Ut.OK=0]="OK",Ut[Ut.CANCELLED=1]="CANCELLED",Ut[Ut.UNKNOWN=2]="UNKNOWN",Ut[Ut.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ut[Ut.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ut[Ut.NOT_FOUND=5]="NOT_FOUND",Ut[Ut.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ut[Ut.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ut[Ut.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ut[Ut.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ut[Ut.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ut[Ut.ABORTED=10]="ABORTED",Ut[Ut.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ut[Ut.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ut[Ut.INTERNAL=13]="INTERNAL",Ut[Ut.UNAVAILABLE=14]="UNAVAILABLE",Ut[Ut.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const bN=new Hr([4294967295,4294967295],0);function CT(r){const t=P0().encode(r),n=new I0;return n.update(t),new Uint8Array(n.digest())}function NT(r){const t=new DataView(r.buffer),n=t.getUint32(0,!0),s=t.getUint32(4,!0),o=t.getUint32(8,!0),u=t.getUint32(12,!0);return[new Hr([n,s],0),new Hr([o,u],0)]}class Ip{constructor(t,n,s){if(this.bitmap=t,this.padding=n,this.hashCount=s,n<0||n>=8)throw new Vl(`Invalid padding: ${n}`);if(s<0)throw new Vl(`Invalid hash count: ${s}`);if(t.length>0&&this.hashCount===0)throw new Vl(`Invalid hash count: ${s}`);if(t.length===0&&n!==0)throw new Vl(`Invalid padding when bitmap length is 0: ${n}`);this.pe=8*t.length-n,this.ye=Hr.fromNumber(this.pe)}we(t,n,s){let o=t.add(n.multiply(Hr.fromNumber(s)));return o.compare(bN)===1&&(o=new Hr([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ye).toNumber()}be(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.pe===0)return!1;const n=CT(t),[s,o]=NT(n);for(let u=0;u<this.hashCount;u++){const f=this.we(s,o,u);if(!this.be(f))return!1}return!0}static create(t,n,s){const o=t%8==0?0:8-t%8,u=new Uint8Array(Math.ceil(t/8)),f=new Ip(u,o,n);return s.forEach(m=>f.insert(m)),f}insert(t){if(this.pe===0)return;const n=CT(t),[s,o]=NT(n);for(let u=0;u<this.hashCount;u++){const f=this.we(s,o,u);this.Se(f)}}Se(t){const n=Math.floor(t/8),s=t%8;this.bitmap[n]|=1<<s}}class Vl extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class jh{constructor(t,n,s,o,u){this.snapshotVersion=t,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=u}static createSynthesizedRemoteEventForCurrentChange(t,n,s){const o=new Map;return o.set(t,cu.createSynthesizedTargetChangeForCurrentChange(t,n,s)),new jh(At.min(),o,new ie(wt),ir(),Vt())}}class cu{constructor(t,n,s,o,u){this.resumeToken=t,this.current=n,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=u}static createSynthesizedTargetChangeForCurrentChange(t,n,s){return new cu(s,n,Vt(),Vt(),Vt())}}/**
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
 */class nh{constructor(t,n,s,o){this.De=t,this.removedTargetIds=n,this.key=s,this.ve=o}}class fA{constructor(t,n){this.targetId=t,this.Ce=n}}class dA{constructor(t,n,s=qe.EMPTY_BYTE_STRING,o=null){this.state=t,this.targetIds=n,this.resumeToken=s,this.cause=o}}class OT{constructor(){this.Fe=0,this.Me=DT(),this.xe=qe.EMPTY_BYTE_STRING,this.Oe=!1,this.Ne=!0}get current(){return this.Oe}get resumeToken(){return this.xe}get Be(){return this.Fe!==0}get Le(){return this.Ne}ke(t){t.approximateByteSize()>0&&(this.Ne=!0,this.xe=t)}qe(){let t=Vt(),n=Vt(),s=Vt();return this.Me.forEach((o,u)=>{switch(u){case 0:t=t.add(o);break;case 2:n=n.add(o);break;case 1:s=s.add(o);break;default:vt(38017,{changeType:u})}}),new cu(this.xe,this.Oe,t,n,s)}Qe(){this.Ne=!1,this.Me=DT()}$e(t,n){this.Ne=!0,this.Me=this.Me.insert(t,n)}Ue(t){this.Ne=!0,this.Me=this.Me.remove(t)}Ke(){this.Fe+=1}We(){this.Fe-=1,qt(this.Fe>=0,3241,{Fe:this.Fe})}Ge(){this.Ne=!0,this.Oe=!0}}class RN{constructor(t){this.ze=t,this.je=new Map,this.He=ir(),this.Je=Hc(),this.Ye=Hc(),this.Ze=new ie(wt)}Xe(t){for(const n of t.De)t.ve&&t.ve.isFoundDocument()?this.et(n,t.ve):this.tt(n,t.key,t.ve);for(const n of t.removedTargetIds)this.tt(n,t.key,t.ve)}nt(t){this.forEachTarget(t,n=>{const s=this.rt(n);switch(t.state){case 0:this.it(n)&&s.ke(t.resumeToken);break;case 1:s.We(),s.Be||s.Qe(),s.ke(t.resumeToken);break;case 2:s.We(),s.Be||this.removeTarget(n);break;case 3:this.it(n)&&(s.Ge(),s.ke(t.resumeToken));break;case 4:this.it(n)&&(this.st(n),s.ke(t.resumeToken));break;default:vt(56790,{state:t.state})}})}forEachTarget(t,n){t.targetIds.length>0?t.targetIds.forEach(n):this.je.forEach((s,o)=>{this.it(o)&&n(o)})}ot(t){const n=t.targetId,s=t.Ce.count,o=this._t(n);if(o){const u=o.target;if(Lm(u))if(s===0){const f=new mt(u.path);this.tt(n,f,Xe.newNoDocument(f,At.min()))}else qt(s===1,20013,{expectedCount:s});else{const f=this.ut(n);if(f!==s){const m=this.ct(t),g=m?this.lt(m,t,f):1;if(g!==0){this.st(n);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(n,_)}}}}}ct(t){const n=t.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:u=0}=n;let f,m;try{f=Qr(s).toUint8Array()}catch(g){if(g instanceof L0)return ao("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{m=new Ip(f,o,u)}catch(g){return ao(g instanceof Vl?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return m.pe===0?null:m}lt(t,n,s){return n.Ce.count===s-this.Tt(t,n.targetId)?0:2}Tt(t,n){const s=this.ze.getRemoteKeysForTarget(n);let o=0;return s.forEach(u=>{const f=this.ze.Pt(),m=`projects/${f.projectId}/databases/${f.database}/documents/${u.path.canonicalString()}`;t.mightContain(m)||(this.tt(n,u,null),o++)}),o}It(t){const n=new Map;this.je.forEach((u,f)=>{const m=this._t(f);if(m){if(u.current&&Lm(m.target)){const g=new mt(m.target.path);this.Et(g).has(f)||this.dt(f,g)||this.tt(f,g,Xe.newNoDocument(g,t))}u.Le&&(n.set(f,u.qe()),u.Qe())}});let s=Vt();this.Ye.forEach((u,f)=>{let m=!0;f.forEachWhile(g=>{const _=this._t(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(m=!1,!1)}),m&&(s=s.add(u))}),this.He.forEach((u,f)=>f.setReadTime(t));const o=new jh(t,n,this.Ze,this.He,s);return this.He=ir(),this.Je=Hc(),this.Ye=Hc(),this.Ze=new ie(wt),o}et(t,n){if(!this.it(t))return;const s=this.dt(t,n.key)?2:0;this.rt(t).$e(n.key,s),this.He=this.He.insert(n.key,n),this.Je=this.Je.insert(n.key,this.Et(n.key).add(t)),this.Ye=this.Ye.insert(n.key,this.At(n.key).add(t))}tt(t,n,s){if(!this.it(t))return;const o=this.rt(t);this.dt(t,n)?o.$e(n,1):o.Ue(n),this.Ye=this.Ye.insert(n,this.At(n).delete(t)),this.Ye=this.Ye.insert(n,this.At(n).add(t)),s&&(this.He=this.He.insert(n,s))}removeTarget(t){this.je.delete(t)}ut(t){const n=this.rt(t).qe();return this.ze.getRemoteKeysForTarget(t).size+n.addedDocuments.size-n.removedDocuments.size}Ke(t){this.rt(t).Ke()}rt(t){let n=this.je.get(t);return n||(n=new OT,this.je.set(t,n)),n}At(t){let n=this.Ye.get(t);return n||(n=new Re(wt),this.Ye=this.Ye.insert(t,n)),n}Et(t){let n=this.Je.get(t);return n||(n=new Re(wt),this.Je=this.Je.insert(t,n)),n}it(t){const n=this._t(t)!==null;return n||rt("WatchChangeAggregator","Detected inactive target",t),n}_t(t){const n=this.je.get(t);return n&&n.Be?null:this.ze.Rt(t)}st(t){this.je.set(t,new OT),this.ze.getRemoteKeysForTarget(t).forEach(n=>{this.tt(t,n,null)})}dt(t,n){return this.ze.getRemoteKeysForTarget(t).has(n)}}function Hc(){return new ie(mt.comparator)}function DT(){return new ie(mt.comparator)}const IN={asc:"ASCENDING",desc:"DESCENDING"},wN={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},CN={and:"AND",or:"OR"};class NN{constructor(t,n){this.databaseId=t,this.useProto3Json=n}}function Bm(r,t){return r.useProto3Json||Ph(t)?t:{value:t}}function Th(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function mA(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function ON(r,t){return Th(r,t.toTimestamp())}function vi(r){return qt(!!r,49232),At.fromTimestamp(function(n){const s=Yr(n);return new be(s.seconds,s.nanos)}(r))}function wp(r,t){return jm(r,t).canonicalString()}function jm(r,t){const n=function(o){return new le(["projects",o.projectId,"databases",o.database])}(r).child("documents");return t===void 0?n:n.child(t)}function pA(r){const t=le.fromString(r);return qt(TA(t),10190,{key:t.toString()}),t}function qm(r,t){return wp(r.databaseId,t.path)}function um(r,t){const n=pA(t);if(n.get(1)!==r.databaseId.projectId)throw new dt(W.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+r.databaseId.projectId);if(n.get(3)!==r.databaseId.database)throw new dt(W.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+r.databaseId.database);return new mt(_A(n))}function gA(r,t){return wp(r.databaseId,t)}function DN(r){const t=pA(r);return t.length===4?le.emptyPath():_A(t)}function Hm(r){return new le(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function _A(r){return qt(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function MT(r,t,n){return{name:qm(r,t),fields:n.value.mapValue.fields}}function MN(r,t){let n;if("targetChange"in t){t.targetChange;const s=function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:vt(39313,{state:_})}(t.targetChange.targetChangeType||"NO_CHANGE"),o=t.targetChange.targetIds||[],u=function(_,T){return _.useProto3Json?(qt(T===void 0||typeof T=="string",58123),qe.fromBase64String(T||"")):(qt(T===void 0||T instanceof Buffer||T instanceof Uint8Array,16193),qe.fromUint8Array(T||new Uint8Array))}(r,t.targetChange.resumeToken),f=t.targetChange.cause,m=f&&function(_){const T=_.code===void 0?W.UNKNOWN:hA(_.code);return new dt(T,_.message||"")}(f);n=new dA(s,o,u,m||null)}else if("documentChange"in t){t.documentChange;const s=t.documentChange;s.document,s.document.name,s.document.updateTime;const o=um(r,s.document.name),u=vi(s.document.updateTime),f=s.document.createTime?vi(s.document.createTime):At.min(),m=new xn({mapValue:{fields:s.document.fields}}),g=Xe.newFoundDocument(o,u,f,m),_=s.targetIds||[],T=s.removedTargetIds||[];n=new nh(_,T,g.key,g)}else if("documentDelete"in t){t.documentDelete;const s=t.documentDelete;s.document;const o=um(r,s.document),u=s.readTime?vi(s.readTime):At.min(),f=Xe.newNoDocument(o,u),m=s.removedTargetIds||[];n=new nh([],m,f.key,f)}else if("documentRemove"in t){t.documentRemove;const s=t.documentRemove;s.document;const o=um(r,s.document),u=s.removedTargetIds||[];n=new nh([],u,o,null)}else{if(!("filter"in t))return vt(11601,{Vt:t});{t.filter;const s=t.filter;s.targetId;const{count:o=0,unchangedNames:u}=s,f=new AN(o,u),m=s.targetId;n=new fA(m,f)}}return n}function VN(r,t){let n;if(t instanceof uu)n={update:MT(r,t.key,t.value)};else if(t instanceof cA)n={delete:qm(r,t.key)};else if(t instanceof Js)n={update:MT(r,t.key,t.data),updateMask:qN(t.fieldMask)};else{if(!(t instanceof vN))return vt(16599,{ft:t.type});n={verify:qm(r,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(s=>function(u,f){const m=f.transform;if(m instanceof yh)return{fieldPath:f.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(m instanceof Wl)return{fieldPath:f.field.canonicalString(),appendMissingElements:{values:m.elements}};if(m instanceof Jl)return{fieldPath:f.field.canonicalString(),removeAllFromArray:{values:m.elements}};if(m instanceof vh)return{fieldPath:f.field.canonicalString(),increment:m.Re};throw vt(20930,{transform:f.transform})}(0,s))),t.precondition.isNone||(n.currentDocument=function(o,u){return u.updateTime!==void 0?{updateTime:ON(o,u.updateTime)}:u.exists!==void 0?{exists:u.exists}:vt(27497)}(r,t.precondition)),n}function PN(r,t){return r&&r.length>0?(qt(t!==void 0,14353),r.map(n=>function(o,u){let f=o.updateTime?vi(o.updateTime):vi(u);return f.isEqual(At.min())&&(f=vi(u)),new gN(f,o.transformResults||[])}(n,t))):[]}function kN(r,t){return{documents:[gA(r,t.path)]}}function xN(r,t){const n={structuredQuery:{}},s=t.path;let o;t.collectionGroup!==null?(o=s,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(o=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=gA(r,o);const u=function(_){if(_.length!==0)return vA(Ei.create(_,"and"))}(t.filters);u&&(n.structuredQuery.where=u);const f=function(_){if(_.length!==0)return _.map(T=>function(R){return{field:Xa(R.field),direction:zN(R.dir)}}(T))}(t.orderBy);f&&(n.structuredQuery.orderBy=f);const m=Bm(r,t.limit);return m!==null&&(n.structuredQuery.limit=m),t.startAt&&(n.structuredQuery.startAt=function(_){return{before:_.inclusive,values:_.position}}(t.startAt)),t.endAt&&(n.structuredQuery.endAt=function(_){return{before:!_.inclusive,values:_.position}}(t.endAt)),{gt:n,parent:o}}function UN(r){let t=DN(r.parent);const n=r.structuredQuery,s=n.from?n.from.length:0;let o=null;if(s>0){qt(s===1,65062);const T=n.from[0];T.allDescendants?o=T.collectionId:t=t.child(T.collectionId)}let u=[];n.where&&(u=function(S){const R=yA(S);return R instanceof Ei&&Q0(R)?R.getFilters():[R]}(n.where));let f=[];n.orderBy&&(f=function(S){return S.map(R=>function(X){return new _h($a(X.field),function(Y){switch(Y){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(X.direction))}(R))}(n.orderBy));let m=null;n.limit&&(m=function(S){let R;return R=typeof S=="object"?S.value:S,Ph(R)?null:R}(n.limit));let g=null;n.startAt&&(g=function(S){const R=!!S.before,z=S.values||[];return new gh(z,R)}(n.startAt));let _=null;return n.endAt&&(_=function(S){const R=!S.before,z=S.values||[];return new gh(z,R)}(n.endAt)),nN(t,o,f,u,m,"F",g,_)}function LN(r,t){const n=function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return vt(28987,{purpose:o})}}(t.purpose);return n==null?null:{"goog-listen-tags":n}}function yA(r){return r.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=$a(n.unaryFilter.field);return Se.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=$a(n.unaryFilter.field);return Se.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const u=$a(n.unaryFilter.field);return Se.create(u,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const f=$a(n.unaryFilter.field);return Se.create(f,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return vt(61313);default:return vt(60726)}}(r):r.fieldFilter!==void 0?function(n){return Se.create($a(n.fieldFilter.field),function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return vt(58110);default:return vt(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(n){return Ei.create(n.compositeFilter.filters.map(s=>yA(s)),function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return vt(1026)}}(n.compositeFilter.op))}(r):vt(30097,{filter:r})}function zN(r){return IN[r]}function BN(r){return wN[r]}function jN(r){return CN[r]}function Xa(r){return{fieldPath:r.canonicalString()}}function $a(r){return je.fromServerFormat(r.fieldPath)}function vA(r){return r instanceof Se?function(n){if(n.op==="=="){if(vT(n.value))return{unaryFilter:{field:Xa(n.field),op:"IS_NAN"}};if(yT(n.value))return{unaryFilter:{field:Xa(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(vT(n.value))return{unaryFilter:{field:Xa(n.field),op:"IS_NOT_NAN"}};if(yT(n.value))return{unaryFilter:{field:Xa(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Xa(n.field),op:BN(n.op),value:n.value}}}(r):r instanceof Ei?function(n){const s=n.getFilters().map(o=>vA(o));return s.length===1?s[0]:{compositeFilter:{op:jN(n.op),filters:s}}}(r):vt(54877,{filter:r})}function qN(r){const t=[];return r.fields.forEach(n=>t.push(n.canonicalString())),{fieldPaths:t}}function TA(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
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
 */class Br{constructor(t,n,s,o,u=At.min(),f=At.min(),m=qe.EMPTY_BYTE_STRING,g=null){this.target=t,this.targetId=n,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=u,this.lastLimboFreeSnapshotVersion=f,this.resumeToken=m,this.expectedCount=g}withSequenceNumber(t){return new Br(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,n){return new Br(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new Br(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new Br(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
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
 */class HN{constructor(t){this.wt=t}}function FN(r){const t=UN({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?zm(t,t.limit,"L"):t}/**
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
 */class GN{constructor(){this.Cn=new KN}addToCollectionParentIndex(t,n){return this.Cn.add(n),$.resolve()}getCollectionParents(t,n){return $.resolve(this.Cn.getEntries(n))}addFieldIndex(t,n){return $.resolve()}deleteFieldIndex(t,n){return $.resolve()}deleteAllFieldIndexes(t){return $.resolve()}createTargetIndexes(t,n){return $.resolve()}getDocumentsMatchingTarget(t,n){return $.resolve(null)}getIndexType(t,n){return $.resolve(0)}getFieldIndexes(t,n){return $.resolve([])}getNextCollectionGroupToUpdate(t){return $.resolve(null)}getMinOffset(t,n){return $.resolve(Kr.min())}getMinOffsetFromCollectionGroup(t,n){return $.resolve(Kr.min())}updateCollectionGroup(t,n,s){return $.resolve()}updateIndexEntries(t,n){return $.resolve()}}class KN{constructor(){this.index={}}add(t){const n=t.lastSegment(),s=t.popLast(),o=this.index[n]||new Re(le.comparator),u=!o.has(s);return this.index[n]=o.add(s),u}has(t){const n=t.lastSegment(),s=t.popLast(),o=this.index[n];return o&&o.has(s)}getEntries(t){return(this.index[t]||new Re(le.comparator)).toArray()}}/**
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
 */const VT={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},EA=41943040;class un{static withCacheSize(t){return new un(t,un.DEFAULT_COLLECTION_PERCENTILE,un.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,n,s){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=s}}/**
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
 */un.DEFAULT_COLLECTION_PERCENTILE=10,un.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,un.DEFAULT=new un(EA,un.DEFAULT_COLLECTION_PERCENTILE,un.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),un.DISABLED=new un(-1,0,0);/**
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
 */class co{constructor(t){this.ur=t}next(){return this.ur+=2,this.ur}static cr(){return new co(0)}static lr(){return new co(-1)}}/**
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
 */const PT="LruGarbageCollector",YN=1048576;function kT([r,t],[n,s]){const o=wt(r,n);return o===0?wt(t,s):o}class QN{constructor(t){this.Er=t,this.buffer=new Re(kT),this.dr=0}Ar(){return++this.dr}Rr(t){const n=[t,this.Ar()];if(this.buffer.size<this.Er)this.buffer=this.buffer.add(n);else{const s=this.buffer.last();kT(n,s)<0&&(this.buffer=this.buffer.delete(s).add(n))}}get maxValue(){return this.buffer.last()[0]}}class XN{constructor(t,n,s){this.garbageCollector=t,this.asyncQueue=n,this.localStore=s,this.Vr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.mr(6e4)}stop(){this.Vr&&(this.Vr.cancel(),this.Vr=null)}get started(){return this.Vr!==null}mr(t){rt(PT,`Garbage collection scheduled in ${t}ms`),this.Vr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Vr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){_o(n)?rt(PT,"Ignoring IndexedDB error during garbage collection: ",n):await go(n)}await this.mr(3e5)})}}class $N{constructor(t,n){this.gr=t,this.params=n}calculateTargetCount(t,n){return this.gr.pr(t).next(s=>Math.floor(n/100*s))}nthSequenceNumber(t,n){if(n===0)return $.resolve(Vh.le);const s=new QN(n);return this.gr.forEachTarget(t,o=>s.Rr(o.sequenceNumber)).next(()=>this.gr.yr(t,o=>s.Rr(o))).next(()=>s.maxValue)}removeTargets(t,n,s){return this.gr.removeTargets(t,n,s)}removeOrphanedDocuments(t,n){return this.gr.removeOrphanedDocuments(t,n)}collect(t,n){return this.params.cacheSizeCollectionThreshold===-1?(rt("LruGarbageCollector","Garbage collection skipped; disabled"),$.resolve(VT)):this.getCacheSize(t).next(s=>s<this.params.cacheSizeCollectionThreshold?(rt("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),VT):this.wr(t,n))}getCacheSize(t){return this.gr.getCacheSize(t)}wr(t,n){let s,o,u,f,m,g,_;const T=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(S=>(S>this.params.maximumSequenceNumbersToCollect?(rt("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${S}`),o=this.params.maximumSequenceNumbersToCollect):o=S,f=Date.now(),this.nthSequenceNumber(t,o))).next(S=>(s=S,m=Date.now(),this.removeTargets(t,s,n))).next(S=>(u=S,g=Date.now(),this.removeOrphanedDocuments(t,s))).next(S=>(_=Date.now(),Ya()<=Mt.DEBUG&&rt("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${f-T}ms
	Determined least recently used ${o} in `+(m-f)+`ms
	Removed ${u} targets in `+(g-m)+`ms
	Removed ${S} documents in `+(_-g)+`ms
Total Duration: ${_-T}ms`),$.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:u,documentsRemoved:S})))}}function ZN(r,t){return new $N(r,t)}/**
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
 */class WN{constructor(){this.changes=new Ws(t=>t.toString(),(t,n)=>t.isEqual(n)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,n){this.assertNotApplied(),this.changes.set(t,Xe.newInvalidDocument(t).setReadTime(n))}getEntry(t,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?$.resolve(s):this.getFromCache(t,n)}getEntries(t,n){return this.getAllFromCache(t,n)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
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
 */class JN{constructor(t,n){this.overlayedDocument=t,this.mutatedFields=n}}/**
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
 */class t2{constructor(t,n,s,o){this.remoteDocumentCache=t,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=o}getDocument(t,n){let s=null;return this.documentOverlayCache.getOverlay(t,n).next(o=>(s=o,this.remoteDocumentCache.getEntry(t,n))).next(o=>(s!==null&&Bl(s.mutation,o,$n.empty(),be.now()),o))}getDocuments(t,n){return this.remoteDocumentCache.getEntries(t,n).next(s=>this.getLocalViewOfDocuments(t,s,Vt()).next(()=>s))}getLocalViewOfDocuments(t,n,s=Vt()){const o=Bs();return this.populateOverlays(t,o,n).next(()=>this.computeViews(t,n,o,s).next(u=>{let f=Ml();return u.forEach((m,g)=>{f=f.insert(m,g.overlayedDocument)}),f}))}getOverlayedDocuments(t,n){const s=Bs();return this.populateOverlays(t,s,n).next(()=>this.computeViews(t,n,s,Vt()))}populateOverlays(t,n,s){const o=[];return s.forEach(u=>{n.has(u)||o.push(u)}),this.documentOverlayCache.getOverlays(t,o).next(u=>{u.forEach((f,m)=>{n.set(f,m)})})}computeViews(t,n,s,o){let u=ir();const f=zl(),m=function(){return zl()}();return n.forEach((g,_)=>{const T=s.get(_.key);o.has(_.key)&&(T===void 0||T.mutation instanceof Js)?u=u.insert(_.key,_):T!==void 0?(f.set(_.key,T.mutation.getFieldMask()),Bl(T.mutation,_,T.mutation.getFieldMask(),be.now())):f.set(_.key,$n.empty())}),this.recalculateAndSaveOverlays(t,u).next(g=>(g.forEach((_,T)=>f.set(_,T)),n.forEach((_,T)=>{var S;return m.set(_,new JN(T,(S=f.get(_))!==null&&S!==void 0?S:null))}),m))}recalculateAndSaveOverlays(t,n){const s=zl();let o=new ie((f,m)=>f-m),u=Vt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,n).next(f=>{for(const m of f)m.keys().forEach(g=>{const _=n.get(g);if(_===null)return;let T=s.get(g)||$n.empty();T=m.applyToLocalView(_,T),s.set(g,T);const S=(o.get(m.batchId)||Vt()).add(g);o=o.insert(m.batchId,S)})}).next(()=>{const f=[],m=o.getReverseIterator();for(;m.hasNext();){const g=m.getNext(),_=g.key,T=g.value,S=nA();T.forEach(R=>{if(!u.has(R)){const z=lA(n.get(R),s.get(R));z!==null&&S.set(R,z),u=u.add(R)}}),f.push(this.documentOverlayCache.saveOverlays(t,_,S))}return $.waitFor(f)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(t,n){return this.remoteDocumentCache.getEntries(t,n).next(s=>this.recalculateAndSaveOverlays(t,s))}getDocumentsMatchingQuery(t,n,s,o){return function(f){return mt.isDocumentKey(f.path)&&f.collectionGroup===null&&f.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(t,n.path):iN(n)?this.getDocumentsMatchingCollectionGroupQuery(t,n,s,o):this.getDocumentsMatchingCollectionQuery(t,n,s,o)}getNextDocuments(t,n,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(t,n,s,o).next(u=>{const f=o-u.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,n,s.largestBatchId,o-u.size):$.resolve(Bs());let m=Ql,g=u;return f.next(_=>$.forEach(_,(T,S)=>(m<S.largestBatchId&&(m=S.largestBatchId),u.get(T)?$.resolve():this.remoteDocumentCache.getEntry(t,T).next(R=>{g=g.insert(T,R)}))).next(()=>this.populateOverlays(t,_,u)).next(()=>this.computeViews(t,g,_,Vt())).next(T=>({batchId:m,changes:eA(T)})))})}getDocumentsMatchingDocumentQuery(t,n){return this.getDocument(t,new mt(n)).next(s=>{let o=Ml();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o})}getDocumentsMatchingCollectionGroupQuery(t,n,s,o){const u=n.collectionGroup;let f=Ml();return this.indexManager.getCollectionParents(t,u).next(m=>$.forEach(m,g=>{const _=function(S,R){return new xh(R,null,S.explicitOrderBy.slice(),S.filters.slice(),S.limit,S.limitType,S.startAt,S.endAt)}(n,g.child(u));return this.getDocumentsMatchingCollectionQuery(t,_,s,o).next(T=>{T.forEach((S,R)=>{f=f.insert(S,R)})})}).next(()=>f))}getDocumentsMatchingCollectionQuery(t,n,s,o){let u;return this.documentOverlayCache.getOverlaysForCollection(t,n.path,s.largestBatchId).next(f=>(u=f,this.remoteDocumentCache.getDocumentsMatchingQuery(t,n,s,u,o))).next(f=>{u.forEach((g,_)=>{const T=_.getKey();f.get(T)===null&&(f=f.insert(T,Xe.newInvalidDocument(T)))});let m=Ml();return f.forEach((g,_)=>{const T=u.get(g);T!==void 0&&Bl(T.mutation,_,$n.empty(),be.now()),Lh(n,_)&&(m=m.insert(g,_))}),m})}}/**
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
 */class e2{constructor(t){this.serializer=t,this.kr=new Map,this.qr=new Map}getBundleMetadata(t,n){return $.resolve(this.kr.get(n))}saveBundleMetadata(t,n){return this.kr.set(n.id,function(o){return{id:o.id,version:o.version,createTime:vi(o.createTime)}}(n)),$.resolve()}getNamedQuery(t,n){return $.resolve(this.qr.get(n))}saveNamedQuery(t,n){return this.qr.set(n.name,function(o){return{name:o.name,query:FN(o.bundledQuery),readTime:vi(o.readTime)}}(n)),$.resolve()}}/**
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
 */class n2{constructor(){this.overlays=new ie(mt.comparator),this.Qr=new Map}getOverlay(t,n){return $.resolve(this.overlays.get(n))}getOverlays(t,n){const s=Bs();return $.forEach(n,o=>this.getOverlay(t,o).next(u=>{u!==null&&s.set(o,u)})).next(()=>s)}saveOverlays(t,n,s){return s.forEach((o,u)=>{this.St(t,n,u)}),$.resolve()}removeOverlaysForBatchId(t,n,s){const o=this.Qr.get(s);return o!==void 0&&(o.forEach(u=>this.overlays=this.overlays.remove(u)),this.Qr.delete(s)),$.resolve()}getOverlaysForCollection(t,n,s){const o=Bs(),u=n.length+1,f=new mt(n.child("")),m=this.overlays.getIteratorFrom(f);for(;m.hasNext();){const g=m.getNext().value,_=g.getKey();if(!n.isPrefixOf(_.path))break;_.path.length===u&&g.largestBatchId>s&&o.set(g.getKey(),g)}return $.resolve(o)}getOverlaysForCollectionGroup(t,n,s,o){let u=new ie((_,T)=>_-T);const f=this.overlays.getIterator();for(;f.hasNext();){const _=f.getNext().value;if(_.getKey().getCollectionGroup()===n&&_.largestBatchId>s){let T=u.get(_.largestBatchId);T===null&&(T=Bs(),u=u.insert(_.largestBatchId,T)),T.set(_.getKey(),_)}}const m=Bs(),g=u.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach((_,T)=>m.set(_,T)),!(m.size()>=o)););return $.resolve(m)}St(t,n,s){const o=this.overlays.get(s.key);if(o!==null){const f=this.Qr.get(o.largestBatchId).delete(s.key);this.Qr.set(o.largestBatchId,f)}this.overlays=this.overlays.insert(s.key,new EN(n,s));let u=this.Qr.get(n);u===void 0&&(u=Vt(),this.Qr.set(n,u)),this.Qr.set(n,u.add(s.key))}}/**
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
 */class i2{constructor(){this.sessionToken=qe.EMPTY_BYTE_STRING}getSessionToken(t){return $.resolve(this.sessionToken)}setSessionToken(t,n){return this.sessionToken=n,$.resolve()}}/**
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
 */class Cp{constructor(){this.$r=new Re(Ve.Ur),this.Kr=new Re(Ve.Wr)}isEmpty(){return this.$r.isEmpty()}addReference(t,n){const s=new Ve(t,n);this.$r=this.$r.add(s),this.Kr=this.Kr.add(s)}Gr(t,n){t.forEach(s=>this.addReference(s,n))}removeReference(t,n){this.zr(new Ve(t,n))}jr(t,n){t.forEach(s=>this.removeReference(s,n))}Hr(t){const n=new mt(new le([])),s=new Ve(n,t),o=new Ve(n,t+1),u=[];return this.Kr.forEachInRange([s,o],f=>{this.zr(f),u.push(f.key)}),u}Jr(){this.$r.forEach(t=>this.zr(t))}zr(t){this.$r=this.$r.delete(t),this.Kr=this.Kr.delete(t)}Yr(t){const n=new mt(new le([])),s=new Ve(n,t),o=new Ve(n,t+1);let u=Vt();return this.Kr.forEachInRange([s,o],f=>{u=u.add(f.key)}),u}containsKey(t){const n=new Ve(t,0),s=this.$r.firstAfterOrEqual(n);return s!==null&&t.isEqual(s.key)}}class Ve{constructor(t,n){this.key=t,this.Zr=n}static Ur(t,n){return mt.comparator(t.key,n.key)||wt(t.Zr,n.Zr)}static Wr(t,n){return wt(t.Zr,n.Zr)||mt.comparator(t.key,n.key)}}/**
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
 */class r2{constructor(t,n){this.indexManager=t,this.referenceDelegate=n,this.mutationQueue=[],this.nr=1,this.Xr=new Re(Ve.Ur)}checkEmpty(t){return $.resolve(this.mutationQueue.length===0)}addMutationBatch(t,n,s,o){const u=this.nr;this.nr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const f=new TN(u,n,s,o);this.mutationQueue.push(f);for(const m of o)this.Xr=this.Xr.add(new Ve(m.key,u)),this.indexManager.addToCollectionParentIndex(t,m.key.path.popLast());return $.resolve(f)}lookupMutationBatch(t,n){return $.resolve(this.ei(n))}getNextMutationBatchAfterBatchId(t,n){const s=n+1,o=this.ti(s),u=o<0?0:o;return $.resolve(this.mutationQueue.length>u?this.mutationQueue[u]:null)}getHighestUnacknowledgedBatchId(){return $.resolve(this.mutationQueue.length===0?yp:this.nr-1)}getAllMutationBatches(t){return $.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,n){const s=new Ve(n,0),o=new Ve(n,Number.POSITIVE_INFINITY),u=[];return this.Xr.forEachInRange([s,o],f=>{const m=this.ei(f.Zr);u.push(m)}),$.resolve(u)}getAllMutationBatchesAffectingDocumentKeys(t,n){let s=new Re(wt);return n.forEach(o=>{const u=new Ve(o,0),f=new Ve(o,Number.POSITIVE_INFINITY);this.Xr.forEachInRange([u,f],m=>{s=s.add(m.Zr)})}),$.resolve(this.ni(s))}getAllMutationBatchesAffectingQuery(t,n){const s=n.path,o=s.length+1;let u=s;mt.isDocumentKey(u)||(u=u.child(""));const f=new Ve(new mt(u),0);let m=new Re(wt);return this.Xr.forEachWhile(g=>{const _=g.key.path;return!!s.isPrefixOf(_)&&(_.length===o&&(m=m.add(g.Zr)),!0)},f),$.resolve(this.ni(m))}ni(t){const n=[];return t.forEach(s=>{const o=this.ei(s);o!==null&&n.push(o)}),n}removeMutationBatch(t,n){qt(this.ri(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Xr;return $.forEach(n.mutations,o=>{const u=new Ve(o.key,n.batchId);return s=s.delete(u),this.referenceDelegate.markPotentiallyOrphaned(t,o.key)}).next(()=>{this.Xr=s})}sr(t){}containsKey(t,n){const s=new Ve(n,0),o=this.Xr.firstAfterOrEqual(s);return $.resolve(n.isEqual(o&&o.key))}performConsistencyCheck(t){return this.mutationQueue.length,$.resolve()}ri(t,n){return this.ti(t)}ti(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}ei(t){const n=this.ti(t);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
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
 */class s2{constructor(t){this.ii=t,this.docs=function(){return new ie(mt.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,n){const s=n.key,o=this.docs.get(s),u=o?o.size:0,f=this.ii(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:f}),this.size+=f-u,this.indexManager.addToCollectionParentIndex(t,s.path.popLast())}removeEntry(t){const n=this.docs.get(t);n&&(this.docs=this.docs.remove(t),this.size-=n.size)}getEntry(t,n){const s=this.docs.get(n);return $.resolve(s?s.document.mutableCopy():Xe.newInvalidDocument(n))}getEntries(t,n){let s=ir();return n.forEach(o=>{const u=this.docs.get(o);s=s.insert(o,u?u.document.mutableCopy():Xe.newInvalidDocument(o))}),$.resolve(s)}getDocumentsMatchingQuery(t,n,s,o){let u=ir();const f=n.path,m=new mt(f.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(m);for(;g.hasNext();){const{key:_,value:{document:T}}=g.getNext();if(!f.isPrefixOf(_.path))break;_.path.length>f.length+1||PC(VC(T),s)<=0||(o.has(T.key)||Lh(n,T))&&(u=u.insert(T.key,T.mutableCopy()))}return $.resolve(u)}getAllFromCollectionGroup(t,n,s,o){vt(9500)}si(t,n){return $.forEach(this.docs,s=>n(s))}newChangeBuffer(t){return new a2(this)}getSize(t){return $.resolve(this.size)}}class a2 extends WN{constructor(t){super(),this.Br=t}applyChanges(t){const n=[];return this.changes.forEach((s,o)=>{o.isValidDocument()?n.push(this.Br.addEntry(t,o)):this.Br.removeEntry(s)}),$.waitFor(n)}getFromCache(t,n){return this.Br.getEntry(t,n)}getAllFromCache(t,n){return this.Br.getEntries(t,n)}}/**
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
 */class o2{constructor(t){this.persistence=t,this.oi=new Ws(n=>Ep(n),Ap),this.lastRemoteSnapshotVersion=At.min(),this.highestTargetId=0,this._i=0,this.ai=new Cp,this.targetCount=0,this.ui=co.cr()}forEachTarget(t,n){return this.oi.forEach((s,o)=>n(o)),$.resolve()}getLastRemoteSnapshotVersion(t){return $.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return $.resolve(this._i)}allocateTargetId(t){return this.highestTargetId=this.ui.next(),$.resolve(this.highestTargetId)}setTargetsMetadata(t,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this._i&&(this._i=n),$.resolve()}Tr(t){this.oi.set(t.target,t);const n=t.targetId;n>this.highestTargetId&&(this.ui=new co(n),this.highestTargetId=n),t.sequenceNumber>this._i&&(this._i=t.sequenceNumber)}addTargetData(t,n){return this.Tr(n),this.targetCount+=1,$.resolve()}updateTargetData(t,n){return this.Tr(n),$.resolve()}removeTargetData(t,n){return this.oi.delete(n.target),this.ai.Hr(n.targetId),this.targetCount-=1,$.resolve()}removeTargets(t,n,s){let o=0;const u=[];return this.oi.forEach((f,m)=>{m.sequenceNumber<=n&&s.get(m.targetId)===null&&(this.oi.delete(f),u.push(this.removeMatchingKeysForTargetId(t,m.targetId)),o++)}),$.waitFor(u).next(()=>o)}getTargetCount(t){return $.resolve(this.targetCount)}getTargetData(t,n){const s=this.oi.get(n)||null;return $.resolve(s)}addMatchingKeys(t,n,s){return this.ai.Gr(n,s),$.resolve()}removeMatchingKeys(t,n,s){this.ai.jr(n,s);const o=this.persistence.referenceDelegate,u=[];return o&&n.forEach(f=>{u.push(o.markPotentiallyOrphaned(t,f))}),$.waitFor(u)}removeMatchingKeysForTargetId(t,n){return this.ai.Hr(n),$.resolve()}getMatchingKeysForTargetId(t,n){const s=this.ai.Yr(n);return $.resolve(s)}containsKey(t,n){return $.resolve(this.ai.containsKey(n))}}/**
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
 */class AA{constructor(t,n){this.ci={},this.overlays={},this.li=new Vh(0),this.hi=!1,this.hi=!0,this.Pi=new i2,this.referenceDelegate=t(this),this.Ti=new o2(this),this.indexManager=new GN,this.remoteDocumentCache=function(o){return new s2(o)}(s=>this.referenceDelegate.Ii(s)),this.serializer=new HN(n),this.Ei=new e2(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.hi=!1,Promise.resolve()}get started(){return this.hi}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let n=this.overlays[t.toKey()];return n||(n=new n2,this.overlays[t.toKey()]=n),n}getMutationQueue(t,n){let s=this.ci[t.toKey()];return s||(s=new r2(n,this.referenceDelegate),this.ci[t.toKey()]=s),s}getGlobalsCache(){return this.Pi}getTargetCache(){return this.Ti}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ei}runTransaction(t,n,s){rt("MemoryPersistence","Starting transaction:",t);const o=new l2(this.li.next());return this.referenceDelegate.di(),s(o).next(u=>this.referenceDelegate.Ai(o).next(()=>u)).toPromise().then(u=>(o.raiseOnCommittedEvent(),u))}Ri(t,n){return $.or(Object.values(this.ci).map(s=>()=>s.containsKey(t,n)))}}class l2 extends xC{constructor(t){super(),this.currentSequenceNumber=t}}class Np{constructor(t){this.persistence=t,this.Vi=new Cp,this.mi=null}static fi(t){return new Np(t)}get gi(){if(this.mi)return this.mi;throw vt(60996)}addReference(t,n,s){return this.Vi.addReference(s,n),this.gi.delete(s.toString()),$.resolve()}removeReference(t,n,s){return this.Vi.removeReference(s,n),this.gi.add(s.toString()),$.resolve()}markPotentiallyOrphaned(t,n){return this.gi.add(n.toString()),$.resolve()}removeTarget(t,n){this.Vi.Hr(n.targetId).forEach(o=>this.gi.add(o.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(t,n.targetId).next(o=>{o.forEach(u=>this.gi.add(u.toString()))}).next(()=>s.removeTargetData(t,n))}di(){this.mi=new Set}Ai(t){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return $.forEach(this.gi,s=>{const o=mt.fromPath(s);return this.pi(t,o).next(u=>{u||n.removeEntry(o,At.min())})}).next(()=>(this.mi=null,n.apply(t)))}updateLimboDocument(t,n){return this.pi(t,n).next(s=>{s?this.gi.delete(n.toString()):this.gi.add(n.toString())})}Ii(t){return 0}pi(t,n){return $.or([()=>$.resolve(this.Vi.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(t,n),()=>this.persistence.Ri(t,n)])}}class Eh{constructor(t,n){this.persistence=t,this.yi=new Ws(s=>zC(s.path),(s,o)=>s.isEqual(o)),this.garbageCollector=ZN(this,n)}static fi(t,n){return new Eh(t,n)}di(){}Ai(t){return $.resolve()}forEachTarget(t,n){return this.persistence.getTargetCache().forEachTarget(t,n)}pr(t){const n=this.br(t);return this.persistence.getTargetCache().getTargetCount(t).next(s=>n.next(o=>s+o))}br(t){let n=0;return this.yr(t,s=>{n++}).next(()=>n)}yr(t,n){return $.forEach(this.yi,(s,o)=>this.Dr(t,s,o).next(u=>u?$.resolve():n(o)))}removeTargets(t,n,s){return this.persistence.getTargetCache().removeTargets(t,n,s)}removeOrphanedDocuments(t,n){let s=0;const o=this.persistence.getRemoteDocumentCache(),u=o.newChangeBuffer();return o.si(t,f=>this.Dr(t,f,n).next(m=>{m||(s++,u.removeEntry(f,At.min()))})).next(()=>u.apply(t)).next(()=>s)}markPotentiallyOrphaned(t,n){return this.yi.set(n,t.currentSequenceNumber),$.resolve()}removeTarget(t,n){const s=n.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,s)}addReference(t,n,s){return this.yi.set(s,t.currentSequenceNumber),$.resolve()}removeReference(t,n,s){return this.yi.set(s,t.currentSequenceNumber),$.resolve()}updateLimboDocument(t,n){return this.yi.set(n,t.currentSequenceNumber),$.resolve()}Ii(t){let n=t.key.toString().length;return t.isFoundDocument()&&(n+=Jc(t.data.value)),n}Dr(t,n,s){return $.or([()=>this.persistence.Ri(t,n),()=>this.persistence.getTargetCache().containsKey(t,n),()=>{const o=this.yi.get(n);return $.resolve(o!==void 0&&o>s)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
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
 */class Op{constructor(t,n,s,o){this.targetId=t,this.fromCache=n,this.ds=s,this.As=o}static Rs(t,n){let s=Vt(),o=Vt();for(const u of n.docChanges)switch(u.type){case 0:s=s.add(u.doc.key);break;case 1:o=o.add(u.doc.key)}return new Op(t,n.fromCache,s,o)}}/**
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
 */class u2{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
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
 */class c2{constructor(){this.Vs=!1,this.fs=!1,this.gs=100,this.ps=function(){return iR()?8:UC(Ze())>0?6:4}()}initialize(t,n){this.ys=t,this.indexManager=n,this.Vs=!0}getDocumentsMatchingQuery(t,n,s,o){const u={result:null};return this.ws(t,n).next(f=>{u.result=f}).next(()=>{if(!u.result)return this.bs(t,n,o,s).next(f=>{u.result=f})}).next(()=>{if(u.result)return;const f=new u2;return this.Ss(t,n,f).next(m=>{if(u.result=m,this.fs)return this.Ds(t,n,f,m.size)})}).next(()=>u.result)}Ds(t,n,s,o){return s.documentReadCount<this.gs?(Ya()<=Mt.DEBUG&&rt("QueryEngine","SDK will not create cache indexes for query:",Qa(n),"since it only creates cache indexes for collection contains","more than or equal to",this.gs,"documents"),$.resolve()):(Ya()<=Mt.DEBUG&&rt("QueryEngine","Query:",Qa(n),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.ps*o?(Ya()<=Mt.DEBUG&&rt("QueryEngine","The SDK decides to create cache indexes for query:",Qa(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,yi(n))):$.resolve())}ws(t,n){if(ST(n))return $.resolve(null);let s=yi(n);return this.indexManager.getIndexType(t,s).next(o=>o===0?null:(n.limit!==null&&o===1&&(n=zm(n,null,"F"),s=yi(n)),this.indexManager.getDocumentsMatchingTarget(t,s).next(u=>{const f=Vt(...u);return this.ys.getDocuments(t,f).next(m=>this.indexManager.getMinOffset(t,s).next(g=>{const _=this.vs(n,m);return this.Cs(n,_,f,g.readTime)?this.ws(t,zm(n,null,"F")):this.Fs(t,_,n,g)}))})))}bs(t,n,s,o){return ST(n)||o.isEqual(At.min())?$.resolve(null):this.ys.getDocuments(t,s).next(u=>{const f=this.vs(n,u);return this.Cs(n,f,s,o)?$.resolve(null):(Ya()<=Mt.DEBUG&&rt("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),Qa(n)),this.Fs(t,f,n,MC(o,Ql)).next(m=>m))})}vs(t,n){let s=new Re(J0(t));return n.forEach((o,u)=>{Lh(t,u)&&(s=s.add(u))}),s}Cs(t,n,s,o){if(t.limit===null)return!1;if(s.size!==n.size)return!0;const u=t.limitType==="F"?n.last():n.first();return!!u&&(u.hasPendingWrites||u.version.compareTo(o)>0)}Ss(t,n,s){return Ya()<=Mt.DEBUG&&rt("QueryEngine","Using full collection scan to execute query:",Qa(n)),this.ys.getDocumentsMatchingQuery(t,n,Kr.min(),s)}Fs(t,n,s,o){return this.ys.getDocumentsMatchingQuery(t,s,o).next(u=>(n.forEach(f=>{u=u.insert(f.key,f)}),u))}}/**
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
 */const Dp="LocalStore",h2=3e8;class f2{constructor(t,n,s,o){this.persistence=t,this.Ms=n,this.serializer=o,this.xs=new ie(wt),this.Os=new Ws(u=>Ep(u),Ap),this.Ns=new Map,this.Bs=t.getRemoteDocumentCache(),this.Ti=t.getTargetCache(),this.Ei=t.getBundleCache(),this.Ls(s)}Ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new t2(this.Bs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Bs.setIndexManager(this.indexManager),this.Ms.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>t.collect(n,this.xs))}}function d2(r,t,n,s){return new f2(r,t,n,s)}async function SA(r,t){const n=St(r);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let o;return n.mutationQueue.getAllMutationBatches(s).next(u=>(o=u,n.Ls(t),n.mutationQueue.getAllMutationBatches(s))).next(u=>{const f=[],m=[];let g=Vt();for(const _ of o){f.push(_.batchId);for(const T of _.mutations)g=g.add(T.key)}for(const _ of u){m.push(_.batchId);for(const T of _.mutations)g=g.add(T.key)}return n.localDocuments.getDocuments(s,g).next(_=>({ks:_,removedBatchIds:f,addedBatchIds:m}))})})}function m2(r,t){const n=St(r);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const o=t.batch.keys(),u=n.Bs.newChangeBuffer({trackRemovals:!0});return function(m,g,_,T){const S=_.batch,R=S.keys();let z=$.resolve();return R.forEach(X=>{z=z.next(()=>T.getEntry(g,X)).next(tt=>{const Y=_.docVersions.get(X);qt(Y!==null,48541),tt.version.compareTo(Y)<0&&(S.applyToRemoteDocument(tt,_),tt.isValidDocument()&&(tt.setReadTime(_.commitVersion),T.addEntry(tt)))})}),z.next(()=>m.mutationQueue.removeMutationBatch(g,S))}(n,s,t,u).next(()=>u.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,o,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(m){let g=Vt();for(let _=0;_<m.mutationResults.length;++_)m.mutationResults[_].transformResults.length>0&&(g=g.add(m.batch.mutations[_].key));return g}(t))).next(()=>n.localDocuments.getDocuments(s,o))})}function bA(r){const t=St(r);return t.persistence.runTransaction("Get last remote snapshot version","readonly",n=>t.Ti.getLastRemoteSnapshotVersion(n))}function p2(r,t){const n=St(r),s=t.snapshotVersion;let o=n.xs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",u=>{const f=n.Bs.newChangeBuffer({trackRemovals:!0});o=n.xs;const m=[];t.targetChanges.forEach((T,S)=>{const R=o.get(S);if(!R)return;m.push(n.Ti.removeMatchingKeys(u,T.removedDocuments,S).next(()=>n.Ti.addMatchingKeys(u,T.addedDocuments,S)));let z=R.withSequenceNumber(u.currentSequenceNumber);t.targetMismatches.get(S)!==null?z=z.withResumeToken(qe.EMPTY_BYTE_STRING,At.min()).withLastLimboFreeSnapshotVersion(At.min()):T.resumeToken.approximateByteSize()>0&&(z=z.withResumeToken(T.resumeToken,s)),o=o.insert(S,z),function(tt,Y,gt){return tt.resumeToken.approximateByteSize()===0||Y.snapshotVersion.toMicroseconds()-tt.snapshotVersion.toMicroseconds()>=h2?!0:gt.addedDocuments.size+gt.modifiedDocuments.size+gt.removedDocuments.size>0}(R,z,T)&&m.push(n.Ti.updateTargetData(u,z))});let g=ir(),_=Vt();if(t.documentUpdates.forEach(T=>{t.resolvedLimboDocuments.has(T)&&m.push(n.persistence.referenceDelegate.updateLimboDocument(u,T))}),m.push(g2(u,f,t.documentUpdates).next(T=>{g=T.qs,_=T.Qs})),!s.isEqual(At.min())){const T=n.Ti.getLastRemoteSnapshotVersion(u).next(S=>n.Ti.setTargetsMetadata(u,u.currentSequenceNumber,s));m.push(T)}return $.waitFor(m).next(()=>f.apply(u)).next(()=>n.localDocuments.getLocalViewOfDocuments(u,g,_)).next(()=>g)}).then(u=>(n.xs=o,u))}function g2(r,t,n){let s=Vt(),o=Vt();return n.forEach(u=>s=s.add(u)),t.getEntries(r,s).next(u=>{let f=ir();return n.forEach((m,g)=>{const _=u.get(m);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(m)),g.isNoDocument()&&g.version.isEqual(At.min())?(t.removeEntry(m,g.readTime),f=f.insert(m,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(t.addEntry(g),f=f.insert(m,g)):rt(Dp,"Ignoring outdated watch update for ",m,". Current version:",_.version," Watch version:",g.version)}),{qs:f,Qs:o}})}function _2(r,t){const n=St(r);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(t===void 0&&(t=yp),n.mutationQueue.getNextMutationBatchAfterBatchId(s,t)))}function y2(r,t){const n=St(r);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let o;return n.Ti.getTargetData(s,t).next(u=>u?(o=u,$.resolve(o)):n.Ti.allocateTargetId(s).next(f=>(o=new Br(t,f,"TargetPurposeListen",s.currentSequenceNumber),n.Ti.addTargetData(s,o).next(()=>o))))}).then(s=>{const o=n.xs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(n.xs=n.xs.insert(s.targetId,s),n.Os.set(t,s.targetId)),s})}async function Fm(r,t,n){const s=St(r),o=s.xs.get(t),u=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",u,f=>s.persistence.referenceDelegate.removeTarget(f,o))}catch(f){if(!_o(f))throw f;rt(Dp,`Failed to update sequence numbers for target ${t}: ${f}`)}s.xs=s.xs.remove(t),s.Os.delete(o.target)}function xT(r,t,n){const s=St(r);let o=At.min(),u=Vt();return s.persistence.runTransaction("Execute query","readwrite",f=>function(g,_,T){const S=St(g),R=S.Os.get(T);return R!==void 0?$.resolve(S.xs.get(R)):S.Ti.getTargetData(_,T)}(s,f,yi(t)).next(m=>{if(m)return o=m.lastLimboFreeSnapshotVersion,s.Ti.getMatchingKeysForTargetId(f,m.targetId).next(g=>{u=g})}).next(()=>s.Ms.getDocumentsMatchingQuery(f,t,n?o:At.min(),n?u:Vt())).next(m=>(v2(s,sN(t),m),{documents:m,$s:u})))}function v2(r,t,n){let s=r.Ns.get(t)||At.min();n.forEach((o,u)=>{u.readTime.compareTo(s)>0&&(s=u.readTime)}),r.Ns.set(t,s)}class UT{constructor(){this.activeTargetIds=hN()}js(t){this.activeTargetIds=this.activeTargetIds.add(t)}Hs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}zs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class T2{constructor(){this.xo=new UT,this.Oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,n,s){}addLocalQueryTarget(t,n=!0){return n&&this.xo.js(t),this.Oo[t]||"not-current"}updateQueryState(t,n,s){this.Oo[t]=n}removeLocalQueryTarget(t){this.xo.Hs(t)}isLocalQueryTarget(t){return this.xo.activeTargetIds.has(t)}clearQueryState(t){delete this.Oo[t]}getAllActiveQueryTargets(){return this.xo.activeTargetIds}isActiveQueryTarget(t){return this.xo.activeTargetIds.has(t)}start(){return this.xo=new UT,Promise.resolve()}handleUserChange(t,n,s){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
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
 */class E2{No(t){}shutdown(){}}/**
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
 */const LT="ConnectivityMonitor";class zT{constructor(){this.Bo=()=>this.Lo(),this.ko=()=>this.qo(),this.Qo=[],this.$o()}No(t){this.Qo.push(t)}shutdown(){window.removeEventListener("online",this.Bo),window.removeEventListener("offline",this.ko)}$o(){window.addEventListener("online",this.Bo),window.addEventListener("offline",this.ko)}Lo(){rt(LT,"Network connectivity changed: AVAILABLE");for(const t of this.Qo)t(0)}qo(){rt(LT,"Network connectivity changed: UNAVAILABLE");for(const t of this.Qo)t(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Fc=null;function Gm(){return Fc===null?Fc=function(){return 268435456+Math.round(2147483648*Math.random())}():Fc++,"0x"+Fc.toString(16)}/**
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
 */const cm="RestConnection",A2={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class S2{get Uo(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Ko=n+"://"+t.host,this.Wo=`projects/${s}/databases/${o}`,this.Go=this.databaseId.database===mh?`project_id=${s}`:`project_id=${s}&database_id=${o}`}zo(t,n,s,o,u){const f=Gm(),m=this.jo(t,n.toUriEncodedString());rt(cm,`Sending RPC '${t}' ${f}:`,m,s);const g={"google-cloud-resource-prefix":this.Wo,"x-goog-request-params":this.Go};this.Ho(g,o,u);const{host:_}=new URL(m),T=Xs(_);return this.Jo(t,m,g,s,T).then(S=>(rt(cm,`Received RPC '${t}' ${f}: `,S),S),S=>{throw ao(cm,`RPC '${t}' ${f} failed with error: `,S,"url: ",m,"request:",s),S})}Yo(t,n,s,o,u,f){return this.zo(t,n,s,o,u)}Ho(t,n,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+po}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((o,u)=>t[u]=o),s&&s.headers.forEach((o,u)=>t[u]=o)}jo(t,n){const s=A2[t];return`${this.Ko}/v1/${n}:${s}`}terminate(){}}/**
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
 */class b2{constructor(t){this.Zo=t.Zo,this.Xo=t.Xo}e_(t){this.t_=t}n_(t){this.r_=t}i_(t){this.s_=t}onMessage(t){this.o_=t}close(){this.Xo()}send(t){this.Zo(t)}__(){this.t_()}a_(){this.r_()}u_(t){this.s_(t)}c_(t){this.o_(t)}}/**
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
 */const Ke="WebChannelConnection";class R2 extends S2{constructor(t){super(t),this.l_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,n,s,o,u){const f=Gm();return new Promise((m,g)=>{const _=new w0;_.setWithCredentials(!0),_.listenOnce(C0.COMPLETE,()=>{try{switch(_.getLastErrorCode()){case Wc.NO_ERROR:const S=_.getResponseJson();rt(Ke,`XHR for RPC '${t}' ${f} received:`,JSON.stringify(S)),m(S);break;case Wc.TIMEOUT:rt(Ke,`RPC '${t}' ${f} timed out`),g(new dt(W.DEADLINE_EXCEEDED,"Request time out"));break;case Wc.HTTP_ERROR:const R=_.getStatus();if(rt(Ke,`RPC '${t}' ${f} failed with status:`,R,"response text:",_.getResponseText()),R>0){let z=_.getResponseJson();Array.isArray(z)&&(z=z[0]);const X=z?.error;if(X&&X.status&&X.message){const tt=function(gt){const ut=gt.toLowerCase().replace(/_/g,"-");return Object.values(W).indexOf(ut)>=0?ut:W.UNKNOWN}(X.status);g(new dt(tt,X.message))}else g(new dt(W.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new dt(W.UNAVAILABLE,"Connection failed."));break;default:vt(9055,{h_:t,streamId:f,P_:_.getLastErrorCode(),T_:_.getLastError()})}}finally{rt(Ke,`RPC '${t}' ${f} completed.`)}});const T=JSON.stringify(o);rt(Ke,`RPC '${t}' ${f} sending request:`,o),_.send(n,"POST",T,s,15)})}I_(t,n,s){const o=Gm(),u=[this.Ko,"/","google.firestore.v1.Firestore","/",t,"/channel"],f=D0(),m=O0(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},_=this.longPollingOptions.timeoutSeconds;_!==void 0&&(g.longPollingTimeout=Math.round(1e3*_)),this.useFetchStreams&&(g.useFetchStreams=!0),this.Ho(g.initMessageHeaders,n,s),g.encodeInitMessageHeaders=!0;const T=u.join("");rt(Ke,`Creating RPC '${t}' stream ${o}: ${T}`,g);const S=f.createWebChannel(T,g);this.E_(S);let R=!1,z=!1;const X=new b2({Zo:Y=>{z?rt(Ke,`Not sending because RPC '${t}' stream ${o} is closed:`,Y):(R||(rt(Ke,`Opening RPC '${t}' stream ${o} transport.`),S.open(),R=!0),rt(Ke,`RPC '${t}' stream ${o} sending:`,Y),S.send(Y))},Xo:()=>S.close()}),tt=(Y,gt,ut)=>{Y.listen(gt,at=>{try{ut(at)}catch(_t){setTimeout(()=>{throw _t},0)}})};return tt(S,Dl.EventType.OPEN,()=>{z||(rt(Ke,`RPC '${t}' stream ${o} transport opened.`),X.__())}),tt(S,Dl.EventType.CLOSE,()=>{z||(z=!0,rt(Ke,`RPC '${t}' stream ${o} transport closed`),X.u_(),this.d_(S))}),tt(S,Dl.EventType.ERROR,Y=>{z||(z=!0,ao(Ke,`RPC '${t}' stream ${o} transport errored. Name:`,Y.name,"Message:",Y.message),X.u_(new dt(W.UNAVAILABLE,"The operation could not be completed")))}),tt(S,Dl.EventType.MESSAGE,Y=>{var gt;if(!z){const ut=Y.data[0];qt(!!ut,16349);const at=ut,_t=at?.error||((gt=at[0])===null||gt===void 0?void 0:gt.error);if(_t){rt(Ke,`RPC '${t}' stream ${o} received error:`,_t);const ht=_t.status;let Rt=function(w){const D=_e[w];if(D!==void 0)return hA(D)}(ht),M=_t.message;Rt===void 0&&(Rt=W.INTERNAL,M="Unknown error status: "+ht+" with message "+_t.message),z=!0,X.u_(new dt(Rt,M)),S.close()}else rt(Ke,`RPC '${t}' stream ${o} received:`,ut),X.c_(ut)}}),tt(m,N0.STAT_EVENT,Y=>{Y.stat===Vm.PROXY?rt(Ke,`RPC '${t}' stream ${o} detected buffering proxy`):Y.stat===Vm.NOPROXY&&rt(Ke,`RPC '${t}' stream ${o} detected no buffering proxy`)}),setTimeout(()=>{X.a_()},0),X}terminate(){this.l_.forEach(t=>t.close()),this.l_=[]}E_(t){this.l_.push(t)}d_(t){this.l_=this.l_.filter(n=>n===t)}}function hm(){return typeof document<"u"?document:null}/**
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
 */function qh(r){return new NN(r,!0)}/**
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
 */class RA{constructor(t,n,s=1e3,o=1.5,u=6e4){this.xi=t,this.timerId=n,this.A_=s,this.R_=o,this.V_=u,this.m_=0,this.f_=null,this.g_=Date.now(),this.reset()}reset(){this.m_=0}p_(){this.m_=this.V_}y_(t){this.cancel();const n=Math.floor(this.m_+this.w_()),s=Math.max(0,Date.now()-this.g_),o=Math.max(0,n-s);o>0&&rt("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.m_} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.f_=this.xi.enqueueAfterDelay(this.timerId,o,()=>(this.g_=Date.now(),t())),this.m_*=this.R_,this.m_<this.A_&&(this.m_=this.A_),this.m_>this.V_&&(this.m_=this.V_)}b_(){this.f_!==null&&(this.f_.skipDelay(),this.f_=null)}cancel(){this.f_!==null&&(this.f_.cancel(),this.f_=null)}w_(){return(Math.random()-.5)*this.m_}}/**
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
 */const BT="PersistentStream";class IA{constructor(t,n,s,o,u,f,m,g){this.xi=t,this.S_=s,this.D_=o,this.connection=u,this.authCredentialsProvider=f,this.appCheckCredentialsProvider=m,this.listener=g,this.state=0,this.v_=0,this.C_=null,this.F_=null,this.stream=null,this.M_=0,this.x_=new RA(t,n)}O_(){return this.state===1||this.state===5||this.N_()}N_(){return this.state===2||this.state===3}start(){this.M_=0,this.state!==4?this.auth():this.B_()}async stop(){this.O_()&&await this.close(0)}L_(){this.state=0,this.x_.reset()}k_(){this.N_()&&this.C_===null&&(this.C_=this.xi.enqueueAfterDelay(this.S_,6e4,()=>this.q_()))}Q_(t){this.U_(),this.stream.send(t)}async q_(){if(this.N_())return this.close(0)}U_(){this.C_&&(this.C_.cancel(),this.C_=null)}K_(){this.F_&&(this.F_.cancel(),this.F_=null)}async close(t,n){this.U_(),this.K_(),this.x_.cancel(),this.v_++,t!==4?this.x_.reset():n&&n.code===W.RESOURCE_EXHAUSTED?(nr(n.toString()),nr("Using maximum backoff delay to prevent overloading the backend."),this.x_.p_()):n&&n.code===W.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.i_(n)}W_(){}auth(){this.state=1;const t=this.G_(this.v_),n=this.v_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,o])=>{this.v_===n&&this.z_(s,o)},s=>{t(()=>{const o=new dt(W.UNKNOWN,"Fetching auth token failed: "+s.message);return this.j_(o)})})}z_(t,n){const s=this.G_(this.v_);this.stream=this.H_(t,n),this.stream.e_(()=>{s(()=>this.listener.e_())}),this.stream.n_(()=>{s(()=>(this.state=2,this.F_=this.xi.enqueueAfterDelay(this.D_,1e4,()=>(this.N_()&&(this.state=3),Promise.resolve())),this.listener.n_()))}),this.stream.i_(o=>{s(()=>this.j_(o))}),this.stream.onMessage(o=>{s(()=>++this.M_==1?this.J_(o):this.onNext(o))})}B_(){this.state=5,this.x_.y_(async()=>{this.state=0,this.start()})}j_(t){return rt(BT,`close with error: ${t}`),this.stream=null,this.close(4,t)}G_(t){return n=>{this.xi.enqueueAndForget(()=>this.v_===t?n():(rt(BT,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class I2 extends IA{constructor(t,n,s,o,u,f){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,o,f),this.serializer=u}H_(t,n){return this.connection.I_("Listen",t,n)}J_(t){return this.onNext(t)}onNext(t){this.x_.reset();const n=MN(this.serializer,t),s=function(u){if(!("targetChange"in u))return At.min();const f=u.targetChange;return f.targetIds&&f.targetIds.length?At.min():f.readTime?vi(f.readTime):At.min()}(t);return this.listener.Y_(n,s)}Z_(t){const n={};n.database=Hm(this.serializer),n.addTarget=function(u,f){let m;const g=f.target;if(m=Lm(g)?{documents:kN(u,g)}:{query:xN(u,g).gt},m.targetId=f.targetId,f.resumeToken.approximateByteSize()>0){m.resumeToken=mA(u,f.resumeToken);const _=Bm(u,f.expectedCount);_!==null&&(m.expectedCount=_)}else if(f.snapshotVersion.compareTo(At.min())>0){m.readTime=Th(u,f.snapshotVersion.toTimestamp());const _=Bm(u,f.expectedCount);_!==null&&(m.expectedCount=_)}return m}(this.serializer,t);const s=LN(this.serializer,t);s&&(n.labels=s),this.Q_(n)}X_(t){const n={};n.database=Hm(this.serializer),n.removeTarget=t,this.Q_(n)}}class w2 extends IA{constructor(t,n,s,o,u,f){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,o,f),this.serializer=u}get ea(){return this.M_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.ea&&this.ta([])}H_(t,n){return this.connection.I_("Write",t,n)}J_(t){return qt(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,qt(!t.writeResults||t.writeResults.length===0,55816),this.listener.na()}onNext(t){qt(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.x_.reset();const n=PN(t.writeResults,t.commitTime),s=vi(t.commitTime);return this.listener.ra(s,n)}ia(){const t={};t.database=Hm(this.serializer),this.Q_(t)}ta(t){const n={streamToken:this.lastStreamToken,writes:t.map(s=>VN(this.serializer,s))};this.Q_(n)}}/**
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
 */class C2{}class N2 extends C2{constructor(t,n,s,o){super(),this.authCredentials=t,this.appCheckCredentials=n,this.connection=s,this.serializer=o,this.sa=!1}oa(){if(this.sa)throw new dt(W.FAILED_PRECONDITION,"The client has already been terminated.")}zo(t,n,s,o){return this.oa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([u,f])=>this.connection.zo(t,jm(n,s),o,u,f)).catch(u=>{throw u.name==="FirebaseError"?(u.code===W.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),u):new dt(W.UNKNOWN,u.toString())})}Yo(t,n,s,o,u){return this.oa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([f,m])=>this.connection.Yo(t,jm(n,s),o,f,m,u)).catch(f=>{throw f.name==="FirebaseError"?(f.code===W.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),f):new dt(W.UNKNOWN,f.toString())})}terminate(){this.sa=!0,this.connection.terminate()}}class O2{constructor(t,n){this.asyncQueue=t,this.onlineStateHandler=n,this.state="Unknown",this._a=0,this.aa=null,this.ua=!0}ca(){this._a===0&&(this.la("Unknown"),this.aa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.aa=null,this.ha("Backend didn't respond within 10 seconds."),this.la("Offline"),Promise.resolve())))}Pa(t){this.state==="Online"?this.la("Unknown"):(this._a++,this._a>=1&&(this.Ta(),this.ha(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.la("Offline")))}set(t){this.Ta(),this._a=0,t==="Online"&&(this.ua=!1),this.la(t)}la(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}ha(t){const n=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.ua?(nr(n),this.ua=!1):rt("OnlineStateTracker",n)}Ta(){this.aa!==null&&(this.aa.cancel(),this.aa=null)}}/**
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
 */const Ks="RemoteStore";class D2{constructor(t,n,s,o,u){this.localStore=t,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.Ia=[],this.Ea=new Map,this.da=new Set,this.Aa=[],this.Ra=u,this.Ra.No(f=>{s.enqueueAndForget(async()=>{ta(this)&&(rt(Ks,"Restarting streams for network reachability change."),await async function(g){const _=St(g);_.da.add(4),await hu(_),_.Va.set("Unknown"),_.da.delete(4),await Hh(_)}(this))})}),this.Va=new O2(s,o)}}async function Hh(r){if(ta(r))for(const t of r.Aa)await t(!0)}async function hu(r){for(const t of r.Aa)await t(!1)}function wA(r,t){const n=St(r);n.Ea.has(t.targetId)||(n.Ea.set(t.targetId,t),kp(n)?Pp(n):yo(n).N_()&&Vp(n,t))}function Mp(r,t){const n=St(r),s=yo(n);n.Ea.delete(t),s.N_()&&CA(n,t),n.Ea.size===0&&(s.N_()?s.k_():ta(n)&&n.Va.set("Unknown"))}function Vp(r,t){if(r.ma.Ke(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(At.min())>0){const n=r.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}yo(r).Z_(t)}function CA(r,t){r.ma.Ke(t),yo(r).X_(t)}function Pp(r){r.ma=new RN({getRemoteKeysForTarget:t=>r.remoteSyncer.getRemoteKeysForTarget(t),Rt:t=>r.Ea.get(t)||null,Pt:()=>r.datastore.serializer.databaseId}),yo(r).start(),r.Va.ca()}function kp(r){return ta(r)&&!yo(r).O_()&&r.Ea.size>0}function ta(r){return St(r).da.size===0}function NA(r){r.ma=void 0}async function M2(r){r.Va.set("Online")}async function V2(r){r.Ea.forEach((t,n)=>{Vp(r,t)})}async function P2(r,t){NA(r),kp(r)?(r.Va.Pa(t),Pp(r)):r.Va.set("Unknown")}async function k2(r,t,n){if(r.Va.set("Online"),t instanceof dA&&t.state===2&&t.cause)try{await async function(o,u){const f=u.cause;for(const m of u.targetIds)o.Ea.has(m)&&(await o.remoteSyncer.rejectListen(m,f),o.Ea.delete(m),o.ma.removeTarget(m))}(r,t)}catch(s){rt(Ks,"Failed to remove targets %s: %s ",t.targetIds.join(","),s),await Ah(r,s)}else if(t instanceof nh?r.ma.Xe(t):t instanceof fA?r.ma.ot(t):r.ma.nt(t),!n.isEqual(At.min()))try{const s=await bA(r.localStore);n.compareTo(s)>=0&&await function(u,f){const m=u.ma.It(f);return m.targetChanges.forEach((g,_)=>{if(g.resumeToken.approximateByteSize()>0){const T=u.Ea.get(_);T&&u.Ea.set(_,T.withResumeToken(g.resumeToken,f))}}),m.targetMismatches.forEach((g,_)=>{const T=u.Ea.get(g);if(!T)return;u.Ea.set(g,T.withResumeToken(qe.EMPTY_BYTE_STRING,T.snapshotVersion)),CA(u,g);const S=new Br(T.target,g,_,T.sequenceNumber);Vp(u,S)}),u.remoteSyncer.applyRemoteEvent(m)}(r,n)}catch(s){rt(Ks,"Failed to raise snapshot:",s),await Ah(r,s)}}async function Ah(r,t,n){if(!_o(t))throw t;r.da.add(1),await hu(r),r.Va.set("Offline"),n||(n=()=>bA(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{rt(Ks,"Retrying IndexedDB access"),await n(),r.da.delete(1),await Hh(r)})}function OA(r,t){return t().catch(n=>Ah(r,n,t))}async function Fh(r){const t=St(r),n=$r(t);let s=t.Ia.length>0?t.Ia[t.Ia.length-1].batchId:yp;for(;x2(t);)try{const o=await _2(t.localStore,s);if(o===null){t.Ia.length===0&&n.k_();break}s=o.batchId,U2(t,o)}catch(o){await Ah(t,o)}DA(t)&&MA(t)}function x2(r){return ta(r)&&r.Ia.length<10}function U2(r,t){r.Ia.push(t);const n=$r(r);n.N_()&&n.ea&&n.ta(t.mutations)}function DA(r){return ta(r)&&!$r(r).O_()&&r.Ia.length>0}function MA(r){$r(r).start()}async function L2(r){$r(r).ia()}async function z2(r){const t=$r(r);for(const n of r.Ia)t.ta(n.mutations)}async function B2(r,t,n){const s=r.Ia.shift(),o=Rp.from(s,t,n);await OA(r,()=>r.remoteSyncer.applySuccessfulWrite(o)),await Fh(r)}async function j2(r,t){t&&$r(r).ea&&await async function(s,o){if(function(f){return SN(f)&&f!==W.ABORTED}(o.code)){const u=s.Ia.shift();$r(s).L_(),await OA(s,()=>s.remoteSyncer.rejectFailedWrite(u.batchId,o)),await Fh(s)}}(r,t),DA(r)&&MA(r)}async function jT(r,t){const n=St(r);n.asyncQueue.verifyOperationInProgress(),rt(Ks,"RemoteStore received new credentials");const s=ta(n);n.da.add(3),await hu(n),s&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.da.delete(3),await Hh(n)}async function q2(r,t){const n=St(r);t?(n.da.delete(2),await Hh(n)):t||(n.da.add(2),await hu(n),n.Va.set("Unknown"))}function yo(r){return r.fa||(r.fa=function(n,s,o){const u=St(n);return u.oa(),new I2(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)}(r.datastore,r.asyncQueue,{e_:M2.bind(null,r),n_:V2.bind(null,r),i_:P2.bind(null,r),Y_:k2.bind(null,r)}),r.Aa.push(async t=>{t?(r.fa.L_(),kp(r)?Pp(r):r.Va.set("Unknown")):(await r.fa.stop(),NA(r))})),r.fa}function $r(r){return r.ga||(r.ga=function(n,s,o){const u=St(n);return u.oa(),new w2(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)}(r.datastore,r.asyncQueue,{e_:()=>Promise.resolve(),n_:L2.bind(null,r),i_:j2.bind(null,r),na:z2.bind(null,r),ra:B2.bind(null,r)}),r.Aa.push(async t=>{t?(r.ga.L_(),await Fh(r)):(await r.ga.stop(),r.Ia.length>0&&(rt(Ks,`Stopping write stream with ${r.Ia.length} pending writes`),r.Ia=[]))})),r.ga}/**
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
 */class xp{constructor(t,n,s,o,u){this.asyncQueue=t,this.timerId=n,this.targetTimeMs=s,this.op=o,this.removalCallback=u,this.deferred=new Fr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(f=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,n,s,o,u){const f=Date.now()+s,m=new xp(t,n,f,o,u);return m.start(s),m}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new dt(W.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Up(r,t){if(nr("AsyncQueue",`${t}: ${r}`),_o(r))return new dt(W.UNAVAILABLE,`${t}: ${r}`);throw r}/**
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
 */class no{static emptySet(t){return new no(t.comparator)}constructor(t){this.comparator=t?(n,s)=>t(n,s)||mt.comparator(n.key,s.key):(n,s)=>mt.comparator(n.key,s.key),this.keyedMap=Ml(),this.sortedSet=new ie(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const n=this.keyedMap.get(t);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((n,s)=>(t(n),!1))}add(t){const n=this.delete(t.key);return n.copy(n.keyedMap.insert(t.key,t),n.sortedSet.insert(t,null))}delete(t){const n=this.get(t);return n?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(n)):this}isEqual(t){if(!(t instanceof no)||this.size!==t.size)return!1;const n=this.sortedSet.getIterator(),s=t.sortedSet.getIterator();for(;n.hasNext();){const o=n.getNext().key,u=s.getNext().key;if(!o.isEqual(u))return!1}return!0}toString(){const t=[];return this.forEach(n=>{t.push(n.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,n){const s=new no;return s.comparator=this.comparator,s.keyedMap=t,s.sortedSet=n,s}}/**
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
 */class qT{constructor(){this.pa=new ie(mt.comparator)}track(t){const n=t.doc.key,s=this.pa.get(n);s?t.type!==0&&s.type===3?this.pa=this.pa.insert(n,t):t.type===3&&s.type!==1?this.pa=this.pa.insert(n,{type:s.type,doc:t.doc}):t.type===2&&s.type===2?this.pa=this.pa.insert(n,{type:2,doc:t.doc}):t.type===2&&s.type===0?this.pa=this.pa.insert(n,{type:0,doc:t.doc}):t.type===1&&s.type===0?this.pa=this.pa.remove(n):t.type===1&&s.type===2?this.pa=this.pa.insert(n,{type:1,doc:s.doc}):t.type===0&&s.type===1?this.pa=this.pa.insert(n,{type:2,doc:t.doc}):vt(63341,{Vt:t,ya:s}):this.pa=this.pa.insert(n,t)}wa(){const t=[];return this.pa.inorderTraversal((n,s)=>{t.push(s)}),t}}class ho{constructor(t,n,s,o,u,f,m,g,_){this.query=t,this.docs=n,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=u,this.fromCache=f,this.syncStateChanged=m,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(t,n,s,o,u){const f=[];return n.forEach(m=>{f.push({type:0,doc:m})}),new ho(t,n,no.emptySet(n),f,s,o,!0,!1,u)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Uh(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const n=this.docChanges,s=t.docChanges;if(n.length!==s.length)return!1;for(let o=0;o<n.length;o++)if(n[o].type!==s[o].type||!n[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
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
 */class H2{constructor(){this.ba=void 0,this.Sa=[]}Da(){return this.Sa.some(t=>t.va())}}class F2{constructor(){this.queries=HT(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,s){const o=St(n),u=o.queries;o.queries=HT(),u.forEach((f,m)=>{for(const g of m.Sa)g.onError(s)})})(this,new dt(W.ABORTED,"Firestore shutting down"))}}function HT(){return new Ws(r=>W0(r),Uh)}async function G2(r,t){const n=St(r);let s=3;const o=t.query;let u=n.queries.get(o);u?!u.Da()&&t.va()&&(s=2):(u=new H2,s=t.va()?0:1);try{switch(s){case 0:u.ba=await n.onListen(o,!0);break;case 1:u.ba=await n.onListen(o,!1);break;case 2:await n.onFirstRemoteStoreListen(o)}}catch(f){const m=Up(f,`Initialization of query '${Qa(t.query)}' failed`);return void t.onError(m)}n.queries.set(o,u),u.Sa.push(t),t.Fa(n.onlineState),u.ba&&t.Ma(u.ba)&&Lp(n)}async function K2(r,t){const n=St(r),s=t.query;let o=3;const u=n.queries.get(s);if(u){const f=u.Sa.indexOf(t);f>=0&&(u.Sa.splice(f,1),u.Sa.length===0?o=t.va()?0:1:!u.Da()&&t.va()&&(o=2))}switch(o){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function Y2(r,t){const n=St(r);let s=!1;for(const o of t){const u=o.query,f=n.queries.get(u);if(f){for(const m of f.Sa)m.Ma(o)&&(s=!0);f.ba=o}}s&&Lp(n)}function Q2(r,t,n){const s=St(r),o=s.queries.get(t);if(o)for(const u of o.Sa)u.onError(n);s.queries.delete(t)}function Lp(r){r.Ca.forEach(t=>{t.next()})}var Km,FT;(FT=Km||(Km={})).xa="default",FT.Cache="cache";class X2{constructor(t,n,s){this.query=t,this.Oa=n,this.Na=!1,this.Ba=null,this.onlineState="Unknown",this.options=s||{}}Ma(t){if(!this.options.includeMetadataChanges){const s=[];for(const o of t.docChanges)o.type!==3&&s.push(o);t=new ho(t.query,t.docs,t.oldDocs,s,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let n=!1;return this.Na?this.La(t)&&(this.Oa.next(t),n=!0):this.ka(t,this.onlineState)&&(this.qa(t),n=!0),this.Ba=t,n}onError(t){this.Oa.error(t)}Fa(t){this.onlineState=t;let n=!1;return this.Ba&&!this.Na&&this.ka(this.Ba,t)&&(this.qa(this.Ba),n=!0),n}ka(t,n){if(!t.fromCache||!this.va())return!0;const s=n!=="Offline";return(!this.options.Qa||!s)&&(!t.docs.isEmpty()||t.hasCachedResults||n==="Offline")}La(t){if(t.docChanges.length>0)return!0;const n=this.Ba&&this.Ba.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}qa(t){t=ho.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Na=!0,this.Oa.next(t)}va(){return this.options.source!==Km.Cache}}/**
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
 */class VA{constructor(t){this.key=t}}class PA{constructor(t){this.key=t}}class $2{constructor(t,n){this.query=t,this.Ha=n,this.Ja=null,this.hasCachedResults=!1,this.current=!1,this.Ya=Vt(),this.mutatedKeys=Vt(),this.Za=J0(t),this.Xa=new no(this.Za)}get eu(){return this.Ha}tu(t,n){const s=n?n.nu:new qT,o=n?n.Xa:this.Xa;let u=n?n.mutatedKeys:this.mutatedKeys,f=o,m=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(t.inorderTraversal((T,S)=>{const R=o.get(T),z=Lh(this.query,S)?S:null,X=!!R&&this.mutatedKeys.has(R.key),tt=!!z&&(z.hasLocalMutations||this.mutatedKeys.has(z.key)&&z.hasCommittedMutations);let Y=!1;R&&z?R.data.isEqual(z.data)?X!==tt&&(s.track({type:3,doc:z}),Y=!0):this.ru(R,z)||(s.track({type:2,doc:z}),Y=!0,(g&&this.Za(z,g)>0||_&&this.Za(z,_)<0)&&(m=!0)):!R&&z?(s.track({type:0,doc:z}),Y=!0):R&&!z&&(s.track({type:1,doc:R}),Y=!0,(g||_)&&(m=!0)),Y&&(z?(f=f.add(z),u=tt?u.add(T):u.delete(T)):(f=f.delete(T),u=u.delete(T)))}),this.query.limit!==null)for(;f.size>this.query.limit;){const T=this.query.limitType==="F"?f.last():f.first();f=f.delete(T.key),u=u.delete(T.key),s.track({type:1,doc:T})}return{Xa:f,nu:s,Cs:m,mutatedKeys:u}}ru(t,n){return t.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(t,n,s,o){const u=this.Xa;this.Xa=t.Xa,this.mutatedKeys=t.mutatedKeys;const f=t.nu.wa();f.sort((T,S)=>function(z,X){const tt=Y=>{switch(Y){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return vt(20277,{Vt:Y})}};return tt(z)-tt(X)}(T.type,S.type)||this.Za(T.doc,S.doc)),this.iu(s),o=o!=null&&o;const m=n&&!o?this.su():[],g=this.Ya.size===0&&this.current&&!o?1:0,_=g!==this.Ja;return this.Ja=g,f.length!==0||_?{snapshot:new ho(this.query,t.Xa,u,f,t.mutatedKeys,g===0,_,!1,!!s&&s.resumeToken.approximateByteSize()>0),ou:m}:{ou:m}}Fa(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Xa:this.Xa,nu:new qT,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{ou:[]}}_u(t){return!this.Ha.has(t)&&!!this.Xa.has(t)&&!this.Xa.get(t).hasLocalMutations}iu(t){t&&(t.addedDocuments.forEach(n=>this.Ha=this.Ha.add(n)),t.modifiedDocuments.forEach(n=>{}),t.removedDocuments.forEach(n=>this.Ha=this.Ha.delete(n)),this.current=t.current)}su(){if(!this.current)return[];const t=this.Ya;this.Ya=Vt(),this.Xa.forEach(s=>{this._u(s.key)&&(this.Ya=this.Ya.add(s.key))});const n=[];return t.forEach(s=>{this.Ya.has(s)||n.push(new PA(s))}),this.Ya.forEach(s=>{t.has(s)||n.push(new VA(s))}),n}au(t){this.Ha=t.$s,this.Ya=Vt();const n=this.tu(t.documents);return this.applyChanges(n,!0)}uu(){return ho.fromInitialDocuments(this.query,this.Xa,this.mutatedKeys,this.Ja===0,this.hasCachedResults)}}const zp="SyncEngine";class Z2{constructor(t,n,s){this.query=t,this.targetId=n,this.view=s}}class W2{constructor(t){this.key=t,this.cu=!1}}class J2{constructor(t,n,s,o,u,f){this.localStore=t,this.remoteStore=n,this.eventManager=s,this.sharedClientState=o,this.currentUser=u,this.maxConcurrentLimboResolutions=f,this.lu={},this.hu=new Ws(m=>W0(m),Uh),this.Pu=new Map,this.Tu=new Set,this.Iu=new ie(mt.comparator),this.Eu=new Map,this.du=new Cp,this.Au={},this.Ru=new Map,this.Vu=co.lr(),this.onlineState="Unknown",this.mu=void 0}get isPrimaryClient(){return this.mu===!0}}async function tO(r,t,n=!0){const s=BA(r);let o;const u=s.hu.get(t);return u?(s.sharedClientState.addLocalQueryTarget(u.targetId),o=u.view.uu()):o=await kA(s,t,n,!0),o}async function eO(r,t){const n=BA(r);await kA(n,t,!0,!1)}async function kA(r,t,n,s){const o=await y2(r.localStore,yi(t)),u=o.targetId,f=r.sharedClientState.addLocalQueryTarget(u,n);let m;return s&&(m=await nO(r,t,u,f==="current",o.resumeToken)),r.isPrimaryClient&&n&&wA(r.remoteStore,o),m}async function nO(r,t,n,s,o){r.fu=(S,R,z)=>async function(tt,Y,gt,ut){let at=Y.view.tu(gt);at.Cs&&(at=await xT(tt.localStore,Y.query,!1).then(({documents:M})=>Y.view.tu(M,at)));const _t=ut&&ut.targetChanges.get(Y.targetId),ht=ut&&ut.targetMismatches.get(Y.targetId)!=null,Rt=Y.view.applyChanges(at,tt.isPrimaryClient,_t,ht);return KT(tt,Y.targetId,Rt.ou),Rt.snapshot}(r,S,R,z);const u=await xT(r.localStore,t,!0),f=new $2(t,u.$s),m=f.tu(u.documents),g=cu.createSynthesizedTargetChangeForCurrentChange(n,s&&r.onlineState!=="Offline",o),_=f.applyChanges(m,r.isPrimaryClient,g);KT(r,n,_.ou);const T=new Z2(t,n,f);return r.hu.set(t,T),r.Pu.has(n)?r.Pu.get(n).push(t):r.Pu.set(n,[t]),_.snapshot}async function iO(r,t,n){const s=St(r),o=s.hu.get(t),u=s.Pu.get(o.targetId);if(u.length>1)return s.Pu.set(o.targetId,u.filter(f=>!Uh(f,t))),void s.hu.delete(t);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await Fm(s.localStore,o.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(o.targetId),n&&Mp(s.remoteStore,o.targetId),Ym(s,o.targetId)}).catch(go)):(Ym(s,o.targetId),await Fm(s.localStore,o.targetId,!0))}async function rO(r,t){const n=St(r),s=n.hu.get(t),o=n.Pu.get(s.targetId);n.isPrimaryClient&&o.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),Mp(n.remoteStore,s.targetId))}async function sO(r,t,n){const s=fO(r);try{const o=await function(f,m){const g=St(f),_=be.now(),T=m.reduce((z,X)=>z.add(X.key),Vt());let S,R;return g.persistence.runTransaction("Locally write mutations","readwrite",z=>{let X=ir(),tt=Vt();return g.Bs.getEntries(z,T).next(Y=>{X=Y,X.forEach((gt,ut)=>{ut.isValidDocument()||(tt=tt.add(gt))})}).next(()=>g.localDocuments.getOverlayedDocuments(z,X)).next(Y=>{S=Y;const gt=[];for(const ut of m){const at=yN(ut,S.get(ut.key).overlayedDocument);at!=null&&gt.push(new Js(ut.key,at,G0(at.value.mapValue),Wi.exists(!0)))}return g.mutationQueue.addMutationBatch(z,_,gt,m)}).next(Y=>{R=Y;const gt=Y.applyToLocalDocumentSet(S,tt);return g.documentOverlayCache.saveOverlays(z,Y.batchId,gt)})}).then(()=>({batchId:R.batchId,changes:eA(S)}))}(s.localStore,t);s.sharedClientState.addPendingMutation(o.batchId),function(f,m,g){let _=f.Au[f.currentUser.toKey()];_||(_=new ie(wt)),_=_.insert(m,g),f.Au[f.currentUser.toKey()]=_}(s,o.batchId,n),await fu(s,o.changes),await Fh(s.remoteStore)}catch(o){const u=Up(o,"Failed to persist write");n.reject(u)}}async function xA(r,t){const n=St(r);try{const s=await p2(n.localStore,t);t.targetChanges.forEach((o,u)=>{const f=n.Eu.get(u);f&&(qt(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?f.cu=!0:o.modifiedDocuments.size>0?qt(f.cu,14607):o.removedDocuments.size>0&&(qt(f.cu,42227),f.cu=!1))}),await fu(n,s,t)}catch(s){await go(s)}}function GT(r,t,n){const s=St(r);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const o=[];s.hu.forEach((u,f)=>{const m=f.view.Fa(t);m.snapshot&&o.push(m.snapshot)}),function(f,m){const g=St(f);g.onlineState=m;let _=!1;g.queries.forEach((T,S)=>{for(const R of S.Sa)R.Fa(m)&&(_=!0)}),_&&Lp(g)}(s.eventManager,t),o.length&&s.lu.Y_(o),s.onlineState=t,s.isPrimaryClient&&s.sharedClientState.setOnlineState(t)}}async function aO(r,t,n){const s=St(r);s.sharedClientState.updateQueryState(t,"rejected",n);const o=s.Eu.get(t),u=o&&o.key;if(u){let f=new ie(mt.comparator);f=f.insert(u,Xe.newNoDocument(u,At.min()));const m=Vt().add(u),g=new jh(At.min(),new Map,new ie(wt),f,m);await xA(s,g),s.Iu=s.Iu.remove(u),s.Eu.delete(t),Bp(s)}else await Fm(s.localStore,t,!1).then(()=>Ym(s,t,n)).catch(go)}async function oO(r,t){const n=St(r),s=t.batch.batchId;try{const o=await m2(n.localStore,t);LA(n,s,null),UA(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await fu(n,o)}catch(o){await go(o)}}async function lO(r,t,n){const s=St(r);try{const o=await function(f,m){const g=St(f);return g.persistence.runTransaction("Reject batch","readwrite-primary",_=>{let T;return g.mutationQueue.lookupMutationBatch(_,m).next(S=>(qt(S!==null,37113),T=S.keys(),g.mutationQueue.removeMutationBatch(_,S))).next(()=>g.mutationQueue.performConsistencyCheck(_)).next(()=>g.documentOverlayCache.removeOverlaysForBatchId(_,T,m)).next(()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,T)).next(()=>g.localDocuments.getDocuments(_,T))})}(s.localStore,t);LA(s,t,n),UA(s,t),s.sharedClientState.updateMutationState(t,"rejected",n),await fu(s,o)}catch(o){await go(o)}}function UA(r,t){(r.Ru.get(t)||[]).forEach(n=>{n.resolve()}),r.Ru.delete(t)}function LA(r,t,n){const s=St(r);let o=s.Au[s.currentUser.toKey()];if(o){const u=o.get(t);u&&(n?u.reject(n):u.resolve(),o=o.remove(t)),s.Au[s.currentUser.toKey()]=o}}function Ym(r,t,n=null){r.sharedClientState.removeLocalQueryTarget(t);for(const s of r.Pu.get(t))r.hu.delete(s),n&&r.lu.gu(s,n);r.Pu.delete(t),r.isPrimaryClient&&r.du.Hr(t).forEach(s=>{r.du.containsKey(s)||zA(r,s)})}function zA(r,t){r.Tu.delete(t.path.canonicalString());const n=r.Iu.get(t);n!==null&&(Mp(r.remoteStore,n),r.Iu=r.Iu.remove(t),r.Eu.delete(n),Bp(r))}function KT(r,t,n){for(const s of n)s instanceof VA?(r.du.addReference(s.key,t),uO(r,s)):s instanceof PA?(rt(zp,"Document no longer in limbo: "+s.key),r.du.removeReference(s.key,t),r.du.containsKey(s.key)||zA(r,s.key)):vt(19791,{pu:s})}function uO(r,t){const n=t.key,s=n.path.canonicalString();r.Iu.get(n)||r.Tu.has(s)||(rt(zp,"New document in limbo: "+n),r.Tu.add(s),Bp(r))}function Bp(r){for(;r.Tu.size>0&&r.Iu.size<r.maxConcurrentLimboResolutions;){const t=r.Tu.values().next().value;r.Tu.delete(t);const n=new mt(le.fromString(t)),s=r.Vu.next();r.Eu.set(s,new W2(n)),r.Iu=r.Iu.insert(n,s),wA(r.remoteStore,new Br(yi(Sp(n.path)),s,"TargetPurposeLimboResolution",Vh.le))}}async function fu(r,t,n){const s=St(r),o=[],u=[],f=[];s.hu.isEmpty()||(s.hu.forEach((m,g)=>{f.push(s.fu(g,t,n).then(_=>{var T;if((_||n)&&s.isPrimaryClient){const S=_?!_.fromCache:(T=n?.targetChanges.get(g.targetId))===null||T===void 0?void 0:T.current;s.sharedClientState.updateQueryState(g.targetId,S?"current":"not-current")}if(_){o.push(_);const S=Op.Rs(g.targetId,_);u.push(S)}}))}),await Promise.all(f),s.lu.Y_(o),await async function(g,_){const T=St(g);try{await T.persistence.runTransaction("notifyLocalViewChanges","readwrite",S=>$.forEach(_,R=>$.forEach(R.ds,z=>T.persistence.referenceDelegate.addReference(S,R.targetId,z)).next(()=>$.forEach(R.As,z=>T.persistence.referenceDelegate.removeReference(S,R.targetId,z)))))}catch(S){if(!_o(S))throw S;rt(Dp,"Failed to update sequence numbers: "+S)}for(const S of _){const R=S.targetId;if(!S.fromCache){const z=T.xs.get(R),X=z.snapshotVersion,tt=z.withLastLimboFreeSnapshotVersion(X);T.xs=T.xs.insert(R,tt)}}}(s.localStore,u))}async function cO(r,t){const n=St(r);if(!n.currentUser.isEqual(t)){rt(zp,"User change. New user:",t.toKey());const s=await SA(n.localStore,t);n.currentUser=t,function(u,f){u.Ru.forEach(m=>{m.forEach(g=>{g.reject(new dt(W.CANCELLED,f))})}),u.Ru.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(t,s.removedBatchIds,s.addedBatchIds),await fu(n,s.ks)}}function hO(r,t){const n=St(r),s=n.Eu.get(t);if(s&&s.cu)return Vt().add(s.key);{let o=Vt();const u=n.Pu.get(t);if(!u)return o;for(const f of u){const m=n.hu.get(f);o=o.unionWith(m.view.eu)}return o}}function BA(r){const t=St(r);return t.remoteStore.remoteSyncer.applyRemoteEvent=xA.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=hO.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=aO.bind(null,t),t.lu.Y_=Y2.bind(null,t.eventManager),t.lu.gu=Q2.bind(null,t.eventManager),t}function fO(r){const t=St(r);return t.remoteStore.remoteSyncer.applySuccessfulWrite=oO.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=lO.bind(null,t),t}class Sh{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=qh(t.databaseInfo.databaseId),this.sharedClientState=this.bu(t),this.persistence=this.Su(t),await this.persistence.start(),this.localStore=this.Du(t),this.gcScheduler=this.vu(t,this.localStore),this.indexBackfillerScheduler=this.Cu(t,this.localStore)}vu(t,n){return null}Cu(t,n){return null}Du(t){return d2(this.persistence,new c2,t.initialUser,this.serializer)}Su(t){return new AA(Np.fi,this.serializer)}bu(t){return new T2}async terminate(){var t,n;(t=this.gcScheduler)===null||t===void 0||t.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Sh.provider={build:()=>new Sh};class dO extends Sh{constructor(t){super(),this.cacheSizeBytes=t}vu(t,n){qt(this.persistence.referenceDelegate instanceof Eh,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new XN(s,t.asyncQueue,n)}Su(t){const n=this.cacheSizeBytes!==void 0?un.withCacheSize(this.cacheSizeBytes):un.DEFAULT;return new AA(s=>Eh.fi(s,n),this.serializer)}}class Qm{async initialize(t,n){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>GT(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=cO.bind(null,this.syncEngine),await q2(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new F2}()}createDatastore(t){const n=qh(t.databaseInfo.databaseId),s=function(u){return new R2(u)}(t.databaseInfo);return function(u,f,m,g){return new N2(u,f,m,g)}(t.authCredentials,t.appCheckCredentials,s,n)}createRemoteStore(t){return function(s,o,u,f,m){return new D2(s,o,u,f,m)}(this.localStore,this.datastore,t.asyncQueue,n=>GT(this.syncEngine,n,0),function(){return zT.C()?new zT:new E2}())}createSyncEngine(t,n){return function(o,u,f,m,g,_,T){const S=new J2(o,u,f,m,g,_);return T&&(S.mu=!0),S}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,n)}async terminate(){var t,n;await async function(o){const u=St(o);rt(Ks,"RemoteStore shutting down."),u.da.add(5),await hu(u),u.Ra.shutdown(),u.Va.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Qm.provider={build:()=>new Qm};/**
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
 */class mO{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Mu(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Mu(this.observer.error,t):nr("Uncaught Error in snapshot listener:",t.toString()))}xu(){this.muted=!0}Mu(t,n){setTimeout(()=>{this.muted||t(n)},0)}}/**
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
 */const Zr="FirestoreClient";class pO{constructor(t,n,s,o,u){this.authCredentials=t,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=o,this.user=Ye.UNAUTHENTICATED,this.clientId=k0.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=u,this.authCredentials.start(s,async f=>{rt(Zr,"Received user=",f.uid),await this.authCredentialListener(f),this.user=f}),this.appCheckCredentials.start(s,f=>(rt(Zr,"Received new app check token=",f),this.appCheckCredentialListener(f,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Fr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(n){const s=Up(n,"Failed to shutdown persistence");t.reject(s)}}),t.promise}}async function fm(r,t){r.asyncQueue.verifyOperationInProgress(),rt(Zr,"Initializing OfflineComponentProvider");const n=r.configuration;await t.initialize(n);let s=n.initialUser;r.setCredentialChangeListener(async o=>{s.isEqual(o)||(await SA(t.localStore,o),s=o)}),t.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=t}async function YT(r,t){r.asyncQueue.verifyOperationInProgress();const n=await gO(r);rt(Zr,"Initializing OnlineComponentProvider"),await t.initialize(n,r.configuration),r.setCredentialChangeListener(s=>jT(t.remoteStore,s)),r.setAppCheckTokenChangeListener((s,o)=>jT(t.remoteStore,o)),r._onlineComponents=t}async function gO(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){rt(Zr,"Using user provided OfflineComponentProvider");try{await fm(r,r._uninitializedComponentsProvider._offline)}catch(t){const n=t;if(!function(o){return o.name==="FirebaseError"?o.code===W.FAILED_PRECONDITION||o.code===W.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11}(n))throw n;ao("Error using user provided cache. Falling back to memory cache: "+n),await fm(r,new Sh)}}else rt(Zr,"Using default OfflineComponentProvider"),await fm(r,new dO(void 0));return r._offlineComponents}async function jA(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(rt(Zr,"Using user provided OnlineComponentProvider"),await YT(r,r._uninitializedComponentsProvider._online)):(rt(Zr,"Using default OnlineComponentProvider"),await YT(r,new Qm))),r._onlineComponents}function _O(r){return jA(r).then(t=>t.syncEngine)}async function yO(r){const t=await jA(r),n=t.eventManager;return n.onListen=tO.bind(null,t.syncEngine),n.onUnlisten=iO.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=eO.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=rO.bind(null,t.syncEngine),n}function vO(r,t,n={}){const s=new Fr;return r.asyncQueue.enqueueAndForget(async()=>function(u,f,m,g,_){const T=new mO({next:R=>{T.xu(),f.enqueueAndForget(()=>K2(u,S));const z=R.docs.has(m);!z&&R.fromCache?_.reject(new dt(W.UNAVAILABLE,"Failed to get document because the client is offline.")):z&&R.fromCache&&g&&g.source==="server"?_.reject(new dt(W.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):_.resolve(R)},error:R=>_.reject(R)}),S=new X2(Sp(m.path),T,{includeMetadataChanges:!0,Qa:!0});return G2(u,S)}(await yO(r),r.asyncQueue,t,n,s)),s.promise}/**
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
 */function qA(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
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
 */const QT=new Map;/**
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
 */function TO(r,t,n){if(!n)throw new dt(W.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${t}.`)}function EO(r,t,n,s){if(t===!0&&s===!0)throw new dt(W.INVALID_ARGUMENT,`${r} and ${n} cannot be used together.`)}function XT(r){if(!mt.isDocumentKey(r))throw new dt(W.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function jp(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=function(s){return s.constructor?s.constructor.name:null}(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":vt(12329,{type:typeof r})}function tu(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new dt(W.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=jp(r);throw new dt(W.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return r}/**
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
 */const HA="firestore.googleapis.com",$T=!0;class ZT{constructor(t){var n,s;if(t.host===void 0){if(t.ssl!==void 0)throw new dt(W.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=HA,this.ssl=$T}else this.host=t.host,this.ssl=(n=t.ssl)!==null&&n!==void 0?n:$T;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=EA;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<YN)throw new dt(W.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}EO("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=qA((s=t.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(u){if(u.timeoutSeconds!==void 0){if(isNaN(u.timeoutSeconds))throw new dt(W.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (must not be NaN)`);if(u.timeoutSeconds<5)throw new dt(W.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (minimum allowed value is 5)`);if(u.timeoutSeconds>30)throw new dt(W.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(s,o){return s.timeoutSeconds===o.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class qp{constructor(t,n,s,o){this._authCredentials=t,this._appCheckCredentials=n,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ZT({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new dt(W.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new dt(W.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ZT(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new SC;switch(s.type){case"firstParty":return new wC(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new dt(W.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=QT.get(n);s&&(rt("ComponentProvider","Removing Datastore"),QT.delete(n),s.terminate())}(this),Promise.resolve()}}function AO(r,t,n,s={}){var o;r=tu(r,qp);const u=Xs(t),f=r._getSettings(),m=Object.assign(Object.assign({},f),{emulatorOptions:r._getEmulatorOptions()}),g=`${t}:${n}`;u&&(np(`https://${g}`),ip("Firestore",!0)),f.host!==HA&&f.host!==g&&ao("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const _=Object.assign(Object.assign({},f),{host:g,ssl:u,emulatorOptions:s});if(!Gr(_,m)&&(r._setSettings(_),s.mockUserToken)){let T,S;if(typeof s.mockUserToken=="string")T=s.mockUserToken,S=Ye.MOCK_USER;else{T=BE(s.mockUserToken,(o=r._app)===null||o===void 0?void 0:o.options.projectId);const R=s.mockUserToken.sub||s.mockUserToken.user_id;if(!R)throw new dt(W.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");S=new Ye(R)}r._authCredentials=new bC(new V0(T,S))}}/**
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
 */class Hp{constructor(t,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=t}withConverter(t){return new Hp(this.firestore,t,this._query)}}class Un{constructor(t,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new eu(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Un(this.firestore,t,this._key)}}class eu extends Hp{constructor(t,n,s){super(t,n,Sp(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Un(this.firestore,null,new mt(t))}withConverter(t){return new eu(this.firestore,t,this._path)}}function FA(r,t,...n){if(r=rn(r),arguments.length===1&&(t=k0.newId()),TO("doc","path",t),r instanceof qp){const s=le.fromString(t,...n);return XT(s),new Un(r,null,new mt(s))}{if(!(r instanceof Un||r instanceof eu))throw new dt(W.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(le.fromString(t,...n));return XT(s),new Un(r.firestore,r instanceof eu?r.converter:null,new mt(s))}}/**
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
 */const WT="AsyncQueue";class JT{constructor(t=Promise.resolve()){this.Ju=[],this.Yu=!1,this.Zu=[],this.Xu=null,this.ec=!1,this.tc=!1,this.nc=[],this.x_=new RA(this,"async_queue_retry"),this.rc=()=>{const s=hm();s&&rt(WT,"Visibility state changed to "+s.visibilityState),this.x_.b_()},this.sc=t;const n=hm();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.rc)}get isShuttingDown(){return this.Yu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.oc(),this._c(t)}enterRestrictedMode(t){if(!this.Yu){this.Yu=!0,this.tc=t||!1;const n=hm();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.rc)}}enqueue(t){if(this.oc(),this.Yu)return new Promise(()=>{});const n=new Fr;return this._c(()=>this.Yu&&this.tc?Promise.resolve():(t().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Ju.push(t),this.ac()))}async ac(){if(this.Ju.length!==0){try{await this.Ju[0](),this.Ju.shift(),this.x_.reset()}catch(t){if(!_o(t))throw t;rt(WT,"Operation failed with retryable error: "+t)}this.Ju.length>0&&this.x_.y_(()=>this.ac())}}_c(t){const n=this.sc.then(()=>(this.ec=!0,t().catch(s=>{throw this.Xu=s,this.ec=!1,nr("INTERNAL UNHANDLED ERROR: ",tE(s)),s}).then(s=>(this.ec=!1,s))));return this.sc=n,n}enqueueAfterDelay(t,n,s){this.oc(),this.nc.indexOf(t)>-1&&(n=0);const o=xp.createAndSchedule(this,t,n,s,u=>this.uc(u));return this.Zu.push(o),o}oc(){this.Xu&&vt(47125,{cc:tE(this.Xu)})}verifyOperationInProgress(){}async lc(){let t;do t=this.sc,await t;while(t!==this.sc)}hc(t){for(const n of this.Zu)if(n.timerId===t)return!0;return!1}Pc(t){return this.lc().then(()=>{this.Zu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Zu)if(n.skipDelay(),t!=="all"&&n.timerId===t)break;return this.lc()})}Tc(t){this.nc.push(t)}uc(t){const n=this.Zu.indexOf(t);this.Zu.splice(n,1)}}function tE(r){let t=r.message||"";return r.stack&&(t=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),t}class Fp extends qp{constructor(t,n,s,o){super(t,n,s,o),this.type="firestore",this._queue=new JT,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new JT(t),this._firestoreClient=void 0,await t}}}function SO(r,t){const n=typeof r=="object"?r:su(),s=typeof r=="string"?r:mh,o=rr(n,"firestore").getImmediate({identifier:s});if(!o._initialized){const u=UE("firestore");u&&AO(o,...u)}return o}function GA(r){if(r._terminated)throw new dt(W.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||bO(r),r._firestoreClient}function bO(r){var t,n,s;const o=r._freezeSettings(),u=function(m,g,_,T){return new qC(m,g,_,T.host,T.ssl,T.experimentalForceLongPolling,T.experimentalAutoDetectLongPolling,qA(T.experimentalLongPollingOptions),T.useFetchStreams,T.isUsingEmulator)}(r._databaseId,((t=r._app)===null||t===void 0?void 0:t.options.appId)||"",r._persistenceKey,o);r._componentsProvider||!((n=o.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=o.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(r._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),r._firestoreClient=new pO(r._authCredentials,r._appCheckCredentials,r._queue,u,r._componentsProvider&&function(m){const g=m?._online.build();return{_offline:m?._offline.build(g),_online:g}}(r._componentsProvider))}/**
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
 */class fo{constructor(t){this._byteString=t}static fromBase64String(t){try{return new fo(qe.fromBase64String(t))}catch(n){throw new dt(W.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(t){return new fo(qe.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
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
 */class Gp{constructor(...t){for(let n=0;n<t.length;++n)if(t[n].length===0)throw new dt(W.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new je(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class KA{constructor(t){this._methodName=t}}/**
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
 */class Kp{constructor(t,n){if(!isFinite(t)||t<-90||t>90)throw new dt(W.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(n)||n<-180||n>180)throw new dt(W.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=t,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return wt(this._lat,t._lat)||wt(this._long,t._long)}}/**
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
 */class Yp{constructor(t){this._values=(t||[]).map(n=>n)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(s,o){if(s.length!==o.length)return!1;for(let u=0;u<s.length;++u)if(s[u]!==o[u])return!1;return!0}(this._values,t._values)}}/**
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
 */const RO=/^__.*__$/;class IO{constructor(t,n,s){this.data=t,this.fieldMask=n,this.fieldTransforms=s}toMutation(t,n){return this.fieldMask!==null?new Js(t,this.data,this.fieldMask,n,this.fieldTransforms):new uu(t,this.data,n,this.fieldTransforms)}}function YA(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw vt(40011,{Ic:r})}}class Qp{constructor(t,n,s,o,u,f){this.settings=t,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=o,u===void 0&&this.Ec(),this.fieldTransforms=u||[],this.fieldMask=f||[]}get path(){return this.settings.path}get Ic(){return this.settings.Ic}dc(t){return new Qp(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Ac(t){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(t),o=this.dc({path:s,Rc:!1});return o.Vc(t),o}mc(t){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(t),o=this.dc({path:s,Rc:!1});return o.Ec(),o}fc(t){return this.dc({path:void 0,Rc:!0})}gc(t){return bh(t,this.settings.methodName,this.settings.yc||!1,this.path,this.settings.wc)}contains(t){return this.fieldMask.find(n=>t.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>t.isPrefixOf(n.field))!==void 0}Ec(){if(this.path)for(let t=0;t<this.path.length;t++)this.Vc(this.path.get(t))}Vc(t){if(t.length===0)throw this.gc("Document fields must not be empty");if(YA(this.Ic)&&RO.test(t))throw this.gc('Document fields cannot begin and end with "__"')}}class wO{constructor(t,n,s){this.databaseId=t,this.ignoreUndefinedProperties=n,this.serializer=s||qh(t)}bc(t,n,s,o=!1){return new Qp({Ic:t,methodName:n,wc:s,path:je.emptyPath(),Rc:!1,yc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function CO(r){const t=r._freezeSettings(),n=qh(r._databaseId);return new wO(r._databaseId,!!t.ignoreUndefinedProperties,n)}function NO(r,t,n,s,o,u={}){const f=r.bc(u.merge||u.mergeFields?2:0,t,n,o);ZA("Data must be an object, but it was:",f,s);const m=XA(s,f);let g,_;if(u.merge)g=new $n(f.fieldMask),_=f.fieldTransforms;else if(u.mergeFields){const T=[];for(const S of u.mergeFields){const R=OO(t,S,n);if(!f.contains(R))throw new dt(W.INVALID_ARGUMENT,`Field '${R}' is specified in your field mask but missing from your input data.`);MO(T,R)||T.push(R)}g=new $n(T),_=f.fieldTransforms.filter(S=>g.covers(S.field))}else g=null,_=f.fieldTransforms;return new IO(new xn(m),g,_)}function QA(r,t){if($A(r=rn(r)))return ZA("Unsupported field value:",t,r),XA(r,t);if(r instanceof KA)return function(s,o){if(!YA(o.Ic))throw o.gc(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.gc(`${s._methodName}() is not currently supported inside arrays`);const u=s._toFieldTransform(o);u&&o.fieldTransforms.push(u)}(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.Rc&&t.Ic!==4)throw t.gc("Nested arrays are not supported");return function(s,o){const u=[];let f=0;for(const m of s){let g=QA(m,o.fc(f));g==null&&(g={nullValue:"NULL_VALUE"}),u.push(g),f++}return{arrayValue:{values:u}}}(r,t)}return function(s,o){if((s=rn(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return fN(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const u=be.fromDate(s);return{timestampValue:Th(o.serializer,u)}}if(s instanceof be){const u=new be(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Th(o.serializer,u)}}if(s instanceof Kp)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof fo)return{bytesValue:mA(o.serializer,s._byteString)};if(s instanceof Un){const u=o.databaseId,f=s.firestore._databaseId;if(!f.isEqual(u))throw o.gc(`Document reference is for database ${f.projectId}/${f.database} but should be for database ${u.projectId}/${u.database}`);return{referenceValue:wp(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof Yp)return function(f,m){return{mapValue:{fields:{[H0]:{stringValue:F0},[ph]:{arrayValue:{values:f.toArray().map(_=>{if(typeof _!="number")throw m.gc("VectorValues must only contain numeric values.");return bp(m.serializer,_)})}}}}}}(s,o);throw o.gc(`Unsupported field value: ${jp(s)}`)}(r,t)}function XA(r,t){const n={};return U0(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Zs(r,(s,o)=>{const u=QA(o,t.Ac(s));u!=null&&(n[s]=u)}),{mapValue:{fields:n}}}function $A(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof be||r instanceof Kp||r instanceof fo||r instanceof Un||r instanceof KA||r instanceof Yp)}function ZA(r,t,n){if(!$A(n)||!function(o){return typeof o=="object"&&o!==null&&(Object.getPrototypeOf(o)===Object.prototype||Object.getPrototypeOf(o)===null)}(n)){const s=jp(n);throw s==="an object"?t.gc(r+" a custom object"):t.gc(r+" "+s)}}function OO(r,t,n){if((t=rn(t))instanceof Gp)return t._internalPath;if(typeof t=="string")return WA(r,t);throw bh("Field path arguments must be of type string or ",r,!1,void 0,n)}const DO=new RegExp("[~\\*/\\[\\]]");function WA(r,t,n){if(t.search(DO)>=0)throw bh(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,n);try{return new Gp(...t.split("."))._internalPath}catch{throw bh(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,n)}}function bh(r,t,n,s,o){const u=s&&!s.isEmpty(),f=o!==void 0;let m=`Function ${t}() called with invalid data`;n&&(m+=" (via `toFirestore()`)"),m+=". ";let g="";return(u||f)&&(g+=" (found",u&&(g+=` in field ${s}`),f&&(g+=` in document ${o}`),g+=")"),new dt(W.INVALID_ARGUMENT,m+r+g)}function MO(r,t){return r.some(n=>n.isEqual(t))}/**
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
 */class JA{constructor(t,n,s,o,u){this._firestore=t,this._userDataWriter=n,this._key=s,this._document=o,this._converter=u}get id(){return this._key.path.lastSegment()}get ref(){return new Un(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new VO(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const n=this._document.data.field(tS("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n)}}}class VO extends JA{data(){return super.data()}}function tS(r,t){return typeof t=="string"?WA(r,t):t instanceof Gp?t._internalPath:t._delegate._internalPath}class PO{convertValue(t,n="none"){switch(Xr(t)){case 0:return null;case 1:return t.booleanValue;case 2:return fe(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,n);case 5:return t.stringValue;case 6:return this.convertBytes(Qr(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,n);case 11:return this.convertObject(t.mapValue,n);case 10:return this.convertVectorValue(t.mapValue);default:throw vt(62114,{value:t})}}convertObject(t,n){return this.convertObjectMap(t.fields,n)}convertObjectMap(t,n="none"){const s={};return Zs(t,(o,u)=>{s[o]=this.convertValue(u,n)}),s}convertVectorValue(t){var n,s,o;const u=(o=(s=(n=t.fields)===null||n===void 0?void 0:n[ph].arrayValue)===null||s===void 0?void 0:s.values)===null||o===void 0?void 0:o.map(f=>fe(f.doubleValue));return new Yp(u)}convertGeoPoint(t){return new Kp(fe(t.latitude),fe(t.longitude))}convertArray(t,n){return(t.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(t,n){switch(n){case"previous":const s=kh(t);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(Xl(t));default:return null}}convertTimestamp(t){const n=Yr(t);return new be(n.seconds,n.nanos)}convertDocumentKey(t,n){const s=le.fromString(t);qt(TA(s),9688,{name:t});const o=new $l(s.get(1),s.get(3)),u=new mt(s.popFirst(5));return o.isEqual(n)||nr(`Document ${u} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),u}}/**
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
 */function kO(r,t,n){let s;return s=r?r.toFirestore(t):t,s}/**
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
 */class xO{constructor(t,n){this.hasPendingWrites=t,this.fromCache=n}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class eS extends JA{constructor(t,n,s,o,u,f){super(t,n,s,o,f),this._firestore=t,this._firestoreImpl=t,this.metadata=u}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const n=new UO(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,n={}){if(this._document){const s=this._document.data.field(tS("DocumentSnapshot.get",t));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class UO extends eS{data(t={}){return super.data(t)}}/**
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
 */function nS(r){r=tu(r,Un);const t=tu(r.firestore,Fp);return vO(GA(t),r._key).then(n=>jO(t,r,n))}class LO extends PO{constructor(t){super(),this.firestore=t}convertBytes(t){return new fo(t)}convertReference(t){const n=this.convertDocumentKey(t,this.firestore._databaseId);return new Un(this.firestore,null,n)}}function zO(r,t,n){r=tu(r,Un);const s=tu(r.firestore,Fp),o=kO(r.converter,t);return BO(s,[NO(CO(s),"setDoc",r._key,o,r.converter!==null,n).toMutation(r._key,Wi.none())])}function BO(r,t){return function(s,o){const u=new Fr;return s.asyncQueue.enqueueAndForget(async()=>sO(await _O(s),o,u)),u.promise}(GA(r),t)}function jO(r,t,n){const s=n.docs.get(t._key),o=new LO(r);return new eS(r,o,t._key,s,new xO(n.hasPendingWrites,n.fromCache),t.converter)}(function(t,n=!0){(function(o){po=o})($s),Ln(new An("firestore",(s,{instanceIdentifier:o,options:u})=>{const f=s.getProvider("app").getImmediate(),m=new Fp(new RC(s.getProvider("auth-internal")),new CC(f,s.getProvider("app-check-internal")),function(_,T){if(!Object.prototype.hasOwnProperty.apply(_.options,["projectId"]))throw new dt(W.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new $l(_.options.projectId,T)}(f,o),f);return u=Object.assign({useFetchStreams:n},u),m._setSettings(u),m},"PUBLIC").setMultipleInstances(!0)),$e(aT,oT,t),$e(aT,oT,"esm2017")})();/**
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
 */const iS="firebasestorage.googleapis.com",qO="storageBucket",HO=2*60*1e3,FO=10*60*1e3;/**
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
 */class Si extends zn{constructor(t,n,s=0){super(dm(t),`Firebase Storage: ${n} (${dm(t)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Si.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return dm(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Ai;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Ai||(Ai={}));function dm(r){return"storage/"+r}function GO(){const r="An unknown error occurred, please check the error payload for server response.";return new Si(Ai.UNKNOWN,r)}function KO(){return new Si(Ai.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function YO(){return new Si(Ai.CANCELED,"User canceled the upload/download.")}function QO(r){return new Si(Ai.INVALID_URL,"Invalid URL '"+r+"'.")}function XO(r){return new Si(Ai.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function eE(r){return new Si(Ai.INVALID_ARGUMENT,r)}function rS(){return new Si(Ai.APP_DELETED,"The Firebase app was deleted.")}function $O(r){return new Si(Ai.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
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
 */class Zn{constructor(t,n){this.bucket=t,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,n){let s;try{s=Zn.makeFromUrl(t,n)}catch{return new Zn(t,"")}if(s.path==="")return s;throw XO(t)}static makeFromUrl(t,n){let s=null;const o="([A-Za-z0-9.\\-_]+)";function u(_t){_t.path.charAt(_t.path.length-1)==="/"&&(_t.path_=_t.path_.slice(0,-1))}const f="(/(.*))?$",m=new RegExp("^gs://"+o+f,"i"),g={bucket:1,path:3};function _(_t){_t.path_=decodeURIComponent(_t.path)}const T="v[A-Za-z0-9_]+",S=n.replace(/[.]/g,"\\."),R="(/([^?#]*).*)?$",z=new RegExp(`^https?://${S}/${T}/b/${o}/o${R}`,"i"),X={bucket:1,path:3},tt=n===iS?"(?:storage.googleapis.com|storage.cloud.google.com)":n,Y="([^?#]*)",gt=new RegExp(`^https?://${tt}/${o}/${Y}`,"i"),at=[{regex:m,indices:g,postModify:u},{regex:z,indices:X,postModify:_},{regex:gt,indices:{bucket:1,path:2},postModify:_}];for(let _t=0;_t<at.length;_t++){const ht=at[_t],Rt=ht.regex.exec(t);if(Rt){const M=Rt[ht.indices.bucket];let b=Rt[ht.indices.path];b||(b=""),s=new Zn(M,b),ht.postModify(s);break}}if(s==null)throw QO(t);return s}}class ZO{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
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
 */function WO(r,t,n){let s=1,o=null,u=null,f=!1,m=0;function g(){return m===2}let _=!1;function T(...Y){_||(_=!0,t.apply(null,Y))}function S(Y){o=setTimeout(()=>{o=null,r(z,g())},Y)}function R(){u&&clearTimeout(u)}function z(Y,...gt){if(_){R();return}if(Y){R(),T.call(null,Y,...gt);return}if(g()||f){R(),T.call(null,Y,...gt);return}s<64&&(s*=2);let at;m===1?(m=2,at=0):at=(s+Math.random())*1e3,S(at)}let X=!1;function tt(Y){X||(X=!0,R(),!_&&(o!==null?(Y||(m=2),clearTimeout(o),S(0)):Y||(m=1)))}return S(0),u=setTimeout(()=>{f=!0,tt(!0)},n),tt}function JO(r){r(!1)}/**
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
 */function tD(r){return r!==void 0}function nE(r,t,n,s){if(s<t)throw eE(`Invalid value for '${r}'. Expected ${t} or greater.`);if(s>n)throw eE(`Invalid value for '${r}'. Expected ${n} or less.`)}function eD(r){const t=encodeURIComponent;let n="?";for(const s in r)if(r.hasOwnProperty(s)){const o=t(s)+"="+t(r[s]);n=n+o+"&"}return n=n.slice(0,-1),n}var Rh;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(Rh||(Rh={}));/**
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
 */function nD(r,t){const n=r>=500&&r<600,o=[408,429].indexOf(r)!==-1,u=t.indexOf(r)!==-1;return n||o||u}/**
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
 */class iD{constructor(t,n,s,o,u,f,m,g,_,T,S,R=!0,z=!1){this.url_=t,this.method_=n,this.headers_=s,this.body_=o,this.successCodes_=u,this.additionalRetryCodes_=f,this.callback_=m,this.errorCallback_=g,this.timeout_=_,this.progressCallback_=T,this.connectionFactory_=S,this.retry=R,this.isUsingEmulator=z,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((X,tt)=>{this.resolve_=X,this.reject_=tt,this.start_()})}start_(){const t=(s,o)=>{if(o){s(!1,new Gc(!1,null,!0));return}const u=this.connectionFactory_();this.pendingConnection_=u;const f=m=>{const g=m.loaded,_=m.lengthComputable?m.total:-1;this.progressCallback_!==null&&this.progressCallback_(g,_)};this.progressCallback_!==null&&u.addUploadProgressListener(f),u.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&u.removeUploadProgressListener(f),this.pendingConnection_=null;const m=u.getErrorCode()===Rh.NO_ERROR,g=u.getStatus();if(!m||nD(g,this.additionalRetryCodes_)&&this.retry){const T=u.getErrorCode()===Rh.ABORT;s(!1,new Gc(!1,null,T));return}const _=this.successCodes_.indexOf(g)!==-1;s(!0,new Gc(_,u))})},n=(s,o)=>{const u=this.resolve_,f=this.reject_,m=o.connection;if(o.wasSuccessCode)try{const g=this.callback_(m,m.getResponse());tD(g)?u(g):u()}catch(g){f(g)}else if(m!==null){const g=GO();g.serverResponse=m.getErrorText(),this.errorCallback_?f(this.errorCallback_(m,g)):f(g)}else if(o.canceled){const g=this.appDelete_?rS():YO();f(g)}else{const g=KO();f(g)}};this.canceled_?n(!1,new Gc(!1,null,!0)):this.backoffId_=WO(t,n,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&JO(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Gc{constructor(t,n,s){this.wasSuccessCode=t,this.connection=n,this.canceled=!!s}}function rD(r,t){t!==null&&t.length>0&&(r.Authorization="Firebase "+t)}function sD(r,t){r["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function aD(r,t){t&&(r["X-Firebase-GMPID"]=t)}function oD(r,t){t!==null&&(r["X-Firebase-AppCheck"]=t)}function lD(r,t,n,s,o,u,f=!0,m=!1){const g=eD(r.urlParams),_=r.url+g,T=Object.assign({},r.headers);return aD(T,t),rD(T,n),sD(T,u),oD(T,s),new iD(_,r.method,T,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,o,f,m)}/**
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
 */function uD(r){if(r.length===0)return null;const t=r.lastIndexOf("/");return t===-1?"":r.slice(0,t)}function cD(r){const t=r.lastIndexOf("/",r.length-2);return t===-1?r:r.slice(t+1)}/**
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
 */class Ih{constructor(t,n){this._service=t,n instanceof Zn?this._location=n:this._location=Zn.makeFromUrl(n,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,n){return new Ih(t,n)}get root(){const t=new Zn(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return cD(this._location.path)}get storage(){return this._service}get parent(){const t=uD(this._location.path);if(t===null)return null;const n=new Zn(this._location.bucket,t);return new Ih(this._service,n)}_throwIfRoot(t){if(this._location.path==="")throw $O(t)}}function iE(r,t){const n=t?.[qO];return n==null?null:Zn.makeFromBucketSpec(n,r)}function hD(r,t,n,s={}){r.host=`${t}:${n}`;const o=Xs(t);o&&(np(`https://${r.host}/b`),ip("Storage",!0)),r._isUsingEmulator=!0,r._protocol=o?"https":"http";const{mockUserToken:u}=s;u&&(r._overrideAuthToken=typeof u=="string"?u:BE(u,r.app.options.projectId))}class fD{constructor(t,n,s,o,u,f=!1){this.app=t,this._authProvider=n,this._appCheckProvider=s,this._url=o,this._firebaseVersion=u,this._isUsingEmulator=f,this._bucket=null,this._host=iS,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=HO,this._maxUploadRetryTime=FO,this._requests=new Set,o!=null?this._bucket=Zn.makeFromBucketSpec(o,this._host):this._bucket=iE(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=Zn.makeFromBucketSpec(this._url,t):this._bucket=iE(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){nE("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){nE("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const n=await t.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(Qn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new Ih(this,t)}_makeRequest(t,n,s,o,u=!0){if(this._deleted)return new ZO(rS());{const f=lD(t,this._appId,s,o,n,this._firebaseVersion,u,this._isUsingEmulator);return this._requests.add(f),f.getPromise().then(()=>this._requests.delete(f),()=>this._requests.delete(f)),f}}async makeRequestWithTokens(t,n){const[s,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,n,s,o).getPromise()}}const rE="@firebase/storage",sE="0.13.13";/**
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
 */const sS="storage";function dD(r=su(),t){r=rn(r);const s=rr(r,sS).getImmediate({identifier:t}),o=UE("storage");return o&&mD(s,...o),s}function mD(r,t,n,s={}){hD(r,t,n,s)}function pD(r,{instanceIdentifier:t}){const n=r.getProvider("app").getImmediate(),s=r.getProvider("auth-internal"),o=r.getProvider("app-check-internal");return new fD(n,s,o,t,$s)}function gD(){Ln(new An(sS,pD,"PUBLIC").setMultipleInstances(!0)),$e(rE,sE,""),$e(rE,sE,"esm2017")}gD();const aS="@firebase/installations",Xp="0.6.17";/**
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
 */const oS=1e4,lS=`w:${Xp}`,uS="FIS_v2",_D="https://firebaseinstallations.googleapis.com/v1",yD=60*60*1e3,vD="installations",TD="Installations";/**
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
 */const ED={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Ys=new es(vD,TD,ED);function cS(r){return r instanceof zn&&r.code.includes("request-failed")}/**
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
 */function hS({projectId:r}){return`${_D}/projects/${r}/installations`}function fS(r){return{token:r.token,requestStatus:2,expiresIn:SD(r.expiresIn),creationTime:Date.now()}}async function dS(r,t){const s=(await t.json()).error;return Ys.create("request-failed",{requestName:r,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function mS({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function AD(r,{refreshToken:t}){const n=mS(r);return n.append("Authorization",bD(t)),n}async function pS(r){const t=await r();return t.status>=500&&t.status<600?r():t}function SD(r){return Number(r.replace("s","000"))}function bD(r){return`${uS} ${r}`}/**
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
 */async function RD({appConfig:r,heartbeatServiceProvider:t},{fid:n}){const s=hS(r),o=mS(r),u=t.getImmediate({optional:!0});if(u){const _=await u.getHeartbeatsHeader();_&&o.append("x-firebase-client",_)}const f={fid:n,authVersion:uS,appId:r.appId,sdkVersion:lS},m={method:"POST",headers:o,body:JSON.stringify(f)},g=await pS(()=>fetch(s,m));if(g.ok){const _=await g.json();return{fid:_.fid||n,registrationStatus:2,refreshToken:_.refreshToken,authToken:fS(_.authToken)}}else throw await dS("Create Installation",g)}/**
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
 */function gS(r){return new Promise(t=>{setTimeout(t,r)})}/**
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
 */function ID(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const wD=/^[cdef][\w-]{21}$/,Xm="";function CD(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const n=ND(r);return wD.test(n)?n:Xm}catch{return Xm}}function ND(r){return ID(r).substr(0,22)}/**
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
 */function Gh(r){return`${r.appName}!${r.appId}`}/**
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
 */const _S=new Map;function yS(r,t){const n=Gh(r);vS(n,t),OD(n,t)}function vS(r,t){const n=_S.get(r);if(n)for(const s of n)s(t)}function OD(r,t){const n=DD();n&&n.postMessage({key:r,fid:t}),MD()}let js=null;function DD(){return!js&&"BroadcastChannel"in self&&(js=new BroadcastChannel("[Firebase] FID Change"),js.onmessage=r=>{vS(r.data.key,r.data.fid)}),js}function MD(){_S.size===0&&js&&(js.close(),js=null)}/**
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
 */const VD="firebase-installations-database",PD=1,Qs="firebase-installations-store";let mm=null;function $p(){return mm||(mm=GE(VD,PD,{upgrade:(r,t)=>{switch(t){case 0:r.createObjectStore(Qs)}}})),mm}async function wh(r,t){const n=Gh(r),o=(await $p()).transaction(Qs,"readwrite"),u=o.objectStore(Qs),f=await u.get(n);return await u.put(t,n),await o.done,(!f||f.fid!==t.fid)&&yS(r,t.fid),t}async function TS(r){const t=Gh(r),s=(await $p()).transaction(Qs,"readwrite");await s.objectStore(Qs).delete(t),await s.done}async function Kh(r,t){const n=Gh(r),o=(await $p()).transaction(Qs,"readwrite"),u=o.objectStore(Qs),f=await u.get(n),m=t(f);return m===void 0?await u.delete(n):await u.put(m,n),await o.done,m&&(!f||f.fid!==m.fid)&&yS(r,m.fid),m}/**
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
 */async function Zp(r){let t;const n=await Kh(r.appConfig,s=>{const o=kD(s),u=xD(r,o);return t=u.registrationPromise,u.installationEntry});return n.fid===Xm?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function kD(r){const t=r||{fid:CD(),registrationStatus:0};return ES(t)}function xD(r,t){if(t.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(Ys.create("app-offline"));return{installationEntry:t,registrationPromise:o}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},s=UD(r,n);return{installationEntry:n,registrationPromise:s}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:LD(r)}:{installationEntry:t}}async function UD(r,t){try{const n=await RD(r,t);return wh(r.appConfig,n)}catch(n){throw cS(n)&&n.customData.serverCode===409?await TS(r.appConfig):await wh(r.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function LD(r){let t=await aE(r.appConfig);for(;t.registrationStatus===1;)await gS(100),t=await aE(r.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:s}=await Zp(r);return s||n}return t}function aE(r){return Kh(r,t=>{if(!t)throw Ys.create("installation-not-found");return ES(t)})}function ES(r){return zD(r)?{fid:r.fid,registrationStatus:0}:r}function zD(r){return r.registrationStatus===1&&r.registrationTime+oS<Date.now()}/**
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
 */async function BD({appConfig:r,heartbeatServiceProvider:t},n){const s=jD(r,n),o=AD(r,n),u=t.getImmediate({optional:!0});if(u){const _=await u.getHeartbeatsHeader();_&&o.append("x-firebase-client",_)}const f={installation:{sdkVersion:lS,appId:r.appId}},m={method:"POST",headers:o,body:JSON.stringify(f)},g=await pS(()=>fetch(s,m));if(g.ok){const _=await g.json();return fS(_)}else throw await dS("Generate Auth Token",g)}function jD(r,{fid:t}){return`${hS(r)}/${t}/authTokens:generate`}/**
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
 */async function Wp(r,t=!1){let n;const s=await Kh(r.appConfig,u=>{if(!AS(u))throw Ys.create("not-registered");const f=u.authToken;if(!t&&FD(f))return u;if(f.requestStatus===1)return n=qD(r,t),u;{if(!navigator.onLine)throw Ys.create("app-offline");const m=KD(u);return n=HD(r,m),m}});return n?await n:s.authToken}async function qD(r,t){let n=await oE(r.appConfig);for(;n.authToken.requestStatus===1;)await gS(100),n=await oE(r.appConfig);const s=n.authToken;return s.requestStatus===0?Wp(r,t):s}function oE(r){return Kh(r,t=>{if(!AS(t))throw Ys.create("not-registered");const n=t.authToken;return YD(n)?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}async function HD(r,t){try{const n=await BD(r,t),s=Object.assign(Object.assign({},t),{authToken:n});return await wh(r.appConfig,s),n}catch(n){if(cS(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await TS(r.appConfig);else{const s=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await wh(r.appConfig,s)}throw n}}function AS(r){return r!==void 0&&r.registrationStatus===2}function FD(r){return r.requestStatus===2&&!GD(r)}function GD(r){const t=Date.now();return t<r.creationTime||r.creationTime+r.expiresIn<t+yD}function KD(r){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},r),{authToken:t})}function YD(r){return r.requestStatus===1&&r.requestTime+oS<Date.now()}/**
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
 */async function QD(r){const t=r,{installationEntry:n,registrationPromise:s}=await Zp(t);return s?s.catch(console.error):Wp(t).catch(console.error),n.fid}/**
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
 */async function XD(r,t=!1){const n=r;return await $D(n),(await Wp(n,t)).token}async function $D(r){const{registrationPromise:t}=await Zp(r);t&&await t}/**
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
 */function ZD(r){if(!r||!r.options)throw pm("App Configuration");if(!r.name)throw pm("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!r.options[n])throw pm(n);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function pm(r){return Ys.create("missing-app-config-values",{valueName:r})}/**
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
 */const SS="installations",WD="installations-internal",JD=r=>{const t=r.getProvider("app").getImmediate(),n=ZD(t),s=rr(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},tM=r=>{const t=r.getProvider("app").getImmediate(),n=rr(t,SS).getImmediate();return{getId:()=>QD(n),getToken:o=>XD(n,o)}};function eM(){Ln(new An(SS,JD,"PUBLIC")),Ln(new An(WD,tM,"PRIVATE"))}eM();$e(aS,Xp);$e(aS,Xp,"esm2017");/**
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
 */const Ch="analytics",nM="firebase_id",iM="origin",rM=60*1e3,sM="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Jp="https://www.googletagmanager.com/gtag/js";/**
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
 */const cn=new ru("@firebase/analytics");/**
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
 */const aM={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},En=new es("analytics","Analytics",aM);/**
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
 */function oM(r){if(!r.startsWith(Jp)){const t=En.create("invalid-gtag-resource",{gtagURL:r});return cn.warn(t.message),""}return r}function bS(r){return Promise.all(r.map(t=>t.catch(n=>n)))}function lM(r,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(r,t)),n}function uM(r,t){const n=lM("firebase-js-sdk-policy",{createScriptURL:oM}),s=document.createElement("script"),o=`${Jp}?l=${r}&id=${t}`;s.src=n?n?.createScriptURL(o):o,s.async=!0,document.head.appendChild(s)}function cM(r){let t=[];return Array.isArray(window[r])?t=window[r]:window[r]=t,t}async function hM(r,t,n,s,o,u){const f=s[o];try{if(f)await t[f];else{const g=(await bS(n)).find(_=>_.measurementId===o);g&&await t[g.appId]}}catch(m){cn.error(m)}r("config",o,u)}async function fM(r,t,n,s,o){try{let u=[];if(o&&o.send_to){let f=o.send_to;Array.isArray(f)||(f=[f]);const m=await bS(n);for(const g of f){const _=m.find(S=>S.measurementId===g),T=_&&t[_.appId];if(T)u.push(T);else{u=[];break}}}u.length===0&&(u=Object.values(t)),await Promise.all(u),r("event",s,o||{})}catch(u){cn.error(u)}}function dM(r,t,n,s){async function o(u,...f){try{if(u==="event"){const[m,g]=f;await fM(r,t,n,m,g)}else if(u==="config"){const[m,g]=f;await hM(r,t,n,s,m,g)}else if(u==="consent"){const[m,g]=f;r("consent",m,g)}else if(u==="get"){const[m,g,_]=f;r("get",m,g,_)}else if(u==="set"){const[m]=f;r("set",m)}else r(u,...f)}catch(m){cn.error(m)}}return o}function mM(r,t,n,s,o){let u=function(...f){window[s].push(arguments)};return window[o]&&typeof window[o]=="function"&&(u=window[o]),window[o]=dM(u,r,t,n),{gtagCore:u,wrappedGtag:window[o]}}function pM(r){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(Jp)&&n.src.includes(r))return n;return null}/**
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
 */const gM=30,_M=1e3;class yM{constructor(t={},n=_M){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const RS=new yM;function vM(r){return new Headers({Accept:"application/json","x-goog-api-key":r})}async function TM(r){var t;const{appId:n,apiKey:s}=r,o={method:"GET",headers:vM(s)},u=sM.replace("{app-id}",n),f=await fetch(u,o);if(f.status!==200&&f.status!==304){let m="";try{const g=await f.json();!((t=g.error)===null||t===void 0)&&t.message&&(m=g.error.message)}catch{}throw En.create("config-fetch-failed",{httpStatus:f.status,responseMessage:m})}return f.json()}async function EM(r,t=RS,n){const{appId:s,apiKey:o,measurementId:u}=r.options;if(!s)throw En.create("no-app-id");if(!o){if(u)return{measurementId:u,appId:s};throw En.create("no-api-key")}const f=t.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},m=new bM;return setTimeout(async()=>{m.abort()},rM),IS({appId:s,apiKey:o,measurementId:u},f,m,t)}async function IS(r,{throttleEndTimeMillis:t,backoffCount:n},s,o=RS){var u;const{appId:f,measurementId:m}=r;try{await AM(s,t)}catch(g){if(m)return cn.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${m} provided in the "measurementId" field in the local Firebase config. [${g?.message}]`),{appId:f,measurementId:m};throw g}try{const g=await TM(r);return o.deleteThrottleMetadata(f),g}catch(g){const _=g;if(!SM(_)){if(o.deleteThrottleMetadata(f),m)return cn.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${m} provided in the "measurementId" field in the local Firebase config. [${_?.message}]`),{appId:f,measurementId:m};throw g}const T=Number((u=_?.customData)===null||u===void 0?void 0:u.httpStatus)===503?Vv(n,o.intervalMillis,gM):Vv(n,o.intervalMillis),S={throttleEndTimeMillis:Date.now()+T,backoffCount:n+1};return o.setThrottleMetadata(f,S),cn.debug(`Calling attemptFetch again in ${T} millis`),IS(r,S,s,o)}}function AM(r,t){return new Promise((n,s)=>{const o=Math.max(t-Date.now(),0),u=setTimeout(n,o);r.addEventListener(()=>{clearTimeout(u),s(En.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function SM(r){if(!(r instanceof zn)||!r.customData)return!1;const t=Number(r.customData.httpStatus);return t===429||t===500||t===503||t===504}class bM{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function RM(r,t,n,s,o){if(o&&o.global){r("event",n,s);return}else{const u=await t,f=Object.assign(Object.assign({},s),{send_to:u});r("event",n,f)}}/**
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
 */async function IM(){if(rp())try{await sp()}catch(r){return cn.warn(En.create("indexeddb-unavailable",{errorInfo:r?.toString()}).message),!1}else return cn.warn(En.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function wM(r,t,n,s,o,u,f){var m;const g=EM(r);g.then(z=>{n[z.measurementId]=z.appId,r.options.measurementId&&z.measurementId!==r.options.measurementId&&cn.warn(`The measurement ID in the local Firebase config (${r.options.measurementId}) does not match the measurement ID fetched from the server (${z.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(z=>cn.error(z)),t.push(g);const _=IM().then(z=>{if(z)return s.getId()}),[T,S]=await Promise.all([g,_]);pM(u)||uM(u,T.measurementId),o("js",new Date);const R=(m=f?.config)!==null&&m!==void 0?m:{};return R[iM]="firebase",R.update=!0,S!=null&&(R[nM]=S),o("config",T.measurementId,R),T.measurementId}/**
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
 */class CM{constructor(t){this.app=t}_delete(){return delete jl[this.app.options.appId],Promise.resolve()}}let jl={},lE=[];const uE={};let gm="dataLayer",NM="gtag",cE,wS,hE=!1;function OM(){const r=[];if(jE()&&r.push("This is a browser extension environment."),qE()||r.push("Cookies are not available."),r.length>0){const t=r.map((s,o)=>`(${o+1}) ${s}`).join(" "),n=En.create("invalid-analytics-context",{errorInfo:t});cn.warn(n.message)}}function DM(r,t,n){OM();const s=r.options.appId;if(!s)throw En.create("no-app-id");if(!r.options.apiKey)if(r.options.measurementId)cn.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${r.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw En.create("no-api-key");if(jl[s]!=null)throw En.create("already-exists",{id:s});if(!hE){cM(gm);const{wrappedGtag:u,gtagCore:f}=mM(jl,lE,uE,gm,NM);wS=u,cE=f,hE=!0}return jl[s]=wM(r,lE,uE,t,cE,gm,n),new CM(r)}function MM(r=su()){r=rn(r);const t=rr(r,Ch);return t.isInitialized()?t.getImmediate():VM(r)}function VM(r,t={}){const n=rr(r,Ch);if(n.isInitialized()){const o=n.getImmediate();if(Gr(t,n.getOptions()))return o;throw En.create("already-initialized")}return n.initialize({options:t})}function PM(r,t,n,s){r=rn(r),RM(wS,jl[r.app.options.appId],t,n,s).catch(o=>cn.error(o))}const fE="@firebase/analytics",dE="0.10.16";function kM(){Ln(new An(Ch,(t,{options:n})=>{const s=t.getProvider("app").getImmediate(),o=t.getProvider("installations-internal").getImmediate();return DM(s,o,n)},"PUBLIC")),Ln(new An("analytics-internal",r,"PRIVATE")),$e(fE,dE),$e(fE,dE,"esm2017");function r(t){try{const n=t.getProvider(Ch).getImmediate();return{logEvent:(s,o,u)=>PM(n,s,o,u)}}catch(n){throw En.create("interop-component-reg-failed",{reason:n})}}}kM();var $m,mE,Yh=function(){var r=self.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(r&&r.responseStart>0&&r.responseStart<performance.now())return r},CS=function(r){if(document.readyState==="loading")return"loading";var t=Yh();if(t){if(r<t.domInteractive)return"loading";if(t.domContentLoadedEventStart===0||r<t.domContentLoadedEventStart)return"dom-interactive";if(t.domComplete===0||r<t.domComplete)return"dom-content-loaded"}return"complete"},xM=function(r){var t=r.nodeName;return r.nodeType===1?t.toLowerCase():t.toUpperCase().replace(/^#/,"")},tg=function(r,t){var n="";try{for(;r&&r.nodeType!==9;){var s=r,o=s.id?"#"+s.id:xM(s)+(s.classList&&s.classList.value&&s.classList.value.trim()&&s.classList.value.trim().length?"."+s.classList.value.trim().replace(/\s+/g,"."):"");if(n.length+o.length>(t||100)-1)return n||o;if(n=n?o+">"+n:o,s.id)break;r=s.parentNode}}catch{}return n},NS=-1,UM=function(){return NS},du=function(r){addEventListener("pageshow",function(t){t.persisted&&(NS=t.timeStamp,r(t))},!0)},eg=function(){var r=Yh();return r&&r.activationStart||0},Wr=function(r,t){var n=Yh(),s="navigate";return UM()>=0?s="back-forward-cache":n&&(document.prerendering||eg()>0?s="prerender":document.wasDiscarded?s="restore":n.type&&(s=n.type.replace(/_/g,"-"))),{name:r,value:t===void 0?-1:t,rating:"good",delta:0,entries:[],id:"v4-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:s}},vo=function(r,t,n){try{if(PerformanceObserver.supportedEntryTypes.includes(r)){var s=new PerformanceObserver(function(o){Promise.resolve().then(function(){t(o.getEntries())})});return s.observe(Object.assign({type:r,buffered:!0},n||{})),s}}catch{}},Jr=function(r,t,n,s){var o,u;return function(f){t.value>=0&&(f||s)&&((u=t.value-(o||0))||o===void 0)&&(o=t.value,t.delta=u,t.rating=function(m,g){return m>g[1]?"poor":m>g[0]?"needs-improvement":"good"}(t.value,n),r(t))}},ng=function(r){requestAnimationFrame(function(){return requestAnimationFrame(function(){return r()})})},Qh=function(r){document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"&&r()})},ig=function(r){var t=!1;return function(){t||(r(),t=!0)}},Wa=-1,pE=function(){return document.visibilityState!=="hidden"||document.prerendering?1/0:0},Nh=function(r){document.visibilityState==="hidden"&&Wa>-1&&(Wa=r.type==="visibilitychange"?r.timeStamp:0,LM())},gE=function(){addEventListener("visibilitychange",Nh,!0),addEventListener("prerenderingchange",Nh,!0)},LM=function(){removeEventListener("visibilitychange",Nh,!0),removeEventListener("prerenderingchange",Nh,!0)},OS=function(){return Wa<0&&(Wa=pE(),gE(),du(function(){setTimeout(function(){Wa=pE(),gE()},0)})),{get firstHiddenTime(){return Wa}}},rg=function(r){document.prerendering?addEventListener("prerenderingchange",function(){return r()},!0):r()},_E=[1800,3e3],zM=function(r,t){t=t||{},rg(function(){var n,s=OS(),o=Wr("FCP"),u=vo("paint",function(f){f.forEach(function(m){m.name==="first-contentful-paint"&&(u.disconnect(),m.startTime<s.firstHiddenTime&&(o.value=Math.max(m.startTime-eg(),0),o.entries.push(m),n(!0)))})});u&&(n=Jr(r,o,_E,t.reportAllChanges),du(function(f){o=Wr("FCP"),n=Jr(r,o,_E,t.reportAllChanges),ng(function(){o.value=performance.now()-f.timeStamp,n(!0)})}))})},yE=[.1,.25],BM=function(r,t){(function(n,s){s=s||{},zM(ig(function(){var o,u=Wr("CLS",0),f=0,m=[],g=function(T){T.forEach(function(S){if(!S.hadRecentInput){var R=m[0],z=m[m.length-1];f&&S.startTime-z.startTime<1e3&&S.startTime-R.startTime<5e3?(f+=S.value,m.push(S)):(f=S.value,m=[S])}}),f>u.value&&(u.value=f,u.entries=m,o())},_=vo("layout-shift",g);_&&(o=Jr(n,u,yE,s.reportAllChanges),Qh(function(){g(_.takeRecords()),o(!0)}),du(function(){f=0,u=Wr("CLS",0),o=Jr(n,u,yE,s.reportAllChanges),ng(function(){return o()})}),setTimeout(o,0))}))})(function(n){var s=function(o){var u,f={};if(o.entries.length){var m=o.entries.reduce(function(_,T){return _&&_.value>T.value?_:T});if(m&&m.sources&&m.sources.length){var g=(u=m.sources).find(function(_){return _.node&&_.node.nodeType===1})||u[0];g&&(f={largestShiftTarget:tg(g.node),largestShiftTime:m.startTime,largestShiftValue:m.value,largestShiftSource:g,largestShiftEntry:m,loadState:CS(m.startTime)})}}return Object.assign(o,{attribution:f})}(n);r(s)},t)},DS=0,_m=1/0,Kc=0,jM=function(r){r.forEach(function(t){t.interactionId&&(_m=Math.min(_m,t.interactionId),Kc=Math.max(Kc,t.interactionId),DS=Kc?(Kc-_m)/7+1:0)})},MS=function(){return $m?DS:performance.interactionCount||0},qM=function(){"interactionCount"in performance||$m||($m=vo("event",jM,{type:"event",buffered:!0,durationThreshold:0}))},Yn=[],ql=new Map,VS=0,HM=function(){var r=Math.min(Yn.length-1,Math.floor((MS()-VS)/50));return Yn[r]},PS=[],FM=function(r){if(PS.forEach(function(o){return o(r)}),r.interactionId||r.entryType==="first-input"){var t=Yn[Yn.length-1],n=ql.get(r.interactionId);if(n||Yn.length<10||r.duration>t.latency){if(n)r.duration>n.latency?(n.entries=[r],n.latency=r.duration):r.duration===n.latency&&r.startTime===n.entries[0].startTime&&n.entries.push(r);else{var s={id:r.interactionId,latency:r.duration,entries:[r]};ql.set(s.id,s),Yn.push(s)}Yn.sort(function(o,u){return u.latency-o.latency}),Yn.length>10&&Yn.splice(10).forEach(function(o){return ql.delete(o.id)})}}},sg=function(r){var t=self.requestIdleCallback||self.setTimeout,n=-1;return r=ig(r),document.visibilityState==="hidden"?r():(n=t(r),Qh(r)),n},vE=[200,500],GM=function(r,t){"PerformanceEventTiming"in self&&"interactionId"in PerformanceEventTiming.prototype&&(t=t||{},rg(function(){var n;qM();var s,o=Wr("INP"),u=function(m){sg(function(){m.forEach(FM);var g=HM();g&&g.latency!==o.value&&(o.value=g.latency,o.entries=g.entries,s())})},f=vo("event",u,{durationThreshold:(n=t.durationThreshold)!==null&&n!==void 0?n:40});s=Jr(r,o,vE,t.reportAllChanges),f&&(f.observe({type:"first-input",buffered:!0}),Qh(function(){u(f.takeRecords()),s(!0)}),du(function(){VS=MS(),Yn.length=0,ql.clear(),o=Wr("INP"),s=Jr(r,o,vE,t.reportAllChanges)}))}))},io=[],zr=[],Zm=0,ag=new WeakMap,ro=new Map,Wm=-1,KM=function(r){io=io.concat(r),kS()},kS=function(){Wm<0&&(Wm=sg(YM))},YM=function(){ro.size>10&&ro.forEach(function(f,m){ql.has(m)||ro.delete(m)});var r=Yn.map(function(f){return ag.get(f.entries[0])}),t=zr.length-50;zr=zr.filter(function(f,m){return m>=t||r.includes(f)});for(var n=new Set,s=0;s<zr.length;s++){var o=zr[s];xS(o.startTime,o.processingEnd).forEach(function(f){n.add(f)})}var u=io.length-1-50;io=io.filter(function(f,m){return f.startTime>Zm&&m>u||n.has(f)}),Wm=-1};PS.push(function(r){r.interactionId&&r.target&&!ro.has(r.interactionId)&&ro.set(r.interactionId,r.target)},function(r){var t,n=r.startTime+r.duration;Zm=Math.max(Zm,r.processingEnd);for(var s=zr.length-1;s>=0;s--){var o=zr[s];if(Math.abs(n-o.renderTime)<=8){(t=o).startTime=Math.min(r.startTime,t.startTime),t.processingStart=Math.min(r.processingStart,t.processingStart),t.processingEnd=Math.max(r.processingEnd,t.processingEnd),t.entries.push(r);break}}t||(t={startTime:r.startTime,processingStart:r.processingStart,processingEnd:r.processingEnd,renderTime:n,entries:[r]},zr.push(t)),(r.interactionId||r.entryType==="first-input")&&ag.set(r,t),kS()});var xS=function(r,t){for(var n,s=[],o=0;n=io[o];o++)if(!(n.startTime+n.duration<r)){if(n.startTime>t)break;s.push(n)}return s},QM=function(r,t){mE||(mE=vo("long-animation-frame",KM)),GM(function(n){var s=function(o){var u=o.entries[0],f=ag.get(u),m=u.processingStart,g=f.processingEnd,_=f.entries.sort(function(Y,gt){return Y.processingStart-gt.processingStart}),T=xS(u.startTime,g),S=o.entries.find(function(Y){return Y.target}),R=S&&S.target||ro.get(u.interactionId),z=[u.startTime+u.duration,g].concat(T.map(function(Y){return Y.startTime+Y.duration})),X=Math.max.apply(Math,z),tt={interactionTarget:tg(R),interactionTargetElement:R,interactionType:u.name.startsWith("key")?"keyboard":"pointer",interactionTime:u.startTime,nextPaintTime:X,processedEventEntries:_,longAnimationFrameEntries:T,inputDelay:m-u.startTime,processingDuration:g-m,presentationDelay:Math.max(X-g,0),loadState:CS(u.startTime)};return Object.assign(o,{attribution:tt})}(n);r(s)},t)},TE=[2500,4e3],ym={},XM=function(r,t){(function(n,s){s=s||{},rg(function(){var o,u=OS(),f=Wr("LCP"),m=function(T){s.reportAllChanges||(T=T.slice(-1)),T.forEach(function(S){S.startTime<u.firstHiddenTime&&(f.value=Math.max(S.startTime-eg(),0),f.entries=[S],o())})},g=vo("largest-contentful-paint",m);if(g){o=Jr(n,f,TE,s.reportAllChanges);var _=ig(function(){ym[f.id]||(m(g.takeRecords()),g.disconnect(),ym[f.id]=!0,o(!0))});["keydown","click"].forEach(function(T){addEventListener(T,function(){return sg(_)},{once:!0,capture:!0})}),Qh(_),du(function(T){f=Wr("LCP"),o=Jr(n,f,TE,s.reportAllChanges),ng(function(){f.value=performance.now()-T.timeStamp,ym[f.id]=!0,o(!0)})})}})})(function(n){var s=function(o){var u={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadDuration:0,elementRenderDelay:o.value};if(o.entries.length){var f=Yh();if(f){var m=f.activationStart||0,g=o.entries[o.entries.length-1],_=g.url&&performance.getEntriesByType("resource").filter(function(X){return X.name===g.url})[0],T=Math.max(0,f.responseStart-m),S=Math.max(T,_?(_.requestStart||_.startTime)-m:0),R=Math.max(S,_?_.responseEnd-m:0),z=Math.max(R,g.startTime-m);u={element:tg(g.element),timeToFirstByte:T,resourceLoadDelay:S-T,resourceLoadDuration:R-S,elementRenderDelay:z-R,navigationEntry:f,lcpEntry:g},g.url&&(u.url=g.url),_&&(u.lcpResourceEntry=_)}}return Object.assign(o,{attribution:u})}(n);r(s)},t)};const EE="@firebase/performance",Jm="0.7.6";/**
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
 */const US=Jm,$M="FB-PERF-TRACE-START",ZM="FB-PERF-TRACE-STOP",tp="FB-PERF-TRACE-MEASURE",LS="_wt_",zS="_fp",BS="_fcp",jS="_fid",qS="_lcp",WM="lcp_element",HS="_inp",JM="inp_interactionTarget",FS="_cls",tV="cls_largestShiftTarget",GS="@firebase/performance/config",KS="@firebase/performance/configexpire",eV="performance",YS="Performance";/**
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
 */const nV={"trace started":"Trace {$traceName} was started before.","trace stopped":"Trace {$traceName} is not running.","nonpositive trace startTime":"Trace {$traceName} startTime should be positive.","nonpositive trace duration":"Trace {$traceName} duration should be positive.","no window":"Window is not available.","no app id":"App id is not available.","no project id":"Project id is not available.","no api key":"Api key is not available.","invalid cc log":"Attempted to queue invalid cc event","FB not default":"Performance can only start when Firebase app instance is the default one.","RC response not ok":"RC response is not ok","invalid attribute name":"Attribute name {$attributeName} is invalid.","invalid attribute value":"Attribute value {$attributeValue} is invalid.","invalid custom metric name":"Custom metric name {$customMetricName} is invalid","invalid String merger input":"Input for String merger is invalid, contact support team to resolve.","already initialized":"initializePerformance() has already been called with different options. To avoid this error, call initializePerformance() with the same options as when it was originally called, or call getPerformance() to return the already initialized instance."},Qe=new es(eV,YS,nV);/**
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
 */const ts=new ru(YS);ts.logLevel=Mt.INFO;/**
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
 */let vm,QS;class Ie{constructor(t){if(this.window=t,!t)throw Qe.create("no window");this.performance=t.performance,this.PerformanceObserver=t.PerformanceObserver,this.windowLocation=t.location,this.navigator=t.navigator,this.document=t.document,this.navigator&&this.navigator.cookieEnabled&&(this.localStorage=t.localStorage),t.perfMetrics&&t.perfMetrics.onFirstInputDelay&&(this.onFirstInputDelay=t.perfMetrics.onFirstInputDelay),this.onLCP=XM,this.onINP=QM,this.onCLS=BM}getUrl(){return this.windowLocation.href.split("?")[0]}mark(t){!this.performance||!this.performance.mark||this.performance.mark(t)}measure(t,n,s){!this.performance||!this.performance.measure||this.performance.measure(t,n,s)}getEntriesByType(t){return!this.performance||!this.performance.getEntriesByType?[]:this.performance.getEntriesByType(t)}getEntriesByName(t){return!this.performance||!this.performance.getEntriesByName?[]:this.performance.getEntriesByName(t)}getTimeOrigin(){return this.performance&&(this.performance.timeOrigin||this.performance.timing.navigationStart)}requiredApisAvailable(){return!fetch||!Promise||!qE()?(ts.info("Firebase Performance cannot start if browser does not support fetch and Promise or cookie is disabled."),!1):rp()?!0:(ts.info("IndexedDB is not supported by current browser"),!1)}setupObserver(t,n){if(!this.PerformanceObserver)return;new this.PerformanceObserver(o=>{for(const u of o.getEntries())n(u)}).observe({entryTypes:[t]})}static getInstance(){return vm===void 0&&(vm=new Ie(QS)),vm}}function iV(r){QS=r}/**
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
 */let XS;function rV(r){const t=r.getId();return t.then(n=>{XS=n}),t}function og(){return XS}function sV(r){const t=r.getToken();return t.then(n=>{}),t}/**
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
 */function AE(r,t){const n=r.length-t.length;if(n<0||n>1)throw Qe.create("invalid String merger input");const s=[];for(let o=0;o<r.length;o++)s.push(r.charAt(o)),t.length>o&&s.push(t.charAt(o));return s.join("")}/**
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
 */let Tm;class Tn{constructor(){this.instrumentationEnabled=!0,this.dataCollectionEnabled=!0,this.loggingEnabled=!1,this.tracesSamplingRate=1,this.networkRequestsSamplingRate=1,this.logEndPointUrl="https://firebaselogging.googleapis.com/v0cc/log?format=json_proto",this.flTransportEndpointUrl=AE("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),this.transportKey=AE("AzSC8r6ReiGqFMyfvgow","Iayx0u-XT3vksVM-pIV"),this.logSource=462,this.logTraceAfterSampling=!1,this.logNetworkAfterSampling=!1,this.configTimeToLive=12}getFlTransportFullUrl(){return this.flTransportEndpointUrl.concat("?key=",this.transportKey)}static getInstance(){return Tm===void 0&&(Tm=new Tn),Tm}}/**
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
 */var Hl;(function(r){r[r.UNKNOWN=0]="UNKNOWN",r[r.VISIBLE=1]="VISIBLE",r[r.HIDDEN=2]="HIDDEN"})(Hl||(Hl={}));const aV=["firebase_","google_","ga_"],oV=new RegExp("^[a-zA-Z]\\w*$"),lV=40,uV=100;function cV(){const r=Ie.getInstance().navigator;return r?.serviceWorker?r.serviceWorker.controller?2:3:1}function hV(){switch(Ie.getInstance().document.visibilityState){case"visible":return Hl.VISIBLE;case"hidden":return Hl.HIDDEN;default:return Hl.UNKNOWN}}function fV(){const t=Ie.getInstance().navigator.connection;switch(t&&t.effectiveType){case"slow-2g":return 1;case"2g":return 2;case"3g":return 3;case"4g":return 4;default:return 0}}function dV(r){return r.length===0||r.length>lV?!1:!aV.some(n=>r.startsWith(n))&&!!r.match(oV)}function mV(r){return r.length!==0&&r.length<=uV}/**
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
 */function $S(r){var t;const n=(t=r.options)===null||t===void 0?void 0:t.appId;if(!n)throw Qe.create("no app id");return n}function pV(r){var t;const n=(t=r.options)===null||t===void 0?void 0:t.projectId;if(!n)throw Qe.create("no project id");return n}function gV(r){var t;const n=(t=r.options)===null||t===void 0?void 0:t.apiKey;if(!n)throw Qe.create("no api key");return n}/**
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
 */const _V="0.0.1",Kn={loggingEnabled:!0},yV="FIREBASE_INSTALLATIONS_AUTH";function vV(r,t){const n=TV();return n?(SE(n),Promise.resolve()):SV(r,t).then(SE).then(s=>EV(s),()=>{})}function TV(){const r=Ie.getInstance().localStorage;if(!r)return;const t=r.getItem(KS);if(!t||!bV(t))return;const n=r.getItem(GS);if(n)try{return JSON.parse(n)}catch{return}}function EV(r){const t=Ie.getInstance().localStorage;!r||!t||(t.setItem(GS,JSON.stringify(r)),t.setItem(KS,String(Date.now()+Tn.getInstance().configTimeToLive*60*60*1e3)))}const AV="Could not fetch config, will use default configs";function SV(r,t){return sV(r.installations).then(n=>{const s=pV(r.app),o=gV(r.app),u=`https://firebaseremoteconfig.googleapis.com/v1/projects/${s}/namespaces/fireperf:fetch?key=${o}`,f=new Request(u,{method:"POST",headers:{Authorization:`${yV} ${n}`},body:JSON.stringify({app_instance_id:t,app_instance_id_token:n,app_id:$S(r.app),app_version:US,sdk_version:_V})});return fetch(f).then(m=>{if(m.ok)return m.json();throw Qe.create("RC response not ok")})}).catch(()=>{ts.info(AV)})}function SE(r){if(!r)return r;const t=Tn.getInstance(),n=r.entries||{};return n.fpr_enabled!==void 0?t.loggingEnabled=String(n.fpr_enabled)==="true":t.loggingEnabled=Kn.loggingEnabled,n.fpr_log_source?t.logSource=Number(n.fpr_log_source):Kn.logSource&&(t.logSource=Kn.logSource),n.fpr_log_endpoint_url?t.logEndPointUrl=n.fpr_log_endpoint_url:Kn.logEndPointUrl&&(t.logEndPointUrl=Kn.logEndPointUrl),n.fpr_log_transport_key?t.transportKey=n.fpr_log_transport_key:Kn.transportKey&&(t.transportKey=Kn.transportKey),n.fpr_vc_network_request_sampling_rate!==void 0?t.networkRequestsSamplingRate=Number(n.fpr_vc_network_request_sampling_rate):Kn.networkRequestsSamplingRate!==void 0&&(t.networkRequestsSamplingRate=Kn.networkRequestsSamplingRate),n.fpr_vc_trace_sampling_rate!==void 0?t.tracesSamplingRate=Number(n.fpr_vc_trace_sampling_rate):Kn.tracesSamplingRate!==void 0&&(t.tracesSamplingRate=Kn.tracesSamplingRate),t.logTraceAfterSampling=bE(t.tracesSamplingRate),t.logNetworkAfterSampling=bE(t.networkRequestsSamplingRate),r}function bV(r){return Number(r)>Date.now()}function bE(r){return Math.random()<=r}/**
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
 */let lg=1,Em;function ZS(r){return lg=2,Em=Em||IV(r),Em}function RV(){return lg===3}function IV(r){return wV().then(()=>rV(r.installations)).then(t=>vV(r,t)).then(()=>RE(),()=>RE())}function wV(){const r=Ie.getInstance().document;return new Promise(t=>{if(r&&r.readyState!=="complete"){const n=()=>{r.readyState==="complete"&&(r.removeEventListener("readystatechange",n),t())};r.addEventListener("readystatechange",n)}else t()})}function RE(){lg=3}/**
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
 */const WS=10*1e3,CV=5.5*1e3,NV=1e3,JS=3;let ih=JS,Hs=[],IE=!1;function OV(){IE||(ug(CV),IE=!0)}function ug(r){setTimeout(()=>{ih<=0||(Hs.length>0&&tb(),ug(WS))},r)}function tb(){const r=Hs.splice(0,NV),t=r.map(s=>({source_extension_json_proto3:s.message,event_time_ms:String(s.eventTime)})),n={request_time_ms:String(Date.now()),client_info:{client_type:1,js_client_info:{}},log_source:Tn.getInstance().logSource,log_event:t};DV(n).then(()=>{ih=JS}).catch(()=>{Hs=[...r,...Hs],ih--,ts.info(`Tries left: ${ih}.`),ug(WS)})}function DV(r){const t=Tn.getInstance().getFlTransportFullUrl(),n=JSON.stringify(r);return navigator.sendBeacon&&navigator.sendBeacon(t,n)?Promise.resolve():fetch(t,{method:"POST",body:n,keepalive:!0}).then()}function MV(r){if(!r.eventTime||!r.message)throw Qe.create("invalid cc log");Hs=[...Hs,r]}function VV(r){return(...t)=>{const n=r(...t);MV({message:n,eventTime:Date.now()})}}function PV(){for(;Hs.length>0;)tb()}/**
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
 */let Fl;function eb(r,t){Fl||(Fl={send:VV(UV),flush:PV}),Fl.send(r,t)}function Yc(r){const t=Tn.getInstance();!t.instrumentationEnabled&&r.isAuto||!t.dataCollectionEnabled&&!r.isAuto||Ie.getInstance().requiredApisAvailable()&&(RV()?Am(r):ZS(r.performanceController).then(()=>Am(r),()=>Am(r)))}function kV(){Fl&&Fl.flush()}function Am(r){if(!og())return;const t=Tn.getInstance();!t.loggingEnabled||!t.logTraceAfterSampling||eb(r,1)}function xV(r){const t=Tn.getInstance();if(!t.instrumentationEnabled)return;const n=r.url,s=t.logEndPointUrl.split("?")[0],o=t.flTransportEndpointUrl.split("?")[0];n===s||n===o||!t.loggingEnabled||!t.logNetworkAfterSampling||eb(r,0)}function UV(r,t){return t===0?LV(r):zV(r)}function LV(r){const t={url:r.url,http_method:r.httpMethod||0,http_response_code:200,response_payload_bytes:r.responsePayloadBytes,client_start_time_us:r.startTimeUs,time_to_response_initiated_us:r.timeToResponseInitiatedUs,time_to_response_completed_us:r.timeToResponseCompletedUs},n={application_info:nb(r.performanceController.app),network_request_metric:t};return JSON.stringify(n)}function zV(r){const t={name:r.name,is_auto:r.isAuto,client_start_time_us:r.startTimeUs,duration_us:r.durationUs};Object.keys(r.counters).length!==0&&(t.counters=r.counters);const n=r.getAttributes();Object.keys(n).length!==0&&(t.custom_attributes=n);const s={application_info:nb(r.performanceController.app),trace_metric:t};return JSON.stringify(s)}function nb(r){return{google_app_id:$S(r),app_instance_id:og(),web_app_info:{sdk_version:US,page_url:Ie.getInstance().getUrl(),service_worker_status:cV(),visibility_state:hV(),effective_connection_type:fV()},application_process_state:0}}/**
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
 */function wE(r,t){const n=t;if(!n||n.responseStart===void 0)return;const s=Ie.getInstance().getTimeOrigin(),o=Math.floor((n.startTime+s)*1e3),u=n.responseStart?Math.floor((n.responseStart-n.startTime)*1e3):void 0,f=Math.floor((n.responseEnd-n.startTime)*1e3),m=n.name&&n.name.split("?")[0],g={performanceController:r,url:m,responsePayloadBytes:n.transferSize,startTimeUs:o,timeToResponseInitiatedUs:u,timeToResponseCompletedUs:f};xV(g)}/**
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
 */const BV=100,jV="_",qV=[zS,BS,jS,qS,FS,HS];function HV(r,t){return r.length===0||r.length>BV?!1:t&&t.startsWith(LS)&&qV.indexOf(r)>-1||!r.startsWith(jV)}function FV(r){const t=Math.floor(r);return t<r&&ts.info(`Metric value should be an Integer, setting the value as : ${t}.`),t}/**
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
 */class nu{constructor(t,n,s=!1,o){this.performanceController=t,this.name=n,this.isAuto=s,this.state=1,this.customAttributes={},this.counters={},this.api=Ie.getInstance(),this.randomId=Math.floor(Math.random()*1e6),this.isAuto||(this.traceStartMark=`${$M}-${this.randomId}-${this.name}`,this.traceStopMark=`${ZM}-${this.randomId}-${this.name}`,this.traceMeasure=o||`${tp}-${this.randomId}-${this.name}`,o&&this.calculateTraceMetrics())}start(){if(this.state!==1)throw Qe.create("trace started",{traceName:this.name});this.api.mark(this.traceStartMark),this.state=2}stop(){if(this.state!==2)throw Qe.create("trace stopped",{traceName:this.name});this.state=3,this.api.mark(this.traceStopMark),this.api.measure(this.traceMeasure,this.traceStartMark,this.traceStopMark),this.calculateTraceMetrics(),Yc(this)}record(t,n,s){if(t<=0)throw Qe.create("nonpositive trace startTime",{traceName:this.name});if(n<=0)throw Qe.create("nonpositive trace duration",{traceName:this.name});if(this.durationUs=Math.floor(n*1e3),this.startTimeUs=Math.floor(t*1e3),s&&s.attributes&&(this.customAttributes=Object.assign({},s.attributes)),s&&s.metrics)for(const o of Object.keys(s.metrics))isNaN(Number(s.metrics[o]))||(this.counters[o]=Math.floor(Number(s.metrics[o])));Yc(this)}incrementMetric(t,n=1){this.counters[t]===void 0?this.putMetric(t,n):this.putMetric(t,this.counters[t]+n)}putMetric(t,n){if(HV(t,this.name))this.counters[t]=FV(n??0);else throw Qe.create("invalid custom metric name",{customMetricName:t})}getMetric(t){return this.counters[t]||0}putAttribute(t,n){const s=dV(t),o=mV(n);if(s&&o){this.customAttributes[t]=n;return}if(!s)throw Qe.create("invalid attribute name",{attributeName:t});if(!o)throw Qe.create("invalid attribute value",{attributeValue:n})}getAttribute(t){return this.customAttributes[t]}removeAttribute(t){this.customAttributes[t]!==void 0&&delete this.customAttributes[t]}getAttributes(){return Object.assign({},this.customAttributes)}setStartTime(t){this.startTimeUs=t}setDuration(t){this.durationUs=t}calculateTraceMetrics(){const t=this.api.getEntriesByName(this.traceMeasure),n=t&&t[0];n&&(this.durationUs=Math.floor(n.duration*1e3),this.startTimeUs=Math.floor((n.startTime+this.api.getTimeOrigin())*1e3))}static createOobTrace(t,n,s,o,u){const f=Ie.getInstance().getUrl();if(!f)return;const m=new nu(t,LS+f,!0),g=Math.floor(Ie.getInstance().getTimeOrigin()*1e3);m.setStartTime(g),n&&n[0]&&(m.setDuration(Math.floor(n[0].duration*1e3)),m.putMetric("domInteractive",Math.floor(n[0].domInteractive*1e3)),m.putMetric("domContentLoadedEventEnd",Math.floor(n[0].domContentLoadedEventEnd*1e3)),m.putMetric("loadEventEnd",Math.floor(n[0].loadEventEnd*1e3)));const _="first-paint",T="first-contentful-paint";if(s){const S=s.find(z=>z.name===_);S&&S.startTime&&m.putMetric(zS,Math.floor(S.startTime*1e3));const R=s.find(z=>z.name===T);R&&R.startTime&&m.putMetric(BS,Math.floor(R.startTime*1e3)),u&&m.putMetric(jS,Math.floor(u*1e3))}this.addWebVitalMetric(m,qS,WM,o.lcp),this.addWebVitalMetric(m,FS,tV,o.cls),this.addWebVitalMetric(m,HS,JM,o.inp),Yc(m),kV()}static addWebVitalMetric(t,n,s,o){o&&(t.putMetric(n,Math.floor(o.value*1e3)),o.elementAttribution&&t.putAttribute(s,o.elementAttribution))}static createUserTimingTrace(t,n){const s=new nu(t,n,!1,n);Yc(s)}}/**
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
 */let rh={},CE=!1,ib;function NE(r){og()&&(setTimeout(()=>KV(r),0),setTimeout(()=>GV(r),0),setTimeout(()=>YV(r),0))}function GV(r){const t=Ie.getInstance(),n=t.getEntriesByType("resource");for(const s of n)wE(r,s);t.setupObserver("resource",s=>wE(r,s))}function KV(r){const t=Ie.getInstance();"onpagehide"in window?t.document.addEventListener("pagehide",()=>Sm(r)):t.document.addEventListener("unload",()=>Sm(r)),t.document.addEventListener("visibilitychange",()=>{t.document.visibilityState==="hidden"&&Sm(r)}),t.onFirstInputDelay&&t.onFirstInputDelay(n=>{ib=n}),t.onLCP(n=>{var s;rh.lcp={value:n.value,elementAttribution:(s=n.attribution)===null||s===void 0?void 0:s.element}}),t.onCLS(n=>{var s;rh.cls={value:n.value,elementAttribution:(s=n.attribution)===null||s===void 0?void 0:s.largestShiftTarget}}),t.onINP(n=>{var s;rh.inp={value:n.value,elementAttribution:(s=n.attribution)===null||s===void 0?void 0:s.interactionTarget}})}function YV(r){const t=Ie.getInstance(),n=t.getEntriesByType("measure");for(const s of n)OE(r,s);t.setupObserver("measure",s=>OE(r,s))}function OE(r,t){const n=t.name;n.substring(0,tp.length)!==tp&&nu.createUserTimingTrace(r,n)}function Sm(r){if(!CE){CE=!0;const t=Ie.getInstance(),n=t.getEntriesByType("navigation"),s=t.getEntriesByType("paint");setTimeout(()=>{nu.createOobTrace(r,n,s,rh,ib)},0)}}/**
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
 */class QV{constructor(t,n){this.app=t,this.installations=n,this.initialized=!1}_init(t){this.initialized||(t?.dataCollectionEnabled!==void 0&&(this.dataCollectionEnabled=t.dataCollectionEnabled),t?.instrumentationEnabled!==void 0&&(this.instrumentationEnabled=t.instrumentationEnabled),Ie.getInstance().requiredApisAvailable()?sp().then(n=>{n&&(OV(),ZS(this).then(()=>NE(this),()=>NE(this)),this.initialized=!0)}).catch(n=>{ts.info(`Environment doesn't support IndexedDB: ${n}`)}):ts.info('Firebase Performance cannot start if the browser does not support "Fetch" and "Promise", or cookies are disabled.'))}set instrumentationEnabled(t){Tn.getInstance().instrumentationEnabled=t}get instrumentationEnabled(){return Tn.getInstance().instrumentationEnabled}set dataCollectionEnabled(t){Tn.getInstance().dataCollectionEnabled=t}get dataCollectionEnabled(){return Tn.getInstance().dataCollectionEnabled}}const XV="[DEFAULT]";function $V(r=su()){return r=rn(r),rr(r,"performance").getImmediate()}const ZV=(r,{options:t})=>{const n=r.getProvider("app").getImmediate(),s=r.getProvider("installations-internal").getImmediate();if(n.name!==XV)throw Qe.create("FB not default");if(typeof window>"u")throw Qe.create("no window");iV(window);const o=new QV(n,s);return o._init(t),o};function WV(){Ln(new An("performance",ZV,"PUBLIC")),$e(EE,Jm),$e(EE,Jm,"esm2017")}WV();const JV={apiKey:"AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",authDomain:"liquidacionapp-62962.firebaseapp.com",projectId:"liquidacionapp-62962",storageBucket:"liquidacionapp-62962.firebasestorage.app",messagingSenderId:"851382130132",appId:"1:851382130132:web:eaba38fab449f14fb5b241"},mu=KE(JV);typeof window<"u"&&MM(mu);typeof window<"u"&&$V(mu);const t4=vC(mu),rb=SO(mu);dD(mu);const Gl={ADMIN:"admin",CONTADOR:"contador",CLIENTE:"cliente"},ee={MANAGE_INVENTORY:"canManageInventory",CREATE_MOVEMENTS:"canCreateMovements",VIEW_ALL_MOVEMENTS:"canViewAllMovements",MANAGE_VEHICLES:"canManageVehicles",MANAGE_SUPPLIERS:"canManageSuppliers",VIEW_REPORTS:"canViewReports",EXPORT_REPORTS:"canExportReports",MODIFY_SETTINGS:"canModifySettings"},e4="contacto.evert@gmail.com",n4=r=>{switch(r){case Gl.ADMIN:return{[ee.MANAGE_INVENTORY]:!0,[ee.CREATE_MOVEMENTS]:!0,[ee.VIEW_ALL_MOVEMENTS]:!0,[ee.MANAGE_VEHICLES]:!0,[ee.MANAGE_SUPPLIERS]:!0,[ee.VIEW_REPORTS]:!0,[ee.EXPORT_REPORTS]:!0,[ee.MODIFY_SETTINGS]:!0};case Gl.CONTADOR:return{[ee.MANAGE_INVENTORY]:!0,[ee.CREATE_MOVEMENTS]:!0,[ee.VIEW_ALL_MOVEMENTS]:!0,[ee.MANAGE_VEHICLES]:!1,[ee.MANAGE_SUPPLIERS]:!1,[ee.VIEW_REPORTS]:!0,[ee.EXPORT_REPORTS]:!0,[ee.MODIFY_SETTINGS]:!1};case Gl.CLIENTE:default:return{[ee.MANAGE_INVENTORY]:!1,[ee.CREATE_MOVEMENTS]:!0,[ee.VIEW_ALL_MOVEMENTS]:!1,[ee.MANAGE_VEHICLES]:!1,[ee.MANAGE_SUPPLIERS]:!1,[ee.VIEW_REPORTS]:!1,[ee.EXPORT_REPORTS]:!1,[ee.MODIFY_SETTINGS]:!1}}},i4=r=>r===e4?Gl.ADMIN:Gl.CLIENTE,r4=async(r,t={})=>{const n=FA(rb,"artifacts/1:851382130132:web:eaba38fab449f14fb5b241/users",r.uid);try{const s=await nS(n);if(s.exists())return{success:!0,userData:s.data(),isNewUser:!1};{const o=i4(r.email),u={uid:r.uid,email:r.email,displayName:r.displayName||"",photoURL:r.photoURL||"",role:o,emailVerified:r.emailVerified,combustiblesPermissions:n4(o),createdAt:new Date().toISOString(),lastLogin:new Date().toISOString(),...t};return await zO(n,u),{success:!0,userData:u,isNewUser:!0}}}catch(s){return console.error("Error creating/updating user profile:",s),{success:!1,error:s.message}}},s4=async r=>{try{const t=FA(rb,"artifacts/1:851382130132:web:eaba38fab449f14fb5b241/users",r),n=await nS(t);return n.exists()?{success:!0,userData:n.data()}:{success:!1,error:"Usuario no encontrado"}}catch(t){return console.error("Error fetching user profile:",t),{success:!1,error:t.message}}},sb=ln.createContext(),ab=()=>{const r=ln.useContext(sb);if(r===void 0)throw new Error("useCombustibles must be used within a CombustiblesProvider");return r},a4=({children:r})=>{const[t,n]=ln.useState(null),[s,o]=ln.useState(null),[u,f]=ln.useState(!0),[m,g]=ln.useState(null),[_,T]=ln.useState([]),[S,R]=ln.useState([]),[z,X]=ln.useState([]),[tt,Y]=ln.useState([]);ln.useEffect(()=>{const w=lw(t4,async D=>{try{if(f(!0),D){n(D);let V=await s4(D.uid);V.success||(V=await r4(D,{provider:"existing_account",appContext:"combustibles"})),V.success?o(V.userData):g("Error cargando perfil de usuario")}else n(null),o(null),T([]),R([]),X([]),Y([])}catch(V){console.error("Error en autenticación:",V),g("Error de autenticación")}finally{f(!1)}});return()=>w()},[]);const b={user:t,userProfile:s,loading:u,error:m,hasPermission:w=>s?.combustiblesPermissions?.[w]||!1,isAdmin:()=>s?.role==="admin",isCounterOrAbove:()=>s?.role==="admin"||s?.role==="contador",inventory:_,movements:S,vehicles:z,suppliers:tt,setInventory:T,setMovements:R,setVehicles:X,setSuppliers:Y,refreshInventory:async()=>{console.log("Refrescando inventario...")},refreshMovements:async()=>{console.log("Refrescando movimientos...")},refreshVehicles:async()=>{console.log("Refrescando vehículos...")},refreshSuppliers:async()=>{console.log("Refrescando proveedores...")}};return H.jsx(sb.Provider,{value:b,children:r})},o4=({children:r,currentView:t,onViewChange:n})=>{const{userProfile:s,isAdmin:o,isCounterOrAbove:u}=ab(),[f,m]=ln.useState(!1),g=[{id:"dashboard",name:"Dashboard",icon:"📊",description:"Vista general",requiredPermission:null},{id:"inventory",name:"Inventario",icon:"🛢️",description:"Gestión de stock",requiredPermission:"canManageInventory"},{id:"movements",name:"Movimientos",icon:"📈",description:"Entradas y salidas",requiredPermission:"canCreateMovements"},{id:"vehicles",name:"Vehículos",icon:"🚜",description:"Maquinaria forestal",requiredPermission:null},{id:"suppliers",name:"Proveedores",icon:"🏪",description:"Gestión de proveedores",requiredPermission:"canManageSuppliers"},{id:"reports",name:"Reportes",icon:"📋",description:"Análisis y reportes",requiredPermission:"canViewReports"}],_=R=>{n(R),m(!1)},T=R=>R?s?.combustiblesPermissions?.[R]||!1:!0,S=g.filter(R=>T(R.requiredPermission));return H.jsxs("div",{className:"dashboard-layout",children:[H.jsx("header",{className:"dashboard-header",children:H.jsxs("div",{className:"header-content",children:[H.jsx("button",{className:"sidebar-toggle",onClick:()=>m(!f),children:"☰"}),H.jsxs("div",{className:"header-title",children:[H.jsx("h1",{children:"⛽ Gestión de Combustibles"}),H.jsx("span",{className:"subtitle",children:"Forestech Colombia"})]}),H.jsxs("div",{className:"header-user",children:[H.jsxs("div",{className:"user-info",children:[H.jsx("span",{className:"user-name",children:s?.displayName||s?.email}),H.jsx("span",{className:"user-role",children:s?.role})]}),H.jsx("div",{className:"user-avatar",children:s?.photoURL?H.jsx("img",{src:s.photoURL,alt:"Avatar"}):H.jsx("div",{className:"avatar-placeholder",children:(s?.displayName||s?.email||"U").charAt(0).toUpperCase()})})]})]})}),H.jsxs("div",{className:"dashboard-body",children:[H.jsxs("aside",{className:`dashboard-sidebar ${f?"open":""}`,children:[H.jsx("nav",{className:"sidebar-nav",children:S.map(R=>H.jsxs("button",{className:`nav-item ${t===R.id?"active":""}`,onClick:()=>_(R.id),children:[H.jsx("span",{className:"nav-icon",children:R.icon}),H.jsxs("div",{className:"nav-content",children:[H.jsx("span",{className:"nav-name",children:R.name}),H.jsx("span",{className:"nav-description",children:R.description})]})]},R.id))}),H.jsx("div",{className:"sidebar-footer",children:H.jsxs("div",{className:"user-permissions",children:[H.jsx("h4",{children:"Permisos Activos:"}),H.jsxs("div",{className:"permission-list",children:[o()&&H.jsx("span",{className:"permission admin",children:"👑 Administrador"}),u()&&H.jsx("span",{className:"permission counter",children:"📊 Gestión Operativa"}),T("canManageInventory")&&H.jsx("span",{className:"permission",children:"🛢️ Inventario"}),T("canManageVehicles")&&H.jsx("span",{className:"permission",children:"🚜 Vehículos"})]})]})})]}),H.jsx("main",{className:"dashboard-main",children:H.jsx("div",{className:"main-content",children:r})})]}),f&&H.jsx("div",{className:"sidebar-overlay",onClick:()=>m(!1)})]})},Ol={DIESEL:"diesel",GASOLINE:"gasoline",ACPM:"acpm",LUBRICANTS:"lubricants",TWO_STROKE:"two_stroke"},bm={[Ol.DIESEL]:{name:"Diésel",description:"Combustible para maquinaria pesada",unit:"galones",category:"Combustible",color:"#fbbf24",icon:"🚛",density:.85,priceUnit:"COP/galón"},[Ol.GASOLINE]:{name:"Gasolina",description:"Combustible para vehículos livianos",unit:"galones",category:"Combustible",color:"#ef4444",icon:"⛽",density:.75,priceUnit:"COP/galón"},[Ol.ACPM]:{name:"ACPM",description:"Aceite Combustible Para Motor",unit:"galones",category:"Combustible",color:"#8b5cf6",icon:"🚜",density:.85,priceUnit:"COP/galón"},[Ol.LUBRICANTS]:{name:"Lubricantes",description:"Aceites y lubricantes para mantenimiento",unit:"litros",category:"Mantenimiento",color:"#06b6d4",icon:"🛢️",density:.9,priceUnit:"COP/litro"},[Ol.TWO_STROKE]:{name:"Mezcla 2T",description:"Mezcla para motores de 2 tiempos (motosierras)",unit:"litros",category:"Especializado",color:"#10b981",icon:"🪚",density:.78,priceUnit:"COP/litro"}},nn={CRITICAL:"critical",LOW:"low",MEDIUM:"medium",HIGH:"high",FULL:"full"},Pl={[nn.CRITICAL]:{label:"Crítico",color:"#dc2626",icon:"🚨",threshold:.1},[nn.LOW]:{label:"Bajo",color:"#ea580c",icon:"⚠️",threshold:.25},[nn.MEDIUM]:{label:"Medio",color:"#ca8a04",icon:"📊",threshold:.5},[nn.HIGH]:{label:"Alto",color:"#16a34a",icon:"✅",threshold:.75},[nn.FULL]:{label:"Completo",color:"#059669",icon:"🟢",threshold:1}},DE=(r,t)=>{if(t===0)return nn.CRITICAL;const n=r/t;return n<Pl[nn.CRITICAL].threshold?nn.CRITICAL:n<Pl[nn.LOW].threshold?nn.LOW:n<Pl[nn.MEDIUM].threshold?nn.MEDIUM:n<Pl[nn.HIGH].threshold?nn.HIGH:nn.FULL},ME=()=>{const{userProfile:r}=ab(),t=[{fuelType:"diesel",currentStock:1250,maxCapacity:2e3,location:"Tanque Principal",lastUpdated:new Date(Date.now()-2*60*60*1e3)},{fuelType:"gasoline",currentStock:180,maxCapacity:500,location:"Tanque Auxiliar",lastUpdated:new Date(Date.now()-4*60*60*1e3)},{fuelType:"acpm",currentStock:95,maxCapacity:1200,location:"Depósito Central",lastUpdated:new Date(Date.now()-1*60*60*1e3)},{fuelType:"lubricants",currentStock:85,maxCapacity:200,location:"Bodega",lastUpdated:new Date(Date.now()-6*60*60*1e3)}],n=[{type:"entry",quantity:500,fuelType:"diesel",date:new Date(Date.now()-1*24*60*60*1e3)},{type:"exit",quantity:120,fuelType:"gasoline",date:new Date(Date.now()-1*60*60*1e3)},{type:"exit",quantity:250,fuelType:"diesel",date:new Date(Date.now()-3*60*60*1e3)},{type:"entry",quantity:200,fuelType:"acpm",date:new Date(Date.now()-2*24*60*60*1e3)}],s=[{vehicleType:"harvester",name:"Cosechadora 001",status:"active",fuelType:"diesel",lastUsed:new Date},{vehicleType:"chainsaw",name:"Motosierra 015",status:"active",fuelType:"two_stroke",lastUsed:new Date},{vehicleType:"log_truck",name:"Camión MD-789",status:"maintenance",fuelType:"acpm",lastUsed:new Date(Date.now()-2*24*60*60*1e3)},{vehicleType:"pickup_truck",name:"Toyota Hilux",status:"active",fuelType:"gasoline",lastUsed:new Date}],o=t.reduce((T,S)=>{const R=bm[S.fuelType];return T+S.currentStock*(R?12e3:0)},0),u=n.filter(T=>T.date.toDateString()===new Date().toDateString()).length,f=s.filter(T=>T.status==="active").length,m=t.filter(T=>{const S=DE(T.currentStock,T.maxCapacity);return S==="critical"||S==="low"}),g=T=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(T),_=T=>new Intl.NumberFormat("es-CO").format(T);return H.jsxs("div",{className:"dashboard-main-content",children:[H.jsxs("div",{className:"dashboard-welcome",children:[H.jsxs("h2",{children:["Bienvenido, ",r?.displayName||"Usuario"]}),H.jsxs("p",{children:["Dashboard de Gestión de Combustibles - ",new Date().toLocaleDateString("es-CO",{weekday:"long",year:"numeric",month:"long",day:"numeric"})]})]}),H.jsxs("div",{className:"dashboard-cards",children:[H.jsxs("div",{className:"dashboard-card",children:[H.jsx("div",{className:"card-header",children:H.jsxs("div",{className:"card-title",children:[H.jsx("span",{className:"card-icon",children:"💰"}),"Valor Total Inventario"]})}),H.jsx("div",{className:"card-value",children:g(o)}),H.jsxs("div",{className:"card-description",children:[t.length," tipos de combustible en stock"]}),H.jsx("div",{className:"card-trend trend-positive",children:"↗ +5.2% vs mes anterior"})]}),H.jsxs("div",{className:"dashboard-card",children:[H.jsx("div",{className:"card-header",children:H.jsxs("div",{className:"card-title",children:[H.jsx("span",{className:"card-icon",children:"📈"}),"Movimientos Hoy"]})}),H.jsx("div",{className:"card-value",children:u}),H.jsx("div",{className:"card-description",children:"Entradas y salidas registradas"}),H.jsx("div",{className:"card-trend trend-positive",children:"↗ Actividad normal"})]}),H.jsxs("div",{className:"dashboard-card",children:[H.jsx("div",{className:"card-header",children:H.jsxs("div",{className:"card-title",children:[H.jsx("span",{className:"card-icon",children:"🚜"}),"Vehículos Activos"]})}),H.jsx("div",{className:"card-value",children:f}),H.jsxs("div",{className:"card-description",children:["de ",s.length," vehículos totales"]}),H.jsxs("div",{className:"card-trend trend-positive",children:["↗ ",Math.round(f/s.length*100),"% operatividad"]})]}),H.jsxs("div",{className:"dashboard-card",children:[H.jsx("div",{className:"card-header",children:H.jsxs("div",{className:"card-title",children:[H.jsx("span",{className:"card-icon",children:"⚠️"}),"Alertas de Stock"]})}),H.jsx("div",{className:"card-value",style:{color:m.length>0?"#dc2626":"#16a34a"},children:m.length}),H.jsx("div",{className:"card-description",children:m.length>0?"Requieren atención":"Niveles normales"}),m.length>0&&H.jsx("div",{className:"card-trend trend-negative",children:"⚠ Revisar stock crítico"})]})]}),H.jsxs("div",{className:"dashboard-section",children:[H.jsx("h3",{children:"🛢️ Resumen de Inventario"}),H.jsx("div",{className:"inventory-grid",children:t.map((T,S)=>{const R=bm[T.fuelType],z=DE(T.currentStock,T.maxCapacity),X=Pl[z],tt=Math.round(T.currentStock/T.maxCapacity*100);return H.jsxs("div",{className:"inventory-card",children:[H.jsxs("div",{className:"inventory-header",children:[H.jsx("span",{className:"fuel-icon",style:{color:R?.color},children:R?.icon}),H.jsxs("div",{children:[H.jsx("h4",{children:R?.name}),H.jsx("p",{children:T.location})]}),H.jsx("span",{className:"stock-badge",style:{background:X?.color,color:"white"},children:X?.icon})]}),H.jsxs("div",{className:"inventory-progress",children:[H.jsx("div",{className:"progress-bar",children:H.jsx("div",{className:"progress-fill",style:{width:`${tt}%`,background:X?.color}})}),H.jsxs("div",{className:"progress-text",children:[_(T.currentStock)," / ",_(T.maxCapacity)," ",R?.unit]})]}),H.jsxs("div",{className:"inventory-meta",children:[H.jsxs("span",{children:[tt,"% capacidad"]}),H.jsxs("span",{children:["Actualizado: ",T.lastUpdated.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"})]})]})]},S)})})]}),H.jsxs("div",{className:"dashboard-section",children:[H.jsx("h3",{children:"📊 Actividad Reciente"}),H.jsx("div",{className:"activity-list",children:n.slice(0,5).map((T,S)=>{const R=bm[T.fuelType],z=T.type==="entry";return H.jsxs("div",{className:"activity-item",children:[H.jsx("div",{className:"activity-icon",style:{background:z?"#dcfce7":"#fef2f2"},children:z?"📥":"📤"}),H.jsxs("div",{className:"activity-content",children:[H.jsxs("div",{className:"activity-title",children:[z?"Entrada":"Salida"," de ",R?.name]}),H.jsxs("div",{className:"activity-description",children:[_(T.quantity)," ",R?.unit," - ",T.date.toLocaleString("es-CO")]})]}),H.jsxs("div",{className:"activity-amount",style:{color:z?"#16a34a":"#dc2626"},children:[z?"+":"-",_(T.quantity)]})]},S)})})]})]})},l4=()=>H.jsxs("div",{className:"module-placeholder",children:[H.jsx("h2",{children:"🛢️ Módulo de Inventario"}),H.jsx("p",{children:"Gestión de stock de combustibles"}),H.jsxs("div",{className:"coming-soon",children:[H.jsx("span",{children:"🚧 En desarrollo"}),H.jsx("p",{children:"Próximamente: CRUD completo de inventario, alertas automáticas, y gestión de ubicaciones."})]})]}),u4=()=>H.jsxs("div",{className:"module-placeholder",children:[H.jsx("h2",{children:"📈 Módulo de Movimientos"}),H.jsx("p",{children:"Registro de entradas y salidas de combustible"}),H.jsxs("div",{className:"coming-soon",children:[H.jsx("span",{children:"🚧 En desarrollo"}),H.jsx("p",{children:"Próximamente: Formularios de movimientos, validaciones automáticas, y tracking por vehículo."})]})]}),c4=()=>H.jsxs("div",{className:"module-placeholder",children:[H.jsx("h2",{children:"🚜 Módulo de Vehículos"}),H.jsx("p",{children:"Gestión de maquinaria forestal"}),H.jsxs("div",{className:"coming-soon",children:[H.jsx("span",{children:"🚧 En desarrollo"}),H.jsx("p",{children:"Próximamente: Catálogo de vehículos, tracking de consumo, y mantenimientos."})]})]}),h4=()=>H.jsxs("div",{className:"module-placeholder",children:[H.jsx("h2",{children:"🏪 Módulo de Proveedores"}),H.jsx("p",{children:"Gestión de proveedores de combustible"}),H.jsxs("div",{className:"coming-soon",children:[H.jsx("span",{children:"🚧 En desarrollo"}),H.jsx("p",{children:"Próximamente: Base de datos de proveedores, comparación de precios, y evaluación."})]})]}),f4=()=>H.jsxs("div",{className:"module-placeholder",children:[H.jsx("h2",{children:"📋 Módulo de Reportes"}),H.jsx("p",{children:"Análisis y reportes de combustibles"}),H.jsxs("div",{className:"coming-soon",children:[H.jsx("span",{children:"🚧 En desarrollo"}),H.jsx("p",{children:"Próximamente: Reportes personalizables, gráficos interactivos, y exportación."})]})]}),d4=()=>{const[r,t]=ln.useState("dashboard"),n=()=>{switch(r){case"dashboard":return H.jsx(ME,{});case"inventory":return H.jsx(l4,{});case"movements":return H.jsx(u4,{});case"vehicles":return H.jsx(c4,{});case"suppliers":return H.jsx(h4,{});case"reports":return H.jsx(f4,{});default:return H.jsx(ME,{})}};return H.jsx(o4,{currentView:r,onViewChange:t,children:n()})};function m4(){return H.jsx(a4,{children:H.jsx("div",{className:"App",children:H.jsx(d4,{})})})}B1.createRoot(document.getElementById("root")).render(H.jsx(ln.StrictMode,{children:H.jsx(m4,{})}));
