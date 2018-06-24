import mongoose from 'mongoose'

class Database {
    connect = async () => {
        mongoose.Promise = global.Promise

        // Database connection
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017')
        } catch (e) {
            throw new Error(e)
        }

        console.log('> database connection succeed!')
        this.connection = mongoose.connection

        return this.connection
    }

}

export default new Database()
