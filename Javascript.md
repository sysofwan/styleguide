Javascript Style Guide
=============================
This file describes general Javascript guidelines. See files with specific library names for library guidelines.

Why Javascript
----------------
Javascript is the language of the web, one of the most portable language, running on almost all machines. Applications written in JS can be used on almost all machines with a browser. Javascript was designed to be simple and beginner friendly. It was also designed in a hurry, making it have some very bad design choices.

Javascript projects are becoming increasingly bigger and more complex. Do not think that since JS looks famaliar, you do not have to take some time to learn it. Do not treat JS like Java/C++ without classes. Care about code design, object design, encapsulation, modularization when coding in JS. This guide explains briefly how to get these properties in JS. Pick up a book (highly recommend Javascript the Good Parts) for more in depth explaination.

Style
-------------
1. Everything outside a function in Javascript is global. Do not declare any function/variables outside a function. To avoid redundancy, some of the examples given below are not inside functions. Assume that it is.

2. Always put semi-colons at the end of a statement. Not putting semi-colons may appear to work, but will result in very hard to find bugs. Use a linter to check for this.

3. Always use `var` to declare a variable. Not using it wil work (surprise!), but the variable will become a global (what?).

4. Put `use strict;` at the beginning of a JS file or a script tag. The enables "strict mode" which will throw errors and tell you about problems that will usually fail silently. See [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode]) for more information.

5. Curly braces should be place on the right of a statement, not on a new line by itself (I know that this is debatable is most languages, but not for Javascript!).

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

6. Use `===` instead of `==` and `!==` instead of `!=` for comparison. Javascript's `==` and `!=` is not type safe and have some weird [behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

7. Functions are first class objects in JS (i.e. functions are variables). Treat it like variables to avoid confusion. Avoid the "function declaration" syntax since it blurs this fact, and it provides implicit (and confusing) function hoisting (the function is brought up in its scope).
        
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

8. Javascript is function scoped (not block scoped like other C-style languages). All variable declarations will be hoisted to the top of a function.

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

9. Use self-invoking functions to avoid global variables/functions

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
 
Patterns
---------------
1. Use short-circuiting to give default values to function parameters

    ```JavaScript
    var foo = function(a, b) {
        a = a || 1;
        b = b || 2;
        console.log('a:' + a ' b:' + b);
    };
    foo(); // prints a:1 b:2
    foo(2); // prints a:2 b:2
    foo(3, 10) // prints a:3 b:10
    ```
2. Use a single global variable to expose shared code (modules), instead of multiple global functions. Global functions may collide, and have different meanings based on context.

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

3. Closures are functions that returns functions (or objects with functions). Use it for maintaining private access.

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
        
4. Use closures and self-invoking functions to add private variables/functions to module/singeletons. Remember, the more you keep stuff private, the better your encapsulation (the less you try to find which code is changing what).

    ```JavaScript        
    // DO THIS
    // g can be a module (group of functions with similar purpose - i.e for string manipulation) or singleton
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
    ```

5. Prefer creating objects using closures over constructor functions for simple objects with no inheritance. This may be debatable, but I find confusions/bugs from the `this` keyword in constructor functions, and the private members available in closures to be a good reason to prefer closures.

    ```JavaScript
    var useId = function(idFunc) {
        var id = idFunc();
        ...
    };
    // PREFER THIS
    // This is an object for ID generation (again)
    var createIDmaker = function(startId) {
        startId = startId || 1; // startId is a private variable
        var currentId = startId;
        var getNext = function() { // private function
            return ++currentId;
        };
        
        // public members and functions
        return {
            getNext: getNext,
            reset: function() {
                currentId = startId;
            }
        };
    };
    
    var idMaker = createIDmaker(5);
    var id1 = idMaker.getNext(); // id1 == 5
    var id2 = idMaker.getNext(); // id2 == 6
    idMaker.reset();
    var id3 = idMaker.getNext(); // id3 == 5
    useId(idMaker.getNext); // this works
    
    // OVER THIS
    // make sure constructor functions start with a capital. 
    // Calling this without the "new" keyword will pollute the global scope
    var IDMaker = function(startId) {
        this.startId = startId || 0;
        this.currentId = startId;
    };
    IDMaker.prototype.getNext = function() {
        return ++this.currentId;
    };
    IDMaker.prototype.reset = function() {
        this.currentId = this.startId;
    };
    // everything is the same as above
    var idMaker = new IDMaker(5);
    var id1 = idMaker.getNext(); // id1 == 5
    var id2 = idMaker.getNext(); // id2 == 6
    idMaker.reset();
    var id3 = idMaker.getNext(); // id3 == 5
    
    // But, now I can change private members
    idMaker.currentId = 0;
    var id4 = idMaker.getNext() // id4 == 0 (oops!)
    // and passing functions as variables no longer works
    useId(idMaker.getNext); // error! currentId is undefined (when we pass getNext as a function, the "this" value changes to the global context)
    ```

6. Javascript is a functional language. Don't be afraid to pass functions as arguments to other functions. This can be used to create more generic objects/functions, and more decoupled code.

    ```JavaScript
    // using our previous IDmaker example
    // we now have a nextIdFunc, an optional function that accepts a number (currentId), and returns a number (nextId).
    // the nextIdFunc can compute the next id any way - adding, hashing, etc (decoupling)
    var createIDmaker = function(startId, nextIdFunc) {
        startId = startId || 1;
        var currentId = startId;
        // nextIdFunc is optional, if undefined, just use our old algorithm (adding one) for computing next id.
        nextIdFunc = nextIdFunc || function(id) { return id + 1; };
        
        var getNext = function() { // private function
            var oldId = currentId;
            currentId = nextIdFunc(currentId);
            return oldId;
        };
        return {
            getNext: getNext,
            reset: function() {
                currentId = startId;
            }
        };
    };
    
    var add5IdMaker = createIDmaker(0, function(id) { return id + 5; });
    var id1 = add5IdMaker.getNext(); // id1 == 0
    var id2 = add5IdMaker.getNext(); // id2 == 5
    ...
    ```
