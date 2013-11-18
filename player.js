function Player()
{
	$('#content').html(this._getHtml());
	this.autoPos        = 2;
	this.autoObj        = $('#driver');
	this.left           = '15px';
	this.middle         = '125px';
	this.right          = '230px';
	this.autoObj.css('marginLeft', this.middle);
}

Player.prototype =
{
	autoPos             : '',
	autoObj             : {},
	left                : '',
	middle              : '',
	right               : '',
	_animationDur       : 1,
	animationComplete   : true,

	_getHtml            : function ()
	{
		return '' +
		'<div id="driver">' +
		'   <img src="images/fahrer.png" alt=""/>' +
	    '</div>';
	},

	_animationCompleted : function (newPos)
	{
		if(typeof(newPos) != 'undefined'){
			this.autoPos  = newPos;
		}
		this.animationComplete = true;
	},

	animateToLeft       : function (position)
	{
		var $this = this;
		if(position == 2){
			this.autoObj.animate({'marginLeft': this.left}, this._animationDur, function(){
				$this._animationCompleted(1);
			});

		} else
		if(position == 3){
			this.autoObj.animate({'marginLeft': this.middle}, this._animationDur, function(){
				$this._animationCompleted(2);
			});
		} else {
			this._animationCompleted();
		}

	},

	animateToRight      : function (position)
	{
		var $this = this;
		if(position == 2){
			this.autoObj.animate({'marginLeft': this.right}, this._animationDur, function(){
				$this._animationCompleted(3);
			});
		} else
		if(position == 1){
			this.autoObj.animate({'marginLeft': this.middle}, this._animationDur, function(){
				$this._animationCompleted(2);
			});
		} else {
			this._animationCompleted();
		}

	}
}