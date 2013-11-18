function Game()
{
	this._counterObj    = $('#score h1');
	this._contentObj    = $('#content');

	this._player        = new Player();
	this._Level         = new Level();
	this._started       = false;
	this._score         = 0;
	this._level         = 0;
	this._levelLength   = 10000;
	this._enemyArr      = [];
	// the Enemy-Speed at the beginning
	this._enemySpeed    = 3000;
	// (this._enemySpeed -= this._speedIncrease) each level
	this._speedIncrease = 600;
	// the miliseconds till the next enemy
	this._enemyRepeat   = 3000;
	this._goFaster      = false;
	this._intervalsObj  = {};

	this._addKeyControl();
	this._setLvlUp();
}

Game.prototype =
{
	_player             : {},
	_Level              : {},
	_started            : false,
	_score              : 0,
	_level              : 0,
	_levelLength        : 0,
	_counterObj         : {},
	_contentObj         : {},
	_enemyArr           : [],
	_enemySpeed         : 0,
	_speedIncrease      : 0,
	_enemyRepeat        : 0,
	_goFaster           : false,
	_intervalsObj       : {},




/* Startup Functions Begin
 */
	_addKeyControl      : function () {

		var Player = this._player;
		$(document).bind('keyup', function(event) {
			if(!Player.animationComplete){
				return false;
			}
			var keyValue = event.keyCode;
			Player.animationComplete = false;
			if(keyValue == 37){
				Player.animateToLeft(Player.autoPos);
			} else
			if(keyValue == 39){
				Player.animateToRight(Player.autoPos);
			} else {
				Player.animationComplete = true;
			}
		});
		$("body").touchwipe({
			wipeLeft: function() { Player.animateToLeft(Player.autoPos); },
			wipeRight: function() { Player.animateToRight(Player.autoPos);},
			min_move_x: 20,
			min_move_y: 20,
			preventDefaultEvents: true
		});
	},

	_addIntervals       : function () {
		this._setEnemyInterval();

		this._moveStreetAnimation(true);

		this._intervalsObj.difficulty    = setInterval(this._levelDifficult.bind(this),
														this._levelLength);
		this._intervalsObj.crashChecker  = setInterval(this._addCrashChecker.bind(this),
														100);
		this._intervalsObj.scoreCounter  = setInterval(this._countScore.bind(this),
														1000);
	},
/* Startup Functions End
 */




/* Intervals Begin
 */
	/***Generating-Enemies Interval*/
	_setEnemyInterval   : function () {
		this._intervalsObj.generateEnemy = setInterval(this._generateEnemy.bind(this),
			this._enemyRepeat);
	},
	_unsetEnemyInterval : function () {
		clearInterval(this._intervalsObj.generateEnemy);
	},
	_generateEnemy      : function () {
		var $this    = this,
			enemy    = new Enemy(),
			enemyObj = enemy.obj;
		this._enemyArr.push(enemy);
		this._player.autoObj.before(enemyObj);

		enemyObj.animate({
			'marginTop' : '530px'
		}, this._enemySpeed, 'linear', function() {
			enemy.remove();
			for(var i=0; i < this._enemyArr.length; i++) {
				if(enemy.id == this._enemyArr[i].id) {
					this._enemyArr.splice(i, 1);
					break;
				}
			}
		}.bind(this));
	},


	/***Street-Moving Intervals*/
	_setMovingInterval  : function () {
//		this._intervalsObj.moveStreet = setInterval( this._moveStreetAnimation.bind(this),
//			this._enemySpeed+1000);
	},
	_unsetMovingInterval: function () {
//		clearInterval(this._intervalsObj.moveStreet);
	},
	_moveStreetAnimation: function (levelUp) {
		levelUp  = (typeof(levelUp)== 'undefined' ? false : true);
		// Hier gehta immer rein, wenn die
		// background-position wieder bei 600px ist
		console.log(levelUp)
		if(levelUp){}
		this._contentObj.css('animation-name', 'DO-NOTHING');
		var newDurationSec = (this._enemySpeed / 1000) + 1;
		this._contentObj.css('animation-duration', newDurationSec+'s');
		this._contentObj.css('animation-name', 'slidein');


			/* you have to set/unset the animation-name, to
	         * execute the whole animation again */

	},

	_levelDifficult      : function () {
		var levelUp = false;
		if(this._enemySpeed > 1500 ){
			levelUp = true;
			this._goFaster = true;
			this._enemySpeed -= this._speedIncrease;
		}
		if(this._enemyRepeat > 600 ){
			levelUp = true;
			this._unsetEnemyInterval();
			this._enemyRepeat -= 400;
			this._setEnemyInterval();
		}
		if(levelUp){
			this._setLvlUp();
		} else {
			console.warn('OpenEnd');
		}
	},

	_addCrashChecker    : function () {
		this._enemyArr.forEach(function(obj) {
			var enemy = obj,
				enemyObj = enemy.obj,
				enemyPos = parseInt(enemyObj.css('margin-top'));

			if(enemyPos > 310 && enemyPos < 500){
				if(enemy.road == this._player.autoPos){
					$(document).unbind("keyup");
					this._crash(enemy);
				}
			}
		}.bind(this));
	},

	_countScore         : function () {
		var scoreObj = this._counterObj,
			score    = parseInt(scoreObj.text());
		scoreObj.text(score += 10);
		this._score = score;
	},
/* Intervals End
 */



/* Level&Pause Functions Begin
 */
	_setLvlUp : function () {
		this._level++;
		var level           = this._level,
			animationDur    = this._Level.appendLvlToContent(level, this._contentObj);
		if(level <= 10){
			$('#tacho img').attr('src', 'images/tacho/'+ level +'.png');
		}
		this._pauseGame(animationDur);
	},

	_pauseGame : function (duration) {
		duration = (typeof(duration) == 'undefined' ? false : duration);
		this._clearIntervals();
		this._contentObj.addClass('pause');

		if(duration){
			this._setNewLevel(duration);
		}
	},

	_setNewLevel     : function (duration) {
		this._enemyArr.forEach(function(obj) {
			var enemy   = obj,
				DOM_Obj = enemy.obj;
			DOM_Obj.remove();
		});
		this._enemyArr = [];
		window.setTimeout(function(){
			this._beginPausedGame();
		}.bind(this), duration);
	},

	_beginPausedGame : function () {
		this._addIntervals();
		this._contentObj.removeClass('pause');
		this._levelLength += 5000;
	},
/* Level&Pause Functions End
 */


/* Game Over Functions Begin
 */
	_crash              : function (enemy) {
		var playerTop  = Math.floor(this._player.autoObj.offset().top),
			playerLeft = this._player.autoObj.css('margin-left'),
			html = '' +
			'<div class="explosion" style="margin: '+ playerTop +'px 0 0 '+ playerLeft +';">' +
			'   <img src="images/explosion.gif" alt=""/>' +
			'</div>',
			$this = this;

		this._contentObj.append(html);

		$('.enemy').each(function(){
			var route = $(this).data('route');
			if(route == enemy.road){
				$(this).stop(true, false);
			}
		});

		this._pauseGame();

		setTimeout(function(){
			$('.explosion').remove();
			console.log('GANME OVR');
			this._endGame();
		}.bind(this), 800)
	},

	_clearIntervals     : function () {
		for(var i in this._intervalsObj) {
			clearInterval(this._intervalsObj[i]);
		}
	},

	_endGame            : function () {
		window.ende();
	}
/* Game Over Functions End
 */
}