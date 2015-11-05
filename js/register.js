//allows user to register
$(document).ready(function() {
	Parse.initialize("DDBAPg3cA4j79epV0PBCA19vTWPZ33xgtfj5KBMo", "DmKwSGmqm657ZmO6W9NrmQ5sjj7mG0EGP5Z3KeZz");
	//$('#regAlert').css("visibility", "hidden");
	$('#regSubmitButton').click(function() {
		var name = $('#regName').val();
		var pass = $('#regPassword').val();
		if (name != "" && pass != "") { //name and password cannot be blank
			var newUser = new Parse.User();
			newUser.set('username', name);
			newUser.set('password', pass);
			newUser.signUp(null, {
				success: function() {
					Parse.User.logIn(name, pass, {
						success: function(user) {
							window.location = 'uranium.html';
						}
					});
				}
		});
		} //else {

			//$('#regAlert').css("visibility", "visable");
		//}
	});
	//logs user in after signup
	function login(name, pass){
		Parse.User.logIn(name, pass, {
			success: function(user) {
				window.location = '../uranium.html'; //takes user to review page
			}
		});
	}
});