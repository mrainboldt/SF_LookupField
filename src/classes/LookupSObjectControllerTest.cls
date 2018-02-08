@isTest
private class LookupSObjectControllerTest{

	@testSetup
	static void setup(){
		//UnitTestHelper should be used where available to create records.
		Account returned = new Account();
		returned.Name = 'find lookup';

		Account notReturned = new Account();
		notReturned.Name = 'hide lookup';

		insert new List<Account>{returned, notReturned};
	}

	@isTest
	static void test_lookup_success_noWhereClause(){
		//Arrange
		String searchString = 'fin';
		String sObjectAPIName = 'Account';

		//Act
		test.startTest();
		LookupSObjectController.SearchResult[] results =  LookupSObjectController.lookup(searchString, sObjectAPIName, '');
		test.stopTest();

		//Assert
		System.assertEquals(1, results.size(), '1 Account should have been returned.');
		System.assertEquals(results[0].SObjectLabel, 'find lookup', 'Account\'s name should be find lookup');

	}

	@isTest
	static void test_lookup_success_WhereClause(){
		//Arrange
		String searchString = 'fin';
		String sObjectAPIName = 'Account';
		String whereClause = 'OwnerId = \'' + UserInfo.getUserId() + '\'';

		//Act
		test.startTest();
		LookupSObjectController.SearchResult[] results =  LookupSObjectController.lookup(searchString, sObjectAPIName, whereClause);
		test.stopTest();

		//Assert
		System.assertEquals(1, results.size(), '1 Account should have been returned.');
		System.assertEquals(results[0].SObjectLabel, 'find lookup', 'Account\'s name should be find lookup');

	}

	@isTest
	static void test_lookup_searchString_Exception(){
		//Arrange		
		String searchString;
		String sObjectAPIName = 'Account';

		//Act
		test.startTest();
		LookupSObjectController.SearchResult[] results;
		String message = '';
		try{
			results =  LookupSObjectController.lookup(searchString, sObjectAPIName, '');
		}catch(Exception e){
			message = e.getMessage();
		}
		
		test.stopTest();

		//Assert
		System.assertEquals(null, results, 'results should be null');
		System.assertEquals('The search String cannot be blank.', message);

	}

	@isTest
	static void test_lookup_sObjectAPIName_Exception(){
		//Arrange		
		String searchString = 'fin';
		String sObjectAPIName;

		//Act
		test.startTest();
		LookupSObjectController.SearchResult[] results;
		String message = '';
		try{
			results =  LookupSObjectController.lookup(searchString, sObjectAPIName, '');
		}catch(Exception e){
			message = e.getMessage();
		}
		
		test.stopTest();

		//Assert
		System.assertEquals(null, results, 'results should be null');
		System.assertEquals('An object name must be provided.', message);

	}
}