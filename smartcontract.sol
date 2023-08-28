// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors, Lizard, Spock }

    struct Game {
        address payable player1;
        address payable player2;
        bytes32 commitment1;
        bytes32 commitment2;
        Move move1;
        Move move2;
        uint256 stake;
        bool revealed1;
        bool revealed2;
        bool finished;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCount = 0;

    event GameCreated(uint256 gameId, address indexed player1, uint256 stake);
    event GameJoined(uint256 gameId, address indexed player2);
    event MoveRevealed(uint256 gameId, address indexed player, Move move);
    event GameFinished(uint256 gameId, address indexed winner, uint256 amount);

    function createGame(bytes32 commitment) external payable {
        require(msg.value > 0, "Stake must be greater than 0");

        gameCount++;
        games[gameCount] = Game({
            player1: payable(msg.sender),
            player2: payable(address(0)),
            commitment1: commitment,
            commitment2: bytes32(0),
            move1: Move.None,
            move2: Move.None,
            stake: msg.value,
            revealed1: false,
            revealed2: false,
            finished: false
        });

        emit GameCreated(gameCount, msg.sender, msg.value);
    }

    function joinGame(uint256 gameId) external payable {
        Game storage game = games[gameId];
        require(game.player2 == address(0), "Game is already full");
        require(msg.value == game.stake, "Stake must be equal to the stake of the first player");
        require(msg.sender != game.player1, "You cannot join your own game");

        game.player2 = payable(msg.sender);
        emit GameJoined(gameId, msg.sender);
    }

    function revealMove(uint256 gameId, Move move) external {
        Game storage game = games[gameId];
        require(game.finished == false, "Game is finished");
        require(msg.sender == game.player1 || msg.sender == game.player2, "You are not a participant");

        if (msg.sender == game.player1) {
            require(game.revealed1 == false, "Move already revealed");
            game.move1 = move;
            game.revealed1 = true;
        } else if (msg.sender == game.player2) {
            require(game.revealed2 == false, "Move already revealed");
            game.move2 = move;
            game.revealed2 = true;
        }

        emit MoveRevealed(gameId, msg.sender, move);

        if (game.revealed1 && game.revealed2) {
            finishGame(gameId);
        }
    }

    function finishGame(uint256 gameId) internal {
        Game storage game = games[gameId];
        require(game.finished == false, "Game is finished");
        require(game.revealed1 && game.revealed2, "Both players must reveal their moves");

        if ((game.move1 == game.move2) || (game.move1 == Move.None) || (game.move2 == Move.None)) {
            game.player1.transfer(game.stake);
            game.player2.transfer(game.stake);
        } else if (
            (game.move1 == Move.Rock && (game.move2 == Move.Scissors || game.move2 == Move.Lizard)) ||
            (game.move1 == Move.Paper && (game.move2 == Move.Rock || game.move2 == Move.Spock)) ||
            (game.move1 == Move.Scissors && (game.move2 == Move.Paper || game.move2 == Move.Lizard)) ||
            (game.move1 == Move.Lizard && (game.move2 == Move.Paper || game.move2 == Move.Spock)) ||
            (game.move1 == Move.Spock && (game.move2 == Move.Rock || game.move2 == Move.Scissors))
        ) {
            game.player1.transfer(game.stake * 2);
        } else {
            game.player2.transfer(game.stake * 2);
        }

        game.finished = true;
        emit GameFinished(gameId, msg.sender, game.stake * 2);
    }
}
