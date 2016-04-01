Javascript Style Guide
=============================
This file describes general JS guidelines. See files with specific library names for library guidelines.

1. Everything outside a function in Javascript is global. Do not declare any function/variables outside a function.
2. Use self-invoking functions to avoid global code

        // DO THIS
        (function() {
            var a = 1;  // does not pollute global environment
            console.log('hello!'); // will run
        }());
        // NOT THIS
        var a = 1;  // anyone accidentally use 'a' as a variable name will get a surprise
        console.log('hello!'); // will run
