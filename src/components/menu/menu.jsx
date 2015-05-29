
import React from 'react'
import pureUpdate from 'react-pure-render/function'
import classnames from 'classnames'

import appStore from 'stores/appStore'
import dispatcher from 'dispatchers/appDispatcher'
import ACTIONS from 'constants/actions'

class MenuRunningIndicator extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {
        let styles = classnames({
            'Menu-indicator': true,
            'u-stretchX': true,
            'Menu-indicator--isActive': this.props.active
        })

        return (
            <div className={ styles }></div>
        )
    }
}


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

    // Pure
    shouldComponentUpdate = pureUpdate

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
                <header>
                    <h2 className="Menu-title">
                        <span className="Menu-titleTop">Immutable</span>
                        <span className="Menu-titleBottom">Life</span>
                    </h2>
                </header>
                <MenuRunningIndicator active={ this.props.running } />
                <MenuButtonGroup>
                    <MenuButton text="Start" action={ ACTIONS.START } />
                    <MenuButton text="Stop" action={ ACTIONS.STOP } />
                    <MenuButton text="Single Generation" action={ this.onSingle.bind( this ) } />
                </MenuButtonGroup>
                <footer className="Menu-footer">
                    <p>Cellular automata example using <a href="https://github.com/facebook/immutable-js">immutable</a> data and <a href="https://github.com/facebook/react">React</a>. It’s not a particularly appropriate fit and there are plenty of optimisations that can be made.</p>
                    <p>Fun to <a href="https://github.com/mattstyles/immreact-life">hack</a> on though.</p>
                </footer>
            </nav>
        )
    }
}
