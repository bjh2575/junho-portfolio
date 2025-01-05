import React, { useState, useEffect, useRef } from "react";

const ChatModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "궁금한 점을 물어보세요", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false); 
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);  // 메시지 끝에 스크롤을 위한 ref

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // 배경 스크롤 비활성화
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ""; // 배경 스크롤 복구
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: inputValue, sender: "user" },
      ]);
      setInputValue("");
      
      // 입력 비활성화
      setIsInputDisabled(true);
      
      // 봇의 자동 응답 추가
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: "잠시만 기다려주세요.", sender: "bot" },
        ]);
        // 자동 응답 후 입력 활성화
        setIsInputDisabled(false);

      }, 1000);
    }  else {
      // 공백 입력 처리
      setErrorMessage("※ 공백은 입력할 수 없습니다.");
      setTimeout(() => {
        setErrorMessage(""); // 0.8초 후 오류 메시지 숨기기
      }, 800);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();     
    }
  };

  // 허공 클릭으로 모달 닫기
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  // 모달 내 스크롤 고정 처리
  useEffect(() => {
    const handleScrollLock = (e) => {
      if (isModalOpen) {
        e.preventDefault(); // 배경 스크롤 차단
      }
    };

    if (isModalOpen) {
      document.addEventListener("wheel", handleScrollLock, { passive: false });
      document.addEventListener("mousedown", handleOutsideClick);
      if (inputRef.current) inputRef.current.focus(); // 자동 초점 설정
    } else {
      document.removeEventListener("wheel", handleScrollLock);
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("wheel", handleScrollLock);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* 오른쪽 아래 버튼 */}
      <button
        className="fixed right-4 bottom-4 bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 z-20"
        onClick={openModal}
      >
        Open Chat
      </button>

      {/* 모달 창 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onWheel={(e) => e.stopPropagation()} // 모달 외부로 이벤트 전파 차단
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[800px] h-[700px] flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-semibold">Chat Window</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                ✖
              </button>
            </div>

            {/* 채팅 UI */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.sender === "bot"
                      ? "text-left"
                      : "text-right"
                  }`}
                >
                  <span
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.sender === "bot"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
              {/* 메시지 끝을 위한 ref */}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 필드 */}
            <div className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
                ref={inputRef} // 자동 초점 설정
                disabled={isInputDisabled} // 입력 비활성화
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleSendMessage}
                disabled={isInputDisabled} // 버튼 비활성화
              >
                Send
              </button>
            </div>
            {/* 오류 메시지 표시 */}
            {errorMessage && (
            <div className=" text-red-500 mt-2 font-semibold pl-4 pb-4">
              {errorMessage}
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
