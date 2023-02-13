const formatDate = date => {
    const monthindex = parseInt(date.substr(5, 2))
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return (parseInt(date.substr(8, 2)) + " " + month[monthindex - 1])+ " " + date.substr(0,4)
}

const formatPrice = x => {
//   x=x.toString();
//   const lastThree = x.substring(x.length-3);
//   const otherNumbers = x.substring(0,x.length-3);
//   if(otherNumbers != '')
//       lastThree = ',' + lastThree;
//   return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
return x
}

const bookNotification = req => {
    let html = `<tr>
      <td class="topCell" style="text-align: left;">
        <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: center; width:inherit; max-width: 640px; display: inline-table;"
        border="0" align="left" width="640">
          <tr>
            <td style="padding-bottom:10px;">
              <table cellpadding="0" cellspacing="0" style="font-family: 'Gotham SSm A', 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:0px; text-align: left; width:100%; background:#fff; table-layout: fixed;"
              border="0" align="left">
              <tr>
                <td style="font-weight:bold; text-align: center;font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:20px 25px 20px 25px;">YOUR BOOKING FOR ${req.title.toUpperCase()} IS CONFIRMED</td>
              </tr>
              <tr>
                  <td style=" text-align: center;font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 50px 25px;">we will notify you with further updates.</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:25px; color: #2a2a2a; font-weight:bold; padding:0 25px 25px 25px;">BOOKING DETAILS</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">BOOKING ID : #${req.bookingId}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">TRIP TITLE : ${req.title.toLowerCase()}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">DEPARTURE DATE : ${formatDate(req.date).toLowerCase()}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">${req.quantity === 1 ? "TRAVELER" : "TRAVELERS"} : ${req.quantity}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">TOTAL AMOUNT : ₹ ${formatPrice(req.price)}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">PAID : ₹ ${formatPrice(req.paid)}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">PENDING : ₹ ${formatPrice(req.price - req.paid)}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:25px; color: #2a2a2a; font-weight:bold; padding:25px 25px 25px 25px;">TRAVELER DETAILS</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">PHONE : ${req.customer.phone}</td>
              </tr>
              <tr>
                  <td style="font-family:'Helvetica Neue', Helvetica, Arial, 'sans-serif'; font-size:15px; color: #4a494b; padding:0 25px 20px 25px;">MAIL : ${req.customer.email}</td>
              </tr>                                    
              </table>
              </td>
          </tr>
        </table>
      </td>
    </tr>`
    return html
}

module.exports = { bookNotification }