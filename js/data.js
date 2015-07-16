var profileData = {};

profileData.profile = {
	introduction:"勤奋刻苦，善于钻研，自律严谨，有探索精神，勇于尝试新技术，能够独立完成开发，也乐意参与团队协作相互学习。自从尝试Web应用开发后一发不可收拾，爱上了JavaScript以及Node。鉴于自身爱好电子游戏，因此以JavaScript和Html5为基础，尝试开发一些小游戏。虽然作品不多，但尝试过matter.js、cocos2d-html5、chipmunk等开发工具，并有少许心得。除此以外，对服务器开发也十分热爱，目前正在学习Nginx和thttpd，打算尝试着写一个简单的http服务器，以加深对服务器开发的理解。",
	name: "Elcarim",
	info:'东南大学 自动化学院',
};
profileData.skills = [
		{	name: "JavaScript",
			level: 90
		},
		{	name: "HTML/CSS",
			level: 86
		},
		{	name: "C++",
			level: 90
		},
		{	name: "Photoshop",
			level: 86
		},
		{	name: "cocos2d-html5/chipmunk",
			level: 64
		},
		{	name: "Node.js",
			level: 80
		},
		{	name: "AngularJS",
			level: 70
		}
];

profileData.works = [
		{	name: "智能家居地暖远程监控系统",
			detail: "服务于智能家居地暖系统中的远程监控系统，包括服务器、Web应用以及手机APP，更详细的介绍请见项目经历。",
			imagesURLs: [	
					'images/projects/remotesystem.jpg',
					'images/projects/login.jpg',
					'images/projects/control.jpg',
					'images/projects/cellphoneapp.jpg'
			],
			tasks: [
				'Node.js 服务器',
				'Web应用',
				'手机APP',
				'C++、html与Javascript编程',
			],
			links: [
				{	text:'Server Code', url: 'https://github.com/elcarim5efil/node_for_hc'	},
				{	text:'APP Code', url: 'https://github.com/elcarim5efil/QML_Project'	}
			]
		},
		{	name: "WebGame: 2048",
			detail: "学习HTML5动画时，尝试写的2048游戏，主要是练习使用CSS3的动画效果。",
			imagesURLs: [	
					'images/projects/my2048.jpg'
			],
			tasks: [
				'JavaScript',
				'HTML5/CSS3'
			],
			links: [
				{	text:'在线演示', url: './projects/my2048/my2048.html'	}
			]
		},
		{	name: "WebGame: Dumb Soccer",
			detail: "参考了一个名为“Soccer Physics”的小游戏，是Cocos2d-html5 + Chipmunk游戏开发的试水作品。目前正在开发中，并将使用Node.js的Pomelo实现双人联机对战模式。",
			imagesURLs: [	
					'images/projects/dumbsoccer.jpg'
			],
			tasks: [
				'游戏设计',
				'HTML5/CSS3',
				'Cocos2D-html5/Chiomunk',
				'Node.js/Pomelo'
			],
			links: [
				{	text:'在线演示', url: './projects/my2048/my2048.html'	}
			]
		},
		{	name: "A* 寻路算法测试",
			detail: "利用Javascript实现A*寻路算法，并使用Canvas将其寻路结果显示出来.",
			imagesURLs: [	
					'images/projects/a_star.jpg'
			],
			tasks: [
				'算法实现',
				'HTML5/CSS3'
			],
			links: [
				{	text:'在线演示', url: './projects/my2048/my2048.html'	}
			]
		},
		{	name: "海报设计集",
			detail: "这些是在本科时期所做的海报设计,海报多数是关于校红十字会及机械学院学生会所举办的活动,此外还有一些帮朋友所设计的海报.",
			imagesURLs: [	
					'images/projects/poster_1.jpg',
					'images/projects/poster_2.jpg',
					'images/projects/poster_3.jpg',
					'images/projects/poster_4.jpg',
					'images/projects/poster_5.jpg',
					'images/projects/poster_6.jpg',
			],
			tasks: [
				'创意设计',
				'Photoshop海报制作'
			],
			links: null
		}
];

