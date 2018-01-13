# Markov Decision Process Rendering Library and Game for Javascript and the Web

A Markov Decision Process is a schocastic method encodes action policies from s to s'. I'll have a blog post when I'm done with this library on this. 

#### Libaries 

* jquery 
* math.js
* d3 
* node.js / express - for examples 

### Models

**Basic MDP**
* S: finite set of states
* A: finite set of actions
* P: SxA -> \Delta{S} A Markovian Transition Function
* P(s'|s,a) -> The probability of going to s' from s given action a. 
* R: AxS -> |R: Reward function
* R(a, s')  Reward abtained when a moves to s'

**POMDP**
Add an obsevation function and observation likeihood function

* \Omega: a finite set of observations
* O: An observation function
* O(o|a,s'): Probability of observing o when action a is taken to s'

**Dec-POMDP** and **Dec-POMDP-Com**
This library will eventually include examples for Dec-POMDP and Dec-POMDP-COM. 

### Policy Optimization

1. Value Iteration
2. Q Learning

### To Run

You can download the src file with

```git clone https://github.com/andorsk/mdp.git
   cd examples/simplegame/
   node serve.js
```

### Examples

* Grid Examples