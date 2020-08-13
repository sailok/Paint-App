var coords = [];
var clickCounts = 0;
var triangles = [];
var guide = true;


class Point{
    x = 0;
    y = 0;

    constructor([x, y]){
        this.x = x;
        this.y = y;
    }
}
class Triangle{
    points = [];
    color = [];
    constructor([a, b], [c, d], [e, f], color){
        this.points.push(new Point([a, b]));
        this.points.push(new Point([c, d]));
        this.points.push(new Point([e, f]));
        this.color = color;
    }       
}

function draw(event){
    if(guide){
        init(false);
    }
    var rect = document.getElementById("Canvas").getBoundingClientRect();
    var ctx = document.getElementById("Canvas").getContext("2d");

    if(clickCounts > 0){
        return;
    }

    var startX = coords[0] - rect.left
    var startY = coords[1] - rect.top;
    var endX = coords[2] - rect.left;
    var endY = coords[3] - rect.top

    //drag check
    var flag = dragTriangle(new Point([startX,startY]), new Point([endX,endY]));

    // incase of not a doubleclick
    if(coords[0] != coords[2] && coords[1] != coords[3] &&!flag){
        var alt = Math.pow(Math.abs(startX-endX)*Math.abs(startX-endX) + Math.abs(startY-endY)*Math.abs(startY-endY), 0.5);
        var side = (alt*Math.pow(3,0.5))/8;
        
        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
        if(color == '#ffffff' || color == '#FFFFFF'){
            color = '#'+Math.floor(Math.random()*16777215).toString(16);
        }

        if(color.length != 7){
            color = '#'+Math.floor(Math.random()*16777215).toString(16);
        }
        triangle = new Triangle([startX, startY], [endX - side, endY], [endX + side, endY], color);
        triangles.push(triangle);
        drawTriangles(triangle);
        coords = [];
    }
}

function removeTriangle(triangle){
    var ctx = document.getElementById("Canvas").getContext("2d");
    ctx.fillStyle = '#FFFFFF';

    var t = 0;
    while(t < 50){
        ctx.beginPath();
        ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
        ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
        ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
        ctx.closePath();

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.fill();
        t++;
    }
}

function dragTriangle(p1, p2){
    var res = false;
    for(var i = triangles.length-1; i >= 0; i--){
        if(isInside(p1, triangles[i])){
            if(!res){
                removeTriangle(triangles[i]);
                for(var j=0;j<3;j++){
                    triangles[i].points[j].x += (p2.x - p1.x);
                    triangles[i].points[j].y += (p2.y - p1.y);
                }
                drawTriangles(triangles[i]);
                triangles.push(triangles[i]);
                triangles.splice(i, 1);
                coords = [];
                res = true;
            }else{
                drawTriangles(triangles[i]);
            }
        }
    }
    return res;
}

function drawTriangles(triangle){
    var ctx = document.getElementById("Canvas").getContext("2d");
    ctx.fillStyle = triangle.color;
    
    ctx.beginPath();
    ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
    ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
    ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
    ctx.closePath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#666666';
    ctx.stroke();

    ctx.fill();
    console.table(triangles);
}


function clicks(){
    clickCounts++;
    if(clickCounts === 1){
        setTimeout(function(){
            if(clickCounts >= 2){
                deleteTriangle();
            }
            clickCounts = 0;
            coords = [];
        }, 200);
    }
}

function deleteTriangle(imgColor){
    var rect = document.getElementById("Canvas").getBoundingClientRect();
    var ctx = document.getElementById("Canvas").getContext("2d");

    var flag = true;
    for(var i = triangles.length-1; i >= 0; i--){
        if(isInside(new Point([coords[0] - rect.left, coords[1] - rect.top]), triangles[i])){
            if(flag){
                removeTriangle(triangles[i]);
                triangles.splice(i, 1);
                flag = false;
            }else{
                drawTriangles(triangles[i]);
            }
        }else{
            drawTriangles(triangles[i]);
        }
    }
}

function area(a, b, c){
    return Math.abs((a.x*(b.y - c.y) + b.x*(c.y - a.y) + c.x*(a.y - b.y))/2);
}

function isInside(point, triangle){
    var a = area(triangle.points[0],triangle.points[1],triangle.points[2]);
    var a1 = area(point,triangle.points[1],triangle.points[2]);
    var a2 = area(triangle.points[0], point,triangle.points[2]);
    var a3 = area(triangle.points[0],triangle.points[1], point);

    return Math.round(a) == Math.round(a1+a2+a3);
}

function init(flag = true){
    document.getElementById("Canvas").addEventListener('mousedown', getCoordinates);
    document.getElementById("Canvas").addEventListener('mouseup', getCoordinates);
    document.getElementById("Canvas").addEventListener('click', clicks);

    var ctx = document.getElementById("Canvas").getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,1080,540);

    guide = false;
    if(flag){
        ctx.fillStyle = "#DCDCDC";
        ctx.fillRect(0,0,1080,540);
        var img = document.getElementById('guide');
        ctx.drawImage(img, 280, 130, 500, 250);
        guide = true;
    }
    
    triangles = [];
}

function getCoordinates(event){
    coords.push(event.clientX);
    coords.push(event.clientY);
}

window.onload = init;