var profileData = {};

profileData.profile = {
	gitrepo: 'https://github.com/elcarim5efil/repositories',
};
profileData.skills = [
		{	name: "JavaScript",
			level: 8
		},
		{	name: "HTML/CSS",
			level: 7
		},
		{	name: "C++",
			level: 7
		},
		{	name: "Photoshop",
			level: 8
		},
		{	name: "cocos2d-html5/chipmunk",
			level: 6
		},
		{	name: "Node.js",
			level: 6
		},
		{	name: "AngularJS",
			level: 6
		}
];

profileData.works = [
		// Remote Monitoring System for Smart Domestic Ground Heating
		{	name: {
				'en': "Remote Monitoring System for Smart Domestic Ground Heating",
				'zh': "智能家居地暖远程监控系统"
			},
			detail: {
				'en': "Embedded in the Smart Domestic Ground Heating System, including a server, web app, phone app. Users can monitor the the heating system with their computer and cellphone remotely.",
				'zh': "服务于智能家居地暖系统中的远程监控系统，包括服务器、Web应用以及手机APP，更详细的介绍请见项目经历。"
			},
			imagesURLs: [	
					'images/projects/remotesystem.jpg',
					'images/projects/login.jpg',
					'images/projects/control.jpg',
					'images/projects/cellphoneapp.jpg'
			],
			tasks: {
				'en': [
					'Node.js Server Develop',
					'Web App',
					'Cellphone APP',
					'C++/html/Javascript Programming',
				],
				'zh': [
					'Node.js 服务器',
					'Web应用',
					'手机APP',
					'C++、html与Javascript编程',
				],
			},
			links: [
				{	text:'Server Code', url: 'https://github.com/elcarim5efil/node_for_hc'	},
				{	text:'APP Code', url: 'https://github.com/elcarim5efil/QML_Project'	}
			]
		},
		// CSS3 Material Design
		{	name: {
				'en':"CSS3 Material Design",
				'zh':"CSS3 Material Design"
			},
			detail: {
				'en': "This is a Material Designe Style theme based on pure CSS3. The grid system is based on Bootstrap. So far, components like buttons, navigators have been completed, and I am working on other stuff.",
				'zh': "基纯CSS3设计的Material Design 风格主题，使用了Bootstrap的栅格化系统，目前已经实现按钮、导航栏等一些基本组件，项目正在开展中。",
			},
			imagesURLs: [	
					'images/projects/mdcss.jpg'
			],
			tasks: {
				'en': [
					'HTML5/CSS3'
				],
				'zh': [
					'HTML5/CSS3'
				],
			},
			links: [
				{	text:'Demo', url: './projects/CSS_MD/main_demo.html'	},
				{	text:'Code', url: 'https://github.com/elcarim5efil/CSS_MaterialDesign'	}
			]
		},
		// WebGame: 2048
		{	name: {
				'en':"WebGame: 2048",
				'zh':"网页游戏: 2048"
			},
			detail: {
				'en': "It was developed when I learn HTML5 animaition.",
				'zh': "学习HTML5动画时，尝试写的2048游戏，主要是练习使用CSS3的动画效果。",
			},
			imagesURLs: [	
					'images/projects/my2048.jpg'
			],
			tasks: {
				'en': [
					'JavaScript',
					'HTML5/CSS3'
				],
				'zh': [
					'JavaScript',
					'HTML5/CSS3'
				],
			},
			links: [
				{	text:'Demo', url: './projects/my2048/my2048.html'	}
			]
		},
		// WebGame: Dumb Soccer
		{	
			name: {
				'en':"WebGame: Dumb Soccer",
				'zh':"网页游戏: Dumb Soccer"
			},
			detail: {
				'en': "It is a game similar to another game called 'Soccer Physics', creating with Cocos2d-html5 and Chipmunk.",
				'zh': "参考了一个名为“Soccer Physics”的小游戏，是Cocos2d-html5 + Chipmunk游戏开发的试水作品。",
			},
			imagesURLs: [	
					'images/projects/dumbsoccer.jpg'
			],
			tasks: {
				'en': [
					'Game Design',
					'HTML5/CSS3',
					'Cocos2D-html5/Chiomunk',
					'Node.js/Pomelo'
				],
				'zh': [
					'游戏设计',
					'HTML5/CSS3',
					'Cocos2D-html5/Chiomunk',
					'Node.js/Pomelo'
				],
			},
			links: [
				{	text:'Demo', url: './projects/DumbSoccer/DumbSoccer.html'	}
			]
		},
		// WebGame: Flappy Bird
		{	
			name: {
				'en':"WebGame: Flappy Bird",
				'zh':"网页游戏: Flappy Bird"
			},
			detail: {
				'en': "This game is based on HTML5 Canvas/ JavaScript, without any other frameworks, which makes it time wasting.",
				'zh': "使用html5 canvas/JavaScript开发的flappy bird，没有使用其他框架，开发起来没有cocos2d-html5方便",
			},
			imagesURLs: [	
					'images/projects/flappybird.jpg'
			],
			tasks: {
				'en': [
					'JavaScrip',
					'HTML5/canvas'
				],
				'zh': [
					'JavaScrip',
					'HTML5/canvas'
				],
			},
			links: [
				{	text:'Demo', url: './projects/flappybird/flap.html'	},
				{	text:'Development Log', url: 'blog/2015/07/29/how_to_make_FlappyBird.html'	}
			]
		},
		// A* Graphic Demo
		{	
			name: {
				'en':"A* Graphic Demo",
				'zh':"A* 寻路算法测试"
			},
			detail: {
				'en': "Trying to implement the A* algorithm in JavaScript and display it with Canvas.",
				'zh': "利用Javascript实现A*寻路算法，并使用Canvas将其寻路结果显示出来.",
			},
			imagesURLs: [	
					'images/projects/a_star.jpg'
			],
			tasks: {
				'en': [
					'implement the algorithm',
					'HTML5/CSS3'
				],
				'zh': [
					'算法实现',
					'HTML5/CSS3'
				]
			},
			links: [
				{	text:'Demo', url: './projects/a_star/a_star.html'	}
			]
		},
		// Posters Design
		{	
			name: {
				'en':"Posters Design",
				'zh':"海报设计集"
			},
			detail: {
				'en': "Some posters I made when I was still a undergraduate. ",
				'zh': "这些是在本科时期所做的海报设计,海报多数是关于校红十字会及机械学院学生会所举办的活动,此外还有一些帮朋友所设计的海报。",
			},
			imagesURLs: [	
					'images/projects/poster_1.jpg',
					'images/projects/poster_2.jpg',
					'images/projects/poster_3.jpg',
					'images/projects/poster_4.jpg',
					'images/projects/poster_5.jpg',
					'images/projects/poster_6.jpg',
			],
			tasks: {
				'en': [
					'Graphic Design',
					'Photoshop'
				],
				'zh': [
					'创意设计',
					'Photoshop海报制作'
				]
			},
			links: null
		}
];

