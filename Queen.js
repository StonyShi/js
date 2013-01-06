/*!
 * Queen JS Library 0.0.1
 * Copyright(c) 2013-01-06 Stony
 */
 (function(){
   function _Q(){
 		var args = arguments,
 			idSeed = 0,        
			toString = Object.prototype.toString,        
			ua = navigator.userAgent.toLowerCase(),        
			check = function(r){            
				return r.test(ua);       
			},
			DOC = document,        
			isOpera = check(/opera/),        
			isChrome = check(/\bchrome\b/),        
			isWebKit = check(/webkit/),
			isSafari = !isChrome && check(/safari/),        
			isIE = !isOpera && check(/msie/),        
			isGecko = !isWebKit && check(/gecko/),        
			isBorderBox = isIE && !isStrict,        
			isWindows = check(/windows|win32/),        
			isMac = check(/macintosh|mac os x/),        
			isAir = check(/adobeair/),        
			isLinux = check(/linux/),        
			isSecure = /^https/i.test(window.location.protocol),
			getBody = function(){           
				return (DOC.body || DOC.documentElement);     
			}(),
			reload =  function(){ 
				window.location.reload(); 
			},
			append = function(el,child) {
				if (el.nodeType == 1)
					el.appendChild(child);
			},
			prepend = function(el,child){
				if (el.nodeType == 1)
					this.insertBefore(child, el.firstChild);
			},
			before = function(el,child) {
				el.parentNode.insertBefore(child, el);
			},
			after = function(el, child) {
				el.parentNode.insertBefore(child, el.nextSibling);
			},
			siblings =  function(elem){
				var elems = [], len,
					siblings = elem.parentNode.childNodes;
				for (var i = 0; i < siblings.length; i++) {
					if (siblings[i].nodeType == 1 && siblings[i].tagName != 'SCRIPT')
						elems.push(siblings[i]);
					if (siblings[i] == elem)
						elems.n = elems.length - 1;
				}
				len = elems.length;
				return {
					len : len,
					siblings : elems,
					isLast: elems.n == elems.length - 1,
					last : elems[len-1],
					first : elems[0],
					cur:  elems[elems.n],
					prev: elems[elems.n - 1],
					next: elems[elems.n + 1]
				};
			},
			isString = function(obj){
				return toString.call(obj) === "[object String]" || typeof obj === "string";
			},
			isFunction = function(obj){
				return toString.call(obj) === "[object Function]";
			},
			isArray = function(obj){
				return toString.call(obj) === "[object Array]";
			},
			isElement = function(node){
				return node && node.nodeType == 1;
			},
			isEmptyObject = function(obj){
				for(var name in obj){
					return false;
				}
				return true;
			},
			isObject = function(obj){
				return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
			},
			isNumber = function(v){
				return typeof v === 'number' && isFinite(v);
			},
			isDate = function(v){            
				return toString.apply(v) === '[object Date]';
			},
			trim = function( text ) {
				return (text || "").replace(/^\s+|\s+$/g, "");
			},
			type = function(o){
				if(o === undefined || o === null){
					return false;      
				}
				if(o.htmlElement){                
					return 'element';            
				}
				var t = typeof o;            
				if(t == 'object' && o.nodeName) {
					switch(o.nodeType) {
						case 1: return 'element';                    
						case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';                
					}            
				}
				if(t == 'object' || t == 'function') {
					switch(o.constructor) {
						case Array: return 'array';                    
						case RegExp: return 'regexp';                    
						case Date: return 'date';                
					}
					if(isNumber(o.length) && isFunction(o.item)) {
						return 'nodelist';
					}	
				}
				return t;
			},
			firstChild = function(node){
				var n = node.firstChild;
				while(!isElement(n)){
					n = n.nextSibling;
				}
				return n;
			},
			lastChild = function(node){
				var n = node.lastChild;
				while(!isElement(n)){
					n = n.previousSibling;
				}
				return n;
			},
			firstSibling = function(node){
				var n = node.parentNode.firstChild;
				while(!isElement(n)){
					n = n.nextSibling;
				}
			},
			lastSibling = function(node){
				var n = node.parentNode.lastChild;
				while(!isElement(n)){
					n = n.previousSibling;
				}
				return n;
			},
			parentNode = function(node){
				if(!isElement(node)) return null;
				var n = node.parentNode;
				while(!isElement(n)){
					n = n.parentNode;
				}	
				return n;
			},
			event = {
				on : function(element, type, handler){
					if(element.addEventListener){ 
						element.addEventListener(type,handler,false); 
					}else if(element.attachEvent){ 
						element.attachEvent("on" + type, handler); 
					}else{ 
						elmenet["on" + type] = handler; 
					} 
				}, 
				un : function(element, type, handler){ 
					if(element.removeEventListener){ 
						element.removeEventListener(type, handler, false); 
					}else if(element.detachEvent){ 
						element.detachEvent("on"+type, handler); 
					}else{ 
						element["on"+type] = null;
					}
				},
				getEvent : function(event){ 
					return event ? event : window.event; 
				}, 
				getTarget : function(event){ 
					return event.target || event.srcElement; 
				}	
			},
			TipTools = function(){
				var instance,
					Tips = function(){
						this.init();
				};
				Tips.prototype = {
					init : function(){
						this.delayTask = null;
						this.delayTime = 500;
						this.el = DOC.createElement('div');
						this.el.style.display = 'none';
						this.el.className = 'tips_cls';
						getBody().appendChild(this.el);
					},
					destroyTask : function(task){
						clearTimeout(task);
						task = null;
					},
					startDelay : function(e,text){
						e = event.getEvent(e);
						if(this.delayTask == null){
							var that = this,
								x = e.clientX,
								y = e.clientY;
							this.delayTask = setTimeout(function(){
								that.show(x,y,text);
							},this.delayTime);
						}
					},
					show : function(x,y,text){
						this.destroyTask(this.delayTask);
						this.el.style.left = x + 'px';
						this.el.style.top = (y+10) + 'px';
						this.el.innerHTML = text;
						this.el.style.display = 'block';
					},
					hide : function(){
						this.destroyTask(this.delayTask);
						this.el.innerHTML = '';
						this.el.style.display = 'none';
					}
				};
				return {
					add : function(el,text){
						var tip = this.getTip();
						event.on(el, 'mouseover', function(e){ tip.startDelay(e, text); });
						event.on(el, 'mouseout', function(e){ tip.hide(); });
					},
					getTip : function(){
						if(instance == null)
							instance = new Tips();
						return instance;
					}
				}
			}(),
			decodeJSON	= function (str){
				return eval('(' + str + ')');
			},
			isUnDefined = function(obj){
				return obj == null || typeof obj == "undefined" || obj === undefined;
			},
			isDefined = function(obj){            
				return typeof obj !== 'undefined' || obj != null;
			},
			HttpClient = function(){};
			HttpClient.prototype = {
				request: function(method, url, callback, postVars, async) {
					Util.body.style.cursor = "wait";
				    var xhr = this.createXhrObject();
				    if(typeof async == "undefined" || async == null) async = true;
				    xhr.onreadystatechange = function() {
				    	if(xhr.readyState !== 4) return;
				    	if(xhr.readyState == 4)  Util.body.style.cursor = "default";
				    	(xhr.status === 200) ?
				    			callback.success(xhr.responseText, xhr.responseXML) : 
				    			callback.failure(xhr.status);
				    };
				    xhr.open(method, url, async);
				    if(method.toUpperCase() == 'POST'){
				    	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
				    } else{ 
					    postVars = null;
					}
				    xhr.send(postVars);
				  },
				  createXhrObject : function(){
					  var http ; 
				      try {
					      http = new XMLHttpRequest;
					      this.createXhrObject = function() {
				       	 	  return new XMLHttpRequest;
				      	  };
				      }catch(e){
				    	  var msxml = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
				    	  for (var i = 0, len = msxml.length; i < len; ++i) {
				    		  try {
				    	          http = new ActiveXObject(msxml[i]);
				    	          this.createXhrObject = function() {
				    	              return new ActiveXObject(msxml[i]);
				    	          };
				    	          break;
				    	      }catch(e) {}
					      }	  
				      }  
				      return http;  
				}
			};
			return {
				body : getBody,
				isIE : isIE ,
				isOpera : isOpera,
				isGecko : isGecko ,
				isChrome : isChrome,
				isWindows : isWindows,
				isLinux : isLinux,
				isString : isString,
				isArray : isArray,
				isObject : isObject,
				isFunction : isFunction,
				isElement : isElement,
				isEmptyObject : isEmptyObject,
				isUnDefined : isUnDefined,
				isDefined : isDefined,
				reload : reload,
				siblings : siblings,
				firstChild : firstChild,
				lastChild : lastChild,
				firstSibling : firstSibling,
				lastSibling : lastSibling,
				getParent : parentNode,
				event : event,
				on : event.on,
				un : event.un,
				getEvent : event.getEvent,
				target : event.getTarget,
				TipTools : TipTools,
				decodeJSON : decodeJSON,
				HttpClient : new HttpClient()
			}
 	}
 	window.Queen = window.Q = function(){
 		return new _Q(arguments);
 	}
 })();
