import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux'
import { connect } from 'react-redux'

const ADD_PLAYER = 'addPlayer';
const ADD_SCORE = 'addScore';
const CHANGE_THEME = 'changeTheme';
const THEMES = ['Default', 'Dark'];

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

var initialState = {
	theme: THEMES[1],
	match: {}
};

function reducer(state = initialState, action) {
	var newState;
	switch (action.type) {
		case ADD_PLAYER: {
			newState = Object.assign({}, state, {
				match: Object.assign(state.match, {
					[action.payload.name]: {
						name: action.payload.name,
						scores: []
					}
				})
			});
			console.log('ADD_PLAYER ' + JSON.stringify(action) + ' New state: ' + JSON.stringify(newState));
			break;
		}
		case ADD_SCORE: {
			newState = Object.assign({}, state, {
				match: Object.assign(state.match, {
					[action.payload.name]: {
						name: action.payload.name,
						scores: [...state.match[action.payload.name].scores, action.payload.score]
					}
				})
			});
			break;
		}
		case CHANGE_THEME: {
			newState = Object.assign({}, state, {
				theme: action.payload.theme,
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

function createChangeThemeAction(theme) {
	return {
		type: CHANGE_THEME,
		payload: {
			theme: theme
		}
	}
}

class ThemeChanger extends Component {

	render() {
		return (
			<form className="themeSelectorForm">
				<label htmlFor="themeSelector">Theme</label>
				<select id="themeSelector" value={this.props.theme}
					onChange={this.props.changeTheme}> {
					THEMES.map(theme => (
						<option
							value={theme}
							key={'theme-option-' + theme}>{theme}</option>
					))
				}
				</select>
			</form>
		)
	}

}

var ThemeChangerContainer = connect(
	// mapStateToProps
	(state, ownProps) => {
		console.log('mapStateToProps ThemeChangerContainer ', state, ownProps);
		return {
			theme: state.theme
		}
	},
	// mapDispatchToProps
	(dispatch) => {
		return {
			changeTheme : (event) => {
				console.log('ThemeChanger event')
				event.preventDefault();
				dispatch(createChangeThemeAction(event.target.value));
			}
		}
	}

)(ThemeChanger);


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
		console.log('PlayerRenderer.render')
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

class AddPlayerForm extends Component {

	render() {
		return (
			<div className="container-fluid">
				<form onSubmit={this.props.addPlayer}>
		 			<label htmlFor="newPlayer">New player</label>
					<input type="text" id="newPlayer" name="newPlayer"/>
					<input type="submit" value="Add player"/>
				</form>
			</div>
		)
	}

}

var AddPlayerFormContainer = connect (
	// mapStateToProps
	null, //(state, ownProps) => { return {} },
	// mapDispatchToProps
	(dispatch) => {
		return {
			addPlayer : (event) => {
				event.preventDefault();
				dispatch(createAddPlayerAction(event.target.newPlayer.value));
			}
		}
	}

)(AddPlayerForm);

class App extends Component {

	render() {
		console.log('App.render');
		return (
			<div className={'app theme-' + this.props.theme.toLowerCase()}>
				<div className="container">
					<header className="App-header">
						<h1>Simple score</h1>
					</header>
				</div>
				<div className="container">
					<div className="row">{
						Object.keys(this.props.match).map(playerName =>
							<PlayerRenderer player={this.props.match[playerName]} addScore={this.props.addScore} key={playerName}/>
						)
					}
					</div>
				</div>
				<AddPlayerFormContainer/>
				<ThemeChangerContainer/>
			</div>
		);
	}

/*	shouldComponentUpdate(nextProps, nextState) {
		//var result = super.shouldComponentUpdate(nextProps, nextState);
		console.log("App.shouldComponentUpdate", this.props, nextProps, nextState);
		//return result;
		return true;
	}*/

}

// Just to get automatic updates without having to call this.setState()

let AppContainer = connect(
	(state, ownProps) => { console.log('mapStateToProps ', state, {...state}, ownProps); return {...state, 'a':'b'} },
	(dispatch, ownProps) => {
		return {
			addScore: (playerName, score) => {
				dispatch(createAddScoreAction(playerName, score));
			}
		}
	}
)(App)

store.subscribe(() => console.log('State changed: ' + JSON.stringify(store.getState())));
export { AppContainer as App, store}
