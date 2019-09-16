
(function(){
    "use strict";
  
    /** Mixin to extend the String type with a method to escape unsafe characters
     *  for use in HTML.  Uses OWASP guidelines for safe strings in HTML.
     * 
     *  Credit: http://benv.ca/2012/10/4/you-are-probably-misusing-DOM-text-methods/
     *          https://github.com/janl/mustache.js/blob/16ffa430a111dc293cd9ed899ecf9da3729f58bd/mustache.js#L62
     *
     *  Maintained by stevejansen_github@icloud.com
     *
     *  @license http://opensource.org/licenses/MIT
     *
     *  @version 1.0
     *
     *  @mixin
     */
    function escapeHtml() {
      return this.replace(/[&<>"'\/]/g, function (s) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
          };
  
        return entityMap[s];
      });
    }
  
    if (typeof(String.prototype.escapeHtml) !== 'function') {
      String.prototype.escapeHtml = escapeHtml;
    }

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        };
    }
    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    if (typeof String.prototype.equalsIgnoreCase != 'function') {
        String.prototype.equalsIgnoreCase = function (anotherString) {
            if (this === anotherString) {
                //如果两者相同 否则判端两个的大小写是否为null
                return true;
            }
            //因为 typeof(null) = object typeof(undefined) = undefined 实际上也是判端了这两个不为空
            if (typeof(anotherString) === 'string') {
                //this!=null&&this!=undefined &&anotherString!=null&& anotherString!=undefined
                return this.toLowerCase() == anotherString.toLowerCase();
            }
            return false;
        }
    }
  })();