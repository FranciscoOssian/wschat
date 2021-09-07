const { useState, useEffect } = React

const socket = io( `https://wschatmeu.herokuapp.com` )

let messagesTemp = []

const App = () => {

  const [reciver, setReciver] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [myToken, setMyToken] = useState('')

  useEffect( () => {
    return () => {
      socket.removeListeners()
      socket.disconnect()
      console.log('exit')
    }
  }, [] )

  useEffect(() => {
    socket.on('connect', () => {
      console.log('your id is', socket.id)
      setMyToken(socket.id)

      socket.on('message', message => {
        messagesTemp.push(message)
        setMessages([...messagesTemp])
      })
    })
  }, [])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    const data = {
      content: message,
      author_uid_sender: socket.id,
      author_uid_to: reciver
    }
    socket.emit('message', data, response => {
        if(response.status === 'error') alert('invalid user')
      }
    )
  }

  return (
    <div>

      <h1>chat</h1>
      <h2>your token is {myToken}</h2>

      {
        messages.map( message => {
          return(
            <div>{message.content}</div>
          )
        } )
      }

      <form>

        <label
          for="token_to"
        >Token of the person</label>
        <input
          type="text"
          id="token_to"
          name="token_to"
          placeholder="token person"
          onChange={(e) => setReciver(e.target.value)}
        />

        <label
          for="message"
        >Message</label>
        <input
          type="text"
          id="message"
          name="message"
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="Submit" onClick={(e) => onSubmitHandler(e)}/>

      </form>

    </div>
  )
}


ReactDOM.render(<App />, document.querySelector('#root'));