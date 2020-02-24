
let imgSet = document.getElementById("img-container").children;
for (var i = imgSet.length - 1; i >= 0; i--) {
	imgSet[i].addEventListener("click", function(el){
		addToCanvas(el);
	});
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("keydown", kdHandler, false);


function kdHandler(e) {
	console.log(elements);
	console.log(isResize);
	console.log(focusResize);
}

canvas = document.getElementById('canvas');
// ctx stands for context
ctx = canvas.getContext('2d');
elements = [];
isMove = false;
isDelete = false;
isResize = false;
focusResize = false;
focusMove = false;

function mouseDownHandler(e) {
	if (focusMove) {
		isMove = true;
	}
	else if (focusResize) {
		isResize = true;
	}
	else if (isDelete) {
		elements.forEach(function(item, index, object) {
        if (item.s === true) {
        	object.splice(index, 1);
        }
        });
	}
}

function mouseUpHandler(e) {
	isMove = false;
	isDelete = false;
	isResize = false;
	focusResize = false;
	focusMove = false;
	elements.forEach(el => el.s = false);
}

//img.target
function addToCanvas(img){
	elements.push({        
		x: 100,
        y: 100,
        w: 30,
        color: 'lightgrey',
        s: false,
        src: img.target.src,
    })
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function mouseMoveHandler(e) {
    let res = getMousePos(canvas, e);
    canvas_mouse = res;
    elements.forEach(function (e) {
    	if (isResize && e.s) {
            e.w += e.y > canvas_mouse.y ? (e.w < 500 ? 1 : 0) : (e.w > 29 ? -1 : 0);
        }
    	else if (res.x >= e.x - 8 && res.x <= e.x
            && res.y >= e.y - 7 && res.y <= e.y)
        {
        	isDelete = true;
            e.color = 'tomato';
			focusMove = false;
            e.s = true;
        }
        else if (res.x >= e.x + e.w && res.x <= e.x + e.w + 7
            && res.y >= e.y - 7 & res.y <= e.y && !isResize) {
        	
        	focusResize = true;
            e.color = 'blue';
            focusMove = false;
            e.s = true;
        } 
        else if (res.x >= e.x && res.x <= e.x + e.w
            && res.y >= e.y & res.y <= e.y + e.w && !isMove && !isResize) {
            elements.forEach(el => el.s = false);
            isDelete = false;
            focusResize = false;
            focusMove = true;
            e.color = 'green';
            e.s = true;
        } else if(!isMove) {
        	// focusResize = false;
        	e.s = false;
        } else if (isMove && e.s === true) {
            e.y = canvas_mouse.y - (e.w / 2);
        	e.x = canvas_mouse.x - (e.w / 2);
        }
    });
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	elements.forEach(function(item, index, object) {
		let cur = new Image(item.w, item.w);
		cur.src = item.src;
		ctx.drawImage(cur, item.x, item.y, item.w, item.w);
		if (item.s) {
            ctx.beginPath();
            ctx.rect(item.x, item.y, item.w + 2, item.w + 2);
            ctx.strokeStyle = item.color;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(item.x + item.w + 2, item.y - 7, 7, 7);
            ctx.fillStyle = 'rgba(100, 100, 200, 0.5)';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(item.x - 8, item.y - 7, 7, 7);
            ctx.fillStyle = 'tomato';
            ctx.fill();
            ctx.closePath();
		}
	});
	requestAnimationFrame(draw);
}

draw();