cc.game.onStart = function() {
	cc.view.setDesignResolutionSize(800, 400, cc.ResolutionPolicy.SHOW_ALL);
	//pair_up
	//cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
	cc.LoaderScene.preload(gameResources, function(){
		cc.director.runScene(new gameScene());
	}, this);
};
cc.game.run();