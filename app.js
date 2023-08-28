document.addEventListener("DOMContentLoaded", () => {
document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("createGameBtn").addEventListener("click", createGame);
document.getElementById("joinGameBtn").addEventListener("click", joinGame);
document.getElementById("revealMoveBtn").addEventListener("click", revealMove);
  document.getElementById("fetchResultBtn").addEventListener("click", fetchGameResult);

// Connect to Ethereum network using web3.js
const web3 = new Web3(Web3.givenProvider);
let rpsContract;
let currentPlayerAddress;
let currentGameId;
let currentStake ; // Remove the initialization here
let IsconnectWallet  = false;


async function connectWallet() {
    IsconnectWallet=true;
    console.log(IsconnectWallet);
    if (window.ethereum) {
        try {
            
            await window.ethereum.enable();
            console.log("Wallet connecteddddeessssssss:", web3.eth.defaultAccount);

            const contractAddress = "0x21E2DCf45e885D52a93c3a4f2EA2A8ac496b71Cf"; // contract address
            const contractAbi =[
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "gameId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "player1",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "stake",
                            "type": "uint256"
                        }
                    ],
                    "name": "GameCreated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "gameId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "winner",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "GameFinished",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "gameId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "player2",
                            "type": "address"
                        }
                    ],
                    "name": "GameJoined",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "gameId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "player",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum RockPaperScissors.Move",
                            "name": "move",
                            "type": "uint8"
                        }
                    ],
                    "name": "MoveRevealed",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "commitment",
                            "type": "bytes32"
                        }
                    ],
                    "name": "createGame",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "gameCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "games",
                    "outputs": [
                        {
                            "internalType": "address payable",
                            "name": "player1",
                            "type": "address"
                        },
                        {
                            "internalType": "address payable",
                            "name": "player2",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "commitment1",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "commitment2",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "enum RockPaperScissors.Move",
                            "name": "move1",
                            "type": "uint8"
                        },
                        {
                            "internalType": "enum RockPaperScissors.Move",
                            "name": "move2",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "stake",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "revealed1",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "revealed2",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "finished",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "gameId",
                            "type": "uint256"
                        }
                    ],
                    "name": "joinGame",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "gameId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum RockPaperScissors.Move",
                            "name": "move",
                            "type": "uint8"
                        }
                    ],
                    "name": "revealMove",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]//   contract ABI
            rpsContract = new web3.eth.Contract(contractAbi, contractAddress);
            document.getElementById("walletConnected").style.display = "block";
            document.getElementById("connectWalletBtn").style.display = "none";
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    } else {
        console.error("Ethereum provider not found.");
    }
}

async function createGame() {
    
    
    console.log('recaeojieegggiiko');
    try {
        if (IsconnectWallet == false) {
            alert("Please connect your wallet with MetaMask to use this feature.");
            return;
        }
        const accounts = await web3.eth.getAccounts();
        
        // Retrieve the commitment and stake amount from the input fields
        const commitment = web3.utils.utf8ToHex(document.getElementById("commitment").value);
        const stakeCreate = document.getElementById("stakeCreate").value;
        currentStake = web3.utils.toWei(stakeCreate, "ether");
      
        const tx = await rpsContract.methods.createGame(commitment).send({
            from: accounts[0],
            value: currentStake
        });

        // Access the created game ID from the transaction receipt
        
        const gameId = parseInt(tx.events.GameCreated.returnValues.gameId);

        currentGameId = parseInt(gameId);
        currentPlayerAddress = accounts[0];

        console.log("Game created successfully. Game ID:", currentGameId);

  
        document.getElementById("playGameSection").style.display = "block";
        document.getElementById("GameID_").innerText = `GameID : ${currentGameId}`;
        
        document.getElementById("gameStatus").innerText = `Game created by Player 1 (${currentPlayerAddress}). please ask to join player2 GameID: ${currentGameId} before play`;
    } catch (error) {
        console.error("Error creating game:", error);
    }
}

async function joinGame() {
    try {
        if (IsconnectWallet == false) {
            alert("Please connect your wallet with MetaMask to use this feature.");
            return;
        }
        const gameId = document.getElementById("joinGameId").value;
        const accounts = await web3.eth.getAccounts();
        const player1Game = await rpsContract.methods.games(gameId).call({ from: accounts[0] });
        const stake = player1Game.stake;

        await rpsContract.methods.joinGame(gameId).send({ from: accounts[0], value: stake });
        currentGameId = gameId;


        // Display player 2's move selection
        document.getElementById("gameStatus").innerText = `Player 2 (${accounts[0]}) joined the game.`;
        document.getElementById("playGameSection").style.display = "block";
    } catch (error) {
        console.error("Error joining game:", error);
    }
}

