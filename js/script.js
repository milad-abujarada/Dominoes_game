//////////////////////////////////////////////////setting up the initial game variables //////////////////////////////////////////

/* creating local storage variables to represent the activePlayer, the last round winner, 
and the scores of the player and the computer. The player always goes first in a new game. */
localStorage.activePlayer = "player";
localStorage.lastRoundWinner = '';
localStorage.playerScore = 0;
localStorage.computerScore = 0;

// Tile object construction function used to create the game tiles
function Tile(value1, value2){
	this.value1 = value1;
	this.value2 = value2;		
};

/* Global variable of type Tile to hold the tile to be moved from boneyard side to either player side or computer side
or from the player side or the computer side to the playarea */
var toBeMovedTile = new Tile();

/* availableSides array to hold the sides values that represent the available options to play against, where index [0] represent 
the open side of the left most tile and index [1] represent the open side of the right most tile.
availableSidesLocation corresponds to the location of each of those sides in the playarea. */
var availableSides = [];
var availableSidesLocation = [];

/* occupiedTileId used to refer to the occupied neighboring tile id.
emptyTileId used to refer to the tile empty tile where the to be played tile will be placed.
clickedOrEmptyTileLocation is used by the player and the computer to specifiy the location of the empty tile, this used to guaranty
the correct placement of the to be played tile.
occupiedLocation specify the location of the occupied tile relatively to the empty tile, also used to guaranty the correct placement
of the to be played tile. */
var occupiedTileId, emptyTileId, clickedOrEmptyTileLocation, occupiedLocation;

/* Initializing four arrays one to hold all the tiles before shuffling
the second is to hold the boneyard tiles
the third is to hold the player tiles
the fourth to hold the computer tiles */
var allTiles, boneyardTiles, playerTiles, computerTiles = [];	

/* Two arrays to be used for translating the number on either half of a tile to the corresponding string 
in order to be use in getting the right image from the images folder */
var numberToString = ["zero", "one", "two", "three", "four", "five","six"];
var numberToStringHorizontal = ["zero", "one", "two", "three", "four", "five","horizontalSix"];

////////////////////////////////////////////End of setting up the initial game variables ////////////////////////////////////////


