require("mongoose")
    .connect(process.env.DB_KEY)
    .then(() => {
        console.log("Database Is Connected")
    })
    .catch((error) => {
        console.log(error)
    })