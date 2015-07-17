// register "NavController"
app.controller('NavController', ['$scope', '$location', 'anchorSmoothScroll', function($scope, $location, anchorSmoothScroll){
	$scope.menus = [
		'Profile',
		'Works',
		'Projects',
		'Contact'
	]
	$scope.scroll = function(index){
		// $location.hash('work_' + index);
		anchorSmoothScroll.scrollTo($scope.menus[index], -20);
	}
}])

// register "SkillController"
app.controller('ProfileContaoller', ['$scope', function($scope){
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

