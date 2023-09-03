import express from 'express'
import { engine } from "express-handlebars"
import { ydl } from './ydl.js'

const app = express()

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

        //console.log(response.data.data)

        //viewData.images = response.data.data
        res.render('index', viewData)
    } catch (e) {
        viewData.error = e.message
        res.render('index', viewData)
    }
})

app.listen(5000, () => console.log("Server started ..."))