/**
 * Underscore Template
 */
// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
!function(name, definition){
    $NAMESPACE[name] = definition();
}("Template", function(){
    return function(text, data){
        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        var templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };

        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /.^/;
        
        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
            '\\': '\\',
            "'": "'",
            r: '\r',
            n: '\n',
            t: '\t',
            u2028: '\u2028',
            u2029: '\u2029'
        };
        
        for (var key in escapes) 
            escapes[escapes[key]] = key;
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;
        
        // Within an interpolation, evaluation, or escaping, remove HTML escaping
        // that had been previously added.
        var unescape = function(code){
            return code.replace(unescaper, function(match, escape){
                return escapes[escape];
            });
        };
        
        var settings = templateSettings;
        
        // Compile the template source, taking care to escape characters that
        // cannot be included in a string literal and then unescape them in code
        // blocks.
        var source = "__p+='" +
        text.replace(escaper, function(match){
            return '\\' + escapes[match];
        }).replace(settings.escape || noMatch, function(match, code){
            return "'+\n((__t=(" + unescape(code) + "))==null?'':_.escape(__t))+\n'";
        }).replace(settings.interpolate || noMatch, function(match, code){
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
        }).replace(settings.evaluate || noMatch, function(match, code){
            return "';\n" + unescape(code) + "\n__p+='";
        }) +
        "';\n";
        
        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) 
            source = 'with(obj||{}){\n' + source + '}\n';
        
        source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'')};\n" +
        source +
        "return __p;\n";
        
        var render = new Function(settings.variable || 'obj', '_', source);
        if (data) 
            return render(data, _);
        var template = function(data){
            return render.call(this, data, _);
        };
        
        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
        
        return template;
    }
});