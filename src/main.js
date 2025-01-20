import express from 'express'
import { engine } from "express-handlebars"
import { ydl } from './ydl.js'
import config from "config"

const app = express()
const PORT = config.get('PORT') || 5000

app.engine('handlebars', engine())

app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))

let viewData = {
    videoId: '',
    output: false
}

app.get('/', (req, res) => {
    res.render('index', viewData)
})

app.post('/', async (req, res) => {
    const videoId = req.body.videoId
    viewData.videoId = videoId;

    try {
        const output = await ydl.downdloadMp3(videoId)
        viewData.output = JSON.stringify(output, null, 2)
        res.render('index', viewData)
    } catch (e) {
        viewData.error = e.message
        res.render('index', viewData)
    }
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}: http://localhost:${PORT}`))
