
// console.log("kcdhiuhvuidsbvisb");
const addLinkedinUser = (LdUser) => ({ id,
    provider,
    firstName,
    lastName,
    profilePhoto,
    displayName }) => {
    const user = new LdUser({
        id,
        provider,
        firstName,
        lastName,
        profilePhoto,
        displayName, source: "linkedin"
    })
    return user.save()
}

const getFbUsers = (LdUser) => () => {
    return LdUser.find({})
}

const getUserBydisplayName = (LdUser) => async ({ displayName }) => {
    return await LdUser.findOne({ displayName })
}

module.exports = (LdUser) => {
    return {
        addLinkedinUser: addLinkedinUser(LdUser),
        getFbUsers: getFbUsers(LdUser),
        getUserBydisplayName: getUserBydisplayName(LdUser)
    }
}