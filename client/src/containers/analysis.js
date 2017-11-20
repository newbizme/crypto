import React, { Component } from 'react';

class Analysis extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        /*
        const script = document.createElement('script');

        script.setAttribute(
          'src', 
          'https://s3.tradingview.com/tv.js');

        document.body.appendChild(script);

        script.addEventListener('load', () => {
            new TradingView.widget({
                "autosize": true,
                "symbol": "COINBASE:ETHUSD",
                "interval": "D",
                "timezone": "America/New_York",
                "theme": "Dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "rgba(66, 66, 66, 1)",
                "enable_publishing": true,
                "withdateranges": true,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "hideideas": true,
                "studies": [
                  "MACD@tv-basicstudies",
                  "MASimple@tv-basicstudies",
                  "StochasticRSI@tv-basicstudies",
                  "Volume@tv-basicstudies"
                ]
              });
        });
        */
      }

    render() {
        return (
            <div></div>
        )
    }
}

export default Analysis;

/*
<!-- TradingView Widget BEGIN -->
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
new TradingView.widget({
  "autosize": true,
  "symbol": "COINBASE:ETHUSD",
  "interval": "D",
  "timezone": "America/New_York",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "rgba(66, 66, 66, 1)",
  "enable_publishing": true,
  "withdateranges": true,
  "hide_side_toolbar": false,
  "allow_symbol_change": true,
  "hideideas": true,
  "studies": [
    "MACD@tv-basicstudies",
    "MASimple@tv-basicstudies",
    "StochasticRSI@tv-basicstudies",
    "Volume@tv-basicstudies"
  ]
});
</script>
<!-- TradingView Widget END -->
*/

/*
class Form extends Component {

  componentDidMount() {
    const script = document.createElement('script');
    script.setAttribute(
      'src', 
      'https://fs22.formsite.com/include/form/embedManager.js?1605047845');
    script.addEventListener('load', () => {
      EmbedManager.embed({
        key: "key",
        width: "100%",
        mobileResponsive: true
      });
    });
    document.body.appendChild(script);
  }

  render() {
    return (
      <div>
        <div id="apply_form">
          <a name="form" id="formAnchor"></a>
        </div>
      </div>
    );
  }
}
*/