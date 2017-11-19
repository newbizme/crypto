import React, { Component } from 'react';
import axios from 'axios';

import { Button, Header, Icon, Modal, Dropdown,
    Checkbox, Input, Message, Table, Divider } from 'semantic-ui-react';

import Auth from '../../modules/auth';

const acceptedExchanges = [
    { key: 'binance', text: 'Binance', value: 'binance' },
    { key: 'gemini', text: 'Gemini', value: 'gemini' },
    { key: 'kraken', text: 'Kraken', value: 'kraken' },
    { key: 'poloniex', text: 'Poloniex', value: 'poloniex' },
];

const s = {
    container: {

    }
}

export default class ImportTxn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            error: false,
            apiKey: undefined,
            secret: undefined,
            passphrase: undefined,
        }
    }

    handleOpen = () => {
        this.setState({ modalOpen: true })
    }

    handleCancel = () => {
        this.setState({ modalOpen: false })
    }

    handleSave = () => {
        // Perform safe stuff
        // ... 

        this.setState({ modalOpen: false })
        this.props.onRefresh();
    }

    handleExchangeSelection = (e, data) => {
        this.setState({ exchange: data.value})
    }

    handleApiKeyChange = (e, data) => {
        this.setState({ apiKey: data.value });
    }

    handleApiSecretChange = (e, data) => {
        this.setState({ secret: data.value });
    }

    handlePassphraseChange = (e, data) => {
        this.setState({ passphrase: data.value });
    }

    handleAddExchange = () => {
        let exchange = {
            exchange: this.state.exchange,
            apikey: this.state.apiKey,
            apisecret: this.state.secret,
            password: this.state.passphrase
        }
        console.log("Add>", exchange);
        // Test new connection

        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
    
        axios.post('/user/v1/auth/test', exchange, config)
            .then((response) => {
                console.log(response);
                    this.props.addExchange(exchange);
                    this.setState({ error: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: true });
            })
    }

    handleDeleteExchange = (ex) => {
        this.props.deleteExchange(ex._id);
    }

    renderExchangeConnections = () => {
        if (!this.props.userExchanges) {
            return ( <Table.Row></Table.Row> );
        }
        return this.props.userExchanges.map((ex) => {
            return (
                <Table.Row>
                    <Table.Cell>{ ex.exchange }</Table.Cell>
                    <Table.Cell>{ ex.apikey }</Table.Cell>
                    <Table.Cell>{ ex.created }</Table.Cell>
                    <Table.Cell>
                        <Button 
                            icon='cancel'
                            negative
                            onClick={this.handleDeleteExchange.bind(this, ex)}
                            >
                        </Button>
                    </Table.Cell>
                </Table.Row>
            )
        })
    }

    render() {
        return (
            <Modal 
                trigger={<Button 
                            disabled={!Auth.isUserAuthenticated()}
                            content='Import Txns' 
                            icon='exchange'
                            labelPosition='left'
                            positive
                            onClick={this.handleOpen}>
                        </Button>}
                open={this.state.modalOpen}
                onClose={this.handleCancel}
                    
                size='small'>
                <Header icon='list layout' content='Import Transactions From Exchanges' />
                <Modal.Content>
                    
                    <Dropdown
                        button floating labeled closeOnChange selection search
                        className='icon'
                        icon='exchange'
                        options={acceptedExchanges}
                        onChange={this.handleExchangeSelection.bind(this)}
                        placeholder='Exchange'
                    />
                    <br />
                    <Input
                        iconPosition='left'
                        placeholder='API Key'
                        onChange={this.handleApiKeyChange.bind(this)}
                        >
                        <Icon name='key' />
                        <input />
                    </Input>
                    <br />
                    <Input
                        iconPosition='left'
                        placeholder='API Secret'
                        onChange={this.handleApiSecretChange.bind(this)}
                        >
                        <Icon name='spy' />
                        <input />
                    </Input>
                    <br />
                    <Input
                        iconPosition='left'
                        placeholder='Passphrase (if required)'
                        onChange={this.handlePassphraseChange.bind(this)}
                        >
                        <Icon name='lock' />
                        <input />
                    </Input>

                    <br />
                    <Button 
                        disabled={!this.state.apiKey || !this.state.secret || !this.state.exchange}
                        content='Add' 
                        icon='add'
                        labelPosition='left'
                        positive
                        onClick={this.handleAddExchange}>
                    </Button>

                    { this.state.error && 
                        <Message negative>
                            <Message.Header>
                                Connection to exchange failed
                            </Message.Header>
                            <Message.List items={['Is the API key configured for Read access?', 'Does the exchange require a passphrase?', 'Are the keys pasted fully and in the correct order?']} />
                        </Message>
                    }

                    <Divider />

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Exchange</Table.HeaderCell>
                                <Table.HeaderCell>ApiKey</Table.HeaderCell>
                                <Table.HeaderCell>Created</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.renderExchangeConnections() }
                        </Table.Body>
                    </Table>

                    <Message 
                        hidden={ this.state.error ? false : true }
                        negative>
                        <Message.Header>Please fill in all fields</Message.Header>
                    </Message>

                </Modal.Content>
                <Modal.Actions>
                <Button basic color='red' inverted onClick={this.handleCancel}>
                    <Icon name='remove' /> Cancel
                </Button>
                <Button color='green' inverted onClick={this.handleSave}>
                    <Icon name='checkmark' /> Done
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
