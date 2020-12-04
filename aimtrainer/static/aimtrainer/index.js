
function Gameboard(){
    // STATES
    const [seconds, setSeconds] = React.useState("init");
    const [score, setScore] = React.useState(0);
    
    // FUNCTIONS

    function init(){
      // Hide ingame elements and display outgame elements
      document.querySelector("#target").style.display = "none";
      document.querySelector("#score").style.display = "none";
      document.querySelector("#timer").style.display = "none";
      document.querySelector("#start_box").style.display="flex";
      // move target from initial position
      move_target();
      // display score of previous game
      set_previous_score();
      // display highscores 
      get_highscores();
    }

    // send score and reset view
    function reset(){
        send_score();
        //wait until score saved db before collect the new highscores
        setTimeout(() => init(),500)
    }

    // Hide outgame elements and display ingame elements then reset score and set countdown 
    function start(){
        document.querySelector("#target").style.display = "block";
        document.querySelector("#score").style.display = "block";
        document.querySelector("#timer").style.display = "block";
        document.querySelector("#start_box").style.display="none";
        setSeconds(30);
        setScore(0);
    }

    // get score from cookies then display it 
    function set_previous_score(){
        var previous_score = localStorage.getItem('previous_score')
        if(localStorage.getItem("previous_score") === null){
          document.querySelector('#previous_score').innerHTML="<p>No score yet</p>"
        }
        else{
          document.querySelector('#previous_score').innerHTML=`<p>current score: ${previous_score}</p>`
        }
      }
  
    // send score to database and cookies
    function send_score(){
        // set score in cookies
        localStorage.setItem('previous_score',  `${score}`); 
        // get username of player
        const player = document.querySelector('#username').value;
        // get safety token against cross site
        const csrftoken = getCookie('csrftoken');
        // send score to database 
        fetch('send_score', {
          method: "POST", 
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({
            player: player,
            score: score
        })
        });
      }
    
    // display highscores
    function get_highscores(){
        // clean old highscores_list
        document.querySelector("#highscores_list").innerHTML=""
        // create counter to filter trophy image to display
        var counter = 1;
        // fetch highscores 
        fetch('/highscores')
          .then(response => response.json())
          .then(scorelist => {
            scorelist.forEach(element => {
              // create element with data and trophy image
              var player_score = document.createElement('div');
              var elem = document.createElement("li");   
              var trophy = document.createElement('IMG');
              trophy.setAttribute("width", "20");
              trophy.setAttribute("height", "20");
              switch (counter) {
                case 1:
                  trophy.setAttribute("src", "../static/aimtrainer/trophy1.svg");
                  trophy.setAttribute("alt", "trophy 1st");
                  break;
                case 2:
                  trophy.setAttribute("src", "../static/aimtrainer/trophy2.svg");
                  trophy.setAttribute("alt", "trophy 2nd");
                  break;
                case 3:
                  trophy.setAttribute("src", "../static/aimtrainer/trophy3.svg");
                  trophy.setAttribute("alt", "trophy 3rd");
                  break;
                case 4:
                  trophy.setAttribute("src", "../static/aimtrainer/trophy4.svg");
                  trophy.setAttribute("alt", "trophy P4");
                  break;
                case 5:
                  trophy.setAttribute("src", "../static/aimtrainer/trophy5.svg");
                  trophy.setAttribute("alt", "trophy P5");

              }   
              elem.innerText = `${element.score} pts - ${element.player}`;  
              player_score.appendChild(trophy);   
              player_score.appendChild(elem);  
              player_score.setAttribute("class","highscores_player_score");   
              document.querySelector("#highscores_list").appendChild(player_score); 
              counter++;
            })
          })
    }

    // update score and move target 
    function target_clicked(){
      setScore(score + 1);
      move_target();
    }

    // move target when clicked 
    function move_target(){
      var y = document.querySelector('#game_box').offsetHeight - 200;
      var x = document.querySelector('#game_box').offsetWidth - 200;
      var randomY = Math.floor(Math.random()*y);
      var randomX = Math.floor(Math.random()*x);
      anime({
        targets: '#target',
        easing: 'spring',
        keyframes: [
          {opacity: 0},
          {translateX: randomX},
          {translateY: randomY},
          {opacity: 1},
        ],
        easing: 'spring',
        duration:250
      });
      }    
    

    // UPDATE EFFECT
    React.useEffect(() => {
        // Check time remaining
        if(seconds == "init"){
          init();
        }
        else if(seconds > 5){
            setTimeout(() => setSeconds(seconds - 1), 1000);  
        }
        else if(seconds > 0){
          setTimeout(() => setSeconds(seconds - 1), 1000);  
          document.querySelector('#timer span').style.color="red";     
        }
        else if(seconds == 0){
          document.querySelector('#timer span').style.color="white";   
            reset();
        }
    });




    // RENDER
    return(
        <div id="gameboard">
            <div id ="option_board">
                    <div id="timer">time : <span>{seconds}</span></div>
                    <div id="score">score : <span>{score}</span></div>
            </div>
            <div id="game_box">

                <div id="start_box">
                    <div id="rules"><p>Click on the most targets within the time limit.</p></div>
                    <input type="text" id="username" maxLength="7" placeholder="Username"/>
                    <button id="start_button" onClick={start}>start</button>
                </div>

                <img src={"../static/aimtrainer/target.svg"} id="target" onClick={target_clicked}/>
            </div>

            <div id="side_box">
              <div id="highscores_panel">
                 <h2>HIGHSCORES</h2>
                 <hr></hr>
                 <div id="highscores_list"></div> 
              </div>
                 <div id="previous_score_panel">
                  <div id="previous_score"></div>
                 </div>
                <Rival_panel />
              </div>
        </div>

    )
}

  // Rival panel component 
  function Rival_panel(){

    // find the score of a player by his gamertag/username  
    function get_rival(){
        // get gamertage/username
        const rival_username = document.querySelector("#rival_username").value;
        // clean rival list
        document.querySelector("#rival_list").innerHTML = "";
        // create svg little arrow
        var arrow = document.createElement('IMG');
        arrow.setAttribute("src", "../static/aimtrainer/arrow.svg");
        arrow.setAttribute("width", "20");
        arrow.setAttribute("height", "20");
        arrow.setAttribute("id", "arrow");
        arrow.setAttribute("style", "margin-right:15px");

        // fetch data 
        fetch(`add_rival/${rival_username}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(element => {
            // display rival score
            document.querySelector("#rival_list").appendChild(arrow);
            document.querySelector("#rival_list").append(`${element.score} pts - ${element.player}`); 
            // anime arrow
            anime({
              targets: '#arrow',              
              duration: 1200,
              direction: 'alternate',
              translateX: 3,
              loop: true
            });  
          })}
        );
      }

    return(
        <div id="rival_panel">
          <p>SET RIVAL</p>
          <hr></hr>
          <div id="rival_searchbox">
          <input type="text" id="rival_username" maxLength="7" placeholder="username"/>
          <button id='add_rival_button'  onClick={get_rival}>add</button>
          <div id='rival_list'></div>
          </div>
        </div>
    );

  }


  // DOM RENDER 

  ReactDOM.render(
    <Gameboard />,
    document.getElementById('root')
  );



  // UTIL FUNCTION 


  // get csrf token 
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
    
