import youtubeDl from "youtube-dl-exec"
import config from "config"

class Ydl {
    constructor() {
        this.ffmpegLocation = config.get('FFMPEG_LOCATION')
        this.output = config.get('MP3_FOLDER')
        this.videoTitle = '';
    }

    async downdloadMp3(videoId) {
        this.videoTitle = await this.getVideoTitle(videoId)
        console.log('Video title', this.videoTitle)
        return await this.youtubeDl(videoId, true)
    }

    async getVideoTitle(videoId) {
        const videoInfo = await this.youtubeDl(videoId, false)
        return videoInfo.title.replaceAll('/', '_')
    }

    async youtubeDl(videoId, downloading) {
        let filename = '';

        let options = {
            ffmpegLocation: this.ffmpegLocation,
            extractAudio: true,
            audioFormat: 'mp3',
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        }

        if (downloading) {
            // downloading
            filename = `${this.videoTitle} ${videoId}.mp3`.trim()
            options.output = `${this.output}/${filename}`.trim()
            console.log('filepath', options.output);
        } else {
            // get title
            options.dumpSingleJson = true
        }

        const output = await youtubeDl('https://www.youtube.com/watch?v=' + videoId, options)/*.then((output) => {
            console.log(output)
            viewData.output = JSON.stringify(output, null, 2)
        })*/

        if (downloading) {
            return filename
        }

        return output;
    }
}

export const ydl = new Ydl()