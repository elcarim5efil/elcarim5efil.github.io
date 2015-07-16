var app = angular.module('myProfile',['ui.bootstrap', 'ngAnimate', 'ngTouch']);

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
app.controller('WorkController', ['$scope', function($scope){
	$scope.oneAtATime = true;
	$scope.works = profileData.works;
	$scope.myInterval = 5000;
	$scope.$first;
}])

// register "ProjectController"
app.controller('ProjectController', ['$scope', function($scope){
	$scope.projects = profileData.projects;
}])

// register "ContactController"
app.controller('ContactController', ['$scope', function($scope){
	$scope.contacts = profileData.contacts;
}])

