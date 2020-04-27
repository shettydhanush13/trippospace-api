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
    
        const formatDate = (date) => {
            const monthindex = parseInt(date.substr(5, 2))
            const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            return (parseInt(date.substr(8, 2)) + " " + month[monthindex - 1])+ " " + date.substr(0,4)
        }

        const formatPrice = (x) => {
          x=x.toString();
          var lastThree = x.substring(x.length-3);
          var otherNumbers = x.substring(0,x.length-3);
          if(otherNumbers != '')
              lastThree = ',' + lastThree;
          return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        }

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey("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");
        const msg = {
            to: req.body.mail,
            bcc: "trippospace@gmail.com",
            from: 'Booking-Confirmation@trippospace.com',
            subject: `BOOKING CONFORMATION FOR - ${req.body.title.toUpperCase()}`,
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
                            <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;text-decoration:underline;">TRIPPOSPACE COMMUNITY</td>
                        </tr>
                        <tr>
                          <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">YOUR BOOKING FOR ${req.body.title.toUpperCase()} IS CONFIRMED</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">we will notify you with further updates.</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px; text-decoration:underline;">TRIP DETAILS</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Trip title : ${req.body.title.toLowerCase()}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Departure date : ${formatDate(req.body.date).toLowerCase()}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Travelers : ${req.body.quantity}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Total amount : Rs.${formatPrice(req.body.price)}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Amout paid : Rs.${formatPrice(req.body.paid)}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Payment pending : Rs.${formatPrice(req.body.price - req.body.paid)}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;text-decoration:underline;">TRAVELER DETAILS</td>
                        </tr>
                        
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Phone : ${req.body.customer.phone}</td>
                        </tr>
                        <tr>
                            <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Mail : ${req.body.customer.email}</td>
                        </tr>
                        <tr>
                          <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">MANAGE YOUR BOOKINGS AT www.trippospace.com/user/me</td>
                        </tr>                                     
                        </table>
                        </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
        
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="font-size:0; width:300px;">
              <tr style="width:100%;display:flex;justify-content:space-evenly">
                <td>
                    <a href="https://www.facebook.com/trippospace/"
                    target="_blank">
                    <img src="https://img.icons8.com/android/96/000000/facebook.png" width="22"
                    height="22" alt="Facebook"/>
                    </a>
                </td>
                <td>
                    <a href="https://www.instagram.com/trippospace/"
                    target="_blank">
                    <img src="https://img.icons8.com/android/96/000000/instagram.png" width="22"
                    height="22" alt="Instagram"/>
                    </a>
                </td>
                <td>
                    <a href="https://www.youtube.com/channel/UCNHrjKwSe-JSe2o9EKyZZmQ?view_as=subscriber" target="_blank">
                    <img src="https://img.icons8.com/android/96/000000/start.png" width="22" height="22"
                    alt="Youtube"/>
                    </a>
                </td>
                <td>
                    <a href="https://twitter.com/trippospace"
                    target="_blank">
                    <img src="https://img.icons8.com/android/96/000000/twitter.png" width="22"
                    height="22" alt="Twitter"/>
                    </a>
                </td>
                <td>
                    <a href="tel:+918971780778"
                    target="_blank">
                    <img src="https://img.icons8.com/android/96/000000/outgoing-call.png" width="22"
                    height="22" alt="Call"/>
                    </a>
                </td>
              </tr>
            </table>     
          </body>`};
          sgMail.send(msg);
          resolve({ message : "Confirmation mail sent" })     
        });
    },

    ShopNotification : function(req) {
      return new Promise((resolve, reject) => {

                  const sgMail = require('@sendgrid/mail');
                  sgMail.setApiKey("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");
                  const msg = {
                      to: req.body.customer.email,
                      bcc: "trippospace@gmail.com",
                      from: 'ORDER-NOTIFICATION-IMPORTANT@trippospace.com',
                      subject: `BOOKING CONFIRMATION FOR  - ${req.body.title}`,
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
                                      <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;">TRIPPOSPACE SHOP</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">YOUR ORDER FOR - ${req.body.title} IS SUCCESSFUL</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">We will notify you with further updates.</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Color : ${req.body.color.id}</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Quantity : ${req.body.quantity}</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">DELIVERY DETAILS</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.phone} - ${req.body.customer.email}</td>
                                  </tr> 
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.address}</td>
                                  </tr>     
                                  <tr>
                                      <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">Manage/Track your bookings at www.trippospace.com/my-orders</td>
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
  },


  PassportNotification : function(req) {
    return new Promise((resolve, reject) => {

                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey("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");
                const msg = {
                    to: req.body.customer.email,
                    bcc: "trippospace@gmail.com",
                    from: 'ORDER-NOTIFICATION-IMPORTANT@trippospace.com',
                    subject: `BOOKING CONFIRMATION FOR  - ${req.body.title}`,
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
                                    <td style="font-size:20px; font-weight: 600; text-transform: uppercase; color: #252528; padding:20px 25px;">TRIPPOSPACE SHOP</td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">YOUR ORDER FOR - ${req.body.title} IS SUCCESSFUL</td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">We will notify you with further updates.</td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Color : ${req.body.color.id}</td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">Quantity : ${req.body.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">DELIVERY DETAILS</td>
                                </tr>
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.phone} - ${req.body.customer.email}</td>
                                </tr> 
                                <tr>
                                    <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.address}</td>
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
},


    Welcome : function(req) {
        return new Promise((resolve, reject) => {
            
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey("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");
                    const msg = {
                        to: req.body.mail,
                        bcc: "trippospace@gmail.com",
                        from: 'welcome@trippospace.com',
                        subject: `WELCOME TO TRIPPOSPACE`,
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
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">TRIP</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.title}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${formatDate(req.body.date)}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #2a2a2a; font-weight:bold; padding:0 25px 20px 25px;">CUSTOMER DETAILS</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.quantity} Slot</td>
                                    </tr>
                                    <tr>
                                        <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.body.customer.phone} - ${req.body.customer.email}</td>
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
                      resolve({ message : "welcome" })
               
        });
    }
} 