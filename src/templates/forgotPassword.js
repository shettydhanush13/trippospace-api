const forgotPassword = resetCode => {
    let html = `
    <tr>
        <td class="topCell" style="text-align: center;">
            <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:inherit; max-width: 640px; display: inline-table;"
            border="0" align="center" width="640">
            <tr>
                <td style="padding-bottom:10px;">
                <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:100%; background:#fff; table-layout: fixed;"
                border="0" align="center">
                    <tr>
                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Click on the below link to reset your password.</td>
                    </tr>
                    <tr>
                    <td style="padding: 5px 15px 20px 15px; text-align: center;">
                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="font-family: Gotham, 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:14px; font-weight: 600; text-transform: uppercase; text-align: center; color: #fff; background-color: #e14255; padding:10px 15px; display: inline-table;">
                        <tr>
                            <td>
                            <a href="http://reset-password.trippospace.com/${resetCode}"
                            target="blank" style="text-decoration:none; color:inherit;">RESET PASSWORD</a>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        </td>
    </tr>`
    return html
}

module.exports = { forgotPassword }