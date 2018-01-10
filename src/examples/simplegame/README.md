### Simple Markov Game

This is the base markov model game.

To run: Have node.js installed.

Simple type node serve.js and open your webbrowser to:

localhost://1337

Voila!

The page serves static content from two locations: 

From the root directory of the git repo, it contains the base libraries and content. 

../../public -- contains the global libraries and css
./public -- contains the local files to the project 

This design choice was made so that you an make project specific settings and html and additionally have reusable code in for other projects in the global public folder. 