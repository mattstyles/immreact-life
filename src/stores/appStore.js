
import { appState } from 'immreact'
import range from 'lodash.range'
import CONFIG from 'constants/config'
import ACTIONS from 'constants/actions'
import dispatcher from 'dispatchers/appDispatcher'

var _state = Symbol( 'state' )


class AppStore {
    constructor() {
        this[ _state ] = 'appStore'

        // Generates initial grid of cells
        let grid = range( 0, CONFIG.GRID_SIZE, 0 ).map( row => {
            return range( 0, CONFIG.GRID_SIZE, 0 ).map( cell => false )
        })

        appState.create( this[ _state ], grid )

        dispatcher.register( dispatch => {
            if ( dispatch.type === ACTIONS.UPDATE_CELL ) {
                console.log( 'updating' )
                this.updateCell( Object.assign( dispatch.payload, {
                    value: !dispatch.payload.value
                }))
            }
        })
    }

    cursor() {
        return appState.state.cursor( this[ _state ] )
    }

    tick() {
        let grid = this.cursor().toJS()

        grid.forEach( ( row, i ) => {
            row.forEach( ( cell, j ) => {
                // console.log( cell, i, j, grid )
                this.tickCell( cell, i, j, grid )
            })
        })
    }

    tickCell( cell, i, j, grid ) {
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
    updateCell( cell ) {
        this.cursor().update( cursor => {
            let grid = this.cursor().toJS()
            grid[ cell.x ][ cell.y ] = cell.value
            return cursor.merge( grid )
        })
    }
}

export default new AppStore()
