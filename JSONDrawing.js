//Effort: 11789.490707599438 
//T: 654.9717059777465 	
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
			var button=document.getElementById(options.buttonId);
			var self=this;
			button.addEventListener("click", function(){
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
			if (canvasId != null){
				this.getCanvasContext().clearRect(0,0,640,480);
				context.restore();
				if (resetProps) JSONDrawing.Canvas.resetProperties();
			}
		},
		resetProperties:function(){
			var defaultDraw=JSONDrawing.Util.getDefaultDraw();
			JSONDrawing.Canvas.setBackground(defaultDraw['background']);
			JSONDrawing.Canvas.setStroke(defaultDraw['pen']);
			JSONDrawing.Canvas.setLineWidth(defaultDraw['width']);
			JSONDrawing.Canvas.setFill(defaultDraw['fill']);			
		},

		//from here, functions assume that context is set. My code, my rules bitch :) 
		setComposite:function(value){
			context.globalCompositeOperation=value;
		},
		setBackground:function(color){
			context.canvas.style.backgroundColor=color
		},
		setStroke: function(color){
			context.strokeStyle = color
		},
		setLineWidth: function(value){
			context.lineWidth=value
		},
		setFill: function(color){
			context.fillStyle = color
		},
		newLine: function(cords){
			context.moveTo(cords[0],cords[1]);
			context.lineTo(cords[2],cords[3]);
		},
		newArc: function(cords){
			context.arc(cords[0],cords[1],cords[2],0,Math.PI * 2)
		},
		newRect: function(cords){
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
				var instruction=i;
				var value=data[i];
				JSONDrawing.Canvas.newPath(); 
				JSONDrawing.Main.applyInstruction(instruction,value);
				JSONDrawing.Canvas.closePath();
				JSONDrawing.Canvas.doFill();
				JSONDrawing.Canvas.doStroke();
			}
		},
		applyInstruction: function(instruction,value){
			switch (instruction){
				case 'background':
					JSONDrawing.Canvas.setBackground(value);
					break;
				case 'pen':
					JSONDrawing.Canvas.setStroke(value);
					break;
				case 'width':
					JSONDrawing.Canvas.setLineWidth(value);
					break;
				case 'fill':
					JSONDrawing.Canvas.setFill(value);
					break;
				case 'line':
					JSONDrawing.Canvas.newLine([
						value[0],
						value[1],
						value[2],
						value[3]
					]);
					break;
				case 'circle':
					JSONDrawing.Canvas.newPath(); 
					JSONDrawing.Canvas.newArc([
						value[0],
						value[1],
						value[2]
					]);
					break;
				case 'box':
					JSONDrawing.Canvas.newRect([
						value[0],
						value[1],
						value[2],
						value[3]
					]);
					break;
			}
		}
	}

}();
JSONDrawing.Main.init({
	canvasId:'js-output',
	textId:'js-input',
	buttonId:'js-draw',
	defaultDraw:[{
		background:"black",
		pen:"white",
		width:1,
		fill:"none"		
	}]
});