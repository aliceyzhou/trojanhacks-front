import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

import { useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

const App = () => {
  const GET_CODE = 'getCode';
  const SEND_BUG = 'sendBug';
  const SEND_BLIND = 'sendBlind';
  const SEND_FREEZE = 'sendFreeze';
  const SOCKET_SERVER_URL = 'https://trojanhacks.herokuapp.com/'; //'http://localhost:4000';

  const [p1code, setp1code] = useState('');
  const [p2code, setp2code] = useState('');
  const [p1blind, set1blind] = useState(false);
  const [p2blind, set2blind] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [blindReset, setBlindReset] = useState(0);
  const [canBlind, setCanBlind] = useState(true);
  const [freezeseconds, setFreezeSeconds] = useState(0);
  const [p1freeze, setp1freeze] = useState(false);
  const [p2freeze, setp2freeze] = useState(false);
  const [freezeReset, setFreezeReset] = useState(0);
  const [canFreeze, setCanFreeze] = useState(true);

  const sendCode = (messageBody) => {
    socketRef.current.emit(GET_CODE, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  const pressSubmit1 = () => {
    axios
      .post('https://trojanhacks.herokuapp.com/', { code: p1code })
      .then((response) => {
        console.log(response);
      });
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
  const sendBug1 = () => {
    socketRef.current.emit(SEND_BUG, {
      code: p2code,
      senderId: socketRef.current.id,
    });
  };
  const sendBlind1 = () => {
    socketRef.current.emit(SEND_BLIND, {
      senderId: socketRef.current.id,
    });
  };

  const sendFreeze1 = () => {
    console.log('freeze pressed');
    socketRef.current.emit(SEND_FREEZE, {
      senderId: socketRef.current.id,
    });
  };

  const socketRef = useRef();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    // Listens for incoming messages
    socketRef.current.on(GET_CODE, (data) => {
      if (socketRef.current.id !== data.senderId) {
        setp2code(data.body);
      }
    });

    //we need to RECEIVE bugs
    socketRef.current.on(SEND_BUG, (data) => {
      console.log('sending bug');
      if (socketRef.current.id === data.senderId) {
        setp2code(data.code);
      } else {
        setp1code(data.code);
      }
    });

    socketRef.current.on(SEND_BLIND, (data) => {
      console.log('sending blind');

      if (socketRef.current.id === data.senderId) {
        set2blind(true);
        setBlindReset(45);
      } else {
        set1blind(true);
      }
      setSeconds(10);
    });

    socketRef.current.on(SEND_FREEZE, (data) => {
      console.log('sending freeze');
      if (socketRef.current.id === data.senderId) {
        setp2freeze(true);
        setFreezeReset(150);
      } else {
        setp1freeze(true);
      }
      setFreezeSeconds(20);
    });
    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (blindReset === 0 && !canBlind) {
      setCanBlind(true);
    } else if (blindReset === 45) {
      setCanBlind(false);
    }
  }, [blindReset, canBlind]);

  useEffect(() => {
    let interval = null;
    if (p1blind) {
      if (seconds > 0) {
        interval = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
          console.log(seconds);
        }, 1000);
      } else {
        set1blind(false);
        clearInterval(interval);
      }
    }
    if (p2blind) {
      if (seconds > 0) {
        interval = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
          console.log(seconds);
        }, 1000);
      } else {
        set2blind(false);
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [seconds, p1blind, p2blind]);

  useEffect(() => {
    let interval = null;
    if (blindReset > 0) {
      interval = setInterval(() => {
        setBlindReset((blindReset) => blindReset - 1);
        console.log(blindReset);
      }, 1000);
    } else {
      setCanBlind(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [blindReset]);

  useEffect(() => {
    if (freezeReset === 0 && !canFreeze) {
      setCanFreeze(true);
    } else if (freezeReset === 150) {
      setCanFreeze(false);
    }
  }, [freezeReset, canFreeze]);

  useEffect(() => {
    let interval = null;
    if (p1freeze) {
      if (freezeseconds > 0) {
        interval = setInterval(() => {
          setFreezeSeconds((freezeseconds) => freezeseconds - 1);
          console.log(freezeseconds);
        }, 1000);
      } else {
        setp1freeze(false);
        clearInterval(interval);
      }
    }
    if (p2freeze) {
      if (freezeseconds > 0) {
        interval = setInterval(() => {
          setFreezeSeconds((freezeseconds) => freezeseconds - 1);
          console.log(freezeseconds);
        }, 1000);
      } else {
        setp2freeze(false);
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [freezeseconds, p1freeze, p2freeze]);

  useEffect(() => {
    let interval = null;
    if (freezeReset > 0) {
      interval = setInterval(() => {
        setFreezeReset((freezeReset) => freezeReset - 1);
        console.log(freezeReset);
      }, 1000);
    } else {
      setCanFreeze(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [freezeReset]);

  return (
    <div className='App'>
      <div className='problem'>The problem placeholder text here</div>

      <div id='left' className='container'>
        <div className='player'>
          <select>
            <option value='Python'>Python</option>
            <option value='C++'>C++</option>
          </select>

          <button class='feature' id='bug' onClick={sendBug1}>
            BUG
          </button>

          <button
            class='feature'
            id='blind'
            onClick={sendBlind1}
            disabled={!canBlind}
          >
            BLIND
          </button>

          <button
            class='feature'
            id='freeze'
            onClick={sendFreeze1}
            disabled={!canFreeze}
          >
            FREEZE
          </button>

          <textarea
            className='code'
            placeholder='begin coding here...'
            onChange={getP1Code}
            value={p1code}
            disabled={p1freeze}
            style={{ color: p1blind ? '#FFF' : '#000' }}
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
            disabled={p2freeze}
            style={{ color: p2blind ? '#FFF' : '#000' }}
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
