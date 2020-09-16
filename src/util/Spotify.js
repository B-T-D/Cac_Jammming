

const clientId = 'cb4a93c970ba41b499692575fddae4fa';
const redirectUri = 'http://localhost:3000/';

let accessToken; // The user's access token.


const Spotify = {
    /** getAccessToken:
        Authenticate with Spotify API using Implicit Grant flow. */
    getAccessToken() {
        if (accessToken) { /* If user's access token already set, return its value */
            return accessToken;
        }

        /* Check if the window's current URL matches regexes indicating an access token and an expires-in
            received from the Spotify API: */
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) { /* If both are in the URL... */
            accessToken = accessTokenMatch[1]; /* string.match(regexpr) will return an array; the actual token will be the second element in that array. */
            const expiresIn = Number(expiresInMatch[1]); /* expiration-time value will be the second element */
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
                /* ^ The function to be executed after the timer expires is the one defined inline here
                    with the arrow function syntax. I.e. reset accessToken to empty string. */
            window.history.pushState('Access Token', null, '/'); /* Clear the parameters, so that app doesn't try to grab an expired access token. */
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            console.log(accessUrl);
            window.location = accessUrl; // To redirect.
        }
    },

    /** search:
    * Accepts a search term string input, passes that string to a Spotify API
    * request, then returns the API's response as a list of tracks in JSON
    * format.
    * @param searchTerm {string} : Term to search for.
    * @returns {object} : List of tracks in JSON format.
    */
    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
        /* ^ Spotify API endpoint for Spotify search functionality
            See https://developer.spotify.com/documentation/web-api/reference/search/search/ for querystring syntax etc. */
        return fetch(searchUrl, /* WindowOrWorkerGlobalScope.fetch() can take an omnibus object as a second argument.
            One "arg" packaged in that object can be a headers object. see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch */
            {headers: {
                Authorization: `Bearer ${accessToken}` /* "Bearer" comes from Spotify API's conventions */
            }
        }).then(response => {
            return response.json(); /* i.e. return value of Body.json(), see https://developer.mozilla.org/en-US/docs/Web/API/Body */
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) { /* If the response contains no tracks. Spotify API's response formatting includes a "tracks" key, that's where the name
                "tracks" comes from here. See Spotify API docs at developer URL above. */
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({ /* "items" is a key in the Spotify API response JSON, whose value is an array of objects. */
                /* the following are only a subset of all the properties of "items" as returned by the API; don't need all of them for the React app's purposes: */
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });

    }, /* Comma here because this search() method is a property of a JS object, not a class */

    /** savePlaylist: POST a new playlist to the user's Spotify account, then
    *       POST URI of each track to that playlist.
    * @param {string} : Name of the playlist to create.
    * @param {array}: Array of track URIs for the tracks to put on the playlist.
    */
    savePlaylist(name, tracks) {
        console.log(`tracks is ${tracks}`);
        if (!name || !tracks.length) {
            return; // Stop execution if either arg is missing.
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId= jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                console.log(`playlistId is ${playlistId}`);
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: tracks})
                });
            });
        });
    }
};

export default Spotify;