async function revealMove() {
    try {
        const move = parseInt(document.getElementById("playerMove").value);
        const accounts = await web3.eth.getAccounts();

        const moveAsUint8 = web3.utils.toBN(move);

        console.log("Revealing move:", moveAsUint8.toString());
        document.getElementById("gameStatus").innerText = `"Revealing move:", ${move}`;
        const txData = rpsContract.methods.revealMove(currentGameId, moveAsUint8).encodeABI();
        console.log("Transaction data:", txData);

        const revealTx = await rpsContract.methods.revealMove(currentGameId, moveAsUint8).send({
            from: accounts[0]
        });
        console.log("Move revealed successfully. Transaction hash:", revealTx.transactionHash);
         document.getElementById("gameStatus").innerText = `Move revealed (${move}) successfully. Transaction hash:", revealTx.transactionHash`;

        // Listen for the MoveRevealed event to get notified when both players reveal their moves
        rpsContract.events.MoveRevealed({ filter: { gameId: currentGameId } })
            .on("data", async (event) => {
                const game = await rpsContract.methods.games(currentGameId).call();
                let resultMessage;

                if (game.revealed1 && game.revealed2) {
                    // Determine the winner and update the game status
                    const moves = [game.move1, game.move2]; // Moves revealed by both players
                    const moveNames = ["Null", "Rock", "Paper", "Scissors", "Lizard", "Spock"]; // Corresponding move names
                    
                    if (moves[0]== 0 &&  moves[1]== 0) {
                       
                            resultMessage = "Both players chose Null.";
                        
                    } 
                    else if (moves[0]== 0 ) {
                       
                        resultMessage = "player1 chose Null";
                    
                } 
                else if (moves[1]== 0 ) {
                       
                    resultMessage = "player2 chose Null";
                
            } else {
                        // No player chose "Null", determine the winner based on moves
                        const winnerIndex = (moves[0] - moves[1] + 5) % 5;
                        
                        if (winnerIndex === 0) {
                            resultMessage = "It's a tie!";
                        } else if (winnerIndex === 1 || winnerIndex === 4) {
                            resultMessage = `Player 1 (created player) wins with ${moveNames[moves[0]]}.`;
                        } else {
                            resultMessage = `Player 2 (joined player) wins with ${moveNames[moves[1]]}.`;
                        }
                    }
                    
                    document.getElementById("gameStatus").innerText = resultMessage;
                } else {
                    // Only one player has revealed their move, show a message indicating the waiting status
                    document.getElementById("gameStatus").innerText = "Waiting for the other player to reveal their move...";
                }
                
            })
            .on("error", (error) => {
                console.error("Error listening to MoveRevealed event:", error);
            });
    } catch (error) {
        console.error("Error revealing move:", error);
    }
}



async function fetchGameResult() {
     // Check if the user is connected to a wallet
         if (typeof ethereum === "undefined" || !ethereum.isMetaMask || !ethereum.isConnected()) {
            alert("Please connect your wallet with MetaMask to use this feature.");
            return;
        }
    try {
        
        const gameIdResult = parseInt(document.getElementById("gameIdResult").value);
        console.log(gameIdResult);

        // Fetch the game result using the game ID
        const game = await rpsContract.methods.games(gameIdResult).call();
        console.log(game);
        console.log(game);
        if (game.finished) {
            const resultElement = document.getElementById("gameResultStatus");
            const player1AddressElement = document.getElementById("player1Address");
            const player2AddressElement = document.getElementById("player2Address");
            const player1StakeElement = document.getElementById("player1Stake");
            const player2StakeElement = document.getElementById("player2Stake");
            
            if (game.move1 == 0 && game.move2 == 0) {
              
                resultElement.textContent = "Both Player chose Null";
               
            }
            else if (game.move1 == 0 ) {
              
                resultElement.textContent = " Player1 chose Null";
                player1AddressElement.textContent = `Player 1 Address: ${game.player1}`;
                player2AddressElement.textContent = `Player 2 Address: ${game.player2}`;
                player1StakeElement.textContent = `Player 1 Stake: ${web3.utils.fromWei(game.stake, "ether")} ETH`;
                player2StakeElement.textContent = `Player 2 Stake: ${web3.utils.fromWei(game.stake, "ether")} ETH`;
               
            }
            else if (game.move2 == 0 ) {
              
                resultElement.textContent = " Player2 chose Null";
                player1AddressElement.textContent = `Player 1 Address: ${game.player1}`;
                player2AddressElement.textContent = `Player 2 Address: ${game.player2}`;
                player1StakeElement.textContent = `Player 1 Stake: ${web3.utils.fromWei(game.stake, "ether")} ETH`;
                player2StakeElement.textContent = `Player 2 Stake: ${web3.utils.fromWei(game.stake, "ether")} ETH`;
               
            } else {
                const moves = [game.move1, game.move2];
                const moveNames = ["Null", "Rock", "Paper", "Scissors", "Lizard", "Spock"];
                const winnerIndex = (moves[0] - moves[1] + 5) % 5;

                let resultMessage;
                if (winnerIndex === 0) {
                    resultMessage = "It's a tie!";
                } else if (winnerIndex === 1 || winnerIndex === 4) {
                    resultMessage = `Player 1 (created player) wins with ${moveNames[moves[0]]}.`;
                } else {
                    resultMessage = `Player 2 (joined player) wins with ${moveNames[moves[1]]}.`;
                }
                
                resultElement.textContent = resultMessage;
                player1AddressElement.textContent = `Player 1 (created) Address: ${game.player1}`;
                player2AddressElement.textContent = `Player 2 (joinned) Address: ${game.player2}`;
                player1StakeElement.textContent = `Player 1 Stake: ${web3.utils.fromWei(game.stake, "ether")} ETH`;
                player2StakeElement.textContent = `Player 2 Stake: ${web3.utils.fromWei(game.stake, "ether")} ETH`;
            }
        } else {
            const resultElement = document.getElementById("gameResultStatus");
            resultElement.textContent = "Game result not available yet.";
                // Hide player information elements
                const player1AddressElement = document.getElementById("player1Address");
                const player2AddressElement = document.getElementById("player2Address");
                const player1StakeElement = document.getElementById("player1Stake");
                const player2StakeElement = document.getElementById("player2Stake");
    
                player1AddressElement.style.display = "none";
                player2AddressElement.style.display = "none";
                player1StakeElement.style.display = "none";
                player2StakeElement.style.display = "none";
             }
    } catch (error) {
        console.error("Error fetching game result:", error);
        alert("Please connect your wallet with MetaMask to use this feature.");
        return;
    }
}


});