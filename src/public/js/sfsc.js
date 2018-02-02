/**
Stochastic Finite State Controller
----------------------------------
STSC contains a policy model for each temporal frame. 
           ________
     ___t1/       /    | layer 1
    /    /__x__l_/     |
 t2/__x__o_/           | layer 2

Each finite state controller has a mapping between layers. In an infinite game, you loop t_n so that t_n connects with t1. 
Refer to http://papers.nips.cc/paper/4297-periodic-finite-state-controllers-for-efficient-pomdp-and-dec-pomdp-planning.pdf
For more infomration on how Finite State Controllers works. 

Each controller will control an agent. 
*/

class PeriodicFiniteStateController {
	/**
	*@layers: The amount of layers in a finite state controller. 
	*/
	init(layers){

	}
}


class FiniteStateLayer {

}

class ControllerNodes {


}

