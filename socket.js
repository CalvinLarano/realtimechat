const Database = use('Database')
const db = Database.connection('mongodb')
const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const collection_name ='conversation'
const ObjectID = require('mongodb').ObjectID

io.on('connection', function (socket) {
	socket.on('chat init', function(convo){
    convo = welcome()
    io.emit('chat init', convo)})

	socket.on('chat message', function(convo){
    let _this = this
    let _id = {}
     if (convo._id === '') {
        console.log('init')
        let newCon = {
          messages: convo.messages,
          unread: true,
          created_at: Date.now()
        }
        create(newCon).then(response => {
          _id = response.insertedIds[0]
          // new conversation
        io.emit('chat message', newCon)
        })
     } else {
        let id = ObjectID(convo._id)
        console.log(id)
        db.collection(collection_name).update({_id: id}, {$set: {"messages": convo.messages}})
        .then(res => {
          // console.log(res)
        })
        io.emit('chat message', convo)
     }
    // } else {
    //   console.log('log hola')      
    // }
 	})

    socket.on('chat typing', function(data){
      io.emit('chat typing', true)
    })

  	socket.on('notify', function(data){
      io.emit('chat yay', data)
      console.log(data)
   	})

})

function init () {
	console.log('initialize')
}

function welcome () {
	return {
            _id: 'Bot',
            message: [
              {
                _id: 'Bot',
                text: 'Testttetset t estse tset set'
              }
            ]
         }
}

function create (convo) {
  let res =  db.collection(collection_name).insert(convo)
  return res
}

function update (_id, convo) {
  console.log(convo)
  let res =  db.collection(collection_name).update({_id: _id}, {$push: convo})
  return res
}

function conversation (convo) {
	let res =  db.collection(collection_name).insert(convo)
}