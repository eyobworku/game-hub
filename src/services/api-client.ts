import axios from "axios";

export default axios.create({
    baseURL: 'https://api.rawg.io/api',
    params: {
        key: 'ecaa4160d89348018840560b94a57595'
    }
})