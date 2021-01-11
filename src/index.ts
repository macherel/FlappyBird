class Bird {
  x = 0; // Position horizontal de l'oiseau
  y = 200; // Position vertical de l'oiseau
  width = 24; // Largeur de l'oiseau
  height = 24; // Hauteur de l'oiseau
  deltaY = 0; // Vitesse verticale de l'oiseau
  image = new Image();
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.image.src = "src/bird.png"; // Charge l'image
    this.image.onload = () => {
      this.width = this.height * (this.image.width / this.image.height); // Permet de réduire l'image sans la déformer
    };
  }

  reset() {
    this.y = 200;
    this.deltaY = 0;
  }

  jump() {
    this.deltaY = 9; // Permet à l'oiseau d'aller vers le haut
  }

  move() {
    this.deltaY -= 0.5; // Réduit la vitesse de l'oiseau
    this.y -= this.deltaY; // Déplace l'oiseau
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height); // Draw bird
  }
}

class Wall {
  x = 0; // Position horizontal du mur
  width = 24; // épaisseur du mur
  holeY = 50; // position haute du trou dans le mur
  holeHeight = 200; // Taille du trou dans le mur
  canvas: HTMLCanvasElement; // zone de dessin

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  reset() {
    this.x = this.canvas.width;
    this.holeY = Math.random() * (this.canvas.height - this.holeHeight);
  }

  move() {
    this.x -= 8; // Déplace le mur
    if (this.x <= 0) {
      // Le mur est sorti de l'écran, on le remet en place
      this.reset();
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "saddlebrown";
    // Dessine la partie haute du mur
    context.fillRect(this.x, 0, this.width, this.holeY);
    // Dessine la partie basse du mur
    context.fillRect(
      this.x,
      this.holeY + this.holeHeight,
      this.width,
      this.canvas.height
    );
  }
}

class Game {
  score = 0;
  bestScore = 0;
  bird: Bird;
  wall: Wall;
  canvas: HTMLCanvasElement;

  constructor(speed: number, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.bird = new Bird(canvas);
    this.wall = new Wall(canvas);

    canvas.addEventListener("click", () => {
      this.onClick();
    });
    setInterval(() => {
      this.onInterval();
    }, 1000 / speed);
  }

  onClick() {
    this.bird.jump();
  }

  onInterval() {
    const context = this.canvas.getContext("2d");
    if (context == null) return;
    this.move();
    this.draw(context);
  }

  move() {
    this.bird.move();
    this.wall.move();

    if (this.isBirdDied()) {
      this.score = 0;
      this.bird.reset();
      this.wall.reset();
    }

    this.score++;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  isBirdDied() {
    if (this.bird.y > this.canvas.height) {
      return true;
    }
    if (this.wall.x <= this.bird.x + this.bird.width) {
      if (this.bird.y < this.wall.holeY) {
        return true;
      } else if (this.bird.y > this.wall.holeY + this.wall.holeHeight) {
        return true;
      }
    }
    return false;
  }

  draw(context: CanvasRenderingContext2D) {
    this.drawSky(context);
    this.wall.draw(context);
    this.bird.draw(context);
    this.drawScore(context);
  }

  drawSky(context: CanvasRenderingContext2D) {
    context.fillStyle = "skyblue";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height); // Dessine le ciel
  }
  drawScore(context: CanvasRenderingContext2D) {
    context.fillStyle = "black";
    context.fillText(`Score : ${this.score}`, 9, 25);
    context.fillText(`Best: ${this.bestScore}`, 9, 50);
  }
}

const canvas = document.getElementById("canvas");
if (canvas != null && canvas instanceof HTMLCanvasElement) {
  new Game(40, canvas);
}
