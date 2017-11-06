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
            return (
                <Table.Row>
                    <Table.Cell>{ txn.timestamp }</Table.Cell>
                    <Table.Cell>{ txn.currency + '/' + txn.base }</Table.Cell>
                    <Table.Cell>{txn.action}</Table.Cell>
                    <Table.Cell>{txn.quantity}</Table.Cell>
                    <Table.Cell>{txn.price}</Table.Cell>
                    <Table.Cell>
                        <Button 
                            icon='trash'
                            negative
                            onClick={this.deleteTxn.bind(this, txn)}
                            >
                        </Button>
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