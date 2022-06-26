const socket = io();

getProds()
socket.on("msg", ()=>{
    getChats()
});

//schemas con normalizr
const authorSchema = new normalizr.schema.Entity('author')
const mensajeSchema = new normalizr.schema.Entity('mensaje') //, {author: authorSchema}
const mensajesSchema = new normalizr.schema.Entity('mensajes', {
    mensajes: [
        {
            author: authorSchema,
            text: [mensajeSchema]
        }
    ]
})

function getProds(){
    fetch('/api/productos')
    .then(res => res.json())
    .then(res => {
        console.log(res)
        const content = res.map((el) =>{
            return(
                    `
                    <tr>
                        <td>${el.id}</th>
                        <td>${el.nombre}</td>
                        <td>${el.precio}</td>
                        <td><img src=${el.foto} alt=${el.nombre}></td>
                    <tr>
                    `
            )
        }).join('')
        document.getElementById('prodData').innerHTML = content;
    })
    .catch(err =>{
        console.log(err)
    })
}


function getChats(){
    fetch('/api/chat')
        .then(res => res.json())
        .then(data => {
            const denormalizado = new normalizr.denormalize(data.result, mensajesSchema, data.entities)
            console.log(data)
            console.log(denormalizado)

            const normalizeData = (JSON.stringify(data)).length
            const denormalizeData = (JSON.stringify(denormalizado).length)

            console.log(`Normalizado: ${normalizeData}`)
            console.log(`Denormalizado: ${denormalizeData}`)
            console.log(`Porcentaje de compresion: ${((normalizeData / denormalizeData)*100).toFixed(2)}%`)
            document.getElementById('porcentaje').innerHTML = `Compresion: ${((normalizeData / denormalizeData)*100).toFixed(2)}%`
            const content = denormalizado.mensajes.map((chat) =>{
                return(
                    `
                        <div>
                            <strong class="text-primary">${chat.author.id}</strong>: 
                            <em class="text-success">${chat.text}</em> 
                            <span><img class="rounded-circle" src=${chat.author.avatar} style="width:40px" /></span>
                        </div>
                    `
                )
            }).join('')
            document.getElementById('chatContainer').innerHTML = content;
        })
        .catch(err =>{
            console.log(err)
        })
}

function sendMsg(){
    let objectMsg = {
        author:{ 
            id: document.getElementById('email').value, 
            nombre: document.getElementById('nombre').value, 
            apellido: document.getElementById('apellido').value, 
            edad: document.getElementById('edad').value, 
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('mensaje').value
    }
    fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(objectMsg),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(()=>{
            socket.emit("newMsg");
    });
    return false;
}

console.log('testing....')