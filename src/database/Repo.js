import mongoose from 'mongoose'

const repoSchema = mongoose.Schema({
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
        required: true
    },
    languages: [String],
})

repoSchema.index({
    name: 1,
    starredBy: 1,
})

const repoModel = repoModel || mongoose.model('repo', repoSchema)
export default repoModel
