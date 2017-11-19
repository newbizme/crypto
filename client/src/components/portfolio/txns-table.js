import React, { Component } from 'react';
import { Icon, Table, Button } from 'semantic-ui-react';

export default class TxnsTable extends Component {
    constructor(props) {
        super(props);
    }

    renderTxns = () => {
        let txns = this.props.txns;
        // FIXIT: Sort Descending
        txns.sort(function(txn1, txn2) {
            // Descending
            return txn2.timestamp - txn1.timestamp
        })

        return txns.map((txn) => {
    /*
        'id':        '12345-67890:09876/54321', // string trade id
        'timestamp':  1502962946216,            // Unix timestamp in milliseconds
        'datetime':  '2017-08-17 12:42:48.000', // ISO8601 datetime with milliseconds
        'symbol':    'ETH/BTC',                 // symbol
        'order':     '12345-67890:09876/54321', // string order id or undefined/None/null
        'type':      'limit',                   // order type, 'market', 'limit' or undefined/None/null
        'side':      'buy',                     // direction of the trade, 'buy' or 'sell'
        'price':      0.06917684,               // float price in quote currency
        'amount':     1.5,                      // amount of base currency
    */
            return (
                <Table.Row>
                    <Table.Cell>{ txn.datetime }</Table.Cell>
                    <Table.Cell>{ txn.symbol }</Table.Cell>
                    <Table.Cell>{txn.side}</Table.Cell>
                    <Table.Cell>{txn.amount}</Table.Cell>
                    <Table.Cell>{txn.price} {txn.symbol.split('/')[1]}</Table.Cell>
                    <Table.Cell>{txn.exchange}</Table.Cell>
                    <Table.Cell>
                        { txn.hasOwnProperty('info') ?  
                        <Button 
                            icon='exchange'
                            primary
                            disabled
                            />
                        :
                        <Button 
                            icon='trash'
                            negative
                            onClick={this.deleteTxn.bind(this, txn)}
                            >
                        </Button>
                        }
                    </Table.Cell>
                </Table.Row>
            );
        })
    }
    
    deleteTxn = (txn) => {
        this.props.deleteTxn(txn._id);
    }

    render() {
        // https://react.semantic-ui.com/collections/table#table-example-sortable - sort later
        return (
            <div>
                <Table celled inverted>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Pair</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Exchange</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { this.props.txns ? this.renderTxns() : <div>No Transactions Yet</div> }
                    </Table.Body>
                </Table>
            </div>
        );
    }
}