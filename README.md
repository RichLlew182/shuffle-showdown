# Shuffle Showdown

Shuffle Showdown is an interactive quiz application built using **Node.js**, **Express**, and **EJS** for dynamic content rendering. The application utilizes Spotify's OAuth to access a user's liked songs and generate a fun 10-round quiz based on those tracks.

## Features

- **Dynamic Content**: Uses EJS for rendering dynamic content based on user interactions.
- **Spotify Integration**: Authenticates users through Spotify's OAuth to access their liked songs.
- **Quiz Generation**: Creates a 10-round quiz where each round presents a track and an artist, alongside three related artists as incorrect options.
- **User Interaction**: Engaging user experience with randomized tracks and artists to challenge players.
- **Scoring System**: For every correct answer, users earn 50 points plus the remaining round time, and at the end of the quiz, users receive a total score reflecting their performance.

## How It Works

1. **User Authentication**: The app authenticates users with Spotify to fetch their liked songs.
2. **Quiz Creation**: For each round of the quiz, a track and artist are selected. Three related artists are also fetched to provide incorrect answers, making the quiz challenging.
3. **Gameplay**: Users answer questions based on the artist and track presented in each round.
4. **Scoring**: At the end of the 10 rounds, users are presented with their score, summarizing their performance in the quiz. For every correct answer, users receive 50 points plus the remaining round time.

## Development Mode

The app is currently in development mode. You can test it using the following credentials:

- **Username**: `shuffleshowdown@outlook.com`
- **Password**: `Shuffle123!`

### Important Note

Ensure that you **do not share** your Spotify credentials publicly to maintain account security.

## Getting Started Locally

To clone and run the app locally, follow these steps:

1. **Clone the Repository**:

2. **Install Dependencies**:
   Make sure you have Node.js installed. Then, run the following command to install all necessary packages:
   ```bash
   npm install
   ```

3. **Run the Application**:
   Start the app with the following command:
   ```bash
   node app.js
   ```

4. **Access the App**:
   Open your web browser and navigate to `http://localhost:3000` (or the appropriate port if configured differently).

## Dependencies

- **Node.js**
- **Express**
- **EJS**
- **Spotify Web API**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## Acknowledgments

- Thanks to [Spotify Developer](https://developer.spotify.com) for the API access and documentation.
- Inspired by various music trivia games and quizzes.

---

### Preview Notes
- **Headings** are formatted in bold, and lists are displayed with bullet points.
- **Code blocks** are shown with syntax highlighting.
- Links are clickable (when viewed in a Markdown viewer), enhancing usability.
  
Feel free to ask if you need any adjustments or further assistance!
