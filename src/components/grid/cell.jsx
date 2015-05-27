
import React from 'react'
import CONFIG from 'constants/config'
import classnames from 'classnames'

export default class Cell extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {
        let style = {
            top: this.props.top,
            left: this.props.left,
            width: CONFIG.CELL_SIZE,
            height: CONFIG.CELL_SIZE
        }

        let classes = classnames({
            'Grid-cell': true,
            'Grid-cell--isAlive': this.props.value > 0
        })

        return (
            <div className={ classes } style={ style }>

            </div>
        )
    }
}
