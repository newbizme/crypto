import React, { Component } from 'react';
import axios from 'axios';

import { Button, Header, Icon, Modal, Dropdown,
        Checkbox, Input, Message } from 'semantic-ui-react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import Auth from '../../modules/auth';

const s = {
    container: {

    },
    datetimePicker: {
        color: '#fff'
    }
};

const currencyPairs = [
    { key: 'BTC/USD', text: 'BTC/USD', value: 'BTC/USD' },
    { key: 'ETH/USD', text: 'ETH/USD', value: 'ETH/USD' },
    { key: 'ETH/BTC', text: 'ETH/BTC', value: 'ETH/BTC' },
    { key: 'DASH/USD', text: 'DASH/USD', value: 'DASH/USD' },
    { key: 'DASH/BTC', text: 'DASH/BTC', value: 'DASH/BTC' },
    { key: 'DASH/ETH', text: 'DASH/ETH', value: 'DASH/ETH' },
    { key: 'GNT/ETH', text: 'GNT/ETH', value: 'GNT/ETH' },
    { key: 'GNT/BTC', text: 'GNT/BTC', value: 'GNT/BTC' },
    { key: 'LTC/USD', text: 'LTC/USD', value: 'LTC/USD' },
    { key: 'LTC/BTC', text: 'LTC/BTC', value: 'LTC/BTC' },
    { key: 'LTC/ETH', text: 'LTC/ETH', value: 'LTC/ETH' },
    { key: 'NEO/USD', text: 'NEO/USD', value: 'NEO/USD' },
    { key: 'NEO/BTC', text: 'NEO/BTC', value: 'NEO/BTC' },
    { key: 'NEO/ETH', text: 'NEO/ETH', value: 'NEO/ETH' },
    { key: 'XMR/USD', text: 'XMR/USD', value: 'XMR/USD' },
    { key: 'XMR/BTC', text: 'XMR/BTC', value: 'XMR/BTC' },
    { key: 'XMR/ETH', text: 'XMR/ETH', value: 'XMR/ETH' },
    { key: 'ZEC/USD', text: 'ZEC/USD', value: 'ZEC/USD' },
    { key: 'ZEC/BTC', text: 'ZEC/BTC', value: 'ZEC/BTC' },
    { key: 'ZEC/ETH', text: 'ZEC/ETH', value: 'ZEC/ETH' },
];

let currencyPairsNew = [];

const actionOptions = [
    { key: 'buy', text: 'Buy', value: 'buy' },
    { key: 'sell', text: 'Sell', value: 'sell' }
];

const exchangeOptions = [];

