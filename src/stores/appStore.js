
import { appState } from 'immreact'
import range from 'lodash.range'
import AnimationFrame from 'animation-frame'

import CONFIG from 'constants/config'
import ACTIONS from 'constants/actions'
import dispatcher from 'dispatchers/appDispatcher'

var _state = Symbol( 'state' )


var raf = new AnimationFrame( 20 )


class AppStore {
    constructor() {
        this[ _state ] = 'appStore'

        // Generates initial grid of cells
        let grid = range( 0, CONFIG.GRID_SIZE, 0 ).map( row => {
            return range( 0, CONFIG.GRID_SIZE, 0 ).map( cell => false )
        })

        appState.create( this[ _state ], grid )

        // Next animation frame
        this.frame = null

        dispatcher.register( dispatch => {
            if ( dispatch.type === ACTIONS.UPDATE_CELL ) {
                this.updateCell( Object.assign( dispatch.payload, {
                    value: !dispatch.payload.value
                }))

                return
            }

            if ( dispatch.type === ACTIONS.START ) {
                if ( this.frame ) {
                    return
                }

                this.tick()
                return
            }

            if ( dispatch.type === ACTIONS.STOP ) {
                if ( !this.frame ) {
                    return
                }

                raf.cancel( this.frame )
                this.frame = null
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

        this.frame = raf.request( this.tick.bind( this ) )
    }

    tickCell( cell, i, j, grid ) {
        let count = 0

        // Count up alive neighbours
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
