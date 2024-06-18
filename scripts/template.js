export function renderMainMenu(){
    return `<div class="GameMenu">
                <h1>GameName <br>Here II</h1>
                  <nav>
                    <div value="start" class="button">Start Button</div>
                    <div value="settings" class="button">Settings Button</div>
                    <div value="controls" class="button">Steuerung</div>
                  </nav>
            </div>`
}
export function renderControllPanel(){
  return ` 
  <div class="GameMenu">
    <h1>GameName<br>Hero II</h1>
    <nav>
      <div value="start" class="button">Start Button</div>
      <div value="settings" class="button">Settings Button</div>
    </nav>
  </div>

  <div class="sidePanel">

    <div class="controllPanel">

    <h2>How to Play.</h2>

      <div class="panelOne">
        <div class="imageContainer"><img src="./img/button-set-one.png"></div>
        <div class="infoContainer"> 
        Use <span>'A'</span> or <span>'D'</span> for running Left and Right. Your Character will jump by pressing <span>'W'</span>. By pressing 
        <span>'S'</span> Your Charcter will fall though <span>Semi-Solid-Platforms</span>.</div>
      </div>

      <div class="panelTwo">
        <div class="infoContainer">But also the Game supports to controll your Character with <span>Arrow Keys</span>, in case you prefer to play like this.</div>
        <div class="imageContainer"><img src="./img/button-set-two.png"></div>
      </div>

      <div class="panelOne">
        <div class="imageContainer"><img src="./img/fight-space.png"></div>
        <div class="infoContainer"> 
        Your are a Swordsman! ...<br>Sy, I mean <span class="woman">SwordsWoman</span>. So you can <span>swing</span> your Sword by using the <span>'F'</span>- or <span>Enter-Key</span>.</div>
      </div>

      <div class="panelTwo">
        <div class="infoContainer">If you need a break, it is possible to <span>Pause</span> the game by pressing <span>'P'</span> or you are <span>Stuck?</span> Press <span>'R'</span> to <span>reloard</span> a Level</div>
        <div class="imageContainer"><img src="./img/button-set-three.png"></div>
      </div>

      <div class="panelOne">
        <div class="imageContainer"><img src="./img/button-space.png"></div>
        <div class="infoContainer">Oh, and of course! Don't forget you can <span>Jump</span> by pressing the <span>'Space-Bar'</span> too!</div>
      </div>


      </div>
    </div>
  </div>`
}