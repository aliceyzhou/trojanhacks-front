import './App.css';
import React, { useState } from 'react';

import { useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

const App = () => {
  const GET_CODE = 'getCode';
  const SOCKET_SERVER_URL = 'https://trojanhacks.herokuapp.com/'; //'http://localhost:4000';

  const [p1code, setp1code] = useState('hello world');
  const [p2code, setp2code] = useState('');

  console.log(p1code + p2code);

  const sendCode = (messageBody) => {
    socketRef.current.emit(GET_CODE, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  const pressSubmit1 = () => {
    setp1code('pressed 1');
    sendCode(p1code);
  };
  const getP1Code = (e) => {
    setp1code(e.target.value);
    sendCode(e.target.value);
  };
  const pressSubmit2 = () => {
    setp2code('pressed 2');
  };
  const getP2Code = (e) => {
    setp1code(e.target.value);
  };

  const socketRef = useRef();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    // Listens for incoming messages
    socketRef.current.on(GET_CODE, (data) => {
      if (socketRef.current.id != data.senderId) {
        setp2code(data.body);
      }

      //setMessages((messages) => [...messages, incomingMessage]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className='App'>
      <div className='problem'>The problem placeholder text here</div>

      <div id='left' className='container'>
        <div className='player'>
          <select>
            <option value='Python'>Python</option>
            <option value='C++'>C++</option>
          </select>

          <textarea
            className='code'
            placeholder='begin coding here...'
            onChange={getP1Code}
            // value={p2code}
          ></textarea>
          <button class='submit' onClick={pressSubmit1}>
            Submit!
          </button>

          <textarea className='output' placeholder='output'></textarea>
        </div>

        <div className='player'>
          <select>
            <option value='Python'>Python</option>
            <option value='C++'>C++</option>
          </select>
          <textarea
            className='code'
            placeholder='begin coding here...'
            onChange={getP2Code}
            value={p2code}
          ></textarea>
          <button class='submit' onClick={pressSubmit2}>
            Submit!
          </button>

          <textarea className='output' placeholder='output'></textarea>
        </div>
      </div>
    </div>
  );
};

export default App;
