
class RpsGame {

    constructor(p1,p2){

        this._players = [p1,p2];
        this._turns = [null,null];
        this._sendToPlayers('Rock Paper Scissors Starts');

        this._players.forEach((player, idx) => {
            player.on('turn', (turn) => {
                this._onTurn(idx, turn)
            });
        });

    }

    _sendToPlayer(playerIndex, msg){
        this._players[playerIndex].emit('message', msg);
    }


    _sendToPlayers(msg){
        this._players.forEach((player) =>{
            player.emit('message',msg);
        });
    }

    _onTurn(playerIndex, turn){
        this._turns[playerIndex] = turn;
        this._sendToPlayer(playerIndex, `You selected ${turn}`);

        this._checkGameOver();
    }

    _checkGameOver(){
        const turns = this._turns;
        if (turns[0] && turns[1]){
            this._getGameResult();
            this._turns = [null,null];
            this._sendToPlayers('Next Round!');
            this._sendToPlayers('----------------------------------------');
        }
    }

    _getGameResult(){
        const p0 = this._decodeTurn(this._turns[0]);
        const p1 = this._decodeTurn(this._turns[1]);

        const p0_t = this._turns[0];
        const p1_t = this._turns[1];

        this._sendToPlayer(0, `Your opponent chose ${p1_t}`);
        this._sendToPlayer(1, `Your opponent chose ${p0_t}`);
        
        const distance = (p1 - p0 + 3)%3;

        switch(distance){
            case 0:
                //draw
                this._sendToPlayers('Draw!');
                break;
            case 1:
                //p0 won
                this._sendWinMessage(this._players[1], this._players[0]);
                break;
            case 2:
                //p1 won
                this._sendWinMessage(this._players[0], this._players[1]);
                break;
        }
    }

    _sendWinMessage(winner,loser){
        winner.emit('message', 'You Won!');
        loser.emit('message', 'You Lost. =(');
    }

    _decodeTurn(turn){

        switch (turn){
            case 'rock':
                return 0;
            case 'paper':
                return 1;
            case 'scissors':
                return 2;
            default:
                throw new Error(`Could not decode turn ${turn}`);
        }

    }
}

module.exports = RpsGame;