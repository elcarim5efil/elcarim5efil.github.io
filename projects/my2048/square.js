/**
* @Unit
* @description a single squre unit class
*/
var Unit = (function(){
	return function(){
		var _v = 0;

		this.value = function() {
			return _v;
		};

		this.upgrade = function(a) {
			_v = _v + a;
			return this;
		};

		this.set = function(v) {
			_v = v;
			return this;
		};

		this.clear = function() {
			_v = 0;
			return this;
		}
	}
})();

/**
* @Plate
* @description Plate that contains the Units
*/
var Plate = (function(){
	
	// return a plate
	return function(){

		// plate width
		var _width 		= 4;

		// plate height
		var _height 	= 4;

		// the plate object to store all of the Units
		var _plate 		= {};

		// an array to store the elements that the value is ZERO
		var _emptyArray = [];
		
		// this
		var _this 		= this;

		// the gamover callback function
		var _onGameOver = function(){};

		// create the empty plate
		for( var i = 0; i < _height; i ++ ){
			_plate[i] = {};
			for( var j = 0; j < _width; j ++ ){
				_plate[i][j] = new Unit();
				emptyArrayPush(i,j);
			}
		}

		// pop out an element of the empty array
		function emptyArrayPop(i, j) {
			var key = i * _height + j;

			for(var k = 0 ; k < _emptyArray.length; k++ ) {
				if( _emptyArray[k] === key ) {
					_emptyArray.splice(k,1);	// remove _emptyArray[k]
				}
			}
		}

		// push an elemnt into the empty array
		function emptyArrayPush(i, j) {
			_emptyArray.push( i*_height+j );
		}

		/**
		* @description: shift the unit b(m, n) towards unit b(i, j)
		* @param: 	i, a.x
		* 			j, a.y
		* 			m, b.x
		* 			n, b.y
		* @return: 	0, everything stay sill, nothing's gonna happen
		*			1, not able to merge b and a, but append b to a;
		* 			2, merge b to a;
		*/
		function shift(i, j, m, n, notTest) {		// shift b towards a
			var a;
			var b;

			notTest = (notTest === undefined) ? true : notTest;
			
			// line i or line m is empty on the plate
			if( _plate[i] === undefined || _plate[m] === undefined ) {
				return 0;
			}

			// a or b is empty
			if( _plate[i][j] === undefined || _plate[m][n] === undefined ) {
				return 0;
			}

			a = _plate[i][j];
			b = _plate[m][n];

			// checkout unit a and unit b;
			if( typeof a.value !== 'function' || typeof b.value !== 'function' ) {
				return 0;
			}

			if( a.value() === 0 && b.value() === 0 ) {
				// nothing to do with double zero
				return 0;
			} else if( a.value() === b.value() ) {
				if(notTest) {
					// if a equals b, then merge b into a
					a.upgrade(b.value());

					// b will be clear on the plate
					b.clear();

					// push m & n to the emptyArray
					emptyArrayPush(m, n);
				}
				
				// merge action
				return 2;
			} else if( a.value() === 0 ) {
				// if a is 0, then shift b to a
				if(notTest) {
					// a is empty, shift it
					a.set(b.value());

					// b will be clear in the plate
					b.clear();

					// pop a from emptyArray
					emptyArrayPop(i, j);

					// push b to emptyArray
					emptyArrayPush(m, n);
				}
				
				return 1;
			} else {
				// stay still, nothing to do
				return 0;
			}
		}

		/**
		* @description: checkout wether the plate is stuck
		* @param: 	direction, 0: 'up', 1: 'left', 2: 'down', 3: 'right'
		* @return: 	none
		*/
		function isStuck(direction) {
			var result = 0;
			var m;
			switch(direction) {

				// shift up
				case 0: {
					for( var i = 0; i < _height; i++ ) {
						for( var j = 0; j < (_width-1); j++ ) {
							m = j;
							do{
								result = shift( i, m, i, m+1, false);
								m--;
							} while(result === 1);
							if( j !== ++m  || result === 2) {
								return false;	// movable
							}
						}
					}
					break;
				}

				// shift down
				case 2:
					for( var j = 0; j < _width; j++ ) {
						for( var i = (_height-1); i > 0; i--) {
							m = i;
							do{
								result = shift( m, j, m-1, j, false);;
								m++;
							} while(result == 1);
							if( i !== --m  || result === 2) {
								return false;	// movable
							}
						}
					}
				break;

				// shift left
				case 1: {
					for( var i = 0; i < _height; i++ ) {
						for( var j = 0; j < (_width-1); j++ ) {
							m = j;
							do{
								result = shift( i, m, i, m+1, false);
								m--;
							} while(result === 1);
							if( j !== ++m  || result === 2) {
								return false;	// movable
							}
						}
					}
					break;
				}
					

				// shift right
				case 3: {
					for( var i = 0; i < _height; i++ ) {
						for( var j = (_width-1); j > 0 ; j-- ) {
							m = j;
							do{
								result = shift( i, m, i, m-1, false);
								m++;
							} while(result === 1);
							if( j !== --m  || result === 2) {
								return false;	// movable
							}
						}
					}
					break;
				}
			}
			return true;
		}

		function isGameOver() {

			// check out 4 directions
			for(var i = 0; i < 3; i ++ ){
				if( !isStuck(i) ) {
					return false;
				}
			}

			// stuck in 4 directions, game over
			return true;
		}

		// emit the 'shift' display action
		function displayShift( i, j, m, n, merged ) {
			_this.display('shift', i, j, m, n, merged);
		}
		
 
		// emit the 'create' display action
		function displayCreate(i, j, value) {
			_this.display('create', i, j, value);
		}


		// a debug method, displaying plain html text on page
		this.displayHTMLText = function () {
			var str = null;
			for( var i = 0; i < _height; i++ ){
				for( var j = 0; j < _width; j++ ){
					if( str === null ) {
						str = _plate[i][j].value() + '\t\t';
					} else {
						str += _plate[i][j].value() + '\t\t';
					}
				}
				str += '<br>';
			}
			return str;
		}

		// generate the unit randomly
		this.randomGenerate = function(move) {
			var rand;
			var l;
			var r;
			var key;

			// if the _emptyArray is empty, which means the plate is full of unit
			if( !_emptyArray.length && !move) {
				if(isGameOver()){
					// checkout wether it's gameover
					gameOver();
				}
				return false;
			}

			// if there is no move or there is no available space on the plate
			if( !_emptyArray.length || !move) {
				return false;
			}

			// generate the random seed to pick up the position
			rand = parseInt(_emptyArray.length*Math.random(), 10);
			key = _emptyArray[rand];
			l = parseInt( key / _width );		// line 
			r = parseInt( key % _width );		// row

			// if that place has already been taken
			if( _plate[l][r].value() ) {
				emptyArrayPop(l,r)
				return false;
			}

			// generate the random seed to pick up the value, either 2 or 4
			rand = parseInt(2*Math.random(), 10);
			if( !rand) {
				this.setUnit( l, r, 2 );
				displayCreate(l,r,2);
			} else {
				this.setUnit( l, r, 4 );
				displayCreate(l,r,4);
			}
		}

		// set the Unit on a centain place
		this.setUnit = function(i,j,v) {
			_plate[i][j].set(v);
			emptyArrayPop(i,j);
		}

		// return the length of the _emptyArray
		this.emptyNum = function() {
			return _emptyArray.length;
		}

		// shif up
		this.shiftup = function() {
			var result = 0;
			var move = 0;
			var m;
			for( var j = 0; j < _width; j++ ) {				// col
				for( var i = 0; i < (_height-1); i++ ) {	// row
					m = i;
					do{
						result = shift( m, j, m+1, j );
						m--;
					} while(result === 1);
					if( i !== ++m || result === 2) {
						result === 2 ?  displayShift(m, j, i+1, j, true)        // merge
										: displayShift(m+1, j, i+1, j, false);  // just shift
						++move;
					}
				}
			}
			_this.randomGenerate(move);
		}

		// shift down
		this.shiftdown = function() {
			var result = 0;
			var move = 0;
			var m;
			for( var j = 0; j < _width; j++ ) {
				for( var i = (_height-1); i > 0; i--) {
					m = i;
					do{
						result = shift( m, j, m-1, j );;
						m++;
					} while(result == 1);
					if( i !== --m  || result === 2) {
						result === 2 ?  displayShift(m, j, i-1, j, true)
										: displayShift(m-1, j, i-1, j, false);
						++move;
					}
				}
			}
			_this.randomGenerate(move);
		}

		// shift left
		this.shiftleft = function() {
			var result = 0;
			var move = 0;
			var m;
			for( var i = 0; i < _height; i++ ) {
				for( var j = 0; j < (_width-1); j++ ) {
					m = j;
					do{
						result = shift( i, m, i, m+1 );
						m--;
					} while(result === 1);
					if( j !== ++m  || result === 2) {
						result === 2 ?  displayShift(i, m, i, j+1, true)
										: displayShift(i, m+1, i, j+1, false);
						++move;
					}
				}
			}
			_this.randomGenerate(move);
		}

		// shift right
		this.shiftright = function() {
			var result = 0;
			var move = 0;
			var m;
			for( var i = 0; i < _height; i++ ) {
				for( var j = (_width-1); j > 0 ; j-- ) {
					m = j;
					do{
						result = shift( i, m, i, m-1 );
						m++;
					} while(result === 1);
					if( j !== --m  || result === 2) {
						result === 2 ?  displayShift(i, m, i, j-1, true)
										: displayShift(i, m-1, i, j-1, false);
						++move;
					}
				}
			}
			_this.randomGenerate(move);
		}

		// reset the plate
        this.reset = function() {
            _plate 	= {};
            _emptyArray = new Array;
            for( i = 0; i < _height; i ++ ){
                _plate[i] = {};
                for( j = 0; j < _width; j ++ ){
                    _plate[i][j] = new Unit;
                    emptyArrayPush(i,j);
                }
            }
            _this.randomGenerate(1);
        }
        
        // set gameover callback
        this.onGameOver = function(callback) {
        	if(typeof callback == 'function') _onGameOver = callback;
        }

        // the gameover internal gameover callback
        function gameOver(){
        	console.log("game over");
        	_onGameOver();
        }
	}
})();

