
import React from 'react'

import appStore from 'stores/appStore'
import dispatcher from 'dispatchers/appDispatcher'
import ACTIONS from 'constants/actions'


class MenuButtonGroup extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {
        let children = this.props.children.map( child => {
            return (
                <li
                    key={ child.props.text }
                    className="Menu-btnGroup-item">
                    { child }
                </li>
            )
        })

        return (
            <ul className="Menu-btnGroup">
                { children }
            </ul>
        )
    }
}


class MenuButton extends React.Component {
    static propTypes = {
        action: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ])
    }

    constructor( props ) {
        super( props )
    }

    onClick( event ) {
        if ( typeof this.props.action === 'function' ) {
            this.props.action( event )
        }

        dispatcher.dispatch({
            type: this.props.action
        })
    }

    render() {
        return (
            <button
                className="Menu-btn u-stretchX"
                onClick={ this.onClick.bind( this ) }
            >{ this.props.text }</button>
        )
    }
}


export default class Menu extends React.Component {
    constructor( props ) {
        super( props )
    }

    onSingle( event ) {
        appStore.tick({
            single: true
        })
    }

    render() {
        return (
            <nav className="Menu">
                <MenuButtonGroup>
                    <MenuButton text="Start" action={ ACTIONS.START } />
                    <MenuButton text="Stop" action={ ACTIONS.STOP } />
                    <MenuButton text="Single Generation" action={ this.onSingle.bind( this ) } />
                </MenuButtonGroup>
            </nav>
        )
    }
}
