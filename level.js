/********ENEMY*********/
function Level()
{
	this._animationDur = this._fadeInDur
						+ this._delayDur
						+ this._fadeOutDur;
}

Level.prototype =
{
	_animationDur : 0,
	_fadeInDur  : 400,
	_fadeOutDur : 400,
	_delayDur : 1000,

	lvlUpAnimation : function (jqueryObj) {
		jqueryObj.fadeIn(  this._fadeInDur )
				 .delay(   this._delayDur  )
				 .fadeOut( this._fadeOutDur, function () {
			jqueryObj.remove();
		});
	},

	appendLvlToContent : function (lvlNr, contentObj) {
		var html =
		'<div id="level" style="display: none;">'+
		'	<div>'+
		'		<h2>Level </h2>'+
		'		<h2 id="levelNumber">'+ lvlNr +'</h2>'+
		'   </div>'+
		'</div>';
		contentObj.append(html);
		this.lvlUpAnimation($('#level'));
		return this._animationDur;
	}
}