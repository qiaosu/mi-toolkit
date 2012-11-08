function _ns(path, root, value){
    var hasValue = arguments.length > 2;
    return typeof(path) == "string" 
    	? _parser(path.split("."), function (a,b,i,arr){
        	if(!_check(b,a)){throw new Error("\u8BE5\u540D\u79F0 "+b+" \u5DF2\u88AB\u5360\u7528\uFF0C\u8BF7\u9009\u62E9\u5176\u5B83\u540D\u79F0\uFF01");}
        	return a[b] = a[b] ? a[b] : (arr.length - 1 === i && hasValue ? value : {});
    	}, root || window)
    	: path;
}

//helper
/**
 * the namespace parser
 * @param {Array} arr the namespace array
 * @param {Function} callback the parser callback
 * @param {Object} [root] the namespace root object
 * @return {Object} the last object of namespace
 */
function _parser(arr, callback, root){
    var array = arr || [], len = array.length, i = 0, last = root;
    if (len == 0 && arguments.length == 2) {
        throw new TypeError()
    }
    while (i < len) {
        if (i in array) {
            last = callback.call(null, last, array[i], i, array);
        }
        i++
    }
    return last;
}

/**
 * theck the namespace name is exists
 * @param {String} theName
 * @param {Object} thePackageObject
 * @return {Boolean}
 */
function _check(dir, thePackageObject){
    return _each(thePackageObject || _mi, function(value, key){
        if(dir === key){
            return false;
        }
    })
}