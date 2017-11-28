import React, { Component } from 'react';

import { RadialChart, Hint } from 'react-vis';

const s = {
    hint: {
        display: 'inline-block',
        position: 'absolute',
        backgroundColor: '#222',
        opacity: '.9',
        height: '65px',
        width: '125px',
        zIndex: '1',
        textAlign: 'center'
    },
    hintTitle: {
        fontSize: '1.2em',
        color: 'rgb(33, 186, 69)'
    },
    hintData: {
        fontSize: '1.2em',
        color: 'rgb(33, 186, 69)'
    }
}

export default class PieChartVis extends Component {
    constructor(props) {
        super(props);
        this.state ={ hover: null };
    }

    onHover = () => {

    }

    renderHint = () => {
        return (
            <div style={s.hint} className="pie-hint">
                <p style={s.hintTitle}>{Math.round(this.state.hover.amount * 1e2)/1e2} {this.state.hover.label}</p>
                <span style={s.hintData}>${this.state.hover.value}</span>
            </div>
        );
    }

    render() {
        let data = [];
        this.props.net.assets.map((asset) => {
            data.push({ 
                angle: asset.value,
                label: asset.currency,
                value: asset.value,
                amount: asset.amount
             });
        });
        const data2 = [
            {angle: 1},
            {angle: 5},
            {angle: 2}
        ];

        return (
            <div style={{display: 'inline-block'}}>
                { this.state.hover && this.renderHint() }
            <RadialChart 
                height={400}
                width={400}
                data={data}
                onValueMouseOver={v => this.setState({ hover: v })}
                style={{display: 'inline-block'}}
                onSeriesMouseOut={v => this.setState({ hover: null })}
                >
                
            </RadialChart>
            
            </div>
        );
    }
}

/*
{ this.state.hover && 
                <Hint value={this.state.hover} /> }
                */

// Data:
        /*
            net: {
                assets: [
                    {
                        amount: 210,
                        currency: "GNT",
                        value: 46.02
                    },
                    {
                        amount: 5.9,
                        currency: "ETH",
                        value: 2201.11
                    }
                ],
                investment: -2310.11,
                value: 2255.47
            }
        */