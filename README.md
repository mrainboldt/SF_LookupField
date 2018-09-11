# SF_LookupField
Salesforce Lightning Component for lookup fields

* updateLookup
  * Event to pass data from the lookup field to its parent component

* LookupField
  * Component that creates and manages the data for the Lookup Field
  
* LookupForm
  * An example of implementing a single instance of the LookupField component
  
* LookupTable
  * An example of implementing the LookupField within aura:iteration
  

#Example of saving record with controller
@AuraEnabled
public static void save(String saveRecord)
{
   Contact contact = (Contact)JSON.deserialize(saveRecord, Contact.class);
   //this is required, because you can either have AccountId or Account.Id populated but not both
   contact.Account = null;

   upsert contact;
}
