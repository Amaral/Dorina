this.wmccann = this. wmccann || {};

(function(){

	var Main = function(params) {
		this.initialize(params);
	};
	
	var p = Main.prototype;
	

	p.initialize = function(params) {
		
		this.stage = null;
		this.containerN = null;
		this.containerBMask = null;
		this.containerB = null;
		this.braile = null;
		this.text = null;
		this.queue = null;
		this.letters = [];
		this.squares = [];
		this.setupCanvas();
		this.setupEvents();
		this.mouseX = 0;
		this.mouseY = 0;
		this.isTouching = false;

		this.rectMouse = {};
		this.rectCollision = {};

		this.oldPoint = {x:0,y:0};
		this.currentPoint = {x:0,y:0};
		this.endInteraction = false;

	}

	p.setupEvents = function() {
		var self = this;

		window.addEventListener('touchstart', function(event) {
			self.isTouching = true;
			if (event.targetTouches.length == 1) {
			    var touch = event.targetTouches[0];
		  		self.mouseX = self.oldPoint.x = touch.pageX - self.stage.x;
		   		self.mouseY = self.oldPoint.y = touch.pageY - self.stage.y;
		   	}
		});

		window.addEventListener('touchend', function(event) {
			self.isTouching = false;
			self.rect1.graphics.clear();
		});

		document.getElementById('hit').addEventListener('touchmove', function(event) {
			
			if (event.targetTouches.length == 1) {
			    var touch = event.targetTouches[0];
			    
			    self.mouseX = touch.pageX - self.stage.x;
				self.mouseY = touch.pageY - self.stage.y;;

				if(self.isTouching) {
					for (var i = self.letters.length - 1; i >= 0; i--) {

						if(self.checkCollision(self.letters[i])){
							self.letters[i].hide();

							self.letters.splice(i,1);
						};
					};
					if(self.letters.length == 0 && !self.endInteraction) {
						self.endInteraction = true;
						self.closeFrame1();
					}
				}
				event.preventDefault();
			}
		});

		



		window.addEventListener('mousedown', function(event) {
			self.isTouching = true;
			var touch = event;
		  	self.mouseX = self.oldPoint.x = touch.pageX - self.stage.x;
		   	self.mouseY = self.oldPoint.y = touch.pageY - self.stage.y;
		});

		window.addEventListener('mouseup', function(event) {
			self.isTouching = false;
			self.rect1.graphics.clear();
		});

		document.getElementById('hit').addEventListener('mousemove', function(event) {
			
		
		    var touch = event;
		    
		    self.mouseX = touch.pageX - self.stage.x;
			self.mouseY = touch.pageY - self.stage.y;;

			if(self.isTouching) {
				for (var i = self.letters.length - 1; i >= 0; i--) {

					if(self.checkCollision(self.letters[i])){
						self.letters[i].hide();

						self.letters.splice(i,1);
					};
				};
				if(self.letters.length == 0 && !self.endInteraction) {
					self.endInteraction = true;
					self.closeFrame1();
				}
			}
			event.preventDefault();
			
		});

		window.addEventListener('resize', function(){
			self.resize();
		});
	}
	p.resize = function() {
		var canvas = document.getElementById('canvas');
		var w = window.innerWidth;
		var h = window.innerHeight;
		canvas.setAttribute('width',w);
		canvas.setAttribute('height',h);
		var hit = document.getElementById('hit');
		if(w < 900) {
			this.stage.x = -128;
			this.stage.y = 128;
			hit.style.width = '768px';
			hit.style.height = '1024px';
		}else {
			this.stage.x = 0;
			this.stage.y = 0;
			hit.style.width = '1024px';
			hit.style.height = '768px';
		}
	}
	p.checkLetter = function(x,y) {
		var obj = this.container.getObjectUnderPoint(x ,y);		
		if(obj != null) obj.parent.showLetter();
	}
	p.setupCanvas = function() {	

		this.stage = new createjs.Stage('canvas');
		//this.stage.enableDOMEvents(false);
		this.stage.enableMouseOver(0);
		this.containerN = new createjs.Container();
		this.containerB = new createjs.Container();
		this.containerBMask = new createjs.Container();

		this.rect1 = new createjs.Shape();
		this.rect2 = new createjs.Shape();
		
		this.stage.addChild(this.containerN);
		this.stage.addChild(this.containerB);
		this.containerB.mask = this.containerBMask;

		this.stage.addChild(this.rect1);
		this.stage.addChild(this.rect2);

		this.queue = new createjs.LoadQueue(false,'assets/');
		this.queue.addEventListener('complete', this.loadedImages.bind(this));
		this.queue.loadManifest([
		{
			id:'txt1_n', 
			src:'txt1_n.png'
		},
		{
			id:'txt1_b', 
			src:'txt1_b.png'
		},
		{
			id:'p1', 
			src:'p1.png'
		},
		{
			id:'p2', 
			src:'p2.png'
		},
		{
			id:'logo', 
			src:'logo.png'
		},
		{
			id:'logoabril', 
			src:'logoabril.png'
		},
		{
			id:'logoabril', 
			src:'logoabril.png'
		},
		{
			id:'s1', 
			src:'s1.png'
		}
		]);

		createjs.Ticker.addEventListener("tick", this.render.bind(this));
	}

	p.loadedImages = function(){

		this.phaseb = new createjs.Bitmap(this.queue.getResult("txt1_b.png"));
		this.phasen = new createjs.Bitmap(this.queue.getResult("txt1_n.png"));
		//this.phaseb = new createjs.Bitmap("assets/txt1_b.png");
		//this.phasen = new createjs.Bitmap("assets/txt1_n.png");
	//	this.containerN.addChild(this.phasen);
	//	this.containerB.addChild(this.phaseb);

		

		this.phaseb.x = (1024 - this.phaseb.image.width)/2;
		this.phaseb.y = (768 - this.phaseb.image.height)/2;

		this.phasen.x = (1024 - this.phasen.image.width)/2;
		this.phasen.y = (768 - this.phasen.image.height)/2;

		this.setup();
	}

	p.setup = function() {

		var self = this;
		self.resize();
		self.setupPhase1();
		this.setupPhase2();
		this.setupPhase3();
		this.setupPhase4();

		//this.setupFrame2();
		
	}

	p.setupPhase1 = function() {
		this.createLetter(412,277,45);
		this.createLetter(456,277,20);
		this.createLetter(507,277,29);
		this.createLetter(537,277,25);
		this.createLetter(561,277,27);
		this.createLetter(589,277,20);
	}

	p.setupPhase2 = function() {
		this.createLetter(270,337,28);
		this.createLetter(300,337,26);
		this.createLetter(350,337,26);
		this.createLetter(381,337,26);
		this.createLetter(409,337,24);
		this.createLetter(449,337,24);
		this.createLetter(475,337,24);
		this.createLetter(502,337,24);
		this.createLetter(528,337,24);
		this.createLetter(553,337,24);
		this.createLetter(579,337,24);
		this.createLetter(628,337,24);
		this.createLetter(654,337,24);
		this.createLetter(681,337,24);
		this.createLetter(707,337,42);
	}

	p.setupPhase3 = function() {
		this.createLetter(315,393,20);
		this.createLetter(340,393,25);
		this.createLetter(367,393,25);
		this.createLetter(415,393,25);
		this.createLetter(442,393,25);
		this.createLetter(470,393,27);
		this.createLetter(522,393,20);
		this.createLetter(545,393,27);
		this.createLetter(600,393,29);
		this.createLetter(630,393,27);
		this.createLetter(658,393,25);
		this.createLetter(685,393,23);
	}

	p.setupPhase4 = function() {
		this.createLetter(300,453,25);
		this.createLetter(354,453,22);
		this.createLetter(404,453,22);
		this.createLetter(430,453,22);
		this.createLetter(455,453,22);
		this.createLetter(482,453,23);
		this.createLetter(508,453,23);
		this.createLetter(564,453,23);
		this.createLetter(589,453,23);
		this.createLetter(617,453,23);
		this.createLetter(642,453,23);
		this.createLetter(670,453,23);
		this.createLetter(696,453,23);
	}

	p.closeFrame1 = function() {
		document.getElementById('hit').style.display = 'none';
		createjs.Tween.get(this.containerB).wait(2000).to({alpha:0},900)
		createjs.Tween.get(this.containerN).wait(2000).to({alpha:0},900).call(this.setupFrame2.bind(this));
	}

	p.setupFrame2 = function() {

		// this.guide = new createjs.Bitmap(this.queue.getResult('dorina_horizontal'));

		// this.stage.addChild(this.guide);

		this.p1 = new createjs.Bitmap(this.queue.getResult('p1'));
		this.p2 = new createjs.Container();
		var s = new createjs.Bitmap(this.queue.getResult('s1'));
		var img = new createjs.Bitmap(this.queue.getResult('p2'));
		this.p2.addChild(s);
		s.x = 255;
		img.y = 34;
		img.x = 49;

		this.p2.addChild(img);


		var hit = new createjs.Shape();
		hit.graphics.beginFill('#fff').drawRect(30,0,500,380);
		hit.alpha = 0.01;
		this.p2.addChild(hit);

		this.p3 = new createjs.Container();
		var logoDorina = new createjs.Bitmap(this.queue.getResult('logo'));
		var logoAbril = new createjs.Bitmap(this.queue.getResult('logoabril'));
		logoAbril.y = 200;
		logoAbril.x = 45;

		this.p3.addChild(logoDorina);
		this.p3.addChild(logoAbril);

		this.p1.x = 234;
		this.p1.y = 114;

		this.p2.x = 234;
		this.p2.y = 263;

		this.p3.x = 405;
		this.p3.y = 487;

		this.stage.addChild(this.p1);

		this.stage.addChild(this.p3);
		this.stage.addChild(this.p2);

		this.p2.addEventListener('click',function() {
			window.open('http://www.fundacaodorina.org.br');
		});


		this.p1.alpha = 0;
		this.p2.alpha = 0;
		this.p3.alpha = 0;

		createjs.Tween.get(this.p1).to({alpha:1},900);
		createjs.Tween.get(this.p2).wait(400).to({alpha:1},900);
		createjs.Tween.get(this.p3).wait(800).to({alpha:1},900);

	}
	p.getPosition = function(obj){
		var self = this;
		obj.alpha = 0.5;
		document.body.addEventListener('mousemove',function(e){
			obj.x = e.pageX;
			obj.y = e.pageY;
		});
	}

	p.createLetter = function(x, y, w) {
		var txtb = new createjs.Shape();

		var txtn = new createjs.Shape();
	
		txtn.x = txtb.x = this.phaseb.x;
		txtn.y = txtb.y = this.phaseb.y;
		//square.alpha = 0.7;

		//var txtb = this.phaseb.clone();
		
		txtb.graphics.beginBitmapFill(this.phaseb.image,"no-repeat").drawRect(x - 274 , y - 282, w, 35);
		txtn.graphics.beginBitmapFill(this.phasen.image,"no-repeat").drawRect(x - 278 , y - 282, w, 35);

		txtb.cache(x - 278 , y - 282, w, 35);
		txtn.cache(x - 278 , y - 282, w, 35);

		//txtb.sourceRect = new createjs.Rectangle(x - 276 , y - 282, w, 35);
		//console.log(txtb.sourceRect.x,txtb.sourceRect.y)
	//	txtb.x = x;
	//	txtb.y = y;


		this.containerB.addChild(txtb);

		this.containerN.addChild(txtn);
		//this.containerN.addChild(square);
		var l = new wmccann.Letter(txtb, txtn);
		this.letters.push(l);
		l.x = x;
		l.y = y;
		this.letters.push(l);
	}

	p.render = function() {		
		this.stage.update();
	}

	p.checkCollision = function(obj)
	{
		var radio = 20;

		if(this.oldPoint.x < this.mouseX) {
			this.rectMouse.x = this.oldPoint.x;
			this.rectMouse.width = this.mouseX - this.oldPoint.x;
		} else {
			this.rectMouse.x = this.mouseX;
			this.rectMouse.width = this.oldPoint.x - this.mouseX;
		}

		var distance = Math.sqrt(Math.pow(this.mouseY-this.oldPoint.y,2));

		if(distance > radio) {
		 	this.oldPoint.x = this.mouseX;
		 	this.oldPoint.y = this.mouseY;
		}

		this.rectMouse.y = this.mouseY - radio/2;
	
		this.rectMouse.height = radio;
		this.rectCollision.x = obj.x + radio/2;
		this.rectCollision.y = obj.y + radio/2;
		this.rectCollision.width = radio;
		this.rectCollision.height = radio;

		// this.rect1.graphics.clear();
		// this.rect1.graphics.beginFill('#FF0000').drawRect(this.rectMouse.x,this.rectMouse.y,this.rectMouse.width,this.rectMouse.height);
		// this.rect1.alpha = 0.5;

		// obj.shape.graphics.clear();
		// obj.shape.graphics.beginFill('#000000').drawRect(this.rectCollision.x,this.rectCollision.y,this.rectCollision.width,this.rectCollision.height);
		// obj.shape.alpha = 0.5;

		this.stage.addChild(obj.shape);

		if(this.rectOverlap(this.rectMouse,this.rectCollision)){
			return true;
		}
		return false;
	}

	p.valueInRange = function(value, min, max) { return (value >= min) && (value <= max); }

	p.rectOverlap = function(rectA, rectB)
	{

	    var xOverlap = this.valueInRange(rectA.x, rectB.x, rectB.x + rectB.width) ||
	                    this.valueInRange(rectB.x, rectA.x, rectA.x + rectA.width);

	    var yOverlap = this.valueInRange(rectA.y, rectB.y, rectB.y + rectB.height) ||
	                    this.valueInRange(rectB.y, rectA.y, rectA.y + rectA.height);

	    return xOverlap && yOverlap;
	}

	wmccann.Main = Main;

}());

var main = new wmccann.Main();