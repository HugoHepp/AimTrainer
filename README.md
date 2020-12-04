AimTrainer is a little webapplication that let users compare their scores on a game of precision and reflex.

**Description of the project**

On the main page , player can type a username/gamertag (no need to register) and start the game. 
Players try to get the best score they can in the time limit. 
When there is no time remaining, the score and the username are send via fetch to the database and displayed on the scoreboard.
The 5 best scores of the database are displayed on the side and updated at the end of each game. 
There is also an input box that let you type the username/gamertag of an other player to display his best score as reference to beat.
All the main page is generated by react that update the score, the time remaining and the position of the target.
On the scoreboard page are displayed the 5 best scores of the day, the month, the year and of all time.
On the backend, the data are queried on the database then serialized thanks to django REST frameworks and returned to the script to be displayed.

**Project requirements** 

- *Your web application must be sufficiently distinct from the other projects in this course (and, in addition, may not be based on the old CS50W Pizza project), and more complex than those.*
    
This web application is distinct from the other projects in this course because it is more like an arcade game than a social network or an online sales platform. It is also distinct in conception and harder because the game itself has been designed using react unlike other projects. 
It was also more complex because it required to think about game design problem like. "How to reset the score at the end of the game but keep trace of it to display it and compare it to the highscores list to update this list if the score is above? How to keep the score of the player without registration if the user refreshes the page ? How to move the target randomly in a div and update the score if this target is clicked? etc.. The most complicated task was not to solve these questions, but how to make all these solutions work together.

- *Your web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end.*

This web application use django for server side requests. Scores of players are stored in database with django model. it use Javascript on frontend with React components to display and update the time, the score and the target during the game. A few animations are made with anime.js library.


- *Your web application must be mobile-responsive.*

For mobile, the game is only playable in landscape because it would not be fair to play in portrait orientation due to the smaller playing surface. if the index page is displayed portrait, the page will ask the user to rotate his phone then displayed the game. Conversely the scoreboard page can be displayed in both orientation as user would like.


**List of files created:**

Source code:

    serializers.py // Serializers 
    layout.html // Layout page
    index.html // Main page
    scoreboard.html // Scoreboard page
    index.js // Script for main page
    style.css // CSS Stylesheet
    
SVG Images:

    target.svg 
    cursor.svg
    flip_arrow.svg
    flip_phone.svg
    arrow.svg
    trophy1.svg
    trophy2.svg
    trophy3.svg
    trophy4.svg
    trophy5.svg
