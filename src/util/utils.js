import {parse, stringify} from "qs";
import './string';

// 功能扩展

if (!Function.prototype.getName) {
	Function.prototype.getName = function() {
		return this.name || this.toString().match(/function\s*([^(]*)\(/)[1];
	}
}

if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
if (!Array.contains) {
	Array.prototype.contains = function (val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === val) {
				return true;
			}
		}
		return false;
	};
}

if (!Function.getName) {
	Function.prototype.getName = function () {
		return this.toString().match(/function\s*([^(]*)\(/)[1]
	}
}

//数组操作工具函数：arrayUtils都是产生新的array，而不是操作源array
export const arrayUtils = {
	/**
	 * 在指定索引位置增加新元素，未指定index时添加到最后面
	 * @param array (array)
	 * @param newItem	 (object)
	 * @param index (int)
	 * @returns {*} 返回新数组
	 */
	addItem: (array, newItem, index) => {
		if (typeof index !== 'undefined') {
			return [
				...array.slice(0, index),
				newItem,
				...array.slice(index + 1)
			]
		} else {
			return [
				...array,
				newItem
			];
		}
	},
	/**
	 * 删除指定id的元素
	 * @param array
	 * @param id
	 * @returns {[*,*]} 返回新数组, 如果需要删除的数据不存在，则返回原来的数组
	 */
	delItem: (array, id) => {
		const findIndex = array.findIndex(item => item.id == id);
		if (findIndex === -1) {
			return array
		}
		return [
			...array.slice(0, findIndex),
			...array.slice(findIndex + 1)
		];
	},
	/**
	 * 删除指定的对象
	 * @param array
	 * @param obj
	 * @returns	{[*,*]} 返回新数组, 如果需要删除的数据不存在，则返回原来的数组
	 */
	removeItem: (array, obj) => {
		const findIndex = array.findIndex(item => item === obj);
		if (findIndex === -1) {
			return array
		}
		return [
			...array.slice(0, findIndex),
			...array.slice(findIndex + 1)
		];
	},
	/**
	 * 替换数组中指定的元素
	 * @param array
	 * @param id
	 * @param newItem (object)
	 * @returns {[*,*,*]} 返回新数组
	 */
	modifyItem: (array, id, newItem) => {
		const findIndex = array.findIndex(item => item.id == id);
		if (findIndex === -1) {
			// as new
			return [
				...array,
				newItem
			];
		} else {
			return [
				...array.slice(0, findIndex),
				newItem,
				...array.slice(findIndex + 1)
			];
		}

	},
	findIndex: (array, elem) => {
		return array.findIndex(item => item == elem);
	},
	findIndexById: (array, id) => {
		return array.findIndex(item => item.id == id);
	},
	findIndexByKey: (array, keyName, value) => {
		return array.findIndex(item => item[keyName] == value);
	}
};

export function isObject(val) {
	return val !== undefined && val != null && typeof val === 'object' && Array.isArray(val) === false;
}

export function isArray(val) {
	return Array.isArray(val);
}

export function isFunction(val) {
	return Object.prototype.toString.call(val) === "[object Function]"
}

/*
 方法一使用typeof方法。
 console.log(typeof str);//string
 console.log(typeof num);//number
 console.log(typeof b);//boolean
 console.log(typeof n);//null是一个空的对象
 console.log(typeof u);//undefined
 // 下面的其实不是很准确。
 console.log(typeof arr);//object
 console.log(typeof obj);//object
 console.log(typeof fn);//function
 */
export function isNumber(val) {
	return (typeof val) === "number";
}

export function isString(val) {
	return (typeof val) === "string";
}
export function closeWin() {
	try {
		window.opener = window;
		var win = window.open("", "_self");
		win.close();
		//frame的时候
		window.top.close();
	} catch (e) {
		console.log(e.message||e);
	}
}
export function openWin(url, iHeight, iWidth, customParams, win) {
	//获得窗口的垂直位置 
	let iTop = (window.screen.availHeight - 30 - iHeight) / 2; 
	//获得窗口的水平位置 
	let iLeft = (window.screen.availWidth - 10 - iWidth) / 2; 
	let params = `height=${iHeight},width=${iWidth}`; 
	if (customParams) {
		for(let key in customParams) {
			params += `,${key}=${customParams[key]}`;
		}
		// 填充默认值 
		if (!customParams.hasOwnProperty('top')) {
			params += `,top=${iTop}`;
		}
		if (!customParams.hasOwnProperty('left')) {
			params += `,left=${iLeft}`;
		}
		if (!customParams.hasOwnProperty('toolbar')) {
			params += `,toolbar=no`;
		}
		if (!customParams.hasOwnProperty('menubar')) {
			params += `,menubar=no`;
		}
		if (!customParams.hasOwnProperty('resizable')) {
			params += `,resizable=yes`;
		}
		if (!customParams.hasOwnProperty('location')) {
			params += `,location=no`;
		}
	} else {
		params += `,top=${iTop},left=${iLeft},toolbar=no,menubar=no,resizeable=yes,location=no`;
	}
	
	return window.open(url, win, params);

}

export function getPageQuery() {
	return parse(window.location.href.split('?')[1]);
}

export function getPageUrl() {
	return window.location.href.split('?')[0];
}

export function getQueryPath(path = '', query = {}) {
	const search = stringify(query);
	if (search.length) {
		if (path.indexOf('?') === -1) {
			return `${path}?${search}`;
		} else {
			return `${path}&${search}`;
		}
		
	}
	return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
	return reg.test(path);
}

export function isEmpty(val) {
	return val === undefined || val === null || val === "";
}

export function isEmptyArray(val) {
	return val === undefined || val === null || val.length === 0;
}

export function isEmptyObj(obj) {
	if (!isObject(obj)) {
		return true;
	}
	for(let item in obj){
		return false;
	}
	return true;
}

export function isObjectValueEqual(a, b) {
	// Of course, we can do it use for in
	// Create arrays of property names
	if ((a === null || a === undefined) && (b === null || b === undefined) ) {
		return true;
	}

	if ((a === null || a === undefined) || (b === null || b === undefined) ) {
		return false;
	}

	if (!(isObject(a) && isObject(b))) {
		return a === b;
	}

	const aProps = Object.getOwnPropertyNames(a);
	const bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length !== bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		const va = a[propName];
		const vb = b[propName];
		if (isObject(va) && isObject(vb)) {
			if (!isObjectValueEqual(va, vb)) {
				return false;
			}
		} else if (isArray(va) && isArray(vb)) {
			// compare array
			if (!isArrayValueEquals(va, vb)) {
				return false;
			}
		} else {
			if (va !== vb) {
				return false;
			}
		}

	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
}

export function isArrayValueEquals(a, b) {
	if (isArray(a) && isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			let va = a[i];
			let vb = b[i];
			// 又是递归处理
			if (isObject(va) && isObject(vb)) {
				if (!isObjectValueEqual(va, vb)) {
					return false;
				}
			} else if (isArray(va) && isArray(vb)) {
				if (!isArrayValueEquals(va, vb)) {
					return false;
				}
			} else {
				if (va !== vb) {
					return false;
				}
			}
		}
	} else {
		return false;
	}
}

export function createAction(type, ...argNames) {
	return function(...args) {
		const action = { type }
		argNames.forEach((arg, index) => {
			action[argNames[index]] = args[index]
		});
		return action;
	}
}

// const ADD_TODO = 'ADD_TODO'
// 调用 export const addTodo = makeActionCreator(ADD_TODO, 'text')

export function createReducer(initialState, handlers) {
	return function reducers(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	}
}

export function addFunctionWithItsName(func, store, alias) {
	if(isFunction(func)) {
		if (alias) {
			store[alias] = func;
		} else {
			store[func.getName()] = func;
		}
	}
	return store;
}


export const calcPageHeight = (doc) => {
	// console.log("doc.body.scrollHeight", doc.body.scrollHeight)
	// console.log("doc.documentElement.scrollHeight", doc.documentElement.scrollHeight)
	const	height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
	const	width = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
	return {height, width}
};

const createSsendMessage = function(){
	const ifr = window.parent;
	if(window.postMessage){
		return function(data){
			ifr.postMessage(data,'*');
		};
	} else{
		return function(data){
			ifr.name = data.height + "," + data.width;
		};
	}
};
export const sendMessage = createSsendMessage();

export function adjustIframeHeight() {
	if (window.top) {
		// const calcPageHeight = (doc) => {
		// 	// console.log("doc.body.scrollHeight", doc.body.scrollHeight)
		// 	// console.log("doc.documentElement.scrollHeight", doc.documentElement.scrollHeight)
		// 	const	height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
		// 	const	width = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
		// 	return {height, width}
		// };

		// const ifr = window.parent;
		//
		// const sendMessage = function(){
		// 	if(window.postMessage){
		// 		return function(data){
		// 			ifr.postMessage(data,'*');
		// 		};
		// 	} else{
		// 		return function(data){
		// 			ifr.name = data.height + "," + data.width;
		// 		};
		// 	}
		// };
		//
		// window['sendMessage'] = sendMessage();
		let last = 0;
		setInterval(function(){
			let d = calcPageHeight(document);

			if (last === d.height) {
				return;
			}
			console.log("d",d )
			last = d.height;
			sendMessage(d);
		}, 50);
	}
}

 /**
	 * 获取可视窗口高度
	 */
 export function getViewPortHeight() {
		return document.documentElement.clientHeight || document.body.clientHeight;
 }

	/**
	 * 获取可视窗口宽度
	 */
export function getViewPortWidth() {
	return document.documentElement.clientWidth || document.body.clientWidth;
}

export function getViewPortWidthWithScale(minWidth=0, scale) {
	const width = getViewPortWidth();
	const scaleWidth = width * scale;
	if (width < minWidth ||	scaleWidth < minWidth) {
		return minWidth;
	} else {
		return scaleWidth;
	}
	//return document.documentElement.clientWidth || document.body.clientWidth;
}

export function stringToDom(arg) {
	var objE = document.createElement("div");
	objE.innerHTML = arg;
	return objE.childNodes;
}

export function domToString(node) {	
	var tmpNode = document.createElement("div"); 
	if (node.length) {
		node.forEach(n => {
			tmpNode.appendChild(n.cloneNode(true));	
		})
	} else {
		tmpNode.appendChild(node.cloneNode(true));	
	}
	
	var str = tmpNode.innerHTML;	
	tmpNode = node = null; // prevent memory leaks in IE	
	return str;	
}	

export function filterTag(s, options) {
	const {html,script, style } = options;
	let defaultHtmlTag = false;
	if (!html && !script && !style)
		defaultHtmlTag = true;

	if (script)
		s = s.replace(/<\s*script[^>]*>(.|[\r\n])*?<\s*\/script[^>]*>/gi, '');
	if (style)
		s = s.replace(/<\s*style[^>]*>(.|[\r\n])*?<\s*\/style[^>]*>/gi, '');
	if (html || defaultHtmlTag) {
		s = s.replace(/<\/?[^>]+>/g, '');
		s = s.replace(/\&[a-z]+;/gi, '');
	}
	return s;
}


export function setStyles(el, hash){
		const HAS_CSSTEXT_FEATURE = typeof(el.style.cssText) !== 'undefined';
		function trim(str) {
			return str.replace(/^\s+|\s+$/g, '');
		}
		let originStyleText;
		const originStyleObj = {};
		if (HAS_CSSTEXT_FEATURE) {
			originStyleText = el.style.cssText;
		} else {
			originStyleText = el.getAttribute('style');
		}
		originStyleText.split(';').forEach(item => {
			if (item.indexOf(':') !== -1) {
				const obj = item.split(':');
				originStyleObj[trim(obj[0])] = trim(obj[1]);
			}
		});

		const styleObj = {};
		Object.keys(hash).forEach(item => {
			this.setStyle(el, item, hash[item], styleObj);
		});
		const mergedStyleObj = Object.assign({}, originStyleObj, styleObj);
		const styleText = Object.keys(mergedStyleObj)
				.map(item => item + ': ' + mergedStyleObj[item] + ';')
				.join(' ');

		if (HAS_CSSTEXT_FEATURE) {
			el.style.cssText = styleText;
		} else {
			el.setAttribute('style', styleText);
		}
	}

const reUnit = /width|height|top|left|right|bottom|margin|padding/i;
export function setStyle(node, att, val, style) {
	style = style || node.style;

	if (style) {
		if (val === null || val === '') { // normalize unsetting
			val = '';
		} else if (!isNaN(Number(val)) && reUnit.test(att)) { // number values may need a unit
			val += 'px';
		}

		if (att === '') {
			att = 'cssText';
			val = '';
		}

		style[att] = val;
	}
}

export function	getStyle(el, att, style) {
		style = style || el.style;

		let val = '';

		if (style) {
			val = style[att];

			if (val === '') {
				val = getComputedStyle(el, att);
			}
		}

		return val;
}

// NOTE: Known bug, will return 'auto' if style value is 'auto'
function getComputedStyle(el, att) {
		const win = el.ownerDocument.defaultView;
		// null means not return presudo styles
		const computed = win.getComputedStyle(el, null);

		return att ? computed[att] : computed;
}

export function htmlStringToText(arg) {
	var objE = document.createElement("div");
	objE.innerHTML = arg;
	return objE.innerText ?	objE.innerText :	objE.textContent;
}

export const EventUtil = {

	addHandler: function(element, type, handler){
		if(element.addEventListener){
			element.addEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.attachEvent("on" + type, handler);
		}else{
		element["on" + type] = handler;
		}
	},
	
	getEvent: function(event){
		return event?event: window.event;
	},
	
	getTarget: function(event){
		return event.target|| event.srcElement;
	},
	
	preventDefault: function(event){
		if(event.preventDefault){
		event.preventDefault();
		}else{
		event.returnValue = false;
		}
	},
	
	removeHandler: function(element, type, handler){
		if(element.removeEventListener){
		element.removeEventListener(type, handler, false);
		}
		else if(element.detachEvent)
		{
		element.detachEvent("on" + type, handler);
		}else{
		element["on" + type] = null;
		}
	},
	
	stopPropagation: function(event){
		if(event.stopPropagation){
		event.stopPropagation();
		}else{
		event.cancelBubble = true;
		}
	},
	
	getCharCode: function(event){
		if(typeof event.charCode == "number"){
		return event.charCode;
		}else{
		return event.keyCode;
		}
	}
}

export function standardLang(lang) {
	switch (lang) {
		case 'zh_CN':
		case 'zh_cn':
		case 'zh-CN':
		case 'zh-cn':
		case 'zh':
			return 'zh_CN';
		case 'zh_TW':
		case 'zh_tw':
		case 'zh-TW':
		case 'zh-tw':
			return 'zh_TW';
		case 'ja':
		case 'jp':
			return 'ja';
		case 'en':
		case 'en_US':
		case 'en_UK':
		default:
			return "en";
	}
}