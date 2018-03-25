import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const ADD_PLAYER = 'addPlayer';
const ADD_SCORE = 'addPlayer';

function createAddPlayerAction(name) {
	return {
		type: ADD_PLAYER;
		payload: {
			name: name;
		}
	}
}

function createAddScoreAction(name, score) {
	return {
		type: ADD_SCORE;
		payload: {
			name: name;
			score: score;
		}
	}
}

class PlayerRenderer extends Component {
	
	constructor(props) {
		super(props);
		this.addScore = this.addScore.bind(this);
	}
	
	addScore(event) {
		event.preventDefault();
		this.props.addScore(
			this.props.player.name,
			parseInt(event.target[this.getFieldId()].value, 10)
		)
	}
	
	getFieldId() {
		return this.props.player.name + '-add-score';
	}

	render() {
		return (
			<div className="col-sm">
				<h2>{this.props.player.name}</h2>
				<ul class="playerScore">{
					this.props.player.scores.map(score =>
						<li>{score}</li>
					)
				}
					<li class="totalScore">
						<span class="label">Total</span>
						<span class="total">{this.props.player.scores.reduce((a, b) => a + b, 0)}</span>
					</li>
				</ul>
				<form onSubmit={this.addScore}>
					<label for={this.getFieldId()}>Add score</label>
					<input type="number" id={this.getFieldId()}/>
				</form>
			</div>
		)
	}

}

class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			Thiago : {
				name: 'Thiago',
				scores: [100, 500 -900]
			},
			Cristilene : {
				name: 'Cristilene',
				scores: [1200, 500 -200]
			},
		};
		this.addPlayer = this.addPlayer.bind(this);
		this.addScore = this.addScore.bind(this);
	}
	
	addScore(playerName, score) {
		this.setState(previousState => {
			let newState = JSON.parse(JSON.stringify(previousState))
			newState[playerName].scores.push(score);
			return newState;
		});
	}
	
	addPlayer(event) {
		event.preventDefault();
		this.setState({
			[event.target.newPlayer.value] : { 
				name : event.target.newPlayer.value,
				scores: []
			}
		});
	}
	
	render() {
		return (
			<div className="app">
				<div className="container">
					<header className="App-header">
						<h1>Simple score</h1>
					</header>
				</div>
				<div className="container">
					<div class="row">{	
						Object.keys(this.state).map(playerName => 
							<PlayerRenderer player={this.state[playerName]} addScore={this.addScore}/>
						)
					}
					</div>
				</div>
				<div className="container-fluid">
					<form onSubmit={this.addPlayer}>
						<label>New player</label>
						<input type="text" id="newPlayer" name="newPlayer"/>
						<input type="submit" value="Add player"/>
					</form>
				</div>
			</div>
		);
	}
}

export default App;
