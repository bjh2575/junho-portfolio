import React, { useState, useEffect, useRef } from "react";

const ChatModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "궁금한 점을 물어보세요", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null); // 메시지 끝에 스크롤을 위한 ref

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

  // OpenAI API 호출
  const fetchBotReply = async (userMessage) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/AIChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const botMessage = data.messages[data.messages.length - 1];
        return botMessage ? botMessage.content : "봇의 응답을 찾을 수 없습니다.";
      } else {
        throw new Error(data.message || "알 수 없는 오류 발생");
      }
    } catch (error) {
      setErrorMessage(error.message);
      return "봇과의 통신 중 문제가 발생했습니다.";
    }
  };

  // 메시지 보내기
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: inputValue, sender: "user" },
      ]);
      setInputValue("");
      
      // 입력 및 로딩 상태 비활성화
      setIsInputDisabled(true);
      setIsLoading(true); // 로딩 시작

      // 봇의 응답을 기다림
      const botReply =
        (await fetchBotReply(inputValue)) || "응답을 받을 수 없습니다.";

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: botReply, sender: "bot" },
      ]);
      
      // 상태 초기화
      setIsInputDisabled(false);
      setIsLoading(false); // 로딩 끝
    } else {
      setErrorMessage("※ 공백은 입력할 수 없습니다.");
      setTimeout(() => {
        setErrorMessage(""); // 0.8초 후 오류 메시지 숨기기
      }, 800);
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

  // 메시지 자동으로 최하단 위치
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    } else {
      document.removeEventListener("wheel", handleScrollLock);
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("wheel", handleScrollLock);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  // 포커스를 모달 열렸을 때 자동으로 설정
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
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
          onWheel={(e) => e.stopPropagation()}
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
                    message.sender === "bot" ? "text-left" : "text-right"
                  }`}
                >
                  <span
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.sender === "bot"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <pre style={{ fontFamily: "var(--font-inter)" }}>
                      {message.text}
                    </pre>
                  </span>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* 입력 필드 */}
            <div className="p-4 border-t flex items-center space-x-2">
              <div className="flex-1 border rounded-lg px-3 py-2 flex items-center">
                {isLoading ? (
                  <div className="loader border-t-4 border-blue-500 rounded-full w-5 h-5 animate-spin mx-auto"></div>
                ) : (
                  <input
                    type="text"
                    className="w-full outline-none"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    disabled={isInputDisabled}
                  />
                )}
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleSendMessage}
                disabled={isInputDisabled}
              >
                Send
              </button>
            </div>
            {errorMessage && (
              <div className="text-red-500 mt-2 font-semibold pl-4 pb-4">
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
