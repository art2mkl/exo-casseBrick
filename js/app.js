const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')
let particules
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

class Particule {
    constructor(x, y, directionX, directionY, taille, couleur) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.taille = taille;
        this.couleur = couleur;
    }
    dessine() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2, false)
        ctx.fillStyle = this.couleur
        ctx.fill()
    }
    bouge() {
        if (this.x + this.taille > canvas.width || this.x - this.taille < 0) {
            this.directionX = -this.directionX
        }
        if (this.y + this.taille > canvas.height || this.y - this.taille < 0) {
            this.directionY = -this.directionY
        }
        this.x += this.directionX
        this.y += this.directionY
        this.dessine()
    }
}


init()
animation()

function init() {
    particules = []

    for (let i = 0; i < 100; i++) {
        let taille = (Math.random() + 0.01) * 20
        let x = Math.random() * (window.innerWidth - taille * 2)
        let y = Math.random() * (window.innerHeight - taille * 2)
        let directionX = (Math.random() * 0.4) - 0.2
        let directionY = (Math.random() * 0.4) - 0.2
        let couleur = "rgba(250,250,250,0.4)"
        particules.push(new Particule(x, y, directionX, directionY, taille, couleur))
    }
}


function animation() {
    requestAnimationFrame(animation)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    particules.forEach(e => {
        e.bouge()
    })
}

function resize() {
    init()
    animation()
}

window.addEventListener('resize', () => {
    let doit = setTimeout(resize, 1000)
    clearTimeout(doit)
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
})

//*********************************************//

const canvas2 = document.querySelector('.canvas2')
const affichage = document.querySelector('.h2')
const ctx2 = canvas2.getContext('2d')

const rayonBalle = 10
const barreHeight = 10
const barreWidth = 75
const nbCol = 8
const nblig = 4
const briqueWidth = 85
const briqueHeight = 20


let ballColor ="whitesmoke"
let x = canvas2.width / 2 + 200, vitesseX = 5
let y = canvas2.height - 30, vitesseY = -5
let barreX = (canvas2.width - barreWidth) / 2 - 300
let barreY = canvas2.height - barreHeight - 6
let fin = false
let score = 0

function dessineBalle() {
    ctx2.beginPath();
    ctx2.arc(x, y, rayonBalle, 0, Math.PI * 2)
    ctx2.fillStyle = ballColor
    ctx2.fill();
    ctx2.closePath();
}

function dessineBarre() {
    ctx2.beginPath();
    ctx2.rect(barreX, barreY, barreWidth, barreHeight)
    ctx2.fillStyle = "whitesmoke"
    ctx2.fill();
    ctx2.closePath();
}

function dessineBrique(xbrique, ybrique, couleurbrique) {
    ctx2.beginPath();
    ctx2.rect(xbrique, ybrique, briqueWidth, briqueHeight)
    ctx2.fillStyle = couleurbrique
    ctx2.fill();
    ctx2.closePath();
}

//tableau des briques
let briqueTab = []

function Brique(x, y, statut) {
    this.x = x,
        this.y = y,
        this.statut = statut
        this.couleur = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`
}

let briqueY = 20;
let briqueX = 20;
for (j = 0; j < nblig; j++) {
    briqueX = 20;
    for (i = 0; i < nbCol; i++) {
        let briqueColor = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`
        let newBrique = new Brique(briqueX, briqueY, 1)
        briqueX += briqueWidth + 5
        briqueTab.push(newBrique)
    }
    briqueY += briqueHeight +5
}

//Reddessiner toutes les briques
function dessineBriqueTab() {

    briqueTab.forEach(element => {
        if (element.statut === 1) {
            dessineBrique(element.x, element.y, element.couleur)
        }
    })
}

dessine()
//Bouge la souris
canvas2.addEventListener('mousemove', e => {
    if (e.clientX - canvas2.offsetLeft > barreWidth / 2 && e.clientX - canvas2.offsetLeft < canvas2.width - barreWidth / 2) {
        barreX = (e.clientX - canvas2.offsetLeft) - barreWidth / 2
    }
})
//touche le clavier
window.addEventListener('keydown', e => {

    if (e.key === "ArrowRight") {
        if (barreX + barreWidth < canvas2.width) {

            barreX += 50
        } else { barreX = canvas2.width - barreWidth }
    }
    if (e.key === "ArrowLeft") {
        if (barreX > 0) {
            barreX -= 50
        } else {
            barreX = 0
        }
    }
})

//Recommance
canvas2.addEventListener('click', () => {
    if (fin === true) {
        fin === false
        document.location.reload()
    }

})

document.addEventListener('keydown', e => {
    if (fin === true && e.key === " ") {
        fin === false
        document.location.reload()
    }

})


function collision() {
    console.log(briqueTab);
    briqueTab.forEach(element => {
        
       if(element.statut === 1) {
       
        if (x > element.x && x < element.x + briqueWidth && y > element.y && y < element.y + briqueHeight) {
            element.statut = 0
            vitesseY = - vitesseY * 1.02
            score++
            affichage.innerHTML =`Score : ${score}`
            if(score >= nbCol * nblig) {
                fin = true
                affichage.innerHTML = `score : ${score}<br>
                Well Done, You win… <br>
                (Clique sur le Casse-brique pour recommencer)`
            }
        }
        
    }


        
    })
}

function dessine() {

    if (fin === false) {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
        dessineBalle()
        dessineBarre()
        dessineBriqueTab()
        collision()

        //gestion de la balle 
        x += vitesseX
        y += vitesseY

        if (x > canvas2.width - rayonBalle || x < 0 + rayonBalle) {
            vitesseX = - vitesseX
        }
        if (y < 0 + rayonBalle) {
            vitesseY = - vitesseY
        }
        if (y > canvas2.height - rayonBalle - barreHeight) {
            if (x > barreX && x < barreX + barreWidth) {
                vitesseY = - vitesseY
            } else {
                ballColor ="firebrick"
                ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
                dessineBalle()
                dessineBarre()
                dessineBriqueTab()
                fin = true
                affichage.innerHTML = `score : ${score}<br>
                You Lose… <br>
                (Clique sur le Casse-brique pour recommencer)`
            }

        }



        requestAnimationFrame(dessine)


    }
}