import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { debounce } from 'lodash';

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

  const WAIT_INTERVAL = 1000;
  const ENTER_KEY = 13;

  let timer = null;

  useEffect(() => {
    return () => {
      timer = null;
    };
  });

  const triggerChange = () => {
    if (textInput.current.value.trim()) {
      handleTypingStop();
    }
    timer = null;
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      if (timer) {
        clearTimeout(timer);
      }
      triggerChange();
    }
  }

  const debouncehandleTypingStart = debounce(() => handleTypingStart(), 500, {
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
        <div>
          <p>{roomConnection.info.name}님으로 입장하셨습니다.</p>
        </div>
      )}
      {!roomMatch.isMatched && (
        <div>
          <p>상대방과 연결중입니다.</p>
        </div>
      )}
      {roomMatch.isMatched && (
        <div>
          <p>
            {roomMatch.partner.name}님과 연결되었습니다.
          </p>
        </div>
      )}
      {roomDisconnection.isDisconnected && (
        <div>
          <p>
            채팅방 연결이 종료되었습니다.
          </p>
          <button
            type="button"
            onClick={() => handleReconnection(roomConnection.info.name)}
          >
            입장
          </button>
        </div>
      )}
      {roomMatch.isMatched && !roomDisconnection.isDisconnected && (
        <>
          <div>
            <button
              type="button"
              onClick={() => handleNextChatting(roomConnection.info.name)}
            >
              다음 사람
            </button>
          </div>
          <ul className="text-list">
            {textSending.chats.length > 0 && (
              textSending.chats.map((chat, index) => {
                const isMyText = roomConnection.info.id === chat.id;

                return (
                  <li key={chat.id + index} className={isMyText ? 'me' : 'partner'}>
                    {chat.text}
                  </li>
                );
              })
            )}
          </ul>
          <form
            onSubmit={e => {
              e.preventDefault();

              handleTextSending(textInput.current.value, roomMatch.key, roomConnection.info.id);
              textInput.current.value = '';
              textInput.current.focus();
            }}
          >
            {textSending.isTyping && (
              <div>
                <p>
                  상대방이 입력중입니다...
                </p>
              </div>
            )}
            <input
              type="text"
              className="input-basic"
              ref={textInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="btn-submit"
            >
              전송
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
