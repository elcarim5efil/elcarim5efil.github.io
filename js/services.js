app.service('anchorSmoothScroll', function(){
    this.scrollTo = function(eID, offset) {
        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        if(typeof offset != 'number') { offset = 0; }
        offset = offset | 0;

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        // console.log(stopY);
        stopY =  stopY + offset;

        var distance = stopY > startY ? stopY - startY : startY - stopY;
        var sperator = 25;
        if (distance < sperator) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / sperator);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});

app.service('JSONP', function(){
    this.get = function( url, callback ) {
        var id = ( 'jsonp' + Math.random() * new Date() ).replace('.', '');
        var script = document.createElement('script');
        script.src = url.replace( 'callback=?', 'callback=' + id );
        document.body.appendChild( script );
        window[ id ] = function( data ) {
            if (callback) {
                callback( data );
            }
        };
    }
});

// app.controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {    
//     $scope.gotoElement = function (eID){
//         // set the location.hash to the id of
//         // the element you wish to scroll to.
//         $location.hash('bottom');
//         // call $anchorScroll()
//         anchorSmoothScroll.scrollTo(eID);
//     };
// });