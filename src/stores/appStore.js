
import { appState } from 'immreact'
import range from 'lodash.range'
import AnimationFrame from 'animation-frame'

import CONFIG from 'constants/config'
import ACTIONS from 'constants/actions'
import dispatcher from 'dispatchers/appDispatcher'


// Private symbol to keep prying fingers from altering state without going
// through the dispatcher or this store
var _state = Symbol( 'appStore' )


// Animation frame helper to handles game ticks
var raf = new AnimationFrame( CONFIG.FRAME_RATE )


/**
 * Not only a data store, the state of the CA's held within grid are also
 * manipulated within AppStore
 */
class AppStore {
    constructor() {
        this[ _state ] = 'appStore'

        // Generates initial grid of cells - seed
        let grid = range( 0, CONFIG.GRID_SIZE, 0 ).map( row => {
            return range( 0, CONFIG.GRID_SIZE, 0 ).map( cell => false )
        })

        appState.create( this[ _state ], {
            grid: grid,
            app: {
                running: false
            }
        })

        // Next animation frame
        this.frame = null

        // Handles app actions
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

                this.cursor( [ 'app', 'running' ] ).update( cursor => true )
                this.tick()
                return
            }

            if ( dispatch.type === ACTIONS.STOP ) {
                if ( !this.frame ) {
                    return
                }

                raf.cancel( this.frame )
                this.frame = null
                this.cursor( [ 'app', 'running' ] ).update( cursor => false )
            }
        })
    }

    /**
     * Grabs a fresh cursor to the data structure
     * @param args <Array>|<String> specify structure keyPath to grab
     */
    cursor( args ) {
        if ( !args ) {
            return appState.state.cursor( this._state )
        }

        if ( typeof args === 'string' ) {
            return appState.state.cursor( [ this[ _state ], args ] )
        }

        return appState.state.cursor( [ this[ _state ], ...args ] )
    }

    /**
     * Handles a single generation update for all cells
     * Unless specified will trigger continuous automation via raf
     * @param options <Object>
     *   single <Boolean> if true will run only once i.e. one single generation update
     */
    tick( options ) {
        let opts = Object.assign({
            single: false
        }, options )

        let grid = this.cursor( 'grid' ).toJS()

        // Map from old grid to new grid
        // Pass the old grid to the tickCell function as rules need
        // the entire old grid state
        this.updateGrid( grid.map( ( row, i ) => {
            return row.map( ( cell, j ) => {
                return this.tickCell({
                    x: i,
                    y: j,
                    value: cell
                }, grid )
            })
        }) )

        if ( !opts.single ) {
            this.frame = raf.request( this.tick.bind( this ) )
        }
    }

    /**
     * Implements the CA rules
     */
    tickCell( cell, grid ) {
        let count = 0

        // Count up alive neighbours
        range( cell.x - 1, cell.x + 2 ).forEach( x => {
            range( cell.y - 1, cell.y + 2 ).forEach( y => {

                // Check out of bounds
                if ( x < 0 || y < 0 || x > CONFIG.GRID_SIZE - 1 || y > CONFIG.GRID_SIZE - 1 ) {
                    return
                }

                // Check self
                if ( x === cell.x && y === cell.y ) {
                    return
                }

                // If the grid is true then its alive so count it up
                if ( grid[ x ][ y ] ) {
                    count++
                }
            })
        })

        // Alive
        if ( cell.value ) {
            // Under-population - die
            if ( count < 2 ) {
                return false
            }

            // Stable
            if ( count >= 2 && count <= 3 ) {
                return true
            }

            // Over-population
            if ( count > 3 ) {
                return false
            }

            throw new Error( 'appStore::tickCell - this should be unreachable' )
        }

        // Dead
        // Reproduction
        if ( count === 3 ) {
            return true
        }

        // This should be false, denoting a dead cell
        return cell.value
    }


    // No error checking
    updateCell( cell ) {
        this.cursor( [ 'grid', cell.x, cell.y ] ).update( cursor => {
            // return cell.value
            return !cursor
        })
    }


    updateGrid( grid ) {
        this.cursor( 'grid' ).update( cursor => {
            return cursor.merge( grid )
        })
    }
}

export default new AppStore()
