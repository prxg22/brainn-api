import mongoose from 'mongoose'

const repoSchema = mongoose.Schema({ // eslint-disable-line
    name: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        index: true,
    },
    starredBy: {
        type: String,
        required: true
    },
    lastSearch: {
        type: Date,
        required: true,
        default: Date.now()
    },
    languages: [String],
})

repoSchema.index({
    name: 1,
    starredBy: 1,
})

repoSchema.statics.findOrCreate = async function(data) {
    try {
        let repo = await this.findOne(data)
        if (repo) {
            repo.languages = data.languages
            repo.lastSearch = Date.now()
            await repo.save()
        } else repo = await this.create(data)

        return repo

    } catch (e) {
        throw e
    }

}
// models
let repo
try {
    repo = mongoose.model('repo')
} catch (e) {
    repo = mongoose.model('repo', repoSchema)
}

export default repo
