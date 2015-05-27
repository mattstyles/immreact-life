
import { appState } from 'immreact'
import range from 'lodash.range'
import CONFIG from 'constants/config'

var _state = Symbol( 'state' )


class AppStore {
    constructor() {
        this[ _state ] = 'appStore'

        let grid = range( 0, CONFIG.GRID_SIZE, 0 ).map( row => {
            return range( 0, CONFIG.GRID_SIZE, 0 ).map( cell => 0 )
        })

        appState.create( this[ _state ], grid )
    }

    cursor() {
        return appState.state.cursor( this[ _state ] )
    }

    update() {
        let grid = this.cursor().toJS()

        grid.forEach( ( row, i ) => {
            row.forEach( ( cell, j ) => {
                // console.log( cell, i, j, grid )
                this.updateCell( cell, i, j, grid )
            })
        })
    }

    updateCell( cell, i, j, grid ) {
        let count = 0

        range( i - 1, i + 1 ).forEach( x => {
            range( j - 1, j + 1 ).forEach( y => {
                // Check out of bounds
                if ( x < 0 || y < 0 || x > CONFIG.GRID_SIZE - 1 || y > CONFIG.GRID_SIZE - 1 ) {
                    return
                }

                if ( grid[ x ][ y ] > 0 ) {
                    count++
                }
            })
        })

        console.log( count )
    }

    // No error checking
    _forceCellUpdate( x, y, value ) {
        this.cursor().update( cursor => {
            let grid = this.cursor().toJS()
            grid[ x ][ y ] = value
            return cursor.merge( grid )
        })
    }
}

export default new AppStore()
