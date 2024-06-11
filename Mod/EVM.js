G.AddData({
	name:'Extra Vegetables Mod',
	author:'Orteil, Nelvinishere',
	desc:'A mod that adds vegetables and processed extras.',
	engineVersion:1,
	manifest:'modManifest.js',
	requires:['Default dataset*'],
	sheets:{'spicySheet':'img/Modext.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
	func:function()
	{
		//The idea in this expanded version of the peppers mod is to add more elements focused around other vegetables and recipes.Orteil added hot peppers and hot sauce while i will be adding a lot more stuff
		
		//First we create a couple new resources :
		new G.Unit({
			name:'farmer',
			desc:'a farmer farms crops and makes food for the public to enjoy',
			cost:{'food':5},
			uses:{'worker':1, 'farm':1}
		})
		new G.Res({
			name:'hot pepper',
			desc:'[hot pepper]s are loaded with capsaicin and, depending on who you ask, may produce a pleasant burn when eaten.',
			icon:[0,0,'spicySheet'],
			turnToByContext:{'eat':{'health':0.01,'happiness':0.03},'decay':{'spoiled food':0.5}},//this basically translates to : "when eaten, generate some health and happiness; when rotting, turn into either nothing or some spoiled food"
			partOf:'food',
			category:'food',
		});
		new G.res({
			name:'cursed pepper',
			desc:'[cursed pepper]s are more powerful then hot peppers and has seeds and it is spicier and rarer.',
			icon:[2,2,'spicySheet'],
			turnToByContext:{'eat':{'health':0.04,'happiness':0.03},'decay':{'spoiled food':0.15}},//that means Less rotten food then nothing
			partOf:'food',
			category:'food',
		});
		new G.Res({
			name:'hot sauce',
			desc:'Made from [herb]s and the [hot pepper,Spiciest peppers], this [hot sauce] stays fresh for a while and will leave anyone panting and asking for more.',
			icon:[1,0,'spicySheet'],
			turnToByContext:{'eat':{'health':0.03,'happiness':0.1},'decay':{'hot sauce':0.95,'spoiled food':0.05}},//that last part makes hot sauce effectively have a 95% chance of simply not rotting (in effect, it decays into itself)
			partOf:'food',
			category:'food',
		});
		new G.unit({
			name:'Farm',
			desc:'the building where you make food without gathering a single thing',
			icon:[2,3,'spicySheet'],
			cost:{'basic building materials':100},
			uses:{'land':1}
		});
		
		//Then we augment the base data to incorporate our new resources :
			//adding hot pepper and others as something that can be gathered from grass
		G.getDict('grass').res['gather']['cursed pepper']=0.5;
		G.getDict('grass').res['gather']['hot pepper']=3;
			//adding a new mode to artisans so they can make hot sauce from hot peppers
		G.getDict('artisan').modes['hot sauce 1']={name:'Make hot sauce from hot peppers',desc:'Turn 3 [hot pepper]s and 3 [herb]s into 1 [hot sauce].',req:{'hot sauce preparing':true},use:{'knapped tools':1}};
		G.getDict('artisan').modes['hot sauce 2']={name:'Make extra hot sauce', desc: 'turns 1 [cursed pepper], 3 [herb]s and [water] into hot sauce'}
			//adding a new effect to artisans that handles the actual hot sauce preparing and is only active when the unit has the mode "hot sauce"
		G.getDict('artisan').effects.push({type:'convert',from:{'hot pepper':3,'herb':3},into:{'hot sauce':1},every:3,mode:'hot sauce 1'});
		G.getDict('artisan').effects.push({type:'convert',from:{'cursed pepper':1,'herb':3,'water':1}, into:{'hot sauce':1},every:3,mode:'hot sauce 2'})
		//Then we add a new technology which is required by the artisans to gain access to the "hot sauce" mode :
		new G.Tech({
			name:'hot sauce preparing',
			desc:'@[artisan]s can now produce [hot sauce] from [hot pepper]s and [herb]s//This special recipe allows a skilled craftsman to fully express the complex aromas present in hot peppers.',
			icon:[1,2,'spicySheet'],
			cost:{'insight':10},
			req:{'cooking':true},
		});
		new G.Tech({
			name:'farming',
			desc:'[farming] is a basic extension of gathering and is consisted of planting stuff and the image is a placeholder',
			icon:[2,3,'spicySheet'],
			cost:{'insight':5, 'influence':1},
			req:{'stone knapping':true}
		})
		
		//Orteil added a trait that amplifies the benefits of consuming hot sauce; it will take on average 20 years to appear once the conditions (knowing the "Hot sauce preparing" tech) is fulfilled.
		new G.Trait({
			name:'hot sauce madness',
			desc:'@your people appreciate [hot sauce] twice as much and will be twice as happy from consuming it.',
			icon:[1,3,'spicySheet'],
			chance:20,
			req:{'hot sauce preparing':true},
			effects:[
				{type:'function',func:function(){G.getDict('hot sauce').turnToByContext['eat']['happiness']=0.2;}},//this is a custom function executed when we gain the trait
			],
		});
		
		//There are many other ways of adding and changing content; refer to /data.js, the default dataset, if you want to see how everything is done in the base game. Good luck!
	}
	});