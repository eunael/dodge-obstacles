let canvas, contexto, LARGURA=400, ALTURA=400, frame=0, velObst=1, velBloco=3, estadoAtual,
estado = {
    play: 0,
    jogando: 1,
    perdeu: 2
};
var bloco = {
    // pos = 0 a 400
    posx: LARGURA/2 - 20/2,
    posy: ALTURA - 20,
    
    larg: 20,
    alt: 20,
    
    contx: 0,
    conty: 0,

    cor: '#606060',
    
    atuliBloco: function(){
        parax = this.posx + this.contx
        paray = this.posy + this.conty
        
        if(parax<=0 || parax+this.larg >= LARGURA){

        }else{
            this.posx += this.contx
        }
        
        if(paray<=0 || paray+this.alt >= ALTURA+1){

        }else{
            this.posy += this.conty
        }
    },
    desenBloco: function(){
        contexto.fillStyle = '#b3b3b3'
        contexto.fillRect(this.posx, this.posy, this.larg, this.alt)
    },
    moveBloco: function(x3, y3){
        if (x3==0 && y3==0){
            this.posx = LARGURA/2 - this.larg/2
            this.posy = ALTURA - this.alt
        }
        this.contx = x3
        this.conty = y3
        this.atuliBloco()
    }
}
//\\
obstaculos = {
    _obs: [],
    cores: ["#53ed53", "#ff3636", "#4a4aff", "#ffff26"],
    tempoInsere: 0,
    pontos: 0,

    insere: function(){
        let num = Math.floor(Math.random()*4)
        let cors = this.cores[num]
        this._obs.push({
            posx: -15 + Math.floor(Math.random()*((LARGURA-20)-(-15))),
            posy: -75,
            altura: 20,//10+Math.floor(Math.random()*(30-10)),
            largura: 55,//35+Math.floor(Math.random()*(60-35)),
            cor: cors
        })
        this.tempoInsere = 35
    },

    atualiObst: function() {
        if (this.tempoInsere == 0){
            this.insere()
        } else {
            this.tempoInsere--
        }
        let tam = this._obs.length
        for (var i=0; i<tam; i++){
            let obs = this._obs[i]
            if (estadoAtual == estado.jogando){
                if (bloco.posx + bloco.larg > obs.posx && bloco.posx < obs.posx + obs.largura && bloco.posy == obs.posy + obs.altura){
                    // cima do bloco, baixo do obstáculo
                    estadoAtual = estado.perdeu
                } else if (bloco.posy + bloco.alt > obs.posy && bloco.posy < obs.posy + obs.altura && bloco.posx == obs.posx+obs.largura){
                    // esquerda do bloco, direita do obstáculo
                    estadoAtual = estado.perdeu
                } else if (bloco.posx + bloco.larg > obs.posx && bloco.posx < obs.posx + obs.largura && bloco.posy+  bloco.alt == obs.posy){ 
                    // baixo do bloco, cima do osbstáculo
                    estadoAtual = estado.perdeu
                } else if (bloco.posy + bloco.alt > obs.posy && bloco.posy < obs.posy + obs.altura && bloco.posx + bloco.larg== obs.posx){
                    // direita do bloco, esquerda do obstáculo
                    estadoAtual = estado.perdeu
                }
            }
            if (obs.posy >= (ALTURA+obs.altura)){
                this._obs.splice(i, 1)
                tam --
                i--
                if(estadoAtual == estado.jogando){
                    this.pontos++
                }
            } else{
                obs.posy += velObst
            }
        }
    },

    limpa:  function(){
        this._obs = []
    },

    desenhaObst: function(){
        let tam = this._obs.length
        for (var i=0; i<tam; i++){
            var obs = this._obs[i]
            contexto.fillStyle = obs.cor
            contexto.fillRect(obs.posx, obs.posy, obs.largura, obs.altura)
        }
        
    }
}
////////////////////////
function move(x, y){
    let x2=x, y2=y;
    if (x2==0 && y2==0 && estadoAtual == estado.play){
        estadoAtual = estado.jogando
        obstaculos._obs = []
    } else if(estadoAtual == estado.jogando){
        bloco.moveBloco(x2, y2)
    } else if(x2==0 && y2==0 && estadoAtual == estado.perdeu){
        estadoAtual = estado.play
        bloco.moveBloco(x2, y2)
    }
}

function atualiza(){
    frame++
    if (estadoAtual != estado.perdeu){
        bloco.atuliBloco()
        obstaculos.atualiObst()
    } else if(estadoAtual == estado.perdeu){
        obstaculos.limpa()
    }
}
function desenha(){
    contexto.fillStyle = '#16161d'
    contexto.fillRect(0,0,LARGURA,ALTURA)
    if (estadoAtual != estado.perdeu){
        obstaculos.desenhaObst()
        bloco.desenBloco()
    }
    
    if (estadoAtual == estado.play){
        contexto.fillStyle = 'green'
        contexto.fillRect(LARGURA/2-25, ALTURA/2-25, 50, 50)
    } else if (estadoAtual == estado.perdeu){
        contexto.fillStyle = 'red'
        contexto.fillRect(LARGURA/2-25, ALTURA/2-25, 50, 50)
    }
    
}
function roda(){
    atualiza()
    desenha()
    window.requestAnimationFrame(roda)
}
function main(){
    canvas = document.createElement('canvas')
    canvas.width = LARGURA
    canvas.height = ALTURA
    
    contexto = canvas.getContext("2d")
    
    document.body.appendChild(canvas)
    
    document.addEventListener('keypress', (event) => {
        var tecla = event.keyCode
        if (tecla==13){
            // ENTER
            move(0,0)
        } else if(tecla==97 || tecla==65){
            // ESQUERDA
            // letra A
            move(-velBloco,0)
        } else if(tecla==119 || tecla==87){
            // CIMA
            // letra W
            move(0,-velBloco)
        } else if(tecla==100 ||tecla==68){
            // DIREITA
            // letra D
            move(velBloco,0)
        } else if(tecla==115 || tecla==83){
            // BAIXO
            // letra S
            move(0,velBloco)	
        }
    })
    estadoAtual = estado.play
    roda()
    console.log('desenahdo')
}

main()