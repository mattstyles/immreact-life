import React from 'react'
import CONFIG from 'constants/config'
import Cell from './cell'

export default class Grid extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {

        let grid = this.props.cells.toJS()
        let items = grid.map( ( row, i ) => {
            return row.map( ( cell, j ) => {
                return (
                    <Cell
                        x={ i }
                        y={ j }
                        value={ cell }
                    />
                )
            })
        })

        let style = {
            width: CONFIG.CELL_SIZE * CONFIG.GRID_SIZE,
            height: CONFIG.CELL_SIZE * CONFIG.GRID_SIZE
        }

        return (
            <div className="Grid" style={ style }>
                { items }
            </div>
        )
    }
}
