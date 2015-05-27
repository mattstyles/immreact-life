
import { appState } from 'immreact'


var _state = Symbol( 'state' )


class AppStore {
    constructor() {
        this[ _state ] = 'appStore'

        appState.create( this[ _state ], [] )
    }

    cursor() {
        return appState.state.cursor( this[ _state ] )
    }
}

export default new AppStore()
