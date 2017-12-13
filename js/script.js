$(document).ready(function(){
	console.log("DOM is ready");
	//initializing four arrays one to hold all the tiles before shuffling
	//the second is to hold the boneyard tiles
	//the third is to hold the player tiles
	//the fourth to hold the computer tiles
	let allTiles, bonyardTiles, playerTiles, computerTiles = [];

	//creating the 28 tiles of the game
	allTiles = createAllTiles();

	//shuffling the tiles after creating them
	shufflingTiles(allTiles);

	//assigning the player his/her tiles
	playerTiles = assignTiles(allTiles, 0, 6);

	//assigning the computer its tiles
	computerTiles = assignTiles(allTiles, 7, 13);

	//assigning the boneyard the 14 remaining tiles
	boneyard = assignTiles(allTiles, 14, 27);

	//showing the computer's tiles on the page
	drawComputerInitialTiles(computerTiles);

	//showing the player's tiles on the page
	drawPlayerInitialTiles(playerTiles);

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
	function drawComputerTile(aTile){
		$("<div></div>").addClass(String(aTile.value1) + String(aTile.value2) + " tileVertical faceDown").appendTo("#computerBoard");	
	};

	//function draw the initial 7 tiles for the computer
	function drawComputerInitialTiles(computerTiles){
		for (let i = 0; i < computerTiles.length - 1; i++) {
			drawComputerTile(computerTiles[i]);
		};
	};

	//function to draw a tile for the player
	function drawPlayerTile(aTile){
		let numberToString = ["zero", "one", "two", "three", "four", "five","six"];
		let upperPart = $("<div></div>").addClass("tileSquareVerticalTop").css("backgroundImage", "url(images/" + numberToString[aTile.value1]+".png");
		let bottomPart = $("<div></div>").addClass("tileSquareVerticalBottom").css("backgroundImage", "url(images/" + numberToString[aTile.value2]+".png");
		let verticalTile = $("<div></div>").addClass(String(aTile.value1) + String(aTile.value2) + " tileVertical");
		upperPart.appendTo(verticalTile);
		bottomPart.appendTo(verticalTile);
		verticalTile.appendTo("#playerBoard");
	};

	//function draw the initial 7 tiles for the player
	function drawPlayerInitialTiles(playerTiles){
		for (let i = 0; i < playerTiles.length - 1; i++) {
			drawPlayerTile(playerTiles[i]);
		}
	};
});
