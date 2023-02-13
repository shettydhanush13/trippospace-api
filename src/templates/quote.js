const quote = req => {
    const html = `<tr>
      <td class="topCell" style="text-align: left;">
        <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: left; width:inherit; max-width: 640px; display: inline-table;"
        border="0" align="left" width="640">
          <tr>
            <td style="padding-bottom:10px;">
              <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: left; width:100%; background:#fff; table-layout: fixed;"
              border="0" align="left">
                <tr>
                    <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:10px 30px 30px;text-align: center">QUOTE RECEIVED</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0px 25px 30px 25px;">QUOTE REQUESTS</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">DESTINATION : <b>${req.destination.toUpperCase()}</b></td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">DEPARTURE CITY : <b>${req.departure.toUpperCase()}</b></td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">DATE : <b>${req.time.toUpperCase()}</b></td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">DURATION : ${req.days} day${req.days > 1 ? "s" : ""}</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.travelers === 1 ? "TRAVELER" : "TRAVELERS"} :  ${req.travelers}</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:10px 25px 30px 25px;">CUSTOMER DETAILS</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">PHONE : ${req.phone}</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">MAIL : ${req.email}</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:20px 25px 10px 25px; text-align: center;">Our travel experts will get back to you soon with the best options. Thank you for choosing Trippospace.</td>
                </tr>                                    
              </table>
              </td>
          </tr>
        </table>
      </td>
    </tr>` 
    return html
}

module.exports = { quote }