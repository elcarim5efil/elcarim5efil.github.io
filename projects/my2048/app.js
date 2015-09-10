// create a plate
var a = new Plate();

// size of a block
var blockSize = 65;

var plate_offet = { "x" : 3, "y" : 3};

// bind keys
var bindKey = new BindKey();

// bind touch move
var touchMove = new Touch();

var plate;

var rtbtn;

window.onload = function(){

    // retrieve the plate
    plate = document.getElementById('plate');

    // restart button
    rtbtn = document.getElementById('restart');
    rtbtn.onclick = restart;

    plate.style.width = (blockSize+3) * 4 +3;
    plate.style.height = (blockSize+3) * 4 +3;


    // binding the control key
	bindKey
        .on( 'up', function(e){
            a.shiftup();
            //updateHtml();
        })
        .on( 'down', function(e){
            a.shiftdown();
            //updateHtml();
        })
        .on( 'right', function(e){
            a.shiftright();
            //updateHtml();
        })
        .on( 'left', function(e){
            a.shiftleft();
            //updateHtml();
        })


    // binding touch control
    touchMove
        .on( 'up', function(){
            a.shiftup();
            //updateHtml();
        })
        .on( 'down', function(){
            a.shiftdown();
            //updateHtml();
        })
        .on( 'right', function(){
            a.shiftright();
            //updateHtml();
	   })
        .on( 'left', function(){
            a.shiftleft();
            //updateHtml();
	   });

    // bidng the diplay handler
	a.display = function(action) {
		if( action == 'create' ) {
			var i = arguments[1], j = arguments[2], v = arguments[3];
            createNewBlock(i, j, v);
		} else if( action == 'shift') {
			var i = arguments[1], j = arguments[2], m = arguments[3], n = arguments[4], merged = arguments[5];
			if(merged) { // merge two blocks
                mergeBlocks(i, j, m, n);
			} else { // shift one block
                shiftBlock(i, j, m, n);
			}
		}
	}

    // gameover handler
    a.onGameOver(function(){
        alert("Game over");
    });


    // start the game
    a.reset();

    // merge
    function mergeBlocks(i, j, m, n){
        var block2 = document.getElementById("block" + i + "-" + j);
        var block1 = document.getElementById("block" + m + "-" + n);
        block1.setAttribute("id", "block_toremove" + m + "-" + n);      // change the id to avoid duplicate
        setTimeout(function(){
            block1.remove();
        },400);
        block1.style.left = (blockSize+3) * j + plate_offet.x;
        block1.style.top = (blockSize+3) * i + plate_offet.y;
        block1.style.opacity = 0;
        block2.innerHTML = (block2.innerHTML * 2);
        switchColor(block2, Number(block2.innerHTML));
    }

    // shift
    function shiftBlock(i, j, m, n){
        var block = document.getElementById("block" + m + "-" + n);
        block.setAttribute("id", "block" + i + "-" + j);
        block.style.left = (blockSize+3) * j + plate_offet.x;
        block.style.top = (blockSize+3) * i + plate_offet.y;
    }

    // create
    function createNewBlock(i, j, v){
        var div=document.createElement("div");
        div.setAttribute("id", "block" + i + "-" + j);
        div.setAttribute("class", "block");
        document.getElementById('plate').appendChild(div);
        div.innerHTML = v;
        div.style.left = (blockSize+3) * j + plate_offet.x;
        div.style.top = (blockSize+3) * i + plate_offet.y;
        div.style.lineHeight = blockSize + 'px';
        div.style.width = 0;
        div.style.height = 0;
        setTimeout(function(){
            div.style.width = blockSize;
            div.style.height = blockSize;
        },1)
        switchColor(div, v);
    }

    // switch the color depending on the value of the block
	function switchColor(ele, val) {
		switch(val) {
			case 2: ele.style.backgroundColor = "#FFF3E0"; break;
			case 4: ele.style.backgroundColor = "#FFE0B2"; break;
			case 8: ele.style.backgroundColor = "#FFCC80"; break;
			case 16: ele.style.backgroundColor = "#FFB74D"; break;
			case 32: ele.style.backgroundColor = "#FFA726"; break;
			case 64: ele.style.backgroundColor = "#FF9800"; break;
			case 128: ele.style.backgroundColor = "#FB8C00"; ele.style.fontSize = '40px'; break;
			case 256: ele.style.backgroundColor = "#F57C00"; ele.style.fontSize = '40px';break;
			case 512: ele.style.backgroundColor = "#EF6C00"; ele.style.fontSize = '35px'; break;
			case 1024: ele.style.backgroundColor = "#E65100"; ele.style.fontSize = '30px';break;
		}
	}

    // update the plain text, NOT using 
	function updateHtml(){
        plate.innerHTML = a.displayHTMLText();
	}

    // restart the game
    function restart(){
        while(plate.hasChildNodes()){
            plate.removeChild( plate.firstChild );
        };
        a.reset();
        console.log("plate resetted...")
    }
};