export function renderMainMenu(){
    return `<div class="GameMenu">
                <h1>GameName <br>Here II</h1>
                  <nav>
                    <div value="start" class="button">Start New Game</div>
                    <div value="controls" class="button">Steuerung</div>
                    <div value="impressum" class="button">Impressum</div>
                  </nav>
            </div>
            <div id="renderSidePanel">
            </div>`
}

export function renderGameReady(){
  return `<div class="GameMenu">        
          </div>
          <div id="renderSidePanel">
          <div class="gameReady flickContent"><img value="startGame" class="hover" src ="./img/button-play.png"></div>
          <div class="gameReady"> Game is Ready <br> press 'P' to start the Game.</div>
          </div>
          
          <div id="quciktip" class="quickTipMenu"> 
         
          </div>
          `

}

export function renderQuickTip(number){
  let textArray = [  
    `
    <div class="tipPicture"><img src ="./img/info-1.jpg"></div>
    <h2>Quick Tip:</h2>
    <div class="tipText">Jump on a <span>Mushroom Head</span> will set you to the <span>Sky</span>!</div>`,
    `
    <div class="tipPicture"><img src ="./img/info-2.jpg"></div>
    <h2>Quick Tip:</h2>
    <div class="tipText">Gain your <span>Health</span> back by collecting <span>Potions</span>!</div>`,
    `
    <div class="tipPicture"><img src ="./img/info-3.jpg"></div>
    <h2>Quick Tip:</h2>
    <div class="tipText">Watch out for Traps! <span>Spikes</span> are deadly and you will <span>die</span> immediately! </div>`,
  ];
  return textArray[number];
}

export function renderControllPanel(){
  return ` 
    <div class="sidePanel">

      <div class="controllPanel">
      <h2>How to Play.</h2>

        <div class="panelOne">
          <div class="imageContainer"><img src="./img/button-set-one.png"></div>
          <div class="infoContainer"> 
          Use <span>'A'</span> or <span>'D'</span> to run left and right. Your character will Jump by pressing <span>'W'</span>. By pressing <span>'S'</span>, your character will fall through semi-solid platforms.</div>
        </div>

        <div class="panelTwo">
          <div class="infoContainer">The game also supports controlling your character with the <span>'Arrow-Keys'</span> if you prefer to play that way.</div>
          <div class="imageContainer"><img src="./img/button-set-two.png"></div>
        </div>

        <div class="panelOne">
          <div class="imageContainer"><img src="./img/fight-space.png"></div>
          <div class="infoContainer"> 
          You are a swordsman! … Sorry, I mean <span class="woman">swordswoman!</span> You can swing your sword by using the <span>'F'</span> key or the <span>Enter</span> key.</div>
        </div>

        <div class="panelTwo">
          <div class="infoContainer">If you need a break, you can pause the game by pressing <span>'P'</span>. Stuck? Press <span>'R'</span> to reload a level.</span> a Level</div>
          <div class="imageContainer"><img src="./img/button-set-three.png"></div>
        </div>

        <div class="panelOne">
          <div class="imageContainer"><img src="./img/button-space.png"></div>
          <div class="infoContainer">Oh, and of course, don't forget you can <span>Jump</span> by pressing the <span>Space-Bar</span> too!</div>
        </div>

        </div>
      </div>
  </div>`

}

export function renderImpressum(){
  return `
  <div class="sidePanel alightText">
  <div class='impressum'><h1>Impressum</h1><p>Angaben gemäß § 5 TMG</p><p>Marcel Arndt <br> 
Wilhelm-Raabe-Straße 13<br> 
32105 Bad Salzuflen <br> 
</p><p> <strong>Vertreten durch: </strong><br>
Marcel Arndt<br>
</p><p><strong>Kontakt:</strong> <br>
Telefon: 0176-63626861<br>
E-Mail: <a target="_blank" href='mailto:marcel.arndt@hotmail.com'>marcel.arndt@hotmail.com</a></br></p><p><strong>Haftungsausschluss: </strong><br><br><strong>Haftung für Inhalte</strong><br><br>
Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.<br><br><strong>Haftung für Links</strong><br><br>
Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.<br><br><strong>Urheberrecht</strong><br><br>
Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.<br><br><strong>Datenschutz</strong><br><br>
Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br>
Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. <br>
Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.<br>
</p><br> 
Impressum vom <a target="_blank" href="https://www.impressum-generator.de">Impressum Generator</a> der <a target="_blank" href="https://www.kanzlei-hasselbach.de/">Kanzlei Hasselbach, Rechtsanwälte für Arbeitsrecht und Familienrecht</a>
 </div>
 </div>
 `
}

export function renderIngameGui(){
  return`
      <div class="icons-container">
          <div class="subMenu">
            <div class="icon"><img value="openKeyboard" class="hover" src="./img/keyboard.png"></div>
            <div class="icon"><img value="restartButton" class="hover" src="./img/restart.png"></div>
          </div>

          <div class="subMenu">
            <div class="icon"><img value="volumnePlus" class="hover" src="./img/plus-icon.png"></div>
            <div class="icon"><img value="volumneSelf" class="hover" src="./img/volumne-full.png"></div>
            <div class="icon"><img value="volumneMinus" class="hover" src="./img/minus-icon.png"></div>
          </div> 
      </div>
  `
}


export function renderPauseMenu(){
  return `<div class="GameMenu">
                <h1>GameName <br>Here II</h1>
                  <nav>
                    <div value="resume" class="button">Resume</div>
                    <div value="controls" class="button">Steuerung</div>
                    <div value="impressum" class="button">Impressum</div>
                  </nav>
            </div>
            <div id="renderSidePanel">
            </div>`
}


export function renderEndMenu(){
  return `<div class="GameMenu">
                <h1>GameName <br>Here II</h1>
                  <nav>
                    <div value="restart" class="button">Start New Game</div>
                    <div value="controls" class="button">Steuerung</div>
                    <div value="impressum" class="button">Impressum</div>
                  </nav>
            </div>
            <div id="renderSidePanel">
            <div id="currentGameState"><h1>You Won</h1></div>
            <div>
            <ul>
            <li>Your Score:</li>
            </ul>
            </div>
            </div>`
}

export function renderdebugCode(debugArray){
  return `MinionCounter: ${debugArray[0]}     |    
  PlayerStatus: ${debugArray[3]}     |
  PlayerHealth: ${debugArray[4]}     |
  PlayerPos:       X = ${Math.floor(debugArray[1])}       Y = ${Math.floor(debugArray[2])}     |
  CanvasSize: X = ${debugArray[5]}       Y = ${debugArray[6]}     |
  CameraPos: X = ${Math.floor(debugArray[7])}      Y = ${Math.floor(debugArray[8])}
          `
}