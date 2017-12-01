import React, { Component } from 'react';

import { Icon, Table, Button } from 'semantic-ui-react';

const s = {
    green: {
        color: '#21ba45',
    },
    red: {
        color: 'red'
    },
    chevron: {
        fontSize: '10px'
    },
    logo: {
        marginRight: '5px',
        fontSize: '20px'
    },
    logoSpace: {
        display: 'inline-block',
        width: '24px'
    }
}

export default class HoldingsTable extends Component {
    constructor(props) {
        super(props);
    }

    renderTable = () => {
        let data = this.props.data;
        var nf = Intl.NumberFormat();

        return data.map((c) => {
            return (
                <Table.Row>
                    <Table.Cell>{ c.rank }</Table.Cell>
                    <Table.Cell>
                        <div style={s.logoSpace}>
                            <i style={s.logo} className={ 'cc ' + c.symbol } title={ c.symbol }></i>
                        </div>
                        { c.name }
                    </Table.Cell>
                    <Table.Cell>${ c.price_usd > 1 ? nf.format(Math.round(c.price_usd * 1e2) / 1e2) : nf.format(c.price_usd) }</Table.Cell>
                    <Table.Cell>${ nf.format(c.market_cap_usd)}</Table.Cell>
                    <Table.Cell>
                        <p style={ c.percent_change_1h > 0 ? s.green : s.red }>
                            <Icon style={s.chevron} name={ c.percent_change_1h > 0 ? 'chevron up' : 'chevron down'}/> 
                            { Math.abs(c.percent_change_1h) }%
                        </p>
                    </Table.Cell>
                    <Table.Cell>
                        <p style={ c.percent_change_24h > 0 ? s.green : s.red }>
                            <Icon style={s.chevron} name={ c.percent_change_24h > 0 ? 'chevron up' : 'chevron down'}/> 
                            { Math.abs(c.percent_change_24h) }%
                        </p>
                    </Table.Cell>
                    <Table.Cell>
                        <p style={ c.percent_change_7d > 0 ? s.green : s.red }>
                            <Icon style={s.chevron} name={ c.percent_change_7d > 0 ? 'chevron up' : 'chevron down'}/> 
                            { Math.abs(c.percent_change_7d) }%
                        </p>
                    </Table.Cell>
                </Table.Row>
            );
        })
    }

    render() {
        return (
            <div>
                <Table celled inverted>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Rank</Table.HeaderCell>
                            <Table.HeaderCell>Coin</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Market Cap</Table.HeaderCell>
                            <Table.HeaderCell>% (1H)</Table.HeaderCell>
                            <Table.HeaderCell>% (1D)</Table.HeaderCell>
                            <Table.HeaderCell>% (1W)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { this.props.data.length > 0 ? this.renderTable() : <div>Loading</div> }
                    </Table.Body>
                </Table>
            </div>
        );
    }
}