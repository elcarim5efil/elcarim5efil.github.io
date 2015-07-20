app.directive('accordion', function(){
	return {
		restrict: 'EA',
		replace: true,
		tansclude: true,
		template: '<div ng-tansclude></div>',
		controller: function(){
			var expanders = [];
			this.gotOpened = function(selectedExpander) {
				angular.forEach(expanders, function(expander){
					if(selectedExpander != expander) {
						expander.showMe = false;
					}
				})
			}
			this.addExpander = function(expander){
				expanders.push(expander);
			}
		}
	}
})

app.directive('expander', function(){

	return {
		restrict: 'EA',
		replace: true,
		tansclude: true,
		scope: {title:'=expanderTitle'},
		require: '^?accordion',
		template: 	"<div>" +
						"<div class='title' ng-click='toggle()'> {{title}} </div>" +
						"<div class='body' ng-show='showMe' ng-tansclude></div>" +
					"</div>",
		link: function(scope, element, attrs, accordionController){
			scope.showMe = false;
			accordionController.addExpander(scope);
			scope.toggle = function toggle(){
				scope.showMe = !scope.showMe;
				accordionController.gotOpened(scope);
			}
		}
	}
})