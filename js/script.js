//creating object tile used to create the game tiles
function Tile(value1, value2){
	this.value1 = value1;
	this.value2 = value2;		
};

//global variable of a tile to hold the tile to be moved from boneyard side to either player side or computer side
//or to be moved from the player side or the computer side to the playarea 
var toBeMovedTile = new Tile();

var blankTile = new Tile();

//availableSides to hold the sides that represent the available options to play against where index [0] represent 
//the left open side of the left most tile and index [1] represent the open side of the right most tile
var availableSides = [];
var availableSidesLocation = [];
//initializing five arrays one to hold all the tiles before shuffling
//the second is to hold the boneyard tiles
//the third is to hold the player tiles
//the fourth to hold the computer tiles
//the fifth is the tiles that were placed in the play area;
var allTiles, boneyardTiles, playerTiles, computerTiles = [];	

// array to be used for tranlating the number on either half of a tile to the corresponding string 
// in order to be use in getting the right image from the images folder
var numberToString = ["zero", "one", "two", "three", "four", "five","six"];
var numberToStringHorizontal = ["zero", "one", "two", "three", "four", "five","horizontalSix"];

//the functionality that needs to be implemented after the DOM is ready
$(document).ready(function(){
	console.log("DOM is ready");//making sure script.js is linked correctly

	// attaching a delegated click event handler on the player tiles area
    $("#playerBoard").on( "click", ".tileVertical", function(event){ 
    	removeHighlight();// calling removeHighlight function to remove any previously highlighted tile

    	//highlighting the clicked tile 
    	highlightTile($(this).attr("id"));

		let tempTile = new Tile(parseInt($(this).attr("id").charAt(0)), parseInt($(this).attr("id").charAt(1)));

		toBeMovedTile = blankTile;

		//prepearing the clicked tile to be moved
    	toBeMovedTile =  playerTiles[findTile(tempTile, playerTiles)];//prepearTileForMove(playerTiles[findTile(tempTile, playerTiles)],toBeMovedTile);/* parseInt($(this).attr("id").charAt(0)), parseInt($(this).attr("id").charAt(1)));*/
	});

    // attaching a delegated click event handler on the play area that would triggered on empty tiles only
    $("#playBoard").on( "click", ".emptyTile", function(event){ 
    	// checking if the player highlighted a tile to be moved or not
    	//in case no highlighted tile then nothing happens
    	if($(".highlight").length){
    		//getting the clicked empty tile location and its occupied neighboring tile id if a neighbor is occupied
    		let emptyTileId = $(this).attr("id");
	    	let occupiedTileId = OccupiedNeighboringTile(emptyTileId);
	    	let clickedTileLocation = emptyTileLocation(emptyTileId);
	    	//checking if there is an occupied tile next to the clicked empty tile if there isn't then nothing happens
	    	//otherwise proceed 
	    	if(occupiedTileId){
	    		//first we get the occupied tile index in availableSidesLocation array in order to match
	    		//that value to the corresponding value in the availableSide array to determin the matching sides
	    		let index = occupiedTileIndex(occupiedTileId, availableSidesLocation, emptyTileId);
	    		let matchingSides = checkForMatch(index, toBeMovedTile, availableSides);
	    		// if there are matching sides and the click wasn't on the other occupied tile on the other end
	    		//of the played tiles then proceed
	    		if(typeof matchingSides != "undefined"){
	    			//geting the value of the not matching side 
	    			let notMatchingSide = toBeMovedTile.value1 === matchingSides ? toBeMovedTile.value2 : toBeMovedTile.value1;
	    			//check to see if the occupied tile is on the right or left, top or bottom of the clicked empty tile
	    			let occupiedLocation = occupiedTileLocation(occupiedTileId, emptyTileId, clickedTileLocation);
	    			//take the fact that occupiedLocation is known, and clickedTileLocation is know and do the calling of draw
	    			//drawplayAreaTile then call adjust available sides and AvailableSidesLocation using index arraies, 
	    			//add the tile in plarArea array, remove the tile from player
	    			//area, remove divs from player area, redraw player area tiles, 
	    			if((clickedTileLocation === "upperRow") && (occupiedLocation === "left")){
	    				drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToStringHorizontal);
	    				changingOnethAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "upperRow") && (occupiedLocation === "right")){
	    				drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToStringHorizontal);
	    				changingZerothAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "bottomRow") && (occupiedLocation === "left")){
	    				drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToStringHorizontal);
	    				changingZerothAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "bottomRow") && (occupiedLocation === "right")){
	    				drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToStringHorizontal);
	    				changingOnethAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "leftColumn") && (occupiedLocation === "top")){
	    				drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToString);
	    				changingZerothAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "leftColumn") && (occupiedLocation === "bottom")){
	    				drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToString);
	    				changingZerothAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "rightColumn") && (occupiedLocation === "top")){
	    				drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToString);
	    				changingOnethAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			}else if((clickedTileLocation === "rightColumn") && (occupiedLocation === "bottom")){
	    				drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToString);
	    				changingZerothAvailableSide(notMatchingSide, emptyTileId);
	    				drawingPlayersMove();
	    			};		
	    		};	 
		    };
    	};	
    });
	$("#boneyardTiles").on( "click", ".faceDownBlock", function(event){
console.log($(this).attr("id"));
		toBeMovedTile = blankTile; //prepearTileForMove(blankTile, toBeMovedTile);
		removeHighlight();// calling removeHighlight function to remove any previously highlighted tile
		let tempTile = new Tile(parseInt($(this).attr("id").charAt(0)), parseInt($(this).attr("id").charAt(1)));
		toBeMovedTile =  boneyardTiles[findTile(tempTile, boneyardTiles)];//prepearTileForMove(boneyardTiles[findTile(tempTile, boneyardTiles)], toBeMovedTile);
		removeTile(toBeMovedTile, boneyardTiles);
		removeTilesDrawing("boneyardTiles", "faceDownBlock");
		drawBoneyardTiles(boneyardTiles);
		assignTile(toBeMovedTile, playerTiles);
		eraseAndDrawPlayerTiles();
		toBeMovedTile = blankTile; //prepearTileForMove(blankTile, toBeMovedTile);
	});


	//creating the 28 tiles of the game
	allTiles = createAllTiles();

	//shuffling the tiles after creating them
	shufflingTiles(allTiles);
	console.log(allTiles);

	//assigning the player his/her tiles
	playerTiles = assignTiles(allTiles, 0, 6);
	
	//assigning the computer its tiles
	computerTiles = assignTiles(allTiles, 7, 13);

	//assigning the boneyard the 14 remaining tiles
	boneyardTiles = assignTiles(allTiles, 14, 27);
	console.log(boneyardTiles);
	
	//assigning the first tile in the play area to the playAreaTiles array
	let firstTile = selectFirstTile(boneyardTiles);
	console.log(boneyardTiles);
	
	//remove the 1st placed tile in the play area from the boneyard
	removeTile(firstTile, boneyardTiles);
	console.log(boneyardTiles);
	//showing the computer's tiles on the page
	drawComputerTiles(computerTiles);

	//showing the player's tiles on the page
	drawPlayerTiles(playerTiles, numberToString);

	//showing the boneyard tiles on the page
	drawBoneyardTiles(boneyardTiles);

	//draw the first tile in the play area to signal the game start
	drawPlayAreaTile(firstTile.value1, firstTile.value2, "tile1", numberToStringHorizontal);

	//create a tile using Tile constructor where the arguments are the values on the tiles sides and the return is a single tile
	function createTile(value1, value2){
		return(new Tile(value1,value2));
	};

	//populating the allTiles array by creating 28 tiles using function createTile.
	//this function returns an array of tiles 
	function createAllTiles(){
		let tiles = [];
	    for(let i = 0; i < 7; i++){
			for(let j = i; j < 7; j++){
			tiles.push(createTile(i,j));
			}
		}	
		return tiles;
	};

	//shuffling the Tiles in the allTiles array 
	//the function has no return but it takes an array of tiles
	function shufflingTiles(allTiles){
		let randomNum1, randomNum2, temp;
		for(let i = 0; i < allTiles.length - 1; i++){
			randomNum1 = Math.floor(Math.random() * allTiles.length);
			randomNum2 = Math.floor(Math.random() * allTiles.length);
			temp = allTiles[randomNum1];
			allTiles[randomNum1] = allTiles[randomNum2];
			allTiles[randomNum2] = temp;
		};
	};

	//function to assign tiles to boneyardTiles, playerTiles, and computerTiles arrays
	//the function takes an array of tiles, the starting index and the ending index of the values in the new array
	//the function returns an array of tiles that contain the tiles from the startIndex to the endIndex
	function assignTiles(allTiles, startIndex, endIndex){
		let subTiles = [];
		for(var i = startIndex; i <= endIndex; i++){
			subTiles.push(allTiles[i]);
		};
		return subTiles;
	};

	//function to select a random first tile from the boneyardTiles array of tiles 
	//in order to place that tile in the play area to start the game
	//the function takes an array of the tiles as an argument and returns a single random tile
	//the function also uses function storeAvailableSides to store the values of the randomly selected tile 
	//in the availableSides array and its location in the availableSidesLocation array
	function selectFirstTile(boneyardTiles){
		let index = Math.floor(Math.random() * boneyardTiles.length);
		let temp = boneyardTiles[index];
		boneyardTiles[index] = boneyardTiles[boneyardTiles.length - 1];
		boneyardTiles[boneyardTiles.length - 1] = temp; 
		let firstTile = boneyardTiles.pop();
		storeAvailableSides(availableSides, firstTile.value1, firstTile.value2);
		storeAvailableSidesLocation(availableSidesLocation, "tile1", "tile1")
		return firstTile;
	};

	//function to store the initial available two playing options for the first tile placed to signal the game start
	//it's also used stores of the open sides of the tiles on the most left and most right of the play area.
	//The function takes in the array availableSides, the value of a tile's left side, and/or the value a tile's
	//right side as arguments and returns nothing, but it modifies the availableSides array by adding 
	//the most left side value to index [0] and the most right side value to index [1]. 
	function storeAvailableSides(availableSides, leftSide, rightSide){
		if(availableSides.length){
			if(leftSide || (leftSide === 0)){
				availableSides[0] = leftSide;
			};
			if(rightSide || (rightSide === 0)){
				availableSides[1] = rightSide;
			};
		}else{
			availableSides.push(leftSide);
			availableSides.push(rightSide);
		};
	};

	//function to store the initial available two playing options location to be used in played tiles placement later
	//The function takes in the array availableSidesLocation, the location of the tile in the most left side, and the location
	//of the tile at the most right side as arguments. the function modifies the availableSidesLocation array by adding 
	//the most left tile location to index [0] and the most right tile location to index [1]. 
	function storeAvailableSidesLocation(availableSidesLocation, leftTileLocation, rightTileLocation){
		if(availableSidesLocation.length){
			if(leftTileLocation){
				availableSidesLocation[0] = leftTileLocation;
			};
			if(rightTileLocation){
				availableSidesLocation[1] = rightTileLocation;
			};
		}else{
			availableSidesLocation.push(leftTileLocation);
			availableSidesLocation.push(rightTileLocation);
		};
	};

	//a function to find a tile in an array of tiles and returns the index of the tile. the function takes a tile and an array
	//of tiles and returns the location of a tile in the array
	function findTile(aTile, arrayofTiles){
		for(i = 0; i < arrayofTiles.length; i++){
			if (((aTile.value1 === arrayofTiles[i].value1) && (aTile.value2 === arrayofTiles[i].value2)) || ((aTile.value1 === arrayofTiles[i].value2) && (aTile.value2 === arrayofTiles[i].value1))){
				return i;
			};
		};
	};

	//function to remove a tile from the player, computer, or boneyard areas
	//it takes in the to be removed tile and the array of tiles representing area of which the tile needs to be removed from 
	//as arguments and returns a new array of tiles with the tile removed
	function removeTile(aTile, areaArray){
		let temp;
		for(i = findTile(aTile, areaArray); i < areaArray.length; i++ ){
			areaArray[i] = areaArray[i + 1];
		};
		areaArray.pop();
		/*areaArray.splice(findTile(aTile, areaArray), 1);
		return areaArray;*/
	};

	//function to make a tile and place it in the computer area
	//the function takes in a tile from the computerTiles array as an argument and returns nothing
	function drawComputerTile(aTile){
		$("<div></div>").addClass("tileVertical faceDown").attr("id", String(aTile.value1) + String(aTile.value2)).appendTo("#computerBoard");	
	};

	//function to draw tiles in the computer area takes in the array of computerTiles and returns nothing
	function drawComputerTiles(computerTiles){
		for(let i = 0; i < computerTiles.length; i++){
			drawComputerTile(computerTiles[i]);
		};
	};

	//function to make both sides of a tile and makes and places it in the player
	//the function takes in a tile from the playerTiles array and numberToString array as arguments and returns nothing
	function drawPlayerTile(aTile, numberToString){
		let upperPart = $("<div></div>").addClass("tileSquareVerticalTop").css("backgroundImage", "url(images/" + numberToString[aTile.value1]+".png");
		let bottomPart = $("<div></div>").addClass("tileSquareVerticalBottom").css("backgroundImage", "url(images/" + numberToString[aTile.value2]+".png");
		let verticalTile = $("<div></div>").addClass("tileVertical").attr("id", String(aTile.value1) + String(aTile.value2));
		upperPart.appendTo(verticalTile);
		bottomPart.appendTo(verticalTile);
		verticalTile.appendTo("#playerBoard");
	};
	
	//function to draw tiles in the player area takes in the playerTiles and numberToString arrays and returns nothing
	function drawPlayerTiles(playerTiles, numberToString){
		for(let i = 0; i < playerTiles.length; i++){
			drawPlayerTile(playerTiles[i], numberToString);
		}
	};

	//function to make a tile and place it in the boneyard area
	function drawBoneyardTile(aTile){
		$("<div></div>").addClass("tileHorizontal faceDownBlock").attr("id", String(aTile.value1) + String(aTile.value2)).appendTo("#boneyardTiles");	
	};
	
	//function to draw tiles in the boneyard takes in the boneyardTiles array and returns nothing
	function drawBoneyardTiles(boneyardTiles){
		for(let i = 0; i < boneyardTiles.length; i++){
			drawBoneyardTile(boneyardTiles[i]);
		}
	};

	//function to draw a tile in the play area. the function recieves integer values for the left or top of a tile
	//and right or bottom of a tile. In addition to the location the tile is going to be placed at and an array that
	//matches the value of a one half of a tile to it's corresponding text value to retrieve the value matching image 
	function drawPlayAreaTile(aTileLeftOrTopValue, aTileRightOrBottomValue, emptyTileId, tileValuesImages){
		let targetedTile = $("#" + emptyTileId), verticalTiles = ["tile13", "tile14", "tile27", "tile0"];
		if(targetedTile.hasClass("emptyTile")){
			targetedTile.removeClass("emptyTile");
			if($.inArray(emptyTileId, verticalTiles) === -1){
				$("<div></div>").addClass("tileSquareHorizontalRight").css("backgroundImage", "url(images/" + tileValuesImages[aTileRightOrBottomValue] +".png").appendTo(targetedTile);
				$("<div></div>").addClass("tileSquareHorizontalLeft").css("backgroundImage", "url(images/" + tileValuesImages[aTileLeftOrTopValue] +".png").appendTo(targetedTile);
			}else{
				$("<div></div>").addClass("tileSquareVerticalTop").css("backgroundImage", "url(images/" + tileValuesImages[aTileLeftOrTopValue] +".png").appendTo(targetedTile);
				$("<div></div>").addClass("tileSquareVerticalBottom").css("backgroundImage", "url(images/" + tileValuesImages[aTileRightOrBottomValue] +".png").appendTo(targetedTile);
			};
		};
	};

	//function to highlight a tile, it recieves the id of the tile to be highlighted and returns nothing
	function highlightTile(tileId){
		$("#" + tileId).addClass("highlight");
	};

	//function to remove the highlighting of a tile
	function removeHighlight(){
		let previouslyClicked = $(".highlight");
		if (previouslyClicked){
			previouslyClicked.removeClass("highlight");
		};
	};

	//function saves the values of a tile's halves in the toBeMovedTile object in order to prepear it for moving
	//from one area in the game to another. The function receives the values of a tile and returns nothing
