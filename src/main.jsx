
import './utils/font'

import React from 'react'
import { appState } from 'immreact'

import appStore from 'stores/appStore'
import dispatcher from './dispatchers/appDispatcher'
import ACTIONS from 'constants/actions'

import Grid from 'grid/grid'


// @TODO remove
window.store = appStore


class App extends React.Component {
    constructor() {
        super()
    }

    onStart() {
        dispatcher.dispatch({
            type: ACTIONS.START
        })
    }

    onStop() {
        dispatcher.dispatch({
            type: ACTIONS.STOP
        })
    }

    render() {
        return (
            <div className="container">
                <Grid cells={ appStore.cursor() } />
                <button onClick={ this.onStart.bind( this ) }>Start</button>
                <button onClick={ this.onStop.bind( this ) }>Stop</button>
            </div>
        )
    }
}

function render() {
    console.log( 'main:render' )
    React.render( <App />, document.body )
}

render()

appState.state.on( 'swap', render )
