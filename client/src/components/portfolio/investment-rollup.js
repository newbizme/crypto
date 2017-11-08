import React from 'react';
import { Statistic } from 'semantic-ui-react';

const s = {
    container: {
        textAlign: 'center',
        color: 'green'
    }
}

const InvestmentRollup = (props) => {
    const value = props.value;
    const investment = Math.abs(props.investment);

    const returnsPct = Math.round((( value - investment ) / investment) *100 * 1e2)/1e2;

    return (
        <div>
            <Statistic.Group inverted widths='three' size='small'>
                <Statistic>
                    <Statistic.Value>${value}</Statistic.Value>
                    <Statistic.Label>Net Worth</Statistic.Label>
                </Statistic>
                <Statistic>
                    <Statistic.Value>${investment}</Statistic.Value>
                    <Statistic.Label>Investment</Statistic.Label>
                </Statistic>
                <Statistic>
                    <Statistic.Value>{returnsPct}%</Statistic.Value>
                    <Statistic.Label>Return</Statistic.Label>
                </Statistic>
            </Statistic.Group>
        </div>
    )
}

export default InvestmentRollup;