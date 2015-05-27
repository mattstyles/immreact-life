
import './utils/font'

import React from 'react'
import { appState } from 'immreact'

import appStore from 'stores/appStore'
import dispatcher from './dispatchers/appDispatcher'

import Grid from 'grid/grid'

class App extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="container">
                <h1>Hello React</h1>
                <Grid cells={ appStore.cursor() } />
            </div>
        )
    }
}

function render() {
    React.render( <App />, document.body )
}

render()

appState.state.on( 'swap', render )
