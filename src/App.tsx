// import React from 'react';
import './App.css';
import Card from './components/Card';
import { ArrayOfStringObj, CardType, SearchResult } from "./types";
import { useEffect, useState } from 'react';
import searchIcon from './assets/search.svg';
import Logo from './assets/logo.svg';
import { debounce } from './utils';

export default function App() {

    const [searchResults, setSearchResults] = useState([] as SearchResult[]);
    let cards: CardType[] = [
        {title:"Beijing faces 'most severe Covid test' amid deaths", description:"Three deaths have been reported in Beijing where cases have been rising despite China's strict zero-Covid policy."},
        {title:"Kosovo flare-up fears over car number plate row", description:"Talks at the EU fail to settle a row over Serbian number plates, fuelling Kosovo violence fears."},
        {title:"Plan to India beam solar energy wirelessly from space", description:"The European Space Agency is considering the 'Solaris Initiative' plan to collect solar energy in orbit and beam electricity back to Earth."},
        {title:"India", description:"5th largest economy in the world. Which is also the fastest growing large economy in the world."},
        {title:"Australia make superb start against England in final ODI", description:"Follow live text and BBC Radio 5 Sports Extra commentary as England face Australia in the third of three one-day international in Melbourne."},
        {title:"Plastic Money", description:"Credit cards must be used with extra caution."},
    ];

    function add() {
        console.log("adding...");
    }

    /**
     * adds the indexes of letters in the search string 
     * found in the text each text in the array.
     * sorts results according to the number of whole words found.
     * @param searchPhrase The substring to search for.
     */
    function search(searchPhrase: string, textArr?: ArrayOfStringObj) {
        searchPhrase = searchPhrase.toLowerCase();
        (cards as SearchResult[]).forEach(card => {
            card.indexes = [];
            card.wholeWordsFound = 0;
        });
        searchPhrase.split(" ").forEach(word => searchWord(word));
        setSearchResults((cards as SearchResult[])
            .filter(x => !x.indexes.includes(0))
            .sort()
        );
    }

    function searchWord(word: string) {
        for (let index = 0; index < cards.length; index++) {
            const card = cards[index] as SearchResult;
            if(!word) {
                continue;
            }
            let text = (card.title+' '+card.description).toLowerCase();
            if(text.includes(word)) {
                card.indexes = card.indexes.concat(Array.from(new Array(word.length), (x, i) => i + text.indexOf(word) + 1));
                card.wholeWordsFound += 1;
                continue;
            }
            let searchIndex = 0;
            for (let index = 0; index < word.length; index++) {
                const letter = word[index];
                searchIndex = 1 + text.indexOf(letter,searchIndex);
                if(searchIndex > 0) {
                    card.indexes.push(searchIndex);
                } else {
                    card.indexes.push(0);
                    break;
                }
            }
        }
    }

    useEffect(() => {
        search("");
    },[]);

    return (
        <div className="App">
            {/* <TopBar /> */}
            <div className="top-bar">
                <img className='icon' src={Logo} alt="Keval's Blogs"/>
                <div className="search-parent">
                    <input className="searchbox" spellCheck="false" type="text" placeholder="Search" onChange={(e) => debounce(500, search, e.target.value)} />
                    <div className="search-icon-container"><img style={{cursor: 'pointer'}} src={searchIcon} /></div>
                </div>
                <div className="addbox" onClick={add}><span style={{position: 'relative', top: '-12px'}}>Add </span><span style={{position: 'relative', top: '-10px', fontSize: '27px'}}>+</span></div>
            </div>
            <div className='row'>
                {
                    searchResults.length>0
                    ? searchResults.map((card, index) =>
                        <Card key={index} title={card.title} description={card.description} indexes={card.indexes} />
                    )
                    : <div>No Search Results Found.</div>
                }
            </div>
        </div>
    );
}
