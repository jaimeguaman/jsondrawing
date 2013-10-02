//Halsted total effort: 6389.422299078649  
//T: 354.9679055043694 (effort / 18)
window.JSONDrawing={},
JSONDrawing.Util=function(){
	var options=null;
	return {
		setOptions: function(opts){
			options=opts;
		},
		getOptions: function(){
			return options;
		},
		getDefaultDraw: function(){
			return options['defaultDraw'][0];
		},
		parse: function(data){
			return JSON.parse(data);
		},
		getInputData: function(element){
			return document.getElementById(element).value;
		},
		getData: function(){
			return this.parse(this.getInputData(options.textId));
		},
		doBindings: function(){
			var self=this;
			document.getElementById(options.buttonId).addEventListener("click", function(){
				JSONDrawing.Main.draw(self.getData());
			} , false);
		}
	}
}(),
JSONDrawing.Canvas=function(){
	var canvasId=null, context=null;
	return {
		setCanvas:function(id){
			canvasId=id
		},
		setContext: function(ctx){
			context=ctx
		},
		getCanvas: function(){
			return document.getElementById(canvasId)
		},
		getContext: function(canvas){
			return canvas.getContext('2d')
		},
		getCanvasContext: function(){
			return this.getCanvas(canvasId).getContext('2d')
		},
		clearCanvas:function(resetProps){
			this.getCanvasContext().clearRect(0,0,640,480);
			if (resetProps) JSONDrawing.Canvas.resetProperties();
		},
		resetProperties:function(){
			var defaultDraw=JSONDrawing.Util.getDefaultDraw();
			JSONDrawing.Canvas.background(defaultDraw['background']);
			JSONDrawing.Canvas.pen(defaultDraw['pen']);
			JSONDrawing.Canvas.width(defaultDraw['width']);
			JSONDrawing.Canvas.fill(defaultDraw['fill']);
		},

		//from here, functions assume that context is set. My code, my rules bitch :)
		setComposite:function(value){
			context.globalCompositeOperation=value;
		},
		background:function(color){
			context.canvas.style.backgroundColor=color
		},
		pen: function(color){
			context.strokeStyle = color
		},
		width: function(value){
			context.lineWidth=value
		},
		fill: function(color){
			context.fillStyle = color
		},
		line: function(cords){
			context.moveTo(cords[0],cords[1]);
			context.lineTo(cords[2],cords[3]);
		},
		circle: function(cords){
			context.arc(cords[0],cords[1],cords[2],0,Math.PI * 2)
		},
		box: function(cords){
			context.rect(cords[0],cords[1],cords[2] - cords[0], cords[3] - cords[1])
		},
		newPath:function(){
			context.beginPath()
		},
		doFill: function(){
			context.fill()
		},
		doStroke: function(){
			context.stroke()
		},
		closePath:function(){
			context.closePath()
		}

	}
}(), JSONDrawing.Main=function(){
	return {
		init: function(options){
			JSONDrawing.Util.setOptions(options);
			JSONDrawing.Canvas.setCanvas(options.canvasId);
			JSONDrawing.Canvas.setContext(JSONDrawing.Canvas.getCanvasContext());
			JSONDrawing.Canvas.setComposite('source-over');
			JSONDrawing.Main.draw(options.defaultDraw);
			JSONDrawing.Util.doBindings();
		},
		draw: function(data){
			JSONDrawing.Canvas.clearCanvas(true); 
			for (i in data){
				JSONDrawing.Main.processInstructions(data[i]);
			}

		},
		processInstructions:function(data){
			for(i in data){
				JSONDrawing.Main.start();
				JSONDrawing.Main.applyInstruction(i,data[i]);
				JSONDrawing.Main.end();
			}
		},
		applyInstruction: function(instruction,value){
			JSONDrawing.Canvas[instruction].call(JSONDrawing.Canvas,value);
		},
		start: function(){
			JSONDrawing.Canvas.newPath(); 
		},
		end: function(){
			JSONDrawing.Canvas.closePath();
			JSONDrawing.Canvas.doFill();
			JSONDrawing.Canvas.doStroke();
		}

	}

}();
JSONDrawing.Main.init({
	canvasId:'js-output',
	textId:'js-input',
	buttonId:'js-draw',
	canvasWidth:640,
	canvasHeight:480,
	defaultDraw:[{
		background:"black",
		pen:"white",
		width:1,
		fill:"none"		
	}]
});