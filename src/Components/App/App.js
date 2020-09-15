import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

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
                id: "other pk"

                }
            ],
        }
    }

    render() {
      return (
        <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
            {/*<!-- Add a SearchBar component --> */}
                <div className="App-playlist">
                    <SearchResults searchResults={this.state.searchResults}
                    />
                     {/*<!-- Add a SearchResults component -->*/}
                     {/*<!-- Add a Playlist component -->*/}
                </div>
            </div>

        </div>
      );
     }
}


