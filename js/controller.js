// register "GlobalController"
app.controller('GlobalController', ['$scope', '$translate', function($scope, $translate){
	// select the language
	$scope.lang = getLang(window.navigator.language);
	$translate.use($scope.lang);
	
	function getLang(lang) {
		lang = lang.toLowerCase();
		if(lang.substr('zh') != -1 || lang.substr('cn') != -1) {
			return 'zh';
		} else {
			return 'en';
		}
	}

	$scope.selectChange = function(){
		$translate.use($scope.lang);
	}

}])


// register "NavController"
app.controller('NavController', ['$scope', '$location', 'anchorSmoothScroll', '$translate' ,  function($scope, $location, anchorSmoothScroll){
	$scope.menus = [
		{id: 0, text: 'Profile', translationTag: 'MENU.PROFILE'},
		{id: 1, text: 'Works', translationTag: 'MENU.WORKS'},
		{id: 2, text: 'Projects', translationTag: 'MENU.PROJECTS'},
		{id: 3, text: 'Blog', translationTag: 'MENU.BLOG'},
		{id: 4, text: 'Contact', translationTag: 'MENU.CONTACT'}
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
			window.name = $scope.menus[index].text;
		} else {
			anchorSmoothScroll.scrollTo($scope.menus[index].text, -20);
		}
	}
}])

// register "ProfileController"
app.controller('ProfileController', ['$scope', 'JSONP', function($scope, JSONP){
	$scope.gitrepo = profileData.profile.gitrepo;
	$scope.skills = profileData.skills;
	$scope.profile = {};

	var skills = $scope.skills;
	for(key in skills) {
		var t = Math.floor(Math.random() * 5);
		skills[key].type =	t == 0 ? 'success' :
							t == 1 ? 'info' :
							t == 2 ? null :
							t == 3 ? 'warning' :
									 'danger';

	}
	
	JSONP.get('https://api.github.com/users/elcarim5efil?callback=?', function( response ) {
		var data = response.data;
		$scope.profile.gitnum = data.public_repos;
		$scope.$apply();
	});

	// function JSONP( url, callback ) {
	// 	var id = ( 'jsonp' + Math.random() * new Date() ).replace('.', '');
	// 	var script = document.createElement('script');
	// 	script.src = url.replace( 'callback=?', 'callback=' + id );
	// 	document.body.appendChild( script );
	// 	window[ id ] = function( data ) {
	// 		if (callback) {
	// 			callback( data );
	// 		}
	// 	};
	// }
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