$(document).ready(function(){

///////////////////////////////////////////gets executed the first time the page loads ///////////////////////////////////////
	
	startGame();

	setScore();
	
	setInitialActivePlayerBackground();

/////////////////////////////////////////End of gets executed the first time the page loads ///////////////////////////////////

/////////////////////////////////////////////////gets executed based on an event//////////////////////////////////////////////

	/* attaching a delegated click event handler on the player tiles area. 
	the event triggers everytime the player clicks on one of his/her tiles. */
    $("#playerBoard").on( "click", ".tileVertical", function(event){ 

    	if(localStorage.activePlayer === "player"){

	    	// calling removeHighlight function to remove any previously highlighted tile
	    	removeHighlight();

	    	//highlighting the clicked tile 
	    	highlightTile($(this).attr("id"));

	    	/* making a tile variable that points to the clicked tile in order to be used to locate
	    	the tile in the playerTiles array */
			let tempTile = new Tile(parseInt($(this).attr("id").charAt(0)), parseInt($(this).attr("id").charAt(1)));

			/* locating the clicked tile in the playerTiles array and prepearing it to be played.
			it only gets moved if one of its sides matches the occupied neighboring tile. */
	    	toBeMovedTile =  playerTiles[findTile(tempTile, playerTiles)];
	    }
	});

    // attaching a delegated click event handler on the play area that will be triggered on empty tiles only
    $("#playBoard").on( "click", ".emptyTile", function(event){ 

		/* checking if the player highlighted a tile to be moved or not
    	in case no highlighted tile then nothing happens. */
    	if($(".highlight").length && (localStorage.activePlayer === "player")){

    		//determining the clicked empty tile location and its occupied neighboring tile id if one is occupied
    		emptyTileId = $(this).attr("id");
    		clickedOrEmptyTileLocation = emptyTileLocation(emptyTileId);
	    	occupiedTileId = OccupiedNeighboringTile(emptyTileId);

	    	// checking if there is an occupied tile next to the clicked empty tile in order to proceed 
	    	if(occupiedTileId){

	    		/* first we get the occupied neighboring tile index in availableSidesLocation array. Then the index is used
	    		to get the corresponding value in the availableSide array. The value is then used to determin which side
	    		of the player clicked tile is the matching side to the occupied neighboring tile */
	    		let index = occupiedTileIndex(occupiedTileId, availableSidesLocation, emptyTileId);
	    		let matchingSides = checkForMatch(index, toBeMovedTile, availableSides);

	    		/* if there are matching sides between the player to be played selected tile
	    		and the neighboring ocupied tile of the clicked empty tile, then we continue. */
	    		if(typeof matchingSides != "undefined"){

	    			//geting the value of the not matching side of the clicked to be played tile
	    			let notMatchingSide = toBeMovedTile.value1 === matchingSides ? toBeMovedTile.value2 : toBeMovedTile.value1;

	    			//check to see if the occupied tile is on the right or left, top or bottom of the clicked empty tile
	    			occupiedLocation = occupiedTilePosition(occupiedTileId, emptyTileId, clickedOrEmptyTileLocation);

	    			/* after obtaining all the necessary information in order to place the tile the right way, the tile gets
	    			drawn on the page in the clicked empty tile, the values in the availableSides and availableSidesLocations 
	    			arrays of the corresponding new open side gets changed, then lastly the player area gets redrawn with
	    			the new set of tiles after the played tile is removed then the active player is changed */ 
	    			removeButtons();
	    			playTile(matchingSides, notMatchingSide);	
	    			drawingPlayersMove(checkForAWin);
	    			if(localStorage.activePlayer){
	    				setTimeout(function(){
	    					changeActivePlayer();
	    					backgroundForActivePlayer();
		    				setTimeout(function(){computerTurn();},1000);
		    			}, 1000);
	    			};
	    		};	 
		    }; 
    	};	
    });

	// attaching a delegated click event handler on the boneyard area that allows the player to withdraw a tile
	$("#boneyardTiles").on( "click", ".faceDownBlock", function(event){

		if(localStorage.activePlayer === "player"){

			/* calling removeHighlight function to remove any previously highlighted tile in case the player
			highlighted one of his/her tiles before withdrawing a tile */
			removeHighlight();

			/* making a tile variable that points to the clicked tile in order to be used to locate
	    	the tile in the boneyardTiles array and then placed in the toBeMovedTile */
			let tempTile = new Tile(parseInt($(this).attr("id").charAt(0)), parseInt($(this).attr("id").charAt(1)));
			toBeMovedTile =  boneyardTiles[findTile(tempTile, boneyardTiles)];

			tileWithdrawDrawing();
			
			//placing the withdrawn tile in the playersTiles array
			assignTile(toBeMovedTile, playerTiles);

			//erasing the player's tiles drawing from the page then redrawing the tiles with the withdrawn tile included
			eraseAndDrawPlayerTiles();
			if(!boneyardTiles.length){
				drawKnockButton();
			};
		};
	});

///////////////////////////////////////////End of gets executed based on an event//////////////////////////////////////////////

//////////////////////////////////////////functions used by the player and the computer////////////////////////////////////////
	function startGame(){
		availableSides = [];
		availableSidesLocation = [];
		allTiles = [];
		boneyardTiles = []; 
		playerTiles = []; 
		computerTiles = [];
		occupiedTileId = undefined; 
		emptyTileId = undefined; 
		clickedOrEmptyTileLocation = undefined; 
		occupiedLocation = undefined;

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
		
		//selecting the first tile from the boneyardTiles array to be placed in the playarea to start the game
		let firstTile = selectFirstTile(boneyardTiles);

		//placing the first tile in the play area to signal the game start
		drawPlayAreaTile(firstTile.value1, firstTile.value2, "tile1", numberToStringHorizontal);
		
		//placing the computer's tiles on the page
		drawComputerTiles(computerTiles);

		//placing the player's tiles on the page
		drawPlayerTiles(playerTiles, numberToString);

		//placing the boneyard tiles on the page
		drawBoneyardTiles(boneyardTiles);
	};

	/* create a tile using Tile constructor function 
	the arguments are the values on a tile's sides and the return is a single tile object*/
	function createTile(value1, value2){
		return(new Tile(value1,value2));
	};

	/* populating the allTiles array by creating 28 tiles using function createTile.
	this function returns an array of tiles */
	function createAllTiles(){
		let tiles = [];
	    for(let i = 0; i < 7; i++){
			for(let j = i; j < 7; j++){
			tiles.push(createTile(i,j));
			}
		}	
		return tiles;
	};

	/* shuffling the Tiles in the allTiles array 
	the function has no return but it takes an array of tiles as an argument */
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

	/* function to assign tiles to boneyardTiles, playerTiles, and computerTiles arrays
	the function takes an array of tiles, the starting index and the ending index of the values in the new array
	the function returns an array of tiles that contain the tiles from the startIndex to the endIndex */
	function assignTiles(allTiles, startIndex, endIndex){
		let subTiles = [];
		for(var i = startIndex; i <= endIndex; i++){
			subTiles.push(allTiles[i]);
		};
		return subTiles;
	};

	/* function to select a random first tile from the boneyardTiles array of tiles 
	in order to place that tile in the play area to start the game.
	the function takes in an array of the tiles as an argument and returns a single random tile.
	the function also uses function storeAvailableSides to store the values of the randomly selected tile 
	in the availableSides array and its location in the availableSidesLocation array. also the funtion removes
	the selected tile from the boneyardTiles array */
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

	/* function to store the initial available two playing options for the first tile placed to signal the game start.
	it's also used stores of the open sides of the tiles on the most left and most right of the play area.
	The function takes in the array availableSides, the value of a tile's left side, and/or the value a tile's
	right side as arguments, it modifies the availableSides array by adding 
	the most left side value to index [0] and the most right side value to index [1]. */
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

	/* function to store the initial available two playing options location to be used in played tiles placement later
	The function takes in the array availableSidesLocation, the location of the tile in the most left side, and the location
	of the tile at the most right side as arguments. the function modifies the availableSidesLocation array by adding 
	the most left tile location to index [0] and the most right tile location to index [1]. */ 
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

	/* a function to find a tile in an array of tiles and returns the index of that tile. the function takes a tile and an array
	of tiles and returns the location of a tile in the array */
	function findTile(aTile, arrayofTiles){
		for(i = 0; i < arrayofTiles.length; i++){
			if (((aTile.value1 === arrayofTiles[i].value1) && (aTile.value2 === arrayofTiles[i].value2)) || ((aTile.value1 === arrayofTiles[i].value2) && (aTile.value2 === arrayofTiles[i].value1))){
				return i;
			};
		};
	};

	/* function to remove a tile from the player, computer, or boneyard areas.
	it takes in the toBeMoved tile and the array of tiles representing the area, which the tile needs to be removed from 
	as arguments, and returns a new array of tiles with the tile removed */
	function removeTile(aTile, areaArray){
		areaArray.splice(findTile(aTile, areaArray), 1);
	};

	//function to create a tile and place it in the boneyard area
	function drawBoneyardTile(aTile){
		$("<div></div>").addClass("tileHorizontal faceDownBlock").attr("id", String(aTile.value1) + String(aTile.value2)).appendTo("#boneyardTiles");	
	};
	
	//function to draw tiles in the boneyard takes in the boneyardTiles array as an argument
	function drawBoneyardTiles(boneyardTiles){
		for(let i = 0; i < boneyardTiles.length; i++){
			drawBoneyardTile(boneyardTiles[i]);
		}
	};

	/* function to draw a tile in the play area. the function takes in integer values for the left or top 
	and right or bottom of a tile. In addition to the location the tile is going to be placed at, and an array that
	matches the value of a one half of a tile to it's corresponding text value to retrieve the value matching image */
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

	/* to restart a new game after either the computer or the player wins the current game
	by getting 150 points or more*/
	function newGame(){
		location.reload();
	};

	/* to play a new round when either the computer or the player wins the current round.
	Also this function used to restart a round that ends in a deadlock. (no more moves) */
	function newRound(){
		removeTilesDrawing("playerBoard", "tileVertical");
		removeTilesDrawing("computerBoard", "tileVertical");
		removeTilesDrawing("boneyardTiles", "faceDownBlock");
		removeTilesFromPlayArea();
		resetTilesOfPlayArea();
		resetTilesOfPlayArea();
		removeButtons();
		removeWinnerDeclaration();
		startGame();
		localStorage.activePlayer = localStorage.lastRoundWinner;
		backgroundForActivePlayer();
		if(localStorage.activePlayer === "computer"){
			computerTurn();
		};
	};

	//to remove the drawing the played tiles
	function removeTilesFromPlayArea(){
		$(".tileSquareVerticalTop").remove();
		$(".tileSquareVerticalBottom").remove();
		$(".tileSquareHorizontalRight").remove();
		$(".tileSquareHorizontalLeft").remove();
	};

	// to remove the declaration of a winner
	function removeWinnerDeclaration(){
		$(".winner").remove();
	}

	// reseting the tiles in the play area so they are back into the emptyTile state
	function resetTilesOfPlayArea(){
		$(".tileHorizontal").addClass("emptyTile");
		$(".tileVerticalPlayAreaRight").addClass("emptyTile");
		$(".tileVerticalPlayAreaLeft").addClass("emptyTile");
	};

	//remove all the buttons(start new round, replay this round, start a new game) from the page.
	function removeButtons(){
		$("button").remove();
	};

	//function to highlight a tile, it takes in the id of the tile to be highlighted as an argument
	function highlightTile(tileId){
		$("#" + tileId).addClass("highlight");
	};

	/* function to check the empty tile location takes in the empty tile id as an argument 
	and returns a string containing either upperRow, rightColumn, bottomRow, or leftColumn.
	this is used to guaranty the correct placement of the tiles in the play area */
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

	/* function that takes in an index that refer to the occupied tile available side in the availableSides array,
	also it takes in the toBeMovedTile as an argument to compare its sides to the availableSide[index] for a match.
	the function return the matched value if one exists*/
	function checkForMatch(index, toBeMovedTile, availableSides){
		if (toBeMovedTile.value1 === availableSides[index]) {
			return toBeMovedTile.value1;
		}else if (toBeMovedTile.value2 === availableSides[index]) {
			return toBeMovedTile.value2;
		};
	};

	/* function recieves the occupied tile id and the empty tile id as string arrguments
	and returns "right" or "left", "top" or "bottom", refering to the location of the occupied tile 
	in relative to the clicked on empty tile */
	function occupiedTilePosition(occupiedTileId, emptyTileId, clickedOrEmptyTileLocation){
		let occupiedTileNum, emptyTileNum;
		occupiedTileNum = tileIdNumber(occupiedTileId);
		emptyTileNum = tileIdNumber(emptyTileId);	
		 
		if(clickedOrEmptyTileLocation === "upperRow"){
			if (occupiedTileNum === (emptyTileNum - 1)){
				return "left";
			}else{
				return "right";
			};
		}else if(clickedOrEmptyTileLocation === "bottomRow"){
			if (occupiedTileNum === (emptyTileNum - 1)){
				return "right";
			}else{
				return "left";
			};
		} else if(clickedOrEmptyTileLocation === "rightColumn"){
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

	//function that takes in a tile id and returns the integer value representing number of the tile on the board 
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

	/* function to change the values of the [1] index in storeAvailableSides and storeAvailableSidesLocation
	arrays after a move was made */
	function changingOnethAvailableSide(notMatchingSide, emptyTileId){
		storeAvailableSides(availableSides,"" , notMatchingSide);
		storeAvailableSidesLocation(availableSidesLocation,"" , emptyTileId);
	};

	/* function to change the values of the [0] index in storeAvailableSides and storeAvailableSidesLocation
	arrays after a move was made */
	function changingZerothAvailableSide(notMatchingSide, emptyTileId){
		storeAvailableSides(availableSides, notMatchingSide, "");
		storeAvailableSidesLocation(availableSidesLocation,emptyTileId , "");
	};

	//assign a tile receives a tile and an array of tiles as arguments and addes the tile to the array
	function assignTile(aTile, arrayOfTiles){
		arrayOfTiles.push(aTile);
	};

	//function to change the localStorage.activePlayer after a move has been made by either sides (player or computer)
	function changeActivePlayer(){
		localStorage.activePlayer === "player" ? localStorage.activePlayer = "computer" : localStorage.activePlayer = "player";
	};

	//to place a played tile in the upper row with the occupied tile on the left of it
	function upperRowLeft(matchingSides, notMatchingSide){
		drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToStringHorizontal);
		changingOnethAvailableSide(notMatchingSide, emptyTileId);
	};

	//to place a played tile in the upper row with the occupied tile on the right of it
	function upperRowRight(notMatchingSide, matchingSides){
		drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToStringHorizontal);
		changingZerothAvailableSide(notMatchingSide, emptyTileId);
	};

    //to place a played tile in the bottom row with the occupied tile on the left of it
	function bottomRowLeft(matchingSides, notMatchingSide){
		drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToStringHorizontal);
		changingZerothAvailableSide(notMatchingSide, emptyTileId);
	};

    //to place a played tile in the bottom row with the occupied tile on the right of it
	function bottomRowRight(notMatchingSide, matchingSides){
		drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToStringHorizontal);
		changingOnethAvailableSide(notMatchingSide, emptyTileId);
	};

    //to place a played tile in the left column with the occupied tile located above it
	function leftColumnTop(matchingSides, notMatchingSide){
		drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToString);
		changingZerothAvailableSide(notMatchingSide, emptyTileId);
	};

    //to place a played tile in the left column with the occupied tile located below it
	function leftColumnBottom(notMatchingSide, matchingSides){
		drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToString);
		changingZerothAvailableSide(notMatchingSide, emptyTileId);
	};

    //to place a played tile in the right column with the occupied tile located above it
	function rightColumnTop(matchingSides, notMatchingSide){
		drawPlayAreaTile(matchingSides, notMatchingSide, emptyTileId, numberToString);
		changingOnethAvailableSide(notMatchingSide, emptyTileId);
	};

    //to place a played tile in the right column with the occupied tile located below it
	function rightColumnBottom(notMatchingSide, matchingSides){
		drawPlayAreaTile(notMatchingSide, matchingSides, emptyTileId, numberToString);
		changingZerothAvailableSide(notMatchingSide, emptyTileId);
	};

	// to play a tile and place it in the play area
	function playTile(matchingSides, notMatchingSide){
		if(clickedOrEmptyTileLocation === "upperRow"){
			occupiedLocation === "left" ? upperRowLeft(matchingSides, notMatchingSide) : upperRowRight(notMatchingSide, matchingSides);	
		}else if(clickedOrEmptyTileLocation === "bottomRow"){
			occupiedLocation === "left" ? bottomRowLeft(matchingSides, notMatchingSide) : bottomRowRight(notMatchingSide, matchingSides);
		}else if(clickedOrEmptyTileLocation === "leftColumn"){
			occupiedLocation === "top" ? leftColumnTop(matchingSides, notMatchingSide) : leftColumnBottom(notMatchingSide, matchingSides);
		}else if(clickedOrEmptyTileLocation === "rightColumn"){
			occupiedLocation === "top" ? rightColumnTop(matchingSides, notMatchingSide) : rightColumnBottom(notMatchingSide, matchingSides);
		};
	};

	// to draw the boneyard tiles after a tile withdraw
	function tileWithdrawDrawing(){
		//removing the withdrawn tile from the boneyardTiles array
		removeTile(toBeMovedTile, boneyardTiles);

		//erasing the drawing of the boneyard tiles from the page
		removeTilesDrawing("boneyardTiles", "faceDownBlock");

		//redrawing the boneyardTiles after removing the withdrawn tile
		drawBoneyardTiles(boneyardTiles);
	};

	// to check for a win after the active player makes a move by checking the tiles array length
	function checkForAWin(activePlayerTiles, notActivePlayerTiles){
		if(!activePlayerTiles.length){
			calculatePoints(notActivePlayerTiles);	
			localStorage.lastRoundWinner = localStorage.activePlayer;
			localStorage.activePlayer = "";
			drawWinner();
		};
	};

	// to draw the wining statement on the winner side
	function drawWinner(){
		if(localStorage.lastRoundWinner === "player"){
			if(parseInt(localStorage.playerScore) < 150){
				$("#playerBoard").append("<div class=\"winner\">Ladies and Gentelmen this round's WINNER :)</div>");
				drawButton("#playerBoard", "winner");
			}else{
				$("#playerBoard").append("<div class=\"winner\">YOU SHALL BE VICTORIOUS :)</div>");
				drawButton("#playerBoard", "winner");
			};
		}else{
			if(parseInt(localStorage.computerScore) < 150){
				$("#computerBoard").append("<div class=\"winner\">The BITS got ya this round :)</div>");
				drawButton("#computerBoard", "winner");
			}else{
				$("#computerBoard").append("<div class=\"winner\">YOU WERE DEVOURED BY THE BITS :)</div>");
				drawButton("#computerBoard", "winner");
			};
		};
	};

	// to draw a button on a specific side based on the situation that initiated the draw
	function drawButton(buttonLocation, text){
		if(text){
			if((parseInt(localStorage.playerScore) < 150) && (parseInt(localStorage.computerScore) < 150)){
				$("<button class=\"nextRound\" type=\"button\">Start next round</button>").click(function(){newRound()}).appendTo($(buttonLocation));
			}else{
				$("<button class=\"newGame\" type=\"button\">Start new game</button>").click(function(){newGame()}).appendTo($(buttonLocation));
			};
		}else{
			$("<button class=\"nextRound\" type=\"button\">Replay this round</button>").click(function(){
				if(localStorage.lastRoundWinner){
					newRound();
				}else{
					newRound();
					localStorage.activePlayer = "player";
					backgroundForActivePlayer();
				};
			}).appendTo($(buttonLocation));
		};
		
	};

	// sets the score after a round is over
	function setScore(){
		$("#computerScore").text(localStorage.computerScore);
		$("#playerScore").text(localStorage.playerScore);
	};

	// to set the initial score when a new game starts
	function setInitialActivePlayerBackground(){
		$("."+localStorage.activePlayer+"Score").toggleClass("activePlayer");
	};

	// changing the background of the player or the computer score area to reflect the active player
	function backgroundForActivePlayer(){
		if(localStorage.activePlayer === "player"){
			$(".playerScore").addClass("activePlayer");
			$(".computerScore").removeClass("activePlayer");
		}else{
			$(".playerScore").removeClass("activePlayer");
			$(".computerScore").addClass("activePlayer");
		};
	};

	// calculates the winner points
	function calculatePoints(loserTiles){
		let points = 0;
		for(let i = 0; i < loserTiles.length; i++) {
			if((loserTiles[i].value1 === 0) && (loserTiles[i].value2 === 0)){
				points += 25;
			};
			points += (loserTiles[i].value1 + loserTiles[i].value2);
		};
		if(localStorage.activePlayer === "player"){
			localStorage.playerScore = parseInt(localStorage.playerScore) + points;
		}else{
			localStorage.computerScore = parseInt(localStorage.computerScore) + points;
		};
		setScore();
	};

	// it allows the user to differ his/her turn in case no play to be made and no more tiles to widthraw
	function drawKnockButton(){
		$("<button class=\"knockTurn\" type=\"button\">Knock Your Turn</button>").click(function(){
			changeActivePlayer();
			backgroundForActivePlayer();
			removeButtons();
			setTimeout(function(){computerTurn();}, 2000);
			}).appendTo($("#playerSide"));
		if(!moreMoves()){
			drawButton("#playerSide");
		};
	};

	/* function used after no more tiles to be withdrawn to check if both sides don't have any more plays to make,
	then it draws a button that will allow the round to be replayed if a deadlock occurs*/
	function moreMoves(){
		let sides = [];
		let i;
		for(i = 0; i < playerTiles.length; i++){
			sides.push(playerTiles[i].value1);
			sides.push(playerTiles[i].value2);
		};
		for(i = 0; i < computerTiles.length; i++){
			sides.push(computerTiles[i].value1);
			sides.push(computerTiles[i].value2);
		};
		for(i = 0; i < sides.length; i++){
			if($.inArray(sides[i], availableSides) !== -1){
				return true;
			}
		}
	};

