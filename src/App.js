import React, { useReducer, createContext, useContext } from 'react';
import logo from './logo.svg';
import './App.css';

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

function reducer(state, action) {
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

// From https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
const StateContext = createContext();
const StateProvider = ({reducer, initialState, children}) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
const useStateValue = () => useContext(StateContext);
// Usage: const [state, dispatch] = useStateValue();
// Or:    const [{ propertyName }, dispatch] = useStateValue();

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

function ThemeChanger(props) {
  const [state, dispatch] = useStateValue();
	const changeTheme = (event) => {
		console.log('ThemeChanger event')
		event.preventDefault();
		dispatch(createChangeThemeAction(event.target.value));
	}

	return (
		<form className="themeSelectorForm">
			<label htmlFor="themeSelector">Theme</label>
			<select id="themeSelector" value={props.theme}
				onChange={changeTheme}> {
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

function PlayerRenderer(props) {

  const [state, dispatch] = useStateValue();

  function getFieldId() {
		return props.player.name + '-add-score';
	}

	function addScore(event) {
    event.preventDefault();
    dispatch(createAddScoreAction(
      props.player.name,
      parseInt(event.target[getFieldId()].value, 10)));
		event.target[getFieldId()].value = null;
	}

	console.log('PlayerRenderer.render')
	return (
		<div className="col-sm">
			<h2>{props.player.name}</h2>
			<ul className="playerScore">{
				props.player.scores.map(score =>
					<li>{score}</li>
				)
			}
				<li className="totalScore">
					<span className="label">Total</span>
					<span className="total">{props.player.scores.reduce((a, b) => a + b, 0)}</span>
				</li>
			</ul>
			<form onSubmit={addScore}>
				<label htmlFor={getFieldId()}>Add score</label>
				<input type="number" id={getFieldId()}/>
			</form>
		</div>
	)

}

function AddPlayerForm(props) {

  const [state, dispatch] = useStateValue();

  function addPlayer(event) {
    event.preventDefault();
    dispatch(createAddPlayerAction(event.target.newPlayer.value));
		event.target.newPlayer.value = null;
  }

	return (
		<div className="container-fluid">
			<form onSubmit={addPlayer}>
	 			<label htmlFor="newPlayer">New player</label>
				<input type="text" id="newPlayer" name="newPlayer"/>
				<input type="submit" value="Add player"/>
			</form>
		</div>
	)

}

function App() {
  const [state, dispatch] = useStateValue();
	console.log('App.render: ' + JSON.stringify(state));
	return (
		<div className={'app theme-' + state.theme.toLowerCase()}>
			<div className="container">
				<header className="App-header">
					<h1>Simple score</h1>
				</header>
			</div>
			<div className="container">
				<div className="row">{
					Object.keys(state.match).map(playerName =>
						<PlayerRenderer player={state.match[playerName]} key={playerName}/>
					)
				}
				</div>
			</div>
      <AddPlayerForm/>
      <ThemeChanger/>
    </div>
  )
}

function AppWrapper() {
	return (
		<StateProvider initialState={initialState} reducer={reducer}>
			<App/>
		</StateProvider>
	)
}

export default AppWrapper;