/*	function prepearTileForMove(aTile, toBeMovedTile){
		//toBeMovedTile = Object.assign({}, aTile);
		toBeMovedTile.value1 = aTile.value1;
		toBeMovedTile.value2 = aTile.value2;
		toBeMovedTile.value1 = aTile.value1;
		toBeMovedTile.value2 = aTile.value2;
	};*/

	//function to check if any of the clicked empty tile neighbors is occupied in order to check for a match later
	//the function takes in the empty clicked tile as an argument and return the occupied string with occupied tile id 
	function OccupiedNeighboringTile(emptyTile){
		let emptyTileId, neighboringTile1, neighboringTile2;
		emptyTileId = tileIdNumber(emptyTile);
		emptyTileId ? neighboringTile1 = $("#tile" + String(emptyTileId - 1)) : neighboringTile1 = $("#tile27") ;
		neighboringTile2 = $("#tile" + String((emptyTileId + 1) % 28));
		if(!((neighboringTile1).hasClass("emptyTile"))){
			return neighboringTile1.attr("id");
		};
		if(!((neighboringTile2).hasClass("emptyTile"))){
			return neighboringTile2.attr("id");
		};
	};

	//function to check the empty tile location takes in the empty tile id as an argument 
	//and returns a string containing either upperRow, rightColumn, bottomRow, or leftColumn 
	function emptyTileLocation(emptyTileId){
		let locationNum;
		locationNum = tileIdNumber(emptyTileId);
		if((locationNum >= 2) && (locationNum <= 12)){
			return "upperRow";
		}else if((locationNum >= 13) && (locationNum <= 14)){
			return "rightColumn";
		}else if((locationNum >= 15) && (locationNum <= 26)){
			return "bottomRow";
		}else{
			return "leftColumn";
		}
	};

	//function takes in the occupiedTile string and the availableSidesLocations array as arrguments and return
	//the index of the occupiedTile in the array
	function occupiedTileIndex(occupiedTile, availableSidesLocation, emptyTileId){
		if(availableSidesLocation[0] === availableSidesLocation[1]){
			if(tileIdNumber(emptyTileId) === 2){
				return 1;
			}else{
				return 0;
			};
		}else{
		return $.inArray(occupiedTile, availableSidesLocation);
		};
	};  

	//function that takes in an index (integer values) that refer to the occupied tile available side in the availableSides array
	//also it takes in the toBeMovedTile as an argument to compare its sides to the availableSide[index] for a match
	//the function return the matched value
	function checkForMatch(index, toBeMovedTile, availableSides){
		if (toBeMovedTile.value1 === availableSides[index]) {
			return toBeMovedTile.value1;
		}else if (toBeMovedTile.value2 === availableSides[index]) {
			return toBeMovedTile.value2;
		};
	};// i think this should check based on the location of the occupied tile except if the location is tile 28


	//function recieves the occupied tile id and the empty tile id as string arrguments
	//and returns right or left, top or bottom refering to the location of the occupied tile
	function occupiedTileLocation(occupiedTileId, emptyTileId, clickedTileLocation){
		let occupiedTileNum, emptyTileNum;
		occupiedTileNum = tileIdNumber(occupiedTileId);
		emptyTileNum = tileIdNumber(emptyTileId);	
		 
		if(clickedTileLocation === "upperRow"){
			if (occupiedTileNum === (emptyTileNum - 1)){
				return "left";
			}else{
				return "right";
			};
		}else if(clickedTileLocation === "bottomRow"){
			if (occupiedTileNum === (emptyTileNum - 1)){
				return "right";
			}else{
				return "left";
			};
		} else if(clickedTileLocation === "rightColumn"){
			if (occupiedTileNum === (emptyTileNum - 1)){
				return "top";
			}else{
				return "bottom";
			};
		}else{
			if (occupiedTileNum === (emptyTileNum - 1)){
				return "bottom";
			}else{
				return "top";
			};
		};
	};

	//function that takes in a tile id a returns the number of the tile on the board without the string tile
	function tileIdNumber(tileId){
		if(tileId.length === 5){
			return parseInt(tileId.charAt(4));
		} else {
			return parseInt(tileId.charAt(4) + tileId.charAt(5));
		}; 
		
	};

	//function to remove tiles drawing from a specified area
	function removeTilesDrawing(area, tilesPositioning){
		let tiles = $("#" + area + " ." + tilesPositioning);
		tiles.remove();
	};

	//function to draw the player's move after he/she chooses a tile and places it in the right place
	//the function doesn't receive any arguments and doesn't have a return
	function drawingPlayersMove(){
		removeTile(toBeMovedTile, playerTiles);
		eraseAndDrawPlayerTiles();
	};

	//
	function eraseAndDrawPlayerTiles(){
		removeTilesDrawing("playerBoard", "tileVertical");
		drawPlayerTiles(playerTiles, numberToString);
	};

	//
	function changingOnethAvailableSide(notMatchingSide, emptyTileId){
		storeAvailableSides(availableSides,"" , notMatchingSide);
		storeAvailableSidesLocation(availableSidesLocation,"" , emptyTileId);
	};

	//
	function changingZerothAvailableSide(notMatchingSide, emptyTileId){
		storeAvailableSides(availableSides, notMatchingSide, "");
		storeAvailableSidesLocation(availableSidesLocation,emptyTileId , "");
	};

	//assign a tile receives a tile and an array of tiles as arguments and addes the tile to the array
	function assignTile(aTile, arrayOfTiles){
		arrayOfTiles.push(aTile);
	};
});
