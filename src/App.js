import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux'

const ADD_PLAYER = 'addPlayer';
const ADD_SCORE = 'addScore';

/*
var initialStateWithData = {
	Thiago : {
		name: 'Thiago',
		scores: [100, 500 -900]
	},
	Cristilene : {
		name: 'Cristilene',
		scores: [1200, 500 -200]
	},
};*/

var initialState = {};

function reducer(state = initialState, action) {
	var newState;
	switch (action.type) {
		case ADD_PLAYER: {
			newState = Object.assign({}, state, {
				[action.payload.name]: {
					name: action.payload.name,
					scores: []
				}
			});
			break;
		}
		case ADD_SCORE: {
			newState = Object.assign({}, state, {
				[action.payload.name]: {
					name: action.payload.name,
					scores: [...state[action.payload.name].scores, action.payload.score]
				}
			});
			break;
		}
		default:
			newState = state;
	}
	return newState;
}

var store = createStore(reducer);

function createAddPlayerAction(name) {
	return {
		type: ADD_PLAYER,
		payload: {
			name: name
		}
	}
}

function createAddScoreAction(name, score) {
	return {
		type: ADD_SCORE,
		payload: {
			name: name,
			score: score
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
				<ul className="playerScore">{
					this.props.player.scores.map(score =>
						<li>{score}</li>
					)
				}
					<li className="totalScore">
						<span className="label">Total</span>
						<span className="total">{this.props.player.scores.reduce((a, b) => a + b, 0)}</span>
					</li>
				</ul>
				<form onSubmit={this.addScore}>
					<label htmlFor={this.getFieldId()}>Add score</label>
					<input type="number" id={this.getFieldId()}/>
				</form>
			</div>
		)
	}

}

class App extends Component {
	
	constructor(props) {
		super(props);
		this.addPlayer = this.addPlayer.bind(this);
		this.addScore = this.addScore.bind(this);
		this.state = store.getState();
	}
	
	addScore(playerName, score) {
		store.dispatch(createAddScoreAction(playerName, score));
		this.setState(store.getState());
	}
	
	addPlayer(event) {
		event.preventDefault();
		store.dispatch(createAddPlayerAction(event.target.newPlayer.value));
		this.setState(store.getState());
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
					<div className="row">{	
						Object.keys(this.state).map(playerName => 
							<PlayerRenderer player={this.state[playerName]} addScore={this.addScore} key={playerName}/>
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
