$(document).ready(function(){
	console.log("DOM is ready");
	//initializing four arrays one to hold all the tiles before shuffling
	//the second is to hold the boneyard tiles
	//the third is to hold the player tiles
	//the fourth to hold the computer tiles
	let allTiles, bonyardTiles, playerTiles, computerTiles = [];
	allTiles = createAllTiles();
	console.log(allTiles);
	shufflingTiles(allTiles);
	console.log(allTiles);

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
		//console.log(allTilesForShuffling);
		//return allTilesForShuffling;
	};

});