Plate.prototype = {
	display: function(aciton) {
		// empty
	}
}

/**
* @BindKey
* @description BindKey module
*/
var BindKey = ( function() {

	// arrow up callback
	var _onKeyUp		= function(){};
	var _noDefaultUp	= true;
	
	// arrow down callback
	var _onKeyDown		= function(){};
	var _noDefaultDown	= true;
	
	// arrow left callback
	var _onKeyLeft		= function(){};
	var _noDefaultLeft	= true;
	
	// arrow right callback
	var _onKeyRight 	= function(){};
	var _noDefaultRight	= true;

	function bindCallback() {
		document.onkeydown = function(e) {
	        var e = e || window.event;
	        var a = e.keyCode;

	        switch(a) {
	        	case 38: {
	        		if(_noDefaultRight) e.preventDefault();
					_onKeyUp();
					break;
				}
				case 37: {
					if(_noDefaultRight) e.preventDefault();
					_onKeyLeft();
					break;
				}
				case 39: {
					if(_noDefaultRight) e.preventDefault();
					_onKeyRight();
					break;
				}
				case 40: {
					if(_noDefaultRight) e.preventDefault();
					_onKeyDown();
					break;
				}
	        }
		};
	}

	// return the event callback setup interface
	return function(){
		this.on = function( keyname, callback, noDefault ) {
			if( typeof callback != 'function' ) {
				return;
			}
			switch( keyname ) {
				case 'up': _onKeyUp = callback; break;
				case 'down': _onKeyDown = callback; break;
				case 'left': _onKeyLeft = callback; break;
				case 'right': _onKeyRight = callback; break;
			}
			bindCallback();

			// chainable invokation
			return this;
		}
	}
})();

