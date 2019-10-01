import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

const ChatRoom = (props) => {
  const {
    roomMatch,
    roomConnection,
    roomDisconnection,
    handleNextChatting
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
      {roomMatch.isMatching && (
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
            onClick={() => handleNextChatting(roomConnection.info.name)}
          >
            NEXT CHATTING
          </button>
        </div>
      )}
      {!roomDisconnection.isDisconnected && (
        <>
          <div className="text-list">
            
          </div>
          <form
            onSubmit={e => {
              setChat('');
            }}
          >
            <input
              type="text"
              className="input-basic"
              value={chat}
              onChange={e => setChat(e.target.value)}
            />
            <button
              type="submit"
              className="btn-submit"
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