export default class AddTxn extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            modalOpen: false,
            exchange: undefined,
            tradingPair: undefined,
            action: undefined,
            quantity: 0,
            price: 0,
            date: null,
            time: null,
            error: false,
            currencyOptions: []
        };
    }

    componentWillMount() {
        exchanges.map((ex) => {
            exchangeOptions.push({
                key: ex,
                text: ex,
                value: ex
            })
        })
    }

    handleOpen = () => {
        this.setState({ 
            modalOpen: true
        });
    }

    handleCancel = () => {
        console.log('cancel');
        this.setState({ modalOpen: false });
    }

    handleSave = () => {

        // Validate data is correct
        const { tradingPair, action, quantity, price, date, time } = this.state;

        if ( !tradingPair || !action || quantity===0 || !time || !date ) {
            this.setState({ error: true });
        } else {
            this.compileTxnObject();
            // this.setState({ modalOpen: false });
        }  
    }

    compileTxnObject = () => {
        let { tradingPair, action, quantity, price, date, time, exchange } = this.state;

        const created = new Date(); // create new Date() for now

        // Parse date and time for txn timestamp
        let parseDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        let parseTime = time.getHours() + ":" + time.getMinutes() + ":00";
        let datetime = new Date(parseDate + " " + parseTime);
        // Y-m-d H:i:s format

        // Cleanse symbol from USDT to USD if needed
        let pair = tradingPair.split('/');
        if (pair[1] && pair[1] === 'USDT') { pair[1] = 'USD'; tradingPair = pair.join('/'); }

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

        let data = {
            datetime: datetime.toISOString(),
            timestamp: Date.parse(datetime),
            side: action.toLowerCase(),
            symbol: tradingPair,
            amount: quantity,
            price: price,
            exchange: exchange
        };
        console.log("TXN:", data);
        this.props.addTxn(data);
        this.setState({ modalOpen: false });
    }

    handleExchangeSelection = (e, data) => {
        // this.setState({ exchange: data.value });
    
        
        let currencyOptions = [];
        axios.get('/api/v1/symbols/' + data.value)
            .then((response) => {
                for (var key in response.data) {
                    // Ensure symbol has a "/" sign, or else i can't split into currency / base 
                    if (response.data[key].symbol.indexOf('/') > 0) {
                        currencyOptions.push({
                            key: response.data[key].symbol,
                            value: response.data[key].symbol,
                            text: response.data[key].symbol
                        })
                    } else if (response.data[key].base && response.data[key].quote) {
                        currencyOptions.push({
                            key: response.data[key].base + '/' + response.data[key].quote,
                            value: response.data[key].base + '/' + response.data[key].quote,
                            text: response.data[key].base + '/' + response.data[key].quote
                        })
                    }
                }
                
                this.setState({ exchange: data.value, currencyOptions: currencyOptions })
            })
        
    }

    handleCurrencySelection = (e, data) => {
        this.setState({ tradingPair: data.value });
    }

    handleActionSelection = (e, data) => {
        this.setState({ action: data.value });
    }

    handleQuantityChange = (e, data) => {
        this.setState({ quantity: data.value });
    }

    handlePriceChange = (e, data) => {
        this.setState({ price: data.value });
    }

    handleDateSelection = (e, date) => {
        this.setState({ date: date });
    }
    handleTimeSelection = (e, time) => {
        this.setState({ time: time });
    }

    render() {
        // const { ticker } = this.props;

        return (
            <Modal 
                trigger={<Button 
                            disabled={!Auth.isUserAuthenticated()}
                            content='New Txn' 
                            icon='add'
                            labelPosition='left'
                            positive
                            onClick={this.handleOpen}>
                        </Button>}
                open={this.state.modalOpen}
                onClose={this.handleCancel}
                    
                size='small'>
                <Header icon='archive' content='Add New Transaction' />
                <Modal.Content>
                    <Dropdown 
                        placeholder='Exchange' 
                        fluid search selection 
                        options={exchangeOptions} 
                        onChange={this.handleExchangeSelection.bind(this)}
                        />
                    <Dropdown
                        button floating labeled closeOnChange selection search
                        className='icon'
                        icon='exchange'
                        options={this.state.currencyOptions}
                        onChange={this.handleCurrencySelection.bind(this)}
                        placeholder='Trading Pair'
                    />
                    <Dropdown
                        button floating labeled closeOnChange selection
                        className='icon'
                        icon='currency'
                        options={actionOptions}
                        onChange={this.handleActionSelection.bind(this)}
                        placeholder="Buy/Sell"
                    />
                    <br />
                    <Input
                        iconPosition='left'
                        placeholder='Quantity'
                        onChange={this.handleQuantityChange.bind(this)}
                        >
                        <Icon name='diamond' />
                        <input />
                    </Input>
                    <Input
                        iconPosition='left'
                        placeholder='Exchange Price'
                        onChange={this.handlePriceChange.bind(this)}
                        >
                        <Icon name='payment' />
                        <input />
                    </Input>
                    <br />
                    <DatePicker
                        hintText="Trade Date"
                        value={this.state.date}
                        onChange={this.handleDateSelection}
                        textFieldStyle={s.datetimePicker}
                        style={s.datetimePicker}
                        />
                    <TimePicker
                        format="24hr"
                        hintText="Trade Time"
                        autoOk={true}
                        value={this.state.time}
                        onChange={this.handleTimeSelection}
                        textFieldStyle={s.datetimePicker}
                        style={s.datetimePicker}
                        />

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


const exchanges = [
    "_1broker",
    "_1btcxe",
    "acx",
    "allcoin",
    "anxpro",
    "binance",
    "bit2c",
    "bitbay",
    "bitcoincoid",
    "bitfinex",
    "bitfinex2",
    "bitflyer",
    "bithumb",
    "bitlish",
    "bitmarket",
    "bitmex",
    "bitso",
    "bitstamp",
    "bitstamp1",
    "bittrex",
    "bl3p",
    "bleutrade",
    "btcbox",
    "btcchina",
    "btcexchange",
    "btcmarkets",
    "btctradeua",
    "btcturk",
    "btcx",
    "bter",
    "bxinth",
    "ccex",
    "cex",
    "chbtc",
    "chilebit",
    "coincheck",
    "coinfloor",
    "coingi",
    "coinmarketcap",
    "coinmate",
    "coinsecure",
    "coinspot",
    "cryptopia",
    "dsx",
    "exmo",
    "flowbtc",
    "foxbit",
    "fybse",
    "fybsg",
    "gatecoin",
    "gateio",
    "gdax",
    "gemini",
    "hitbtc",
    "hitbtc2",
    "huobi",
    "huobicny",
    "huobipro",
    "independentreserve",
    "itbit",
    "jubi",
    "kraken",
    "kuna",
    "lakebtc",
    "liqui",
    "livecoin",
    "luno",
    "mercado",
    "mixcoins",
    "nova",
    "okcoincny",
    "okcoinusd",
    "okex",
    "paymium",
    "poloniex",
    "qryptos",
    "quadrigacx",
    "quoine",
    "southxchange",
    "surbitcoin",
    "therock",
    "tidex",
    "urdubit",
    "vaultoro",
    "vbtc",
    "virwox",
    "wex",
    "xbtce",
    "yobit",
    "yunbi",
    "zaif"
]