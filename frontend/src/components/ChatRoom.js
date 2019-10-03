import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { debounce } from 'lodash';
import './css/chatroom.scss';

const ChatRoom = (props) => {
  const {
    roomMatch,
    roomConnection,
    roomDisconnection,
    textSending,
    handleNextChatting,
    handleReconnection,
    handleTextSending,
    handleTypingStart,
    handleTypingStop
  } = props;

  let textInput = React.createRef();

  const WAIT_INTERVAL = 800;
  const ENTER_KEY = 13;

  let timer = null;
  let messageEnd;

  useEffect(() => {
    scrollToBottom();
  });

  const triggerChange = () => {
    if (textInput && textInput.current) {
      if (textInput.current.value.trim()) {
        handleTypingStop();
      }
      clearTimeout(timer);
    }
  };

  const scrollToBottom = () => {
    if (messageEnd) {
      messageEnd.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      if (timer) {
        clearTimeout(timer);
      }
      triggerChange();
    }
  }

  const debouncehandleTypingStart = debounce(() => handleTypingStart(), 300, {
    leading: true,
    trailing: false
  });

  const handleChange = (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    debouncehandleTypingStart();

    timer = setTimeout(triggerChange, WAIT_INTERVAL);
  };

  return (
    <div className="chat-container">
      {!roomConnection.isConnected && <Redirect to="/" />}

      {roomConnection.info && roomConnection.info.name && (
        <div className="info-message">
          <p className="info-text">
            <strong>{roomConnection.info.name}</strong>
            님으로 입장하셨습니다.
          </p>
        </div>
      )}
      {!roomMatch.isMatched && (
        <div className="info-message">
          <p className="info-text">
            상대방과 연결중입니다.
          </p>
        </div>
      )}
      {roomMatch.isMatched && (
        <div className="info-message">
          <p className="info-text">
            <strong className="partner">{roomMatch.partner.name}</strong>
            님과 연결되었습니다.
          </p>
        </div>
      )}
      {roomDisconnection.isDisconnected && (
        <div className="info-message close-box">
          <p className="info-text">
            채팅방 연결이 종료되었습니다.
          </p>
          <button
            type="button"
            onClick={() => handleReconnection(roomConnection.info.name)}
            className="btn-chat"
          >
            RESTART
          </button>
        </div>
      )}
      {roomMatch.isMatched && !roomDisconnection.isDisconnected && (
        <>
          <div className="btn-area">
            <button
              type="button"
              onClick={() => handleNextChatting(roomConnection.info.name)}
              className="btn-chat"
            >
              NEXT
            </button>
          </div>
          <ul className="text-list">
            {textSending.chats.length > 0 && (
              textSending.chats.map((chat, index) => {
                const isMyText = roomConnection.info.id === chat.id;

                return (
                  <li key={chat.id + index} className={isMyText ? 'me' : 'partner'}>
                    <div className="nickname">
                      {isMyText ? roomConnection.info.name : roomMatch.partner.name}
                    </div>
                    <div className="chat-content">
                      {chat.text}
                    </div>
                  </li>
                );
              })
            )}
            <div style={{ float:"left", clear: "both" }}
              ref={(el) => { messageEnd = el; }}>
            </div>
          </ul>
          <form
            className="chat-form"
            onSubmit={e => {
              e.preventDefault();

              handleTextSending(textInput.current.value, roomMatch.key, roomConnection.info.id);
              textInput.current.value = '';
              textInput.current.focus();
            }}
          >
            {textSending.isTyping && (
              <div className="info-type">
                <p className="info-type">
                  상대방이 입력중입니다...
                </p>
              </div>
            )}
            <input
              type="text"
              className="input-chat"
              ref={textInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="btn-send"
            >
              SEND
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
