# Spotify Recommendation App 

This is a simple Spotify Recommendation App built using Node.js, Express.js, MongoDB, and the Spotify API.

## Overview

The app provides features to search songs, get song details, and generate song recommendations based on specific input criteria. The data for songs, recommendations, and users are stored in MongoDB, which allows users to interact with their song recommendations in various ways such as liking a song, deleting a song from a batch, and so forth.

## Features

- Generate recommendations for songs using artist and song names, genre, and max popularity using Spotify's recommendation algorhythm
- Preview soundbites fetched from the spotify API
- Song liking and removal from likes
- Batch creation and management (A batch is a collection of song recommendations)

## Routes
- router.get('/song/:id', getSongById)
- router.get('/search', searchSong)
- router.get('/:userId/likes', getUserLikes)
- router.get('/:userId/batches', getUserBatches)
- router.get('/:userId/batches/:batchId', getBatchSongs)
- router.post('/:userId/recommendations', getRecs)
- router.post('/signup', createUser)
- router.post('/login', userLogin)
- router.post('/:userId/:songId/like', addToLikes)
- router.delete('/:userId/:songId/like', deleteLike)
- router.delete('/:userId/batch/:batchId', deleteBatch)

## Getting Started

### Prerequisites

- Node.js and NPM installed
- MongoDB setup locally or MongoDB Atlas setup
- Spotify Developer account and API access token

### Installation

1. Clone the repository 
    ```
    git clone https://github.com/<username>/spotify-recommendation-app.git
    ```

2. Change directory to the cloned folder 
    ```
    cd spotify-recommendation-app
    ```

3. Install dependencies 
    ```
    npm install
    ```

4. Create a `.env` file in the root directory and fill it with your own values:
    ```
    PORT=<port number>
    SPOTIFY_CLIENT_ID=<spotify client id>
    SPOTIFY_CLIENT_SECRET=<spotify client secret>
    DB_CONNECTION=<your MongoDB connection string>
    ```

5. Start the server 
    ```
    npm start
    ```

6. Navigate to `http://localhost:<port number>` in your browser to start using the app

## Usage

The app provides various REST APIs to interact with. The details of APIs can be found in the code comments.

## Future Enhancements

- Add an authentication layer
- responsive design with react

## Spotify API Documentation

- https://developer.spotify.com/documentation/web-api