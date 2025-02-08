import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import re

# .env 파일 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # 모든 도메인에 대해 CORS 허용
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))  # 환경변수에서 API 키를 가져옵니다.

if client is None:
    raise ValueError("API key is missing from environment variables")

# 정적인 Assistant ID 설정
ASSISTANT_ID = os.getenv("ASSISTANT_ID")

# 전역 변수로 스레드 ID 관리
THREAD_ID = None

@app.route('/AIChat', methods=['OPTIONS', 'POST'])
def handle_chat():
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight response"})
        
        # 요청한 Origin 값을 그대로 반영
        origin = request.headers.get('Origin')
        if origin:
            response.headers.add('Access-Control-Allow-Origin', origin)
        
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.status_code = 200  # HTTP OK 상태 코드 추가
        return response

    return submit_message()



def submit_message():
    global THREAD_ID

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    print(f"User message: {user_message}")  # 메시지 확인

    try:
        if THREAD_ID:
            # 기존 스레드가 유효한지 확인
            try:
                thread = client.beta.threads.retrieve(thread_id=THREAD_ID)
                print(f"Thread found: {thread}")
            except Exception as e:
                print(f"Error retrieving thread, creating a new one: {e}")
                THREAD_ID = create_new_thread(user_message)
        else:
            # 스레드 ID가 없으면 새 스레드 생성
            THREAD_ID = create_new_thread(user_message)

        # 기존 스레드 ID와 Assistant ID를 사용하여 실행 준비
        run = client.beta.threads.runs.create(
            thread_id=THREAD_ID,
            assistant_id=ASSISTANT_ID,
        )

        # 실행 대기
        run = wait_on_run(run)

        # 실행이 완료되면 응답을 반환합니다.
        response = get_response()

        return jsonify(response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

def create_new_thread(user_message):
    """새로운 스레드를 생성하고 첫 번째 메시지를 추가합니다."""
    try:
        new_thread = client.beta.threads.create()
        thread_id = new_thread.id
        print(f"New thread created with ID: {thread_id}")

        # 사용자 메시지를 새 스레드에 추가
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message,
        )

        return thread_id
    except Exception as e:
        raise RuntimeError(f"Failed to create new thread: {e}")

def wait_on_run(run, timeout=60):
    # 타임아웃 시간 설정 (기본값 60초)
    start_time = time.time()

    while run.status in ["queued", "in_progress"]:
        # 현재 시간과 시작 시간의 차이가 타임아웃을 초과하면 중지
        if time.time() - start_time > timeout:
            raise TimeoutError("The operation timed out waiting for the run to complete.")

        # 상태 갱신
        run = client.beta.threads.runs.retrieve(
            thread_id=THREAD_ID,
            run_id=run.id,
        )
        time.sleep(0.5)

    # 최종 상태가 "completed"나 "failed"가 아닐 경우에도 적절히 처리
    if run.status not in ["completed", "failed"]:
        raise ValueError(f"Unexpected run status: {run.status}")

    return run

def get_response():
    # 기존 스레드에서 메시지 목록을 가져옵니다.
    messages_page = client.beta.threads.messages.list(thread_id=THREAD_ID, order="asc")

    # 메시지 목록에서 필요한 데이터만 추출 (예: message content)
    messages = []

    if messages_page and hasattr(messages_page, 'data') and messages_page.data:
        for message in messages_page.data:
            content = extract_content(message.content)
            print(content)
            messages.append({"role": message.role, "content": content})

    else:
        print("No messages found in the thread.")

    return {"messages": messages}

def extract_value_from_str(content):
    #콘텐츠의 문자열 표현에서 값을 추출합니다.
    content_str = str(content)
    match = re.search(r"value='(.*?)'", content_str)
    if match:
        value = match.group(1).replace(r'\n', "\n")
        value = re.sub(r'【.*?】', '', value)
        return value
    return ""

def extract_content(content):
    print(f"Content object: {content}")  # 디버깅: 전체 객체 출력
    return extract_value_from_str(content)

if __name__ == "__main__":
    app.run(debug=True)
