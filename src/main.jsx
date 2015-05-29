
import './utils/font'

import React from 'react'
import { appState } from 'immreact'

import appStore from 'stores/appStore'
import dispatcher from './dispatchers/appDispatcher'
import ACTIONS from 'constants/actions'

import Grid from 'grid/grid'
import Menu from 'menu/menu'


// @TODO remove
window.store = appStore
window.appState = appState


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

    onSingle() {
        appStore.tick({
            single: true
        })
    }

    // @TODO the deref here keeps pure rendering working
    render() {
        return (
            <div className="container">
                <Menu running={ appStore.cursor([ 'app', 'running' ]).deref() } />
                <div className="main">
                    <Grid cells={ appStore.cursor( 'grid' ) } />
                </div>
            </div>
        )
    }
}

function render() {
    React.render( <App />, document.body )
}

render()

appState.state.on( 'swap', render )
