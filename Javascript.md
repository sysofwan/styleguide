Javascript Style Guide
=============================
This file describes general Javascript guidelines. See files with specific library names for library guidelines.

1. Javascript projects are becoming increasingly bigger and more complex. Do not think that since JS looks famaliar, you do not have to take some time to learn it. Do not treat JS like Java/C++ without classes. Care about code design, object design, encapsulation, modularization when coding in JS. This guide explains briefly how to get these properties in JS. Pick up a book (highly recommend Javascript the Good Parts) for more in depth explaination.

2. Everything outside a function in Javascript is global. Do not declare any function/variables outside a function.

3. Functions are first class objects in JS (i.e. functions are variables). Treat it like variables to avoid confusion. Avoid the "function declaration" syntax since it blurs this fact, and it provides implicit (and confusing) function hoisting (the function is brought up in its scope).

        // in a function, DO THIS (not outside, see above)
        var foo = function() {...};
        foo();
        
        // NOT THIS
        foo(); // because of hoisting, this is valid. 
               // more confusion if there is a function named foo outside (which function is it calling?)
        
        function foo() {...}
        foo();

4. Use self-invoking functions to avoid global code

        // DO THIS
        (function() {
            var a = 1;  // does not pollute global environment
            console.log('hello!'); // will run
        }());
        
        // NOT THIS
        var a = 1;  // anyone accidentally use 'a' as a variable name will get a surprise
        console.log('hello!'); // equivalent to above
5. Use a single global variable to expose shared code (modules), instead of multiple global functions. Global functions may collide, and have different meanings based on context.

        // DO THIS
        var g = {
                getHostName: function() {...},
                getPath: function() {...}
        }
        
        // NOT THIS
        function getHostName() {...}
        function getPath() {...}
        
6. Use closures and self-invoking functions to add private variables/functions in modules. Remember, the more you keep stuff private, the better your encapsulation (the less you try to find which code is changing what).
        
        // DO THIS
        var g = (function() {
                var privateFunc = function() {...};
                var privateVar = 1;
                
                return {
                        publicFunc: function() {
                                privateFunc();
                                privateVar = 2;
                        };
                }
        }());

        // NOT THIS
        function privateFunc() {...} // any code in the whole web page can use this function
        var privateVar = 1;          // and change this variable. How are you going to debug?
        function publicFunc() {
                privateFunc();
                privateVar = 2;
        }
