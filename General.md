General style guide
====================

This is a general guide that applies to most (if not all) programming languages.

Why style matters
-------------------
Care about your code style. This is the real world, and not a class project. You/other people will read your code, debug it, modify it. The code may still be in use for the next 10+ years. Help yourself/other programmers understand what you are doing. How many programs are abandoned/rewritten because no one can understand/debug/modify old code.

Libraries
----------------
If the problem you are facing seems common (i.e. validating email address, string manipulation, searching arrays, etc.) 
there is a library for it. Find it, do not reivent the wheel.

Programming language
----------------------
Work with a language/framework, not against it. Learn the language you are using, it's styles, it's nuances. Do not assume that all languages are the same. Different languages are created with different motivation, to solve different problems. A style acceptable in one language may not be in another language.

Never use a language feature just for the sake of using it. Use it because it simplifies code, and because it is the right feature for the job. Simple code that uses simple language features is better than complicated code with complicated language features.

Functions
--------------
Use functions to document what code is doing, even if the function is used only in one place. Functions should generally be not more than 10 lines long. Long functions shows lack of abstraction (it's a sign of bad code). Keep everything in a function at the same level of abstraction (i.e. ask yourself what should the function know, and what should a lower-level function know). If you find yourself commenting on what a section of code is doing, it probably needs to be refactored as a function. If you are passing too many parameters between functions (functions should generally have between 1-3 parameters) you probably need an object or struct with the parameters as members.

Comments
-------------
Use comments sparingly. Code should be self documentating with good function and variable names (if you think it's not, it's one of the signs of bad code). If you are commenting on what a section of code is doing, refactor the section into a function and give it a good name. Comment only if the code is doing non-obvious things (i.e. a corner case, or a rarely used syntax). It is also good to document each function, especially if it is public.

Do not comment out unused code, delete it, even if you think you may need it in the future. You should be using version control (don't read this style guide if you are not), so it should be easy to get back to you old code. Commented out code tends to accumulate, be outdated, and ends up as nothing but a distraction.

Performance
----------------
Clean code is more important than high performance code. Clean code can always be optimized later after profiling. Do not think too hard about performance, while writing convoluted code in the process. The code may not even be the bottleneck of the program. Write clean code first, profile and optimize later.

Object-oriented design
---------------------------
Encapsulate ideas in objects (data and operations on the data/member variables and member functions). Put strict restrictions on how other code (user code) operate on the object (private/public access). This will help prevent invariants (what you assume about state of the object) from being broken by other code. DO NOT put getters and setters for all data members. This breaks encapsulation. Spend time to think about the object design, requirements and how it may change in the future.

When designing classes, think ahead about how features will be added/changed in the project. Adding a feature should require adding code, not modifying it. Adding a feature should not break any other components of the project

Decouple interface from implementation. This will allow easy testing, mocking, and changing implementation (statically or dynamically) without change in user code. Doing this require more effort in statically typed languages than dynamically typed (look at specific language guide). 
