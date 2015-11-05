'use strict';
var totalRate; //stores sum of all ratings 
var reviewCount; //number of reviews
var Review; //global variable for review object
$(document).ready(function() {
	//init parse
	Parse.initialize("DDBAPg3cA4j79epV0PBCA19vTWPZ33xgtfj5KBMo", "DmKwSGmqm657ZmO6W9NrmQ5sjj7mG0EGP5Z3KeZz");
	if (Parse.User.current() == null) { //redirects user to login page if not logged in
		window.location = 'index.html';
	}
    Review = Parse.Object.extend('Review');
	totalRate=0;
	reviewCount = 0;
	$('#revLogout').click(function() { //logout function
		Parse.User.logOut();
		window.location = 'index.html';
	});
	//sets up raty on page
	$("#rate").raty();
	$(".reviewStars").raty({
		readOnly: true,
	});
	var buttonAdd = $("#addReview");
	loadPage();
	//function when review submitted
	$('#writeReview').submit(function() { 
		var rev = new Review();
		var rateScore = parseInt($('#rate').raty("score"));
		if(isNaN(rateScore)){
			rateScore = 0;
		}
		var currentUser = Parse.User.current();
		rev.set("rating", rateScore);
		rev.set("review", $('#review').val());
		rev.set("helpfulVotes", 0);
		rev.set("totalVotes", 0)
		rev.set("user",  currentUser);
		rev.set("authorName", currentUser.get('username'));
		rev.set('voters', []);
		rev.save(null, {
			success:loadPage
		})
		return false;
	});
	//var buttonLogOff = $("#revLogout");
	//buttonLogOff.click(function() {
    //    Parse.User.logOut();
	//	document.location.href= '../index.html';
    //});
});
function loadPage(){//loads past reviews
	var query = new Parse.Query(Review);
	$("#rate").raty();
	$('textarea').val('');//clears area
	query.find({
		success:function(results) {
			fillRevs(results)
		} 
	})
}
var fillRevs = function(data) {
		$('#revs').empty();
		//cycles through reviews to display data
		data.forEach(function(d){

			addItem(d);

		})
}
//adds review to page, uses moustache template
var addItem = function(d){
	reviewCount++;//counts number of reivews present
	var revText = d.get('review');
	var revRate = d.get('rating');
	var helpVote = d.get('helpfulVotes');
	var totalVote = d.get('totalVotes');
	var reviewId = reviewCount;
	var author = d.get('authorName');
	var voters = d.get('voters');
	var userObj = d.get('user');
	totalRate+=revRate;
	//uses moustache template to display reviews
	var template = "<div class=\"aReview\"><div class=\"row rowOne\"><div class=\"revName col-xs-11\">{{name}}</div><div class=\"col-xs-1\"><button type=\"button\" class=\"btn btn-default loginButton revButton delButton\" id=\"delButton{{myId}}\"><span class=\"glyphicon glyphicon-remove\"></span></button></div></div><hr /><div class=\"row\"><div id=\"rate{{myId}}\" class=\"col-sm-12 reviewStars\"></div></div><div class=\"row\"><div class=\"revText col-sm-12\">{{reviewText}}</div></div><div class=\"row\"><div class=\"col-xs-1\"><button type=\"button\" class=\"btn btn-default loginButton revButton thumbButton\" id=\"thumbsUpButton{{myId}}\"><span class=\"glyphicon glyphicon-thumbs-up\"></span></button></div><div class=\"col-xs-1\"><button type=\"button\" class=\"btn btn-default loginButton revButton thumbButton\" id=\"thumbsDownButton{{myId}}\"><span class=\"glyphicon glyphicon-thumbs-down\"></span></button></div></div><div class=\"row\"><div class=\"col-xs-5 helpful\">{{help}} out of {{total}} found this review helpful</div></div></div>"
	var rev1 = { //template values
		name: author,
		reviewText: revText,
		help: helpVote,
		total: totalVote,
		myId: reviewId,
	}
	//displays review on page
	var html = Mustache.to_html(template, rev1);
	var id = "#rate" + reviewId;
	$('#revs').append(html);
	var rateScore = parseInt(revRate);
	$(id).raty({
		readOnly: true,
		score: rateScore
	});
	//finds ids for relevant buttons
	var idDel = "#delButton"+reviewId;
	var idDown ='#thumbsDownButton'+reviewId;
	var idUp ='#thumbsUpButton'+reviewId;
	//functions to control voting, deleting, anf managing access
	//users can only vote once and can't vote on their own
	//only author can delete 
	$(idUp).click(function() {
		var curr = Parse.User.current().id;
		if(curr == userObj.id){
			alert('You cant vote on your own!');
		}
		else if($.inArray(curr, voters) != -1){
			alert('You already voted!');
		} else {
			d.set("helpfulVotes", (helpVote + 1));
			d.set("totalVotes", (totalVote + 1));
			voters.push(curr);
			d.set("voters", voters);
			d.save(null, {
				success:loadPage
			})
		}
		
	})
	$(idDown).click(function() {
		var curr = Parse.User.current().id;
		if(curr == userObj.id){
			alert('You cant vote on your own!');
		}
		else if($.inArray(curr, voters) != -1){
			alert('You already voted!');
		} else {
			d.set("totalVotes", (totalVote + 1));
			voters.push(curr);
			d.set("voters", voters);
			d.save(null, {
				success:loadPage
			})
		}
	})
	$(idDel).click(function() {
		var curr = Parse.User.current().id;
		if(curr == userObj.id){
			d.destroy({
				success:loadPage
			})
		} else {
			alert("you can't do that!");
		}
	})		
	//displays average rating	
	var average = parseInt((totalRate/reviewCount), 10);
	if(isNaN(average)){
		average = 0;
	}
	$('#avRate').raty({
		readOnly: true,
		score: average
	});
				
				
				
				
				
}

