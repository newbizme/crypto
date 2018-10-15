import React from 'react';

const s = {
    chartArea: {
        display: 'inline-block',
        color: '#959595',
        textAlign: 'left'
    },
    loadingArea: {
        height: '350px',
        width: '730px',
        display: 'inline-block',
        textAlign: 'center'
    },
    timeMenu: {
        position: 'relative',
        right: '-70px',
        top: '20px',
    },
    container: {
        textAlign: 'center'
    },
}

const HistLineChart = (props) => {
    let data = props.historicalData;
    return (
        <div style={s.chartArea}>
            <Menu inverted secondary size='mini' style={s.timeMenu}>
                <Menu.Item name='day' active={this.state.chartView === 'day'} onClick={this.onSelectChartView.bind(this, 'day')}/>
                <Menu.Item name='month' active={this.state.chartView === 'month'} onClick={this.onSelectChartView.bind(this, 'month')} />
                <Menu.Item name='year' active={this.state.chartView === 'year'} onClick={this.onSelectChartView.bind(this, 'year')} />
            </Menu>
            <LineChart width={730} height={350} data={this.state.coinData.historical[this.state.chartView]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="close" />
                <Tooltip />
                <Line 
                    type="monotone" 
                    dot={false}
                    dataKey="close"
                    name="Price ($)"
                    animationEasing="linear"
                    stroke="#82ca9d" />
            </LineChart>
        </div>
    )
}

export default HistLineChart;