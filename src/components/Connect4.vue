<template>
  <div id="all">
    <h1> Connect 4</h1>
    <div class="container_btn">
      <div class="btn_colonne colonne_1" data-numero="0">1</div>
      <div class="btn_colonne colonne_2" data-numero="1">2</div>
      <div class="btn_colonne colonne_3" data-numero="2">3</div>
      <div class="btn_colonne colonne_4" data-numero="3">4</div>
      <div class="btn_colonne colonne_5" data-numero="4">5</div>
      <div class="btn_colonne colonne_6" data-numero="5">6</div>
      <div class="btn_colonne colonne_7" data-numero="6">7</div>
      <div class="finish_message"> Nous avons un gagnant</div>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';

export default {
  name: 'Dijkstra',
  data() {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined
    }
  },
  methods: {
    init: function () {
      let container = document.getElementById('container');
      let tailleTabX = 7;
      let tailleTabY = 6;
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20);
      this.camera.position.z = 7;
      this.camera.position.x = tailleTabX / 2;
      this.camera.position.y = tailleTabY / 2;

      this.scene = new Three.Scene();
      let tab = []
      let tile = []

      const geometry = new Three.PlaneGeometry(1, 1);
      const white= new Three.MeshBasicMaterial({color: 0xFFFFFF, side: Three.DoubleSide});
      const white2= new Three.MeshBasicMaterial({color: 0x7D7D7D, side: Three.DoubleSide});
      //var outlineMaterial1 = new Three.MeshBasicMaterial( { color: 0xff0000,wireframe   : true } );
      //var white = new Three.Mesh( globalGeomtry, outlineMaterial1 );
      const jaune = new Three.MeshBasicMaterial({color: 0x32CD32, side: Three.DoubleSide});
      const rouge = new Three.MeshBasicMaterial({color: 0xed0000, side: Three.DoubleSide});
      //generation map

      for (let i = 0; i < tailleTabX; i++) {
        tab[i] = [];
        tile[i] = [];
        for (let j = 0; j < tailleTabY; j++) {
          let mat = white
          if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) {
              mat = white2;
          }
          tab[i][j] = 0;
          tile[i][j] = new Three.Mesh(geometry, mat)
          this.scene.add(tile[i][j]);
          //console.log(i + "  " +j)
          tile[i][j].position.x = i
          tile[i][j].position.y = j
        }
      }

      console.log(tab)

      function chkLine(a,b,c,d) {
          // Check first cell non-zero and all cells match
          return ((a != 0) && (a ==b) && (a == c) && (a == d));
      }
      
      function chkWinner(bd) {
          // Check down
          for (let r = 0; r < 3; r++)
              for (let c = 0; c < 6; c++)
                  if (chkLine(bd[r][c], bd[r+1][c], bd[r+2][c], bd[r+3][c]))
                      return bd[r][c];
          // Check right
          for (let r = 0; r < 6; r++)
              for (let c = 0; c < 4; c++)
                  if (chkLine(bd[r][c], bd[r][c+1], bd[r][c+2], bd[r][c+3]))
                      return bd[r][c];
          // Check down-right
          for (let r = 0; r < 3; r++)
              for (let c = 0; c < 4; c++)
                  if (chkLine(bd[r][c], bd[r+1][c+1], bd[r+2][c+2], bd[r+3][c+3]))
                      return bd[r][c];
          // Check down-left
          for (let r = 3; r < 6; r++)
              for (let c = 0; c < 4; c++)
                  if (chkLine(bd[r][c], bd[r-1][c+1], bd[r-2][c+2], bd[r-3][c+3]))
                      return bd[r][c];
          return 0;
      }

      console.log(chkWinner(tab))

    
      var playerId = 1;
      var aiId = 2;
      var limit = 0;
      var num_lignes = 0;
      var winner = "";

      console.log(tab)



      function playerTurn(tab, playerId, nb_colonne) {
          console.log('player turn')
          console.log(tab)
          //addEventListener joueur1 a joué

          //check quelle colone a été clické
          num_lignes = 2;
          //ajouter nouveau jeton à la colone
          const addNewJeton = (numColonne) => {
            for(let position = 0; position < tailleTabY; position++) {
              if(tab[numColonne][position] == 0) {
                  tab[numColonne][position] = playerId;
                  tile[numColonne][position].material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide});
                  break;
              }
            }
          }
          
          //check if someabody win
          if(limit > 40){
              console.log('limit')
          } else  if(chkWinner(tab) == 0){
              limit = limit +1;
              //num_lignes = Math.floor(Math.random() * 7);
              num_lignes = nb_colonne;
              addNewJeton(num_lignes);
              aiTurn(tab, aiId)
          } else {
              return chkWinner(tab);
          }

      }
      function aiTurn(tab, aiId) {
          console.log('ai turn')

          var actualNumColonne = "";
          var actualPosition = "";
          var findNextMove = false;

          //chercher la ligne la plus efficient
          const testAllPlays = (specificId) => {

            for(let numColonne = 0; numColonne <  tailleTabX; numColonne++) {
                console.log(numColonne)
                for(let position = 0; position < tailleTabY; position++) {
                    if(tab[numColonne][position] == 0) {
                        actualNumColonne = numColonne;
                        actualPosition = position;
                        tab[numColonne][position] = specificId;
                        break
                    }  
                }

                if(chkWinner(tab) == specificId) {
                    console.log("win")
                    findNextMove = true
                    tab[actualNumColonne][actualPosition] = 0
                    addNewJeton(actualNumColonne);
                    return tab[actualNumColonne][actualPosition];
                } else {
                    console.log('else')
                    tab[actualNumColonne][actualPosition] = 0
                }
              /*
              if(tab[numColonne].includes(1)){
                  console.log(tab[numColonne])
              }
              */
            }

            if(!findNextMove) {
                findNextMove = true;
                testAllPlays(playerId);
            }
          }

          //ajouter nouveau jeton à la colone
          const addNewJeton = (numColonne) => {
            for(let position = 0; position < tailleTabY; position++) {
              if(tab[numColonne][position] == 0) {
                  console.log(tab[numColonne][position])
                  tab[numColonne][position] = aiId;
                  tile[numColonne][position].material = new Three.MeshBasicMaterial({color: 0xff0c0c, side: Three.DoubleSide});
                  break;
              }
            }
          }

          testAllPlays(aiId);

          //check if somebody win
          console.log("limit " + limit)
          if(limit > 40){
              console.log('limit')
          } else if(chkWinner(tab) == 0){
              limit = limit +1;
              num_lignes = Math.floor(Math.random() * 7);
              addNewJeton(num_lignes);
              //playerTurn(tab, playerId)
          } else {
              return chkWinner(tab);
          }
         
      }


      function playGame(tab, player) {
            var playerName = player;

            document.querySelectorAll(".container_btn .btn_colonne").forEach((btn) => {
              btn.addEventListener('mousedown', function() {
                var nb_colonne = btn.dataset.numero
                playerTurn(tab, playerId, nb_colonne)
              })
            })
            
            //Joueur 1 commence
            //playerTurn(tab, playerId)

            return tab
      }

      playGame(tab, "Player 1")

      if(chkWinner(tab) == 1) {
        winner = "Winner Joueur 1"
        document.querySelector('.finish_message').style.display = 'block'
      } else if(chkWinner(tab) == 2) {
        document.querySelector('.finish_message').style.display = 'block'
        winner = "Winner IA"
      } else {
        document.querySelector('.finish_message').style.display = 'block'
        winner = "Null"
      }
      
      console.log(winner)
      

