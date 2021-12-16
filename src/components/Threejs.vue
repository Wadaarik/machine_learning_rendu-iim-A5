<template>
  <div id="all">
    <h1> Dijkstra</h1>
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
      let tailleTab = 16
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20);
      this.camera.position.z = 15;
      this.camera.position.x = tailleTab / 2;
      this.camera.position.y = tailleTab / 2;

      this.scene = new Three.Scene();
      let tab = []
      let tile = []

      const geometry = new Three.PlaneGeometry(1, 1);
      const terre = new Three.MeshBasicMaterial({color: 0x32CD32, side: Three.DoubleSide});
      const lave = new Three.MeshBasicMaterial({color: 0xed0000, side: Three.DoubleSide});
      //generation map

      for (let i = 0; i < tailleTab; i++) {
        tab[i] = [];
        tile[i] = [];
        for (let j = 0; j < tailleTab; j++) {
          let mat = terre
          tab[i][j] = "terre";
          if (Math.floor(Math.random() * 6) == 0) {
            mat = lave
            tab[i][j] = "lave";
          }
          tile[i][j] = new Three.Mesh(geometry, mat)
          this.scene.add(tile[i][j]);
          //console.log(i + "  " +j)
          tile[i][j].position.x = i
          tile[i][j].position.y = j
        }
      }

      let xkey = Math.floor(Math.random() * tailleTab)
      let ykey = Math.floor(Math.random() * tailleTab)
      tab[xkey][ykey] = "key"
      tile[xkey][ykey].material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide});

      //generation hero
      let x = xkey
      let y = ykey
      while (x == xkey && y == ykey) {
        x = Math.floor(Math.random() * tailleTab)
        y = Math.floor(Math.random() * tailleTab)
      }
      tab[x][y] = "Hero"
      tile[x][y].material = new Three.MeshBasicMaterial({color: 0xf4fefe, side: Three.DoubleSide});


      //start code

      var positionKeyX = 0;
      var positionKeyY = 0;
      var positionHeroX = 0;
      var positionHeroY = 0;

      for(let originX = 0; originX < tab.length; originX++) {
        for(let originY= 0; originY < tab.length; originY++) {
          var tabX = tab[originX];
          var tabXY = tabX[originY];
          if(tabXY == "key") {
            positionKeyX = originX;
            positionKeyY = originY

          } else if(tabXY == "Hero") {
            positionHeroX = originX;
            positionHeroY = originY;
          }
        }
      }

      console.log("Key " + positionKeyX, positionKeyY);
      console.log("Hero " + positionHeroX, positionHeroY);
      var limit= 0;
      var already_move_y = false;

      var diffPositionX= positionKeyX - positionHeroX;
      var diffPositionY= positionKeyY - positionHeroY;

      function findKey() {
        var futurLeftHeroX = (Math.sign((positionHeroX -1)) != -1) ? (positionHeroX -1) : positionHeroX;
        //var futurLeftHeroX = positionHeroX -1;
        var futurRightHeroX = positionHeroX +1;
        var futurTopHeroY = positionHeroY +1;
        var futurBottomHeroY= (Math.sign((positionHeroY -1)) != -1) ? (positionHeroY -1) : positionHeroY;
        //var futurBottomHeroY= positionHeroY -1;
        limit ++;

        diffPositionX = positionKeyX - positionHeroX;
        diffPositionY= positionKeyY - positionHeroY;

        if(positionKeyX == positionHeroX && positionKeyY == positionHeroY) {
          tile[positionHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0xddba00, side: Three.DoubleSide});
          console.log('Réussi');

        } else {

          console.log(positionHeroX);
          console.log(positionHeroY);
          console.log('diffPositionX ' + diffPositionX);
          console.log('diffPositionY ' + diffPositionY);

          if(limit > 150) {
            console.log('finish with limit')

          } else if(futurRightHeroX > 16) {
            console.log('out of limit')
            moveY(diffPositionY, futurTopHeroY, futurBottomHeroY, futurRightHeroX, futurLeftHeroX)

          } else if(diffPositionX < 0) {
            console.log('gauche')
            already_move_y = false;
            var tabX = tab[futurLeftHeroX];
            if(tabX[positionHeroY] != "lave") {
              tile[futurLeftHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroX = futurLeftHeroX
              //break
              //(Math.sign(diffPositionX) != -1) ? diffPositionX = diffPositionX*(-1) : null
              findKey();
            } else {
              moveY(diffPositionY, futurTopHeroY, futurBottomHeroY, futurRightHeroX, futurLeftHeroX)
            }
          } else if(diffPositionX == 0 && !already_move_y) {
            console.log('même x');
            already_move_y = false;
              //essayer le Y
              moveY(diffPositionY, futurTopHeroY, futurBottomHeroY, futurRightHeroX, futurLeftHeroX)
          } else if (diffPositionX > 0) {
            console.log('droite')
            already_move_y = false;
            if(tab[[futurRightHeroX]][positionHeroY] != "lave") {
              tile[futurRightHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroX = futurRightHeroX
              //break
              //(Math.sign(diffPositionX) != 1) ? diffPositionX = diffPositionX*(-1) : null
              findKey();
            } else {
              moveY(diffPositionY, futurTopHeroY, futurBottomHeroY, futurRightHeroX, futurLeftHeroX)
            }
          } else {
            //floor is lava
            //essayer le Y
            moveY(diffPositionY, futurTopHeroY, futurBottomHeroY, futurRightHeroX, futurLeftHeroX)
          }

        }


      }

      function moveY(diffPositionY, futurTopHeroY, futurBottomHeroY, futurRightHeroX, futurLeftHeroX) {
        console.log('moveY')

        if(already_move_y == true) {
          //si on a déjà été bloqué avant
          if(tab[[futurRightHeroX]][positionHeroY] != "lave") {
              tile[futurRightHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroX = futurRightHeroX
              //break
              //(Math.sign(diffPositionX) != 1) ? diffPositionX = diffPositionX*(-1) : null
              findKey();
          } else if (tab[[futurLeftHeroX]][positionHeroY] != "lave"){
            console.log('gauche')
            already_move_y = false;
            var tabX = tab[futurLeftHeroX];
            if(tabX[positionHeroY] != "lave") {
              tile[futurLeftHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroX = futurLeftHeroX
              //break
              //(Math.sign(diffPositionX) != -1) ? diffPositionX = diffPositionX*(-1) : null
              findKey();
            }
          } else {
            console.log("don't find a way")
          } 
        } else {
          console.log('diffPositionY dans moveY ' + diffPositionY)

          if(diffPositionY > 0) {
            console.log('top')
            if(tab[positionHeroX][futurTopHeroY] != "lave") {
              tile[positionHeroX][futurTopHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroY = futurTopHeroY
              //break
              findKey()
            } else if(tab[positionHeroX][futurBottomHeroY] != "lave") {
              tile[positionHeroX][futurBottomHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroY = futurBottomHeroY
              //break 
              findKey()
            } else {
              diffPositionX = diffPositionX*(-1)
              findKey()
            }
          } else if(diffPositionY == 0) {
            console.log('même y');
            already_move_y = false;
            if(tab[[futurRightHeroX]][positionHeroY] != "lave") {
              tile[futurRightHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroX = futurRightHeroX;
              //break
              //(Math.sign(diffPositionX) != 1) ? diffPositionX = diffPositionX*(-1) : null
              findKey();
            } else if (tab[[futurLeftHeroX]][positionHeroY] != "lave"){
              console.log('gauche')
              already_move_y = false;
              var tabX = tab[futurLeftHeroX];
              if(tabX[positionHeroY] != "lave") {
                tile[futurLeftHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
                positionHeroX = futurLeftHeroX;
                //break
                //(Math.sign(diffPositionX) != -1) ? diffPositionX = diffPositionX*(-1) : null
                findKey();
              }
            } else {
              console.log("don't find a way")
            } 

          } else if(diffPositionY < 0) {
            console.log('bottom')
            if(tab[positionHeroX][futurBottomHeroY]!= "lave") {
              tile[positionHeroX][futurBottomHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroY = futurBottomHeroY
              //break
              findKey()
            } else if(tab[positionHeroX][futurTopHeroY] != "lave"){
              tile[positionHeroX][futurTopHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
              positionHeroY = futurTopHeroY
              //break
              findKey()
            } else {
              diffPositionX = diffPositionX*(-1)
              findKey()
            }
          } else {
            already_move_y = true;
          }


        }
          
      }

      //init recursive
      findKey();

      /*
      while(positionHeroX != positionKeyX && positionHeroY != positionKeyY) {
        var diffPositionX= positionKeyX - positionHeroX;
        var futurLeftHeroX = positionHeroX -1;
        var futurRightHeroX = positionHeroX +1;


        if(diffPositionX < 0) {
          console.log('gauche')
          var tabX = tab[futurLeftHeroX];
          if(tabX[positionHeroY] != "lave") {
            tile[futurLeftHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
            //break
          }
        } else if(diffPositionX == 0) {
          console.log('même x')
          if(tab[[positionHeroX]][positionHeroY] != "lave") {
            tile[futurRightHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
            //break
          }
        } else {
          console.log('droite')
          if(tab[[futurRightHeroX]][positionHeroY] != "lave") {
            tile[futurRightHeroX][positionHeroY].material = new Three.MeshBasicMaterial({color: 0x000, side: Three.DoubleSide});
            //break
          }
        }
        if(limit > 100) {
          break;
        }
        limit ++;
      }
      */

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

</style>
