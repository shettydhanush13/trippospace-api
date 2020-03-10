module.exports = {
    ForgotPassword : function(req,Users,Organizer) {
        return new Promise((resolve, reject) => {
            if(req.body.platform === "user"){
                DB = Users
                query = {
                    email : req.body.mail
                }
            }else{
                DB = Organizer
                query = {
                    "contact.mail" : req.body.mail
                }
            }
            DB.findOne(query, function (err, user) {
                if (user !== null) {
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey("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");
    
                    let code = req.body.platform+user._id+user.password
    
                    var b = new Buffer(code);
                    var resetCode = b.toString('base64');
                    
                    const msg = {
                        to: req.body.mail,
                        from: 'password-reset@trippospace.com',
                        subject: 'LINK TO RESET YOUR PASSWORD',
                        text: 'grow your business with trippospace',
                        html: `<body class="iOSGmailAppfix" style="margin:0; padding:0; background-color:#F2F2F2;">
                        <table id="EmailWrapper" cellpadding="0" cellspacing="0" border="0" align="center"
                        style="background-color: #f2f2f2; border:none; font-size: 0; width:100%">
                          <tr>
                            <td class="topCell" style="text-align: center;">
                              <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:inherit; max-width: 640px; display: inline-table;"
                              border="0" align="center" width="640">
                                <tr>
                                  <td style="padding-bottom:10px;">
                                    <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:100%; background:#fff; table-layout: fixed;"
                                    border="0" align="center">
                                      <tr>
                                        <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;">TRIPPOSPACE COMMUNITY</td>
                                      </tr>
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
                          </tr>
                        </table>
                    
                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="font-size:0; width:300px;">
                          <tr>
                            <td style="width:20%;">
                                <a href="https://www.facebook.com/trippospace/"
                                target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/email/social-icon-facebook.png" width="22"
                                height="22" alt="Facebook"/>
                                </a>
                            </td>
                            <td style="width:20%;">
                                <a href="https://www.instagram.com/trippospace/"
                                target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/email/social-icon-instagram.png" width="22"
                                height="22" alt="Instagram"/>
                                </a>
                            </td>
                            <td style="width:20%;">
                                <a href="https://www.youtube.com/channel/UCNHrjKwSe-JSe2o9EKyZZmQ?view_as=subscriber" target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/doorbuster/yt.png" width="22" height="22"
                                alt="Youtube"/>
                                </a>
                            </td>
                            <td style="width:20%;">
                                <a href="https://twitter.com/trippospace"
                                target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/email/social-icon-twitter.png" width="22"
                                height="22" alt="Twitter"/>
                                </a>
                            </td>
                          </tr>
                        </table>     
                      </body>`
                      };
            
                      sgMail.send(msg);
                      resolve({ message : "Reset link sent" })
                } else {
                      resolve({ error: "Use regestered email" })
                }
            })
        });
    },

    BookNotification : function(req) {
        return new Promise((resolve, reject) => {
            
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey("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");
                    const msg = {
                        to: "shettydhanush13@gmail.com",
                        from: 'Important-Trippospace@trippospace.com',
                        subject: `NEW BOOKING FOR  - ${req.body.title}`,
                        text: 'grow your business with trippospace',
                        html: `<body class="iOSGmailAppfix" style="margin:0; padding:0; background-color:#F2F2F2;">
                        <table id="EmailWrapper" cellpadding="0" cellspacing="0" border="0" align="center"
                        style="background-color: #f2f2f2; border:none; font-size: 0; width:100%">
                          <tr>
                            <td class="topCell" style="text-align: center;">
                              <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:inherit; max-width: 640px; display: inline-table;"
                              border="0" align="center" width="640">
                                <tr>
                                  <td style="padding-bottom:10px;">
                                    <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:100%; background:#fff; table-layout: fixed;"
                                    border="0" align="center">
                                    <tr>
                                        <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;">TRIPPOSPACE COMMUNITY</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.title}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.date}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.quantity} Travelers</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">CUSTOMER DETAILS : </td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.phone | req.body.customer.mail}</td>
                                    </tr>                                    
                                    </table>
                                   </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                    
                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="font-size:0; width:300px;">
                          <tr>
                            <td style="width:25%;">
                                <a href="https://www.facebook.com/trippospace/"
                                target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/email/social-icon-facebook.png" width="22"
                                height="22" alt="Facebook"/>
                                </a>
                            </td>
                            <td style="width:25%;">
                                <a href="https://www.instagram.com/trippospace/"
                                target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/email/social-icon-instagram.png" width="22"
                                height="22" alt="Instagram"/>
                                </a>
                            </td>
                            <td style="width:25%;">
                                <a href="https://www.youtube.com/channel/UCNHrjKwSe-JSe2o9EKyZZmQ?view_as=subscriber" target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/doorbuster/yt.png" width="22" height="22"
                                alt="Youtube"/>
                                </a>
                            </td>
                            <td style="width:25%;">
                                <a href="https://twitter.com/trippospace"
                                target="_blank">
                                <img src="https://cdn-s3.touchofmodern.com/email/social-icon-twitter.png" width="22"
                                height="22" alt="Twitter"/>
                                </a>
                            </td>
                          </tr>
                        </table>     
                      </body>`};
            
                      sgMail.send(msg);
                      resolve({ message : "Reset link sent" })
               
        });
    }
} 