const Users = require('../models/users');
const Places = require('../models/places')

const getPlaceDetails = async (places) => {
    let details = []
    for(let i=0; i<places.length; i++){
        let place = places[i]
        await Places.findOne({_id : place}, (err,placeInfo) => {
            if(err) console.log(err)
            else details.push(placeInfo.title)
        })
    } return details
}

const bookmarkInfo = () => {
    let list = []    
    Users.find({}, async (err,user) => {
        if(err) console.log(err)
        else {
            for(let i=0; i<user.length; i++){
                let u = user[i]
                u.bucketList.length > 0 &&
                list.push({
                    name : `${u.first_name} ${u.last_name}`,
                    id : u._id,
                    email : u.email,
                    phone : u.phone,
                    bucketList : await getPlaceDetails(u.bucketList)
                })
            }
            console.log(list)
        }
    })
}

module.exports = {
    bookmarkInfo
};
