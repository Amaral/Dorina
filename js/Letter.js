this.wmccann = this. wmccann || {};

(function(){

	var Letter = function(txtb, txtn) {
		this.initialize(txtb, txtn);
	};
	
	var p = Letter.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(txtb, txtn) {
		var self = this;
		this.Container_initialize();
		
		this.hidden = false;
		this.radius = 35;

		this.txtn = txtn;
		this.txtb = txtb;
		this.txtn.alpha = 0;
		this.txtb.alpha = 1;

	}

	p.hide = function() {
		var self = this;
		if(!self.hidden){
			self.hidden = true;
			createjs.Tween.get(self.txtn).to({alpha:1},200);
			createjs.Tween.get(self.txtb).to({alpha:0},200);
		};
	}

	wmccann.Letter = Letter;

}());