//////////////////////////////////////End of functions used by the player and the computer/////////////////////////////////////

//////////////////////////////////////////////functions used by the computer//////////////////////////////////////////////////

	/* function to create a tile and place it in the computer area
	the function takes in a tile from the computerTiles array as an argument */
	function drawComputerTile(aTile){
		$("<div></div>").addClass("tileVertical faceDown").attr("id", String(aTile.value1) + String(aTile.value2)).appendTo("#computerBoard");	
	};

	//function to draw tiles in the computer area takes in the array of computerTiles as an argument
	function drawComputerTiles(computerTiles){
		for(let i = 0; i < computerTiles.length; i++){
			drawComputerTile(computerTiles[i]);
		};
	};

	//to draw the computer play and redraw the computer tiles 
	function drawingComputersMove(checkForAWin){
		removeTile(toBeMovedTile, computerTiles);
		eraseAndDrawComputerTiles();
		checkForAWin(computerTiles, playerTiles);
	};

	//remove the tiles before the play and redraw the tiles after the move was made
	function eraseAndDrawComputerTiles(){
		removeTilesDrawing("computerBoard", "tileVertical");
		drawComputerTiles(computerTiles);
	};

	/* function that kicks off the computer turn by calling computer functionallity function checks for a matching sides
	between the available sided and the computer tiles, then if a match is found the matched tile gets placed in the play area.
	if a match is not found it withdraw a tile and then calles itself. if no more tiles to withdraw and no play to be made, it knocks 
	its turn. */
	function computerTurn(){
		if(localStorage.activePlayer === "computer"){
			let matchingSides = computerFunctionality(computerTiles, availableSides);
			if(typeof matchingSides !== "undefined"){
				let notMatchingSide;
				toBeMovedTile.value1 === matchingSides ? notMatchingSide = toBeMovedTile.value2 : notMatchingSide = toBeMovedTile.value1;
				setTimeout(function(){
					clickedOrEmptyTileLocation = emptyTileLocation(emptyTileId);
					occupiedLocation = occupiedTilePosition(occupiedTileId, emptyTileId, clickedOrEmptyTileLocation);
					playTile(matchingSides, notMatchingSide);	
	    			drawingComputersMove(checkForAWin);
	    			if(localStorage.activePlayer){
	    				changeActivePlayer(); 
	    				setTimeout(function(){
	    					backgroundForActivePlayer();
	    					if(!boneyardTiles.length){drawKnockButton();};
	    				}, 1000);	
	    			};
				}, 1000);
			}else if(boneyardTiles.length){
				toBeMovedTile =  boneyardTiles[0];

				tileWithdrawDrawing();
				
				//placing the withdrawn tile in the playersTiles array
				assignTile(toBeMovedTile, computerTiles);

				//erasing the player's tiles drawing from the page then redrawing the tiles with the withdrawn tile included
				eraseAndDrawComputerTiles();
				setTimeout(function(){computerTurn();},1000);	
			}else{
				computerKnockTurn();
				drawKnockButton();
			}	
		};
	};

	/* function to find a match for the computer turn to play. The function places the matched tile in toBeMovedTile
	variable and returns the matched side. the function also calls on the highlightTile function to highlight the 
	toBeMoved Tile and gets the occupiedTileId 
	Note: in the future the improvement for the computer way of looking for a good move and a match should be in that function. */
	function computerFunctionality(computerTiles, availableSides){
		let matchingSide, computerTilesindex = 0;
		while((!matchingSide) && (computerTilesindex !== computerTiles.length)){
			let availableSidesindex = 0;
			toBeMovedTile = computerTiles[computerTilesindex];
			while(availableSidesindex !== 2){
				matchingSide = checkForMatch(availableSidesindex, toBeMovedTile, availableSides);
				if(typeof matchingSide !== "undefined"){
					highlightTile(String(toBeMovedTile.value1) + String(toBeMovedTile.value2));
					occupiedTileId = availableSidesLocation[availableSidesindex];
					emptyNeighboringTile(occupiedTileId, availableSidesindex);
					return matchingSide;
				};
				availableSidesindex++;
			};
			computerTilesindex++;
		};
	};

	/* function to find the empty neighboring tile when there is a match for the computer turn
	the function check three different situations. The first if the computer is to go first,
	the second if the occupied tile is tile 0, the second if the occupied tile is any other tile in the play area */
	function emptyNeighboringTile(occupiedTile, index){
		if(availableSidesLocation[0] === availableSidesLocation[1]){
			index ? emptyTileId = "tile2" :emptyTileId = "tile0";
		}else if(occupiedTile === "tile0"){
			emptyTileId = "tile27";
		}else{
			let occupiedTileId, neighboringTile1, neighboringTile2;
			occupiedTileId = tileIdNumber(occupiedTile);
			neighboringTile1 = $("#tile" + String(occupiedTileId + 1));
			neighboringTile2 = $("#tile" + String(occupiedTileId - 1));
			if((neighboringTile1).hasClass("emptyTile")){
				emptyTileId = neighboringTile1.attr("id");
			};
			if((neighboringTile2).hasClass("emptyTile")){
				emptyTileId = neighboringTile2.attr("id");
			};
		};	
	};

	// the computer differ its turn when no more tiles to withdraw and no moves to be made with the current set of tiles and options
	function computerKnockTurn(){
		changeActivePlayer();
		backgroundForActivePlayer();
	};

