
import React from 'react'
import CONFIG from 'constants/config'
import ACTIONS from 'constants/actions'
import classnames from 'classnames'
import dispatcher from 'dispatchers/appDispatcher'

export default class Cell extends React.Component {
    static propTypes = {
        x: React.PropTypes.number,
        y: React.PropTypes.number,
        value: React.PropTypes.bool
    }

    constructor( props ) {
        super( props )
    }

    onClick( event ) {
        dispatcher.dispatch({
            type: ACTIONS.UPDATE_CELL,
            payload: this.props
        })
    }

    render() {
        let style = {
            left: this.props.x * CONFIG.CELL_SIZE,
            top: this.props.y * CONFIG.CELL_SIZE,
            width: CONFIG.CELL_SIZE,
            height: CONFIG.CELL_SIZE
        }

        let classes = classnames({
            'Grid-cell': true,
            'Grid-cell--isAlive': this.props.value
        })

        return (
            <div
                className={ classes }
                style={ style }
                onClick={ this.onClick.bind( this ) }
            ></div>
        )
    }
}
