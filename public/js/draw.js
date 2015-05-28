tool.maxDistance = 50;

function randomColor(){
	return '#'+Math.floor(Math.random()*16777215).toString(16); // 16777215 = ffffff
}

function selectedColor() {
	var color = $('#color-picker').data('colorpicker').color.toHex();
	return color;
}

function onMouseDrag(event) {
    // Take the click/touch position as the centre of our circle
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;
    // The faster the movement, the bigger the circle
    var radius = event.delta.length / 2;
    var color = selectedColor();
    drawCircle(x, y, radius, color);
    emitCircle(x, y, radius, color);
} 
 
function drawCircle(x, y, radius, color) {
    // Render the circle with Paper.js
    var circle = new Path.Circle(new Point(x, y), radius);
    circle.fillColor = color;
    // Refresh the view, so we always get an update, even if the tab is not in focus
    view.draw();
}
 
function emitCircle(x, y, radius, color) {
    var sessionId = io.id;
	
	var data = {
		x: x,
		y: y,
		radius: radius,
		color: color
	};
	
	io.emit('drawCircle', data, sessionId);
	console.log('Emit draw circle', data);
}

// Listen for 'drawCircle' events created by other users
io.on('drawCircle', function(data) {
    console.log('drawCircle event received:', data);
	
	// Draw the circle using the data sent from another user
    drawCircle(data.x, data.y, data.radius, data.color);
})