//////////////////////////////////////////////End of functions used by the computer//////////////////////////////////////////////

//////////////////////////////////////////////////functions used by the player//////////////////////////////////////////////////

	/* function to create both sides of a tile and places it in the player
	the function takes in a tile from the playerTiles array and numberToString array as an arguments */
	function drawPlayerTile(aTile, numberToString){
		let upperPart = $("<div></div>").addClass("tileSquareVerticalTop").css("backgroundImage", "url(images/" + numberToString[aTile.value1]+".png");
		let bottomPart = $("<div></div>").addClass("tileSquareVerticalBottom").css("backgroundImage", "url(images/" + numberToString[aTile.value2]+".png");
		let verticalTile = $("<div></div>").addClass("tileVertical").attr("id", String(aTile.value1) + String(aTile.value2));
		upperPart.appendTo(verticalTile);
		bottomPart.appendTo(verticalTile);
		verticalTile.appendTo("#playerBoard");
	};
	
	//function to draw tiles in the player area takes in the playerTiles and numberToString arrays as arguments
	function drawPlayerTiles(playerTiles, numberToString){
		for(let i = 0; i < playerTiles.length; i++){
			drawPlayerTile(playerTiles[i], numberToString);
		}
	};

	//function to remove the highlighting of a tile
	function removeHighlight(){
		let previouslyClicked = $(".highlight");
		if (previouslyClicked){
			previouslyClicked.removeClass("highlight");
		};
	};

	/* function to check if either of the clicked empty tile neighbors is occupied in order to check for a match later.
	the function takes in the empty clicked tile as an argument and return the occupied tile id as a string if one exists */
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

	/* function takes in the occupiedTile string and the availableSidesLocations array as arrguments and return
	the index of the occupiedTile in the array */
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

	// function to draw the player's move after he/she chooses a tile and places it in the right place
	function drawingPlayersMove(checkForAWin){
		removeTile(toBeMovedTile, playerTiles);
		eraseAndDrawPlayerTiles();
		checkForAWin(playerTiles, computerTiles);
		
	};

	/* function used to erase all the drawing of the tiles on the player side and redraw them.
	this function used after the player makes a play */
	function eraseAndDrawPlayerTiles(){
		removeTilesDrawing("playerBoard", "tileVertical");
		drawPlayerTiles(playerTiles, numberToString);
	};

/////////////////////////////////////////////End of functions used by the player////////////////////////////////////////////////

});