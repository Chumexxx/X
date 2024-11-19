const signUp = async (req, res) => {
    res.json({
        data: "you have hit the signUp endpoint"
    })
}

module.exports = signUp;

const logIn = async (req, res) => {
    res.json({
        data: "you have hit the logIn endpoint"
    })
}

module.exports = logIn;

const logOut = async (req, res) => {
    res.json({
        data: "you have hit the logOut endpoint"
    })
}

module.exports = logOut;