
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
                <a href="https://github.com/mattstyles/immreact-life">
                    <img style={{position: 'absolute', top: 0, right: 0, border: 0}} src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" />
                </a>
            </div>
        )
    }
}

function render() {
    React.render( <App />, document.body )
}

render()

appState.state.on( 'swap', render )
