(function() {

	// STARTUP

})();

var game;
var username = '';
$(document).ready(function(){

	$('#start-button').click(function(){
		var name = $('#name').val();
		username = name;
		console.log('1');
		console.log(username);
		$('#welcome').addClass('hidden');
		$('#game').removeClass('hidden');
		$('#content').addClass('animation');
		game = new Game();
	});

	$('#again-button').click(function(){
		$('#gameover').addClass('hidden');
		$('#game').removeClass('hidden');
		$('#content').removeClass('pause');
		game = new Game;
	});
});
function ende (){
	if(username != ''){
		$('#highscores').css('display', 'block');
		$.ajax({
			type     : 'Post',
			url      : 'highscore.php',
			data     : { 'username' : window.username, 'score' :  game._score},
			dataType : 'json',
			success  : function(data)
			{
				$('#dropdown1').html(getHtmlScoreTable(data.top20, true));
				$('#dropdown2').html(getHtmlScoreTable(data.user[username]));
			}
		});
	} else {
		$('#highscores').css('display', 'none');
	}
	$('#meters').text(game._score + ' Meter !');
	$('#game').addClass('hidden');
	$('#gameover').removeClass('hidden');
	$('#content').empty();
	$('#score h1').text(0);
	Enemy.incrementId = 0;
	window.game = null;
}
function getHtmlScoreTable (scoreArr, top20) {
	var l    = scoreArr.length,
		i    = 0,
		html = '' +
			'' +
			'<table class="table">' +
			'   <colgroup>' +
			'       <col width="50">' +
			'       <col width="325">' +
			'       <col width="50">' +
			'   </colgroup>';
	if(top20){
		html+= '' +
			'   <thead>' +
			'       <tr>' +
			'           <th>#</th>' +
			'           <th>Name</th>' +
			'           <th>Score</th>' +
			'       </tr>' +
			'   </thead>' +
			'   <tbody>';
		for(i; i < l; i++){
			html+= '' +
				'       <tr>' +
				'           <th>'+ (i+1) +'</th>' +
				'           <th>'+ scoreArr[i].name  +'</th>' +
				'           <th>'+ scoreArr[i].score +'</th>' +
				'       </tr>';
		}
	} else {
		html+= '' +
			'   <thead>' +
			'       <tr>' +
			'           <th>#</th>' +
			'           <th>Datum</th>' +
			'           <th>Score</th>' +
			'       </tr>' +
			'   </thead>' +
			'   <tbody>';
		for(i; i < l; i++){
			console.log(scoreArr[i])
			var dateArr = scoreArr[i].date.split('|')[0].split('/'),
				time    = scoreArr[i].date.split('|')[1],
				year    = dateArr[0],
				month   = dateArr[1],
				day     = dateArr[2],
				date    = day+'.'+month+'.'+year;
			html+= '' +
				'       <tr>' +
				'           <th>'+ (i+1) +'</th>' +
				'           <th>' +
				'                   <div class="date"> Am '+ date +' </div>' +
				'                   <div class="time">um '+ time +' </div>' +
				'           </th>' +
				'           <th>'+ scoreArr[i].score +'</th>' +
				'       </tr>';
		}
	}
	html+= '' +
			'   </tbody>'+
			'</table>';
	return html;
}
function log() {
	console.log(arguments);
}
