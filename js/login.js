//logs user in 
$(document).ready(function() {
	Parse.initialize("DDBAPg3cA4j79epV0PBCA19vTWPZ33xgtfj5KBMo", "DmKwSGmqm657ZmO6W9NrmQ5sjj7mG0EGP5Z3KeZz");
	//if user already logged in, takes them to review page
	if (Parse.User.current() != null) {
		window.location = 'uranium.html';
	} 
	$('#loginForm').submit(function() {
		login();
		return false;
	});
	//redirects user to register if reg button clicked
	$('#regButton').click(function() {
		window.location = 'register.html';
	});

});
//logs in user
function login(){
		var name = $('#loginName').val();
		var pass = $('#loginPassword').val();
		Parse.User.logIn(name, pass, {
			success: function(user) {
				window.location = 'uranium.html';
			},
			error: function(error) {//if wrong user/pass
				alert("Incorrect username/password :(");
			}
		});
}

