import mongoose from 'mongoose'

class Database {
    connect = async () => {
        mongoose.Promise = global.Promise

        // Database connection
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/brainn')
            console.log('> database connection succeed!')
            return mongoose.connection
        } catch (e) {
            throw new Error(e.msg)
        }


    }

    disconnect = async () => {
        try {
            await mongoose.connection.close()
            console.log('> database disconnected!')

        } catch (e) {
            throw new Error(e.msg)
        }
    }

}

export default new Database()
