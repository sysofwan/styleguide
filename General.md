General style guide
====================

This is a general guide that applies to most (if not all) programming languages.

1. Care about your code style. This is the real world, and not a class project. You/other people will be reading your code, debug it, modify it. The code may still be in use for the next 10+ years. Help yourself/other programmers understand what you are doing. How many prograns are abandoned/rewritten because no one can understand/debug/modify old code.

2. If the problem you are facing seems common (i.e. validating email address, string manipulation, searching arrays, etc.) 
there is a library for it. Find it, do not reivent the wheel.

3. Encapsulate ideas in objects (data and operations on the data/member variables and member functions). Put strict restrictions on how other code (user code) operate on the object (private/public access). This will help prevent invariants (what you assume about state of the object) from being broken by other code. DO NOT put getters and setters for all data members. This breaks encapsulation. Spend time to think about the object design, requirements and how it may change in the future.
