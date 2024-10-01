const  { connect } = require ('mongoose')

module.exports.connectDB = async () => {
    console.log('base de datos conectado')
    return await connect ('mongodb+srv://avacotti:OwFoBf4w6cOlftj4@cluster0.eko90.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}
