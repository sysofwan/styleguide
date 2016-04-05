Javascript Style Guide
=============================
This file describes general Javascript guidelines. See files with specific library names for library guidelines.

1. Javascript projects are becoming increasingly bigger and more complex. Do not think that since JS looks famaliar, you do not have to take some time to learn it. Do not treat JS like Java/C++ without classes. Care about code design, object design, encapsulation, modularization when coding in JS. This guide explains briefly how to get these properties in JS. Pick up a book (highly recommend Javascript the Good Parts) for more in depth explaination.

2. Everything outside a function in Javascript is global. Do not declare any function/variables outside a function. To avoid redundancy, some of the examples given below are not inside functions. Assume that it is.

3. Always put semi-colons at the end of a statement. Not putting semi-colons may appear to work, but will result in very hard to find bugs. Use a linter to check for this.

4. Curly braces should be place on the right of a statement, not on a new line by itself (I know that this is debatable is most languages, but not for Javascript!).

    ```JavaScript
    // DO THIS
    var foo = function() {
        return {
            bar: 'bar'
        };
    }
    
    a = foo().bar; // a == 'bar'
    
    // NOT THIS
    var foo = function()
    {
        return
        {
            bar: 'bar'
        };
    };
    a = foo().bar; // a != 'bar' (a === undefined)
    ```

5. Use `===` instead of `==` and `!==` instead of `!=` for comparison. Javascript's `==` and `!=` is not type safe and have some weird [behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

6. Functions are first class objects in JS (i.e. functions are variables). Treat it like variables to avoid confusion. Avoid the "function declaration" syntax since it blurs this fact, and it provides implicit (and confusing) function hoisting (the function is brought up in its scope).
        
    ```JavaScript
    // in a function, DO THIS (not outside, see above)
    var foo = function() {...};
    foo();

    // NOT THIS
    foo(); // because of hoisting, this is valid. 
           // more confusion if there is a function named foo outside (which function is it calling?)

    function foo() {...}
    foo();
    ```

7. Javascript is function scoped (not block scoped like other C-style languages). All variable declarations will be hoisted to the top of a function.

    ```Javascript
    if (true) {
        var a = 1;
    }
    console.log(a); // prints 1, since a is not block scoped
    (function() { // to introduce a scope, create a function
        var b = 1;
        for (var i = 0; i < 3; i++} {
            // do nothing
        }
        console.log(i); // prints 3, i is not block scoped
    }());
    console.log(b); // undefined, b is only in the function
    console.log(i); // undefined, i is only in the function
    ```

7. Use self-invoking functions to avoid global variables/functions

    ```JavaScript
    // DO THIS
    (function() {
        var a = 1;  // does not pollute global environment
        console.log('hello!'); // will run
    }());

    // NOT THIS
    var a = 1;  // anyone accidentally use 'a' as a variable name will get a surprise
    console.log('hello!'); // equivalent to above
    ```
    
8. Use a single global variable to expose shared code (modules), instead of multiple global functions. Global functions may collide, and have different meanings based on context.

    ```JavaScript
    // DO THIS
    var g = {
        getHostName: function() {...},
        getPath: function() {...}
    }

    // NOT THIS
    function getHostName() {...}
    function getPath() {...}
    ```

9. Closures are functions that returns functions (or objects with functions). Use it for maintaining private access.

    ```JavaScript
    // id creator creates unique IDs. Once ID is created, it will not return the same ID again
    // DO THIS
    var constructIDcreator = function() { // this function will create an ID creator
        var count = 0; // private member, cannot be changed except by returned function
        return function() {
            count += 1;
            return count;
        }
    };
    var creator1 = constructIDcreator();
    var a = creator1(); // a == 1
    var b = creator1(); // b == 2
    var creator2 = constructIDcreator(); // we can construct multiple ID creator functions
    var c = creator2() // c == 1
    
    // NOT THIS
    // there is no longer private access, no longer any code reuse
    var id1 = 0;
    var id2 = 0;
    var getId1 = function() {
        id1 += 1;
        return id1;
    };
    var getId2 = function() {
        id2 += 1;
        return id2;
    };
    var a = getId1(); // a == 1
    var b = getId1(); // b == 2
    var c = getId2(); // c == 1
    
    ...
    // somewhere later in code, some programmer does not realize that id1 should only be accessed by getId1
    id1 = 0; // breaks ID invariant, all code depending on id1 will break
    ```
        
10. Use closures and self-invoking functions to add private variables/functions to module/singeletons. Remember, the more you keep stuff private, the better your encapsulation (the less you try to find which code is changing what).

    ```JavaScript        
    // DO THIS
    var g = (function() { // g can be a module (group of functions with similar purpose - i.e for string manipulation) or singleton
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
    ```
