$(document).ready(function(){
	console.log("DOM is ready");
	//initializing five arrays one to hold all the tiles before shuffling
	//the second is to hold the boneyard tiles
	//the third is to hold the player tiles
	//the fourth to hold the computer tiles
	//the fifth is the tiles that were placed in the play area;
	let allTiles, boneyardTiles, playerTiles, computerTiles, playAreaTiles = [];

	// array to be used for tranlating the number on a half a tile to the corresponding string 
	// in order to be use in getting the right image from the images folder
	let numberToString = ["zero", "one", "two", "three", "four", "five","six"];
	let numberToStringHorizontal = ["zero", "one", "two", "three", "four", "five","horizontalSix"]
	//creating the 28 tiles of the game
	allTiles = createAllTiles();

	//shuffling the tiles after creating them
	shufflingTiles(allTiles);

	//assigning the player his/her tiles
	playerTiles = assignTiles(allTiles, 0, 6);
	
	//assigning the computer its tiles
	computerTiles = assignTiles(allTiles, 7, 13);

	//assigning the boneyard the 14 remaining tiles
	boneyardTiles = assignTiles(allTiles, 14, 27);
	
	//assigning the first tile in the play area to the playAreaTiles array
	playAreaTiles.push(placeFirstTile(boneyardTiles));

console.log(boneyardTiles);
	//remove the 1st placed tile in the play area from the boneyard


	//draw the first tile in the play area to signal the game start
	drawTilePlayArea(playAreaTiles[0].value1, playAreaTiles[0].value2, "tile1", numberToStringHorizontal);

	//showing the computer's tiles on the page
	drawComputerInitialTiles(computerTiles);

	//showing the player's tiles on the page
	drawPlayerInitialTiles(playerTiles, numberToString);

	//showing the boneyard tiles on the page
	drawBoneyardInitialTiles(boneyardTiles);

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

	//function to assign values to boneyardTiles, playerTiles, and computerTiles arrays
	function assignTiles(allTiles, index, endOfArray){
		let subTiles = [];
		for (var i = index; i <= endOfArray; i++) {
			subTiles.push(allTiles[i]);
		};
		return subTiles;
	};

	//function to draw a tile for the computer 
	function drawComputerTile(aTile){
		$("<div></div>").addClass("tileVertical faceDown").attr("id", String(aTile.value1) + String(aTile.value2)).appendTo("#computerBoard");	
	};

	//function draws the initial 7 tiles for the computer
	function drawComputerInitialTiles(computerTiles){
		for (let i = 0; i < computerTiles.length; i++) {
			drawComputerTile(computerTiles[i]);
		};
	};

	//function to draw a tile for the player
	function drawPlayerTile(aTile, numberToString){
		let upperPart = $("<div></div>").addClass("tileSquareVerticalTop").css("backgroundImage", "url(images/" + numberToString[aTile.value1]+".png");
		let bottomPart = $("<div></div>").addClass("tileSquareVerticalBottom").css("backgroundImage", "url(images/" + numberToString[aTile.value2]+".png");
		let verticalTile = $("<div></div>").addClass("tileVertical").attr("id", String(aTile.value1) + String(aTile.value2));
		upperPart.appendTo(verticalTile);
		bottomPart.appendTo(verticalTile);
		verticalTile.appendTo("#playerBoard");
	};

	//function draws the initial 7 tiles for the player
	function drawPlayerInitialTiles(playerTiles, numberToString){
		for (let i = 0; i < playerTiles.length; i++) {
			drawPlayerTile(playerTiles[i], numberToString);
		}
	};

	//function to draw a tile for the boneyard
	function drawBoneyardTile(aTile){
		$("<div></div>").addClass("tileHorizontal faceDownBlock").attr("id", String(aTile.value1) + String(aTile.value2)).appendTo("#boneyardTiles");	
	};

	//function draws the initial 14 tiles of the boneyard
	function drawBoneyardInitialTiles(boneyardTiles){
		for(let i = 0; i < boneyardTiles.length; i++) {
			drawBoneyardTile(boneyardTiles[i]);
		}
	};

	//function to place the initial tile in the play area in order to start the game
	function placeFirstTile(boneyardTiles){
		let index = Math.floor(Math.random() * 14);
		let temp = boneyardTiles[index];
		boneyardTiles[index] = boneyardTiles[boneyardTiles.length - 1];
		boneyardTiles[boneyardTiles.length - 1] = temp; 
		return boneyardTiles.pop();
	};

	//function draw a tile in the play area
	function drawTilePlayArea(aTileRightValue, aTileLeftValue, location, numberToString){
		let targetedTile = $("#" + location);
		if (targetedTile.hasClass("emptyTile")){
			targetedTile.removeClass("emptyTile");
			$("<div></div>").addClass("tileSquareHorizontalRight").css("backgroundImage", "url(images/" + numberToString[aTileRightValue] +".png").appendTo(targetedTile);
			$("<div></div>").addClass("tileSquareHorizontalLeft").css("backgroundImage", "url(images/" + numberToString[aTileLeftValue] +".png").appendTo(targetedTile);
		}
	};

	// //function to remove an element from an array and adjust the array
	// function removeValueFromArray(index)

	// //function to remove the draw of a tile  
	// function removeTile(aTile){
	// 	$("#" + String(aTile.value1) + String(aTile.value2)).remove();
	// }
});
