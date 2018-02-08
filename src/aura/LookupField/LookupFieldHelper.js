({
	init : function(component, event){
		var selectedObject = component.get("v.selectedObject");
		var selectedId;
		var selectedLabel;
		if(selectedObject){
			selectedId = selectedObject.Id;
			selectedLabel = selectedObject.Name;
			component.set("v.selectedId", selectedId);
			component.set("v.selectedLabel", selectedLabel);
		}

		//if there is already a selected record show the pill
		if(selectedId){
			var selectedElement = component.find("lookup-pill");
			$A.util.removeClass(selectedElement, 'slds-hide');

			var lookupElement = component.find("lookup");
			$A.util.addClass(lookupElement, 'slds-hide');

			var inputElement = component.find('lookup-div');
			$A.util.addClass(inputElement, 'slds-has-selection');
		}

	},

	search : function(component, event) {
		// Get the search string, input element and the selection container
		var searchString = component.get("v.searchString");
		var inputElement = component.find('lookup');
		var lookupList = component.find("lookuplist");
		var lookupListItems = component.find("lookuplist-items");

		// Clear any errors 
		inputElement.set('v.errors', null);

		// min 3 characters is required for an effective search
		if (typeof searchString === 'undefined' || searchString.length < 3){
			// Hide the lookuplist
			$A.util.removeClass(lookupList, 'slds-show');
			component.set('v.selectedId',null);
			component.set('v.selectedLabel', null);
			return;
		}

		// Show the lookuplist
		$A.util.addClass(lookupList, 'slds-show');

		// Get the API Name
		var sObjectAPIName = component.get('v.sObjectAPIName');

		var whereClause = component.get('v.whereClause');


		// Create an Apex action
		var action = component.get("c.lookup");

		// Mark the action as abortable, this is to prevent multiple events from the keyup executing
		action.setAbortable();

		// Set the parameters
		action.setParams({ "searchString" : searchString, "sObjectAPIName" : sObjectAPIName, "whereClause": whereClause});

		// Define the callback function
		action.setCallback(this, function(response) {
			var state = response.getState();

			// Callback succeeded
			if (component.isValid() && state === "SUCCESS"){
				// Get the search matches
				var matchingResult = response.getReturnValue();

				// If we have no matches, return
				if (matchingResult.length == 0){
					component.set('v.results', null);
					return;
				}

				// Set the results in matchingResult attribute of component
				component.set('v.results', matchingResult);
			}else if (state === "ERROR"){ // Handle any error 
				var errors = response.getError();

				if (errors) {
					if (errors[0] && errors[0].message) {
						this.displayErrorDialog('Error', errors[0].message);
					}
				}else{
					this.displayErrorDialog('Error', 'Unknown error.');
				}
			}
		});

		// Enqueue the action 
		$A.enqueueAction(action);
	},
 
	doSelection : function(component, event) {
		// Resolve the Object Id from the events Element Id (this will be the &amp;lt;a&amp;gt; tag)
		var recId = this.getSelectedRecordId(event.currentTarget.id);
		// The Object label is the 2nd child (index 1)
		var recLabel = event.currentTarget.innerText;
		// Log the Object Id and Label to the console
		console.log('recId=' + recId);
		console.log('recLabel=' + recLabel);
		//set the selected record Id
		component.set('v.selectedId',recId);
		component.set('v.selectedLabel', recLabel);

		// Update the Searchstring with the Label
		component.set("v.searchString", recLabel);

		// Hide the Lookup List
		var lookupList = component.find("lookuplist");
		$A.util.removeClass(lookupList, 'slds-show');

		// Hide the Input Element
		var inputElement = component.find('lookup');
		$A.util.addClass(inputElement, 'slds-hide');

		// Show the Lookup pill
		var lookupPill = component.find("lookup-pill");
		$A.util.removeClass(lookupPill, 'slds-hide');

		// Lookup Div has selection
		var inputElement = component.find('lookup-div');
		$A.util.addClass(inputElement, 'slds-has-selection');

		// Create the ClearLookupId event
		var updateEvent = component.getEvent("updateLookupEvent");

		// Fire the event
		updateEvent.fire();

	},

	clearSelection : function(component) {
		// Create the ClearLookupId event
		var updateEvent = component.getEvent("updateLookupEvent");
		component.set('v.selectedId', null);
		component.set('v.selectedLabel', null);
		component.set('v.selectedObject', null);

		// Fire the event
		updateEvent.fire();

		// Clear the Searchstring
		component.set("v.searchString", null);
		
		// Hide the Lookup pill
		var lookupPill = component.find("lookup-pill");
		$A.util.addClass(lookupPill, 'slds-hide');

		// Show the Input Element
		var inputElement = component.find('lookup');
		$A.util.removeClass(inputElement, 'slds-hide');

		// Lookup Div has no selection
		var inputElement = component.find('lookup-div');
		$A.util.removeClass(inputElement, 'slds-has-selection');
	},

	/**
	* Resolve the Object Id from the Element Id by splitting the id at the _
	*/
	getSelectedRecordId : function(recId){
		var i = recId.lastIndexOf('_');
		return recId.substr(i+1);
	},

	/**
	* Display a message
	*/
	displayErrorDialog : function (title, message){
		var toast = $A.get("e.force:showToast");

		// For lightning1 show the toast
		if (toast){
			//fire the toast event in Salesforce1
			toast.setParams({
				"title": title,
				"message": message
			});

			toast.fire();
		}else{ // otherwise throw an alert
			alert(title + ': ' + message);
		}
	},

	hide : function(component, event){
		var lookupList = component.find("lookuplist");
		$A.util.removeClass(lookupList, 'slds-show');
	}
})