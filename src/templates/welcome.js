const welcome = req => {
    const html = `<tr>
        <td class="topCell" style="text-align: center;">
        <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:inherit; max-width: 640px; display: inline-table;"
        border="0" align="center" width="640">
            <tr>
            <td style="padding-bottom:10px;">
                <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:100%; background:#fff; table-layout: fixed;"
                border="0" align="center">
                <tr>
                    <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;"></td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">TRIP</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.title}</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${formatDate(req.date)}</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">CUSTOMER DETAILS</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.quantity} Slot</td>
                </tr>
                <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.customer.phone} - ${req.customer.email}</td>
                </tr>                                    
                </table>
                </td>
            </tr>
        </table>
        </td>
    </tr>`
    return html
}

module.exports = { welcome }