/**
* @Touch
* @description BindKey module
*/
var Touch = ( function() {
    var _startY, _startX, _endX, _endY,_difX,_difY;
    var _swipeUp = function(){};
    var _swipeDown = function(){};
    var _swipeLeft = function(){};
    var _swipeRight = function(){};

    (function init_event() {
        document.addEventListener('touchstart',touch, false);
        document.addEventListener('touchmove',touch, false);
        document.addEventListener('touchend',touch, false);

        console.log("touch event binded");

        // touch-event handler
        function touch (e){
            var e = e || window.event;

            // switch the handler according to the event type
            switch(e.type){

            	// when touch start, record the starting coordination
                case "touchstart": {
					_startX = e.touches[0].clientX;
                	_startY = e.touches[0].clientY;
                    break;
                }

                // when touch ends, detect the swipe direction
                case "touchend": {

                	// end coodination
					_endX = e.changedTouches[0].clientX;
					_endY = e.changedTouches[0].clientY;
					
					// swipe distance
					_difX = _endX - _startX;
					_difY = _endY - _startY;

					// calculate the swipe gestrues

					// swipe right 
					if( _difX > 50 && Math.abs(_difY) < 50 ) {
						_swipeRight();

					// swipe up
					} else if( Math.abs(_difX) < 50 && _difY < -50 ) {
						_swipeUp();

					// swipe down
					} else if( Math.abs(_difX) < 50 && _difY > 50 ) {
						_swipeDown();

					// swipe left
					} else if(  _difX < -50 && Math.abs(_difY) < 50 ) {
						_swipeLeft();
					}
					break;
				}

				// prevent the touch move default, which is scrolling the screen
				case "touchmove": {
					e.preventDefault();
                    break;
                }
            }
        }
    })();

    // return the handler set up interface
    return function(){
        this.on = function( keyname, callback ) {
            if( typeof callback != 'function' ) {
                return;
            }
            switch( keyname ) {
                case 'up': _swipeUp = callback; break;
                case 'down': _swipeDown = callback; break;
                case 'left': _swipeLeft = callback; break;
                case 'right': _swipeRight = callback; break;
            }
            return this;
        }
    }
})();
