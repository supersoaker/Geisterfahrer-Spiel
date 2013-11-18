
/********ENEMY*********/
function Enemy()
{
	Enemy.incrementId++;
	this.id        = Enemy.incrementId;
	this.carNumber = Math.floor((Math.random()*10)+1),
	this.road      = Math.floor((Math.random()*3)+1),
	this.obj       = this.generateHtml();
}

Enemy.prototype =
{
	id            : 0,
	carNumber     : 0,
	road          : 0,
	obj           : '',

	generateHtml : function ()	{
		var margin =
			(this.road == 1 ? '-5px' :
				(this.road == 2 ? '100px' :
					(this.road == 3 ? '205px' : '')
					)
				);
		var html =
			'<div class="enemy" data-route="'+ this.road +'">' +
				' <img style="margin-left:'+ margin +';"' +
				' src="images/'+ this.carNumber +'.png" alt=""/> ' +
				'</div>';
		return $(html);
	},

	remove        : function () {
		this.obj.remove();
	}

}

Enemy.incrementId = 0;