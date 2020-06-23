
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'
const DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'

export const enum GoogleAuthStatus {
  NotInitialized = 'NotInitialized',
  Initializing = 'Initializing',
  Authorized = 'Authorized',
  NotAuthorized = 'NotAuthorized'
}

class GoogleApi {
  private authStatus: GoogleAuthStatus = GoogleAuthStatus.NotInitialized
  private initPromise: Promise<void> = Promise.resolve()
  private signInStatusListeners: Array<(status: GoogleAuthStatus) => void> = []

  isAuthorized = false

  updateSigninStatus () {
    const user = gapi.auth2.getAuthInstance().currentUser.get()
    const isAuthorized = user.hasGrantedScopes(SCOPE)
    const newAuthStatus = isAuthorized ? GoogleAuthStatus.Authorized
      : GoogleAuthStatus.NotAuthorized
    if (newAuthStatus !== this.authStatus) {
      this.authStatus = newAuthStatus
      this.signInStatusListeners.forEach(f => f(this.authStatus))
    }
  }

  init (): Promise<void> {
    if (this.authStatus === GoogleAuthStatus.NotInitialized) {
      this.authStatus = GoogleAuthStatus.Initializing
      this.initPromise = new Promise((resolve) => {
        const googleApi = document.createElement('script')
        googleApi.setAttribute('src', 'https://apis.google.com/js/api.js')
        googleApi.async = true
        googleApi.defer = true
        googleApi.onload = () => {
          gapi.load('client:auth2', () => {
            gapi.client.init({
              apiKey: 'AIzaSyBn-uF8BPThEM1wM_RSgRDwhaUXqzIwIZU',
              clientId: '885370808419-2alvecmsjdk71pif8khualu68k1q0aqr.apps.googleusercontent.com',
              discoveryDocs: [DISCOVERY_URL],
              scope: SCOPE
            }).then(() => {
              gapi.client.load('sheets', 'v4').then(() => {
                gapi.auth2.getAuthInstance().isSignedIn.listen(() => this.updateSigninStatus())
                this.updateSigninStatus()
                resolve()
              })
            })
          })
        }
        document.head.appendChild(googleApi)
      })
      return this.initPromise
    } else if (this.authStatus === GoogleAuthStatus.Initializing) {
      return this.initPromise
    } else if (this.authStatus === GoogleAuthStatus.NotAuthorized) {
      return this.signOut()
    } else {
      return Promise.resolve()
    }
  }

  async signIn () {
    await this.init()
    return gapi.auth2.getAuthInstance().signIn()
  }

  async signOut () {
    await this.init()
    return gapi.auth2.getAuthInstance().signOut()
  }

  async revoke () {
    await this.init()
    return gapi.auth2.getAuthInstance().disconnect()
  }

  listenForSigninStatus (f: (status: GoogleAuthStatus) => void) {
    this.signInStatusListeners.push(f)
  }

  getAuthStatus () {
    return this.authStatus
  }

  async getSpreadSheet (id: string, range?: string) {
    await this.init()

    const spreadSheet = await gapi.client.sheets.spreadsheets.get({
      includeGridData: true,
      ranges: range,
      spreadsheetId: id // '1YEg7HbuMrQrq5NLl8b1F4MEOK8jnYfnkGQlk8bfwHtM',
    })

    return spreadSheet.result
  }
}

export const googleApi = new GoogleApi()
window.googleApi = googleApi
