document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("createGameBtn").addEventListener("click", createGame);
document.getElementById("joinGameBtn").addEventListener("click", joinGame);
document.getElementById("revealMoveBtn").addEventListener("click", revealMove);

// Connect to Ethereum network using web3.js
const web3 = new Web3(Web3.givenProvider);
let rpsContract;
let currentPlayerAddress;
let currentGameId;
let currentStake; // Remove the initialization here
let decodedData;

async function connectWallet() {
    console.log('helloworlddgg22kk');
    if (window.ethereum) {
        try {
            
            await window.ethereum.enable();
            console.log("Wallet connecteddddeessssssss:", web3.eth.defaultAccount);

            const contractAddress = "0xd20a3a661936560f2e59c9606a1a8e8e646dd03a"; // Replace with your contract address
            const contractAbi = [
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
                }
            ]; // Replace with your contract ABI
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
        document.getElementById("gameStatus").innerText = `Game created by Player 1 (${currentPlayerAddress}). please ask to join player2 GameID: ${currentGameId} before play`;
    } catch (error) {
        console.error("Error creating game:", error);
    }
}

async function joinGame() {
    try {
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
                    const moveNames = ["Null","Rock", "Paper", "Scissors"]; // Corresponding move names
                    
                    // Determine the winner index based on the moves
                    const winnerIndex = (moves[0] - moves[1] + 3) % 3;
            
                   
                    if (winnerIndex === 0) {
                        resultMessage = "It's a tie!";
                    } else if (winnerIndex === 1) {
                        resultMessage = `Player 1(created player) wins with ${moveNames[moves[0]]}.`;
                    } else {
                        resultMessage = `Player 2(joinned player) wins with ${moveNames[moves[1]]}.`;
                    }
            
                    document.getElementById("gameStatus").innerText = resultMessage;
                } else {
                    // Only one player has revealed their move, show a message indicating the waiting status
                    document.getElementById("gameStatus").innerText = "Waiting for the other player to reveal their move...";
                }
                document.getElementById("gameStatus").innerText = resultMessage;
            })
            .on("error", (error) => {
                console.error("Error listening to MoveRevealed event:", error);
            });
    } catch (error) {
        console.error("Error revealing move:", error);
    }
}