profileData.projects = [
		// Auto scheduling system for epxress
		{	name: {
				'en': "Auto Scheduling Simulation System for Super Express",
				'zh': "高铁智能调度模拟系统"
			},
			detail: {
				'en': "A project for a PLD Design Competition. It is a system that simulate the auto scheduling super expresses",
				'zh': "参加学校举办的PLD电子设计竞赛的小项目，当时的新闻热点是'723高铁事故',因此我们小组就想利用FPGA搭建一个高铁调度模拟系统。主要硬件是使用大赛配发的Cyclone III实验板。高铁运动模拟、控制算法、监控见面全部都在板上FPGA上面实现。我做负责的是监控模块的实现，这包括利用实验板上的SDRAM和VGA接口来实现界面显示，并将键盘和鼠标的驱动实现，完成整个监控部分的开发。最终的系统运行效果是，通过显示器、鼠标和键盘能够监控所有高速列车的运行信息，高速列车的制动、调度则由FPGA内部的控制算法实现。",
			},	
			tasks: {
				'en': [
					'System desgin',
					'VerilogHDL programming',
					'Driver develipment',
					'VGA driver development',
					'GUI design',
					'System testing'
				],
				'zh': [
					'系统设计',
					'VerilogHDL编程',
					'内存/控制器驱动开发',
					'VGA显示驱动开发',
					'控制界面设计',
					'系统测试'
				]
			},
			year: '2011',
			imageURL: 'images/projects/FPGA.jpg'
		},
		// 
		{	
			name: {
				'en': "Locking Screw Machine",
				'zh': "自动锁丝机"
			},
			detail: {
				'en': "The Locking Screw Machine locks screws on the board. My main task is to design the path programming algorithm and implement it in ST. Also, I need to design the GUI for the system control.",
				'zh': "整个项目主要工作是为自动锁丝机编写PLC控制程序、人机界面以及锁丝路径规划程序。我所负责的是人机界面的设计和实现，以及利用ST语言开发路径规划算法。",
			},
			tasks: {
				'en': [
					'Algorithm design',
					'ST programming',
					'GUI design',
				],
				'zh': [
					'锁丝路径规划算法设计与实现',
					'ST语言编程',
					'控制界面设计与实现'
				]
			},
			year: '2012',
			imageURL: 'images/projects/nails.jpg'
		},
		// 
		{	
			name: {
				'en': "Control Panel for a Smart Light Management System",
				'zh': "智能照明管理系统中的控制平板"
			},
			detail: {
				'en': "The control panel is like a iPad which runs Embedded-Linux. The panel is used for a light management, so it contains network module, touch screen module. My tasks are operating system transplant and software design.",
				'zh': "该控制平板作为智能照明管理系统的现场管理控制设备，因此需要为其定制软件系统。这是我首次使用Embedded-Linux系统并在其上利用Qt开发软件。该软件使用多进程实现，前台进程是操作界面，后台进程则是数据通信进程，负责对下层的照明设备控制器进行数据数据并将数据返回到上层的总服务器。软件使用Sqlite进行数据存储和管理，利用TCP Socket实现网络通信。",
			},		
			tasks: {
				'en': [
					'Qt software design',
					'System design based on TI AM3359',
					'Embedded-Linux system transplant',
					'Driver transplant and testing',
				],
				'zh': [
					'基于Qt的控制平板系统软件设计',
					'基于AM3359工业级控制平板系统设计',
					'Embedded-Linux系统移植',
					'驱动移植与调试'
				],
			},
			year: '2013',
			imageURL: 'images/projects/pad.jpg'
		},
		{	
			name: {
				'en': "MP3 player base on KL25Z",
				'zh': "基于KL25Z的MP3设计"
			},
			detail: {
				'en': "A project for a competition hosted by FreeScale. The processor has an internal touch bord controller which is also a unique feature of the processor. My main task is to design the gesture API for the MP3 player.",
				'zh': "飞思卡尔推出的KL25Z嵌入式处理器，特色之一是拥有一个电容触摸板控制器。基于该处理器的这个特点，参考Apple iPod的触摸圈，设计一个MP3播放器。为了实现该播放器，还需要额外的音频解码模块以及功率放大模块。而我的主要任务时实现触摸手势功能，并将uC/OS成功移植。。",
			},	
			tasks: {
				'en': [
					'Software design',
					'Touch board driver develop and gesture API design',
					'uC/OS transplant',
				],
				'zh': [
					'MP3软件设计',
					'触控板驱动及手势检测接口开发',
					'uC/OS 系统移植'
				],
			},
			year: '2013',
			imageURL: 'images/projects/FPGA.jpg'
		},
		// 
		{	
			name: {
				'en': "Remote Monitoring System for Smart Domestic Ground Heating",
				'zh': "家庭智能地暖远程监控系统"
			},
			detail: {
				'en': "Embedded in the Smart Domestic Ground Heating System, including a server, web app, phone app. Users can monitor the the heating system with their computer and cellphone remotely.The server is based on Node.js with the framework Express.js, running as a BS/CS mixed mode server. And the web page is using jQuery, cellphone app is using QtQuick/QML.",
				'zh': "这个系统为智能家居地暖系统提供远程监控服务。系统中的服务器使用Node.js进行开发，并以C/S和B/S混合模式实现，因此用户能够使用web页面或手机APP访问。web页面使用html进行开发，并使用到了jQuery，目前正准备使用AngularJS更新Web页面的实现方式。手机APP则是基于QML（Qt下的一种UI开发语言）进行开发，为了降低跨平台APP开发的难度。开始时项目只有我一人，因此所选用的工具都是较为轻量、可移植性强的，为的就是降低开发难度，缩短开始时间。直到最近，有更多人加入到项目中，因此逐步使用新的技术更新原来的设计，以提高系统的性能。",
			},
			tasks: {
				'en': [
					'System design',
					'Cellphone app based on QtQuick/QML',
					'Node.js Server',
					'Web Design',
				],
				'zh': [
					'系统设计',
					'基于QtQuick/QML的手机客户端APP开发',
					'基于Node.js的服务器开发',
					'Web页面开发'
				],
			},
			year: '2014~2015',
			imageURL: 'images/projects/remote_system_thumb.jpg'
		}
];

profileData.contacts = [
		{	name: "address",
			text: "Jiangsu Nanjing",
			href: ""
		},
		{	name: "phone",
			text: "+86-1806161****",
			href: ""
		},
		{	name: "github",
			text: "github.com/elcarim5efil",
			href: "http://www.github.com/elcarim5efil"
		},
		{	name: "email",
			text: "elcarim5efil@aliyun.com",
			href: "mailto:elcarim5efil@aliyun.com"
		},
		{	name: "gmail",
			text: "elcarim5efil@gmail.com",
			href: "mailto:elcarim5efil@gmail.com"
		},
		{	name: "cnblog",
			text: "CNBLOG",
			href: "http://www.cnblogs.com/elcarim5efil/"
		}
];