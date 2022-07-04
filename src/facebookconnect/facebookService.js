
// console.log("kcdhiuhvuidsbvisb");
const addFacebookUser = (FbUser) => ({id, email, firstName, lastName, profilePhoto }) => {
    const user = new FbUser({
        id, email, firstName, lastName, profilePhoto, source: "facebook"
    })
    return user.save()
}

const getFbUsers = (FbUser) => () => {
    return FbUser.find({})
}

const getUserByEmail = (FbUser) => async ({ email }) => {
    return await FbUser.findOne({ email })
}

module.exports = (FbUser) => {
    return {
        addFacebookUser: addFacebookUser(FbUser),
        getFbUsers: getFbUsers(FbUser),
        getUserByEmail: getUserByEmail(FbUser)
    }
}