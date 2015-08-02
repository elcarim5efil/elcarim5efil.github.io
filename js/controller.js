// register "NavController"
app.controller('NavController', ['$scope', '$location', 'anchorSmoothScroll', function($scope, $location, anchorSmoothScroll){
	$scope.menus = [
		'Profile',
		'Works',
		'Projects',
		'Blog',
		'Contact'
	];

	if(window.name != null && document.getElementById(window.name) != null) {
		setTimeout(function(){
			anchorSmoothScroll.scrollTo(window.name, -20);
			window.name = null;
		}, 500);
	}
	
	$scope.scroll = function(index){
		var path = window.location.pathname;
		if(String.prototype.indexOf.call(path, 'blog') != -1) {
			window.location = window.location.origin;
			window.name = $scope.menus[index];
		} else {
			anchorSmoothScroll.scrollTo($scope.menus[index], -20);
		}
	}
}])

// register "SkillController"
app.controller('ProfileController', ['$scope', function($scope){
	$scope.profile = profileData.profile;
	$scope.skills = profileData.skills;
	var skills = $scope.skills;
	for(key in skills) {
		var t = Math.floor(Math.random() * 5);
		skills[key].type =	t == 0 ? 'success' :
							t == 1 ? 'info' :
							t == 2 ? null :
							t == 3 ? 'warning' :
									 'danger';

	}


	JSONP( 'https://api.github.com/users/elcarim5efil?callback=?', function( response ) {
		var data = response.data;
		$scope.profile.gitnum = data.public_repos;
		// console.log($scope.profile.gitnum);
		console.log(data);
	});

	function JSONP( url, callback ) {
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
}])

// register "WorkController"
app.controller('WorkController', ['$scope', '$location', 'anchorSmoothScroll', function($scope, $location, anchorSmoothScroll){
	$scope.oneAtATime = true;
	$scope.works = profileData.works;
	$scope.myInterval = 5000;
	$scope.$first;
	$scope.scroll = function(index){
		// $location.hash('work_' + index);
		setTimeout(function(){
			anchorSmoothScroll.scrollTo('work_' + index, -20);
		}, 500);
		
	}
}])

// register "ProjectController"
app.controller('ProjectController', ['$scope', '$location', 'anchorSmoothScroll', function($scope, $location, anchorSmoothScroll){
	$scope.projects = profileData.projects;
	$scope.scroll = function(index){
		// $location.hash('project_' + index);
		setTimeout(function(){
			anchorSmoothScroll.scrollTo('project_' + index, -20);
		}, 500);
		
	}
}])

// register "ContactController"
app.controller('ContactController', ['$scope', function($scope){
	$scope.contacts = profileData.contacts;
}])

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
		.when('/', {
			//controller : 'RootCtrl',
			templateUrl : 'template/introduction.html'
		})
}]);  