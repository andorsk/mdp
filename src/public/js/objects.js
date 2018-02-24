 //Square object used for rendering boxes 
 function Square(sidelength) {
     this.length = sidelength;
 }

 function Rectangle(width, height) {
     this.width = width;
     this.height = height;
 }



 class State {

     constructor(statedata, description = "") {
         this.statedata = statedata;
         this.value = 0;
         this.description = description;
         this.converged = false;
         this.id = null;
         this.ref = {}
     }

     setId(id) {
         this.id = id
     }

     setReferenceIndex(guid, index) {
         this.ref[guid] = index
     }

     getReferenceIndex(guid) {
         return this.ref[guid]
     }

     clone() {
         return $.extend(true, {}, this)
     }

     setValue(val) {
         this.value = val;
     }

     getValue() {
         return this.value;
     }

     getStateData() {
         return this.statedata;
     }

     getStateDataHash() {
         return hashCode(JSON.stringify(this.statedata))
     }
     setName(name) {
         this.name = name;
     }

     setOccupied(agent) {
         this.statedata['occupied'] = agent;
     }

     setUnoccupied() {
         this.statedata['occupied'] = false;
     }

     addInfo(key, val) {
         this.statedata[key] = val;
     }

     getOccupiedAgent() {
         return this.statedata['occupied']
     }

     isOccupied() {
         if (this.statedata['occupied'] != false || this.statedata['occupied'] != 'undefined') {
             return true;
         } else {
             return false;
         }
     }

     setConverged(bool) {
         this.converged = bool;
     }
 }


 //Action is a action function tied to an agent.
 function Action(id, name, action, description = "") {
     this.id = id;
     this.name = name;
     this.action = action;
     this.description = description;
 }

 var pathcost; // set up the path cost with the transition matrix (of state size state.length, state.length)
 //this is to encode variety of pathing costs with associated with a transition between one state and another state. 
 //end is a transition matrix with path costs.