profileData.projects = [
		{	name: "高铁智能调度模拟系统",
			detail: "参加学校举办的PLD电子设计竞赛的小项目，当时的新闻热点是'723高铁事故',因此我们小组就想利用FPGA搭建一个高铁调度模拟系统。主要硬件是使用大赛配发的Cyclone III实验板。高铁运动模拟、控制算法、监控见面全部都在板上FPGA上面实现。我做负责的是监控模块的实现，这包括利用实验板上的SDRAM和VGA接口来实现界面显示，并将键盘和鼠标的驱动实现，完成整个监控部分的开发。最终的系统运行效果是，通过显示器、鼠标和键盘能够监控所有高速列车的运行信息，高速列车的制动、调度则由FPGA内部的控制算法实现。",
			year: '2011',
			tasks: [
				'系统设计',
				'VerilogHDL编程',
				'内存/控制器驱动开发',
				'VGA显示驱动开发',
				'控制界面设计',
				'系统测试'
			],
			imageURL: 'images/projects/FPGA.jpg'
		},
		{	name: "自动锁丝机",
			detail: "整个项目主要工作是为自动锁丝机编写PLC控制程序、人机界面以及锁丝路径规划程序。我所负责的是人机界面的设计和实现，以及利用ST语言开发路径规划算法。",
			year: '2012',
			tasks: [
				'锁丝路径规划算法设计与实现',
				'ST语言编程',
				'控制界面设计与实现'
			],
			imageURL: 'images/projects/nails.jpg'
		},
		{	name: "智能照明管理系统中的控制平板",
			detail: "该控制平板作为智能照明管理系统的现场管理控制设备，因此需要为其定制软件系统。这是我首次使用Embedded-Linux系统并在其上利用Qt开发软件。该软件使用多进程实现，前台进程是操作界面，后台进程则是数据通信进程，负责对下层的照明设备控制器进行数据数据并将数据返回到上层的总服务器。软件使用Sqlite进行数据存储和管理，利用TCP Socket实现网络通信。",
			year: '2013',
			tasks: [
				'基于Qt的控制平板系统软件设计',
				'基于AM3359工业级控制平板系统设计',
				'Embedded-Linux系统移植',
				'驱动移植与调试'
			],
			imageURL: 'images/projects/pad.jpg'
		},
		{	name: "基于KL25Z的MP3设计",
			detail: "飞思卡尔推出的KL25Z嵌入式处理器，特色之一是拥有一个电容触摸板控制器。基于该处理器的这个特点，参考Apple iPod的触摸圈，设计一个MP3播放器。为了实现该播放器，还需要额外的音频解码模块以及功率放大模块。而我的主要任务时实现触摸手势功能，并将uC/OS成功移植。",
			year: '2013',
			tasks: [
				'MP3软件设计',
				'触控板驱动及手势检测接口开发',
				'uC/OS 系统移植'
			],
			imageURL: 'images/projects/FPGA.jpg'
		},
		{	name: "家庭智能地暖远程监控系统",
			detail: "这个系统为智能家居地暖系统提供远程监控服务。系统中的服务器使用Node.js进行开发，并以C/S和B/S混合模式实现，因此用户能够使用web页面或手机APP访问。web页面使用html进行开发，并使用到了jQuery，目前正准备使用AngularJS更新Web页面的实现方式。手机APP则是基于QML（Qt下的一种UI开发语言）进行开发，为了降低跨平台APP开发的难度。开始时项目只有我一人，因此所选用的工具都是较为轻量、可移植性强的，为的就是降低开发难度，缩短开始时间。直到最近，有更多人加入到项目中，因此逐步使用新的技术更新原来的设计，以提高系统的性能。",
			year: '2014~2015',
			tasks: [
				'系统设计',
				'基于QML的手机客户端APP开发',
				'基于Node.js的服务器开发',
				'Web页面开发'
			],
			imageURL: 'images/projects/remote_system_thumb.jpg'
		}
];

profileData.contacts = {
		address: {	text: "Jiangsu Nanjing",
					href: ""
		},
		phone: {	text: "+86-1806161****",
					href: ""
		},
		github: {	text: "github.com/elcarim5efil",
					href: "http://www.github.com/elcarim5efil"
		},
		email: {	text: "elcarim5efil@aliyun.com",
					href: "mailto:elcarim5efil@aliyun.com"
		},
		gmail: {	text: "elcarim5efil@gmail.com",
					href: "mailto:elcarim5efil@gmail.com"
		},
};