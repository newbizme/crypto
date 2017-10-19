import React, { Component } from 'react';

const exchangeList = [
    {
        name: 'GDAX',
        pairs: ['ETH/USD', 'BTC/USD', 'ETH/BTC']
    },
    {
        name: 'Poloniex',
        pairs: ['ETH/USD', 'BTC/USD', 'ETH/BTC']
    }
];

class ExchangePicker extends Component {
    constructor(props) {
        super(props);

        this.state = { isActive: false };
    }

    onToggle = () => {
        if (this.state.isActive) {
            console.log("isActive: true")
            this.setState({ isActive: false })
        } else {
            this.setState({ isActive: true })
        }
    }

    renderExchangeList = () => {
        return exchangeList.map((ex) => {
            return ex.pairs.map((p) => {
                return (
                    <a className="dropdown-item">{ex.name}: {p}</a>
                )
            })
        })
    }

    render() {
        return (
            <div className={ this.state.isActive ? 'dropdown is-active' : 'dropdown' }>
                <div className="dropdown-trigger">
                    <button 
                        className="button" 
                        aria-haspopup="true" 
                        aria-controls="dropdown-menu"
                        onClick={this.onToggle}
                        >
                        <span>GDAX: ETH/USD</span>
                        <span className="icon is-small">
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        { this.renderExchangeList() }
                    </div>
                </div>
            </div>
        );
    }
}


    

export default ExchangePicker;

/*
        <div className="drowndown is-active">
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>GDAX: ETH/USD</span>
                    <span className="icon is-small"><i className="fa fa-angle-down" aria-hidden="true"></i></span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <a href="#" className="dropdown-item is-active">GDAX: ETH/USD</a>
                    <a className="dropdown-item">GDAX: BTC/USD</a>
                    <a className="dropdown-item">GDAX: ETH/BTC</a>                    
                </div>
            </div>
        </div>
        */