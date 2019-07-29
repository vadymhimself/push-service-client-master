'use strict'
import * as requestPromise from 'request-promise-native'

interface OptionsType {
    host: string
    port: number
    token?: string
}

class Client {
    private host: string = 'localhost'
    private token: string | null = null

    constructor(options: OptionsType | null) {
        if (options) {
            this.initialize(options)
        }
    }

    public initialize(options: OptionsType) {
        if (!options.host || !options.port) {
            throw new Error('Push service initialization error: host or port fields not provided')
        }
        if (!options.host.includes('http')) {
            options.host = `http://${options.host}`
        }
        this.host = options.host
        this.host = `${this.host}:${options.port}`
        if (options.token) {
            this.token = options.token
        }
    }

    public async getHostInfo(): Promise<any> {
        return requestPromise({
            method: 'GET',
            uri: `${this.host}/api/`
        })
    }

    public async send(userToken: string, data: object): Promise<any> {
        if (typeof data !== 'object') {
            throw Error('Push service send: data must be an object!')
        }
        Object.keys(data).forEach(key => {
            if (typeof key !== 'string') {
                throw Error('Push service send: data fields must be only string type!')
            }
        })
        return requestPromise({
            method: 'POST',
            uri: `${this.host}/api/users/${userToken}/notifications`,
            json: true,
            body: data
        })
    }

    public async register(userToken: string, firebaseToken: string): Promise<any> {
        return requestPromise({
            method: 'POST',
            uri: `${this.host}/api/users/${userToken}/tokens`,
            json: true,
            body: {
                token: firebaseToken
            }
        })
    }

    public async unregister(userToken: string, firebaseToken: string): Promise<any> {
        return requestPromise({
            method: 'DELETE',
            uri: `${this.host}/api/users/${userToken}/tokens/${firebaseToken}`,
            json: true
        })
    }

    public createClient(options: OptionsType) {
        return new Client(options)
    }
}

export default new Client(null)
