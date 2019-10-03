import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { debounce } from 'lodash';
import './css/chatroom.scss';

const ChatRoom = (props) => {
  const {
    roomMatch,
    roomConnection,
    textSending,
    handleNextChatting,
    handleReconnection,
    handleTextSending,
    handleTypingStart,
    handleTypingStop
  } = props;

  useEffect(() => {
    const scrollToBottom = () => {
      if (messageEndDiv) {
        messageEndDiv.scrollIntoView();
      }
    }

    scrollToBottom();
  });

  const WAIT_INTERVAL = 800;
  const ENTER_KEY = 13;

  let messageEndDiv;
  let textInput = React.createRef();
  let stopTypingTimer = null;

  const triggerChange = () => {
    if (textInput && textInput.current) {
      handleTypingStop();
      if (stopTypingTimer) {
        clearTimeout(stopTypingTimer);
      }
    }
  };

  const debouncehandleTypingStart = debounce(() => handleTypingStart(), 100, {
    leading: true,
    trailing: false
  });

  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      if (stopTypingTimer) {
        clearTimeout(stopTypingTimer);
      }
      triggerChange();
    }
  }

  const handleChange = (e) => {
    if (stopTypingTimer) {
      clearTimeout(stopTypingTimer);
    }
    debouncehandleTypingStart();

    stopTypingTimer = setTimeout(triggerChange, WAIT_INTERVAL);
  };

  return (
    <div className="chat-container">
      {!roomConnection.isConnected && <Redirect to="/" />}
      {roomConnection.isError && <Redirect to="/error" />}

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
      {roomConnection.isPartnerUnlinked && (
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
      {!roomConnection.isPartnerUnlinked && roomMatch.isMatched && (
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
            <div
              ref={(el) => { messageEndDiv = el; }}
            >
            </div>
          </ul>
          <form
            className="chat-form"
            onSubmit={e => {
              e.preventDefault();

              handleTextSending(textInput.current.value, roomConnection.info.id);
              textInput.current.value = '';
              textInput.current.focus();
            }}
          >
            {textSending.isTyping && (
              <div className="info-type">
                <p className="info-type">
                  {roomMatch.partner.name} is typing...
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
