({
	/**
	*sets any intial values that were passed, renders components based on values
	*/
	init : function(component, event, helper){
		helper.init(component, event);
	},

	/**
	* executes the query
	*/
	search : function(component, event, helper){
		helper.search(component, event);
	},
 
	/**
	* Select an SObject from a list
	*/
	select: function(component, event, helper) {
		helper.doSelection(component, event);
	},

	/**
	* Clear the currently selected SObject
	*/
	clear: function(component, event, helper) {
		helper.clearSelection(component); 
	},

	/**
	* hides the list if users clicks away
	**/
	hideList : function(component, event, helper){
		helper.hide(component, event);
	},

	/**
	* handles changes to the selected Object if component loads
	* before parent component has finished
	*/
	selectedObjectChange : function(component, event, helper){
		helper.init(component, event);
	}
})