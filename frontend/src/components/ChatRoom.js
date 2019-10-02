import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

const ChatRoom = (props) => {
  const {
    roomMatch,
    roomConnection,
    roomDisconnection,
    textSending,
    handleNextChatting,
    handleReconnection,
    handleTextSending
    // handleTextReceiving
  } = props;

  const [ chat, setChat ] = useState('');

  return (
    <div className="chat-container">
      {!roomConnection.isConnected && <Redirect to="/" />}

      {roomConnection.info && roomConnection.info.name && (
        <div>
          <p>{roomConnection.info.name}으로 입장하셨습니다.</p>
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
            다시 연결
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
              NEXT CHATTING
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

              handleTextSending(chat, roomMatch.key, roomConnection.info.id);
              setChat('');
            }}
          >
            <input
              type="text"
              className="input-basic"
              value={chat}
              onChange={e => setChat(e.target.value)}
            />
            {!!chat.trim() && (
              <button
                type="submit"
                className="btn-submit"
              >
                SEND
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
