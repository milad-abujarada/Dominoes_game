$(document).ready(function(){
	console.log("DOM is ready");
	//initializing four arrays one to hold all the tiles before shuffling
	//the second is to hold the boneyard tiles
	//the third is to hold the player tiles
	//the fourth to hold the computer tiles
	let allTiles, bonyardTiles, playerTiles, computerTiles = [];
	allTiles = createAllTiles();
	shufflingTiles(allTiles);
	playerTiles = assignTiles(allTiles, 0, 6);
	computerTiles = assignTiles(allTiles, 7, 13);
	boneyard = assignTiles(allTiles, 14, 27);
	drawComputerInitialTiles(computerTiles);
	//drawTile(computerTiles[0]);
	console.log(allTiles);
	console.log(playerTiles);
	console.log(computerTiles);
	console.log(boneyard);

	//creating object tile
	function Tile(value1, value2){
		this.value1 = value1;
		this.value2 = value2;		
	};

	//create a tile
	function createTile(value1, value2){
		return(new Tile(value1,value2));
	};

	//populating the allTiles array
	function createAllTiles(){
		let tiles = [];
	    for (let i = 0; i < 7; i++) {
			for (let j = i; j < 7; j++) {
			tiles.push(createTile(i,j));
			}
		}	
		return tiles;
	};

	//shuffling the Tiles in the allTiles array
	function shufflingTiles(allTiles){
		let randomNum1, randomNum2, temp;
		for(let i = 0; i < allTiles.length - 1; i++){
			randomNum1 = Math.floor(Math.random() * 28);
			randomNum2 = Math.floor(Math.random() * 28);
			temp = allTiles[randomNum1];
			allTiles[randomNum1] = allTiles[randomNum2];
			allTiles[randomNum2] = temp;
		};
	};

	//function to assign values to bonyardTiles, playerTiles, and computerTiles arrays
	function assignTiles(allTiles, index, endOfArray){
		let subTiles = [];
		for (var i = index; i <= endOfArray; i++) {
			subTiles.push(allTiles[i]);
		};
		return subTiles;
	};

	//function to draw a tile for the computer 
	function drawTile(aTile){
		$("<div></div>").addClass(String(aTile.value1) + String(aTile.value2) + " tileVertical faceDown").appendTo("#computerBoard");	
	};

	//function draw the initial 7 tiles for the computer
	function drawComputerInitialTiles(computerTiles){
		for (let i = 0; i < computerTiles.length - 1; i++) {
			drawTile(computerTiles[i]);
		};
	};
});
