var app = angular.module('myProfile',['ui.bootstrap', 'ngAnimate', 'ngTouch','pascalprecht.translate']);

var translations_zh = {
	'PROFILE': {
		NAME: "吴子然",
		INFO:'东南大学 自动化学院',
		gitrepo: 'https://github.com/elcarim5efil/repositories',
		INTRO: '<p>勤奋刻苦，善于钻研，自律严谨，有探索精神，勇于尝试新技术，能够独立完成开发，也乐意参与团队协作相互学习。</p>'
			+ '<p>自从尝试Web应用开发后一发不可收拾，爱上了JavaScript以及Node。鉴于自身爱好游戏，因此以JavaScript和Html5为基础，尝试实现一些小游戏，如2048、FlappyBird、DumbSoccer。虽然作品不多，但尝试过原生Canvas、matter.js、cocos2d-html5、chipmunk等开发工具，并有少许心得。</p>'
			+ '<p>曾经尝试为Chrome浏览器开发扩展应用，目前已实现用于登录密码记录和视频弹窗的简单扩展应用，源码请见<a href="http://www.github.com/elcarim5efil" target="_blank">github</a>。</p>'
			+ '<p>本页面使用AngularJS及Bootstrap进行开发，Blog模块使用了Jekyll，评论系统使用“多说”进行托管。</p>',
	},
	'MENU':{
		'PROFILE': '个人资料',
		'WORKS': '作品',
		'PROJECTS': '项目经历',
		'BLOG': '博客',
		'CONTACT': '联系方式',
	}
};
var translations_en = {
	'PROFILE': {
		NAME: "Ziran Wu",
		INFO:'Southeast University, China',
		gitrepo: 'https://github.com/elcarim5efil/repositories',
		INTRO: '<p>I am a rookie to font-end development, I fell into this field the first time I tried out JavaScript and Node.js during one of the programs of my lab.</p>'
			+ '<p>I love gaming and I\'ve tried to make some games based on JavaScript and HTML5, for instance, 2048, FlappyBird, DumbSoccer. There\'re not much of them, but I enjoy the process and the effort of tring new technologies, like Canvas, matter.js, cocos2d-html5, chipmunk. </p>'
			+ '<p>Besides, I\'ve tried to develop some plugins for Chrome. So far, I\'ve develop a video pop out plugin and a auto account information fill in plugin. You can check the source code form my <a href="http://www.github.com/elcarim5efil" target="_blank">github</a>.</p>'
			+ '<p>This page is developed on my own, using AngularJS and Bootstrap. The Blog module is based on Jekyll with a comment system named "DuoShuo".</p>'
			+ '<p>For the people who cannot read Chinese, I\'d like to apologize for my poor English and lack of English translations. I would be glad to translate all my posts to English, but it could take lots of my time. So, if you are interested in any of the non-translated posts, please let me know, I will translate it ASAP.</p>',
	},
	'MENU':{
		'PROFILE': 'PROFILE',
		'WORKS': 'WORKS',
		'PROJECTS': 'PROJECTS',
		'BLOG': 'BLOG',
		'CONTACT': 'CONTACT',
	}
};

app.config(['$translateProvider', function ($translateProvider) {
	$translateProvider
		.translations('zh', translations_zh)
		.translations('en', translations_en)
		.preferredLanguage('en');

}]);