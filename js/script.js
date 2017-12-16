//creating object tile used to create the game tiles
function Tile(value1, value2){
	this.value1 = value1;
	this.value2 = value2;		
};

//global variable of a tile to hold the tile to be moved from boneyard side to either player side or computer side
//or to be moved from the player side or the computer side to the playarea 
var toBeMovedTile = new Tile();

//to hold the sides that represent the available options to play against where index [0] represent 
//the left open side of the left most tile and index [1] represent the open side of the right most tile
var availableSides = [];

//initializing five arrays one to hold all the tiles before shuffling
//the second is to hold the boneyard tiles
//the third is to hold the player tiles
//the fourth to hold the computer tiles
//the fifth is the tiles that were placed in the play area;
var allTiles, boneyardTiles, playerTiles, computerTiles, playAreaTiles = [];	

// array to be used for tranlating the number on either half of a tile to the corresponding string 
// in order to be use in getting the right image from the images folder
var numberToString = ["zero", "one", "two", "three", "four", "five","six"];
var numberToStringHorizontal = ["zero", "one", "two", "three", "four", "five","horizontalSix"];

//the functionality that needs to be implemented after the DOM is ready
$(document).ready(function(){
	console.log("DOM is ready");//making sure script.js is linked correctly

	// attaching a delegated click event handler on the player tiles area
    $("#playerBoard").on( "click", ".tileVertical", function(event) { 
    	removeHighlight();// calling removeHighlight function to remove any previously highlighted tile

    	//highlighting the clicked tile 
    	highlightTile($(this).attr("id"));

    	//and creating a tile object for it to be pushed into the ToBeMovedTile
	    //let clickedTileObject = new Tile(parseInt($(this).attr("id").charAt(0)),parseInt($(this).attr("id").charAt(1)));

	    //prepearTileForMove(toBeMovedTile, clickedTileObject);// to push the clicked tiled into ToBeMovedTile
	    
	});

//     // attaching a delegated click event handler on the play area that would triggered on empty tiles only
//     $("#playBoard").on( "click", ".emptyTile", function(event) { 
//     	//check if any of the clicked empty tile neighbors is not empty
//     	let neighboringTile = checkNeighbors($(this).attr("id"));

//     	//in case one of the neighbors if not empty check if the player selected tile matches the open side
//     	//next to the clicked empty tile
//     	if (neighboringTile){
//     		//checking which side the tile will be placed on if right then clockwise and if left counter clockwise
//     		let placingSide =[];
//     		placingSide = checkMatchingSides(toBeMovedTile, availableSides);
//     		drawTilePlayArea(placingSide[1], placingSide[2], $(this).attr("id"), numberToStringHorizontal);
//     		let aTile = new Tile(toBeMovedTile[0].value1, toBeMovedTile[0].value2);
//     		let newPlayerTiles = removeTile(aTile, playerTiles);
//     		playerTiles = emptyArray(playerTiles);
//     		playerTiles= newPlayerTiles;
//     		drawPlayerTiles(playerTiles, numberToString);
//     		console.log(placingSide);
// //call functiong checkMatchingSides(toBeMovedTile, neighboringTile)
//     	};

//     	//if ($(this).hasClass("emptyTile")){console.log($(this).attr("id"));};
    	
//     });



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
	let firstTile = selectFirstTile(boneyardTiles);
	playAreaTiles.push(firstTile);

	//remove the 1st placed tile in the play area from the boneyard
	removeTile(firstTile, boneyardTiles);

	//showing the computer's tiles on the page
	drawComputerTiles(computerTiles);

	//showing the player's tiles on the page
	drawPlayerTiles(playerTiles, numberToString);

	//showing the boneyard tiles on the page
	drawBoneyardTiles(boneyardTiles);

	//draw the first tile in the play area to signal the game start
	drawPlayAreaTile(playAreaTiles[0].value1, playAreaTiles[0].value2, "tile1", numberToStringHorizontal);







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
	//in the availableSides array
	function selectFirstTile(boneyardTiles){
		let index = Math.floor(Math.random() * boneyardTiles.length);
		let temp = boneyardTiles[index];
		boneyardTiles[index] = boneyardTiles[boneyardTiles.length - 1];
		boneyardTiles[boneyardTiles.length - 1] = temp; 
		let firstTile = boneyardTiles.pop();
		storeAvailableSides(availableSides, firstTile.value1, firstTile.value2);
		return firstTile;
	};

	//function to store the initial available two playing options for the first tile placed to signal the game start
	//it's also used stores of the open sides of the tiles on the most left and most right of the play area.
	//The function takes in the array availableSides, the value of a tile's left side, and/or the value a tile's
	//right side as arguments and returns nothing, but it modifies the availableSides array by adding 
	//the most left side value to index [0] and the most right side value to index [1]. 
	function storeAvailableSides(availableSides, leftSide, rightSide){
		if(availableSides.length){
			if(leftSide){
				availableSides[0] = leftSide;
			};
			if(rightSide){
				availableSides[1] = rightSide;
			};
		}else{
			availableSides.push(leftSide);
			availableSides.push(rightSide);
		};
	};

	//function to remove a tile from the player, computer, or boneyard areas
	//it takes in the to be removed tile and the array of tiles representing area of which the tile needs to be removed from 
	//as arguments and returns a new array of tiles with the tile removed
	function removeTile(aTile, areaArray){
		for(i = 0; i < areaArray.length; i++){
			if (((aTile.value1 === areaArray[i].value1) && (aTile.value2 === areaArray[i].value2)) || ((aTile.value1 === areaArray[i].value2) && (aTile.value2 === areaArray[i].value1))){
				areaArray.splice(i, 1);
				return areaArray;
			}
		};
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
	function drawPlayAreaTile(aTileLeftOrTopValue, aTileRightOrBottomValue, location, tileValuesImages){
		let targetedTile = $("#" + location), verticalTiles = ["tile13", "tile14", "tile27", "tile28"];
		if(targetedTile.hasClass("emptyTile")){
			targetedTile.removeClass("emptyTile");
			if($.inArray(location, verticalTiles) === -1){
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




	// //function to return a removed value from an array
	// function removeTile(arra)







	//function to place a tile in the play area
	function placePlayAreaTile(aTile){
		drawPlayerTiles(removeTile(aTile, tilePlace), numberToString);
	};

	//function to put the clicked tile in a variable prepearing it to be moved
	function prepearTileForMove(toBeMovedTile, aTile){
		if(toBeMovedTile.length){
			toBeMovedTile.pop();
		};
		toBeMovedTile.push(aTile);
	};

	//function to check if any of the clicked empty tile neighbors is not empty in order to check for a match later
	function checkNeighbors(emptyTile){
		let emptyTileId, neighboringTile1, neighboringTile2;
		if (emptyTile.length === 5){
			emptyTileId = parseInt(emptyTile.charAt(4));
		} else {
			emptyTileId = parseInt(emptyTile.charAt(4) + emptyTile.charAt(5));
		};
		neighboringTile1 = $("#tile" + String(emptyTileId - 1));
		neighboringTile2 = $("#tile" + String((emptyTileId + 1) % 28));
		if (!((neighboringTile1).hasClass("emptyTile"))){
			return neighboringTile1.attr("id");
		};
		if (!((neighboringTile2).hasClass("emptyTile"))){
			return neighboringTile2.attr("id");
		};
	};

	//function to check for matching sides before moving a tile into the play area and returns the side on which
	//the tile will be palced right is clockwise and left is counter clockwise
	function checkMatchingSides(toBeMovedTile, availableSides){
		placingParameters = [];
		if (toBeMovedTile){
			if ((toBeMovedTile[0].value1 === availableSides[0]) || (toBeMovedTile[0].value1 === availableSides[1])) {
				placingParameters.push("left");
				placingParameters.push(toBeMovedTile[0].value2);
				placingParameters.push(toBeMovedTile[0].value1);
			} else if ((toBeMovedTile[0].value2 === availableSides[0]) || (toBeMovedTile[0].value2 === availableSides[1])){
				placingParameters.push("left");
				placingParameters.push(toBeMovedTile[0].value1);
				placingParameters.push(toBeMovedTile[0].value2);
			};

		};
		return placingParameters;
	};



	//function to empty an array
	function emptyArray(array){
		if(array.length){
			array.pop();
		};
		return array;
	}

	//////To Be Used/////// 
	
	// 	//function to remove the draw of a tile  
	// function EraseTileDrawing(aTile){
	// 	$("#" + String(aTile.value1) + String(aTile.value2)).remove();
	// }

	// //attaching a delegated click event handler on the boneyard's area
	// $("#boneyardTiles").on( "click", ".tileHorizontal", function(event) {
 //    	let clickedTile = new Tile(parseInt($(this).attr("id").charAt(0)),parseInt($(this).attr("id").charAt(1)));
	// });
});
