JQuery Style Guide
====================

This file is a style guide for the [JQuery](https://jquery.com/) framework (I prefer DOM manipulation library). Along with this guide is a [TodoMVC](http://todomvc.com/) [project](jquery).  

General
--------
JQuery is one of the most popular Javascript libraries, used for DOM manipulation. The framework helped developers get around the inconsistencies of the DOM API of different browsers, and gives simple selector based abstraction for DOM manipulation. JQuery is simple and easy to learn. With a few hours of learning, developers can easily created interactive web pages.

With this simplicity, developers often feel like they are programming in JQuery and not in Javascript. They fail to learn Javascript's abstraction mechanisms, and they fail to think about abstractions/seperation of concerns when writing in "JQuery." This is fine for small projects, but as projects get more complicated, and the design and requirements for a project changes, developers will find it harder and harder to add features and change JQuery code. They will find that any changes to the HTML structure will immediately break their code. They will find it harder to follow what the JQuery code is doing, and harder to fix bugs related to it.
