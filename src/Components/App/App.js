import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            searchResults: [
                {name: "myName",
                artist: "myArtist",
                album: "myAlbum",
                id: "myId"},
                {name: "another track in the array",
                artist: "some other artist",
                album: "Yes and no",
                id: "other pk",
                },
                {name: "song that's not initially on the playlist",
                artist: "Billy bob's wagon-wheel fruitbarn",
                album: "Something dumb",
                id: "this item's pk"},
                {name: "track that won't be added",
                artist: "Garply",
                album: "Corge",
                id: "iuoiuoiu"}
            ],

            playlistName: "myHardcodedPlaylistName",
            playlistTracks: [
                {name: "myName",
                artist: "myArtist",
                album: "myAlbum",
                id: "myId"},
                {name: "Initially in playlist but not search results",
                artist: "baz",
                album: "bar",
                id: "thorp",
                }
            ],
        }

        // --- Method Binds ---
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    /* track's type should be JS "object" object */
    addTrack(newTrack) {
        let tracks = this.state.playlistTracks; /* store the previous array */
        if (tracks.find(element => element.id === newTrack.id)) {
            alert(`track "${newTrack.name}" is already on the playlist`);
            return; // Break out of the method if track already on playlist.
        }
        tracks.push(newTrack);
        this.setState({playlistTracks: tracks});
    }

    removeTrack(targetTrack) {
        let tracks = this.state.playlistTracks;
        tracks = tracks.filter(element => element.id != targetTrack.id);
        this.setState({playlistTracks: tracks});
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name})
    }

    /* savePlaylist:
        generates an array of spotify track-URI values (i.e. the
        URIs for Spotify tracks as opposed to other Spotify resources like users
        and artists)
    */
    savePlaylist() {
        let trackURIs = [];
        this.state.playlistTracks.forEach(element => trackURIs.push(element.id));
        Spotify.savePlaylist(this.state.playlistName, trackURIs
        ).then(() => { /* blank out the non-Spotify playlist shown in the app */
            this.setState({
                playlistName: 'NewPlaylist',
                playlistTracks: []
            });
        });
        console.log(`From savePlaylist:\ntrackURIs: ${trackURIs}`);
    }

    /* docstring: search:
        Args:
            searchTerm (string): The term to search for
        Returns:
            TODO
    */
    search(searchTerm) {
        console.log(`[from App.search method]Search term is : ${searchTerm}`);
        Spotify.search(searchTerm)
        .then(results => { /* The search returning from Spotify is an asynchronous event */
            this.setState({searchResults: results})
        })
        console.log(`this.state.searchResults is now \n${this.state.searchResults}`);
    }

    render() {

      return (
        <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
            {/*<!-- Add a SearchBar component --> */}
                <SearchBar
                    onSearch={this.search}
                />
                <div className="App-playlist">
                    <SearchResults
                        searchResults={this.state.searchResults}
                        onAdd={this.addTrack}
                    />
                     <Playlist
                        playlistName={this.state.playlistName}
                        playlistTracks={this.state.playlistTracks}
                        onRemove={this.removeTrack}
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist}
                     />
                </div>
            </div>

        </div>
      );
     }
}