/*
      var WIDTH = 8;
var HEIGHT = 8;

let SCALE = 50;
let scene =  this.scene

      function createGrid(){
			function createHorizontalWall(){
				let geometry = new Three.BoxGeometry( WIDTH * SCALE, 3, 10 );
				let material = new Three.MeshLambertMaterial( {color: 0xFFFFFF} );
				return new Three.Mesh( geometry, material );
			}
			function createVerticalWall(){
				let geometry = new Three.BoxGeometry( 3, WIDTH * SCALE, 10 );
				let material = new Three.MeshLambertMaterial( {color: 0xFFFFFF} );
				return new Three.Mesh( geometry, material );
			}
			for(let column = 0; column <= WIDTH; column++) {
				let wall = createHorizontalWall();
				wall.position.set(SCALE*WIDTH/2,SCALE*column,0);
				scene.add(wall);
			}
			for(let row = 0; row <= HEIGHT; row++) {
				let wall = createVerticalWall();
				wall.position.set(SCALE*row,SCALE*HEIGHT/2,0);
				scene.add(wall);
			}
		
		}
        createGrid();
    */

      //let xkey = Math.floor(Math.random() * tailleTab)
      //let ykey = Math.floor(Math.random() * tailleTab)
      //tab[xkey][ykey] = "key"
      //tile[xkey][ykey].material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide});

      //generation hero
      //let x = xkey
      //let y = ykey
      //while (x == xkey && y == ykey) {
      //  x = Math.floor(Math.random() * tailleTab)
      //  y = Math.floor(Math.random() * tailleTab)
      //}
      //tab[x][y] = "Hero"
      //tile[x][y].material = new Three.MeshBasicMaterial({color: 0xf4fefe, side: Three.DoubleSide});



//------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

    },
    animate: function () {
      requestAnimationFrame(this.animate);
      //this.mesh.rotation.x += 0.01;
      //this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    },


  },
  mounted() {
    this.init();
    this.animate();
  }

}
</script>

<style scoped>
#container {
  width: 1000px;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
}
.container_btn {
  display: flex;
}
.container_btn .btn_colonne {
  padding: 20px;
  border: solid 1px #000
}
.finish_message {
  display: none;
}

</style>
