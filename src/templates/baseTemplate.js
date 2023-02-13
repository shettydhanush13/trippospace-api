const baseTemplate = (template) => {
    let base = `
    <body bgcolor="#E1E1E1" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
        <center style="background-color:#E1E1E1;">
        	<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;">
            	<tr>
                	<td align="center" valign="top" id="bodyCell">
                        <table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailHeader">
                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="10" cellspacing="0" width="500" class="flexibleContainer">
                                                    <tr>
                                                        <td valign="top" width="500" class="flexibleContainerCell">
                                                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="left" valign="middle" id="invisibleIntroduction" class="flexibleContainerBox" style="display:none !important;">
                                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%;">
                                                                            <tr>
                                                                                <td align="left" class="textContent">
                                                                                    <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;"></div>
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
                                </td>
                            </tr>
                        </table>

                    	<table bgcolor="#FFFFFF"  border="0" cellpadding="0" cellspacing="0" width="500" id="emailBody">
							<tr>
                            	<td align="center" valign="top">
                                	<table border="0" cellpadding="0" cellspacing="0" width="100%" style="color:#FFFFFF;" bgcolor="#E14255">
                                    	<tr>
                                        	<td align="center" valign="top">
                                            	<table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                                	<tr>
                                                        <td align="center" valign="top" class="textContent" style="display:flex">
                                                            <div style="margin:15px 25px">
                                                                <img style="width:60px" src="https://pbs.twimg.com/profile_images/1133664975925403650/VK3WD48x_400x400.jpg"/>
                                                            </div>
                                                            <div>
                                                                <h1 style="color:#FFFFFF;line-height:100%;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:normal;margin-bottom:2px;text-align:center;">TRIPPOSPACE COMMUNITY</h1>
                                                                <h1 style="color:#FFFFFF;line-height:100%;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:5px;text-align:center;">one space for all your trips</h1>
                                                            </div>      
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                                    <tr>
                                                        <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" valign="top">
                                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                            <tr>
                                                                              ${template}
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
                                </td>
                            </tr>

                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                                    <tr>
                                                        <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" valign="top">
                                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                            <tr align="center" style="display:flex;justify-content:center">
                                                                              <td style="width:25%;">
                                                                                  <a href="https://www.facebook.com/trippospace/"
                                                                                  target="_blank">
                                                                                  <img src="https://cdn-s3.touchofmodern.com/email/social-icon-facebook.png" width="25"
                                                                                  height="25" alt="Facebook"/>
                                                                                  </a>
                                                                              </td>
                                                                              <td style="width:25%;">
                                                                                  <a href="https://www.instagram.com/trippospace/"
                                                                                  target="_blank">
                                                                                  <img src="https://cdn-s3.touchofmodern.com/email/social-icon-instagram.png" width="25"
                                                                                  height="22" alt="Instagram"/>
                                                                                  </a>
                                                                              </td>
                                                                              <td style="width:25%;">
                                                                                  <a href="https://www.youtube.com/channel/UCNHrjKwSe-JSe2o9EKyZZmQ?view_as=subscriber" target="_blank">
                                                                                  <img src="https://cdn-s3.touchofmodern.com/doorbuster/yt.png" width="25" height="25"
                                                                                  alt="Youtube"/>
                                                                                  </a>
                                                                              </td>
                                                                              <td style="width:25%;">
                                                                                  <a href="https://twitter.com/trippospace"
                                                                                  target="_blank">
                                                                                  <img src="https://cdn-s3.touchofmodern.com/email/social-icon-twitter.png" width="25"
                                                                                  height="25" alt="Twitter"/>
                                                                                  </a>
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
                                </td>
                            </tr>
                        </table>
                       
                        <table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailFooter">
                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">
                                                <!-- FLEXIBLE CONTAINER // -->
                                                <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                                    <tr>
                                                        <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td valign="top" bgcolor="#E1E1E1">
                                                                        <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;">
                                                                            <div>Copyright &#169; 2021 <a href="https://www.trippospace.com" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">Trippospace Travel Solutions PVT LTD</span></a>. All&nbsp;rights&nbsp;reserved.</div>
                                                                        </div>
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
                    </td>
                </tr>
            </table>
        </center>
    </body>`
    return base
}

module.exports = { baseTemplate }